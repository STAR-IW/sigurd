import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { Class, User } from '@prisma/client';
import { RedisService } from '../redis/redis.service';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { FilterBookingDto } from './dto/filter-booking.dto';
import { ClassCapacity } from '../class/interfaces/class_capacity';
import { WaitlistService } from '../waitlist/waitlist.service';
import { ClassFullException } from './exceptions/class-full.exception';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private readonly redisService: RedisService,
    private waitlistService: WaitlistService,
  ) {}

  async create(user: User, createBookingDto: CreateBookingDto) {
    await this.isBookingAvailable(user, createBookingDto.classId);

    //redis
    const lockKey = `booking:spot:${createBookingDto.classId}`;
    // Try to acquire lock (10 second timeout)
    const locked = await this.redisService.lock(lockKey, 10);
    if (!locked) {
      throw new ConflictException(
        'This spot is currently being booked be another user',
      );
    }
    try {
      const isClassPresent = await this.prisma.class.findUniqueOrThrow({
        where: { id: createBookingDto.classId },
      });
      return await this.executeBooking(user, isClassPresent);
    } catch (error) {
      if (error instanceof ClassFullException) {
        return await this.waitlistService.joinWaitList(user, {
          classId: createBookingDto.classId,
        });
      }
      throw error;
    } finally {
      await this.redisService.unlock(lockKey);
    }
  }
  async cancelBooking(user: User, cancelBookingDto: CancelBookingDto) {
    await this.isCancelBookingOptional(user, cancelBookingDto.classId);
    const resultOfTransaction = await this.prisma.$transaction(
      async (prisma) => {
        const updatedBooking = await prisma.booking.update({
          where: {
            id: cancelBookingDto.bookingId,
          },
          data: {
            status: 'CANCELLED',
          },
        });

        const updatedClass = await prisma.class.update({
          where: { id: cancelBookingDto.classId },
          data: {
            currentBookings: {
              decrement: 1,
            },
          },
        });
        return { updatedBooking, updatedClass };
      },
    );
    if (resultOfTransaction) {
      const promotedUser =
        await this.waitlistService.promoteFromWaitlistToBooked(
          cancelBookingDto.classId,
        );
      //add if promoted, publish capacity update + promotion event
      if (promotedUser) {
        await this.redisService.publish('class:promotions', {
          user: {
            userId: promotedUser.userId,
            classId: promotedUser.classId,
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
    try {
      //redis cache
      await this.setRedisCache(
        resultOfTransaction.updatedClass.id,
        resultOfTransaction.updatedClass.currentBookings,
        resultOfTransaction.updatedClass.capacity,
      );
      //redis pub/sub
      await this.redisService.publish('class:updates', {
        classId: cancelBookingDto.classId,
        currentBookings: resultOfTransaction.updatedClass.currentBookings,
        capacity: resultOfTransaction.updatedClass.capacity,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Redis publish error:', error);
    }

    return resultOfTransaction;
  }
  findUserBookings(user: User, filterBookingDto: FilterBookingDto) {
    return this.prisma.booking.findMany({
      where: {
        userId: user.id,
        status: filterBookingDto.status,
        class: {
          startTime: { gte: filterBookingDto.startTime },
          endTime: { lte: filterBookingDto.endTime },
        },
      },
      include: {
        class: { include: { instructor: true } },
      },
      orderBy: { bookedAt: 'desc' },
    });
  }

  // update(id: number, updateBookingDto: UpdateBookingDto) {
  //   return `This action updates a #${id} booking`;
  // }
  // findAll() {
  //   return `This action returns all booking`;
  // }

  private async isCancelBookingOptional(user: User, classId: number) {
    const chosenClass = await this.prisma.class.findUnique({
      where: { id: classId },
    });
    if (!chosenClass) {
      throw new NotFoundException(`No class with the provided ID ${classId}`);
    }
    if (new Date(chosenClass.startTime) <= new Date()) {
      throw new ForbiddenException(
        'Cannot cancel a class that has already started or passed',
      );
    }
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        userId: user.id,
        classId: classId,
        status: { not: 'CANCELLED' },
      },
    });

    if (!existingBooking) {
      throw new ConflictException('No booked class found');
    }
  }
  private async isBookingAvailable(user: User, classId: number) {
    const chosenClass = await this.prisma.class.findUnique({
      where: { id: classId },
    });
    if (!chosenClass) {
      throw new NotFoundException(`No class with the provided ID ${classId}`);
    }
    if (new Date(chosenClass.startTime) <= new Date()) {
      throw new ForbiddenException(
        'Cannot book a class that has already started or passed',
      );
    }
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        userId: user.id,
        classId: classId,
        status: { not: 'CANCELLED' },
      },
    });

    if (existingBooking) {
      throw new ConflictException('You have already booked this class');
    }
  }
  private async executeBooking(user: User, chosenClass: Class) {
    if (chosenClass && !(chosenClass.capacity > chosenClass.currentBookings)) {
      throw new ClassFullException(chosenClass.id);
    }
    const resultOfTransaction = await this.prisma.$transaction(
      async (prisma) => {
        const updatedBooking = await prisma.booking.create({
          data: {
            classId: chosenClass.id,
            status: 'BOOKED',
            userId: user.id,
          },
        });

        const updatedClass = await prisma.class.update({
          where: { id: chosenClass.id },
          data: {
            currentBookings: {
              increment: 1,
            },
          },
        });
        return { updatedBooking, updatedClass };
      },
    );
    try {
      //redis cache
      await this.setRedisCache(
        resultOfTransaction.updatedClass.id,
        resultOfTransaction.updatedClass.currentBookings,
        resultOfTransaction.updatedClass.capacity,
      );
      //redis pub/sub
      await this.redisService.publish('class:updates', {
        classId: chosenClass.id,
        currentBookings: resultOfTransaction.updatedClass.currentBookings,
        capacity: chosenClass.capacity,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Redis publish error:', error);
    }
    return resultOfTransaction;
  }

  private async setRedisCache(
    classId: number,
    currentBookings: number,
    capacity: number,
  ) {
    const classData: ClassCapacity = {
      classId: classId,
      currentBookings: currentBookings,
      capacity: capacity,
      availableSpots: capacity - currentBookings,
    };
    //redis cache
    await this.redisService.set(`class:capacity:${classId}`, classData, 60);
  }
}

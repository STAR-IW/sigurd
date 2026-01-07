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

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

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
    // return chosenClass;
  }
  private async executeBooking(user: User, chosenClass: Class) {
    if (chosenClass && !(chosenClass.capacity > chosenClass.currentBookings)) {
      throw new ConflictException('Capacity for the selected class is full');
    }
    return this.prisma.$transaction(async (prisma) => {
      const newBooking = await prisma.booking.create({
        data: {
          classId: chosenClass.id,
          status: 'BOOKED',
          userId: user.id,
        },
      });

      await prisma.class.update({
        where: { id: chosenClass.id },
        data: {
          currentBookings: {
            increment: 1,
          },
        },
      });
      return newBooking;
    });
  }

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
      const latestClass = await this.prisma.class.findUniqueOrThrow({
        where: { id: createBookingDto.classId },
      });
      return await this.executeBooking(user, latestClass);

    } finally {
      await this.redisService.unlock(lockKey);
    }
  }

  findAll() {
    return `This action returns all booking`;
  }

  findUserBookings(user: User) {
    return this.prisma.booking.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  // update(id: number, updateBookingDto: UpdateBookingDto) {
  //   return `This action updates a #${id} booking`;
  // }

  cancelBooking(id: number) {
    return this.prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }
}

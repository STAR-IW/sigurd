import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  create(user: User, createBookingDto: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        classId: createBookingDto.classId,
        status: 'BOOKED',
        userId: user.id,
      },
    });
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

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

import type { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ResponseBookingDto } from './dto/response-booking.dto';
@UseGuards(JwtGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@GetUser() user: User, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(user, createBookingDto);
  }

  // @Get()
  // findAll() {
  //   return this.bookingService.findAll();
  // }
  @Get()
  findUserBookings(@GetUser() user: User) {
    return this.bookingService.findUserBookings(user);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
  //   return this.bookingService.update(+id, updateBookingDto);
  // }

  @Delete(':id')
  cancelBooking(@Param('id') id: string) {
    return this.bookingService.cancelBooking(+id);
  }
}

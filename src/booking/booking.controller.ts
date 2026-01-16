import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

import type { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { FilterBookingDto } from './dto/filter-booking.dto';
import { RedisService } from '../redis/redis.service';
@UseGuards(JwtGuard)
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private redisService: RedisService,
  ) {}

  @Post()
  create(@GetUser() user: User, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(user, createBookingDto);
  }

  // @Get()
  // findAll() {
  //   return this.bookingService.findAll();
  // }
  @Get()
  findUserBookings(
    @Query() filterBookingDto: FilterBookingDto,
    @GetUser() user: User,
  ) {
    return this.bookingService.findUserBookings(user, filterBookingDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
  //   return this.bookingService.update(+id, updateBookingDto);
  // }

  @Delete(':id')
  cancelBooking(
    @GetUser() user: User,
    @Body()
    cancelBookingDto: CancelBookingDto,
  ) {
    return this.bookingService.cancelBooking(user, cancelBookingDto);
  }

  //FOR TESTING ONLY
  // @Post('test-publish')
  // async testPublish() {
  //   await this.redisService.publish('test-channel', { test: 'data' });
  //   return { sent: true };
  // }
  //
  // @Post('test-subscribe')
  // async testSubscribe() {
  //   await this.redisService.subscribeToChannel('test-channel');
  //   return { subscribed: true };
  // }
}

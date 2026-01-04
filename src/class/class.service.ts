import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { QueryClassDto } from './dto/query-class.dto';

@Injectable()
export class ClassService {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async create(createClassDto: CreateClassDto) {
    if (createClassDto.startTime < createClassDto.endTime) {
      throw new BadRequestException('End time must be after start time');
    }
    const gymClass = await this.prisma.class.create({
      data: {
        classType: createClassDto.classType,
        startTime: createClassDto.startTime,
        endTime: createClassDto.endTime,
        capacity: createClassDto.capacity,
        instructorId: createClassDto.instructorId,
        currentBookings: 0, // system auto calculated during booking
      },
    });
    return gymClass;
  }

  findAll(queryClassDto: QueryClassDto) {
    return this.prisma.class.findMany({
      where: {
        classType: queryClassDto.classType,
        instructorId: queryClassDto.instructorId,
        startTime: {
          gte: queryClassDto.startTime,
          lte: queryClassDto.endTime,
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.class.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return this.prisma.class.update({
      where: {
        id: id,
      },
      data: {
        classType: updateClassDto.classType,
        instructorId: updateClassDto.instructorId,
        startTime: updateClassDto.startTime,
        endTime: updateClassDto.endTime,
      },
    });
  }

  remove(id: number) {
    return this.prisma.class.delete({
      where: {
        id: id,
      },
    });
  }
}

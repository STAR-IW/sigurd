import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Reflector } from '@nestjs/core';



@Injectable()
export class ClassService {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async create(createClassDto: CreateClassDto) {
    const gymClass = await this.prisma.class.create({
      data: {
        classType: createClassDto.classType,
        startTime: createClassDto.startTime,
        endTime: createClassDto.endTime,
        capacity: createClassDto.capacity,
        instructorId: createClassDto.instructorId,
        currentBookings: createClassDto.currentBookings,
      },
    });
    return gymClass;
  }

  findAll() {
    return this.prisma.class.findMany();
  }

  async findOne(id: number) {
    return this.prisma.class.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}

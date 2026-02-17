import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstructorService {
  constructor(private prismaService: PrismaService) {}
  async create(createInstructorDto: CreateInstructorDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: createInstructorDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${createInstructorDto.userId} not found`,
      );
    }
    const existingInstructor = await this.prismaService.instructor.findUnique({
      where: { id: createInstructorDto.userId },
    });
    if (existingInstructor) {
      throw new ConflictException(
        `Instructor with id ${createInstructorDto.userId} already exists`,
      );
    }
    try {
      const instructor = await this.prismaService.instructor.create({
        data: {
          userId: createInstructorDto.userId,
          bio: createInstructorDto.bio,
          specialties: createInstructorDto.specialties,
          isActive: createInstructorDto.isActive,
        },
        include: { user: true },
      });
      return instructor;
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(error);
      }
    }
  }

  findAll() {
    return this.prismaService.instructor.findMany({
      include: { user: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const instructor = await this.prismaService.instructor.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return instructor;
  }

  async update(id: number, updateInstructorDto: UpdateInstructorDto) {
    const instructor = await this.findOne(id);
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return this.prismaService.instructor.update({
      where: { id },
      data: {
        bio: updateInstructorDto.bio,
        specialties: updateInstructorDto.specialties,
        isActive: updateInstructorDto.isActive,
      },
      include: { user: true },
    });
  }

  async remove(id: number) {
    const instructor = await this.findOne(id);
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return this.prismaService.instructor.delete({
      where: { id },
    });
  }
}

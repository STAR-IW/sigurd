import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JoinWaitlistDTO } from './dto/join-waitlist-dto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { User } from '@prisma/client';
import { WaitListResponseDto } from './dto/waitlist-response.dto';

@Injectable()
export class WaitlistService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}
  async joinWaitList(
    user: User,
    joinWaitListDto: JoinWaitlistDTO,
  ): Promise<WaitListResponseDto> {
    try {
      const classToJoin = await this.prismaService.class.findUniqueOrThrow({
        where: { id: joinWaitListDto.classId },
      });
      if (classToJoin.currentBookings < classToJoin.capacity) {
        throw new BadRequestException(
          'Class still has available spots. Please book instead.',
        );
      }

      const existingWaitlist = await this.prismaService.waitlist.findUnique({
        where: {
          userId_classId: {
            classId: joinWaitListDto.classId,
            userId: user.id,
          },
        },
      });
      if (!existingWaitlist) {
        const joinList = await this.prismaService.$transaction(
          async (prisma) => {
            const positionCount = await prisma.waitlist.count({
              where: { classId: joinWaitListDto.classId },
            });

            return prisma.waitlist.create({
              data: {
                classId: joinWaitListDto.classId,
                userId: user.id,
                position: positionCount + 1,
                joinedAt: new Date(),
              },
            });
          },
        );
        return {
          position: joinList.position,
          classId: joinList.classId,
          userId: joinList.userId,
          joinedAt: joinList.joinedAt,
          message: 'Added successfully to waitlist',
        };
      } else {
        return {
          //if user already in the waitlist, return existing data
          position: existingWaitlist.position,
          classId: existingWaitlist.classId,
          userId: existingWaitlist.userId,
          joinedAt: existingWaitlist.joinedAt,
          message: 'Already in waitlist',
        };
      }
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Class to join not found');
      }
      throw error;
    }
  }

  getUserWaitlists(user: User) {
    return `This action returns all waitlist`;
  }

  getClassWaitList(classId: number) {
    return `This action returns a `;
  }

  // update(id: number, updateWaitlistDto: UpdateWaitlistDto) {
  //   return `This action updates a #${id} waitlist`;
  // }

  leaveWaitList(user: User, waitListId : number) {
    return `This action removes a `;
  }
}

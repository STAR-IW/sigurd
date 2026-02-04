import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { JoinWaitlistDTO } from './dto/join-waitlist-dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { Role, type User } from '@prisma/client';
import { RolesGuard } from '../class/guard/roles.guard';
import { Roles } from '../class/decorator/roles.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { WaitListResponseDto } from './dto/waitlist-response.dto';
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}
  @ApiOperation({ summary: 'Join a waitlist for a gym class' })
  @ApiCreatedResponse({
    description: 'User has joined the waitlist',
    type: WaitListResponseDto,
  })
  @Post()
  joinWaitList(
    @GetUser() user: User,
    @Body() joinWaitListDto: JoinWaitlistDTO,
  ) {
    return this.waitlistService.joinWaitList(user, joinWaitListDto);
  }
  @ApiOperation({ summary: 'Get the specified user waitlists' })
  @Get()
  getUserWaitlists(@GetUser() user: User) {
    return this.waitlistService.getUserWaitlists(user);
  }
  @ApiOperation({
    summary: 'Get waitlist info for specific gym class (by gym class id)',
  })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN, Role.INSTRUCTOR])
  @Get('class/:id')
  getClassWaitList(@GetUser() user: User, @Param('id') id: string) {
    return this.waitlistService.getClassWaitList(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWaitlistDto: UpdateWaitlistDto) {
  //   return this.waitlistService.update(+id, updateWaitlistDto);
  // }
  @ApiOperation({ summary: 'Leave waitlist' })
  @Delete(':id')
  leaveWaitList(@GetUser() user: User, @Param('id') id: string) {
    return this.waitlistService.leaveWaitList(user, +id);
  }
}

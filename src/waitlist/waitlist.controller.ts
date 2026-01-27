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

@UseGuards(JwtGuard)
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  joinWaitList(
    @GetUser() user: User,
    @Body() joinWaitListDto: JoinWaitlistDTO,
  ) {
    return this.waitlistService.joinWaitList(user, joinWaitListDto);
  }

  @Get()
  getUserWaitlists(@GetUser() user: User) {
    return this.waitlistService.getUserWaitlists(user);
  }
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

  @Delete(':id')
  leaveWaitList(@GetUser() user: User, @Param('id') id: string) {
    return this.waitlistService.leaveWaitList(user, +id);
  }
}

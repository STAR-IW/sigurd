import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ClassService } from './class.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateClassDto } from './dto/create-class.dto';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload-interface';

@UseGuards(JwtGuard)
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}
  @UseGuards(RolesGuard)
  @Post()
  @Roles([Role.ADMIN, Role.INSTRUCTOR])
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get()
  findAll() {
    return this.classService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(+id);
  }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
  //   return this.classService.update(+id, updateClassDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.classService.remove(+id);
  // }
}

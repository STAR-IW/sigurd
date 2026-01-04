import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateClassDto } from './dto/create-class.dto';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateClassDto } from './dto/update-class.dto';
import { QueryClassDto } from './dto/query-class.dto';

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
  findAll(@Query() query: QueryClassDto) {
    return this.classService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Patch(':id')
  @Roles([Role.ADMIN, Role.INSTRUCTOR])
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(+id, updateClassDto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  @Roles([Role.ADMIN, Role.INSTRUCTOR])
  remove(@Param('id') id: string) {
    return this.classService.remove(+id);
  }
}

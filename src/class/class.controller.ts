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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { QueryInstructorScheduleDto } from './dto/query-instructor-schedule.dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}
  @ApiOperation({ summary: 'Create new gym Class' })
  @UseGuards(RolesGuard)
  @Post()
  @Roles([Role.ADMIN, Role.INSTRUCTOR])
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }
  @ApiOperation({ summary: 'Get multiple gym class information' })
  @Get()
  findAll(@Query() query: QueryClassDto) {
    return this.classService.findAll(query);
  }
  @ApiOperation({ summary: 'Get specific  gym Class capacity' })
  @Get(':id/capacity')
  getClassCapacity(@Param('id') id: string) {
    return this.classService.getClassCapacity(+id);
  }
  @ApiOperation({ summary: 'Get specific instructor schedule' })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN, Role.INSTRUCTOR])
  @Get('instructor/:id/schedule')
  getInstructorClassSchedule(
    @Param('id') id: string,
    @Query() queryInstructorScheduleDto: QueryInstructorScheduleDto,
  ) {
    return this.classService.getInstructorClassSchedule(
      +id,
      queryInstructorScheduleDto,
    );
  }

  @ApiOperation({ summary: 'Get info of specific gym class by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update gym class data' })
  @UseGuards(RolesGuard)
  @Patch(':id')
  @Roles([Role.ADMIN, Role.INSTRUCTOR])
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(+id, updateClassDto);
  }
  @ApiOperation({ summary: 'Delete specific gym Class' })
  @UseGuards(RolesGuard)
  @Delete(':id')
  @Roles([Role.ADMIN, Role.INSTRUCTOR])
  remove(@Param('id') id: string) {
    return this.classService.remove(+id);
  }
}

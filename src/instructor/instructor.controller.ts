import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/class/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../class/decorator/roles.decorator';

@ApiTags('instructor')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @ApiOperation({ summary: 'Create instructor profile (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Post()
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.create(createInstructorDto);
  }

  @ApiOperation({ summary: 'Get all instructors' })
  @Get()
  findAll() {
    return this.instructorService.findAll();
  }

  @ApiOperation({ summary: 'Get specific instructor by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instructorService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update instructor profile (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return this.instructorService.update(+id, updateInstructorDto);
  }

  @ApiOperation({ summary: 'Delete instructor profile (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instructorService.remove(+id);
  }
}

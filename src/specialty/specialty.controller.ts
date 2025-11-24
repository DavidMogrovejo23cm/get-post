import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';

@Controller('specialty')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) { }

  @Post()
  create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.specialtyService.create(createSpecialtyDto);
  }

  @Get()
  findAll(@Query() findWithPagination: PaginationDto) {
    return this.specialtyService.findAll(findWithPagination);
  }

  @Get(':id') 
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.specialtyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSpecialtyDto: UpdateSpecialtyDto) { 
    return this.specialtyService.update(id, updateSpecialtyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { 
    return this.specialtyService.remove(id);
  }
}
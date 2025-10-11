import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Controller('docente')
export class DocenteController {
  constructor(private readonly docenteService: DocenteService) {}

  @Post()
  create(@Body() createDocenteDto: CreateDocenteDto) {
    return this.docenteService.create(createDocenteDto);
  }

  @Get()
  findAll(@Query()findWithPagination: PaginationDto) {
    return this.docenteService.findAll(findWithPagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docenteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocenteDto: UpdateDocenteDto) {
    return this.docenteService.update(+id, updateDocenteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docenteService.remove(+id);
  }
}
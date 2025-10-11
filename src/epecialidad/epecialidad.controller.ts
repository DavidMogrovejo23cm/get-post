import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EspecialidadService } from './epecialidad.service';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { UpdateEspecialidadDto } from './dto/update-epecialidad.dto';
import { CreateEspecialidadDto } from './dto/create-epecialidad.dto';

@Controller('especialidad') // Changed controller path to 'especialidad'
export class EspecialidadController {
  constructor(private readonly especialidadService: EspecialidadService) {}

  @Post()
  create(@Body() createEspecialidadDto: CreateEspecialidadDto) {
    return this.especialidadService.create(createEspecialidadDto);
  }

  @Get()
  findAll(@Query()findWithPagination: PaginationDto) {
    return this.especialidadService.findAll(findWithPagination);
  }

  @Get(':id/id_especialidad/idcareer')
  findOne(@Param('id') id: string) {
    return this.especialidadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEspecialidadDto: UpdateEspecialidadDto) {
    return this.especialidadService.update(+id, updateEspecialidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.especialidadService.remove(+id);
  }
}
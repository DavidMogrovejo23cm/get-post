import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CicloService } from './ciclo.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Controller('ciclo')
export class CicloController {
  constructor(private readonly cicloService: CicloService) {}

  @Post()
  create(@Body() createCicloDto: CreateCicloDto) {
    return this.cicloService.create(createCicloDto);
  }

  @Get()
  findAll(@Query()findWithPagination: PaginationDto) {
    return this.cicloService.findAll(findWithPagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Assuming the Ciclo model uses `id_ciclo` as the primary key
    return this.cicloService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCicloDto: UpdateCicloDto) {
    return this.cicloService.update(+id, updateCicloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cicloService.remove(+id);
  }
}
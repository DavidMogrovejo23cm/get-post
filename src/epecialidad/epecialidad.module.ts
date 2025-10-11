import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EspecialidadController } from './epecialidad.controller';
import { EspecialidadService } from './epecialidad.service';

@Module({
  controllers: [EspecialidadController],
  providers: [EspecialidadService, PrismaService],
})
export class EspecialidadModule {} 
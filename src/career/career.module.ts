import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CareerController } from './career.controller';

@Module({
  controllers: [CareerController],
  providers: [CareerService, PrismaService],
})
export class CareerModule {}


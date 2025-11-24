import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';


@Module({
  controllers: [SpecialtyController],
  providers: [SpecialtyService, PrismaService],
})
export class SpecialtyModule {}
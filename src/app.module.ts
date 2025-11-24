import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { TeacherModule } from './teacher/teacher.module';
import { SubjectModule } from './subject/subject.module';
import { StudentModule } from './student/student.module';
import { CycleModule } from './cycle/cycle.module';
import { SpecialtyModule } from './specialty/specialty.module';
import { CareerModule } from './career/career.module';


@Module({
  imports: [
    SubjectModule,
    CycleModule,
    TeacherModule,
    StudentModule,
    SpecialtyModule,
    PrismaModule,
    CareerModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

import { MateriaModule } from './materia/materia.module';
import { CarreraModule } from './carrera/carrera.module';
import { PrismaService } from './prisma/prisma.service';
import { CicloModule } from './ciclo/ciclo.module';
import { DocenteModule } from './docente/docente.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { EspecialidadModule } from './epecialidad/epecialidad.module';

const CORE_MODULES = [PrismaModule];

@Module({
  imports: [
    MateriaModule,
    CarreraModule,
    CicloModule,
    DocenteModule,
    EstudianteModule,
    EspecialidadModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
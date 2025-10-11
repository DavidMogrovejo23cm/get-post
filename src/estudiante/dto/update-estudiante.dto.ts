import { PartialType } from '@nestjs/mapped-types';
import { CreateEstudianteDto } from './create-estudiante.dto';

export class UpdateEstudianteDto extends PartialType(CreateEstudianteDto) {
  nombre?: string;
  apellido?: string;
  email?: string;
  id_carrera?: number;
  id_ciclo?: number;
}

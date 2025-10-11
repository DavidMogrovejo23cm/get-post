import { PartialType } from '@nestjs/mapped-types';
import { CreateEspecialidadDto } from './create-epecialidad.dto';

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto) {}

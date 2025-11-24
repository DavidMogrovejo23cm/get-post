import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  first_name?: string;
  last_name?: string;
  email?: string;
  id_career?: number;
  id_cycle?: number;
}

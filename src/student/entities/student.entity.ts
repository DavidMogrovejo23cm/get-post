
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estudiantes')
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  id_carrera: number;

  @Column()
  id_ciclo: number;
}
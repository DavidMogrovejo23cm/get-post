import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto'; 
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class EstudianteService {
  
  constructor(private readonly prisma: PrismaService) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
      try {
  
        const existingEstudiante = await this.prisma.estudiante.findUnique({
          where: {
            email: createEstudianteDto.email 
          }
        });
  
        if (existingEstudiante) {
          throw new ConflictException('Estudiante ya existe con este correo electrónico.');
        }
  
        const estudianteData = await this.prisma.estudiante.create({
          data: {
            nombre: createEstudianteDto.nombre,
            apellido: createEstudianteDto.apellido,
            email: createEstudianteDto.email,
            id_carrera: createEstudianteDto.id_carrera,
            id_ciclo: createEstudianteDto.id_ciclo, 
          },
        });
  
        return estudianteData;
  
      } catch (error) {
        if (error instanceof ConflictException) {
          throw error;
        }
  
  
        throw new InternalServerErrorException('Error creando estudiante');
      }
    }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.estudiante.findMany({
          skip,
          take: limit,
          include: {
            carrera: true, 
            ciclo: true,
          }
        }),
        this.prisma.estudiante.count()
      ]);

      return {
        data,
        total,
        page,
        limit
      };

    } catch (error) {
      throw new InternalServerErrorException('Error obteniendo estudiantes');
    }
  }

  async findOne(id: number) {
    try {
      const estudiante = await this.prisma.estudiante.findUnique({
        where: { id_estudiante: id }, 
        include: {
          carrera: true, 
          ciclo: true,
        }
      });

      if (!estudiante) {
        throw new NotFoundException('Estudiante no encontrado');
      }

      return estudiante;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error obteniendo estudiante');
    }
  }
  
  update(id: number, updateEstudianteDto: UpdateEstudianteDto) { 
    return `Esta acción actualiza un estudiante con id #${id}`;
  }

  remove(id: number) {
    return `Esta acción elimina un estudiante con id #${id}`;
  }
}
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class DocenteService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly docenteIncludes = {
    especialidad: true,
    materias: true
  }

  async create(createDocenteDto: CreateDocenteDto) {
    try {
      // Find existing docente by email
      const existingDocente = await this.prisma.docente.findUnique({
        where: {
          email: createDocenteDto.email
        }
      });

      if (existingDocente) {
        throw new ConflictException('Docente ya existe');
      }

      // Create new docente
      const docente = await this.prisma.docente.create({
        data: {
          nombre: createDocenteDto.nombre,
          apellido: createDocenteDto.apellido,
          email: createDocenteDto.email,
          telefono: createDocenteDto.telefono,
          id_especialidad: createDocenteDto.id_especialidad,
        },
        include: this.docenteIncludes
      });

      return docente;

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

     

      throw new InternalServerErrorException('Error creando docente');
    }
  }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.docente.findMany({
          skip,
          take: limit,
          include: this.docenteIncludes
        }),
        this.prisma.docente.count()
      ]);

      return {
        data,
        total,
        page,
        limit
      };

    } catch (error) {
      throw new InternalServerErrorException('Error obteniendo docentes');
    }
  }

  async findOne(id: number) {
    try {
      // Assuming 'id_docente' is the primary key and we map it to 'id' for the route parameter
      const docente = await this.prisma.docente.findUnique({
        where: { id_docente: id }, 
        include: this.docenteIncludes
      });

      if (!docente) {
        throw new NotFoundException('Docente no encontrado');
      }

      return docente;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error obteniendo docente');
    }
  }

  // Placeholder for update
  update(id: number, updateDocenteDto: UpdateDocenteDto) {
    // In a real application, you would implement the update logic here.
    return `Esta acción actualiza un docente con id #${id}`;
  }

  // Placeholder for remove
  remove(id: number) {
    // In a real application, you would implement the deletion logic here.
    return `Esta acción elimina un docente con id #${id}`;
  }
}
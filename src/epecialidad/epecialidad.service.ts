import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEspecialidadDto } from './dto/create-epecialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-epecialidad.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class EspecialidadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEspecialidadDto: CreateEspecialidadDto) {
    try {

      // ✅ Cambiar findUnique por findFirst
      const existingEspecialidad = await this.prisma.especialidad.findFirst({
        where: {
          nombre: createEspecialidadDto.nombre
        }
      });

      if (existingEspecialidad) {
        throw new ConflictException('Especialidad already exists');
      }

      const especialidadData = await this.prisma.especialidad.create({
        data: {
          nombre: createEspecialidadDto.nombre,
          descripcion: createEspecialidadDto.descripcion,
        },
      });

      return especialidadData;

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Especialidad with this name already exists');
        }
      }

      throw new InternalServerErrorException('Error creating especialidad');
    }
  }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.especialidad.findMany({
          skip,
          take: limit,
          include: {
            docentes: true
          }
        }),
        this.prisma.especialidad.count()
      ]);

      return {
        data,
        total,
        page,
        limit
      };

    } catch (error) {
      throw new InternalServerErrorException('Error fetching especialidades');
    }
  }

  async findOne(id: number) {
    try {
      const especialidad = await this.prisma.especialidad.findUnique({
        where: { id_especialidad: id },
        include: {
          docentes: true
        }
      });

      if (!especialidad) {
        throw new NotFoundException(`Especialidad with ID ${id} not found`);
      }

      return especialidad;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching especialidad');
    }
  }

  update(id: number, updateEspecialidadDto: UpdateEspecialidadDto) {
    return `This action updates a #${id} especialidad`;
  }

  remove(id: number) {
    return `This action removes a #${id} especialidad`;
  }
}
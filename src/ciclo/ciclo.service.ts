import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class CicloService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly cicloIncludes = {
    materias: true,
    estudiantes: true
  }

  async create(createCicloDto: CreateCicloDto) {
    try {
      const existingCiclo = await this.prisma.ciclo.findFirst({
        where: {
          nombre: createCicloDto.nombre
        }
      });

      if (existingCiclo) {
        throw new ConflictException(`Cycle with name "${createCicloDto.nombre}" already exists`);
      }

      const ciclo = await this.prisma.ciclo.create({
        data: createCicloDto,
        include: this.cicloIncludes
      });

      return ciclo;

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException(`A cycle with the same name already exists.`);
      }

      throw new InternalServerErrorException('Error creating cycle');
    }
  }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.ciclo.findMany({
          skip,
          take: limit,
          include: this.cicloIncludes,
          orderBy: { id_ciclo: 'asc' }
        }),
        this.prisma.ciclo.count()
      ]);

      return {
        data,
        total,
        page,
        limit
      };

    } catch (error) {
      throw new InternalServerErrorException('Error fetching cycles');
    }
  }

  async findOne(id_ciclo: number) {
    try {
      const ciclo = await this.prisma.ciclo.findUnique({
        where: { id_ciclo },
        include: this.cicloIncludes
      });

      if (!ciclo) {
        throw new NotFoundException(`Cycle with ID ${id_ciclo} not found`);
      }

      return ciclo;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error fetching cycle with ID ${id_ciclo}`);
    }
  }

  async update(id_ciclo: number, updateCicloDto: UpdateCicloDto) {
    try {
      const updatedCiclo = await this.prisma.ciclo.update({
        where: { id_ciclo },
        data: updateCicloDto,
        include: this.cicloIncludes,
      });

      return updatedCiclo;

    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cycle with ID ${id_ciclo} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('The provided name for the cycle already exists');
      }

      throw new InternalServerErrorException(`Error updating cycle with ID ${id_ciclo}`);
    }
  }

  async remove(id_ciclo: number) {
    try {
      const removedCiclo = await this.prisma.ciclo.delete({
        where: { id_ciclo },
        include: this.cicloIncludes,
      });

      return {
        message: `Cycle with ID ${id_ciclo} successfully deleted`,
        removedCiclo
      };

    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cycle with ID ${id_ciclo} not found`);
      }
      if (error.code === 'P2003') {
        throw new ConflictException(`Cannot delete cycle with ID ${id_ciclo} because it has associated students or subjects.`);
      }

      throw new InternalServerErrorException(`Error deleting cycle with ID ${id_ciclo}`);
    }
  }
}
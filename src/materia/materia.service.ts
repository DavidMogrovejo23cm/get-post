import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class MateriaService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly materiaIncludes = {
    carrera: true, 
    docente: true, 
  }

  async create(createMateriaDto: CreateMateriaDto) {
    try {
      const existingMateria = await this.prisma.materia.findFirst({
        where: {
          nombre: createMateriaDto.nombre,
          id_carrera: createMateriaDto.id_carrera,
          id_ciclo: createMateriaDto.id_ciclo
        }
      });

      if (existingMateria) {
        throw new ConflictException('Materia already exists in this career and cycle');
      }

      // ✅ Crear el objeto data de forma condicional
      const dataToCreate: any = {
        nombre: createMateriaDto.nombre,
        id_carrera: createMateriaDto.id_carrera,
        id_ciclo: createMateriaDto.id_ciclo,
      };

      // Solo agregar id_docente si tiene un valor
      if (createMateriaDto.id_docente !== undefined && createMateriaDto.id_docente !== null) {
        dataToCreate.id_docente = createMateriaDto.id_docente;
      }

      const materia = await this.prisma.materia.create({
        data: dataToCreate,
        include: this.materiaIncludes
      });

      return materia;

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating materia');
    }
  }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.materia.findMany({
          skip,
          take: limit,
          include: this.materiaIncludes
        }),
        this.prisma.materia.count()
      ]);

      return {
        data,
        total,
        page,
        limit
      };

    } catch (error) {
      throw new InternalServerErrorException('Error fetching materias');
    }
  }

  async findOne(id: number) {
    try {
      const materia = await this.prisma.materia.findUnique({
        where: {
          id_materia: id
        },
        include: this.materiaIncludes
      });

      if (!materia) {
        throw new NotFoundException('Materia not found');
      }

      return materia;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching materia');
    }
  }

  update(id: number, updateMateriaDto: UpdateMateriaDto) {
    return `This action updates a #${id} materia`;
  }

  remove(id: number) {
    return `This action removes a #${id} materia`;
  }
}
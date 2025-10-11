import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class CarreraService {
  constructor(private readonly prisma:PrismaService){}

  private readonly carreraIncludes = {
    materias: true,
    estudiantes: true
  }

  async create(createCarreraDto: CreateCarreraDto) {
    try {
      // ✅ Cambiado: findUnique requiere un campo único, usa findFirst para buscar por nombre
      const existingCarrera = await this.prisma.carrera.findFirst({
        where: {
          nombre: createCarreraDto.nombre
        }
      })

      if (existingCarrera) {
        throw new ConflictException("Carrera already exists")
      }

      const carrera = await this.prisma.carrera.create({
        data: {
          nombre: createCarreraDto.nombre,
          // ✅ Cambiado: usa el nombre correcto del campo del schema (probablemente es total_ciclos o duracion_ciclos)
          // Verifica tu schema.prisma y ajusta este nombre si es necesario
          duracion: createCarreraDto.duracion
        }
      })

      return carrera;
    } catch (error) {
    if (error instanceof ConflictException) {
      throw error;
    }
    throw new InternalServerErrorException("Error creating carrera");
  }
  }

  async findAll(findWithPagination: PaginationDto) {
  const { page = 1, limit = 10 } = findWithPagination;
  const skip = (page - 1) * limit;

  try {
    const [data, total] = await Promise.all([
      this.prisma.carrera.findMany({
        skip,
        take: limit,
        include: this.carreraIncludes
      }),
      this.prisma.carrera.count()
    ]);

    return {
      data,
      total,
      page,
      limit
    };

  } catch (error) {
    throw new InternalServerErrorException('Error fetching carreras');
  }
}

  async findOne(id: number) {
    try {
      const carrera = await this.prisma.carrera.findUnique({
        where: { id_carrera: id }, 
        include: this.carreraIncludes
      });

      if (!carrera) {
        throw new NotFoundException(`Carrera with ID ${id} not found`);
      }

      return carrera;

    } catch (error) {

      if (error instanceof NotFoundException){
        throw error
      }
      throw new InternalServerErrorException('Error fetching carrera');
    
    }  
  }

  update(id: number, updateCarreraDto: UpdateCarreraDto) {
    return `This action updates a #${id} carrera`;
  }

  remove(id: number) {
    return `This action removes a #${id} carrera`;
  }
}
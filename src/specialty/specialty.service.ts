import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto'; 

@Injectable()
export class SpecialtyService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly specialtyIncludes = {
    teachers: true
  };

  async create(createSpecialtyDto: CreateSpecialtyDto) {
    try {
      const existingSpecialty = await this.prisma.specialty.findFirst({
        where: {
          name: createSpecialtyDto.name
        }
      });

      if (existingSpecialty) {
        throw new ConflictException('Specialty already exists');
      }

      const specialtyData = await this.prisma.specialty.create({
        data: {
          name: createSpecialtyDto.name,
          description: createSpecialtyDto.description,
        },
        include: this.specialtyIncludes
      });

      return specialtyData;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Specialty with this name already exists');
      }

      throw new InternalServerErrorException('Error creating specialty');
    }
  }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.specialty.findMany({
          skip,
          take: limit,
          include: this.specialtyIncludes
        }),
        this.prisma.specialty.count()
      ]);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching specialties');
    }
  }

  async findOne(id: number) {
    try {
      const specialty = await this.prisma.specialty.findUnique({
        where: { id_specialty: id }, 
        include: this.specialtyIncludes
      });

      if (!specialty) {
        throw new NotFoundException(`Specialty with ID ${id} not found`);
      }

      return specialty;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching specialty');
    }
  }

  async update(id: number, updateSpecialtyDto: UpdateSpecialtyDto) {
    try {
      const existingSpecialty = await this.prisma.specialty.findUnique({
        where: { id_specialty: id }
      });

      if (!existingSpecialty) {
        throw new NotFoundException(`Specialty with ID ${id} not found`);
      }

      if (updateSpecialtyDto.name && updateSpecialtyDto.name !== existingSpecialty.name) {
        const duplicateSpecialty = await this.prisma.specialty.findFirst({
          where: {
            name: updateSpecialtyDto.name,
            id_specialty: { not: id }
          }
        });

        if (duplicateSpecialty) {
          throw new ConflictException('The provided name for the specialty already exists');
        }
      }

      const updatedSpecialty = await this.prisma.specialty.update({
        where: { id_specialty: id },
        data: updateSpecialtyDto,
        include: this.specialtyIncludes
      });

      return updatedSpecialty;
    } catch (error) {
      
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Specialty with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('The provided name for the specialty already exists');
      }

      throw new InternalServerErrorException(`Error updating specialty with ID ${id}`);
    }
  }

  async remove(id: number) {
    try {
      const existingSpecialty = await this.prisma.specialty.findUnique({
        where: { id_specialty: id }
      });

      if (!existingSpecialty) {
        throw new NotFoundException(`Specialty with ID ${id} not found`);
      }

      const removedSpecialty = await this.prisma.specialty.delete({
        where: { id_specialty: id },
        include: this.specialtyIncludes 
      });

      return {
        message: `Specialty with ID ${id} successfully deleted`,
        removedSpecialty
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Specialty with ID ${id} not found`);
      }
      if (error.code === 'P2003') {
        throw new ConflictException(`Cannot delete specialty with ID ${id} because it has associated teachers.`);
      }

      throw new InternalServerErrorException(`Error deleting specialty with ID ${id}`);
    }
  }
}
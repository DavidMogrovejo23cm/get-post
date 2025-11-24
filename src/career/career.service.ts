import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class CareerService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly careerIncludes = {
    subjects: true,
    students: true
  }

  async create(createCareerDto: CreateCareerDto) {
    try {
      const existingCareer = await this.prisma.career.findFirst({
        where: {
          name: createCareerDto.name 
        }
      });

      if (existingCareer) {
        throw new ConflictException("Career already exists");
      }

      const career = await this.prisma.career.create({
        data: {
          name: createCareerDto.name,
          totalCycles: createCareerDto.totalCycles,
          duration: createCareerDto.duration
        }
      });

      return career;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Error creating career");
    }
  }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.career.findMany({
          skip,
          take: limit,
          include: this.careerIncludes
        }),
        this.prisma.career.count()
      ]);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching careers');
    }
  }

  async findOne(id: number) {
    try {
      const career = await this.prisma.career.findUnique({
        where: { id_career: id },
        include: this.careerIncludes
      });

      if (!career) {
        throw new NotFoundException(`Career with ID ${id} not found`);
      }

      return career;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching career');
    }
  }

  async update(id: number, updateCareerDto: UpdateCareerDto) {
    try {
      const existingCareer = await this.prisma.career.findUnique({
        where: { id_career: id }
      });

      if (!existingCareer) {
        throw new NotFoundException(`Career with ID ${id} not found`);
      }

      if (updateCareerDto.name && updateCareerDto.name !== existingCareer.name) {
        const duplicateCareer = await this.prisma.career.findFirst({
          where: {
            name: updateCareerDto.name,
            id_career: { not: id }
          }
        });

        if (duplicateCareer) {
          throw new ConflictException('The provided name for the career already exists');
        }
      }

      const updatedCareer = await this.prisma.career.update({
        where: { id_career: id },
        data: updateCareerDto,
        include: this.careerIncludes,
      });

      return updatedCareer;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Career with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('The provided name for the career already exists');
      }

      throw new InternalServerErrorException(`Error updating career with ID ${id}`);
    }
  }

  async remove(id: number) {
    try {
      const existingCareer = await this.prisma.career.findUnique({
        where: { id_career: id }
      });

      if (!existingCareer) {
        throw new NotFoundException(`Career with ID ${id} not found`);
      }

      const removedCareer = await this.prisma.career.delete({
        where: { id_career: id },
        include: this.careerIncludes,
      });

      return {
        message: `Career with ID ${id} successfully deleted`,
        removedCareer
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Career with ID ${id} not found`);
      }
      if (error.code === 'P2003') {
        throw new ConflictException(`Cannot delete career with ID ${id} because it has associated students or subjects.`);
      }

      throw new InternalServerErrorException(`Error deleting career with ID ${id}`);
    }
  }
}
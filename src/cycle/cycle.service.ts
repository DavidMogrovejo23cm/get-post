import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class CycleService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly cycleIncludes = {
    subjects: true,
    students: true
  }

  async create(createCycleDto: CreateCycleDto) {
    try {
      const existingCycle = await this.prisma.cycle.findFirst({
        where: {
          name: createCycleDto.name
        }
      });

      if (existingCycle) {
        throw new ConflictException(`Cycle with name "${createCycleDto.name}" already exists`);
      }

      const cycle = await this.prisma.cycle.create({
        data: createCycleDto,
        include: this.cycleIncludes
      });

      return cycle;

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
        this.prisma.cycle.findMany({
          skip,
          take: limit,
          include: this.cycleIncludes,
          orderBy: { id_cycle: 'asc' }
        }),
        this.prisma.cycle.count()
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

  async findOne(id_cycle: number) {
    try {
      const cycle = await this.prisma.cycle.findUnique({
        where: { id_cycle },
        include: this.cycleIncludes
      });

      if (!cycle) {
        throw new NotFoundException(`Cycle with ID ${id_cycle} not found`);
      }

      return cycle;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error fetching cycle with ID ${id_cycle}`);
    }
  }

  async update(id_cycle: number, updateCycleDto: UpdateCycleDto) {
    try {
      const updatedCycle = await this.prisma.cycle.update({
        where: { id_cycle},
        data: updateCycleDto,
        include: this.cycleIncludes,
      });

      return updatedCycle;

    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cycle with ID ${id_cycle} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('The provided name for the cycle already exists');
      }

      throw new InternalServerErrorException(`Error updating cycle with ID ${id_cycle}`);
    }
  }

  async remove(id_cycle: number) {
    try {
      const removedCycle = await this.prisma.cycle.delete({
        where: { id_cycle },
        include: this.cycleIncludes,
      });

      return {
        message: `Cycle with ID ${id_cycle} successfully deleted`,
        removedCycle
      };

    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cycle with ID ${id_cycle} not found`);
      }
      if (error.code === 'P2003') {
        throw new ConflictException(`Cannot delete cycle with ID ${id_cycle} because it has associated students or subjects.`);
      }

      throw new InternalServerErrorException(`Error deleting cycle with ID ${id_cycle}`);
    }
  }
}
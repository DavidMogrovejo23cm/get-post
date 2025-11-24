import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly subjectIncludes = {
    career: true, 
    teacher: true, 
  }

  async create(createSubjectDto: CreateSubjectDto) {
    try {
      const existingSubject = await this.prisma.subject.findFirst({
        where: {
          name: createSubjectDto.name,
          id_career: createSubjectDto.id_career,
          id_cycle: createSubjectDto.id_cycle
        }
      });

      if (existingSubject) {
        throw new ConflictException('Subject already exists in this career and cycle');
      }

      const dataToCreate: any = {
        name: createSubjectDto.name,
        id_career: createSubjectDto.id_career,
        id_cycle: createSubjectDto.id_cycle,
      };

      if (createSubjectDto.id_teacher !== undefined && createSubjectDto.id_teacher !== null) {
        dataToCreate.id_teacher = createSubjectDto.id_teacher;
      }

      const subject = await this.prisma.subject.create({
        data: dataToCreate,
        include: this.subjectIncludes
      });

      return subject;

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating subject');
    }
  }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.subject.findMany({
          skip,
          take: limit,
          include: this.subjectIncludes
        }),
        this.prisma.subject.count()
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
      const subject = await this.prisma.subject.findUnique({
        where: {
          id_subject: id
        },
        include: this.subjectIncludes
      });

      if (!subject) {
        throw new NotFoundException('Subject not found');
      }

      return subject;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching subject');
    }
  }

 async update(id: number, updateSubjectDto: UpdateSubjectDto) {
  try {
    const existingSubject = await this.prisma.subject.findUnique({
      where: { id_subject: id }
    });

    if (!existingSubject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    if (updateSubjectDto.name || updateSubjectDto.id_career || updateSubjectDto.id_cycle) {
      const nameToCheck = updateSubjectDto.name ?? existingSubject.name;
      const careerToCheck = updateSubjectDto.id_career ?? existingSubject.id_career;
      const cycleToCheck = updateSubjectDto.id_cycle ?? existingSubject.id_cycle;

      if (nameToCheck !== existingSubject.name || 
          careerToCheck !== existingSubject.id_career || 
          cycleToCheck !== existingSubject.id_cycle) {
        
        const duplicateSubject = await this.prisma.subject.findFirst({
          where: {
            name: nameToCheck,
            id_career: careerToCheck,
            id_cycle: cycleToCheck,
            id_subject: { not: id }
          }
        });

        if (duplicateSubject) {
          throw new ConflictException('A subject with this name already exists in this career and cycle');
        }
      }
    }

    const dataToUpdate: any = {};

    if (updateSubjectDto.name !== undefined) {
      dataToUpdate.name = updateSubjectDto.name;
    }
    if (updateSubjectDto.id_career !== undefined) {
      dataToUpdate.id_career = updateSubjectDto.id_career;
    }
    if (updateSubjectDto.id_cycle !== undefined) {
      dataToUpdate.id_cycle = updateSubjectDto.id_cycle;
    }
    if (updateSubjectDto.id_teacher !== undefined) {
      dataToUpdate.id_teacher = updateSubjectDto.id_teacher;
    }

    const updatedSubject = await this.prisma.subject.update({
      where: { id_subject: id },
      data: dataToUpdate,
      include: this.subjectIncludes,
    });

    return updatedSubject;
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof ConflictException) {
      throw error;
    }
    if (error.code === 'P2025') {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    if (error.code === 'P2002') {
      throw new ConflictException('A subject with this name already exists in this career and cycle');
    }
    if (error.code === 'P2003') {
      throw new NotFoundException('The specified career or teacher does not exist');
    }

    throw new InternalServerErrorException(`Error updating subject with ID ${id}`);
  }
}

async remove(id: number) {
  try {
    const existingSubject = await this.prisma.subject.findUnique({
      where: { id_subject: id }
    });

    if (!existingSubject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    const removedSubject = await this.prisma.subject.delete({
      where: { id_subject: id },
      include: this.subjectIncludes,
    });

    return {
      message: `Subject with ID ${id} successfully deleted`,
      removedSubject
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    if (error.code === 'P2025') {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    if (error.code === 'P2003') {
      throw new ConflictException(`Cannot delete subject with ID ${id} because it has associated records.`);
    }

    throw new InternalServerErrorException(`Error deleting subject with ID ${id}`);
  }
}}
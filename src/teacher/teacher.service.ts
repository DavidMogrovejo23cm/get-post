import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly teacherIncludes = {
    specialty: true,
    subjects: true
  }

  async create(createTeacherDto: CreateTeacherDto) {
    try {
      const existingTeacher = await this.prisma.teacher.findUnique({
        where: {
          email: createTeacherDto.email
        }
      });

      if (existingTeacher) {
        throw new ConflictException('Teacher already exists');
      }

      const teacher = await this.prisma.teacher.create({
        data: {
          first_name: createTeacherDto.first_name,
          last_name: createTeacherDto.last_name,
          email: createTeacherDto.email,
          phone: createTeacherDto.phone,
          id_specialty: createTeacherDto.id_specialty,
        },
        include: this.teacherIncludes
      });

      return teacher;

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

     

      throw new InternalServerErrorException('Error creating teacher');
    }
  }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.teacher.findMany({
          skip,
          take: limit,
          include: this.teacherIncludes
        }),
        this.prisma.teacher.count()
      ]);

      return {
        data,
        total,
        page,
        limit
      };

    } catch (error) {
      throw new InternalServerErrorException('Error getting teachers');
    }
  }

  async findOne(id: number) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id_teacher: id }, 
        include: this.teacherIncludes
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }

      return teacher;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting teacher');
    }
  }
async update(id: number, updateTeacherDto: UpdateTeacherDto) {
  try {
    const existingTeacher = await this.prisma.teacher.findUnique({
      where: { id_teacher: id }
    });

    if (!existingTeacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    if (updateTeacherDto.email && updateTeacherDto.email !== existingTeacher.email) {
      const duplicateTeacher = await this.prisma.teacher.findUnique({
        where: {
          email: updateTeacherDto.email
        }
      });

      if (duplicateTeacher) {
        throw new ConflictException('The provided email is already in use by another teacher');
      }
    }

    const updatedTeacher = await this.prisma.teacher.update({
      where: { id_teacher: id },
      data: updateTeacherDto,
      include: this.teacherIncludes,
    });

    return updatedTeacher;
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof ConflictException) {
      throw error;
    }
    if (error.code === 'P2025') {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    if (error.code === 'P2002') {
      throw new ConflictException('The provided email is already in use by another teacher');
    }
    if (error.code === 'P2003') {
      throw new NotFoundException('The specified specialty does not exist');
    }

    throw new InternalServerErrorException(`Error updating teacher with ID ${id}`);
  }
}

async remove(id: number) {
  try {
    const existingTeacher = await this.prisma.teacher.findUnique({
      where: { id_teacher: id }
    });

    if (!existingTeacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    const removedTeacher = await this.prisma.teacher.delete({
      where: { id_teacher: id },
      include: this.teacherIncludes,
    });

    return {
      message: `Teacher with ID ${id} successfully deleted`,
      removedTeacher
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    if (error.code === 'P2025') {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    if (error.code === 'P2003') {
      throw new ConflictException(`Cannot delete teacher with ID ${id} because it has associated subjects.`);
    }

    throw new InternalServerErrorException(`Error deleting teacher with ID ${id}`);
  }
}}
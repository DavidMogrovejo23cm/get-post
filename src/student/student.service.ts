import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto'; 
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class StudentService {
  
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
      try {
  
        const existingStudent = await this.prisma.student.findUnique({
          where: {
            email: createStudentDto.email 
          }
        });
  
        if (existingStudent) {
          throw new ConflictException('Student already exists with this email.');
        }
  
        const studentData = await this.prisma.student.create({
          data: {
            first_name: createStudentDto.first_name,
            last_name: createStudentDto.last_name,
            email: createStudentDto.email,
            id_career: createStudentDto.id_career,
            id_cycle: createStudentDto.id_cycle, 
          },
        });
  
        return studentData;
  
      } catch (error) {
        if (error instanceof ConflictException) {
          throw error;
        }
  
  
        throw new InternalServerErrorException('Error creating student');
      }
    }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.student.findMany({
          skip,
          take: limit,
          include: {
            career: true, 
            cycle: true,
          }
        }),
        this.prisma.student.count()
      ]);

      return {
        data,
        total,
        page,
        limit
      };

    } catch (error) {
      throw new InternalServerErrorException('Error getting students');
    }
  }

  async findOne(id: number) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id_student: id }, 
        include: {
          career: true, 
          cycle: true,
        }
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      return student;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting student');
    }
  }
  
  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      const updatedStudent = await this.prisma.student.update({
        where: { id_student: id },
        data: updateStudentDto,
        include: {
          career: true,
          cycle: true,
        },
      });

      return updatedStudent;

    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('The email is already in use');
      }

      throw new InternalServerErrorException(`Error updating student with ID ${id}`);
    }
  }

  async remove(id: number) {
    try {
      const removedStudent = await this.prisma.student.delete({
        where: { id_student: id },
        include: {
          career: true,
          cycle: true,
        },
      });

      return {
        message: `Student with ID ${id} successfully deleted`,
        removedStudent
      };

    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      if (error.code === 'P2003') {
        throw new ConflictException(`Cannot delete student with ID ${id} because it has associated records.`);
      }

      throw new InternalServerErrorException(`Error deleting student with ID ${id}`);
    }
  }
}
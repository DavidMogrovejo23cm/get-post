import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const teacher = await this.prisma.teacher.findUnique({
      where: { email },
    });

    const student = await this.prisma.student.findUnique({
      where: { email },
    });

    if (teacher) {
      const isPasswordValid = await bcrypt.compare(password, teacher.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      const payload = {
        sub: teacher.id_teacher,
        email: teacher.email,
        role: 'teacher',
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: teacher.id_teacher,
          email: teacher.email,
          firstName: teacher.first_name,
          lastName: teacher.last_name,
          role: 'teacher',
        },
      };
    }

    if (student) {
      const isPasswordValid = await bcrypt.compare(password, student.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      const payload = {
        sub: student.id_student,
        email: student.email,
        role: 'student',
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: student.id_student,
          email: student.email,
          firstName: student.first_name,
          lastName: student.last_name,
          role: 'student',
        },
      };
    }

    throw new UnauthorizedException('Usuario no encontrado');
  }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    const existingTeacher = await this.prisma.teacher.findUnique({
      where: { email },
    });

    const existingStudent = await this.prisma.student.findUnique({
      where: { email },
    });

    if (existingTeacher || existingStudent) {
      throw new UnauthorizedException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await this.prisma.student.create({
      data: {
        email,
        password: hashedPassword,
        first_name: firstName || '',
        last_name: lastName || '',
        id_career: 1, 
        id_cycle: 1, 
      },
    });

    const payload = {
      sub: newStudent.id_student,
      email: newStudent.email,
      role: 'student',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newStudent.id_student,
        email: newStudent.email,
        firstName: newStudent.first_name,
        lastName: newStudent.last_name,
        role: 'student',
      },
    };
  }

  async validateUser(email: string): Promise<any> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { email },
    });

    const student = await this.prisma.student.findUnique({
      where: { email },
    });

    return teacher || student;
  }

  async getCurrentUser(userId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id_teacher: userId },
      include: { specialty: true },
    });

    if (teacher) {
      return {
        id: teacher.id_teacher,
        email: teacher.email,
        firstName: teacher.first_name,
        lastName: teacher.last_name,
        role: 'teacher',
        phone: teacher.phone,
        specialty: teacher.specialty,
      };
    }

    const student = await this.prisma.student.findUnique({
      where: { id_student: userId },
      include: {
        career: true,
        cycle: true,
      },
    });

    if (student) {
      return {
        id: student.id_student,
        email: student.email,
        firstName: student.first_name,
        lastName: student.last_name,
        role: 'student',
        career: student.career,
        cycle: student.cycle,
      };
    }

    return null;
  }
}

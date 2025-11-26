import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    console.log('📚 Creando especialidades...');
    const specialty1 = await prisma.specialty.upsert({
      where: { id_specialty: 1 },
      update: {},
      create: {
        name: 'Informática',
        description: 'Especialidad en Tecnología e Informática',
      },
    });

    const specialty2 = await prisma.specialty.upsert({
      where: { id_specialty: 2 },
      update: {},
      create: {
        name: 'Administración',
        description: 'Especialidad en Administración de Empresas',
      },
    });

    console.log('🎓 Creando carreras...');
    const career1 = await prisma.career.upsert({
      where: { id_career: 1 },
      update: {},
      create: {
        name: 'Ingeniería en Sistemas',
        duration: '4 años',
        totalCycles: '8',
      },
    });

    const career2 = await prisma.career.upsert({
      where: { id_career: 2 },
      update: {},
      create: {
        name: 'Administración de Empresas',
        duration: '4 años',
        totalCycles: '8',
      },
    });

    console.log('📅 Creando ciclos...');
    const cycle1 = await prisma.cycle.upsert({
      where: { id_cycle: 1 },
      update: {},
      create: {
        name: 'Primer Ciclo',
        description: 'Primer ciclo académico',
      },
    });

    const cycle2 = await prisma.cycle.upsert({
      where: { id_cycle: 2 },
      update: {},
      create: {
        name: 'Segundo Ciclo',
        description: 'Segundo ciclo académico',
      },
    });

    console.log('👨‍🏫 Creando maestros...');
    const teacher1 = await prisma.teacher.upsert({
      where: { email: 'teacher1@example.com' },
      update: { password: hashedPassword },
      create: {
        email: 'teacher1@example.com',
        password: hashedPassword,
        first_name: 'Juan',
        last_name: 'Pérez',
        phone: '1234567890',
        id_specialty: specialty1.id_specialty,
      },
    });

    const teacher2 = await prisma.teacher.upsert({
      where: { email: 'teacher2@example.com' },
      update: { password: hashedPassword },
      create: {
        email: 'teacher2@example.com',
        password: hashedPassword,
        first_name: 'María',
        last_name: 'García',
        phone: '0987654321',
        id_specialty: specialty2.id_specialty,
      },
    });

    console.log('👨‍🎓 Creando estudiantes...');
    const student1 = await prisma.student.upsert({
      where: { email: 'student1@example.com' },
      update: { password: hashedPassword },
      create: {
        email: 'student1@example.com',
        password: hashedPassword,
        first_name: 'Carlos',
        last_name: 'López',
        id_career: career1.id_career,
        id_cycle: cycle1.id_cycle,
      },
    });

    const student2 = await prisma.student.upsert({
      where: { email: 'student2@example.com' },
      update: { password: hashedPassword },
      create: {
        email: 'student2@example.com',
        password: hashedPassword,
        first_name: 'Laura',
        last_name: 'Rodríguez',
        id_career: career2.id_career,
        id_cycle: cycle2.id_cycle,
      },
    });

    console.log('📖 Creando asignaturas...');
    await prisma.subject.upsert({
      where: { id_subject: 1 },
      update: {},
      create: {
        name: 'Programación I',
        description: 'Fundamentos de Programación',
        id_teacher: teacher1.id_teacher,
        id_career: career1.id_career,
        id_cycle: cycle1.id_cycle,
      },
    });

    await prisma.subject.upsert({
      where: { id_subject: 2 },
      update: {},
      create: {
        name: 'Administración General',
        description: 'Conceptos de Administración',
        id_teacher: teacher2.id_teacher,
        id_career: career2.id_career,
        id_cycle: cycle1.id_cycle,
      },
    });

    console.log('✅ Seed completado exitosamente!');
    console.log('\n📝 Credenciales de prueba:');
    console.log('   Maestro 1:');
    console.log('     Email: teacher1@example.com');
    console.log('     Password: password123');
    console.log('   Maestro 2:');
    console.log('     Email: teacher2@example.com');
    console.log('     Password: password123');
    console.log('   Estudiante 1:');
    console.log('     Email: student1@example.com');
    console.log('     Password: password123');
    console.log('   Estudiante 2:');
    console.log('     Email: student2@example.com');
    console.log('     Password: password123');
  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

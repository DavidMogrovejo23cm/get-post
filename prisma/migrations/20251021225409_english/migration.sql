/*
  Warnings:

  - You are about to drop the `Carrera` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ciclo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Docente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Especialidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Estudiante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Materia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Docente" DROP CONSTRAINT "Docente_id_especialidad_fkey";

-- DropForeignKey
ALTER TABLE "public"."Estudiante" DROP CONSTRAINT "Estudiante_id_carrera_fkey";

-- DropForeignKey
ALTER TABLE "public"."Estudiante" DROP CONSTRAINT "Estudiante_id_ciclo_fkey";

-- DropForeignKey
ALTER TABLE "public"."Materia" DROP CONSTRAINT "Materia_id_carrera_fkey";

-- DropForeignKey
ALTER TABLE "public"."Materia" DROP CONSTRAINT "Materia_id_ciclo_fkey";

-- DropForeignKey
ALTER TABLE "public"."Materia" DROP CONSTRAINT "Materia_id_docente_fkey";

-- DropTable
DROP TABLE "public"."Carrera";

-- DropTable
DROP TABLE "public"."Ciclo";

-- DropTable
DROP TABLE "public"."Docente";

-- DropTable
DROP TABLE "public"."Especialidad";

-- DropTable
DROP TABLE "public"."Estudiante";

-- DropTable
DROP TABLE "public"."Materia";

-- CreateTable
CREATE TABLE "Teacher" (
    "id_teacher" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "id_specialty" INTEGER NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id_teacher")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id_specialty" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id_specialty")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id_subject" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "id_teacher" INTEGER NOT NULL,
    "id_career" INTEGER NOT NULL,
    "id_cycle" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id_subject")
);

-- CreateTable
CREATE TABLE "Student" (
    "id_student" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "id_career" INTEGER NOT NULL,
    "id_cycle" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id_student")
);

-- CreateTable
CREATE TABLE "Career" (
    "id_career" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TEXT NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id_career")
);

-- CreateTable
CREATE TABLE "Cycle" (
    "id_cycle" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Cycle_pkey" PRIMARY KEY ("id_cycle")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_id_specialty_fkey" FOREIGN KEY ("id_specialty") REFERENCES "Specialty"("id_specialty") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_id_teacher_fkey" FOREIGN KEY ("id_teacher") REFERENCES "Teacher"("id_teacher") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_id_career_fkey" FOREIGN KEY ("id_career") REFERENCES "Career"("id_career") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_id_cycle_fkey" FOREIGN KEY ("id_cycle") REFERENCES "Cycle"("id_cycle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_id_career_fkey" FOREIGN KEY ("id_career") REFERENCES "Career"("id_career") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_id_cycle_fkey" FOREIGN KEY ("id_cycle") REFERENCES "Cycle"("id_cycle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Docente" (
    "id_docente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "id_especialidad" INTEGER NOT NULL,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("id_docente")
);

-- CreateTable
CREATE TABLE "Especialidad" (
    "id_especialidad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Especialidad_pkey" PRIMARY KEY ("id_especialidad")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id_materia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "id_docente" INTEGER NOT NULL,
    "id_carrera" INTEGER NOT NULL,
    "id_ciclo" INTEGER NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id_materia")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id_estudiante" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "id_carrera" INTEGER NOT NULL,
    "id_ciclo" INTEGER NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "Carrera" (
    "id_carrera" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "duracion" TEXT NOT NULL,

    CONSTRAINT "Carrera_pkey" PRIMARY KEY ("id_carrera")
);

-- CreateTable
CREATE TABLE "Ciclo" (
    "id_ciclo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Ciclo_pkey" PRIMARY KEY ("id_ciclo")
);

-- AddForeignKey
ALTER TABLE "Docente" ADD CONSTRAINT "Docente_id_especialidad_fkey" FOREIGN KEY ("id_especialidad") REFERENCES "Especialidad"("id_especialidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "Docente"("id_docente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "Carrera"("id_carrera") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_id_ciclo_fkey" FOREIGN KEY ("id_ciclo") REFERENCES "Ciclo"("id_ciclo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "Carrera"("id_carrera") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_id_ciclo_fkey" FOREIGN KEY ("id_ciclo") REFERENCES "Ciclo"("id_ciclo") ON DELETE RESTRICT ON UPDATE CASCADE;

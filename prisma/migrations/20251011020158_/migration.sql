/*
  Warnings:

  - A unique constraint covering the columns `[telefono]` on the table `Docente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Docente_telefono_key" ON "Docente"("telefono");

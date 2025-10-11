/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Docente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Docente_email_key" ON "Docente"("email");

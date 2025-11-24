/*
  Warnings:

  - Added the required column `totalCycles` to the `Career` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Career" ADD COLUMN     "totalCycles" TEXT NOT NULL;

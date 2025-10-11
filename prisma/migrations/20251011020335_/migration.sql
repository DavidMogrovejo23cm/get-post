-- DropIndex
DROP INDEX "public"."Docente_telefono_key";

-- AlterTable
ALTER TABLE "Docente" ALTER COLUMN "telefono" DROP NOT NULL;

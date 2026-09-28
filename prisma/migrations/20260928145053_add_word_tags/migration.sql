-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

/*
  Warnings:

  - Added the required column `easeFactor` to the `Revision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intervalDays` to the `Revision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastReviewDate` to the `Revision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextReviewDate` to the `Revision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repetitions` to the `Revision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Revision" ADD COLUMN     "easeFactor" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "intervalDays" INTEGER NOT NULL,
ADD COLUMN     "lastReviewDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nextReviewDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "repetitions" INTEGER NOT NULL;

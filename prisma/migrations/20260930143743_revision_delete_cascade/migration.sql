-- DropForeignKey
ALTER TABLE "Revision" DROP CONSTRAINT "Revision_wordId_fkey";

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

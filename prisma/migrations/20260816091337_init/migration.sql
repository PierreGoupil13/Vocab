-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "wordLabel" TEXT NOT NULL,
    "wordMeaning" TEXT NOT NULL,
    "wordInUse" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revision" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Revision_wordId_key" ON "Revision"("wordId");

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

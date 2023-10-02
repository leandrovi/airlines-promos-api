/*
  Warnings:

  - The primary key for the `TweetContent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contentId` on the `TweetContent` table. All the data in the column will be lost.
  - The primary key for the `TweetResult` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `resultId` on the `TweetResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `TweetContent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `TweetResult` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TweetContent" DROP CONSTRAINT "TweetContent_tweetResultId_fkey";

-- DropIndex
DROP INDEX "TweetContent_contentId_key";

-- DropIndex
DROP INDEX "TweetResult_resultId_key";

-- AlterTable
ALTER TABLE "TweetContent" DROP CONSTRAINT "TweetContent_pkey",
DROP COLUMN "contentId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tweetResultId" SET DATA TYPE TEXT;
DROP SEQUENCE "TweetContent_id_seq";

-- AlterTable
ALTER TABLE "TweetResult" DROP CONSTRAINT "TweetResult_pkey",
DROP COLUMN "resultId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "TweetResult_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "TweetContent_id_key" ON "TweetContent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TweetResult_id_key" ON "TweetResult"("id");

-- AddForeignKey
ALTER TABLE "TweetContent" ADD CONSTRAINT "TweetContent_tweetResultId_fkey" FOREIGN KEY ("tweetResultId") REFERENCES "TweetResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

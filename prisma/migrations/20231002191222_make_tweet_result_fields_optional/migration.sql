/*
  Warnings:

  - You are about to drop the column `tweetContentId` on the `TweetResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tweetResultId]` on the table `TweetContent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tweetResultId` to the `TweetContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TweetResult" DROP CONSTRAINT "TweetResult_tweetContentId_fkey";

-- AlterTable
ALTER TABLE "TweetContent" ADD COLUMN     "tweetResultId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TweetResult" DROP COLUMN "tweetContentId",
ALTER COLUMN "publishedDate" DROP NOT NULL,
ALTER COLUMN "author" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TweetContent_tweetResultId_key" ON "TweetContent"("tweetResultId");

-- AddForeignKey
ALTER TABLE "TweetContent" ADD CONSTRAINT "TweetContent_tweetResultId_fkey" FOREIGN KEY ("tweetResultId") REFERENCES "TweetResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

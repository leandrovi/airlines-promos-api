-- CreateTable
CREATE TABLE "TweetResult" (
    "id" SERIAL NOT NULL,
    "resultId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publishedDate" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "score" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tweetContentId" INTEGER NOT NULL,

    CONSTRAINT "TweetResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TweetContent" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "contentId" TEXT NOT NULL,
    "extract" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TweetContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TweetResult_resultId_key" ON "TweetResult"("resultId");

-- CreateIndex
CREATE UNIQUE INDEX "TweetContent_contentId_key" ON "TweetContent"("contentId");

-- AddForeignKey
ALTER TABLE "TweetResult" ADD CONSTRAINT "TweetResult_tweetContentId_fkey" FOREIGN KEY ("tweetContentId") REFERENCES "TweetContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

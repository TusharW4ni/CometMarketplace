-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "stars" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRatingMapping" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ratingId" INTEGER NOT NULL,

    CONSTRAINT "UserRatingMapping_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRatingMapping" ADD CONSTRAINT "UserRatingMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRatingMapping" ADD CONSTRAINT "UserRatingMapping_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

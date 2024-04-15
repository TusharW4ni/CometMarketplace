-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "userReportingId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userReportingId_fkey" FOREIGN KEY ("userReportingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


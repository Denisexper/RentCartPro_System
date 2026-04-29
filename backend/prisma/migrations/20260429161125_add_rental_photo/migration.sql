-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('Checkout', 'Return');

-- CreateTable
CREATE TABLE "RentalPhoto" (
    "id" TEXT NOT NULL,
    "rentalId" TEXT NOT NULL,
    "type" "PhotoType" NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RentalPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RentalPhoto" ADD CONSTRAINT "RentalPhoto_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

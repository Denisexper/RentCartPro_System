-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('Basic', 'Pro', 'Enterprise');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SuperAdmin', 'Admin', 'Operator', 'Auditor');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Economy', 'Compact', 'Sedan', 'SUV', 'Pickup', 'Van', 'Luxury');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('Available', 'Rented', 'Maintenance', 'Inactive');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('Gasoline', 'Diesel', 'Electric', 'Hybrid');

-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('Automatic', 'Manual');

-- CreateEnum
CREATE TYPE "FuelLevel" AS ENUM ('Full', 'ThreeQuarters', 'Half', 'Quarter', 'Empty');

-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('DUI', 'Passport', 'NIT', 'Other');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('Reserved', 'Active', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Cash', 'Card', 'Transfer', 'Check');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Payment', 'Deposit', 'Refund', 'Extra');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'Basic',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Operator',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "color" TEXT NOT NULL,
    "dailyRate" DECIMAL(10,2) NOT NULL,
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "fuelType" "FuelType" NOT NULL DEFAULT 'Gasoline',
    "transmission" "Transmission" NOT NULL DEFAULT 'Automatic',
    "seats" INTEGER NOT NULL DEFAULT 5,
    "status" "VehicleStatus" NOT NULL DEFAULT 'Available',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "idType" "IdType" NOT NULL DEFAULT 'DUI',
    "idNumber" TEXT NOT NULL,
    "address" TEXT,
    "licenseNum" TEXT,
    "licenseExp" TIMESTAMP(3),
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "actualReturn" TIMESTAMP(3),
    "dailyRate" DECIMAL(10,2) NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "extraCharges" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "deposit" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "mileageStart" INTEGER NOT NULL DEFAULT 0,
    "mileageEnd" INTEGER,
    "fuelOut" "FuelLevel" NOT NULL DEFAULT 'Full',
    "fuelIn" "FuelLevel",
    "status" "RentalStatus" NOT NULL DEFAULT 'Active',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "rentalId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "type" "PaymentType" NOT NULL DEFAULT 'Payment',
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_tenantId_plate_key" ON "Vehicle"("tenantId", "plate");

-- CreateIndex
CREATE UNIQUE INDEX "Client_tenantId_idNumber_key" ON "Client"("tenantId", "idNumber");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

import { FuelLevel, Rental } from "@prisma/client";

// Sobreescribe los campos Decimal a number para facilitar el manejo en controllers
export type CreateRentalInput = Omit<
  Rental,
  "id" | "createdAt" | "updatedAt" | "dailyRate" | "subtotal" | "discount" | "extraCharges" | "totalAmount" | "deposit"
> & {
  dailyRate: number;
  subtotal: number;
  discount: number;
  extraCharges: number;
  totalAmount: number;
  deposit: number;
  depositMethod?: "Cash" | "Card" | "Transfer" | "Check";
};

export type UpdateRentalInput = Partial<CreateRentalInput>;

// Lo que el cliente manda en el body al crear un alquiler
export type CreateRentalBody = {
  vehicleId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  deposit?: number;
  depositMethod?: "Cash" | "Card" | "Transfer" | "Check";
  discount?: number;
  fuelOut?: FuelLevel;
  mileageStart?: number;
  notes?: string;
};

// Lo que el cliente manda al devolver el vehículo
export type ReturnRentalInput = {
  actualReturn?: Date;
  mileageEnd?: number;
  fuelIn?: FuelLevel;
  extraCharges?: number;
  notes?: string;
};

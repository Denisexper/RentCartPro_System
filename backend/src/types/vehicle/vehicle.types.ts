import { Vehicle } from "@prisma/client";

export type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'> & {
    mileage?: number;
    fuelType?: ['FuelType'];
    transmission?: ['Transmission'];
    seats?: number;
    status?: ['VehicleStatus'];
}

export type UpdateVehicleInput = Partial<CreateVehicleInput>
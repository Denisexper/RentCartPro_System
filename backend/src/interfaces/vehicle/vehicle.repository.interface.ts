import { Vehicle } from "@prisma/client";
import type { CreateVehicleInput, UpdateVehicleInput } from "../../types/vehicle/vehicle.types";

export interface VehicleRepositoryInterface {

    getById(id: string): Promise<Vehicle | null>
    getAll(): Promise<Vehicle[]>
    create(data: CreateVehicleInput): Promise<Vehicle>
    update(id: string, data: UpdateVehicleInput): Promise<Vehicle>
    delete(id: string): Promise<Vehicle>
}
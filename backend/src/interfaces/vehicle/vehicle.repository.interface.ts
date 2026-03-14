import { Vehicle } from "@prisma/client";
import type { CreateVehicleInput, UpdateVehicleInput } from "../../types/vehicle/vehicle.types";

export interface VehicleRepositoryInterface {

    getById(id: string): Promise<Vehicle>
    getAll(): Promise<Vehicle[]>
    create(data: CreateVehicleInput): Promise<Vehicle>
    update(id: string, data: UpdateVehicleInput): Promise<Vehicle>
    delete(id: string): Promise<Vehicle>
}
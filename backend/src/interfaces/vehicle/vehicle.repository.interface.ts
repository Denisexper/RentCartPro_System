import { Vehicle } from "@prisma/client";
import type { CreateVehicleInput, UpdateVehicleInput } from "../../types/vehicle/vehicle.types";

export interface VehicleRepositoryInterface {

    getById(id: string): Promise<Vehicle | null>
    // Busca TODOS los vehículos que pertenecen a una EMPRESA específica
    getAll(tenantId?: string): Promise<Vehicle[]>
    create(data: CreateVehicleInput): Promise<Vehicle>
    update(id: string, data: UpdateVehicleInput): Promise<Vehicle>
    delete(id: string): Promise<Vehicle>
}
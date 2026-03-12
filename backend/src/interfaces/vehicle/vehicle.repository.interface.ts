import { Vehicle } from "@prisma/client";

export interface VehicleRepositoryInterface {

    getById(id: string): Promise<Vehicle>
    getAll(): Promise<Vehicle[]>
    create(data: Partial<Vehicle>): Promise<Vehicle>
    update(id: string, data: Partial<Vehicle>): Promise<Vehicle>
    delete(id: string): Promise<Vehicle>
}
import { Rental } from "@prisma/client";
import type { CreateRentalInput, UpdateRentalInput } from "../../types/rental/rental.types";

export interface RentalRepositoryInterface {

    getById(id: string): Promise<Rental | null>
    getAll(): Promise<Rental[]>
    create(data: CreateRentalInput): Promise<Rental>
    update(id: string, data: UpdateRentalInput): Promise<Rental>
    delete(id: string): Promise<Rental>
}
import { Rental } from "@prisma/client"

//omitir campos automaticos en la creacion
export type CreateRentalInput = Omit<Rental, 'id' | 'createdAt' | 'updatedAt'> & {
    discount?: Rental['discount'];
    extraCharges?: Rental['extraCharges'];
    deposit?: Rental['deposit'];
    fueltOut?: Rental['fuelOut'];
    status?: Rental['status']
}

//para update solo usa partial de los campos editables
export type UpdateRentalInput = Partial<CreateRentalInput>

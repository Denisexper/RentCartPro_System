import { Rental } from "@prisma/client"

//omitir campos automaticos en la creacion
export type CreateRentalInput = Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>

//para update solo usa partial de los campos editables
export type UpdateRentalInput = Partial<CreateRentalInput>

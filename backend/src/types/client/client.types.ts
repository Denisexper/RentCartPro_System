import { Client } from "@prisma/client";

export type CreateClientInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & {
    idType?: Client['idType'];
    blacklisted?: boolean;

}

export type UpdateClientInput = Partial<CreateClientInput>
import { Client } from "@prisma/client";
import { CreateClientInput, UpdateClientInput } from "../../types/client/client.types";

export interface ClientRepositoryInterface {

    getById(id: string): Promise<Client | null>
    getAll(): Promise<Client[]>
    create(data: CreateClientInput): Promise<Client>
    update(id: string, data: UpdateClientInput): Promise<Client>
    delete(id: string): Promise<Client>
}
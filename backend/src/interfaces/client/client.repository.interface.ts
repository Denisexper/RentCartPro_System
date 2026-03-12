import { Client } from "@prisma/client";

export interface ClientRepositoryInterface {

    getById(id: string): Promise<Client>
    getAll(): Promise<Client[]>
    create(data: Partial<Client>): Promise<Client>
    update(id: string, data: Partial<Client>): Promise<Client>
    delete(id: string): Promise<Client>
}
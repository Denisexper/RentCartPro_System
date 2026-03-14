import { Client, PrismaClient } from "@prisma/client";
import { ClientRepositoryInterface } from "../../interfaces/client/client.repository.interface";
import { CreateClientInput, UpdateClientInput } from "../../types/client/client.types";

export class ClientRepository implements ClientRepositoryInterface {

    private prisma : PrismaClient

    constructor (prisma : PrismaClient){

        this.prisma = prisma
    }
    async getById(id: string): Promise<Client | null> {
        try {
            
            const response = await this.prisma.client.findUnique({
                where: { id }
            })

            return response

        } catch (error) {
            throw new Error (`${error}`)
        }
    }
    async getAll(): Promise<Client[]> {
        try {
            
            const response = await this.prisma.client.findMany()

            return response

        } catch (error) {
            throw new Error (`${error}`)
        }
    }
    async create(data: CreateClientInput): Promise<Client> {
        try {
            
            const response = await this.prisma.client.create({
                data: data
            })
             
            return response

        } catch (error) {
            throw new Error (`${error}`)
        }
    }
    async update(id: string, data: UpdateClientInput): Promise<Client> {
        try {
            
            const response = await this.prisma.client.update({
                where: { id },
                data: data
            });

            return response

        } catch (error) {
            throw new Error (`${error}`)
        }
    }
    async delete(id: string): Promise<Client> {
        try {
            
            const response = await this.prisma.client.delete({
                where: { id }
            })

            return response
            
        } catch (error) {
            throw new Error (`${error}`)
        }
    }
}
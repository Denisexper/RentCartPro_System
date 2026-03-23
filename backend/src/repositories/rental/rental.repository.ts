import { Rental, PrismaClient } from "@prisma/client";
import { RentalRepositoryInterface } from "../../interfaces/rental/rental.repository.interface";
import { CreateRentalInput, UpdateRentalInput } from "../../types/rental/rental.types";

export class RentalRepository implements RentalRepositoryInterface {

    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        
        this.prisma = prisma;
    }

    async getById(id: string): Promise<Rental | null> {
        try {
            const response = await this.prisma.rental.findUnique({
                where: { id }
            });
            return response;
        } catch (error) {

            throw new Error (`${error}`)
        }
    }

    async getAll(): Promise<Rental[]> {
        try {
            const response = await this.prisma.rental.findMany();
            
            return response;
        } catch (error) {

            throw new Error (`${error}`)
        }
    }

    async create(data: CreateRentalInput): Promise<Rental> {
        try {
            const response = await this.prisma.rental.create({
                data: data
            });
            return response;
        } catch (error) {
            throw new Error (`${error}`)
        }
    }

    async update(id: string, data: UpdateRentalInput): Promise<Rental> {
        try {
            const response = await this.prisma.rental.update({
                where: { id },
                data: data
            });
            return response;
        } catch (error) {
            throw new Error (`${error}`)
        }
    }

    async delete(id: string): Promise<Rental> {
        try {
            const response = await this.prisma.rental.delete({
                where: { id }
            });
            return response;
        } catch (error) {
            throw new Error (`${error}`)
        }
    }
}
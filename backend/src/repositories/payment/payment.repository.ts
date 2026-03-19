import { Payment, PrismaClient } from "@prisma/client";
import { PaymentRepositoryInterface } from "../../interfaces/payment/payment.repository.interface";
import { CreatePaymentInput, UpdatePaymentInput } from "../../types/payment/payment.types";


export class PaymentRepository implements PaymentRepositoryInterface {

    private prisma : PrismaClient

    constructor (
        prisma: PrismaClient
    ){
        this.prisma = prisma
    }

    async getById(id: string): Promise<Payment | null>{
        try {
            
            const response = await this.prisma.payment.findUnique({
                where: { id }
            })

            return response

        } catch (error) {
            
            throw new Error(`${error}`)
        }
    }
    async getAll(): Promise<Payment[]> {

        try {
            
            const response = await this.prisma.payment.findMany()

            return response

        } catch (error) {
            
            throw new Error(`${error}`)
        }
    }
    async create(data: CreatePaymentInput): Promise<Payment> {

        try {
            
            const response = await this.prisma.payment.create({
                data: data
            })

            return response

        } catch (error) {
            
            throw new Error(`${error}`)
        }
    }
    async update(id: string, data: UpdatePaymentInput): Promise<Payment> {

        try {
        
            const response = await this.prisma.payment.update({
                where: { id },
                data: data
            })

            return response

        } catch (error) {
            
            throw new Error(`${error}`)
        }
    }
    async delete(id: string): Promise<Payment> {

        try {
            
            const response = await this.prisma.payment.delete({
                where: { id }
            })

            return response
        } catch (error) {
            
            throw new Error(`${error}`)
        }
    }

}
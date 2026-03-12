import { Payment } from "@prisma/client";

export interface PaymentRepositoryInterface {

    getById(id: string): Promise<Payment>
    getAll(): Promise<Payment[]>
    create(data: Partial<Payment>): Promise<Payment>
    update(id: string, data: Partial<Payment>): Promise<Payment>
    delete(id: string): Promise<Payment>
}
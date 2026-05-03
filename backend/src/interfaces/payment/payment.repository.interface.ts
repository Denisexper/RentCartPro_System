import { Payment } from "@prisma/client";
import { CreatePaymentInput } from "../../types/payment/payment.types";

export interface PaymentRepositoryInterface {

    getById(id: string): Promise<Payment | null>
    getAll(tenantId?: string): Promise<Payment[]>
    create(data: CreatePaymentInput): Promise<Payment>
    delete(id: string): Promise<Payment>
}
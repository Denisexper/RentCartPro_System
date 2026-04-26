import { Payment } from "@prisma/client";
import { CreatePaymentInput, UpdatePaymentInput } from "../../types/payment/payment.types";

export interface PaymentRepositoryInterface {

    getById(id: string): Promise<Payment | null>
    getAll(tenantId: string): Promise<Payment[]>
    create(data: CreatePaymentInput): Promise<Payment>
    update(id: string, data: UpdatePaymentInput): Promise<Payment>
    delete(id: string): Promise<Payment>
}
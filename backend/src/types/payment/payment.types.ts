import { Payment } from "@prisma/client";

export type CreatePaymentInput = Omit<Payment, 'id' | 'createdAt'> & {
    type?: Payment['type']
}


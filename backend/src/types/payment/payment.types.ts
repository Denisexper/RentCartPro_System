import { Payment } from "@prisma/client";

export type CreatePaymentInput = Omit<Payment, 'id' | 'createdAt'> & {
    type?: Payment['type']
}

export interface PaymentSummary {
    rentalId: string
    totalAcordado: number
    totalPagado: number
    saldoPendiente: number
    totalCobrosExtra: number
    totalDevuelto: number
    totalFinal: number
    pagos: Payment[]
}

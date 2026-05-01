import { z } from "zod";

export const createPaymentSchema = z.object({
  rentalId: z.string().min(1, "rentalId is required"),
  amount: z.number({ error: "amount must be a number" }).positive("Amount must be greater than 0"),
  method: z.enum(["Cash", "Card", "Transfer", "Check"]),
  type: z.enum(["Payment", "Deposit", "Refund", "Extra"]).optional(),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});


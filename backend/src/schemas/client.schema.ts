import { z } from "zod";

export const createClientSchema = z.object({
  tenantId: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  idNumber: z.string().min(1, "ID number is required"),
  email: z.string().email("Invalid email format").optional().nullable(),
  idType: z.enum(["DUI", "Passport", "NIT", "Other"]).optional(),
  address: z.string().optional().nullable(),
  licenseNum: z.string().optional().nullable(),
  licenseExp: z.string().datetime({ message: "Invalid date format" }).optional().nullable(),
  blacklisted: z.boolean().optional(),
  notes: z.string().optional().nullable(),
});

export const updateClientSchema = createClientSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "No data provided for update",
  });

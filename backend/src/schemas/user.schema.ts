import { z } from "zod";

export const createUserSchema = z.object({
  tenantId: z.string().min(1, "tenantId is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SuperAdmin", "Admin", "Operator", "Auditor"]).optional(),
  active: z.boolean().optional(),
});

export const updateUserSchema = createUserSchema
  .partial()
  .extend({ customRoleId: z.string().nullable().optional() })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No data provided for update",
  });

import { z } from "zod";

export const createCustomRoleSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(50),
  description: z.string().max(200).optional(),
});

export const updateCustomRoleSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
  active: z.boolean().optional(),
});

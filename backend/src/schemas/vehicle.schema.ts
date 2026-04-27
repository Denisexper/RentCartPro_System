import { z } from "zod";

export const createVehicleSchema = z.object({
  tenantId: z.string().min(1, "tenantId is required"),
  plate: z.string().min(1, "Plate is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number({ error: "Year must be a number" })
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 2, "Year is too far in the future"),
  category: z.enum(["Economy", "Compact", "Sedan", "SUV", "Pickup", "Van", "Luxury"]),
  color: z.string().min(1, "Color is required"),
  dailyRate: z
    .number({ error: "dailyRate must be a number" })
    .positive("Daily rate must be greater than 0"),
  mileage: z.number().int().min(0).optional(),
  fuelType: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid"]).optional(),
  transmission: z.enum(["Automatic", "Manual"]).optional(),
  seats: z.number().int().min(1).optional(),
  status: z.enum(["Available", "Rented", "Maintenance", "Inactive"]).optional(),
  notes: z.string().optional().nullable(),
});

export const updateVehicleSchema = createVehicleSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "No data provided for update",
  });

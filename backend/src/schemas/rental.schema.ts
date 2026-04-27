import { z } from "zod";

export const createRentalSchema = z
  .object({
    vehicleId: z.string().min(1, "vehicleId is required"),
    clientId: z.string().min(1, "clientId is required"),
    startDate: z.string().min(1, "startDate is required"),
    endDate: z.string().min(1, "endDate is required"),
    deposit: z.number().min(0).optional(),
    discount: z.number().min(0).optional(),
    fuelOut: z.enum(["Full", "ThreeQuarters", "Half", "Quarter", "Empty"]).optional(),
    mileageStart: z.number().int().min(0).optional(),
    notes: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return !isNaN(start.getTime()) && !isNaN(end.getTime());
    },
    { message: "Invalid date format", path: ["startDate"] },
  )
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

export const updateRentalSchema = z
  .object({
    status: z.enum(["Reserved", "Active", "Completed", "Cancelled"]).optional(),
    actualReturn: z.string().optional().nullable(),
    mileageEnd: z.number().int().min(0).optional().nullable(),
    fuelIn: z.enum(["Full", "ThreeQuarters", "Half", "Quarter", "Empty"]).optional().nullable(),
    extraCharges: z.number().min(0).optional(),
    notes: z.string().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No data provided for update",
  });

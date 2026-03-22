import { Request, Response } from "express";
import { RentalRepositoryInterface } from "../../interfaces/rental/rental.repository.interface";
import {
  CreateRentalInput,
  UpdateRentalInput,
} from "../../types/rental/rental.types";

export class RentalControllerService {
  // Inyectamos la INTERFAZ, no la clase concreta
  constructor(private readonly repository: RentalRepositoryInterface) {}

  async getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      const response = await this.repository.getById(id);

      if (!response) {
        return res.status(404).json({ msj: "Rental not found" });
      }

      return res.status(200).json({
        msj: "Rental retrieved successfully",
        data: response,
      });
    } catch (error: any) {
      console.error(`[RentalController] Error en getById(${id}):`, error);
      return res
        .status(500)
        .json({ msj: "Server error", error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const data: CreateRentalInput = req.body;

    // Validación básica de campos obligatorios para un alquiler
    if (!data.vehicleId || !data.clientId || !data.startDate) {
      return res
        .status(400)
        .json({ msj: "Missing required fields (vehicleId, clientId, startDate)" });
    }

    try {
      const response = await this.repository.create(data);
      return res.status(201).json({
        msj: "Rental created successfully",
        data: response,
      });
    } catch (error: any) {
      console.error("[RentalController] Error en create():", error);
      return res
        .status(500)
        .json({ msj: "Server error", error: error.message });
    }
  }

  async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const data: UpdateRentalInput = req.body;

    try {
      const rentalExist = await this.repository.getById(id);
      if (!rentalExist) {
        return res.status(404).json({ msj: "Rental not found" });
      }

      const response = await this.repository.update(id, data);
      return res.status(200).json({
        msj: "Rental updated successfully",
        data: response,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ msj: "Rental not found" });
      }
      console.error(`[RentalController] Error en update(${id}):`, error);
      return res
        .status(500)
        .json({ msj: "Server error", error: error.message });
    }
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      const rentalExist = await this.repository.getById(id);
      if (!rentalExist) {
        return res.status(404).json({ msj: "Rental not found" });
      }

      await this.repository.delete(id);
      return res.status(200).json({ msj: "Rental deleted successfully" });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ msj: "Rental not found" });
      }
      console.error(`[RentalController] Error en delete(${id}):`, error);
      return res
        .status(500)
        .json({ msj: "Server error", error: error.message });
    }
  }
}

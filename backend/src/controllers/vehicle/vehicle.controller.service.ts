import { Request, Response } from "express";
import { VehicleRepositoryInterface } from "../../interfaces/vehicle/vehicle.repository.interface";
import {
  CreateVehicleInput,
  UpdateVehicleInput,
} from "../../types/vehicle/vehicle.types";

export class VehicleControllerService {
  private repository: VehicleRepositoryInterface;

  constructor(repository: VehicleRepositoryInterface) {
    this.repository = repository;
  }

  async getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    try {
      const response = await this.repository.getById(id);

      if (!response) {
        return res.status(404).json({
          msj: "Vehicle not found",
        });
      }

      return res.status(200).json({
        msj: "Vehicle retrived successfully",
        data: {
          id: response.id,
          tenantId: response.tenantId,
          plate: response.plate,
          brand: response.brand,
          model: response.model,
          year: response.year,
          category: response.category,
          color: response.color,
        },
      });
    } catch (error: any) {
      console.error(`[VehicleController] Error in getById(${id})`, error);

      //validamos por si cambia en un pequeno lapso es objeto(prisma error code)
      if (error.code === "P2025") {
        return res.status(404).json({
          msj: "Vehicle not found2",
        });
      }

      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }

  async getAll(req: Request<{}, {}, {}, { tenantId: string }>, res: Response) {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        msj: "tenantId is required to fetch vehicles",
      });
    }

    try {
      const response = await this.repository.getAll(tenantId);

      const cleanData = response.map((vehicle) => ({
        id: vehicle.id,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        category: vehicle.category,
        color: vehicle.color,
      }));

      return res.status(200).json({
        msj:
          cleanData.length > 0
            ? "Vehicle list retrived successfully"
            : "Vehicle list empty",
        data: cleanData,
        total: cleanData.length,
      });
    } catch (error: any) {
      console.error(`[VehicleController] Error en getAll()`, error);

      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }

  async create(req: Request, res: Response) {
    const data: CreateVehicleInput = req.body;

    if (
      !data.tenantId ||
      !data.plate ||
      !data.brand ||
      !data.model ||
      data.year === undefined ||
      !data.category ||
      !data.category ||
      data.dailyRate === undefined
    ) {

      return res.status(400).json({
        msj: "Missing requireds fields",
        fields: {
          tenantId: !data.tenantId ? "Required" : "OK",
          plate: !data.plate ? "Required" : "OK",
          brand: !data.brand ? "Required" : "OK",
          model: !data.model ? "Required" : "OK",
          year: data.year === undefined ? "Required" : "OK",
          category: !data.category ? "Required" : "OK",
          dailyRate: data.dailyRate === undefined ? "Required" : "OK",
        },
      });
    }

    // Validamos la lógica de los valores (Negocio)
    //convertimos dailyRate a number porque es decimal y un decimal no podemos copararlo con un entero
    if (Number(data.dailyRate) <= 0) {
      return res.status(400).json({
        msj: "Invalid daily rate",
        error: "The rate must be greater than 0",
      });
    }

    if (data.year < 1900 || data.year > 2027) {
      return res.status(400).json({
        msj: "Invalid year",
        error: "Year must be between 1900 and 2027",
      });
    }

    try {
      const response = await this.repository.create(data);

      return res.status(201).json({
        msj: "Vehicle created successfully",
        data: {
          id: response.id,
          tenantId: response.tenantId,
          plate: response.plate,
          brand: response.brand,
          model: response.model,
          year: response.year,
          category: response.category,
          dailyRate: response.dailyRate,
        },
      });
    } catch (error: any) {
      console.error(`[VehicleController] Error en create()`, error);

      //validamos placa porque es unique en el schema
      if (error.code === "P2002") {
        return res.status(400).json({
          msj: "Plate already exist",
        });
      }

      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }
}

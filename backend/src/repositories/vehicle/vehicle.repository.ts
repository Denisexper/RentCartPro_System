import { Vehicle, PrismaClient } from "@prisma/client";
import { VehicleRepositoryInterface } from "../../interfaces/vehicle/vehicle.repository.interface";
import {
  CreateVehicleInput,
  UpdateVehicleInput,
} from "../../types/vehicle/vehicle.types";

export class VehicleRepository implements VehicleRepositoryInterface {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getById(id: string): Promise<Vehicle | null> {
    try {
      const response = await this.prisma.vehicle.findUnique({
        where: { id },
      });

      return response;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async getAll(tenantId?: string): Promise<Vehicle[]> {
    try {
      //filtramos si no hay empresa no hay datos
      if (!tenantId) return [];

      //buscamos los vehiculos por el id de la empresa (tenantId)
      const response = await this.prisma.vehicle.findMany({
        where: { tenantId },
      });

      return response;
      
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async create(data: CreateVehicleInput): Promise<Vehicle> {
    try {
      const response = await this.prisma.vehicle.create({
        data: data,
      });

      return response;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async update(id: string, data: UpdateVehicleInput): Promise<Vehicle> {
    try {
      const response = await this.prisma.vehicle.update({
        where: { id },
        data: data,
      });

      return response;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async delete(id: string): Promise<Vehicle> {
    try {
      const response = await this.prisma.vehicle.delete({
        where: { id },
      });

      return response;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

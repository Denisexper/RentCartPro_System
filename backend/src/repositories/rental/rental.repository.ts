import { Rental, Vehicle, Client, PrismaClient } from "@prisma/client";
import { RentalRepositoryInterface } from "../../interfaces/rental/rental.repository.interface";
import {
  CreateRentalInput,
  UpdateRentalInput,
  ReturnRentalInput,
} from "../../types/rental/rental.types";

export class RentalRepository implements RentalRepositoryInterface {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getById(id: string): Promise<Rental | null> {
    return this.prisma.rental.findUnique({
      where: { id },
      include: { vehicle: true, client: true, user: true, payments: true },
    });
  }

  async getAll(tenantId?: string, status?: string): Promise<Rental[]> {
    return this.prisma.rental.findMany({
      where: {
        ...(tenantId ? { tenantId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: { vehicle: true, client: true, user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: CreateRentalInput): Promise<Rental> {
    // Transaccion: crear rental + cambiar vehiculo a Rented atomicamente
    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.rental.create({ data });
      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: "Rented" },
      });
      return rental;
    });
  }

  async update(id: string, data: UpdateRentalInput): Promise<Rental> {
    return this.prisma.rental.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Rental> {
    return this.prisma.rental.delete({ where: { id } });
  }

  async forceDelete(id: string): Promise<Rental> {
    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.rental.findUnique({ where: { id } });
      if (!rental) throw { status: 404, message: "Rental not found" };

      if (rental.status === "Active") {
        await tx.vehicle.update({
          where: { id: rental.vehicleId },
          data: { status: "Available" },
        });
      }

      await tx.rentalPhoto.deleteMany({ where: { rentalId: id } });

      return tx.rental.delete({ where: { id } });
    });
  }

  async findVehicle(vehicleId: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
  }

  async findClient(clientId: string): Promise<Client | null> {
    return this.prisma.client.findUnique({ where: { id: clientId } });
  }

  async hasDateConflict(
    vehicleId: string,
    startDate: Date,
    endDate: Date,
    excludeRentalId?: string
  ): Promise<boolean> {
    const conflict = await this.prisma.rental.findFirst({
      where: {
        vehicleId,
        id: excludeRentalId ? { not: excludeRentalId } : undefined,
        status: { in: ["Reserved", "Active"] },
        // Se solapan si: startDate < endDate existente AND endDate > startDate existente
        AND: [
          { startDate: { lt: endDate } },
          { endDate: { gt: startDate } },
        ],
      },
    });
    return conflict !== null;
  }

  async cancelRental(rentalId: string, notes?: string): Promise<Rental> {
    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.rental.findUnique({ where: { id: rentalId } });

      if (!rental) throw { status: 404, message: "Rental not found" };

      const cancelled = await tx.rental.update({
        where: { id: rentalId },
        data: {
          status: "Cancelled",
          notes: notes ?? rental.notes,
        },
      });

      // Solo liberar el vehiculo si estaba activo o reservado
      if (rental.status === "Active" || rental.status === "Reserved") {
        await tx.vehicle.update({
          where: { id: rental.vehicleId },
          data: { status: "Available" },
        });
      }

      return cancelled;
    });
  }

  async returnVehicle(rentalId: string, data: ReturnRentalInput): Promise<Rental> {
    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.rental.findUnique({ where: { id: rentalId } });

      if (!rental) throw { status: 404, message: "Rental not found" };

      const subtotal = Number(rental.subtotal);
      const discount = Number(rental.discount);
      const extraCharges = data.extraCharges ?? Number(rental.extraCharges);
      const newTotal = subtotal - discount + extraCharges;

      const updated = await tx.rental.update({
        where: { id: rentalId },
        data: {
          status: "Completed",
          actualReturn: data.actualReturn ?? new Date(),
          mileageEnd: data.mileageEnd,
          fuelIn: data.fuelIn,
          extraCharges: extraCharges,
          totalAmount: newTotal,
          notes: data.notes ?? rental.notes,
        },
      });

      await tx.vehicle.update({
        where: { id: rental.vehicleId },
        data: { status: "Available" },
      });

      return updated;
    });
  }
}

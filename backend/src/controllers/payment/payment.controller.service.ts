import { PaymentRepositoryInterface } from "../../interfaces/payment/payment.repository.interface";
import { Request, Response } from "express";
import { CreatePaymentInput } from "../../types/payment/payment.types";

export class PaymentControllerService {
  constructor(private readonly repository: PaymentRepositoryInterface) {}

  async getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    try {
      const response = await this.repository.getById(id);

      if (!response) {
        return res.status(404).json({
          msj: "Payment not found",
        });
      }

      return res.status(200).json({
        msj: "Payment retrived successfully",
        data: {
          ...response,
          amount: response.amount.toString(),
        },
      });
    } catch (error: any) {
      console.error(`[Payment controller] Error en getById(${id}):`, error);
      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    const isSuperAdmin = req.user!.role === "SuperAdmin";
    const tenantId = isSuperAdmin
      ? (req.query.tenantId as string | undefined)
      : req.user!.tenantId;
    try {
      const response = await this.repository.getAll(tenantId);

      return res.status(200).json({
        msj:
          response.length > 0
            ? "Payments retrived successfully"
            : "Payments list empty",
        data: response,
      });
    } catch (error: any) {
      console.error("[PaymentController] Error en getAll():", error);
      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }

  async create(req: Request, res: Response) {
    const data: CreatePaymentInput = req.body;

    try {
      const response = await this.repository.create(data);

      return res.status(201).json({
        msj: "Payment created successfully",
        data: {
          id: response.id,
          rentalId: response.rentalId,
          amount: response.amount,
          method: response.method,
          notes: response.notes,
        },
      });
    } catch (error: any) {
      console.error("[PaymentController] Error en create():", error);
      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    try {
      const isExist = await this.repository.getById(id);

      if (!isExist) {
        return res.status(404).json({
          msj: "Payment not found",
        });
      }

      const response = await this.repository.delete(id);

      return res.status(200).json({
        msj: "Payment deleted successfully",
        data: {
          id: response.id,
          rentalId: response.rentalId,
          amount: response.amount.toString(),
          method: response.method,
          notes: response.notes,
        },
      });
    } catch (error: any) {
      //si prisma devuelve P2025 es que el registro no existe //Redundancia defenciva
      if (error.code === "P2025") {
        return res.status(404).json({ msj: "Payment not found" });
      }
      //para errores de conexion o otros
      console.error(`[PaymentController] Error en delete(${id}):`, error);

      //para errores generales o desconocidos
      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }
}

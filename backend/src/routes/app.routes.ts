import { Router } from "express";
import prisma from "../dataBase/prisma";

//importaciones modulo de clients
import { ClientRepository } from "../repositories/client/client.repository";
import { ClienteControllerService } from "../controllers/client/client.controller.service";
import { ClientRoutes } from "./client/client.routes";

//importaciones modulo payment
import { PaymentRepository } from "../repositories/payment/payment.repository";
import { PaymentControllerService } from "../controllers/payment/payment.controller.service";
import { PaymentRoutes } from "./payment/payment.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // --- Configuración Módulo Clientes ---
    const clientRepo = new ClientRepository(prisma);
    const clientCtrl = new ClienteControllerService(clientRepo);
    const clientRoutes = new ClientRoutes(Router(), clientCtrl);

    // --- Configuración Módulo Pagos ---
    const paymentRepo = new PaymentRepository(prisma);
    const paymentCtrl = new PaymentControllerService(paymentRepo);
    const paymentRoutes = new PaymentRoutes(Router(), paymentCtrl);

    // --- Definición de Prefijos de Ruta ---
    router.use("/clients", clientRoutes.initRoutes());
    router.use("/payments", paymentRoutes.initRoutes());

    return router;
  }
}

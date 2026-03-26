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

//importaciones modulo rental
import { RentalRepository } from "../repositories/rental/rental.repository";
import { RentalControllerService } from "../controllers/rental/rental.controller.service";
import { RentalRoutes } from "./rental/rental.routes";


//importaciones modulo tenant
import { TenantRepository } from "../repositories/tenant/tenant.repository";
import { TenantControllerService } from "../controllers/tenant/tenant.controller.service";
import { TenantRoutes } from "./tenant/tenant.routes";

//importaciones modulo de Users
import { UserRepository } from "../repositories/user/user.repository";
import { UserControllerService } from "../controllers/user/user.controller.service";
import { UserRoutes } from "./user/user.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // --- Configuración Modulo Clientes ---
    const clientRepo = new ClientRepository(prisma);
    const clientCtrl = new ClienteControllerService(clientRepo);
    const clientRoutes = new ClientRoutes(Router(), clientCtrl);

    // --- Configuración Modulo Pagos ---
    const paymentRepo = new PaymentRepository(prisma);
    const paymentCtrl = new PaymentControllerService(paymentRepo);
    const paymentRoutes = new PaymentRoutes(Router(), paymentCtrl);

    // --- configuracion Modulo Rental ---
    const rentalRepo = new RentalRepository(prisma)
    const rentalCtrl = new RentalControllerService(rentalRepo)
    const rentalRoutes = new RentalRoutes(Router(), rentalCtrl);

    // --- configuracon Modulo Tenant ---
    const tenantRepo = new TenantRepository(prisma)
    const tenantCtrl = new TenantControllerService(tenantRepo)
    const tenantRoutes = new TenantRoutes(Router(), tenantCtrl)

    // --- configuracion Modulo Users ---
    const userRepo = new UserRepository(prisma)
    const userCtrl = new UserControllerService(userRepo)
    const userRoutes = new UserRoutes(Router(),userCtrl)

    // --- Definición de Prefijos de Ruta ---
    router.use("/clients", clientRoutes.initRoutes());
    router.use("/payments", paymentRoutes.initRoutes());
    router.use("/rentals", rentalRoutes.initRoutes());
    router.use("/tenants", tenantRoutes.initRoutes());
    router.use("/users", userRoutes.initRoutes());

    return router;
  }
}

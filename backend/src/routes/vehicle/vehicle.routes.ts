import { Router, Request, Response } from "express";
import { VehicleControllerService } from "../../controllers/vehicle/vehicle.controller.service";
import { authMiddleware } from "../../middlewares/auth.moddleware";
import { authorizeRoles } from "../../middlewares/role.moddleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";

export class VehicleRoutes {
  private router: Router;
  private controller: VehicleControllerService;

  constructor(router: Router, controller: VehicleControllerService) {
    this.router = router;
    this.controller = controller;
  }

  initRoutes() {
    this.router.get(
      "/",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin", "Operator", "Auditor"),
      (req: Request<{}, {}, {}, { tenantId: string }>, res: Response) => this.controller.getAll(req, res)
    );
    this.router.get(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin", "Operator", "Auditor"),
      (req: Request<{ id: string }>, res: Response) => this.controller.getById(req, res)
    );
    this.router.post(
      "/",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin"),
      (req: Request, res: Response) => this.controller.create(req, res)
    );
    this.router.put(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin"),
      (req: Request<{ id: string }, {}, {}, { tenantId: string }>, res: Response) => this.controller.update(req, res)
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin"),
      (req: Request<{ id: string }, {}, {}, { tenantId: string }>, res: Response) => this.controller.delete(req, res)
    );

    return this.router;
  }
}

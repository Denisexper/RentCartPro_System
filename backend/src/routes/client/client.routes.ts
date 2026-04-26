import { Router, Request, Response, NextFunction } from "express";
import { ClienteControllerService } from "../../controllers/client/client.controller.service";
import { authMiddleware } from "../../middlewares/auth.moddleware";
import { authorizeRoles } from "../../middlewares/role.moddleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";

export class ClientRoutes {
  private router: Router;
  private ClientController: ClienteControllerService;

  constructor(router: Router, ClientController: ClienteControllerService) {
    this.router = router;
    this.ClientController = ClientController;
  }

  initRoutes() {
    this.router.get(
      "/",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin", "Operator", "Auditor"),
      (req: Request, res: Response) => this.ClientController.getAll(req, res)
    );
    this.router.get(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin", "Operator", "Auditor"),
      (req: Request<{ id: string }>, res: Response, next: NextFunction) => this.ClientController.getById(req, res, next)
    );
    this.router.post(
      "/",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin", "Operator"),
      (req: Request, res: Response) => this.ClientController.create(req, res)
    );
    this.router.put(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin", "Operator"),
      (req: Request<{ id: string }>, res: Response) => this.ClientController.update(req, res)
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin"),
      (req: Request<{ id: string }>, res: Response) => this.ClientController.delete(req, res)
    );

    return this.router;
  }
}

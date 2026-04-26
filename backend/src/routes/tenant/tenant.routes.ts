import { Router, Request, Response } from "express";
import { TenantControllerService } from "../../controllers/tenant/tenant.controller.service";
import { authMiddleware } from "../../middlewares/auth.moddleware";
import { authorizeRoles } from "../../middlewares/role.moddleware";

export class TenantRoutes {
  private router: Router;
  private controller: TenantControllerService;

  constructor(router: Router, controller: TenantControllerService) {
    this.router = router;
    this.controller = controller;
  }

  initRoutes() {
    this.router.get(
      "/",
      authMiddleware,
      authorizeRoles("SuperAdmin"),
      (req: Request, res: Response) => this.controller.getAll(req, res)
    );
    this.router.get(
      "/:id",
      authMiddleware,
      authorizeRoles("SuperAdmin"),
      (req: Request<{ id: string }>, res: Response) => this.controller.getById(req, res)
    );
    this.router.post(
      "/",
      authMiddleware,
      authorizeRoles("SuperAdmin"),
      (req: Request, res: Response) => this.controller.create(req, res)
    );
    this.router.put(
      "/:id",
      authMiddleware,
      authorizeRoles("SuperAdmin"),
      (req: Request<{ id: string }>, res: Response) => this.controller.update(req, res)
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      authorizeRoles("SuperAdmin"),
      (req: Request<{ id: string }>, res: Response) => this.controller.delete(req, res)
    );

    return this.router;
  }
}

import { Router, Request, Response } from "express";
import { CustomRoleControllerService } from "../../controllers/role/role.controller.service";
import { authMiddleware } from "../../middlewares/auth.moddleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { checkPermission } from "../../middlewares/permission.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createCustomRoleSchema, updateCustomRoleSchema } from "../../schemas/role.schema";

export class CustomRoleRoutes {
  private router: Router;
  private controller: CustomRoleControllerService;

  constructor(router: Router, controller: CustomRoleControllerService) {
    this.router = router;
    this.controller = controller;
  }

  initRoutes() {
    this.router.get(
      "/",
      authMiddleware,
      tenantMiddleware,
      checkPermission("roles:manage"),
      (req: Request, res: Response) => this.controller.getAll(req, res)
    );
    this.router.get(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      checkPermission("roles:manage"),
      (req: Request<{ id: string }>, res: Response) => this.controller.getById(req, res)
    );
    this.router.post(
      "/",
      authMiddleware,
      tenantMiddleware,
      checkPermission("roles:manage"),
      validate(createCustomRoleSchema),
      (req: Request, res: Response) => this.controller.create(req, res)
    );
    this.router.put(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      checkPermission("roles:manage"),
      validate(updateCustomRoleSchema),
      (req: Request<{ id: string }>, res: Response) => this.controller.update(req, res)
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      checkPermission("roles:manage"),
      (req: Request<{ id: string }>, res: Response) => this.controller.delete(req, res)
    );

    return this.router;
  }
}

import { Router, Request, Response } from "express";
import { UserControllerService } from "../../controllers/user/user.controller.service";
import { authMiddleware } from "../../middlewares/auth.moddleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { checkPermission } from "../../middlewares/permission.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "../../schemas/user.schema";

export class UserRoutes {
  private router: Router;
  private controller: UserControllerService;

  constructor(router: Router, controller: UserControllerService) {
    this.router = router;
    this.controller = controller;
  }

  initRoutes() {
    this.router.get(
      "/",
      authMiddleware,
      tenantMiddleware,
      checkPermission("users:read"),
      (req: Request, res: Response) => this.controller.getAll(req, res)
    );
    this.router.get(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      checkPermission("users:read"),
      (req: Request<{ id: string }>, res: Response) => this.controller.getById(req, res)
    );
    this.router.post(
      "/",
      authMiddleware,
      tenantMiddleware,
      checkPermission("users:create"),
      validate(createUserSchema),
      (req: Request, res: Response) => this.controller.create(req, res)
    );
    this.router.put(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      checkPermission("users:update"),
      validate(updateUserSchema),
      (req: Request<{ id: string }>, res: Response) => this.controller.update(req, res)
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      checkPermission("users:delete"),
      (req: Request<{ id: string }>, res: Response) => this.controller.delete(req, res)
    );

    return this.router;
  }
}

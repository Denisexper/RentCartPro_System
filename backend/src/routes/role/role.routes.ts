import { Router, Request, Response } from "express";
import { CustomRoleControllerService } from "../../controllers/role/role.controller.service";
import { authMiddleware } from "../../middlewares/auth.moddleware";
import { authorizeRoles } from "../../middlewares/role.moddleware";
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
      authorizeRoles("Admin", "SuperAdmin"),
      (req: Request, res: Response) => this.controller.getAll(req, res)
    );

    this.router.get(
      "/:id",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      (req: Request<{ id: string }>, res: Response) => this.controller.getById(req, res)
    );

    this.router.post(
      "/",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      validate(createCustomRoleSchema),
      (req: Request, res: Response) => this.controller.create(req, res)
    );

    this.router.put(
      "/:id",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      validate(updateCustomRoleSchema),
      (req: Request<{ id: string }>, res: Response) => this.controller.update(req, res)
    );

    this.router.delete(
      "/:id",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      (req: Request<{ id: string }>, res: Response) => this.controller.delete(req, res)
    );

    return this.router;
  }
}

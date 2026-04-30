import { Router, Request, Response } from "express";
import { PermissionControllerService } from "../../controllers/permission/permission.controller.service";
import { authMiddleware } from "../../middlewares/auth.moddleware";
import { authorizeRoles } from "../../middlewares/role.moddleware";

export class PermissionRoutes {
  private router: Router;
  private controller: PermissionControllerService;

  constructor(router: Router, controller: PermissionControllerService) {
    this.router = router;
    this.controller = controller;
  }

  initRoutes() {
    // Catálogo completo de permisos
    this.router.get(
      "/",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      (req: Request, res: Response) => this.controller.getAll(req, res)
    );

    // ── Base roles ────────────────────────────────────────────────────
    this.router.get(
      "/base-roles/:role",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      (req: Request<{ role: string }>, res: Response) => this.controller.getBaseRolePermissions(req, res)
    );

    this.router.post(
      "/base-roles/:role",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      (req: Request<{ role: string }>, res: Response) => this.controller.assignToBaseRole(req, res)
    );

    this.router.delete(
      "/base-roles/:role/:key",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      (req: Request<{ role: string; key: string }>, res: Response) => this.controller.revokeFromBaseRole(req, res)
    );

    // ── Custom roles ──────────────────────────────────────────────────
    this.router.get(
      "/custom-roles/:id",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      (req: Request<{ id: string }>, res: Response) => this.controller.getCustomRolePermissions(req, res)
    );

    this.router.post(
      "/custom-roles/:id",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      (req: Request<{ id: string }>, res: Response) => this.controller.assignToCustomRole(req, res)
    );

    this.router.delete(
      "/custom-roles/:id/:key",
      authMiddleware,
      authorizeRoles("Admin", "SuperAdmin"),
      (req: Request<{ id: string; key: string }>, res: Response) => this.controller.revokeFromCustomRole(req, res)
    );

    return this.router;
  }
}

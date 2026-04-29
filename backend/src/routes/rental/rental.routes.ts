import { Router, Request, Response, NextFunction } from "express";
import { RentalControllerService } from "../../controllers/rental/rental.controller.service";
import { RentalPhotoControllerService } from "../../controllers/rental/rental-photo.controller.service";
import { authMiddleware } from "../../middlewares/auth.moddleware";
import { authorizeRoles } from "../../middlewares/role.moddleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { uploadPhotos } from "../../middlewares/upload.middleware";
import { createRentalSchema, updateRentalSchema } from "../../schemas/rental.schema";

export class RentalRoutes {
  private router: Router;
  private controller: RentalControllerService;
  private photoController: RentalPhotoControllerService;

  constructor(router: Router, controller: RentalControllerService, photoController: RentalPhotoControllerService) {
    this.router = router;
    this.controller = controller;
    this.photoController = photoController;
  }

  initRoutes() {
    this.router.get(
      "/",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin", "Operator", "Auditor"),
      (req: Request, res: Response) => this.controller.getAll(req, res)
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
      authorizeRoles("SuperAdmin", "Admin", "Operator"),
      validate(createRentalSchema),
      (req: Request, res: Response) => this.controller.create(req, res)
    );
    this.router.put(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin", "Operator"),
      validate(updateRentalSchema),
      (req: Request<{ id: string }>, res: Response) => this.controller.update(req, res)
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin"),
      (req: Request<{ id: string }>, res: Response) => this.controller.delete(req, res)
    );
    this.router.delete(
      "/:id/force",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin"),
      (req: Request<{ id: string }>, res: Response) => this.controller.forceDelete(req, res)
    );

    // Photos
    this.router.post(
      "/:id/photos",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin", "Operator"),
      (req: Request, res: Response, next: NextFunction) => uploadPhotos(req, res, next),
      (req: Request<{ id: string }>, res: Response, next: NextFunction) => this.photoController.upload(req, res, next)
    );
    this.router.get(
      "/:id/photos",
      authMiddleware,
      tenantMiddleware,
      authorizeRoles("SuperAdmin", "Admin", "Operator", "Auditor"),
      (req: Request<{ id: string }>, res: Response, next: NextFunction) => this.photoController.list(req, res, next)
    );

    return this.router;
  }
}

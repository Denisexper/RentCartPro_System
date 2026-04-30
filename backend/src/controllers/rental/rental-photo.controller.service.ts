import { Request, Response, NextFunction } from "express";
import { PhotoType } from "@prisma/client";
import { RentalPhotoRepository } from "../../repositories/rental/rental-photo.repository";
import { uploadBuffer } from "../../utils/cloudinary";

export class RentalPhotoControllerService {
  constructor(private repo: RentalPhotoRepository) {}

  async upload(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { id: rentalId } = req.params;
      const { type } = req.body as { type: string };
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0)
        return next({ status: 400, message: "No se enviaron imágenes" });

      if (!["Checkout", "Return"].includes(type))
        return next({ status: 400, message: "El tipo debe ser Checkout o Return" });

      const rental = await this.repo.findRentalTenant(rentalId);
      if (!rental) return next({ status: 404, message: "Alquiler no encontrado" });

      const tenantId = (req as any).user?.tenantId;
      if (tenantId && rental.tenantId !== tenantId)
        return next({ status: 403, message: "Acceso denegado" });

      const tenantSlug = rental.tenant?.slug ?? rental.tenantId;
      const saved = await Promise.all(
        files.map(async (file) => {
          const result = await uploadBuffer(file.buffer, `rentcart/${tenantSlug}/${rentalId}`);
          return this.repo.create({
            rentalId,
            type: type as PhotoType,
            url: result.secure_url,
            publicId: result.public_id,
          });
        })
      );

      return res.status(201).json({ ok: true, data: saved });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { id: rentalId } = req.params;
      const type = req.query.type as PhotoType | undefined;

      const rental = await this.repo.findRentalTenant(rentalId);
      if (!rental) return next({ status: 404, message: "Alquiler no encontrado" });

      const tenantId = (req as any).user?.tenantId;
      if (tenantId && rental.tenantId !== tenantId)
        return next({ status: 403, message: "Acceso denegado" });

      const photos = await this.repo.findByRental(rentalId, type);
      return res.status(200).json({ ok: true, data: photos });
    } catch (error) {
      next(error);
    }
  }
}

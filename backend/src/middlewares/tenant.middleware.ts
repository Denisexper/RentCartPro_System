import { Request, Response, NextFunction } from "express";

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ msj: "No autenticado" });
  }

  if (!user.tenantId) {
    return res.status(403).json({ msj: "Usuario sin tenant asignado" });
  }

  // Inyecta el tenantId en el body y query para que los controllers lo usen automáticamente
  req.body.tenantId = user.tenantId;
  req.query.tenantId = user.tenantId;

  next();
};

import { Request, Response, NextFunction } from "express";

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ msj: "No autenticado" });
  }

  if (!user.tenantId) {
    return res.status(403).json({ msj: "Usuario sin tenant asignado" });
  }

  if (req.body && typeof req.body === "object") {
    req.body.tenantId = user.tenantId;
  }

  next();
};

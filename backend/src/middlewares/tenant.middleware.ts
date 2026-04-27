import { Request, Response, NextFunction } from "express";

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ msj: "No autenticado" });
  }

  if (!user.tenantId) {
    return res.status(403).json({ msj: "Usuario sin tenant asignado" });
  }

  // En Express 5 req.body es undefined en GET requests (sin body)
  if (req.body && typeof req.body === "object") {
    req.body.tenantId = user.tenantId;
  }
  (req.query as Record<string, unknown>).tenantId = user.tenantId;

  next();
};

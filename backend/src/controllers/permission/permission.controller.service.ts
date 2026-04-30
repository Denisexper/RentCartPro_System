import { Request, Response } from "express";
import { Role } from "@prisma/client";
import { PermissionRepository } from "../../repositories/permission/permission.repository";

const BASE_ROLES: Role[] = ["Admin", "Operator", "Auditor"];

export class PermissionControllerService {
  private repository: PermissionRepository;

  constructor(repository: PermissionRepository) {
    this.repository = repository;
  }

  async getAll(req: Request, res: Response) {
    try {
      const permissions = await this.repository.getAll();
      return res.status(200).json({ msj: "Permissions retrieved successfully", data: permissions });
    } catch (error: any) {
      return res.status(500).json({ msj: "Server error", error: error.message });
    }
  }

  // ── Base roles ───────────────────────────────────────────────────────

  async getBaseRolePermissions(req: Request<{ role: string }>, res: Response) {
    const role = req.params.role as Role;
    if (!BASE_ROLES.includes(role)) return res.status(400).json({ msj: "Invalid role" });
    const tenantId = req.user!.tenantId!;
    try {
      const permissions = await this.repository.getBaseRolePermissions(tenantId, role);
      return res.status(200).json({ msj: "Role permissions retrieved", data: permissions });
    } catch (error: any) {
      return res.status(500).json({ msj: "Server error", error: error.message });
    }
  }

  async assignToBaseRole(req: Request<{ role: string }>, res: Response) {
    const role = req.params.role as Role;
    if (!BASE_ROLES.includes(role)) return res.status(400).json({ msj: "Invalid role" });
    const tenantId = req.user!.tenantId!;
    const { permissionId } = req.body;
    if (!permissionId) return res.status(400).json({ msj: "permissionId is required" });
    try {
      await this.repository.assignToBaseRole(tenantId, role, permissionId);
      return res.status(200).json({ msj: "Permission assigned to role" });
    } catch (error: any) {
      return res.status(500).json({ msj: "Server error", error: error.message });
    }
  }

  async revokeFromBaseRole(req: Request<{ role: string; key: string }>, res: Response) {
    const role = req.params.role as Role;
    if (!BASE_ROLES.includes(role)) return res.status(400).json({ msj: "Invalid role" });
    const tenantId = req.user!.tenantId!;
    const { key } = req.params;
    try {
      await this.repository.revokeFromBaseRole(tenantId, role, key);
      return res.status(200).json({ msj: "Permission revoked from role" });
    } catch (error: any) {
      return res.status(500).json({ msj: "Server error", error: error.message });
    }
  }

  // ── Custom roles ─────────────────────────────────────────────────────

  async getCustomRolePermissions(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      const permissions = await this.repository.getCustomRolePermissions(id);
      return res.status(200).json({ msj: "Custom role permissions retrieved", data: permissions });
    } catch (error: any) {
      return res.status(500).json({ msj: "Server error", error: error.message });
    }
  }

  async assignToCustomRole(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { permissionId } = req.body;
    if (!permissionId) return res.status(400).json({ msj: "permissionId is required" });
    try {
      await this.repository.assignToCustomRole(id, permissionId);
      return res.status(200).json({ msj: "Permission assigned to custom role" });
    } catch (error: any) {
      return res.status(500).json({ msj: "Server error", error: error.message });
    }
  }

  async revokeFromCustomRole(req: Request<{ id: string; key: string }>, res: Response) {
    const { id, key } = req.params;
    try {
      await this.repository.revokeFromCustomRole(id, key);
      return res.status(200).json({ msj: "Permission revoked from custom role" });
    } catch (error: any) {
      return res.status(500).json({ msj: "Server error", error: error.message });
    }
  }
}

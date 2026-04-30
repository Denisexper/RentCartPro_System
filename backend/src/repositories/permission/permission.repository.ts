import { Permission, PrismaClient, Role } from "@prisma/client";

export class PermissionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Permission[]> {
    return this.prisma.permission.findMany({ orderBy: [{ module: "asc" }, { action: "asc" }] });
  }

  // ── Base role permissions (per tenant) ──────────────────────────────

  async getBaseRolePermissions(tenantId: string, role: Role): Promise<Permission[]> {
    const rows = await this.prisma.rolePermission.findMany({
      where: { tenantId, role },
      include: { permission: true },
    });
    return rows.map((r) => r.permission);
  }

  async assignToBaseRole(tenantId: string, role: Role, permissionId: string): Promise<void> {
    await this.prisma.rolePermission.upsert({
      where: { tenantId_role_permissionId: { tenantId, role, permissionId } },
      update: {},
      create: { tenantId, role, permissionId },
    });
  }

  async revokeFromBaseRole(tenantId: string, role: Role, permissionKey: string): Promise<void> {
    const perm = await this.prisma.permission.findUnique({ where: { key: permissionKey } });
    if (!perm) return;
    await this.prisma.rolePermission.deleteMany({
      where: { tenantId, role, permissionId: perm.id },
    });
  }

  // ── Custom role permissions ──────────────────────────────────────────

  async getCustomRolePermissions(customRoleId: string): Promise<Permission[]> {
    const rows = await this.prisma.customRolePermission.findMany({
      where: { customRoleId },
      include: { permission: true },
    });
    return rows.map((r) => r.permission);
  }

  async assignToCustomRole(customRoleId: string, permissionId: string): Promise<void> {
    await this.prisma.customRolePermission.upsert({
      where: { customRoleId_permissionId: { customRoleId, permissionId } },
      update: {},
      create: { customRoleId, permissionId },
    });
  }

  async revokeFromCustomRole(customRoleId: string, permissionKey: string): Promise<void> {
    const perm = await this.prisma.permission.findUnique({ where: { key: permissionKey } });
    if (!perm) return;
    await this.prisma.customRolePermission.deleteMany({
      where: { customRoleId, permissionId: perm.id },
    });
  }

  // ── Check (usado por el middleware checkPermission) ──────────────────

  async hasBaseRolePermission(tenantId: string, role: Role, permissionKey: string): Promise<boolean> {
    const perm = await this.prisma.permission.findUnique({ where: { key: permissionKey } });
    if (!perm) return false;
    const row = await this.prisma.rolePermission.findUnique({
      where: { tenantId_role_permissionId: { tenantId, role, permissionId: perm.id } },
    });
    return !!row;
  }

  async hasCustomRolePermission(customRoleId: string, permissionKey: string): Promise<boolean> {
    const perm = await this.prisma.permission.findUnique({ where: { key: permissionKey } });
    if (!perm) return false;
    const row = await this.prisma.customRolePermission.findUnique({
      where: { customRoleId_permissionId: { customRoleId, permissionId: perm.id } },
    });
    return !!row;
  }

  async findPermissionByKey(key: string): Promise<Permission | null> {
    return this.prisma.permission.findUnique({ where: { key } });
  }
}

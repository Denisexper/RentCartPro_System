import { Tenant, User } from "@prisma/client";
import type { CreateTenantInput, UpdateTenantInput } from "../../types/tenant/tenant.types";

export interface SuperAdminStats {
  tenantsTotal: number;
  tenantsActive: number;
  usersTotal: number;
  vehiclesTotal: number;
  rentalsTotal: number;
}

export interface TenantWithAdmin {
  tenant: Tenant;
  admin: Omit<User, 'password'>;
}

export interface TenantRepositoryInterface {
    getById(id: string): Promise<Tenant | null>
    getBySlug(slug: string): Promise<Tenant | null>
    getAll(): Promise<Tenant[]>
    getStats(): Promise<SuperAdminStats>
    create(data: CreateTenantInput): Promise<Tenant>
    createWithAdmin(
      tenantData: { name: string; slug: string; plan?: Tenant['plan']; active?: boolean },
      adminData: { name: string; email: string; password: string }
    ): Promise<TenantWithAdmin>
    update(id: string, data: UpdateTenantInput): Promise<Tenant>
    delete(id: string): Promise<Tenant>
}
import { Tenant } from "@prisma/client";
import type { CreateTenantInput, UpdateTenantInput } from "../../types/tenant/tenant.types";

export interface SuperAdminStats {
  tenantsTotal: number;
  tenantsActive: number;
  usersTotal: number;
  vehiclesTotal: number;
  rentalsTotal: number;
}

export interface TenantRepositoryInterface {
    getById(id: string) : Promise<Tenant | null>
    getAll() : Promise<Tenant[]>
    getStats() : Promise<SuperAdminStats>
    create(data: CreateTenantInput): Promise<Tenant>
    update(id: string, data: UpdateTenantInput): Promise<Tenant>
    delete(id: string): Promise<Tenant>
}
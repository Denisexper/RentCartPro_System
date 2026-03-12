import { Tenant } from "@prisma/client";
import type { CreateTenantInput, UpdateTenantInput } from "../../types/tenant/tenant.types";

export interface TenantRepositoryInterface {

    getById(id: string) : Promise<Tenant | null>
    getAll() : Promise<Tenant[]>
    create(data: CreateTenantInput): Promise<Tenant>
    update(id: string, data: UpdateTenantInput): Promise<Tenant>
    delete(id: string): Promise<Tenant>
}
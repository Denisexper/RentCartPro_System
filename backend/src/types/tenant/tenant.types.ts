import { Tenant } from "@prisma/client";


export type CreateTenantInput = Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'> & {
    plan?: Tenant['plan'];
    active?: boolean
}

export type UpdateTenantInput = Partial<CreateTenantInput>

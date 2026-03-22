import { Tenant, PrismaClient } from "@prisma/client";
import { TenantRepositoryInterface } from "../../interfaces/tenant/tenant.repository.interface";
import { CreateTenantInput, UpdateTenantInput } from "../../types/tenant/tenant.types";

export class TenantRepository implements TenantRepositoryInterface {
    getById(id: string): Promise<Tenant | null> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<Tenant[]> {
        throw new Error("Method not implemented.");
    }
    create(data: CreateTenantInput): Promise<Tenant> {
        throw new Error("Method not implemented.");
    }
    update(id: string, data: UpdateTenantInput): Promise<Tenant> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<Tenant> {
        throw new Error("Method not implemented.");
    }

}
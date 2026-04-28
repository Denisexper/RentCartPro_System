import { Tenant, PrismaClient } from "@prisma/client";
import { TenantRepositoryInterface, SuperAdminStats } from "../../interfaces/tenant/tenant.repository.interface";
import { CreateTenantInput, UpdateTenantInput } from "../../types/tenant/tenant.types";

export class TenantRepository implements TenantRepositoryInterface {

    private prisma: PrismaClient;

    constructor (
        prisma: PrismaClient
    ){
        this.prisma = prisma
    }

    async getById(id: string): Promise<Tenant | null> {
        try {
            
            const response = await this.prisma.tenant.findUnique({
                where: { id }
            })
            return response

        } catch (error) {
            
            throw new Error (`${error}`)
        }
    }
    async getAll(): Promise<Tenant[]> {
        try {
          
            const response = await this.prisma.tenant.findMany();

            return response;
        } catch (error) {
            
            throw new Error (`${error}`);
        }
    }
    async getStats(): Promise<SuperAdminStats> {
        try {
            const [tenantsTotal, tenantsActive, usersTotal, vehiclesTotal, rentalsTotal] =
                await Promise.all([
                    this.prisma.tenant.count(),
                    this.prisma.tenant.count({ where: { active: true } }),
                    this.prisma.user.count(),
                    this.prisma.vehicle.count(),
                    this.prisma.rental.count(),
                ]);

            return { tenantsTotal, tenantsActive, usersTotal, vehiclesTotal, rentalsTotal };
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async create(data: CreateTenantInput): Promise<Tenant> {
        try {
            
            const response = await this.prisma.tenant.create({
                data: data
            });

            return response;
        } catch (error) {
            
            throw new Error (`${error}`);
        }
    }
    async update(id: string, data: UpdateTenantInput): Promise<Tenant> {
        try {
            
            const response = await this.prisma.tenant.update({
                where: { id },
                data: data
            });

            return response;
        } catch (error) {
            
            throw new Error (`${error}`);
        }
    }
    async delete(id: string): Promise<Tenant> {
        try {
            
            const response = await this.prisma.tenant.delete({
                where: { id }
            });

            return response
        } catch (error) {
            
            throw new Error (`${error}`);
        }
    }

}
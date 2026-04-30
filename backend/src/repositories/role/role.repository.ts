import { PrismaClient, CustomRole } from "@prisma/client";
import { CustomRoleRepositoryInterface } from "../../interfaces/role/role.repository.interface";
import { CreateCustomRoleInput, UpdateCustomRoleInput } from "../../types/role/role.types";

export class CustomRoleRepository implements CustomRoleRepositoryInterface {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(tenantId: string): Promise<CustomRole[]> {
    try {
      return await this.prisma.customRole.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async getById(id: string): Promise<CustomRole | null> {
    try {
      return await this.prisma.customRole.findUnique({ where: { id } });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async create(data: CreateCustomRoleInput): Promise<CustomRole> {
    try {
      return await this.prisma.customRole.create({ data });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async update(id: string, data: UpdateCustomRoleInput): Promise<CustomRole> {
    try {
      return await this.prisma.customRole.update({ where: { id }, data });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async delete(id: string): Promise<CustomRole> {
    try {
      return await this.prisma.customRole.delete({ where: { id } });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

import { CustomRole } from "@prisma/client";
import { CreateCustomRoleInput, UpdateCustomRoleInput } from "../../types/role/role.types";

export interface CustomRoleRepositoryInterface {
  getAll(tenantId: string): Promise<CustomRole[]>;
  getById(id: string): Promise<CustomRole | null>;
  create(data: CreateCustomRoleInput): Promise<CustomRole>;
  update(id: string, data: UpdateCustomRoleInput): Promise<CustomRole>;
  delete(id: string): Promise<CustomRole>;
}

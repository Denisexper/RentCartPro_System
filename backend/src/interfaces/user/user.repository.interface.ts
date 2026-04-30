import { User } from "@prisma/client";
import { CreateUserInput, UpdateUserInput } from "../../types/user/user.types";

export type UserWithCustomRole = User & { customRole?: { id: string; name: string } | null };

export interface UserRepositoryInterface {

    getById(id: string): Promise<UserWithCustomRole | null>
    getAll(tenantId?: string): Promise<UserWithCustomRole[]>
    create(data: CreateUserInput): Promise<User>
    update(id: string, data: UpdateUserInput): Promise<User>
    delete(id: string): Promise<User>

}
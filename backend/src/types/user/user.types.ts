import { User } from "@prisma/client";

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & {
    role?: User['role'];
    active?: boolean;
}

export type UpdateUserInput = Partial<CreateUserInput>
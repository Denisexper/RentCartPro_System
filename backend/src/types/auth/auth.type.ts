import { User } from "@prisma/client"

export type LoginInput = Pick<User, 'password' |'email'>;


export type RegisterInput = Pick<User, 'name' | 'email' | 'password' | 'tenantId'>;

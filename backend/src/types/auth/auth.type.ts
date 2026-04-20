import { User } from "@prisma/client"

export type loginInput = Pick<User, 'password' |'email'>;


export type registerInput = Pick<User, 'name' | 'email' | 'password' | 'tenantId'>;

import { User } from "@prisma/client"

export type loginInput = Pick<User, 'password' |'email'>;


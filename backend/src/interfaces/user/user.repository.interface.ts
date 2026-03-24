import { User } from "@prisma/client";
import { CreateUserInput, UpdateUserInput } from "../../types/user/user.types";


export interface UserRepositoryInterface {

    getById(id: string):Promise<User | null>
    getAll(): Promise<User[]>
    create(data: CreateUserInput): Promise<User>
    update(id: string, data: UpdateUserInput): Promise<User>
    delete(id: string): Promise<User>

}
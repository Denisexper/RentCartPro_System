import { PrismaClient, User } from "@prisma/client";
import { UserRepositoryInterface } from "../../interfaces/user/user.repository.interface";
import { CreateUserInput, UpdateUserInput } from "../../types/user/user.types";

export class UserRepository implements UserRepositoryInterface {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getById(id: string): Promise<User | null> {
    try {
      const response = await this.prisma.user.findUnique({
        where: { id },
      });

      return response;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async getAll(tenantId: string): Promise<User[]> {
    try {
      const response = await this.prisma.user.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
      });
      return response;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async create(data: CreateUserInput): Promise<User> {
    try {

        const response = await this.prisma.user.create({
            data: data,
        })

        return response;

    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async update(id: string, data: UpdateUserInput): Promise<User> {
    try {

      const response = await this.prisma.user.update({
        where: { id },
        data: data,
      });

      return response;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async delete(id: string): Promise<User> {
    try {

        const response = await this.prisma.user.delete({
            where: { id }
        });

        return response
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

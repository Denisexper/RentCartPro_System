import { LoginInput, RegisterInput } from "../../types/auth/auth.type";
import { PrismaClient, User } from "@prisma/client";

export class AuthRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  
  //register
  async register(data: RegisterInput): Promise<User> {
    try {
      const response = await this.prisma.user.create({
        data: {
          ...data,
          role: "Operator",
        },
      });

      return response;
    } catch (error) {
      throw new Error(`Error en el registro ${error}`);
    }
  }

  // lgin findby email
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new Error(`Error buscando usuario: ${error}`);
    }
  }
}

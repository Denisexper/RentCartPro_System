import { UserRepositoryInterface } from "../../interfaces/user/user.repository.interface";
import { Request, Response } from "express";
import { CreateUserInput } from "../../types/user/user.types";

export class UserControllerService {
  private repository: UserRepositoryInterface;

  constructor(repository: UserRepositoryInterface) {
    this.repository = repository;
  }

  async getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      const response = await this.repository.getById(id);

      if (!response) {
        return res.status(404).json({
          msj: "User not found",
        });
      }

      return res.status(200).json({
        msj: "User retrived successfully",
        data: {
          id: response.id,
          tenantId: response.tenantId,
          name: response.name,
          email: response.email,
          role: response.role,
          active: response.active,
        },
      });
    } catch (error: any) {
      console.error(`[UserController] Error en getById(${id})`, error);

      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const response = await this.repository.getAll();

      //solo para mostrar campos especificos visualmente, (de la base de datos siempre trae todo)
      const cleanData = response.map((user) => ({
        id: user.id,
        tenantId: user.tenantId,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      }));

      return res.status(200).json({
        mjs:
          cleanData.length > 0
            ? "User list retrived successfully"
            : "User list empty",
        data: cleanData,
      });
    } catch (error: any) {
        console.error(`{UserController} Error en getAll()`, error)

        return res.status(500).json({
            msj: "Server error",
            error: error.message
        })
    }
  }

  async create(req: Request, res: Response) {

    const data: CreateUserInput = req.body;
    
    try {
        
    } catch (error) {
        
    }
  }
}

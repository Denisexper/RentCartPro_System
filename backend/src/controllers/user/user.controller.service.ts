import { UserRepositoryInterface } from "../../interfaces/user/user.repository.interface";
import { Request, Response } from "express";
import { CreateUserInput, UpdateUserInput } from "../../types/user/user.types";
import bcrypt from "bcrypt";

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
        total: response.length,
      });
    } catch (error: any) {
      console.error(`[UserController] Error en getAll()`, error);

      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }

  async create(req: Request, res: Response) {
    const data: CreateUserInput = req.body;

    if (
      !data.tenantId ||
      !data.name ||
      !data.email ||
      !data.password ||
      !data.role ||
      !data.active
    ) {
      return res.status(400).json({
        mjs: "Missing requireds fields",
        fields: {
          tenantId: !data.tenantId ? "Required" : "OK",
          name: !data.name ? "Required" : "OK",
          email: !data.email ? "Required" : "OK",
          password: !data.password ? "Required" : "OK",
          role: !data.role ? "Required" : "OK",
          active: !data.active ? "Required" : "OK",
        },
      });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hasPassword = await bcrypt.hash(data.password, salt);

      const userData = {
        ...data,
        password: hasPassword,
      };

      const response = await this.repository.create(userData);

      return res.status(201).json({
        msj: "User created successfully",
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
      console.error(`[UserController] Error en create()`, error);

      // Capturar si el email ya existe (Prisma P2002)
      if (error.code === "P2002") {
        return res.status(400).json({ msj: "Email already exists" });
      }

      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }

  async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const data: UpdateUserInput = req.body;

    // Validar que el body no esté vacío
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msj: "No data provided for update" });
    }

    //Validar espacios en blanco
    const values = Object.values(data);
    const hasContent = values.some(
      (val) =>
        val !== null && val !== undefined && val.toString().trim() !== "",
    );

    if (!hasContent) {
      return res.status(400).json({ msj: "Provided fields cannot be empty" });
    }

    try {
      // Verificar si el usuario existe
      const userExist = await this.repository.getById(id);
      if (!userExist) {
        return res.status(404).json({ msj: "User not found" });
      }

      // Lógica de Contraseña
      const updateData = { ...data };

      if (data.password && data.password.trim() !== "") {
        // Si mandó una contraseña nueva, la encriptamos
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(data.password, salt);
      } else {
        // Si no mandó password o mandó string vacío,
        // eliminamos la propiedad para que Prisma no intente tocarla.
        delete updateData.password;
      }

      // Ejecutar actualización
      const response = await this.repository.update(id, updateData);

      return res.status(200).json({
        msj: "User updated successfully",
        data: {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role,
          active: response.active,
        },
      });
    } catch (error: any) {
      console.error(`[UserController] Error en update(${id}):`, error);

      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ msj: "Email already in use by another user" });
      }

      return res.status(500).json({
        msj: "Server error",
        error: error.message,
      });
    }
  }

  async delete(req: Request<{id: string}>, res: Response) {

    const { id } = req.params;

    try {
      
      const response = await this.repository.delete(id)

      if(!response){
        return res.status(404).json({
          msj: "User not found",
        })
      }

      return res.status(200).json({
        msj: "User deleted successfully",
        data: {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role,
        }
      })
    } catch (error: any) {
      console.error(`[UserController] Error en delete(${id}):`, error);

      if(error.code === 'P2025'){
        return res.status(404).json({
          msj: "User not found"
        })
      }

      return res.status(500).json({
        msj: "Server error",
        error: error.message
      })
    }
  }
}

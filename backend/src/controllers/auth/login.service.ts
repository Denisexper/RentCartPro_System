import prisma from "../../dataBase/prisma";
import { Request, Response, NextFunction } from "express";
import { LoginInput } from "../../types/auth/auth.type";
import { EncryptService } from "../../services/encrypt.service";

export const LoginControllerService = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return next({ status: 401, message: "Credenciales incorrectas" }); //usamos el middleware
    }

    const isPasswordValid = await EncryptService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return next({ status: 401, message: "Credenciales incorrectas" });
    }

    res.status(200).json({
      ok: true,
      msg: "Bienvenido al sistema RentCar",
      user: {
        id: user.id,
        email: user.email,
        nombre: user.name,
      },
    });
  } catch (error) {
    next(error)
  }
};

import prisma from "../../dataBase/prisma";
import { Request, Response, NextFunction } from "express";
import { RegisterInput } from "../../types/auth/auth.type";
import { EncryptService } from "../../services/encrypt.service";

export const RegisterControllerService = async (req: Request, res: Response, next: NextFunction) => {
    
   const data: RegisterInput = req.body;
   
   try {
    
    const userExist = await prisma.user.findUnique({
        where: {email: data.email}
    })

    if(userExist){
        return next({status: 400, message: "Email already exist"})
    }

    //hashear password
    const hasPass = await EncryptService.hashPassword(data.password)

    const newUser = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hasPass,
            tenantId: data.tenantId,
            role: 'Operator'
        },
        select: {
            id: true,
            email: true,
            name: true,
            tenantId: true,
        }
    })

    return res.status(201).json({
        msj: "User created successfully",
        data: newUser
    })
   } catch (error) {
    next(error)
   }
}
import prisma from "../../dataBase/prisma";
import { Request, Response, NextFunction } from "express";
import { LoginInput, RegisterInput } from "../../types/auth/auth.type";
import { EncryptService } from "../../services/encrypt.service";


export class AuthControllerService {

    async register (req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction){

        const {name, email, password, tenantId} = req.body;

        try {
            
            const userExist = await prisma.user.findUnique({
                where: {email: email},
            });

            if(userExist){
                return next({status: 400, message: "Email already exist"})
            }

            //hashear new password
            const hassPass = await EncryptService.hashPassword(password);

            //crear usuario nuevo
            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hassPass,
                    tenantId: tenantId,
                }
            })

            return res.status(201).json({
                msj: "User created Successfully",
                data: {
                    name: newUser.name,
                    email: newUser.email,
                    tenantId: newUser.tenantId,
                    Role: newUser.role
                }
            })
        } catch (error) {
            next(error)
        }
    }



    async login (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction){

        const {email, password} = req.body;

        try {
            
            // buscar el usuario por el email
            const userExist = await prisma.user.findUnique({
                where: {email: email},
            });

            if(!userExist){
                return next({status: 401, message: "Credenciales incorrectas"})
            }

            const isPasswordValid = await EncryptService.comparePassword(password, userExist.password);

            if(!isPasswordValid){
                return next({status: 401, message: "Credenciales incorrectas"})
            }

            return res.status(200).json({
                msj: "Bienvenido al sistema",
                data: {
                    id: userExist.id,
                    name: userExist.name,
                    email: userExist.email,
                    tenantId: userExist.tenantId,
                    role: userExist.role
                    
                }
            })
        } catch (error) {
            next(error)
        }

    }
}
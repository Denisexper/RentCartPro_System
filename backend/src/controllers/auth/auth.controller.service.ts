import { Request, Response, NextFunction } from "express";
import { LoginInput, RegisterInput } from "../../types/auth/auth.type";
import { EncryptService } from "../../services/encrypt.service";
import { generateToken } from "../../utils/generateToken";
import { AuthRepository } from "../../repositories/auth/auth.repository";


export class AuthControllerService {
    private authRepo: AuthRepository;

    constructor(authRepo: AuthRepository) {
        this.authRepo = authRepo;
    }

    async register(req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction) {
        const { name, email, password, tenantId } = req.body;

        try {
            const userExist = await this.authRepo.findByEmail(email);

            if (userExist) {
                return next({ status: 400, message: "Email already exist" });
            }

            const hashedPass = await EncryptService.hashPassword(password);

            const newUser = await this.authRepo.register({
                name,
                email,
                password: hashedPass,
                tenantId,
            });

            return res.status(201).json({
                msj: "User created Successfully",
                data: {
                    name: newUser.name,
                    email: newUser.email,
                    tenantId: newUser.tenantId,
                    role: newUser.role,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        try {
            const userExist = await this.authRepo.findByEmail(email);

            if (!userExist) {
                return next({ status: 401, message: "Credenciales incorrectas" });
            }

            const isPasswordValid = await EncryptService.comparePassword(password, userExist.password);

            if (!isPasswordValid) {
                return next({ status: 401, message: "Credenciales incorrectas" });
            }

            const token = generateToken({
                id: userExist.id,
                tenantId: userExist.tenantId,
                role: userExist.role,
                email: userExist.email,
            });

            return res.status(200).json({
                msj: "Bienvenido al sistema",
                token,
                data: {
                    id: userExist.id,
                    name: userExist.name,
                    email: userExist.email,
                    tenantId: userExist.tenantId,
                    role: userExist.role,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
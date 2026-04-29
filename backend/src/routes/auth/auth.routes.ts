import { Router, Request, Response, NextFunction } from "express";
import { AuthControllerService } from "../../controllers/auth/auth.controller.service";
import { LoginInput, RegisterInput } from "../../types/auth/auth.type";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../../schemas/auth.schema";
import { authMiddleware } from "../../middlewares/auth.moddleware";
import { authorizeRoles } from "../../middlewares/role.moddleware";

export class AuthRoutes {
    private router: Router;
    private controller: AuthControllerService;

    constructor (
        router: Router,
        controller: AuthControllerService
    ){
        this.router = router,
        this.controller = controller
    }

    initRoutes () {
        this.router.post("/login", validate(loginSchema), (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) => this.controller.login(req, res, next));
        this.router.post("/register", validate(registerSchema), (req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction) => this.controller.register(req, res, next));
        this.router.post("/impersonate/:tenantId", authMiddleware, authorizeRoles("SuperAdmin"), (req: Request<{ tenantId: string }>, res: Response, next: NextFunction) => this.controller.impersonate(req, res, next));

        return this.router;
    }
}
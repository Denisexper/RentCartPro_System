import { Router } from "express";
import { LoginControllerService } from "../../controllers/auth/login.service";
import { RegisterControllerService } from "../../controllers/auth/register.service";

const router = Router();

router.post('/login', LoginControllerService);
router.post('/register', RegisterControllerService);

export default router;

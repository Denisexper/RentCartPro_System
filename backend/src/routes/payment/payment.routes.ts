import { Router, Request, Response } from "express";
import { PaymentControllerService } from "../../controllers/payment/payment.controller.service";

export class PaymentRoutes {

    private router : Router;
    private controller : PaymentControllerService

    constructor (
        router: Router,
        controller: PaymentControllerService
    ){
        this.router = router,
        this.controller = controller
    }

    initRoutes () {

        this.router.get("/:id", (req: Request<{id: string}>, res: Response) => this.controller.getById(req, res))
        this.router.get("/", (req: Request, res: Response) => this.controller.getAll(req, res))
        this.router.post("/", (req: Request, res: Response) => this.controller.create(req, res))

        return this.router;
    }
}
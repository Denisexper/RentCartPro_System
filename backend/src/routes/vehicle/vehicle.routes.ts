import { Router, Request, Response } from "express";
import { VehicleControllerService } from "../../controllers/vehicle/vehicle.controller.service";

export class VehicleRoutes {

    private router : Router;
    private controller : VehicleControllerService;

    constructor (
        router: Router,
        controller: VehicleControllerService
    ){
        this.router = router,
        this.controller = controller
    }

    initRoutes () {

        this.router.get("/:id", (req: Request<{id: string}>, res: Response) => this.controller.getById(req, res))
        this.router.get("/", (req: Request<{}, {}, {}, {tenantId: string}>, res: Response) => this.controller.getAll(req, res))
        this.router.post("/", (req: Request, res: Response) => this.controller.create(req, res))
        this.router.put("/:id", (req: Request<{id: string}, {}, {}, {tenantId: string}>, res: Response) => this.controller.update(req, res))
        this.router.delete("/:id", (req: Request<{id: string}, {}, {}, {tenantId: string}>, res: Response) => this.controller.delete(req, res))

        return this.router;
    }
}
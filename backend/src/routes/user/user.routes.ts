import { UserControllerService } from "../../controllers/user/user.controller.service";
import { Router, Request, Response } from "express";

export class UserRoutes {

    private router : Router;
    private controller : UserControllerService;
    
    constructor (
        router: Router,
        controller : UserControllerService,
        
    ){
        this.router = router
        this.controller = controller
        
    }
    
    initRoutes () {

        this.router.get("/:id", (req: Request<{id: string}>, res: Response) => this.controller.getById(req, res))
        this.router.get("/", (req: Request, res: Response) => this.controller.getAll(req, res))
        this.router.post("/", (req: Request, res: Response) => this.controller.create(req, res))
        this.router.put("/:id", (req: Request<{id: string}>, res: Response) => this.controller.update(req, res))
        this.router.delete("/:id", (req: Request<{id: string}>, res: Response) => this.controller.delete(req, res))


        return this.router;
    }
}
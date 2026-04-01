import { Router, Request, Response, NextFunction } from "express";
import { ClienteControllerService } from "../../controllers/client/client.controller.service";

export class ClientRoutes {
  private router: Router;
  private ClientController: ClienteControllerService;

  constructor(
    router: Router,
    ClientController: ClienteControllerService
    ){
    this.router = router,
    this.ClientController = ClientController;
  }

  initRoutes () {
    this.router.get("/", (req: Request, res: Response) => this.ClientController.getAll(req, res))
    this.router.get("/:id", (req: Request<{id: string}>, res: Response, next: NextFunction) => this.ClientController.getById(req, res, next))
    this.router.post("/", (req: Request, res: Response) => this.ClientController.create(req, res))
    this.router.put("/:id", (req: Request<{id: string}>, res: Response) => this.ClientController.update(req, res))
    this.router.delete("/:id", (req: Request<{id: string}>, res: Response) => this.ClientController.delete(req, res))

    return this.router

  }
    
}

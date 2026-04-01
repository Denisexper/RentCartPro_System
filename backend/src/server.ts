import { PORT } from "./services/enviroments.service";
import express, { Request, Response } from "express";
import { AppRoutes } from "./routes/app.routes";
import { ErrorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

//only for develop mode
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({msj: 'rentCart API funcionando!'})
})

app.use('/api/v1', AppRoutes.routes);
app.use(ErrorMiddleware);


app.listen(PORT, () => {
    console.log(`server up in http://localhost:${PORT}`)
})
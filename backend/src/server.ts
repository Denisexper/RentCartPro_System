import express from "express"
import { PORT } from "./services/enviroments.service";
import { Request, Response } from "express";

const app = express();

app.use(express.json());

//only for develop mode
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({msj: 'rentCart API funcionando!'})
})

app.listen(PORT, () => {
    console.log(`server up in http://localhost:${PORT}`)
})
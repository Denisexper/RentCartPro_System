import express from "express"
import { PORT } from "./services/enviroments.service";

const app = express();

app.listen(PORT, () => {
    console.log(`server up in http://localhost:${PORT}`)
})
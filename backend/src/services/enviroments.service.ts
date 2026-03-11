import { config } from "dotenv";

//dotenv configuration
config();

export const PORT = process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
import { config } from "dotenv";

config();

const requiredEnvVars = [
  "PORT",
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN"
];

requiredEnvVars.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ ERROR: ${env} no está definida en el archivo .env`);
    process.exit(1);
  }
});

export const PORT = process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
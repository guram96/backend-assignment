import "reflect-metadata";

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { AppDataSource } from "./data-source";

const app = express();
const PORT = process.env.PORT || 3000;

// Load Swagger YAML file
const swaggerFilePath = path.join(__dirname, "../swagger.yaml");
const swaggerFile = fs.readFileSync(swaggerFilePath, "utf8");
const swaggerDocument = yaml.load(swaggerFile) as swaggerUi.JsonObject;

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database initialized");
  } catch (error) {
    console.error(error);
  }

  // CORS setup
  app.use(cors());

  // Swagger UI setup
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});

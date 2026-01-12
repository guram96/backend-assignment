import "reflect-metadata";

import express from "express";
import { AppDataSource } from "./data-source";

const app = express();
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database initialized");
  } catch (error) {
    console.error(error);
  }

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
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

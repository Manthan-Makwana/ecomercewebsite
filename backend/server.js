import app from "./app.js";
import dotenv from "dotenv";
import { connectMongoDatabase } from "./config/db.js";
import { seedAdmin, seedProducts } from "./utils/seeder.js";

// Load environment variables
dotenv.config({ path: "backend/config/config.env" });

// Connect MongoDB
await connectMongoDatabase();
await seedAdmin();
await seedProducts();

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});

// restart

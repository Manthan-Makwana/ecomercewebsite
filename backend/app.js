import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import errorMiddleware from "./middleware/error.js";
import user from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Serve local uploaded product images from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", user);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", adminRoutes);

// Error middleware
app.use(errorMiddleware);

export default app;

// trigger restart

// trigger restart 2

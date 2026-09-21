import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "UniTransit backend is running",
    version: "0.3.0"
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "unitransit-backend",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);

export default app;

import express from "express";
import router from "./routes/index.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";

const app = express();

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Routes
app.use("/api", router);

// Error Handler
app.use(errorHandler);

export default app;

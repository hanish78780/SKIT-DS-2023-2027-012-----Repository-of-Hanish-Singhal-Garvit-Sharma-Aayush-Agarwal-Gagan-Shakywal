import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`UniTransit backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

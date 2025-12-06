import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import databaseService from "./services/database.services";
import usersRouter from "./routes/users.routes";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
databaseService.connect().then(() => {
  // Routes
  app.use("/api", usersRouter);

  app.listen(PORT, () => {
    console.log(`🚀 Server TypeScript đang chạy tại http://localhost:${PORT}`);
  });
});

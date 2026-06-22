import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./router/userRouter.js";
import customerRoutes from "./router/costomersRouter.js";
import activityRouter from "./router/activityRouter.js";
import authMiddleware from "./middleware/authMiddleware.js";
import connectDB from "./config/connectDb.js";

const app = express();
// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// User routes
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/activities", activityRouter);
app.use("/api/sales", saleRouter);

// Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn(
        "Warning: MONGO_URI is not set in environment variables. Please set it to connect to MongoDB.",
      );
    }
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

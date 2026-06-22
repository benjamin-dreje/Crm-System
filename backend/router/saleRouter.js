import express from "express";
import { getSales } from "../controllers/saleController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(authMiddleware);
//get sales
router.get("/getSales", getSales);

export default router;

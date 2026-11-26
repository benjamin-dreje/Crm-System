import express from "express";
import { getSales } from "../controllers/saleController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();
router.use(authMiddleware);
//get sales
router.get("/getSales", authAdmin, getSales);

export default router;

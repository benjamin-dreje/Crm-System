import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
// מייבאים בדיוק את הפונקציות שקיימות בקונטרולר של הלקוחות ששלחת עכשיו!
import {
  getCoustomers,
  getCoustomersById,
  createCustomer,
  updateCostomers,
  deleteCustomer,
} from "../controllers/costomersController.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// 🔒 הפעלת האבטחה על כל הנתיבים של הראוטר הזה
router.use(authMiddleware);

// GET /customers/ - קבלת כל הלקוחות מהדאטה-בייס
router.get("/", getCoustomers);

// GET /customers/:id - קבלת לקוח ספציפי לפי ה-ID מה-URL
router.get("/:id", getCoustomersById);

// POST /customers/create - יצירת לקוח חדש (הנתונים מגיעים ב-Body)
router.post("/create", createCustomer);

// PUT /customers/update/:id - עדכון פרטי לקוח קיים לפי ID
router.put("/update/:id", updateCostomers);

router.delete("/delete/:id", authAdmin, deleteCustomer);

export default router;

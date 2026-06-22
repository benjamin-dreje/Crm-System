import express from "express";
import {
  costomersActivity,
  addcostomersActivity,
  updateCustomerStatus,
} from "../controllers/activityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// הפעלת אבטחה גורפת על כל הפעילויות
router.use(authMiddleware);

// GET /activity/:customerId - קבלת היסטוריית פעילות
router.get("/:customerId", costomersActivity);

// POST /activity/:customerId - הוספת פעילות ללקוח (ה-ID מועבר ב-URL)
router.post("/:customerId", addcostomersActivity);

// PUT /activity/:customerId/ - עדכון סטטוס הלקוח
router.put("/:customerId", updateCustomerStatus);
export default router;

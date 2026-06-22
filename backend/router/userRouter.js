import express from "express";
import {
  getUsers,
  createUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authAdmin from "../middleware/authAdmin.js"; // קובץ נפרד

const router = express.Router();

// GET /users/ - שליפת כל המשתמשים
router.get("/", authMiddleware, getUsers);

// POST /users/create - יצירת משתמש חדש
router.post("/create", authMiddleware, authAdmin, createUser);
// POST /users/login - התחברות וקבלת העוגיות
router.post("/login", loginUser);

// POST /users/refresh - חידוש אוטומטי של ה-Access Token
router.post("/refresh", refreshAccessToken);

// POST /users/logout - התנתקות ומחיקת העוגייה הנוכחית
router.post("/logout", logoutUser);

export default router;

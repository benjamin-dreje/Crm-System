import jwt from "jsonwebtoken";

// הסוד של ה-JWT (משתמש בסוד ה-Access הרגיל)
const JWT_SECRET = process.env.JWT_SECRET || "access_secret_key";

// middleware לאימות בקשות מוגנות
export default function authMiddleware(req, res, next) {
  const { cookies, headers } = req;

  // 1) קבלת הטוקן — 🎯 כאן שינינו ל-accessToken!
  const tokenFromCookie = cookies && cookies.accessToken;
  const authHeader = headers && headers.authorization;

  let tokenFromHeader;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    tokenFromHeader = authHeader.split(" ")[1];
  } else {
    tokenFromHeader = null;
  }

  // לקיחת הטוקן שנמצא (או מהעוגיה או מהכותרת)
  const token = tokenFromCookie || tokenFromHeader;

  // 2) אין טוקן — החזר שגיאה
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // אימות הטוקן
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // הוספת המידע של המשתמש ל-req כדי שהקונטרולר יוכל להשתמש בו
    req.user = {
      userId: payload.userId,
      userName: payload.userName || payload.name,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    // אם פג תוקף ה-Access Token (עברו 15 דקות) - השרת יחזיר 401
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

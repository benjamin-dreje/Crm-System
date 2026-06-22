// Middleware שחוסם את הראוט למי שאינו אדמין
export function adminMiddleware(req, res, next) {
  // 1. בדיקה שהמשתמש בכלל עבר את ה-authMiddleware הרגיל וקיים על ה-req
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user information found" });
  }

  // 2. בדיקה האם התפקיד שלו הוא admin
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  // 3. אם הוא אדמין, ממשיכים לקונטרולר!
  next();
}

export default adminMiddleware;

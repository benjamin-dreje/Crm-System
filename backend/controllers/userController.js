import { Users } from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await Users.find({}).select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a user
export const createUser = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existUser = await Users.findOne({
      $or: [{ email }, { phone }],
    });
    if (existUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      name,
      phone,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 1️⃣ יצירת ה-Access Token (תוקף קצר - 15 דקות)
    const accessToken = jwt.sign(
      {
        userId: user._id,
        userName: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "access_secret_key",
      { expiresIn: "15m" },
    );

    // 2️⃣ יצירת ה-Refresh Token (תוקף ארוך - 7 ימים)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || "refresh_secret_key",
      { expiresIn: "7d" },
    );

    // 3️⃣ שמירת ה-Refresh Token בתוך מערך בדאטה-בייס (תומך בריבוי מכשירים)
    if (!user.refreshToken || !Array.isArray(user.refreshToken)) {
      user.refreshToken = [];
    }

    // לוקח את 2 הטוקנים האחרונים ומוסיף את הטוקן החדש (סך הכל תמיד מקסימום 3)
    // user.refreshToken = [...user.refreshToken.slice(-2), refreshToken];
const lastTwo = user.refreshToken.slice(-2);
lastTwo.push(refreshToken);
user.refreshToken = lastTwo;
    await user.save();

    // 4️⃣ הגדרת ה-Cookies (שתיהן httpOnly ומאובטחות!)
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 דקות
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ימים
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/api/users/refresh", // חשוב להגביל את ה-Refresh Token רק לנתיב החידוש שלו
    });

    res.status(200).json({
      message: "Login successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 חידוש אוטומטי של ה-Access Token (תומך במערך טוקנים)
export const refreshAccessToken = async (req, res) => {
  try {
    const { cookies } = req;
    // 1. שליפת ה-Refresh Token מהעוגיות
    const refreshToken = cookies && cookies.refreshToken;

    // const { refreshToken } = req.cookies || {};

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // 2. אימות חתימת הטוקן מול הסוד של ה-Refresh
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refresh_secret_key",
    );

    // 3. שליפת המשתמש ובדיקה שהטוקן הספציפי הזה אכן קיים בתוך המערך שלו
    const user = await Users.findById(payload.userId);

    if (
      !user ||
      !user.refreshToken ||
      !user.refreshToken.includes(refreshToken)
    ) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // 4. הכל תקין! מייצרים Access Token חדש ורענן לעוד 15 דקות
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        userName: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "access_secret_key",
      { expiresIn: "15m" },
    );

    // 5. שולחים את ה-Access Token החדש בעוגייה מעודכנת
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 דקות
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    // אם ה-Refresh Token עצמו פג תוקף (עברו 7 ימים) או זויף - המשתמש חייב לעשות לוגין מחדש
    return res
      .status(401)
      .json({ message: "Refresh token expired, please login again" });
  }
};

// 🚪 התנתקות מהמערכת (Logout - מוחק רק את הטוקן הנוכחי מהמערך)
export const logoutUser = async (req, res) => {
  try {
    const { cookies } = req;
    const refreshToken = cookies && cookies.refreshToken;

    if (refreshToken) {
      // מחיקת הטוקן הספציפי הזה בלבד מתוך מערך הטוקנים בדאטה-בייס ($pull)
      await Users.findOneAndUpdate(
        { refreshToken: refreshToken },
        { $pull: { refreshToken: refreshToken } },
        { returnDocument: "after" },
      );
    }

    // מחיקת שתי העוגיות מהדפדפן/פוסטמן על ידי פקיעת התוקף שלהן מיידית
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

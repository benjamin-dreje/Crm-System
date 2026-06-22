export function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user information found" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  next();
}

export default adminMiddleware;

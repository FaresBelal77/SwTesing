const jwt = require("jsonwebtoken");

const extractToken = (req = {}) => {
  // 1. From cookies
  if (req.cookies?.token) return req.cookies.token;

  // 2. From Authorization: Bearer <token>
  const authHeader =
    req.headers?.authorization || req.headers?.Authorization;

  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  // 3. x-access-token / x-auth-token
  return req.headers["x-access-token"] || req.headers["x-auth-token"] || null;
};

module.exports = function authenticationMiddleware(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  const secretKey =  "1234";

  if (!secretKey) {
    return res.status(500).json({
      message: "Server misconfiguration: SECRET_KEY missing",
    });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({
        message: "Invalid or expired token",
        error: error.message,
      });
    }

    req.user = decoded; // Attach user data
    next();
  });
};

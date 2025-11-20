const jwt = require("jsonwebtoken");

const extractToken = (req = {}) => {
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  const headers = req.headers || {};
  const authHeader = headers.authorization || headers.Authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  const token = headers["x-access-token"] || headers["x-auth-token"];
  if (token) {
    return token;
  }

  return null;
};

module.exports = function authenticationMiddleware(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    return res
      .status(500)
      .json({ message: "Server misconfiguration: SECRET_KEY missing" });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: error.message });
    }

    req.user = decoded;
    next();
  });
};
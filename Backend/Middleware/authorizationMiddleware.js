module.exports = function authorizationMiddleware(allowedRoles = []) {
  const normalizedAllowed = allowedRoles.map((role) =>
    role.trim().toLowerCase()
  );

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }

    const userRole = req.user.role.trim().toLowerCase();

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }

    next();
  };
};
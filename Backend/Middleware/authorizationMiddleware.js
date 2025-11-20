module.exports = function authorizationMiddleware(allowedRoles = []) {
    return (req, res, next) => {
      console.log('Authorization middleware - Full request:', {
        user: req.user,
        allowedRoles: allowedRoles,
        userRole: req.user?.role
      });
  
      // Ensure user is attached to the request
      if (!req.user || !req.user.role) {
        console.log('Authorization failed: No user or role found');
        return res.status(401).json({ message: "Unauthorized: No user info" });
      }
  
      const trimmedRole = req.user.role.trim(); // Remove accidental spaces
      const allowed = allowedRoles.map(role => role.trim());
  
      console.log('Authorization check:', {
        trimmedRole,
        allowed,
        isAllowed: allowed.includes(trimmedRole)
      });
  
      if (!allowed.includes(trimmedRole)) {
        console.log('Authorization failed:', { 
          trimmedRole, 
          allowed,
          userRole: req.user.role,
          allowedRoles: allowedRoles
        });
        return res.status(403).json({ message: "Access denied: Unauthorized role" });
      }
  
      next();
    };
  };
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY||'1234'

module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;
  console.log('secretKey type:', typeof secretKey);


  console.log('SECRET_KEY:', secretKey);  
  console.log('inside auth middleware')

  if (!cookie) {
    return res.status(401).json({ message: "No Cookie provided" });
  }
  const token = cookie.token;
  if (!token) {
    return res.status(405).json({ message: "No token provided" });
  }
console.log('Token:', token);

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: error.message});
    }
    
    console.log("Decoded JWT payload:", decoded); 
    req.user = decoded;
    next();
  });
};
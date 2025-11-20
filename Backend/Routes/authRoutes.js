const express = require("express");
const router = express.Router();
const { register, login, forgetPassword, logout } = require("../Controllers/authController");
//const authMiddleware = require("../Middleware/authenticationMiddleware");

router.get("/", (req, res) => {
    res.send("Welcome User :)");
})
router.post("/login", login);
router.post("/register", register);
router.put("/forgetPassword", forgetPassword);
router.post("/logout", logout);



module.exports = router;
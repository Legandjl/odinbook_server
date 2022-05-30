const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth_controller");

//login
router.post("/login", auth_controller.login);
// signup
router.post("/signup", auth_controller.signup);

module.exports = router;

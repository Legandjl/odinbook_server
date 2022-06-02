const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user_controller");

//search users
router.get("/search/", user_controller.search_users);
// get specific user by id
router.get("/:id", user_controller.get_user);

module.exports = router;

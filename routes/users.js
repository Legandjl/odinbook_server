const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user_controller");

//search users
router.get("/search/", user_controller.search_users);

// get specific user by id
router.get("/:id", user_controller.get_user);

/*
//UPDATE user by id

router.put("/:id", user_controller.update_user);

//DEL user by id

router.delete("/:id", user_controller.delete_user); */

// router.post("/handlelike/:id", user_controller.handle_like);

module.exports = router;

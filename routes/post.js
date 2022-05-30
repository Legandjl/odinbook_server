const express = require("express");
const router = express.Router();
const post_controller = require("../controllers/post_controller");

// create new post
router.post("/", post_controller.create_post);

//get post by id
router.get("/:id", post_controller.get_post);

//update post by id
router.put("/:id", post_controller.update_post);

//delete post by id
router.delete("/:id", post_controller.delete_post);

//get home posts
router.get("/all/:skip", post_controller.get_home_posts);

// get user wall posts
router.get("/wall/:skip", post_controller.get_wall_posts);

module.exports = router;

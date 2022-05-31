const express = require("express");
const router = express.Router();
const post_controller = require("../controllers/post_controller");
const comment_controller = require("../controllers/comment_controller");

// create new post
router.post("/", post_controller.create_post);

//get post by id
router.get("/:id", post_controller.get_post);

//update post by id
router.put("/:id", post_controller.update_post);

//delete post by id
router.delete("/:id", post_controller.delete_post);

//get posts to populate home
router.get("/all/:skip", post_controller.get_home_posts);

// get posts to populate wall
router.get("/wall/:skip", post_controller.get_wall_posts);

//get comments by post id
router.get("/comments/:id", comment_controller.get_post_comments);

//post comment to post by id
router.post("/comment/:id", comment_controller.post_comment);

module.exports = router;

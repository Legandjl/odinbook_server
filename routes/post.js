const express = require("express");
const router = express.Router();
const post_controller = require("../controllers/post_controller");

//GET post by id
router.get("/:id", post_controller.get_post);

//UPDATE post by id

router.put("/:id", post_controller.update_post);

//DEL post by id

router.delete("/:id", post_controller.delete_post);

module.exports = router;

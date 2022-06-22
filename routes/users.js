const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user_controller");

//search users
router.get("/search/", user_controller.search_users);
//get all friend requests for user
router.get("/friend_request", user_controller.get_friend_requests);
// get specific user by id
router.get("/:id", user_controller.get_user);
//remove friend by id
router.delete("/friend/:id", user_controller.remove_friend);
//send friend req
router.post("/friend_request", user_controller.send_friend_req);
// handle friend req
router.post("/friend_request/:id", user_controller.handle_friend_req);
// check fr
router.get("/friend_request/:id", user_controller.check_friend_req);
//cancel fr
router.delete("/friend_request/:id", user_controller.cancel_friend_req);
module.exports = router;

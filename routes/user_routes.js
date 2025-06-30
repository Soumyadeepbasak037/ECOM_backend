const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller");
const auth_middleware = require("../middleware/authmiddleware");

router.get("/profile", auth_middleware, userController.get_profile);
router.get("/users", auth_middleware, userController.get_all_users);
// router.delete("/user/:id", auth_middleware, userController.delete_user);

module.exports = router;

const express = require("express");
const router = express.Router();
const order_controller = require("../controllers/ordercontroller");
const auth_middleware = require("../middleware/authmiddleware");

router.post("/add_to_cart", auth_middleware, order_controller.add_to_cart);
router.get("/cart", auth_middleware, order_controller.get_cart);
router.post("/place_order", auth_middleware, order_controller.placeOrder);
router.get("/get_orders", auth_middleware, order_controller.get_user_orders);
module.exports = router;

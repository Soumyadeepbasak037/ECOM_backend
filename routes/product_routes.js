const express = require("express");
const router = express.Router();
const productController = require("../controllers/productcontroller");
const auth_middleware = require("../middleware/authmiddleware");

// Public routes
router.get("/", productController.get_all_products);
router.post("/get_prod", productController.get_product_by_id);

// Admin-only routes
router.post("/create", auth_middleware, productController.create_product);
router.put("/update", auth_middleware, productController.update_product);
router.delete("/delete", auth_middleware, productController.deleteProduct);

module.exports = router;

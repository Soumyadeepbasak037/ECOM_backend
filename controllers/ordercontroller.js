const db = require("../config/db");

exports.placeOrder = (req, res) => {
  const userId = req.user.id;

  // Get cart items
  const cartItems = db
    .prepare(
      `
    SELECT c.product_id, c.quantity, p.price
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `
    )
    .all(userId);

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }
};

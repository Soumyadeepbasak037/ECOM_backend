const db = require("../config/db");

exports.placeOrder = (req, res) => {
  const userId = req.user.id;

  // Get cart items
  const cart_items = db
    .prepare(
      `
    SELECT c.product_id, c.quantity, p.price
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `
    )
    .all(userId);

  if (cart_items.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Create oder
  const order_stmt = db.prepare(`
    INSERT INTO orders (user_id, total_price) VALUES (?, ?)
  `);
  const order_result = order_stmt.run(userId, totalPrice);
  const orderId = order_result.lastInsertRowid;

  // add items
  const order_item_stmt = db.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `);
};

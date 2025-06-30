const db = require("../config/db");

exports.add_to_card = (req, res) => {
  const user_id = req.body.id;
  const product_id = req.body.product_id;
  const quantity = req.body.qty;

  const product = db
    .prepare(`SELECT * FROM products WHERE id = ?`)
    .get(product_id);

  if (!product) {
    return res.status(400).json("invalid product id");
  }

  const existing = db
    .prepare(
      `
    SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?
  `
    )
    .get(user_id, product_id);

  if (existing) {
    const stmt = db
      .prepare(
        `  UPDATE cart_items SET quantity = quantity + ?
      WHERE user_id = ? AND product_id = ?`
      )
      .run(quantity, user_id, product_id);
    res.json("Product already in cary quantity increased");
  } else {
    db.prepare(
      `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
    `
    ).run(user_id, product_id, quantity);
  }

  res.json({ message: "Product added to cart" });
};

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

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      order_item_stmt.run(orderId, item.product_id, item.quantity, item.price);
    }
  });
  insertMany(cart_items);
};

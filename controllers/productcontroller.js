const db = require("../config/db");

exports.get_all_products = (req, res) => {
  const products = db.prepare(`SELECT * FROM products`).all();
  res.json(products);
};

exports.get_product_by_id = (req, res) => {
  console.log(req.body.id);
  const id = req.body.id;
  const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

exports.create_product = (req, res) => {
  const { name, description, price, stock, image_url } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, stock, image_url)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(name, description, price, stock ?? 0, image_url);

  res
    .status(201)
    .json({ message: "Product added", product_id: result.lastInsertRowid });
};

exports.update_product = (req, res) => {
  if (req.user.is_admin) {
    const { id, name, description, price, stock, image_url } = req.body;

    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    db.prepare(
      `
        UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ?
        WHERE id = ?
      `
    ).run(name, description, price, stock, image_url, id);

    res.json({ message: "Product updated" });
  } else {
    res.status(403).json("Access Forbidden");
  }
};

exports.deleteProduct = (req, res) => {
  if (req.user.is_admin) {
    const id = req.body.id;
    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    db.prepare(`DELETE FROM products WHERE id = ?`).run(id);
    res.json({ message: "Product deleted" });
  } else {
    res.status(403).json("Access Forbidden");
  }
};

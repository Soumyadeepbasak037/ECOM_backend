const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to ECOM App");
});

const authRoutes = require("../e_com_backend/routes/authroutes");
const userRoutes = require("../e_com_backend/routes/user_routes");
const productRoutes = require("../e_com_backend/routes/product_routes");
const orderRoutes = require("../e_com_backend/routes/order_routes");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

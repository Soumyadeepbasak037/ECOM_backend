const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const Joi = require("joi");

//REGISTER SCHEMA

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

exports.register = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const { error } = registerSchema.validate({ username, password, email });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const hashed_passwd = bcrypt.hashSync(password, 10);
  try {
    const result = db
      .prepare(`INSERT INTO users (username,password,email) VALUES (?,?,?)`)
      .run(username, hashed_passwd, email);
    const user_id = result.lastInsertRowid;
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }
  }
};

//LOGIN SCHEMA

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});
SECRET_KEY = "hehe"; // to be moved into .env
exports.login = (req, res, next) => {
  const { username, password, email } = req.body;

  try {
    const user = db
      .prepare(`SELECT * FROM users where username=?`)
      .get(username);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

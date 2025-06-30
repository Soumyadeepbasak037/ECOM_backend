const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const Joi = require("joi");

exports.get_profile = (req, res) => {
  const user_id = req.user.id;
  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user_id);
  res.json(user);
};

exports.get_all_users = (req, res, next) => {
  if (req.user.is_admin) {
    try {
      const users = db.prepare(`SELECT * FROM users`).all();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403);
  }
};

exports.delete_user = (req, res, next) => {
  const del_id = req.body.id;
  if (req.user.is_admin) {
    try {
      const stat = db.prepare(`DELETE FROM users WHERE id = ?`).run(del_id);
      res.json("User deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

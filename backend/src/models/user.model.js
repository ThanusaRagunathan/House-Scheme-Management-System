import db from "../config/db.js";

export const findUserByUsername = async (username) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  return rows[0];
};

export const createUser = async (username, password, role, email = null, phone = null) => {
  const [result] = await db.query(
    "INSERT INTO users (username, password, role, email, phone) VALUES (?, ?, ?, ?, ?)",
    [username, password, role, email, phone]
  );
  return result.insertId;
};

export const findUserByPhone = async (phone) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE phone = ?",
    [phone]
  );
  return rows[0];
};

export const updatePassword = async (userId, hashedPassword) => {
  const [result] = await db.query(
    "UPDATE users SET password = ? WHERE user_id = ?",
    [hashedPassword, userId]
  );
  return result.affectedRows > 0;
};

export const findUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [id]
  );
  return rows[0];
};

export const updateUser = async (id, data) => {
  const [result] = await db.query(
    "UPDATE users SET username = ?, phone = ? WHERE user_id = ?",
    [data.username, data.phone, id]
  );
  return result.affectedRows > 0;
};

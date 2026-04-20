import db from "../config/db.js";

export const findUserByUsername = async (username) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE username = ? AND is_deleted = 0",
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
    "SELECT * FROM users WHERE phone = ? AND is_deleted = 0",
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
    "SELECT * FROM users WHERE user_id = ? AND is_deleted = 0",
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

export const deleteUser = async (id, connection = null) => {
  const query = "UPDATE users SET is_deleted = 1, username = CONCAT(username, '_del_', ?) WHERE user_id = ?";
  const params = [Date.now(), id];
  const [result] = connection ? await connection.query(query, params) : await db.query(query, params);
  return result.affectedRows > 0;
};

export const getAllUserIds = async () => {
  const [rows] = await db.query("SELECT user_id FROM users WHERE is_deleted = 0");
  return rows.map((row) => row.user_id);
};

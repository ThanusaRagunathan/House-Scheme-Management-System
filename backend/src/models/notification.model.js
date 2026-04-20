import db from "../config/db.js";

export const getAllNotifications = async (userId = null) => {
  let query = "SELECT * FROM notifications WHERE is_deleted = 0";
  const params = [];
  
  if (userId) {
    query += " AND user_id = ?";
    params.push(userId);
  }
  
  query += " ORDER BY date DESC";
  const [rows] = await db.query(query, params);
  return rows;
};

export const getNotificationById = async (notificationId) => {
  const [rows] = await db.query(
    "SELECT * FROM notifications WHERE notification_id = ? AND is_deleted = 0",
    [notificationId]
  );
  return rows[0];
};

export const createNotification = async (userId, title, description, status = "New", type = "General") => {
  const [result] = await db.query(
    "INSERT INTO notifications (user_id, title, description, status, type) VALUES (?, ?, ?, ?, ?)",
    [userId, title, description, status, type]
  );
  return result.insertId;
};

export const updateNotification = async (notificationId, status) => {
  const [result] = await db.query(
    "UPDATE notifications SET status = ? WHERE notification_id = ?",
    [status, notificationId]
  );
  return result.affectedRows > 0;
};

export const deleteNotification = async (notificationId) => {
  const [result] = await db.query(
    "UPDATE notifications SET is_deleted = 1 WHERE notification_id = ?",
    [notificationId]
  );
  return result.affectedRows > 0;
};

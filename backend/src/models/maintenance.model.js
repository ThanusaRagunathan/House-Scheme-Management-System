import db from "../config/db.js";

export const getAllMaintenance = async (houseId = null) => {
  let query = `
    SELECT m.*, h.reference_code AS house_code
    FROM maintenance_tasks m
    LEFT JOIN houses h ON m.house_id = h.house_id
  `;
  const params = [];
  
  if (houseId) {
    query += " WHERE m.house_id = ?";
    params.push(houseId);
  }
  
  query += " ORDER BY m.scheduled_date DESC";
  const [rows] = await db.query(query, params);
  return rows;
};

export const getMaintenanceById = async (taskId) => {
  const [rows] = await db.query(
    `SELECT m.*, h.reference_code AS house_code 
     FROM maintenance_tasks m 
     LEFT JOIN houses h ON m.house_id = h.house_id 
     WHERE m.task_id = ?`,
    [taskId]
  );
  return rows[0];
};

export const createMaintenance = async (houseId, description, cost, taskStatus, scheduledDate) => {
  const [result] = await db.query(
    "INSERT INTO maintenance_tasks (house_id, description, cost, task_status, scheduled_date) VALUES (?, ?, ?, ?, ?)",
    [houseId, description, cost, taskStatus, scheduledDate]
  );
  return result.insertId;
};

export const updateMaintenance = async (taskId, description, cost, taskStatus, completionDate) => {
  const [result] = await db.query(
    "UPDATE maintenance_tasks SET description = ?, cost = ?, task_status = ?, completion_date = ? WHERE task_id = ?",
    [description, cost, taskStatus, completionDate, taskId]
  );
  return result.affectedRows > 0;
};

export const deleteMaintenance = async (taskId) => {
  const [result] = await db.query(
    "DELETE FROM maintenance_tasks WHERE task_id = ?",
    [taskId]
  );
  return result.affectedRows > 0;
};

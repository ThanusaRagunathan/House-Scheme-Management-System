import db from "../config/db.js";

export const getAllMaintenance = async (houseId = null) => {
  let query = `
    SELECT m.*, m.task_id AS id, h.reference_code AS house_code
    FROM maintenance_tasks m
    LEFT JOIN houses h ON m.house_id = h.house_id
    WHERE m.is_deleted = 0
  `;
  const params = [];
  
  if (houseId) {
    query += " AND m.house_id = ?";
    params.push(houseId);
  }
  
  query += " ORDER BY m.scheduled_date DESC";
  const [rows] = await db.query(query, params);
  return rows;
};

export const getMaintenanceByUserId = async (userId) => {
  const [rows] = await db.query(
    `-- Tenant's own house maintenance
     SELECT m.task_id, m.house_id, m.facility, m.description, 0 as cost, m.task_status, m.scheduled_date, m.completion_date, m.category, h.reference_code AS house_code
     FROM maintenance_tasks m
     JOIN houses h ON m.house_id = h.house_id
     JOIN tenancies ten ON ten.house_id = h.house_id
     JOIN Tenants t ON ten.Tenant_id = t.Tenant_id
     WHERE t.user_id = ? AND m.is_deleted = 0 AND ten.is_deleted = 0
     UNION ALL
     -- Shared facility maintenance (no specific house)
     SELECT m.task_id, m.house_id, m.facility, m.description, 0 as cost, m.task_status, m.scheduled_date, m.completion_date, m.category, NULL AS house_code
     FROM maintenance_tasks m
     WHERE m.house_id IS NULL AND m.is_deleted = 0
     ORDER BY scheduled_date DESC`,
    [userId]
  );
  return rows;
};

export const getMaintenanceById = async (taskId) => {
  const [rows] = await db.query(
    `SELECT m.*, h.reference_code AS house_code 
     FROM maintenance_tasks m 
     LEFT JOIN houses h ON m.house_id = h.house_id 
     WHERE m.task_id = ? AND m.is_deleted = 0`,
    [taskId]
  );
  return rows[0];
};

export const createMaintenance = async (houseId, description, cost, taskStatus, scheduledDate, facility = null, category = 'Maintenance') => {
  const [result] = await db.query(
    "INSERT INTO maintenance_tasks (house_id, description, cost, task_status, scheduled_date, facility, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [houseId || null, description, cost, taskStatus, scheduledDate, facility, category]
  );
  return result.insertId;
};

export const updateMaintenance = async (taskId, description, cost, taskStatus, completionDate, facility = null, category = 'Maintenance') => {
  const [result] = await db.query(
    "UPDATE maintenance_tasks SET description = ?, cost = ?, task_status = ?, completion_date = ?, facility = ?, category = ? WHERE task_id = ?",
    [description, cost, taskStatus, completionDate, facility, category, taskId]
  );
  return result.affectedRows > 0;
};

export const deleteMaintenance = async (taskId) => {
  const [result] = await db.query(
    "UPDATE maintenance_tasks SET is_deleted = 1 WHERE task_id = ?",
    [taskId]
  );
  return result.affectedRows > 0;
};

import db from "../config/db.js";

export const getAllComplaints = async (tenancyId = null) => {
  let query = "SELECT * FROM complaints";
  const params = [];
  
  if (tenancyId) {
    query += " WHERE tenancy_id = ?";
    params.push(tenancyId);
  }
  
  query += " ORDER BY submitted_date DESC";
  const [rows] = await db.query(query, params);
  return rows;
};

export const getComplaintById = async (complaintId) => {
  const [rows] = await db.query(
    "SELECT * FROM complaints WHERE complaint_id = ?",
    [complaintId]
  );
  return rows[0];
};

export const createComplaint = async (tenancyId, title, description, status) => {
  const [result] = await db.query(
    "INSERT INTO complaints (tenancy_id, title, description, status) VALUES (?, ?, ?, ?)",
    [tenancyId, title, description, status]
  );
  return result.insertId;
};

export const updateComplaint = async (complaintId, status, response, resolvedDate = null) => {
  const [result] = await db.query(
    "UPDATE complaints SET status = ?, response = ?, resolved_date = ? WHERE complaint_id = ?",
    [status, response, resolvedDate, complaintId]
  );
  return result.affectedRows > 0;
};

export const deleteComplaint = async (complaintId) => {
  const [result] = await db.query(
    "DELETE FROM complaints WHERE complaint_id = ?",
    [complaintId]
  );
  return result.affectedRows > 0;
};

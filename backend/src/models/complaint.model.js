import db from "../config/db.js";

export const getAllComplaints = async (tenancyId = null) => {
  let query = `
    SELECT c.*, c.complaint_id AS id, h.reference_code AS house_code, t.full_name AS tenant_name, h.address AS houseAddress
    FROM complaints c
    LEFT JOIN tenancies tn ON c.tenancy_id = tn.tenancy_id
    LEFT JOIN houses h ON tn.house_id = h.house_id
    LEFT JOIN Tenants t ON tn.Tenant_id = t.Tenant_id
    WHERE c.is_deleted = 0
  `;
  const params = [];
  
  if (tenancyId) {
    query += " AND c.tenancy_id = ?";
    params.push(tenancyId);
  }
  
  query += " ORDER BY c.submitted_date DESC";
  const [rows] = await db.query(query, params);
  return rows;
};

export const getComplaintById = async (complaintId, tenancyId = null) => {
  let query = `
    SELECT c.*, c.complaint_id AS id, h.reference_code AS house_code, t.full_name AS TenantName, h.address AS houseAddress
    FROM complaints c
    LEFT JOIN tenancies tn ON c.tenancy_id = tn.tenancy_id
    LEFT JOIN houses h ON tn.house_id = h.house_id
    LEFT JOIN Tenants t ON tn.Tenant_id = t.Tenant_id
    WHERE c.complaint_id = ? AND c.is_deleted = 0
  `;
  const params = [complaintId];

  if (tenancyId) {
    query += " AND c.tenancy_id = ?";
    params.push(tenancyId);
  }

  const [rows] = await db.query(query, params);
  return rows[0];
};

export const createComplaint = async (tenancyId, title, description, status, attachmentUrl = null) => {
  const [result] = await db.query(
    "INSERT INTO complaints (tenancy_id, title, description, status, attachment_url) VALUES (?, ?, ?, ?, ?)",
    [tenancyId, title, description, status, attachmentUrl]
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
    "UPDATE complaints SET is_deleted = 1 WHERE complaint_id = ?",
    [complaintId]
  );
  return result.affectedRows > 0;
};

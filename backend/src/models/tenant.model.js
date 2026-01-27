import db from "../config/db.js";

export const getAllTenants = async () => {
  const [rows] = await db.query(
    `SELECT t.*, u.username, u.email, u.phone, h.address 
     FROM tenants t
     JOIN users u ON t.user_id = u.user_id
     LEFT JOIN tenancies ten ON t.tenant_id = ten.tenant_id
     LEFT JOIN houses h ON ten.house_id = h.house_id`
  );
  return rows;
};

export const getTenantById = async (tenantId) => {
  const [rows] = await db.query(
    `SELECT t.*, u.username, u.email, u.phone 
     FROM tenants t
     JOIN users u ON t.user_id = u.user_id
     WHERE t.tenant_id = ?`,
    [tenantId]
  );
  return rows[0];
};

export const createTenant = async (userId, occupation, dateOfBirth) => {
  const [result] = await db.query(
    "INSERT INTO tenants (user_id, occupation, date_of_birth) VALUES (?, ?, ?)",
    [userId, occupation, dateOfBirth]
  );
  return result.insertId;
};

export const updateTenant = async (tenantId, occupation, dateOfBirth) => {
  const [result] = await db.query(
    "UPDATE tenants SET occupation = ?, date_of_birth = ? WHERE tenant_id = ?",
    [occupation, dateOfBirth, tenantId]
  );
  return result.affectedRows > 0;
};

export const deleteTenant = async (tenantId) => {
  const [result] = await db.query(
    "DELETE FROM tenants WHERE tenant_id = ?",
    [tenantId]
  );
  return result.affectedRows > 0;
};

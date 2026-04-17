import db from "../config/db.js";

export const getAllHouses = async (ownerId = null) => {
  let query = `
    SELECT 
      h.house_id as id, 
      h.house_id,
      h.reference_code as referenceCode,
      h.address, 
      h.rooms, 
      h.rent_amount as rent, 
      h.status, 
      h.owner_id,
      u.username as owner
    FROM houses h
    JOIN users u ON h.owner_id = u.user_id
  `;
  const params = [];

  if (ownerId) {
    query += " WHERE h.owner_id = ?";
    params.push(ownerId);
  }

  const [rows] = await db.query(query, params);
  return rows;
};

export const getHouseById = async (houseId) => {
  const [rows] = await db.query(
    `SELECT 
      h.house_id as id, 
      h.house_id,
      h.reference_code as referenceCode,
      h.address, 
      h.rooms, 
      h.rent_amount as rent, 
      h.status, 
      h.owner_id,
      u.username as owner
    FROM houses h
    JOIN users u ON h.owner_id = u.user_id
    WHERE h.house_id = ?`,
    [houseId]
  );

  if (rows.length === 0) return null;
  const house = rows[0];

  // Get current Tenant
  const [TenantRows] = await db.query(
    `SELECT u.username 
     FROM tenancies t 
     JOIN Tenants tn ON t.Tenant_id = tn.Tenant_id
     JOIN users u ON tn.user_id = u.user_id
     WHERE t.house_id = ? AND (t.end_date IS NULL OR t.end_date > CURDATE())
     LIMIT 1`,
    [houseId]
  );
  house.Tenant = TenantRows.length > 0 ? TenantRows[0].username : "No active Tenant";

  // Get history (payments)
  const [paymentRows] = await db.query(
    `SELECT p.paid_date as date, 'Payment' as type, p.amount, p.status
     FROM payments p
     JOIN tenancies t ON p.tenancy_id = t.tenancy_id
     WHERE t.house_id = ?
     ORDER BY p.paid_date DESC
     LIMIT 5`,
    [houseId]
  );
  house.history = paymentRows;

  return house;
};

export const createHouse = async (referenceCode, address, rooms, rentAmount, status, ownerId) => {
  const [result] = await db.query(
    "INSERT INTO houses (reference_code, address, rooms, rent_amount, status, owner_id) VALUES (?, ?, ?, ?, ?, ?)",
    [referenceCode, address, rooms, rentAmount, status, ownerId]
  );
  return result.insertId;
};

export const updateHouse = async (houseId, referenceCode, address, rooms, rentAmount, status) => {
  const [result] = await db.query(
    "UPDATE houses SET reference_code = ?, address = ?, rooms = ?, rent_amount = ?, status = ? WHERE house_id = ?",
    [referenceCode, address, rooms, rentAmount, status, houseId]
  );
  return result.affectedRows > 0;
};

export const deleteHouse = async (houseId) => {
  const [result] = await db.query(
    "DELETE FROM houses WHERE house_id = ?",
    [houseId]
  );
  return result.affectedRows > 0;
};

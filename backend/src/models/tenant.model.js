import db from "../config/db.js";

export const getAllTenants = async () => {
  const [rows] = await db.query(
    `SELECT t.*, t.Tenant_id as id, u.username, u.email, u.phone, 
            t.full_name as name, t.nic,
            ten.start_date as startDate, ten.end_date as endDate,
            h.address as houseAddress, h.house_id as houseId, h.reference_code as houseCode
     FROM Tenants t
     JOIN users u ON t.user_id = u.user_id
     LEFT JOIN tenancies ten ON t.Tenant_id = ten.Tenant_id
     LEFT JOIN houses h ON ten.house_id = h.house_id`
  );
  return rows;
};

export const getTenantById = async (TenantId) => {
  const [rows] = await db.query(
    `SELECT t.*, t.Tenant_id as id, u.username, u.email, u.phone 
     FROM Tenants t
     JOIN users u ON t.user_id = u.user_id
     WHERE t.Tenant_id = ?`,
    [TenantId]
  );
  return rows[0];
};

export const createTenant = async (userId, fullName, nic, occupation, dateOfBirth) => {
  const [result] = await db.query(
    "INSERT INTO Tenants (user_id, full_name, nic, occupation, date_of_birth) VALUES (?, ?, ?, ?, ?)",
    [userId, fullName, nic, occupation, dateOfBirth]
  );
  return result.insertId;
};

export const updateTenant = async (TenantId, occupation, dateOfBirth, nic, phone, email, houseCode) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update Tenants table
    const [result] = await connection.query(
      "UPDATE Tenants SET occupation = ?, date_of_birth = ?, nic = ? WHERE Tenant_id = ?",
      [occupation, dateOfBirth, nic, TenantId]
    );

    // 2. Get user_id
    const [tenantRows] = await connection.query("SELECT user_id FROM Tenants WHERE Tenant_id = ?", [TenantId]);
    if (tenantRows.length > 0) {
      const userId = tenantRows[0].user_id;
      // 3. Update users table with phone and email
      await connection.query(
        "UPDATE users SET phone = ?, email = ? WHERE user_id = ?",
        [phone, email, userId]
      );
    }

    // 4. Update House Allocation if houseCode is provided
    if (houseCode) {
      const [houseRows] = await connection.query("SELECT house_id FROM houses WHERE reference_code = ? OR house_id = ?", [houseCode, houseCode]);
      if (houseRows.length > 0) {
        const houseId = houseRows[0].house_id;

        // Check if there's an existing active tenancy
        const [tenancyRows] = await connection.query("SELECT * FROM tenancies WHERE Tenant_id = ?", [TenantId]);
        
        if (tenancyRows.length === 0) {
          // No current tenancy, create one
          const start = new Date();
          const end = new Date(start);
          end.setFullYear(end.getFullYear() + 1);
          await connection.query("INSERT INTO tenancies (Tenant_id, house_id, start_date, end_date) VALUES (?, ?, ?, ?)", [TenantId, houseId, start.toISOString().split('T')[0], end.toISOString().split('T')[0]]);
          await connection.query("UPDATE houses SET status = 'Occupied' WHERE house_id = ?", [houseId]);
        } else if (tenancyRows[0].house_id !== houseId) {
          // Re-allocating to a new house. Set old house to vacant, new to occupied
          await connection.query("UPDATE houses SET status = 'Vacant' WHERE house_id = ?", [tenancyRows[0].house_id]);
          await connection.query("UPDATE tenancies SET house_id = ? WHERE Tenant_id = ?", [houseId, TenantId]);
          await connection.query("UPDATE houses SET status = 'Occupied' WHERE house_id = ?", [houseId]);
        }
      }
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteTenant = async (TenantId) => {
  const [result] = await db.query(
    "DELETE FROM Tenants WHERE Tenant_id = ?",
    [TenantId]
  );
  return result.affectedRows > 0;
};

export const allocateHouse = async (TenantId, houseId, startDate = null) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);
    end.setDate(end.getDate() - 1); // Exact 1 year minus 1 day

    // Create Tenancy
    await connection.query(
      "INSERT INTO tenancies (Tenant_id, house_id, start_date, end_date) VALUES (?, ?, ?, ?)",
      [TenantId, houseId, start.toISOString().split('T')[0], end.toISOString().split('T')[0]]
    );

    // Update House Status
    await connection.query(
      "UPDATE houses SET status = 'Occupied' WHERE house_id = ?",
      [houseId]
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getTenantByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT t.*, t.Tenant_id as id, u.username, u.email, u.phone, h.address as houseAddress, h.house_id
     FROM Tenants t
     JOIN users u ON t.user_id = u.user_id
     LEFT JOIN tenancies ten ON t.Tenant_id = ten.Tenant_id
     LEFT JOIN houses h ON ten.house_id = h.house_id
     WHERE t.user_id = ?`,
    [userId]
  );
  return rows[0];
};

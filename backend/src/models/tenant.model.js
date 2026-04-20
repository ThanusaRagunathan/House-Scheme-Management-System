import db from "../config/db.js";

export const getAllTenants = async () => {
  const [rows] = await db.query(
    `SELECT t.*, t.tenant_id as id, u.username, u.email, u.phone, 
            t.full_name as name, t.nic,
            ten.start_date as startDate, ten.end_date as endDate,
            h.address as houseAddress, h.house_id as houseId, h.reference_code as houseCode
     FROM tenants t
     JOIN users u ON t.user_id = u.user_id
     LEFT JOIN tenancies ten ON t.tenant_id = ten.tenant_id AND ten.is_deleted = 0
     LEFT JOIN houses h ON ten.house_id = h.house_id AND h.is_deleted = 0
     WHERE t.is_deleted = 0`
  );
  return rows;
};

export const getTenantById = async (TenantId) => {
  const [rows] = await db.query(
    `SELECT t.*, t.tenant_id as id, u.username, u.email, u.phone 
     FROM tenants t
     JOIN users u ON t.user_id = u.user_id
     WHERE t.tenant_id = ? AND t.is_deleted = 0`,
    [TenantId]
  );
  if (!rows[0]) return null;
  const tenant = rows[0];
  const [familyRows] = await db.query("SELECT * FROM family_members WHERE tenant_id = ?", [TenantId]);
  tenant.familyMembers = familyRows;
  return tenant;
};

export const createTenant = async (userId, fullName, nic, occupation, dateOfBirth) => {
  const [result] = await db.query(
    "INSERT INTO tenants (user_id, full_name, nic, occupation, date_of_birth) VALUES (?, ?, ?, ?, ?)",
    [userId, fullName, nic, occupation, dateOfBirth]
  );
  return result.insertId;
};

export const addFamilyMembers = async (TenantId, familyMembers) => {
  if (!familyMembers || familyMembers.length === 0) return true;
  
  const values = familyMembers.map(m => [
    TenantId, 
    m.name || null, 
    m.relation || null,
    m.occupation || null, 
    m.nic || null, 
    m.dob || null
  ]);

  const [result] = await db.query(
    "INSERT INTO family_members (tenant_id, name, relation, occupation, nic, date_of_birth) VALUES ?",
    [values]
  );
  return result.affectedRows > 0;
};

export const updateTenant = async (TenantId, occupation, dateOfBirth, nic, phone, email, houseCode, familyMembers) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update tenants table
    const [result] = await connection.query(
      "UPDATE tenants SET occupation = ?, date_of_birth = ?, nic = ? WHERE tenant_id = ?",
      [occupation, dateOfBirth, nic, TenantId]
    );

    // 2. Get user_id
    const [tenantRows] = await connection.query("SELECT user_id FROM tenants WHERE tenant_id = ?", [TenantId]);
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
        const [tenancyRows] = await connection.query("SELECT * FROM tenancies WHERE tenant_id = ?", [TenantId]);
        
        if (tenancyRows.length === 0) {
          // No current tenancy, create one
          const start = new Date();
          const end = new Date(start);
          end.setFullYear(end.getFullYear() + 1);
          await connection.query("INSERT INTO tenancies (tenant_id, house_id, start_date, end_date) VALUES (?, ?, ?, ?)", 
            [TenantId, houseId, start.toISOString().split('T')[0], end.toISOString().split('T')[0]]);
          await connection.query("UPDATE houses SET status = 'Occupied' WHERE house_id = ?", [houseId]);
        } else if (tenancyRows[0].house_id !== houseId) {
          // Re-allocating to a new house. Set old house to vacant, new to occupied
          await connection.query("UPDATE houses SET status = 'Vacant' WHERE house_id = ?", [tenancyRows[0].house_id]);
          await connection.query("UPDATE tenancies SET house_id = ? WHERE tenant_id = ?", [houseId, TenantId]);
          await connection.query("UPDATE houses SET status = 'Occupied' WHERE house_id = ?", [houseId]);
        }
      }
    }

    // 5. Update Family Members if provided
    if (familyMembers !== undefined) {
      await connection.query("DELETE FROM family_members WHERE tenant_id = ?", [TenantId]);
      
      if (familyMembers && Array.isArray(familyMembers) && familyMembers.length > 0) {
        const values = familyMembers.map(m => [
          TenantId, 
          m.name || null, 
          m.relation || null,
          m.occupation || null, 
          m.nic || null, 
          m.dob || null
        ]);

        await connection.query(
          "INSERT INTO family_members (tenant_id, name, relation, occupation, nic, date_of_birth) VALUES ?",
          [values]
        );
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
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [tenantRows] = await connection.query("SELECT user_id FROM tenants WHERE tenant_id = ?", [TenantId]);
    if (tenantRows.length === 0) throw new Error("Tenant not found");
    const userId = tenantRows[0].user_id;

    const timestamp = Date.now();

    // 1. Soft delete tenant
    await connection.query(
      "UPDATE tenants SET is_deleted = 1, nic = CONCAT(nic, '_del_', ?) WHERE tenant_id = ?",
      [timestamp, TenantId]
    );

    // 2. Soft delete user
    await connection.query(
      "UPDATE users SET is_deleted = 1, username = CONCAT(username, '_del_', ?) WHERE user_id = ?",
      [timestamp, userId]
    );

    // 3. Vacate houses associated with the tenant
    await connection.query(
      "UPDATE houses SET status = 'Vacant' WHERE house_id IN (SELECT house_id FROM tenancies WHERE tenant_id = ? AND is_deleted = 0)",
      [TenantId]
    );

    // 4. Mark active tenancies as deleted
    await connection.query(
      "UPDATE tenancies SET is_deleted = 1 WHERE tenant_id = ?",
      [TenantId]
    );

    // 4. Update family members (if we want to hide them too)
    await connection.query(
      "UPDATE family_members SET nic = CONCAT(IFNULL(nic,''), '_del_', ?) WHERE tenant_id = ?",
      [timestamp, TenantId]
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
      "INSERT INTO tenancies (tenant_id, house_id, start_date, end_date) VALUES (?, ?, ?, ?)",
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
    `SELECT t.*, u.username, u.email, u.phone, h.address as houseAddress, h.house_id, h.rent_amount as rentAmount, ten.tenancy_id as tenancyId, ten.start_date as tenancyStartDate
     FROM tenants t
     JOIN users u ON t.user_id = u.user_id
     LEFT JOIN tenancies ten ON t.tenant_id = ten.tenant_id AND ten.is_deleted = 0
     LEFT JOIN houses h ON ten.house_id = h.house_id AND h.is_deleted = 0
     WHERE t.user_id = ? AND t.is_deleted = 0`,
    [userId]
  );
  if (!rows[0]) return null;
  const tenant = rows[0];
  const [familyRows] = await db.query("SELECT * FROM family_members WHERE tenant_id = ?", [tenant.id]);
  tenant.familyMembers = familyRows;
  return tenant;
};

export const countActiveHouses = async (tenantId) => {
  const [rows] = await db.query(
    "SELECT COUNT(*) as count FROM tenancies WHERE tenant_id = ? AND (end_date IS NULL OR end_date > CURDATE())",
    [tenantId]
  );
  return rows[0].count;
};

export const isHouseVacant = async (houseId) => {
  const [rows] = await db.query(
    "SELECT status FROM houses WHERE house_id = ?",
    [houseId]
  );
  return rows.length > 0 && rows[0].status === "Vacant";
};

export const findTenantByNic = async (nic) => {
  const [rows] = await db.query("SELECT * FROM tenants WHERE nic = ? AND is_deleted = 0", [nic]);
  return rows[0];
};

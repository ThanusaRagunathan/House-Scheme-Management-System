import db from "../config/db.js";

export const getAllPayments = async (tenancyId = null, ownerId = null, TenantId = null) => {
  let query = `
    SELECT p.*, t.full_name as TenantName, t.user_id, h.reference_code as houseCode 
    FROM payments p
    JOIN tenancies ten ON p.tenancy_id = ten.tenancy_id
    JOIN tenants t ON ten.tenant_id = t.tenant_id
    JOIN houses h ON ten.house_id = h.house_id
    WHERE p.is_deleted = 0
  `;
  const params = [];
  
  if (tenancyId) {
    query += " AND p.tenancy_id = ?";
    params.push(tenancyId);
  }

  if (ownerId) {
    query += " AND h.owner_id = ?";
    params.push(ownerId);
  }

  if (TenantId) {
    query += " AND ten.tenant_id = ?";
    params.push(TenantId);
  }
  
  const [rows] = await db.query(query, params);
  return rows;
};

export const getPaymentsByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT p.*, h.reference_code as houseCode, h.address as houseAddress
     FROM payments p
     JOIN tenancies ten ON p.tenancy_id = ten.tenancy_id
     JOIN tenants t ON ten.tenant_id = t.tenant_id
     JOIN houses h ON ten.house_id = h.house_id
     WHERE t.user_id = ? AND p.is_deleted = 0
     ORDER BY p.due_date DESC`,
    [userId]
  );
  return rows;
};

export const getPaymentById = async (paymentId) => {
  const [rows] = await db.query(
    "SELECT * FROM payments WHERE payment_id = ? AND is_deleted = 0",
    [paymentId]
  );
  return rows[0];
};

export const createPayment = async (tenancyId, amount, status, paidDate, dueDate, invoiceNo, paymentMethod) => {
  const [result] = await db.query(
    "INSERT INTO payments (tenancy_id, amount, status, paid_date, due_date, invoice_no, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [tenancyId, amount, status, paidDate, dueDate, invoiceNo, paymentMethod]
  );
  return result.insertId;
};

export const updatePayment = async (paymentId, amount, status, paidDate, paymentMethod) => {
  const [result] = await db.query(
    "UPDATE payments SET amount = ?, status = ?, paid_date = ?, payment_method = ? WHERE payment_id = ?",
    [amount, status, paidDate, paymentMethod, paymentId]
  );
  return result.affectedRows > 0;
};

export const deletePayment = async (paymentId) => {
  const [result] = await db.query(
    "UPDATE payments SET is_deleted = 1, invoice_no = CONCAT(invoice_no, '_del_', ?) WHERE payment_id = ?",
    [Date.now(), paymentId]
  );
  return result.affectedRows > 0;
};

export const getPendingPaymentsForReminders = async () => {
  // Finds pending payments where due_date is within next 3 days or already overdue
  const query = `
    SELECT p.payment_id, p.amount, p.due_date, p.invoice_no,
           h.owner_id, h.reference_code as houseCode,
           t.full_name as TenantName
    FROM payments p
    JOIN tenancies ten ON p.tenancy_id = ten.tenancy_id
    JOIN tenants t ON ten.tenant_id = t.tenant_id
    JOIN houses h ON ten.house_id = h.house_id
    WHERE p.status = 'Pending' 
      AND p.is_deleted = 0
      AND p.due_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
  `;
  const [rows] = await db.query(query);
  return rows;
};

export const autoGenerateMonthlyInvoices = async () => {
  // 1. Get all active tenancies with rent_amount > 0
  const tenancyQuery = `
    SELECT t.tenancy_id, t.tenant_id, h.house_id, h.rent_amount, h.reference_code
    FROM tenancies t
    JOIN houses h ON t.house_id = h.house_id
    WHERE t.is_deleted = 0 
      AND (t.end_date IS NULL OR t.end_date >= CURDATE())
      AND h.rent_amount > 0
  `;
  const [tenancies] = await db.query(tenancyQuery);

  const now = new Date();
  const year = now.getFullYear();
  const monthStr = String(now.getMonth() + 1).padStart(2, '0');
  
  // Due date is 5th of the month
  const dueDateStr = `${year}-${monthStr}-05`;

  let newInvoicesCount = 0;

  for (const tenancy of tenancies) {
    // 2. Check if a rent payment for this month and tenancy already exists 
    const invoicePrefix = `INV-${year}-${monthStr}-${tenancy.reference_code}%`;
    const checkQuery = `
      SELECT payment_id FROM payments 
      WHERE tenancy_id = ? AND invoice_no LIKE ? AND is_deleted = 0
    `;
    const [existing] = await db.query(checkQuery, [tenancy.tenancy_id, invoicePrefix]);
    
    // 3. If no payment generated yet, generate one
    if (existing.length === 0) {
      // e.g. INV-2026-04-H001
      const invoiceNo = `INV-${year}-${monthStr}-${tenancy.reference_code}`;
      const amount = tenancy.rent_amount;
      
      await db.query(
        "INSERT INTO payments (tenancy_id, amount, status, due_date, invoice_no, payment_method) VALUES (?, ?, ?, ?, ?, ?)",
        [tenancy.tenancy_id, amount, 'Pending', dueDateStr, invoiceNo, 'Transfer']
      );
      newInvoicesCount++;
    }
  }

  return newInvoicesCount;
};

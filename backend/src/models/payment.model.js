import db from "../config/db.js";

export const getAllPayments = async (tenancyId = null) => {
  let query = `
    SELECT p.*, t.full_name as TenantName, h.reference_code as houseCode 
    FROM payments p
    JOIN tenancies ten ON p.tenancy_id = ten.tenancy_id
    JOIN Tenants t ON ten.Tenant_id = t.Tenant_id
    JOIN houses h ON ten.house_id = h.house_id
  `;
  const params = [];
  
  if (tenancyId) {
    query += " WHERE p.tenancy_id = ?";
    params.push(tenancyId);
  }
  
  const [rows] = await db.query(query, params);
  return rows;
};

export const getPaymentById = async (paymentId) => {
  const [rows] = await db.query(
    "SELECT * FROM payments WHERE payment_id = ?",
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
    "DELETE FROM payments WHERE payment_id = ?",
    [paymentId]
  );
  return result.affectedRows > 0;
};

import db from "../config/db.js";

export const getAllPayments = async (tenancyId = null) => {
  let query = "SELECT * FROM payments";
  const params = [];
  
  if (tenancyId) {
    query += " WHERE tenancy_id = ?";
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

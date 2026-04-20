import db from "../config/db.js";

// Dynamic Generation Logic
export const getTenantReport = async () => {
  const [rows] = await db.query(`
    SELECT t.tenant_id, u.username as tenant_name, u.phone, u.email,
           h.reference_code as house_code, h.address,
           ty.start_date, ty.end_date,
           (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE tenancy_id = ty.tenancy_id AND status = 'Paid') as total_paid,
           (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE tenancy_id = ty.tenancy_id AND status = 'Pending') as outstanding
    FROM tenants t
    JOIN users u ON t.user_id = u.user_id
    LEFT JOIN tenancies ty ON t.tenant_id = ty.tenant_id
    LEFT JOIN houses h ON ty.house_id = h.house_id
  `);
  return rows;
};

export const getOccupancyReport = async () => {
  const [rows] = await db.query(`
    SELECT h.house_id, h.reference_code, h.address, h.status,
           u.username as current_tenant, ty.start_date as move_in_date
    FROM houses h
    LEFT JOIN tenancies ty ON h.house_id = ty.house_id
    LEFT JOIN tenants t ON ty.tenant_id = t.tenant_id
    LEFT JOIN users u ON t.user_id = u.user_id
    WHERE ty.tenancy_id IS NULL OR ty.end_date IS NULL OR ty.end_date > CURDATE()
  `);
  return rows;
};

export const getFinancialReport = async (startDate, endDate) => {
  const dateFilter = startDate ? "AND (p.paid_date BETWEEN ? AND ? OR p.due_date BETWEEN ? AND ?)" : "";
  const dateParams = startDate ? [startDate, endDate, startDate, endDate] : [];

  // 1. Income summary
  const [[income]] = await db.query(`
    SELECT
      COALESCE(SUM(CASE WHEN p.status = 'Paid' THEN p.amount ELSE 0 END), 0)     AS total_income,
      COALESCE(SUM(CASE WHEN p.status = 'Pending' THEN p.amount ELSE 0 END), 0)  AS outstanding_rent,
      COALESCE(SUM(CASE WHEN p.status = 'Overdue' THEN p.amount ELSE 0 END), 0)  AS overdue_rent,
      COUNT(DISTINCT p.payment_id)                                                AS total_payments,
      COUNT(DISTINCT CASE WHEN p.status = 'Paid' THEN p.payment_id END)          AS paid_count,
      COUNT(DISTINCT CASE WHEN p.status IN ('Pending','Overdue') THEN p.payment_id END) AS unpaid_count
    FROM payments p
    WHERE p.is_deleted = 0 ${dateFilter}
  `, dateParams);

  // 2. Total expenses (maintenance costs)
  const expDateFilter = startDate ? "AND scheduled_date BETWEEN ? AND ?" : "";
  const expDateParams = startDate ? [startDate, endDate] : [];

  const [[expenses]] = await db.query(`
    SELECT
      COALESCE(SUM(cost), 0)                                                         AS total_expenses,
      COALESCE(SUM(CASE WHEN category = 'Maintenance' THEN cost ELSE 0 END), 0)      AS maintenance_cost,
      COALESCE(SUM(CASE WHEN category = 'Utility Bill' THEN cost ELSE 0 END), 0)     AS utility_cost,
      COALESCE(SUM(CASE WHEN category = 'Service Expense' THEN cost ELSE 0 END), 0)  AS service_cost,
      COALESCE(SUM(CASE WHEN category = 'Other' THEN cost ELSE 0 END), 0)            AS other_cost
    FROM maintenance_tasks
    WHERE is_deleted = 0 AND cost > 0 ${expDateFilter}
  `, expDateParams);

  // 3. Outstanding rents per tenant/house
  const [outstanding] = await db.query(`
    SELECT t.full_name AS tenant_name, h.reference_code AS house_code, h.address,
           COALESCE(SUM(p.amount), 0) AS amount_due,
           p.status, p.due_date
    FROM payments p
    JOIN tenancies ten ON p.tenancy_id = ten.tenancy_id
    JOIN Tenants t ON ten.Tenant_id = t.Tenant_id
    JOIN houses h ON ten.house_id = h.house_id
    WHERE p.status IN ('Pending', 'Overdue') AND p.is_deleted = 0
    GROUP BY t.tenant_id, h.house_id, p.status, p.due_date
    ORDER BY p.due_date ASC
  `);

  // 4. Monthly income vs expense
  const [monthly] = await db.query(`
    SELECT mon, SUM(income) AS income, SUM(expense) AS expense
    FROM (
      SELECT DATE_FORMAT(paid_date, '%Y-%m') AS mon, amount AS income, 0 AS expense
      FROM payments WHERE status = 'Paid' AND is_deleted = 0 AND paid_date IS NOT NULL
      UNION ALL
      SELECT DATE_FORMAT(scheduled_date, '%Y-%m') AS mon, 0 AS income, cost AS expense
      FROM maintenance_tasks WHERE cost > 0 AND is_deleted = 0 AND scheduled_date IS NOT NULL
    ) combined
    GROUP BY mon
    ORDER BY mon ASC
  `);

  return {
    summary: {
      total_income: income.total_income,
      outstanding_rent: income.outstanding_rent,
      overdue_rent: income.overdue_rent,
      total_expenses: expenses.total_expenses,
      net_balance: income.total_income - expenses.total_expenses,
      total_payments: income.total_payments,
      paid_count: income.paid_count,
      unpaid_count: income.unpaid_count
    },
    expense_breakdown: {
      maintenance: expenses.maintenance_cost,
      utility: expenses.utility_cost,
      service: expenses.service_cost,
      other: expenses.other_cost
    },
    outstanding_rents: outstanding,
    monthly_trend: monthly
  };
};

export const getMaintenanceReport = async () => {
  const [rows] = await db.query(`
    SELECT task_id, description, task_status, cost, scheduled_date, completion_date, house_id
    FROM maintenance_tasks
  `);
  return rows;
};

export const getComplaintReport = async () => {
  const [rows] = await db.query(`
    SELECT c.complaint_id, c.title, c.description, c.status, c.submitted_date as created_at, c.facility
    FROM complaints c
  `);
  return rows;
};

export const getAuditReport = async () => {
  const [rows] = await db.query(`
    SELECT a.id, u.username, a.role, a.action, a.details, a.timestamp
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.user_id
    ORDER BY a.timestamp DESC
  `);
  return rows;
};

export const getNotificationReport = async () => {
  const [rows] = await db.query(`
    SELECT notification_id, title, description, date as created_at, status
    FROM notifications
    ORDER BY created_at DESC
  `);
  return rows;
};

export const getDocumentReport = async () => {
  const [rows] = await db.query(`
    SELECT d.document_id, d.document_name, d.document_type, d.upload_date, h.reference_code as house_code
    FROM documents d
    LEFT JOIN houses h ON d.house_id = h.house_id
  `);
  return rows;
};

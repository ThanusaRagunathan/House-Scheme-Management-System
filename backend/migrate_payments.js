import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

async function migrate() {
  console.log("Starting payment migration...");
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const paymentsData = [
      // Rent Payments
      { tenantName: "Kasun Perera", houseRef: "H-002", amount: 40000, type: "Rent", date: "2026-04-01", method: "Bank Transfer", desc: "Rent for April 2026" },
      { tenantName: "Mohamed Ameen", houseRef: "H-005", amount: 38000, type: "Rent", date: "2026-04-02", method: "Offline", desc: "Rent for April 2026" },
      { tenantName: "Sutharsan Rajendran", houseRef: "H-007", amount: 30000, type: "Rent", date: "2026-04-03", method: "Online", desc: "Rent for April 2026" },
      { tenantName: "Anne Fernando", houseRef: "H-010", amount: 45000, type: "Rent", date: "2026-04-01", method: "Bank Transfer", desc: "Rent for April 2026" },
      { tenantName: "Chamara Silva", houseRef: "H-012", amount: 43000, type: "Rent", date: "2026-04-04", method: "Offline", desc: "Rent for April 2026" },
      { tenantName: "Zainab Nazeera", houseRef: "H-015", amount: 70000, type: "Rent", date: "2026-04-02", method: "Bank Transfer", desc: "Rent for April 2026" },
      { tenantName: "Kavitha Selvarajah", houseRef: "H-017", amount: 46000, type: "Rent", date: "2026-04-05", method: "Online", desc: "Rent for April 2026" },
      { tenantName: "Daniel Rodrigo", houseRef: "H-020", amount: 47000, type: "Rent", date: "2026-04-03", method: "Bank Transfer", desc: "Rent for April 2026" },
      
      // Deposits & Utilities
      { tenantName: "Kasun Perera", houseRef: "H-002", amount: 80000, type: "Security Deposit", date: "2026-03-25", method: "Bank Transfer", desc: "Initial deposit" },
      { tenantName: "Mohamed Ameen", houseRef: "H-005", amount: 5000, type: "Utility", date: "2026-04-10", method: "Offline", desc: "Electricity bill" },
      { tenantName: "Sutharsan Rajendran", houseRef: "H-007", amount: 3000, type: "Utility", date: "2026-04-11", method: "Online", desc: "Water bill" },
      { tenantName: "Anne Fernando", houseRef: "H-010", amount: 6000, type: "Maintenance", date: "2026-04-12", method: "Bank Transfer", desc: "Plumbing repair" },
      { tenantName: "Chamara Silva", houseRef: "H-012", amount: 4500, type: "Utility", date: "2026-04-09", method: "Offline", desc: "Electricity bill" },
      { tenantName: "Zainab Nazeera", houseRef: "H-015", amount: 10000, type: "Maintenance", date: "2026-04-13", method: "Bank Transfer", desc: "AC servicing" },
      { tenantName: "Kavitha Selvarajah", houseRef: "H-017", amount: 3500, type: "Utility", date: "2026-04-08", method: "Online", desc: "Water bill" },
      { tenantName: "Daniel Rodrigo", houseRef: "H-020", amount: 9000, type: "Maintenance", date: "2026-04-14", method: "Bank Transfer", desc: "Painting work" },
      
      // Partial & Future Rent
      { tenantName: "Mohamed Ameen", houseRef: "H-005", amount: 20000, type: "Rent", date: "2026-04-20", method: "Offline", desc: "Partial rent payment" },
      { tenantName: "Kasun Perera", houseRef: "H-002", amount: 5000, type: "Utility", date: "2026-04-18", method: "Online", desc: "Water bill" },
      { tenantName: "Anne Fernando", houseRef: "H-010", amount: 45000, type: "Rent", date: "2026-05-01", method: "Bank Transfer", desc: "Rent for May 2026" },
      { tenantName: "Zainab Nazeera", houseRef: "H-015", amount: 70000, type: "Rent", date: "2026-05-02", method: "Bank Transfer", desc: "Rent for May 2026" }
    ];

    let invoiceCount = 1001;

    for (const p of paymentsData) {
      console.log(`Processing payment for ${p.tenantName} (${p.houseRef})...`);
      
      // Find Tenancy ID
      const [tenancyRows] = await connection.query(`
        SELECT ten.tenancy_id 
        FROM tenancies ten
        JOIN Tenants t ON ten.Tenant_id = t.Tenant_id
        JOIN houses h ON ten.house_id = h.house_id
        WHERE t.full_name = ? AND h.reference_code = ?
      `, [p.tenantName, p.houseRef]);

      if (tenancyRows.length === 0) {
        console.warn(`No active tenancy found for ${p.tenantName} in ${p.houseRef}. Skipping.`);
        continue;
      }
      const tenancyId = tenancyRows[0].tenancy_id;

      // Insert Payment
      const invoiceNo = `INV-${invoiceCount++}`;
      await connection.query(`
        INSERT INTO payments (tenancy_id, amount, status, paid_date, due_date, invoice_no, payment_method) 
        VALUES (?, ?, 'Paid', ?, ?, ?, ?)
      `, [tenancyId, p.amount, p.date, p.date, invoiceNo, p.method === "Cash" ? "Offline" : (p.method === "Bank Transfer" ? "Offline" : "Online")]);
      
      console.log(`Successfully recorded ${p.type} (${invoiceNo})`);
    }

    console.log("Payment migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await connection.end();
  }
}

migrate();

import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

async function updateLeases() {
  console.log("Updating lease dates...");
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const leaseData = [
      { name: "Kasun Perera", house: "H-002", start: "2026-03-25", end: "2027-03-24" },
      { name: "Mohamed Ameen", house: "H-005", start: "2026-03-20", end: "2027-03-19" },
      { name: "Sutharsan Rajendran", house: "H-007", start: "2026-03-28", end: "2027-03-27" },
      { name: "Anne Fernando", house: "H-010", start: "2026-03-22", end: "2027-03-21" },
      { name: "Chamara Silva", house: "H-012", start: "2026-03-30", end: "2027-03-29" },
      { name: "Zainab Nazeera", house: "H-015", start: "2026-03-18", end: "2027-03-17" },
      { name: "Kavitha Selvarajah", house: "H-017", start: "2026-03-26", end: "2027-03-25" },
      { name: "Daniel Rodrigo", house: "H-020", start: "2026-03-24", end: "2027-03-23" }
    ];

    for (const lease of leaseData) {
      console.log(`Updating lease for ${lease.name} in ${lease.house}...`);
      
      const [rows] = await connection.query(`
        UPDATE tenancies ten
        JOIN Tenants t ON ten.Tenant_id = t.Tenant_id
        JOIN houses h ON ten.house_id = h.house_id
        SET ten.start_date = ?, ten.end_date = ?
        WHERE t.full_name = ? AND h.reference_code = ?
      `, [lease.start, lease.end, lease.name, lease.house]);

      if (rows.affectedRows > 0) {
        console.log(`Successfully updated ${lease.name}`);
      } else {
        console.warn(`Could not find tenancy record for ${lease.name} in house ${lease.house}`);
      }
    }

    console.log("Lease updates completed!");
  } catch (error) {
    console.error("Failed to update leases:", error);
  } finally {
    await connection.end();
  }
}

updateLeases();

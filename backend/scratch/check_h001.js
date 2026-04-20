import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [rows] = await db.query(`
    SELECT h.reference_code, t.full_name
    FROM houses h
    LEFT JOIN tenancies ten ON h.house_id = ten.house_id AND ten.is_deleted = 0
    LEFT JOIN Tenants t ON ten.Tenant_id = t.Tenant_id AND t.is_deleted = 0
    WHERE h.reference_code = 'H - 001' OR h.reference_code = 'H001'
  `);
  
  console.log(JSON.stringify(rows, null, 2));
  await db.end();
}

check();

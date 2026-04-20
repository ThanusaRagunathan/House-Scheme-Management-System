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

  console.log("--- Houses ---");
  const [houses] = await db.query("SELECT house_id, reference_code, address, status FROM houses");
  console.table(houses);

  console.log("--- Tenant for Thanusa ---");
  const [tenants] = await db.query(
    "SELECT t.Tenant_id, t.user_id, t.full_name, u.username FROM Tenants t JOIN users u ON t.user_id = u.user_id WHERE u.user_id = 15"
  );
  console.table(tenants);

  console.log("--- All Tenancies ---");
  const [tenancies] = await db.query("SELECT * FROM tenancies");
  console.table(tenancies);

  await db.end();
}

check();

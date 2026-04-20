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

  // Check owners
  const [owners] = await db.query(`
    SELECT user_id, username, role FROM users WHERE role = 'Owner' AND is_deleted = 0 LIMIT 5
  `);
  console.log('Owners:', JSON.stringify(owners, null, 2));

  await db.end();
}

check();

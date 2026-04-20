import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkSchema() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [schema] = await db.query("DESCRIBE maintenance_tasks");
  console.log(JSON.stringify(schema, null, 2));
  await db.end();
}
checkSchema();

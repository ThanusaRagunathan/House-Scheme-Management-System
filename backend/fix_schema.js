import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("Checking schema for full_name...");
    const [nicCols] = await connection.query("SHOW COLUMNS FROM Tenants LIKE 'nic'");
    if (nicCols.length === 0) {
      console.log("Adding nic column to Tenants...");
      await connection.query("ALTER TABLE Tenants ADD COLUMN nic VARCHAR(15) NOT NULL AFTER full_name");
    }
    console.log("Schema is up to date.");
  } catch (err) {
    console.error("Schema migration failed:", err);
  } finally {
    await connection.end();
  }
}
migrate();

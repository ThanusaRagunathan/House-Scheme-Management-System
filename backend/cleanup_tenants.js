import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

async function cleanup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const usernames = [
    "kasun.perera", "mohamed.ameen", "sutharsan.rajendran", 
    "anne.fernando", "chamara.silva", "zainab.nazeera", 
    "kavitha.selvarajah", "daniel.rodrigo"
  ];

  console.log("Cleaning up previous migration data...");
  for (const u of usernames) {
    await connection.query("DELETE FROM users WHERE username = ?", [u]);
  }
  console.log("Cleanup complete.");
  await connection.end();
}
cleanup();

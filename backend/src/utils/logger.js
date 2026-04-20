import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE = path.join(__dirname, "../../audit.log");

export const auditLog = async (userId, role, action, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] UserID: ${userId} | Role: ${role} | Action: ${action} | Details: ${JSON.stringify(details)}\n`;
  
  console.log(`[Audit] ${action} by User ${userId}`);
  
  // Log to file
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) console.error("Failed to write to audit log file:", err);
  });

  // Log to database
  try {
    await db.query(
      "INSERT INTO audit_logs (user_id, role, action, details) VALUES (?, ?, ?, ?)",
      [userId, role, action, JSON.stringify(details)]
    );
  } catch (err) {
    console.error("Failed to write to audit log database:", err);
  }
};

import db from "./src/config/db.js";

async function checkSchema() {
  try {
    const [columns] = await db.query("SHOW COLUMNS FROM payments");
    console.log("Payments Table Columns:", JSON.stringify(columns, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Schema check failed:", err);
    process.exit(1);
  }
}

checkSchema();

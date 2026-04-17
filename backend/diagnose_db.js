import db from "./src/config/db.js";

async function diagnose() {
  try {
    const [houses] = await db.query("SELECT * FROM houses");
    console.log("Houses in DB:", JSON.stringify(houses, null, 2));
    
    const [Tenants] = await db.query("DESCRIBE Tenants");
    console.log("Tenants Schema:", JSON.stringify(Tenants, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error("Diagnosis failed:", err);
    process.exit(1);
  }
}

diagnose();

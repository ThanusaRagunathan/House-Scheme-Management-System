import db from "../src/config/db.js";

async function checkSchema() {
  try {
    console.log("--- Information Schema: Tables ---");
    const [tables] = await db.query("SHOW TABLES");
    console.log(tables);

    const targetTables = ['tenants', 'users', 'tenancies', 'family_members', 'payments', 'complaints', 'notifications', 'audit_logs'];
    
    for (const table of targetTables) {
      console.log(`\n--- Constraints for ${table} ---`);
      const [constraints] = await db.query(`
        SELECT 
          COLUMN_NAME, 
          CONSTRAINT_NAME, 
          REFERENCED_TABLE_NAME, 
          REFERENCED_COLUMN_NAME 
        FROM 
          INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE 
          TABLE_NAME = ? AND TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL
      `, [table]);
      console.log(constraints);
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkSchema();

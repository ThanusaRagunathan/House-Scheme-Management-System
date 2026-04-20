import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function cleanup() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log("Identifying houses that should be vacant...");
  
  // Find houses marked as Occupied but have no active non-deleted tenancies
  const [rows] = await db.query(`
    SELECT h.house_id, h.reference_code 
    FROM houses h 
    WHERE h.status = 'Occupied' 
    AND NOT EXISTS (
      SELECT 1 FROM tenancies t 
      WHERE t.house_id = h.house_id 
      AND t.is_deleted = 0
    )
  `);

  if (rows.length === 0) {
    console.log("No issues found. Data is consistent.");
  } else {
    console.log(`Found ${rows.length} inconsistent records:`, rows);
    
    for (const house of rows) {
      await db.query("UPDATE houses SET status = 'Vacant' WHERE house_id = ?", [house.house_id]);
      console.log(`Updated ${house.reference_code} to Vacant.`);
    }
    console.log("Cleanup complete.");
  }

  await db.end();
}

cleanup();

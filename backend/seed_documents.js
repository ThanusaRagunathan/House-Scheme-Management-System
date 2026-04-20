import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function addDocuments() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // 1. Update schema
    console.log("Updating document schema...");
    try {
      await db.query("ALTER TABLE documents MODIFY house_id INT NULL");
    } catch (e) {
      console.log("house_id might already be nullable");
    }
    
    try {
      await db.query("ALTER TABLE documents ADD COLUMN facility VARCHAR(255) NULL");
    } catch (e) {
      console.log("facility column might already exist");
    }

    const mockData = [
      { type: 'Agreement', target: 'H-002', name: 'Rent Agreement for Kasun Perera' },
      { type: 'Agreement', target: 'H-005', name: 'Rent Agreement for Mohamed Ameen' },
      { type: 'Invoice', target: 'H-007', name: 'Invoice for Rent Payment (April 2026)' },
      { type: 'Invoice', target: 'H-010', name: 'Invoice for Rent Payment (April 2026)' },
      { type: 'Report', target: 'Shared Facility (Swimming Pool)', name: 'Pool Maintenance Report (April 2026)' },
      { type: 'Report', target: 'H-015', name: 'Electrical Inspection Report (April 2026)' },
      { type: 'Agreement', target: 'H-017', name: 'Rent Agreement for Kavitha Selvarajah' },
      { type: 'Report', target: 'H-005', name: 'Gym Equipment Service Report (April 2026)' },
      { type: 'Invoice', target: 'H-017', name: 'Invoice for Rent Payment (April 2026)' },
      { type: 'Report', target: 'H-012', name: 'Maintenance Report: Window Repair (April 2026)' },
    ];

    console.log("Inserting documents...");

    for (const data of mockData) {
      let houseId = null;
      let facilityName = null;

      if (data.target.startsWith('H-')) {
        const [houses] = await db.query("SELECT house_id FROM houses WHERE reference_code = ?", [data.target]);
        if (houses.length > 0) {
          houseId = houses[0].house_id;
        } else {
          facilityName = data.target;
        }
      } else {
        facilityName = data.target;
      }

      await db.query(
        "INSERT INTO documents (document_name, document_type, house_id, facility) VALUES (?, ?, ?, ?)",
        [data.name, data.type, houseId, facilityName]
      );
      console.log(`✅ Inserted document: [${data.target}] ${data.name}`);
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.end();
  }
}

addDocuments();

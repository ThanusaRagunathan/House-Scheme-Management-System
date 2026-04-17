import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function addComplaints() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // 1. Update schema to support shared facilities
    console.log("Updating schema...");
    try {
      await db.query("ALTER TABLE complaints MODIFY tenancy_id INT NULL");
    } catch (e) {
      console.log("tenancy_id might already be nullable");
    }
    
    try {
      await db.query("ALTER TABLE complaints ADD COLUMN facility VARCHAR(255) NULL");
    } catch (e) {
      console.log("facility column might already exist");
    }

    const mockData = [
      { target: 'H-002', title: 'Water Leakage', description: 'Water leakage in the kitchen. The pipes under the sink need to be fixed.', status: 'Open' },
      { target: 'H-005', title: 'AC Not Cooling', description: 'The air conditioning unit in the bedroom is not cooling properly.', status: 'In Progress' },
      { target: 'Shared Facility (Swimming Pool)', title: 'Pool Cleaning', description: 'The swimming pool needs cleaning and water treatment. There is algae buildup.', status: 'Open' },
      { target: 'H-010', title: 'Broken Window', description: 'The living room window has been cracked and needs to be replaced.', status: 'Open' },
      { target: 'H-007', title: 'Electrical Wiring', description: 'Faulty wiring in the living room. The lights flicker frequently.', status: 'In Progress' },
      { target: 'Shared Facility (Gym)', title: 'Gym Equipment Repair', description: 'One of the treadmills in the gym is broken and needs repair. It stops after a few minutes of use.', status: 'Open' },
      { target: 'H-017', title: 'Roof Leakage', description: 'Water leakage from the roof during heavy rain. Needs immediate attention.', status: 'Resolved' },
    ];

    console.log("Inserting complaints...");

    for (const data of mockData) {
      let tenancyId = null;
      let facilityName = null;

      if (data.target.startsWith('H-')) {
        // Look up house_id and then tenancy_id
        const [houses] = await db.query("SELECT house_id FROM houses WHERE reference_code = ?", [data.target]);
        if (houses.length > 0) {
          const houseId = houses[0].house_id;
          const [tenancies] = await db.query(
            "SELECT id, tenancy_id FROM tenancies WHERE house_id = ? ORDER BY id DESC LIMIT 1",
            [houseId]
          );
          if (tenancies.length > 0) {
             tenancyId = tenancies[0].tenancy_id || tenancies[0].id; // Handling 'id' or 'tenancy_id' depending on the schema
          } else {
             // Fallback if the house has no active tenants
             facilityName = data.target;
          }
        } else {
          facilityName = data.target;
        }
      } else {
        facilityName = data.target; // Shared Facility
      }

      const resolvedDate = data.status === 'Resolved' ? new Date() : null;

      await db.query(
        "INSERT INTO complaints (tenancy_id, facility, title, description, status, resolved_date) VALUES (?, ?, ?, ?, ?, ?)",
        [tenancyId, facilityName, data.title, data.description, data.status, resolvedDate]
      );
      console.log(`✅ Inserted complaint: [${data.target}] ${data.title}`);
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.end();
  }
}

addComplaints();

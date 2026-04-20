import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function addFacilityNotifications() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const tasks = [
      { facility: 'Shared Facility (Swimming Pool)', description: 'Pool cleaning and water treatment', date: '2026-04-10', cost: 7000 },
      { facility: 'Shared Facility (Park)', description: 'Grass trimming and path clearing', date: '2026-04-12', cost: 2500 },
      { facility: 'Shared Facility (Gym)', description: 'Equipment servicing and repair', date: '2026-04-14', cost: 5000 },
      { facility: 'Shared Facility (Swimming Pool)', description: 'Pool filtration system maintenance', date: '2026-04-16', cost: 4000 },
      { facility: 'Shared Facility (Gym)', description: 'Air conditioning servicing in gym', date: '2026-04-18', cost: 3500 },
    ];

    // Find the Owner(s) to notify
    const [owners] = await db.query("SELECT user_id FROM users WHERE role = 'Owner'");
    if (owners.length > 0) {
      console.log("Adding notifications for owner(s)...");
      for (const owner of owners) {
        for (const task of tasks) {
          await db.query(
            "INSERT INTO notifications (user_id, title, description, status) VALUES (?, ?, ?, ?)",
            [owner.user_id, `New Maintenance Task: ${task.facility}`, `Task: ${task.description} is scheduled for ${task.date}. Estimated cost: Rs.${task.cost}`, 'New']
          );
        }
      }
      console.log(`✅ Added notifications for ${owners.length} owner(s).`);
    } else {
      console.log("⚠️ No owner found to send notifications to.");
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.end();
  }
}

addFacilityNotifications();

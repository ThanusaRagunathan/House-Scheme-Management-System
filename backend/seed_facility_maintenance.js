import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function addFacilityTasks() {
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
      await db.query("ALTER TABLE maintenance_tasks MODIFY house_id INT NULL");
    } catch (e) {
      console.log("house_id might already be nullable");
    }
    
    try {
      await db.query("ALTER TABLE maintenance_tasks ADD COLUMN facility VARCHAR(255) NULL");
    } catch (e) {
      console.log("facility column might already exist");
    }

    // 2. Insert maintenance tasks
    console.log("Inserting facility maintenance tasks...");
    const tasks = [
      { facility: 'Shared Facility (Swimming Pool)', description: 'Pool cleaning and water treatment', date: '2026-04-10', cost: 7000 },
      { facility: 'Shared Facility (Park)', description: 'Grass trimming and path clearing', date: '2026-04-12', cost: 2500 },
      { facility: 'Shared Facility (Gym)', description: 'Equipment servicing and repair', date: '2026-04-14', cost: 5000 },
      { facility: 'Shared Facility (Swimming Pool)', description: 'Pool filtration system maintenance', date: '2026-04-16', cost: 4000 },
      { facility: 'Shared Facility (Gym)', description: 'Air conditioning servicing in gym', date: '2026-04-18', cost: 3500 },
    ];

    for (const task of tasks) {
      await db.query(
        "INSERT INTO maintenance_tasks (house_id, facility, description, cost, task_status, scheduled_date) VALUES (?, ?, ?, ?, ?, ?)",
        [null, task.facility, task.description, task.cost, 'Pending', task.date]
      );
      console.log(`✅ Inserted task: ${task.description}`);
    }

    // 3. Add notifications
    // Find the Owner(s) to notify
    const [owners] = await db.query("SELECT id FROM users WHERE role = 'Owner'");
    if (owners.length > 0) {
      console.log("Adding notifications for owner(s)...");
      for (const owner of owners) {
        for (const task of tasks) {
          await db.query(
            "INSERT INTO notifications (user_id, title, description, status) VALUES (?, ?, ?, ?)",
            [owner.id, `New Maintenance Task: ${task.facility}`, `Task: ${task.description} is scheduled for ${task.date}. Estimated cost: Rs.${task.cost}`, 'New']
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

addFacilityTasks();

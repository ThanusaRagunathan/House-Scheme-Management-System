import db from '../src/config/db.js';

async function migrate() {
    try {
        console.log("Adding 'category' column to 'maintenance_tasks' table...");
        
        // Check if column exists
        const [columns] = await db.query("SHOW COLUMNS FROM maintenance_tasks LIKE 'category'");
        
        if (columns.length === 0) {
            await db.query("ALTER TABLE maintenance_tasks ADD COLUMN category VARCHAR(50) DEFAULT 'Maintenance' AFTER task_status");
            console.log("Column 'category' added successfully.");
        } else {
            console.log("Column 'category' already exists.");
        }

        console.log("Migration successful.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();

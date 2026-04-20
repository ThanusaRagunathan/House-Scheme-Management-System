import db from '../src/config/db.js';

async function migrate() {
    try {
        console.log("Checking notifications table...");
        const [columns] = await db.query("SHOW COLUMNS FROM notifications LIKE 'type'");
        
        if (columns.length === 0) {
            console.log("Adding 'type' column to notifications table...");
            await db.query("ALTER TABLE notifications ADD COLUMN type VARCHAR(20) DEFAULT 'General' AFTER description");
            console.log("Column added successfully.");
        } else {
            console.log("Column 'type' already exists.");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

import db from '../src/config/db.js';

async function migrate() {
    try {
        console.log("Adding 'attachment_url' column to 'complaints' table...");
        
        // Check if column exists
        const [columns] = await db.query("SHOW COLUMNS FROM complaints LIKE 'attachment_url'");
        
        if (columns.length === 0) {
            await db.query("ALTER TABLE complaints ADD COLUMN attachment_url VARCHAR(255) AFTER description");
            console.log("Column 'attachment_url' added successfully.");
        } else {
            console.log("Column 'attachment_url' already exists.");
        }

        console.log("Migration successful.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();

// Migration: Add encryption IV column to documents table
// Run once: node backend/scratch/migrate_documents_encryption.js

import db from "../src/config/db.js";

async function migrate() {
  console.log("Starting document encryption migration...");

  try {
    // Add iv column to store the hex-encoded AES-256-GCM initialization vector
    await db.query(`
      ALTER TABLE documents
        ADD COLUMN IF NOT EXISTS iv VARCHAR(32) NULL COMMENT 'AES-256-GCM IV (hex) for encrypted file',
        ADD COLUMN IF NOT EXISTS is_encrypted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = file encrypted at rest'
    `);
    console.log("✅ Added iv and is_encrypted columns to documents table.");
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME") {
      console.log("ℹ️  Columns already exist, skipping.");
    } else {
      throw err;
    }
  }

  console.log("Migration complete.");
  process.exit(0);
}

migrate().catch(e => { console.error("Migration failed:", e); process.exit(1); });

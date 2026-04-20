import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

async function migrate() {
  console.log("Starting database migration...");
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // 1. Add reference_code column if it doesn't exist
    console.log("Checking for reference_code column...");
    const [columns] = await connection.query("SHOW COLUMNS FROM houses LIKE 'reference_code'");
    if (columns.length === 0) {
      console.log("Adding reference_code column to houses table...");
      await connection.query("ALTER TABLE houses ADD COLUMN reference_code VARCHAR(50) AFTER house_id");
      await connection.query("ALTER TABLE houses ADD UNIQUE (reference_code)");
    } else {
      console.log("reference_code column already exists.");
    }

    // 2. Update status enum to include Maintenance
    console.log("Updating status enum...");
    await connection.query("ALTER TABLE houses MODIFY COLUMN status VARCHAR(20) NOT NULL");

    // 3. Find correct Owner ID (either Suresh or suresh.owner if they are Owner)
    const [owners] = await connection.query("SELECT user_id FROM users WHERE role = 'Owner' LIMIT 1");
    if (owners.length === 0) {
        throw new Error("No user with 'Owner' role found in the database. Please create an owner first.");
    }
    const ownerId = owners[0].user_id;
    console.log(`Using Owner ID: ${ownerId} for house creation.`);

    // 4. Insert the 20 houses
    console.log("Inserting new house records...");
    const housesData = [
      ['H-001', 'No. 12, Galle Road, Dehiwala', 3, 45000, 'Vacant', ownerId],
      ['H-002', 'No. 45, Station Road, Wellawatte', 2, 40000, 'Occupied', ownerId],
      ['H-003', 'No. 78, Temple Road, Bambalapitiya', 4, 65000, 'Maintenance', ownerId],
      ['H-004', 'No. 23, Hill Street, Mount Lavinia', 3, 55000, 'Vacant', ownerId],
      ['H-005', 'No. 90, High Level Road, Nugegoda', 2, 38000, 'Occupied', ownerId],
      ['H-006', 'No. 15, Mosque Road, Maradana', 3, 50000, 'Vacant', ownerId],
      ['H-007', 'No. 66, Sea Street, Colombo Fort', 1, 30000, 'Occupied', ownerId],
      ['H-008', 'No. 34, Church Lane, Kotahena', 2, 42000, 'Maintenance', ownerId],
      ['H-009', 'No. 120, Old Kottawa Road, Pannipitiya', 4, 60000, 'Vacant', ownerId],
      ['H-010', 'No. 5, Main Street, Slave Island', 2, 45000, 'Occupied', ownerId],
      ['H-011', 'No. 88, Jaffna Street, Wellawatte', 3, 52000, 'Vacant', ownerId],
      ['H-012', 'No. 19, Beach Road, Dehiwala', 2, 43000, 'Occupied', ownerId],
      ['H-013', 'No. 27, Lake Road, Boralesgamuwa', 3, 48000, 'Maintenance', ownerId],
      ['H-014', 'No. 50, Park Street, Colombo 02', 1, 35000, 'Vacant', ownerId],
      ['H-015', 'No. 72, Station Lane, Mount Lavinia', 4, 70000, 'Occupied', ownerId],
      ['H-016', 'No. 11, Flower Road, Colombo 07', 3, 80000, 'Vacant', ownerId],
      ['H-017', 'No. 64, Temple Lane, Rajagiriya', 2, 46000, 'Occupied', ownerId],
      ['H-018', 'No. 29, Market Road, Pettah', 1, 32000, 'Maintenance', ownerId],
      ['H-019', 'No. 101, School Road, Wellawatte', 3, 54000, 'Vacant', ownerId],
      ['H-020', 'No. 39, Hospital Road, Kalubowila', 2, 47000, 'Occupied', ownerId]
    ];

    for (const h of housesData) {
      try {
        await connection.query(
          "INSERT INTO houses (reference_code, address, rooms, rent_amount, status, owner_id) VALUES (?, ?, ?, ?, ?, ?)",
          h
        );
      } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
           console.log(`Skipping ${h[0]} (already exists)`);
        } else {
           throw e;
        }
      }
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await connection.end();
  }
}

migrate();

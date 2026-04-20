import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

async function migrate() {
  console.log("Starting tenant migration...");
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Ensure family_members table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS family_members (
        member_id INT AUTO_INCREMENT PRIMARY KEY,
        Tenant_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        occupation VARCHAR(100),
        nic VARCHAR(15),
        date_of_birth DATE,
        FOREIGN KEY (Tenant_id) REFERENCES Tenants(Tenant_id) ON DELETE CASCADE
      )
    `);

    const tenantsData = [
      {
        fullName: "Kasun Perera",
        phone: "0771234567",
        email: "kasun.perera@gmail.com",
        nic: "901234567V",
        occupation: "Accountant",
        dob: "1990-05-14",
        houseRef: "H-002",
        username: "kasun.perera",
        password: "KASU14+90",
        family: [{ name: "Nadeesha Perera", occupation: "Teacher", nic: "925678123V", dob: "1992-08-10" }]
      },
      {
        fullName: "Mohamed Ameen",
        phone: "0712345678",
        email: "ameen.m@gmail.com",
        nic: "881234567V",
        occupation: "Businessman",
        dob: "1988-11-22",
        houseRef: "H-005",
        username: "mohamed.ameen",
        password: "MOHA22+88",
        family: [
          { name: "Fathima Ameen", occupation: "Housewife", nic: "905432198V", dob: "1990-02-18" },
          { name: "Ayaan Ameen (Son)", occupation: "Student", nic: "201234568V", dob: "2012-06-15" },
          { name: "Aisha Ameen (Daughter)", occupation: "Student", nic: "201234569V", dob: "2015-09-20" }
        ]
      },
      {
        fullName: "Sutharsan Rajendran",
        phone: "0759876543",
        email: "sutharsan.r@gmail.com",
        nic: "931245678V",
        occupation: "Engineer",
        dob: "1993-07-09",
        houseRef: "H-007",
        username: "sutharsan.rajendran",
        password: "SUTH09+93",
        family: []
      },
      {
        fullName: "Anne Fernando",
        phone: "0761122334",
        email: "anne.f@gmail.com",
        nic: "915678234V",
        occupation: "Nurse",
        dob: "1991-03-18",
        houseRef: "H-010",
        username: "anne.fernando",
        password: "ANNE18+91",
        family: [{ name: "Peter Fernando", occupation: "Driver", nic: "890123456V", dob: "1989-06-12" }]
      },
      {
        fullName: "Chamara Silva",
        phone: "0785566778",
        email: "chamara.s@gmail.com",
        nic: "872345678V",
        occupation: "Technician",
        dob: "1987-09-25",
        houseRef: "H-012",
        username: "chamara.silva",
        password: "CHAM25+87",
        family: []
      },
      {
        fullName: "Zainab Nazeera",
        phone: "0709988776",
        email: "zainab.n@gmail.com",
        nic: "942134567V",
        occupation: "Teacher",
        dob: "1994-01-11",
        houseRef: "H-015",
        username: "zainab.nazeera",
        password: "ZAIN11+94",
        family: [{ name: "Imran Nazeer", occupation: "Student", nic: "201234567V", dob: "2010-04-05" }]
      },
      {
        fullName: "Kavitha Selvarajah",
        phone: "0745566778",
        email: "kavitha.s@gmail.com",
        nic: "952345678V",
        occupation: "Bank Officer",
        dob: "1995-12-06",
        houseRef: "H-017",
        username: "kavitha.selvarajah",
        password: "KAVI06+95",
        family: []
      },
      {
        fullName: "Daniel Rodrigo",
        phone: "0723344556",
        email: "daniel.r@gmail.com",
        nic: "902223344V",
        occupation: "Manager",
        dob: "1990-04-30",
        houseRef: "H-020",
        username: "daniel.rodrigo",
        password: "DANI30+90",
        family: [{ name: "Maria Rodrigo", occupation: "Teacher", nic: "915678999V", dob: "1991-07-21" }]
      }
    ];

    for (const t of tenantsData) {
      console.log(`Processing ${t.fullName}...`);
      
      try {
        // Find house ID
        const [houses] = await connection.query("SELECT house_id FROM houses WHERE reference_code = ?", [t.houseRef]);
        if (houses.length === 0) {
          console.warn(`House ${t.houseRef} not found, skipping allocation.`);
          continue;
        }
        const houseId = houses[0].house_id;

        // 1. Create User
        const hashedPassword = await bcrypt.hash(t.password, 10);
        const [userResult] = await connection.query(
          "INSERT INTO users (username, password, role, email, phone) VALUES (?, ?, 'Tenant', ?, ?)",
          [t.username, hashedPassword, t.email, t.phone]
        );
        const userId = userResult.insertId;

        // 2. Create Tenant
        const [tenantResult] = await connection.query(
          "INSERT INTO Tenants (user_id, full_name, nic, occupation, date_of_birth) VALUES (?, ?, ?, ?, ?)",
          [userId, t.fullName, t.nic, t.occupation, t.dob]
        );
        const tenantId = tenantResult.insertId;

        // 3. Create Tenancy
        await connection.query(
          "INSERT INTO tenancies (Tenant_id, house_id, start_date) VALUES (?, ?, CURRENT_DATE)",
          [tenantId, houseId]
        );

        // 4. Update House Status
        await connection.query("UPDATE houses SET status = 'Occupied' WHERE house_id = ?", [houseId]);

        // 5. Add Family Members
        for (const f of t.family) {
          await connection.query(
            "INSERT INTO family_members (Tenant_id, name, occupation, nic, date_of_birth) VALUES (?, ?, ?, ?, ?)",
            [tenantId, f.name, f.occupation, f.nic, f.dob]
          );
        }
        
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.warn(`User ${t.username} already exists, skipping.`);
        } else {
          throw err;
        }
      }
    }

    console.log("Tenant migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await connection.end();
  }
}

migrate();

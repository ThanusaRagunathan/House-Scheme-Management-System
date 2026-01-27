import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const seedData = async () => {
  try {
    // Hash passwords
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Clear existing users
    await db.query("DELETE FROM users");

    // Insert users with hashed passwords
    const users = [
      ["suresh.owner", hashedPassword, "Owner", "suresh@example.com", "0771112233"],
      ["aravinth.treasurer", hashedPassword, "Treasurer", "aravinth@example.com", "0774445566"],
      ["karthik.s", hashedPassword, "Tenant", "karthik@example.com", "0779001122"],
      ["priya.r", hashedPassword, "Tenant", "priya@example.com", "0779001133"],
      ["naveen.k", hashedPassword, "Tenant", "naveen@example.com", "0779001144"],
      ["meena.p", hashedPassword, "Tenant", "meena@example.com", "0779001155"],
      ["vijay.l", hashedPassword, "Tenant", "vijay@example.com", "0779001166"],
    ];

    for (const user of users) {
      await db.query(
        "INSERT INTO users (username, password, role, email, phone) VALUES (?, ?, ?, ?, ?)",
        user
      );
    }

    console.log("✅ Seed data loaded successfully!");
    console.log("\nTest credentials:");
    console.log("Username: suresh.owner");
    console.log("Password: password123");
    console.log("\nOR");
    console.log("Username: aravinth.treasurer");
    console.log("Password: password123");

    await db.end();
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
};

seedData();

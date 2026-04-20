import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function seedTenantData() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const userId = 15; // Thanusa
    console.log("--- Setting up tenant for user ID 15 (Thanusa) ---\n");

    // 1. Check if Tenant record exists
    const [existingTenant] = await db.query("SELECT * FROM Tenants WHERE user_id = ?", [userId]);
    
    let tenantId;
    if (existingTenant.length === 0) {
      // Create Tenant record
      const [result] = await db.query(
        "INSERT INTO Tenants (user_id, full_name, nic, occupation, date_of_birth) VALUES (?, ?, ?, ?, ?)",
        [userId, 'Thanusa Ragunathan', '200112345678', 'Student', '2001-06-15']
      );
      tenantId = result.insertId;
      console.log(`✅ Created Tenant record (Tenant_id: ${tenantId})`);
    } else {
      tenantId = existingTenant[0].Tenant_id;
      console.log(`✅ Tenant record already exists (Tenant_id: ${tenantId})`);
    }

    // 2. Check if tenancy exists, if not assign a vacant house
    const [existingTenancy] = await db.query("SELECT * FROM tenancies WHERE Tenant_id = ?", [tenantId]);
    
    let tenancyId, houseId, houseCode;
    if (existingTenancy.length === 0) {
      // Find a vacant house
      const [vacantHouses] = await db.query("SELECT house_id, reference_code FROM houses WHERE status = 'Vacant' LIMIT 1");
      if (vacantHouses.length === 0) {
        console.log("❌ No vacant houses available!");
        return;
      }
      houseId = vacantHouses[0].house_id;
      houseCode = vacantHouses[0].reference_code;

      // Create tenancy
      const [tenancyResult] = await db.query(
        "INSERT INTO tenancies (Tenant_id, house_id, start_date, end_date) VALUES (?, ?, ?, ?)",
        [tenantId, houseId, '2026-03-01', '2027-02-28']
      );
      tenancyId = tenancyResult.insertId;

      // Mark house as occupied
      await db.query("UPDATE houses SET status = 'Occupied' WHERE house_id = ?", [houseId]);
      console.log(`✅ Allocated house ${houseCode} (house_id: ${houseId}), tenancy_id: ${tenancyId}`);
    } else {
      tenancyId = existingTenancy[0].tenancy_id;
      houseId = existingTenancy[0].house_id;
      const [houseRow] = await db.query("SELECT reference_code FROM houses WHERE house_id = ?", [houseId]);
      houseCode = houseRow[0].reference_code;
      console.log(`✅ Tenancy already exists (tenancy_id: ${tenancyId}, house: ${houseCode})`);
    }

    // 3. Add 1 Agreement document
    console.log("\n--- Adding Documents ---");
    await db.query(
      "INSERT INTO documents (document_name, document_type, house_id) VALUES (?, ?, ?)",
      [`Rent Agreement - ${houseCode}`, 'Agreement', houseId]
    );
    console.log("✅ Added: Rent Agreement");

    // 4. Add 2 Invoice documents
    await db.query(
      "INSERT INTO documents (document_name, document_type, house_id) VALUES (?, ?, ?)",
      [`March 2026 Invoice - ${houseCode}`, 'Invoice', houseId]
    );
    console.log("✅ Added: March 2026 Invoice");

    await db.query(
      "INSERT INTO documents (document_name, document_type, house_id) VALUES (?, ?, ?)",
      [`April 2026 Invoice - ${houseCode}`, 'Invoice', houseId]
    );
    console.log("✅ Added: April 2026 Invoice");

    // 5. Add 2 Rent payments
    console.log("\n--- Adding Payments ---");
    await db.query(
      "INSERT INTO payments (tenancy_id, amount, status, paid_date, due_date, invoice_no, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [tenancyId, 10000, 'Paid', '2026-03-01', '2026-03-01', `INV-${houseCode}-MAR2026`, 'Online']
    );
    console.log("✅ Added: March 2026 Rent Payment (Paid - Rs.10,000)");

    await db.query(
      "INSERT INTO payments (tenancy_id, amount, status, paid_date, due_date, invoice_no, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [tenancyId, 10000, 'Pending', null, '2026-04-01', `INV-${houseCode}-APR2026`, 'Online']
    );
    console.log("✅ Added: April 2026 Rent Payment (Pending - Rs.10,000)");

    console.log("\n🎉 All data seeded successfully for Thanusa Ragunathan!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await db.end();
  }
}

seedTenantData();

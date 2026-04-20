import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RedmiNOTE105G',
  database: 'house_scheme_management_system'
});

// First, look up house IDs by reference code
const maintenanceData = [
  { houseCode: 'H-002', description: 'Fix plumbing leak in kitchen',      scheduledDate: '2026-04-05', cost: 5000 },
  { houseCode: 'H-005', description: 'AC servicing and cleaning',          scheduledDate: '2026-04-07', cost: 3000 },
  { houseCode: 'H-007', description: 'Electrical rewiring in bedroom',     scheduledDate: '2026-04-10', cost: 4500 },
  { houseCode: 'H-010', description: 'Fix broken window in living room',   scheduledDate: '2026-04-12', cost: 2000 },
  { houseCode: 'H-012', description: 'Replace bathroom tiles',             scheduledDate: '2026-04-14', cost: 6000 },
  { houseCode: 'H-015', description: 'Water heater repair',                scheduledDate: '2026-04-15', cost: 4000 },
  { houseCode: 'H-017', description: 'Fix leakage in roof',                scheduledDate: '2026-04-20', cost: 3500 },
  { houseCode: 'H-020', description: 'Repair door lock mechanism',         scheduledDate: '2026-04-22', cost: 1500 },
  { houseCode: 'H-002', description: 'Electrical inspection',              scheduledDate: '2026-04-25', cost: 2500 },
  { houseCode: 'H-005', description: 'Painting and touch-up work',         scheduledDate: '2026-04-28', cost: 3500 },
];

console.log('Fetching house IDs...');
const [houses] = await db.query('SELECT house_id, reference_code FROM houses');
const houseMap = {};
for (const h of houses) {
  houseMap[h.reference_code] = h.house_id;
}
console.log('House map:', houseMap);

let inserted = 0;
let failed = 0;

for (const task of maintenanceData) {
  const houseId = houseMap[task.houseCode];
  if (!houseId) {
    console.error(`❌ House not found: ${task.houseCode}`);
    failed++;
    continue;
  }
  try {
    await db.query(
      'INSERT INTO maintenance_tasks (house_id, description, cost, task_status, scheduled_date) VALUES (?, ?, ?, ?, ?)',
      [houseId, task.description, task.cost, 'Pending', task.scheduledDate]
    );
    console.log(`✅ Inserted: [${task.houseCode}] ${task.description}`);
    inserted++;
  } catch (err) {
    console.error(`❌ Failed to insert [${task.houseCode}] ${task.description}:`, err.message);
    failed++;
  }
}

console.log(`\nDone! Inserted: ${inserted}, Failed: ${failed}`);
await db.end();

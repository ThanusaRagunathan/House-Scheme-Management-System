import * as TenantModel from '../src/models/tenant.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const TenantId = 25;
    const occupation = 'Test';
    const dateOfBirth = '1988-11-22'; // Matches Mohamed Ameen data roughly
    const nic = '881234567V';
    const phone = '0771112223';
    const email = 'test@example.com';
    const houseCode = 'H - 001'; 
    const familyMembers = [];

    console.log("Calling TenantModel.updateTenant...");
    const res = await TenantModel.updateTenant(TenantId, occupation, dateOfBirth, nic, phone, email, houseCode, familyMembers);
    console.log("Result:", res);
  } catch (error) {
    console.error("CRASH DETECTED:");
    console.error(error);
  }
  process.exit();
}

test();

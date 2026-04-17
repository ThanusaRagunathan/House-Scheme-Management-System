import * as TenantModel from "../models/tenant.model.js";

export const getAllTenants = async (req, res) => {
  try {
    const Tenants = await TenantModel.getAllTenants();
    res.json(Tenants);
  } catch (error) {
    console.error("Get Tenants error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTenantById = async (req, res) => {
  try {
    const { id } = req.params;
    const Tenant = await TenantModel.getTenantById(id);
    if (!Tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json(Tenant);
  } catch (error) {
    console.error("Get Tenant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTenant = async (req, res) => {
  try {
    const { userId, fullName, nic, occupation, dateOfBirth, houseId, leaseStartDate } = req.body;

    if (!userId || !fullName || !nic) {
      return res.status(400).json({ message: "Missing required fields (NIC is required)" });
    }

    const TenantId = await TenantModel.createTenant(userId, fullName, nic, occupation, dateOfBirth);

    // If a house is specified, link it in the tenancies table
    if (houseId) {
      await TenantModel.allocateHouse(TenantId, houseId, leaseStartDate);
    }

    res.status(201).json({ message: "Tenant created and house allocated", TenantId });
  } catch (error) {
    console.error("Create Tenant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { occupation, dateOfBirth, nic, phone, email, houseCode } = req.body;

    const success = await TenantModel.updateTenant(id, occupation, dateOfBirth, nic, phone, email, houseCode);
    if (!success) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json({ message: "Tenant updated" });
  } catch (error) {
    console.error("Update Tenant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await TenantModel.deleteTenant(id);
    if (!success) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json({ message: "Tenant deleted" });
  } catch (error) {
    console.error("Delete Tenant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTenantProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const Tenant = await TenantModel.getTenantByUserId(userId);
    if (!Tenant) {
      return res.status(404).json({ message: "Tenant profile not found" });
    }
    res.json(Tenant);
  } catch (error) {
    console.error("Get Tenant profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

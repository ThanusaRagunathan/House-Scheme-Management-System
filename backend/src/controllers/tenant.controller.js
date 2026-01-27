import * as tenantModel from "../models/tenant.model.js";

export const getAllTenants = async (req, res) => {
  try {
    const tenants = await tenantModel.getAllTenants();
    res.json(tenants);
  } catch (error) {
    console.error("Get tenants error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTenantById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await tenantModel.getTenantById(id);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json(tenant);
  } catch (error) {
    console.error("Get tenant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTenant = async (req, res) => {
  try {
    const { userId, occupation, dateOfBirth } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const tenantId = await tenantModel.createTenant(userId, occupation, dateOfBirth);
    res.status(201).json({ message: "Tenant created", tenantId });
  } catch (error) {
    console.error("Create tenant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { occupation, dateOfBirth } = req.body;
    
    const success = await tenantModel.updateTenant(id, occupation, dateOfBirth);
    if (!success) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json({ message: "Tenant updated" });
  } catch (error) {
    console.error("Update tenant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await tenantModel.deleteTenant(id);
    if (!success) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json({ message: "Tenant deleted" });
  } catch (error) {
    console.error("Delete tenant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

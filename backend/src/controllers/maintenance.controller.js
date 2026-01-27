import * as maintenanceModel from "../models/maintenance.model.js";

export const getAllMaintenance = async (req, res) => {
  try {
    const { houseId } = req.query;
    const maintenance = await maintenanceModel.getAllMaintenance(houseId);
    res.json(maintenance);
  } catch (error) {
    console.error("Get maintenance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceModel.getMaintenanceById(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance task not found" });
    }
    res.json(maintenance);
  } catch (error) {
    console.error("Get maintenance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createMaintenance = async (req, res) => {
  try {
    const { houseId, description, cost, taskStatus, scheduledDate } = req.body;
    
    if (!houseId || !description || !taskStatus) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const taskId = await maintenanceModel.createMaintenance(
      houseId, description, cost, taskStatus, scheduledDate
    );
    res.status(201).json({ message: "Maintenance task created", taskId });
  } catch (error) {
    console.error("Create maintenance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, cost, taskStatus, completionDate } = req.body;
    
    const success = await maintenanceModel.updateMaintenance(
      id, description, cost, taskStatus, completionDate
    );
    if (!success) {
      return res.status(404).json({ message: "Maintenance task not found" });
    }
    res.json({ message: "Maintenance task updated" });
  } catch (error) {
    console.error("Update maintenance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await maintenanceModel.deleteMaintenance(id);
    if (!success) {
      return res.status(404).json({ message: "Maintenance task not found" });
    }
    res.json({ message: "Maintenance task deleted" });
  } catch (error) {
    console.error("Delete maintenance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

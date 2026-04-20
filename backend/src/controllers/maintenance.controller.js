import * as maintenanceModel from "../models/maintenance.model.js";
import { auditLog } from "../utils/logger.js";
import { getMaintenanceByUserId } from "../models/maintenance.model.js";
import { getTenantByUserId } from "../models/tenant.model.js";
import { getHouseUsers } from "../models/house.model.js";
import { getAllUserIds } from "../models/user.model.js";
import { createNotification } from "../models/notification.model.js";

const notifyMaintenanceUsers = async (houseId, facility, description, status) => {
  const title = `Maintenance Update: ${status}`;
  
  try {
    if (houseId) {
      const { users, houseCode } = await getHouseUsers(houseId);
      const desc = `${description} at House ${houseCode || houseId}`;
      for (const userId of users) {
        await createNotification(userId, title, desc, "New", "Maintenance");
      }
    } else if (facility) {
      const users = await getAllUserIds();
      const desc = `${description} at Facility: ${facility}`;
      for (const userId of users) {
        await createNotification(userId, title, desc, "New", "Maintenance");
      }
    }
  } catch (err) {
    console.error("Failed to send maintenance notifications:", err);
  }
};

export const getAllMaintenance = async (req, res) => {
  try {
    // Tenants should only see maintenance for their own house
    if (req.user.role === 'Tenant') {
      const maintenance = await getMaintenanceByUserId(req.user.id);
      return res.json(maintenance);
    }
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
    let { houseId, description, cost, taskStatus, scheduledDate, facility, date, status, category } = req.body;
    
    // If Tenant, override houseId with their own and set status to Requested
    if (req.user.role === 'Tenant') {
      const tenant = await getTenantByUserId(req.user.id);
      if (!tenant || !tenant.house_id) {
        return res.status(400).json({ message: "No house assigned to this tenant" });
      }
      houseId = tenant.house_id;
      status = "Requested";
      category = "Maintenance";
      facility = null; // Tenants only request for their own house
    }

    // Support aliases from different frontend forms
    const finalDate = scheduledDate || date;
    const finalStatus = taskStatus || status;
    
    if ((!houseId && !facility) || !description || !finalStatus) {
      return res.status(400).json({ message: "Missing required fields (Description, Status, and either House or Facility)" });
    }
    
    const taskId = await maintenanceModel.createMaintenance(
      houseId, description, cost, finalStatus, finalDate, facility, category
    );

    auditLog(req.user.id, req.user.role, "CREATE_MAINTENANCE", { taskId, houseId, facility, description });
    
    await notifyMaintenanceUsers(houseId, facility, description, finalStatus);

    res.status(201).json({ message: "Maintenance task created", taskId });
  } catch (error) {
    console.error("Create maintenance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    let { description, cost, taskStatus, completionDate, facility, status, category } = req.body;
    
    const finalStatus = taskStatus || status;

    // Auto-set completion date if status is set to Completed and date is missing
    if (finalStatus === 'Completed' && !completionDate) {
      completionDate = new Date().toISOString().split('T')[0];
    }
    
    // Need houseId/facility for notification, might not be in payload
    // Fetch it from DB
    const existing = await maintenanceModel.getMaintenanceById(id);
    if (!existing) {
      return res.status(404).json({ message: "Maintenance task not found" });
    }
    
    const finalHouseId = existing.house_id; // payload doesn't typically update houseId
    const finalFacility = facility !== undefined ? facility : existing.facility;
    const finalDescription = description !== undefined ? description : existing.description;

    const success = await maintenanceModel.updateMaintenance(
      id, finalDescription, cost, finalStatus, completionDate, finalFacility, category
    );
    if (!success) {
      return res.status(404).json({ message: "Maintenance task not found" });
    }

    auditLog(req.user.id, req.user.role, "UPDATE_MAINTENANCE", { taskId: id, taskStatus, cost });
    
    await notifyMaintenanceUsers(finalHouseId, finalFacility, finalDescription, finalStatus);

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

    auditLog(req.user.id, req.user.role, "DELETE_MAINTENANCE", { maintenanceId: id });

    res.json({ message: "Maintenance task deleted" });
  } catch (error) {
    console.error("Delete maintenance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

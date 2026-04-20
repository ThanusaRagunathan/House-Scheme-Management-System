import * as complaintModel from "../models/complaint.model.js";
import { getTenantByUserId } from "../models/tenant.model.js";

export const getAllComplaints = async (req, res) => {
  try {
    let { tenancyId } = req.query;
    
    // If Tenant, force them to only see their own complaints
    if (req.user.role === 'Tenant') {
      const tenant = await getTenantByUserId(req.user.id);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant record not found" });
      }
      tenancyId = tenant.tenancyId;
    }

    const complaints = await complaintModel.getAllComplaints(tenancyId);
    res.json(complaints);
  } catch (error) {
    console.error("Get complaints error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await complaintModel.getComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Security Fix: Tenants cannot see other tenants' complaints
    if (req.user.role === 'Tenant') {
        const tenant = await getTenantByUserId(req.user.id);
        if (!tenant || tenant.tenancyId !== complaint.tenancy_id) {
            return res.status(403).json({ message: "Access denied. You can only view your own complaints." });
        }
    }

    res.json(complaint);
  } catch (error) {
    console.error("Get complaint error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createComplaint = async (req, res) => {
  try {
    const { tenancyId, title, description, status } = req.body;
    
    if (!tenancyId || !title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const attachmentUrl = req.file ? `/uploads/complaints/${req.file.filename}` : null;
    
    const complaintId = await complaintModel.createComplaint(
      tenancyId, title, description, status || "Open", attachmentUrl
    );
    res.status(201).json({ message: "Complaint created", complaintId });
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, response, resolvedDate } = req.body;
    
    // Auto-set resolved date if status is set to Resolved and date is missing
    if (status === 'Resolved' && !resolvedDate) {
      resolvedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    const success = await complaintModel.updateComplaint(id, status, response, resolvedDate);
    if (!success) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Complaint updated" });
  } catch (error) {
    console.error("Update complaint error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await complaintModel.deleteComplaint(id);
    if (!success) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Complaint deleted" });
  } catch (error) {
    console.error("Delete complaint error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

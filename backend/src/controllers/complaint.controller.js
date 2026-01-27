import * as complaintModel from "../models/complaint.model.js";

export const getAllComplaints = async (req, res) => {
  try {
    const { tenancyId } = req.query;
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
    
    const complaintId = await complaintModel.createComplaint(
      tenancyId, title, description, status || "Open"
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
    const { status, response, resolvedDate } = req.body;
    
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

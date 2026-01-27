import * as reportModel from "../models/report.model.js";

export const getAllReports = async (req, res) => {
  try {
    const { generatedBy } = req.query;
    const reports = await reportModel.getAllReports(generatedBy);
    res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportModel.getReportById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json(report);
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createReport = async (req, res) => {
  try {
    const { reportName, reportType, content, generatedBy } = req.body;
    
    if (!reportType || !content || !generatedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const reportId = await reportModel.createReport(reportName, reportType, content, generatedBy);
    res.status(201).json({ message: "Report created", reportId });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { reportName, reportType, content } = req.body;
    
    const success = await reportModel.updateReport(id, reportName, reportType, content);
    if (!success) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ message: "Report updated" });
  } catch (error) {
    console.error("Update report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await reportModel.deleteReport(id);
    if (!success) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ message: "Report deleted" });
  } catch (error) {
    console.error("Delete report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

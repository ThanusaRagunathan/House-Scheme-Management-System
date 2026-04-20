import * as reportModel from "../models/report.model.js";

export const generateReport = async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    
    let data;
    let title;

    switch (type) {
      case "tenants":
        data = await reportModel.getTenantReport();
        title = "Tenant List and Lease Status";
        break;
      case "occupancy":
        data = await reportModel.getOccupancyReport();
        title = "Property Occupancy Report";
        break;
      case "finance":
        data = await reportModel.getFinancialReport(startDate, endDate);
        title = "Financial Income and Expense Report";
        // Financial report has a structured response, pass it directly
        return res.json({
          title,
          generatedAt: new Date().toISOString(),
          ...data
        });
      case "maintenance":
        data = await reportModel.getMaintenanceReport();
        title = "Maintenance Task Analysis";
        break;
      case "complaints":
        data = await reportModel.getComplaintReport();
        title = "Complaint Management Report";
        break;
      case "audit":
        data = await reportModel.getAuditReport();
        title = "System Audit Trail";
        break;
      case "notifications":
        data = await reportModel.getNotificationReport();
        title = "Communication and Notification Log";
        break;
      case "documents":
        data = await reportModel.getDocumentReport();
        title = "Document Upload and Compliance Report";
        break;
      default:
        return res.status(400).json({ message: "Invalid report type" });
    }

    res.json({
      title,
      generatedAt: new Date().toISOString(),
      data
    });
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

// Keep basic CRUD for compatibility if needed, otherwise simplify
export const getAllReports = async (req, res) => {
  res.status(501).json({ message: "Use /generate/:type for dynamic reports" });
};

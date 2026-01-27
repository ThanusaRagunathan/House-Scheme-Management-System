import db from "../config/db.js";

export const getAllReports = async (generatedBy = null) => {
  let query = "SELECT * FROM reports";
  const params = [];
  
  if (generatedBy) {
    query += " WHERE generated_by = ?";
    params.push(generatedBy);
  }
  
  query += " ORDER BY generated_date DESC";
  const [rows] = await db.query(query, params);
  return rows;
};

export const getReportById = async (reportId) => {
  const [rows] = await db.query(
    "SELECT * FROM reports WHERE report_id = ?",
    [reportId]
  );
  return rows[0];
};

export const createReport = async (reportName, reportType, content, generatedBy) => {
  const [result] = await db.query(
    "INSERT INTO reports (report_name, report_type, content, generated_by) VALUES (?, ?, ?, ?)",
    [reportName, reportType, content, generatedBy]
  );
  return result.insertId;
};

export const updateReport = async (reportId, reportName, reportType, content) => {
  const [result] = await db.query(
    "UPDATE reports SET report_name = ?, report_type = ?, content = ? WHERE report_id = ?",
    [reportName, reportType, content, reportId]
  );
  return result.affectedRows > 0;
};

export const deleteReport = async (reportId) => {
  const [result] = await db.query(
    "DELETE FROM reports WHERE report_id = ?",
    [reportId]
  );
  return result.affectedRows > 0;
};

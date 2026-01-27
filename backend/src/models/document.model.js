import db from "../config/db.js";

export const getAllDocuments = async (houseId = null) => {
  let query = "SELECT * FROM documents";
  const params = [];
  
  if (houseId) {
    query += " WHERE house_id = ?";
    params.push(houseId);
  }
  
  query += " ORDER BY upload_date DESC";
  const [rows] = await db.query(query, params);
  return rows;
};

export const getDocumentById = async (documentId) => {
  const [rows] = await db.query(
    "SELECT * FROM documents WHERE document_id = ?",
    [documentId]
  );
  return rows[0];
};

export const createDocument = async (documentName, documentType, houseId) => {
  const [result] = await db.query(
    "INSERT INTO documents (document_name, document_type, house_id) VALUES (?, ?, ?)",
    [documentName, documentType, houseId]
  );
  return result.insertId;
};

export const updateDocument = async (documentId, documentName, documentType) => {
  const [result] = await db.query(
    "UPDATE documents SET document_name = ?, document_type = ? WHERE document_id = ?",
    [documentName, documentType, documentId]
  );
  return result.affectedRows > 0;
};

export const deleteDocument = async (documentId) => {
  const [result] = await db.query(
    "DELETE FROM documents WHERE document_id = ?",
    [documentId]
  );
  return result.affectedRows > 0;
};

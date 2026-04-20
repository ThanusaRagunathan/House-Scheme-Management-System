import db from "../config/db.js";

export const getAllDocuments = async (houseId = null) => {
  let query = `
    SELECT d.document_id, d.document_name, d.document_type, d.file_path,
           d.iv, d.is_encrypted, d.upload_date, d.is_deleted,
           h.reference_code AS house_code
    FROM documents d
    LEFT JOIN houses h ON d.house_id = h.house_id
    WHERE d.is_deleted = 0
  `;
  const params = [];

  if (houseId) {
    query += " AND d.house_id = ?";
    params.push(houseId);
  }

  query += " ORDER BY d.upload_date DESC";
  const [rows] = await db.query(query, params);
  return rows;
};

export const getDocumentsByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT d.document_id, d.document_name, d.document_type, d.file_path,
            d.iv, d.is_encrypted, d.upload_date,
            h.reference_code AS house_code
     FROM documents d
     JOIN houses h ON d.house_id = h.house_id
     JOIN tenancies ten ON ten.house_id = h.house_id
     JOIN Tenants t ON ten.Tenant_id = t.Tenant_id
     WHERE t.user_id = ? AND d.is_deleted = 0 AND ten.is_deleted = 0
     ORDER BY d.upload_date DESC`,
    [userId]
  );
  return rows;
};

export const getDocumentById = async (documentId) => {
  const [rows] = await db.query(
    `SELECT d.*, h.reference_code AS house_code
     FROM documents d
     LEFT JOIN houses h ON d.house_id = h.house_id
     WHERE d.document_id = ? AND d.is_deleted = 0`,
    [documentId]
  );
  return rows[0];
};

export const createDocument = async (documentName, documentType, houseId, filePath, iv = null, isEncrypted = 0) => {
  const [result] = await db.query(
    "INSERT INTO documents (document_name, document_type, house_id, file_path, iv, is_encrypted) VALUES (?, ?, ?, ?, ?, ?)",
    [documentName, documentType, houseId, filePath, iv, isEncrypted]
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
    "UPDATE documents SET is_deleted = 1 WHERE document_id = ?",
    [documentId]
  );
  return result.affectedRows > 0;
};

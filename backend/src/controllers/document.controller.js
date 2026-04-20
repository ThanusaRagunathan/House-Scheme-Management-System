import path from "path";
import fs from "fs";
import * as documentModel from "../models/document.model.js";
import { encryptFile, decryptFileToStream } from "../utils/crypto.utils.js";

const UPLOAD_DIR = path.resolve("uploads/documents");

export const getAllDocuments = async (req, res) => {
  try {
    if (req.user.role === "Tenant") {
      const documents = await documentModel.getDocumentsByUserId(req.user.id);
      return res.json(documents);
    }
    const { houseId } = req.query;
    const documents = await documentModel.getAllDocuments(houseId);
    res.json(documents);
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await documentModel.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(document);
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createDocument = async (req, res) => {
  let tempPath = null;
  let encryptedPath = null;

  try {
    const { documentName, documentType, houseId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File upload is required." });
    }
    if (!documentType || !houseId) {
      return res.status(400).json({ message: "Missing required fields (Type, House ID)" });
    }

    tempPath = req.file.path; // multer-saved original
    const encryptedFilename = req.file.filename + ".enc";
    encryptedPath = path.join(UPLOAD_DIR, encryptedFilename);

    // Encrypt the uploaded file — returns the IV as hex
    const iv = await encryptFile(tempPath, encryptedPath);

    // Remove the unencrypted temp file immediately
    fs.unlink(tempPath, () => {});
    tempPath = null;

    const docName = documentName || req.file.originalname;
    const documentId = await documentModel.createDocument(
      docName, documentType, houseId, encryptedFilename, iv, 1
    );

    res.status(201).json({
      message: "Document uploaded and stored securely.",
      documentId,
      filename: encryptedFilename
    });
  } catch (error) {
    // Clean up on failure
    if (tempPath) fs.unlink(tempPath, () => {});
    if (encryptedPath) fs.unlink(encryptedPath, () => {});
    console.error("Create document error:", error);
    res.status(500).json({ message: error.message || "Server error during file upload" });
  }
};

/**
 * Authenticated file download — decrypts on-the-fly and streams to client.
 * Only authorised users can access this route; the static /uploads path should NOT be public.
 */
export const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await documentModel.getDocumentById(id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Tenants can only access documents for their own house
    if (req.user.role === "Tenant") {
      const tenantDocs = await documentModel.getDocumentsByUserId(req.user.id);
      const allowed = tenantDocs.some(d => d.document_id === doc.document_id);
      if (!allowed) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    const encryptedPath = path.join(UPLOAD_DIR, doc.file_path);

    if (!fs.existsSync(encryptedPath)) {
      return res.status(404).json({ message: "File not found on server." });
    }

    // Determine original MIME type from extension (before .enc was appended)
    const originalFilename = doc.file_path.replace(/\.enc$/, "");
    const ext = path.extname(originalFilename).toLowerCase();
    const mimeMap = {
      ".pdf":  "application/pdf",
      ".jpg":  "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png":  "image/png",
    };
    const mimeType = mimeMap[ext] || "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(doc.document_name)}"`
    );

    if (doc.is_encrypted && doc.iv) {
      // Decrypt and stream
      await decryptFileToStream(encryptedPath, doc.iv, res);
    } else {
      // Legacy unencrypted file — stream directly
      fs.createReadStream(encryptedPath).pipe(res);
    }
  } catch (error) {
    console.error("Download document error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to retrieve document." });
    }
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentName, documentType } = req.body;
    const success = await documentModel.updateDocument(id, documentName, documentType);
    if (!success) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ message: "Document updated" });
  } catch (error) {
    console.error("Update document error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await documentModel.deleteDocument(id);
    if (!success) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ message: "Document deleted" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

import express from "express";
import * as documentController from "../controllers/document.controller.js";
import { verifyToken, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// List documents (role-filtered in controller)
router.get("/", verifyToken, authorize("Owner", "Treasurer", "Tenant"), documentController.getAllDocuments);

// Get document metadata
router.get("/:id", verifyToken, authorize("Owner", "Treasurer", "Tenant"), documentController.getDocumentById);

// Authenticated download — decrypts on-the-fly, requires valid JWT
router.get("/:id/download", verifyToken, authorize("Owner", "Treasurer", "Tenant"), documentController.downloadDocument);

// Upload with encryption
router.post("/", verifyToken, authorize("Owner", "Treasurer"), upload.single("file"), documentController.createDocument);

// Update metadata only
router.put("/:id", verifyToken, authorize("Owner", "Treasurer"), documentController.updateDocument);

// Soft delete
router.delete("/:id", verifyToken, authorize("Owner", "Treasurer"), documentController.deleteDocument);

export default router;

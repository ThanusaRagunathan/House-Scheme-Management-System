import express from "express";
import * as documentController from "../controllers/document.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, documentController.getAllDocuments);
router.get("/:id", verifyToken, documentController.getDocumentById);
router.post("/", verifyToken, documentController.createDocument);
router.put("/:id", verifyToken, documentController.updateDocument);
router.delete("/:id", verifyToken, documentController.deleteDocument);

export default router;

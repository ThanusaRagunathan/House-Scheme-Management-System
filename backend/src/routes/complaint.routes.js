import express from "express";
import * as complaintController from "../controllers/complaint.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

import { uploadComplaintImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", verifyToken, complaintController.getAllComplaints);
router.get("/:id", verifyToken, complaintController.getComplaintById);
router.post("/", verifyToken, uploadComplaintImage.single("image"), complaintController.createComplaint);
router.put("/:id", verifyToken, complaintController.updateComplaint);
router.delete("/:id", verifyToken, complaintController.deleteComplaint);

export default router;

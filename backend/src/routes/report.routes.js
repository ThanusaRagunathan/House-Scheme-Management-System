import express from "express";
import * as reportController from "../controllers/report.controller.js";
import { verifyToken, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Dynamic Report Generation - Owners and Treasurers only
router.get("/generate/:type", verifyToken, authorize("Owner", "Treasurer"), reportController.generateReport);

// All reports metadata
router.get("/", verifyToken, authorize("Owner", "Treasurer"), reportController.getAllReports);

export default router;

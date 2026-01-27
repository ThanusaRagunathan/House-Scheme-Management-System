import express from "express";
import * as reportController from "../controllers/report.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, reportController.getAllReports);
router.get("/:id", verifyToken, reportController.getReportById);
router.post("/", verifyToken, reportController.createReport);
router.put("/:id", verifyToken, reportController.updateReport);
router.delete("/:id", verifyToken, reportController.deleteReport);

export default router;

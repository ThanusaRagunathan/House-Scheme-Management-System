import express from "express";
import * as maintenanceController from "../controllers/maintenance.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, maintenanceController.getAllMaintenance);
router.get("/:id", verifyToken, maintenanceController.getMaintenanceById);
router.post("/", verifyToken, maintenanceController.createMaintenance);
router.put("/:id", verifyToken, maintenanceController.updateMaintenance);
router.delete("/:id", verifyToken, maintenanceController.deleteMaintenance);

export default router;

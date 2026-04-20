import express from "express";
import * as maintenanceController from "../controllers/maintenance.controller.js";
import { verifyToken, authorize } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { maintenanceSchema } from "../validators/maintenance.validator.js";

const router = express.Router();

// Get all maintenance - All roles
router.get("/", verifyToken, authorize("Owner", "Treasurer", "Tenant"), maintenanceController.getAllMaintenance);

// Get specific task
router.get("/:id", verifyToken, authorize("Owner", "Treasurer", "Tenant"), maintenanceController.getMaintenanceById);

// Create task - Owners and Tenants
router.post("/", verifyToken, authorize("Owner", "Tenant"), maintenanceSchema, validateRequest, maintenanceController.createMaintenance);

// Update task - Owners and Treasurers
router.put("/:id", verifyToken, authorize("Owner", "Treasurer"), maintenanceSchema, validateRequest, maintenanceController.updateMaintenance);

// Delete task - Owners only
router.delete("/:id", verifyToken, authorize("Owner"), maintenanceController.deleteMaintenance);

export default router;

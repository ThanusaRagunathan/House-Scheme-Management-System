import express from "express";
import * as TenantController from "../controllers/Tenant.controller.js";
import { verifyToken, authorize } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { tenantSchema } from "../validators/tenant.validator.js";

const router = express.Router();

// Get all tenants - Owners and Treasurers only
router.get("/", verifyToken, authorize("Owner", "Treasurer"), TenantController.getAllTenants);

// Get tenant profile - Tenant self access
router.get("/profile", verifyToken, authorize("Tenant"), TenantController.getTenantProfile);

// Get specific tenant - Owners and Treasurers
router.get("/:id", verifyToken, authorize("Owner", "Treasurer"), TenantController.getTenantById);

// Create tenant - Owners only
router.post("/", verifyToken, authorize("Owner"), tenantSchema, validateRequest, TenantController.createTenant);

// Update tenant - Owners and Treasurers
router.put("/:id", verifyToken, authorize("Owner", "Treasurer"), tenantSchema, validateRequest, TenantController.updateTenant);

// Delete tenant - Owners and Treasurers
router.delete("/:id", verifyToken, authorize("Owner", "Treasurer"), TenantController.deleteTenant);

export default router;

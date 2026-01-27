import express from "express";
import * as tenantController from "../controllers/tenant.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, tenantController.getAllTenants);
router.get("/:id", verifyToken, tenantController.getTenantById);
router.post("/", verifyToken, tenantController.createTenant);
router.put("/:id", verifyToken, tenantController.updateTenant);
router.delete("/:id", verifyToken, tenantController.deleteTenant);

export default router;

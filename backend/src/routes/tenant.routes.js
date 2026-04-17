import express from "express";
import * as TenantController from "../controllers/Tenant.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, TenantController.getAllTenants);
router.get("/profile", verifyToken, TenantController.getTenantProfile);
router.get("/:id", verifyToken, TenantController.getTenantById);
router.post("/", verifyToken, TenantController.createTenant);
router.put("/:id", verifyToken, TenantController.updateTenant);
router.delete("/:id", verifyToken, TenantController.deleteTenant);

export default router;

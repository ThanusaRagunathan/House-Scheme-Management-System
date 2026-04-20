import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { verifyToken, authorize } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { paymentSchema } from "../validators/payment.validator.js";

const router = express.Router();

// Get all payments - Owners, Treasurers, and Tenants (Tenants see filtered in ctrl)
router.get("/", verifyToken, authorize("Owner", "Treasurer", "Tenant"), paymentController.getAllPayments);

// Get specific payment
router.get("/:id", verifyToken, authorize("Owner", "Treasurer", "Tenant"), paymentController.getPaymentById);

// Create payment - Owner, Treasurer, Tenant
router.post("/", verifyToken, authorize("Owner", "Treasurer", "Tenant"), paymentSchema, validateRequest, paymentController.createPayment);

// Update payment - Owners and Treasurers
router.put("/:id", verifyToken, authorize("Owner", "Treasurer"), paymentSchema, validateRequest, paymentController.updatePayment);

// Delete payment - Owners only
router.delete("/:id", verifyToken, authorize("Owner"), paymentController.deletePayment);

export default router;

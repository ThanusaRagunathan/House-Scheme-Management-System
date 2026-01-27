import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, paymentController.getAllPayments);
router.get("/:id", verifyToken, paymentController.getPaymentById);
router.post("/", verifyToken, paymentController.createPayment);
router.put("/:id", verifyToken, paymentController.updatePayment);
router.delete("/:id", verifyToken, paymentController.deletePayment);

export default router;

import * as paymentModel from "../models/payment.model.js";
import { auditLog } from "../utils/logger.js";
import { getTenantByUserId } from "../models/tenant.model.js";

export const getAllPayments = async (req, res) => {
  try {
    // Tenants should only see their own payments
    if (req.user.role === 'Tenant') {
      const payments = await paymentModel.getPaymentsByUserId(req.user.id);
      return res.json(payments);
    }
    const { tenancyId, tenantId } = req.query;
    
    // Owners should only see payments for their own houses
    let ownerId = null;
    if (req.user.role === 'Owner') {
      ownerId = req.user.id;
    }

    const payments = await paymentModel.getAllPayments(tenancyId, ownerId, tenantId);
    res.json(payments);
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await paymentModel.getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { tenancyId, amount, status, paidDate, dueDate, invoiceNo, paymentMethod } = req.body;
    
    const finalStatus = status || "Paid";
    const finalPaidDate = paidDate || new Date().toISOString().split('T')[0];
    const finalDueDate = dueDate || finalPaidDate;

    const paymentId = await paymentModel.createPayment(
      tenancyId, amount, finalStatus, finalPaidDate, finalDueDate, invoiceNo, paymentMethod
    );

    auditLog(req.user.id, req.user.role, "CREATE_PAYMENT", { paymentId, tenancyId, amount, invoiceNo });

    res.status(201).json({ message: "Payment created", paymentId });
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, status, paidDate, paymentMethod } = req.body;
    
    const success = await paymentModel.updatePayment(id, amount, status, paidDate, paymentMethod);
    if (!success) {
      return res.status(404).json({ message: "Payment not found" });
    }

    auditLog(req.user.id, req.user.role, "UPDATE_PAYMENT", { paymentId: id, status, amount });

    res.json({ message: "Payment updated" });
  } catch (error) {
    console.error("Update payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await paymentModel.deletePayment(id);
    if (!success) {
      return res.status(404).json({ message: "Payment not found" });
    }

    auditLog(req.user.id, req.user.role, "DELETE_PAYMENT", { paymentId: id });

    res.json({ message: "Payment deleted" });
  } catch (error) {
    console.error("Delete payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

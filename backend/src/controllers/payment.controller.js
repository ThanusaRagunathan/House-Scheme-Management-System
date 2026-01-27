import * as paymentModel from "../models/payment.model.js";

export const getAllPayments = async (req, res) => {
  try {
    const { tenancyId } = req.query;
    const payments = await paymentModel.getAllPayments(tenancyId);
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
    
    if (!tenancyId || !amount || !status || !invoiceNo || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const paymentId = await paymentModel.createPayment(
      tenancyId, amount, status, paidDate, dueDate, invoiceNo, paymentMethod
    );
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
    res.json({ message: "Payment deleted" });
  } catch (error) {
    console.error("Delete payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

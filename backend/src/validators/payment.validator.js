import { body } from "express-validator";

export const paymentSchema = [
  body("tenancyId").isInt().withMessage("Valid tenancy ID is required"),
  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),
  body("status").isIn(["Paid", "Pending", "Failed"]).withMessage("Invalid status"),
  body("paymentMethod").notEmpty().withMessage("Payment method is required"),
  body("paidDate").isDate().withMessage("Valid paid date is required")
    .custom((value, { req }) => {
      const paidDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isRent = req.body.type === "Rent"; // We'll expect a 'type' field or infer it

      if (isRent && paidDate < today) {
        throw new Error("Rent payments cannot be recorded with past dates");
      }
      return true;
    }),
  body("invoiceNo").optional().trim()
];

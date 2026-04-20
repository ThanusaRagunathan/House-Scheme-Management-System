import { body } from "express-validator";

export const maintenanceSchema = [
  body("houseId").isInt().withMessage("Valid house ID is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("scheduledDate").optional().isDate().withMessage("Valid scheduled date is required"),
  body("cost").optional().isFloat({ min: 0 }).withMessage("Cost must be a positive number"),
  body("taskStatus").optional().isIn(["Pending", "In Progress", "Completed"]).withMessage("Invalid status")
];

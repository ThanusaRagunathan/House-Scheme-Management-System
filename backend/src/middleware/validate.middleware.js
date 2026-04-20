import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

export const dateValidator = (value, { req }) => {
  if (!value) return true;
  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Requirement: Past dates allowed only for Payments and Maintenance Cost
  // This logic will be applied specifically in the route/schema definition
  return true; 
};

import { body } from "express-validator";

// Note: email and phone are marked optional here because the registration flow
// sends those fields to /auth/register (step 1). The /Tenants endpoint (step 2)
// only receives the tenant profile data (fullName, nic, dateOfBirth, etc.).
export const tenantSchema = [
  body("fullName").optional().trim().notEmpty().withMessage("Full name is required"),
  body("email").optional({ nullable: true, checkFalsy: true }).isEmail().withMessage("Valid email is required"),
  body("phone").optional({ nullable: true, checkFalsy: true }).matches(/^\d{10}$/).withMessage("Phone must be exactly 10 digits"),
  body("nic").matches(/^([0-9]{9}[vVxX]|[0-9]{12})$/).withMessage("Invalid NIC format"),
  body("dateOfBirth").isDate().withMessage("Valid date of birth is required"),
  body("occupation").optional().trim(),
];

export const allocationSchema = [
  body("houseId").isInt().withMessage("Valid house ID is required"),
  body("startDate").isDate().withMessage("Valid start date is required")
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (date < today) {
        throw new Error("Lease start date cannot be in the past");
      }
      return true;
    })
];

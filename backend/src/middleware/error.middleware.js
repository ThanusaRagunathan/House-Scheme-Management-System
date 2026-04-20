export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mask database specific errors
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "A duplicate record already exists in the system.";
  } else if (err.code === "ER_ROW_IS_REFERENCED_2") {
    statusCode = 400;
    message = "Cannot delete this record because it is referenced elsewhere in the system.";
  }

  console.error(`[Error] ${req.method} ${req.url}:`, {
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack, details: err.message })
  });
};

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

import express from "express";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import houseRoutes from "./routes/house.routes.js";
import TenantRoutes from "./routes/Tenant.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import documentRoutes from "./routes/document.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import reportRoutes from "./routes/report.routes.js";

import sanitizeHtml from "sanitize-html";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
// Complaint images are served publicly (non-sensitive attachments)
// Document files are NEVER served statically — they require authentication + decryption via /api/documents/:id/download
app.use("/uploads/complaints", express.static(path.join(process.cwd(), "uploads/complaints")));

// Basic Sanitizer
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      }
    }
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/Tenants", TenantRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);

// Error Handler Middleware
app.use(errorHandler);

export default app;

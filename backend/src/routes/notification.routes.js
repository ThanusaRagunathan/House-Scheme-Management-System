import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, notificationController.getAllNotifications);
router.get("/:id", verifyToken, notificationController.getNotificationById);
router.post("/", verifyToken, notificationController.createNotification);
router.put("/:id", verifyToken, notificationController.updateNotification);
router.delete("/:id", verifyToken, notificationController.deleteNotification);

export default router;

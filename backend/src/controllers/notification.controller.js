import * as notificationModel from "../models/notification.model.js";
import { getAllUserIds } from "../models/user.model.js";

export const getAllNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    const notifications = await notificationModel.getAllNotifications(userId);
    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationModel.getNotificationById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    console.error("Get notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, title, description, status, message, type } = req.body;
    
    // Support 'message' as an alias for 'description'
    const finalDescription = description || message;
    
    if (!finalDescription) {
      return res.status(400).json({ message: "Description/Message is required" });
    }

    const finalType = type || "General";

    // Broadcast logic
    if (userId === "all" || !userId) {
      const userIds = await getAllUserIds();
      const createPromises = userIds.map(id => 
        notificationModel.createNotification(id, title, finalDescription, status || "New", finalType)
      );
      await Promise.all(createPromises);
      return res.status(201).json({ message: "Broadcast notifications created" });
    }
    
    const notificationId = await notificationModel.createNotification(
      userId, title, finalDescription, status || "New", finalType
    );
    res.status(201).json({ message: "Notification created", notificationId });
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    const success = await notificationModel.updateNotification(id, status);
    if (!success) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification updated" });
  } catch (error) {
    console.error("Update notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await notificationModel.deleteNotification(id);
    if (!success) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

import * as notificationModel from "../models/notification.model.js";

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
    const { userId, title, description, status } = req.body;
    
    if (!userId || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const notificationId = await notificationModel.createNotification(
      userId, title, description, status || "New"
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

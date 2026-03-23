import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getNotifications, updateNotification, deleteNotification } from "../../services/api";

function OwnerNotification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Fallback for demo
      setNotifications([
        { id: 1, title: "Rent payment due", description: "Your rent payment for November 2025 is due on November 1st.", date: "2025-11-01", status: "unread" },
        { id: 2, title: "Pool closure", description: "The swimming pool will be closed for maintenance Oct 22-24.", date: "2025-10-20", status: "unread" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    setActionLoading(true);
    try {
        await updateNotification(id, { status: 'read' });
        setNotifications(notifications.map(n => n.id === id ? { ...n, status: 'read' } : n));
    } catch (error) {
        console.error("Failed to update notification:", error);
        alert("Action failed: " + error.message);
    } finally {
        setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    setActionLoading(true);
    try {
        await deleteNotification(id);
        setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
        console.error("Failed to delete notification:", error);
        alert("Action failed: " + error.message);
    } finally {
        setActionLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <DashboardLayout
      role="owner"
      title="Notifications & Updates"
      userName="Suresh Kumar"
      userInitials="SK"
      userRoleLabel="Property Owner"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "35px" }}>
        {[
          { title: "Broadcast", sub: "Send to all", icon: "bi-megaphone", color: "#1a4d2e" },
          { title: "Rent Reminders", sub: "Send to debtors", icon: "bi-currency-dollar", color: "#e67e22" },
          { title: "Maintenance", sub: "Notify residents", icon: "bi-wrench", color: "#3498db" },
          { title: "Draft", sub: "Saved notices", icon: "bi-file-earmark-text", color: "var(--text-muted)" },
        ].map((action, i) => (
          <div key={i} className="glass-card clickable" style={{ padding: "20px", backgroundColor: "white", textAlign: "center", cursor: "pointer" }}>
            <div style={{ width: "45px", height: "45px", backgroundColor: `${action.color}1A`, color: action.color, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px", fontSize: "20px" }}>
              <i className={`bi ${action.icon}`}></i>
            </div>
            <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "5px" }}>{action.title}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{action.sub}</div>
          </div>
        ))}
      </div>

      <Card title="System Notifications" subtitle={`You have ${unreadCount} unread announcements and alerts.`}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading messages...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {notifications.map((n, i) => (
              <div key={i} style={{ 
                padding: "16px", borderRadius: "12px", borderLeft: `4px solid ${n.status === 'unread' ? 'var(--primary)' : '#ccc'}`,
                backgroundColor: n.status === 'unread' ? "#f8fdf9" : "white",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                    <span style={{ fontWeight: "700", color: n.status === 'unread' ? "var(--primary)" : "var(--text-dark)" }}>{n.title}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{new Date(n.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.4" }}>{n.description}</div>
                </div>
                <div style={{ marginLeft: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
                  {n.status === 'unread' ? (
                    <Button variant="secondary" onClick={() => handleMarkAsRead(n.id || n.notification_id)} disabled={actionLoading}>
                      Mark as Read
                    </Button>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#ccc" }}><i className="bi bi-check-all"></i> Seen</span>
                  )}
                  <button 
                    onClick={() => handleDelete(n.id || n.notification_id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#e03131", padding: "5px" }}
                    title="Delete"
                    disabled={actionLoading}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <i className="bi bi-bell-slash" style={{ fontSize: "40px", color: "#eee", display: "block", marginBottom: "15px" }}></i>
                <div style={{ color: "var(--text-muted)" }}>No notifications available.</div>
              </div>
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default OwnerNotification;

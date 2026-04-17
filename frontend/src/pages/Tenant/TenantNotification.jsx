import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getNotifications, getTenantProfile, updateNotification, deleteNotification } from "../../services/api";

function TenantNotification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [notifData, profileData] = await Promise.all([
        getNotifications(),
        getTenantProfile()
      ]);
      setNotifications(notifData);
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Fallback for demo
      setNotifications([
        { id: 1, title: "Rent payment due", description: "Your rent payment for November 2025 is due on November 1st.", date: "2025-11-01", status: "unread" },
        { id: 2, title: "Pool closure", description: "The swimming pool will be closed for quarterly maintenance Oct 22-24.", date: "2025-10-20", status: "unread" },
        { id: 3, title: "Complaint resolved", description: "Your request regarding 'Roof leakage' has been marked as resolved.", date: "2025-09-25", status: "read" },
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
      role="Tenant"
      title="Alerts & Announcements"
      userName={profile?.username || "Tenant"}
      userInitials={profile?.username?.charAt(0) || "R"}
      userRoleLabel={`${profile?.houseAddress || "Loading..."} - Tenant`}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "35px" }}>
        {[
          { title: "Unread", count: unreadCount, icon: "bi-envelope-exclamation", color: "var(--primary)" },
          { title: "Total Alerts", count: notifications.length, icon: "bi-bell", color: "#3498db" },
          { title: "Emergency", count: 0, icon: "bi-exclamation-triangle", color: "#e03131" },
          { title: "Broadcasts", count: Math.max(0, notifications.length - 1), icon: "bi-megaphone", color: "#1a4d2e" },
        ].map((action, i) => (
          <div key={i} className="glass-card" style={{ padding: "18px", backgroundColor: "white", textAlign: "center" }}>
            <div style={{ width: "35px", height: "35px", backgroundColor: `${action.color}1A`, color: action.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: "16px" }}>
              <i className={`bi ${action.icon}`}></i>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "3px" }}>{action.title}</div>
            <div style={{ fontSize: "18px", fontWeight: "700" }}>{action.count}</div>
          </div>
        ))}
      </div>

      <Card title="Recent Notifications" subtitle={`Stay updated with the latest community news and personal alerts.`}>
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
                  <div style={{ fontSize: "14px", color: "#555", lineHeight: "1.4" }}>{n.description}</div>
                </div>
                <div style={{ marginLeft: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
                  {n.status === 'unread' ? (
                    <Button variant="secondary" onClick={() => handleMarkAsRead(n.id || n.notification_id)} disabled={actionLoading}>
                      Mark as Read
                    </Button>
                  ) : (
                    <span style={{ fontSize: "11px", color: "#bbb", fontWeight: "500" }}><i className="bi bi-check2-all"></i> READ</span>
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
                <div style={{ color: "var(--text-muted)" }}>No notifications at the moment.</div>
              </div>
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default TenantNotification;

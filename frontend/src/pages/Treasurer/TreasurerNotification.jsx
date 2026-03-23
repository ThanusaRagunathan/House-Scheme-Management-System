import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getNotifications, updateNotification, deleteNotification } from "../../services/api";

function SummaryCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white" }}>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "500", marginBottom: "5px" }}>{title}</div>
        <div style={{ fontSize: "24px", fontWeight: "700", color: color || "var(--primary)" }}>{value}</div>
        {subtitle && <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>{subtitle}</div>}
      </div>
      <div style={{ padding: "12px", backgroundColor: color ? `${color}1A` : "rgba(26, 77, 46, 0.1)", borderRadius: "10px", color: color || "var(--primary)", fontSize: "20px" }}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}

function TreasurerNotification() {
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
        { id: 1, title: "Rent payment due", description: "Your rent payment for November 2025 is due on November 1st.", date: "2025-09-11", status: "unread" },
        { id: 2, title: "Pool temporary closure", description: "The swimming pool will be closed for maintenance from Oct 22–24.", date: "2025-09-15", status: "unread" },
        { id: 3, title: "Complaint update", description: "Your complaint about the leaking faucet has been updated.", date: "2025-09-26", status: "read" },
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
      role="treasurer"
      title="System Updates"
      userName="Aravinth"
      userInitials="AR"
      userRoleLabel="Chief Treasurer"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
        <div onClick={() => navigate("/treasurer/notifications/add?type=closure")} className="glass-card clickable" style={{ padding: "20px", backgroundColor: "white", textAlign: "center", cursor: "pointer" }}>
            <div style={{ color: "#e03131", fontSize: "20px", marginBottom: "10px" }}><i className="bi bi-x-circle"></i></div>
            <div style={{ fontWeight: "700", fontSize: "14px" }}>Facility Closure</div>
        </div>
        <div onClick={() => navigate("/treasurer/notifications/add?type=reminder")} className="glass-card clickable" style={{ padding: "20px", backgroundColor: "white", textAlign: "center", cursor: "pointer" }}>
            <div style={{ color: "#e67e22", fontSize: "20px", marginBottom: "10px" }}><i className="bi bi-currency-dollar"></i></div>
            <div style={{ fontWeight: "700", fontSize: "14px" }}>Rent Reminder</div>
        </div>
        <div onClick={() => navigate("/treasurer/notifications/add?type=maintenance")} className="glass-card clickable" style={{ padding: "20px", backgroundColor: "white", textAlign: "center", cursor: "pointer" }}>
            <div style={{ color: "#3498db", fontSize: "20px", marginBottom: "10px" }}><i className="bi bi-wrench"></i></div>
            <div style={{ fontWeight: "700", fontSize: "14px" }}>Maintenance</div>
        </div>
        <div onClick={() => navigate("/treasurer/notifications/add?type=general")} className="glass-card clickable" style={{ padding: "20px", backgroundColor: "white", textAlign: "center", cursor: "pointer" }}>
            <div style={{ color: "var(--primary)", fontSize: "20px", marginBottom: "10px" }}><i className="bi bi- megaphone"></i></div>
            <div style={{ fontWeight: "700", fontSize: "14px" }}>General Notice</div>
        </div>
      </div>

      <Card title="Recent Notifications" subtitle={`You have ${unreadCount} unread system alerts.`}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading records...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Title</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Description</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>{n.title}</td>
                    <td style={{ padding: "12px", fontSize: "14px", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.description}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{new Date(n.date).toLocaleDateString()}</td>
                    <td style={{ padding: "12px" }}>
                       <span style={{ 
                        padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                        backgroundColor: (n.status === 'unread' || n.status === 'new') ? "#fff5f5" : "#f0f0f0",
                        color: (n.status === 'unread' || n.status === 'new') ? "#e03131" : "#888",
                        textTransform: "uppercase"
                      }}>
                        {n.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                       <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          {(n.status === 'unread' || n.status === 'new') && (
                            <Button variant="secondary" onClick={() => handleMarkAsRead(n.id)} disabled={actionLoading}>
                              Mark Read
                            </Button>
                          )}
                          <button 
                            onClick={() => handleDelete(n.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#e03131" }}
                            title="Delete"
                            disabled={actionLoading}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
                {notifications.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No notifications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default TreasurerNotification;

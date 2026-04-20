import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getUserFromToken } from "../utils/auth";
import { getTenantProfile, updateProfile } from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [TenantInfo, setTenantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const data = getUserFromToken();
    setUser(data);
    setFormData({ username: data?.username || "", phone: data?.phone || "" });

    if (data?.role?.toLowerCase() === 'tenant') {
      getTenantProfile().then(res => {
        setTenantInfo({ ...res, fullName: res.full_name || res.name || res.fullName });
      }).catch(console.error).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setMessage({ text: "Phone number must be exactly 10 digits.", type: "error" });
      setSaving(false);
      return;
    }

    try {
      await updateProfile(formData);
      setMessage({ text: "Profile updated successfully! Some changes may require logging in again.", type: "success" });
      setEditing(false);
      // Refresh local user data if username changed
      const updatedUser = { ...user, username: formData.username };
      setUser(updatedUser);
    } catch (error) {
      setMessage({ text: error.message || "Failed to update profile", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const formatUsername = (name) => {
    if (!name) return "User";
    return name.split(/[._]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const displayDisplayName = (user?.role?.toLowerCase() === 'tenant' && TenantInfo?.fullName) ? TenantInfo.fullName : formatUsername(user?.username);
  const displayInitials = (user?.role?.toLowerCase() === 'tenant' && TenantInfo?.fullName) ?
    TenantInfo.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) :
    (user?.initials || (user?.username ? user.username.split(/[._\s]/).map(n => n[0]).join('').toUpperCase().substring(0, 2) : "U"));

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading profile...</div>;

  return (
    <DashboardLayout
      role={user?.role || "user"}
      title="Profile"
      userName={displayDisplayName}
      userInitials={displayInitials}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {message.text && (
          <div style={{
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
            backgroundColor: message.type === "success" ? "#dcfce7" : "#fee2e2",
            color: message.type === "success" ? "#166534" : "#991b1b",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`
          }}>
            {message.text}
          </div>
        )}

        <div className="glass-card" style={{ padding: "40px", backgroundColor: "white", marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "30px", marginBottom: "40px" }}>
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "var(--primary)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: "bold"
            }}>
              {displayInitials}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "28px", color: "var(--primary)" }}>{displayDisplayName}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "16px", textTransform: "capitalize" }}>{user?.role} Account</p>
            </div>
            {user?.role?.toLowerCase() === 'owner' && !editing && (
              <button
                onClick={() => setEditing(true)}
                style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "var(--primary)", color: "white", border: "none", fontWeight: "600", cursor: "pointer" }}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid #f0f0f0", paddingBottom: "10px" }}>
                <h3 style={{ fontSize: "18px", margin: 0 }}>Account Information</h3>
              </div>

              {editing ? (
                <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
                      pattern="[0-9]{10}"
                      maxLength="10"
                      minLength="10"
                      title="Phone number must be exactly 10 digits"
                      required
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button type="submit" disabled={saving} style={{ flex: 1, padding: "10px", borderRadius: "6px", backgroundColor: "var(--primary)", color: "white", border: "none", fontWeight: "600" }}>
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: "10px", borderRadius: "6px", backgroundColor: "#f3f4f6", border: "none", fontWeight: "600" }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {user?.role?.toLowerCase() !== 'tenant' && (
                    <InfoItem label="Full Name" value={formatUsername(user?.username)} />
                  )}
                  <InfoItem label="Username" value={user?.username} />
                  <InfoItem label="Account Role" value={user?.role} />
                  <InfoItem label="Status" value="Active" color="#1a4d2e" />
                </div>
              )}
            </div>

            {user?.role?.toLowerCase() === 'tenant' && TenantInfo && (
              <div>
                <h3 style={{ fontSize: "18px", marginBottom: "20px", borderBottom: "2px solid #f0f0f0", paddingBottom: "10px" }}>Tenant Details</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <InfoItem label="Full Name" value={TenantInfo.fullName} />
                  <InfoItem label="House" value={TenantInfo.houseAddress} />
                  <InfoItem label="Phone" value={TenantInfo.phone} />
                  <InfoItem label="Email" value={TenantInfo.email} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card" style={{ padding: "30px", backgroundColor: "#fff5f5", border: "1px solid #ffe3e3" }}>
          <h3 style={{ fontSize: "18px", color: "#e03131", marginBottom: "15px" }}>Security</h3>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
            To change your password or update sensitive account information, please contact the system administrator as per company security policy.
          </p>
          <button
            style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "white", color: "#e03131", border: "1px solid #e03131", fontWeight: "600", cursor: "default" }}
          >
            Password resets are managed by Admin
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoItem({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "2px" }}>{label}</div>
      <div style={{ fontSize: "16px", fontWeight: "600", color: color || "inherit" }}>{value || "Not set"}</div>
    </div>
  );
}

export default Profile;

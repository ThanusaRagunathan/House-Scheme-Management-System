const API_URL = import.meta.env.VITE_API_URL;

export const apiCall = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
};

export const login = (username, password) => {
  return apiCall("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

export const register = (data) => {
  return apiCall("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const forgotPassword = (phone) => {
  return apiCall("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
};

export const resetPassword = (phone, otp, newPassword) => {
  return apiCall("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ phone, otp, newPassword }),
  });
};


// House Services
export const getHouses = () => apiCall("/houses");
export const getHouse = (id) => apiCall(`/houses/${id}`);
export const createHouse = (data) => apiCall("/houses", { method: "POST", body: JSON.stringify(data) });
export const updateHouse = (id, data) => apiCall(`/houses/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteHouse = (id) => apiCall(`/houses/${id}`, { method: "DELETE" });

// Tenant Services
export const getTenants = () => apiCall("/tenants");
export const getTenantProfile = () => apiCall("/tenants/profile");
export const createTenant = (data) => apiCall("/tenants", { method: "POST", body: JSON.stringify(data) });
export const updateTenant = (id, data) => apiCall(`/tenants/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteTenant = (id) => apiCall(`/tenants/${id}`, { method: "DELETE" });

// Payment Services
export const getPayments = () => apiCall("/payments");
export const createPayment = (data) => apiCall("/payments", { method: "POST", body: JSON.stringify(data) });
export const updatePayment = (id, data) => apiCall(`/payments/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deletePayment = (id) => apiCall(`/payments/${id}`, { method: "DELETE" });

// Maintenance Services
export const getMaintenances = () => apiCall("/maintenance");
export const createMaintenance = (data) => apiCall("/maintenance", { method: "POST", body: JSON.stringify(data) });
export const updateMaintenance = (id, data) => apiCall(`/maintenance/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteMaintenance = (id) => apiCall(`/maintenance/${id}`, { method: "DELETE" });

// Complaint Services
export const getComplaints = () => apiCall("/complaints");
export const createComplaint = (data) => apiCall("/complaints", { method: "POST", body: JSON.stringify(data) });
export const updateComplaint = (id, data) => apiCall(`/complaints/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteComplaint = (id) => apiCall(`/complaints/${id}`, { method: "DELETE" });

// Document Services
export const getDocuments = () => apiCall("/documents");
export const createDocument = (data) => apiCall("/documents", { method: "POST", body: JSON.stringify(data) });
export const deleteDocument = (id) => apiCall(`/documents/${id}`, { method: "DELETE" });

// Notification Services
export const getNotifications = () => apiCall("/notifications");
export const createNotification = (data) => apiCall("/notifications", { method: "POST", body: JSON.stringify(data) });
export const updateNotification = (id, data) => apiCall(`/notifications/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteNotification = (id) => apiCall(`/notifications/${id}`, { method: "DELETE" });

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OwnerOverview from "./pages/Owner/OwnerOverview";
import OwnerHouses from "./pages/Owner/OwnerHouses";
import OwnerTenant from "./pages/Owner/OwnerTenant";
import OwnerPayment from "./pages/Owner/OwnerPayment";
import OwnerMaintenance from "./pages/Owner/OwnerMaintenance";
import OwnerComplaints from "./pages/Owner/OwnerComplaints";
import OwnerDocument from "./pages/Owner/OwnerDocument";
import OwnerNotification from "./pages/Owner/OwnerNotification";
import OwnerReport from "./pages/Owner/OwnerReport";
import OwnerAddTenant from "./pages/Owner/OwnerAddTenant";
import OwnerAddHouses from "./pages/Owner/OwnerAddHouses";
import OwnerCreateTask from "./pages/Owner/OwnerCreateTask";
import OwnerUploadDocument from "./pages/Owner/OwnerUploadDocument";
import OwnerHouseDetail from "./pages/Owner/OwnerHouseDetail";
import OwnerTenantDetail from "./pages/Owner/OwnerTenantDetail";
import OwnerComplaintDetail from "./pages/Owner/OwnerComplaintDetail";
import OwnerMaintenanceDetail from "./pages/Owner/OwnerMaintenanceDetail";
import OwnerEditHouse from "./pages/Owner/OwnerEditHouse";
import OwnerEditTenant from "./pages/Owner/OwnerEditTenant";
import OwnerEditMaintenance from "./pages/Owner/OwnerEditMaintenance";
import TenantOverview from "./pages/Tenant/TenantOverview";
import TenantPayment from "./pages/Tenant/TenantPayments";
import TenantMaintenance from "./pages/Tenant/TenantMaintenance";
import TenantComplaints from "./pages/Tenant/TenantComplaints";
import TenantDocument from "./pages/Tenant/TenantDocuments";
import TenantNotification from "./pages/Tenant/TenantNotification";
import TenantAddPayment from "./pages/Tenant/TenantAddPayment";
import TenantAddComplaints from "./pages/Tenant/TenantAddComplaints";
import TenantComplaintDetail from "./pages/Tenant/TenantComplaintDetail";
import TreasurerOverview from "./pages/Treasurer/TreasurerOverview";
import TreasurerPayment from "./pages/Treasurer/TreasurerPayments";
import TreasurerMaintenance from "./pages/Treasurer/TreasurerMaintenance";
import TreasurerComplaints from "./pages/Treasurer/TreasurerComplaints";
import TreasurerDocument from "./pages/Treasurer/TreasurerDocuments";
import TreasurerNotification from "./pages/Treasurer/TreasurerNotification";
import TreasurerAddPayment from "./pages/Treasurer/TreasurerAddPayment";
import TreasurerAddCost from "./pages/Treasurer/TreasurerAddCost";
import TreasurerAddNotification from "./pages/Treasurer/TreasurerAddNotification";
import TreasurerHouses from "./pages/Treasurer/TreasurerHouses";
import TreasurerReports from "./pages/Treasurer/TreasurerReport";
import TreasurerTenants from "./pages/Treasurer/TreasurerTenants";
import TreasurerUploadDocuments from "./pages/Treasurer/TreasurerUploadDocument";
import TreasurerHouseDetail from "./pages/Treasurer/TreasurerHouseDetail";
import TreasurerTenantDetail from "./pages/Treasurer/TreasurerTenantDetail";
import TreasurerComplaintDetail from "./pages/Treasurer/TreasurerComplaintDetail";
import TreasurerPaymentDetail from "./pages/Treasurer/TreasurerPaymentDetail";
import TreasurerMaintenanceDetail from "./pages/Treasurer/TreasurerMaintenanceDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/owner/overview" element={<OwnerOverview />} />
      <Route path="/owner/houses" element={<OwnerHouses />} />
      <Route path="/owner/tenants" element={<OwnerTenant />} />
      <Route path="/owner/payments" element={<OwnerPayment />} />
      <Route path="/owner/maintenance" element={<OwnerMaintenance />} />
      <Route path="/owner/complaints" element={<OwnerComplaints />} />
      <Route path="/owner/documents" element={<OwnerDocument />} />
      <Route path="/owner/notification" element={<OwnerNotification />} />
      <Route path="/owner/report" element={<OwnerReport />} />
      <Route path="/owner/addtenant" element={<OwnerAddTenant />} />
      <Route path="/owner/addhouse" element={<OwnerAddHouses />} />
      <Route path="/owner/createtask" element={<OwnerCreateTask />} />
      <Route path="/owner/uploaddocument" element={<OwnerUploadDocument />} />
      <Route path="/owner/houses/:id" element={<OwnerHouseDetail />} />
      <Route path="/owner/tenants/:id" element={<OwnerTenantDetail />} />
      <Route path="/owner/complaints/:id" element={<OwnerComplaintDetail />} />
      <Route path="/owner/maintenance/:id" element={<OwnerMaintenanceDetail />} />
      <Route path="/owner/houses/edit/:id" element={<OwnerEditHouse />} />
      <Route path="/owner/tenants/edit/:id" element={<OwnerEditTenant />} />
      <Route path="/owner/maintenance/edit/:id" element={<OwnerEditMaintenance />} />
      <Route path="/tenant/overview" element={<TenantOverview />} />
      <Route path="/tenant/payments" element={<TenantPayment />} />
      <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
      <Route path="/tenant/complaints" element={<TenantComplaints />} />
      <Route path="/tenant/documents" element={<TenantDocument />} />
      <Route path="/tenant/notification" element={<TenantNotification />} />
      <Route path="/tenant/addpayment" element={<TenantAddPayment />} />
      <Route path="/tenant/addcomplaint" element={<TenantAddComplaints />} />
      <Route path="/tenant/complaints/:id" element={<TenantComplaintDetail />} />
      <Route path="/treasurer/overview" element={<TreasurerOverview />} />
      <Route path="/treasurer/payments" element={<TreasurerPayment />} />
      <Route path="/treasurer/maintenance" element={<TreasurerMaintenance />} />
      <Route path="/treasurer/complaints" element={<TreasurerComplaints />} />
      <Route path="/treasurer/documents" element={<TreasurerDocument />} />
      <Route path="/treasurer/notifications" element={<TreasurerNotification />} />
      <Route path="/treasurer/addpayment" element={<TreasurerAddPayment />} />
      <Route path="/treasurer/addcost" element={<TreasurerAddCost />} />
      <Route path="/treasurer/addnotification" element={<TreasurerAddNotification />} />
      <Route path="/treasurer/houses" element={<TreasurerHouses />} />
      <Route path="/treasurer/reports" element={<TreasurerReports />} />
      <Route path="/treasurer/tenants" element={<TreasurerTenants />} />
      <Route path="/treasurer/uploaddocument" element={<TreasurerUploadDocuments />} />
      <Route path="/treasurer/houses/:id" element={<TreasurerHouseDetail />} />
      <Route path="/treasurer/tenants/:id" element={<TreasurerTenantDetail />} />
      <Route path="/treasurer/complaints/:id" element={<TreasurerComplaintDetail />} />
      <Route path="/treasurer/payments/:id" element={<TreasurerPaymentDetail />} />
      <Route path="/treasurer/maintenance/:id" element={<TreasurerMaintenanceDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

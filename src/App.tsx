import { Toaster } from "./components/ui/sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MarketingLayout from "./layouts/marketing-layout";
import ScrollToTop from "./components/shared/scroll-to-top";
import "./styles/chart-fix.css";
import { Suspense, lazy } from "react";

// Marketing Pages
const ContactPage = lazy(() => import("./pages/marketing/contact"));
const FeaturesPage = lazy(() => import("./pages/marketing/features"));
const HomePage = lazy(() => import("./pages/marketing/home"));
const PricingPage = lazy(() => import("./pages/marketing/pricing"));
const ServicesPage = lazy(() => import("./pages/marketing/services"));
const SupportPage = lazy(() => import("./pages/marketing/support"));
const TrackPage = lazy(() => import("./pages/marketing/track"));
const FaqsPage = lazy(() => import("./pages/marketing/faqs"));
const PrivacyPage = lazy(() => import("./pages/marketing/privacy"));
const TermsPage = lazy(() => import("./pages/marketing/terms"));

// Customer Pages
const CustomerLoginPage = lazy(() => import("./pages/customer/auth/login"));
const CustomerRegisterPage = lazy(() => import("./pages/customer/auth/register"));
const CustomerHomePage = lazy(() => import("./pages/customer/home"));
const CustomerProfile = lazy(() => import("./pages/customer/profile"));
const CustomerOrdersPage = lazy(() => import("./pages/customer/orders"));
const CustomerCreateOrderPage = lazy(() => import("./pages/customer/create-order"));
const CustomerPaymentPage = lazy(() => import("./pages/customer/payment"));
const CustomerLayout = lazy(() => import("./layouts/customer-layout"));
const OrderDetailsPage = lazy(() => import("./pages/customer/orders/[id]"));

// Seller Pages
const SellerLayout = lazy(() => import("./layouts/seller-layout"));
const SellerLoginPage = lazy(() => import("./pages/seller/auth/login"));
const SellerRegisterPage = lazy(() => import("./pages/seller/auth/register"));
const SellerOTPPage = lazy(() => import("./pages/seller/auth/otp"));
const SellerCompanyDetailsPage = lazy(() => import("./pages/seller/onboarding/company-details"));
const SellerBankDetailsPage = lazy(() => import("./pages/seller/onboarding/bank-details"));
const SellerDashboardPage = lazy(() => import("./pages/seller/dashboard/home"));
const SellerDashboardLayout = lazy(() => import("./layouts/seller-dashboard-layout"));
const SellerOrdersPage = lazy(() => import("./pages/seller/dashboard/orders"));
const SellerNDRPage = lazy(() => import("./pages/seller/dashboard/ndr"));
const SellerWeightDisputePage = lazy(() => import("./pages/seller/dashboard/disputes"));
const SellerBillingPage = lazy(() => import("./pages/seller/dashboard/billing"));
const SellerToolsPage = lazy(() => import("./pages/seller/dashboard/tools"));
const SellerWarehousePage = lazy(() => import("./pages/seller/dashboard/warehouse"));
const SellerServiceCheckPage = lazy(() => import("./pages/seller/dashboard/service-check"));
const SellerProductsPage = lazy(() => import("./pages/seller/dashboard/products"));
const SellerRateCalculatorPage = lazy(() => import("./pages/seller/dashboard/rate-calculator"));
const SellerCODPage = lazy(() => import("./pages/seller/dashboard/cod"));
const SellerProfilePage = lazy(() => import("./pages/seller/dashboard/profile"));
const SellerSettingsPage = lazy(() => import("./pages/seller/dashboard/settings"));
const SellerDisputePage = lazy(() => import("./pages/seller/dashboard/disputes"));
const SellerNewOrderPage = lazy(() => import("./pages/seller/dashboard/new-order"));

// Admin Pages
import AdminPartnersPage from "./pages/admin/dashboard/partners";
import AdminDashboardLayout from "./layouts/admin-dashboard-layout";
import AdminDashboardPage from "./pages/admin/dashboard";
import AdminLoginPage from "./pages/admin/auth/login";
import AdminRegisterPage from "./pages/admin/auth/register";
import AdminReportsPage from "./pages/admin/dashboard/reports";
import AdminUsersPage from "./pages/admin/dashboard/users";
import AdminOrdersPage from "./pages/admin/dashboard/orders";
import AdminShipmentsPage from "./pages/admin/dashboard/shipments";
import AdminTicketsPage from "./pages/admin/dashboard/tickets";
import AdminNDRPage from "./pages/admin/dashboard/ndr";
import AdminBillingPage from "./pages/admin/dashboard/billing";
import AdminTeamsPage from "./pages/admin/dashboard/teams";
import AdminEscalationLayout from "./layouts/admin-escalation-layout";
import AdminEscalationSearchPage from "./pages/admin/dashboard/escalation/search";
import AdminEscalationStatisticsPage from "./pages/admin/dashboard/escalation/statistics";
import AdminEscalationPickupsPage from "./pages/admin/dashboard/escalation/pickups";
import AdminEscalationShipmentsPage from "./pages/admin/dashboard/escalation/shipments";
import AdminEscalationBillingPage from "./pages/admin/dashboard/escalation/billing";
import AdminEscalationWeightIssuesPage from "./pages/admin/dashboard/escalation/weight-issues";
import AdminEscalationTechIssuesPage from "./pages/admin/dashboard/escalation/tech-issues";
import AdminSettingsLayout from "./layouts/admin-settings-layout";
import AdminLayout from "./layouts/admin-layout";
import AdminCustomerDashboardPage from "./pages/admin/dashboard/customer";
import AdminSettingsPage from "./pages/admin/dashboard/settings";
import NotificationSettings from "./pages/admin/dashboard/settings/notification";
import PolicySettings from "./pages/admin/dashboard/settings/policy";
import MaintenanceSettings from "./pages/admin/dashboard/settings/maintenance";
import SystemSettings from "./pages/admin/dashboard/settings/system";
import PolicyEditPage from "./pages/admin/dashboard/settings/policy/[slug]/edit";
import AdminOrderDetailsPage from "./pages/admin/dashboard/orders/[id]";
import AdminShipmentDetailsPage from "./pages/admin/dashboard/shipments/[id]";
import AdminNDRDetailsPage from "./pages/admin/dashboard/ndr/[id]";
import SellerDisputeDetailsPage from "./pages/seller/dashboard/disputes/[id]";
import AdminUserProfilePage from "./pages/admin/dashboard/users/[id]";
import AdminTeamProfilePage from "./pages/admin/dashboard/teams/[id]";
import SellerShipmentDetailsPage from "./pages/seller/dashboard/shipments/[id]";
import MyProfilePage from "./pages/admin/profile";
import ManageStorePage from "./pages/seller/dashboard/settings/manage-store";
import CouriersSettingsPage from "./pages/seller/dashboard/settings/couriers";
import LabelSettingsPage from "./pages/seller/dashboard/settings/labels";
import ManageUsersPage from "./pages/seller/dashboard/settings/users";
import WhatsAppSettingsPage from "./pages/seller/dashboard/settings/whatsapp";
import ApiSettingsPage from "./pages/seller/dashboard/settings/api";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Marketing Routes */}
          <Route element={<MarketingLayout />}>
            <Route index element={<HomePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="features" element={<FeaturesPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="track" element={<TrackPage />} />
            <Route path="faqs" element={<FaqsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
          </Route>

          {/* Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="customer/login" element={<CustomerLoginPage />} />
            <Route path="customer/register" element={<CustomerRegisterPage />} />
            <Route path="customer/home" element={<CustomerHomePage />} />
            <Route path="customer/profile" element={<CustomerProfile />} />
            <Route path="customer/orders" element={<CustomerOrdersPage />} />
            <Route path="customer/orders/:id" element={<OrderDetailsPage />} />
            <Route path="customer/create-order" element={<CustomerCreateOrderPage />} />
            <Route path="customer/payment" element={<CustomerPaymentPage />} />
          </Route>

          {/* Seller Routes */}
          <Route element={<SellerLayout />}>
            <Route path="seller/login" element={<SellerLoginPage />} />
            <Route path="seller/register" element={<SellerRegisterPage />} />
            <Route path="seller/otp" element={<SellerOTPPage />} />
            <Route path="seller/company-details" element={<SellerCompanyDetailsPage />} />
            <Route path="seller/bank-details" element={<SellerBankDetailsPage />} />
          </Route>

          {/* Seller Dashboard Routes */}
          <Route element={<SellerDashboardLayout />}>
            <Route path="seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="seller/dashboard/orders" element={<SellerOrdersPage />} />
            <Route path="seller/dashboard/ndr" element={<SellerNDRPage />} />
            <Route path="seller/dashboard/disputes" element={<SellerWeightDisputePage />} />
            <Route path="seller/dashboard/billing" element={<SellerBillingPage />} />
            <Route path="seller/dashboard/tools" element={<SellerToolsPage />} />
            <Route path="seller/dashboard/warehouse" element={<SellerWarehousePage />} />
            <Route path="seller/dashboard/service-check" element={<SellerServiceCheckPage />} />
            <Route path="seller/dashboard/products" element={<SellerProductsPage />} />
            <Route path="seller/dashboard/rate-calculator" element={<SellerRateCalculatorPage />} />
            <Route path="seller/dashboard/cod" element={<SellerCODPage />} />
            <Route path="seller/dashboard/profile" element={<SellerProfilePage />} />
            <Route path="seller/dashboard/settings" element={<SellerSettingsPage />} />
            <Route path="seller/dashboard/disputes" element={<SellerDisputePage />} />
            <Route path="seller/dashboard/new-order" element={<SellerNewOrderPage />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;

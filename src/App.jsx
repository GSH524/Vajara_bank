import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdProvider } from "./context/AdContext";

/* LOADERS & LAYOUTS */
// Keep Layouts eager-loaded for better UX (optional, can also be lazy)
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import PartnerLayout from "./layouts/PartnerLayout";
import UserLayout from "./layouts/UserLayout";
import SecureLoader from "./pages/SecureLoader"; // Ensure this path matches where you saved the component

/* PROTECTED ROUTES WRAPPERS */
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedPartnerRoute from "./components/ProtectedPartnerRoute";
import TransferMoney from "./pages/user/TransferMoney";
import ProtectedUserRoute from "./pages/user/ProtectedRoute";

/* --- LAZY LOADED PAGES --- */

/* PUBLIC PAGES */
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PartnerPlans = lazy(() => import("./pages/PartnerPlans"));
const PublicCards = lazy(() => import("./components/Cards"));
const Investments = lazy(() => import("./components/Investments"));
const PublicLoans = lazy(() => import("./components/LoanRules"));
const Savings = lazy(() => import("./components/Savings"));

/* ADMIN PAGES */
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Accounts = lazy(() => import("./pages/admin/Accounts"));
const AdminCards = lazy(() => import("./pages/admin/Cards"));
const AdminLoans = lazy(() => import("./pages/admin/Loans"));
const KYC = lazy(() => import("./pages/admin/KYC"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const AdminAds = lazy(() => import("./pages/admin/AdminAds"));

/* PARTNER PAGES */
const PartnerLogin = lazy(() => import("./pages/partner/PartnerLogin"));
const PartnerRegister = lazy(() => import("./pages/partner/PartnerRegister"));
const PartnerPayment = lazy(() => import("./pages/partner/PartnerPayment"));
const PartnerDashboard = lazy(() => import("./pages/partner/PartnerDashboard"));
const CreateAd = lazy(() => import("./pages/partner/CreateAd"));

/* USER PAGES */
const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Transactions = lazy(() => import("./pages/user/Transactions"));
const Loans = lazy(() => import("./pages/user/Loans"));
const Cards = lazy(() => import("./pages/user/Cards"));
const Feedback = lazy(() => import("./pages/user/Feedback"));
const Payments = lazy(() => import("./pages/user/Payments"));
const Rewards = lazy(() => import("./pages/user/Rewards"));
const InternationalTransfer = lazy(() => import("./pages/user/InternationalTransfer"));
const Notifications = lazy(() => import("./pages/user/Notifications"));

/* TOOLS */
const LoanCalculatorPage = lazy(() => import("./pages/LoanCalculatorPage"));
const ROI = lazy(() => import("./pages/tools/ROI"));
const CardsTool = lazy(() => import("./pages/tools/CardsTool"));
const Transfers = lazy(() => import("./pages/tools/Transfers"));
const Business = lazy(() => import("./pages/tools/Business"));
const Global = lazy(() => import("./pages/tools/Global"));


export default function App() {
  return (
    <AuthProvider>
      <AdProvider>
        <BrowserRouter>
          {/* Suspense handles the loading state while lazy components are fetched */}
          <Suspense fallback={<SecureLoader message="Loading Secure Module..." />}>
            <Routes>

              {/* 🌍 PUBLIC ROUTES */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/partner-plans" element={<PartnerPlans />} />
                <Route path="/invest" element={<Investments />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/loans" element={<PublicLoans />} />
                <Route path="/cards" element={<PublicCards />} />

                {/* 🛠️ TOOLS & CALCULATORS */}
                <Route path="/tools">
                  <Route path="loan-calculator" element={<LoanCalculatorPage />} />
                  <Route path="roi" element={<ROI />} />
                  <Route path="cards" element={<CardsTool />} />
                  <Route path="transfers" element={<Transfers />} />
                  <Route path="business" element={<Business />} />
                  <Route path="global" element={<Global />} />
                </Route>
              </Route>

              {/* 🔐 ADMIN LOGIN (No Layout) */}
              <Route path="/admin" element={<AdminLogin />} />

              {/* 🔐 ADMIN ROUTES (PROTECTED) */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="customers" element={<Customers />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="cards" element={<AdminCards />} />
                <Route path="loans" element={<AdminLoans />} />
                <Route path="kyc" element={<KYC />} />
                <Route path="reports" element={<Reports />} />
                <Route path="ads" element={<AdminAds />} />
              </Route>

              {/* 🤝 PARTNER ROUTES */}
              {/* Partner Login (Public - No Layout) */}
              <Route path="/partner/login" element={<PartnerLogin />} />

              {/* Partner Protected Routes */}
              <Route path="/partner" element={<PartnerLayout />}>
                <Route path="register" element={<PartnerRegister />} />
                <Route element={<ProtectedPartnerRoute requirePayment={false} />}>
                  <Route path="payment" element={<PartnerPayment />} />
                </Route>
                <Route element={<ProtectedPartnerRoute requirePayment={true} />}>
                  <Route path="dashboard" element={<PartnerDashboard />} />
                  <Route path="create-ad" element={<CreateAd />} />
                </Route>
              </Route>



              <Route path="/user" element={<UserLayout />}>
                 
                  <Route index element={<UserDashboard />} />
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="loans" element={<Loans />} />
                  <Route path="transfer" element={<TransferMoney />} />
                  <Route path="cards" element={<Cards />} />
                  <Route path="feedback" element={<Feedback />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="rewards" element={<Rewards />} />
                  <Route path="international" element={<InternationalTransfer />} />
                  <Route path="notifications" element={<Notifications />} />
                </Route>
              


              {/* ❌ FALLBACK */}
              <Route
                path="*"
                element={
                  <div className="flex h-screen items-center justify-center bg-[#020617] text-white">
                    <h2 className="text-2xl font-bold">404 | Page Not Found</h2>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AdProvider>
    </AuthProvider>
  );
}
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import PersonalBanking from "./pages/PersonalBanking";
import Loans from "./pages/Loans";
import Cards from "./pages/Cards";
import FixedDeposits from "./pages/FixedDeposits";
import Investments from "./pages/Investments";
import LocateUs from "./pages/LocateUs";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import DashboardLayout from "./pages/DashboardLayout";
import Overview from "./pages/Overview";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import Passbook from "./pages/Passbook";
import Settings from "./pages/Settings";

import AdminDashboard from "./pages/AdminDashboard";

import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public marketing pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/personal-banking" element={<PersonalBanking />} />
      <Route path="/loans" element={<Loans />} />
      <Route path="/cards" element={<Cards />} />
      <Route path="/fixed-deposits" element={<FixedDeposits />} />
      <Route path="/investments" element={<Investments />} />
      <Route path="/locate-us" element={<LocateUs />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Customer dashboard (protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="deposit" element={<Deposit />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="passbook" element={<Passbook />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Admin (protected, admin-only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

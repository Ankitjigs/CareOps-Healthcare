import { Routes, Route, Navigate } from "react-router-dom";
import { AnalyticsPage } from "../features/analytics/pages/AnalyticsPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { PatientsPage } from "../features/patients/pages/PatientsPage";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export const DashboardLayout = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[272px_minmax(0,1fr)] bg-[radial-gradient(circle_at_84%_4%,rgba(34,211,238,0.16),transparent_30%),linear-gradient(180deg,#f8feff_0%,var(--color-bg)_100%)]">
      <Sidebar />

      <div className="min-w-0 pb-20 lg:pb-7">
        <Navbar />

        <main className="p-4 lg:p-[28px_32px] max-w-350">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

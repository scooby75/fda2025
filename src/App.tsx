
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";

// Lazy load pages
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Backtesting = lazy(() => import("@/pages/Backtesting"));
const BankrollManagement = lazy(() => import("@/pages/BankrollManagement"));
const DailyGames = lazy(() => import("@/pages/dailygames"));
const Admin = lazy(() => import("@/pages/admin"));
const H2H = lazy(() => import("@/pages/h2h"));
const UploadData = lazy(() => import("@/pages/uploaddata"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/backtesting" element={<Backtesting />} />
              <Route path="/bankroll-management" element={<BankrollManagement />} />
              <Route path="/daily-games" element={<DailyGames />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/h2h" element={<H2H />} />
              <Route path="/upload-data" element={<UploadData />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

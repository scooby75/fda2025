
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import BacktestingPage from "@/components/BacktestingPage";
import BankrollPage from "@/components/BankrollPage";
import UploadData from "@/components/UploadData";
import UserManagement from "@/components/UserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/backtesting" element={<BacktestingPage />} />
            <Route path="/bankroll" element={<BankrollPage />} />
            <Route path="/upload" element={<UploadData />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

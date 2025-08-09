
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import BacktestingPage from "./components/BacktestingPage";
import BankrollPage from "./components/BankrollPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/backtesting" element={<BacktestingPage />} />
            <Route path="/bankroll" element={<BankrollPage />} />
            <Route path="/daily-games" element={<div className="p-8"><h1 className="text-2xl font-bold">Jogos do Dia</h1><p className="text-muted-foreground">Em desenvolvimento</p></div>} />
            <Route path="/h2h" element={<div className="p-8"><h1 className="text-2xl font-bold">H2H Analysis</h1><p className="text-muted-foreground">Em desenvolvimento</p></div>} />
            <Route path="/upload" element={<div className="p-8"><h1 className="text-2xl font-bold">Upload de Dados</h1><p className="text-muted-foreground">Em desenvolvimento</p></div>} />
            <Route path="/admin" element={<div className="p-8"><h1 className="text-2xl font-bold">Admin Panel</h1><p className="text-muted-foreground">Em desenvolvimento</p></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

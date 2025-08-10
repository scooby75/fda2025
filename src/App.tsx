
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Backtesting from './pages/Backtesting';
import BankrollManagement from './pages/BankrollManagement';
import DailyGames from './pages/DailyGames';
import UploadData from './pages/UploadData';
import Admin from './pages/Admin';
import H2H from './pages/H2H';
import Landing from './pages/Landing';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="backtesting" element={<Backtesting />} />
            <Route path="bankroll-management" element={<BankrollManagement />} />
            <Route path="daily-games" element={<DailyGames />} />
            <Route path="upload-data" element={<UploadData />} />
            <Route path="admin" element={<Admin />} />
            <Route path="h2h" element={<H2H />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

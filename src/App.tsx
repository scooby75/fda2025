
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from '../pages/dashboard';
import Backtesting from '../pages/backtesting';
import BankrollManagement from '../pages/Bankrollmanagement';
import DailyGames from '../pages/dailygames';
import UploadData from '../pages/uploaddata';
import Admin from '../pages/admin';
import H2H from '../pages/h2h';
import Landing from '../pages/landing';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;

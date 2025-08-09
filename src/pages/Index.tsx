
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { DashboardStats } from "@/components/DashboardStats";
import TodaysGames from "@/components/TodaysGames";
import RecentBets from "@/components/RecentBets";
import BankrollManager from "@/components/BankrollManager";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Visão geral das suas apostas e performance</p>
            </div>
            
            <DashboardStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TodaysGames />
              <RecentBets />
            </div>
          </div>
        );
      
      case "bankroll":
        return <BankrollManager />;
      
      case "games":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Jogos</h2>
              <p className="text-muted-foreground">Explore jogos e oportunidades de apostas</p>
            </div>
            <TodaysGames />
          </div>
        );
      
      case "bets":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Histórico de Apostas</h2>
              <p className="text-muted-foreground">Acompanhe todas as suas apostas</p>
            </div>
            <RecentBets />
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Em construção</h3>
              <p className="text-muted-foreground">Esta seção está sendo desenvolvida</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Navigation 
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

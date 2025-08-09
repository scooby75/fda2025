
import { useState } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import TodaysGames from "@/components/TodaysGames";
import RecentBets from "@/components/RecentBets";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
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
      </div>
    </div>
  );
};

export default Index;

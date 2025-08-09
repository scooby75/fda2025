
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  bgColor: string;
  trend?: string;
}

export default function StatsCard({ title, value, icon: Icon, bgColor, trend }: StatsCardProps) {
  return (
    <Card className="bg-card border-border backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
      <div className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${bgColor} rounded-full opacity-10`} />
        <CardHeader className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
              <CardTitle className="text-2xl lg:text-3xl font-bold text-foreground">
                {value}
              </CardTitle>
            </div>
            <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20`}>
              <Icon className={`w-6 h-6 ${bgColor.replace('bg-', 'text-')}`} />
            </div>
          </div>
          {trend && (
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
              <span className="text-emerald-500 font-medium">{trend}</span>
            </div>
          )}
        </CardHeader>
      </div>
    </Card>
  );
}

import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, bgColor, trend }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
      <div className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${bgColor} rounded-full opacity-10`} />
        <CardHeader className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
              <CardTitle className="text-2xl lg:text-3xl font-bold text-white">
                {value}
              </CardTitle>
            </div>
            <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20`}>
              <Icon className={`w-6 h-6 ${bgColor.replace('bg-', 'text-')}`} />
            </div>
          </div>
          {trend && (
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-400" />
              <span className="text-emerald-400 font-medium">{trend}</span>
            </div>
          )}
        </CardHeader>
      </div>
    </Card>
  );
}
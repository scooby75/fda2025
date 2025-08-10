
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  description: string;
}

export default function StatsCard({ title, value, change, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="bg-card border-border backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            {change && (
              <div className={`flex items-center mt-1 text-xs ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <span>{change.isPositive ? '+' : ''}{change.value.toFixed(1)}</span>
              </div>
            )}
          </div>
          <Icon className="w-8 h-8 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

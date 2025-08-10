import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Calendar, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalGames: number;
  totalStrategies: number;
  totalBankrolls: number;
  totalTransactions: number;
}

interface DataSummaryProps {
  stats: Stats;
  totalRecords: number;
  isLoading: boolean;
}

export default function DataSummary({ stats, totalRecords, isLoading }: DataSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Jogos
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-4 w-[100px]" />
          ) : (
            <div className="text-2xl font-bold text-card-foreground">{stats.totalGames}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {isLoading ? <Skeleton className="h-3 w-[80px]" /> : `de ${totalRecords} registros`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Estratégias
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-4 w-[100px]" />
          ) : (
            <div className="text-2xl font-bold text-card-foreground">{stats.totalStrategies}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {isLoading ? <Skeleton className="h-3 w-[80px]" /> : `de ${totalRecords} registros`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Bancas
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-4 w-[100px]" />
          ) : (
            <div className="text-2xl font-bold text-card-foreground">{stats.totalBankrolls}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {isLoading ? <Skeleton className="h-3 w-[80px]" /> : `de ${totalRecords} registros`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Transações
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-4 w-[100px]" />
          ) : (
            <div className="text-2xl font-bold text-card-foreground">{stats.totalTransactions}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {isLoading ? <Skeleton className="h-3 w-[80px]" /> : `de ${totalRecords} registros`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

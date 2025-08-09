
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Plus,
  Activity,
  Target,
  BarChart
} from "lucide-react";

export default function BankrollPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-semibold mb-1">
            Gestão de Banca
          </h1>
          <p className="text-muted-foreground text-lg">
            Gerencie suas bancas e acompanhe suas apostas
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full max-w-lg grid-cols-4 bg-card border">
              <TabsTrigger value="dashboard">
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="bankrolls">
                <Wallet className="w-4 h-4 mr-2" />
                Bancas
              </TabsTrigger>
              <TabsTrigger value="bets">
                <Target className="w-4 h-4 mr-2" />
                Apostas
              </TabsTrigger>
              <TabsTrigger value="reports">
                <BarChart className="w-4 h-4 mr-2" />
                Relatórios
              </TabsTrigger>
            </TabsList>
            
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Banca
            </Button>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wallet className="h-5 w-5" />
                    Banca Principal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Saldo Atual</span>
                      <span className="font-bold text-lg">R$ 5.000,00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lucro/Prejuízo</span>
                      <span className="text-green-600">+R$ 500,00 (10%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bankrolls" className="space-y-6">
            <Card className="bg-card border shadow-lg">
              <CardHeader>
                <CardTitle>Suas Bancas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Configure suas primeiras bancas
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bets" className="space-y-6">
            <Card className="bg-card border shadow-lg">
              <CardHeader>
                <CardTitle>Histórico de Apostas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma aposta registrada
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-card border shadow-lg">
              <CardHeader>
                <CardTitle>Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Relatórios em desenvolvimento
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

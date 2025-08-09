
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Target,
  TrendingUp,
  Save,
  Play,
  Settings,
  MessageCircle
} from "lucide-react";

export default function BacktestingPage() {
  const [activeTab, setActiveTab] = useState("form");

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-semibold mb-1">
            Sistema de Backtesting
          </h1>
          <p className="text-muted-foreground text-lg">
            Teste e analise suas estratégias de apostas esportivas
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4 bg-card border">
            <TabsTrigger value="form">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </TabsTrigger>
            <TabsTrigger value="results">
              <TrendingUp className="w-4 h-4 mr-2" />
              Resultados
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Save className="w-4 h-4 mr-2" />
              Salvos
            </TabsTrigger>
            <TabsTrigger value="telegram">
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <Card className="bg-card border shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Configurar Estratégia de Backtesting
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Interface de configuração de estratégia em desenvolvimento
                  </p>
                  <Button className="mt-4">
                    <Play className="w-4 h-4 mr-2" />
                    Executar Backtesting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="bg-card border shadow-lg">
              <CardContent className="p-12 text-center">
                <Play className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Nenhum resultado disponível
                </h3>
                <p className="text-muted-foreground mb-6">
                  Configure e execute uma estratégia para ver os resultados
                </p>
                <Button onClick={() => setActiveTab("form")}>
                  Configurar Estratégia
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card className="bg-card border shadow-lg">
              <CardHeader>
                <CardTitle>Estratégias Salvas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Save className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma estratégia salva encontrada
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="telegram" className="space-y-6">
            <Card className="bg-card border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Integração com Telegram
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Configure notificações do Telegram
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

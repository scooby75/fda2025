
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Wallet } from "lucide-react";
import { Bankroll } from "@/entities/Bankroll";

interface CreateBankrollProps {
  onBankrollCreated: () => void;
  onCancel: () => void;
}

export default function CreateBankroll({ onBankrollCreated, onCancel }: CreateBankrollProps) {
  const [formData, setFormData] = useState({
    name: "",
    currency: "BRL",
    initial_balance: "",
    start_date: new Date().toISOString().split('T')[0],
    commission_percentage: "0"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bankrollData = {
        ...formData,
        initial_balance: parseFloat(formData.initial_balance),
        current_balance: parseFloat(formData.initial_balance),
        commission_percentage: parseFloat(formData.commission_percentage),
        is_active: true
      };

      await Bankroll.create(bankrollData);
      onBankrollCreated();
    } catch (error) {
      console.error("Erro ao criar banca:", error);
    }

    setIsLoading(false);
  };

  return (
    <Card className="bg-card border-border max-w-2xl mx-auto">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Wallet className="w-6 h-6 text-primary" />
          Criar Nova Banca
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-muted-foreground">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Digite o nome da banca"
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency" className="text-muted-foreground">Moeda</Label>
              <Select value={formData.currency} onValueChange={(value: string) => handleInputChange('currency', value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                  <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="initial_balance" className="text-muted-foreground">Saldo Inicial</Label>
              <Input
                id="initial_balance"
                type="number"
                step="0.01"
                min="0"
                value={formData.initial_balance}
                onChange={(e) => handleInputChange('initial_balance', e.target.value)}
                placeholder="0.00"
                className="bg-input border-border text-foreground"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-muted-foreground">Data Inicial</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="commission_percentage" className="text-muted-foreground">Comissão (%)</Label>
              <Input
                id="commission_percentage"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.commission_percentage}
                onChange={(e) => handleInputChange('commission_percentage', e.target.value)}
                placeholder="0"
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-border text-muted-foreground hover:bg-muted/20"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.initial_balance}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Criando...
                </>
              ) : (
                "Criar Nova Banca"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

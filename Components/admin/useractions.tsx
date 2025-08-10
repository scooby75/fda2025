
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Shield, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  full_name: string;
  status: 'pending' | 'approved' | 'denied';
}

interface UserActionsProps {
  user: User;
  onApprove: (userId: string, plan: string) => void;
  onDeny: (userId: string) => void;
  onBlock: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export default function UserActions({ user, onApprove, onDeny, onBlock, onDelete }: UserActionsProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('90_days');

  const handleApproveClick = () => {
    setShowApprovalDialog(true);
  };

  const handleConfirmApproval = () => {
    onApprove(user.id, selectedPlan);
    setShowApprovalDialog(false);
  };

  if (user.status === "pending") {
    return (
      <>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            onClick={handleApproveClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Aprovar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDeny(user.id)}
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white w-full"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Negar
          </Button>
        </div>

        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Aprovar Usuário</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Selecione o tipo de plano para o usuário {user.full_name}:
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  <SelectItem value="1_day">1 Dia</SelectItem>
                  <SelectItem value="90_days">90 Dias</SelectItem>
                  <SelectItem value="180_days">180 Dias</SelectItem>
                  <SelectItem value="360_days">360 Dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmApproval} className="bg-emerald-600 hover:bg-emerald-700">
                Aprovar com Plano
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (user.status === "approved") {
    return (
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBlock(user.id)}
          className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white w-full"
        >
          <Shield className="w-4 h-4 mr-1" />
          Bloquear
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(user.id)}
          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white w-full"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Excluir
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="sm"
        onClick={handleApproveClick}
        className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
      >
        <CheckCircle className="w-4 h-4 mr-1" />
        Reativar
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onDelete(user.id)}
        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white w-full"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Excluir
      </Button>
    </div>
  );
}

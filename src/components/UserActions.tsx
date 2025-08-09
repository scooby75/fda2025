
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, X, Shield, Trash } from "lucide-react";

interface UserActionsProps {
  user: any;
  onApprove: (userId: string, plan: string) => void;
  onDeny: (userId: string) => void;
  onBlock: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export default function UserActions({ user, onApprove, onDeny, onBlock, onDelete }: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.status === 'pending' && (
          <>
            <DropdownMenuItem onClick={() => onApprove(user.id, 'basic')}>
              <Check className="mr-2 h-4 w-4" />
              Aprovar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeny(user.id)}>
              <X className="mr-2 h-4 w-4" />
              Negar
            </DropdownMenuItem>
          </>
        )}
        {user.status === 'approved' && (
          <DropdownMenuItem onClick={() => onBlock(user.id)}>
            <Shield className="mr-2 h-4 w-4" />
            Bloquear
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => onDelete(user.id)}
          className="text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield,
  UserCheck,
  Activity,
  Trash2,
  ShieldOff,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

import UserStats from "../Components/admin/UserStats";
import UserActions from "../Components/admin/useractions";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: 'pending' | 'approved' | 'denied' | 'blocked';
  plan_type?: string;
  plan_expires_at?: string;
  approved_by?: string;
  approved_at?: string;
  last_login?: string;
  created_date: string;
}

interface ActionToConfirm {
  action: string | null;
  userId: string | null;
  userName: string | null;
}

export default function Admin() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<ActionToConfirm>({ action: null, userId: null, userName: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allUsers, me] = await Promise.all([
        User.list("-created_date"),
        User.me()
      ]);
      
      const now = new Date();
      const usersToUpdate = allUsers.filter((u: UserData) => {
        if (u.status === 'approved' && u.plan_expires_at) {
          const expirationDate = new Date(u.plan_expires_at);
          return now > expirationDate;
        }
        return false;
      });

      for (const user of usersToUpdate) {
        await User.update(user.id, {
          status: 'blocked',
          approved_by: 'Sistema Automático',
          approved_at: now.toISOString()
        });
      }

      const updatedUsers = await User.list("-created_date");
      setUsers(updatedUsers.filter((u: UserData) => u.email !== me.email));
      setCurrentUser(me);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
    setIsLoading(false);
  };

  const calculatePlanExpiration = (approvedAt: string, planType: string) => {
    if (!approvedAt) return null;
    
    const approvalDate = new Date(approvedAt);
    const daysToAdd: { [key: string]: number } = {
      '1_day': 1,
      '90_days': 90,
      '180_days': 180,
      '360_days': 360
    };
    
    const expirationDate = new Date(approvalDate);
    expirationDate.setDate(expirationDate.getDate() + (daysToAdd[planType] || 0));
    return expirationDate.toISOString();
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: 'pending' | 'approved' | 'denied' | 'blocked', planType: string | null = null) => {
    try {
      const updateData: any = {
        status: newStatus,
        approved_by: currentUser?.email,
        approved_at: new Date().toISOString()
      };

      if (newStatus === 'approved' && planType) {
        updateData.plan_type = planType;
        updateData.plan_expires_at = calculatePlanExpiration(updateData.approved_at, planType);
      } else if (newStatus === 'denied' || newStatus === 'blocked') {
        updateData.plan_type = null;
        updateData.plan_expires_at = null;
      }

      await User.update(userId, updateData);
      loadData();
    } catch (error) {
      console.error(`Erro ao ${newStatus} usuário:`, error);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      await User.delete(userId);
      loadData();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const confirmAction = (action: string, userId: string, userName: string) => {
    setActionToConfirm({ action, userId, userName });
    setShowConfirmDialog(true);
  };

  const executeConfirmedAction = async () => {
    const { action, userId } = actionToConfirm;
    if (action === 'delete' && userId) {
      await handleDeleteUser(userId);
    } else if (action === 'approve' && userId) {
      await handleUpdateUserStatus(userId, 'approved'); 
    } else if (action === 'deny' && userId) {
      await handleUpdateUserStatus(userId, 'denied');
    } else if (action === 'block' && userId) {
      await handleUpdateUserStatus(userId, 'blocked');
    }
    setShowConfirmDialog(false);
    setActionToConfirm({ action: null, userId: null, userName: null });
  };

  const getUserStats = () => {
    const total = users.length;
    const pending = users.filter((u: UserData) => u.status === "pending").length;
    const approved = users.filter((u: UserData) => u.status === "approved").length;
    const denied = users.filter((u: UserData) => u.status === "denied").length;
    const blocked = users.filter((u: UserData) => u.status === "blocked").length;
    
    return { total, pending, approved, denied, blocked };
  };

  const getPlanTypeLabel = (planType: string) => {
    const labels: { [key: string]: string } = {
      '1_day': '1 Dia',
      '90_days': '90 Dias',
      '180_days': '180 Dias',
      '360_days': '360 Dias'
    };
    return labels[planType] || planType;
  };

  const isPlanExpired = (planExpiresAt: string) => {
    if (!planExpiresAt) return false;
    return new Date() > new Date(planExpiresAt);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "denied":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "blocked":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "denied":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "blocked":
        return <ShieldOff className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="bg-card border-border shadow-xl max-w-md w-full">
            <CardContent className="p-8 text-center">
            <ShieldOff className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-card-foreground mb-3">Acesso Negado</h2>
            <p className="text-muted-foreground">Apenas administradores podem acessar esta página.</p>
            </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-1">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground text-lg">
              Gerencie usuários e permissões do sistema
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Logado como Admin: {currentUser?.full_name}</span>
          </div>
        </div>

        <UserStats stats={stats} isLoading={isLoading} />

        {/* Users Table */}
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xl text-card-foreground flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              Usuários do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted/50">
                    <TableHead className="text-muted-foreground font-medium">Usuário</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Plano</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Expira em</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Último Login</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Data de Registro</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Aprovado/Modificado Por</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full bg-muted" />
                            <div>
                              <Skeleton className="h-4 w-32 bg-muted rounded" />
                              <Skeleton className="h-3 w-24 bg-muted rounded mt-1.5" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-6 w-24 bg-muted rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 bg-muted rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24 bg-muted rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28 bg-muted rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24 bg-muted rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32 bg-muted rounded" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-20 bg-muted rounded mx-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="border-border hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-sm font-semibold text-foreground">
                                {user.full_name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{user.full_name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`border-2 ${getStatusColor(user.status)} capitalize text-xs font-medium`}>
                            {getStatusIcon(user.status)}
                            <span className="ml-1.5">
                              {user.status === 'pending' ? 'Pendente' : 
                               user.status === 'approved' ? 'Aprovado' : 
                               user.status === 'denied' ? 'Negado' : 
                               user.status === 'blocked' ? 'Bloqueado' : user.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.plan_type ? (
                            <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs">
                              {getPlanTypeLabel(user.plan_type)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.plan_expires_at ? (
                            <div>
                              <span className={`text-sm ${isPlanExpired(user.plan_expires_at) ? 'text-red-400' : 'text-foreground'}`}>
                                {format(new Date(user.plan_expires_at), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                              {isPlanExpired(user.plan_expires_at) && (
                                <p className="text-xs text-red-400">Expirado</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-foreground">
                            {user.last_login 
                              ? format(new Date(user.last_login), "dd/MM/yy HH:mm", { locale: ptBR })
                              : 'Nunca'
                            }
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-foreground">
                            {format(new Date(user.created_date), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {user.approved_by || '-'}
                          </span>
                          {user.approved_at && (
                             <p className="text-xs text-muted-foreground">
                               {format(new Date(user.approved_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                             </p>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <UserActions 
                            user={user as any}
                            onApprove={(selectedUserId: string, planType: string) => handleUpdateUserStatus(selectedUserId, 'approved', planType)}
                            onDeny={() => confirmAction('deny', user.id, user.full_name)}
                            onBlock={() => confirmAction('block', user.id, user.full_name)}
                            onDelete={() => confirmAction('delete', user.id, user.full_name)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {users.length === 0 && !isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                    <p>Nenhum usuário encontrado (além de você).</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400"/>
                Confirmar Ação
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground pt-2">
              {actionToConfirm.action === 'delete' && `Tem certeza que deseja excluir o usuário ${actionToConfirm.userName}? Esta ação não pode ser desfeita.`}
              {actionToConfirm.action === 'approve' && `Tem certeza que deseja aprovar o usuário ${actionToConfirm.userName}?`}
              {actionToConfirm.action === 'deny' && `Tem certeza que deseja negar o acesso para ${actionToConfirm.userName}?`}
              {actionToConfirm.action === 'block' && `Tem certeza que deseja bloquear o usuário ${actionToConfirm.userName}? Ele não poderá mais acessar o sistema.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)} className="hover:bg-muted/80">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeConfirmedAction} 
              className={`${
                actionToConfirm.action === 'delete' || actionToConfirm.action === 'deny' || actionToConfirm.action === 'block'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

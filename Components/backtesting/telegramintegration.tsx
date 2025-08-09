
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageCircle, Plus, Trash2, Send, Settings, AlertTriangle, Info, Edit, BarChart, DownloadCloud, FileX } from "lucide-react";
import { TelegramNotification } from '@/entities/TelegramNotification';
import { Strategy } from '@/entities/Strategy';
import { DailyGame } from '@/entities/DailyGame';
import { User } from '@/entities/User';
import { RankingHome } from '@/entities/RankingHome'; // New import
import { RankingAway } from '@/entities/RankingAway'; // New import
import { SendEmail } from '@/integrations/Core';
import BacktestingEngine from './BacktestingEngine';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TelegramIntegration() {
  const [notifications, setNotifications] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [showSentGamesReport, setShowSentGamesReport] = useState(false); // Controls visibility of the new report
  
  const [formData, setFormData] = useState({
    strategy_id: '',
    telegram_chat_id: '',
    is_active: true,
    bot_token: '',
    fallback_email: '',
    notification_preferences: {
      send_warnings: true,
      send_errors: true,
      send_success: false
    }
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    notification: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    setLogs(prev => [logEntry, ...prev]);
    console.log(logEntry); // Also log to console for debugging
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      addLog(`Carregando dados para usuário: ${currentUser.email}`);
      
      const [telegramNotifications, savedStrategies] = await Promise.all([
        TelegramNotification.filter({ created_by: currentUser.email }, "-created_date"),
        Strategy.filter({ created_by: currentUser.email }, "-created_date")
      ]);
      
      setNotifications(telegramNotifications);
      setStrategies(savedStrategies);
      
      addLog(`Carregadas ${telegramNotifications.length} notificações e ${savedStrategies.length} estratégias`);
    } catch (error) {
      addLog(`Erro ao carregar dados: ${error.message}`, 'error');
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateTelegramChatId = (value) => {
    const regex = /^(?:-?\d+|@[a-zA-Z0-9_]{5,32})$/;
    return regex.test(value);
  };

  const validateBotToken = (value) => {
    if (!value) return true; // Opcional
    const regex = /^\d{8,10}:[a-zA-Z0-9_-]{35}$/;
    return regex.test(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    const newErrors = {};
    if (!formData.strategy_id) {
      newErrors.strategy_id = "Selecione uma estratégia";
    }
    if (!validateTelegramChatId(formData.telegram_chat_id)) {
      newErrors.telegram_chat_id = "Chat ID inválido. Use @username ou -1001234567890";
    }
    if (formData.bot_token && !validateBotToken(formData.bot_token)) {
      newErrors.bot_token = "Token do bot inválido. Formato: 1234567890:ABCdefGHIJKL...";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedStrategy = strategies.find(s => s.id === formData.strategy_id);
    if (!selectedStrategy) return;
    
    const dataToSave = {
      ...formData,
      strategy_name: selectedStrategy.name
    };

    try {
      if (editingNotification) {
        await TelegramNotification.update(editingNotification.id, dataToSave);
        addLog(`Notificação "${selectedStrategy.name}" atualizada com sucesso`);
      } else {
        await TelegramNotification.create(dataToSave);
        addLog('Nova notificação criada com sucesso');
      }

      resetForm();
      await loadData();
    } catch (error) {
      addLog(`Erro ao salvar notificação: ${error.message}`, 'error');
      alert("Erro ao salvar notificação. Verifique os dados e tente novamente.");
    }
  };
  
  const resetForm = () => {
    setFormData({
      strategy_id: '',
      telegram_chat_id: '',
      is_active: true,
      bot_token: '',
      fallback_email: '',
      notification_preferences: {
        send_warnings: true,
        send_errors: true,
        send_success: false
      }
    });
    setErrors({});
    setShowAddForm(false);
    setEditingNotification(null);
  };

  const handleEditClick = (notification) => {
    setEditingNotification(notification);
    setFormData({
      strategy_id: notification.strategy_id,
      telegram_chat_id: notification.telegram_chat_id,
      is_active: notification.is_active,
      bot_token: notification.bot_token || '',
      fallback_email: notification.fallback_email || '',
      notification_preferences: notification.notification_preferences || {
        send_warnings: true,
        send_errors: true,
        send_success: false
      }
    });
    setShowAddForm(true);
  };

  const handleToggleActive = async (notification) => {
    try {
      await TelegramNotification.update(notification.id, {
        is_active: !notification.is_active
      });
      await loadData();
      addLog(`Notificação ${notification.strategy_name} ${!notification.is_active ? 'ativada' : 'desativada'}`);
    } catch (error) {
      addLog(`Erro ao atualizar notificação: ${error.message}`, 'error');
      alert("Erro ao alterar status da notificação.");
    }
  };

  const handleDeleteNotification = async () => {
    if (!deleteDialog.notification) return;

    try {
      await TelegramNotification.delete(deleteDialog.notification.id);
      setDeleteDialog({ open: false, notification: null });
      await loadData();
      addLog(`Notificação ${deleteDialog.notification.strategy_name} excluída`);
    } catch (error) {
      addLog(`Erro ao excluir notificação: ${error.message}`, 'error');
      alert("Erro ao excluir notificação. Tente novamente.");
    }
  };

  const sendToTelegram = async (chatId, message, botToken) => {
    if (!botToken) {
      addLog('Bot token não fornecido, pulando envio direto para Telegram', 'warning');
      return false;
    }
    
    addLog(`Tentando enviar mensagem para chat ${chatId} via Telegram`);
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        addLog(`Mensagem enviada com sucesso para Telegram (chat: ${chatId})`);
        return true;
      } else {
        addLog(`Falha no envio para Telegram: ${responseData.description || 'Erro desconhecido'}`, 'error');
        return false;
      }
    } catch (error) {
      addLog(`Erro ao enviar para Telegram: ${error.message}`, 'error');
      return false;
    }
  };

  const sendTelegramNotifications = async () => {
    setIsSending(true);
    clearLogs();
    addLog('=== INICIANDO PROCESSO DE ENVIO ===');
    
    try {
      // Carregar jogos do dia
      addLog('Carregando jogos do dia...');
      const dailyGames = await DailyGame.list('-created_date');
      addLog(`Total de jogos carregados: ${dailyGames.length}`);
      
      if (dailyGames.length === 0) {
        addLog('Nenhum jogo encontrado na base DailyGame', 'warning');
        alert('❌ Nenhum jogo encontrado na base de dados. Importe jogos primeiro.');
        setIsSending(false);
        return;
      }

      // Carregar dados de ranking se necessário
      addLog('Carregando dados de ranking...');
      const [rankingHome, rankingAway] = await Promise.all([
        RankingHome.list().catch(() => []),
        RankingAway.list().catch(() => [])
      ]);
      addLog(`Ranking carregado - Casa: ${rankingHome.length}, Fora: ${rankingAway.length}`);

      // Filtrar notificações ativas
      const activeNotifications = notifications.filter(n => n.is_active);
      addLog(`Notificações ativas encontradas: ${activeNotifications.length}`);
      
      if (activeNotifications.length === 0) {
        addLog('Nenhuma notificação ativa encontrada', 'warning');
        alert('❌ Nenhuma notificação ativa encontrada.');
        setIsSending(false);
        return;
      }

      const backtestingEngine = new BacktestingEngine();
      let totalGamesSentCount = 0;
      let successCount = 0;
      let errorCount = 0;

      for (const notification of activeNotifications) {
        addLog(`--- Processando notificação: ${notification.strategy_name} ---`);
        
        const strategy = strategies.find(s => s.id === notification.strategy_id);
        if (!strategy) {
          addLog(`Estratégia não encontrada para ID: ${notification.strategy_id}`, 'error');
          errorCount++;
          continue;
        }

        addLog(`Estratégia encontrada: ${strategy.name} (Mercado: ${strategy.market})`);

        try {
          // Transformar jogos para formato compatível com o engine
          const gamesForEngine = dailyGames.map(game => ({
            ...game,
            // Map DailyGame fields to GameData format expected by the engine
            ppg_home_pre: game.ppg_home,
            ppg_away_pre: game.ppg_away,
            xg_home_pre: game.xg_home_pre,
            xg_away_pre: game.xg_away_pre,
            season: game.season || '2024_2025', // Default season if not present
            rodada: game.rodada,
            shotsontarget_h: game.shots_on_target_h || 0,
            shotsontarget_a: game.shots_on_target_a || 0,
            shotsofftarget_h: game.shots_off_target_h || 0,
            shotsofftarget_a: game.shots_off_target_a || 0,
            // Map goal fields - DailyGame doesn't have actual results yet, so use null
            goals_h_ft: null,
            goals_a_ft: null,
            goals_h_ht: null,
            goals_a_ht: null,
          }));

          addLog(`Jogos transformados para engine: ${gamesForEngine.length}`);

          // Aplicar filtros da estratégia (incluindo novos filtros de ranking)
          addLog('Aplicando filtros da estratégia...');
          const filteredGames = backtestingEngine.filterGames(strategy, gamesForEngine, rankingHome, rankingAway);
          addLog(`Jogos após filtragem: ${filteredGames.length}`);
          
          if (filteredGames.length === 0) {
            addLog(`Nenhum jogo passou pelos filtros da estratégia ${strategy.name}`, 'warning');
            continue;
          }
          
          // Prepare message for sending
          let message = `🎯 *${strategy.name}*\n\n`;
          message += `📊 *Mercado:* ${strategy.market.replace(/_/g, ' ')}\n`;
          
          // Add season info if specified
          if (strategy.season && strategy.season.length > 0) {
            message += `🗓️ *Temporadas:* ${strategy.season.join(', ')}\n`;
          }
          
          // Add ranking info if specified
          if (strategy.min_ranking_home || strategy.max_ranking_home || strategy.min_ranking_away || strategy.max_ranking_away) {
            let rankingInfo = [];
            if (strategy.min_ranking_home) rankingInfo.push(`Casa Min: ${strategy.min_ranking_home}`);
            if (strategy.max_ranking_home) rankingInfo.push(`Casa Max: ${strategy.max_ranking_home}`);
            if (strategy.min_ranking_away) rankingInfo.push(`Fora Min: ${strategy.min_ranking_away}`);
            if (strategy.max_ranking_away) rankingInfo.push(`Fora Max: ${strategy.max_ranking_away}`);
            if (rankingInfo.length > 0) {
              message += `📈 *Ranking:* ${rankingInfo.join(', ')}\n`;
            }
          }
          
          message += `\n`;
          message += `⚽ *Jogos encontrados: ${filteredGames.length}*\n\n`;

          // Add up to 10 games to the message
          const gamesToShow = filteredGames.slice(0, 10);
          gamesToShow.forEach((game, index) => {
            message += `${index + 1}. *${game.home}* vs *${game.away}*\n`;
            message += `   📅 ${game.date} ${game.time || ''}\n`;
            message += `   🏆 ${game.league}\n`;
            
            if (game.odd_h_ft && game.odd_d_ft && game.odd_a_ft) {
              message += `   💰 Odds: ${game.odd_h_ft.toFixed(2)} | ${game.odd_d_ft.toFixed(2)} | ${game.odd_a_ft.toFixed(2)}\n`;
            }
            message += '\n';
          });

          if (filteredGames.length > 10) {
            message += `... e mais ${filteredGames.length - 10} jogos\n\n`;
          }

          message += `🤖 *Football Data Analysis*`;

          addLog(`Mensagem preparada (${message.length} caracteres)`);

          let success = false;
          if (notification.bot_token) {
            addLog('Tentando envio via Telegram...');
            success = await sendToTelegram(notification.telegram_chat_id, message, notification.bot_token);
          } else {
            addLog('Bot token não configurado, pulando envio direto para Telegram');
          }

          if (!success) {
            addLog('Enviando via email fallback...');
            try {
              const currentUser = await User.me();
              const emailTo = notification.fallback_email || currentUser.email;
              
              const plainTextMessage = message
                .replace(/\*/g, '')
                .replace(/🎯|📊|🎲|⚽|📅|🏆|💰|🤖|🗓️|📈/g, ''); // Updated regex
              
              await SendEmail({
                to: emailTo,
                subject: `🎯 ${strategy.name} - Jogos do Dia`,
                body: plainTextMessage
              });
              
              addLog(`Email enviado com sucesso para: ${emailTo}`);
              success = true;
            } catch (emailError) {
              addLog(`Erro no envio de email: ${emailError.message}`, 'error');
            }
          }

          if (success) {
            // Retrieve current sent_games to avoid overwriting, and add new ones
            const currentNotificationData = await TelegramNotification.get(notification.id);
            const currentSentGames = currentNotificationData?.sent_games || [];

            await TelegramNotification.update(notification.id, {
              last_sent_date: new Date().toISOString(),
              games_sent_count: (currentNotificationData?.games_sent_count || 0) + filteredGames.length,
              // Store filtered games with current sentDate for historical report
              sent_games: [...currentSentGames, ...filteredGames.map(g => ({...g, sentDate: new Date().toISOString(), strategyName: strategy.name}))]
            });

            totalGamesSentCount += filteredGames.length;
            successCount++;
            addLog(`Notificação ${strategy.name} processada com sucesso!`);
          } else {
            addLog(`Falha no envio da notificação ${strategy.name}`, 'error');
            errorCount++;
          }

        } catch (error) {
          addLog(`Erro ao processar notificação ${notification.strategy_name}: ${error.message}`, 'error');
          errorCount++;
        }
      }

      addLog('=== RELATÓRIO FINAL ===');
      addLog(`✅ ${successCount} notificação(ões) enviada(s)`);
      addLog(`⚽ ${totalGamesSentCount} jogo(s) enviado(s)`);
      addLog(`❌ ${errorCount} erro(s) encontrado(s)`);

      let alertMessage = `✅ Processo concluído!\n`;
      alertMessage += `📨 ${successCount} notificação(ões) enviada(s)\n`;
      alertMessage += `⚽ ${totalGamesSentCount} jogo(s) enviado(s)\n`;
      if (errorCount > 0) {
        alertMessage += `❌ ${errorCount} erro(s) encontrado(s)`;
      }

      alert(alertMessage);
      setShowLogs(true);
      await loadData();
      
    } catch (error) {
      addLog(`Erro geral no processo: ${error.message}`, 'error');
      console.error("Erro ao enviar notificações:", error);
      alert("❌ Erro ao enviar notificações. Verifique os logs para mais detalhes.");
      setShowLogs(true);
    }
    
    setIsSending(false);
  };
  
  const SentGamesReport = () => {
    const [allSentGames, setAllSentGames] = useState([]);
    const [isLoadingReport, setIsLoadingReport] = useState(false);

    const loadAllSentGames = async () => {
      setIsLoadingReport(true);
      try {
        const currentUser = await User.me();
        const allNotifications = await TelegramNotification.filter({ created_by: currentUser.email });
        
        const allGames = [];
        allNotifications.forEach(notification => {
          if (notification.sent_games && Array.isArray(notification.sent_games)) {
            notification.sent_games.forEach(game => {
              allGames.push({
                ...game,
                strategyName: game.strategyName || notification.strategy_name, // Prioritize game's embedded strategy name, fallback to notification
                sentDate: game.sentDate || notification.last_sent_date // Use game.sentDate if available, fallback to notification's last_sent_date
              });
            });
          }
        });

        allGames.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));
        setAllSentGames(allGames);
      } catch (error) {
        console.error("Erro ao carregar histórico de jogos:", error);
      } finally {
        setIsLoadingReport(false);
      }
    };

    const clearAllSentGames = async () => {
      if (!window.confirm('Tem certeza que deseja limpar todo o histórico de jogos enviados? Esta ação não pode ser desfeita.')) {
        return;
      }

      try {
        const currentUser = await User.me();
        const allNotifications = await TelegramNotification.filter({ created_by: currentUser.email });
        
        for (const notification of allNotifications) {
          await TelegramNotification.update(notification.id, {
            sent_games: [],
            games_sent_count: 0
          });
        }
        
        setAllSentGames([]);
        addLog('Histórico de jogos enviados foi limpo com sucesso');
      } catch (error) {
        addLog(`Erro ao limpar histórico: ${error.message}`, 'error');
      }
    };

    const downloadCSV = () => {
      if (allSentGames.length === 0) {
        alert('Nenhum dado para baixar');
        return;
      }

      const headers = ['Data Envio', 'Estratégia', 'Casa', 'Visitante', 'Liga', 'Data Jogo'];
      const csvContent = [
        headers.join(','),
        ...allSentGames.map(game => [
          game.sentDate ? new Date(game.sentDate).toLocaleDateString('pt-BR') : '',
          game.strategyName ? `"${game.strategyName.replace(/"/g, '""')}"` : '', // Ensure quotes for strategy name
          game.home ? `"${game.home.replace(/"/g, '""')}"` : '',
          game.away ? `"${game.away.replace(/"/g, '""')}"` : '',
          game.league ? `"${game.league.replace(/"/g, '""')}"` : '',
          game.date ? `"${game.date.replace(/"/g, '""')}"` : ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `telegram_sent_games_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    useEffect(() => {
      if (showSentGamesReport) {
        loadAllSentGames();
      }
    }, [showSentGamesReport]);

    return (
      <Dialog open={showSentGamesReport} onOpenChange={setShowSentGamesReport}>
        <DialogContent className="max-w-6xl bg-card border-border">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-card-foreground">Histórico Completo de Jogos Enviados</DialogTitle>
              <div className="flex gap-2">
                <Button
                  onClick={downloadCSV}
                  disabled={allSentGames.length === 0}
                  size="sm"
                  variant="outline"
                  className="border-border text-muted-foreground hover:bg-muted/20"
                >
                  <DownloadCloud className="w-4 h-4 mr-2" />
                  Baixar CSV
                </Button>
                <Button
                  onClick={clearAllSentGames}
                  disabled={allSentGames.length === 0}
                  size="sm"
                  variant="destructive"
                >
                  <FileX className="w-4 h-4 mr-2" />
                  Limpar Histórico
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            {isLoadingReport ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span>Carregando histórico...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32 text-muted-foreground">Data Envio</TableHead>
                    <TableHead className="w-48 text-muted-foreground">Estratégia</TableHead>
                    <TableHead className="min-w-64 text-muted-foreground">Jogo</TableHead>
                    <TableHead className="w-32 text-muted-foreground">Liga</TableHead>
                    <TableHead className="w-24 text-muted-foreground">Data Jogo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSentGames.length > 0 ? (
                    allSentGames.map((game, index) => (
                      <TableRow key={index} className="text-sm">
                        <TableCell className="font-mono text-xs text-card-foreground">
                          {game.sentDate ? new Date(game.sentDate).toLocaleDateString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell className="font-medium text-xs text-card-foreground">
                          {game.strategyName}
                        </TableCell>
                        <TableCell className="text-xs text-card-foreground">
                          {game.home} vs {game.away}
                        </TableCell>
                        <TableCell className="text-xs text-card-foreground">
                          {game.league}
                        </TableCell>
                        <TableCell className="text-xs text-card-foreground">
                          {game.date}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum jogo foi enviado ainda.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <div className="flex justify-between items-center">
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              Integração Telegram
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowLogs(!showLogs)}
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:bg-muted/20"
              >
                <Info className="w-4 h-4 mr-2" />
                {showLogs ? 'Ocultar Logs' : 'Ver Logs'}
              </Button>
              <Button
                onClick={() => setShowSentGamesReport(true)}
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:bg-muted/20"
              >
                <BarChart className="w-4 h-4 mr-2" />
                Relatório
              </Button>
              <Button
                onClick={sendTelegramNotifications}
                disabled={isSending || notifications.filter(n => n.is_active).length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Agora
                  </>
                )}
              </Button>
              <Button
                onClick={() => { setShowAddForm(true); setEditingNotification(null); }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Logs Section */}
          {showLogs && (
            <Card className="bg-slate-900/50 border-slate-700 mb-6">
              <CardHeader className="border-b border-slate-700 flex flex-row items-center justify-between">
                <CardTitle className="text-white text-sm">Logs de Debug</CardTitle>
                <Button
                  onClick={clearLogs}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Limpar
                </Button>
              </CardHeader>
              <CardContent className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`${
                        log.includes('ERROR') ? 'text-red-400' : 
                        log.includes('WARNING') ? 'text-yellow-400' : 
                        log.includes('===') ? 'text-blue-400 font-bold' : 
                        'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-slate-500">Nenhum log disponível</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {(showAddForm || editingNotification) && (
            <Card className="bg-muted/20 border-border mb-6">
              <CardHeader>
                <CardTitle className="text-card-foreground text-lg">{editingNotification ? 'Editar Notificação' : 'Nova Notificação'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="strategy" className="text-muted-foreground">Estratégia *</Label>
                      <select
                        id="strategy"
                        value={formData.strategy_id}
                        onChange={(e) => setFormData({...formData, strategy_id: e.target.value})}
                        className="w-full p-2 bg-input border border-border rounded-md text-foreground"
                        required
                      >
                        <option value="">Selecione uma estratégia</option>
                        {strategies.map(strategy => (
                          <option key={strategy.id} value={strategy.id}>
                            {strategy.name}
                          </option>
                        ))}
                      </select>
                      {errors.strategy_id && (
                        <p className="text-red-400 text-xs mt-1">{errors.strategy_id}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="chat_id" className="text-muted-foreground">Chat ID do Telegram *</Label>
                      <Input
                        id="chat_id"
                        value={formData.telegram_chat_id}
                        onChange={(e) => setFormData({...formData, telegram_chat_id: e.target.value})}
                        placeholder="Ex: @meucanal ou -1001234567890"
                        className="bg-input border-border text-foreground"
                        required
                      />
                      {errors.telegram_chat_id && (
                        <p className="text-red-400 text-xs mt-1">{errors.telegram_chat_id}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="bot_token" className="text-muted-foreground">Token do Bot (Opcional)</Label>
                      <Input
                        id="bot_token"
                        value={formData.bot_token}
                        onChange={(e) => setFormData({...formData, bot_token: e.target.value})}
                        placeholder="1234567890:ABCdefGHIJKL..."
                        className="bg-input border-border text-foreground"
                      />
                      {errors.bot_token && (
                        <p className="text-red-400 text-xs mt-1">{errors.bot_token}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="fallback_email" className="text-muted-foreground">Email Fallback (Opcional)</Label>
                      <Input
                        id="fallback_email"
                        type="email"
                        value={formData.fallback_email}
                        onChange={(e) => setFormData({...formData, fallback_email: e.target.value})}
                        placeholder="email@exemplo.com"
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-muted-foreground">Preferências de Notificação</Label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="send_warnings"
                          checked={formData.notification_preferences.send_warnings}
                          onCheckedChange={(checked) => setFormData({
                            ...formData,
                            notification_preferences: {
                              ...formData.notification_preferences,
                              send_warnings: checked
                            }
                          })}
                        />
                        <Label htmlFor="send_warnings" className="text-muted-foreground text-sm">Avisos</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="send_errors"
                          checked={formData.notification_preferences.send_errors}
                          onCheckedChange={(checked) => setFormData({
                            ...formData,
                            notification_preferences: {
                              ...formData.notification_preferences,
                              send_errors: checked
                            }
                          })}
                        />
                        <Label htmlFor="send_errors" className="text-muted-foreground text-sm">Erros</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="send_success"
                          checked={formData.notification_preferences.send_success}
                          onCheckedChange={(checked) => setFormData({
                            ...formData,
                            notification_preferences: {
                              ...formData.notification_preferences,
                              send_success: checked
                            }
                          })}
                        />
                        <Label htmlFor="send_success" className="text-muted-foreground text-sm">Sucessos</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="active" className="text-muted-foreground">Ativo</Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="border-border text-muted-foreground hover:bg-muted/20"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      {editingNotification ? 'Salvar Alterações' : 'Adicionar'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Notifications Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Estratégia</TableHead>
                  <TableHead className="text-muted-foreground">Chat ID</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Bot Token</TableHead>
                  <TableHead className="text-muted-foreground">Último Envio</TableHead>
                  <TableHead className="text-muted-foreground">Jogos Enviados</TableHead>
                  <TableHead className="text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <TableRow key={notification.id} className="border-border hover:bg-muted/50">
                      <TableCell className="text-card-foreground font-medium">
                        {notification.strategy_name}
                      </TableCell>
                      <TableCell className="text-card-foreground">
                        {notification.telegram_chat_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={notification.is_active}
                            onCheckedChange={() => handleToggleActive(notification)}
                          />
                          <Badge 
                            variant="outline"
                            className={notification.is_active 
                              ? 'border-emerald-500 text-emerald-400' 
                              : 'border-slate-500 text-slate-400'
                            }
                          >
                            {notification.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-card-foreground">
                        {notification.bot_token ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Configurado
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Email Fallback
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-card-foreground">
                        {notification.last_sent_date ? new Date(notification.last_sent_date).toLocaleDateString('pt-BR') : 'Nunca'}
                      </TableCell>
                      <TableCell className="text-card-foreground">
                        {notification.games_sent_count || 0}
                      </TableCell>
                      <TableCell className="flex gap-2">
                         <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(notification)}
                          className="h-8 w-8 text-blue-400 border-blue-500/50 hover:bg-blue-500/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setDeleteDialog({ open: true, notification })}
                          className="h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                      Nenhuma notificação configurada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2">📝 Como configurar:</h4>
            <ol className="text-sm text-blue-300 space-y-1 list-decimal list-inside">
              <li>Crie um bot no Telegram através do @BotFather</li>
              <li>Copie o token do bot (opcional, mas recomendado para Telegram direto)</li>
              <li>Adicione o bot ao seu canal ou grupo</li>
              <li>Obtenha o Chat ID do canal/grupo</li>
              <li>Configure aqui com o Chat ID, token (opcional) e a estratégia desejada</li>
              <li>Use "Enviar Agora" para testar</li>
            </ol>
            <div className="flex items-start gap-2 mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-400">
                <strong>Fallback automático:</strong> Se o token do bot não for fornecido ou o envio para Telegram falhar, 
                as notificações serão enviadas automaticamente por email.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <SentGamesReport />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, notification: null })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground flex items-center">
              <Trash2 className="w-5 h-5 mr-2 text-red-400"/>
              Excluir Notificação
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground pt-2">
              Tem certeza que deseja excluir a notificação da estratégia "{deleteDialog.notification?.strategy_name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel onClick={() => setDeleteDialog({ open: false, notification: null })} className="hover:bg-muted/80">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteNotification} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

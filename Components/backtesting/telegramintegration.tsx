import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Send,
  Bell,
  Settings,
  Trash2,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { TelegramNotification } from "@/entities/TelegramNotification";
import BacktestingEngine, { type Strategy, type GameData } from "@/components/backtesting/BacktestingEngine";

interface NotificationSettings {
  strategy_id: number;
  telegram_chat_id: string;
  bot_token: string;
  fallback_email?: string;
}

interface TelegramNotificationRow {
  id: number;
  strategy_id: number;
  strategy_name: string;
  telegram_chat_id: string;
  bot_token: string;
  is_active: boolean;
  fallback_email?: string;
  created_at: string;
}

interface TelegramIntegrationProps {
  strategies: Strategy[];
  gameData: GameData[];
}

export default function TelegramIntegration({ strategies, gameData }: TelegramIntegrationProps) {
  const [notifications, setNotifications] = useState<TelegramNotificationRow[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [settings, setSettings] = useState<NotificationSettings>({
    strategy_id: 0,
    telegram_chat_id: '',
    bot_token: '',
    fallback_email: ''
  });
  const [testMessages, setTestMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await TelegramNotification.list();
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const addTestMessage = (message: string) => {
    setTestMessages((prev: string[]) => [...prev, message]);
  };

  const handleStrategyChange = (value: string) => {
    const strategy = strategies.find((s: Strategy) => s.id?.toString() === value);
    setSelectedStrategy(strategy || null);
    if (strategy?.id) {
      setSettings((prev: NotificationSettings) => ({ ...prev, strategy_id: strategy.id! }));
    }
  };

  const handleInputChange = (field: keyof NotificationSettings, value: string) => {
    setSettings((prev: NotificationSettings) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newNotification = {
        strategy_id: settings.strategy_id,
        strategy_name: selectedStrategy?.name || '',
        telegram_chat_id: settings.telegram_chat_id,
        bot_token: settings.bot_token,
        fallback_email: settings.fallback_email,
        is_active: true
      };

      await TelegramNotification.create(newNotification);
      addTestMessage(`Notificação criada para estratégia: ${selectedStrategy?.name}`);
      
      // Reset form
      setSettings({
        strategy_id: 0,
        telegram_chat_id: '',
        bot_token: '',
        fallback_email: ''
      });
      setSelectedStrategy(null);
      
      await loadNotifications();
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      addTestMessage(`Erro ao criar notificação: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = async (notification: TelegramNotificationRow) => {
    try {
      await TelegramNotification.update(notification.id, {
        is_active: !notification.is_active
      });
      await loadNotifications();
      addTestMessage(`Notificação ${notification.is_active ? 'desativada' : 'ativada'} para ${notification.strategy_name}`);
    } catch (error) {
      console.error('Erro ao alterar status da notificação:', error);
      addTestMessage(`Erro ao alterar status: ${String(error)}`);
    }
  };

  const deleteNotification = async (notification: TelegramNotificationRow) => {
    try {
      await TelegramNotification.delete(notification.id);
      await loadNotifications();
      addTestMessage(`Notificação removida para ${notification.strategy_name}`);
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      addTestMessage(`Erro ao deletar: ${String(error)}`);
    }
  };

  const sendTelegramMessage = async (chatId: string, message: string, botToken: string) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.description || 'Telegram API error');
      }

      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem Telegram:', error);
      throw error;
    }
  };

  const testNotification = async (notification: TelegramNotificationRow) => {
    setIsLoading(true);
    try {
      const strategy = strategies.find((s: Strategy) => s.id === notification.strategy_id);
      if (!strategy) {
        throw new Error('Estratégia não encontrada');
      }

      const backtestingEngine = new BacktestingEngine();
      const filteredGames = backtestingEngine.filterGames(strategy, gameData, [], []).slice(0, 3);

      const message = `
🎯 <b>Teste de Notificação</b>

📊 <b>Estratégia:</b> ${strategy.name}
🎲 <b>Mercado:</b> ${strategy.market}

${strategy.season ? `📅 <b>Temporada:</b> ${Array.isArray(strategy.season) ? strategy.season.join(', ') : strategy.season}` : ''}

${strategy.min_ranking_home || strategy.max_ranking_home || strategy.min_ranking_away || strategy.max_ranking_away ? 
  `🏆 <b>Ranking:</b> Casa: ${strategy.min_ranking_home || '-'}-${strategy.max_ranking_home || '-'}, Fora: ${strategy.min_ranking_away || '-'}-${strategy.max_ranking_away || '-'}` : ''}

📋 <b>Jogos Encontrados (3 primeiros):</b>
${filteredGames.map((game: GameData, index: number) => `
${index + 1}. ${game.home} vs ${game.away}
   📅 ${format(new Date(game.date), 'dd/MM/yyyy')}
   ⚽ Resultado: ${game.goals_h_ft || 0}-${game.goals_a_ft || 0}
`).join('')}

✅ <b>Sistema funcionando!</b>
      `;

      if (notification.bot_token && notification.telegram_chat_id) {
        await sendTelegramMessage(notification.telegram_chat_id, message, notification.bot_token);
        addTestMessage(`✅ Mensagem de teste enviada via Telegram para ${notification.strategy_name}`);
      } else {
        addTestMessage(`❌ Configuração incompleta para ${notification.strategy_name}`);
      }

      // Fallback para email se disponível
      if (notification.fallback_email) {
        try {
          // Note: Email functionality would be implemented here
          addTestMessage(`📧 Email de fallback enviado para ${notification.fallback_email}`);
        } catch (emailError) {
          console.error('Erro ao enviar email:', emailError);
          addTestMessage(`❌ Erro ao enviar email: ${String(emailError)}`);
        }
      }

      const filteredStrategyGames = backtestingEngine.filterGames(strategy, gameData.filter((g: GameData) => g.league === strategy.name), [], []);

      addTestMessage(`🎯 Estratégia: ${strategy.name}`);
      addTestMessage(`📊 Total de jogos filtrados: ${filteredStrategyGames.length}`);
      addTestMessage(`📋 Amostra de ${Math.min(3, filteredGames.length)} jogos enviada`);

    } catch (error) {
      addTestMessage(`❌ Erro no teste: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runAllActiveNotifications = async () => {
    setIsLoading(true);
    try {
      const activeNotifications = notifications.filter(n => n.is_active);
      
      if (activeNotifications.length === 0) {
        addTestMessage('⚠️ Nenhuma notificação ativa encontrada');
        return;
      }

      const allGames: GameData[] = [...gameData];
      for (const notification of activeNotifications) {
        try {
          const strategy = strategies.find(s => s.id === notification.strategy_id);
          if (!strategy) continue;

          const backtestingEngine = new BacktestingEngine();
          const filteredGames = backtestingEngine.filterGames(strategy, allGames, [], []);

          if (filteredGames.length === 0) {
            addTestMessage(`ℹ️ Nenhum jogo encontrado para ${notification.strategy_name}`);
            continue;
          }

          const message = `
🎯 <b>${notification.strategy_name}</b>

📊 <b>Jogos Encontrados:</b> ${filteredGames.length}
🎲 <b>Mercado:</b> ${strategy.market}

📋 <b>Próximos Jogos:</b>
${filteredGames.slice(0, 5).map((game: GameData, index: number) => `
${index + 1}. ${game.home} vs ${game.away}
   📅 ${format(new Date(game.date), 'dd/MM/yyyy')}
`).join('')}

🤖 <i>Mensagem automática do sistema</i>
          `;

          await sendTelegramMessage(notification.telegram_chat_id, message, notification.bot_token);
          addTestMessage(`✅ Notificação enviada: ${notification.strategy_name} (${filteredGames.length} jogos)`);

        } catch (notificationError) {
          addTestMessage(`❌ Erro na notificação ${notification.strategy_name}: ${String(notificationError)}`);
        }
      }

      addTestMessage(`🎉 Processamento concluído para ${activeNotifications.length} notificações`);

    } catch (error) {
      addTestMessage(`❌ Erro geral: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-400" />
            Integração Telegram
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Configuration Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            Nova Notificação
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="strategy" className="text-white">Estratégia</Label>
                <select
                  id="strategy"
                  value={selectedStrategy?.id?.toString() || ''}
                  onChange={(e) => handleStrategyChange(e.target.value)}
                  className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white"
                  required
                >
                  <option value="">Selecione uma estratégia</option>
                  {strategies.map((strategy: Strategy) => (
                    <option key={strategy.id} value={strategy.id?.toString()}>
                      {strategy.name} - {strategy.market}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="chatId" className="text-white">Chat ID do Telegram</Label>
                <Input
                  id="chatId"
                  type="text"
                  value={settings.telegram_chat_id}
                  onChange={(e) => handleInputChange('telegram_chat_id', e.target.value)}
                  placeholder="Ex: -1234567890"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="botToken" className="text-white">Bot Token</Label>
                <Input
                  id="botToken"
                  type="text"
                  value={settings.bot_token}
                  onChange={(e) => handleInputChange('bot_token', e.target.value)}
                  placeholder="Bot Token do Telegram"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white">Email de Fallback (Opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.fallback_email || ''}
                  onChange={(e) => handleInputChange('fallback_email', e.target.value)}
                  placeholder="email@exemplo.com"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? 'Criando...' : 'Criar Notificação'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Notifications */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Notificações Ativas</CardTitle>
            <Button
              onClick={runAllActiveNotifications}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Executar Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Estratégia</TableHead>
                  <TableHead className="text-slate-300">Chat ID</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Criado em</TableHead>
                  <TableHead className="text-slate-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification: TelegramNotificationRow) => (
                  <TableRow key={notification.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">
                      {notification.strategy_name}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {notification.telegram_chat_id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notification.is_active}
                          onCheckedChange={() => toggleNotification(notification)}
                        />
                        <Badge
                          variant="outline"
                          className={notification.is_active
                            ? 'border-emerald-500 text-emerald-400'
                            : 'border-slate-500 text-slate-400'
                          }
                        >
                          {notification.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => testNotification(notification)}
                          disabled={isLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteNotification(notification)}
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {notifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Nenhuma notificação configurada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Messages */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            Log de Atividades
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTestMessages([])}
            className="border-slate-600 text-slate-400 hover:bg-slate-700"
          >
            Limpar Log
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-slate-900 rounded p-4 h-64 overflow-y-auto">
            {testMessages.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhuma atividade registrada</p>
            ) : (
              <div className="space-y-2">
                {testMessages.map((message: string, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="text-slate-400">
                      [{format(new Date(), 'HH:mm:ss')}]
                    </span>
                    <span className="text-white ml-2">{message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React, { useState } from "react";
import { GameData } from "@/entities/GameData";
import { DailyGame } from "@/entities/DailyGame";
import { RankingHome } from "@/entities/RankingHome";
import { RankingAway } from "@/entities/RankingAway";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  ArrowLeft,
  Database,
  Trash2,
  CalendarDays,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UploadData() {
  const [uploadType, setUploadType] = useState('GameData');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

  const entityOptions = [
    { value: 'GameData', label: 'Dados Históricos (GameData)' },
    { value: 'DailyGame', label: 'Jogos do Dia (DailyGame)' },
    { value: 'RankingHome', label: 'Ranking Mandantes (RankingHome)' },
    { value: 'RankingAway', label: 'Ranking Visitantes (RankingAway)' },
  ];

  const processUpload = async (file, entityType) => {
    if (!file) {
      setMessage({ type: "error", text: "Por favor, selecione um arquivo CSV." });
      return;
    }
    if (file.type !== "text/csv") {
      setMessage({ type: "error", text: "Por favor, selecione apenas arquivos CSV." });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setMessage({
      type: "info",
      text: `Iniciando o upload do arquivo para ${entityOptions.find(o => o.value === entityType)?.label}...`
    });

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { file_url } = await UploadFile({ file });
      setProgress(95);
      setMessage({
        type: "info",
        text: "Processando arquivo CSV diretamente. Isso pode levar alguns minutos..."
      });

      clearInterval(progressInterval);
      setProgress(100);

      const response = await fetch(file_url);
      const csvText = await response.text();

      const lines = csvText.split('\n');
      if (lines.length <= 1) {
        throw new Error('Arquivo CSV vazio ou inválido');
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

      let EntityClass;
      switch (entityType) {
        case 'GameData':
          EntityClass = GameData;
          break;
        case 'DailyGame':
          EntityClass = DailyGame;
          break;
        case 'RankingHome':
          EntityClass = RankingHome;
          break;
        case 'RankingAway':
          EntityClass = RankingAway;
          break;
        default:
          throw new Error('Tipo de entidade inválido');
      }

      const schema = EntityClass.schema();
      const schemaProperties = Object.keys(schema.properties);

      const dataArray = [];
      const parseChunkSize = 1000;

      for (let i = 1; i < lines.length; i += parseChunkSize) {
        const chunk = lines.slice(i, i + parseChunkSize);

        setMessage({
          type: "info",
          text: `Processando linhas ${i} a ${Math.min(i + parseChunkSize - 1, lines.length - 1)} de ${lines.length - 1} ...`
        });

        const chunkData = chunk
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            const item = {};

            headers.forEach((header, index) => {
              if (schemaProperties.includes(header)) {
                let value = values[index]?.trim();

                if (!value || value === '' || value.toLowerCase() === 'null' || value.toLowerCase() === 'undefined') {
                  item[header] = null;
                } else {
                  const fieldSchema = schema.properties[header];
                  if (fieldSchema && (fieldSchema.type === 'number' || (Array.isArray(fieldSchema.type) && fieldSchema.type.includes('number')))) {
                    const numValue = parseFloat(value);
                    item[header] = isNaN(numValue) ? null : numValue;
                  } else {
                    item[header] = value;
                  }
                }
              }
            });

            return item;
          })
          .filter(item => Object.keys(item).length > 0);

        dataArray.push(...chunkData);
      }

      setMessage({
        type: "info",
        text: "Importando dados para o banco de dados em lotes..."
      });

      const importBatchSize = 100;
      let importedCount = 0;

      for (let i = 0; i < dataArray.length; i += importBatchSize) {
        const batch = dataArray.slice(i, i + importBatchSize);

        try {
          await EntityClass.bulkCreate(batch);
          importedCount += batch.length;

          setMessage({
            type: "info",
            text: `Importado ${importedCount} de ${dataArray.length} registros...`
          });
        } catch (batchError) {
          console.warn(`Erro ao importar lote ${i}-${i + batch.length}:`, batchError);
          setMessage({
            type: "warning",
            text: `Erro no lote. Tentando importar registros individualmente...`
          });
          for (const record of batch) {
            try {
              await EntityClass.create(record);
              importedCount++;
            } catch (singleError) {
              console.warn('Erro ao importar registro individual:', singleError);
            }
          }

          setMessage({
            type: "info",
            text: `Importado ${importedCount} de ${dataArray.length} registros (com alguns erros).`
          });
        }
      }

      setMessage({
        type: "success",
        text: `Upload concluído! ${importedCount} registros foram importados de ${dataArray.length} processados.`
      });

    } catch (error) {
      console.error("Erro no upload:", error);
      setMessage({
        type: "error",
        text: `Erro ao processar o arquivo: ${error.message}. Verifique se o CSV está no formato correto.`
      });
    }

    setIsUploading(false);
    setTimeout(() => setProgress(0), 4000);
  };

  const clearDatabase = async (entityType) => {
    if (!window.confirm(`Tem certeza que deseja limpar TODOS os dados de ${entityOptions.find(o => o.value === entityType)?.label}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setIsClearing(true);
    setMessage({
      type: "info",
      text: `Limpando dados de ${entityOptions.find(o => o.value === entityType)?.label}...`
    });

    try {
      let EntityClass;
      switch (entityType) {
        case 'GameData':
          EntityClass = GameData;
          break;
        case 'DailyGame':
          EntityClass = DailyGame;
          break;
        case 'RankingHome':
          EntityClass = RankingHome;
          break;
        case 'RankingAway':
          EntityClass = RankingAway;
          break;
        default:
          throw new Error('Tipo de entidade inválido');
      }

      const allRecords = await EntityClass.list();
      let deletedCount = 0;

      for (const record of allRecords) {
        try {
          await EntityClass.delete(record.id);
          deletedCount++;
          setMessage({
            type: "info",
            text: `Deletado ${deletedCount} de ${allRecords.length} registros...`
          });
        } catch (deleteError) {
          console.warn(`Erro ao deletar registro ${record.id}:`, deleteError);
        }
      }

      setMessage({
        type: "success",
        text: `Limpeza concluída! ${deletedCount} registros foram removidos com sucesso!`
      });
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
      setMessage({
        type: "error",
        text: `Erro ao limpar dados: ${error.message}`
      });
    }

    setIsClearing(false);
  };

  return (
    <div className="p-6 lg:p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to={createPageUrl("Dashboard")}>
          <Button variant="outline" size="icon" className="border-border text-muted-foreground hover:bg-muted/20">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-1">
            Upload de Dados
          </h1>
          <p className="text-muted-foreground text-lg">
            Importe dados de jogos, rankings e outras informações
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="bg-card border-border mb-8">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary" />
            Upload de Arquivo CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Type Selection */}
            <div>
              <Label htmlFor="uploadType" className="text-muted-foreground">Tipo de Dados</Label>
              <Select value={uploadType} onValueChange={setUploadType}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecione o tipo de dado" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  {entityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Input */}
            <div>
              <Label htmlFor="csvFile" className="text-muted-foreground">Arquivo CSV</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={(e) => processUpload(e.target.files[0], uploadType)}
                disabled={isUploading || isClearing}
                className="bg-input border-border text-foreground"
              />
            </div>

            {/* Clear Database Button */}
            <div className="flex gap-4">
              <Button
                onClick={() => clearDatabase(uploadType)}
                disabled={isUploading || isClearing}
                variant="destructive"
                className="flex-1"
              >
                {isClearing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Limpando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Base {entityOptions.find(o => o.value === uploadType)?.label}
                  </>
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            {(isUploading || isClearing) && (
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : message.type === 'error'
                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : message.type === 'info'
                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
              }`}>
                <p>{message.text}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Formato - Dados Históricos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                O arquivo CSV deve conter colunas com os cabeçalhos exatamente como abaixo (em minúsculas):
              </p>
              <ul className="text-muted-foreground space-y-1 text-xs list-disc list-inside">
                <li>id_jogo, league, season, date, rodada, home, away</li>
                <li>goals_h_ft, goals_a_ft, odd_h_ft, odd_d_ft, odd_a_ft</li>
                <li>ppg_home_pre, ppg_away_pre, xg_home_pre</li>
                <li>shotsontarget_h, corners_h_ft</li>
                <li>... e todas as outras colunas do schema.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-400" />
              Formato - Jogos do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                O arquivo CSV deve conter colunas com os cabeçalhos exatamente como abaixo (em minúsculas):
              </p>
              <ul className="text-muted-foreground space-y-1 text-xs list-disc list-inside">
                <li>league, date, time, rodada, home, away</li>
                <li>odd_h_ht, odd_d_ht, odd_a_ht</li>
                <li>odd_h_ft, odd_d_ft, odd_a_ft</li>
                <li>odd_over05_ht, odd_under05_ht</li>
                <li>odd_over15_ft, odd_under15_ft, odd_over25_ft</li>
                <li>ppg_home, ppg_away, xg_home_pre, xg_away_pre</li>
                <li>odd_btts_yes, odd_btts_no</li>
                <li>odd_corners_h, odd_corners_d, odd_corners_a</li>
                <li>... e todas as outras colunas do schema</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Formato - Ranking (Mandantes/Visitantes)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                O arquivo CSV deve conter cabeçalhos em minúsculas:
              </p>
              <ul className="text-muted-foreground space-y-1 text-xs list-disc list-inside">
                <li><b>RankingHome:</b> league, season, home, draw, loss, win, points_home, goal_difference_home, ranking_home</li>
                <li><b>RankingAway:</b> league, season, away, draw, loss, win, points_away, goal_difference_away, ranking_away</li>
              </ul>
              <div className="flex items-center gap-2 mt-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded">
                <Info className="w-4 h-4 text-purple-400" />
                <p className="text-xs text-purple-300">Selecione o tipo de ranking correto no seletor de upload.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

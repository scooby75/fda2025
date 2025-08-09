
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Database, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function UploadData() {
  const [uploadType, setUploadType] = useState<'gamedata' | 'dailygame' | 'rankinghome' | 'rankingaway'>('gamedata');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const entityOptions = [
    { value: 'gamedata' as const, label: 'Dados Históricos (GameData)', table: 'gamedata' as const },
    { value: 'dailygame' as const, label: 'Jogos do Dia (DailyGame)', table: 'dailygame' as const },
    { value: 'rankinghome' as const, label: 'Ranking Mandantes (RankingHome)', table: 'rankinghome' as const },
    { value: 'rankingaway' as const, label: 'Ranking Visitantes (RankingAway)', table: 'rankingaway' as const },
  ];

  const processUpload = async (file: File | null) => {
    if (!file) {
      setMessage({ type: "error", text: "Por favor, selecione um arquivo CSV." });
      return;
    }
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setMessage({ type: "error", text: "Por favor, selecione apenas arquivos CSV." });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setMessage({
      type: "info",
      text: `Iniciando o upload do arquivo para ${entityOptions.find(o => o.value === uploadType)?.label}...`
    });

    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      if (lines.length <= 1) {
        throw new Error('Arquivo CSV vazio ou inválido');
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      setProgress(20);

      const selectedEntity = entityOptions.find(o => o.value === uploadType);
      if (!selectedEntity) throw new Error('Tipo de entidade inválido');

      setMessage({
        type: "info",
        text: "Convertendo dados do CSV para o formato correto..."
      });

      const dataArray = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < headers.length) continue;

        const item: any = {};
        headers.forEach((header, index) => {
          let value = values[index]?.trim();
          
          if (!value || value === '' || value.toLowerCase() === 'null') {
            item[header] = null;
          } else {
            const numValue = parseFloat(value);
            item[header] = isNaN(numValue) ? value : numValue;
          }
        });

        if (Object.keys(item).length > 0) {
          dataArray.push(item);
        }
      }

      setProgress(60);
      setMessage({
        type: "info",
        text: "Importando dados para o banco de dados em lotes..."
      });

      // Import in batches
      const batchSize = 100;
      let importedCount = 0;

      for (let i = 0; i < dataArray.length; i += batchSize) {
        const batch = dataArray.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from(selectedEntity.table)
          .insert(batch);

        if (error) {
          console.warn(`Erro no lote ${i}-${i + batch.length}:`, error);
        } else {
          importedCount += batch.length;
        }

        setProgress(60 + (40 * i / dataArray.length));
        setMessage({
          type: "info",
          text: `Importado ${importedCount} de ${dataArray.length} registros...`
        });
      }

      setProgress(100);
      setMessage({
        type: "success",
        text: `Upload concluído! ${importedCount} registros foram importados.`
      });

      toast({
        title: "Upload concluído",
        description: `${importedCount} registros foram importados com sucesso.`,
      });

    } catch (error: any) {
      console.error("Erro no upload:", error);
      setMessage({
        type: "error",
        text: `Erro ao processar o arquivo: ${error.message}`
      });
      
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsUploading(false);
    setTimeout(() => setProgress(0), 4000);
  };

  const clearDatabase = async () => {
    const selectedEntity = entityOptions.find(o => o.value === uploadType);
    if (!selectedEntity) return;

    if (!window.confirm(`Tem certeza que deseja limpar TODOS os dados de ${selectedEntity.label}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setIsClearing(true);
    setMessage({
      type: "info",
      text: `Limpando dados de ${selectedEntity.label}...`
    });

    try {
      const { error } = await supabase
        .from(selectedEntity.table)
        .delete()
        .neq('id', 0);

      if (error) throw error;

      setMessage({
        type: "success",
        text: `Limpeza concluída! Todos os registros foram removidos.`
      });

      toast({
        title: "Limpeza concluída",
        description: "Todos os registros foram removidos com sucesso.",
      });

    } catch (error: any) {
      console.error("Erro ao limpar dados:", error);
      setMessage({
        type: "error",
        text: `Erro ao limpar dados: ${error.message}`
      });

      toast({
        title: "Erro na limpeza",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsClearing(false);
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent mb-1">
            Upload de Dados
          </h1>
          <p className="text-muted-foreground text-lg">
            Importe dados de jogos, rankings e outras informações
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="bg-card border-border backdrop-blur-sm mb-8">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Upload className="w-6 h-6 text-emerald-500" />
            Upload de Arquivo CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Type Selection */}
            <div>
              <Label htmlFor="uploadType" className="text-muted-foreground">Tipo de Dados</Label>
              <Select value={uploadType} onValueChange={(value: any) => setUploadType(value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecione o tipo de dado" />
                </SelectTrigger>
                <SelectContent>
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
                onChange={(e) => processUpload(e.target.files?.[0] || null)}
                disabled={isUploading || isClearing}
                className="bg-input border-border text-foreground"
              />
            </div>

            {/* Clear Database Button */}
            <div className="flex gap-4">
              <Button
                onClick={clearDatabase}
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
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : message.type === 'error'
                  ? 'bg-red-500/10 border-red-500/20 text-red-500'
                  : message.type === 'info'
                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                  : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
              }`}>
                <p>{message.text}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

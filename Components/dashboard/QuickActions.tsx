import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Upload, Zap } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link to={createPageUrl("UploadData")}>
        <Button 
          variant="outline" 
          className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full sm:w-auto"
        >
          <Upload className="w-4 h-4 mr-2" />
          Importar Dados
        </Button>
      </Link>
      <Link to={createPageUrl("Backtesting")}>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nova Estratégia
        </Button>
      </Link>
    </div>
  );
}
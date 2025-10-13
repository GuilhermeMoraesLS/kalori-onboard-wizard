import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { ProgressBar } from "@/components/onboarding/ProgressBar";

export const LoadingScreen = ({ onComplete }: { onComplete?: () => void }) => {
  const [pct, setPct] = useState(0);
  const items = ["Calorias", "Plano", "Preferências", "Sincronização"];

  useEffect(() => {
    let id = setInterval(() => {
      setPct((p) => {
        const next = Math.min(100, p + Math.ceil(Math.random() * 6));
        if (next === 100) {
          clearInterval(id);
          setTimeout(() => onComplete?.(), 600);
        }
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <div className="text-4xl font-bold">{pct}% Estamos configurando tudo para você.</div>
      <div className="text-sm text-muted-foreground">Aplicando a fórmula BMR...</div>
      <div className="w-80">
        <div className="h-3 bg-secondary rounded overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="w-80 space-y-2 mt-4">
        {items.map((it, i) => (
          <div key={it} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full ${pct > (i+1)*20 ? "bg-primary text-white flex items-center justify-center" : "bg-muted text-muted-foreground flex items-center justify-center"}`}>
              {pct > (i+1)*20 ? <Check className="w-4 h-4" /> : <span className="text-xs">•</span>}
            </div>
            <div className="text-sm">{it}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
import React from "react";
import { ContinueButton } from "@/components/onboarding/ContinueButton";

export const Paywall = ({ onSkip }: { onSkip?: () => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card p-6 rounded-2xl border text-center space-y-4">
        <div className="text-3xl font-bold">Sua oferta única e exclusiva!</div>
        <div className="text-4xl font-extrabold text-primary">80% OFF PARA SEMPRE</div>
        <p className="text-sm text-muted-foreground">Sem compromisso - Cancele quando quiser</p>
        <div className="space-y-2">
          <button className="w-full btn-primary">Assinar Plano Anual</button>
          <button className="w-full btn-ghost" onClick={() => onSkip?.()}>Iniciar teste gratuito</button>
        </div>
        <div className="text-xs text-muted-foreground">Gatilhos de confiança: 14 dias de garantia, suporte 24/7</div>
      </div>
    </div>
  );
};
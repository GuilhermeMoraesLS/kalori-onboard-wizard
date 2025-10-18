import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
}

export const ContinueButton = ({ onClick, disabled = false, text = "Continuar" }: ContinueButtonProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`w-full max-w-md mx-auto flex items-center justify-center gap-2 h-12 text-lg font-semibold rounded-2xl transition-all duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        }`}
      >
        {text}
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

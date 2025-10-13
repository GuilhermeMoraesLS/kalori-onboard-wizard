import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  delay?: number;
}

export const OptionButton = ({ selected, onClick, children, icon, delay = 0 }: OptionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-5 rounded-2xl border-2 text-left font-medium text-lg transition-all duration-300 animate-slide-up hover:scale-[1.02] active:scale-[0.98]",
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-lg"
          : "bg-card text-foreground border-border hover:border-primary/50"
      )}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <span>{children}</span>
      </div>
    </button>
  );
};

import { ReactNode } from "react";

interface QuestionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const QuestionCard = ({ title, subtitle, children }: QuestionCardProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-slide-up">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

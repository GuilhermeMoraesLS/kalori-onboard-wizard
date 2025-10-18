import { ReactNode } from "react";
import logo from "@/assets/ChatGPT Image 13 de out. de 2025, 17_37_01.png";

interface QuestionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
}

export const QuestionCard = ({
  title,
  subtitle,
  children,
  imageSrc = logo,
  imageAlt,
  imageClassName = "",
}: QuestionCardProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      <div className="w-full max-w-md space-y-8 pb-28">
        {/* Imagem centralizada no topo */}
        <div className="flex justify-center">
          <img
            src={imageSrc}
            alt={imageAlt ?? title}
            className={`w-40 h-40 md:w-48 md:h-48 object-contain ${imageClassName}`}
          />
        </div>

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

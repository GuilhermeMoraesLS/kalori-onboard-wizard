import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/ChatGPT Image 13 de out. de 2025, 17_37_01.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="text-center space-y-8 max-w-2xl animate-fade-in">
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Kalorix"
            className="w-40 h-40 md:w-48 md:h-48 object-contain mx-auto"
          />
        </div>
        <div className="space-y-4">
          <p className="text-xl md:text-2xl text-muted-foreground">
            Sua jornada para uma vida mais saudável começa aqui
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 pt-8">
          <Button
            onClick={() => navigate("/onboarding")}
            size="lg"
            className="h-14 px-8 text-lg font-semibold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
          >
            Começar agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-muted-foreground">Leva apenas 2 minutos</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useState } from "react";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { QuestionCard } from "@/components/onboarding/QuestionCard";
import { OptionButton } from "@/components/onboarding/OptionButton";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { Target, TrendingDown, TrendingUp, Minus } from "lucide-react";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const totalSteps = 19;

  const handleAnswer = (key: string, value: any) => {
    setAnswers({ ...answers, [key]: value });
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuestionCard
            title="Qual é o seu objetivo?"
            subtitle="Isso nos ajuda a gerar um plano para a sua ingestão calórica."
          >
            <OptionButton
              selected={answers.goal === "lose"}
              onClick={() => handleAnswer("goal", "lose")}
              icon={<TrendingDown className="w-6 h-6" />}
              delay={0}
            >
              Perder peso
            </OptionButton>
            <OptionButton
              selected={answers.goal === "maintain"}
              onClick={() => handleAnswer("goal", "maintain")}
              icon={<Minus className="w-6 h-6" />}
              delay={1}
            >
              Manter
            </OptionButton>
            <OptionButton
              selected={answers.goal === "gain"}
              onClick={() => handleAnswer("goal", "gain")}
              icon={<TrendingUp className="w-6 h-6" />}
              delay={2}
            >
              Ganhar peso
            </OptionButton>
            <ContinueButton onClick={nextStep} disabled={!answers.goal} />
          </QuestionCard>
        );

      case 2:
        return (
          <QuestionCard
            title="Qual é o seu peso desejado?"
            subtitle="Deslize para ajustar seu objetivo de peso."
          >
            <div className="py-12">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-primary mb-2">
                  {answers.targetWeight || 70}
                  <span className="text-3xl text-muted-foreground ml-2">kg</span>
                </div>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={answers.targetWeight || 70}
                onChange={(e) => handleAnswer("targetWeight", parseInt(e.target.value))}
                className="w-full h-3 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>40 kg</span>
                <span>150 kg</span>
              </div>
            </div>
            <ContinueButton onClick={nextStep} disabled={!answers.targetWeight} />
          </QuestionCard>
        );

      case 3:
        return (
          <QuestionCard
            title="Você tem um grande potencial para alcançar seu objetivo."
            subtitle="Com base em dados Kalorix, o resultado acelera após 7 dias!"
          >
            <div className="bg-card rounded-2xl p-6 border-2 border-border">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>3 dias</span>
                  <span>7 dias</span>
                  <span>30 dias</span>
                </div>
                <div className="h-48 flex items-end justify-between gap-4">
                  <div className="w-full bg-primary/20 rounded-t-lg animate-slide-up" style={{ height: '30%', animationDelay: '0.1s' }} />
                  <div className="w-full bg-primary/40 rounded-t-lg animate-slide-up" style={{ height: '60%', animationDelay: '0.2s' }} />
                  <div className="w-full bg-primary rounded-t-lg animate-slide-up" style={{ height: '100%', animationDelay: '0.3s' }} />
                </div>
                <p className="text-center text-sm font-medium text-foreground">Sua transição de peso</p>
              </div>
            </div>
            <ContinueButton onClick={nextStep} text="Vamos lá!" />
          </QuestionCard>
        );

      case 4:
        return (
          <QuestionCard
            title="Com que rapidez você deseja alcançar seu objetivo?"
          >
            <div className="py-12">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">
                  {answers.speed === "slow" ? "🐢" : answers.speed === "moderate" ? "🐰" : "🐆"}
                </div>
                <p className="text-xl font-semibold text-foreground">
                  {answers.speed === "slow" ? "Devagar e sempre" : answers.speed === "moderate" ? "Moderado" : "Rápido"}
                </p>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={answers.speed === "slow" ? 1 : answers.speed === "moderate" ? 2 : 3}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  handleAnswer("speed", val === 1 ? "slow" : val === 2 ? "moderate" : "fast");
                }}
                className="w-full h-3 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
            <ContinueButton onClick={nextStep} text="Continuar" />
          </QuestionCard>
        );

      default:
        return (
          <QuestionCard title="Obrigado por usar Kalorix!">
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-bounce-in">🎉</div>
              <p className="text-xl text-muted-foreground">
                Seu questionário está sendo desenvolvido...
              </p>
            </div>
          </QuestionCard>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      {renderStep()}
    </div>
  );
};

export default Onboarding;

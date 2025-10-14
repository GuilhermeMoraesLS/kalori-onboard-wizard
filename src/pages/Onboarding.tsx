import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { QuestionCard } from "@/components/onboarding/QuestionCard";
import { OptionButton } from "@/components/onboarding/OptionButton";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { Target, TrendingDown, TrendingUp, Minus } from "lucide-react";

// novos componentes
import { DOBPicker } from "@/components/onboarding/DOBPicker";
import { MultiSelectButtons } from "@/components/onboarding/MultiSelectButtons";
import { LoadingScreen } from "@/components/onboarding/LoadingScreen";
import { PlanCards } from "@/components/onboarding/PlanCards";
import { Paywall } from "@/components/onboarding/Paywall";

const Onboarding = () => {
  const totalSteps = 19;
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const paramStep = params.step ? parseInt(params.step, 10) : undefined;

  const [currentStep, setCurrentStep] = useState<number>(() =>
    paramStep && !isNaN(paramStep) ? Math.max(1, Math.min(paramStep, totalSteps)) : 1
  );

  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswer = (key: string, value: any) => {
    setAnswers({ ...answers, [key]: value });
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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

      // Tela 5: Gênero
      case 5:
        return (
          <QuestionCard title="Escolha seu gênero." subtitle="Isso será usado para calibrar seu plano personalizado.">
            <div className="space-y-4">
              <OptionButton selected={answers.gender === "male"} onClick={() => handleAnswer("gender", "male")}>Masculino</OptionButton>
              <OptionButton selected={answers.gender === "female"} onClick={() => handleAnswer("gender", "female")}>Feminino</OptionButton>
              <OptionButton selected={answers.gender === "other"} onClick={() => handleAnswer("gender", "other")}>Outro</OptionButton>
            </div>
            <ContinueButton onClick={nextStep} disabled={!answers.gender} />
          </QuestionCard>
        );

      // Tela 6: Data de Nascimento
      case 6:
        return (
          <QuestionCard title="Quando você nasceu?" subtitle="Isso será usado para calibrar seu plano personalizado.">
            <div className="py-6">
              <DOBPicker
                value={answers.dob}
                onChange={(dob) => handleAnswer("dob", dob)}
              />
            </div>
            <ContinueButton onClick={nextStep} disabled={!answers.dob?.year || !answers.dob?.month || !answers.dob?.day} />
          </QuestionCard>
        );

      // Tela 7: Hábitos de Treino
      case 7:
        return (
          <QuestionCard title="Quantos treinos você faz por semana?">
            <div className="space-y-4">
              <OptionButton selected={answers.workouts === "0-2"} onClick={() => handleAnswer("workouts", "0-2")}>0-2</OptionButton>
              <OptionButton selected={answers.workouts === "3-5"} onClick={() => handleAnswer("workouts", "3-5")}>3-5</OptionButton>
              <OptionButton selected={answers.workouts === "6+"} onClick={() => handleAnswer("workouts", "6+")}>6+</OptionButton>
            </div>
            <ContinueButton onClick={nextStep} disabled={!answers.workouts} />
          </QuestionCard>
        );

      // Tela 8: Desafios Pessoais (multi-select)
      case 8:
        return (
          <QuestionCard title="O que está impedindo você de alcançar seus objetivos?">
            <MultiSelectButtons
              options={[

                "Falta de consistência",
                "Hábitos alimentares não saudáveis",
                "Falta de suporte",
                "Agenda cheia",
                "Falta de inspiração para refeições",
              ]}
              value={answers.challenges || []}
              onChange={(v) => handleAnswer("challenges", v)}
            />
            <ContinueButton onClick={nextStep} disabled={!answers.challenges || answers.challenges.length === 0} />
          </QuestionCard>
        );

      // Tela 9: Motivações Secundárias (multi-select)
      case 9:
        return (
          <QuestionCard title="O que você gostaria de realizar?">
            <MultiSelectButtons
              options={[
                "Comer e viver de forma mais saudável",
                "Aumentar minha energia e humor",
                "Me manter motivado e consistente",
                "Me sentir melhor com meu corpo",
              ]}
              value={answers.motivations || []}
              onChange={(v) => handleAnswer("motivations", v)}
            />
            <ContinueButton onClick={nextStep} disabled={!answers.motivations || answers.motivations.length === 0} />
          </QuestionCard>
        );

      // Tela 10: Dieta Específica
      case 10:
        return (
          <QuestionCard title="Você segue uma dieta específica?">
            <div className="space-y-4">
              {["Clássico", "Pescetariano", "Vegetariano", "Vegano"].map((d) => (
                <OptionButton key={d} selected={answers.diet === d} onClick={() => handleAnswer("diet", d)}>
                  {d}
                </OptionButton>
              ))}
            </div>
            <ContinueButton onClick={nextStep} />
          </QuestionCard>
        );

      // Tela 11: Experiência Prévia
      case 11:
        return (
          <QuestionCard title="Você já experimentou outros aplicativos de contagem de calorias?">
            <div className="space-y-4">
              <OptionButton selected={answers.experience === "no"} onClick={() => handleAnswer("experience", "no")}>Não</OptionButton>
              <OptionButton selected={answers.experience === "yes"} onClick={() => handleAnswer("experience", "yes")}>Sim</OptionButton>
            </div>
            <ContinueButton onClick={nextStep} />
          </QuestionCard>
        );

      // Tela 12: Canal de Aquisição
      case 12:
        return (
          <QuestionCard title="Onde você ouviu falar de nós?">
            <div className="space-y-4">
              {["Google","Instagram","App Store","X","Youtube","Facebook","Amigo ou família"].map((c) => (
                <OptionButton key={c} selected={answers.channel === c} onClick={() => handleAnswer("channel", c)}>{c}</OptionButton>
              ))}
            </div>
            <ContinueButton onClick={nextStep} />
          </QuestionCard>
        );

      // Tela 13: Integração Saúde (Opcional)
      case 13:
        return (
          <QuestionCard title="Conecte-se ao Apple Saúde." subtitle="Sincronize suas atividades diárias para ter os dados mais completos.">
            <div className="py-12 flex flex-col gap-3 items-center">
              <button className="w-full max-w-md btn-primary" onClick={() => { handleAnswer("health_sync", true); nextStep(); }}>
                Continuar
              </button>
              <button className="w-full max-w-md btn-ghost" onClick={() => { handleAnswer("health_sync", false); nextStep(); }}>
                Agora não
              </button>
            </div>
          </QuestionCard>
        );

      // Tela 14: Confiança e Privacidade
      case 14:
        return (
          <QuestionCard title="Obrigado por confiar em nós." subtitle="Agora vamos personalizar o Kalorix para você...">
            <div className="bg-card border p-4 rounded-md text-sm text-muted-foreground">
              <strong>Privacidade:</strong> Seus dados são criptografados e usados apenas para personalizar seu plano. Você pode remover o acesso a qualquer momento.
            </div>
            <ContinueButton onClick={nextStep} />
          </QuestionCard>
        );

      // Tela 15: Tela de Carregamento animada
      case 15:
        return (
          <LoadingScreen
            onComplete={() => {
              // deixa a sensação de carregamento antes de mostrar plano
              setTimeout(() => nextStep(), 800);
            }}
          />
        );

      // Tela 16: Seu Plano Personalizado
      case 16:
        return (
          <QuestionCard title="Parabéns, seu plano personalizado está pronto!" subtitle={`Ex: Aumente 20 kg peso até março 1, 2026`}>
            <PlanCards data={{
              calories: answers.calories || 2200,
              carbs: answers.carbs || 300,
              protein: answers.protein || 120,
              fats: answers.fats || 70,
            }} />
            <ContinueButton onClick={nextStep} text="Vamos começar!" />
          </QuestionCard>
        );

      // Tela 17: Apresentação de Feature (Opcional)
      case 17:
        return (
          <QuestionCard title="Sabia que pode transferir calorias extras para o próximo dia?">
            <div className="py-8 text-center">
              <div className="mb-6">[Animação curta mostrando transferência]</div>
              <ContinueButton onClick={nextStep} text="Entendido!" />
            </div>
          </QuestionCard>
        );

      // Tela 18: Oferta Exclusiva (Paywall)
      case 18:
        return (
          <Paywall onSkip={() => nextStep()} />
        );

      // Tela 19: Conclusão e Início
      case 19:
        return (
          <QuestionCard title="Tudo pronto!" subtitle="Sua jornada para uma vida mais saudável começa agora.">
            <div className="py-8 text-center">
              <button className="w-full max-w-md btn-primary" onClick={() => {
                // finalizar e redirecionar para a aplicação principal
                window.location.href = "/";
              }}>
                Começar a usar
              </button>
            </div>
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

  // Sync currentStep -> URL
  useEffect(() => {
    try {
      // don't auto-redirect when we're at the onboarding root (intro screen)
      const base = "/page";
      const target = `${base}/${currentStep}`;
      if (!location.pathname.endsWith(`/${currentStep}`)) {
        navigate(target, { replace: true });
      }
    } catch (e) {
      // ignore navigation errors in dev
    }
  }, [currentStep, location.pathname, navigate]);

  // Sync URL -> currentStep when param changes (e.g. user edits URL)
  useEffect(() => {
    if (params.step) {
      const s = parseInt(params.step, 10);
      if (!isNaN(s) && s !== currentStep) {
        setCurrentStep(Math.max(1, Math.min(s, totalSteps)));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.step]);

  return (
    <div className="min-h-screen bg-background">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      {renderStep()}
    </div>
  );
};

export default Onboarding;

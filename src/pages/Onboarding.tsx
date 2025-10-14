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
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const totalSteps = 15;
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



      // Tela 14: Confiança e Privacidade
      case 13:
        return (
          <QuestionCard title="Obrigado por confiar em nós." subtitle="Agora vamos personalizar o Kalorix para você...">
            <div className="bg-card border p-4 rounded-md text-sm text-muted-foreground">
              <strong>Privacidade:</strong> Seus dados são criptografados e usados apenas para personalizar seu plano. Você pode remover o acesso a qualquer momento.
            </div>
            <ContinueButton onClick={nextStep} />
          </QuestionCard>
        );

      // Tela 15: Tela de Carregamento animada
      case 14:
        return (
          <LoadingScreen
            onComplete={() => {
              // deixa a sensação de carregamento antes de mostrar plano
              setTimeout(() => nextStep(), 800);
            }}
          />
        );

      // Tela 16: Seu Plano Personalizado — direciona para WhatsApp
      case 15:
        
        const waLink = `https://wa.me/5521982482829?text=Olá! Quero experimentar a versão gratuita do Kalorix`;

        return (
          <QuestionCard
            title="Quase lá — seu plano está quase pronto!"
            subtitle="Toque no botão abaixo para acessar o Kalorix. É rápido, seguro e vai direto para você."
          >
            <div className="flex flex-col items-center gap-6 mt-6">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-2xl">
                <div className="w-28 h-28 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-4xl">📩</span>
                </div>
              </div>

              <p className="text-center text-lg text-foreground max-w-md leading-relaxed">
                Montamos um plano pensado especialmente em você — com metas, refeições e dicas práticas.
                Para ter acesso ao kalorix grátis, clique em "Ir para o WhatsApp". Em seguida, você vai pode começar a sua jornada rumo a reprogramação nutricional.
              </p>

              <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                <Button asChild className="w-full text-center py-3 rounded-md flex items-center justify-center gap-2">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      // tracking or small client-side action could go here
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.52 3.48A11.76 11.76 0 0 0 12 0C5.37 0 .02 5.35.02 12c0 2.12.56 4.18 1.63 6.02L0 24l6.2-1.61A11.94 11.94 0 0 0 12 24c6.63 0 12-5.35 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.5c-1.7 0-3.36-.44-4.8-1.27l-.34-.19-3.68.95.98-3.58-.22-.37A9.5 9.5 0 1 1 21.5 12 9.49 9.49 0 0 1 12 21.5z" />
                    </svg>
                    Ir para o WhatsApp
                  </a>
                </Button>

              </div>

              <p className="text-xs text-muted-foreground max-w-md text-center mt-2">
                Ao clicar, você será redirecionado ao WhatsApp com uma mensagem pré-preenchida. Seus dados não serão compartilhados com terceiros sem sua permissão.
              </p>
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

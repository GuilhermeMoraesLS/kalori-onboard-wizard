import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { QuestionCard } from "@/components/onboarding/QuestionCard";
import { OptionButton } from "@/components/onboarding/OptionButton";
import { ContinueButton } from "@/components/onboarding/ContinueButton";
import { Target, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Slider } from "@/components/ui/slider";

// novos componentes
import { DOBPicker } from "@/components/onboarding/DOBPicker";
import { MultiSelectButtons } from "@/components/onboarding/MultiSelectButtons";
import { LoadingScreen } from "@/components/onboarding/LoadingScreen";
import { PlanCards } from "@/components/onboarding/PlanCards";
import { Paywall } from "@/components/onboarding/Paywall";
import { HeightPicker } from "@/components/onboarding/HeightPicker";
import { WeightPicker } from "@/components/onboarding/WeightPicker";
import { PhoneInput } from "@/components/onboarding/PhoneInput";
import { DietResults } from "@/components/onboarding/DietResults";
import { DebugPanel } from "@/components/onboarding/DebugPanel";
import { Button } from "@/components/ui/button";
import { calculateDiet } from "@/lib/dietCalculator";
import { 
  loadOnboardingData, 
  saveOnboardingData, 
  updateOnboardingData 
} from "@/lib/storage";
import { saveClientToSupabase } from "@/lib/supabaseService";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const totalSteps = 19; // Aumentado para incluir novos passos
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const paramStep = params.step ? parseInt(params.step, 10) : undefined;

  const [currentStep, setCurrentStep] = useState<number>(() =>
    paramStep && !isNaN(paramStep) ? Math.max(1, Math.min(paramStep, totalSteps)) : 1
  );

  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    // Carregar dados do sessionStorage ao iniciar
    return loadOnboardingData();
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleAnswer = (key: string, value: any) => {
    const updatedAnswers = updateOnboardingData(key, value);
    setAnswers(updatedAnswers);
  };

  // Função para salvar no Supabase
  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    try {
      const success = await saveClientToSupabase(answers);
      
      if (success) {
        toast({
          title: "Dados salvos com sucesso! ✅",
          description: "Suas informações foram registradas no sistema.",
        });
        return true;
      } else {
        toast({
          title: "Erro ao salvar dados",
          description: "Não foi possível salvar suas informações. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      // Erro capturado (sem expor no console por segurança)
      toast({
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Função para atualizar os resultados da dieta após edição
  const handleDietResultsChange = (newValues: { caloriasAlvo?: number; proteinas?: number; carboidratos?: number; gorduras?: number }) => {
    const updatedDietResults = {
      ...answers.dietResults,
      ...newValues,
      // Recalcular valores dependentes
      kcalProteinas: (newValues.proteinas || answers.dietResults?.proteinas || 0) * 4,
      kcalCarboidratos: (newValues.carboidratos || answers.dietResults?.carboidratos || 0) * 4,
      kcalGorduras: (newValues.gorduras || answers.dietResults?.gorduras || 0) * 9,
    };
    
    handleAnswer("dietResults", updatedDietResults);
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
              <Slider
                min={40}
                max={150}
                step={1}
                value={[answers.targetWeight || 70]}
                onValueChange={(valueArray) => handleAnswer("targetWeight", valueArray[0])}
                className="w-full"
              />
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
              <Slider
                min={1}
                max={3}
                step={1}
                value={[answers.speed === "slow" ? 1 : answers.speed === "moderate" ? 2 : 3]}
                onValueChange={(valueArray) => {
                  const val = valueArray[0];
                  handleAnswer("speed", val === 1 ? "slow" : val === 2 ? "moderate" : "fast");
                }}
                className="w-full"
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

      // Tela 7: Altura
      case 7:
        return (
          <QuestionCard 
            title="Qual é a sua altura?" 
            subtitle="Isso nos ajuda a calcular seu plano nutricional personalizado."
          >
            <HeightPicker
              value={answers.height}
              onChange={(height) => handleAnswer("height", height)}
            />
            <ContinueButton onClick={nextStep} disabled={!answers.height} />
          </QuestionCard>
        );

      // Tela 8: Peso Atual
      case 8:
        return (
          <QuestionCard 
            title="Qual é o seu peso atual?" 
            subtitle="Precisamos dessa informação para calcular suas necessidades calóricas."
          >
            <WeightPicker
              value={answers.weight}
              onChange={(weight) => handleAnswer("weight", weight)}
            />
            <ContinueButton onClick={nextStep} disabled={!answers.weight} />
          </QuestionCard>
        );

      // Tela 9: Hábitos de Treino
      case 9:
        return (
          <QuestionCard 
            title="Quantos treinos você faz por semana?" 
            subtitle="Isso nos ajuda a calcular seu gasto calórico diário."
          >
            <div className="space-y-4">
              <OptionButton 
                selected={answers.workouts === "0-2"} 
                onClick={() => handleAnswer("workouts", "0-2")}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">0-2 treinos</span>
                  <span className="text-sm text-muted-foreground">Sedentário ou levemente ativo</span>
                </div>
              </OptionButton>
              <OptionButton 
                selected={answers.workouts === "3-5"} 
                onClick={() => handleAnswer("workouts", "3-5")}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">3-5 treinos</span>
                  <span className="text-sm text-muted-foreground">Moderadamente ativo</span>
                </div>
              </OptionButton>
              <OptionButton 
                selected={answers.workouts === "6+"} 
                onClick={() => handleAnswer("workouts", "6+")}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">6+ treinos</span>
                  <span className="text-sm text-muted-foreground">Muito ativo</span>
                </div>
              </OptionButton>
            </div>
            <ContinueButton onClick={nextStep} disabled={!answers.workouts} />
          </QuestionCard>
        );

      // Tela 10: Desafios Pessoais (multi-select)
      case 10:
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

      // Tela 11: Motivações Secundárias (multi-select)
      case 11:
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

      // Tela 12: Dieta Específica
      case 12:
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

      // Tela 13: Experiência Prévia
      case 13:
        return (
          <QuestionCard title="Você já experimentou outros aplicativos de contagem de calorias?">
            <div className="space-y-4">
              <OptionButton selected={answers.experience === "no"} onClick={() => handleAnswer("experience", "no")}>Não</OptionButton>
              <OptionButton selected={answers.experience === "yes"} onClick={() => handleAnswer("experience", "yes")}>Sim</OptionButton>
            </div>
            <ContinueButton onClick={nextStep} />
          </QuestionCard>
        );

      // Tela 14: Canal de Aquisição
      case 14:
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

      // Tela 15: Confiança e Privacidade
      case 15:
        return (
          <QuestionCard title="Obrigado por confiar em nós." subtitle="Agora vamos personalizar o Kalorix para você...">
            <div className="bg-card border p-4 rounded-md text-sm text-muted-foreground">
              <strong>Privacidade:</strong> Seus dados são criptografados e usados apenas para personalizar seu plano. Você pode remover o acesso a qualquer momento.
            </div>
            <ContinueButton onClick={nextStep} />
          </QuestionCard>
        );

      // Tela 16: Tela de Carregamento animada
      case 16:
        return (
          <LoadingScreen
            onComplete={() => {
              // Calcula a dieta quando o carregamento terminar
              if (answers.weight && answers.height && answers.dob && answers.gender && answers.goal && answers.workouts) {
                const currentYear = new Date().getFullYear();
                const idade = currentYear - answers.dob.year;
                
                // Mapear workouts para nível de atividade (1-5)
                const nivelAtividadeMap: Record<string, number> = {
                  "0-2": 2,
                  "3-5": 3,
                  "6+": 4,
                };
                const nivelAtividade = nivelAtividadeMap[answers.workouts] || 2;
                
                const dietResults = calculateDiet({
                  peso: answers.weight,
                  altura: answers.height,
                  idade,
                  sexo: answers.gender,
                  objetivo: answers.goal,
                  nivelAtividade,
                });
                
                handleAnswer("dietResults", dietResults);
              }
              
              // Avança para a tela de resultados (não pula automaticamente)
              nextStep();
            }}
          />
        );

      // Tela 17: Resultados da Dieta
      case 17:
        return (
          <QuestionCard title="">
            {answers.dietResults ? (
              <DietResults 
                results={answers.dietResults} 
                onChange={handleDietResultsChange}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Calculando seu plano...</p>
              </div>
            )}
            <ContinueButton onClick={nextStep} text="Continuar para finalizar" />
          </QuestionCard>
        );

      // Tela 18: Captura de Nome e Telefone
      case 18:
        const isPhoneValid = answers.phone?.name &&
          answers.phone.name.length >= 3 &&
          answers.phone?.countryCode && 
          answers.phone?.number && 
          (answers.phone.countryCode === "+55" 
            ? answers.phone.number.length === 13 && answers.phone.number.startsWith("55")
            : answers.phone.number.length >= 8 && answers.phone.number.length <= 15
          );

        return (
          <QuestionCard 
            title="Quase lá! Agora precisamos dos seus dados de contato" 
            subtitle="Usaremos para enviar seu plano personalizado e atualizações importantes."
          >
            <div className="py-6">
              <PhoneInput
                value={answers.phone}
                onChange={(phone) => handleAnswer("phone", phone)}
              />
            </div>
            <ContinueButton onClick={nextStep} disabled={!isPhoneValid} />
          </QuestionCard>
        );

      // Tela 19: Seu Plano Personalizado — direciona para WhatsApp
      case 19:
        // O número já vem completo (ex: "5531999614643"), não precisa concatenar countryCode
        const phoneNumber = answers.phone?.number || "5521982482829";
        const waLink = `https://wa.me/5521982482829?text=${encodeURIComponent("Olá! Acabei de completar meu perfil no Kalorix e quero começar minha jornada de reprogramação nutricional! 🎯")}`;

        return (
          <QuestionCard
            title="Parabéns! Seu plano está pronto! 🎉"
            subtitle="Agora vamos conectar você ao WhatsApp para começar sua jornada."
          >
            <div className="flex flex-col items-center gap-6 mt-6">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center shadow-2xl animate-bounce-in">
                <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-5xl">✅</span>
                </div>
              </div>

              <div className="bg-card border-2 border-primary/20 rounded-xl p-6 space-y-3">
                <h3 className="font-semibold text-lg">Seu plano inclui:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Meta diária: <strong className="text-foreground">{answers.dietResults?.caloriasAlvo || "---"} kcal</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Proteínas: <strong className="text-foreground">{answers.dietResults?.proteinas || "---"}g</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Carboidratos: <strong className="text-foreground">{answers.dietResults?.carboidratos || "---"}g</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Gorduras: <strong className="text-foreground">{answers.dietResults?.gorduras || "---"}g</strong></span>
                  </li>
                </ul>
              </div>

              <p className="text-center text-lg text-foreground max-w-md leading-relaxed">
                Montamos um plano pensado especialmente em você — com metas, refeições e dicas práticas.
                Clique no botão abaixo para começar sua jornada rumo à reprogramação nutricional! 💪
              </p>

              <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={async () => {
                    // Marcar como completo
                    handleAnswer("completed", true);
                    
                    // Salvar no Supabase
                    const saved = await handleSaveToSupabase();
                    
                    // Redirecionar para WhatsApp após salvar (ou mesmo se falhar)
                    if (saved || true) { // Sempre redireciona, mesmo se falhar ao salvar
                      window.open(waLink, '_blank');
                    }
                  }}
                  disabled={isSaving}
                  className="w-full text-center py-6 text-lg rounded-md flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.52 3.48A11.76 11.76 0 0 0 12 0C5.37 0 .02 5.35.02 12c0 2.12.56 4.18 1.63 6.02L0 24l6.2-1.61A11.94 11.94 0 0 0 12 24c6.63 0 12-5.35 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.5c-1.7 0-3.36-.44-4.8-1.27l-.34-.19-3.68.95.98-3.58-.22-.37A9.5 9.5 0 1 1 21.5 12 9.49 9.49 0 0 1 12 21.5z" />
                      </svg>
                      Começar no WhatsApp
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground max-w-md text-center mt-2">
                Ao clicar, você será redirecionado ao WhatsApp. Seus dados são criptografados e não serão compartilhados com terceiros.
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
      <DebugPanel />
    </div>
  );
};

export default Onboarding;

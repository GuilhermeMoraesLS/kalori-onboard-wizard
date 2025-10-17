import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DietResultsProps {
  results: {
    peso: number;
    altura: number;
    idade: number;
    sexo: string;
    objetivo: string;
    nivelAtividade: number;
    tmb: number;
    neat: number;
    metaBase: number;
    fatorAtividadeAplicado: number;
    caloriasAlvo: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
    kcalProteinas: number;
    kcalGorduras: number;
    kcalCarboidratos: number;
  };
  onChange?: (newValues: { caloriasAlvo?: number; proteinas?: number; carboidratos?: number; gorduras?: number }) => void;
}

export const DietResults = ({ results, onChange }: DietResultsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    caloriasAlvo: results.caloriasAlvo,
    proteinas: results.proteinas,
    carboidratos: results.carboidratos,
    gorduras: results.gorduras,
  });

  // Atualizar editedValues quando results mudar (exceto durante edição)
  useEffect(() => {
    if (!isEditing) {
      setEditedValues({
        caloriasAlvo: results.caloriasAlvo,
        proteinas: results.proteinas,
        carboidratos: results.carboidratos,
        gorduras: results.gorduras,
      });
    }
  }, [results, isEditing]);

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditedValues(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSaveChanges = () => {
    if (onChange) {
      onChange(editedValues);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValues({
      caloriasAlvo: results.caloriasAlvo,
      proteinas: results.proteinas,
      carboidratos: results.carboidratos,
      gorduras: results.gorduras,
    });
    setIsEditing(false);
  };

  // Usar valores exibidos (results ou editedValues baseado no modo)
  const displayValues = isEditing ? editedValues : results;
  
  const {
    caloriasAlvo,
    proteinas,
    carboidratos,
    gorduras,
    tmb,
    neat,
    objetivo,
  } = results;

  // Calcular kcal baseado nos valores exibidos
  const kcalProteinas = displayValues.proteinas * 4;
  const kcalCarboidratos = displayValues.carboidratos * 4;
  const kcalGorduras = displayValues.gorduras * 9;
  const totalKcal = kcalProteinas + kcalGorduras + kcalCarboidratos;

  const proteinasPercent = totalKcal > 0 ? (kcalProteinas / totalKcal) * 100 : 0;
  const carboidratosPercent = totalKcal > 0 ? (kcalCarboidratos / totalKcal) * 100 : 0;
  const gordurasPercent = totalKcal > 0 ? (kcalGorduras / totalKcal) * 100 : 0;

  const objetivoTexto = objetivo === "emagrecer" 
    ? "Perder Peso" 
    : objetivo === "ganhar" 
    ? "Ganhar Peso" 
    : "Manter Peso";

  return (
    <div className="space-y-6 py-6">
      {/* Header com objetivo */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
          <span className="text-2xl">
            {objetivo === "emagrecer" ? "🎯" : objetivo === "ganhar" ? "💪" : "⚖️"}
          </span>
          <span className="font-semibold text-primary">{objetivoTexto}</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Seu Plano Personalizado
        </h2>
        <p className="text-muted-foreground">
          Baseado em suas informações e objetivos. 
          Caso você já tenha uma dieta basta clicar em <strong>"Editar Dieta"</strong> para ajustar os valores conforme sua necessidade.
        </p>
      </div>

      {/* Calorias Alvo - Destaque */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 p-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
            Meta Diária de Calorias
          </p>
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="caloriasAlvo" className="text-base font-medium">Calorias (kcal)</Label>
              <Input
                id="caloriasAlvo"
                type="number"
                value={editedValues.caloriasAlvo}
                onChange={(e) => handleInputChange('caloriasAlvo', e.target.value)}
                className="text-center text-2xl font-bold h-16"
                min="800"
                max="5000"
              />
            </div>
          ) : (
            <div className="text-6xl font-bold text-primary mb-2">
              {displayValues.caloriasAlvo}
              <span className="text-2xl ml-2">kcal</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>TMB: {tmb} kcal</span>
            <span>•</span>
            <span>NEAT: {neat} kcal</span>
          </div>
        </div>
      </Card>

      {/* Macros */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">
            Distribuição de Macronutrientes
          </h3>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Editar Dieta
            </Button>
          )}
        </div>

        {/* Barra de progresso visual (apenas no modo visualização) */}
        {!isEditing && (
          <div className="relative h-8 rounded-full overflow-hidden flex mb-6">
            <div 
              className="bg-blue-500 flex items-center justify-center text-white text-xs font-semibold transition-all"
              style={{ width: `${proteinasPercent}%` }}
            >
              {proteinasPercent > 15 && `${Math.round(proteinasPercent)}%`}
            </div>
            <div 
              className="bg-amber-500 flex items-center justify-center text-white text-xs font-semibold transition-all"
              style={{ width: `${carboidratosPercent}%` }}
            >
              {carboidratosPercent > 15 && `${Math.round(carboidratosPercent)}%`}
            </div>
            <div 
              className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold transition-all"
              style={{ width: `${gordurasPercent}%` }}
            >
              {gordurasPercent > 15 && `${Math.round(gordurasPercent)}%`}
            </div>
          </div>
        )}

        {/* Detalhes dos Macros */}
        <div className="space-y-4">
          {/* Proteínas */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                P
              </div>
              <div>
                <p className="font-semibold text-foreground">Proteínas</p>
                <p className="text-sm text-muted-foreground">{Math.round(proteinasPercent)}% das calorias</p>
              </div>
            </div>
            <div className="text-right">
              {isEditing ? (
                <div className="space-y-1">
                  <Label htmlFor="proteinas" className="text-xs">Gramas</Label>
                  <Input
                    id="proteinas"
                    type="number"
                    value={editedValues.proteinas}
                    onChange={(e) => handleInputChange('proteinas', e.target.value)}
                    className="w-20 text-right"
                    min="50"
                    max="500"
                  />
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-foreground">{displayValues.proteinas}g</p>
                  <p className="text-xs text-muted-foreground">{kcalProteinas} kcal</p>
                </>
              )}
            </div>
          </div>

          {/* Carboidratos */}
          <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold">
                C
              </div>
              <div>
                <p className="font-semibold text-foreground">Carboidratos</p>
                <p className="text-sm text-muted-foreground">{Math.round(carboidratosPercent)}% das calorias</p>
              </div>
            </div>
            <div className="text-right">
              {isEditing ? (
                <div className="space-y-1">
                  <Label htmlFor="carboidratos" className="text-xs">Gramas</Label>
                  <Input
                    id="carboidratos"
                    type="number"
                    value={editedValues.carboidratos}
                    onChange={(e) => handleInputChange('carboidratos', e.target.value)}
                    className="w-20 text-right"
                    min="50"
                    max="800"
                  />
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-foreground">{displayValues.carboidratos}g</p>
                  <p className="text-xs text-muted-foreground">{kcalCarboidratos} kcal</p>
                </>
              )}
            </div>
          </div>

          {/* Gorduras */}
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
                G
              </div>
              <div>
                <p className="font-semibold text-foreground">Gorduras</p>
                <p className="text-sm text-muted-foreground">{Math.round(gordurasPercent)}% das calorias</p>
              </div>
            </div>
            <div className="text-right">
              {isEditing ? (
                <div className="space-y-1">
                  <Label htmlFor="gorduras" className="text-xs">Gramas</Label>
                  <Input
                    id="gorduras"
                    type="number"
                    value={editedValues.gorduras}
                    onChange={(e) => handleInputChange('gorduras', e.target.value)}
                    className="w-20 text-right"
                    min="30"
                    max="300"
                  />
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-foreground">{displayValues.gorduras}g</p>
                  <p className="text-xs text-muted-foreground">{kcalGorduras} kcal</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Botões de edição (apenas no modo edição) */}
        {isEditing && (
          <div className="flex gap-3 mt-6">
            <Button 
              onClick={handleSaveChanges}
              className="flex-1"
            >
              Salvar Alterações
            </Button>
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        )}
      </Card>

      {/* Dicas baseadas no objetivo */}
      <Card className="p-6 bg-card border">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>Dicas para {objetivoTexto}</span>
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {objetivo === "emagrecer" && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Priorize alimentos ricos em proteínas para manter a saciedade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Beba bastante água durante o dia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Evite pular refeições para não desacelerar o metabolismo</span>
              </li>
            </>
          )}
          {objetivo === "ganhar" && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Faça refeições regulares a cada 3-4 horas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Inclua carboidratos complexos antes e depois do treino</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Garanta uma boa ingestão de proteínas em todas as refeições</span>
              </li>
            </>
          )}
          {objetivo === "manter" && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Mantenha uma rotina alimentar consistente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Balance bem seus macronutrientes em cada refeição</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Ajuste as calorias conforme sua atividade física</span>
              </li>
            </>
          )}
        </ul>
      </Card>
    </div>
  );
};

interface DietCalculationInput {
  peso: number;
  altura: number;
  idade: number;
  sexo: string;
  objetivo: string; // "lose", "maintain", "gain"
  nivelAtividade: number; // 1-5
}

interface DietCalculationResult {
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
}

export const calculateDiet = (input: DietCalculationInput): DietCalculationResult => {
  const { peso, altura, idade, sexo, objetivo: objetivoInput, nivelAtividade } = input;

  // Mapear objetivo do formato do formulário para o formato do algoritmo
  const objetivoMap: Record<string, string> = {
    lose: "emagrecer",
    maintain: "manter",
    gain: "ganhar",
  };
  const objetivo = objetivoMap[objetivoInput] || "manter";

  // Mapear sexo
  const sexoNormalizado = sexo === "male" ? "m" : sexo === "female" ? "f" : "m";

  // Fatores de atividade
  const fatoresAtividade: Record<number, number> = {
    1: 1.2,    // Sedentário
    2: 1.375,  // Levemente ativo
    3: 1.55,   // Moderadamente ativo
    4: 1.725,  // Muito ativo
    5: 1.9,    // Extremamente ativo
  };

  // Cálculo da TMB (Mifflin-St Jeor)
  let tmb = 0;
  if (sexoNormalizado === "m") {
    tmb = 10 * peso + 6.25 * altura - 5 * idade + 5;
  } else {
    tmb = 10 * peso + 6.25 * altura - 5 * idade - 161;
  }

  // NEAT fixo (valor que representa gasto mínimo autônomo)
  const fatorAtividadeAplicado = fatoresAtividade[nivelAtividade] || 1.2;
  const neat = 350;

  // Meta base: TMB + 350 (valor base de sobrevivência)
  const metaBase = Math.round(tmb + 350);

  // Meta alvo ajustada pelo objetivo:
  // - ganhar: metaBase + 400
  // - emagrecer: metaBase - 400
  // - manter: metaBase
  let caloriasAlvo = metaBase;
  if (objetivo === "emagrecer") {
    caloriasAlvo = metaBase - 400;
  } else if (objetivo === "ganhar") {
    caloriasAlvo = metaBase + 400;
  }
  caloriasAlvo = Math.round(caloriasAlvo);

  // Cálculo de macros (mantendo mesma lógica de antes)
  let proteinaPorKg = 2.0;
  let gorduraPorKg = 0.8;

  if (objetivo === "emagrecer") {
    proteinaPorKg = 2.2;
    gorduraPorKg = 0.7;
  } else if (objetivo === "ganhar") {
    proteinaPorKg = 2.0;
    gorduraPorKg = 1.0;
  }

  const proteinas = Math.round(proteinaPorKg * peso);
  const kcalProteinas = proteinas * 4;

  const gorduras = Math.round(gorduraPorKg * peso);
  const kcalGorduras = gorduras * 9;

  const kcalRestantes = caloriasAlvo - (kcalProteinas + kcalGorduras);
  const carboidratos = Math.max(0, Math.round(kcalRestantes / 4));
  const kcalCarboidratos = carboidratos * 4;

  return {
    peso,
    altura,
    idade,
    sexo: sexoNormalizado,
    objetivo,
    nivelAtividade,
    tmb: Math.round(tmb),
    neat: Math.round(neat),
    metaBase,
    fatorAtividadeAplicado,
    caloriasAlvo,
    proteinas,
    carboidratos,
    gorduras,
    kcalProteinas,
    kcalGorduras,
    kcalCarboidratos,
  };
};

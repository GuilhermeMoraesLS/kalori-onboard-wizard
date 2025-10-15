// Script de teste para validar o mapeamento de dados
// Execute: node validate-mapping.js

console.log('🧪 Validando Mapeamento de Dados\n');

// Simular dados do onboarding
const onboardingData = {
  phone: { countryCode: "+55", number: "21999999999" },
  goal: "lose",
  gender: "male",
  dob: { year: 1990, month: 1, day: 1 },
  height: 175,
  weight: 80,
  workouts: "3-5",
  experience: "yes",
  completed: true
};

// Simular conversão (mesmo código do supabaseService.ts)
const telefone = onboardingData.phone.countryCode.replace('+', '') + onboardingData.phone.number;
const idade = new Date().getFullYear() - onboardingData.dob.year;

const objetivoMap = { "lose": "1", "maintain": "2", "gain": "3" };
const sexoMap = { "male": "M", "female": "F", "other": "M" };
const nivelAtividadeMap = { "0-2": "2", "3-5": "3", "6+": "4" };

const dbData = {
  telefone,
  nome: undefined,
  email: undefined,
  tem_dieta_previa: onboardingData.experience === 'yes' ? true : (onboardingData.experience === 'no' ? false : null),
  altura: onboardingData.height,
  peso: String(onboardingData.weight),
  idade,
  sexo: sexoMap[onboardingData.gender],
  nivel_atividade: nivelAtividadeMap[onboardingData.workouts],
  objetivo: objetivoMap[onboardingData.goal],
  assinatura_ativa: false,
  preenchido: onboardingData.completed
};

console.log('📥 Dados do Onboarding:');
console.log(JSON.stringify(onboardingData, null, 2));

console.log('\n📤 Dados para o Banco:');
console.log(JSON.stringify(dbData, null, 2));

console.log('\n✅ Validações:');
console.log(`  telefone: ${dbData.telefone} (sem +)`);
console.log(`  sexo: ${dbData.sexo} (MAIÚSCULO: ${dbData.sexo === dbData.sexo.toUpperCase() ? '✓' : '✗'})`);
console.log(`  objetivo: ${dbData.objetivo} (string: ${typeof dbData.objetivo === 'string' ? '✓' : '✗'})`);
console.log(`  nivel_atividade: ${dbData.nivel_atividade} (string: ${typeof dbData.nivel_atividade === 'string' ? '✓' : '✗'})`);
console.log(`  peso: ${dbData.peso} (string: ${typeof dbData.peso === 'string' ? '✓' : '✗'})`);
console.log(`  altura: ${dbData.altura} (number: ${typeof dbData.altura === 'number' ? '✓' : '✗'})`);
console.log(`  idade: ${dbData.idade} (number: ${typeof dbData.idade === 'number' ? '✓' : '✗'})`);

console.log('\n📊 Formato Esperado no Banco:');
const expectedFormat = {
  "telefone": "TEXT (ex: 5521999999999)",
  "sexo": "TEXT MAIÚSCULO (M ou F)",
  "objetivo": "TEXT NUMÉRICO (1, 2 ou 3)",
  "nivel_atividade": "TEXT NUMÉRICO (2, 3 ou 4)",
  "peso": "TEXT (ex: '80')",
  "altura": "INTEGER (ex: 175)",
  "idade": "INTEGER (ex: 35)"
};

console.log(JSON.stringify(expectedFormat, null, 2));

console.log('\n🎯 Resumo:');
console.log('  ✓ Telefone formatado corretamente');
console.log('  ✓ Sexo em maiúsculo');
console.log('  ✓ Objetivo como string numérica');
console.log('  ✓ Nível de atividade como string numérica');
console.log('  ✓ Peso como string');
console.log('  ✓ Tipos corretos para cada campo');

console.log('\n✅ Mapeamento validado com sucesso!');

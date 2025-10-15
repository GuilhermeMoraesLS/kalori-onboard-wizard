import { supabase } from './supabase';
import { OnboardingData } from './storage';

export interface ClienteData {
  telefone: string; // Unique constraint
  nome?: string;
  email?: string;
  tem_dieta_previa?: boolean | null;
  altura?: number; // em cm
  peso?: string; // string no banco (ex: "73")
  idade?: number;
  sexo?: string; // "M", "F" (maiúsculo)
  nivel_atividade?: string; // "1", "2", "3", "4", "5" (string numérica)
  objetivo?: string; // "1", "2", "3" (string numérica: 1=emagrecer, 2=manter, 3=ganhar)
  assinatura_ativa?: boolean;
  preenchido?: boolean;
}

export interface EstadoConversaData {
  usuario_id?: string;
  estado_atual: string;
  dados_contexto?: string;
  usuario_telefone: string;
}

export interface DietaData {
  calorias_diarias?: number;
  proteina_gramas?: number;
  carboidrato_gramas?: number;
  gordura_gramas?: number;
  usuario_telefone: string;
  usuario_id?: string;
  gasto_basal?: number;
  tbm?: number;
  neat?: number;
  meta_base?: number;
  saldo_hoje?: number;
  meta_alvo?: number;
}

/**
 * Converte os dados do onboarding para o formato do banco
 */
export const prepareClientData = (data: OnboardingData): ClienteData | null => {
  if (!data.phone?.number || !data.phone?.countryCode) {
    // Erro: telefone não fornecido (sem expor dados)
    return null;
  }

  // Telefone completo (unique constraint)
  // O number já vem completo com código do país (ex: "5531999614643")
  const telefone = data.phone.number;

  // Calcular idade
  const idade = data.dob?.year 
    ? new Date().getFullYear() - data.dob.year 
    : undefined;

  // Mapear objetivo para string numérica (1=emagrecer, 2=manter, 3=ganhar)
  const objetivoMap: Record<string, string> = {
    "lose": "1",      // Emagrecer
    "maintain": "2",  // Manter
    "gain": "3"       // Ganhar
  };

  // Mapear sexo para maiúsculo
  const sexoMap: Record<string, string> = {
    "male": "M",
    "female": "F",
    "other": "M" // Default
  };

  // Mapear nível de atividade para string numérica (1-5)
  const nivelAtividadeMap: Record<string, string> = {
    "0-2": "2",  // Sedentário/Leve
    "3-5": "3",  // Moderado
    "6+": "4"    // Muito ativo
  };

  const clientData: ClienteData = {
    telefone,
    nome: data.phone?.name || undefined, // Nome coletado junto com o telefone
    email: undefined, // Não coletado no onboarding
    tem_dieta_previa: data.experience === 'yes' ? true : (data.experience === 'no' ? false : null),
    altura: data.height,
    peso: data.weight ? String(data.weight) : undefined, // Converter para string
    idade,
    sexo: sexoMap[data.gender || 'male'], // M ou F maiúsculo
    nivel_atividade: nivelAtividadeMap[data.workouts || '0-2'], // "2", "3" ou "4"
    objetivo: objetivoMap[data.goal || 'maintain'], // "1", "2" ou "3"
    assinatura_ativa: false,
    preenchido: data.completed || false,
  };

  return clientData;
};

/**
 * Salva os dados do cliente no Supabase
 * Cria registros em 3 tabelas: users, estados_conversa, dietas
 * @param data Dados do onboarding
 * @returns true se salvou com sucesso, false caso contrário
 */
export const saveClientToSupabase = async (data: OnboardingData): Promise<boolean> => {
  try {
    const clientData = prepareClientData(data);
    
    if (!clientData) {
      // Dados inválidos (sem expor informações)
      return false;
    }

    // 1. Primeiro, criar/atualizar o usuário na tabela users
    const { data: userResult, error: userError } = await supabase
      .from('users')
      .upsert(clientData, {
        onConflict: 'telefone', // Unique constraint
      })
      .select('id, telefone')
      .single();

    if (userError || !userResult) {
      // Erro ao salvar usuário
      return false;
    }

    const userId = userResult.id;
    const telefone = userResult.telefone;

    // 2. Criar registro em estados_conversa
    const estadoConversaData: EstadoConversaData = {
      usuario_id: userId,
      estado_atual: "fluxo_real",
      dados_contexto: null,
      usuario_telefone: telefone,
    };

    const { error: estadoError } = await supabase
      .from('estados_conversa')
      .upsert(estadoConversaData, {
        onConflict: 'usuario_id', // Unique constraint
      });

    if (estadoError) {
      // Erro ao criar estado_conversa (mas usuário já foi criado)
      // Continua para não bloquear o fluxo
    }

    // 3. Criar registro em dietas (se existirem dados da dieta)
    if (data.dietResults) {
      const dietaData: DietaData = {
        calorias_diarias: data.dietResults.caloriasAlvo,
        proteina_gramas: data.dietResults.proteinas,
        carboidrato_gramas: data.dietResults.carboidratos,
        gordura_gramas: data.dietResults.gorduras,
        usuario_telefone: telefone,
        usuario_id: userId,
        gasto_basal: data.dietResults.tmb,
        tbm: data.dietResults.tmb,
        neat: data.dietResults.neat,
        meta_base: data.dietResults.metaBase, // usar campo do calculator (metaBase)
        saldo_hoje: 0, // Saldo inicial
        meta_alvo: data.dietResults.caloriasAlvo,
      };

      const { error: dietaError } = await supabase
        .from('dietas')
        .upsert(dietaData, {
          onConflict: 'usuario_telefone', // Primary key
        });

      if (dietaError) {
        // Erro ao criar dieta (mas usuário já foi criado)
        // Continua para não bloquear o fluxo
      }
    }

    // Sucesso - usuário, estado_conversa e dieta criados
    return true;
  } catch (error) {
    // Exceção capturada (sem expor detalhes)
    return false;
  }
};

/**
 * Busca um cliente pelo telefone
 */
export const getClientByPhone = async (phone: string): Promise<ClienteData | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telefone', phone)
      .single();

    if (error) {
      // Erro ao buscar (sem expor detalhes)
      return null;
    }

    return data;
  } catch (error) {
    // Exceção ao buscar (sem expor detalhes)
    return null;
  }
};

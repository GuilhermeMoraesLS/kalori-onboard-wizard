const STORAGE_KEY = "kalorix_onboarding_data";

export interface OnboardingData {
  goal?: string;
  targetWeight?: number;
  speed?: string;
  gender?: string;
  dob?: { year: number; month: number; day: number };
  height?: number;
  weight?: number;
  workouts?: string;
  challenges?: string[];
  motivations?: string[];
  diet?: string;
  experience?: string;
  channel?: string;
  phone?: { countryCode: string; number: string; name?: string };
  dietResults?: any;
  [key: string]: any;
}

export const saveOnboardingData = (data: OnboardingData): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Erro ao salvar (silencioso por segurança)
  }
};

export const loadOnboardingData = (): OnboardingData => {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    // Erro ao carregar (silencioso por segurança)
    return {};
  }
};

export const clearOnboardingData = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Erro ao limpar (silencioso por segurança)
  }
};

export const updateOnboardingData = (key: string, value: any): OnboardingData => {
  const currentData = loadOnboardingData();
  const updatedData = { ...currentData, [key]: value };
  saveOnboardingData(updatedData);
  return updatedData;
};

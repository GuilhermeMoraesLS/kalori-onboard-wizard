import { createClient } from '@supabase/supabase-js';

// Pegue essas credenciais do painel do Supabase em:
// Settings > API > Project URL e anon/public key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam as variáveis de ambiente do Supabase. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

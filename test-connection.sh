#!/bin/bash

echo "🧪 Testando conexão com Supabase..."
echo ""

# Verifica se o .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Crie um arquivo .env com:"
    echo "VITE_SUPABASE_URL=sua-url"
    echo "VITE_SUPABASE_ANON_KEY=sua-chave"
    exit 1
fi

# Verifica se as variáveis estão definidas
source .env

if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ VITE_SUPABASE_URL não configurada no .env"
    exit 1
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ VITE_SUPABASE_ANON_KEY não configurada no .env"
    exit 1
fi

echo "✅ Variáveis de ambiente configuradas"
echo "📍 URL: ${VITE_SUPABASE_URL:0:30}..."
echo "🔑 Key: ${VITE_SUPABASE_ANON_KEY:0:30}..."
echo ""

# Testa conexão com a tabela users
echo "🔍 Testando conexão com a tabela 'users'..."
RESPONSE=$(curl -s -X GET \
  "${VITE_SUPABASE_URL}/rest/v1/users?select=count" \
  -H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json")

if echo "$RESPONSE" | grep -q "error"; then
    echo "❌ Erro ao conectar:"
    echo "$RESPONSE" | grep -o '"message":"[^"]*"'
    echo ""
    echo "Possíveis causas:"
    echo "1. Tabela 'users' não existe"
    echo "2. RLS bloqueando acesso"
    echo "3. Credenciais inválidas"
    exit 1
else
    echo "✅ Conexão bem-sucedida!"
    echo "📊 Resposta: $RESPONSE"
fi

echo ""
echo "✅ Tudo pronto para usar!"
echo ""
echo "Para testar:"
echo "1. npm run dev"
echo "2. Complete o onboarding"
echo "3. Verifique os dados no Supabase Dashboard"

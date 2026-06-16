# questionario-assistente-adm — Deploy

## Passo 1 — Supabase

1. Acesse https://supabase.com e abra o projeto wlfxwtzjlbuzyigzspms
2. Vá em **SQL Editor** e execute o conteúdo do arquivo `supabase_sql.sql`
3. Anote a **anon key** em Settings > API

## Passo 2 — GitHub

1. Acesse https://github.com/gentedagenthe
2. Crie um novo repositório chamado `questionario-assistente-adm` (público)
3. Faça upload de todos os arquivos desta pasta para o repositório

## Passo 3 — Vercel

1. Acesse https://vercel.com e conecte o repositório `questionario-assistente-adm`
2. Em **Environment Variables**, adicione:
   - `REACT_APP_SUPABASE_URL` = https://wlfxwtzjlbuzyigzspms.supabase.co
   - `REACT_APP_SUPABASE_ANON_KEY` = (sua anon key do Supabase)
   - `REACT_APP_ADMIN_PASSWORD` = genthe2026
3. Clique em **Deploy**

## Acesso

- Questionário: https://questionario-assistente-adm.vercel.app
- Painel admin: https://questionario-assistente-adm.vercel.app/admin

## Observações

- O campo "Atividades como autônomo(a)" aparece automaticamente quando o candidato
  seleciona "Autônomo(a) / Freelancer" na etapa 2.
- O painel admin permite classificar candidatos, adicionar observações internas
  e copiar o perfil completo formatado para WhatsApp.
- Tabela Supabase: candidatos_assistente_adm

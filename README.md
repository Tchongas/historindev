# Historin

Plataforma para explorar as histórias das ruas de **Gramado** e **Canela**. Os usuários navegam pelas ruas, leem histórias no formato estilo Instagram, e respondem a quizzes sobre a história local.

---

## Acesso Rápido

| O que | Link |
|-------|------|
| Site em produção | https://historin.com |
| Painel admin | https://historin.com/admin |
---

## Painel Administrativo (`/admin`)

O painel fica em `/admin` e usa **senha simples** (sem login de conta). A sessão expira após 10 minutos de inatividade.

A senha fica na variável de ambiente `ADMIN_TOKEN` (ver seção de variáveis abaixo).

### O que dá pra gerenciar

**Conteúdo principal**
- **Histórias** — Adicionar, editar e remover histórias. Cada história tem título, texto, imagens, autores, tags e está vinculada a uma rua.
- **Ruas** — As ruas de Gramado e Canela. Cada rua tem nome, descrição, coordenadas (para o mapa) e cidade.
- **Cidades** — Gramado e Canela. Raramente precisam ser editadas.
- **Negócios** — Estabelecimentos locais mostrados na home.

**Quiz & Engajamento**
- **Perguntas** — Perguntas do quiz, separadas por cidade (`gramado`, `canela`, `geral`).
- **Resultados** — Visualizar os resultados do quiz enviados pelos usuários.
- **QR Codes** — Gerenciar os QR codes da caça ao tesouro (`/caca-qr`).
- **Popup Ads** — Popups que aparecem na home após alguns segundos.

**Referências** (visíveis na página `/referencias`)
- **Organizações**, **Autores**, **Obras**, **Sites** — créditos e fontes bibliográficas.

---

## Variáveis de Ambiente

O arquivo `.env` fica na raiz do projeto (`historindev/.env`) e **não é commitado** no Git.

Para colocar o projeto em outro servidor, crie um `.env` com:

```env
# Supabase — banco de dados e autenticação
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave anon pública>
SUPABASE_SERVICE_ROLE_KEY=<chave service role — nunca expor publicamente>

# Senha do painel admin em /admin
ADMIN_TOKEN=<senha escolhida>

# Google Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Onde pegar as chaves Supabase:**
Supabase Dashboard → seu projeto → Settings → API

**Onde configurar no Vercel:**
Vercel → seu projeto → Settings → Environment Variables

---

## Autenticação de Usuários (Google)

Os usuários podem fazer login com Google para salvar seus resultados do quiz. Isso é gerenciado pelo **Supabase Auth**.

Para ativar/desativar o login com Google (e outras features), edite `src/config/featureFlags.ts`:

```ts
const FEATURES_ENABLED = true; // mude para false para desativar tudo
```

Para configurar o Google OAuth do zero:
1. Criar projeto no [Google Cloud Console](https://console.cloud.google.com) e ativar a API OAuth.
2. Adicionar callback do supabase como URI de redirecionamento.
3. Supabase Dashboard → Authentication → Providers → Google → colar Client ID e Secret.

A única rota protegida por autenticação é `/perfil` (histórico de quiz do usuário).

---

## Estrutura do Projeto

```
historindev/
├── src/
│   ├── app/                  # Páginas (roteamento Next.js)
│   │   ├── admin/            # Painel administrativo
│   │   ├── api/admin/        # APIs REST usadas pelo painel
│   │   ├── rua/[ruaId]/      # Página de rua e histórias
│   │   ├── quiz/             # Página do quiz
│   │   ├── referencias/      # Créditos e fontes
│   │   ├── sobre/            # Sobre o projeto
│   │   ├── legado-africano/  # Artigo do legado africano
│   │   ├── ruasehistorias/   # Listagem geral de ruas e histórias
│   │   └── adicionar-historia/ # Formulário de contribuição
│   ├── components/           # Componentes React reutilizáveis
│   ├── config/
│   │   └── featureFlags.ts   # Liga/desliga features (auth, quiz, etc.)
│   ├── contexts/
│   │   └── AuthContext.tsx   # Estado global de autenticação
│   ├── lib/supabase/         # Clientes Supabase (browser e server)
│   └── utils/
│       └── adminApi.ts       # Sessão do admin (localStorage, 10min)
├── supabase/migrations/      # Migrações do banco de dados
├── public/                   # Imagens e assets estáticos
├── .env                      # Variáveis de ambiente (não commitado)
└── DESIGN_SYSTEM.md          # Guia de cores, tipografia e componentes
```

### Como a autenticação do admin funciona

O painel admin **não usa Supabase Auth**. Funciona assim:
1. O admin digita a senha em `/admin`.
2. A senha é comparada com `ADMIN_TOKEN` (variável de ambiente) via header `x-admin-token`.
3. A sessão fica salva no `localStorage` do browser e expira em 10 minutos.
4. Todas as rotas `/api/admin/*` verificam o token a cada requisição.

---

## Deploy (Vercel)

O projeto está configurado para deploy automático no Vercel.

1. Conectar o repositório ao Vercel.
2. Configurar as variáveis de ambiente (ver seção acima).
3. O Vercel faz build e deploy automaticamente a cada push no branch principal.

Para rodar localmente:

```bash
npm install
# Criar o .env com as variáveis acima
npm run dev
# Abrir http://localhost:3000
```

---

## Design System

O arquivo `DESIGN_SYSTEM.md` documenta as cores, tipografia, espaçamentos e padrões de componentes usados em todo o projeto. Consulte antes de criar novos componentes ou páginas.

Cores principais:
- **Fundo header:** `#E6D3B4`
- **Fundo geral:** `#F4EDE0`
- **Marrom primário:** `#8B4513`
- **Texto principal:** `#4A3F35`
- **Texto secundário:** `#6B5B4F` / `#A0958A`
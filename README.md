# MORADOR App 🏠

Aplicativo de marketplace para condomínios, conectando residentes e prestadores de serviços/produtos.

## 🚀 Funcionalidades

- **Cadastro de Residentes e Prestadores**
- **Marketplace de Serviços e Produtos**
- **Sistema de Agendamentos**
- **Desapego (Venda de Itens Usados)**
- **Gestão de Pedidos**
- **Perfis e Avaliações**

## 🛠️ Tecnologias

- **Frontend:** React + TypeScript + Vite
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Estilo:** CSS Vanilla
- **Ícones:** Lucide React

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase

## ⚙️ Configuração

1. **Clone o repositório:**
   ```bash
   git clone <seu-repositorio>
   cd morador
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Copie `.env.example` para `.env.local`
   - Preencha com suas credenciais do Supabase:
     ```
     VITE_SUPABASE_URL=https://seu-projeto.supabase.co
     VITE_SUPABASE_ANON_KEY=sua-chave-aqui
     ```

4. **Configure o banco de dados:**
   - Acesse o Supabase SQL Editor
   - Execute o script `schema.sql`

5. **Configure o Storage:**
   - Crie os buckets no Supabase Storage:
     - `provider_assets` (público)
     - `desapego_images` (público)
     - `branding` (público)

## 🏃 Executar Localmente

```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 🏗️ Build para Produção

```bash
npm run build
```

## 📦 Deploy

### Vercel (Recomendado)

1. Faça push para o GitHub
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

### Netlify

1. Conecte o repositório
2. Configure build command: `npm run build`
3. Publish directory: `dist`
4. Adicione variáveis de ambiente

## 📱 Estrutura do Projeto

```
morador/
├── components/       # Componentes reutilizáveis
├── context/         # Context API (Auth, Cart, Registration)
├── pages/           # Páginas da aplicação
├── public/          # Arquivos estáticos
├── schema.sql       # Schema do banco de dados
├── types.ts         # Definições TypeScript
└── supabaseClient.ts # Cliente Supabase
```

## 🔐 Segurança

- Nunca commite o arquivo `.env.local`
- Use Row Level Security (RLS) no Supabase
- Valide dados no backend

## 📄 Licença

Projeto privado - Todos os direitos reservados

## 👥 Autor

Desenvolvido com ❤️ para conectar comunidades

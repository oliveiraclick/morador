# Documentação do Aplicativo Morador

Este documento detalha todas as telas do aplicativo, suas funcionalidades, e como estão integradas ao banco de dados Supabase.

---

## 1. Fluxo de Autenticação e Entrada

### **Splash Screen (`Splash.tsx`)**
*   **Função**: Tela inicial de carregamento.
*   **Lógica**: Verifica se o usuário já tem registro (`localStorage`) e redireciona para Login ou Seleção de Perfil.
*   **Integração**: Nenhuma direta (apenas lógica local).

### **Login (`Login.tsx`)**
*   **Função**: Autenticação de usuários existentes.
*   **Integração Supabase**:
    *   `supabase.auth.signInWithPassword`: Login com email/senha.
    *   `supabase.auth.signInWithOAuth`: Login Social (Google).
    *   Consulta a tabela `profiles` para verificar o papel (Role) do usuário e redirecionar corretamente (Admin, Profissional ou Morador).

### **Cadastro de Morador (`RegisterResident.tsx`)**
*   **Função**: Registro de novos moradores.
*   **Integração Supabase**:
    *   Busca lista de condomínios (`supabase.from('condos')`) para o dropdown.
    *   `supabase.auth.signUp`: Cria o usuário Auth e armazena metadados (condo_id, unit, role).
    *   *Nota*: A criação do perfil na tabela `profiles` é feita automaticamente por uma Trigger no banco de dados.

### **Cadastro Profissional (`RegisterProfessional.tsx`)**
*   **Função**: Registro de prestadores de serviço.
*   **Integração Supabase**:
    *   `supabase.auth.signUp`: Cria usuário Auth.
    *   Atualiza `profiles` com dados específicos: `profession`, `service_history`, `status`.

---

## 2. Painel do Morador (Resident)

### **Home (`ResidentHome.tsx`)**
*   **Função**: Hub principal do morador.
*   **Integrações**:
    *   **Notificações**: Busca na tabela `broadcasts` (avisos para 'all' ou 'residents').
    *   **Perfil**: Busca dados do usuário e condomínio na tabela `profiles` (join com `condos`).
    *   **Desapegos**: Busca itens recentes em `marketplace_items` (tipo 'desapego').
    *   **Ofertas/Ads**: Busca anúncios ativos na tabela `ads`.
    *   **Atualização de Endereço**: Permite completar cadastro (Condomínio/Unidade) atualizando a tabela `profiles`.
*   **Botões Principais**:
    *   **Sino**: Exibe notificações (`broadcasts`).
    *   **Completar Cadastro**: Salva dados faltantes no perfil.
    *   **Chamar Profissional**: Inicia chat (Navegação).

### **Marketplace (`Marketplace.tsx`)**
*   **Função**: Loja de produtos e desapegos.
*   **Integrações**:
    *   Busca itens em `marketplace_items` com join em `profiles` (para mostrar quem é o vendedor).
    *   Filtra por categorias (Móveis, Eletrônicos, etc.).
*   **Botões Principais**:
    *   **Negociar**: Cria registro local de interação e navega para Chat.
    *   **Ver Item**: Abre modal com detalhes e galeria (Lightbox).

### **Perfil (`ResidentProfile.tsx`)**
*   **Função**: Gestão de dados pessoais.
*   **Integrações**:
    *   **Leitura**: Busca dados completos em `profiles`.
    *   **Atualização**: Edita nome, telefone, endereço (`condo_id`, `unit`) na tabela `profiles`.
    *   **Upload de Foto**: Envia imagem para bucket `avatars` no Storage e atualiza URL no perfil.
*   **Botões Principais**:
    *   **Salvar Alterações**: Commit no banco de dados.
    *   **Câmera**: Trigger de upload de imagem.

### **Chat (`Chat.tsx`)**
*   **Função**: Troca de mensagens entre usuários.
*   **Integrações**:
    *   Busca e envia mensagens na tabela `messages` (Realtime).
    *   Cria/Verifica salas de chat (lógica implícita nas mensagens entre dois IDs).

---

## 3. Painel do Profissional

### **Dashboard (`ProfDashboard.tsx`)**
*   **Função**: Painel de controle do prestador.
*   **Integrações**:
    *   **Perfil**: Busca status atual (`is_on_site`, `is_vacation`).
    *   **Check-in/Out**: Atualiza campo `is_on_site` na tabela `profiles` (Indica se está no condomínio).
    *   **Modo Férias**: Atualiza campo `is_vacation`.
    *   **Notificações**: Busca `broadcasts` direcionados a profissionais.
*   **Botões Principais**:
    *   **Check-in Slider**: Alterna status de disponibilidade.
    *   **Botão Férias**: Alterna visibilidade global.

### **Criar Oferta (`CreateOffer.tsx`)**
*   **Função**: Publicar serviços ou produtos.
*   **Integrações**:
    *   Insere novos registros em `marketplace_items`.
    *   Upload de imagens de produtos no Storage.

---

## 4. Painel Administrativo (Admin)

### **Dashboard Master (`MasterDashboard.tsx`)**
*   **Função**: Visão geral e navegação.
*   **Dados**: (Atualmente exibe dados mockados/estáticos para performance, mas prepara navegação para módulos reais).

### **Gerenciar Usuários (`AdminUsers.tsx`)**
*   **Função**: Moderação de moradores e profissionais.
*   **Integrações**:
    *   Lista todos os usuários da tabela `profiles`.
    *   **Aprovação**: Altera `status` para 'active' ou 'blocked'.
    *   **Profissionais**: Toggles para `is_verified` (Verificado) e `is_free` (Isento de taxa).
*   **Botões Principais**:
    *   **Aprovar/Bloquear**: Atualiza status no banco.
    *   **Verificado/Cobrar**: Atualiza flags financeiras/confiança.

### **Financeiro (`AdminFinancial.tsx`)**
*   **Função**: Gestão de fluxo de caixa.
*   **Integrações**:
    *   Lista transações da tabela `financial_transactions`.
    *   Filtra por entradas (Receitas) e saídas (Despesas).

### **Anúncios (`AdminAds.tsx` e `AdminBroadcast.tsx`)**
*   **Função**: Gestão de banners e avisos.
*   **Integrações**:
    *   CRUD na tabela `ads` e `broadcasts`.
    *   Ativar/Inativar campanhas.

### **Condomínios (`AdminCondos.tsx`)**
*   **Função**: Cadastro de condomínios.
*   **Integrações**:
    *   CRUD na tabela `condos` (Adicionar, Editar, Remover).

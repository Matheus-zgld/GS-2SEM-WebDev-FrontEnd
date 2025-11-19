<div align="center">
  <img src="src/assets/SYNAPSE_semfundo_branco.png" alt="SYNAPSE Logo" width="150"/>
  <h1 align="center">SYNAPSE - Plataforma de Desenvolvimento Profissional</h1>
  <p align="center">
    Uma plataforma inovadora que utiliza IA, gamificação e uma rede social para ajudar profissionais a descobrir seu potencial, conectar-se a oportunidades e planejar seu crescimento.
  </p>
</div>

---

## 👥 Integrante

* **Nome:** Matheus Henrique Ferreira Camargo da Silva
* **RM:** 566232

## 🚀 Sobre o Projeto

**SYNAPSE** é uma aplicação web moderna construída para a Global Solution de Front-End Web Development. O projeto simula uma rede profissional inteligente onde os usuários podem:
- **Descobrir seu potencial** através de uma conversa socrática com uma IA (Gemini).
- **Construir um perfil dinâmico** com habilidades, experiências e interesses.
- **Participar de um mercado de desafios**, aplicando-se a projetos ou publicando os seus próprios.
- **Organizar suas tarefas** em um planner semanal/mensal interativo com funcionalidade de arrastar e soltar.
- **Interagir com a comunidade** através de um feed de publicações, curtidas e comentários.
- **Acompanhar seu progresso** com um sistema de gamificação, incluindo pontos, badges e leaderboards.

## ✨ Funcionalidades Principais

*   **🧠 Descoberta de Potencial com IA:** Interface de chat integrada com a API do Google Gemini para ajudar os usuários a refletirem sobre suas habilidades e definirem seu arquétipo profissional.
*   **🌐 Rede Profissional e Gamificação:**
    *   Visualização de perfis de outros usuários.
    *   Sistema de pontos, badges e um leaderboard para incentivar o engajamento.
    *   Feed de publicações no estilo de rede social com curtidas, comentários e salvamento.
*   **🎯 Mercado de Desafios:**
    *   Explore e aplique-se a desafios publicados pela comunidade.
    *   Publique seus próprios desafios para que outros possam participar.
    *   Painel para gerenciar as candidaturas recebidas em seus desafios.
*   **🗓️ Planner Interativo:**
    *   Organize desafios e micro-projetos em um planner semanal com colunas (Kanban).
    *   Funcionalidade de arrastar e soltar (drag-and-drop) para mover tarefas.
    *   Visualização mensal para um planejamento de longo prazo.
*   **🛠️ Gerenciador de Habilidades:**
    *   Adicione e remova suas próprias habilidades técnicas e soft skills.
    *   Configure as habilidades que a IA pode utilizar para te ajudar (ex: acesso a e-mails, agenda, etc.).
*   **🔐 Autenticação Segura:** Sistema completo de login, cadastro e gerenciamento de sessão utilizando Firebase Authentication.

## 🛠️ Tecnologias Utilizadas

*   **Frontend:**
    *   React (com Hooks)
    *   Vite como bundler de alta performance.
*   **Estilização:**
    *   Tailwind CSS para uma estilização utilitária e rápida.
*   **Backend & Banco de Dados:**
    *   Firebase (Authentication, Firestore).
*   **Inteligência Artificial:**
    *   Google Generative AI (Gemini).
*   **Roteamento:**
    *   React Router.
*   **Animações e Interatividade:**
    *   Framer Motion para animações fluidas.
    *   @hello-pangea/dnd para a funcionalidade de arrastar e soltar.
*   **Ícones:**
    *   Lucide React.

## ⚙️ Configuração e Instalação

Para rodar este projeto localmente, siga os passos abaixo:

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (geralmente vem com o Node.js)

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/GS-2SEM-WebDev-FrontEnd.git
    cd GS-2SEM-WebDev-FrontEnd
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto e adicione sua chave da API do Google Gemini.

    ```env
    VITE_GEMINI_API_KEY=SUA_CHAVE_DA_API_AQUI
    ```
    > **Nota:** A chave da API do Gemini pode ser obtida no Google AI Studio.

4.  **Configure o Firebase:**
    As credenciais do Firebase já estão no arquivo `src/lib/firebase.js`. Certifique-se de que as regras de segurança do seu Firestore e Authentication estão configuradas corretamente no console do Firebase para permitir leitura e escrita.

5.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

6.  **Acesse a aplicação:**
    Abra seu navegador e acesse `http://localhost:5173`.

---

**Desenvolvido para a Global Solution de Front-End Web Development.**

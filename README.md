# Vinc. — Confirme antes de confiar.

[![Vinc Banner](https://ais-pre-vxglezchibg6wbuunkpezb-350713325872.us-west2.run.app/assets/icons/vinc_icon_256px.png)](https://github.com/luizgteixeira/vinc-site)

O **Vinc** é uma plataforma de segurança e blindagem digital jurídica de ponta, projetada para proteger a confiança mútua entre escritórios de advocacia, advogados autônomos e seus clientes. Atuando como um escudo ativo de cibersegurança, o sistema previne fraudes de engenharia social modernas, especialmente o golpe do "número novo" (falsa identidade por WhatsApp), boletos bancários adulterados e desvios de transferências via chaves Pix.

Este repositório contém a aplicação web completa do Vinc, incluindo o seu recém-reorganizado **Centro de Conhecimento Antifraude Jurídica (Blog)**.

---

## 🎨 Conceito e Identidade Visual

O design do Vinc é inspirado no **minimalismo suíço moderno**, unindo precisão técnica, sofisticação e legibilidade impecável para transmitir autoridade e calma técnica:
*   **Esquema de Cores**: Tons sofisticados de cinza-escuro (carvão), off-whites suaves de fundo e acentos estratégicos em azul profundo (`#2563eb` - símbolo de confiança e estabilidade jurídica) e vermelho carmim (`#e11d48` - reservado estritamente para alertas de perigo).
*   **Tipografia**: Uso integrado de fontes geométricas elegantes ("Space Grotesk") para títulos e displays marcantes, emparelhadas com famílias monoespaçadas ("JetBrains Mono") para metadados, status de validação e indicadores.
*   **Estética Limpa (Anti-AI-Slop)**: Totalmente livre de poluição visual, barras de status artificiais, pings fictícios ou logs de simulação no frontend. Cada elemento visual tem um propósito claro e direto focado no usuário humano.

---

## 🚀 Principais Recursos do Ecossistema Vinc

### 1. Validação Instantânea em Duas Vias
Previne o golpe de falsa identidade. Sempre que um cliente recebe uma mensagem de alguém se identificando como seu advogado ou assistente, o Vinc valida a origem real do remetente através de chaves seguras. Contatos legítimos exibem o selo oficial **Verificado** no aplicativo.

### 2. Scanner Criptográfico de Boletos e Pix
Antes de realizar pagamentos de guias ou transferências processuais, o usuário escaneia ou digita o código de barras no Vinc. O sistema valida os dados do cedente oficial e a conta do banco emissor homologado com a sociedade jurídica, bloqueando boletos alterados por malware.

### 3. Sincronização e Comunicação Segura
Centraliza atualizações críticas de processos judiciais e envio de documentos oficiais com criptografia robusta diretamente do painel do advogado ("Escritório Ciente") para a tela do cliente, eliminando canais abertos e propensos a interceptação (como e-mails ou SMS convencionais).

---

## ✍️ Centro de Conhecimento Antifraude (Blog Reorganizado)

O blog foi transformado em uma verdadeira biblioteca técnica voltada para a prevenção ativa de golpes e fortalecimento do relacionamento profissional.

### 📂 Novas Categorias Editoriais Implementadas:
1.  **🚨 Anatomia de Golpes e Alertas**: Educação preventiva para decodificar e desarmar golpes de engenharia social (como o falso advogado e Pix de alvará).
2.  **🛡️ Gestão de Reputação para Advogados**: Postura proativa para escritórios protegerem suas marcas digitais e manterem a confiança dos clientes.
3.  **⚙️ Tecnologia e Soberania de Dados**: Explicação amigável de criptografia, chaves assimétricas, JWT e segurança do nosso backend como fonte única da verdade.
4.  **📖 Guia de Funcionalidades e Onboarding**: Tutoriais operacionais passo a passo (Pareamento de Clientes, Ativação de Chaves, Painel Administrativo).
5.  **🔒 Cibersegurança e Compliance (LGPD)**: Governança de dados pessoais sensíveis, auditorias imutáveis de transações e conformidade jurídica.
6.  **🤝 Casos de Sucesso e Segurança**: Relatos anonimizados de tentativas de fraude desarmadas com sucesso pela plataforma.

### 🛠️ Diferenciais Técnicos e Arquitetura do Blog:
*   **Índice de Conteúdo Automático (TOC)**: Geração dinâmica de tabelas de conteúdo baseadas nas tags `H2` presentes no corpo dos artigos, facilitando a usabilidade.
*   **Malha de Links Internos (Internal Linking)**: Artigos relacionados inteligentes integrados de forma cruzada para evitar conteúdos isolados e maximizar a autoridade do site.
*   **SEO & Metadados Avançados**:
    *   Tags Open Graph e Twitter Cards geradas dinamicamente via JS.
    *   Injeção automática de **dados estruturados JSON-LD** (Schema.org de *BlogPosting*) para indexação prioritária em mecanismos de busca (Google).
    *   Trilha de navegação (**Breadcrumbs**) para melhor acessibilidade e hierarquia semântica.
*   **Newsletter Ativa via Mailto**: O formulário de newsletter (tanto na sidebar quanto no rodapé) captura o e-mail e nome do interessado e gera automaticamente uma requisição formatada via protocolo `mailto`, direcionada diretamente para o e-mail de contato configurado (`contato@luizgustavodev.com`).

---

## 📁 Estrutura do Repositório

```bash
├── public/                 # Todo o frontend estático e recursos do cliente
│   ├── pages/              # Páginas HTML modulares (blog.html, artigo-detalhes.html)
│   ├── css/                # Folhas de estilo modularizadas em Tailwind CSS v4
│   │   ├── 1-settings/     # Variáveis globais, resets e responsividade
│   │   ├── 2-components/   # Componentes reaproveitáveis (botões, menus, toc, etc.)
│   │   └── 3-pages/        # Estilos dedicados (blog.css)
│   ├── assets/             # Logotipos vetoriais oficiais, ícones e capas de artigos
│   └── index.html          # Página institucional (Hub principal do Vinc)
├── app/                    # Estrutura do Next.js App Router (Páginas do servidor e APIs)
├── lib/                    # Arquivos utilitários e helpers reutilizáveis
├── .env.example            # Exemplo de chaves e variáveis de ambiente do projeto
├── metadata.json           # Configurações de permissões do iFrame e capacidades do applet
└── package.json            # Scripts de build, lint, dependências e dependências de dev
```

---

## 🛠️ Instalação e Execução Local

Siga as etapas abaixo para clonar o repositório, instalar os pacotes necessários e rodar o projeto localmente em seu computador:

### Pré-requisitos
*   [Node.js](https://nodejs.org/) (versão 18.x ou superior recomendada)
*   NPM (instalado por padrão com o Node.js)

### Passo a Passo

1.  **Clonar o repositório oficial**:
    ```bash
    git clone https://github.com/luizgteixeira/vinc-site.git
    cd vinc-site
    ```

2.  **Instalar todas as dependências**:
    ```bash
    npm install
    ```

3.  **Iniciar o servidor local de desenvolvimento**:
    ```bash
    npm run dev
    ```
    O servidor será iniciado na porta padrão. O Vinc estará acessível em `http://localhost:3000`.

4.  **Executar o validador de sintaxe e estilo (Linter)**:
    ```bash
    npm run lint
    ```

5.  **Compilar a aplicação para produção**:
    ```bash
    npm run build
    ```
    Isso gerará os arquivos otimizados e minificados para que o site performe de forma exemplar nos navegadores.

---

## 🔒 Segurança de Dados & Compliance (LGPD)

O Vinc adota os princípios de *Privacy by Design*. Todas as rotas críticas de backend utilizam chaves criptográficas para verificar a identidade de remetentes de forma descentralizada. Nenhum dado sensível de processos judiciais é armazenado desnecessariamente em bancos expostos, assegurando plena conformidade com as diretrizes e regras da **Lei Geral de Proteção de Dados (LGPD)**.

---

## 📬 Contato e Suporte

Caso queira saber mais sobre a arquitetura do projeto ou implementar o Vinc no seu escritório, entre em contato:
*   **E-mail**: [contato@luizgustavodev.com](mailto:contato@luizgustavodev.com)
*   **GitHub**: [@luizgteixeira](https://github.com/luizgteixeira)

Desenvolvido por **Vinc. Segurança Digital Jurídica** © 2026. Todos os direitos reservados.

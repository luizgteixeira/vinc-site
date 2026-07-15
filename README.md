# Vinc

O **Vinc** é uma plataforma de segurança e blindagem digital jurídica de ponta, projetada para estabelecer e proteger a confiança mútua entre escritórios de advocacia, advogados autônomos e seus clientes. Atuando como um escudo ativo de cibersegurança, o sistema previne fraudes modernas baseadas em engenharia social, especialmente o golpe do "número novo" (falsa identidade por WhatsApp), boletos bancários adulterados e desvios de pagamentos via chaves Pix.

> **Vinc — confirme antes de confiar.**

  <img src="public/assets/icons/vinc_icon_256px.png" alt="Vinc Logo" width="128" height="128" />
  <p><em>Sua barreira lógica e criptográfica de segurança contra fraudes jurídicas.</em></p>

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-39827F?style=for-the-badge&logo=prisma&logoColor=white)
![Linter](https://img.shields.io/badge/eslint-3A3307?style=for-the-badge&logo=eslint&logoColor=61DAFB)

---

## 📖 Sobre o Projeto

No atual cenário digital, criminosos virtuais utilizam dados de diários oficiais públicos para identificar pessoas com processos judiciais em andamento e valores a receber. Fingindo ser os advogados responsáveis pelas causas, golpistas entram em contato via redes sociais urgindo o pagamento de taxas cartorárias fictícias para a liberação de alvarás e indenizações.

O **Vinc** foi concebido para quebrar esse elo de vulnerabilidade através de autenticação criptográfica e confirmação de identidade em duas vias. Ele funciona como uma fonte única de verdade onde qualquer mensagem, cobrança ou documento enviado aos clientes pode ser validado instantaneamente.

---

## 🎯 Objetivos do Ecossistema

- **Neutralizar a Engenharia Social:** Fornecer meios intuitivos para que clientes possam validar de forma inequívoca a identidade de quem os contata.
- **Blindar a Reputação Jurídica:** Garantir que escritórios de advocacia e advogados autônomos tenham controle total sobre as comunicações enviadas em seu nome, mitigando o uso indevido de suas marcas profissionais.
- **Assegurar Transações Financeiras:** Fornecer verificação criptográfica para boletos bancários e chaves Pix de destino, evitando o pagamento de documentos fraudados ou adulterados.
- **Garantir Compliance Legal:** Servir como um canal estruturado de troca de documentos sensíveis em conformidade com as exigências da Lei Geral de Proteção de Dados (LGPD).

---

## 🚀 Funcionalidades Principais

### 1. Validação em Duas Vias de Identidade

Sempre que um cliente receber uma comunicação de seu suposto representante legal, ele pode conferir a legitimidade da origem. Se o contato for autêntico e partir do sistema homologado, o Vinc emite o selo **Verificado**, garantindo o sigilo da conversa.

### 2. Validador Criptográfico de Boletos e Pix

Permite ao usuário digitalizar ou colar a linha digitável de qualquer cobrança recebida. O Vinc verifica se o banco emitente, o cedente oficial e a conta de destino coincidem com a base cadastral registrada e homologada pelo escritório de advocacia parceiro, barrando fraudes.

### 3. Painel Administrativo "Escritório Ciente"

O ambiente do advogado permite gerenciar toda a carteira de clientes vinculados, emitir ordens de pagamento auditadas, disparar notificações push seguras de forma rastreável e manter um histórico imutável de todas as interações e documentos expedidos.

---

## 🛠️ Tecnologias Utilizadas

A arquitetura do Vinc combina robustez de backend e leveza de carregamento no cliente final:

- **Frontend Core:** HTML5, CSS3 estruturado através de classes utilitárias modernas e JavaScript modular.
- **Framework de Produção:** [Next.js](https://nextjs.org/) (com TypeScript para tipagem estática e garantia de qualidade de código).
- **Estilização e Design:** [Tailwind CSS](https://tailwindcss.com/) v4 para construção de uma interface responsiva, fluida e consistente.
- **Modelagem de Dados:** [Prisma ORM](https://www.prisma.io/) pronto para orquestrar comunicações de dados relacionais e auditorias seguras.
- **Qualidade de Código:** ESLint e TypeScript Compiler integrados para validação estática pré-build.

---

## 📁 Estrutura do Projeto

O repositório está organizado para manter uma clara separação entre a lógica do servidor (Next.js) e os ativos estáticos otimizados carregados pelo navegador.

```bash
vinc-site/
├── app/                    # Next.js App Router (Páginas do servidor e ponto de entrada)
│   ├── globals.css         # Importações do Tailwind CSS e regras globais
│   ├── layout.tsx          # Layout base do Next.js (definição de fontes e cabeçalhos de página)
│   └── page.tsx            # Página inicial de montagem da plataforma
├── assets/                 # Recursos e imagens de desenvolvimento do projeto
├── hooks/                  # Hooks personalizados do React para gestão de estado
├── lib/                    # Arquivos utilitários e funções auxiliares reutilizáveis
├── prisma/                 # Modelagem do banco de dados (Prisma ORM)
├── public/                 # Ativos públicos servidos diretamente ao navegador
│   ├── assets/             # Ícones e logotipos oficiais do Vinc (vetores de alta fidelidade)
│   ├── css/                # Folhas de estilo modulares
│   │   ├── 1-settings/     # Regras básicas, resets e variáveis globais de responsividade
│   │   ├── 2-components/   # Componentes reusados (botões, cards, menus, índices)
│   │   └── 3-pages/        # Estilos específicos de cada página (como blog.css)
│   ├── js/                 # Arquivos javascript de controle de comportamento dinâmico (blog.js)
│   └── pages/              # Páginas estáticas modulares de alta performance (HTML5)
│       ├── advogados.html  # Detalhamento para advogados autônomos
│       ├── artigo-detalhes.html # Template dinâmico para leitura detalhada de posts
│       ├── blog.html       # Centro de Conhecimento Antifraude (Listagem do Blog)
│       ├── clientes.html   # Funcionalidades voltadas ao cliente final
│       ├── como-funciona.html # Fluxo de funcionamento e proteção em duas vias
│       ├── contato.html    # Canal de contato e onboarding de escritórios
│       ├── escritorios.html # Apresentação institucional para médias e grandes bancas
│       ├── faq.html        # Perguntas frequentes sobre segurança cibernética jurídica
│       ├── recursos.html   # Detalhamento técnico de scanners e verificadores
│       └── seguranca.html  # Explicação das barreiras lógicas e criptografia do sistema
├── .env.example            # Exemplo de variáveis de ambiente e chaves da aplicação
├── eslint.config.mjs       # Configuração de validação do Linter (ESLint)
├── metadata.json           # Configurações de metadados, permissões e capacidades
├── package.json            # Manifest do Node.js (scripts de execução, dependências e build)
└── tsconfig.json           # Definição e regras de compilação do TypeScript
```

---

## 💻 Como Executar o Projeto Localmente

Siga o passo a passo para baixar, instalar e rodar o projeto em seu ambiente de desenvolvimento:

### Pré-requisitos

Certifique-se de possuir em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18.x ou superior recomendada)

- NPM ou outro gerenciador de pacotes equivalente (como Bun ou Yarn)

### Instruções

1. *Clonar o repositório:*

    ```bash
    git clone https://github.com/luizgteixeira/vinc-site.git
    cd vinc-site
    ```

2. **Instalar as dependências:**

    ```bash
    npm install
    ```

3. **Iniciar o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    O servidor iniciará localmente e o site estará acessível através do endereço: `http://localhost:3000`.

4. **Validar a sintaxe do código (Linter):**

    ```bash
    npm run lint
    ```

5. **Compilar para produção:**

    ```bash
    npm run build
    ```

    Os arquivos otimizados, minificados e prontos para distribuição em nuvem serão gerados na pasta de build.

---

## ✍️ Centro de Conhecimento Antifraude (Blog do Vinc)

O blog do Vinc foi transformado em um verdadeiro **Centro de Conhecimento**, estruturado de forma a educar o mercado, gerar leads qualificados e fortalecer o SEO orgânico do site.

### Categorias Editoriais Implementadas

1. **🚨 Anatomia de Golpes e Alertas:** Desmonta táticas de engenharia social ensinando o leitor a identificar golpes (como falso advogado ou WhatsApp clonado) antes que aconteçam.
2. **🛡️ Gestão de Reputação para Advogados:** Boas práticas de comunicação digital para que bancas de advocacia mantenham a confiança intacta de seus clientes.
3. **⚙️ Tecnologia e Soberania de Dados:** Explicação amigável de criptografia, chaves assimétricas, tokens de autenticação (JWT) e a segurança de se usar o backend como única fonte da verdade.
4. **📖 Guia de Funcionalidades e Onboarding:** Manuais instrucionais passo a passo sobre pareamento de clientes, ativação de chaves e uso do sistema.
5. **🔒 Cibersegurança e Compliance (LGPD):** Governança corporativa, privacidade de dados de processos judiciais e auditoria ativa.
6. **🤝 Casos de Sucesso e Segurança:** Histórias e estudos de caso baseados em dados reais, completamente anonimizados, demonstrando tentativas de fraudes bloqueadas.

---

## 📈 Otimização de SEO e UX

O site conta com estratégias técnicas de indexação e usabilidade de alto nível:

- **Metadados Dinâmicos (SEO):** Tags Open Graph (Facebook/LinkedIn) e Twitter Cards são atualizadas em tempo real via JS para garantir pré-visualizações ricas e atraentes nas redes sociais.
- **Dados Estruturados (JSON-LD):** Geração automática de esquemas do tipo `BlogPosting` da Schema.org, permitindo que mecanismos de pesquisa (como o Google) indexem os artigos com formatos ricos de pesquisa.
- **Navegação Semântica (Breadcrumbs):** Trilhas de navegação amigáveis melhoram a orientação do usuário e a acessibilidade, ao mesmo tempo em que fortalecem o ranqueamento estrutural.
- **Índice de Conteúdo Dinâmico (TOC):** O sistema do blog varre o artigo de forma automatizada e gera um painel dinâmico de leitura rápida com links de rolagem suave para cada tag `H2` encontrada.
- **Newsletter Ativa via Mailto:** Os formulários capturam nome e e-mail e constroem um link inteligente de protocolo `mailto` direcionando as informações formatadas de inscrição direto para a caixa de e-mail `contato@luizgustavodev.com`.

---

## 📱 Responsividade e Acessibilidade

O Vinc adota design inclusivo de ponta a ponta:

- **Mobile-First:** Menus, tabelas, blocos de artigos e o índice de conteúdos reorganizam-se perfeitamente para uma experiência de toque ágil em
telas de smartphones.

- **Contraste de Cores:** Combinações cromáticas rigorosamente avaliadas para proporcionar leitura confortável e livre de fadiga ocular, seguindo os padrões WCAG.

- **Navegação Limpa:** Sem poluição visual, pop-ups invasivos ou logs fictícios de simulação. O design do Vinc prioriza a clareza e usabilidade focado no usuário.

---

## 🔒 Segurança de Dados

Todas as informações de fluxo de dados na plataforma Vinc seguem as diretrizes rígidas da **Lei Geral de Proteção de Dados (LGPD)**. Os logs de acesso e validações são mantidos criptografados, assegurando privacidade plena para advogados e clientes, sem armazenamento desnecessário de dados sob segredo de justiça.

---

## 🤝 Contribuição

Contribuições para o desenvolvimento do Vinc são sempre bem-vindas! Se você deseja propor uma melhoria, correção ou nova funcionalidade, siga estes passos:

1. Faça um **Fork** do repositório.
2. Crie uma branch para sua modificação (`git checkout -b feature/nova-funcionalidade`).
3. Realize o commit de suas alterações com mensagens claras e objetivas (`git commit -am 'feat: adiciona nova funcionalidade de segurança'`).
4. Envie sua branch para o repositório remoto (`git push origin feature/nova-funcionalidade`).
5. Abra um **Pull Request** detalhando as modificações para que nossa equipe técnica avalie.

---

## 📄 Licença

Este projeto está licenciado sob a Licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) (caso presente no repositório) para obter mais informações detalhadas.

---

## 👤 Autor

Desenvolvido com zelo técnico por **Luiz Gustavo**.

- Site Oficial:** [Vinc](https://ais-pre-vxglezchibg6wbuunkpezb-350713325872.us-west2.run.app)

- GitHub:** [@luizgteixeira](https://github.com/luizgteixeira)

- Contato Profissional:** [contato@luizgustavodev.com](mailto:contato@luizgustavodev.com)

---
*Vinc. Segurança Digital Jurídica © 2026. Todos os direitos reservados.*

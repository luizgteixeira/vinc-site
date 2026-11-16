# Vinc — Website Oficial & Centro de Conhecimento

O **Vinc** é um website institucional e informativo, acompanhado de um completo **Centro de Conhecimento Antifraude Jurídica**. Desenvolvido sob rigorosos padrões de usabilidade (UX), acessibilidade (a11y) e otimização para motores de busca (SEO), o site apresenta a plataforma Vinc ao mercado e educa advogados, escritórios e clientes finais sobre prevenção de fraudes virtuais jurídicas.

> **Vinc — confirme antes de confiar.**

<div align="center">
  <img src="assets/icons/vinc_icon_256px_1.png" alt="Vinc Logo" width="128" height="128" />
  <p><em>A vitrine digital e central de educação preventiva do Vinc, plataforma de blindagem contra engenharia social jurídica.</em></p>
</div>

<div align="center">

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=flat-square&logo=javascript&logoColor=black)
![SEO](https://img.shields.io/badge/SEO-Otimizado-brightgreen?style=flat-square)

</div>

---

## 📖 Sobre o Site

O site do **Vinc** serve como o ponto de contato primário entre escritórios de advocacia, clientes e a segurança jurídica digital. No cenário atual, criminosos virtuais utilizam informações públicas de diários oficiais para ludibriar clientes que possuem processos na Justiça. O site do Vinc combate essa engenharia social fornecendo:

1.  **Páginas Institucionais:** Explicando de forma clara e transparente a proposta do Vinc — validar o vínculo real entre cliente, contrato e advogado antes de qualquer interação sensível ser tratada como legítima.
2.  **Educação Antifraude (Blog):** Um hub de artigos práticos e dinâmicos para desarmar táticas de falsificação de identidade (WhatsApp), boletos falsificados e desvios de Pix.

> ⚠️ **Nota de precisão de conteúdo:** o texto institucional e o do blog passaram por uma revisão para remover alegações técnicas específicas que não haviam sido confirmadas (padrões de criptografia, certificações, integrações com cadastros externos). Prefira sempre a linguagem já revisada — "vínculo real registrado no painel", não "validação criptográfica" — ao escrever conteúdo novo.

---

## 🎨 Identidade Visual e Filosofia de Design

A interface do site baseia-se no **minimalismo suíço moderno**, projetado com extremo rigor estético para transmitir autoridade, sobriedade e segurança técnica:

-   **Paleta de Cores de Alta Confiança**: Tons neutros profundos (carvão), fundos off-white sofisticados e acentos em **Azul Profundo** (`#2563eb`), que simboliza estabilidade institucional. O **Vermelho Carmim** (`#e11d48`) é reservado exclusivamente para sinalização de perigos e alertas.
-   **Tipografia Selecionada**: Títulos dinâmicos e modernos estilizados com fontes geométricas elegantes, pareados com metadados e marcadores em fontes monoespaçadas ("JetBrains Mono") para uma estética polida de tecnologia confiável.
-   **Zero Poluição Visual (Anti-AI-Slop)**: O design evita elementos falsificados, logs de carregamento de mentira, status de simulação ou gráficos que não entreguem valor real. Toda a tela reflete o valor de um produto de software real de alta segurança.

---

## 📁 Estrutura Completa do Projeto

O Vinc é um site **100% estático** (HTML5, CSS3 e JavaScript puro, sem framework e sem dependências de npm). Não há build para desenvolver: abra um servidor estático e edite. No **deploy**, o GitHub Actions gera as páginas estáticas dos artigos, o pacote `content/posts.json` e o `sitemap.xml` (scripts em Node e Python, só com a biblioteca padrão):

```text
├── index.html                        # Página inicial (Landing Page) institucional do Vinc
│
├── pages/                            # Centro de páginas internas do ecossistema Vinc
│   ├── como-funciona.html            # Visão geral do fluxo operacional do Vinc
│   ├── advogados.html                # Soluções direcionadas para advogados autônomos e pequenas bancas
│   ├── escritorios.html              # Governança de marca e proteção para grandes escritórios
│   ├── clientes.html                 # Guia prático de usabilidade e blindagem para o cliente final
│   ├── recursos.html                 # Funcionalidades da plataforma (validação em duas vias, verificação de boletos)
│   ├── seguranca.html                # Pilares de segurança e conformidade com a LGPD
│   ├── faq.html                      # Central de Dúvidas Frequentes (com Schema.org FAQPage)
│   ├── contato.html                  # Canais oficiais, checklist antifraude e solicitação de chave de ativação
│   ├── privacidade.html              # Política de Privacidade (LGPD) — bases legais, operadores terceiros, direitos do titular
│   ├── obrigado.html                 # Confirmação pós-envio do formulário de contato (noindex; fora do sitemap)
│   ├── blog.html                     # Portal do Centro de Conhecimento (listagem de artigos)
│   └── artigo-detalhes.html          # Template do artigo (noindex): usado em dev local e como base das páginas estáticas blog/<slug>.html
│
├── css/                               # Arquitetura modular de estilos CSS (ITCSS-like)
│   ├── 1-settings/                    # Variáveis globais de design, reset e fontes tipográficas
│   ├── 2-components/                  # Componentes reutilizáveis (botões, cards, menus, accordions)
│   └── 3-pages/                       # Ajustes visuais específicos de cada página do ecossistema
│
├── js/                                 # Motores funcionais de interatividade do site
│   ├── script.js                       # Navegação, menu mobile, dropdowns e accordions (FAQ/Contato)
│   ├── contato.js                      # Envio do formulário de solicitação de chave (Web3Forms); em caso de sucesso, redireciona para obrigado.html
│   ├── blog-shared.js                  # Sem DOM: autores, categorias e funções que montam o HTML do artigo/sidebar/JSON-LD (usado no navegador e no Node)
│   └── blog.js                         # Motor do Blog client-side (busca os artigos via fetch, filtros, SEO dinâmico, JSON-LD, busca)
│
├── content/
│   └── posts/                          # Um arquivo JSON por artigo do blog (ver seção "Centro de Conhecimento")
│       ├── index.json                  # Lista os slugs dos artigos publicados, na ordem em que devem ser carregados
│       └── <slug>.json                 # Dados e conteúdo HTML de cada artigo
│
├── assets/                             # Biblioteca de mídias e recursos de marca do Vinc
│   ├── fonts/                          # Plus Jakarta Sans self-hosted (2 arquivos variáveis: normal e itálico, pesos 200–800); sem Google Fonts
│   ├── icons/                          # Logo e favicon do Vinc
│   └── images/                         # Ilustrações, banners de suporte, mockups de painéis e infográficos
│
├── scripts/
│   ├── build-articles.mjs              # Gera blog/<slug>.html (página estática de cada artigo: metas, JSON-LD, h1, corpo, sidebar); roda no deploy
│   ├── build-posts.py                  # Gera content/posts.json (pacote único dos artigos) e valida os JSON; roda no deploy
│   └── build-sitemap.py                # Gera sitemap.xml (canonicals das páginas + artigos, lastmod só onde é confiável); roda no deploy
│
├── blog/                               # (gerado no deploy; não versionado) Uma página estática por artigo: blog/<slug>.html
├── package.json                        # Só declara "type": "module" para o Node executar js/blog-shared.js e scripts/*.mjs; sem dependências
├── robots.txt                          # Diretivas para motores de busca
├── sitemap.xml                         # (gerado no deploy; não versionado) Mapa do site: páginas indexáveis + artigos
├── favicon.ico                         # Favicon na raiz (requisitado por padrão por navegadores e robôs)
└── .htaccess                           # Cabeçalhos de segurança (CSP, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy)
```

---

## ✍️ Centro de Conhecimento (Blog Dinâmico)

O blog do Vinc é controlado por um motor client-side (`js/blog.js`) que busca os artigos em `content/posts/*.json` via `fetch()`, organizado em **6 categorias editoriais** (5 delas com artigos publicados até o momento):

1.  **🚨 Anatomia de Golpes e Alertas**: As fraudes mais comuns (falso advogado no WhatsApp, uso de dados públicos reais, urgência artificial em torno de alvarás e precatórios).
2.  **🛡️ Gestão de Reputação para Advogados**: Como escritórios de advocacia podem proteger suas marcas contra o uso fraudulento de seus nomes.
3.  **⚙️ Tecnologia e Soberania de Dados**: O princípio Zero Trust e por que validar vínculo (cliente-contrato-advogado) é mais seguro que confiar num nome familiar no WhatsApp.
4.  **📖 Guia de Funcionalidades e Onboarding**: Passo a passo de como ativar o canal, convidar clientes e usar o painel administrativo.
5.  **🔒 Cibersegurança e Compliance (LGPD)**: Postura preventiva de privacidade e boas práticas alinhadas à LGPD.
6.  **🤝 Casos de Sucesso e Segurança Jurídica**: categoria reservada para estudos de caso; ainda sem artigos publicados.

### ⚙️ Recursos Tecnológicos Integrados no Blog:
-   **Índice de Conteúdo Automático (TOC)**: Geração e inserção em tempo real de uma lista de tópicos baseada nas tags `H2` de cada artigo, com links de rolagem suave.
-   **Tempo de Leitura Calculado**: Estimado a partir da contagem real de palavras de cada artigo (200 palavras/min), não um valor fixo por post — nunca fica desatualizado se o conteúdo for editado.
-   **Páginas estáticas por artigo**: no deploy, `scripts/build-articles.mjs` gera `blog/<slug>.html` com título, descrição, canonical, Open Graph, JSON-LD, `<h1>`, corpo, relacionados e sidebar **já no HTML** — links compartilhados no WhatsApp/LinkedIn mostram o artigo certo e o Google não depende de JavaScript. O código que monta o HTML é o mesmo do navegador (`js/blog-shared.js`), então a página estática e a dinâmica não divergem. O endereço antigo `pages/artigo-detalhes.html?slug=…` redireciona (301 no `.htaccess`, com redirecionamento em JS como reserva).
-   **SEO Dinâmico** (dev local e fallback): Injeção programática de metadados, títulos, tags Open Graph e **dados estruturados em JSON-LD** — `BlogPosting` em todo artigo, `BreadcrumbList` espelhando a navegação visual, `FAQPage` nos artigos que têm um bloco de perguntas frequentes no conteúdo, e `WebSite`/`SearchAction` em `index.html` habilitando a caixa de busca do Google.
-   **Busca Real via URL**: `blog.html?q=termo` já carrega com o filtro aplicado, e a URL é sincronizada enquanto o usuário digita — é o que sustenta o `SearchAction` acima.
-   **Navegação Semântica (Breadcrumbs)**: Facilitando a acessibilidade para leitores de tela e melhorando o rastreamento hierárquico do site.
-   **Malha de Links Relacionados**: Artigos complementares ao final de cada leitura e links cruzados entre posts de temas próximos, evitando páginas órfãs e canibalização de palavra-chave.
-   **Newsletter via Mailchimp**: Formulário integrado (barra lateral do blog e páginas de artigo) que envia a inscrição para o Mailchimp através de um iframe oculto, sem sair da página.
-   **Feedback de Artigo**: Avaliação, temas de interesse e comentário livre ao final de cada artigo, enviados via Web3Forms.

### ✏️ Como Publicar um Novo Artigo

Nenhum código precisa ser alterado para adicionar um artigo novo:

1.  Crie `content/posts/<slug-do-artigo>.json` usando um artigo existente como modelo. Campos esperados: `id`, `title`, `slug`, `excerpt`, `categoryKey` (uma das chaves de `CATEGORIES` em `js/blog.js`, ex.: `ANATOMIA_GOLPES`), `publishedAt`, `authorKey` (chave de `AUTHORS` em `js/blog.js`), `featuredImage`, `tags`, `faq` (opcional) e `content` (HTML do corpo do artigo), além do bloco `seo` (`metaTitle`, `metaDesc`).
2.  Adicione o slug em `content/posts/index.json`.
3.  Nada a fazer no `sitemap.xml` nem na página do artigo: no deploy são gerados `blog/<slug>.html` e o sitemap com todo slug listado em `index.json`. O `slug` não pode coincidir com o nome de uma página de `pages/` (o build falha se coincidir).
4.  Para pré-visualizar a página estática localmente: `node scripts/build-articles.mjs` e abra `/blog/<slug>.html` (a pasta `blog/` é ignorada pelo Git).

A ordem de exibição (mais recente primeiro) é calculada automaticamente a partir de `publishedAt` — a ordem dentro de `index.json` não importa.

**Data de atualização (opcional):** se você revisar um artigo de forma relevante, adicione `"updatedAt": "DD Mmm AAAA"` (mesmo formato de `publishedAt`, ex.: `"20 Nov 2026"`) ao JSON. Ela vira o `<lastmod>` do sitemap e o `dateModified` do JSON-LD do artigo. Sem o campo, vale `publishedAt`.

**Pacote único (`content/posts.json`):** a cada deploy, o workflow roda `scripts/build-posts.py`, que junta todos os artigos listados em `index.json` num único arquivo. Assim o blog carrega tudo em **1 requisição** em vez de 14. O arquivo é gerado, não versionado (`.gitignore`) e não precisa de nenhuma ação sua. O script também valida os artigos (slug igual ao nome do arquivo, campos obrigatórios, slugs repetidos), e o deploy falha se algo estiver errado. Para testar localmente: `python3 scripts/build-posts.py`. Sem o pacote, o blog continua funcionando, carregando os arquivos um a um.

---

## 🛠️ Como Visualizar e Executar o Site

Como o site é construído em HTML5, CSS3 e JavaScript estáticos — sem build step, sem framework e sem dependências —, ele roda diretamente nos navegadores de forma leve e rápida.

### Execução Simples
Basta abrir o arquivo `index.html` (na raiz do projeto) em qualquer navegador web de sua preferência. As páginas institucionais funcionam normalmente assim.

### Execução via Servidor Local (obrigatória para o Blog)
O Blog (`pages/blog.html` e `pages/artigo-detalhes.html`) busca os artigos dinamicamente em `content/posts/*.json` via `fetch()`. Navegadores bloqueiam esse tipo de requisição quando a página é aberta direto do disco (`file://`) — por isso essas duas páginas **precisam** ser servidas por HTTP. Qualquer servidor estático simples resolve:

```bash
# Com Python 3
python -m http.server 8080

# Ou com a extensão Live Server do VS Code
```

Depois acesse `http://localhost:8080` no navegador.

---

## 📱 Responsividade e Acessibilidade (UX)

O site do Vinc foi minuciosamente revisado para garantir a melhor experiência em qualquer dispositivo:
-   **Contraste e Legibilidade**: Combinações cromáticas em conformidade com as diretrizes do WCAG para leitura agradável e sem fadiga visual.
-   **Layout Mobile-First**: Menus de navegação suspensos, tabelas informativas, botões e cards de artigos que se adaptam fluidamente a smartphones e tablets.
-   **Foco na Usabilidade**: Links intuitivos, estrutura de tópicos bem hierarquizada e navegação rápida por categorias.
-   **Teclado**: link "Pular para o conteúdo" como primeiro foco de toda página (`.skip-link`, destino `<main id="conteudo-principal">`); submenus abrem com o foco (Tab) e fecham com Escape.
-   **Movimento reduzido**: `@media (prefers-reduced-motion: reduce)` em `css/1-settings/global.css` desliga animações e transições; a rolagem suave do blog (`js/blog.js`) também respeita a preferência.
-   **Hierarquia de títulos**: um único `<h1>` por página e nenhum nível pulado (h1 → h2 → h3), inclusive nos trechos gerados por `js/blog.js`. Ao criar conteúdo novo, escolha o nível pela estrutura e ajuste a aparência no CSS, não pela tag. Cuidado: `h2` tem estilo global (`letter-spacing`, `line-height`), então uma regra de classe para um `<h2>` deve defini-los.

---

## 🔐 Privacidade e LGPD

O site publica dados pessoais tratados de forma transparente em `pages/privacidade.html`: quais dados são coletados (formulário de solicitação de chave, newsletter, feedback de artigo), a base legal de cada tratamento, os operadores terceiros envolvidos (Web3Forms e Mailchimp, ambos com transferência internacional declarada) e os direitos do titular. O Vinc atua hoje como pessoa física (sem CNPJ constituído), identificação refletida na própria política.

> A revisão jurídica formal dessa política por um advogado ainda está pendente — trate o texto como um rascunho tecnicamente fundamentado, não como parecer jurídico validado.

---

## 👤 Autor

Criado e mantido por **Luiz Gustavo**, desenvolvedor web e mobile — idealizador e único responsável pelo projeto Vinc até o momento.

-   **Website do Autor**: [luizgustavodev.com](https://luizgustavodev.com)
-   **Website Oficial do Vinc**: [vincapp.com.br](https://www.vincapp.com.br)
-   **GitHub**: [@luizgteixeira](https://github.com/luizgteixeira)
-   **E-mail de Contato**: [contato@vincapp.com.br](mailto:contato@vincapp.com.br)

---
*Vinc. Segurança Digital Jurídica © 2026. Todos os direitos reservados.*

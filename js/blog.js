/**
 * ==========================================================================
 * JS: SISTEMA DE BLOG DO VINC (CENTRO DE CONHECIMENTO ANTIFRAUDE)
 * ==========================================================================
 * Este script gerencia toda a lógica de funcionamento do blog do Vinc.
 * Os artigos em si NÃO ficam neste arquivo — cada um é um JSON em
 * content/posts/<slug>.json, listado em content/posts/index.json.
 * Este script controla:
 * 1. Carregamento assíncrono dos artigos (fetch) e montagem do catálogo em memória.
 * 2. Listagem de posts, destaque dinâmico e filtragem inteligente (busca + categorias).
 * 3. Detalhamento de artigos com SEO dinâmico, meta tags e dados estruturados (JSON-LD).
 * 4. Geração automática e dinâmica do Índice de Conteúdo (Table of Contents) baseado em tags H2.
 * 5. Barra lateral (sidebar) responsiva com posts populares, contagem por categorias e nuvem de tags.
 * 6. Inscrição de newsletter integrada ao Mailchimp (envio real via formulário oculto).
 *
 */

// --------------------------------------------------------------------------
// AUTORES DO BLOG
// --------------------------------------------------------------------------
const AUTHORS = {
  luiz_gustavo: {
    name: 'Luiz Gustavo',
    avatarUrl: '../assets/images/luiz-gustavo-avatar.jpg',
    role: 'Desenvolvedor Web e Mobile',
    bio: 'Co-fundador do Vinc, desenvolvedor responsável por construir a plataforma que conecta advogados e clientes com segurança.',
  },
};

// --------------------------------------------------------------------------
// CATEGORIAS DO NOVO MODELO EDITORIAL (Mapeamento de Metadados)
// --------------------------------------------------------------------------
const CATEGORIES = {
  ANATOMIA_GOLPES: {
    name: 'Anatomia de Golpes e Alertas',
    slug: 'anatomia-golpes',
    description:
      'Educação preventiva para identificar e desarmar golpes de engenharia social.',
    icon: '🚨',
    color: '#e11d48', // Vermelho/Laranja Carmim para Alertas
  },
  GESTAO_REPUTACAO: {
    name: 'Gestão de Reputação para Advogados',
    slug: 'gestao-reputacao',
    description:
      'Estratégias para proteger a identidade digital profissional e a confiança do cliente.',
    icon: '🛡️',
    color: '#2563eb', // Azul Profundo para Confiança
  },
  TECNOLOGIA_DADOS: {
    name: 'Tecnologia e Soberania de Dados',
    slug: 'tecnologia-dados',
    description:
      'Detalhamento acessível sobre criptografia, segurança e arquitetura de dados.',
    icon: '⚙️',
    color: '#0d9488', // Verde Azulado para Tecnologia
  },
  GUIA_FUNCIONALIDADES: {
    name: 'Guia de Funcionalidades e Onboarding',
    slug: 'guia-funcionalidades',
    description:
      'Manuais passo a passo para extrair o máximo de segurança da plataforma Vinc.',
    icon: '📖',
    color: '#d97706', // Âmbar para Educação Operacional
  },
  CIBERSEGURANCA_COMPLIANCE: {
    name: 'Cibersegurança e Compliance (LGPD)',
    slug: 'ciberseguranca-compliance',
    description:
      'Conformidade jurídica, governança de privacidade e as melhores práticas digitais.',
    icon: '🔒',
    color: '#4f46e5', // Índigo para Compliance
  },
  CASOS_SUCESSO: {
    name: 'Casos de Sucesso e Segurança Jurídica',
    slug: 'casos-sucesso',
    description:
      'Histórias e análises baseadas em simulações e dados anonimizados de segurança real.',
    icon: '🤝',
    color: '#16a34a', // Verde Esmeralda para Sucesso
  },
};

// --------------------------------------------------------------------------
// BANCO DE DADOS DE ARTIGOS
// --------------------------------------------------------------------------
// Cada artigo vive em seu próprio arquivo JSON dentro de content/posts/,
// listado em content/posts/index.json. Para publicar um artigo novo:
// 1. Crie content/posts/<slug>.json (copie um existente como modelo).
// 2. Adicione o slug em content/posts/index.json.
// Nenhum código precisa ser alterado para isso.
let BLOG_POSTS = [];

/**
 * Resolve categoryKey/authorKey (referências leves salvas no JSON) nos
 * objetos completos de CATEGORIES/AUTHORS, no mesmo formato que o resto
 * do blog.js sempre esperou (post.category, post.author.name, etc.).
 */
function normalizePost(raw) {
  const category = CATEGORIES[raw.categoryKey];
  const author = AUTHORS[raw.authorKey];

  return {
    ...raw,
    category: category.name,
    categorySlug: category.slug,
    categoryIcon: category.icon,
    categoryColor: category.color,
    author,
  };
}

/**
 * Busca o índice de artigos e cada JSON individual em content/posts/.
 * Precisa ser servido via HTTP (não funciona abrindo o HTML direto com
 * file://) — ver instruções de execução local no README.
 */
async function loadBlogPosts() {
  const indexResponse = await fetch('../content/posts/index.json');
  if (!indexResponse.ok) {
    throw new Error('Não foi possível carregar content/posts/index.json');
  }
  const slugs = await indexResponse.json();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const response = await fetch(`../content/posts/${slug}.json`);
      if (!response.ok) {
        throw new Error(`Não foi possível carregar o artigo "${slug}"`);
      }
      return normalizePost(await response.json());
    })
  );

  BLOG_POSTS = posts;
}

// --------------------------------------------------------------------------
// LÓGICA DE GERENCIAMENTO DE ESTADO E RENDERIZAÇÃO DO BLOG (LISTAGEM)
// --------------------------------------------------------------------------
let activeCategory = 'Todos';
let searchQuery = '';

/**
 * Filtra e renderiza os artigos na listagem principal do blog
 * Com suporte às novas cores, ícones e tags personalizadas.
 */
function renderBlogPosts() {
  const postsContainer = document.getElementById('blog-posts-container');
  const featuredContainer = document.getElementById('featured-post-container');
  if (!postsContainer) return; // Se não estiver na página de listagem, sai da função

  // Filtragem dos posts ativos com base na categoria e termo de pesquisa,
  // sempre ordenados do mais recente para o mais antigo (post.publishedAt)
  const filtered = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      activeCategory === 'Todos' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase() === searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort(
    (a, b) =>
      new Date(parsePublishedAtToISO(b.publishedAt)) -
      new Date(parsePublishedAtToISO(a.publishedAt))
  );

  const isFiltering = activeCategory !== 'Todos' || searchQuery !== '';

  // Estado vazio de busca
  if (filtered.length === 0) {
    if (featuredContainer) featuredContainer.style.display = 'none';
    postsContainer.innerHTML = `
      <div class="empty-state" id="blog-empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>Nenhum artigo encontrado</h3>
        <p>Tente alterar as palavras-chave ou selecionar outra categoria.</p>
      </div>
    `;
    return;
  }

  let postsToGrid = [...filtered];

  // Renderização do Artigo Destaque Superior (somente quando não estiver aplicando filtros)
  if (!isFiltering && featuredContainer) {
    featuredContainer.style.display = 'block';
    const featuredPost = filtered[0];
    postsToGrid = filtered.slice(1); // O restante dos artigos vai para a grade (grid)

    featuredContainer.innerHTML = `
      <article class="featured-card" id="featured-card-item">
        <a href="artigo-detalhes.html?slug=${featuredPost.slug}" class="featured-img-link" aria-label="Ler artigo em destaque: ${featuredPost.title}">
          <img src="${featuredPost.featuredImage}" alt="Capa: ${featuredPost.title}" class="featured-img">
        </a>
        <div class="featured-content">
          <div class="meta-info">
            <span class="blog-badge" style="background-color: ${featuredPost.categoryColor}15; color: ${featuredPost.categoryColor}; border-left: 2px solid ${featuredPost.categoryColor};">
              ${featuredPost.categoryIcon} ${featuredPost.category}
            </span>
            <span>${featuredPost.publishedAt}</span>
            <span>•</span>
            <span>${getReadingTime(featuredPost)} min de leitura</span>
          </div>
          <h2 class="featured-title">
            <a href="artigo-detalhes.html?slug=${featuredPost.slug}">${featuredPost.title}</a>
          </h2>
          <p class="featured-excerpt">${featuredPost.excerpt}</p>
          <div class="featured-footer">
            <div class="author-info">
              <img src="${featuredPost.author.avatarUrl}" alt="Avatar de ${featuredPost.author.name}" class="author-avatar" width="36" height="36">
              <div>
                <span class="author-name" style="display: block;">${featuredPost.author.name}</span>
                <span style="font-size: 11px; color: var(--text-secondary); font-weight: 300;">${featuredPost.author.role}</span>
              </div>
            </div>
            <a href="artigo-detalhes.html?slug=${featuredPost.slug}" class="btn-primary btn-small" id="btn-read-featured">Ler artigo</a>
          </div>
        </div>
      </article>
    `;
  } else if (featuredContainer) {
    featuredContainer.style.display = 'none';
  }

  // Renderização da grade de artigos (Grid responsivo)
  postsContainer.innerHTML = `
    <div class="articles-grid" id="articles-grid-container">
      ${postsToGrid
        .map(
          (post) => `
        <article class="article-card" id="article-card-${post.id}">
          <a href="artigo-detalhes.html?slug=${post.slug}" class="article-img-link" aria-label="Ler artigo: ${post.title}">
            <img src="${post.featuredImage}" alt="Capa: ${post.title}" class="article-img" loading="lazy">
          </a>
          <div class="article-content">
            <div class="meta-info">
              <span class="blog-badge" style="background-color: ${post.categoryColor}15; color: ${post.categoryColor}; border-left: 2px solid ${post.categoryColor}; padding: 3px 8px; font-size: 11px;">
                ${post.categoryIcon} ${post.category}
              </span>
              <span>${post.publishedAt}</span>
              <span>•</span>
              <span>${getReadingTime(post)} min de leitura</span>
            </div>
            <h3 class="article-title">
              <a href="artigo-detalhes.html?slug=${post.slug}">${post.title}</a>
            </h3>
            <p class="article-excerpt">${post.excerpt}</p>
            <div class="article-footer">
              <div class="author-info">
                <img src="${post.author.avatarUrl}" alt="Avatar de ${post.author.name}" class="author-avatar" width="28" height="28" loading="lazy">
                <span class="author-name" style="font-size: 13px;">${post.author.name}</span>
              </div>
              <a href="artigo-detalhes.html?slug=${post.slug}" class="btn-secondary btn-small" style="padding: 6px 14px; font-size: 13px;" id="btn-read-more-${post.id}">Ler mais</a>
            </div>
          </div>
        </article>
      `
        )
        .join('')}
    </div>
  `;
}

/**
 * Inicializa os botões de filtro superior das categorias e o input de busca
 */
function initBlogControls() {
  const categoryContainer = document.getElementById('category-filters-wrap');
  const searchInput = document.getElementById('blog-search-input');

  if (categoryContainer) {
    // Monta a estrutura de pílulas incluindo o ícone de cada categoria
    categoryContainer.innerHTML = `
      <button class="category-btn ${activeCategory === 'Todos' ? 'active' : ''}" data-category="Todos">🏷️ Todos</button>
      ${Object.values(CATEGORIES)
        .map(
          (cat) => `
        <button class="category-btn ${cat.name === activeCategory ? 'active' : ''}" data-category="${cat.name}">
          <span style="color: ${cat.color}; margin-right: 4px;">${cat.icon}</span> ${cat.name}
        </button>
      `
        )
        .join('')}
    `;

    categoryContainer.querySelectorAll('.category-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        categoryContainer
          .querySelectorAll('.category-btn')
          .forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category');
        renderBlogPosts();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderBlogPosts();

      // Mantém a URL sincronizada com a busca, para o resultado ser
      // compartilhável/favoritável (e para o link do SearchAction funcionar de fato)
      const url = new URL(window.location.href);
      if (searchQuery) {
        url.searchParams.set('q', searchQuery);
      } else {
        url.searchParams.delete('q');
      }
      history.replaceState(null, '', url);
    });
  }
}

// --------------------------------------------------------------------------
// LÓGICA DE DETALHES DO ARTIGO (SEO + GERAÇÃO DINÂMICA DE ÍNDICE)
// --------------------------------------------------------------------------

/**
 * Carrega e injeta dinamicamente o artigo detalhado, atualizando os metadados de SEO
 * e gerando automaticamente o Índice de Conteúdo (Table of Contents) do artigo.
 */
function loadSinglePost() {
  const singlePostContainer = document.getElementById('single-post-container');
  if (!singlePostContainer) return; // Se não estiver na página de artigo-detalhes, sai

  // Extrai o parâmetro slug da URL
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    renderSinglePostNotFound();
    return;
  }

  // Busca o post no banco local correspondente ao slug
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    renderSinglePostNotFound();
    return;
  }

  // 1. Atualizar Tags de SEO e Metadados dinamicamente para melhor indexação
  // Usa seo.metaTitle (dimensionado para o limite do SERP, ~50-60 caracteres),
  // não post.title (o título editorial completo, que pode passar de 100
  // caracteres e ser truncado pelo Google).
  document.title = post.seo.metaTitle;

  let metaDescTag = document.querySelector('meta[name="description"]');
  if (metaDescTag) {
    metaDescTag.setAttribute('content', post.seo.metaDesc);
  } else {
    metaDescTag = document.createElement('meta');
    metaDescTag.setAttribute('name', 'description');
    metaDescTag.setAttribute('content', post.seo.metaDesc);
    document.head.appendChild(metaDescTag);
  }

  // Atualizar Canonical: cada artigo precisa da sua própria URL canônica
  // (slug incluído), senão o Google entende todos os artigos como duplicatas
  // da mesma URL sem slug e deixa de indexar a maioria deles.
  const canonicalUrl = `https://www.vincapp.com.br/pages/artigo-detalhes.html?slug=${post.slug}`;
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (canonicalTag) {
    canonicalTag.setAttribute('href', canonicalUrl);
  } else {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    canonicalTag.setAttribute('href', canonicalUrl);
    document.head.appendChild(canonicalTag);
  }

  // Crawlers de preview (WhatsApp, LinkedIn, Slack) exigem URL absoluta em og:image/twitter:image
  const absoluteImageUrl = post.featuredImage.replace(
    '../',
    'https://www.vincapp.com.br/'
  );

  // Atualizar Open Graph (Facebook, WhatsApp, LinkedIn)
  updateMetaTag('property', 'og:title', post.seo.metaTitle);
  updateMetaTag('property', 'og:description', post.seo.metaDesc);
  updateMetaTag('property', 'og:url', canonicalUrl);
  updateMetaTag('property', 'og:image', absoluteImageUrl);

  // Atualizar Twitter / X Cards
  updateMetaTag('name', 'twitter:title', post.seo.metaTitle);
  updateMetaTag('name', 'twitter:description', post.seo.metaDesc);
  updateMetaTag('name', 'twitter:image', absoluteImageUrl);

  // Injetar dados estruturados JSON-LD do Schema.org para indexação do Google
  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: [absoluteImageUrl],
    datePublished: parsePublishedAtToISO(post.publishedAt),
    author: [
      {
        '@type': 'Person',
        name: post.author.name,
        jobTitle: post.author.role,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Vinc',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.vincapp.com.br/assets/icons/vinc_icon_256px_1.png',
      },
    },
    description: post.seo.metaDesc,
    articleBody: post.content.replace(/<[^>]*>/g, ''), // Remove HTML para gerar texto cru para o buscador
  });
  document.head.appendChild(schemaScript);

  // Injetar Schema.org BreadcrumbList, espelhando a trilha visual (Início > Blog > Categoria)
  const breadcrumbSchema = document.createElement('script');
  breadcrumbSchema.type = 'application/ld+json';
  breadcrumbSchema.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: 'https://www.vincapp.com.br/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.vincapp.com.br/pages/blog.html',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.category,
        item: canonicalUrl,
      },
    ],
  });
  document.head.appendChild(breadcrumbSchema);

  // Injetar Schema.org FAQPage apenas nos posts que têm um bloco de FAQ real no conteúdo
  if (post.faq && post.faq.length > 0) {
    const faqSchema = document.createElement('script');
    faqSchema.type = 'application/ld+json';
    faqSchema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
    document.head.appendChild(faqSchema);
  }

  // 2. Renderizar o layout básico do post
  singlePostContainer.innerHTML = `
    <!-- Link de retorno para a listagem -->
    <a href="blog.html" class="back-to-blog" id="btn-back-to-blog">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Voltar para o Blog
    </a>

    <!-- Navegação em Breadcrumbs (Acessibilidade e SEO) -->
    <nav class="breadcrumbs" aria-label="Navegação de trilha (Breadcrumbs)" id="post-breadcrumbs">
      <a href="../index.html">Início</a>
      <span class="breadcrumbs-separator">/</span>
      <a href="blog.html">Blog</a>
      <span class="breadcrumbs-separator">/</span>
      <span class="breadcrumbs-current" style="color: ${post.categoryColor}; font-weight: 700;">${post.category}</span>
    </nav>

    <!-- Cabeçalho Principal do Artigo -->
    <header class="post-header" id="post-title-header">
      <div class="post-header-meta">
        <span class="blog-badge" style="background-color: ${post.categoryColor}15; color: ${post.categoryColor}; border-left: 2px solid ${post.categoryColor};">
          ${post.categoryIcon} ${post.category}
        </span>
        <span style="color: var(--text-secondary); font-size: 14px;">${post.publishedAt}</span>
        <span style="color: var(--border);">|</span>
        <span style="color: var(--text-secondary); font-size: 14px;">${getReadingTime(post)} min de leitura</span>
      </div>
      <h1 class="post-title" id="post-main-title">${post.title}</h1>
    </header>

    <!-- Capa do Artigo -->
    <div class="post-cover-wrap" id="post-cover-image">
      <img src="${post.featuredImage}" alt="Capa: ${post.title}" class="post-cover">
    </div>

    <!-- Corpo de Texto do Artigo -->
    <article class="post-body" id="post-text-body">
      ${post.content}
    </article>

    <!-- Assinatura de fechamento, única para todos os artigos (antes duplicada em 6 deles) -->
    <div class="post-signature" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: var(--text-primary);">Vinc — confirme antes de confiar.</p>
      <p style="margin: 0; font-style: italic; color: var(--text-secondary); font-size: 14px;">Desenvolvido com foco total em soberania tecnológica e segurança jurídica.</p>
    </div>

    <!-- Seção de Interação / Feedback (Fase 1) -->
    <section class="post-interaction-box" id="post-feedback-section" aria-labelledby="feedback-section-title">
      <h3 class="interaction-heading" id="feedback-section-title">📬 Compartilhe sua Opinião</h3>

      <form id="feedback-interaction-form" onsubmit="event.preventDefault();">
        <!-- ETAPA 1 — Avaliação do artigo -->
        <fieldset style="border: none; padding: 0; margin: 0 0 24px 0;">
          <legend class="interaction-subheading" style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">Este artigo foi útil?</legend>
          <div class="rating-options" role="radiogroup" aria-label="Avaliação do artigo">
            <button type="button" class="rating-btn" data-rating="very-useful" role="radio" aria-checked="false" aria-label="Muito útil">
              <span class="emoji" aria-hidden="true">👍</span>
              <span>Muito útil</span>
            </button>
            <button type="button" class="rating-btn" data-rating="useful" role="radio" aria-checked="false" aria-label="Útil">
              <span class="emoji" aria-hidden="true">🙂</span>
              <span>Útil</span>
            </button>
            <button type="button" class="rating-btn" data-rating="so-so" role="radio" aria-checked="false" aria-label="Mais ou menos">
              <span class="emoji" aria-hidden="true">😐</span>
              <span>Mais ou menos</span>
            </button>
            <button type="button" class="rating-btn" data-rating="not-helpful" role="radio" aria-checked="false" aria-label="Não ajudou">
              <span class="emoji" aria-hidden="true">👎</span>
              <span>Não ajudou</span>
            </button>
          </div>
          <div id="rating-feedback-msg" class="feedback-message" style="display: none;" aria-live="polite"></div>
        </fieldset>

        <!-- ETAPA 2 — Interesse em novos conteúdos -->
        <fieldset style="border: none; padding: 0; margin: 0 0 24px 0;">
          <legend class="interaction-subheading" style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">Gostaria de ler mais conteúdos sobre:</legend>
          <div class="topics-grid" id="topics-selection-grid">
            <label class="topic-label" id="label-golpes">
              <input type="checkbox" name="topics" value="Golpes digitais" id="checkbox-golpes">
              <span>Golpes digitais</span>
            </label>
            <label class="topic-label" id="label-seguranca">
              <input type="checkbox" name="topics" value="Segurança Jurídica" id="checkbox-seguranca">
              <span>Segurança Jurídica</span>
            </label>
            <label class="topic-label" id="label-lgpd">
              <input type="checkbox" name="topics" value="LGPD" id="checkbox-lgpd">
              <span>LGPD</span>
            </label>
            <label class="topic-label" id="label-ia">
              <input type="checkbox" name="topics" value="Inteligência Artificial" id="checkbox-ia">
              <span>Inteligência Artificial</span>
            </label>
            <label class="topic-label" id="label-escritorios">
              <input type="checkbox" name="topics" value="Escritórios de Advocacia" id="checkbox-escritorios">
              <span>Escritórios de Advocacia</span>
            </label>
            <label class="topic-label" id="label-clientes">
              <input type="checkbox" name="topics" value="Clientes" id="checkbox-clientes">
              <span>Clientes</span>
            </label>
            <label class="topic-label" id="label-advogados">
              <input type="checkbox" name="topics" value="Advogados" id="checkbox-advogados">
              <span>Advogados</span>
            </label>
            <label class="topic-label" id="label-engenharia">
              <input type="checkbox" name="topics" value="Engenharia Social" id="checkbox-engenharia">
              <span>Engenharia Social</span>
            </label>
            <label class="topic-label" id="label-seguranca-dig">
              <input type="checkbox" name="topics" value="Segurança Digital" id="checkbox-seguranca-dig">
              <span>Segurança Digital</span>
            </label>
            <label class="topic-label" id="label-outros">
              <input type="checkbox" name="topics" value="Outros" id="checkbox-outros">
              <span>Outros</span>
            </label>
          </div>
          <div id="topics-feedback-msg" class="feedback-message" style="display: none;" aria-live="polite"></div>
        </fieldset>

        <!-- ETAPA 3 — Sugestão de temas -->
        <div class="suggestions-box">
          <label for="suggestion-text" class="interaction-subheading" style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; display: block;">Sugestões ou Comentários (Opcional)</label>
          <textarea id="suggestion-text" class="suggestions-textarea" placeholder="Conte para nós suas sugestões de temas, comentários sobre o blog (ex: frequência de posts) ou feedbacks gerais." aria-label="Sua sugestão de temas ou comentários para o blog"></textarea>
          <p class="form-privacy-note">Este botão envia também a avaliação e os temas selecionados acima, se houver. Ao enviar, você concorda com nossa <a href="privacidade.html">Política de Privacidade</a>.</p>
          <button type="button" class="btn-primary btn-submit-suggestion" id="btn-send-suggestion">Enviar feedback</button>
          <div id="suggestion-feedback-msg" class="feedback-message" style="display: none;" aria-live="polite"></div>
        </div>
      </form>
    </section>

    <!-- Caixa de Apresentação de Autor -->
    <section class="post-author-box" aria-labelledby="author-heading" id="post-author-section">
      <img src="${post.author.avatarUrl}" alt="Foto de ${post.author.name}" class="post-author-avatar" width="80" height="80">
      <div class="post-author-info">
        <h4 id="author-heading" style="margin: 0 0 4px 0;">${post.author.name}</h4>
        <p class="post-author-role">${post.author.role}</p>
        <p class="post-author-bio">${post.author.bio}</p>
      </div>
    </section>

    <!-- Artigos Relacionados (Sempre linkados para evitar posts isolados) -->
    <section class="related-posts" aria-labelledby="related-heading" id="post-related-section">
      <h3 class="related-title" id="related-heading">Artigos Relacionados</h3>
      <div class="articles-grid" id="related-articles-grid">
        ${renderRelatedPostsMarkup(post)}
      </div>
    </section>
  `;

  // 3. Geração Automática do Índice de Conteúdo (Table of Contents - TOC)
  const postBody = document.getElementById('post-text-body');
  if (postBody) {
    const headings = postBody.querySelectorAll('h2');
    if (headings.length > 0) {
      const tocContainer = document.createElement('div');
      tocContainer.className = 'post-toc';
      tocContainer.innerHTML = `
        <h4 class="toc-title">📍 Índice do Artigo</h4>
        <ul class="toc-list">
          ${Array.from(headings)
            .map((h, index) => {
              const headingId = `topico-${index + 1}`;
              h.id = headingId; // Seta o id dinâmico no elemento H2 do texto
              return `
              <li>
                <a href="#${headingId}" class="toc-link">
                  <span class="toc-bullet">▶</span> ${h.textContent}
                </a>
              </li>
            `;
            })
            .join('')}
        </ul>
      `;
      // Injeta o Índice de Conteúdo logo no topo do texto do artigo para melhorar UX
      postBody.insertBefore(tocContainer, postBody.firstChild);
    }
  }

  // Inicializa os event listeners do bloco de feedback/interação (Fase 1)
  initFeedbackSection(post);
}

/**
 * Inicializa a seção de feedback interativo do artigo
 * Avaliação e temas só marcam estado local (feedback visual imediato); o envio
 * real para o Vinc acontece uma única vez, no clique de "Enviar feedback",
 * via Web3Forms (mesmo serviço já usado no formulário de contato).
 */
function initFeedbackSection(post) {
  const postTitle = post.title;
  const ratingButtons = document.querySelectorAll('.rating-btn');
  const checkboxes = document.querySelectorAll(
    '.topic-label input[type="checkbox"]'
  );
  const sendSuggestionBtn = document.getElementById('btn-send-suggestion');
  const suggestionTextarea = document.getElementById('suggestion-text');

  // Elementos de mensagem de feedback
  const ratingFeedbackMsg = document.getElementById('rating-feedback-msg');
  const topicsFeedbackMsg = document.getElementById('topics-feedback-msg');
  const suggestionFeedbackMsg = document.getElementById(
    'suggestion-feedback-msg'
  );

  let selectedRatingLabel = null;

  // 1. Avaliação (Etapa 1): só estado visual local por enquanto
  ratingButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      ratingButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      selectedRatingLabel = btn.innerText.trim().replace(/\s+/g, ' ');

      if (ratingFeedbackMsg) {
        ratingFeedbackMsg.style.display = 'flex';
        ratingFeedbackMsg.className = 'feedback-message info';
        ratingFeedbackMsg.innerHTML =
          'Avaliação registrada. Clique em "Enviar feedback" ao final para confirmar o envio.';
      }
    });
  });

  // 2. Temas de interesse (Etapa 2): idem, só estado visual local
  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const parentLabel = cb.closest('.topic-label');
      parentLabel.classList.toggle('checked', cb.checked);

      const selectedCount = Array.from(checkboxes).filter(
        (c) => c.checked
      ).length;
      if (topicsFeedbackMsg) {
        if (selectedCount === 0) {
          topicsFeedbackMsg.style.display = 'none';
        } else {
          topicsFeedbackMsg.style.display = 'flex';
          topicsFeedbackMsg.className = 'feedback-message info';
          topicsFeedbackMsg.innerHTML = `📌 ${selectedCount} tema(s) selecionado(s). Clique em "Enviar feedback" ao final para confirmar o envio.`;
        }
      }
    });
  });

  // 3. Envio real (Etapa 3): consolida avaliação + temas + comentário e envia via Web3Forms
  if (sendSuggestionBtn && suggestionTextarea) {
    sendSuggestionBtn.addEventListener('click', async () => {
      const text = suggestionTextarea.value.trim();
      const selectedTopics = Array.from(checkboxes)
        .filter((c) => c.checked)
        .map((c) => c.value);

      if (!selectedRatingLabel && selectedTopics.length === 0 && !text) {
        if (suggestionFeedbackMsg) {
          suggestionFeedbackMsg.style.display = 'flex';
          suggestionFeedbackMsg.className = 'feedback-message error';
          suggestionFeedbackMsg.innerHTML =
            'Selecione uma avaliação, um tema de interesse ou escreva algo antes de enviar.';
        }
        return;
      }

      sendSuggestionBtn.disabled = true;
      if (suggestionFeedbackMsg) {
        suggestionFeedbackMsg.style.display = 'flex';
        suggestionFeedbackMsg.className = 'feedback-message';
        suggestionFeedbackMsg.innerHTML = 'Enviando...';
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: '58f9c5cc-4b90-44bd-b4be-2524d364115d',
            subject: `Feedback do Blog Vinc - Artigo: ${postTitle}`,
            artigo: postTitle,
            avaliacao: selectedRatingLabel || 'Não informada',
            temas_de_interesse:
              selectedTopics.length > 0
                ? selectedTopics.join(', ')
                : 'Nenhum tema selecionado',
            sugestao_ou_comentario:
              text || 'Nenhuma sugestão ou comentário enviado',
          }),
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Falha no envio.');
        }

        if (suggestionFeedbackMsg) {
          suggestionFeedbackMsg.className = 'feedback-message success';
          suggestionFeedbackMsg.innerHTML =
            '🎉 Feedback enviado com sucesso. Obrigado pela sua contribuição!';
        }
        suggestionTextarea.value = '';
      } catch (error) {
        if (suggestionFeedbackMsg) {
          suggestionFeedbackMsg.className = 'feedback-message error';
          suggestionFeedbackMsg.innerHTML =
            'Não foi possível enviar seu feedback agora. Tente novamente em instantes ou <a href="mailto:contato@vincapp.com.br">escreva diretamente para nós</a>.';
        }
      } finally {
        sendSuggestionBtn.disabled = false;
      }
    });
  }
}

/**
 * Auxiliar para atualizar tags meta dinâmicas de SEO
 */
// Converte datas no formato exibido "DD Mon YYYY" (ex.: "15 Jul 2026") para
// ISO 8601, exigido pelo campo datePublished do Schema.org.
const PT_BR_MONTHS = {
  jan: '01',
  fev: '02',
  mar: '03',
  abr: '04',
  mai: '05',
  jun: '06',
  jul: '07',
  ago: '08',
  set: '09',
  out: '10',
  nov: '11',
  dez: '12',
};

function parsePublishedAtToISO(publishedAt) {
  const [day, month, year] = publishedAt.split(' ');
  const monthNumber = PT_BR_MONTHS[month.toLowerCase()];
  return `${year}-${monthNumber}-${day.padStart(2, '0')}T09:00:00-03:00`;
}

// Calcula o tempo de leitura a partir do conteúdo real do post (200 palavras/min,
// padrão editorial comum), em vez de um número fixo por post que fica desatualizado
// a cada edição de conteúdo.
const WORDS_PER_MINUTE = 200;

function getReadingTime(post) {
  const plainText = post.content
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function updateMetaTag(attribute, value, content) {
  let tag = document.querySelector(`meta[${attribute}="${value}"]`);
  if (tag) {
    tag.setAttribute('content', content);
  } else {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, value);
    tag.setAttribute('content', content);
    document.head.appendChild(tag);
  }
}

/**
 * Retorna o HTML estruturado para até 3 artigos relacionados na mesma categoria
 * Promove uma excelente malha de links internos inteligentes para maximizar SEO.
 */
function renderRelatedPostsMarkup(currentPost) {
  // Busca posts da mesma categoria (excluindo o post ativo)
  let related = BLOG_POSTS.filter(
    (p) => p.id !== currentPost.id && p.category === currentPost.category
  );

  // Caso não existam posts suficientes na mesma categoria, preenche com os demais
  if (related.length < 3) {
    const extra = BLOG_POSTS.filter(
      (p) => p.id !== currentPost.id && p.category !== currentPost.category
    );
    related = [...related, ...extra].slice(0, 3);
  } else {
    related = related.slice(0, 3);
  }

  return related
    .map(
      (post) => `
    <article class="article-card" id="related-card-${post.id}">
      <a href="artigo-detalhes.html?slug=${post.slug}" class="article-img-link" aria-label="Artigo Relacionado: ${post.title}">
        <img src="${post.featuredImage}" alt="Capa: ${post.title}" class="article-img" loading="lazy">
      </a>
      <div class="article-content" style="padding: 20px;">
        <div class="meta-info" style="font-size: 12px; margin-bottom: 8px;">
          <span class="blog-badge" style="font-size: 10px; padding: 2px 6px; background-color: ${post.categoryColor}15; color: ${post.categoryColor};">
            ${post.categoryIcon} ${post.category}
          </span>
          <span>${post.publishedAt}</span>
          <span>•</span>
          <span>${getReadingTime(post)} min</span>
        </div>
        <h4 class="article-title" style="font-size: 1rem; margin-top: 4px; margin-bottom: 8px;">
          <a href="artigo-detalhes.html?slug=${post.slug}">${post.title}</a>
        </h4>
        <a href="artigo-detalhes.html?slug=${post.slug}" class="btn-secondary btn-small" style="padding: 4px 10px; font-size: 12px; align-self: flex-start; margin-top: auto;" id="btn-read-related-${post.id}">Ler mais</a>
      </div>
    </article>
  `
    )
    .join('');
}

/**
 * Interface limpa amigável exibida caso o artigo não seja localizado
 */
function renderSinglePostNotFound() {
  const container = document.getElementById('single-post-container');
  if (!container) return;

  container.innerHTML = `
    <div class="empty-state" style="margin: 60px 0;" id="post-not-found-state">
      <div class="empty-state-icon">⚠️</div>
      <h3>Artigo não encontrado</h3>
      <p>O endereço acessado pode ter sido alterado ou o artigo foi temporariamente arquivado.</p>
      <a href="blog.html" class="btn-primary" style="margin-top: 20px; display: inline-block;">Voltar para o Blog</a>
    </div>
  `;
}

// --------------------------------------------------------------------------
// NEWSLETTER E CADASTRO (INTEGRAÇÃO MAILCHIMP)
// --------------------------------------------------------------------------

/**
 * Inicializa os formulários de inscrição da Newsletter (lateral e rodapé)
 */
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const emailInput = form.querySelector('input[name="EMAIL"]');
      const feedback = form.nextElementSibling; // Elemento .newsletter-feedback seguinte

      if (!emailInput || !emailInput.value) {
        e.preventDefault();
        if (feedback) {
          feedback.textContent = 'Por favor, digite um e-mail válido.';
          feedback.className = 'newsletter-feedback error';
        }
        return;
      }

      // Não chamamos preventDefault: o <form> envia de verdade para o Mailchimp
      // (action + method já configurados no HTML) dentro do iframe oculto
      // "mc-newsletter-frame", sem sair da página. O Mailchimp não libera CORS
      // para o navegador ler a resposta, então a confirmação abaixo é otimista.
      if (feedback) {
        feedback.textContent = 'Enviando inscrição...';
        feedback.className = 'newsletter-feedback success';
      }

      setTimeout(() => {
        if (feedback) {
          // Não temos como confirmar que o Mailchimp aceitou o cadastro (CORS bloqueia a
          // leitura da resposta), então evitamos prometer certeza que não temos.
          feedback.textContent =
            'Inscrição enviada! Se não receber nosso e-mail de confirmação em alguns minutos, verifique sua caixa de spam.';
          feedback.className = 'newsletter-feedback success';
        }
        form.reset();
      }, 1200);
    });
  });
}

// --------------------------------------------------------------------------
// SIDEBAR (BARRA LATERAL): POPULARES, CONTADORES E TAG CLOUD
// --------------------------------------------------------------------------

/**
 * Alimenta dinamicamente os widgets da Sidebar reutilizando o mesmo banco de dados central.
 */
function initSidebar() {
  const popularContainer = document.getElementById('popular-posts-list');
  const categoriesContainer = document.getElementById(
    'sidebar-categories-list'
  );
  const tagsContainer = document.getElementById('sidebar-tags-cloud');

  // 1. Popula a lista de Artigos Recentes, ordenados pela data real de publicação
  // (não temos contagem de leituras real, então "mais lidos" seria uma métrica
  // inventada; recência é o único sinal verdadeiro que o post.publishedAt garante).
  if (popularContainer) {
    const recentPosts = [...BLOG_POSTS]
      .sort(
        (a, b) =>
          new Date(parsePublishedAtToISO(b.publishedAt)) -
          new Date(parsePublishedAtToISO(a.publishedAt))
      )
      .slice(0, 4);
    popularContainer.innerHTML = recentPosts
      .map(
        (post, idx) => `
      <li class="popular-item" id="popular-item-${post.id}">
        <span class="popular-number" style="color: ${post.categoryColor}; opacity: 0.4;">0${idx + 1}</span>
        <div class="popular-item-content">
          <a href="artigo-detalhes.html?slug=${post.slug}" class="popular-item-title">${post.title}</a>
          <span class="popular-item-meta">${post.publishedAt} • ${getReadingTime(post)} min</span>
        </div>
      </li>
    `
      )
      .join('');
  }

  // 2. Popula e faz a contagem de posts por categoria na barra lateral
  if (categoriesContainer) {
    const counts = {};
    BLOG_POSTS.forEach((post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });

    categoriesContainer.innerHTML = Object.values(CATEGORIES)
      .map((cat) => {
        const count = counts[cat.name] || 0;
        return `
        <li class="sidebar-cat-item" id="sidebar-cat-item-${cat.slug}">
          <a href="blog.html" class="sidebar-cat-link" data-category="${cat.name}">
            <span style="color: ${cat.color};">${cat.icon}</span> ${cat.name}
          </a>
          <span class="sidebar-cat-count">${count}</span>
        </li>
      `;
      })
      .join('');

    // Permite que cliques nas categorias da sidebar realizem filtros em tempo real
    categoriesContainer
      .querySelectorAll('.sidebar-cat-link')
      .forEach((link) => {
        link.addEventListener('click', (e) => {
          const listPostsContainer = document.getElementById(
            'blog-posts-container'
          );
          if (listPostsContainer) {
            e.preventDefault();
            activeCategory = link.getAttribute('data-category');

            // Altera o estado visual correspondente na barra superior de categorias
            const filterButtons = document.querySelectorAll(
              '#category-filters-wrap .category-btn'
            );
            filterButtons.forEach((btn) => {
              if (btn.getAttribute('data-category') === activeCategory) {
                btn.classList.add('active');
              } else {
                btn.classList.remove('active');
              }
            });

            renderBlogPosts();
            listPostsContainer.scrollIntoView({ behavior: 'smooth' });
          } else {
            // Se estiver nos detalhes, armazena para carregar filtrado na Home do blog
            sessionStorage.setItem(
              'active_category_filter',
              link.getAttribute('data-category')
            );
          }
        });
      });
  }

  // 3. Nuvem de Tags Dinâmica, agregada a partir das tags reais de cada post
  if (tagsContainer) {
    const tags = [...new Set(BLOG_POSTS.flatMap((post) => post.tags))].sort();
    tagsContainer.innerHTML = tags
      .map(
        (tag) => `
      <a href="blog.html" class="tag-badge" data-tag="${tag}">#${tag}</a>
    `
      )
      .join('');

    tagsContainer.querySelectorAll('.tag-badge').forEach((badge) => {
      badge.addEventListener('click', (e) => {
        const listPostsContainer = document.getElementById(
          'blog-posts-container'
        );
        if (listPostsContainer) {
          e.preventDefault();
          const tagValue = badge.getAttribute('data-tag');
          const searchInput = document.getElementById('blog-search-input');
          if (searchInput) {
            searchInput.value = tagValue;
            searchQuery = tagValue;
            renderBlogPosts();
            listPostsContainer.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          sessionStorage.setItem(
            'active_tag_search',
            badge.getAttribute('data-tag')
          );
        }
      });
    });
  }
}

// --------------------------------------------------------------------------
// INICIALIZAÇÃO CENTRAL DO BLOG (DOM CONTENT LOADED)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  // Carrega filtros de categoria salvos de outras páginas
  const savedCategory = sessionStorage.getItem('active_category_filter');
  if (savedCategory) {
    activeCategory = savedCategory;
    sessionStorage.removeItem('active_category_filter');
  }

  // Carrega termos de busca de tags salvos de outras páginas
  const savedTag = sessionStorage.getItem('active_tag_search');
  if (savedTag) {
    searchQuery = savedTag;
    sessionStorage.removeItem('active_tag_search');
    const searchInput = document.getElementById('blog-search-input');
    if (searchInput) searchInput.value = savedTag;
  }

  // Lê o parâmetro ?q= da URL (suporta o SearchAction do WebSite schema e
  // permite compartilhar/favoritar um link de busca já filtrado)
  const urlSearchQuery = new URLSearchParams(window.location.search).get('q');
  if (urlSearchQuery) {
    searchQuery = urlSearchQuery;
    const searchInput = document.getElementById('blog-search-input');
    if (searchInput) searchInput.value = urlSearchQuery;
  }

  try {
    await loadBlogPosts();
  } catch (error) {
    console.error('Falha ao carregar os artigos do blog:', error);
    const message =
      '<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Não foi possível carregar os artigos</h3><p>Isso costuma acontecer quando a página é aberta direto do arquivo (file://) em vez de um servidor local. Veja as instruções de execução no README.</p></div>';
    const listContainer = document.getElementById('blog-posts-container');
    if (listContainer) listContainer.innerHTML = message;
    const singleContainer = document.getElementById('single-post-container');
    if (singleContainer) singleContainer.innerHTML = message;
    return;
  }

  // Aciona a renderização de componentes e lógica
  initBlogControls();
  renderBlogPosts();
  loadSinglePost();
  initSidebar();
  initNewsletter();
});

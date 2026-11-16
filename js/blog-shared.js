/**
 * ==========================================================================
 * JS: BLOCOS COMPARTILHADOS DO BLOG (sem DOM)
 * ==========================================================================
 * Dados editoriais (autores, categorias) e funções que só montam texto/HTML a
 * partir de um artigo. Sem document/window, por isso o MESMO código roda:
 *  - no navegador, importado por js/blog.js (páginas dinâmicas e fallback de dev);
 *  - no Node, importado por scripts/build-articles.mjs, que gera o HTML estático
 *    de cada artigo (blog/<slug>.html) no deploy.
 * Assim a página estática e a página renderizada no navegador nunca divergem.
 * ==========================================================================
 */

export const SITE_URL = 'https://www.vincapp.com.br/';

// --------------------------------------------------------------------------
// AUTORES DO BLOG
// --------------------------------------------------------------------------
export const AUTHORS = {
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
export const CATEGORIES = {
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
// NORMALIZAÇÃO DOS ARTIGOS
// --------------------------------------------------------------------------
/**
 * Resolve categoryKey/authorKey (referências leves salvas no JSON) nos
 * objetos completos de CATEGORIES/AUTHORS, no mesmo formato que o resto
 * do blog.js sempre esperou (post.category, post.author.name, etc.).
 */
export function normalizePost(raw) {
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

// --------------------------------------------------------------------------
// DATAS E TEMPO DE LEITURA
// --------------------------------------------------------------------------
// Converte datas no formato exibido "DD Mon YYYY" (ex.: "15 Jul 2026") para
// ISO 8601, exigido pelo campo datePublished do Schema.org.
export const PT_BR_MONTHS = {
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

export function parsePublishedAtToISO(publishedAt) {
  const [day, month, year] = publishedAt.split(' ');
  const monthNumber = PT_BR_MONTHS[month.toLowerCase()];
  return `${year}-${monthNumber}-${day.padStart(2, '0')}T09:00:00-03:00`;
}

// Calcula o tempo de leitura a partir do conteúdo real do post (200 palavras/min,
// padrão editorial comum), em vez de um número fixo por post que fica desatualizado
// a cada edição de conteúdo.
const WORDS_PER_MINUTE = 200;

export function getReadingTime(post) {
  const plainText = post.content
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

// --------------------------------------------------------------------------
// URLS DOS ARTIGOS
// --------------------------------------------------------------------------

/**
 * Link relativo (a partir de pages/) para um artigo. No deploy, o pacote de artigos traz
 * post.url apontando para a página estática (../blog/<slug>.html); sem ele (dev local),
 * usa o template dinâmico pages/artigo-detalhes.html?slug=.
 */
export function articleHref(post) {
  return post.url || `artigo-detalhes.html?slug=${post.slug}`;
}

/** URL canônica absoluta do artigo: a página estática, quando existe, senão o template com ?slug=. */
export function canonicalUrlFor(post) {
  return post.url
    ? new URL(post.url, `${SITE_URL}pages/`).href
    : `${SITE_URL}pages/artigo-detalhes.html?slug=${post.slug}`;
}

/** Crawlers de preview (WhatsApp, LinkedIn, Slack) exigem URL absoluta em og:image/twitter:image. */
export function absoluteImageUrl(post) {
  return post.featuredImage.replace('../', SITE_URL);
}

// --------------------------------------------------------------------------
// ARTIGOS RELACIONADOS
// --------------------------------------------------------------------------

/**
 * Retorna o HTML estruturado para até 3 artigos relacionados na mesma categoria
 * Promove uma excelente malha de links internos inteligentes para maximizar SEO.
 */
export function renderRelatedPostsMarkup(currentPost, allPosts, hrefFor = articleHref) {
  // Busca posts da mesma categoria (excluindo o post ativo)
  let related = allPosts.filter(
    (p) => p.id !== currentPost.id && p.category === currentPost.category
  );

  // Caso não existam posts suficientes na mesma categoria, preenche com os demais
  if (related.length < 3) {
    const extra = allPosts.filter(
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
      <a href="${hrefFor(post)}" class="article-img-link" aria-label="Artigo Relacionado: ${post.title}">
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
          <a href="${hrefFor(post)}">${post.title}</a>
        </h4>
        <a href="${hrefFor(post)}" class="btn-secondary btn-small" style="padding: 4px 10px; font-size: 12px; align-self: flex-start; margin-top: auto;" id="btn-read-related-${post.id}">Ler mais</a>
      </div>
    </article>
  `
    )
    .join('');
}

// --------------------------------------------------------------------------
// DADOS ESTRUTURADOS (JSON-LD) E CORPO DO ARTIGO
// --------------------------------------------------------------------------

/**
 * Objetos JSON-LD do artigo: BlogPosting + BreadcrumbList e, só nos posts com bloco de FAQ
 * real, FAQPage.
 */
export function buildStructuredData(post, canonicalUrl = canonicalUrlFor(post)) {
  const image = absoluteImageUrl(post);
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      image: [image],
      datePublished: parsePublishedAtToISO(post.publishedAt),
      // updatedAt é opcional no JSON do artigo; o mesmo campo vira o <lastmod> do sitemap.xml.
      dateModified: parsePublishedAtToISO(post.updatedAt || post.publishedAt),
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
          url: `${SITE_URL}assets/icons/vinc_icon_256px_1.png`,
        },
      },
      description: post.seo.metaDesc,
      articleBody: post.content.replace(/<[^>]*>/g, ''), // Remove HTML para gerar texto cru para o buscador
    },
    // Espelha a trilha visual (Início > Blog > Categoria)
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}pages/blog.html` },
        { '@type': 'ListItem', position: 3, name: post.category, item: canonicalUrl },
      ],
    },
  ];

  if (post.faq && post.faq.length > 0) {
    data.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }
  return data;
}

/**
 * Corpo do artigo com o Índice de Conteúdo (TOC) no topo: cada <h2> recebe id "topico-N" e vira
 * um item do índice. Versão em texto do que antes era feito mexendo no DOM.
 */
export function buildBodyWithToc(content) {
  const headings = [];
  const body = content.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (match, attrs = '', inner) => {
    const id = `topico-${headings.length + 1}`;
    headings.push(inner.replace(/<[^>]+>/g, '').trim());
    return `<h2${attrs.replace(/\sid="[^"]*"/i, '')} id="${id}">${inner}</h2>`;
  });
  if (headings.length === 0) return body;

  const items = headings
    .map(
      (text, index) => `
              <li>
                <a href="#topico-${index + 1}" class="toc-link">
                  <span class="toc-bullet">▶</span> ${text}
                </a>
              </li>
            `
    )
    .join('');
  return `<div class="post-toc">
        <h2 class="toc-title">📍 Índice do Artigo</h2>
        <ul class="toc-list">
          ${items}
        </ul>
      </div>${body}`;
}

/**
 * HTML interno do #single-post-container: voltar, breadcrumbs, cabeçalho, capa, corpo,
 * assinatura, formulário de feedback, autor e artigos relacionados.
 */
export function renderArticleMarkup(post, allPosts, hrefFor = articleHref) {
  const bodyHtml = buildBodyWithToc(post.content);
  return `
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
      ${bodyHtml}
    </article>

    <!-- Assinatura de fechamento, única para todos os artigos (antes duplicada em 6 deles) -->
    <div class="post-signature" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: var(--text-primary);">Vinc — confirme antes de confiar.</p>
      <p style="margin: 0; font-style: italic; color: var(--text-secondary); font-size: 14px;">Desenvolvido com foco total em soberania tecnológica e segurança jurídica.</p>
    </div>

    <!-- Seção de Interação / Feedback (Fase 1) -->
    <section class="post-interaction-box" id="post-feedback-section" aria-labelledby="feedback-section-title">
      <h3 class="interaction-heading" id="feedback-section-title">📬 Compartilhe sua Opinião</h3>

      <form id="feedback-interaction-form">
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
        ${renderRelatedPostsMarkup(post, allPosts, hrefFor)}
      </div>
    </section>
`;
}


// --------------------------------------------------------------------------
// BARRA LATERAL
// --------------------------------------------------------------------------

function byPublishedDesc(a, b) {
  return new Date(parsePublishedAtToISO(b.publishedAt)) - new Date(parsePublishedAtToISO(a.publishedAt));
}

/** Artigos Recentes, ordenados pela data real de publicação (não temos contagem de leituras). */
export function renderPopularMarkup(allPosts, hrefFor = articleHref) {
  return [...allPosts]
    .sort(byPublishedDesc)
    .slice(0, 4)
    .map(
      (post, idx) => `
      <li class="popular-item" id="popular-item-${post.id}">
        <span class="popular-number" style="color: ${post.categoryColor}; opacity: 0.4;">0${idx + 1}</span>
        <div class="popular-item-content">
          <a href="${hrefFor(post)}" class="popular-item-title">${post.title}</a>
          <span class="popular-item-meta">${post.publishedAt} • ${getReadingTime(post)} min</span>
        </div>
      </li>
    `
    )
    .join('');
}

/** Categorias com a contagem de artigos de cada uma. */
export function renderCategoriesMarkup(allPosts) {
  const counts = {};
  allPosts.forEach((post) => {
    counts[post.category] = (counts[post.category] || 0) + 1;
  });

  return Object.values(CATEGORIES)
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
}

/** Nuvem de tags, agregada a partir das tags reais de cada post. */
export function renderTagsMarkup(allPosts) {
  const tags = [...new Set(allPosts.flatMap((post) => post.tags))].sort();
  return tags
    .map(
      (tag) => `
      <a href="blog.html" class="tag-badge" data-tag="${tag}">#${tag}</a>
    `
    )
    .join('');
}

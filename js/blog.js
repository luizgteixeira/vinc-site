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

import {
  CATEGORIES,
  normalizePost,
  parsePublishedAtToISO,
  getReadingTime,
  articleHref,
  canonicalUrlFor,
  absoluteImageUrl,
  buildStructuredData,
  renderArticleMarkup,
  renderPopularMarkup,
  renderCategoriesMarkup,
  renderTagsMarkup,
} from './blog-shared.js';

// Autores, categorias, normalizePost, datas e os blocos que montam HTML (artigo, relacionados,
// sidebar, JSON-LD) ficam em js/blog-shared.js, que também é usado no Node para gerar as
// páginas estáticas dos artigos (scripts/build-articles.mjs).

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
 * Carrega os artigos: primeiro o pacote único content/posts.json (1 requisição,
 * gerado no deploy) e, na falta dele, o índice + cada JSON de content/posts/.
 * Precisa ser servido via HTTP (não funciona abrindo o HTML direto com
 * file://) — ver instruções de execução local no README.
 */
async function loadBlogPosts() {
  // Caminho rápido: um único arquivo com todos os artigos, gerado a cada deploy por
  // scripts/build-posts.py. Se não existir (ex.: dev local sem rodar o script) ou vier
  // inválido, cai no carregamento arquivo a arquivo abaixo, que sempre funciona.
  try {
    const bundleResponse = await fetch('../content/posts.json');
    if (bundleResponse.ok) {
      const bundle = await bundleResponse.json();
      if (Array.isArray(bundle) && bundle.length > 0) {
        BLOG_POSTS = bundle.map(normalizePost);
        return;
      }
    }
  } catch (error) {
    // segue para o fallback
  }

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
        <h2>Nenhum artigo encontrado</h2>
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
        <a href="${articleHref(featuredPost)}" class="featured-img-link" aria-label="Ler artigo em destaque: ${featuredPost.title}">
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
            <a href="${articleHref(featuredPost)}">${featuredPost.title}</a>
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
            <a href="${articleHref(featuredPost)}" class="btn-primary btn-small" id="btn-read-featured">Ler artigo</a>
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
          <a href="${articleHref(post)}" class="article-img-link" aria-label="Ler artigo: ${post.title}">
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
            <h2 class="article-title">
              <a href="${articleHref(post)}">${post.title}</a>
            </h2>
            <p class="article-excerpt">${post.excerpt}</p>
            <div class="article-footer">
              <div class="author-info">
                <img src="${post.author.avatarUrl}" alt="Avatar de ${post.author.name}" class="author-avatar" width="28" height="28" loading="lazy">
                <span class="author-name" style="font-size: 13px;">${post.author.name}</span>
              </div>
              <a href="${articleHref(post)}" class="btn-secondary btn-small" style="padding: 6px 14px; font-size: 13px;" id="btn-read-more-${post.id}">Ler mais</a>
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

  // Em produção cada artigo tem uma página estática (post.url, definida no pacote de artigos
  // gerado no deploy): quem chegou pelo endereço antigo (?slug=) é levado para ela.
  if (post.url) {
    window.location.replace(post.url + window.location.hash);
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
  const canonicalUrl = canonicalUrlFor(post);
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (canonicalTag) {
    canonicalTag.setAttribute('href', canonicalUrl);
  } else {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    canonicalTag.setAttribute('href', canonicalUrl);
    document.head.appendChild(canonicalTag);
  }

  const ogImage = absoluteImageUrl(post); // URL absoluta, exigida por crawlers de preview

  // Atualizar Open Graph (Facebook, WhatsApp, LinkedIn)
  updateMetaTag('property', 'og:title', post.seo.metaTitle);
  updateMetaTag('property', 'og:description', post.seo.metaDesc);
  updateMetaTag('property', 'og:url', canonicalUrl);
  updateMetaTag('property', 'og:image', ogImage);

  // Atualizar Twitter / X Cards
  updateMetaTag('name', 'twitter:title', post.seo.metaTitle);
  updateMetaTag('name', 'twitter:description', post.seo.metaDesc);
  updateMetaTag('name', 'twitter:image', ogImage);

  // Dados estruturados JSON-LD (BlogPosting, BreadcrumbList e, se houver, FAQPage)
  buildStructuredData(post, canonicalUrl).forEach((data) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  });

  // 2. Layout do post, com Índice de Conteúdo (TOC) e artigos relacionados
  singlePostContainer.innerHTML = renderArticleMarkup(post, BLOG_POSTS, articleHref);

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

  // O envio é feito por fetch no botão "Enviar feedback"; impede o submit nativo (Enter no
  // formulário). Feito aqui, e não com onsubmit inline, para funcionar sob CSP sem 'unsafe-inline'.
  const feedbackForm = document.getElementById('feedback-interaction-form');
  if (feedbackForm) feedbackForm.addEventListener('submit', (e) => e.preventDefault());

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

// Rolagem suave, exceto para quem pediu movimento reduzido no sistema.
function getScrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
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
 * Interface limpa amigável exibida caso o artigo não seja localizado
 */
function renderSinglePostNotFound() {
  const container = document.getElementById('single-post-container');
  if (!container) return;

  container.innerHTML = `
    <div class="empty-state" style="margin: 60px 0;" id="post-not-found-state">
      <div class="empty-state-icon">⚠️</div>
      <h1>Artigo não encontrado</h1>
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
 * Monta os widgets da Sidebar (recentes, categorias e tags) reutilizando o mesmo banco de dados
 * central. Nas páginas estáticas dos artigos isso já vem pronto no HTML; só os eventos são ligados.
 */
function renderSidebar() {
  const popularContainer = document.getElementById('popular-posts-list');
  const categoriesContainer = document.getElementById('sidebar-categories-list');
  const tagsContainer = document.getElementById('sidebar-tags-cloud');

  if (popularContainer) popularContainer.innerHTML = renderPopularMarkup(BLOG_POSTS, articleHref);
  if (categoriesContainer) categoriesContainer.innerHTML = renderCategoriesMarkup(BLOG_POSTS);
  if (tagsContainer) tagsContainer.innerHTML = renderTagsMarkup(BLOG_POSTS);
}

/**
 * Liga os cliques das categorias e das tags da Sidebar. Na listagem do blog filtram em tempo real;
 * nas demais páginas guardam o filtro na sessão para a listagem carregar já filtrada.
 */
function bindSidebarEvents() {
  const categoriesContainer = document.getElementById('sidebar-categories-list');
  const tagsContainer = document.getElementById('sidebar-tags-cloud');

  if (categoriesContainer) {
    // Permite que cliques nas categorias da sidebar realizem filtros em tempo real
    categoriesContainer.querySelectorAll('.sidebar-cat-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        const listPostsContainer = document.getElementById('blog-posts-container');
        if (listPostsContainer) {
          e.preventDefault();
          activeCategory = link.getAttribute('data-category');

          // Altera o estado visual correspondente na barra superior de categorias
          const filterButtons = document.querySelectorAll('#category-filters-wrap .category-btn');
          filterButtons.forEach((btn) => {
            if (btn.getAttribute('data-category') === activeCategory) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });

          renderBlogPosts();
          listPostsContainer.scrollIntoView({ behavior: getScrollBehavior() });
        } else {
          // Se estiver nos detalhes, armazena para carregar filtrado na Home do blog
          sessionStorage.setItem('active_category_filter', link.getAttribute('data-category'));
        }
      });
    });
  }

  if (tagsContainer) {
    tagsContainer.querySelectorAll('.tag-badge').forEach((badge) => {
      badge.addEventListener('click', (e) => {
        const listPostsContainer = document.getElementById('blog-posts-container');
        if (listPostsContainer) {
          e.preventDefault();
          const tagValue = badge.getAttribute('data-tag');
          const searchInput = document.getElementById('blog-search-input');
          if (searchInput) {
            searchInput.value = tagValue;
            searchQuery = tagValue;
            renderBlogPosts();
            listPostsContainer.scrollIntoView({ behavior: getScrollBehavior() });
          }
        } else {
          sessionStorage.setItem('active_tag_search', badge.getAttribute('data-tag'));
        }
      });
    });
  }
}

function initSidebar() {
  renderSidebar();
  bindSidebarEvents();
}

// --------------------------------------------------------------------------
// INICIALIZAÇÃO CENTRAL DO BLOG (DOM CONTENT LOADED)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  // Página de artigo estática (gerada no deploy por scripts/build-articles.mjs): o HTML já traz
  // o artigo, as metas, o JSON-LD e a sidebar. Não carrega os artigos nem renderiza nada; só
  // liga o formulário de feedback, os cliques da sidebar e a newsletter.
  if (document.documentElement.hasAttribute('data-prerendered')) {
    const titleElement = document.getElementById('post-main-title');
    initFeedbackSection({ title: titleElement ? titleElement.textContent : document.title });
    bindSidebarEvents();
    initNewsletter();
    return;
  }

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
      '<div class="empty-state"><div class="empty-state-icon">⚠️</div><h2>Não foi possível carregar os artigos</h2><p>Isso costuma acontecer quando a página é aberta direto do arquivo (file://) em vez de um servidor local. Veja as instruções de execução no README.</p></div>';
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

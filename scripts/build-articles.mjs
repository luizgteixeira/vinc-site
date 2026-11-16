#!/usr/bin/env node
/**
 * Gera uma página HTML estática por artigo do blog: blog/<slug>.html.
 *
 * Por quê: pages/artigo-detalhes.html monta o artigo no navegador (JS). Crawlers de
 * preview (WhatsApp, LinkedIn, Slack) não executam JS e viam sempre o mesmo título, a
 * mesma descrição e a mesma imagem; o Google indexa páginas com JS de forma mais lenta.
 * A página estática já traz título, descrição, canonical, Open Graph, JSON-LD, <h1>, o
 * corpo do artigo, os relacionados e a sidebar no próprio HTML.
 *
 * Como: usa o MESMO código que o navegador (js/blog-shared.js), então a página estática
 * e a dinâmica não divergem. O template é pages/artigo-detalhes.html. blog/ fica a um
 * nível da raiz, como pages/, então ../css, ../js e ../assets continuam valendo; só os
 * links para páginas irmãs (ex.: blog.html) são reescritos para ../pages/.
 *
 * Roda no deploy (.github/workflows/mirror-to-hostinger.yml); blog/ está no .gitignore.
 * Uso (na raiz do repositório):
 *   node scripts/build-articles.mjs                  gera blog/*.html
 *   node scripts/build-articles.mjs --rewrite-links  também reescreve, em index.html e
 *       pages/*.html, os links ?slug= para as páginas estáticas. ALTERA ARQUIVOS VERSIONADOS:
 *       só para o deploy (o workflow descarta a cópia de trabalho depois); não use localmente.
 * Só usa módulos do Node (sem npm install).
 */

import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import {
  normalizePost,
  canonicalUrlFor,
  absoluteImageUrl,
  buildStructuredData,
  renderArticleMarkup,
  renderPopularMarkup,
  renderCategoriesMarkup,
  renderTagsMarkup,
} from '../js/blog-shared.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const PAGES_DIR = path.join(ROOT, 'pages');
const OUT_DIR = path.join(ROOT, 'blog');
const TEMPLATE = path.join(PAGES_DIR, 'artigo-detalhes.html');
const REWRITE_LINKS = process.argv.includes('--rewrite-links');

function fail(message) {
  console.error(`ERRO: ${message}`);
  process.exit(1);
}

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeText = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Troca um trecho que precisa existir exatamente uma vez no template (senão o template mudou). */
function replaceOnce(html, pattern, replacement, what) {
  const matches = html.match(new RegExp(pattern.source, pattern.flags.replace('g', '') + 'g')) || [];
  if (matches.length !== 1) {
    fail(`template pages/artigo-detalhes.html: esperava 1 ocorrência de ${what}, achei ${matches.length}`);
  }
  return html.replace(pattern, () => replacement);
}

const setMeta = (html, attr, name, content) =>
  replaceOnce(
    html,
    new RegExp(`<meta\\s+${attr}="${name}"\\s+content="[^"]*">`),
    `<meta ${attr}="${name}" content="${escapeAttr(content)}">`,
    `<meta ${attr}="${name}">`
  );

/** Preenche o conteúdo de um elemento do template que hoje só tem o comentário "Gerado Dinamicamente". */
function fillPlaceholder(html, openTag, closeTag, inner, what) {
  const pattern = new RegExp(`(${openTag})\\s*<!--[^>]*-->\\s*(${closeTag})`);
  const found = html.match(pattern);
  if (!found) fail(`template pages/artigo-detalhes.html: não achei o espaço reservado de ${what}`);
  return html.replace(pattern, (m, open, close) => `${open}${inner}${close}`);
}

async function loadPosts() {
  let slugs;
  try {
    slugs = JSON.parse(await readFile(path.join(POSTS_DIR, 'index.json'), 'utf8'));
  } catch (error) {
    fail(`não foi possível ler content/posts/index.json: ${error.message}`);
  }
  const pageNames = new Set((await readdir(PAGES_DIR)).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)));
  pageNames.add('index');

  const posts = [];
  for (const slug of slugs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(`slug inválido em index.json: ${JSON.stringify(slug)} (use minúsculas, números e hífens)`);
    if (pageNames.has(slug)) fail(`o slug "${slug}" colide com a página ${slug}.html; escolha outro slug`);
    let raw;
    try {
      raw = JSON.parse(await readFile(path.join(POSTS_DIR, `${slug}.json`), 'utf8'));
    } catch (error) {
      fail(`content/posts/${slug}.json: ${error.message}`);
    }
    if (raw.slug !== slug) fail(`content/posts/${slug}.json: o campo 'slug' (${raw.slug}) difere do nome do arquivo`);
    let post;
    try {
      post = normalizePost(raw);
    } catch {
      fail(`content/posts/${slug}.json: categoryKey/authorKey inexistente em js/blog-shared.js`);
    }
    // url relativa a pages/, como o pacote de artigos do deploy (build-posts.py) também define
    posts.push({ ...post, url: `../blog/${slug}.html` });
  }
  return { posts, pageNames };
}

/** Links relativos do HTML gerado (que sai de pages/-relativo) para o nível blog/. */
function rewriteLinks(html, slugs, pageNames) {
  // 1. links para outros artigos: artigo-detalhes.html?slug=X -> X.html (mesma pasta)
  html = html.replace(/(href|action)="artigo-detalhes\.html\?slug=([a-z0-9-]+)"/g, (m, attr, slug) =>
    slugs.has(slug) ? `${attr}="${slug}.html"` : m
  );
  // 2. links para páginas irmãs de pages/: nome.html[#x|?x] -> ../pages/nome.html[#x|?x]
  html = html.replace(/(href|action)="([a-z0-9-]+)\.html((?:[#?])[^"]*)?"/g, (m, attr, name, rest = '') =>
    pageNames.has(name) && !slugs.has(name) ? `${attr}="../pages/${name}.html${rest}"` : m
  );
  return html;
}

/** Garante que todo href/src relativo do HTML gerado aponta para um arquivo que existe. */
function checkLinks(html, slug, generated) {
  const problems = [];
  for (const [, attr, value] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    if (!value || /^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(value)) continue;
    const target = value.split('#')[0].split('?')[0];
    if (!target) continue;
    const resolved = path.resolve(OUT_DIR, target);
    const inGenerated = generated.has(resolved);
    if (!inGenerated && !existsSync(resolved)) problems.push(`${attr}="${value}"`);
  }
  if (problems.length) fail(`blog/${slug}.html: links quebrados: ${[...new Set(problems)].join(', ')}`);
}

async function main() {
  const { posts, pageNames } = await loadPosts();
  if (posts.length === 0) fail('content/posts/index.json está vazio');
  const slugs = new Set(posts.map((p) => p.slug));
  const template = await readFile(TEMPLATE, 'utf8');
  const hrefFor = (post) => `${post.slug}.html`; // dentro de blog/, os artigos são irmãos

  // blog/ pertence a este script: recria do zero para não sobrar página de artigo removido.
  if (path.basename(OUT_DIR) !== 'blog') fail('diretório de saída inesperado');
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  const generated = new Set(posts.map((p) => path.join(OUT_DIR, `${p.slug}.html`)));

  const sidebar = {
    popular: renderPopularMarkup(posts, hrefFor),
    categories: renderCategoriesMarkup(posts),
    tags: renderTagsMarkup(posts),
  };

  for (const post of posts) {
    const canonical = canonicalUrlFor(post);
    const ogImage = absoluteImageUrl(post);
    let html = template;

    html = html
      .replace('<!-- SEO Padrão (Será substituído dinamicamente pelo JS) -->', '<!-- SEO: gerado no deploy por scripts/build-articles.mjs -->')
      .replace('<!-- Open Graph Padrão (Será substituído dinamicamente) -->', '<!-- Open Graph -->')
      .replace('<!-- Twitter / X Cards Padrão -->', '<!-- Twitter / X Cards -->');
    html = replaceOnce(html, /<html lang="pt-BR">/, '<html lang="pt-BR" data-prerendered>', '<html lang="pt-BR">');
    html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeText(post.seo.metaTitle)}</title>`, '<title>');
    html = setMeta(html, 'name', 'description', post.seo.metaDesc);
    html = setMeta(html, 'name', 'robots', 'index, follow'); // o template é noindex; as páginas geradas são o conteúdo real
    html = replaceOnce(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapeAttr(canonical)}">`, 'canonical');
    html = setMeta(html, 'property', 'og:title', post.seo.metaTitle);
    html = setMeta(html, 'property', 'og:description', post.seo.metaDesc);
    html = setMeta(html, 'property', 'og:url', canonical);
    html = setMeta(html, 'property', 'og:image', ogImage);
    html = setMeta(html, 'name', 'twitter:title', post.seo.metaTitle);
    html = setMeta(html, 'name', 'twitter:description', post.seo.metaDesc);
    html = setMeta(html, 'name', 'twitter:image', ogImage);

    // JSON-LD no <head>; "<" vira \u003c para que um "</script>" no texto nunca feche o bloco
    const jsonLd = buildStructuredData(post, canonical)
      .map((data) => `  <script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>\n`)
      .join('');
    html = replaceOnce(html, /<\/head>/, `${jsonLd}</head>`, '</head>');

    html = fillPlaceholder(html, '<section id="single-post-container"[^>]*>', '</section>', renderArticleMarkup(post, posts, hrefFor), '#single-post-container');
    html = fillPlaceholder(html, '<ul class="popular-list" id="popular-posts-list">', '</ul>', sidebar.popular, 'Artigos Recentes');
    html = fillPlaceholder(html, '<ul class="sidebar-categories" id="sidebar-categories-list">', '</ul>', sidebar.categories, 'Categorias');
    html = fillPlaceholder(html, '<div class="tags-cloud" id="sidebar-tags-cloud">', '</div>', sidebar.tags, 'Tags');

    html = rewriteLinks(html, slugs, pageNames);

    if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`blog/${post.slug}.html: esperava exatamente 1 <h1>`);
    if (html.includes('artigo-detalhes.html')) fail(`blog/${post.slug}.html: sobrou link para o template artigo-detalhes.html`);
    checkLinks(html, post.slug, generated);

    await writeFile(path.join(OUT_DIR, `${post.slug}.html`), html, 'utf8');
  }
  console.log(`blog/: ${posts.length} páginas de artigo geradas`);

  if (REWRITE_LINKS) {
    let changed = 0;
    const targets = [path.join(ROOT, 'index.html'), ...(await readdir(PAGES_DIR)).filter((f) => f.endsWith('.html')).map((f) => path.join(PAGES_DIR, f))];
    for (const file of targets) {
      const original = await readFile(file, 'utf8');
      const prefix = path.dirname(file) === ROOT ? 'blog/' : '../blog/';
      const updated = original.replace(/(href)="(?:pages\/)?artigo-detalhes\.html\?slug=([a-z0-9-]+)"/g, (m, attr, slug) =>
        slugs.has(slug) ? `${attr}="${prefix}${slug}.html"` : m
      );
      if (updated !== original) {
        await writeFile(file, updated, 'utf8');
        changed += 1;
      }
    }
    console.log(`--rewrite-links: ${changed} arquivo(s) com links ?slug= trocados pelas páginas estáticas`);
  }
}

main().catch((error) => fail(error.stack || String(error)));

#!/usr/bin/env python3
"""Gera sitemap.xml a partir do próprio site.

Regras:
- Páginas: index.html e pages/*.html. O <loc> é o <link rel="canonical"> de cada
  página, então sitemap e canonical nunca divergem. Páginas com robots "noindex"
  (ex.: obrigado.html) e o template artigo-detalhes.html (sem ?slug= ele não é
  um conteúdo real) ficam de fora automaticamente.
- Artigos: um <url> por slug de content/posts/index.json, com a mesma URL canônica
  da página do artigo: blog/<slug>.html quando a página estática existe (gerada no
  deploy por scripts/build-articles.mjs) ou, sem ela (dev local), o template
  pages/artigo-detalhes.html?slug=<slug>.
- <lastmod> só onde a data é conhecida e confiável: nos artigos, o campo
  opcional "updatedAt" do JSON ou, na falta dele, "publishedAt"; em blog.html,
  a data do artigo mais recente. Páginas institucionais não levam <lastmod>:
  não há dado confiável (a data do último commit também muda com edições
  cosméticas do site inteiro, e um <lastmod> impreciso é pior que nenhum).
- <changefreq> e <priority> não são gerados: o Google os ignora.

Formato de data nos JSON: "DD Mmm AAAA" em português (ex.: "16 Jul 2026").

Roda no deploy (.github/workflows/mirror-to-hostinger.yml); sitemap.xml está no
.gitignore. Uso local (na raiz do repositório):  python3 scripts/build-sitemap.py
Só usa a biblioteca padrão do Python 3.
"""

import json
import re
import sys
from datetime import date
from pathlib import Path
from urllib.parse import quote
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "content" / "posts"
OUTPUT = ROOT / "sitemap.xml"

# Páginas que existem como arquivo mas não devem ir ao sitemap.
EXCLUDED_PAGES = {"pages/artigo-detalhes.html"}  # template: só é conteúdo com ?slug=
LISTING_PAGE = "pages/blog.html"  # lastmod = artigo mais recente
ARTICLE_TEMPLATE = "pages/artigo-detalhes.html"

PT_BR_MONTHS = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4, "mai": 5, "jun": 6,
    "jul": 7, "ago": 8, "set": 9, "out": 10, "nov": 11, "dez": 12,
}


def fail(message: str) -> None:
    print(f"ERRO: {message}", file=sys.stderr)
    sys.exit(1)


def parse_pt_date(value: str, where: str) -> date:
    match = re.fullmatch(r"(\d{1,2}) ([A-Za-zçÇ]{3}) (\d{4})", str(value).strip())
    month = PT_BR_MONTHS.get(match.group(2).lower()) if match else None
    if not match or not month:
        fail(f'{where}: data inválida {value!r} (esperado "DD Mmm AAAA", ex.: "16 Jul 2026")')
    try:
        return date(int(match.group(3)), month, int(match.group(1)))
    except ValueError:
        fail(f"{where}: data inexistente {value!r}")


def read_meta(html: str, name: str):
    match = re.search(rf'<meta\s+name="{name}"\s+content="([^"]*)"', html, re.I)
    return match.group(1) if match else None


def read_canonical(html: str):
    match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', html, re.I)
    return match.group(1) if match else None


def load_articles():
    try:
        slugs = json.loads((POSTS_DIR / "index.json").read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"não foi possível ler content/posts/index.json: {exc}")
    articles = []
    for slug in slugs:
        path = POSTS_DIR / f"{slug}.json"
        try:
            post = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            fail(f"{path.relative_to(ROOT)}: {exc}")
        where = str(path.relative_to(ROOT))
        if "publishedAt" not in post:
            fail(f"{where}: campo 'publishedAt' ausente")
        published = parse_pt_date(post["publishedAt"], where)
        modified = parse_pt_date(post["updatedAt"], where) if post.get("updatedAt") else published
        if modified < published:
            fail(f"{where}: 'updatedAt' anterior a 'publishedAt'")
        articles.append({
            "slug": slug,
            "lastmod": modified,
            # página estática gerada por scripts/build-articles.mjs (blog/<slug>.html), se existir
            "static": (ROOT / "blog" / f"{slug}.html").exists(),
        })
    return articles


def main() -> None:
    index_html = (ROOT / "index.html").read_text(encoding="utf-8")
    home = read_canonical(index_html)
    if not home or not home.endswith("/"):
        fail("index.html precisa de <link rel=\"canonical\"> apontando para a raiz do site (terminando em '/')")
    site = home  # ex.: https://www.vincapp.com.br/

    articles = load_articles()
    newest = max((a["lastmod"] for a in articles), default=None)

    entries = []  # (loc, lastmod|None)
    skipped = []
    page_files = [ROOT / "index.html"] + sorted((ROOT / "pages").glob("*.html"))
    for path in page_files:
        rel = path.relative_to(ROOT).as_posix()
        html = path.read_text(encoding="utf-8")
        if rel in EXCLUDED_PAGES:
            skipped.append(f"{rel} (template)")
            continue
        if "noindex" in (read_meta(html, "robots") or "").lower():
            skipped.append(f"{rel} (noindex)")
            continue
        canonical = read_canonical(html)
        if not canonical:
            fail(f"{rel}: sem <link rel=\"canonical\">; não dá para montar o <loc>")
        if not canonical.startswith(site):
            fail(f"{rel}: canonical {canonical!r} fora do domínio {site!r}")
        lastmod = newest if rel == LISTING_PAGE else None
        entries.append((canonical, lastmod))

    template_canonical = read_canonical((ROOT / ARTICLE_TEMPLATE).read_text(encoding="utf-8"))
    if not template_canonical:
        fail(f"{ARTICLE_TEMPLATE}: sem canonical")
    for article in sorted(articles, key=lambda a: a["lastmod"], reverse=True):
        if article["static"]:
            loc = f"{site}blog/{quote(article['slug'])}.html"  # mesma URL do canonical da página gerada
        else:
            loc = f"{template_canonical}?slug={quote(article['slug'])}"
        entries.append((loc, article["lastmod"]))

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod in entries:
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(loc)}</loc>")
        if lastmod:
            lines.append(f"    <lastmod>{lastmod.isoformat()}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    OUTPUT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"sitemap.xml: {len(entries)} URLs ({len(articles)} artigos)")
    for item in skipped:
        print(f"  fora do sitemap: {item}")


if __name__ == "__main__":
    main()

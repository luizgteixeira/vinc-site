#!/usr/bin/env python3
"""Gera content/posts.json, um único arquivo com todos os artigos do blog.

Fonte da verdade continua sendo content/posts/<slug>.json + content/posts/index.json.
O blog (js/blog.js) busca content/posts.json em UMA requisição; se o arquivo não
existir (ex.: desenvolvimento local sem rodar este script), ele cai de volta no
carregamento arquivo a arquivo e funciona do mesmo jeito.

Em produção o arquivo é gerado pelo workflow .github/workflows/mirror-to-hostinger.yml
a cada deploy — por isso content/posts.json está no .gitignore e não deve ser
commitado nem editado à mão.

Rode DEPOIS de scripts/build-articles.mjs para que o pacote inclua o campo "url" (ver abaixo).

Uso (na raiz do repositório):  python3 scripts/build-posts.py
Só usa a biblioteca padrão do Python 3.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "content" / "posts"
OUTPUT = ROOT / "content" / "posts.json"

# Campos que js/blog.js lê de cada artigo (ver normalizePost e renderizadores).
REQUIRED_FIELDS = (
    "id", "title", "slug", "excerpt", "categoryKey", "authorKey",
    "publishedAt", "featuredImage", "tags", "content", "seo",
)


def fail(message: str) -> None:
    print(f"ERRO: {message}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    try:
        slugs = json.loads((POSTS_DIR / "index.json").read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"não foi possível ler content/posts/index.json: {exc}")

    if not isinstance(slugs, list) or not all(isinstance(s, str) for s in slugs):
        fail("content/posts/index.json deve ser uma lista de slugs (strings)")
    if len(set(slugs)) != len(slugs):
        duplicados = sorted({s for s in slugs if slugs.count(s) > 1})
        fail(f"slugs repetidos em index.json: {', '.join(duplicados)}")

    posts = []
    for slug in slugs:
        path = POSTS_DIR / f"{slug}.json"
        try:
            post = json.loads(path.read_text(encoding="utf-8"))
        except OSError:
            fail(f"index.json lista '{slug}', mas {path.relative_to(ROOT)} não existe")
        except json.JSONDecodeError as exc:
            fail(f"{path.relative_to(ROOT)} não é um JSON válido: {exc}")

        if post.get("slug") != slug:
            fail(f"{path.relative_to(ROOT)}: o campo 'slug' ({post.get('slug')!r}) difere do nome do arquivo")
        faltando = [f for f in REQUIRED_FIELDS if f not in post]
        if faltando:
            fail(f"{path.relative_to(ROOT)}: campos ausentes: {', '.join(faltando)}")
        # Se a página estática do artigo existe (blog/<slug>.html, gerada antes por
        # scripts/build-articles.mjs no deploy), a listagem e a sidebar do blog passam a
        # apontar para ela. Sem ela (dev local), o blog usa o template ?slug=.
        if (ROOT / "blog" / f"{slug}.html").exists():
            post["url"] = f"../blog/{slug}.html"
        posts.append(post)

    # Arquivos em content/posts/ que não estão no index.json nunca apareceriam no site.
    nao_listados = sorted(
        p.stem for p in POSTS_DIR.glob("*.json") if p.name != "index.json" and p.stem not in slugs
    )
    if nao_listados:
        print(f"AVISO: fora de index.json (não serão publicados): {', '.join(nao_listados)}", file=sys.stderr)

    OUTPUT.write_text(
        json.dumps(posts, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    print(f"{OUTPUT.relative_to(ROOT)}: {len(posts)} artigos, {OUTPUT.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()

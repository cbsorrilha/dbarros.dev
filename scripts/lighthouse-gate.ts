// Portão de Lighthouse (openspec/specs/performance): serve `dist/` localmente, roda o
// Lighthouse (móvel, padrão) nas páginas-chave e falha se alguma ficar abaixo do
// orçamento. Uso: `npm run lighthouse` (depois de `npm run build`).
import { createServer, type Server } from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { brotliCompressSync } from "node:zlib";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const DIST = "dist";
const BUDGET: Record<string, number> = {
  performance: 0.95,
  accessibility: 1,
  "best-practices": 1,
  seo: 1,
};
const MAX_POSTS = 2;
// A 404 tem `noindex` de propósito: SEO não se aplica a ela.
const SKIP_CATEGORIES: Record<string, string[]> = { "/pt/404.html": ["seo"] };

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
};

async function resolveFile(urlPath: string): Promise<string | null> {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  for (const candidate of [join(DIST, clean), join(DIST, clean, "index.html")]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // tenta o próximo
    }
  }
  return null;
}

function serve(): Promise<{ server: Server; origin: string }> {
  const server = createServer(async (req, res) => {
    const file = await resolveFile(req.url ?? "/");
    if (!file) {
      res.writeHead(404).end("not found");
      return;
    }
    // Comprime como a Cloudflare (Brotli) para medir o que o visitante recebe.
    const type = TYPES[extname(file)] ?? "application/octet-stream";
    const body = await readFile(file);
    const compressible = /^(text|application\/(xml|javascript))|svg/.test(type);
    if (compressible && /\bbr\b/.test(String(req.headers["accept-encoding"]))) {
      res.writeHead(200, { "content-type": type, "content-encoding": "br" });
      res.end(brotliCompressSync(body));
    } else {
      res.writeHead(200, { "content-type": type });
      res.end(body);
    }
  });
  return new Promise(resolve =>
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as { port: number };
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    })
  );
}

async function pages(): Promise<string[]> {
  const list = ["/pt/", "/en/", "/es/", "/pt/tags/", "/pt/about/", "/pt/404.html"];
  const posts: string[] = [];
  for (const lang of ["pt", "en", "es"]) {
    try {
      for (const slug of await readdir(join(DIST, lang, "posts"))) {
        if (posts.length < MAX_POSTS && (await resolveFile(`/${lang}/posts/${slug}/`))?.endsWith("index.html")) {
          posts.push(`/${lang}/posts/${slug}/`);
        }
      }
    } catch {
      // sem posts nesse idioma
    }
  }
  return [...list, ...posts];
}

const { server, origin } = await serve();
const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });
const failures: string[] = [];

try {
  for (const page of await pages()) {
    const result = await lighthouse(`${origin}${page}`, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: Object.keys(BUDGET),
    });
    const categories = result?.lhr.categories ?? {};
    const skipped = SKIP_CATEGORIES[page] ?? [];
    const scores = Object.keys(BUDGET)
      .filter(id => !skipped.includes(id))
      .map(id => {
      const score = categories[id]?.score ?? 0;
      if (score < BUDGET[id]) {
        const failed = Object.values(result?.lhr.audits ?? {})
          .filter(a => a.score !== null && a.score < 1 && categories[id]?.auditRefs.some(r => r.id === a.id && r.weight > 0))
          .map(a => a.id)
          .slice(0, 4);
        failures.push(`${page} ${id} ${Math.round(score * 100)} < ${BUDGET[id] * 100} (${failed.join(", ")})`);
      }
      return `${id}=${Math.round(score * 100)}`;
    });
    const audits = result?.lhr.audits ?? {};
    const metrics = ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift"]
      .map(id => audits[id]?.displayValue ?? "?")
      .join(" / ");
    console.log(`[lighthouse] ${page.padEnd(22)} ${scores.join("  ")}  (FCP/LCP/TBT/CLS ${metrics})`);
  }
} finally {
  await chrome.kill();
  server.close();
}

if (failures.length > 0) {
  console.error(`\n[lighthouse] abaixo do orçamento:\n  ${failures.join("\n  ")}\n\nPara pular numa emergência: SKIP_LIGHTHOUSE=1 git push`);
  process.exit(1);
}
console.log("[lighthouse] ok: todas as páginas dentro do orçamento");

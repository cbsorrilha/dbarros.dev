// `npm run translate [-- --post <slug>] [-- --dry-run]`: traduz, pelo Ollama local,
// o que falta ou mudou. Nunca roda no build nem na CI.
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { stringify } from "yaml";
import type { Locale } from "../../src/i18n/locales.ts";
import { config } from "./config.ts";
import { normalizeBody } from "./hash.ts";
import { assertReady, translateMarkdown, translateMeta } from "./ollama.ts";
import { readPosts, type Post } from "./posts.ts";
import { chunk, protect, restore } from "./protect.ts";

const { values: args } = parseArgs({
  options: {
    post: { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
});

type Job = { post: Post; lang: Locale; action: "criar" | "retraduzir" };

const log = (msg: string) => console.log(`[translate] ${msg}`);
const today = () => new Date().toISOString().slice(0, 10);
const ATTEMPTS = 2;

// --- plano -----------------------------------------------------------------

const posts = (await readPosts()).filter(post =>
  args.post ? post.slug === args.post : !post.source.data.draft
);
if (args.post && posts.length === 0) {
  console.error(`[translate] post "${args.post}" não encontrado`);
  process.exit(1);
}

const jobs: Job[] = [];
for (const post of posts) {
  for (const lang of post.expected) {
    if (lang === post.source.lang) continue;
    const file = post.files[lang];
    const translation = file?.data.translation;
    if (!file) {
      jobs.push({ post, lang, action: "criar" });
    } else if (translation?.source_hash === post.hash) {
      continue;
    } else if (translation?.locked) {
      log(`${post.slug} → ${lang}: bloqueada (locked) e desatualizada; revise à mão`);
    } else {
      jobs.push({ post, lang, action: "retraduzir" });
    }
  }
}

if (jobs.length === 0) {
  log("nada a traduzir: tudo em dia");
  process.exit(0);
}
for (const job of jobs) log(`${job.post.slug} → ${job.lang}: ${job.action}`);
if (args["dry-run"]) {
  log(`--dry-run: ${jobs.length} tradução(ões) pendente(s), nada foi feito`);
  process.exit(0);
}

// --- execução --------------------------------------------------------------

try {
  await assertReady();
} catch (error) {
  console.error(`[translate] ${(error as Error).message}`);
  process.exit(1);
}
log(`modelo ${config.model} em ${config.host} (a primeira chamada pode levar 1–2 min)`);

async function translateBody(body: string, from: Locale, to: Locale, tag: string) {
  const protectedBody = protect(normalizeBody(body));
  const parts = chunk(protectedBody.text, config.chunkChars);
  const out: string[] = [];
  for (const [i, part] of parts.entries()) {
    log(`${tag}: parte ${i + 1}/${parts.length}`);
    out.push(await translateMarkdown(part, from, to));
  }
  const restored = restore(out.join("\n\n"), protectedBody);
  if (!restored.ok) throw new Error(restored.error);
  return restored.text;
}

function render(post: Post, lang: Locale, meta: { title: string; description: string }, body: string) {
  const source = post.source.data;
  const data: Record<string, unknown> = {
    title: meta.title,
    description: meta.description,
    pubDate: source.pubDate,
    ...(source.updatedDate ? { updatedDate: source.updatedDate } : {}),
    tags: source.tags ?? [],
    lang,
    source_lang: post.source.lang,
    ...(source.draft ? { draft: true } : {}),
    translation: {
      source_hash: post.hash,
      model: config.model,
      translated_at: today(),
      locked: false,
    },
  };
  const yaml = stringify(data, { schema: "core", lineWidth: 0, flowCollectionPadding: false });
  return `---\n${yaml}---\n\n${body}\n`;
}

const failures: string[] = [];
for (const [index, { post, lang }] of jobs.entries()) {
  const tag = `${post.slug} → ${lang} (${index + 1}/${jobs.length})`;
  const from = post.source.lang;
  const started = Date.now();
  let lastError = "";
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      log(`${tag}: título e descrição${attempt > 1 ? ` (tentativa ${attempt})` : ""}`);
      const meta = await translateMeta(
        { title: post.source.data.title, description: post.source.data.description },
        from,
        lang
      );
      const body = await translateBody(post.source.body, from, lang, tag);
      await writeFile(join(post.dir, `${lang}.md`), render(post, lang, meta, body));
      log(`${tag}: gravado em ${Math.round((Date.now() - started) / 1000)} s`);
      lastError = "";
      break;
    } catch (error) {
      lastError = (error as Error).message;
      log(`${tag}: falhou (${lastError})`);
    }
  }
  if (lastError) failures.push(`${post.slug} → ${lang}: ${lastError}`);
}

if (failures.length > 0) {
  console.error(`[translate] ${failures.length} falha(s), nada gravado para elas:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
log("pronto. Revise as traduções antes de commitar.");

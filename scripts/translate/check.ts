// `npm run translate:check`: confere, sem chamar o modelo nem acessar a rede, se
// todo post publicado tem as traduções esperadas e em dia. Roda no pre-commit e no
// início do `npm run build`.
import { readPosts } from "./posts.ts";

type Finding = { slug: string; lang: string; reason: string };

const errors: Finding[] = [];
const warnings: Finding[] = [];

for (const post of await readPosts()) {
  if (post.source.data.draft) continue;
  for (const lang of post.expected) {
    if (lang === post.source.lang) continue;
    const file = post.files[lang];
    const at = { slug: post.slug, lang };
    if (!file) {
      errors.push({ ...at, reason: "tradução ausente" });
    } else if (!file.data.translation) {
      errors.push({
        ...at,
        reason: "sem bloco translation (gere com translate ou marque locked)",
      });
    } else if (file.data.translation.source_hash !== post.hash) {
      if (file.data.translation.locked) {
        warnings.push({ ...at, reason: "bloqueada e desatualizada: revisar à mão" });
      } else {
        errors.push({ ...at, reason: "desatualizada: o fonte mudou" });
      }
    }
  }
}

const table = (items: Finding[]) =>
  items.map(f => `  ${f.slug.padEnd(28)} ${f.lang}  ${f.reason}`).join("\n");

if (warnings.length > 0) {
  console.warn(`translate:check — avisos:\n${table(warnings)}`);
}
if (errors.length > 0) {
  console.error(
    `translate:check — falhou:\n${table(errors)}\n\nRode \`npm run translate\` (ou use translations: [...] no fonte para dispensar um idioma).`
  );
  process.exit(1);
}
console.log("translate:check — ok");

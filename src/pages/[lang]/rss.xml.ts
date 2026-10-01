import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts, getPostUrl } from "@/utils/posts";
import { LOCALES, tplStr, useTranslations, type Locale } from "@/i18n";
import config from "@/config";

export function getStaticPaths() {
  return LOCALES.map(lang => ({ params: { lang } }));
}

export async function GET({ params }: APIContext) {
  const lang = params.lang as Locale;
  const t = useTranslations(lang);
  const posts = await getPosts(lang);

  return rss({
    title: tplStr(t.rss.title, { site: config.site.title }),
    description: t.rss.description,
    site: config.site.url,
    customData: `<language>${lang}</language>`,
    items: posts.map(({ slug, entry }) => ({
      link: getPostUrl(slug, lang),
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
    })),
  });
}

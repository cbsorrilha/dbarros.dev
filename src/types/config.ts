interface SiteConfig {
  /** Deployed URL of the site, e.g. "https://example.com" */
  url: string;
  /** Blog title shown in header and meta tags */
  title: string;
  /** Default post author name */
  author: string;
  /** Author profile URL (used in structured data) */
  profile?: string;
  /** Fallback OG image filename in /public, e.g. "og.jpg" */
  ogImage?: string;
  /** IANA timezone for post dates, e.g. "Asia/Bangkok" */
  timezone?: string;
  /** Text direction */
  dir?: "ltr" | "rtl" | "auto";
  /** Google Search Console verification meta tag value */
  googleVerification?: string;
}

interface SocialLink {
  /**
   * Identificador da rede (ex.: "github", "linkedin"); o rótulo exibido vem de
   * src/pages/[lang]/about.astro.
   */
  name: string;
  url: string;
}

interface AstroPaperConfig {
  site: SiteConfig;
  /** Social profile links shown in header/footer */
  socials?: SocialLink[];
}

type ResolvedSiteConfig = Required<
  Pick<SiteConfig, "url" | "title" | "author" | "timezone" | "dir" | "ogImage">
> &
  Pick<SiteConfig, "profile" | "googleVerification">;

export interface ResolvedAstroPaperConfig {
  site: ResolvedSiteConfig;
  socials: SocialLink[];
}

/**
 * Type helper for astro-paper.config.ts.
 * Provides full IntelliSense without any runtime overhead.
 */
export function defineAstroPaperConfig(
  config: AstroPaperConfig
): AstroPaperConfig {
  return config;
}

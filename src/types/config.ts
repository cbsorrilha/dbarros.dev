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

interface FeaturesConfig {
  /** Show back button on post detail pages. Defaults to true. */
  showBackButton?: boolean;
}

interface SocialLink {
  /**
   * Must match an SVG filename in src/assets/icons/socials/.
   * e.g. "github" → src/assets/icons/socials/github.svg
   */
  name: string;
  url: string;
  /**
   * Accessible label for the icon link (aria-label, title attribute).
   * Auto-generated if omitted: "{site.title} on GitHub", "Send an email to {site.title}", etc.
   * Override when the default wording doesn't fit.
   */
  linkTitle?: string;
}

interface AstroPaperConfig {
  site: SiteConfig;
  features?: FeaturesConfig;
  /** Social profile links shown in header/footer */
  socials?: SocialLink[];
}

type ResolvedSiteConfig = Required<
  Pick<SiteConfig, "url" | "title" | "author" | "timezone" | "dir" | "ogImage">
> &
  Pick<SiteConfig, "profile" | "googleVerification">;

export interface ResolvedAstroPaperConfig {
  site: ResolvedSiteConfig;
  features: Required<FeaturesConfig>;
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

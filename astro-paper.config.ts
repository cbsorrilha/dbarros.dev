import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://dbarros.dev/",
    title: "dbarros.dev",
    description:
      "Diário público de Cesar de Barros sobre Rust, carreira e IA.",
    author: "Cesar de Barros",
    profile: "https://github.com/cbsorrilha",
    ogImage: "og-default.png",
    lang: "pt",
    timezone: "America/Sao_Paulo",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 10,
  },
  features: {
    showBackButton: true,
  },
  socials: [
    { name: "github", url: "https://github.com/cbsorrilha" },
    { name: "linkedin", url: "https://www.linkedin.com/in/cbsorrilha/" },
  ],
});

import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://dbarros.dev/",
    title: "dbarros.dev",
    author: "Cesar de Barros",
    profile: "https://github.com/cbsorrilha",
    ogImage: "og-default.png",
    timezone: "America/Sao_Paulo",
    dir: "ltr",
  },
  features: {
    showBackButton: true,
  },
  socials: [
    { name: "github", url: "https://github.com/cbsorrilha" },
    { name: "linkedin", url: "https://www.linkedin.com/in/cbsorrilha/" },
  ],
});

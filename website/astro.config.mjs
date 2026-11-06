import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Canonical origin. Override with SITE_URL for previews; production defaults to the live domain.
const siteUrl = (process.env.SITE_URL ?? "https://wallstreet.theshriks.space").replace(/\/+$/, "");

export default defineConfig({
  site: siteUrl,
  output: "static",
  // Never inline scripts: the CSP in vercel.json only allows scripts from this origin.
  vite: { build: { assetsInlineLimit: 0 } },
  redirects: { "/resources": "/docs" },
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith("/404") })],
});

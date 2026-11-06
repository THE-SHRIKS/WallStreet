import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

const siteUrl = process.env.SITE_URL?.replace(/\/+$/, "");

export default defineConfig({
  site: siteUrl,
  output: "static",
  redirects: { "/resources": "/docs" },
  integrations: [mdx(), ...(siteUrl ? [sitemap()] : [])],
});

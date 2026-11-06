import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(join(siteRoot, path), "utf8");

async function exists(path) {
  try {
    await access(join(siteRoot, path));
    return true;
  } catch {
    return false;
  }
}

test("required routes, content collections, and owned art are present", async () => {
  const routeFiles = [
    "src/pages/index.astro",
    "src/pages/product.astro",
    "src/pages/engineering.astro",
    "src/pages/articles/index.astro",
    "src/pages/articles/[slug].astro",
    "src/pages/docs/index.astro",
    "src/pages/docs/[slug].astro",
    "src/pages/about.astro",
    "src/pages/contact.astro",
    "src/pages/404.astro",
  ];

  for (const path of routeFiles) assert.ok(await exists(path), `Missing route: ${path}`);

  const articles = (await readdir(join(siteRoot, "src/content/articles"))).filter((name) => name.endsWith(".mdx"));
  const docs = (await readdir(join(siteRoot, "src/content/docs"))).filter((name) => name.endsWith(".mdx"));
  assert.ok(articles.length >= 3, "At least three authored articles are required");
  assert.ok(docs.length >= 5, "The developer documentation set is incomplete");

  for (const path of [
    "public/assets/pixel/sprite-atlas.svg",
    "public/assets/pixel/system-desktop.png",
    "public/assets/pixel/system-mobile.png",
    "public/assets/pixel/ledger-study.png",
    "public/favicon.svg",
  ]) assert.ok(await exists(path), `Missing owned asset: ${path}`);
});

test("source facts stay pinned and keep the project maturity explicit", async () => {
  const facts = await read("src/data/project-facts.ts");
  assert.match(facts, /AUDIT_COMMIT = "b7207a8177b4d9a564bf3596b8c450372d5d050b"/);
  assert.match(facts, /function sourceHref\(path: string/);
  assert.match(facts, /Database and persistence/);
  assert.match(facts, /License status/);
});

test("home sequence has a still state, reduced-motion handling, and accessible controls", async () => {
  const markup = await read("src/components/SystemSequence.astro");
  const behavior = await read("src/scripts/system-sequence.ts");
  assert.match(markup, /data-sequence-replay/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /data-agent-choice=/);
  assert.match(markup, /aria-controls="agent-explanation"/);
  assert.match(behavior, /prefers-reduced-motion/);
  assert.match(behavior, /IntersectionObserver/);
});

test("engineering map exposes a text equivalent and explains its connectors", async () => {
  const markup = await read("src/components/ArchitectureDiagram.astro");
  const data = await read("src/data/engineering.ts");
  assert.match(markup, /data-node-id=/);
  assert.match(markup, /aria-pressed="false"/);
  assert.match(markup, /architecture-outline/);
  assert.match(markup, /Diagram key/);
  assert.match(data, /id: "persistence"/);
  assert.match(data, /kind: "simulation"/);
});

test("product controls stay illustrative and contact has no false form submission", async () => {
  const product = await read("src/pages/product.astro");
  const contact = await read("src/pages/contact.astro");
  const facts = await read("src/data/project-facts.ts");
  assert.match(product, /data-risk-slider/);
  assert.match(product, /data-route-toggle/);
  assert.match(product, /data-allocation-toggle/);
  assert.match(product, /wallet-identity/);
  assert.match(product, /network-connections/);
  assert.doesNotMatch(contact, /<form\b/i);
  assert.match(contact, /issueTrackerHref/);
  assert.match(facts, /export const issueTrackerHref/);
  assert.match(facts, /\/issues/);
});

test("site metadata and security headers are defined without external assets", async () => {
  const layout = await read("src/layouts/BaseLayout.astro");
  const vercelConfig = await read("vercel.json");
  assert.match(layout, /<meta name="description"/);
  assert.match(layout, /property="og:image"/);
  assert.match(vercelConfig, /X-Content-Type-Options/);
  assert.match(vercelConfig, /Referrer-Policy/);
  assert.match(vercelConfig, /Content-Security-Policy/);
});

test("tokens define a pure black base with one restrained purple accent", async () => {
  const tokens = await read("src/styles/tokens.css");
  assert.doesNotMatch(tokens, /data-theme/);
  assert.match(tokens, /--bg:\s*#000000;/);
  assert.match(tokens, /--accent:\s*#a597f5;/i);
  assert.match(tokens, /--text:\s*#ece8df;/i);
  assert.match(tokens, /--font-serif:\s*"Instrument Serif"/);
  assert.match(tokens, /--font-sans:\s*"Newsreader"/);
});

test("fonts are loaded and no pixel theme or toggle remains", async () => {
  const layout = await read("src/layouts/BaseLayout.astro");
  const header = await read("src/components/SiteHeader.astro");
  assert.match(layout, /@fontsource\/instrument-serif/);
  assert.match(layout, /@fontsource\/newsreader/);
  assert.doesNotMatch(layout, /fonts\.googleapis|Silkscreen|Inter:/);
  assert.doesNotMatch(header, /ThemeToggle|data-theme/);
  assert.ok(!(await exists("src/styles/pixel.css")), "pixel stylesheet should be removed");
  assert.ok(!(await exists("src/components/PixelArt.astro")), "pixel components should be removed");
});

test("home hero uses the dithered sphere with a still state for reduced motion", async () => {
  const sphere = await read("src/components/DitherArt.astro");
  const home = await read("src/pages/index.astro");
  assert.match(sphere, /prefers-reduced-motion/);
  assert.match(sphere, /role="img"/);
  assert.match(home, /DitherArt/);
  assert.match(home, /Agent-driven finance/);
  assert.match(home, /github|REPOSITORY_URL/);
});

test("no gradients, blur, or legacy ink/paper tokens remain in site source", async () => {
  const { readdir, stat } = await import("node:fs/promises");
  const walk = async (dir) => {
    const out = [];
    for (const name of await readdir(join(siteRoot, dir))) {
      const path = `${dir}/${name}`;
      if ((await stat(join(siteRoot, path))).isDirectory()) out.push(...(await walk(path)));
      else out.push(path);
    }
    return out;
  };
  const files = (await walk("src")).filter((path) => /\.(css|astro|ts|tsx|mdx)$/.test(path) && path !== "src/styles/site.css");
  const banned = /linear-gradient|radial-gradient|blur\(|backdrop-filter|var\(--ink|var\(--paper|--ink-|--paper-/;
  const offenders = [];
  for (const path of files) {
    if (banned.test(await read(path))) offenders.push(path);
  }
  assert.deepEqual(offenders, [], `Remove gradients, blur, and ink/paper tokens from: ${offenders.join(", ")}`);
});

test("resources are in navigation and listed with source-status labels", async () => {
  const site = await read("src/data/site.ts");
  const resources = await read("src/data/resources.ts");
  assert.match(site, /href: "\/docs", label: "Docs"/);
  assert.match(resources, /export const RESOURCES/);
  assert.match(resources, /REPOSITORY_URL/);
  assert.match(resources, /issueTrackerHref/);
  assert.match(resources, /License status|license/i);
});

test("resources page renders every resource with its kind and no form", async () => {
  const page = await read("src/pages/docs/index.astro");
  assert.match(page, /RESOURCES/);
  assert.match(page, /"_blank"/);
  assert.match(page, /"noreferrer"/);
  assert.doesNotMatch(page, /<form\b/i);
});

test("pages avoid banned marketing vocabulary", async () => {
  const pages = ["index", "product", "about", "contact", "engineering"].map((name) => `src/pages/${name}.astro`);
  const banned = /revolutionary|seamless|next-generation|cutting-edge|unlock|empower|AI-powered|leverage/i;
  const hits = [];
  for (const page of pages) {
    if (banned.test(await read(page))) hits.push(page);
  }
  assert.deepEqual(hits, [], `Remove banned wording from: ${hits.join(", ")}`);
});

test("focus is visible and body text is at least 16px", async () => {
  const global = await read("src/styles/global.css");
  assert.match(global, /:focus-visible/);
  assert.match(global, /outline:\s*\dpx solid var\(--focus\)/);
  assert.match(global, /body\s*\{[^}]*font-size:\s*1(\.\d+)?rem/);
});

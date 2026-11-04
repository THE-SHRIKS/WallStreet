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

const siteOrigin = import.meta.env.SITE;

export const prerender = true;

export function GET() {
  const sitemapLine = siteOrigin
    ? `Sitemap: ${new URL("/sitemap-index.xml", siteOrigin).toString()}\n`
    : "";
  const body = `User-agent: *\nAllow: /\n${sitemapLine}`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

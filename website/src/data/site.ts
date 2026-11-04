import { issueTrackerHref, latestSourceHref, REPOSITORY_URL } from "./project-facts";

export const SITE_NAME = "Wall Street";
export const SITE_DESCRIPTION =
  "A source-led guide to Wall Street: an in-development project exploring agent orchestration, risk boundaries, and simulated financial workflows.";

export const PRIMARY_NAVIGATION = [
  { href: "/product", label: "Product" },
  { href: "/engineering", label: "Engineering" },
  { href: "/articles", label: "Articles" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_LINKS = [
  { href: "/product", label: "Product" },
  { href: "/engineering", label: "Engineering" },
  { href: "/articles", label: "Articles" },
  { href: "/docs", label: "Documentation" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: REPOSITORY_URL, label: "GitHub repository", external: true },
  { href: issueTrackerHref, label: "Issue tracker", external: true },
  { href: latestSourceHref, label: "Latest source", external: true },
];

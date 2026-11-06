import { issueTrackerHref, latestSourceHref, REPOSITORY_URL } from "./project-facts";

export interface Resource {
  title: string;
  description: string;
  href: string;
  external: boolean;
  kind: "Source" | "Discussion" | "Media" | "Research" | "Status";
}

export const RESOURCES: Resource[] = [
  {
    title: "Repository",
    description: "The full source for the WallStreet project, including every service in this review.",
    href: REPOSITORY_URL,
    external: true,
    kind: "Source",
  },
  {
    title: "Latest source",
    description: "The main branch. The site itself records the pinned commit it was reviewed against.",
    href: latestSourceHref,
    external: true,
    kind: "Source",
  },
  {
    title: "Issue tracker",
    description: "Report a bug, ask a question, or propose a change. Security reports should not be filed publicly.",
    href: issueTrackerHref,
    external: true,
    kind: "Discussion",
  },
  {
    title: "Demo video",
    description: "A recording of the project. It was made by the maintainers and is not a live deployment.",
    href: "https://drive.google.com/file/d/1nLhSK99C3LHHQoPAALbXomUnGBvWeUlN/view?usp=sharing",
    external: true,
    kind: "Media",
  },
  {
    title: "License status",
    description: "No repository-level licence file was present in the reviewed snapshot. Treat reuse as not yet granted.",
    href: "/docs/security-and-limitations",
    external: false,
    kind: "Status",
  },
];

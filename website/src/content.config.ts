import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const tocItem = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

const articles = defineCollection({
  loader: glob({ base: "./src/content/articles", pattern: "**/*.mdx" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(20).max(180),
    category: z.enum(["Engineering notes", "Design decisions", "Development logs"]),
    order: z.number().int().positive(),
    motif: z.enum(["network", "threshold", "ledger"]),
    tags: z.array(z.string()).default([]),
    toc: z.array(tocItem).default([]),
  }),
});

const docs = defineCollection({
  loader: glob({ base: "./src/content/docs", pattern: "**/*.mdx" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(20).max(180),
    navLabel: z.string().min(1),
    order: z.number().int().positive(),
    toc: z.array(tocItem).default([]),
  }),
});

export const collections = { articles, docs };

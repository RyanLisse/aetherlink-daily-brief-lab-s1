import { z } from "zod";

// The contract for one morning brief. Every rule here is quoted from the
// two Dia reference briefs in reference/ (see docs/spec.md).

const wordCount = (s: string) => s.trim().split(/\s+/).length;

const Title = z
  .string()
  .trim()
  .min(1)
  .refine((s) => wordCount(s) <= 9, "title: at most nine words");

const Body = z
  .string()
  .trim()
  .min(1)
  .max(600)
  .refine((s) => !/^\s*[-*•]\s/m.test(s), "body: prose only, no bullet lists");

export const Source = z.enum([
  "gitlab",
  "jira",
  "confluence",
  "outlook",
  "github",
  "linear",
  "notion",
  "calendar",
]);

const Item = z.object({
  title: Title,
  body: Body,
  source: Source,
  url: z.url().optional(),
});

const Update = Item.extend({
  // The small italic label after the title: "Catapulze", "CI/CD".
  label: z.string().trim().min(1).max(40),
});

const Event = z.object({
  start: z.iso.datetime({ offset: true }),
  end: z.iso.datetime({ offset: true }),
  title: Title,
  body: Body.optional(),
});

const Painting = z.object({
  title: z.string().trim().min(1),
  artist: z.string().trim().min(1),
  year: z.string().trim().min(1),
  medium: z.string().trim().min(1),
  imageUrl: z.url(),
  publicDomain: z.literal(true),
});

export const BriefSchema = z.object({
  date: z.iso.date(),
  generatedAt: z.iso.datetime({ offset: true }),
  language: z.enum(["en", "nl"]),
  painting: Painting,
  greeting: Body,
  push: Item,
  todos: z.array(Item).max(3),
  updates: z.array(Update).max(5),
  day: z.array(Event),
  sources: z.array(Source).min(1),
  notes: z.array(z.string().trim().min(1)).default([]),
});

export type Brief = z.infer<typeof BriefSchema>;
export type BriefInput = z.input<typeof BriefSchema>;

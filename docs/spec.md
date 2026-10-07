# Spec — Daily brief

Status: `ACTIVE — 2026-10-07`

Source: `reference/The Tuesday Brief - September 1.pdf` and `reference/The Wednesday Brief - August 26.pdf` (Dia, exported 9/15/26). Both are private exports and are not committed.

## The artifact

One page, read top to bottom. Section names and order are quoted from the references.

1. A painting, full width, with a caption line under it: `"A Light on the Sea, Winslow Homer, 1897. oil on canvas"` (Tuesday). The date sits left of the painting in italics (`"01 SEP 2026"`), the time right (`"10:55 AM"`).
2. The masthead over the painting: `"The"` in italic, then `"Tuesday Brief"` in a large serif. The weekday changes per day.
3. A greeting, two italic lines, written to the reader about the shape of the day: `"Your calendar is a blank canvas today. Just you, the agents, and a wide-open runway."` (Tuesday); `"Wednesday, and it's just you and a wide-open morning until one call rolls in this afternoon. The good kind of quiet."` (Wednesday).
4. `"Push your work forward"`: exactly one item, a bold title and one short paragraph, with a `"Let's do it →"` action at the right. Tuesday: `"Turn the Hetzner deploy runbook into a go/no-go call"`.
5. `"Top to-dos"`: two (Tuesday) or three (Wednesday) items, each with a circle, a bold title, a source icon after the title, and one paragraph.
6. `"New updates"`: numbered `01`, `02` … with a bold title, a small italic label after it (`"Catapulze"`, `"CI/CD"`) and one paragraph ending in the source icon.
7. `"Your day"`: a time list (`"2:00p  Ryan / Robbie (Catapulze)"`) followed by one block per event with `"— 2:00 PM – 3:00 PM"` and a sentence (Wednesday). On the Tuesday brief, where the calendar was empty, the section does not appear at all.
8. A footer: `"Made for you by Dia using your GitHub."` (Tuesday) or `"… using your Linear and Google Calendar."` (Wednesday), then `"With love from B C N Y"`. We replace the Dia line with the sources that actually answered.

## The contract

Encoded in `src/brief.ts`, checked by `test/schema.test.ts`, exemplified by `sample/brief.sample.json`.

| Field | Type | Rule | Example from the reference |
| --- | --- | --- | --- |
| `date` | ISO date | the day the brief is about | `01 SEP 2026` |
| `generatedAt` | ISO datetime with offset | the time printed on the right | `10:55 AM` |
| `language` | `en` \| `nl` | one language per brief, nothing else | both references are `en` |
| `painting` | object | title, artist, year, medium, image URL, `publicDomain: true` | `A Light on the Sea, Winslow Homer, 1897. oil on canvas` |
| `greeting` | prose | one or two sentences about the shape of the day | `Your calendar is a blank canvas today.` |
| `push` | item | required, exactly one | `Turn the Hetzner deploy runbook into a go/no-go call` |
| `todos` | item[] | zero to three | Tuesday has two, Wednesday three |
| `updates` | update[] | zero to five, each with a short label | `Postgres test-isolation fix merged, with loose ends` + `Catapulze` |
| `day` | event[] | start, end, title, optional sentence; may be empty | `Ryan / Robbie (Catapulze) — 2:00 PM – 3:00 PM` |
| `sources` | source[] | at least one; names only the sources that answered | `GitHub` / `Linear and Google Calendar` |
| `notes` | string[] | every silent or failed source, one line each; defaults to none | not in the reference, required by `intent.md` |
| item `title` | prose | imperative, at most nine words, names the artifact | `Fix the failing verification dashboard workflow` (6 words) |
| item `body` | prose | one paragraph, no bullet lists, at most 600 characters | `The scheduled monitoring run hard-failed at 10:13 this morning …` |
| item `source` | enum | gitlab, jira, confluence, outlook, github, linear, notion, calendar | the icon after each title |

## House style

- Second person, present tense, warm and specific. `"The good kind of quiet."`
- One paragraph per item. No bullet lists inside a body, no headings inside a body.
- Titles are imperative and name the thing: a PR number, a workflow, a ticket. `"Finish and merge PR #51, the verify-skill sync"`.
- Numbers and identifiers are copied, never rounded: `"2,602 stale checkpoint rows"`, `"RJC-369"`.
- No hype, no emoji, no exclamation marks. The reference uses none.
- The first-person voice belongs to the agent only in the push item's offer: `"I can pull all of it into one prioritized readiness brief."`

## What the agent may never do

- Invent a fact. Every sentence traces back to a tool result (`intent.md`, success check 4).
- Hide a silent source. A source that errored or returned nothing is named in `notes`.
- Write to any source system, or send the brief anywhere (`intent.md`, boundary).
- Use a painting that is not public domain (`publicDomain` must be `true`).

## Acceptance examples

| Given | When | Then | Proof |
| --- | --- | --- | --- |
| `sample/brief.sample.json` | parsed by `BriefSchema` | it passes; push title, two to-dos, empty day | `npm test` |
| the sample without `push` | parsed | rejected | `npm test` |
| a title of ten words | parsed | rejected | `npm test` |
| a body with `- ` bullet lines | parsed | rejected | `npm test` |
| four to-dos | parsed | rejected | `npm test` |
| empty `todos`, `updates`, `day`, no `notes` | parsed | passes, `notes` is `[]` | `npm test` |
| `language: "de"` | parsed | rejected | `npm test` |
| `publicDomain: false` | parsed | rejected | `npm test` |

## OPEN

- Whether the time on the right is generation time or the reader's local time at open. The reference shows `10:55 AM` and `04:10 AM`; `04:10` looks like a scheduled run, not a reading time. Modelled as `generatedAt`.
- The exact cap on `updates`. Both references show one; five is a guess.
- Where the painting comes from and how it rotates. Both references use public-domain oils; the source catalog is undecided (step 3).
- The Dutch wording of the section names when `language` is `nl` (step 4).

# Walk the lesson alone

The same seven steps as the guided lesson (`LESSON.md`), for one person with
their own GitHub, Linear and Notion instead of the team's GitLab, Jira and
Confluence. Nothing here needs a colleague except step 6, where a reviewer
reruns one command — ask anyone, or rerun it yourself the next day and say so.

Budget: one working day, or two half days with the break after step 4.

## Before you start

1. Node 20 or newer: `node --version`.
2. Clone the lab and start from `main`:

   ```bash
   git clone https://github.com/RyanLisse/aetherlink-daily-brief-lab-s1
   cd aetherlink-daily-brief-lab-s1
   git switch -c my/<your-name>
   npm ci
   ```

   `main` is step 0: templates and the package skeleton. The `solution` branch
   carries one commit per step; `step-1-intent` … `step-7-gate-deploy` are
   tags on those commits, `steps/N-…` the same commits as branches.
3. Claude Code in the repository root. It drafts; you cut and decide.
4. Tokens, all read-only, all in `.env` (copied from `.env.example`), never in
   a prompt or a commit:

   | Source | Where | What to set |
   | --- | --- | --- |
   | GitHub | Settings → Developer settings → Fine-grained tokens; repository access: the repos you want in the brief; permissions read-only: Contents, Issues, Pull requests, Metadata, and account permission Notifications | `GITHUB_TOKEN`, optional `GITHUB_REPOS=you/repo-a,you/repo-b` |
   | Linear | Settings → API → Personal API keys | `LINEAR_API_KEY`, optional `LINEAR_TEAMS=AL,OPS` |
   | Notion | notion.so/my-integrations → New internal integration, capability "Read content" only; then on each page you want read: ··· → Connections → add the integration | `NOTION_TOKEN` |
   | Claude | console.anthropic.com | `ANTHROPIC_API_KEY`, `BRIEF_RECIPIENT=<your first name>` |

   Any subset works. A source with no token is skipped and the brief says so
   in its notes. You need none of them before step 5.

The three commands you will use all day:

```bash
git diff main step-2-spec --stat              # what a step adds
git diff step-2-spec -- docs/spec.md          # your file against the reference
git checkout step-5-build-agent -- src/sources.ts   # take one reference file
```

## The seven steps

Each step ends with a commit on your branch and one check you can answer with
yes or no. If the answer is no, the step is not done; unrun checks are `OPEN`,
never failures.

Paste-ready prompts for all seven steps: [docs/prompts.md](docs/prompts.md).
Under each step below, the **Prompt** block is the exact text to paste into
Claude Code for that step.

### 1 · Plan — intent (15 min)

Fill `intent.md`: one outcome sentence, three success checks a stranger can
verify, the boundary (what the agent may never touch), owners, at least one
`OPEN`. Ask Claude Code to interview you one question at a time and fill the
file in place; then cut.

- Reference: `git diff step-1-intent -- intent.md`
- Check: could a stranger verify each of your three checks without asking you?
- Gate: you are your own facilitator here. Read the boundary aloud. If any
  line is a wish rather than a rule, it is NEEDS REVISION — no step 2 yet.

**Prompt**

```
We are on step 1 of SOLO.md. Read SOLO step 1, AGENTS.md, intent.md, and progress.md.

Interview me one question at a time. Fill intent.md in place. Do not skip ahead.
Write one outcome sentence. Write three success checks a stranger can verify. Write the boundary: what the agent may never do. Fill owners. Add at least one OPEN line for what we do not know yet.

Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: could a stranger verify each of the three success checks without asking me?
Then stop for my gate review. Read the boundary aloud with me. Do not start step 2 until I accept.
```

### 2 · Plan — spec and contract, test first (25 min)

`docs/spec.md` with one quoted example per field from the two reference PDFs
in `reference/`; then `test/schema.test.ts` red; then `src/brief.ts` and
`sample/brief.sample.json` until `npm test` is green. No renderer, no tools.

- Reference: `git diff step-2-spec --stat`, then one file at a time
- Check: does `git log` show the test commit before `brief.ts`? Does every
  field in `brief.ts` have a spec row with a quote?

**Prompt**

```
We are on step 2 of SOLO.md. Read SOLO step 2, AGENTS.md, intent.md, and progress.md.

Write docs/spec.md first. Quote one real example per field from the two reference PDFs in reference/. If a PDF is missing, say so and mark that row OPEN. Do not guess quotes.

Write test/schema.test.ts next. Run npm test. The schema tests must fail before you add production code.

Then add src/brief.ts and sample/brief.sample.json until npm test is green on the schema tests.
Do not add a renderer. Do not add agent tools.

Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: does git log show the test commit before brief.ts? Does every field in brief.ts have a spec row with a quote?
```

### 3 · Design — one decision, a plan with proof (15 min)

`docs/design.md` (the parts), one ADR in `docs/decisions/` for one decision
you actually made, `docs/plan.md` with ordered steps, exact paths, one proof
command per step, rollback and the gate before the build. Use Claude Code in
plan mode: read-only until you accept the plan.

- Reference: `git diff step-3-design -- docs/plan.md`
- Check: can a stranger name what proves each step complete?

- Claude Code cue: **subagents** — spawn only when `docs/plan.md` names a parallel read; add when needed.

**Prompt**

```
We are on step 3 of SOLO.md. Read SOLO step 3, AGENTS.md, intent.md, and progress.md.

Use plan mode. Stay read-only until I accept the plan.

Draft docs/design.md for the main parts. Write one ADR in docs/decisions/ for one decision we actually made. Write docs/plan.md with ordered steps, exact file paths, one proof command per step, rollback notes, and the gate before the build step.

Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: can a stranger name what proves each plan step complete?
Wait for my acceptance before any build work in step 4.
```

### 4 · Build — render the sample, the first artifact (25 min)

`test/render.test.ts` red, then `src/render.ts` and a sample-only
`src/main.ts`. `npm run brief:sample` writes `out/latest.html`; open it next
to the PDF. Change one house-style rule test-first. Keep a 1440×900
screenshot for step 6.

- Reference: `git checkout step-4-build-render -- src/render.ts` if stuck, then read the diff
- Check: does the page render without any API key? Does the script-tag test
  prove escaping?

**Prompt**

```
We are on step 4 of SOLO.md. Read SOLO step 4, AGENTS.md, intent.md, and progress.md.

Write test/render.test.ts first. Run npm test. The render tests must fail before you add production code.

Then add src/render.ts and a sample-only src/main.ts. Run npm run brief:sample. It must write out/latest.html with no API keys.

Change one house-style rule test-first. Keep a 1440×900 screenshot of the page for step 6.

Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: does the page render without any API key? Does the script-tag test prove escaping?
```

### 5 · Build — the loop and one read-only tool (20 min + the live run)

First take the reference files — this is the deliberate catch-up:

```bash
git checkout step-5-build-agent -- src/sources.ts src/agent.ts src/main.ts test/agent.test.ts
npm run typecheck && npm test
```

Read `agent.ts` once: `tools: []`, `allowedTools`, `permissionMode: "dontAsk"`,
`outputFormat`. Then add **one** read-only tool to `sources.ts` following the
`tool()` + `guarded()` shape — for example `github_failed_workflows`,
`linear_due_this_week` or `notion_page_comments` — with a wiring test and no
write access.

Now the live run, with your tokens in `.env`:

```bash
set -a && . ./.env && set +a
npm run brief 2> run.log
```

Read `run.log`: the `mcp=[…]` line names the connected sources, every `→`
line is a tool call. Then read `out/latest.html`.

- Check: is every sentence in the brief traceable to a tool call in `run.log`?
  Did the model get no shell and no write? Where is the human — after the
  run, not inside it?

- Claude Code cue: **skills** — a slash skill only when this SOLO needs one; add when needed.
- Claude Code cue: **MCP** — connected sources already show on the `mcp=[…]` line in `run.log`; add a server only if this step needs one.

**Prompt**

```
We are on step 5 of SOLO.md. Read SOLO step 5, AGENTS.md, intent.md, and progress.md.

First run in the terminal:
git checkout step-5-build-agent -- src/sources.ts src/agent.ts src/main.ts test/agent.test.ts
npm run typecheck && npm test

Read src/agent.ts once: tools is empty, allowedTools, permissionMode dontAsk, outputFormat. Do not widen permissions. Do not add write scope.

Add exactly one read-only tool in src/sources.ts. Follow the tool() and guarded() shape. Examples: github_failed_workflows, linear_due_this_week, notion_page_comments. Add a wiring test. No write access.

After I load tokens in .env locally, I will run npm run brief and save run.log. Help me read run.log: the mcp=[…] line and each tool call line. Every sentence in out/latest.html must trace to a tool call.

Do not put credentials in the repo or in this chat. Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: is every brief sentence traceable to run.log? Did the model get no shell and no write?
```

### 6 · Test — record the evidence (15 min)

`docs/evidence.md`: three commands with the exit code you saw and one quoted
output line (`npm run typecheck`, `npm test`, `npm run brief` or
`brief:sample`), the screenshot under `docs/evidence/`, and a reviewer who
reran one command. Differences from the PDFs are `OPEN`.

- Check: does every row name a command that actually ran?

**Prompt**

```
We are on step 6 of SOLO.md. Read SOLO step 6, AGENTS.md, intent.md, and progress.md.

Fill docs/evidence.md. Record three commands I actually ran: npm run typecheck, npm test, and npm run brief or npm run brief:sample. For each row write the exit code I saw and one quoted output line.

Add the step 4 screenshot under docs/evidence/. Note a reviewer who reran one command. List differences from the PDFs as OPEN.

Do not invent exit codes or output. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: does every row name a command that actually ran?
```

### 7 · Deploy — the gate and the schedule (15 min)

Open a pull request from `my/<your-name>`. Read it against `intent.md` and
fill `docs/gate.md`: PASS / FAIL / OPEN per success check, one quoted line
each, the handoff. Then the schedule: a cron line, or a GitHub Actions
workflow that runs `npm run brief` every weekday morning with the tokens as
repository secrets and publishes `out/latest.html` as an artifact
(`gitlab-ci.example.yml` shows the GitLab version; the shape is the same).

- Check: does no PASS rest on a check you did not read? Is every credential
  in a secret, none in the repo?

- Claude Code cue: **hooks** — at `docs/gate.md`, a stop/ask hook when needed.
- Claude Code cue: **workflows** — weekday schedule is this step (Actions / cron); extend when needed.

**Prompt**

```
We are on step 7 of SOLO.md. Read SOLO step 7, AGENTS.md, intent.md, and progress.md.

Open a pull request from my branch. Help me fill docs/gate.md against intent.md. Use PASS, FAIL, or OPEN per success check. Quote one line per row. Write the handoff.

Add a weekday schedule: a cron line or a GitHub Actions workflow that runs npm run brief on weekday mornings. Store tokens as repository secrets only. Publish out/latest.html as an artifact. Use gitlab-ci.example.yml as shape reference if helpful.

Do not commit secrets. Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: does no PASS rest on a check I did not read? Is every credential in a secret, none in the repo?
```

## When you are done

Seven files a stranger can point at, one brief you did not write, and a gate
you decided. Tomorrow's run reads what you merged today; when a footnote in
the brief changes `intent.md`, the loop has closed.

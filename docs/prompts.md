# Claude Code prompts — seven steps

Paste one block per SOLO step. Each block matches [SOLO.md](../SOLO.md). Work on your branch from `main`. Do not put tokens or secrets in a prompt or a commit.

Full walkthrough: [SOLO.md](../SOLO.md).

---

## Step 1 · Plan — intent

```
We are on step 1 of SOLO.md. Read SOLO step 1, AGENTS.md, intent.md, and progress.md.

Interview me one question at a time. Fill intent.md in place. Do not skip ahead.
Write one outcome sentence. Write three success checks a stranger can verify. Write the boundary: what the agent may never do. Fill owners. Add at least one OPEN line for what we do not know yet.

Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: could a stranger verify each of the three success checks without asking me?
Then stop for my gate review. Read the boundary aloud with me. Do not start step 2 until I accept.
```

---

## Step 2 · Plan — spec and contract, test first

```
We are on step 2 of SOLO.md. Read SOLO step 2, AGENTS.md, intent.md, and progress.md.

Write docs/spec.md first. Quote one real example per field from the two reference PDFs in reference/. If a PDF is missing, say so and mark that row OPEN. Do not guess quotes.

Write test/schema.test.ts next. Run npm test. The schema tests must fail before you add production code.

Then add src/brief.ts and sample/brief.sample.json until npm test is green on the schema tests.
Do not add a renderer. Do not add agent tools.

Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: does git log show the test commit before brief.ts? Does every field in brief.ts have a spec row with a quote?
```

---

## Step 3 · Design — one decision, a plan with proof

```
We are on step 3 of SOLO.md. Read SOLO step 3, AGENTS.md, intent.md, and progress.md.

Use plan mode. Stay read-only until I accept the plan.

Draft docs/design.md for the main parts. Write one ADR in docs/decisions/ for one decision we actually made. Write docs/plan.md with ordered steps, exact file paths, one proof command per step, rollback notes, and the gate before the build step.

Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: can a stranger name what proves each plan step complete?
Wait for my acceptance before any build work in step 4.
```

---

## Step 4 · Build — render the sample, the first artifact

```
We are on step 4 of SOLO.md. Read SOLO step 4, AGENTS.md, intent.md, and progress.md.

Write test/render.test.ts first. Run npm test. The render tests must fail before you add production code.

Then add src/render.ts and a sample-only src/main.ts. Run npm run brief:sample. It must write out/latest.html with no API keys.

Change one house-style rule test-first. Keep a 1440×900 screenshot of the page for step 6.

Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: does the page render without any API key? Does the script-tag test prove escaping?
```

---

## Step 5 · Build — the loop and one read-only tool

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

---

## Step 6 · Test — record the evidence

```
We are on step 6 of SOLO.md. Read SOLO step 6, AGENTS.md, intent.md, and progress.md.

Fill docs/evidence.md. Record three commands I actually ran: npm run typecheck, npm test, and npm run brief or npm run brief:sample. For each row write the exit code I saw and one quoted output line.

Add the step 4 screenshot under docs/evidence/. Note a reviewer who reran one command. List differences from the PDFs as OPEN.

Do not invent exit codes or output. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: does every row name a command that actually ran?
```

---

## Step 7 · Deploy — the gate and the schedule

```
We are on step 7 of SOLO.md. Read SOLO step 7, AGENTS.md, intent.md, and progress.md.

Open a pull request from my branch. Help me fill docs/gate.md against intent.md. Use PASS, FAIL, or OPEN per success check. Quote one line per row. Write the handoff.

Add a weekday schedule: a cron line or a GitHub Actions workflow that runs npm run brief on weekday mornings. Store tokens as repository secrets only. Publish out/latest.html as an artifact. Use gitlab-ci.example.yml as shape reference if helpful.

Do not commit secrets. Do not invent evidence. Mark unrun checks OPEN.
Stop when I can answer the step check yes or no: does no PASS rest on a check I did not read? Is every credential in a secret, none in the repo?
```

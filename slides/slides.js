/* One object per slide. kind: title | section | explain | demo | do
   Fields: stage (SDLC stage), step (lab step), title, lead, points, cols [[head, text]],
   chain, steps, code (+ codeLabel), check, time (minutes), notes (press N).
   term + def: the definition box. Demo and do slides inherit the previous term.
   visual: a drawing from VISUALS in app.js, shown on the right.
   `backticks` render as inline code. Lab refs: github.com/RyanLisse/aetherlink-daily-brief-lab-s1 */
window.SLIDES = [

// ── Opening ──────────────────────────────────────────────────────────────
{ kind: "title",
  title: "Build a daily brief agent",
  lead: "The AI-native SDLC, hands-on. One agent, six stages, one artifact per step.",
  term: "AI-native SDLC",
  def: "A software lifecycle where an agent does the reading, drafting and checking at every stage, and a person judges the file each stage commits.",
  visual: "cycle",
  notes: "On screen while people come in. One sentence of welcome, then go straight to slide 2." },

{ kind: "explain",
  title: "Code is no longer the bottleneck",
  lead: "Claude writes the code fast. The slow parts are now the human-speed stages around it: deciding what to build, proving it works, and letting it ship.",
  term: "Human-speed stage",
  def: "A step where work waits for a person to decide, review or approve. This is where AI-native teams win time.",
  points: [
    "The agent does the reading, drafting and checking.",
    "The judging stays with a person, and every judgment leaves a file behind.",
    "Each stage ends with a committed artifact that the next stage reads.",
  ],
  notes: "Source: Anthropic, 'The AI-native SDLC playbook'. The claim to land: speed comes from a better handoff between stages, not from typing faster." },

{ kind: "explain",
  title: "Six stages, one artifact each",
  term: "Artifact",
  def: "A committed file that the next stage reads. The chain of artifacts is the workflow.",
  visual: "cycle",
  chain: ["intent.md", "spec.md", "plan.md", "diff + tests", "evidence", "gate.md", "next intent.md"],
  notes: "The rail at the bottom of every slide is this cycle. Point at it: 'you always know where you are in the loop'." },

{ kind: "explain",
  title: "What we build today",
  lead: "Every weekday morning: one page that tells you what to push, what is waiting on you, what changed overnight and what the day looks like.",
  term: "Agent",
  def: "A model running in a loop with tools. It picks a tool, reads the result, and repeats until it can answer.",
  visual: "flow",
  notes: "The page reads like Dia's 'Tuesday Brief'. The reading moves to an agent; the judging stays with the person. Everything the model returns is validated against a schema and escaped by our own renderer." },

{ kind: "explain",
  title: "How every beat runs",
  term: "OPEN",
  def: "Not proven yet. You write it down instead of guessing. It's honest, not a failure.",
  cols: [
    ["Explain", "One idea and the artifact it produces. A few minutes."],
    ["Demo", "I do it live with Claude Code, including my mistakes."],
    ["You do it", "On your own machine and branch. Timed. It ends with a yes-or-no check."],
  ],
  points: [
    "Sample data only. No credential goes into a prompt or a commit.",
    "Stuck? Take the reference file and read the diff. That is catching up, not cheating.",
  ],
  notes: "Colour code: cyan is explain, violet is demo, amber is your turn. Say this once; the room picks it up." },

{ kind: "do", time: 5,
  title: "Set up your machine",
  term: "Reference step",
  def: "A tag holding the finished answer for one lab step, such as `step-2-spec`. Diff against it to compare or catch up.",
  steps: [
    "`node --version` must show 20 or newer",
    "`git clone https://github.com/RyanLisse/aetherlink-daily-brief-lab-s1 && cd aetherlink-daily-brief-lab-s1`",
    "`git switch -c my/<your-name>`, then `npm ci`",
    "Open Claude Code in the repo root and ask: “Read CLAUDE.md, intent.md and progress.md. What is this lab?”",
  ],
  check: "Claude Code can explain the seven lab steps back to you.",
  notes: "`main` is step 0: templates and a package skeleton. The reference answers are the tags step-1-intent … step-7-gate-deploy." },

// ── 1 · Plan ─────────────────────────────────────────────────────────────
{ kind: "section", stage: "Plan", title: "Plan", lead: "Say what done means before anyone writes code.", visual: "cycle" },

{ kind: "explain", stage: "Plan", step: 1,
  title: "intent.md: an outcome with a boundary",
  term: "Intent",
  def: "The committed statement of the outcome, the checks that prove it, and the boundary the agent must never cross. Every later step is judged against it.",
  visual: "intent",
  points: [
    "Outcome: one result you can observe.",
    "Success checks: a stranger can verify each one with one command or one look.",
    "Boundary: what the agent may never do, and when it must stop.",
    "Owners: reader, maintainer and gate are three different people.",
  ],
  notes: "The playbook: ideas go from multi-week ticket refinement to hours, because the originator brainstorms with Claude and a product owner commits the result. The boundary is the part people skip, and it's the part the gate reads later." },

{ kind: "demo", stage: "Plan", step: 1,
  title: "Claude interviews me, I cut",
  codeLabel: "Prompt",
  code: `Interview me one question at a time to fill intent.md in place.
Outcome first, then three success checks a stranger can verify,
then the boundary. Push back when a check is a wish, not a test.`,
  points: [
    "Rewrite one boundary line out loud until it's a rule rather than a wish.",
    "Compare with the reference: `git diff step-1-intent -- intent.md`",
  ],
  notes: "Good line from the reference to show: 'The model never invents a fact. When a tool errors or a window is empty, the brief says so in notes instead of filling the gap.' Deliberately accept one weak check first, then catch it." },

{ kind: "do", stage: "Plan", step: 1, time: 15,
  title: "Write your intent.md",
  steps: [
    "Let Claude interview you. Answer, then cut every sentence that isn't a decision",
    "Three success checks, plus at least one `OPEN` check that needs a live run",
    "A boundary: no writes to any source, no sending, no stored credential",
    "Read the boundary aloud to your neighbour. They answer ACCEPT or NEEDS REVISION",
    "Commit: `git commit -am \"Step 1 — intent\"`",
  ],
  check: "could a stranger verify each check without asking you?",
  notes: "No step 2 before an ACCEPT. That is the first human gate and the habit you are teaching." },

// ── 2 · Design ───────────────────────────────────────────────────────────
{ kind: "section", stage: "Design", title: "Design", lead: "Turn the intent into a contract that a test can hold.", visual: "cycle" },

{ kind: "explain", stage: "Design", step: 2,
  title: "The spec becomes a schema, test first",
  term: "Contract",
  def: "A schema that both the test and the model must satisfy. If the model returns anything else, the run fails before anyone reads it.",
  visual: "contract",
  points: [
    "`docs/spec.md`: one row per field, each with a quoted example.",
    "`test/schema.test.ts` goes red before `src/brief.ts` exists.",
    "The same zod schema is the agent's output format.",
  ],
  notes: "Playbook: policy is applied while the spec is written, not discovered in review. No renderer and no tools yet, just the contract." },

{ kind: "demo", stage: "Design", step: 2,
  title: "Red, then green",
  codeLabel: "src/brief.ts (reference)",
  code: `const ItemSchema = z.object({
  title: z.string()
    .describe("Imperative headline, max ~9 words, naming the concrete artifact (MR !142, AL-231)."),
  body: z.string()
    .describe("Two to four plain sentences: what is true right now, who is waiting, why today."),
  link: LinkSchema.optional(),
});`,
  points: ["Show that `git log` has the test commit before `brief.ts`.", "`npm test` → the three schema tests pass."],
  notes: "Point out: `.describe()` is prompt text living in the schema. Length rules stay in the prompt, not in the validator." },

{ kind: "do", stage: "Design", step: 2, time: 25,
  title: "Spec, red test, contract",
  steps: [
    "`docs/spec.md`: every field with one quoted example",
    "`test/schema.test.ts`: a brief without a push item is rejected. Commit it red",
    "`src/brief.ts` + `sample/brief.sample.json` until `npm test` is green",
    "Stuck: `git diff main step-2-spec --stat`",
  ],
  check: "every field in `brief.ts` has a spec row with a quote, and the test commit comes first.",
  notes: "" },

// ── 3 · Build: plan ──────────────────────────────────────────────────────
{ kind: "section", stage: "Build", title: "Build", lead: "Plan mode first. Design review happens before code exists.", visual: "cycle" },

{ kind: "explain", stage: "Build", step: 3,
  title: "A plan a stranger could run",
  term: "Plan mode",
  def: "Claude reads the code and proposes a plan without changing anything. Building starts only after a person accepts the plan.",
  visual: "plan",
  points: [
    "`design.md`: the parts, and how data moves between them.",
    "One ADR for one decision you actually made.",
    "`plan.md`: ordered steps, a proof command per step, rollback, human gate.",
  ],
  notes: "Reference ADR: in-process MCP tools instead of external servers. Rework now means editing a document, not a diff." },

{ kind: "demo", stage: "Build", step: 3,
  title: "Plan mode, then accept",
  codeLabel: "docs/plan.md (reference, excerpt)",
  code: `| # | Step              | Proof command         | Expected                 | Risk                                   |
| 4 | Render the sample | npm run brief:sample  | out/latest.html exists   | model text reaching the page unescaped |
| 5 | Sources + loop    | npm test && typecheck | 8 passing tests, exit 0  | a tool with more access than its question |`,
  points: ["Shift+Tab into plan mode. Ask for the plan. Reject one step without a proof command."],
  notes: "The Risk column is the one people learn from. Every risk here reappears as a test in step 4 or 5." },

{ kind: "do", stage: "Build", step: 3, time: 15,
  title: "Design, one ADR, the plan",
  steps: [
    "Plan mode: “Draft docs/design.md and docs/plan.md from intent.md and spec.md. Read-only.”",
    "Write one ADR in `docs/decisions/` for a decision you actually made",
    "Every plan row gets a proof command and a risk",
    "Neighbour reads it and names what proves step 5 complete",
  ],
  check: "a stranger can name what proves each step complete.",
  notes: "" },

// ── 4 · Build: render ────────────────────────────────────────────────────
{ kind: "explain", stage: "Build", step: 4,
  title: "The first artifact, without a key",
  term: "Vertical slice",
  def: "The smallest end-to-end result that really works. Here: a real brief rendered from sample data, before any agent exists.",
  visual: "brief",
  points: [
    "`npm run brief:sample` renders `out/latest.html`. No model call.",
    "Model text is untrusted input. The renderer escapes everything.",
    "Every later step adds data behind this same page.",
  ],
  notes: "This is the vertical-slice moment." },

{ kind: "demo", stage: "Build", step: 4,
  title: "Prove the escaping",
  codeLabel: "test/render.test.ts (reference)",
  code: `assert.ok(!html.includes("<script>alert"), "raw script must never reach the page");`,
  points: ["Run it red, render, open `out/latest.html` next to the PDF.", "Change one house-style rule test-first."],
  notes: "This exact line is the one the gate quotes in step 7. Let them know it'll come back." },

{ kind: "do", stage: "Build", step: 4, time: 25,
  title: "Render the sample",
  steps: [
    "`test/render.test.ts` red, then `src/render.ts` and a sample-only `src/main.ts`",
    "`npm run brief:sample` and open `out/latest.html`",
    "Change one house-style rule, test first",
    "Save a 1440×900 screenshot for step 6",
  ],
  check: "the page renders with no API key, and a test proves the script tag is escaped.",
  notes: "Good place for the break if you run this as two half-days." },

// ── 5 · Build: agent ─────────────────────────────────────────────────────
{ kind: "explain", stage: "Build", step: 5,
  title: "The loop: one query(), no shell",
  term: "Tool",
  def: "A function the agent may call. Ours only read, and an error becomes a note in the brief instead of a guess.",
  visual: "agent",
  code: `query({ prompt, options: {
  tools: [],                          // no shell, no files
  allowedTools: sources.allowedTools, // only read tools
  permissionMode: "dontAsk",
  outputFormat: { type: "json_schema", schema },
}})`,
  notes: "Claude Agent SDK. Four lines carry the whole safety story: tools: [], allowedTools, dontAsk, outputFormat. The human comes after the run, not inside it." },

{ kind: "demo", stage: "Build", step: 5,
  title: "Catch up, then add one tool",
  codeLabel: "Deliberate catch-up",
  code: `git checkout step-5-build-agent -- src/sources.ts src/agent.ts src/main.ts test/agent.test.ts
npm run typecheck && npm test`,
  points: ["Add `github_failed_workflows` with the `tool()` + `guarded()` shape and a wiring test.", "Live run: `npm run brief 2> run.log`. Show the `mcp=[…]` line and each `→` tool call."],
  notes: "Everyone starts step 5 from the same code. That is on purpose: the lesson is the loop and the permissions, not typing sources.ts." },

{ kind: "do", stage: "Build", step: 5, time: 20,
  title: "One read-only tool",
  steps: [
    "Take the reference files (previous slide) and get typecheck and tests green",
    "Add one tool: `github_failed_workflows`, `linear_due_this_week` or `notion_page_comments`",
    "A wiring test that runs without a network",
    "Optional, with a read-only token in `.env`: `npm run brief 2> run.log`",
  ],
  check: "every sentence in the brief traces to a `→` line in `run.log`, and the model got no shell and no write access.",
  notes: "No token? The source is skipped and the brief says so in notes. That's an access result, and it goes down as OPEN, not FAIL." },

// ── 6 · Test ─────────────────────────────────────────────────────────────
{ kind: "section", stage: "Test", title: "Test", lead: "The session proves its own work before a human looks.", visual: "cycle" },

{ kind: "explain", stage: "Test", step: 6,
  title: "Evidence is a command, an exit code and a name",
  term: "Evidence",
  def: "A command, the exit code it returned, one quoted output line, and the name of the person who reran it.",
  visual: "terminal",
  points: [
    "Claude verifies its own work first. A person reruns one command.",
    "A green score is not proof. Read the thing it claims to check.",
    "Differences from the reference PDFs are `OPEN`.",
  ],
  notes: "Playbook: quality signal arrives early; humans focus on intent and risk, not mechanical verification. Add an eval for every incident." },

{ kind: "demo", stage: "Test", step: 6,
  title: "Let Claude verify, then rerun it yourself",
  codeLabel: "Prompt",
  code: `Run typecheck, test and brief:sample. For each: the exact command,
the exit code, one quoted output line. Write docs/evidence.md.
Do not summarise. Anything you did not run is OPEN.`,
  points: ["Then rerun one command by hand and compare it with what Claude wrote."],
  notes: "Show one rerun that disagrees if you can, e.g. a test count off by one. That is why the reviewer column exists." },

{ kind: "do", stage: "Test", step: 6, time: 15,
  title: "Record the evidence",
  steps: [
    "`docs/evidence.md`: three commands, exit codes, one quoted line each",
    "Your screenshot in `docs/evidence/`",
    "Swap with your neighbour: each of you reruns one of the other's commands and signs the row",
  ],
  check: "every row names a command that actually ran, and who reran it.",
  notes: "" },

// ── 7 · Deploy ───────────────────────────────────────────────────────────
{ kind: "section", stage: "Deploy", title: "Deploy", lead: "The agent can prepare a release. It can't approve one.", visual: "cycle" },

{ kind: "explain", stage: "Deploy", step: 7,
  title: "The gate reads against intent",
  term: "Gate",
  def: "A person reads the pull request against intent.md and writes PASS, FAIL or OPEN, quoting the line that decided it. The agent that wrote the code never approves it.",
  visual: "gate",
  points: [
    "PASS: the check ran and you read the line that proves it.",
    "FAIL: the check ran and contradicts the intent.",
    "OPEN: not run yet, or no access.",
    "Green CI is an observation, not an approval. The schedule starts after a PASS.",
  ],
  notes: "Playbook: reviewers assess intent and risk, not every line. REVIEW.md and hooks enforce the gate while the agent acts." },

{ kind: "demo", stage: "Deploy", step: 7,
  title: "A real gate, decided OPEN",
  codeLabel: "docs/gate.md (reference)",
  code: `Line from the diff that decided it: \`tools: [],\` in src/agent.ts

Decision: OPEN — the diff proves the three sample-data checks and
touches no boundary, but the two live checks in intent.md have not run,
and no second engineer has reread the three commands.`,
  points: ["Then the schedule: a weekday cron or Actions workflow, tokens as secrets, `out/latest.html` as an artifact."],
  notes: "The strongest teaching moment of the day: an honest OPEN beats a hopeful PASS." },

{ kind: "do", stage: "Deploy", step: 7, time: 15,
  title: "Open the PR and decide the gate",
  steps: [
    "Open a pull request from `my/<your-name>`",
    "`docs/gate.md`: PASS / FAIL / OPEN per success check, one quoted line each, plus a handoff",
    "A weekday schedule that runs `npm run brief` with the tokens as repository secrets",
  ],
  check: "no PASS rests on a check you did not read, and no credential is in the repo.",
  notes: "`gitlab-ci.example.yml` shows the GitLab version; GitHub Actions has the same shape." },

// ── Maintain ─────────────────────────────────────────────────────────────
{ kind: "section", stage: "Maintain", title: "Maintain", lead: "The loop closes when a finding becomes the next intent.", visual: "cycle" },

{ kind: "explain", stage: "Maintain",
  title: "Tomorrow's run reads what you merged today",
  term: "Finding",
  def: "Something the running system taught you. It goes back in as a change to intent.md, and the cycle starts again.",
  visual: "loop",
  points: [
    "A footnote that keeps coming back is a finding, not noise.",
    "It becomes a new outcome and check in `intent.md`.",
    "At scale, alerts trigger the agent: it logs, diagnoses read-only, then proposes a PR.",
  ],
  notes: "The lab has no step for this; it's the closing idea. If you have time, run the DO below live with the room." },

{ kind: "do", stage: "Maintain", time: 5,
  title: "Write your next intent",
  steps: [
    "Pick one `OPEN` line from your `gate.md`",
    "Write it as an outcome and a success check in a new `intent.md` section",
    "That's tomorrow's step 1",
  ],
  check: "your OPEN now has an owner and a check.",
  notes: "" },

// ── Close ────────────────────────────────────────────────────────────────
{ kind: "explain",
  title: "What you walk out with",
  term: "Artifact chain",
  def: "Each stage's committed file is the next stage's input. Anyone can follow the chain without you in the room.",
  visual: "chain",
  points: [
    "Seven files a stranger can point at.",
    "One brief you didn't write.",
    "A gate you decided yourself.",
  ],
  notes: "Ask for one sentence from each person: which artifact surprised them most?" },

{ kind: "explain",
  title: "Measure it next week",
  term: "Leading indicator",
  def: "A number that moves before the outcome does, so you can steer early. Lagging indicators confirm the result afterwards.",
  cols: [
    ["Measure early", "Time to artifact · first-pass success · parallel sessions"],
    ["Measure late", "Rework cycles · escaped defects · repeat incidents"],
  ],
  notes: "Measurement from the playbook: leading and lagging indicators. Ask each person which one they'll track next week." },
];

const STAGES = ["Plan", "Design", "Build", "Test", "Deploy", "Maintain"];
const ARTIFACTS = ["intent.md", "spec.md", "plan.md", "evidence.md", "gate.md", "finding"];
const KIND = { see: "Look", define: "Definition", explain: "What we do with it", demo: "Demo", do: "You do it" };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// `inline code` in slide text; everything else is escaped.
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const file = (name, body) => `<div class="file"><div class="file-tab">${name}</div><div class="file-body">${body}</div></div>`;
const bar = (w) => `<i class="bar" style="width:${w}%"></i>`;

/* Drawings. Each shows the artifact the slide is about, not decoration. */
const VISUALS = {
  cycle(active) {
    const r = 140, c = 190;
    const nodes = STAGES.map((s, k) => {
      const a = (k / 6) * 2 * Math.PI - Math.PI / 2;
      const x = c + r * Math.cos(a), y = c + r * Math.sin(a);
      return `<g class="node${s === active ? " on" : ""}"><circle cx="${x}" cy="${y}" r="46"/><text x="${x}" y="${y - 3}" class="n">${s}</text><text x="${x}" y="${y + 15}" class="a">${ARTIFACTS[k]}</text></g>`;
    }).join("");
    return `<svg viewBox="0 0 380 380" class="cycle" role="img" aria-label="Six SDLC stages in a loop"><circle cx="${c}" cy="${c}" r="${r}" class="ring"/>${nodes}<circle cx="${c}" cy="${c}" r="54" class="ai"/><text x="${c}" y="${c + 9}" class="ai-t">AI</text></svg>`;
  },
  flow() {
    const box = (t, sub, cls = "") => `<div class="box ${cls}"><b>${t}</b><span>${sub}</span></div>`;
    return `<div class="flow">${box("Sources", "GitHub · Linear · Notion<br>GitLab · Jira · Confluence · Outlook")}<i>↓</i>${box("Agent", "Claude + read-only tools", "hot")}<i>↓</i>${box("Brief JSON", "checked by the contract")}<i>↓</i>${box("Page", "out/latest.html")}</div>`;
  },
  intent: () => file("intent.md", `
    <h4>Outcome</h4>${bar(90)}${bar(60)}
    <h4>Success checks</h4><p class="ck">☑ ${bar(70)}</p><p class="ck">☑ ${bar(55)}</p><p class="ck">☐ ${bar(50)} <em>OPEN</em></p>
    <h4>Boundary</h4><p class="rule">never writes to a source</p><p class="rule">never invents a fact</p>
    <h4>Owners</h4><p class="owners"><span>Reader</span><span>Maintainer</span><span>Gate</span></p>`),
  contract: () => `<div class="stack">
    ${file("docs/spec.md", `<p class="q">push.title — “Merge MR !142 before standup”</p>`)}
    <i class="down">↓</i>${file("src/brief.ts", `<p class="mono">push: <b>ItemSchema</b>, todos: ItemSchema[] …</p>`)}
    <i class="down">↓</i><div class="tests"><span class="red">✗ rejects a brief without push</span><span class="green">✓ rejects a brief without push</span></div></div>`,
  plan: () => file("docs/plan.md", `<table class="mini"><tr><th>#</th><th>Step</th><th>Proof</th></tr>
    <tr><td>4</td><td>Render sample</td><td><code>npm run brief:sample</code></td></tr>
    <tr><td>5</td><td>Sources + loop</td><td><code>npm test</code></td></tr>
    <tr><td>6</td><td>Evidence</td><td>a reviewer reruns</td></tr></table>
    <p class="gatebar">Human gate · plan accepted before build</p>`),
  brief: () => `<div class="page"><div class="art"></div><div class="page-body">
    <h5>Good morning, Sam.</h5>
    <p class="sec push">Push today</p>${bar(85)}${bar(60)}
    <p class="sec">Waiting on you</p>${bar(75)}${bar(50)}
    <p class="sec">What changed</p>${bar(80)}
    <p class="sec">Your day</p><p class="cal"><span>09:30</span><span>13:00</span><span>16:00</span></p></div></div>`,
  agent: () => `<div class="agent">
    <div class="core">Claude</div>
    <div class="tools">${["github_*", "linear_*", "notion_*", "gitlab_*"].map((t) => `<span class="tool">🔒 ${t}</span>`).join("")}</div>
    <div class="banned"><span>shell</span><span>files</span><span>write</span></div>
    <div class="out">→ Brief JSON · matches the contract ✓</div></div>`,
  terminal: () => `<div class="term"><div class="term-top"><i></i><i></i><i></i></div>
    <p><span class="p">$</span> npm run typecheck <span class="ok">exit 0</span></p>
    <p><span class="p">$</span> npm test <span class="dim"># pass 8</span> <span class="ok">exit 0</span></p>
    <p><span class="p">$</span> npm run brief:sample <span class="ok">exit 0</span></p>
    <p class="rev">Rerun by: Sam ✓</p></div>`,
  gate: () => `<div class="gate"><div class="pr"><b>PR · my/sam → main</b><span>read against intent.md</span></div>
    <div class="stamps"><span class="st pass">PASS</span><span class="st fail">FAIL</span><span class="st open">OPEN</span></div></div>`,
  loop: () => `<div class="closing">${file("gate.md", `<p><span class="st open sm">OPEN</span> live run not proven</p>`)}<i class="back">↺</i>${file("intent.md", `<h4>Success checks</h4><p class="ck new">☐ one live run, every sentence traced</p>`)}</div>`,
  chain: () => `<div class="chainv">${["intent.md", "spec.md", "plan.md", "latest.html", "evidence.md", "gate.md"].map((a) => `<span>${a}</span>`).join("<i>↓</i>")}</div>`,
};

/* A slide with a term becomes three: its visual alone, the definition, then the slide
   ("what we do with it"). Section slides keep their cycle; the title slide goes first. */
const DECK = SLIDES.flatMap((s) => {
  if (!s.term) return [s];
  const at = { stage: s.stage, step: s.step, notes: s.notes };
  const see = s.visual && { ...at, kind: "see", title: s.term, visual: s.visual };
  const define = { ...at, kind: "define", title: s.term, lead: s.def };
  const body = { ...s, visual: undefined };
  return (s.kind === "title" ? [body, see, define] : [see, define, body]).filter(Boolean);
});

function render(s, k) {
  const out = [];
  const eyebrow = [s.stage && `<span>${s.stage}${s.step ? ` · lab step ${s.step}` : ""}</span>`, KIND[s.kind] && `<span class="kind">${KIND[s.kind]}</span>`, s.time && `<span class="time">${s.time} min</span>`].filter(Boolean);
  if (eyebrow.length) out.push(`<p class="eyebrow">${eyebrow.join("")}</p>`);
  out.push(`<h1>${md(s.title)}</h1>`);
  if (s.lead) out.push(`<p class="lead">${md(s.lead)}</p>`);
  if (s.chain) out.push(`<div class="chain">${s.chain.map((c) => `<span>${esc(c)}</span>`).join("<i>→</i>")}</div>`);
  if (s.cols) out.push(`<div class="cols" style="--n:${s.cols.length > 4 ? 3 : s.cols.length}">${s.cols.map(([b, t]) => `<div><b>${md(b)}</b><span>${md(t)}</span></div>`).join("")}</div>`);
  if (s.code) out.push(`${s.codeLabel ? `<span class="label">${esc(s.codeLabel)}</span>` : ""}<pre><code>${esc(s.code)}</code></pre>`);
  if (s.points) out.push(`<ul class="points">${s.points.map((p) => `<li>${md(p)}</li>`).join("")}</ul>`);
  if (s.steps) out.push(`<ol class="steps">${s.steps.map((p) => `<li><span>${md(p)}</span></li>`).join("")}</ol>`);
  if (s.check) out.push(`<p class="check"><strong>Done when:</strong> ${md(s.check)}</p>`);
  const text = out.join("");
  if (s.kind === "see") return `${out[0] || ""}<div class="visual solo">${VISUALS[s.visual](s.stage)}</div>`;
  return s.visual ? `<div class="split"><div class="text">${text}</div><div class="visual">${VISUALS[s.visual](s.stage)}</div></div>` : text;
}

const main = document.getElementById("slide");
const notes = document.getElementById("notes");

if (location.search.includes("print")) {
  // ?print → every slide stacked, one per page, for Save as PDF.
  document.body.innerHTML = DECK.map((s, k) => `<section class="print-slide" data-kind="${s.kind}">${render(s, k)}</section>`).join("");
} else {
  const rail = document.getElementById("rail");
  rail.innerHTML = STAGES.map((n) => `<li>${n}</li>`).join("");
  let i = 0;
  const show = (n) => {
    i = Math.max(0, Math.min(DECK.length - 1, n));
    const s = DECK[i];
    main.dataset.kind = s.kind;
    main.innerHTML = render(s, i);
    main.style.animation = "none"; void main.offsetWidth; main.style.animation = "";
    notes.textContent = s.notes || "—";
    const at = STAGES.indexOf(s.stage);
    [...rail.children].forEach((li, k) => { li.className = k === at ? "on" : k < at ? "done" : ""; });
    document.getElementById("count").textContent = `${i + 1} / ${DECK.length}`;
    document.getElementById("bar").style.width = `${((i + 1) / DECK.length) * 100}%`;
    history.replaceState(null, "", `#${i + 1}`);
  };
  addEventListener("keydown", (e) => {
    if (["ArrowRight", "PageDown", " "].includes(e.key)) show(i + 1);
    else if (["ArrowLeft", "PageUp"].includes(e.key)) show(i - 1);
    else if (e.key === "Home") show(0);
    else if (e.key === "End") show(DECK.length);
    else if (e.key.toLowerCase() === "n") notes.hidden = !notes.hidden;
    else if (e.key.toLowerCase() === "f") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  });
  main.addEventListener("click", (e) => show(i + (e.clientX > innerWidth / 3 ? 1 : -1)));
  const fromHash = () => show((parseInt(location.hash.slice(1), 10) || 1) - 1);
  addEventListener("hashchange", fromHash);
  fromHash();
}

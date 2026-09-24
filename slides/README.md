# AI-native SDLC · Build a daily brief agent — workshop deck

Static deck, no build step. Serve the folder and open it:

    python3 -m http.server 8080    # → http://localhost:8080/#1

Keys: ← → navigate · N speaker notes · F fullscreen · `#12` jumps to slide 12.
PDF: open `/?print` and Save as PDF (1280×800 pages).

Content lives in `slides.js`, one object per concept. A concept with a term expands to
look (the visual) → definition → what we do with it; then
`explain` (cyan) → `demo` (violet) → `do` (amber, with a timer and a "Done when" check).
The rail at the bottom shows the playbook stage: Plan · Design · Build · Test · Deploy · Maintain.

Sources: Anthropic, "The AI-native SDLC playbook"; lab repo RyanLisse/aetherlink-daily-brief-lab-s1
(reference code quoted from branch `steps/7-gate-deploy`). Palette, Nunito and mark from
jyse/aetherlink-classroom-slides@cons/cursus-aanpassingen.

# Cat Burglars — working rules for Claude

Author and designer: **Richard Moore**. This project reuses the tools and the lessons of his first game, *Heisty Spideys* (finished: rulebook v4.8 and a fully automated Foundry VTT system). Read `docs/DESIGN.md` before doing design work and `docs/LESSONS.md` before building anything.

## Keep Richard's other games separate
- *Heisty Spideys* (the SpideyHeist repository) is a finished, separate product, and *Don't Get Forked* (the DontGetForked repository) is a separate game in development. Both are **read-only reference** here: never edit, commit to, push to, branch, or release from either while working on Cat Burglars, even if one is attached to the session.
- Copy what you need from them into this repository (with a note of where it came from) and adapt the copy here. Never import from or link to their files.
- If a change to another game ever seems needed, stop and tell Richard; it's done in that game's own session.

## The author decides the game
- **Never invent game content without Richard's approval.** That covers rules, numbers, entities, abilities, setting text and names of mechanics. Propose options (two or three, with a recommendation and why), then wait for his call. Record every decision in `docs/DESIGN.md` (Decisions log) with the date.
- Wording clarifications and fixes for things the book already implies may be made directly. Anything that changes numbers or adds rules goes to Richard first.
- When he gives feedback on art or layout, fix it **and** audit the whole book for the same class of mistake.

## Source of truth
- The rulebook source (`book/src/chapters/*.html`) is the rules. The Foundry system, the simulator and any compendium text follow the book; change the book first, then sync the others in the same piece of work.
- Every ruling gets a row in `book/REVIEW.md` (what changed, where, why, source: author / playtest / simulator).

## Quality bars (learned the hard way on Heisty Spideys — details in docs/LESSONS.md)
- **Balance is simulated, not guessed.** Before a rule is "done", it runs in `sim/` against the agreed win-rate targets. Report numbers, not impressions.
- **Playtest by agents** strictly by the book with real dice (`node -e` random rolls, never invented), logging every ambiguity with severity, the quoted passage and a suggested fix. Re-run a verification playtest after each fix round.
- **Art** passes `book/art/ART-CHECKLIST.md`, including the mandatory object-table audit. Look at every rendered piece yourself before reporting it done. The gang are **original characters**: never echo famous cartoon or film cats.
- **Layout**: after every build, render a contact sheet and look at every page. No near-empty pages, odd gaps, overflow or split tables. Run the text diff to confirm only intended text changed.
- **Foundry is automation-first**: players and the Storyteller should never track rules by hand. All rules logic lives in Foundry-free modules (`module/logic/`) tested with `node --test`; GM-authoritative writes; every automation can be switched off in settings. There is no live Foundry in the cloud: use `tools/fake-foundry.mjs` smoke tests and give Richard a two-client `TESTING.md` script.

## Portal
- This game has a card in Richard's project portal. The portal reads `PORTAL.md` at the repo root on every push to the default branch and shows it on the card to everyone he has invited.
- Keep `PORTAL.md` up to date as part of your work: "Now:" is what you're working on and "Next:" the next step; keep its checklist of real milestones ("- [ ]" / "- [x]"), ticking items when they're finished and adding new ones when the plan grows. Keep its "Number: Label = value" lines (2 to 6 numbers counted from the project itself, such as the rows in the Decisions log) current too.
- Every line in it is plain words for family and friends, with nothing you wouldn't show every invitee: never repo names, usernames, file paths, links, code, commit IDs, the word "GitHub" or anyone's personal details.
- In each commit that changes something people would notice, add a line below the first line: "Portal-Update: <one plain sentence>". No other line may look like that marker ("Portal update" or "Portal updates" in any case or spelling, followed by a colon).
- `PORTAL.md` lists at most one "Screenshot: path = caption" line: the rulebook cover once there is one, saved under `docs/portal/` as a PNG, JPEG or WebP under 1 MB, with nothing private visible. When it changes a lot, replace the file and push; Richard approves each new picture in the portal.

## Housekeeping
- Commit and push work-in-progress often; sessions and agents can stop at any time (usage limits). Resume stopped agents rather than restarting the work.
- Keep model names out of commits, code and docs (except the required commit trailer).
- Credits: "Game design & writing: Richard Moore"; editing/layout/illustration "Produced with AI assistance (Claude, by Anthropic), directed and approved by Richard Moore".
- Releases of the Foundry system go out through the release workflow (workflow_dispatch with a version) only when Richard says so.

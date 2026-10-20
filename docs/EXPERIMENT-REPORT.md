# Cat Burglars — Claude's version: experiment report

*For Richard Moore. Branch `claude/cat-burglars-core-design-55iymx`, written 2026-10-20. Not merged into the main line (your call).*

You chose the identity — instincts as the cats' heart, hiding in plain sight, starting at the door, choosing different entrances, a street gang rather than a heist crew — and asked Claude to make every other call and build the game to completion, so you can compare it with the version you direct. This is what came out, what it cost to get there, and what is still open.

## What exists

| Part | State |
|---|---|
| Design | 38 decisions in `docs/DESIGN.md` (Claude's marked "Claude"); all 12 open questions settled. |
| Core rules | `docs/CORE-RULES.md` v0.8 — a two-page summary of the book. |
| Rulebook | 18 chapters, 5 ready-to-run houses, cat sheet, house tracker, quick reference: `book/dist/Cat_Burglars_v0.8.pdf` (50 pages, draft). Every ruling is a row in `book/REVIEW.md` (93 rows). |
| Art | 49 pictures, all generated as code (`book/tools/art-gen/`): cover, part pages, 18 chapter pictures, 5 floor plans drawn from the same data the simulator plays, 5 cat portraits (plus a reference sheet per cat), 15 end-of-chapter spots and a back-cover picture. Each audited against `book/art/ART-CHECKLIST.md` (`book/art/AUDIT.md`). |
| Simulator | `sim/`: every rule as a switchable parameter, ten rule packages compared on the same dice; package P10 adopted. `sim/BALANCE.md`. |
| Playtests | 9 agent playtests with real dice (`sim/playtests/`), each followed by a fix round. |
| Foundry VTT | An ApplicationV2 system that runs the robbery: rolls, the Mood ledger, the round and the house's turn, the Robbery Tracker, sheets, packs, Undo, every automation switchable. 118 tests (pure logic + fake-Foundry smoke tests). Never run in a live Foundry: `TESTING.md` is a two-client script for you. |
| Portal | `PORTAL.md` current; the rulebook cover is the card's picture. |

## The game in one paragraph

A gang of street cats watched a human carry something into a house. They pick their ways in, and roll a handful of d6, reading the highest die (Flop, Scrape, Clean, two 6s Purrfect). **Being seen isn't being caught — being seen doing something is**: walking and sitting in view are free, anything else in view is a roll, and every seen roll fills one of the house's two meters. **Broom** (naughty) ends in a **Shoo!** out of the nearest door; **Cuddle** (sweet) ends in being **Scooped!** and maybe shut in the Den — and any cat still inside at Lights Out is adopted. Two **instincts** per cat give a Knack and a temptation the Storyteller can dangle. The house fights back with routines, dogs, a parrot, a house cat, a **Prize Clock** that moves and finally takes the prize away, and **Searching** humans once they find it's been touched. Big prizes must be **hauled** room by room, every move a roll.

## How it got here

The rules went through eight versions. Each playtest found a cheap line a smart gang could take, and each fix round closed it and re-tuned the houses in the simulator:

| Version | What a playtest (or the simulator) found | What changed |
|---|---|---|
| v0.1–v0.3 | One two-ended Mood track let one charmer cancel the whole gang's mess; actions in view were free; zero dice worked half the time. | Two meters; every action in view is a roll; zero dice keep the lower of two. |
| v0.4 | The cake (Hard): 23 gaps in the text. | All settled in the book. |
| v0.5 | The box: won by waiting where no routine went. | Searching humans; the owner fetches the prize. |
| v0.6 | The box again: won with **0 cat rolls**, hiding with the box and steering Searchers with a decoy. Number 12 (5 cats): every roll under one Distraction. | Hauling is always a roll; carriers can't hide; humans beside a disturbed prize notice it. |
| v0.7 | The box: a dog's bark lured the Searcher away. The salmon: the chef's routine stranded her outside the kitchen; eating was free; a cuddled cat blinded its holder. | Eating is a roll; holders still see; loiterers in a dog's room are chased out; temptations rotate. |
| v0.8 | Wendell (5 cats) and the cake: both won by a free round-1 noise that pulled the owner off the prize as it was put down. | The human who puts the prize down stays with it that round; owners' routines visit the prize; the cake wobbles. |

Two proposals were simulated and declined because they made the game far too hard (a half-empty meter after a Shoo!; Searchers deaf to noise). Letting one cat take the broom on purpose stays legal: it's the cartoon decoy, and it still costs Patience and an entrance.

## Balance (simulator, package P10)

| Gang | Easy | Standard | Hard |
|---|---|---|---|
| Target | ~90 | ~75 | 55–60 |
| 4 cats | 90.3 | 75.3 | 57.9 |
| 3 cats | 87.9 | 68.6 | 55.8 |
| 5 cats | 95.5 | 75.6 | 50.7 |

About 12 rolls a robbery; Flops 15%, Purrfects 6%; temptations given in to 82% of the time; a cat is left behind (adopted) in 4% of Easy and 15% of Hard robberies.

## Open issues

- **Sharp players beat the simulator.** Every playtest found a line the simulated gang doesn't take (lures from noisy flaps, parrots, barking dogs). The houses are tuned to the simulator, so a clever table will win more than these numbers say. The last fix round closed the round-1 lure; the next real playtests will show what's left.
- **Clean wins at Hard houses are rare** (15% of Hard wins; target a third). The simulated gang eats food where it sits; players carry more out.
- **Five cats at Hard** run 7 points behind four.
- **Last page of some house chapters** is only partly filled (the PDF engine won't balance the final columns after full-width statblocks); each carries a small picture.
- **Foundry** has only been tested on a pretend table.
- **Not modelled anywhere yet:** a shut-in cat meowing to lure a human, persuading a human to open a door, toddlers, a campaign beyond Reputation and Lives.

## Things that are your call

1. **Credits.** CLAUDE.md asks for "Game design & writing: Richard Moore". Because this branch is the experiment where Claude made the design calls, the credits page says "Created by Richard Moore", then "Game design & writing: Claude (Anthropic), in a design experiment directed by Richard Moore", then the usual "Editing, layout & illustration: Produced with AI assistance (Claude, by Anthropic), directed by Richard Moore". Change it back if you prefer.
2. **The name.** Other games already use *Cat Burglars* (a free TTRPG on itch.io, a 2025 board game, an *Exploding Kittens* edition). It's the working title until you decide.
3. **Names changed for originality:** the Wendells' house cat is **Pom-Pom** (not "Duchess", *The Aristocats*); the Okafors' dog is **Noodle** (it was "Biscuit", which clashed with Big Biscuit).
4. **Merging, releasing, the art direction:** nothing is merged, released or final without you.

## How to compare it with your version

Read `docs/CORE-RULES.md` (two pages) side by side with yours, then play **The Chicken at Number 12** with the ready-made gang (Chapter 3): it's the first robbery the book recommends, and it shows the Mood, a dog, a Distraction, a haul and the Prize Clock in under an hour. `sim/BALANCE.md` and the playtest reports show how each rule earned its place.

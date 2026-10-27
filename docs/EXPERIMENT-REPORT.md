# Nine Lives Gang — the delegated version: experiment report

*For Richard Moore, 2026-10-21 (version 0.9). The main line holds it as clean single commits; the full history stays on the experiment branch.*

You chose the identity — instincts as the cats' heart, hiding in plain sight, starting at the door, choosing different entrances, a street gang rather than a heist crew — and asked an AI assistant to make every other call and build the game to completion, so you can compare it with the version you direct. Since version 0.8 you added the direction that made it this game: **a gang of thug cats** who love **shiny things**, a chaotic home invasion with a **getaway from animal control**, **comical and light**, and points for **marking territory, catnip and rival gangs**. This is what came out, what it cost to get there, and what is still open.

## What exists

| Part | State |
|---|---|
| Design | 47 decisions in `docs/DESIGN.md` (the delegated ones marked "AI", yours marked "Richard"); no open questions. |
| Core rules | `docs/CORE-RULES.md` v0.9 — a two-page summary of the book. |
| Rulebook | 19 chapters, 5 ready-to-run houses, cat sheet, house tracker, quick reference: `book/dist/Nine_Lives_Gang_v0.9.pdf` (54 pages; the cover says "draft" until you approve it), a **printer-friendly** copy with white pages, and a print-shop edition with bleed (interior, front and back covers, and a one-piece cover with a spine). Every ruling is a row in `book/REVIEW.md` (154 rows). |
| Art | 48 pictures in the book, all generated as code (`book/tools/art-gen/`): the getaway cover (the warden's net, the van, the gang going over the fence), the gang in their gear (bandanas, chains, hoops, daft tattoos), graffiti tags, part pages, 19 chapter pictures, 5 floor plans drawn from the simulator's own house data, 5 cat portraits, end-of-chapter spots and a back-cover picture. Audited against `book/art/ART-CHECKLIST.md` (`book/art/AUDIT.md`, 2026-10-21). |
| Simulator | `sim/`: every rule as a switchable parameter, fourteen rule packages compared on the same dice; package P14 adopted. `sim/BALANCE.md`. |
| Playtests | 13 agent playtests with real dice across all five houses (`sim/playtests/`), each round followed by fixes; v0.9 had two playtests, a fix round, and two verification playtests (the Okafors' with three rolled cats, the Birthday Cake with four ready-made cats): both Clean Getaways, every fixed rule they reached worked, and their 32 issues were wording (the two majors were mistakes on the cake's house page, both fixed). |
| Foundry VTT | An ApplicationV2 system that runs the robbery: rolls, the Mood, the round and the house's turn, the getaway and the warden, Cred, the Robbery Tracker, sheets, packs, Undo, every automation switchable, and five **ready-to-play games** (each house as a map scene with the gang's and the pets' pictures, one click to set the table and start, tokens that follow the robbery). 195 tests (pure logic, parity with the simulator, a seeded replay, fuzzing, fake-Foundry smoke tests with a Storyteller and two players). Never run in a live Foundry: `TESTING.md` is a two-client script for you. Nothing is released; the portal offers a 0.9 test build to install by hand. |
| Portal | `PORTAL.md` current; the rulebook cover is the card's picture, and the rulebook and the printer-friendly copy are its downloads. |

## The game in one paragraph

A gang of thug street cats watched a human carry something into a house: something **delicious**, **fun**, **shiny**, or a **box**. They pick their ways in and roll a handful of d6, reading the highest die (Flop, Scrape, Clean, two 6s Purrfect). **Being seen isn't being caught — being seen doing something is**: walking and sitting in view are free, anything else in view is a roll, and every seen roll fills one of the house's two meters, **Broom** (ending in a **Shoo!** out of the door) or **Cuddle** (ending in being **Scooped!** and maybe shut in the Den). Two **instincts** per cat give a Knack and a temptation the Storyteller dangles, and shiny things tempt in every room. The house fights back with routines, dogs, a parrot, a house cat, a **Prize Clock**, and **Searching** humans. Then the **getaway**: the loot in pieces, four obstacles to the hideout, and the animal-control warden behind them; any cat still inside, or cornered and caught, is **pinched** and goes to the pound. Showing off — tagging rooms, getting the zoomies from the catnip, showing up the rival gang — scores **Cred**, and the top scorer is the Cat's Whiskers.

## How it got here

| Version | What a playtest, the review or you found | What changed |
|---|---|---|
| v0.1–v0.8 | Eight rounds of playtests closed one cheap winning line after another (see the v0.8 report in the history). | Two meters; every action in view a roll; Searching; hauling and eating are rolls; the human who puts the prize down stays with it. |
| v0.9 review | An outside review: Shoo! could use an entrance the cat couldn't fit; the Cattitude die was a trap; 20 wording gaps; a list of art defects. | Shoo! uses the nearest entrance that fits; no Cattitude die; Cattitude only buys a Push or a resisted temptation; the art redrawn. |
| v0.9 your direction | "It's a GANG of thug cats … cats love shiny things … the getaway is the real one … keep it comical, keep it light … points for marking territory, catnip, rival gangs." | Shiny prizes; the getaway chapter; pinched (the pound) instead of adopted; Cred; a voice pass through the whole book; new cover and gang art. |
| v0.9 playtests | Number 12 and Chef Marchetti's: a dodge carried cats over fences they never climbed; the catnip doubled risk-free tags; "all the loot" had no fixed total; Rep's "5 Cred" was ambiguous. | The warden never passes a cat and sprawls when one dodges; tags with the zoomies are rolls; outcomes count the whole prize; Rep needs the gang's Cred to reach 8. |

Proposals simulated and declined: one portion eaten per cat (to put loot on every getaway; Easy fell to 66%, Hard to 26%); shutting a held cat in the Den when its own roll fills Broom (+10 points of cats lost at the cake).

## Balance (simulator, package P14)

| Gang | Easy | Standard | Hard |
|---|---|---|---|
| Target | ~90 | ~75 | 55–60 |
| 4 cats | 87.4 | 74.0 | 58.9 |
| 3 cats | 86.4 | 67.2 | 57.6 |
| 5 cats | 96.3 | 78.3 | 55.5 |

About 23 rolls a robbery (13 in the house, the rest on the getaway); Flops 16%, Purrfects 6%; a cat is pinched in 9% of Easy and 30% of Hard robberies. Showing off costs about 1 point played carefully, and 4–5 played greedily.

## Open issues

- **Sharp players beat the simulator.** Every playtest found a line the simulated gang doesn't take. The houses are tuned to the simulator, so a clever table will win more than these numbers say.
- **Eating it all inside makes a quiet getaway.** In the three food houses a gang can eat the whole prize in the house; the getaway then only risks a pinch and Cred. The book says to keep that getaway quick. A rule to force loot onto every getaway wrecked the balance and was dropped.
- **Cred in play runs higher than in the simulator** (12 and 16 for the two playtest gangs against 3–4 simulated), which is why Rep for Cred needs 8.
- **Foundry** has only been tested on a pretend table.

## Things that are your call

1. **Credits.** Settled: only "Created by Richard Moore" and "Game design & writing: Richard Moore"; nothing in the game or the docs names the AI tool or its maker.
2. **The name.** Settled: *Nine Lives Gang*.
3. **Names made for originality:** the top Cred scorer is "the Cat's Whiskers" (not "Top Cat", a famous cartoon gang); catnip gives "the zoomies" (not "on the nip", which read like being high in a book for ages 8 and up); the rival gangs are the Bin Lid Boys, the Satin Paws, the Canal Street Toms, the Party Crashers and the Fishbone Crew.
4. **The default branch** is still the experiment branch; the main line is up to date and can be made the default whenever you like.
5. **Releasing the online version and approving the cover** are yours.

## How to compare it with your version

Read `docs/CORE-RULES.md` (two pages) side by side with yours, then play **The Chicken at Number 12** with the ready-made gang (Chapter 3): it's the first robbery the book recommends, and it shows the Mood, a dog, a Distraction, the catnip, a tag and the getaway in about an hour. `sim/BALANCE.md` and the playtest reports show how each rule earned its place.

# Nine Lives Gang

A tabletop roleplaying game by **Richard Moore**. The players are a gang of street cats. They've just watched a human carry something into a house: something delicious, something fun, or a box. They must get it at all costs, without getting caught.

**Status:** core rules v0.9 (`docs/CORE-RULES.md`), rulebook finished in draft (`book/`), simulated (`sim/`), and a Foundry VTT system (0.9.0) that runs a whole night: the robbery, the getaway and Cred. See `docs/DESIGN.md`.

## What's in here
| Folder | What it is |
|---|---|
| `docs/` | Design document (pitch, decisions), core rules summary, Foundry automation design, lessons from *Heisty Spideys* |
| `book/` | The rulebook: HTML chapters built into a typeset PDF (digital and print-on-demand) |
| `sim/` | Rules simulator for balance testing |
| `module/`, `templates/`, `styles/`, `lang/`, `packs/` | The Foundry VTT game system |
| `tools/`, `test/` | Build, validation and test tooling (including a fake Foundry for integration tests) |

## The Foundry system
Automation-first (`docs/AUTOMATION.md`): nobody tracks rules by hand.
- **Cat sheets** with a Roll button per approach; Human and Pet sheets for the residents.
- **The roll dialog** builds the pool from the robbery: Knack, help, Difficulty, the pet in the way, the watching human's Attention, Seen and kids — all changeable.
- **Roll cards** with **Push** (1 Cattitude or +1 Mood), **Accept**, and the Storyteller's **Seen / Not seen**. The Storyteller's client applies each final roll to the robbery: the step, the door, the entrance, the dog, the distraction, the noise, and the two-meter **Mood** (a ledger: one roll, one change), with **Shoo!** and **Scooped!**.
- **The Robbery Tracker**: the house room by room, the Prize Clock, Broom and Cuddle with Patience, each cat's Moves and Actions as buttons, **Begin round** (the Prize Clock, a one-click temptation prompt) and **End round** (the house's turn rolled in the open: dogs chase cats that didn't deal with them, pets, noise, routines and Searching, holders, Finding it), the Storyteller's pick when a meter fills with no roll, the getaway (the route, the loot in pieces, the warden and the pound), Cred (tags, the catnip and the zoomies, the rivals, the Cat's Whiskers), the outcome counted in loot, and the Storyteller's overrides.
- **Compendia**: the five houses (journals), the ready-made gang, and every house's residents.
- Every automation can be switched off in the settings. Players write only their own cats and chat messages; everything else goes to the Storyteller's client (`User#query`, with a socket fallback).
- `TESTING.md` is the two-client script for checking it in real Foundry v13.

Code layout: pure rules in `module/logic/` (no Foundry globals; `node --test`), shared names in `module/contracts.mjs`, the robbery runtime in `module/robbery/`, rolling in `module/dice/`, the tracker in `module/apps/`, sheets in `module/sheets/`.

## Commands
```
npm install
npm run check               # validate the Foundry system + run every test
npm run build:packs         # regenerate the compendium sources from the houses, the book and Chapter 3, then compile them
npm run build:book          # rulebook PDF → book/dist/
node book/build.mjs --print # print-on-demand interior + covers
node sim/run.mjs --runs 2000  # the simulator
```
After changing a house (`sim/houses.mjs`, then its copy in `module/logic/house-catalog.mjs`) or a house's text in the book, run `npm run build:packs`; `npm run check` fails until the packs match.

© 2026 Richard Moore. All rights reserved.

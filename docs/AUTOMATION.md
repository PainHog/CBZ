# Cat Burglars — Foundry automation design

> **Goal:** players and the Storyteller never track rules by hand (CLAUDE.md). The system does the bookkeeping; where the rules need a human choice (which cat to tempt, how to narrate), the Storyteller gets **one click with a rules-correct default**.

Rules source: the rulebook (`book/src/chapters/`), currently summarised in `docs/CORE-RULES.md` v0.3. The simulator's rules (`sim/rules.mjs`) are a separate copy; a parity test keeps `module/logic/` and the simulator agreeing on the adopted package. Copied patterns from *Heisty Spideys* (`docs/reference/heisty-automation-design.md`) are noted as such.

## 1. Architecture (pattern from Heisty Spideys)

```
UI           Cat / Resident sheets · Roll dialog & roll cards · Robbery Tracker · Mood HUD
Runtime      dice (roll plan → card) · card actions (Push, accept) · robbery store · GM ops · automation hooks
Pure logic   rules · mood · round · house-catalog · residents · prize   (module/logic/*.mjs, node:test)
Contracts    module/contracts.mjs (setting keys, card kinds, op names, hooks)
```

- **Pure logic** lives in `module/logic/` with no Foundry globals; `node --test` covers it.
- **GM-authoritative writes:** robbery state is a world setting written only by the active GM. Players write only their own actor and their own chat messages. Anything else goes through a GM operation (`User#query` with a socket fallback). In v13, query handlers don't receive the sender, so ownership is checked from the payload (LESSONS).
- **The GM client reacts to documents:** a player's roll creates a chat message with structured flags; the active GM's client applies the Mood, progress, triggers and noise. If no GM is online nothing is lost: on `ready` the GM reconciles recent messages whose `eventId` isn't in the ledger.
- **Every automation has a settings toggle** (§8).

## 2. Robbery state (world setting `robberyState`, active GM only)

```js
{
  v: 1, houseKey, name, label: "easy"|"standard"|"hard", gangSize,
  phase: "idle" | "outside" | "robbery" | "ended",
  round, roundSerial,                                   // the clock: once-per-round uses stamp roundSerial
  patience, moodLedger: [/* §3 */],                     // the meters are a fold of the ledger
  prizeClock: { goneAt, lightsOut },                    // after gang-size scaling
  rooms: { [key]: { name, tempt: [] } }, ways: [{ a, b, size, open, opts }],
  entrances: [{ key, room, size, opts, climb, rounds, one, letOut, noisy, jam, open }],
  den: roomKey,
  cats: [{ actorId, userId, where: roomKey|"outside", status: "free"|"held"|"shut"|"outside"|"left",
           hidden, carrying, moved, acted, temptUsed: [] }],
  humans: [{ key, actorId?, room, attention, kind, traits, routine, distractedUntil, distractions, holding, asleepUntil }],
  pets:   [{ key, actorId?, kind, rating, soft, room, mode, until, roam }],
  prize:  { kind, name, size, room, withHuman, steps, stepsLeft, carriers: [], portions, eaten, out, gone, script },
  noise: [roomKey], messes: [roomKey],
  temptation: null | { catId, instinct, room, choice: null|"gaveIn"|"resisted" },
  log: [{ t, text }],                                   // capped at 200
  outcome: null | { result: "clean"|"messy"|"busted", leftBehind: [actorId] }
}
```

The store serialises every write through one promise queue on the active GM, applies a **pure** function from `module/logic/round.mjs`, saves, and fires `Hooks.callAll(HOOKS.robberyChanged, state, diff)` (pattern from Heisty).

## 3. The Mood ledger (two meters; one event, one change)

```js
{ id, eventId, seq, roundSerial, cause, source: { messageId, actorId },
  side: "broom"|"cuddle", steps,            // from moodDelta (rules), push paid with the Mood included
  kind: "roll"|"temptation"|"mess"|"discovery"|"manual"|"trigger"|"set" }
```

- `foldMood(entries, patience0)` replays the entries: each adds `steps` to its meter. When a meter reaches Patience it **triggers**: an entry of kind `trigger` records `{ side, target: catId|null }`, empties that meter, and lowers Patience by 1 (minimum 2). With no target in sight, the meter stays full and the next entry on that side with a cat targets it (CORE-RULES).
- Entries sharing an `eventId` keep only the largest `steps` (one roll, one change), so a re-rendered card or a reconnecting GM can't double-count.
- A Push paid with the Mood amends that roll's entry (+1 step) and re-folds.
- `trigger` entries carry their consequence (Shoo: entrance shut, cat outside; Scooped: holder) so a GM undo re-folds cleanly.

## 4. Rolling

**Roll dialog** (`dice.mjs` builds a pure roll plan with `logic/rules.buildRollPlan`). It shows every part and its source; the player can untick anything that was filled in automatically.

| Part | Filled from |
|---|---|
| Approach rating | Cat actor |
| Knack (+1, max 1) | The action's tags (from the obstacle or entrance option) ∩ the cat's instincts; a checkbox for free rolls |
| Help (+1 each, max 2) | Cats who clicked **Help** on the pending card this round |
| Cattitude die (+1) | Spinner, limited by Cattitude; deducted on Roll |
| Cap 5 | Applied before removals |
| Difficulty | The obstacle, step or entrance option picked from the list, or free entry |
| Opposition | The pet in the way (rating), picked automatically when the action is "deal with the dog" |
| Attention | Highest Attention among humans who see the cat (from robbery state), Sneaky and Sweet only |
| Seen | Computed from robbery state; shown as a badge; the GM can flip it on the card |

**Roll card:** the dice, the result (Flop / Scrape / Clean / Purrfect), the Mood steps it will add and to which meter, noise, and the action's effect (e.g. "step 1 of 2 on the counter done"). Buttons:

| Button | Who | Effect |
|---|---|---|
| **Push (1 Cattitude)** / **Push (+1 Mood)** | Owner, once per roll | Rerolls non-6s, re-reads, re-folds |
| **Help** | Other players, before the roll | Queues +1 die; that cat's Action is used |
| **Not seen / Seen** | GM | Flips the seen flag (re-folds) |
| **Accept** | Owner | Finalises now (otherwise at End Round) |

## 5. Rounds and the house turn

- **Begin round:** the system lists the cats eligible for a temptation (room temptations ∩ instincts, not used before). The GM gets a one-click **Tempt** (random eligible by default, or pick). The player's card shows **Give in (+1 Cattitude)** / **Resist (1 Cattitude)**. With no Cattitude, only Give in.
- **Cats act:** the tracker shows each cat's Move and Action as chips. A roll, a simple-thing button (Pick up, Drop, Eat a portion, Hide, Help) or **I acted** marks them.
- **End round** (pure `round.endRound` → actions, all logged):
  1. Pets act: d6 routine rolled and shown; dogs bark at cats in their room (noise), wake on noise next door.
  2. Noise: each noise room draws the closest eligible human within 2 rooms; a mess found adds +1 Broom.
  3. Humans without noise roll their d6 routine; dozing rolls for grandparents.
  4. Discovery: a human who walked in on the prize disturbed adds +1 Broom.
  5. Holders roll d6 (keep / Den / outside).
  6. Driven-off pets come back when their 3 rounds are up; distractions end.
  7. `round++`; the Prize Clock script runs (the prize moves, or is gone); Lights Out ends the robbery.
- **End robbery:** computes Clean / Messy / Busted and who was left behind; offers the campaign updates (Rep, Lives) on the cats.

## 6. Robbery Tracker app (`module/apps/robbery-tracker.mjs`)

ApplicationV2 + HandlebarsApplicationMixin (pattern from Heisty). Opens from a scene control, `game.catBurglars.openTracker()`, or dropping a house journal on it.
- **Header:** house name and label, round, Prize Clock (rounds left; Lights Out), the two Mood meters with Patience.
- **The house:** one card per room (from the catalog) listing who is there — cats, humans (with Distracted / Holding / Asleep badges), pets (mode) — the room's temptations, and the prize if it's there (steps left, portions). Ways show open/closed; entrances show open/shut.
- **Controls (GM):** Begin round, Tempt, End round, move a token to a room (drag a chip), mark noise, undo last ledger entry.
- **Players** see the same tracker read-only, minus the humans' routine tables.

## 7. Actors and items

- **Cat** (`TypeDataModel`): approaches (1–4), instincts (two keys), body, Cattitude (0–5), Lives (0–9), coat, mark, eyes, quirk, Rep (campaign).
- **Human:** kind, Attention, traits (dozes, busy, kid, teen), routine (six results).
- **Pet:** kind (dog, house cat, parrot, robot vacuum), rating, soft, roam, routine.
- **House** (journal flags): the catalog entry, so a custom house is editable in a form.
- Compendia: the five houses (journals), the ready-made gang (actors), residents (actors), the rules (journals mirroring the book).

## 8. Settings (all world, GM)

| Key | Default | Off means |
|---|---|---|
| `autoMood` | `auto` (`confirm`, `manual`) | Entries proposed for a click, or not made at all |
| `autoSeen` | true | The dialog doesn't pre-tick Seen |
| `autoHouseTurn` | `prompt` (`auto`, `manual`) | End round asks / runs alone / does nothing |
| `autoRoutines` | true | The GM rolls routines by hand |
| `autoTemptation` | `prompt` | No temptation prompt |
| `autoCattitude` | true | Spends aren't deducted (advice only) |
| `autoPrizeClock` | true | The clock and script don't run |
| `autoOutcome` | true | No end-of-robbery card |

## 9. Tests and the smoke test

- `node --test`: every pure module; a parity test that `module/logic/rules.mjs` and `sim/rules.mjs` agree on dice reading, pool size and Mood steps under the adopted package; a whole robbery replayed through `round.mjs` with fixed dice.
- `tools/fake-foundry.mjs` smoke test: a GM and two players run a robbery at *The Chicken at Number 12*: tempt, roll with help, a Push, a seen roll filling Broom, Shoo!, End round with routines and noise, the Prize Clock, the outcome.
- `TESTING.md`: a two-client script for Richard to run in real Foundry (no live Foundry exists in the cloud).

## 10. Work packages (disjoint files)

| WP | Owns | Needs |
|---|---|---|
| A — data & sheets | `module/data/`, `module/sheets/`, `templates/actor-*`, `lang/` keys for actors | contracts |
| B — dice & cards | `module/dice/`, `templates/roll-*`, `module/logic/rules.mjs` | contracts, catalog shapes |
| C — robbery runtime | `module/robbery/`, `module/apps/`, `module/logic/{mood,round,house-catalog,residents,prize}.mjs`, `templates/tracker*` | contracts, rules API from B |
| D — integration | `module/cat-burglars.mjs`, packs, `TESTING.md`, smoke test | A, B, C |

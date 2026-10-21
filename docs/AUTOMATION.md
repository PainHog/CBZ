# Nine Lives Gang — Foundry automation design

> **Goal:** players and the Storyteller never track rules by hand (the project's working rules). The system does the bookkeeping; where the rules need a human choice (which cat to tempt, how to narrate), the Storyteller gets **one click with a rules-correct default**.

Rules source: the rulebook (`book/src/chapters/`), core rules v0.9 (`docs/CORE-RULES.md` still summarises v0.8; the v0.9 changes the system follows are listed under "Core rules v0.9" below). The simulator's rules (`sim/rules.mjs`) are a separate copy; a parity test keeps `module/logic/` and the simulator agreeing on the adopted package. Copied patterns from *Heisty Spideys* (`docs/reference/heisty-automation-design.md`) are noted as such.

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
| `autoGetaway` | true | Getaway rolls move nobody; the Storyteller moves the gang, the loot and the warden on the tracker |
| `autoCred` | true | Tags and the stash are noted, but Cred and the zoomies are kept by hand |

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

## Implementation notes

*Added while building the system (0.5.0, core rules v0.7, simulator package P9 with its `tableRules`); updated for core rules v0.8 (simulator package P10 with its `holdRules`; book/REVIEW.md rows 71–93), decisions 24–33; and for core rules v0.9 (simulator package P11, system 0.9.0), decisions 34–54. Where §1–10 and this section differ, this section says what was built; where a later decision differs from an earlier one, the later one says so.*

### What was built, and where
| Part | Files |
|---|---|
| Pure rules (no Foundry globals; `node --test`) | `module/logic/rules.mjs` (roll plan, dice, Push, Mood steps), `mood.mjs` (the ledger), `house-catalog.mjs` (copy of `sim/houses.mjs`), `map.mjs` (rooms and ways), `residents.mjs` (who sees whom, pets, noise, routines, Searching, holders, Finding it), `prize.mjs` (the prize, the Prize Clock, the outcome), `round.mjs` (a robbery round by round, the Mood's triggers, the Storyteller's overrides), `actions.mjs` (a cat's turn: options, the roll context, effects) |
| Contracts | `module/contracts.mjs` (settings, card kinds, GM ops, hooks); `test/contracts.test.mjs` |
| Data and sheets | `module/data/actor-data.mjs` (cat, human, pet), `module/sheets/actor-sheets.mjs`, `templates/actor/*` |
| Rolling | `module/dice/roll.mjs` (dialog, card, Push, Accept, Seen), `templates/chat/roll-card.hbs`, `templates/dialogs/roll-dialog.hbs` |
| Robbery runtime | `module/robbery/store.mjs` (the serialised world setting), `gm-ops.mjs` (`User#query` + socket fallback), `automation.mjs` (the GM applies roll cards; reconcile on ready), `robbery.mjs` (Storyteller commands, player ops, card buttons), `announce.mjs` |
| Tracker | `module/apps/tracker-view.mjs` (Foundry-free view), `robbery-tracker.mjs`, `templates/apps/tracker-*.hbs` |
| Packs | generated by `tools/pack-content.mjs` from the catalog, the book's house pages and Chapter 3; `npm run build:packs` |
| Tests | `test/{rules,mood,round,actions,replay,parity,contracts,packs,v07,v08,v09}.test.mjs` (`v08`, `v09`: one test per ruling of that version), `test/robbery.smoke.test.mjs` (fake Foundry, GM + two players), `test/smoke.test.mjs` |

### Decisions the design left open
1. **When a roll counts.** A roll card is *pending* until it is final: on a Push (a Push is once per roll), on **Accept**, when the same cat makes its next roll or move, at Begin/End round, or on the GM's **Apply now**. Only then does the active GM apply it — the option's effect, noise, the helpers' Actions and the Mood together. Applying once, at the end, means no effect ever has to be undone (a Push can turn a Scrape into a Flop). The pending card shows the stakes: "If it stands: Broom +1 (3/4)".
2. **The ledger stores the roll's facts, not its steps.** A roll entry keeps approach, result, seen, kid and Push-with-Mood; the fold works out the steps with `rules.moodDelta` against the meters at that point, so "a Flop goes on the fuller meter" survives an undo or a reordering. One event, one change is an *upsert* by eventId (the newer version of a card replaces the old entry, keeping its place), rather than "keep the largest steps".
3. **Who a full meter hits.** After a roll: the roll's cat, if it is still inside (free or held) and an awake human saw the roll (the card's `seenBy`); the human who acts is the highest Attention among them (ties: house order) — for a held cat, its holder. A human holding a cat still sees (REVIEW #71) — their room's rolls count for the Mood — but their hands are full: they only ever act on the cat they hold. With no roll (a Searching human spots a cat, the prize found disturbed or gone, a mess found): a free cat that human can see; one cat is picked automatically, two or more set a *pending pick* — the Storyteller gets a whispered card ("Broom is full — the Storyteller's pick", one button per cat) and the same buttons in the tracker header. Otherwise the meter **waits** for someone with free hands (decision 27). Trigger entries carry a snapshot (cat, carriers, human, entrance, prize, a waiting pick) so **Undo** puts everything back; undoing whatever filled the meter drops a waiting pick.
4. **Effect, then Mood — except moving.** A roll's effect happens first and then its Mood (Ch 5: "a roll that fills a meter still does what it did"); for moves, hauls, exits and meowing out, a trigger fires *before* the cat goes anywhere. If a carrier is Shooed or Scooped the others let go and the prize goes back where the Clock last put it, steps restored.
5. **A hidden cat that does something is seen.** Doing anything ends hiding (CORE-RULES "Seen", REVIEW #27), so every roll is seen by every watcher in the room, and a simple thing done by a hidden cat in a watched room is a roll. Hiding protects a cat that waits; Searching humans, the parrot and "next cat seen" skip hidden cats.
6. **The Storyteller's picks** (ties in noise, the nearest entrance, a dog's *sniff*, which room a Searching human steps into, the vacuum's next room) use house order or a d6, and the house-turn card says "the Storyteller's pick"; the tracker's **Put:** / **Move:** selects override any of them. Only the cat a full meter falls on (decisions 3 and 27) waits for a click, because it decides who leaves the house — and since the pick is made at once (REVIEW #71), every cat's buttons wait for it ("the Storyteller first picks which cat … chases out"), and the human it's waiting on stays put (no noise, no routine) until it's made.
7. **The house's dice** are one Foundry Roll of (2 × humans + pets + 4) d6, used in order and shown on the house-turn card next to each resident; if a turn needs more, Foundry's RNG adds them.
8. **Help** is queued in the robbery (`help[helper] = target`) from the tracker's **Help …** buttons; the roll dialog pre-ticks queued helpers (any cat in the same place can be ticked). Entering, going out and picking the prize up together take the helpers along; a haul's helpers are the other carriers (locked) and, since v0.8 (REVIEW #80), any other free cat in the room that hasn't acted (unticked unless queued; "helps, but stays here"): only the carriers move with the prize. Help adds +2 at most, as always. Helpers' Actions are spent when the roll is applied, and helping a cat deal with a dog counts as dealing with it; a cat a dog or house cat is stopping can help only the roll that deals with that pet (Ch 10, "before doing anything else").
9. **Temptation**: one per round, never the cat tempted last round; Begin round whispers the GM one-click **Tempt** buttons (`autoTemptation: prompt`), or tempts a random eligible cat (`auto`), or neither (`off`; the tracker still lists them). The tempted cat decides at once: until it answers, every other cat's buttons say "… is tempted and goes first". A cat that gives in does it there and then (its Action, before it moves), so it acts first; after a resist the round goes on in any order. A Lap Cat's player picks the human from per-human **Give in** buttons.
10. **Cattitude lives on the actor.** The player's client spends it (a Push; v0.9: there is no Cattitude die); the GM's client writes gains and resisting (temptation, Purrfect) and resets it at the start of a robbery (2, or 3 in a gang of three). `autoCattitude` off makes all of it advice only.
11. **Gang size.** 1–3 cats use the three-cat scaling (REVIEW #76: a gang of one or two plays as three), 5+ the five-cat scaling (Patience −1 only, REVIEW #103). For three cats only the Gone round moves, and Lights Out with it (REVIEW #90): the Prize Clock's put-down rounds stay as printed.
12. **Settings beyond §8**: `autoEffects` (a roll's result changes the house; off = Mood and noise only), `trackerForPlayers`, `trackerPosition`; `autoTemptation` also has `auto`; `autoHouseTurn: manual` ends the round's bookkeeping only (no dog chase, pets, noise, routines, holders or Finding it).
13. **The end.** Lights Out always ends the robbery. "No free cat inside" ends it only once the prize is got or gone — while it is still to get, cats outside can come back in (otherwise round 1 would end before anyone entered). Anything else the Storyteller ends with **End the robbery**.
14. **Where a dropped prize lies.** Put down, given in to a temptation, chased off by a dog or a failed haul in a dog's room: it lies in that room (and is now "not where the Clock last put it"). Shoo!/Scooped!: back where the Clock last put it, steps restored.
15. **A roll after the turn is spent** (two quick rolls in one round): it still counts for the Mood and noise, but its effect isn't applied; the card says the Storyteller decides.
16. **The front door** shuts after the first cat tries it, success or not (the simulator's reading of "only one cat gets through before it shuts").
17. **Riding the vacuum**: hidden while it rides and carried along when the vacuum wanders (it steps on its list in the Pets step, through closed doors); any roll hops it off. A cat holding the prize can't hop on (REVIEW #89), and picking the prize up hops a rider off.
18. **Packs follow the book.** The house journals are the book's own house pages (`book/src/houses/*.html`) with the catalog's tables filled in; `test/packs.test.mjs` fails when the committed sources differ from what `tools/pack-content.mjs` generates, and checks the gang against Chapter 3.
19. **The dog at the end of a turn** (v0.7). At End round, before the Pets step, every free cat in an awake dog's (or house cat's: it guards like a dog's charge, REVIEW #89) room that hasn't dealt with it this round — by rolling against it or helping that roll — is chased back the way it came (a carrier drops the prize); a cat that came in from outside this round is chased back outside (REVIEW #74), through the entrance it used. A cat that arrived by a roll (climbed in, so no Action left) is spared and must deal with it first thing next turn: its buttons are only "leave" or "deal with it". Giving in as a Scrapper isn't dealing with it.
20. **Hauls** (v0.7, v0.8) are Sneaky or Savage, plain unless the prize says (`haulDiff`: the cake's 1 = Tricky, REVIEW #80, #86); a Knocker's Knack counts (the "knock" tag); an entrance with its own roll uses that roll. A haul is every carrier's Action, is seen by humans in the room it leaves or enters, makes its noise in the room the prize ends up in, and counts as leaving a dog's room; a failed haul there is chased back, and the prize drops in the dog's room. A Small prize moved where nobody sees it is no roll: the carrier just walks (its Move), its Action still free (REVIEW #89).
21. **Eating a portion** is always a roll (Sneaky quietly, Savage wolfing it; a Foodie's Knack either way, REVIEW #82), seen or not. Nothing is picked up or eaten until every step of the prize's spot is done; a part-eaten prize carried outside is got.
22. **The holder's d6**: 4–5 shuts the cat in the Den and the holder stays in that room this round; 6 puts it out through the nearest entrance, which is left open. While holding, they don't follow a routine, answer noise, Search or find anything, and they can't be Distracted (REVIEW #78: no **Distract** button for a holder).
23. **An unseen Push paid with the Mood** that fills a meter: nobody can see a cat, so it waits (decision 27) until a human with free hands can see one. The simulator's players never pay with the Mood when it could fill a meter, so the case doesn't come up there.
24. **The Prize Clock's hold** (v0.8, REVIEW #79). The human the Clock moves this round — putting the prize down, or coming for it and finding it gone — is marked `staysRound`: no routine, no Searching step, and no noise draws them until the next round; the next closest human answers instead, and the house-turn card says "… stays with the … (the Prize Clock's hold)". The tracker's badge: "Stays with the prize: answers no noise this round". With `autoPrizeClock` off nobody is moved, so nobody is held.
25. **The parrot remembers** (v0.8, REVIEW #81). After every change to the robbery (decision 27's look) an uncovered parrot with an unhidden free cat in its room notes the round (`sawRound`); in the Pets step it squawks if it saw one at any time this round, even if the cat has since hidden or left ("it saw a cat earlier this round"). A cat in its room as the round begins counts; covering the cage silences it for the rest of the robbery, even after it saw one. The tracker shows "saw a cat this round: squawks in the Pets step".
26. **Shoo!** (v0.8, REVIEW #83): out through the nearest entrance that works this round (a front door outside its rounds doesn't; if none works, the nearest of all); ties in house order, and the card says "as near as another: the Storyteller's pick" (the entrance's **SHUT**/open toggle fixes it). The human goes to that entrance's room and stays there this round (`shooRound`: no routine or Searching step — but a noise can still draw them, question A). A carried prize goes back where the Clock last put it with every step of its spot to do again. A held cat whose own roll fills Broom is put out by its holder, who lets go (REVIEW #72).
27. **A meter that waits** (v0.8, REVIEW #71, #83). A full meter that nobody could act on — the only watchers were holders, nobody saw, a mess found in an empty room, a Push paid with the Mood, the Storyteller's +1 — goes off **as soon as a human with free hands can see a cat**: the system looks after every change (a move, a roll, a temptation answered, Begin round after the Clock, between every step of the house's turn — a Distracted human looks round as it starts — and the Storyteller's Put/Move/patch/±), but not after **Undo** (the next change looks again). The human with the highest Attention among those who can see a cat acts (ties: house order); one cat in sight is chased out or picked up at once, several make a pending pick (decision 6). Broom is settled first, then Cuddle. With `autoMood: manual` a meter never goes off by itself. A Shoo! or Scoop's Patience drop can leave the other meter full; it waits the same way (question C).
28. **Out and back in** (v0.8, REVIEW #88). A cat that goes out of the house this round — through an entrance, let out at the front door, Shooed, chased back outside or put out by a holder — can't come back in until the next round (`outSerial`; its **In through …** buttons say "it went out this turn"). An entrance's roll is seen from the room it leads into (as built since v0.6).
29. **A noise made on purpose** is a noise and a mess whatever the roll (REVIEW #88): a Clean in view still makes it (the roll decides only who notices), a Flop makes it once. Several noises in one room count as one and leave one mess (REVIEW #75, #84); a Searching human still answers noise first — unless the Clock moved them this round.
30. **Dozing** (REVIEW #73, #90). Asleep, a human sees and hears nothing and stays put: no routine, no Searching step, no doze die ("… is asleep and stays put"). Awake, the doze die is rolled with their routine (so not in a round they answer a noise, Search, or stay for the Clock). The Prize Clock wakes them for their job ("… wakes up: there's the … to see to").
31. **The cake's front-door guests** (REVIEW #86: Attention 0, fill no meter) need nothing built: a front-door roll is seen by the real humans in the hall, if any, and the guests change neither the dice nor the Mood.
32. **State added for v0.8**: cats `outSerial`, `enteredSerial`, `enteredBy`; humans `shooRound` (`staysRound` is the Clock's hold); parrots `sawRound`; prize `haulDiff`; a pending pick with `entry: null` comes from a waiting meter. A robbery saved before v0.8 reads the missing fields as "not this round" (and its prize hauls plain: start the cake again for its Tricky haul).
33. **Switches.** Every v0.8 automation sits under an existing setting: the hold under `autoPrizeClock`, the parrot and the dozing under `autoHouseTurn` (and `autoRoutines` for the doze die), the waiting meter and Shoo! under `autoMood`, haul helpers and the out-and-back rule are options the players see (the Storyteller can **force** an option or **Give back Move and Action**).

### Questions for the designer, answered (REVIEW rows 71–78, built in v0.8)
1. *Can a human holding a cat see?* Yes, but their hands are full (#71; Chapter 5 and CORE now agree). Built.
2. *Should a holder ever Shoo or Scoop another cat?* No: a meter only a holder saw waits for the next cat seen by someone with free hands (#71). Built (decisions 3, 27).
3. *Hidden cats acting:* any roll ends hiding, as the book says; the simulator now agrees (#78). Built (decision 5).
4. *Sleeping humans and routines:* a dozing human stays put while asleep (#73); the doze die is rolled with the routine, and the Prize Clock wakes them (#90). Built (decision 30).
5. *Scrapper's Knack and wrappings:* tearing a wrapping isn't fighting (#77, house data). Built (the catalog's `wrapped` step has no "fight" tag).
6. *Chased back after coming in this round:* back outside (#74). Built (decision 19).
7. *Several noises in one room:* count as one (#75), and leave one mess (#84). Built (decision 29).
8. *Very small gangs:* a gang of one or two plays as three (#76). Built (decision 11).
9. *A held cat whose roll fills Broom:* put outside; the holder lets go (#72). Built (decision 26).
10. *Distract "a human in your room":* a holder can't be Distracted (#78). Built (decision 22). The rest stays as built: any awake human there who isn't already Distracted, even if the cat is hidden (the distraction brings it out) — see question H.
11. *The no-roll pick:* the Storyteller picks at once (#71). Built: every cat's buttons wait until the pick is made (decision 6).

### Questions for the designer (v0.8), answered 2026-10-20 (REVIEW rows 101–102)
Answers: **A** no — only the Prize Clock's hold beats noise; a human who has just Shooed a cat stays in that room but still answers noise. **B, C, D, E, F, H** confirmed as built. **G** yes — the holder's 6 uses the nearest entrance that works this round, like a Shoo! (built).

#### The questions as asked
A. **A Shoo! and noise.** "The human stays in that room": built as no routine and no Searching step that round, but a noise can still draw them — only the Prize Clock's hold says "answers no noise". Should the Shoo!'s stay beat noise too?
B. **Chased out mid-turn.** A cat Shooed (or chased back outside by a dog) during its turn can't come back in that turn: built as "going out" for REVIEW #88. Otherwise a cat Shooed before its Move could walk straight back in through another open entrance. Confirm.
C. **A meter made full by a Patience drop.** After a Shoo! or Scoop, Patience −1 can leave the other meter at Patience (say Cuddle 3 when Patience drops to 3). Built: that meter is full and waits like any other, so it goes off at once if a human with free hands can see a cat. The simulator only triggers on the next step on that side. Confirm, or should the other meter drop to one short of full?
D. **A meter filled where nobody sees a cat.** A mess found in an empty room fills Broom: built as the literal "it stays full until one can", so it goes off at once on a cat that another human with free hands can see, anywhere in the house. Or should only the human who filled it act (when they next see a cat)?
E. **Helping while a dog is in the way.** A cat a dog or house cat is stopping can help only the roll that deals with that pet (Chapter 10, "before doing anything else"). Built so (decision 8); confirm, since it also keeps a cat beside the dog from helping a haul out of that room.
F. **The parrot and held cats.** Built as the simulator: the parrot squawks for free cats it saw, so a cat held in its room doesn't count. Should a held (or shut-in) cat set it off?
G. **The holder's 6.** Shoo! now uses the nearest entrance that works this round; the holder's 6 still uses the nearest entrance of all (Chapter 9 just says "the nearest entrance"), so a holder can put a cat out of the front door outside its rounds. Same rule for both?
H. **Distracting with a hidden cat** (the rest of old question 10): a hidden cat can Distract a human in its room (the roll brings it out of hiding). Confirm.

### Core rules v0.9 (system 0.9.0, simulator package P11)
The outside review of v0.8 changed the book (Chapters 1–13 and the house pages); the simulator plays it as P11 (`shooKeepLast`, `meterCap`, `giveInNoFill`, `knockerOneBroom`, `hunterNoFight`, `lapCountsDistract`, no `cattitudeDie`). `test/v09.test.mjs` has one test per ruling below; `test/parity.test.mjs` checks P11 (the Knack table, pool sizes, the meters after a trigger, the per-house gang numbers); the fake-Foundry smoke test plays a Shoo! through a shut entrance, the last open entrance, the other meter dropping and a give-in stopping one short.

34. **Shoo!'s entrance** (Ch 5; replaces decision 26's choice). Out through the nearest entrance the cat *fits through* (a Chonky cat never through a Tight one) that works this round (a front door only in its rounds); if none works for that cat, the nearest it fits through; if none fits, the nearest of all; ties in house order, the card saying "the Storyteller's pick" (`map.shooEntrances(state, room, cat)`). A shut entrance is opened to put the cat out ("opening it first"). Then it is shut — unless it is the house's last entrance still open, counting only entrances that are open and have no round limit (`map.lastOpenEntrance`, as the simulator), which is left open. The human stays in that entrance's room for the rest of the round and **answers no noise** (replaces answer A). A shooed cat can come back in next round at the earliest (decision 28). The holder's 6 and a held cat whose own roll fills Broom use the same choice; the holder's 6 opens a shut entrance and leaves it open ("it stays open", Ch 9).
35. **After a catch** (Ch 5). Only a cat *carrying* the prize drops it, and only then does it go back where the Clock last put it with every step to do again; eaten portions stay eaten. A cat caught by the very roll that picked it up was carrying it (the effect is applied before the Mood, decision 4). The meter empties, Patience −1 (min 2), and in the fold the other meter drops to one below the new Patience if it is at or above it (`foldMood`, like the simulator's `afterTrigger` with `meterCap`): no instant chains, so the last sentence of decision 27 and answer C no longer apply. The patience card says "Cuddle drops to 2, one below it".
36. **Full meters** (Ch 5). Steps beyond a full meter are lost, and so are steps on a full meter that is waiting for a human with free hands; the fold reports `applied` and `lost` per entry, and the Mood line says "(1 lost: the meter is full)" or "(lost: the meter is already full)". Both full and waiting: Broom goes off first (as before), and its catch drops Cuddle below the new Patience.
37. **No Cattitude die** (Ch 4). Gone from the roll plan, the dialog, the card and the setting's hint; `buildRollPlan`/`poolSize` ignore an old `cattitudeDie` argument. Cattitude buys a Push or resisting a temptation.
38. **The Push** (Ch 4). A step paid with the Mood always lands, even on a Purrfect, and a kid doesn't double it (`moodDelta` already did this; now tested). A Push on a zero-dice roll rerolls both dice (`pushIndices(faces, zero)`; the card's Push buttons show for it even with two 6s).
39. **Temptation** (Ch 7). Only a free cat inside, and not one that has to deal with a pet in its room this turn (an awake dog or guarding house cat it hasn't dealt with or slipped past). A give-in's Mood step never fills a meter: the ledger entry carries `noFill` and the fold stops it one short, so a confirm or an undo stays right ("giving in never fills a meter: it stops one short"). A Knocker seen by a human: +1 Broom and **no** mess; unseen: a mess (the catalog's `giveIn.mess: "unseen"`). A Lap Cat's fuss counts as a distraction of that human (`distractions` +1: the next Distract costs a die more). A befriended dog no longer tempts Scrappers.
40. **Hunter's Knack** is pounce and chase only (`knack: ["chase"]`); the parity test compares with the simulator's table filtered by `hunterNoFight`, and checks the two `hasKnack` agree.
41. **Distract and the Scoop** (Ch 5, 6). If the Distract roll fills Cuddle, the Scoop happens and the human is not Distracted: the roll's entry names the human it was aimed at (`prefer`), who picks the cat up even if someone with a higher Attention also saw it; their distraction is undone and not counted ("The Scoop wins: … isn't Distracted"). (With autoMood "confirm" the Scoop comes when the Storyteller confirms; undo the distraction by hand then.)
42. **Ties between humans** (Ch 11 "Ties"; replaces house order for humans). The higher Attention goes; still tied, a die (`residents.pickHuman`, using `rules.pickByDie`, which splits the faces evenly: two choices 1–3/4–6, three 1–2/3–4/5–6, four or five reroll the faces above). It decides who answers a noise, who acts on a roll that fills a meter, and who acts on a waiting meter. In the house's turn the die comes from the turn's open dice; outside it (a roll card, a Storyteller's change) from Foundry's random generator (`settings.tieDie`), and the event names the face ("tied on Attention: a die, 5"). With no die (the pure functions called without one) the first in house order goes, and the card says "the Storyteller's pick". Entrance ties and the cat a meter falls on stay the Storyteller's.
43. **Noise** (Ch 6). The closest awake human within two rooms who isn't already there, isn't holding a cat, and isn't staying put this round — the Clock's put-down human (decision 24) or a human who just shooed a cat ("… stays by the entrance they shooed a cat out of"). A mess is found once, then cleared (as built).
44. **Searching and being seen** (Ch 6, 10, 11). A prize that is all eaten isn't "inside": Searching rule 1 skips it. A held cat counts as seen for Spotted (+1 Broom: "can see Velvet (held)") and for the parrot (`residents.seenCatsIn`); a meter that Spotted step fills still falls on a free cat that human can see — or waits — because a held cat is in someone else's arms (question L).
45. **Pets and dozing** (Ch 10). A befriended dog doesn't bark or charge but still follows its routine. Sniff goes toward the nearest free cat inside (held, shut-in and outside cats don't count). The robot vacuum picks its next room on its list with a die between them (no die when there is only one). A Flop when dealing with a pet chases back only the cat who rolled (as built; now tested). A dozing human who is awake rolls the doze die every house's turn, even in a round they roll no routine (they answered a noise, stayed for the Clock or a Shoo!, or Searched); a human holding a cat doesn't (question N); only a Prize Clock job wakes them (decision 30); with autoRoutines off, no doze die.
46. **Caught** (Ch 9). The holder rolls in the house's turn after the routines (as built). On a 4–5 the human stays just outside, in the room next to the Den's door (`round.denOutside`), for the rest of the round. Free cats in the held cat's room may help its wriggle (**Help …** from the tracker, the dialog's helpers; +2 at most).
47. **The front door** (Ch 8; replaces decision 16). It lets one cat through each round it works — the party's in rounds 1 and 2 — and a failed try uses that round's chance: the entrance stays open and remembers `usedRound`; other cats see "one cat a round: it has been tried this round". Sweet there is plain (as in the catalog).
48. **Hauling and eating** (Ch 8). The other carriers are the helpers, other cats in the room may help within the +2 cap (as built). The dog takes no dice off a haul out of its room (a haul has no opposition). If the haul fails there, the dog chases the carriers back the way they came and they drop the prize where they end up — the leader's room (replaces part of decision 14; question M). Carriers who haul into an awake dog's room have spent their Actions, so they stay and deal with it first thing next turn (decision 19's "arrived by a roll"). Eating is plain unless the house says otherwise (a prize may carry `eatDiff`; none of the five does).
49. **The end** (Ch 8; replaces decision 13). The robbery ends at Lights Out, or at the end of a round (End round's check — the tracker only warns before then) when no free cat is inside and the prize is got or gone; any cat still inside then, held or shut in, is adopted and the footer says so. "The gang outside decides to go home" is the Storyteller's **End the robbery** (question R).
50. **Gang size** (Ch 11). A ready-to-run house may print its own three- and five-cat numbers: the catalog's `scale3` / `scale5` ([Patience, Clock]) win over the general rule (three cats: Patience +1, Clock +2, 3 Cattitude; five: Patience −1) in `prize.gangScaling(gangSize, house)`. Grandpa Wendell's: Patience 8, three cats +2/+2; the cake: three cats +1/+1, five −1/+1; Chef Marchetti's: Patience 7, three cats +1/+3. The start card says when a house's own number is used, and the house journals print each house's numbers.
51. **Rep** (Ch 13). Rep no longer raises approaches: at 3, 6 and 9 Rep every cat starts each robbery with 1 more Cattitude (never above 5). Rep stays on each cat actor (the outcome card's **Give the gang +1 Rep** gives it to every cat); the gang's Rep is the highest among the robbery's cats, so a cat who joined later gets the bonus too (`rules.repBonus`, `startingCattitude`; the robbery keeps `rep` and `repBonus`; Start writes the starting Cattitude when autoCattitude is on). The cat sheet's warning no longer mentions raising an approach.
52. **The book's other v0.9 clarifications.** *No help from outside* (Ch 4, Ch 11's "Questions at the table"; replaces part of decision 8): cats outside can't help one coming in, so entering no longer takes helpers along, and outside cats get no **Help** buttons. *Meow at any door* (Ch 8): any entrance that is a door — not a window, a skylight or a climb — read from the catalog (let-out front doors, and entrances that aren't climbs or Tight whose names say door or flap; a house entry may set `door`); it is offered where walking out isn't free (the entrance is shut, needs a roll, or is a front door) and needs a human there; the entrance is left as it was (question O). *Put down after the Gone round* (Ch 8): a prize the gang was holding when its Gone round came is gone as soon as they put it down (a drop, a give-in, a dog's chase, a Shoo!).
53. **State added for v0.9**: entrances `usedRound`; the robbery `rep`, `repBonus`, `ownScaling`; Mood entries `noFill` (step) and `prefer` (roll); the fold's `applied`, `lost`, `stopped`, `otherDropped`. A robbery saved under 0.8 reads the missing fields as "none"; a front door shut by a 0.8 try stays shut (open it by hand for the party's second round).
54. **Switches.** Everything sits under the existing settings: Shoo!, the meters and the Scoop under autoMood; the temptation rules under autoTemptation/autoMood; noise, pets and dozing under autoHouseTurn (and autoRoutines for the vacuum's and the doze die); the holder's 6 and the Den under autoHouseTurn; Rep's starting Cattitude under autoCattitude.

### Questions for the designer (v0.9)
I. **Scrappers and pets.** Ch 7: "Any room with an awake dog or house cat in it tempts Scrappers — but a cat that has to deal with a pet in its room this turn (Chapter 10) can't be tempted." At the start of a round every free cat in an awake dog's or house cat's room has to deal with it (Ch 10 "Charge"), so the pet half of the Scrapper's temptation can never fire — yet the Ch 7 table still says giving in "isn't dealing with a dog: you still have to". Built literally (no Scrapper is ever tempted by a pet it must deal with). The simulator doesn't apply the exclusion at all. Which is meant?
J. **A Push on a zero-dice roll.** Ch 4: "A Push rerolls both dice." Built so; the simulator's `pushRoll` keeps a 6 on a zero-dice roll (so a [6, 2] rerolls only the 2). Worth aligning the simulator.
K. **A Distract that fills Cuddle with others watching.** Ch 5: "the Scoop wins: that human picks the cat up and isn't Distracted." Built: the human the Distract was aimed at picks the cat up, even if a watcher with a higher Attention saw it. Confirm.
L. **Spotted with only a held cat in sight.** A held cat counts as seen (Ch 11), so a Searching human beside one adds +1 Broom; if that fills Broom, built: it falls on a free cat that human can see, or waits — nobody shoos a cat out of someone else's arms. Confirm.
M. **A failed haul out of a dog's room** with carriers who came in from different rooms: "they drop the prize where they end up". Built: each carrier is chased back its own way; the prize drops where the leader (the cat who rolled) ends up.
N. **Dozing while holding a cat.** "Roll it every house's turn, even in a round they don't roll a routine." Built: a human holding a cat rolls no doze die (falling asleep with a cat in your arms isn't in the book). Confirm.
O. **Meowing at a door.** "They open it and let you out": built as letting the cat out and leaving the entrance as it was (a shut back door stays shut). Built where walking out isn't free (a shut door, one that needs a roll, a front door), with a human there who can see the cat. Confirm.
P. **The holder's 6 through a shut entrance.** Ch 9: "Puts the cat out through the nearest entrance that works this round (it stays open)." Built: the human opens it if it was shut and leaves it open.
Q. **The party's front door after a Shoo! through it.** The guests keep it working in rounds 1 and 2; a Shoo! that shuts it in round 1 leaves it shut for round 2 as built. Should the guests open it again?
R. **Going home with a friend held.** Ch 8: the robbery ends "at the end of a round, if no free cat is inside and either the prize is got or gone, or the gang outside decides to go home", and "Don't go home while a friend is held or shut in". Built literally: with the prize got or gone and no free cat inside, the robbery ends at the end of that round and a held or shut-in cat is adopted; to wait for a friend, a free cat must still be inside. The simulator's gang keeps the robbery going while a friend is held. Confirm the book's reading.

### The getaway, shiny loot and the pound (core rules v0.9 with the getaway; simulator package P12; the fix round's changes are decisions 76–81)
The book gained Chapter 9, The Getaway, shiny loot and "pinched" instead of "adopted" (the simulator's `getaway`, `wardenLag` 1, `wardenFlop`, `dodgeDiff` 0, `shinyTempts`: package P12). `module/logic/getaway.mjs` is the pure getaway; `test/getaway.test.mjs` tests it; the fake-Foundry smoke test plays two getaways (one Clean, one with a drop, a Flop, the van, a dodge and a pinch). The simulator's adopted P13 adds Cred (next section), which the system now follows too.

55. **The getaway is a phase** (`phase: "getaway"`, state `s.getaway`). The house part ends as Ch 8 says — Lights Out, or at the end of a round with no free cat inside and the prize out, eaten or gone, or the Storyteller's **End the robbery** when the gang runs for it (`round.finishRobbery`). Cats still inside — free, held or shut in — are pinched (holders let go: the warden collects them at the door); every other cat starts on space 0, the garden. The outcome comes when every cat is home or pinched; if nobody is running, at once. `store.running` is true on the getaway too.
56. **The route** is the house's `getaway` (four obstacles: a name, approach options `[approach, Difficulty, …Knack tags]`, and a pet's rating if one is on it). A house without one gets the simulator's default route (a fence, a garden, a wall, a road: Ch 9's own-house table).
57. **The loot** (`prize.lootOf`). Food: the portions not eaten in the house, and only if the food was carried out; anything else Small 1, Medium 2, Large 3 pieces (shiny things like fun ones). Portions eaten inside are safe. The pieces are shared Chonky cats first (two each), then one each, as the simulator shares; what nobody can carry lies in the garden (question S).
58. **A getaway round.** Each running cat has one go, in any order: **Over …** (the obstacle's roll, the obstacle's pet taking its rating, Knacks by the option's tags, and −1 die if it carries loot — not a Chonky cat with a single piece; the leader's own load, question T), with up to two helpers from its space who go over with it (**Help …** as in the house; the dialog lists them); or **Grab a dropped piece** instead of going on. **Drop a piece of loot here** is free, before rolling, to lose the loot die. It works: onto the next space, past the fourth obstacle home. A Flop: the group stays, every carrier in it drops a piece there, and the warden will come on two spaces. The roll dialog and card are the usual ones with nobody watching: no Attention, no meters ("nobody's watching from a window out here"), a Push paid with Cattitude only (no **Push (+1 Mood)**); a Purrfect still earns 1 Cattitude.
59. **The warden** (**End the getaway round**: the tracker, or the button on the round's getaway card). The van pulls up at the end of round 1 if anyone was Shooed or Scooped tonight (a trigger in the Mood ledger), else at the end of round 2, and the warden lands on space 0; after that it moves 1 space a round, 2 if any cat Flopped an obstacle that round (a dodge's Flop doesn't count, as in the simulator; question V), never past the last obstacle. Loot on or behind its space is gone ("Evidence!"). Cats on or behind it are cornered: the round waits while each rolls **Dodge the warden!** (Sneaky to slip between the boots, Savage to bolt, Sweet for "I'm somebody's cat!", plain; the Knack tags hide, chase, charm, as the simulator). It works: onto the space just ahead of the warden (past the last obstacle: home, question W). A Flop: pinched, loot and all. After the last dodge the next round begins.
60. **The outcome** (Ch 9 "How did it go?", `prize.robberyOutcome`): loot home = pieces carried home + portions eaten in the house. Clean: all of it and nobody pinched; Messy: at least half, or all of it with somebody pinched; Busted: less than half. The outcome card says the loot home and who went to the pound; a pinched cat's owner gets **…: spend a Life to bust out of the pound** (the campaign button). "Adopted" is "pinched" everywhere in the system, as in the book.
61. **By hand** (`autoGetaway`, default on). Off: getaway rolls are posted but move nobody, and **End the getaway round** only moves the round on. With it on or off, the Storyteller can fix anything from the tracker: **Put:** (a space, Home, Pinched), **Loot:** (pieces carried) and **Warden:** (a space, or on the way); **Count the loot** once everyone is home or pinched.
62. **Shiny loot** (Ch 7, Ch 8). A prize kind `shiny`, carried and counted like a fun thing (`CATB.prizeKinds`; `prize.prizeKindByD8` for the d8: 1–2 delicious, 3–4 fun, 5–6 shiny, 7–8 a box; when it's gone it's "locked away in a drawer"). Every room tempts Curious and Knocker cats (`CATB.rules.shinyTempts`); where the room doesn't list the instinct itself, the temptation is "something shiny lying about" or "something sparkly on the edge of a table".
63. **Chapter numbers.** Chapter 9 is now The Getaway, so Caught! is 10, Who Lives There 11, The Storyteller 12, Making a House 13, The Block 14 and the houses 15–19. The code, the sheets, the settings and the packs follow; decisions 1–54 above keep the numbers of their time.
64. **Houses** come from the simulator's catalog: the Okafors' Patience 8, Grandpa Wendell's Patience 9 (back to the general gang rule), the cake and the salmon gone at the start of round 9, the cake's and the salmon's own gang numbers; each house journal prints its getaway route and its loot.
65. **State added**: `getawayRoute` (from the house); `getaway: { round, stage: "run"|"cornered", route, arrives, warden, catches, cats: { [id]: { pos, carry, state: "running"|"home"|"pinched", acted, where } }, drops, cornered, flopped, loot, houseEnd }`; the outcome's `loot`, `lootTotal`, `lootHome`, `pinched` (`leftBehind` is the pinched cats).

### Questions for the designer (the getaway)
S. **Loot nobody can carry** "is left in the garden": built as lying on the garden space, so a cat with room could grab it before the warden arrives (and the warden takes it when he does); the simulator counts it lost at once.
T. **The loot die in a group**: "A cat carrying loot loses 1 die on its getaway rolls": built for the cat who rolls (the leader); the simulator takes the die off if anyone in the group is loaded.
U. **Helpers on a Flop**: every carrier in the group drops a piece — built so (the book: "every carrier in the group drops a piece").
V. **A Flop on a dodge** doesn't make the warden come on two spaces (built as the simulator: only obstacle Flops, in the round they happen). Confirm.
W. **A dodge on the last space**: "the space just ahead of the warden" when the warden is on the last obstacle is the hideout — built as home. Confirm.

### Cred: showing off (core rules v0.9 with the getaway and Cred; simulator package P13)
Chapter 9 gained "Cred: showing off" (the simulator's `cred`, `tagMess`, `nipDie`: its adopted package P13). `module/logic/cred.mjs` is the pure part; `test/cred.test.mjs` tests it; the fake-Foundry smoke test plays a night with a tag over the rivals', a tag in view, the catnip, the zoomies, Cred by hand, the rivals on the getaway and the Cat's Whiskers. Cred never changes how the night went. In the system's words "on the nip" is **the zoomies** (the cat sheet's **Zoomies** box; "gets into the catnip").

66. **Where it lives.** Each cat in the robbery has `cred` (tonight's points) and `nip` (the zoomies); the house's Cred line is `s.cred` — the catalog's `cred` (the catnip stash's room and name, the rivals, the room they tagged, the obstacle they hang about on) plus tonight's `tags` and `nipBy`. A robbery saved before Cred reads as no stash and no rivals.
67. **Tag a room** (option `tag`, a free cat inside whose room the gang hasn't tagged): a simple thing — unseen it's the cat's Action with no roll; in view a roll, Sneaky (the watcher's Attention counts) or Savage, plain. It works: the room is tagged for the whole gang, it's a mess (no noise: the next human in that room finds it, +1 Broom), and the cat scores 1, +1 for doing it in view, +1 more over the rivals' tag. A roll that doesn't work leaves no tag (question Y); its Mood and noise count as any roll's. A carrier may tag (question AC).
68. **The catnip stash.** The Storyteller may tempt any free cat in the stash's room with it, whatever its instincts (the whispered prompt lists "The catnip stash"), on the usual terms: one temptation a round, never the cat tempted last round, not a cat facing a pet. Giving in works like a Curious cat rummaging: a carrier drops the prize, a noise, +1 Broom if a human sees (never filling the meter), then 1 Cred and the zoomies. Or **Get into the catnip** on purpose (option `catnip`): unseen no roll, in view a roll (Sneaky or Savage); it works: the same, without the extra Broom (question Z), and one noise (the yowl, not the roll's as well); a Flop misses it. One stash, one cat (`nipBy`): after that nobody is tempted by it or can get into it.
69. **The zoomies.** +1 die on every roll (the roll dialog's "the zoomies +1", added before the cap of 5: `buildRollPlan`/`poolSize` `nip`); every roll it makes is a noise, even a Clean or a Purrfect ("even a Clean comes with a yowl"); a resist becomes a give-in ("Resist? Resist what? Wheee!") and the temptation card has no **Resist** button; and everything it scores counts double. The nip's own point is 1 (question X). It wears off when the getaway starts ("By the back fence … zoomies have worn off"); a cat that went outside during the house part still has it (question AD).
70. **The rivals on the getaway** (`getaway.patch`, the obstacle index, and `getaway.rivals`). Loot dropped on their space — on purpose, in a Flop's scramble, or left in the garden when they wait at the first obstacle — is nicked at once ("Nicked! … Cheek!"; `loot.nicked`). The cat who leads a group over their obstacle with a Clean or a Purrfect scores 1 ("leads the gang right past …, tail high"); a Purrfect over any obstacle (not a dodge) scores the leader 1 ("what a leap"); a Purrfect past the rivals scores both. Helpers don't score. The nicking is part of the getaway automation (`autoGetaway`), the points are Cred's.
71. **The end of the night** (`outcome.cred`, `credSummary`): every cat's Cred, the gang's total, the Cat's Whiskers (the most Cred; ties share it; nobody when nobody scored, question AA) and whether the night earns 1 Rep (the gang's total 5 or more, not Busted: question AB). The outcome card adds "Cred tonight: …", the Cat's Whiskers line and the campaign Rep; its button gives the gang 1 Rep for a Clean Getaway and 1 for a Cred night ("Give the gang +2 Rep (campaign: a Clean Getaway and 8 Cred tonight)").
72. **Chat.** Showing off with no roll posts a **Showing off!** card (`CARD.cred`); a roll's card lists it in its applied lines, and the temptation card lists the catnip. The start card prints the house's Cred line; the house journals print the rivals on the route and the stash and the rivals' tag, as the book's house pages do.
73. **Tracker and sheets.** Badges "Zoomies!" and "Cred N"; rooms show "Tagged by the gang", "… tag (tagged over!)" and the stash; the header shows "Cred tonight: … — the Cat's Whiskers so far: …"; the rivals' space on the route says they hang about there. The Storyteller has **Cred +1 / −1** and **Zoomies: on / off** for every cat. The cat sheet shows "Cred tonight" and the **Zoomies** box (the Storyteller ticks it; players see it greyed out).
74. **By hand** (`autoCred`, "Score Cred", default on). Off: tags and the stash are still noted (a tag is still a mess), but nothing scores by itself ("(Cred is kept by hand: … has N Cred coming …)"), and the zoomies add no die, make no extra noise and don't stop a resist; the Storyteller keeps score with the tracker's buttons.
75. **State added**: `cred: { catnip, catnipName, rivals, rivalTag, patch, tags, nipBy }`, each cat's `cred` and `nip`, the temptation's `label` and `tempt`, `getaway.patch`, `getaway.rivals`, `getaway.loot.nicked`, the outcome's `cred`. Parity now follows P13 (`cred`, `tagMess`, `nipDie`; the pool with the zoomies is the simulator's rating + `nipDie`).

### Questions for the designer (Cred)
X. **The nip's own point**: the book says the cat "scores 1 Cred. … That cat is on the nip until the house part ends: … everything it scores counts double", and the reference sheet "get the nip 1". Built as 1 (the doubling starts after it); the simulator turns the nip on first, so it scores 2. Which?
Y. **A tag in view that doesn't work**: "If it works, that's the extra Cred". Built as the simulator: a roll that doesn't work leaves no tag at all (the same for getting into the catnip on purpose in view: a Flop misses it). Or does the tag go on without the bonus?
Z. **The catnip on purpose, in view**: "+1 Broom if a human sees" is said of giving in. Built: on purpose the roll carries its own Mood step and there's no extra Broom.
AA. **Nobody scored**: built as no Cat's Whiskers that night. A pinched cat can still be the Cat's Whiskers (Cred never changes the outcome).
AB. **"A night with 5 or more Cred"**: built as the gang's total, as the simulator adds it up.
AC. **Tagging while carrying the prize**: the book doesn't forbid it, so it's allowed (the simulator's gang never tries).
AD. **The zoomies outside**: a cat that left the house during the house part keeps the zoomies until the getaway starts (its rolls to get back in are noisy, in the room they lead to).

### The playtest fix round (core rules v0.9; simulator package P14)
The two real-dice playtests (Number 12 and Chef Marchetti's, 2026-10-21) changed the getaway and Cred and settled a few house rulings (book/REVIEW.md rows 149–152; the simulator's `wardenLag` 2, `wardenNoPass`, `dodgeStun`, `mouthFull`, `seenTagNoMess`, `zoomiesTagRoll`: package P14, now adopted). Decisions above that these change are superseded where they differ. Tests: `test/p14.test.mjs` (the house rulings), `test/getaway.test.mjs` and `test/cred.test.mjs` (rewritten for P14), the smoke tests.

76. **The warden's van** pulls up on the garden at the end of round 2 if anyone was Shooed or Scooped tonight, else round 3 (`R.wardenLag` 2; `arrives` is `wardenLag`, or `wardenLag` + 1). (Supersedes 59's rounds 1 and 2.)
77. **He never passes a cat**: after his move (1 space, 2 if any getaway roll ended in a Flop that round — a Flop a Push saved doesn't count), he stops on the rearmost running cat's space; so only cats on his space are cornered. The card says "(he can't get past a cat)" when that holds him back.
78. **A dodge that works** leaves the cat where it is ("the net swishes past") and sends him sprawling into the hedge: at the next **End the getaway round** he doesn't move (`getaway.stunned`). A cat still on his space then is cornered again. A Flop is pinched, loot and all. (Supersedes 59's "onto the space just ahead"; question W no longer arises.)
79. **The loot die is the group's** (question T settled): a group loses 1 die if any cat in it carries loot (a Chonky cat with one piece doesn't count). The leader's own load is in the option's Difficulty as before; when the leader runs free but a ticked helper is loaded, the roll dialog adds the die (each helper is listed "carrying loot: the group loses a die").
80. **Mouth full**: a cat carrying loot can't be Sweet — the obstacle's Sweet option and the dodge's Sweet are left off for it ("Sneaky or Savage: no Sweet with your mouth full"); if an obstacle had nothing but Sweet, it would stay.
81. **A cat may wait**: **Wait here this round** (`gwait`) is its go. The outcome is counted against the whole prize (all its portions or pieces; at least half, rounding up, for Messy), as before.
82. **Tags** (Cred): an unseen tag is no roll, no noise, and a mess; a tag made in view is a roll (+1 if it works, a Sneaky Clean too) and **not a mess** — they saw it go on. With the zoomies every tag is a roll, seen or not (the option is a roll whenever the cat has the zoomies; unseen it's still a mess, and, like every roll with the zoomies, a noise). (Supersedes 67's "a tag is a mess" for a tag in view.)
83. **The catnip's own point isn't doubled** (question X settled as built); the zoomies end when the getaway starts, even for a cat already outside (question AD settled as built); the stash stays the Storyteller's one temptation a round and tempts nobody once had; the rivals' point goes to each group's leader (as built).
84. **Rep for Cred** needs the **gang's** Cred to add up to **8** or more on a night that wasn't Busted (question AB settled; `R.cred.repNight` 8). The outcome card and its Rep button follow.
85. **Walking into the Den isn't being shut in**: only a cat a human shuts in is Shut In (as built: a cat that walks into the Den is free and its door stays open).
86. **A Scrapper facing a pet** can be tempted by that pet (and nothing else) — "Pudding, right there" — though it hasn't dealt with it: giving in, it squares up ("That isn't dealing with it: you still have to"), a noise, +1 Broom in view, and it's chased back at the end of its turn like any cat that didn't deal with the pet. Any other cat facing a pet still can't be tempted. (Question I settled.)
87. **Charge with no Action left** includes giving in: a cat that walks into an awake dog's room after its Action is used (it gave in, or did something else first) stays and deals with the dog first thing next turn, as one that climbed in (`arrivedSpent` on the Move).
88. **A dog that walks into the cats' room** on its routine barks from next turn (as built: the bark comes before the routine); **a driven-off pet** comes back in the room it started in (as built).
89. **After a Shoo! through a cat flap** the flap is locked ("locks it"): opening it again from inside is Streetwise, Hard, as any shut entrance.
90. **The human carrying the prize** answers noise and follows their routine, prize and all, until the Clock first puts it down (as built).
91. **Number 12** follows the catalog: the catnip cushion on Mr Pell's armchair (living room), the Bin Lid Boys' tag in the kitchen.

### Questions for the designer (the fix round)
AE. **Rep for Cred: 5 or 8?** The brief and the core rules summary say the gang's Cred must add up to 8; the book's Chapter 9 ("a night with 5 or more Cred that wasn't Busted") and Chapter 14 ("5 or more Cred") still say 5. Built as 8.
AF. **The warden's move after a dodge's Flop**: "2 if any cat's roll ended in a Flop" — built as the simulator: only obstacle rolls count (question V).
AG. **The Charge exception** (decision 87) reads "no Action left" literally: any cat that used its Action before walking into the dog's room stays. The Scrapper that squares up to the pet it's already facing is chased back (decision 86), as the brief says.

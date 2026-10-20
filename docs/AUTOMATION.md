# Cat Burglars — Foundry automation design

> **Goal:** players and the Storyteller never track rules by hand (CLAUDE.md). The system does the bookkeeping; where the rules need a human choice (which cat to tempt, how to narrate), the Storyteller gets **one click with a rules-correct default**.

Rules source: the rulebook (`book/src/chapters/`), currently summarised in `docs/CORE-RULES.md` v0.8. The simulator's rules (`sim/rules.mjs`) are a separate copy; a parity test keeps `module/logic/` and the simulator agreeing on the adopted package. Copied patterns from *Heisty Spideys* (`docs/reference/heisty-automation-design.md`) are noted as such.

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

## Implementation notes

*Added while building the system (0.5.0, core rules v0.7, simulator package P9 with its `tableRules`); updated for core rules v0.8 (simulator package P10 with its `holdRules`; book/REVIEW.md rows 71–93), decisions 24–33. Where §1–10 and this section differ, this section says what was built.*

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
| Tests | `test/{rules,mood,round,actions,replay,parity,contracts,packs,v07,v08}.test.mjs` (`v08`: one test per v0.8 ruling), `test/robbery.smoke.test.mjs` (fake Foundry, GM + two players), `test/smoke.test.mjs` |

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
10. **Cattitude lives on the actor.** The player's client spends it (the Cattitude die, a Push); the GM's client writes gains and resisting (temptation, Purrfect) and resets it at the start of a robbery (2, or 3 in a gang of three). `autoCattitude` off makes all of it advice only.
11. **Gang size.** 1–3 cats use the three-cat scaling (REVIEW #76: a gang of one or two plays as three), 5+ the five-cat scaling. Only the Gone round moves, and Lights Out with it (REVIEW #90): the Prize Clock's put-down rounds stay as printed.
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

### Questions for the designer (v0.8)
A. **A Shoo! and noise.** "The human stays in that room": built as no routine and no Searching step that round, but a noise can still draw them — only the Prize Clock's hold says "answers no noise". Should the Shoo!'s stay beat noise too?
B. **Chased out mid-turn.** A cat Shooed (or chased back outside by a dog) during its turn can't come back in that turn: built as "going out" for REVIEW #88. Otherwise a cat Shooed before its Move could walk straight back in through another open entrance. Confirm.
C. **A meter made full by a Patience drop.** After a Shoo! or Scoop, Patience −1 can leave the other meter at Patience (say Cuddle 3 when Patience drops to 3). Built: that meter is full and waits like any other, so it goes off at once if a human with free hands can see a cat. The simulator only triggers on the next step on that side. Confirm, or should the other meter drop to one short of full?
D. **A meter filled where nobody sees a cat.** A mess found in an empty room fills Broom: built as the literal "it stays full until one can", so it goes off at once on a cat that another human with free hands can see, anywhere in the house. Or should only the human who filled it act (when they next see a cat)?
E. **Helping while a dog is in the way.** A cat a dog or house cat is stopping can help only the roll that deals with that pet (Chapter 10, "before doing anything else"). Built so (decision 8); confirm, since it also keeps a cat beside the dog from helping a haul out of that room.
F. **The parrot and held cats.** Built as the simulator: the parrot squawks for free cats it saw, so a cat held in its room doesn't count. Should a held (or shut-in) cat set it off?
G. **The holder's 6.** Shoo! now uses the nearest entrance that works this round; the holder's 6 still uses the nearest entrance of all (Chapter 9 just says "the nearest entrance"), so a holder can put a cat out of the front door outside its rounds. Same rule for both?
H. **Distracting with a hidden cat** (the rest of old question 10): a hidden cat can Distract a human in its room (the roll brings it out of hiding). Confirm.

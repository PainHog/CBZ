# Verification playtest: The Okafors' Big Box (Standard), core rules v0.5, real dice

*2026-10-20. One Storyteller and four players, all played by one agent, strictly by `docs/CORE-RULES.md` v0.5. The house sheet is the `okafor-box` entry in `sim/houses.mjs`. Rulings in `book/REVIEW.md` were read for intent only. Every die came from Node's `crypto.randomInt`, one logged command per roll; all 44 are in the Dice appendix.*

## Summary

- **Outcome: Clean Getaway in round 7, with no cat rolls at all.** Three cats carried the box out through the garage side door, and the fourth walked out of the dog door in full view of both humans. Nobody was Shooed, Scooped, Held or shut in. End state: Broom 4/6, Cuddle 1/6, Patience 6. The box would have been gone at the start of round 11.
- **v0.5 did not stop the waiting line on its own.** Waiting now costs Mood: Broom went from 0 to 4 with no rolls (a Foodie giving in where Tayo could see, one deliberate lure, Tayo walking in on the box, and the owner finding it gone). It still never cost a roll. Searching started twice, but the gang steered it: the carriers **hid holding the box**, and one cat **sat in view** as a decoy. Both Searching humans walked away from the box's route, every time and for free.
- **What-if branch B (carriers can't hide): Clean Getaway in round 6, with one cat roll.** This is not the result of the playtest. Joe distracted Searching Tayo (3 dice, Clean, +2 Cuddle because Tayo is a kid), and the carriers slipped past. End state: Broom 4/6, Cuddle 3/6.
- **Rolls:** 0 cat rolls in the main line and 1 in branch B. The Storyteller rolled 11 times in the main line (6 routines, 5 temptation picks) and 3 times in branch B. Making the gang took 29 rolls. That is 44 roll commands in all.
- **Cat-turns:** 28 in the main line (4 cats × 7 rounds). 0 had a roll, 22 had a no-roll Move or Action that mattered, and **6 were idle** (R2: two cats; R5: all four, one of them Joe sitting in view on purpose as the decoy). Branch B had 8 cat-turns: 1 roll, 0 idle.
- **Issues: 20** (0 blockers, 5 major, 15 minor).
- **The 27 earlier issues** (table below):
  - 16 are fixed.
  - 9 are fixed but leave something open. Seven of those leftovers came up in this game: I-03, I-05, I-10, I-14, I-15, I-22 and I-23.
  - 2 are still open: I-25 ("moving it past a human") and I-27 (DESIGN vs CORE).

**Top 5 issues**
1. **V-01 (major): may a cat hide while carrying the prize?** Nothing forbids it. I allowed it, and it decided the game: Tayo, Searching in the kitchen, had "no cat in sight" beside three hidden cats holding a Large box, and he left.
2. **V-02 (major): Searching is a free, certain lure.** A Searching human goes to any cat in sight. A cat that only walks or sits in view pays nothing. So one decoy cat moved both Searching humans off the route. Without Searching, Tayo's own routine would have kept him in the kitchen on 3 rolls in 6.
3. **V-03 (major): "the human goes to its place instead".** "Its place" could be where the Clock last put the box (the hall) or where it puts it this round (the living room). The rule also doesn't say whether she then stays there that round.
4. **V-04 (major): "walks into the prize's room".** This could be the room the box is in now, or the room where the Clock put it (the simulator's reading). It decided whether Tayo started Searching in round 4.
5. **V-05 (major; earlier issue I-25, still open): "Moving it past a human is a roll".** The rule still doesn't say which approach is used, what "past" means, or whether a Distracted or hidden carrier counts. It's the central obstacle of this house, and both lines avoided it.

**Dominant line now:** come in by the dog door. Lure the owner out of the hall with one noise at least two rooms from the dog. Grab the box when the hall is empty. When someone starts Searching, keep the carriers hidden and park one cat in view on the far side. Then walk the box out.

## Gang

Gang of 4, so no gang-size scaling: Patience 6, Prize Clock as printed (moved in R5, gone at the start of R11, Lights Out at the end of R13).

Method: the random tables in rulebook Chapter 2 (`book/src/chapters/12-ch02-your-cat.html`), which CORE-RULES points to.
- **Name:** a d6 on each column.
- **The 3:** a d6 (1 Sneaky, 2 Sweet, 3 Savage, 4 Streetwise, 5–6 "your choice"). For a random gang I rerolled 5–6 (V-18).
- **The 2:** a d6 on the same table, rerolling the approach that already has the 3, and 5–6. The other two approaches get 1.
- **Instincts:** 2d8, rerolling duplicates.
- **Body:** a d6, 1–3 Lean, 4–6 Chonky.
- Coats, marks and quirks are cosmetic and were skipped.

| Cat | Body | Sneaky | Sweet | Savage | Streetwise | Instincts (knack tags) | Cattitude | Lives | Dice (appendix #) |
|---|---|---|---|---|---|---|---|---|---|
| **Tilly** (Two-Bin Tilly) | Lean | 1 | 1 | **3** | 2 | Lap Cat (charm), Curious (open) | 2 | 9 | #1–5 |
| **Mags** (Lamppost Mags) | Lean | 1 | 2 | 1 | **3** | Curious (open), Hunter (chase/fight) | 2 | 9 | #6–11 |
| **Joe** (Midnight Joe) | Lean | **3** | 2 | 1 | 1 | Scrapper (fight), Lap Cat (charm) | 2 | 9 | #12–22 |
| **Sully** (Lamppost Sully) | Lean | **3** | 2 | 1 | 1 | Foodie (food), Climber (climb) | 2 | 9 | #23–29 |

Notes:
- Sully rolled "Lamppost Joe". The gang already had a Joe, so his player picked "Sully" from the same column, which Chapter 2 allows.
- **All four cats are Lean** (a 1-in-16 chance). A Large box needs "three cats, or two with a Chonky", so it takes three carriers here, which leaves exactly one cat free to help.

Where each cat is tempted:
- Kitchen: Tilly and Mags (Curious), Sully (Foodie).
- Living room: Tilly and Joe (Lap Cat), Mags (Hunter).
- Garage: Mags (Hunter), Sully (Climber).
- Landing: Sully (Climber).
- No room tempts a Box Sitter or Knocker in this gang, and no room anywhere lists Scrapper (V-14).

## Play log

### Before round 1: the house as the players see it
- **Rooms and ways:**
  - Hall–Living (Big), Hall–Kitchen (Big), Kitchen–Garage (Big).
  - Hall–Landing (Normal).
  - Landing–Bathroom (Big), Landing–Tayo's room (Big). Tayo's room is the Den.
  - No closed doors.
- **Prize:** a **Large** box with no steps.
  - The Clock puts it in the hall in round 1 (Mrs Okafor) and moves it to the living room in round 5 (Mrs Okafor).
  - It is gone at the start of round 11, and Lights Out is at the end of round 13.
  - It needs Big ways, and the front door works only in round 1. So its only way out is hall → kitchen → garage → garage side door (Big, ajar, no roll).
- **Entrances:**
  - Front door: one cat, round 1, Sneaky Hard or Sweet, in view of Mrs Okafor.
  - Dog door (kitchen): no roll.
  - Garage side door: no roll.
  - Bathroom window: a Tricky climb, and only a Normal way into the house.
- **Residents:**
  - Mrs Okafor (grown-up, Attention 1) starts in the hall. Routine: 1–3 stay, 4 kitchen, 5–6 living.
  - Tayo (kid, Attention 1) starts in the living room. Routine: 1–2 stay, 3–4 his room, 5 living, 6 kitchen.
  - Noodle (dog, rating 2, soft) is **asleep** in the kitchen. Routine: 1–2 stay, 3 hall, 4 garage, 5 living, 6 sniff.
  - No routine ever names the hall (Mrs Okafor only stays there) or the garage (only Noodle's 4).
- **Players' plan:**
  - All four cats come in by the dog door and hide beside the sleeping dog, one room from the box.
  - Make **no noise in the hall, kitchen or garage**: noise there wakes Noodle.
  - Three carriers: Tilly, Mags, Sully. Joe, the best charmer (Sweet 2 + Lap Cat knack), is the helper.
- **Storyteller policy (fair, not mean):**
  - Tempt whenever a cat is eligible, picking the cat at random by die.
  - Follow routines and Searching exactly.
  - Make each gap ruling once and keep to it.
- **Standing rulings, all logged as issues:**
  - The owner who finds the box gone goes to where the Clock last put it and stays there that round (V-03).
  - "The prize's room" is the room the box is in now (V-04).
  - Carriers may hide (V-01; branch B reverses this).
  - Searching lasts the rest of the robbery (V-06).
  - "A cat in sight" means an unhidden cat. A next room counts if an unhidden cat is in it. A Distracted Searcher follows their routine (V-07).
  - Humans answering noise go straight there (V-12).
  - Carriers keep hold of the box without spending Actions (V-13).
  - A Flop adds Mood only when seen (V-11).

**Start state.** All cats outside, Cattitude 2 each. Broom 0/6, Cuddle 0/6, Patience 6.

---

### Round 1
- *Start:* the Prize Clock puts the box on the hall floor. Mrs Okafor stays in the hall this round.
- *Temptation:* none (every cat is outside).
- *Cats:* all four come in through the dog door (their Move, no roll). The kitchen holds only the sleeping Noodle, so each one **hides** unseen (its Action).
- *House:*
  - No noise.
  - Mrs Okafor stays (Clock).
  - Tayo rolls **6** and goes to the kitchen. All four cats are hidden, so he sees nobody.
  - Noodle sleeps.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Tilly | Kitchen | hidden | 2 | – |
| Mags | Kitchen | hidden | 2 | – |
| Joe | Kitchen | hidden | 2 | – |
| Sully | Kitchen | hidden | 2 | – |

Mrs Okafor: hall · Tayo: kitchen · Noodle: kitchen (asleep) · **Broom 0/6 · Cuddle 0/6 · Patience 6** · Prize: hall floor (0 steps) · Clock: R5 to the living room, gone R11.

### Round 2
- *Temptation:* the d6 gives **5**: Sully, Foodie, in the kitchen.
  - Tayo is watching. Giving in costs +1 Broom and ends Sully's hiding. Resisting costs 1 Cattitude.
  - Broom 1/6 is cheap, so **Sully gives in** and eats Noodle's kibble: quiet, **+1 Broom (1/6)**, Cattitude 3. He is no longer hidden.
- *Waiting line:* Mrs Okafor is in the hall, so picking the box up there would be three rolls in view. The gang waits.
  - Joe leaves his hiding spot and walks past Tayo into the hall, where he sits in Mrs Okafor's view. Walking and sitting are free. He is the gang's free cat, so he needs to be near the action.
  - Tilly and Mags stay hidden (idle). Sully stays in the kitchen.
- *House:*
  - No noise.
  - Mrs Okafor rolls **4** and goes to the kitchen.
  - Tayo rolls **3** and goes straight to his room, seeing only his room.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Tilly | Kitchen | hidden | 2 | – |
| Mags | Kitchen | hidden | 2 | – |
| Joe | Hall | in view (nobody there now) | 2 | – |
| Sully | Kitchen | in view of Mrs Okafor | 3 | – |

Mrs Okafor: kitchen · Tayo: Tayo's room · Noodle: kitchen (asleep) · **Broom 1/6 · Cuddle 0/6 · Patience 6** · Prize: hall floor, unwatched · Clock: R5 move, gone R11.

### Round 3
- *Temptation:* the d6 gives **6**: Sully, Foodie, again. Mrs Okafor is in the kitchen. Giving in would cost his Action, and he must pick up this round, so **Sully resists** (3→2).
- *Cats:*
  - **Tilly, Mags and Sully** walk out of the kitchen past Mrs Okafor (free) into the empty hall. Each **picks up** the box (its Action, unseen). That is three Lean carriers for a Large box.
  - **Joe** walks into the empty living room and **makes a noise** on purpose: he drags a cushion off the sofa and yowls. A noise in the living room is two rooms from Noodle, so the dog stays asleep.
- *House:*
  - **Noise in the living room.** Mrs Okafor in the kitchen is 2 rooms away. Tayo in his room is 3 rooms away, out of range. So Mrs Okafor comes. She goes straight there (V-12), so she doesn't see the carriers in the hall. She finds the mess: **+1 Broom (2/6)**. She stays there.
  - Tayo rolls **5** and goes to the living room. Joe is in view of both humans.
  - Noodle sleeps.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Tilly | Hall | free | 2 | box (with Mags, Sully) |
| Mags | Hall | free | 2 | box |
| Joe | Living room | in view of Mrs Okafor and Tayo | 2 | – |
| Sully | Hall | free | 2 | box |

Mrs Okafor: living · Tayo: living · Noodle: kitchen (asleep) · **Broom 2/6 · Cuddle 0/6 · Patience 6** · Prize: carried in the hall (disturbed) · Clock: R5 move, gone R11.

### Round 4
- *Temptation:* only Joe is eligible (Lap Cat, living room), so no roll is needed.
  - Lap Cat's give-in is a free Distract, so **Joe gives in**. He climbs onto Mrs Okafor's lap; his player picks her (V-10).
  - She is **Distracted this round**: **+1 Cuddle (1/6)**, Joe Cattitude 3.
- *Cats:*
  - The carriers take the box from the hall into the empty kitchen (their Moves; no human sees them).
  - Each carrier **hides** (its Action, unseen). Nothing in the rules forbids hiding while holding the box (V-01, V-13).
  - Joe walks from the living room to the hall (his Move).
- *House:*
  - No noise.
  - Mrs Okafor rolls **6** (living room, so she stays).
  - **Tayo rolls 6 and goes to the kitchen, right onto the box.** He walks into the prize's room and finds it disturbed (V-04): **+1 Broom (3/6)**, and **Tayo starts Searching**. The carriers are hidden.
  - Noodle sleeps.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Tilly | Kitchen | hidden | 2 | box |
| Mags | Kitchen | hidden | 2 | box |
| Joe | Hall | free (nobody there) | 3 | – |
| Sully | Kitchen | hidden | 2 | box |

Mrs Okafor: living · Tayo: kitchen, **Searching** · Noodle: kitchen (asleep) · **Broom 3/6 · Cuddle 1/6 · Patience 6** · Prize: carried in the kitchen · Clock: R5 move, gone R11.

### Round 5
- *Start:* the Prize Clock says "living room, by Mrs Okafor", but the cats have the box.
  - She goes to its place. I read that as the hall, where the Clock last put it (V-03).
  - She finds it gone: **+1 Broom (4/6)**. She **starts Searching** and stays in the hall this round. Joe is there in view.
- *Temptation:* the d6 gives **5**: Sully, Foodie, in view of Tayo.
  - Giving in would put Broom at 5/6 and unhide him, which would keep Searching Tayo in the kitchen. **Sully resists** (2→1).
- *Choice:*
  - Tayo is in the kitchen with the carriers. Moving the box past him is a roll (V-05): Sully would lead on Sneaky with 4 dice.
  - Joe could walk in and distract him (3 dice, kid-doubled Cuddle).
  - Or the gang can let Searching work for them. Tayo can't see the hidden carriers, and Joe is in view next door. **The gang waits.**
- *Cats:* the carriers stay hidden (idle). Joe sits in the hall in view of Mrs Okafor (the decoy).
- *House:* no noise, and no dice at all.
  - **Tayo (Searching)** has no cat in sight in the kitchen. The next room with one is the hall, where Joe is, so **he steps into the hall**.
  - Mrs Okafor stays (the Clock; she also has Joe in sight).
  - Noodle sleeps.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Tilly | Kitchen | hidden | 2 | box |
| Mags | Kitchen | hidden | 2 | box |
| Joe | Hall | in view of both | 3 | – |
| Sully | Kitchen | hidden | 1 | box |

Mrs Okafor: hall, **Searching** · Tayo: hall, **Searching** · Noodle: kitchen (asleep) · **Broom 4/6 · Cuddle 1/6 · Patience 6** · Prize: carried in the kitchen · Clock: gone R11.

### Round 6
- *Temptation:* the d6 gives **3**: Mags, Curious, in the kitchen, unseen. A rummage is noise in Noodle's room, so **Mags resists** (2→1).
- *Cats:*
  - The carriers take the box from the kitchen into the garage (their Moves; nobody sees them) and **hide** again.
  - Joe walks out of the hall into the kitchen (free) and stays in view there.
- *House:* no noise, and again no dice.
  - Both Searching humans have no cat in sight in the hall.
  - The next room with a cat in sight is the kitchen, where Joe is. The garage isn't next to the hall. So **both step into the kitchen**.
  - Noodle sleeps.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Tilly | Garage | hidden | 2 | box |
| Mags | Garage | hidden | 1 | box |
| Joe | Kitchen | in view of both | 3 | – |
| Sully | Garage | hidden | 1 | box |

Mrs Okafor: kitchen, Searching · Tayo: kitchen, Searching · Noodle: kitchen (asleep) · **Broom 4/6 · Cuddle 1/6 · Patience 6** · Prize: carried in the garage · Clock: gone R11.

### Round 7
- *Temptation:* the d6 gives **3**: Mags, Hunter, in the garage.
  - Cattitude is lost at the end, so resisting costs nothing real.
  - The rules don't say whether a carrier who gives in keeps hold of the box (V-09). So **Mags resists** (1→0).
- *Cats:*
  - The carriers take the box out through the garage side door (Big, ajar, no roll). **The prize is outside.**
  - Joe walks out of the dog door in front of Mrs Okafor and Tayo. That's his Move; the entrance names no approach, and walking in view is free.
- No free cat is left inside, so the robbery ends.

**Result: Clean Getaway, round 7.** Prize got, nobody left behind, no cat rolls. Final Cattitude: Tilly 2, Mags 0, Sully 1, Joe 3. Broom 4/6, Cuddle 1/6, Patience 6.

---

### What-if branch B: carriers can't hide (not the result of this playtest)
**Ruling for this branch:** a cat holding the prize is never in a hiding spot.
- The branch starts at the end of round 4. Everything is the same, except the three carriers are in sight when Tayo walks in. He still finds the box disturbed (+1 Broom, 3/6) and starts Searching.
- Fresh dice are used from here on.

**B, round 5.**
- *Start:* as in the main line. Mrs Okafor goes to the hall, finds the box gone (**+1 Broom, 4/6**), starts Searching and stays this round.
- *Temptation:* the d6 gives **3**: Mags, Curious, in view of Tayo. A rummage would cost +1 Broom and make noise in the dog's room, so **Mags resists** (2→1).
- *Cats:*
  - Tayo is Searching with the carriers in sight. If they wait, he stays; if they move, he follows them into the garage. So the gang must act.
  - **Joe** walks into the kitchen and **distracts Tayo**. Pool: Sweet 2 + Knack 1 (Lap Cat) + 1 Cattitude (3→2) = 4, minus Attention 1 = **3 dice**. Tayo has never been distracted, so there's no repeat penalty.
  - Roll: **2, 1, 6 → Clean.** Tayo is Distracted, and there's no noise. Cuddle +1, doubled because a kid saw the roll: **Cuddle 3/6**.
  - The carriers take the box into the garage, seen by nobody.
- *House:*
  - No noise.
  - Tayo is Distracted, so he can't sight a cat, and he follows his routine (V-07). He rolls **2**: he stays in the kitchen.
  - Mrs Okafor stays (the Clock).
  - Noodle sleeps.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Tilly | Garage | in sight (nobody there) | 2 | box |
| Mags | Garage | in sight (nobody there) | 1 | box |
| Joe | Kitchen | in view of Tayo | 2 | – |
| Sully | Garage | in sight (nobody there) | 2 | box |

Mrs Okafor: hall, Searching · Tayo: kitchen, Searching · Noodle: kitchen (asleep) · **Broom 4/6 · Cuddle 3/6 · Patience 6** · Prize: carried in the garage.

**B, round 6.**
- *Temptation:* the d6 gives **5**: Sully, Climber, in the garage. He **resists** (2→1), for the same reason as Mags in the main line's round 7.
- *Cats:* the carriers take the box out through the garage side door. Joe walks out of the dog door in Tayo's view.
- **Branch result: Clean Getaway, round 6, with 1 cat roll (Clean).** Broom 4/6, Cuddle 3/6, Patience 6.
- If Joe had flopped, he would have added 2 to Broom (filling it to 6/6), Tayo would have Shooed him out of the dog door and shut it, and Patience would have dropped to 5. The carriers would then have had to move the box past Tayo themselves: a Sneaky roll led by Sully, with 4 dice.

## Issues

Quotes are from `docs/CORE-RULES.md` v0.5 (bold markers dropped) or from the `okafor-box` sheet. **Played** says what I did. The suggested fix is one sentence of proposed rules text.

| ID | Sev | Passage | Played | Suggested fix |
|---|---|---|---|---|
| V-01 | major | "…and you're not in a hiding spot (every room has them unless the house says not; moving or doing anything else ends hiding)." "Carriers each pick the prize up as their Action and move together as their Moves." | Nothing forbids hiding while holding the box, so I allowed it (R4, R6). Searching Tayo had "no cat in sight" beside three cats holding a Large box, and he walked away (R5). **This decided the game.** Branch B (carriers can't hide) needed one Sweet roll and +2 Cuddle. | "A cat holding the prize can't hide, and a Searching human always sees the prize and its carriers in their room." |
| V-02 | major | "Searching humans skip their routine: they stay in a room with a cat in sight, or step into a next room with one (the carriers first), or else follow their routine." "Walking, sitting and washing in view are free." | Joe sat in view in the hall (R5) and then the kitchen (R6). Both Searching humans followed him off the box's route, with certainty and at no cost: in those rounds the house rolled no dice. Without Searching, Tayo's routine would have kept him in the kitchen on 3 rolls in 6. Searching made the gang's position **better**. | "A Searching human goes first toward the prize (its room, or the next room if it's there) and only then toward other cats, and each round they end with a cat in sight adds +1 Broom." |
| V-03 | major | "Start: the Prize Clock acts: the human puts the prize in its place and stays in that room this round. If the cats already have it, the human goes to its place instead, finds it gone (+1 Broom), and starts Searching." | "Its place" could mean this round's place (the living room) or where the Clock last put the box (the hall). I took the hall, because "finds it gone" only makes sense there. I also had her stay there that round, like the first sentence. The rule also doesn't say what "have it" means if the cats have dropped the box in another room. In this game, both readings ended with her in the hall by the end of R5. | "If the prize isn't where the Clock last put it, that human goes there, finds it gone (+1 Broom), stays there this round and starts Searching." |
| V-04 | major | "…each time a human walks into the prize's room and finds it disturbed (a step done, a portion gone, or the prize not where the Clock last put it)." | I took "the prize's room" to be the room the box is in now. In R4 Tayo walked into the kitchen onto the carriers: +1 Broom, and he started Searching. The simulator uses the room where the Clock put it (`spotRoom`). Under that reading Tayo notices nothing in R4, and R5 plays differently: no Searching, and Tayo blocks the kitchen on 3 rolls in 6. | "…walks into the room the prize is in, or the room where the Clock last put it, and finds it disturbed." |
| V-05 | major | "Moving it past a human is a roll (one leader, helpers add dice)." | Unchanged since v0.3 (earlier issue I-25). The rule gives no approach, doesn't define "past", and doesn't say whether it is the leader's Action when the carriers have already spent theirs, or whether Distracted or hidden carriers count. Both lines avoided it: hiding in the main line, a Distract in branch B. My ruling, ready if needed: moving the box out of or into a room where an awake, undistracted human sees it; Sneaky (unnoticed) or Savage; the leader's Action. | "Carrying the prize out of or into a room where a human sees it takes the leader's Action and a roll (Sneaky unnoticed or Savage; each other carrier adds a die)." |
| V-06 | minor | "A human who finds it disturbed starts Searching." | No end condition is given, so Searching lasted the rest of the robbery. It didn't matter here because the game ended in R7. In a long robbery, two permanent Searching humans would trail the gang for good. | "A human stops Searching when the prize is outside or eaten, or at the end of a round with no cat in sight or next door." |
| V-07 | minor | "…step into a next room with one (the carriers first)…" against "(straight there this round; they see only that room)". "A Distracted human sees nothing." | "One" means an unhidden cat in the next room: the human hears or glimpses it. Hidden cats don't count. A Distracted Searching human can't sight anyone, so they follow their routine (B-R5: Tayo rolled 2 and stayed). | "A Searching human notices cats that aren't hidden in their room and the next rooms; a Distracted one follows their routine." |
| V-08 | minor | "…each time a human walks into the prize's room and finds it disturbed…" | Not triggered. A human already in the room when the prize is disturbed (for example, Distracted while the cats pick it up) never "walks in". So they never add Broom or start Searching, even while staring at the carriers next round. | "…a human who walks into the prize's room, or is in it when it's disturbed, finds it disturbed…" |
| V-09 | minor | "Give in (+1 Cattitude; the instinct thing is your Action, done first, there)…" | This is left over from earlier issue I-05. The rule doesn't say whether a carrier keeps hold of the box while it chases, goes up high or eats. Both times a carrier was tempted on the last round (R7, B-R6), the players resisted rather than risk dropping a box that needs all three of them. | "A carrier who gives in lets go of the prize first." |
| V-10 | minor | "Lap Cat goes for a fuss (a human there is Distracted this round, +1 Cuddle; nobody there: a sunny spot)." | With two humans in the room (R4), the rule doesn't say who picks which one; I let the cat's player pick. +1 Cuddle, not doubled, because giving in isn't a roll. It is a free Distract: the only temptation that is purely good for the gang. | "The cat's player picks the human; a kid doubles the Cuddle step." |
| V-11 | minor | "A roll a human sees adds steps: … A Flop adds 2 to the fuller meter (its own if level). One roll, one change." | The Flop sentence stands alone, so it could also cover unseen rolls. I applied it to seen rolls only. Not triggered: the only cat roll was seen and Clean. | "A Flop a human sees adds 2 to the fuller meter." |
| V-12 | minor | "noise … each draws the closest awake human within 2 rooms … A human who answered a noise stays there." "Straight there … see only that room" is written for routines only. | This is left over from earlier issue I-14. I had noise-answerers go straight there as well. In R3 Mrs Okafor crossed the hall, where the carriers held the box, without seeing it. If she had seen it, that would have been +1 Broom and Searching in R3. | "Humans answering a noise also go straight there and see only that room." |
| V-13 | minor | "Carriers each pick the prize up as their Action and move together as their Moves." | Once the carriers picked the box up (R3), they kept hold without spending an Action, which freed their Actions to hide (R4, R6). If holding cost the Action every round, V-01 couldn't happen. | "Carriers keep hold until they let go, are Shooed or are Scooped; holding takes no Action." |
| V-14 | minor | "The Storyteller may tempt one cat whose room has one of its instincts' temptations." "Scrapper squares up (noise; a dog there turns angry)." | No room on any house sheet lists Scrapper. Chapter 2 says a Scrapper can't resist "an animal that hisses, barks or stares", but CORE never ties that to pets. Joe was never Scrapper-tempted (Noodle slept). | "Every room with an awake pet also tempts Scrappers." |
| V-15 | minor (latent) | "A sleeping dog does nothing until there's noise in its room or next door. An awake dog barks (noise) at the end of any round a cat is in its room…" The house order is noise first, then routines. | Not triggered: Noodle slept all game. The rules don't say whether a dog woken in the House phase rolls its routine that round, or whether its end-of-round bark draws humans that round or the next. They don't say where "drives it off for 3 rounds" sends it, or whether it ever sleeps again. | "A dog woken by noise rolls its routine that round, then barks if a cat is in its room, and that bark draws a human at once." |
| V-16 | minor (latent) | "…the human puts the prize in its place and stays in that room this round." against "A human who answered a noise stays there." | Not triggered. In a Clock round (R1, R5), a noise within 2 rooms of the owner gives two rules telling her to stay in two different rooms. I would keep the Clock's. | "The human the Prize Clock moves this round doesn't answer noise." |
| V-17 | minor | Sheet: "Front door (behind the courier)". Rules: "Sneaky past the human, or Sweet (they let you in), in view of that human." | This is left over from earlier issue I-21. The courier isn't a resident, so I would roll against Mrs Okafor (Attention 1), who is in the hall. Unused: the box can't leave by the front door after round 1, and a single cat in the hall achieves nothing. | Rename the entrance "Front door (behind Mrs Okafor)". |
| V-18 | minor | CORE: "(random tables: rulebook Chapter 2)". Chapter 2: "roll a d6 for the approach that gets the 3: 1 Sneaky, 2 Sweet, 3 Savage, 4 Streetwise, 5–6 your choice." | This is left over from earlier issue I-22. "Your choice" isn't random, so I rerolled. Rerolling cost a lot: one cat needed 5 rolls for its 2. | "5–6: roll again" (or roll a d4). |
| V-19 | minor (latent) | "The prize is gone at the start of the Clock's last round." | Not reached. The rules don't say what happens if the cats are carrying it inside at that moment. The simulator lets them keep it. | "If the cats are holding the prize when it would go, it stays theirs." |
| V-20 | minor | DESIGN still says a kid "tells a grown-up instead of fetching the broom", and that a helper "shares the consequences". CORE v0.5 has neither. | Earlier issue I-27, still open. I played CORE. | Bring the DESIGN rows in line with CORE, or add the kid rule to CORE. |

### The 27 earlier issues (v0.3 playtest) under v0.5

| Earlier | Status in v0.5 | This game |
|---|---|---|
| I-01 pet routine printed as a list | Fixed: six d6 results, with *stay* and *sniff*. | Not exercised (Noodle slept). |
| I-02 sleeping pets | Fixed. The wake, bark and routine timing in that round is still open: V-15. | Shaped play: the gang kept noise out of 3 rooms. |
| I-03 Clock when the cats have it | Fixed in intent. "Its place" is ambiguous: V-03. | Fired in R5: +1 Broom, Searching. |
| I-04 hidden cats acting | Fixed. New gap: hidden carriers, V-01. | Decided the game. |
| I-05 giving in had no effect | Fixed: each instinct says what it does. Carriers are still open: V-09. | 2 given in, 4 resisted. |
| I-06 several watchers | Ruled: highest Attention only (REVIEW #29). | Not exercised. |
| I-07 noise ties | Fixed. | No ties. |
| I-08 a lured human walks back | Fixed: they stay. | R3 lure worked. |
| I-09 starting outside; entrance cost | Fixed. | Used. |
| I-10 carrying costs | Fixed. Holding across rounds is still open: V-13. | Used. |
| I-11 gone and Lights Out timing | Fixed. | Not reached. |
| I-12 the dog only bit at turn start | Fixed: it confronts on entry. | Not exercised. |
| I-13 shut entrance can't reopen | Fixed. | Not exercised. |
| I-14 seeing on the way | Fixed for routines. Still open for noise-answerers: V-12. | Bit in R3 (my ruling kept Mrs Okafor from seeing the carriers). |
| I-15 "disturbed" undefined | Fixed. "The prize's room" is ambiguous: V-04. | Bit in R4. |
| I-16 Clock after routines | Fixed: the Clock acts at Start. | R1, R5. |
| I-17 no "make a noise" Action | Fixed. | R3. |
| I-18 helpers | Fixed. | Not exercised. |
| I-19 kid sees its own distraction | Fixed. | B-R5 (+2 Cuddle). |
| I-20 which meter a Mood Push uses | Fixed. | Not exercised. |
| I-21 front-door human | Fixed in the rules. The sheet still says courier: V-17. | Unused. |
| I-22 no random cat tables | Fixed in Chapter 2. "5–6 your choice": V-18. | Used. |
| I-23 Cattitude reset | Fixed. It still makes resisting in the last round free (R7, B-R6). | Bit. |
| I-24 the Den had no door | Fixed. | Not exercised. |
| I-25 "moving it past a human" | **Still open:** V-05. | Avoided in both lines. |
| I-26 free cats at Lights Out | Fixed. | Not reached. |
| I-27 DESIGN vs CORE | **Still open:** V-20. | — |

## Feel notes

- **Was waiting still free?**
  - **In Mood, no.** v0.5 put a price on time. Broom climbed 0 → 4 of 6 without a single roll:
    - +1 Sully giving in where Tayo could see
    - +1 the R3 lure
    - +1 Tayo walking in on the box in R4
    - +1 the owner finding it gone in R5
  - **In rolls and risk, yes.** With Patience 6 and a meter that only empties on a Shoo!, 4 of 6 was never a threat. The gang also had time to spare: the box goes in round 11, and they finished in 7.
  - **Waiting is still the best play.** In R5 the gang could have rolled (distract Tayo, as in branch B) and finished a round sooner. Instead they waited a round for free, and that won with no rolls.
- **Rolls versus idle turns:**
  - Main line: 0 cat rolls in 28 cat-turns. 6 were idle, and 22 were no-roll Moves and Actions: enter, hide, pick up, carry, one lure, one fuss, walk out. The Storyteller rolled 11 times.
  - Branch B: 1 cat roll in 8 cat-turns.
  - Across both lines: Pushes 0, Cattitude dice 1, Flops 0, Scrapes 0, Cleans 1, Purrfects 0. Shoo!, Scooped!, Held, the Den, wriggling free, the dog rules, the front door and Lights Out never came up.
- **Did Searching create interesting choices? Yes, but they ran the wrong way.**
  - **Hiding finally mattered.** In the v0.3 run it never did.
  - **The gang split 3 + 1, and the fourth cat had a real job every round:** a lure (R3), a lap fuss (R4), the decoy (R5–R6).
  - **But Searching is steerable.** It is fully determined by which cats can be seen, it can't see hidden cats, and a cat it sees pays nothing unless it acts. So it became the gang's tool, not the house's.
  - The worst Storyteller die of the game was Tayo's 6 in R4, which put him onto the box. Searching turned that into a certain exit for him, where his own routine would have kept him in the kitchen half the time.
  - In both Searching rounds the house rolled **no dice at all**. The players were steering the humans.
- **The dog worked as a threat and never as a rule.**
  - Noodle slept all game, but "noise in its room or next door" shaped every plan:
    - The gang made exactly one noise, two rooms from the kitchen.
    - They resisted the kitchen's Curious temptations.
    - A Scrape anywhere on the route would have woken him, so they avoided rolls on the route.
  - That is good tension, but confronting on entry, driving off, befriending and smelling hidden cats were all untested again.
- **Temptations:**
  - 6 were offered (5 picked by die, 1 automatic). 2 were given in to, 4 resisted.
  - The kitchen tempts 3 of these 4 cats, so waiting there drained Cattitude (Sully 3 → 1, Mags 2 → 0). That is the only cost waiting has besides Mood.
  - Resisting in the last round is free (I-23 and V-09).
  - The Lap Cat fuss is a free Distract for +1 Cuddle, so a Lap Cat near a human you want blind should always give in. That may be fine as the one "good" temptation, but it is the strongest card in this house.
- **Entrances:** the dog door and the garage door are still free, and the gang came in one room from the box with no roll. The front door and the bathroom window went unused, as in v0.3.
- **The all-Lean gang was the most interesting constraint.** Needing three carriers left one free cat, and the robbery became a puzzle about where that cat stands. More of that, and less waiting, would be the fun version.

## Dice appendix

- Every roll came from `crypto.randomInt` through a small logging script, one command per roll, numbered in order.
- Nothing was rolled and thrown away. Rerolls are the ones the creation tables require.
- **Shared scratch folder:** another session was using the same scratch folder. My first two rolls (#1–2) landed in that session's dice log, as its #28 and #29, before I moved to a folder of my own. They are copied here unchanged.
- The raw log calls Sully "Lamppost" (his rolled first bit).
- No roll was needed for the R4 temptation (only Joe was eligible) or for the R5 and R6 house phases (both humans were Searching and had a cat to go to).

| # | Round | Who | Why | Pool | Faces | Result |
|---|---|---|---|---|---|---|
| 1 | Setup | Cat 1 | street name (first bit, name) | 2d6 | 2 1 | Two-Bin Tilly |
| 2 | Setup | Tilly | approach rated 3 | 1d6 | 3 | Savage 3 |
| 3 | Setup | Tilly | approach rated 2 | 1d6 | 4 | Streetwise 2 (Sneaky 1, Sweet 1) |
| 4 | Setup | Tilly | instincts | 2d8 | 5 1 | Lap Cat, Curious |
| 5 | Setup | Tilly | body | 1d6 | 3 | Lean |
| 6 | Setup | Cat 2 | street name | 2d6 | 6 4 | Lamppost Mags |
| 7 | Setup | Mags | approach rated 3 | 1d6 | 6 | reroll (5–6) |
| 8 | Setup | Mags | approach rated 3, reroll | 1d6 | 4 | Streetwise 3 |
| 9 | Setup | Mags | approach rated 2 | 1d6 | 2 | Sweet 2 (Sneaky 1, Savage 1) |
| 10 | Setup | Mags | instincts | 2d8 | 1 4 | Curious, Hunter |
| 11 | Setup | Mags | body | 1d6 | 2 | Lean |
| 12 | Setup | Cat 3 | street name | 2d6 | 5 2 | Midnight Joe |
| 13 | Setup | Joe | approach rated 3 | 1d6 | 1 | Sneaky 3 |
| 14 | Setup | Joe | approach rated 2 | 1d6 | 5 | reroll (5–6) |
| 15 | Setup | Joe | approach rated 2, reroll | 1d6 | 6 | reroll (5–6) |
| 16 | Setup | Joe | approach rated 2, reroll | 1d6 | 1 | reroll (already his 3) |
| 17 | Setup | Joe | approach rated 2, reroll | 1d6 | 6 | reroll (5–6) |
| 18 | Setup | Joe | approach rated 2, reroll | 1d6 | 2 | Sweet 2 (Savage 1, Streetwise 1) |
| 19 | Setup | Joe | instincts | 2d8 | 8 8 | Scrapper; duplicate |
| 20 | Setup | Joe | body | 1d6 | 3 | Lean |
| 21 | Setup | Joe | second instinct, reroll | 1d8 | 8 | duplicate again |
| 22 | Setup | Joe | second instinct, reroll | 1d8 | 5 | Lap Cat |
| 23 | Setup | Cat 4 | street name | 2d6 | 6 2 | Lamppost Joe (renamed Lamppost Sully) |
| 24 | Setup | Sully | approach rated 3 | 1d6 | 5 | reroll (5–6) |
| 25 | Setup | Sully | approach rated 3, reroll | 1d6 | 1 | Sneaky 3 |
| 26 | Setup | Sully | approach rated 2 | 1d6 | 1 | reroll (already his 3) |
| 27 | Setup | Sully | approach rated 2, reroll | 1d6 | 2 | Sweet 2 (Savage 1, Streetwise 1) |
| 28 | Setup | Sully | instincts | 2d8 | 6 7 | Foodie, Climber |
| 29 | Setup | Sully | body | 1d6 | 1 | Lean |
| 30 | R1 house | Tayo | routine from living (1–2 stay, 3–4 his room, 5 living, 6 kitchen) | 1d6 | 6 | → kitchen |
| 31 | R2 start | Storyteller | which cat to tempt (1–2 Tilly Curious, 3–4 Mags Curious, 5–6 Sully Foodie) | 1d6 | 5 | Sully; gives in (+1 Broom, seen) |
| 32 | R2 house | Mrs Okafor | routine from hall (1–3 stay, 4 kitchen, 5–6 living) | 1d6 | 4 | → kitchen |
| 33 | R2 house | Tayo | routine from kitchen | 1d6 | 3 | → Tayo's room |
| 34 | R3 start | Storyteller | which cat to tempt (same table) | 1d6 | 6 | Sully; resists |
| 35 | R3 house | Tayo | routine from Tayo's room | 1d6 | 5 | → living |
| 36 | R4 house | Mrs Okafor | routine from living | 1d6 | 6 | living (stays) |
| 37 | R4 house | Tayo | routine from living | 1d6 | 6 | → kitchen; finds the box disturbed, Searching |
| 38 | R5 start | Storyteller | which cat to tempt (same table) | 1d6 | 5 | Sully; resists |
| 39 | R6 start | Storyteller | which cat to tempt (same table) | 1d6 | 3 | Mags (Curious); resists |
| 40 | R7 start | Storyteller | which cat to tempt (1–3 Mags Hunter, 4–6 Sully Climber) | 1d6 | 3 | Mags; resists |
| 41 | B-R5 start | Storyteller | which cat to tempt (kitchen table) | 1d6 | 3 | Mags (Curious); resists |
| 42 | B-R5 | Joe | Distract Tayo: Sweet 2 + Knack 1 + Cattitude 1 − Attention 1 | 3d6 | 2 1 6 | **Clean**: Tayo Distracted, Cuddle +2 (kid) |
| 43 | B-R5 house | Tayo | routine from kitchen (Distracted, so Searching has no target) | 1d6 | 2 | stay |
| 44 | B-R6 start | Storyteller | which cat to tempt (1–3 Mags Hunter, 4–6 Sully Climber) | 1d6 | 5 | Sully; resists |

Totals:
- Gang creation: 29 rolls (#1–29).
- Main line: 11 Storyteller rolls (#30–40) and 0 cat rolls.
- Branch B: 3 Storyteller rolls and 1 cat roll (#41–44).

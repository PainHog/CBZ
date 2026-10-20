# Playtest: The Okafors' Big Box (Standard), core rules v0.3, real dice

*2026-10-19. One Storyteller and four players, all played by one agent, strictly by `docs/CORE-RULES.md` v0.3. The house sheet is the `okafor-box` entry in `sim/houses.mjs`; its dog is called Noodle. Every die came from a crypto-random command and is listed in the Dice appendix.*

## Summary

- **Outcome (main reading): Clean Getaway in round 6.** The box went out through the garage side door, and every cat got out. No cat was ever Held, Shooed or Shut In.
- **The robbery took no approach rolls at all.** The gang won by walking and waiting. The cats parked the box in the hall, which no routine ever sends a human to. One deliberate noise drew Tayo away, the kitchen emptied on the routine dice, and the cats walked the box through the kitchen and garage. End state: Broom 1/4, Cuddle 0/4, Patience 4.
- **What-if branch B (the other reading of I-03): Clean Getaway in round 10,** the last round before the box was gone. In this branch Mrs Okafor still moves the box to the living room in round 4. The cats needed 2 approach rolls (both Scrapes), and finished with Broom 3/4 and Cuddle 3/4. On the "gone before round 10's cats act" reading of I-11, branch B is **Busted**.
- **Rolls:**
  - Main line: 0 approach rolls and 12 house/Storyteller rolls.
  - Branch B: 2 approach rolls and 15 house/Storyteller rolls.
  - Gang creation: 18 rolls. That makes 47 roll commands in all.
- **Idle turns** (a cat had nothing meaningful to do): 5 of 23 cat-turns in the main line, and 2 of 22 in branch B.
- **Issues found: 27** (2 blockers, 12 major, 13 minor).

**Top 5 issues**
1. **I-03 (major): the rules don't say what the Prize Clock's move does once the cats already have the prize.** This one decided the game. My reading (skip the move) gave a roll-free win in round 6. The other reading turned it into a photo finish in round 10.
2. **I-01 and I-02 (blockers): Noodle can't be run without inventing rules.**
   - The pet's "d6 routine" is printed as a four-room `roam` list, not six results.
   - Sleeping pets (`asleep: true`) have no rules at all.
3. **I-05 (major): giving in to a temptation has no stated effect.** The rules don't say whether it's a roll, whether it makes noise, or whether a carrier drops its load. As written, giving in where no one sees is free Cattitude, and resisting late in the robbery is free too.
4. **I-08 and I-07 (major): luring is a coin flip.**
   - A human who answers noise immediately rolls their routine. In branch B this happened: the lure cost +1 Broom, and Mrs Okafor rolled 4 and walked straight back.
   - Ties for "the closest awake human" aren't covered. Both lures in this game were ties.
5. **I-11 (major): the rules don't say whether "gone at round 10" happens before or after the cats act.** "Lights Out comes 2 rounds after the Prize Clock" has the same problem. It decides branch B outright.

**Dominant line in this house:** stage the box in the hall, wait for the kitchen to empty, then walk it out. It always works if there's time. The hall and garage are never routine destinations, and nothing costs the gang anything while it waits.

## Gang

Gang of 4, so no gang-size scaling: Patience 4, Prize Clock as printed.

Creation method (CORE-RULES gives no random method; see I-22):
- **The 3:** a d6 (reroll 5–6) picks the approach (1 Sneaky, 2 Sweet, 3 Savage, 4 Streetwise). Three dice were rolled at once and the first face from 1–4 was used.
- **The 2:** a d6 picks among the remaining three in printed order (1–2 first, 3–4 second, 5–6 third). The last two approaches get 1.
- **Instincts:** 2d8 in printed order (1 Curious, 2 Knocker, 3 Box Sitter, 4 Hunter, 5 Lap Cat, 6 Foodie, 7 Climber, 8 Scrapper), rerolling duplicates.
- **Body:** d6, 1–3 Lean, 4–6 Chonky.

| Cat | Body | Sneaky | Sweet | Savage | Streetwise | Instincts (knack tags) | Cattitude | Lives | Dice (appendix #) |
|---|---|---|---|---|---|---|---|---|---|
| **Gravy** | Chonky | 2 | **3** | 1 | 1 | Hunter (chase/fight), Curious (open) | 2 | 9 | #1 6,6,**2**→Sweet; #2 1→Sneaky; #3 4,4 dup; #17 1; #4 6 |
| **Velvet** | Lean | 1 | **3** | 2 | 1 | Lap Cat (charm), Box Sitter (hide) | 2 | 9 | #5 **2**→Sweet; #6 4→Savage; #7 5,5 dup; #18 3; #8 3 |
| **Brick** | Chonky | **3** | 1 | 2 | 1 | Hunter (chase/fight), Scrapper (fight) | 2 | 9 | #9 **1**→Sneaky; #10 4→Savage; #11 4,8; #12 5 |
| **Latch** | Lean | 1 | 2 | 1 | **3** | Climber (climb), Hunter (chase/fight) | 2 | 9 | #13 5,**4**→Streetwise; #14 3→Sweet; #15 7,4; #16 3 |

Three of the four cats rolled Hunter. That made the living room (Hunter) and the garage (Hunter, Climber) tempt almost every cat. Two Chonky cats means any pair that includes Gravy or Brick can carry the Large box.

## Play log

### Before round 1: the house as the players see it
- **Rooms and ways:**
  - Hall–Living (Big), Hall–Kitchen (Big), Kitchen–Garage (Big).
  - Hall–Landing (Normal).
  - Landing–Bathroom (Big), Landing–Tayo's room (Big). Tayo's room is the Den.
- **Prize:** a **Large** big delivery box, in Mrs Okafor's arms.
  - The Clock puts it down in the hall in round 1 and moves it to the living room in round 4 (by Mrs Okafor). There are no steps at either spot.
  - It is gone at round 10, and Lights Out is at the end of round 12 (see I-11).
  - A Large prize needs Big ways, so it can't go upstairs.
  - The only Big way out after round 1 is the **garage side door** (Big, ajar, no roll). The front door works only in round 1. So the box's only route is hall → kitchen → garage → out.
- **Entrance choice:**
  - Front door: one cat, round 1, Sneaky Hard or Sweet.
  - Dog door: kitchen, Normal, no roll.
  - Garage door: no roll.
  - Bathroom window: Tricky climb, and only Normal ways inside.
  - The front door gains nothing, because the box isn't put down until round 1's house phase, and carriers who walk into the hall spend their Move doing it. **All four cats take the dog door**, one room from the box.
- **Residents:**
  - Mrs Okafor (grown-up, Attention 1) in the hall. Routine: 1–3 stay, 4 kitchen, 5–6 living.
  - Tayo (kid, Attention 1) in the living room. Routine: 1–2 stay, 3–4 his room, 5 living, 6 kitchen.
  - Noodle (dog, rating 2, soft) asleep in the kitchen.
- **Storyteller policy (fair, not mean):**
  - Tempt every round that some cat is eligible, picking at random by die when more than one is.
  - Follow the routines exactly.
  - Rule on gaps once and keep to that ruling (all rulings are logged as issues).

**Start state.** All cats are outside, Cattitude 2 each. Broom 0/4, Cuddle 0/4, Patience 4.

---

### Round 1
*Temptation:* none (every cat is outside).
*Cats:* all four slip in through the dog door (their Move, no roll; I-09). Noodle snores by his bowl, so the cats are unseen and each one **hides** (a simple Action) in case someone walks in.
*House:*
- No noise.
- Mrs Okafor rolls **4** and walks to the kitchen. Tayo rolls **6** and walks to the kitchen too: a 1-in-36 chance of both humans landing on the cats' room.
- Prize Clock: the box is put down on the hall floor. Mrs Okafor's routine had already taken her away (I-16).

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gravy | Kitchen | hidden | 2 | – |
| Velvet | Kitchen | hidden | 2 | – |
| Brick | Kitchen | hidden | 2 | – |
| Latch | Kitchen | hidden | 2 | – |

Mrs Okafor: kitchen · Tayo: kitchen · Noodle: kitchen (asleep) · **Broom 0/4 · Cuddle 0/4 · Patience 4** · Prize: hall floor (0 steps, unguarded) · Clock: R4 move to living, gone R10.

### Round 2
*Temptation:* only Gravy is eligible (Curious, kitchen). Giving in would be a roll in view: Sneaky 2 + Knack 1 − Attention 2 = 1 die (I-06), risking +2 Broom. **Gravy resists** (Cattitude 2→1).
*Cats:*
- Brick and Latch leave their hiding spots and walk out past both humans (walking in view is free) into the empty hall. Each **picks up** the box: two carriers with a Chonky, unseen (I-10).
- Gravy walks to the hall and hides there, away from the kitchen's Curious temptation.
- Velvet stays hidden in the kitchen as the distraction backup (idle).

*House:* no noise. Mrs Okafor rolls **1** (stays in the kitchen). Tayo rolls **6** (kitchen, so he stays).

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gravy | Hall | hidden | 1 | – |
| Velvet | Kitchen | hidden | 2 | – |
| Brick | Hall | free | 2 | box (with Latch) |
| Latch | Hall | free | 2 | box (with Brick) |

Mrs Okafor: kitchen · Tayo: kitchen · Noodle: kitchen (asleep) · **Broom 0/4 · Cuddle 0/4 · Patience 4** · Prize: carried in the hall · Clock: R4 move, gone R10.

### Round 3
*Temptation:* no cat is in a room that tempts it.
*Plan:* the kitchen is the only Big way to the garage, and both humans are in it. Distracting both would cost about 3 Cuddle (Tayo is a kid), so the gang lures one of them instead.
*Cats:*
- **Gravy** goes up to the landing (Normal way) and knocks a trainer down the stairs on purpose. That's an Action with no roll (I-17).
- Brick and Latch hold the box and wait (idle). Velvet waits hidden (idle).

*House:*
- **Noise** on the landing. Both humans are exactly 2 rooms away, a tie (I-07); the d6 gives **6**, Tayo.
- Tayo comes up and finds the mess: **+1 Broom (1/4)**.
- Routines: Mrs Okafor rolls **5** and goes to the living room. Tayo, on the landing, rolls **1** and stays.
- Both humans walk through the hall, where Brick and Latch are holding the box. I rule that nobody sees on the way (I-14).

The kitchen is empty.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gravy | Landing | free (seen by Tayo) | 1 | – |
| Velvet | Kitchen | hidden | 2 | – |
| Brick | Hall | free | 2 | box |
| Latch | Hall | free | 2 | box |

Mrs Okafor: living · Tayo: landing · Noodle: kitchen (asleep) · **Broom 1/4 · Cuddle 0/4 · Patience 4** · Prize: carried in the hall · Clock: R4 move, gone R10.

### Round 4
*Temptation:* none eligible (the landing tempts Climbers; Gravy isn't one).
*Cats:*
- Brick and Latch carry the box from the hall into the kitchen, unseen (only the sleeping Noodle is there).
- Gravy walks off the landing under Tayo's nose (free), goes to the hall and hides.
- Velvet stays hidden in the kitchen (idle).

*House:*
- No noise. Mrs Okafor rolls **5** (stays in the living room). Tayo rolls **5** and goes to the living room.
- **Prize Clock: "round 4, move to the living room, by Mrs Okafor."** The box isn't at its spot; it's in the cats' paws in the kitchen. **Main reading: the move is skipped (I-03).** Branch B, below, plays the other reading.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gravy | Hall | hidden | 1 | – |
| Velvet | Kitchen | hidden | 2 | – |
| Brick | Kitchen | free | 2 | box |
| Latch | Kitchen | free | 2 | box |

Mrs Okafor: living · Tayo: living · Noodle: kitchen (asleep) · **Broom 1/4 · Cuddle 0/4 · Patience 4** · Prize: carried in the kitchen · Clock: gone R10.

### Round 5
*Temptation:* none eligible (the kitchen tempts Foodie and Curious; Gravy is in the hall).
*Cats:*
- **Velvet** walks out through the dog door. She is the first cat outside.
- Brick and Latch carry the box into the garage.
- Gravy comes down to the kitchen and hides.

*House:* no noise. Mrs Okafor rolls **4** and walks into the kitchen, where Gravy is hidden beside the sleeping dog. Tayo rolls **5** (stays in the living room).

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gravy | Kitchen | hidden | 1 | – |
| Velvet | Outside | out | 2 | – |
| Brick | Garage | free | 2 | box |
| Latch | Garage | free | 2 | box |

Mrs Okafor: kitchen · Tayo: living · Noodle: kitchen (asleep) · **Broom 1/4 · Cuddle 0/4 · Patience 4** · Prize: carried in the garage · Clock: gone R10.

### Round 6
*Temptation:* three cats are eligible:
- Gravy (kitchen, Curious)
- Brick (garage, Hunter)
- Latch (garage, Hunter and Climber)

The d6 gives **3**: Brick, who is carrying the box. Leftover Cattitude is worth nothing after this robbery (I-23), and no rule says whether a carrier who gives in drops its load (I-05), so **Brick resists** (2→1).
*Cats:*
- Brick and Latch carry the box out through the garage side door (Big, ajar, no roll). **The prize is outside.**
- Gravy walks out through the dog door in full view of Mrs Okafor; walking is free.
- No free cat is left inside, so the robbery ends.

**Result: Clean Getaway, round 6.** Prize got, nobody left behind, no approach rolls. Final Cattitude: Gravy 1, Velvet 2, Brick 1, Latch 2. Broom 1/4, Cuddle 0/4, Patience 4.

---

### What-if branch B: the other reading of I-03 (not the result of this playtest)
*Reading:* the Clock's round-4 move happens anyway. Mrs Okafor fetches the box from wherever it is and puts it down in the living room. The branch starts from the end of round 4 above (same dice up to there) and uses fresh dice from then on.

**B, round 4 Prize Clock.**
- Mrs Okafor, in the living room after her routine, goes to fetch the box.
- She walks into the kitchen and finds it disturbed: **+1 Broom (2/4)** (I-15).
- She takes it from Brick and Latch. No rule covers this; I used "the cat drops what it carries" from Shoo!/Scooped!.
- She sets it down in the living room, where she stays with Tayo.

**B, round 5.**
- *Temptation:* none eligible.
- *Cats:*
  - The box is now four Big moves from the garage door: living → hall → kitchen → garage → out.
  - Velvet, Brick and Latch walk to the hall and hide.
  - Gravy stays hidden in the hall (idle).
- *House:* Mrs Okafor rolls **4** (kitchen) and Tayo rolls **6** (kitchen). The box is left alone in the living room.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gravy | Hall | hidden | 1 | – |
| Velvet | Hall | hidden | 2 | – |
| Brick | Hall | hidden | 2 | – |
| Latch | Hall | hidden | 2 | – |

Mrs Okafor: kitchen · Tayo: kitchen · Noodle: kitchen (asleep) · **Broom 2/4 · Cuddle 0/4 · Patience 4** · Prize: living-room floor (0 steps) · Clock: gone R10.

**B, round 6.**
- *Temptation:* only Velvet is eligible (hall, Box Sitter). She **gives in** and curls up in a shoebox: unseen, no roll (I-05), +1 Cattitude (3). That leaves her hidden.
- *Cats:*
  - Brick and Latch walk into the empty living room and **pick up** the box. They can't leave the room with it this round, because they've used their Moves (I-10).
  - Gravy goes to the landing and makes a deliberate noise.
- *House:*
  - Landing noise: another tie at 2 rooms; the d6 gives **3**, Mrs Okafor.
  - She comes up and finds the mess: **+1 Broom (3/4)**.
  - Routines: Mrs Okafor, now on the landing, rolls **4** and walks straight back to the kitchen (I-08). Tayo rolls **1** (stays in the kitchen). The lure gained nothing.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gravy | Landing | free | 1 | – |
| Velvet | Hall | hidden | 3 | – |
| Brick | Living | free | 2 | box |
| Latch | Living | free | 2 | box |

Mrs Okafor: kitchen · Tayo: kitchen · Noodle: kitchen (asleep) · **Broom 3/4 · Cuddle 0/4 · Patience 4** · Prize: carried in the living room · Clock: gone R10.

**B, round 7.**
- *Temptation:* three cats are eligible (Brick and Latch: living, Hunter; Velvet: hall, Box Sitter). The d6 gives **2**: Brick. He **gives in** and swats a moth at the lampshade: unseen, +1 Cattitude (3). He keeps hold of the box, since no rule says otherwise (I-05).
- *Cats:*
  - Brick and Latch carry the box into the hall.
  - Gravy comes down to the hall and hides.
  - Velvet stays hidden (idle).
  - With Broom at 3/4, another lure would fill Broom, so there is none.
- *House:* Mrs Okafor rolls **2** and Tayo rolls **2**; both stay in the kitchen.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gravy | Hall | hidden | 1 | – |
| Velvet | Hall | hidden | 3 | – |
| Brick | Hall | free | 3 | box |
| Latch | Hall | free | 2 | box |

Mrs Okafor: kitchen · Tayo: kitchen · Noodle: kitchen (asleep) · **Broom 3/4 · Cuddle 0/4 · Patience 4** · Prize: carried in the hall · Clock: gone R10.

**B, round 8 (must go now: kitchen in R8, garage in R9, out in R10).**
- *Temptation:* only Velvet is eligible (hall). She **resists** (3→2): she needs her Action.
- *Distraction order:* distract Tayo first, while both humans watch, so the kid's doubling applies to only one roll. Then distract Mrs Okafor once she is the only one watching.
- **Velvet** walks into the kitchen and **distracts Tayo**.
  - Pool: Sweet 3 + Knack 1 (Lap Cat, charm) + 1 Cattitude (→1) = 5, − Attention 2 for both watchers (I-06) = **3 dice**.
  - Roll: **2, 5, 1 → Scrape.** Tayo is distracted, but the roll makes noise.
  - Cuddle +1, doubled because a kid was watching (I-19): **Cuddle 2/4**.
  - No Push: a Flop on the reroll would add 2 to the fuller meter (Broom) and fill it, so she'd be Shooed.
- **Gravy** walks in and **distracts Mrs Okafor**.
  - Pool: Sweet 3 − Attention 1 = **2 dice**. He keeps his last Cattitude for a Push, because a Push paid in Mood would fill Cuddle (I-20).
  - Roll: **5, 2 → Scrape.** She is distracted; noise again.
  - Cuddle +1, not doubled, because a distracted Tayo isn't watching: **Cuddle 3/4**.
- Brick and Latch carry the box into the kitchen, unseen.
- *House:*
  - Two noises in the kitchen; the closest humans are already there.
  - Noise in the sleeping dog's room wakes Noodle (my ruling, I-02).
  - Routines: Mrs Okafor rolls **6** (living room). Tayo rolls **4** (his room). Noodle, now awake, rolls **4** on my invented table (I-01) and goes to the garage, the next room on the route.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gravy | Kitchen | free | 1 | – |
| Velvet | Kitchen | free | 1 | – |
| Brick | Kitchen | free | 3 | box |
| Latch | Kitchen | free | 2 | box |

Mrs Okafor: living · Tayo: Tayo's room · Noodle: garage (awake) · **Broom 3/4 · Cuddle 3/4 · Patience 4** · Prize: carried in the kitchen · Clock: gone R10.

**B, round 9.**
- *Temptation:* only Gravy is eligible (kitchen, Curious). He **gives in** and noses open the cupboard under the sink: unseen, +1 Cattitude (2).
- *Cats:*
  - Velvet and Gravy leave through the dog door.
  - Brick and Latch carry the box into the garage with Noodle. The dog rule only binds "a cat starting its turn with it", so walking in is free (I-12).
- *House:*
  - Noodle barks (my ruling, I-12), but no human is within 2 rooms: Mrs Okafor in the living room is 3 away, Tayo in his room 4 away.
  - Routines: Mrs Okafor rolls **1** and Tayo rolls **1**; both stay. Noodle rolls **1** and goes to the kitchen.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gravy | Outside | out | 2 | – |
| Velvet | Outside | out | 1 | – |
| Brick | Garage | free | 3 | box |
| Latch | Garage | free | 2 | box |

Mrs Okafor: living · Tayo: Tayo's room · Noodle: kitchen · **Broom 3/4 · Cuddle 3/4 · Patience 4** · Prize: carried in the garage · Clock: gone at this round's house phase.

**B, round 10.**
- *Temptation:* Brick and Latch are both eligible (garage). The d6 gives **5**: Latch. He **resists** (2→1).
- *Cats:* Brick and Latch carry the box out through the garage side door during the cats' phase, before the Clock's round-10 "gone".
- **Branch result: Clean Getaway, round 10.** 2 approach rolls (both Scrapes). Broom 3/4, Cuddle 3/4.
- If "gone at 10" means before round 10's cats act (I-11), the branch is **Busted**.
- Had Noodle stayed in the garage, the carriers would have started round 10 with him and had to "leave or deal with it". Leaving was their plan anyway, so the outcome is the same.

## Issues

Quotes are from `docs/CORE-RULES.md` v0.3 (bold markers dropped) or from the `okafor-box` sheet. **Played** says what I did; the suggested fix is one sentence of proposed rules text.

| ID | Sev | Passage | Played | Suggested fix |
|---|---|---|---|---|
| I-01 | **blocker** | "Pets: rating 1–3 and a d6 routine." Sheet: Noodle has `roam: ["kitchen", "hall", "living", "garage"]`, which is four rooms, not six d6 results. | d6: 1 kitchen, 2 hall, 3 living, 4 garage, 5–6 stay. It sent Noodle to the garage on the box's route in B-R8. | "A pet's routine is six d6 results, like a human's: stay, or a room it goes to." |
| I-02 | **blocker** | Sheet: `asleep: true`. Rules: "Dog: barks (noise) and charges; a cat starting its turn with it must leave or deal with it … dogs smell hidden cats." The rules have no sleeping pets. | A sleeping pet does nothing (no routine, bark, charge or smell) until noise is made in its room. It wakes at the noise step and rolls its routine in that same house phase (B-R8). The other reading, awake from round 1: every cat entering through the dog door starts round 2 with a rating-2 dog, and its roam covers every room on the box's route. That is a far harder robbery. | "A sleeping pet does nothing until noise is made in its room; it wakes at the end of that round and follows its routine from then on." |
| I-03 | major | "It starts in the human's arms; the Prize Clock says where it's put down, when it moves and when it's gone." Sheet: `{ round: 4, room: "living", steps: [], by: "mum" }`. | At round 4 the cats were carrying the box in the kitchen. Main reading: the move is skipped, giving a Clean Getaway in R6 with no rolls. Other reading (branch B): Mrs Okafor fetches it (+1 Broom) to the living room, giving a Clean Getaway only in R10 with Broom 3/4 and Cuddle 3/4. On the main reading, holding the prize freezes the Clock's moves. | "If the prize isn't where the Clock last put it, the human who would move it goes there, finds it gone (+1 Broom) and the move is skipped." |
| I-04 | major | "…and you're not in a hiding spot." "…a simple thing when unseen: pick up, drop, eat a portion, help, hide." The sheet lists no hiding spots; the DESIGN log says "Each room lists hiding spots". | Every room has somewhere to hide. Doing anything except staying put ends hiding. The other reading (a hidden cat can act from its spot, still unseen) would let a cat hide one round and then do anything in a watched room with no roll and no Mood: dominant. | "Every room has somewhere to hide unless its sheet says not; a hidden cat that moves or takes any other Action is no longer hidden." |
| I-05 | major | "give in (the instinct thing is its Action; +1 Cattitude) or resist (1 Cattitude; with none, give in)". The DESIGN log says "giving in gets a strong effect but makes noise or mess"; the core rules are silent. | Unseen: it just happens, with no roll, no noise, and the carrier keeps its load (B-R6, B-R7, B-R9). In view: a roll under "Seen". So giving in unseen is free Cattitude. With noise (the DESIGN reading), B-R6 would have drawn a kitchen human into the hall and B-R9 would have drawn Mrs Okafor into the kitchen. | "Giving in: the cat does its instinct's thing in that room at once, with no roll; it makes noise and drops what it carries." |
| I-06 | major | "…and for a watching human's Attention on Sneaky or Sweet rolls." | Each watcher's Attention counts (−2 with two watchers). In B-R8 Velvet had 3 dice; under a highest-only reading she'd have had 4. | "Remove the Attention of each human watching the roll." |
| I-07 | major | "Noise draws the closest awake human within 2 rooms at the end of the round." | Both lures in this game were ties (R3, B-R6). A d6 picked who came. | "If several humans are equally close, the Storyteller rolls to pick one." |
| I-08 | major | "House: noise, then each human's and pet's d6 routine, holders' rolls, the Prize Clock." | Strict order: the human who answered the noise then rolled their routine. In B-R6, Mrs Okafor answered (+1 Broom) and rolled 4, straight back to the kitchen. | "A human who answered noise this round stays there and skips its routine roll." |
| I-09 | major | "Each house has 3+ entrances (approach and Difficulty, room, size)." "one Move (next room, open way)". The rules don't say where cats start or what entering costs. | Cats start outside. Going through an entrance is the Move; an entrance roll is the Action. This made the front door pointless for a Large prize. | "Cats start outside; going in or out through an entrance is a Move, and an entrance that names an approach also takes that roll as your Action." |
| I-10 | major | "Large (three cats, or two with a Chonky; Big ways)." "Moving it past a human is a roll (one leader, helpers add dice)." | Each carrier spends its Action picking up. Carriers move together, each using its Move. A cat that has already moved can't carry that round, so walking into the prize room and out with it takes 2 rounds (B-R6/R7). | "Carriers each pick up as their Action and move together as their Move; a cat that has already moved this round can't help carry." |
| I-11 | major | "Lights Out comes 2 rounds after the Prize Clock." Sheet: `goneAt: 10`. | The prize is gone in round 10's house phase, so the cats can still take it out during round 10. Lights Out is at the end of round 12. Branch B won in R10's cat phase; on the "gone at the start of round 10" reading it is Busted. | "The prize is gone in the house phase of the round its Clock names; Lights Out comes at the end of the second round after that." |
| I-12 | major | "Dog: barks (noise) and charges; a cat starting its turn with it must leave or deal with it". The rules don't say when it barks or what a charge does. | It barks at the end of any round it shares a room with a cat; the charge is the start-of-turn rule. In B-R9 the carriers walked into Noodle's room for free, and "leave" was already their plan for R10. | "A dog barks whenever a cat is in its room at the end of a round, and a cat that enters or starts its turn in its room must leave or deal with it before doing anything else." |
| I-13 | major (latent) | "Shoo! (Broom full): the human chases that cat out through the nearest entrance and shuts it." On the sheet, the garage side door is the only Big entrance after round 1. | Not triggered. But a single Shoo! in the garage would shut the box's only way out, and nothing reopens an entrance, so that would mean certain Busted. | "A shut entrance can be opened again from either side (Streetwise, Hard)." |
| I-14 | major | Routine results are "stay" or "a room to walk to" (sheet); the rules don't say whether humans see the rooms they pass through. | Humans arrive straight at their room and see only it. In R3, Tayo and Mrs Okafor both crossed the hall while Brick and Latch held the box. Under "they see on the way", that's +2 Broom ("walks in on the prize disturbed"): Broom 3/4 by round 3, and branch B would have been Shooed. | "Humans and pets go straight to the room their routine names and see only that room." |
| I-15 | minor | "…and when a human walks in on the prize disturbed." | Disturbed means not where the Clock last put it (triggered in branch B, round 4). | "The prize is disturbed when it isn't where the Prize Clock last put it." |
| I-16 | minor | The house order puts routines before "the Prize Clock". In R1, Mrs Okafor (the "by" human) walked to the kitchen before the Clock put the box down "in the hall". | Put down in the hall anyway. | "In the house phase the Prize Clock comes before the routines." |
| I-17 | minor | "+1 Broom when a human answers noise you made on purpose", but the Action list ("a roll, or a simple thing when unseen: pick up, drop, eat a portion, help, hide") has no way to make it. | A simple Action, no roll: every roll result would make noise anyway. | Add "make a noise" to the simple things. |
| I-18 | minor | "+1 per helper (max +2)"; "help" is a simple thing "when unseen". | Helpers must be in the leader's room; helping is part of the leader's one roll, not a roll of its own. So in B-R8 the carriers in the hall couldn't help the kitchen distractions. | "A helper must be in the same room; it adds a die to the leader's roll and is not a roll of its own." |
| I-19 | minor | "a kid watching doubles Cuddle steps" | The kid being distracted counts as watching his own distraction (B-R8 Velvet: 2 Cuddle). A distracted kid doesn't watch later rolls (Gravy: 1 Cuddle). | "A kid who sees the roll, even one aimed at that kid, doubles its Cuddle steps; a Distracted kid sees nothing." |
| I-20 | minor | "Push: … pay 1 Cattitude or 1 extra Mood step." | On the roll's own meter, not doubled. Never paid this way, but it decided Gravy's B-R8 choice. | "…or 1 extra step on that roll's own meter." |
| I-21 | minor | "The front door lets in one cat, in round 1, behind the human." Sheet: "Front door (behind the courier)". | Unused. The courier isn't a listed resident, and the rules don't say whether Mrs Okafor's Attention and Mood steps apply to the entry roll. | "The front-door roll is made in view of the human at the door." |
| I-22 | minor | "Approaches rated 3, 2, 1, 1 (any order; max 4)"; "Two instincts (d8: Curious, …)"; "Body: Lean … or Chonky". | No random method is printed. Used the dice method in Gang, with d8 results in printed order. | "To roll a cat: d4 for the approach at 3, d3 for the 2, d8 twice for instincts in the order listed (reroll doubles), d6 for body (1–3 Lean)." |
| I-23 | minor | "Cattitude 2 (max 5)." The rules don't say it resets; the DESIGN log says it starts at 2 each robbery. | One-shot, so leftover Cattitude is worthless. That makes late resisting free (R6, B-R10). | "Cattitude starts at 2 every robbery; any left at the end is lost." |
| I-24 | minor | "A cat in the Den gets out if a friend opens the door…". The sheet's Den is Tayo's room, but the way `["landing", "kidsroom", "big"]` has no door, and Tayo's routine walks him there. | Not triggered. | "The Den's way has a door that is shut while a cat is in the Den; a human going in opens it and shuts it behind them." |
| I-25 | minor | "Moving it past a human is a roll (one leader, helpers add dice)." | The approach and Difficulty aren't stated; I'd use "Seen". I ruled that a Distracted human doesn't count. Never rolled. | "Moving the prize while a human sees it is a roll (Sneaky unnoticed, or Savage), led by one carrier." |
| I-26 | minor | "Still inside at the end? Adopted." This sits under Caught. | Does it also cover free cats still inside at Lights Out? Not triggered. | "At Lights Out every cat still inside, free or not, is adopted." |
| I-27 | minor | DESIGN and CORE disagree. DESIGN says a kid "tells a grown-up instead of fetching the broom" and CORE only doubles Cuddle. DESIGN has a Shut In cat "meow to lure a human" and CORE doesn't. DESIGN says a helper "shares the consequences" and CORE is silent. DESIGN says temptations make noise (see I-05). | Played CORE v0.3 each time. | "Kid: when Broom fills, the kid fetches the nearest grown-up, who does the Shoo!" (or drop the line from DESIGN). |

## Feel notes

- **Too easy and nearly roll-free (main line).** A Standard house was won Clean in 6 rounds with **zero approach rolls**. The cats' Actions were hide, pick up, one deliberate noise, and two resisted temptations. The house's geometry is the cause:
  - The box's only route (hall → kitchen → garage) passes through one room any routine names (the kitchen, a 1-in-6 result for each human).
  - No routine ever names the hall or the garage. Once Mrs Okafor leaves the hall (1 in 2 each round), she never returns by routine.
  - So the hall is a safe staging room for the box.
- **Waiting is free and dominant.** Nothing pressed the gang until round 10. R2–R4 were mostly the players watching the Storyteller roll routines. Idle turns: 5 of 23 cat-turns in the main line (Velvet alone was idle 3 rounds running), 2 of 22 in branch B.
- **The Storyteller's dice decide this house more than the players'.** Across both lines there were 27 house/Storyteller rolls to 2 player rolls. The two biggest swings were 1-in-36 routine results:
  - R1: both humans walked into the cats' room.
  - B-R5: both humans left the box alone.
- **Holding the prize freezes the Clock** (main reading of I-03). That is a dominant trick if this reading stands.
- **Hiding never mattered.** Walking and sitting in view are free and acting ends hiding, so hiding changed nothing in either line (but see I-04 for the dominant reading).
- **Temptations are rare and toothless.**
  - They fired 2 times in 6 main-line rounds, because only rooms with a matching tag tempt and the gang mostly passed through rooms that didn't tempt it.
  - Giving in where nobody sees is free +1 Cattitude (taken 3 times in branch B).
  - Resisting in the last rounds costs nothing.
  - The gang's three Hunters made the living room and garage tempt almost every cat, yet nothing bad came of it.
- **Luring is a coin flip that can backfire.** In B-R6, +1 Broom bought nothing (I-08). Both lures were ties (I-07).
- **Distraction is the real engine, and it's a good puzzle.**
  - Two Scrapes moved a Large box past two humans.
  - The kid's doubling makes the order matter: distract the kid while the grown-up still watches, then the grown-up alone.
  - But the costs cliff fast: one double distraction left Cuddle at 3/4, so a second double-distract round would have meant a Scoop.
- **A Scrape in a room with the humans in it is free.** The noise draws a human who's already there. Only my dog-wake ruling gave it teeth.
- **Entrances:** 2 of the 4 need no roll at all, and the dog door with a sleeping dog is a free entrance one room from the prize.
- **The dog is harmless as written.**
  - Asleep, it does nothing.
  - Awake, its rule only bites at turn start, so you can walk in now and "leave" next turn, which you meant to do anyway (B-R9).
- **One latent trap:** a single Shoo! in the garage ends the robbery, because the box has no other way out (I-13).
- **Rolls versus idle turns:**
  - Main line: 0 approach rolls, 5 idle cat-turns.
  - Branch B: 2 approach rolls, 2 idle cat-turns.
  - Pushes: 0. Cattitude dice: 1 (Velvet, B-R8). Flops 0, Scrapes 2, Cleans 0, Purrfects 0.

## Dice appendix

All dice were rolled with Node's `crypto.randomInt`, one logged command per line, in this order.
- Before play, one d6 (a 3) was rolled to test the roller and wasn't used.
- My first two Round 1 calls hit a broken copy of the roller in a shared scratch folder and produced no dice at all. They were re-run as #19–20; nothing was rolled and thrown away.
- In R2 the temptation needed no roll (only one cat was eligible).

| # | Round | Who | Why | Pool | Faces | Result |
|---|---|---|---|---|---|---|
| 1 | Setup | Gravy | which approach gets 3 (first face 1–4) | 3d6 | 6 6 2 | Sweet 3 |
| 2 | Setup | Gravy | which remaining approach gets 2 | 1d6 | 1 | Sneaky 2 (Savage 1, Streetwise 1) |
| 3 | Setup | Gravy | instincts | 2d8 | 4 4 | Hunter; duplicate, reroll 2nd |
| 4 | Setup | Gravy | body | 1d6 | 6 | Chonky |
| 5 | Setup | Velvet | approach at 3 | 3d6 | 2 3 2 | Sweet 3 |
| 6 | Setup | Velvet | approach at 2 | 1d6 | 4 | Savage 2 (Sneaky 1, Streetwise 1) |
| 7 | Setup | Velvet | instincts | 2d8 | 5 5 | Lap Cat; duplicate, reroll 2nd |
| 8 | Setup | Velvet | body | 1d6 | 3 | Lean |
| 9 | Setup | Brick | approach at 3 | 3d6 | 1 1 4 | Sneaky 3 |
| 10 | Setup | Brick | approach at 2 | 1d6 | 4 | Savage 2 (Sweet 1, Streetwise 1) |
| 11 | Setup | Brick | instincts | 2d8 | 4 8 | Hunter, Scrapper |
| 12 | Setup | Brick | body | 1d6 | 5 | Chonky |
| 13 | Setup | Latch | approach at 3 | 3d6 | 5 4 4 | Streetwise 3 (5 skipped) |
| 14 | Setup | Latch | approach at 2 | 1d6 | 3 | Sweet 2 (Sneaky 1, Savage 1) |
| 15 | Setup | Latch | instincts | 2d8 | 7 4 | Climber, Hunter |
| 16 | Setup | Latch | body | 1d6 | 3 | Lean |
| 17 | Setup | Gravy | reroll duplicate instinct | 1d8 | 1 | Curious |
| 18 | Setup | Velvet | reroll duplicate instinct | 1d8 | 3 | Box Sitter |
| 19 | R1 house | Mrs Okafor | routine (hall) | 1d6 | 4 | → kitchen |
| 20 | R1 house | Tayo | routine (living) | 1d6 | 6 | → kitchen |
| 21 | R2 house | Mrs Okafor | routine (kitchen) | 1d6 | 1 | stay (kitchen) |
| 22 | R2 house | Tayo | routine (kitchen) | 1d6 | 6 | kitchen (stays) |
| 23 | R3 house | Storyteller | tie-break for landing noise (1–3 Mrs O, 4–6 Tayo) | 1d6 | 6 | Tayo answers, +1 Broom |
| 24 | R3 house | Mrs Okafor | routine (kitchen) | 1d6 | 5 | → living |
| 25 | R3 house | Tayo | routine (landing) | 1d6 | 1 | stay (landing) |
| 26 | R4 house | Mrs Okafor | routine (living) | 1d6 | 5 | living (stays) |
| 27 | R4 house | Tayo | routine (landing) | 1d6 | 5 | → living |
| 28 | R5 house | Mrs Okafor | routine (living) | 1d6 | 4 | → kitchen |
| 29 | R5 house | Tayo | routine (living) | 1d6 | 5 | living (stays) |
| 30 | R6 start | Storyteller | which cat to tempt (1–2 Gravy, 3–4 Brick, 5–6 Latch) | 1d6 | 3 | Brick (resists) |
| 31 | B-R5 house | Mrs Okafor | routine (living) | 1d6 | 4 | → kitchen |
| 32 | B-R5 house | Tayo | routine (living) | 1d6 | 6 | → kitchen |
| 33 | B-R6 house | Storyteller | tie-break for landing noise (1–3 Mrs O, 4–6 Tayo) | 1d6 | 3 | Mrs Okafor answers, +1 Broom |
| 34 | B-R6 house | Mrs Okafor | routine (landing) | 1d6 | 4 | → kitchen |
| 35 | B-R6 house | Tayo | routine (kitchen) | 1d6 | 1 | stay (kitchen) |
| 36 | B-R7 start | Storyteller | which cat to tempt (1–2 Brick, 3–4 Latch, 5–6 Velvet) | 1d6 | 2 | Brick (gives in) |
| 37 | B-R7 house | Mrs Okafor | routine (kitchen) | 1d6 | 2 | stay |
| 38 | B-R7 house | Tayo | routine (kitchen) | 1d6 | 2 | stay |
| 39 | B-R8 | Velvet | Distract Tayo: Sweet 3 + Knack 1 + Cattitude 1 − Attention 2 | 3d6 | 2 5 1 | **Scrape**: distracted, noise, Cuddle +2 |
| 40 | B-R8 | Gravy | Distract Mrs Okafor: Sweet 3 − Attention 1 | 2d6 | 5 2 | **Scrape**: distracted, noise, Cuddle +1 |
| 41 | B-R8 house | Mrs Okafor | routine (kitchen) | 1d6 | 6 | → living |
| 42 | B-R8 house | Tayo | routine (kitchen) | 1d6 | 4 | → Tayo's room |
| 43 | B-R8 house | Noodle | routine after waking (I-01 table) | 1d6 | 4 | → garage |
| 44 | B-R9 house | Mrs Okafor | routine (living) | 1d6 | 1 | stay |
| 45 | B-R9 house | Tayo | routine (Tayo's room) | 1d6 | 1 | stay |
| 46 | B-R9 house | Noodle | routine (garage) | 1d6 | 1 | → kitchen |
| 47 | B-R10 start | Storyteller | which cat to tempt (1–3 Brick, 4–6 Latch) | 1d6 | 5 | Latch (resists) |

Totals:
- Main line: rolls #19–30, which is 12 house/Storyteller rolls and 0 approach rolls.
- Branch B: rolls #31–47, which is 15 house/Storyteller rolls and 2 approach rolls.
- Gang creation: 18 rolls (#1–18).

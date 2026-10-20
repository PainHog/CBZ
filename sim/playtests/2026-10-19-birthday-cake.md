# Playtest: The Birthday Cake (Hard), gang of 3, real dice

*2026-10-19 · Core rules v0.3 (`docs/CORE-RULES.md`), played strictly by its text · House sheet: `birthday-cake` in `sim/houses.mjs` · One agent played the Storyteller and all three players · Every die came from a real random command (`crypto.randomInt`, logged in order). The full log is in the Dice appendix.*

## Summary

- **Outcome: Clean Getaway in 5 rounds.** Lights Out would have been at the end of round 11. The gang came in through the ajar patio door in round 1. In round 2 Velvet distracted Aunt Rosalind while Latch climbed to the counter and Gristle tore off the cake cover. The kitchen then emptied, and the gang ate all 6 portions unseen in rounds 3–4, with no rolls. All three cats walked out the patio door in round 5. Nobody was Shooed, Scooped, Held or shut in, and the Mood ended at Broom 1/4, Cuddle 1/4.
- **Rolls:** the cats made **3 rolls (7 dice)**: 1 Clean, 1 Scrape, 1 Purrfect, 0 Flops, 0 Pushes. The Storyteller made 16 routine rolls and 4 temptation picks. Character creation took 12 rolls. In all: **35 roll events, 42 dice.**
- **Turns:** 15 cat-turns (3 cats × 5 rounds). 3 had a roll, 6 had a no-roll Action that mattered (eating), and **6 had no meaningful Action**: round 1, when the cake was still in Dad's arms, and round 5, which was only walking out.
- **Issues: 23 logged.** None was a blocker; 8 are major and 15 minor. The top 5:
  1. **I-01 (major): the Prize Clock and the routines collide.** The House phase runs routines *before* the Prize Clock, so Dad's routine walked him to the living room and then "the Prize Clock says where it's put down" left the cake alone in the kitchen. If Dad had stayed with the cake, round 2 would have had two watchers in the kitchen (Dad and Aunt Rosalind), and the run would very likely have been longer and riskier.
  2. **I-02 (major): noise in a room that already holds a human does nothing.** "The closest awake human within 2 rooms" reads as the one already in the room, at distance 0. All 4 noises in this game were harmless for that reason. The text also doesn't say how to break ties or what order several noises resolve in.
  3. **I-03 (major): giving in to a temptation has no defined effect.** It only uses up the Action (+1 Cattitude), and in view it becomes a roll that can only add Mood. The players resisted all 4 temptations, against a design target of ≥ 40% given in.
  4. **I-04 (major): are a spot's steps done once for everyone, or per cat?** I played once for everyone. Under the per-cat reading, Gristle and Velvet would each have had to climb the counter, adding about 2 rolls and a round.
  5. **I-05 (major): what does an entrance use up?** The rules don't say whether going through an entrance is the Move, the Action, or both, or whether leaving needs the entrance's roll.
- **Headline feel:** the robbery was decided by one Storyteller die, Aunt Rosalind leaving the kitchen on a 6 after round 2, and not by the players. After that, eating unseen cost no rolls at all. The patio door is a free way in and out, and walking in view is free, so the dining room's watchers and the parrot never mattered. None of the catch rules came into play (Shoo!, Scooped!, Held, Den, wriggling free, Push, kid doubling, meowing at a door, Lights Out). For context, `sim/BALANCE.md` gives this house about 10% Clean Getaways (gang of 4, P6). One game proves nothing, but it is worth checking how the simulator resolves I-01, I-02 and I-04.

## Gang

Character creation used dice throughout (method in I-15, since the core rules give no table for ratings or body):

- **Ratings:** a d6 picks the approach rated 3 (1 Sneaky, 2 Sweet, 3 Savage, 4 Streetwise, 5–6 reroll). A second d6 picks the 2 among the remaining three, in listed order (1–2 first, 3–4 second, 5–6 third). The rest get 1.
- **Instincts:** d8 twice, numbered in the order the rules list them, rerolling a duplicate (none came up).
- **Body:** d6, 1–3 Lean, 4–6 Chonky.

| Cat | Body | Sneaky | Sweet | Savage | Streetwise | Instincts (knack tags) | Cattitude | Lives |
|---|---|---|---|---|---|---|---|---|
| **Gristle** (ginger tom, torn ear) | Chonky | 1 | 1 | 2 | 3 | Hunter (chase/fight), Foodie (food) | 2 | 9 |
| **Velvet** (grey longhair) | Chonky | 2 | 3 | 1 | 1 | Lap Cat (charm), Climber (climb) | 2 | 9 |
| **Latch** (skinny black-and-white) | Lean | 2 | 1 | 1 | 3 | Knocker (knock), Climber (climb) | 2 | 9 |

The rolls behind each cat:

- **Gristle:** 3-slot rolled 4 (Streetwise), 2-slot rolled 6 (Savage), instincts 4 and 6, body 4.
- **Velvet:** 3-slot 2 (Sweet), 2-slot 2 (Sneaky), instincts 5 and 7, body 4.
- **Latch:** 3-slot 4 (Streetwise), 2-slot 1 (Sneaky), instincts 2 and 7, body 2.

**Gang-size rule (3 cats):**

- **Patience:** Hard 3 + 1 = **4**, so each meter fills at 4.
- **Prize Clock:** gone at round 8 + 1 = **end of round 9** (the round-5 move is unchanged; see I-14).
- **Lights Out:** end of round 11.
- **Portions:** 2 per cat × 3 + 0 = **6** (half = 3).

**Pools against this house sheet** (before Attention):

| Obstacle | Gristle | Velvet | Latch |
|---|---|---|---|
| Climb (counter / water butt): Sneaky Tricky [climb] · Savage Tricky [climb] | 0 · 1 | **2** · 1 | **2** · 1 |
| Cake cover: Streetwise Tricky [open] · Savage Tricky [fight] | **2** · **2** | 0 · 0 | **2** · 0 |
| Front door: Sneaky Hard · Sweet (no Difficulty) [charm] | −1 · 1 | 0 · **4** | 0 · 1 |
| Distract (Sweet) | 1 | **4** (Lap Cat) | 1 |

No option on this sheet carries the knock tag, and there are no Tight ways or Tight entrances, so Latch's Knocker instinct and Lean body had nothing to work on here.

**Players' plan:** go in through the ajar patio door (the only entrance with no roll) and wait for the cake to be set down. Then Distract whoever is guarding it, climb, uncover, eat unseen, and walk back out through the patio.

## Play log

**Standing rulings** (each one is an issue below; the alternative reading is noted there):

- Going through an entrance is the cat's Move. If the entrance lists an approach, that roll is the Action, coming in or going out (I-05).
- A human already in the noisy room counts as the closest, so nobody walks in (I-02).
- Once a step on a spot is done, it stays done for the whole gang (I-04).
- **Temptations:**
  - What a cat gives in to is the room's temptation, not the prize. Unseen, giving in means no roll and no noise; in view it is a roll whose only effect is on the Mood (I-03).
  - Storyteller policy: tempt every round that a cat is eligible, picking among eligible cats with a die.
- The Prize Clock comes after the routines: the cake lands on its spot wherever its human's routine took him (I-01).
- A human reaches the room its routine names in the same round (I-13).
- The parrot stays put and makes noise in its room at the end of any round in which it saw a cat (I-12).
- A Move and an Action may come in either order (I-10).
- **+1 Broom** each time a human walks into the prize's room and finds it disturbed, including an eaten-up cake (I-09).
- Planned but never needed:
  - Every watcher's Attention is removed (I-06).
  - Hiding is possible in any room (I-07).
  - A Push paid in Mood adds the step even when unseen (I-08).

**Setup (before round 1)**

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gristle | outside | free | 2 | — |
| Velvet | outside | free | 2 | — |
| Latch | outside | free | 2 | — |

- **Humans:** Dad in the kitchen (holding the cake) · Aunt Rosalind in the dining room · Mia and Leo in the living room. **Pet:** Captain the parrot, dining room.
- **Mood:** Broom 0/4 · Cuddle 0/4 · Patience 4.
- **Prize:** in Dad's arms; 6/6 portions.
- **Prize Clock:** R1 put down in the kitchen (steps: climb, cover) · R5 moved to the dining room (step: climb) · gone at the end of R9 · Lights Out at the end of R11.

### Round 1

*Start:* no temptation; every cat is outside.

*Cats:* all three slip through the ajar patio door into the dining room. That is each cat's Move, and this entrance needs no roll. Aunt Rosalind (Attention 2) looks up: "Oh! Whose are *you*?" Walking and sitting in view are free, and the cake is still in Dad's arms, so nobody takes an Action. Any Action here would be a roll under a 2-Attention gaze.

*House:*

- **Noise:** Captain squawks at three strange cats. The noise draws the closest awake human, Rosalind, who is already in the room, so nobody moves.
- **Routines:** Dad 6 → living room. Rosalind 5 → kitchen. Mia 6 → living room (already there). Leo 3 → dining room.
- **Prize Clock:** the cake goes down on the kitchen counter under its cover. Dad's routine has already taken him to the living room, so it sits there with Rosalind (I-01).

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gristle | dining | free (seen by Leo) | 2 | — |
| Velvet | dining | free (seen by Leo) | 2 | — |
| Latch | dining | free (seen by Leo) | 2 | — |

- **Humans:** Dad in the living room · Rosalind in the kitchen · Mia in the living room · Leo in the dining room. **Captain:** dining room.
- **Mood:** Broom 0/4 · Cuddle 0/4 · Patience 4.
- **Prize:** kitchen counter, covered. Steps left: climb, cover. 6/6 portions.
- **Clock:** next event is R5 (move to the dining room); gone at the end of R9.

### Round 2

*Start:* all three cats are in the dining room, whose temptations are hunter and climber, so all are eligible. The d6 picks **Gristle** (2): the bunting is twitching. Giving in would spend his Action, and in view of Leo it would be a roll that can only add Mood, so he **resists** (Cattitude 2 → 1).

*Cats:*

- **Velvet:** walks into the kitchen and **Distracts Aunt Rosalind**, rubbing her ankles and purring. Pool: Sweet 3 + Knack 1 (Lap Cat) + 1 Cattitude = 5, minus Attention 2 = **3 dice: 6 3 1, Clean.** Rosalind sees nobody until the round ends. **+1 Cuddle** (1/4). Velvet's Cattitude 2 → 1.
- **Latch:** walks in and, unseen, climbs a chair to the counter. Pool: Sneaky 2 + Knack 1 (Climber) − Tricky 1 = **2 dice: 4 3, Scrape.** Latch is up (step 1 done), with noise.
- **Gristle:** walks in and hooks the cake cover off, unseen. Pool: Savage 2 + Knack 1 (Hunter, the fight tag) − Tricky 1 = **2 dice: 6 6, Purrfect.** Step 2 is done, with no Mood step and **+1 Cattitude** (1 → 2). The cake is uncovered and "disturbed".

*House:*

- **Noise:** Latch's Scrape is in the kitchen, but Rosalind is already there. Captain saw cats at the start of the round and squawks, but Leo is already in the dining room. Nobody moves (I-02).
- **Distraction ends:** Rosalind's distraction lapses with three cats sitting round an uncovered cake. Sitting in view is free, and she didn't "walk in", so there is no Broom step (I-09).
- **Routines:** Dad 3 stays. **Rosalind 6 → living room.** Mia 2 stays. Leo 3 → dining room (already there).
- **Prize Clock:** nothing this round.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gristle | kitchen | free, unseen | 2 | — |
| Velvet | kitchen | free, unseen | 1 | — |
| Latch | kitchen (counter) | free, unseen | 2 | — |

- **Humans:** Dad, Rosalind and Mia in the living room · Leo in the dining room. **Captain:** dining room.
- **Mood:** Broom 0/4 · Cuddle 1/4 · Patience 4. Rosalind has been distracted once.
- **Prize:** kitchen counter, uncovered. Steps left: none. 6/6 portions.
- **Clock:** R5 move · gone at the end of R9.

### Round 3

*Start:* the kitchen's temptations are foodie and knocker, so Gristle and Latch are eligible. The d6 picks **Gristle** (3): the bin smells of party sausages. He **resists** to keep his Action for the cake (Cattitude 2 → 1).

*Cats:* there are no humans in the kitchen, so each cat **eats a portion** as a simple Action, with no roll. **6 → 3 portions** (half the cake is now eaten). Nobody moves.

*House:*

- **Noise:** none.
- **Routines:** Dad 3 stays. Rosalind 4 stays. Mia 6 → living room (already there). Leo 1 stays.
- **Prize Clock:** nothing.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gristle | kitchen | free, unseen | 1 | — (1 portion eaten) |
| Velvet | kitchen | free, unseen | 1 | — (1 portion eaten) |
| Latch | kitchen | free, unseen | 2 | — (1 portion eaten) |

- **Humans:** Dad, Rosalind and Mia in the living room · Leo in the dining room. **Captain:** dining room.
- **Mood:** Broom 0/4 · Cuddle 1/4 · Patience 4.
- **Prize:** kitchen counter, **3/6 portions**.
- **Clock:** R5 move · gone at the end of R9.

### Round 4

*Start:* Gristle and Latch are eligible again. The d6 picks **Latch** (5): a party cup sits right on the counter edge. He **resists** (Cattitude 2 → 1).

*Cats:*

- All three **eat** the last three portions unseen, with no rolls. **The cake is gone (6/6 eaten): prize got.**
- Then each uses its Move to stroll into the dining room. Leo sees them; walking in view is free.

*House:*

- **Noise:** Captain squawks, but Leo is already in the dining room, so nobody moves.
- **Routines:** Dad 6 → living room (already there). Rosalind 2 stays. **Mia 5 → kitchen.** She walks in on a licked-clean plate: **+1 Broom** (1/4) for the prize disturbed. No cat is in sight (I-09). Leo 1 stays.
- **Prize Clock:** nothing. The round-5 move will have no cake to move.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gristle | dining | free (seen by Leo) | 1 | — (2 portions eaten) |
| Velvet | dining | free (seen by Leo) | 1 | — (2 portions eaten) |
| Latch | dining | free (seen by Leo) | 1 | — (2 portions eaten) |

- **Humans:** Dad and Rosalind in the living room · Mia in the kitchen · Leo in the dining room. **Captain:** dining room.
- **Mood:** Broom 1/4 · Cuddle 1/4 · Patience 4.
- **Prize:** eaten (0/6 left).
- **Clock:** R5 move (moot) · gone at the end of R9.

### Round 5

*Start:* all three are in the dining room, so all are eligible. The d6 picks **Velvet** (4): the curtains, which she could climb. She **resists** (Cattitude 1 → 0). Cattitude doesn't carry over to the next robbery, so resisting now costs nothing (I-11).

*Cats:* all three use their Move to walk out through the patio door into the garden, past a delighted Leo. **No free cat is inside, so the robbery ends.** The round-5 House phase is not played.

| Cat | Room | Status | Cattitude | Carries |
|---|---|---|---|---|
| Gristle | outside | free | 1 | — |
| Velvet | outside | free | 0 | — |
| Latch | outside | free | 1 | — |

- **Mood:** Broom 1/4 · Cuddle 1/4 · Patience 4.
- **Prize:** eaten (6/6).
- **Outcome: Clean Getaway** (prize got, nobody left behind).

## Issues

*Quotes are from `docs/CORE-RULES.md` v0.3 unless marked "sheet" (`sim/houses.mjs`, `birthday-cake`) or "DESIGN". The `**` emphasis markers are dropped; the words are exact. The "In play" column gives the round where an issue came up; "not reached" means it was spotted while preparing and would have mattered on a plausible line of play.*

| ID | Sev | In play | Passage | What I did | Suggested fix |
|---|---|---|---|---|---|
| I-01 | major | R1–R2 | "House: noise, then each human's and pet's d6 routine, holders' rolls, the Prize Clock." + "It starts in the human's arms; the Prize Clock says where it's put down, when it moves and when it's gone." Sheet: round 1, kitchen, `by: "dad"`. | Dad's routine (6) took him to the living room; then the Prize Clock put the cake on the kitchen counter anyway, so it was left with only Rosalind. **Other reading:** Dad puts it down and stays. Round 2 then has Dad (Attention 1) and Rosalind (Attention 2) in the kitchen, and one Distract can't blind both. Latch's climb in view would have been 1 die (or 0 under Rosalind's gaze), the cover a seen Savage roll with +1 Broom, and the eating Savage rolls with Broom steps: very likely several more rounds and a real Shoo! risk. DESIGN's older order (Prize Clock first) gives the same result as the reading I played. | "In a round when the Prize Clock places or moves the prize, its human skips its routine roll and ends the round in the prize's room." |
| I-02 | major | R1, R2, R4 | "Noise draws the closest awake human within 2 rooms at the end of the round." | A human already in the noisy room counts as closest (distance 0), so nobody moved for any of the 4 noises (3 parrot squawks and Latch's Scrape). Noise made under a Distracted human therefore costs nothing. **Other reading** (the closest human *not already there*): the R2 Scrape pulls Leo into the kitchen, he walks in on the uncovered cake (+1 Broom), and every squawk pulls a new human into the dining room. Also unstated: tie-breaks, and the order when several noises happen in one round (R2 had two). | "Noise draws the closest awake human within 2 rooms who isn't already in that room (the Storyteller rolls on a tie); resolve several noises in the order they were made." |
| I-03 | major | R2, R3, R4, R5 | "give in (the instinct thing is its Action; +1 Cattitude) or resist (1 Cattitude; with none, give in)". The sheet names only instinct tags per room, not the thing. DESIGN: "giving in gets a strong effect but makes noise or mess". | The thing is a room object, not the prize (a Foodie tempted in the kitchen doesn't get to eat the cake for free). Unseen, giving in means no roll and no noise, just a lost Action; in view, it is a roll (Sneaky, Savage or Sweet as under Seen) whose only effect is Mood. The players resisted all 4 temptations, because giving in has no upside except +1 Cattitude. | "Giving in: the cat spends its Action on its instinct thing with that room's temptation (the house sheet names it); it makes noise, adds no Mood step even if seen, and the cat gains 1 Cattitude." |
| I-04 | major | R2–R4 | "A spot can take several steps (up on the counter, then the foil), one working roll each." | Once done, a step stays done for the whole gang: Latch climbed, then Gristle uncovered the cake and all three ate without climbing. **Other reading** (each cat climbs for itself): Gristle (Savage 1 die, no Knack) and Velvet (2 dice) each need a climb roll, which means about 2 more rolls, more noise, and eating a round later. | "A step that's done stays done for the whole gang." |
| I-05 | major | R1, R5 | "Cats, any order: one Move (next room, open way) and one Action (…)" + "Each house has 3+ entrances (approach and Difficulty, room, size)." under "Getting in and out". | Going through an entrance is the Move; the entrance's roll, if it has one, is the Action, both coming in and going out. The patio has no roll, so getting in and out cost Moves only. **Other readings:** a rolled entrance costs the Move and the Action; leaving is always free. These change the utility window's worth and how fast a cat can escape. | "Going through an entrance, in or out, is your Move; if the entrance lists an approach, that roll is also your Action." |
| I-06 | major | not reached | "remove dice … for a watching human's Attention on Sneaky or Sweet rolls" + "the human chases that cat out" / "the human picks that cat up". | Planned to remove every watcher's Attention, but each roll had at most one watcher. On this sheet the two kids start together, and the I-01 reading puts Dad and Rosalind together: summed, that makes a Sneaky roll 3 dice harder. The text also doesn't say who Shoos or Scoops when several humans saw. | "If several humans watch, remove only the highest Attention; that human is the one who Shoos or Scoops (the Storyteller picks on a tie)." |
| I-07 | major | not reached | "You're seen if you share a room with an awake human who isn't Distracted or holding a cat, and you're not in a hiding spot." + "a simple thing when unseen: … hide". The sheet's header promises "rooms (hiding spots, temptations)", but no room lists one. | Would have allowed hiding in any room; the players never needed it. Whether hiding exists at all changes every watched room. | "Every room has a hiding spot unless its house sheet says it has none." |
| I-08 | major | not reached | "Push: once per roll, reroll every die that isn't a 6; pay 1 Cattitude or 1 extra Mood step." + "A roll a human sees adds steps". | No Push happened. I had planned to put the paid step on the roll's meter even when unseen. **Other reading:** an unseen Push paid in Mood costs nothing, which is a free reroll on every unseen roll. | "A Push paid in Mood adds 1 step to that approach's meter even when nobody saw the roll." |
| I-09 | minor | R2 end, R4 | "+1 Broom … when a human walks in on the prize disturbed." | +1 Broom when Mia walked in on the empty plate in R4. I counted an eaten-up cake as disturbed, and every walk-in counts. When Rosalind's distraction ended beside the uncovered cake (R2), I gave no step, because she didn't walk in. Could be major at a house where humans pace through the prize's room. | "+1 Broom each time a human enters the prize's room, or stops being Distracted there, and finds it disturbed (a step done or a portion gone, including all of it)." |
| I-10 | minor | R4 | "Cats, any order: one Move … and one Action …" ("any order" can be read as the order of cats, not of Move and Action) | Allowed the Action before the Move: the cats ate, then walked to the dining room. **Other reading** (Move first): they leave a round later (R6), and Mia, entering the kitchen at the end of R4, sees them by the plate (free). Same outcome. | "Each cat takes its Move and its Action in either order." |
| I-11 | minor | R5 | As I-03, plus "Cattitude 2 (max 5)" with no carry-over. | A cat that gives in can Move out of the house and never take its Action, and resisting in the last round is free because Cattitude is lost at the end. Velvet resisted at no real cost. | "A cat that gives in does its instinct thing before it moves." |
| I-12 | minor | R1, R2, R4 | "Pets: rating 1–3 and a d6 routine." + "Parrot: squawks while it sees a cat." Sheet: `{ kind: "parrot", start: "dining" }` (no rating, no routine). DESIGN: "parrot (squawks = noise while it sees a cat; cover it)". | Captain stays put and makes noise in his room at the end of any round in which he saw a cat that wasn't hidden. There is no way to quiet him (covering him is in DESIGN only). Because of I-02 he never mattered. | "Parrot (no rating, never moves): at the end of each round in which it saw a cat it squawks (noise in its room); a cat can cover its cage (Streetwise, Tricky) to silence it for the robbery." |
| I-13 | minor | R1 | Sheet header: "A routine is six results for d6 1–6: "stay" or a room key to walk to." | Dad went from the kitchen to the living room (2 rooms) in one round. Taking one room per round would leave him in the hall (next to the cake) for a round. | "A human reaches the room its routine names by the end of that round, however far it is." |
| I-14 | minor | setup | "Gang size: with 3 cats, Patience +1 and Clock +1" + "Lights Out comes 2 rounds after the Prize Clock." | Only the "gone" round moves (8 → 9); the R1 put-down and R5 move stay. Lights Out comes at the end of round 11. It wasn't reached, but it would matter in a longer robbery. | "With 3 cats the prize is gone one round later (its other moves don't change); Lights Out falls at the end of the second round after that." |
| I-15 | minor | setup | "Approaches rated 3, 2, 1, 1 (any order; max 4)" + "Two instincts (d8: Curious, …, Scrapper)" + "Body: Lean … or Chonky …". | The core rules have no random method for ratings or body, and the duplicate-instinct reroll is in DESIGN only. I used the d6 methods in the Gang section; d8 faces follow the order of the list. | "To roll a cat: d6 for your 3 (1 Sneaky, 2 Sweet, 3 Savage, 4 Streetwise, 5–6 reroll), d6 for your 2 among the rest in that order (1–2, 3–4, 5–6), d8 twice for instincts in the order listed (reroll a repeat), d6 for body (1–3 Lean, 4–6 Chonky)." |
| I-16 | minor | not reached | "The front door lets in one cat, in round 1, behind the human." Sheet: `rounds: [1, 2]`, "Front door (guests arriving)", Sweet with no Difficulty. | The sheet disagrees with the core rules (rounds 1–2 against round 1). I would have followed the sheet. The "guests" aren't residents, so it's unclear whose Attention or Mood that roll touches. Not used. | "The front door lets in one cat in the rounds its house sheet lists; the arriving human is not a resident (no Attention, no Mood steps)." |
| I-17 | minor | not reached | "Medium (a Chonky cat or two cats; no climbing)". The cake's spot is reached by a climb step. | The players ate the cake rather than carry it. It's unclear whether a Chonky cat can bring a Medium prize down off a counter it had to climb onto, which decides whether carrying out is ever possible from a high spot. | "Bringing a prize down from its spot isn't climbing; 'no climbing' means no climb entrances and no climb steps while carrying." |
| I-18 | minor | not reached | "the human chases that cat out through the nearest entrance and shuts it." | From the kitchen, the patio (dining room) and the utility window are both one room away, a tie. | "… through the nearest entrance (the Storyteller picks on a tie) and shuts it." |
| I-19 | minor | not reached | "A Held cat can't move, and its holder sees nobody else." + routines run before "holders' rolls"; "A cat in the Den gets out if a friend opens the door (Streetwise, Tricky)". | The text doesn't say whether a holder still rolls its routine (and carries the cat around), or which side of the Den door the rescuing friend must stand on. | "A holder skips its routine roll; a friend opens the Den from the room next to it." |
| I-20 | minor | not reached | "a kid watching doubles Cuddle steps" + "A Flop adds 2 to the fuller meter (its own if level)". | Open questions: does a Flop that lands on Cuddle become 4 with a kid watching, and do two kids quadruple it? Velvet's only Sweet roll had no kid watching. | "If any kid watches, Cuddle steps from that roll are doubled once (a Flop's 2 becomes 4)." |
| I-21 | minor | not reached | "Distract (Sweet): that human sees nobody until the round ends; each repeat on the same human is 1 die harder." | Unclear whether repeats count up across the whole robbery, or only in a row. The other route (Rosalind staying) would have hit this by R4: 0 dice. | "Each earlier Distract on the same human this robbery removes 1 die." |
| I-22 | minor | not reached | "(a roll, or a simple thing when unseen: pick up, drop, eat a portion, help, hide)" + "Anything else in view is a roll". | Read literally, helping in view is itself a roll before you can add your die. I would have let a helper add +1 die to the leader's single roll, seen or not ("One roll, one change"). | "Helping adds +1 die to the leader's roll, seen or not; only the leader rolls." |
| I-23 | minor | doc | DESIGN rows that v0.3 replaced without marking them: the round order ("Prize Clock, each human's d6 routine, each pet's d6 routine, noise"), the kid ("tells a grown-up instead of fetching the broom"), "A cat with its mouth full can't be Sweet", the Shut In meow ("or meow to lure a human (Sweet)"), the parrot "cover it", and temptation noise. | Followed CORE-RULES.md v0.3 throughout, as instructed. | Mark superseded DESIGN rows, and either fold the still-intended parts (temptation noise, covering the parrot) into the core rules or strike them. |

## Feel notes

- **Pace and counts:**
  - 5 rounds; 15 cat-turns.
  - **3 rolls**, all in round 2; 6 cat-turns ate cake without a roll.
  - **6 cat-turns had no meaningful Action:** round 1, when the cake was in Dad's arms until the end of the round, so there was nothing to do but walk in; and round 5, which was only walking out.
  - 4 temptations, each costing a Cattitude rather than a turn.
  - The Storyteller rolled 20 dice (16 routines, 4 temptation picks) against the gang's 3 rolls: **the house rolled almost 7 times as often as the players.**
- **Swingy: one routine die decided the game.**
  - Aunt Rosalind (Attention 2) leaves the kitchen only on a 6. She rolled it after round 2, and the kitchen stayed empty for rounds 3–4.
  - Dad's and Leo's routines never lead to the kitchen; only Rosalind's and Mia's 5s do. With both of them elsewhere, the kitchen gets no routine visitor in about 69% of rounds (5/6 × 5/6).
  - Once the cake's room empties, the game is over.
- **Dominant, the free patio:**
  - An ajar entrance into an occupied room costs nothing, because walking and sitting in view are free.
  - The dining room's watchers (Rosalind, then Leo) and the parrot never cost the gang anything, in or out.
  - Only a Shoo! shuts an entrance, and Broom never got past 1.
- **Dominant, Distract first and the rest act unseen:**
  - One Sweet roll (3 dice even against Attention 2, with a Knack and 1 Cattitude) blinded the only watcher for the round.
  - The other two then worked unseen, and their Scrape noise went nowhere, because the distracted human was already in the room (I-02).
- **Likely dominant (analysis, not played):**
  - Being Scooped blinds the holder: "its holder sees nobody else", and the holder keeps cuddling on 1–3 each round.
  - Had Rosalind stayed, Velvet's third Distract would have been 0 dice (25% to work). The likely Flop gives +2 Cuddle, filling the meter (4/4), and Velvet is Scooped. Rosalind then sees nobody, and the other two eat freely.
  - So the Lap Cat's failure would have been about as good as her success. The Den and adoption are the only real costs.
- **Caught at the scene for free:** at the end of round 2, Rosalind's distraction lapsed with three cats round an uncovered cake, and nothing happened, because only a human *walking in* triggers +1 Broom (I-09).
- **Pointless this time:**
  - The parrot (I-02, I-12).
  - Temptations: all resisted, with no upside to giving in, and free to resist in the last round (I-03, I-11).
  - Body type: no Tight ways or entrances here, and eating avoids carrying.
  - Two Streetwise 3s, never used: the cover took 2 dice either way.
  - The Foodie Knack: eating unseen is never rolled.
  - The Mood: it ended at Broom 1/4 and Cuddle 1/4, with Patience 4 never touched.
- **Never exercised:** Flop, Push, Shoo!, Scooped!, Held, wriggling free, the Den, adoption, kid doubling, meowing at a door, the front door, the utility window, carrying a Medium prize, moving it past a human, the round-5 move, Lights Out. **This playtest says nothing about the catch rules.**
- **Against the DESIGN targets** (one game, anecdotal):
  - Flops 0/3 (target 15–25%); Purrfects 1/3 (target 2–6%).
  - Temptations given in 0/4 (target ≥ 40%).
  - Every cat spent at least half its starting Cattitude (Velvet 2, Gristle 2, Latch 1).
  - A Clean Getaway at a Hard house in 5 of 11 possible rounds.
- **Suggestion for the next playtest:** after fixing I-01 to I-04, rerun this house with the same gang, so that Dad guards the cake and noise pulls in new humans. That should reach the catch rules.

## Dice appendix

The faces are exactly as rolled, in order. "K" is Knack, "C" Cattitude, "T" Tricky, "Att" Attention.

| # | Round | Who | Why | Pool | Faces | Result |
|---|---|---|---|---|---|---|
| 1 | Create | Gristle | approach rated 3 | 1d6 | 4 | Streetwise 3 |
| 2 | Create | Gristle | approach rated 2 (Sneaky/Sweet/Savage) | 1d6 | 6 | Savage 2 (Sneaky 1, Sweet 1) |
| 3 | Create | Gristle | instincts | 2d8 | 4 6 | Hunter, Foodie |
| 4 | Create | Gristle | body | 1d6 | 4 | Chonky |
| 5 | Create | Velvet | approach rated 3 | 1d6 | 2 | Sweet 3 |
| 6 | Create | Velvet | approach rated 2 (Sneaky/Savage/Streetwise) | 1d6 | 2 | Sneaky 2 (Savage 1, Streetwise 1) |
| 7 | Create | Velvet | instincts | 2d8 | 5 7 | Lap Cat, Climber |
| 8 | Create | Velvet | body | 1d6 | 4 | Chonky |
| 9 | Create | Latch | approach rated 3 | 1d6 | 4 | Streetwise 3 |
| 10 | Create | Latch | approach rated 2 (Sneaky/Sweet/Savage) | 1d6 | 1 | Sneaky 2 (Sweet 1, Savage 1) |
| 11 | Create | Latch | instincts | 2d8 | 2 7 | Knocker, Climber |
| 12 | Create | Latch | body | 1d6 | 2 | Lean |
| 13 | R1 | Dad | routine | 1d6 | 6 | → living room |
| 14 | R1 | Aunt Rosalind | routine | 1d6 | 5 | → kitchen |
| 15 | R1 | Mia | routine | 1d6 | 6 | → living room (already there) |
| 16 | R1 | Leo | routine | 1d6 | 3 | → dining room |
| 17 | R2 | Storyteller | temptation pick (1–2 Gristle, 3–4 Velvet, 5–6 Latch) | 1d6 | 2 | Gristle (resists) |
| 18 | R2 | Velvet | Distract Rosalind: Sweet 3 + K1 + C1 = 5 − Att 2 | 3d6 | 6 3 1 | **Clean**: distracted; +1 Cuddle |
| 19 | R2 | Latch | climb to the counter: Sneaky 2 + K1 − T1 (unseen) | 2d6 | 4 3 | **Scrape**: step done; noise |
| 20 | R2 | Gristle | cake cover: Savage 2 + K1 (fight) − T1 (unseen) | 2d6 | 6 6 | **Purrfect**: step done; +1 Cattitude |
| 21 | R2 | Dad | routine | 1d6 | 3 | stay (living room) |
| 22 | R2 | Aunt Rosalind | routine | 1d6 | 6 | → living room |
| 23 | R2 | Mia | routine | 1d6 | 2 | stay (living room) |
| 24 | R2 | Leo | routine | 1d6 | 3 | → dining room (already there) |
| 25 | R3 | Storyteller | temptation pick (1–3 Gristle, 4–6 Latch) | 1d6 | 3 | Gristle (resists) |
| 26 | R3 | Dad | routine | 1d6 | 3 | stay |
| 27 | R3 | Aunt Rosalind | routine | 1d6 | 4 | stay |
| 28 | R3 | Mia | routine | 1d6 | 6 | → living room (already there) |
| 29 | R3 | Leo | routine | 1d6 | 1 | stay |
| 30 | R4 | Storyteller | temptation pick (1–3 Gristle, 4–6 Latch) | 1d6 | 5 | Latch (resists) |
| 31 | R4 | Dad | routine | 1d6 | 6 | → living room (already there) |
| 32 | R4 | Aunt Rosalind | routine | 1d6 | 2 | stay |
| 33 | R4 | Mia | routine | 1d6 | 5 | → kitchen (walks in on the eaten cake: +1 Broom) |
| 34 | R4 | Leo | routine | 1d6 | 1 | stay |
| 35 | R5 | Storyteller | temptation pick (1–2 Gristle, 3–4 Velvet, 5–6 Latch) | 1d6 | 4 | Velvet (resists) |

**Totals:** 35 roll events and 42 dice. That is 12 creation rolls (15 dice), 3 cat rolls (7 dice), 4 temptation picks and 16 routine rolls. No rerolls were needed: no 5–6 came up on a rating die and no duplicate instinct. The round-5 House phase wasn't played, because the robbery ended when the last cat left.

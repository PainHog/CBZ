# Playtest: Grandpa Wendell's Catnip Mouse (Standard), gang of 5, rulebook v0.7, real dice

*2026-10-20 · First playtest of this house · Played strictly by the rulebook chapters (`book/src/chapters/21–27`, `31-ch11-storyteller.html`, `43-ch16-wendell-mouse.html`, `12-ch02-your-cat.html`) and the house map (`book/art/map-wendell-mouse.svg`, which carries the entrance list) · One agent played the Storyteller and all five players · Every die came from `crypto.randomInt` through a logging script and is listed in order in the Dice appendix · The simulator's engine was not read. `sim/BALANCE.md` was read only for the feel notes.*

*Note on the text: while this playtest ran, uncommitted edits appeared in chapters 5, 6, 10 and 11 and in `sim/houses.mjs`. I played the text as I first read it. I checked each edit afterwards, and none of them changes a ruling made here:*
- *"several noises in one room count as one": my kitchen noises only ever drew one human;*
- *a dozing human "stays put": that was already my ruling;*
- *the held-cat sight changes and the "outside again" chase: neither came up.*

## Summary

- **Outcome: Clean Getaway in round 3.** Under the five-cat rule the prize would have gone at the start of round 8, and Lights Out would have come at the end of round 10. The line:
  - **Round 1.** Mags jammed Pom-Pom's cat flap and the whole gang walked in. The flap's own noise pulled Grandpa out of the hall and into the kitchen.
  - **Round 2.** Pearl took the mouse out of the bag in the now-empty hall, and Sully picked it up.
  - **Round 3.** Tilly Distracted June, the only awake human in the kitchen. Sully walked the mouse through the kitchen and out of the flap, and everyone followed.
  - **Never met:** Pom-Pom, the robot vacuum, the round-4 move, Searching, the Den, the cellar and the drainpipe.
- **End Mood:** Broom 0/6, Cuddle 1/6, Patience 6 (7 − 1 for five cats). Nobody was Shooed, Scooped, Held, shut in or left behind. 6 of the gang's 10 Cattitude went unspent.
- **Rolls:**
  - **Cats:** 3 rolls (10 dice): 2 Clean, 1 Scrape, 0 Flop, 0 Purrfect, 0 Pushes.
  - **Storyteller:** 6 rolls: 2 June routines, 1 Grandpa routine, 2 Grandpa doze dice, 1 vacuum move. The 2 temptations were chosen, not rolled.
  - **Making the gang:** 49 roll events, 4 of them unused overshoot.
  - **Branch B:** 1 cat roll and 1 Storyteller roll. **Drill D:** 3 cat rolls and 9 Storyteller rolls.
- **Cat-turns: 15** (5 cats × 3 rounds). **7 active:** 3 with a roll, 2 helping, and 2 no-roll Actions that mattered (Sully picking the mouse up, and Sully carrying it out). **8 idle:** the cat only walked in, waited, or walked out. 2 temptations were resisted (−1 Cattitude each).
- **Branch B** tests the other reading of W-04: moving a Small prize costs the carrier's Action even when nobody sees it. It is still a **Clean Getaway, in round 4**: June finds the mouse in Sully's mouth and starts Searching, the Clock sends Grandpa Searching too, and one Savage haul out of the flap (5 dice, a Scrape) settles it. End Mood Broom 3/6, Cuddle 1/6.
- **Drill D** is a supplementary test of the half of the house the main line skipped. It starts at round 4 with the mouse just put down beside Pom-Pom. It is a **Clean Getaway at round 8 on 3 cat rolls**:
  - a flap "pop" (out and back in) pulled Grandpa away for free;
  - Pom-Pom fell to one unseen befriend roll;
  - two Distractions blinded the kitchen.
- **Issues: 21** (0 blockers, 7 major, 14 minor). **Top 5:**
  1. **W-01 (major):** Grandpa owns the mouse, but the hall is never on his routine. Once anything moves him, he never comes back. That breaks Chapter 12's own rule ("at least twice"), and it is why the hall was empty from round 2.
  2. **W-02 (major):** the gang's way in is a free lure. The jammed flap is noisy and next door to the hall, so walking in pulls the Clock's human off the prize in round 1, before any cat has done anything.
  3. **W-08 (major):** the exit is free. Once the flap is jammed nobody needs a roll to leave, a Small prize needs none unseen, and one Distraction blinds the kitchen. "Getting out is the hard part" was not true.
  4. **W-03 (major):** a jammed noisy flap is a noise machine with no roll and no mess. A cat steps out (Action) and back in (Move). It worked twice in Drill D.
  5. **W-04 (major):** "It is every carrier's Action for the round" doesn't say whether it covers a Small prize moved unseen. That decided round 3 against round 4 (Branch B).
- **Headline feel:** a smart gang plays this Standard house like an Easy one. The win took 3 rounds and 3 rolls, each on 3–4 dice, with nothing ever at stake. Pom-Pom is the star of the opener and the art, and she was optional. Five cats were not needed to swamp it: four would have done the same thing with one less helper die. The five-cat adjustments (Patience 6, gone round 8) never came into play.

## Gang

**Method:** Chapter 2's random method (`12-ch02-your-cat.html`), rolling everything:
- **Name:** a d6 on each column, rerolling the Name column when the name is already taken.
- **Looks:** coat on a d8 (real d8, no trick needed), then a d6 for the mark and a d6 for the eyes.
- **The 3:** a d6, then "move along" to an approach nobody has at 3 yet.
- **The 2:** a d6, counting along from the 3.
- **Instincts:** two d8s, rerolling a duplicate.
- **Body and quirk:** a d6 each.
- **Start:** Cattitude 2 and 9 Lives each.

| Cat | Body | Sneaky | Sweet | Savage | Streetwise | Instincts | Looks / quirk | Dice |
|---|---|---|---|---|---|---|---|---|
| **Lamppost Mags** | Chonky | 1 | 2 | 1 | **3** | Knocker, Lap Cat | Ginger tabby, old collar too big, amber eyes; hates the rain | #1 6 4; #2 3; #3 5 4; #4 4; #5 4; #6 2 5; #7 4 1 |
| **Two-Bin Sully** | Chonky | 1 | 1 | **3** | 2 | Box Sitter, Hunter | Ginger tabby, kinked tail tip, amber eyes; collects bottle caps | #8 2 6; #9 3; #10 3 3; #11 3; #12 2; #13 3 4; #14 5 2 |
| **Two-Bin Pearl** | **Lean** | **3** | 1 | 2 | 1 | Knocker, Climber | Calico, old collar too big, blue eyes; collects bottle caps | #15 2 3; #16 6; #17 5 5; #18 3 (Savage taken → Streetwise taken → Sneaky); #19 4; #20 2 7; #21 1 2 |
| **Lamppost Tilly** | Chonky | 1 | **3** | 1 | 2 | Scrapper, Hunter | Cream, white star, one eye of each colour; sleeps on the launderette roof | #22 6 4 (Mags taken); #26 4 (taken), #27 1; #23 8; #24 4 6; #25 4 (→ Sweet); #28 3; #29 8 4; #30 6 5 |
| **Gutter Joe** | Chonky | 1 | **3** | 2 | 1 | Foodie, Hunter | Calico, notch in one ear, green eyes; collects bottle caps | #31 3 6 (Sully taken); #35–#40 rerolls → 2; #32 6; #33 1 2; #34 2 (kept, W-09); #45 2; #46 6 6, #49 4; #47 4 2 |

**Gang name:** the **Lamppost Lot** (#48: 2).

**What the dice gave:**
- **One cat of each approach at 3, plus a second Sweet 3.** Joe is the fifth cat, so "move along" had nowhere to go (W-09).
- **Four Chonky cats and one Lean.** Only Pearl fits the cracked cellar window.
- **Three Hunters** (Sully, Tilly, Joe), so the vacuum tempts half the gang wherever it goes.
- **One Lap Cat** (Mags, for charming Grandpa) and **one Scrapper** (Tilly, tempted by Pom-Pom).
- **No Curious cat,** so the hall's temptation never fires.

**Gang-size setup (Chapter 11, five cats):** "Patience is 1 lower and the prize goes 1 round sooner."
- **Patience:** 7 → **6**.
- **Gone:** start of round 9 → **start of round 8**.
- **Lights Out:** the house page prints "End of round 11". Chapter 8 says "the end of the second round after" the gone round, so it becomes **end of round 10**.
- **The round-4 put-down:** I left it in round 4. The rule talks about when the prize *goes*, not when it moves (W-05).

## Play log

**House at the start:**
- **Hall:** Grandpa (Attention 0, dozes) holds the mouse in its bag. The front door is here (round 1 only, one cat).
- **Kitchen:** June (Attention 1). The microchip flap is here (jam it: Streetwise, Tricky; noisy). The door to the cellar is closed.
- **Living room:** Pom-Pom (rating 2, soft, guards it) and the robot vacuum.
- **Other entrances:** the cracked cellar window (Tight, no roll) and the drainpipe to the spare bedroom (Sneaky or Savage, Hard; climb).
- **The Den:** the bathroom.
- **Ways:** Hall–Living Big · Hall–Kitchen Big · Kitchen–Cellar Normal (door) · Hall–Landing Normal · Landing–Bedroom Big · Landing–Bathroom Big.
- **Meters:** Broom 0, Cuddle 0, Patience 6. Every cat starts with 2 Cattitude.

**The gang's plan:** get the mouse before round 4. Then they never have to deal with Pom-Pom, and the Clock never sends anyone Searching. Before round 1 I worked through the routines:
- **Grandpa** (1–4 stays put, 5 Living room, 6 Kitchen) never goes to the hall on his own. If anything moves him out, the hall is empty.
- **June** reaches the hall only on a 5.
- **Nobody** ever goes to the cellar, landing, spare bedroom or bathroom.

### Round 1

- **Prize Clock:** Grandpa puts the mouse, in its bag, in the hall and stays there "unless a noise draws them away".
- **Temptation:** none. Every cat is outside.
- **Entry choice.** I weighed the front door (Tilly, Sweet, plain, 3 dice). It is the only way to reach the hall in round 1. But the cat has no Action left once inside, and a Scrape would make noise in the hall. Grandpa is already there, so the closest human not already in the hall is June, and she would come. The gang skipped it. Everyone goes through the flap instead, and the flap's noise pulls Grandpa into the kitchen.
- **Mags jams the flap:** Streetwise 3, −1 Tricky, +1 Cattitude (2→1) = **3 dice → #50: 5 1 6 = Clean.**
  - The roll was made from outside, so I ruled June didn't see it (W-11). Either way a Clean Streetwise roll would only have added Broom 1.
  - The flap is jammed open "for everyone". Mags walks in (Move). The flap is noisy, so that's noise in the kitchen.
- **Pearl, Sully, Joe and Tilly** each walk in through the jammed flap (Move). That's four more kitchen noises.
  - Going through "an entrance that needs no roll" is free in view of June.
  - Their Actions have no use yet, so they stay idle.
- **House: Pets.**
  - Pom-Pom stays in her room.
  - The vacuum must move "into a random next room on its list". From the living room, the only next room on its list is the hall, so no roll is needed. It goes to the **Hall**.
- **House: Noise.** The first kitchen noise draws the closest awake human within two rooms who isn't already in the kitchen: **Grandpa** (hall, 1 room away). He goes to the kitchen and stays. The other noises have nobody left to draw.
- **House: Routines.**
  - **June: #51: 1 → stays in the Kitchen.**
  - Grandpa answered a noise, so he doesn't roll a routine. I still rolled his doze die (W-06): **#52: 3 → awake.**
- **Finding it:** the mouse is untouched in its bag, so nothing is found.
- **End of round 1:**
  - **Kitchen:** June, Grandpa and all five cats.
  - **Hall:** the mouse and the vacuum.
  - **Living room:** Pom-Pom.
  - **Mood:** Broom 0, Cuddle 0.
  - **Cattitude:** Mags 1, everyone else 2.

### Round 2

- **Prize Clock:** nothing this round.
- **Temptation.** Every cat is in the kitchen, which tempts Foodie (Joe) and Knocker (Mags, Pearl).
  - **Who:** I tempted **Pearl** with a mug on the edge of the table. She is the gang's Shadow and the obvious cat for the bag.
  - **Why her:** giving in would cost her the Action and add Broom +1 (seen), a mess (+1 more when June finds it) and noise.
  - **She resists** (Cattitude 2→1).
- **The cats:**
  - **Pearl** walks into the empty hall (Move). She takes the mouse out of the bag: Sneaky 3, −1 Tricky, +1 Mags helping = **3 dice → #53: 4 6 5 = Clean**, so it's quiet. Nobody is in the hall, so the Mood doesn't move.
    - She kept her last Cattitude to Push for a 6 if the roll had been a Scrape. A Scrape's noise would have brought a kitchen human into the hall to find the empty bag.
  - **Mags** walks to the hall and helps (her Action).
  - **Sully** walks to the hall and picks up the mouse. With nobody watching, that's a simple Action and no roll. He has no Move left, so he stays in the hall holding it.
  - **Tilly and Joe** wait in the kitchen (idle).
- **House: Pets.** The vacuum is in the hall, and its list gives two next rooms: 1–3 Living room, 4–6 Kitchen. **#54: 2 → Living room.**
- **House: Noise:** none.
- **House: Routines.**
  - **June: #55: 2 → stays in the Kitchen.**
  - **Grandpa: #56: 5 → Living room.**
  - **Grandpa's doze: #57: 2 → asleep** until the end of round 3, there in the living room.
- **Finding it.** The prize is disturbed: the step is done and Sully holds it. But nobody awake is in the hall (both the prize's room and the room where the Clock put it). **Not found.**
- **End of round 2:**
  - **Kitchen:** June, Tilly and Joe.
  - **Hall:** Pearl, Mags, and Sully holding the mouse.
  - **Living room:** Grandpa (asleep), Pom-Pom and the vacuum.
  - **Mood:** Broom 0, Cuddle 0.
  - **Cattitude:** Mags 1, Sully 2, Pearl 1, Tilly 2, Joe 2.

### Round 3

- **Prize Clock:** nothing this round (under my reading of W-05).
- **Temptation.**
  - **Who can be tempted:** the hall tempts only Curious, and none of the gang is Curious. The vacuum has left the hall. Pearl can't be tempted two rounds running anyway. In the kitchen, **Joe** (Foodie) is the only candidate.
  - **Who:** I tempted him with June's biscuits on the counter, because he is one of the two Sweet 3s the gang needs.
  - **He resists** (2→1) so that he can help.
- **The cats:**
  - **Tilly Distracts June:** Sweet 3, +1 Joe helping, +1 Cattitude (2→1), −1 June's Attention = **4 dice → #58: 3 4 3 5 = Scrape.** It works, with noise. June saw a Sweet roll: **Cuddle 1**. She is Distracted until the house's turn.
  - **Sully** walks the mouse from the hall into the kitchen (Move). "A Small prize only needs the roll when a human in either room can see it." The hall is empty and June sees nobody, so **no roll**. Then he goes out through the jammed flap. Going out through an entrance that needs no roll "can be your Move or your Action", so it's his Action, and it's unseen, so again no roll (W-04). **The mouse is outside.**
  - **Pearl and Mags** walk into the kitchen (Move) and out of the flap (Action).
  - **Tilly** walks out after Distracting (Move). **Joe** walks out after helping (Move).
- **No free cat is inside**, so the robbery ends at once, before the house's turn.
- **Result:** the prize is outside and nobody was left behind. **Clean Getaway, round 3.**
  - **End Mood:** Broom 0/6, Cuddle 1/6, Patience 6.
  - **Unspent Cattitude:** Mags 1, Sully 2, Pearl 1, Tilly 1, Joe 1.

**How lucky was it?** Each cat roll was the book's "7 in 8" or better to work:
- the jam: 3 dice;
- the step: 3 dice, with a Push in hand;
- the Distraction: 4 dice ("15 in 16").

The house's dice that could have hurt:
- June walking into the hall at the end of round 1 or round 2: 1 in 6 each.
- Pearl's step coming up a Scrape, which would draw a human to the empty bag. With the Push held back, a quiet Clean was about 2 in 3.

Grandpa's doze and his 5 didn't matter. If he had stayed in the kitchen awake, Mags (Lap Cat, 3 dice against Attention 0) would have Distracted him too, and every cat could still have walked out in round 3.

### Branch B: moving a Small prize unseen still costs the carrier's Action (W-04)

Same dice up to #58. Under this reading:
- **Round 3.** Sully's walk into the kitchen with the mouse uses his Action, so he can't go out this round.
  - The players keep Mags and Pearl in the kitchen with him as helpers. Tilly and Joe go out.
  - **House:** Grandpa is asleep, and June is already in the kitchen, so no noise draws anyone. **June: #59: 3 → stays.**
  - **Finding it:** June is awake and in the room the prize is in: **Broom 1**, and she starts **Searching**. Grandpa wakes at the end of the round.
- **Round 4.**
  - **The Clock:** the mouse isn't where the Clock last put it, so Grandpa goes to the hall, stays, and "finds it gone at once": **Broom 2**, and he starts Searching.
  - **Temptation:** I tempted Pearl (Knocker, kitchen). She resists (1→0).
  - **The haul:** Sully hauls the mouse out of the flap in view of the Searching June. A seen Small prize needs the roll (W-19). Savage 3 +2 helpers = **5 dice → #60: 1 4 4 5 1 = Scrape:** it works. Savage is always noticed: **Broom 3**.
  - Mags and Pearl walk out.
- **Result: Clean Getaway, round 4.** Broom 3/6, Cuddle 1/6.

### Branch C (sketch, no dice): the five-cat rule also moves the round-4 put-down to round 3 (W-05)

- **The problem.** The round-3 Clock entry would fall on a Grandpa who is asleep, and the book doesn't say whether a dozing human still does his Clock job (W-06).
- **If he doesn't:** this plays exactly like the main line.
- **If the Clock wakes him:**
  - He goes to the hall and finds Sully holding the mouse: Broom 1, and he starts Searching.
  - Mags (Lap Cat, 3 dice +1 Pearl helping, Attention 0) Distracts him, and Tilly Distracts June.
  - Sully still walks out unseen. Mags and Pearl end round 3 in the kitchen and walk out in round 4, which is free in view.
  - The likely result is still a Clean Getaway, in round 4.

### Drill D: the Pom-Pom half (supplementary, real dice)

The main line never reached the living room, so I played the second half of the house from a set position, greedily, with real dice. **This is not the robbery's result.**

**Starting position, round 4:**
- **People:** Grandpa awake in the hall. June in the kitchen. Pom-Pom and the vacuum in the living room.
- **The mouse:** the bag step was never done.
- **The gang:** all five in the kitchen, with the flap jammed.
- **Meters:** Broom 0, Cuddle 0, Patience 6.
- **Cattitude:** Mags 1, everyone else 2.
- **Clock:** gone at the start of round 8, Lights Out at the end of round 10.

**Round 4 (drill):**
- **The Clock:** Grandpa puts the mouse in the living room and stays.
- **Temptation.** I tempted **Joe** (Foodie) rather than Mags or Pearl (Knocker). A Knocker giving in makes noise in the kitchen, and that noise would pull Grandpa off the prize, a gift to the gang. Joe resists (2→1).
- **The cats.**
  - Tilly, Sully, Mags and Pearl walk into the empty hall and hide there (simple Actions, unseen).
  - **Joe pops the flap:** out through it as his Action, back in as his Move. That's two kitchen noises with no roll and no mess (W-03).
- **House.**
  - **Pets:** the vacuum is forced to the Hall.
  - **Noise:** Grandpa is drawn from the living room to the kitchen (2 rooms away; June is already there).
  - **June: #61: 5 → Hall.** She walks in on four hidden cats and sees nothing.
  - **Grandpa's doze: #62: 2 → asleep**, in the kitchen, until the end of round 5.

**Round 5 (drill):**
- **Temptation.** The vacuum in the hall tempts Hunters. I tempted **Tilly**, the gang's best Sweet cat. She resists (2→1).
- **Pom-Pom.** Tilly walks into the living room, where no human is, to befriend her. Mags and Sully walk in and help; I ruled that helping counts as dealing with her (W-15). Sweet 3, +2 helpers, +1 Cattitude (1→0): that's 6, capped at 5, then −2 for Pom-Pom's rating = **3 dice → #63: 6 5 2 = Clean.** Pom-Pom "leaves the whole gang alone for the rest of the robbery". Nobody saw it, so the Mood doesn't move.
- **The mouse.** Pearl walks in past June (walking is free) and picks up the mouse, a simple Action with no human in the room.
- **Joe pops the flap again** to pull June out of the hall.
- **House.**
  - **Vacuum: #64: 5 → Kitchen.**
  - **Noise:** June is drawn from the hall to the kitchen. Grandpa is asleep and hears nothing.
  - **Finding it:** nobody is in the living room, so the moved mouse isn't found.
  - Grandpa wakes at the end of the round.

**Round 6 (drill):**
- **Temptation.** I tempted Joe (Foodie, in front of both humans). He **gives in** (1→2). He eats a biscuit: **Broom 1**, quiet.
- **The cats.**
  - Pearl carries the mouse from the living room into the empty hall. Nobody sees it, so no roll.
  - Mags, Tilly and Sully walk to the hall and hide.
- **House.**
  - **Pets:** the vacuum is forced from the Kitchen to the Hall.
  - **June: #65: 2 → stays. Grandpa: #66: 1 → stays. Grandpa's doze: #67: 5 → awake.**
  - **Finding it:** nobody is in the hall or the living room, so nothing is found.

**Round 7 (drill):**
- **Temptation.** I tempted **Tilly** with the vacuum in the hall. She has 0 Cattitude, so she **must give in**: she chases it round the hall (noise; Cattitude 0→1). Then she walks to the kitchen.
- **Distracting June.** Sully walks in and helps Joe: Sweet 3, +1 Sully, +1 Cattitude (2→1), −1 Attention = **4 dice → #68: 5 4 3 1 = Scrape.** June is Distracted: **Cuddle 1**.
- **Distracting Grandpa.** Mags walks in: Sweet 2, +1 Lap Cat, +1 Cattitude (1→0), −0 Attention = **4 dice → #69: 4 6 2 3 = Clean.** Grandpa is Distracted: **Cuddle 2**.
- **The getaway.** Pearl walks the mouse into the kitchen, where nobody can see, and out of the flap. Joe walks out.
- **Stuck inside.** Sully, Mags and Tilly have no Move or Action left, so they stay in the kitchen.
- **House.**
  - **Noise.** Tilly's chase in the hall draws a human from the kitchen. June and Grandpa are both 1 room away, a tie. I sent **Grandpa**, the meaner pick, because it leaves June (Attention 1) with the cats. I ruled the Distraction ends when the house's turn starts (W-16).
  - **Vacuum: #70: 3 → Living room. June: #71: 5 → Hall. Grandpa's doze: #72: 6 → awake.**
  - **Finding it:** nobody is in the living room, where the Clock put the mouse, so nothing is found.

**Round 8 (drill):**
- **The prize.** The mouse is outside, so it counts as got before the "gone" round.
- **Temptation.** I tempted Mags (0 Cattitude, so she must give in). She knocks something off the empty kitchen table.
- **The getaway.** She, Sully and Tilly walk out through the flap.
- **Drill result: Clean Getaway** with Broom 1/6 and Cuddle 2/6, on 3 cat rolls.

**What the drill shows:**
- **Pom-Pom:** the soft house cat is one 3-dice roll for a five-cat gang, and that roll is unseen once the humans have been pulled out of her room.
- **The flap pop:** it moved a human exactly where the gang wanted, twice.
- **Grandpa's doze:** it covered a whole cat phase.
- **Not reached:** the vacuum ride (the vacuum was never in the carrier's room at a useful time), Pom-Pom chasing a cat back (the befriend worked), Searching and spotted, and the Den.

## Issues

| ID | Severity | Passage (file) | What I did | Suggested fix |
|---|---|---|---|---|
| W-01 | major | "Put the prize’s room on the routine of the human who owns it at least twice." (`32-ch12-making-a-house.html`) vs Grandpa: "Routine (d6): 1–4 stays put; 5 Living room; 6 Kitchen." (`43-ch16-wendell-mouse.html`) | The hall, where the mouse sits in rounds 1–3, is never on Grandpa's routine. "Stays put" holds him wherever a noise leaves him. Once the flap noise moved him (round 1), the hall was empty from round 2 on, apart from June's 1-in-6. This decided the main line. | Give Grandpa the Hall at least twice, e.g. "1–2 stays put; 3–4 Hall; 5 Living room; 6 Kitchen". |
| W-02 | major | "the human puts the prize in its place and stays in that room this round (unless a noise draws them away)" (`23-ch06-round.html`) with the map's "Pom-Pom's microchip cat flap (jam it open) — Normal; Streetwise, Tricky; makes noise" (`map-wendell-mouse.svg`) | The flap is the obvious way in and opens into the kitchen, next door to the hall. June is already in the kitchen, so every cat that walks in draws Grandpa off the prize in round 1, for free. I played it as written. | Put the flap where its noise can't reach the hall within two rooms (e.g. in the cellar), or say the round-1 put-down human ignores noise that round. |
| W-03 | major | "Going out through one that needs no roll can be your Move or your Action, so a cat can walk to the cat flap and out in one turn." and "a noise made on purpose leaves a mess" (`23-ch06-round.html`) | A cat goes out through the jammed noisy flap (Action) and back in (Move): two noises, no roll, no mess, and free in view. I used it in Drill D rounds 4 and 5, and both times it moved a human where the gang wanted. | Say a cat that goes out and back in through a noisy entrance in one round has made a noise on purpose (it leaves a mess), or can't do both in one turn. |
| W-04 | major | "A Small prize only needs the roll when a human in either room can see it. … It is every carrier’s Action for the round." (`25-ch08-prize.html`); Quick Reference: "hauling is every carrier's Action; Small only when seen" (`52-sheet-reference.html`) | It's unclear whether "It" means the haul roll or any move of the prize. Main line: only the roll costs the Action, so Sully walked hall → kitchen → outside in one turn. Branch B (the other reading) cost a round, two Searching humans and a roll. | Add: "A Small prize moved where no human can see it costs nothing extra: the carrier just walks." |
| W-05 | major | "With five, Patience is 1 lower and the prize goes 1 round sooner." (`31-ch11-storyteller.html`) vs the house Clock: "Start of round 4 … Start of round 9 Gone … End of round 11 Lights Out" (`43-ch16-wendell-mouse.html`) | Unclear whether the round-4 put-down also moves. I moved only "gone" (to 8) and Lights Out (to the end of 10, via Chapter 8). Branch C sketches the other reading, which lands the move on a sleeping Grandpa. The house page prints only the four-cat numbers, and "How it plays" says "before … round 4". | Say "only the Gone row moves (and Lights Out with it)", and print a "3 cats / 5 cats" line in each house's At a glance. |
| W-06 | major | "Dozes Each round on a 1–2 (extra d6), asleep until the end of the next round." (`43-ch16-wendell-mouse.html`); "Each round, on a 1–2 on an extra d6, falls asleep until the end of the next round: sees nothing, hears nothing." (`27-ch10-residents.html`) | The text doesn't say when the doze die is rolled, whether he rolls it in a round he answered a noise instead of his routine, or whether he does a Prize Clock job while asleep. I rolled it in the Routines step every round he was awake, after any move, and kept him in place while asleep. (An uncommitted edit now adds "and stays put".) In Drill D a doze covered a whole cat phase. | "Roll the doze die with his routine in the house's turn, even if he answered a noise; asleep, he skips his routine, and the Prize Clock wakes him." |
| W-07 | minor | "Give every room at least one result on some routine. A room nobody ever visits becomes a safe place to wait, and waiting is boring." (`32-ch12-making-a-house.html`) | The cellar, landing, spare bedroom and bathroom are on no routine, so only noise or Searching brings a human there. It didn't decide this game, but upstairs is a free safe zone. | Put the landing or bedroom on June's routine (e.g. her 6 "Kitchen", which repeats "stays put", becomes "Landing"). |
| W-08 | major | "Getting out is the hard part: plan the exit before you grab the mouse." and "Pom-Pom’s cat flap only opens for her microchip; jam it (Streetwise, Tricky) and it stays open for everyone." (`43-ch16-wendell-mouse.html`) | After one Tricky roll the flap is a free, no-roll exit for every cat, in view or not. The Small mouse needs no roll unless seen, and one Distraction of June (Attention 1) blinds the kitchen. The exit cost one roll in the main line. Neither Pom-Pom nor the round-4 move came into play. | Make the exit cost something, e.g. the jammed flap only lets one cat out per round, or June starts and stays in the kitchen as "Busy". |
| W-09 | minor | "In a gang of four or five, if another cat already has its 3 there, move along that list to the next approach nobody has at 3 yet … so the gang has one of each." (`12-ch02-your-cat.html`) | For the fifth cat every approach already has a 3. I kept Joe's roll (Sweet), so the gang has two Sweet 3s. | "A fifth cat keeps the approach it rolled." |
| W-10 | minor | "If another cat in the gang already has that name, roll the Name column again." (`12-ch02-your-cat.html`) | With four names taken, cat 5 took 6 rerolls (#35–#40) to land on one of the 2 free names. Cat 4 took 2. | "…roll it again, or pick a name nobody has yet." |
| W-11 | minor | "You are seen when you are in the same room as a human…" (`22-ch05-mood.html`) vs the front door's "(Sneaky, Hard, in view of the human the house names)" (`25-ch08-prize.html`) | Mags's jam roll was made from outside, with June on the other side of the flap. I ruled it unseen (no Broom) because only the front door says "in view". | Say whether an entrance roll is seen by the room it leads into. |
| W-12 | minor | "Pom-Pom’s cat flap only opens for her microchip; jam it (Streetwise, Tricky) and it stays open for everyone." (`43-ch16-wendell-mouse.html`) | The house text never says the flap is noisy, and never mentions the front door. Both appear only in the map legend. The noise was the decisive lure (W-02). | Add "It rattles (a noisy entrance)." and the front-door line to the house text. |
| W-13 | minor | "Landing–Bathroom Big" (`43-ch16-wendell-mouse.html`) vs "A Den: a room with a door" (`32-ch12-making-a-house.html`) and "its door stays shut while a cat is inside" (`26-ch09-caught.html`) | The Den's door isn't in the ways list or on the map. The map legend says "Doors drawn with a swing are closed", but no door swings are drawn anywhere. Not needed in play. | List "Landing–Bathroom Big (door, open)" and draw it, or reword the legend. |
| W-14 | minor | "Ride it A cat can hop on (a simple Action): it moves with the vacuum and counts as hidden while it rides." (`27-ch10-residents.html`) vs "A cat holding the prize can’t hide" (`22-ch05-mood.html`) | Not reached in play. Read literally, a carrier rides hidden (so a Searching human can't spot it), and the vacuum moves the mouse without a haul. Its route (Living room → Hall → Kitchen) is the mouse's escape route. I would have ruled a carrier rides but isn't hidden. | "A cat holding the prize can ride, but isn't hidden, and moving the prize this way is a haul if a human sees it." |
| W-15 | minor | House cat: "Guard Guards one room. A gang cat in that room must leave or deal with it before doing anything else." (`27-ch10-residents.html`) | The dog's "helping the cat who deals with it counts" and "chased back the way it came" aren't repeated for the house cat, which only gets "Beat it: As a dog". I ruled both apply, so Mags and Sully could help Tilly. | "Guard: like a dog's Charge (helping counts; a cat that ends its turn there without dealing with her is chased back)." |
| W-16 | minor | "If it works, that human is Distracted until the house’s turn" (`23-ch06-round.html`) | Unclear whether a Distracted human can answer a noise in that house's turn. I ruled the Distraction ends as the house's turn starts, so they can (Drill D, round 7: Grandpa was sent to the hall). | "…until the house's turn starts." |
| W-17 | minor | CORE-RULES: "The **front door** … lets in **one** cat: Sneaky past the human, or Sweet (they let you in)" (`docs/CORE-RULES.md`) vs "slip past their legs (Sneaky, Hard, …)" (`25-ch08-prize.html`) | The summary leaves out "Hard". I followed the chapter. | Add "Hard" to the CORE-RULES front-door sentence. |
| W-18 | minor | "Every cat starts each robbery with 2 Cattitude (take two tokens)." (`12-ch02-your-cat.html`) vs "2 Cattitude (3 in a gang of three)" (`21-ch04-rolling.html`) | Chapter 2 leaves out the three-cat exception. It didn't apply here. | Add "(3 in a gang of three)" to Chapter 2, step 7. |
| W-19 | minor | "and so is going in or out through an entrance that needs no roll" (free in view) (`22-ch05-mood.html`) vs "A Small prize only needs the roll when a human in either room can see it." (`25-ch08-prize.html`) | A carrier leaving through the jammed flap in view: Chapter 5 says free, Chapter 8 says a roll. In Branch B I applied Chapter 8 (Sully's 5-dice haul). | Chapter 5: "…needs no roll (unless you're carrying the prize, Chapter 8)." |
| W-20 | minor | "comes home from the pet shop with a paper bag" vs "Grab the mouse from the shopping bag in the hall"; Clock: "Step 1: Streetwise or Sneaky, Tricky." (`43-ch16-wendell-mouse.html`) | The bag changes name, and the Clock row never says what the step is. I read it as "get it out of the bag". | "Step 1: get it out of the paper bag (Streetwise or Sneaky, Tricky)." |
| W-21 | minor | "Simple things need no roll when no human can see you: … or make a noise on purpose. Seen, any of them is a roll" (`23-ch06-round.html`) with "6 Clean — It works, quietly." (`21-ch04-rolling.html`) | Making a noise on purpose in view is a roll, and a Clean result is "quietly". Not played: I used the flap instead (W-03). | "A noise made on purpose is noise, whatever the roll." |

*(21 issues: 0 blockers, 7 major, 14 minor.)*

## Feel notes

- **Was it fun?** For the players it was a neat heist: spot the lure, slip in, Distract, walk out, with a satisfying "that's it?" at the end. As a game it was flat:
  - no roll was ever at risk of a Shoo or a Scoop (Broom 0, Cuddle 1);
  - 8 of 15 cat-turns were idle;
  - the one real Storyteller lever was the temptation, and resisting it only cost Cattitude nobody needed.

  Pom-Pom, the vacuum and the dozing grandpa are charming, but the winning line meets none of them.
- **Was it Standard?** No: the main line played like an Easy house.
  - **Against Number 12 (Easy):** the earlier five-cat playtest there took 4 rounds and 6 rolls. This took 3 rounds and 3 rolls.
  - **Against the simulator:** `sim/BALANCE.md` gives this house about a 74% win with four cats (P9). The simulated gang presumably doesn't use the round-1 flap lure or the empty hall. A gang that reads the routines does much better than the simulated rate. It's worth checking whether the simulator's policy takes this line.
- **Was any line dominant?** Yes. *Jam the flap and walk in (Grandpa follows the noise into the kitchen), take the mouse from the empty hall, Distract June, walk out.*
  - **Every step is a roll of 3–4 dice.** Each one works 7 times in 8 or better.
  - **The risks are small:** June walking into the hall (1 in 6 a round) and a noisy Scrape on the bag step, which a Push can usually turn into a Clean.
  - **After round 4 (Drill D)** the flap pop (W-03) does the same job: pull the humans off the prize for free, befriend Pom-Pom unseen, and Distract the kitchen.
  - **The weaker routes:** the drainpipe and the cellar window are worse than the flap for every cat. The cellar window is even a trap for a lone Lean cat (a closed door, Streetwise 1 −1 Tricky = 0 dice).
- **Did five cats swamp it?** Not the way they swamped Number 12. The house didn't need a fifth cat. The line uses a jammer/helper (Mags), a Shadow (Pearl), a carrier (Sully) and a Distracter (Tilly), and the fifth cat (Joe) added only a helper die. The five-cat changes (Patience 6, gone round 8) never bit: the robbery ended with 4 Patience to spare and 5 rounds on the Clock. What five cats changed was the dice. Every important roll had a helper, which made the 2-dice rolls 3- and 4-dice rolls.
- **The vacuum** is fun in principle, but here it just shuttles. From the living room and the kitchen its only listed next room is the hall, so it's random only one round in two. Its real job was tempting the gang's three Hunters, and that only ever cost Cattitude. The ride never paid off: the vacuum never shared a room with the carrier at the right time.
- **Pom-Pom** is the house's best idea, but she is soft (Sweet befriends) and rating 2. With two helpers and a Cattitude, the befriend roll is 3 dice with nobody watching. Once befriended she's gone for good. A Scrapper in the gang (Tilly) just gives the Storyteller one more temptation.
- **For an 8-year-old:**
  - When does Grandpa's sleepy die happen, and does he still move? (W-06)
  - Why the page says round 9 and round 11 when the game is really round 8 and round 10. (W-05; kids will trust the printed number.)
  - Why five cats walking in makes Grandpa leave the mouse. It's funny once explained, but it isn't on the house page (W-12).
  - The befriend count, "6, capped at 5, then take away 2". Doing the cap before the take-aways is easy to get wrong.
  - "Move along" for the fifth cat in Chapter 2 (W-09).
  - The Name column reroll loop (W-10).

## Dice appendix

Every roll, in order, as logged in my private dice log before use. "Unused" marks batch overshoot: the loop rolled six dice at once and I used the first one that gave a free name (#40).

| # | Dice | Faces | Purpose | Used as |
|---|---|---|---|---|
| 1 | 2d6 | 6 4 | Cat 1 name | Lamppost Mags |
| 2 | 1d8 | 3 | Cat 1 coat | Ginger tabby |
| 3 | 2d6 | 5 4 | Cat 1 mark, eyes | Old collar, amber |
| 4 | 1d6 | 4 | Cat 1 the 3 | Streetwise 3 |
| 5 | 1d6 | 4 | Cat 1 the 2 | Sweet 2 |
| 6 | 2d8 | 2 5 | Cat 1 instincts | Knocker, Lap Cat |
| 7 | 2d6 | 4 1 | Cat 1 body, quirk | Chonky; hates the rain |
| 8 | 2d6 | 2 6 | Cat 2 name | Two-Bin Sully |
| 9 | 1d8 | 3 | Cat 2 coat | Ginger tabby |
| 10 | 2d6 | 3 3 | Cat 2 mark, eyes | Kinked tail, amber |
| 11 | 1d6 | 3 | Cat 2 the 3 | Savage 3 |
| 12 | 1d6 | 2 | Cat 2 the 2 | Streetwise 2 |
| 13 | 2d8 | 3 4 | Cat 2 instincts | Box Sitter, Hunter |
| 14 | 2d6 | 5 2 | Cat 2 body, quirk | Chonky; bottle caps |
| 15 | 2d6 | 2 3 | Cat 3 name | Two-Bin Pearl |
| 16 | 1d8 | 6 | Cat 3 coat | Calico |
| 17 | 2d6 | 5 5 | Cat 3 mark, eyes | Old collar, blue |
| 18 | 1d6 | 3 | Cat 3 the 3 | Savage taken → Streetwise taken → Sneaky 3 |
| 19 | 1d6 | 4 | Cat 3 the 2 | Savage 2 |
| 20 | 2d8 | 2 7 | Cat 3 instincts | Knocker, Climber |
| 21 | 2d6 | 1 2 | Cat 3 body, quirk | Lean; bottle caps |
| 22 | 2d6 | 6 4 | Cat 4 name | Lamppost Mags (taken) |
| 23 | 1d8 | 8 | Cat 4 coat | Cream |
| 24 | 2d6 | 4 6 | Cat 4 mark, eyes | White star, one of each |
| 25 | 1d6 | 4 | Cat 4 the 3 | Streetwise taken → Sneaky taken → Sweet 3 |
| 26 | 1d6 | 4 | Cat 4 Name reroll | Mags (taken) |
| 27 | 1d6 | 1 | Cat 4 Name reroll | Tilly → Lamppost Tilly |
| 28 | 1d6 | 3 | Cat 4 the 2 | Streetwise 2 |
| 29 | 2d8 | 8 4 | Cat 4 instincts | Scrapper, Hunter |
| 30 | 2d6 | 6 5 | Cat 4 body, quirk | Chonky; launderette roof |
| 31 | 2d6 | 3 6 | Cat 5 name | Gutter Sully (taken) |
| 32 | 1d8 | 6 | Cat 5 coat | Calico |
| 33 | 2d6 | 1 2 | Cat 5 mark, eyes | Ear notch, green |
| 34 | 1d6 | 2 | Cat 5 the 3 | Sweet 3 (kept, W-09) |
| 35 | 1d6 | 3 | Cat 5 Name reroll | Pearl (taken) |
| 36 | 1d6 | 3 | Cat 5 Name reroll | Pearl (taken) |
| 37 | 1d6 | 1 | Cat 5 Name reroll | Tilly (taken) |
| 38 | 1d6 | 3 | Cat 5 Name reroll | Pearl (taken) |
| 39 | 1d6 | 1 | Cat 5 Name reroll | Tilly (taken) |
| 40 | 1d6 | 2 | Cat 5 Name reroll | Joe → Gutter Joe |
| 41 | 1d6 | 1 | Cat 5 Name reroll | unused |
| 42 | 1d6 | 2 | Cat 5 Name reroll | unused |
| 43 | 1d6 | 1 | Cat 5 Name reroll | unused |
| 44 | 1d6 | 1 | Cat 5 Name reroll | unused |
| 45 | 1d6 | 2 | Cat 5 the 2 | Savage 2 |
| 46 | 2d8 | 6 6 | Cat 5 instincts | Foodie, duplicate |
| 47 | 2d6 | 4 2 | Cat 5 body, quirk | Chonky; bottle caps |
| 48 | 1d6 | 2 | Gang name | The Lamppost Lot |
| 49 | 1d8 | 4 | Cat 5 duplicate instinct reroll | Hunter |
| 50 | 3d6 | 5 1 6 | R1 Mags jams the flap: Streetwise 3 −1 Tricky +1 Cattitude | Clean |
| 51 | 1d6 | 1 | R1 June routine | Stays (Kitchen) |
| 52 | 1d6 | 3 | R1 Grandpa doze | Awake |
| 53 | 3d6 | 4 6 5 | R2 Pearl's bag step: Sneaky 3 −1 Tricky +1 Mags helping | Clean |
| 54 | 1d6 | 2 | R2 vacuum from the Hall | Living room |
| 55 | 1d6 | 2 | R2 June routine | Stays (Kitchen) |
| 56 | 1d6 | 5 | R2 Grandpa routine | Living room |
| 57 | 1d6 | 2 | R2 Grandpa doze | Asleep to end of R3 |
| 58 | 4d6 | 3 4 3 5 | R3 Tilly Distracts June: Sweet 3 +1 Joe +1 Cattitude −1 Attention | Scrape (works) |
| 59 | 1d6 | 3 | Branch B R3 June routine | Stays (Kitchen) |
| 60 | 5d6 | 1 4 4 5 1 | Branch B R4 Sully hauls out the flap: Savage 3 +2 helpers | Scrape (works) |
| 61 | 1d6 | 5 | Drill D R4 June routine | Hall |
| 62 | 1d6 | 2 | Drill D R4 Grandpa doze | Asleep to end of R5 |
| 63 | 3d6 | 6 5 2 | Drill D R5 Tilly befriends Pom-Pom: Sweet 3 +2 helpers +1 Cattitude (cap 5) −2 rating | Clean |
| 64 | 1d6 | 5 | Drill D R5 vacuum from the Hall | Kitchen |
| 65 | 1d6 | 2 | Drill D R6 June routine | Stays (Kitchen) |
| 66 | 1d6 | 1 | Drill D R6 Grandpa routine | Stays (Kitchen) |
| 67 | 1d6 | 5 | Drill D R6 Grandpa doze | Awake |
| 68 | 4d6 | 5 4 3 1 | Drill D R7 Joe Distracts June: Sweet 3 +1 Sully +1 Cattitude −1 Attention | Scrape (works) |
| 69 | 4d6 | 4 6 2 3 | Drill D R7 Mags Distracts Grandpa: Sweet 2 +1 Lap Cat +1 Cattitude | Clean |
| 70 | 1d6 | 3 | Drill D R7 vacuum from the Hall | Living room |
| 71 | 1d6 | 5 | Drill D R7 June routine | Hall |
| 72 | 1d6 | 6 | Drill D R7 Grandpa doze | Awake |

**Not rolled, because the book left no choice:** the vacuum's moves out of the Living room or the Kitchen, where the hall is the only listed next room (main R1; Branch B R3; Drill D R4 and R6).

**Chosen, not rolled:** the Storyteller's temptation picks, each explained in the play log. Main line: R2 Pearl, R3 Joe. Branch B: R4 Pearl. Drill D: R4 Joe, R5 Tilly, R6 Joe, R7 Tilly, R8 Mags.

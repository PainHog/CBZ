# Verification playtest: The Birthday Cake (Hard), rules v0.7, real dice

*2026-10-20. One agent played the Storyteller and all four players, strictly by the rulebook chapters (`book/src/chapters/21–27`, `13-ch03-ready-made-gang.html`, `31-ch11-storyteller.html`, `44-ch17-birthday-cake.html`) and the house map's legend (`book/art/map-birthday-cake.svg`). `docs/CORE-RULES.md` and `sim/houses.mjs` were read only to cross-check. The simulator's engine was not read. Every die came from Node's `crypto.randomInt`, through a private logging script, one numbered line per roll, logged before it was used. All 46 rolls are in the Dice appendix.*

*The rules changed while I was playing. At 14:04 the chapters 5, 6, 10 and 11 were edited (REVIEW rows 71–78; the summary is still labelled v0.7). The edit that matters here is "several noises in one room count as one". **The main line is unaffected.** Its only same-room double noise (round 3) drew the same one human under either text. Branch B was replayed from the point where the edit changes it, and the superseded rolls are kept and marked. Branch A is a sketch, and its Broom count comes out the same under either text.*

## Summary

- **Outcome: Clean Getaway at the end of the cats' turns in round 4** (the cake goes at the start of round 8, and Lights Out would be at the end of round 10). The gang came in through the ajar patio door. Captain the parrot saw them and squawked. The squawk drew Dad out of the kitchen, away from the cake he had just put down. With nobody else in the kitchen, round 2's two step rolls were unseen. In round 3 Big Biscuit (Chonky) heaved the cake into the dining room, and in round 4 he heaved it out through the patio. Nobody was Shooed, Scooped, Held, shut in or adopted.
- **End Mood:** Broom **4/5**, Cuddle **0/5**, Patience **5**. The gang finished one Broom step from a Shoo! that would have failed the last haul.
- **Rolls (main line):** the cats made **4 rolls and 2 Pushes** (25 dice). The results were 1 Clean, 2 Scrapes and 1 Flop, and both Pushes came up Clean. The Storyteller made **9 routine rolls** (9 dice), 3 temptation picks (chosen, not rolled) and no holder rolls. No Sweet roll was made all game.
- **Cat-turns:** 15 in all (4 cats in rounds 1–3, 3 in round 4). **9 were active**: 4 rolls, 4 helps and 1 pick-up. **6 were idle**: all four in round 1 (walking in was all they could do), Velvet in round 3 (she only walked out), and Tilly in round 4 (a forced give-in, then she walked out).
- **Issues: 19** (0 blockers, 5 major, 14 minor).
- **Branch A (decisive ambiguity: when Captain squawks).** If the squawk comes after the routines, the noise is a tie between Dad and Leo, and a mean Storyteller keeps Dad on the cake. The same carry line then reaches Broom 4/5 before the last haul. The haul was a Scrape, so the Shoo! failed the haul, the patio was shut and the cake went back on the counter. Played to round 4 with real dice; the most likely end is **Busted**.
- **Branch B (the house's own advice: eat it).** Played with real dice under the current text: **Messy Getaway in round 8**. The gang ate 4 of 8 portions in 5 eating rolls (plus 1 Push), had 1 Shoo! (Tilly, spotted), lost 1 Patience, and nobody was adopted. That is twice the rolls of the carry line, for a worse result.

**Top 5 issues**
1. **C7-01 (major): Dad's routine never returns to the kitchen, and the parrot pulls him off the cake in round 1 for free.** One unhidden cat in the dining room means a squawk, and Dad is the only human one room away. "Stays in that room this round (unless a noise draws them away)" does the rest. The squawk is a lure with no roll and no mess.
2. **C7-02 (major): carrying the cake out through the patio is the dominant line.** It took 4 rolls to a Clean in round 4. Every way is Big, the cake is Medium, Biscuit carries it alone, and the patio is a no-roll exit next to the cake's room. None of the house's Hard features touch this line: Rosalind's Attention 2 doesn't count against Savage, the two kids only double Cuddle, and this line has no Sweet roll. Meanwhile "How it plays" points players at eating half the cake.
3. **C7-03 (major): when does the parrot squawk?** "At the end of any round" (Ch10), but the house's turn deals with noise before the routines (Ch6). I played it in the Pets step. The other reading decided Branch A.
4. **C7-04 (major): who sees a haul between rooms?** The round-3 haul started in an empty kitchen and ended in front of three humans. I counted it as seen (+1 Broom) by borrowing the Small-prize "either room" test. Under "only the room you roll in", the gang ends on Broom 3/5.
5. **C7-05 (major): who may help a haul?** Ch8 says "the others help". The Quick Reference says "carriers help". I let two non-carriers help (5 dice). With carriers only, Biscuit hauls on 3 dice (4 with Cattitude), which makes a Flop 4× as likely.

**Dominant line at this house:**
- Round 1: everyone walks in through the patio and stands in Captain's view. The squawk empties the kitchen.
- Round 2: in the empty kitchen, do the counter and the cover (Push a Scrape to keep it quiet), and the Chonky cat picks the cake up.
- Round 3: haul it into the dining room on Savage with two helpers (5 dice). The spare cat walks out.
- Round 4: haul it out through the patio. The others walk out.

## Gang

The Bin Lid Gang, from Chapter 3, without Pip ("with four, leave out Pip"). The gang of 4 needs no gang-size changes: Patience 5, the cake goes at the start of round 8, Lights Out at the end of round 10, and each cat starts with 2 Cattitude and 9 Lives.

| Cat | Body | Sneaky | Sweet | Savage | Streetwise | Instincts | Role in the main line |
|---|---|---|---|---|---|---|---|
| **Two-Bin Tilly** | Lean | 2 | 1 | 1 | **3** | Curious, Climber | took the cake cover off (round 2) |
| **Big Biscuit** | **Chonky** | 1 | 1 | **3** | 2 | Scrapper, Foodie | carried the cake alone and led both hauls |
| **Velvet** | Lean | 2 | **3** | 1 | 1 | Lap Cat, Knocker | one help, then walked out (never rolled) |
| **Marmalade Mags** | Lean | **3** | 1 | 2 | 1 | Box Sitter, Hunter | got up on the counter (round 2), helped both hauls |

**House set-up** (Ch17 and its map):
- **Ways:** Hall–Kitchen, Hall–Living room, Hall–Dining room, Kitchen–Dining room, Kitchen–Utility room and Hall–Downstairs loo, all Big. There are no closed doors.
- **Entrances:**
  1. Front door (hall): Big; Sweet, or Sneaky Hard; rounds 1–2 only, one cat.
  2. Patio door (dining room): Big; no roll.
  3. Utility window: Normal; Sneaky or Savage, Tricky; a climb, so Small things only.
- **The cake:** Medium, 8 portions. In the kitchen from round 1: step 1 is the counter (Sneaky or Savage, Tricky) and step 2 the cover (Streetwise or Savage, Tricky). In the dining room from round 5: step 1 is the table (Sneaky or Savage, Tricky). Gone at the start of round 8.
- **Humans:**
  - Dad: Attention 1; starts in the kitchen; 1–3 stays put, 4 Dining room, 5 Hall, 6 Living room.
  - Aunt Rosalind: Attention 2; starts in the dining room; 1–4 stays put, 5 Kitchen, 6 Living room.
  - Mia: kid, Attention 1; starts in the living room; 1–2 stays put, 3 Dining room, 4 Hall, 5 Kitchen, 6 Living room.
  - Leo: kid, Attention 1; starts in the living room; 1–2 stays put, 3–4 Dining room, 5 Hall, 6 Living room.
- **Captain the parrot:** lives in the dining room.

**Things worth noticing before play:**
- **No routine in this house ever sends anyone to the Utility room.** Only Rosalind's 5 and Mia's 5 send anyone to the Kitchen. **Dad's routine has no Kitchen result at all.**

## Play log (main line)

Positions are given after each house's turn. "S" means Searching. CT is Cattitude.

### Round 1

- **Prize Clock:** Dad puts the cake on the kitchen counter (cover on) and stays in the kitchen this round "unless a noise draws them away".
- **Temptation:** none. Every cat is outside, and outside isn't a room.
- **Cats:** all four walk in through the patio. That's their Move, and it's free in view: "going in or out through an entrance that needs no roll". They are now in the dining room with Aunt Rosalind and Captain. No cat has a useful Action. Anything they did here would be a roll in view of Attention 2, so all four Actions are idle.
- **House's turn:**
  - Pets: Captain saw unhidden cats, so he squawks. I treat the squawk as made in the Pets step, like a bark (see C7-03).
  - Noise: the squawk (dining room) draws the closest awake human within two rooms who isn't already there. That's **Dad** (kitchen, 1 room); Mia and Leo are 2 rooms away. Dad goes to the dining room and stays. The cake is now alone.
  - Routines:
    - #1 Rosalind **3**: stays put (dining room).
    - #2 Mia **3**: Dining room.
    - #3 Leo **5**: Hall.
  - Finding it: nothing. The cake hasn't been touched.
- **After round 1:**
  - Dining room: Dad, Rosalind, Mia, Captain and all four cats.
  - Hall: Leo.
  - Kitchen: the cake, and nobody else.
  - Broom 0, Cuddle 0.

### Round 2

- **Temptation:** the dining room tempts Hunters (Mags) and Climbers (Tilly). The Storyteller tempts **Tilly** ("the balloons on the curtain rail"), because she has the gang's best roll for the cover (Streetwise 3 + Curious). She resists: CT 2 → 1.
- **Cats** (in this order; walking past the humans is free):
  - **Velvet** moves into the kitchen. Her Action is to help Mags.
  - **Mags** moves into the kitchen. The kitchen is empty, so the roll is unseen. Step 1, the counter, Sneaky: 3 + 1 (Velvet helps) + 1 (CT, 2 → 1) − 1 (Tricky) = **4 dice**.
    - #4: **3 6 4 2**, a **Clean**. She's up, quietly.
  - **Tilly** moves into the kitchen. Step 2, the cover, Streetwise: 3 + 1 (Curious: "open") + 1 (CT, 1 → 0) − 1 (Tricky) = **4 dice**.
    - #5: **3 4 2 3**, a **Scrape**. The cover is off, but it made a noise. Noise in the kitchen would draw someone from the dining room or the hall, who would find the touched cake (+1 Broom and Searching). Tilly has no Cattitude left, so she **Pushes and pays 1 Broom step**, "even if nobody saw".
    - #6, rerolling all 4: **1 3 6 5**, a **Clean**. It's quiet now. **Broom 0 → 1** from the Push.
  - **Biscuit** moves into the kitchen and **picks the cake up**: a simple Action, since nobody can see him. He is Chonky, so he carries a Medium prize alone. Getting it down isn't climbing.
- **House's turn:**
  - Pets: Captain saw the cats at the start of the round, before they left, so he squawks (see C7-06).
  - Noise: the squawk draws **Leo** (hall, 1 room) into the dining room.
  - Routines:
    - #7 Dad **4**: Dining room, where he already is.
    - #8 Rosalind **4**: stays put.
    - #9 Mia **4**: Hall.
  - Finding it: the cake is disturbed, but nobody is in the kitchen, which is both its room and the Clock's room. **No find.**
- **After round 2:**
  - Kitchen: all four cats, Biscuit holding the cake.
  - Dining room: Dad, Rosalind, Leo, Captain.
  - Hall: Mia.
  - Broom 1/5. CT: Tilly 0, Biscuit 2, Velvet 2, Mags 1.

### Round 3

- **Temptation:** the kitchen tempts Foodies (Biscuit) and Knockers (Velvet). Tilly can't be tempted two rounds running. The Storyteller tempts **Biscuit**, the carrier ("a plate of sausage rolls on the side"). If he gave in he would drop the cake. He resists: CT 2 → 1.
- **Cats:**
  - **Haul, kitchen to dining room.** Biscuit leads, Savage: 3 + 1 (Mags helps) + 1 (Tilly helps) = **5 dice**, plain. Who sees it? The kitchen is empty, but the dining room holds Dad, Rosalind and Leo. I count the haul as seen by either room (C7-04). Savage ignores Attention.
    - #10: **5 4 4 3 2**, a **Scrape**. It works, and the noise is in the dining room. **Broom 1 → 2.**
    - No Push. A Push could only help on a Purrfect (20%), it risks a Flop (3%), and Biscuit's last Cattitude is better kept as insurance for round 4.
  - **Mags** and **Tilly** helped (their Actions), then use their Moves to follow the cake into the dining room.
  - **Velvet** moves into the dining room and walks out through the patio as her Action ("can be your Move or your Action"). She is outside and safe.
- **House's turn:**
  - Pets: Captain squawks.
  - Noise: the haul's Scrape and the squawk are both in the dining room. Under the old text they are two noises; under the current text they count as one. Either way, the only human in range who isn't already there is **Mia** (hall). She comes in. Nobody else is free.
  - Routines:
    - #11 Dad **6**: Living room.
    - #12 Rosalind **3**: stays put.
    - #13 Leo **5**: Hall.
  - Finding it:
    - Spotted: nobody is Searching yet.
    - The prize: it's held, so it isn't where the Clock put it. Rosalind and Mia, in its room, **find it: Broom 2 → 3**, and both start **Searching**.
    - Messes: none.
- **After round 3:**
  - Dining room: Rosalind (S), Mia (S), Captain, Biscuit with the cake, Mags, Tilly.
  - Hall: Leo.
  - Living room: Dad.
  - Outside: Velvet.
  - Broom 3/5.

### Round 4

- **Temptation:** the dining room tempts Mags (Hunter) and Tilly (Climber). Biscuit can't be tempted two rounds running. The Storyteller tempts **Tilly**, who has 0 Cattitude and must give in. That removes a helper from the last haul.
  - Tilly gives in, and the tempted cat goes first. She goes up the curtains: quiet and hidden, no Mood step, CT 0 → 1. Then she uses her Move to walk out through the patio.
- **Cats:**
  - **Haul out through the patio.** The patio has no roll, so the haul's own roll applies. Biscuit leads, Savage: 3 + 1 (Mags helps) = **4 dice**. He keeps his last Cattitude for a Push. It's seen by Rosalind and Mia, so Clean or Scrape adds 1 Broom (4/5). A Flop adds 2 (5/5), which means a Shoo!, a failed haul and the patio shut.
    - #14: **2 1 1 2**, a **Flop**.
    - He **Pushes, paying his last Cattitude** (CT 1 → 0).
    - #15: **2 4 3 6**, a **Clean**. Biscuit and the cake go out through the patio. **Broom 3 → 4.**
  - **Mags** helped (her Action), then walks out through the patio (her Move).
- **No free cat is inside, so the robbery ends at once.** The cake is outside and nobody was left behind: **Clean Getaway.**
- **Final:** Broom 4/5, Cuddle 0/5, Patience 5. CT left: Tilly 1, Biscuit 0, Velvet 2, Mags 1 (lost at the end).

### Branch A: the squawk comes after the routines (decisive ambiguity C7-03)

Reading: "At the end of any round it saw a cat … it squawks." Here the squawk is the last noise of the house's turn, dealt with after the routines and before Finding it.

- **A-R1:**
  - Dad stays (Prize Clock).
  - Routines #1–#3 stand: they were rolled in the same state. Rosalind stays, Mia goes to the dining room, Leo to the hall.
  - The squawk then has two candidates one room away: **Dad (kitchen) and Leo (hall)**. A mean Storyteller sends Leo. **Dad stays with the cake.**
- **A-R2:**
  - The Storyteller tempts Tilly, and she resists (CT 1).
  - **Velvet** moves into the kitchen and distracts Dad. Sweet 3 + 1 (Lap Cat) + 1 (CT) − 1 (Dad's Attention) = **4 dice**.
    - #33: **5 5 1 5**, a **Scrape**. Dad is Distracted. **Cuddle 1** (no kid sees it), and it makes a noise.
  - **Mags**, step 1, unseen thanks to the distraction: Sneaky 3 + 1 (CT) − 1 (Tricky) = **3 dice**.
    - #34: **4 2 3**, a **Scrape**. Done, with noise.
  - **Tilly**, step 2: Streetwise 3 + 1 (Curious) + 1 (CT) − 1 (Tricky) = **4 dice**.
    - #35: **6 1 1 4**, a **Clean**.
  - **Biscuit** picks the cake up, unseen.
  - House's turn:
    - The kitchen noises draw Rosalind. I first played them as two noises, drawing Rosalind and Mia; the re-check under the current text, where they count as one, leaves Mia to roll #46 **4** (Hall).
    - #36 Dad **2**: stays (kitchen).
    - #37 Leo **4**: Dining room.
    - The squawk draws the last free human in range to the dining room.
    - Finding it: the kitchen humans (Rosalind, and Dad on the re-check) find the cake: **Broom 1**, and they start Searching.
- **A-R3:**
  - Biscuit resists the temptation (CT 1).
  - **Haul to the dining room**, Savage, 5 dice. Seen from both rooms.
    - #38: **2 3 3 4 2**, a **Scrape**. **Broom 2.**
  - Velvet walks out.
  - House's turn:
    - The Searchers follow the cake (one by noise, one by "step into its room").
    - #39 Dad **4** and #40 Leo **4**: both stay with the cake in the dining room.
    - Finding it: **spotted +1 (3)**, then the dining-room humans **find it +1 (4)**.
- **A-R4:**
  - Broom 4/5, so any Mood step fills it. Only a Purrfect gets the cake out. Tilly is tempted at 0 CT, gives in and walks out.
  - Biscuit hauls on 4 dice and keeps his Cattitude, so he can Push any non-Purrfect looking for two 6s. That gives a 36% chance overall, against 20% for spending the Cattitude on a 5th die.
    - #41: **2 2 5 2**, a **Scrape**.
    - He Pushes (CT).
    - #42: **5 4 2 3**, a **Scrape**.
  - **Broom 5/5, and Rosalind Shoos Biscuit through the patio and shuts it.** The haul fails. The cake goes back on the kitchen counter with its cover on. Broom 0, Patience 4. Mags is stranded in the dining room with four Searchers.
- **What comes next (estimated, not rolled):**
  - The patio is shut. The utility window takes Small things only. The front door is closed after round 2. So the cake can never go out.
  - From round 5 it sits on the dining table, ringed by four Searchers, with Patience 4. Four portions would have to be eaten in rounds 5–7 by Mags (Savage 2), plus cats climbing back in through the utility window.
  - My estimate is under a 1-in-4 chance of Messy. **Most likely Busted.**

### Branch B: the book's plan, "eat half the cake" (strategy comparison)

Same as the main line until round 2's last Action. Biscuit eats instead of picking up. From the round-4 house's turn on, this is replayed under the current text ("several noises in one room count as one"). The 7 superseded rolls (#26–#32) are marked in the appendix.

- **B-R2:**
  - **Biscuit eats**, Savage 3 + 1 (Foodie) = **4 dice**, unseen.
    - #16: **4 1 5 2**, a **Scrape**. He Pushes, paying CT (2 → 1).
    - #17: **4 1 1 2**, a **Scrape**. One portion eaten (**7 left**), with noise.
  - House's turn:
    - The kitchen noise draws **Rosalind**. Rosalind, Dad and Mia are all 1 room away, and a mean Storyteller picks the highest Attention.
    - The squawk draws **Leo** from the hall into the dining room.
    - #18 Dad **1**: stays put.
    - #19 Mia **5**: Kitchen.
    - Finding it: **+1 (Broom 2)**. Rosalind and Mia start Searching.
- **B-R3:**
  - Biscuit is tempted and resists (CT 0).
  - The gang lures both Searchers off the cake:
    - **Tilly** walks into the dining room, to make Captain squawk (a lure with no mess).
    - **Mags** walks into the utility room and makes a noise on purpose (a simple Action, unseen; it leaves a mess).
    - Biscuit and Velvet sit still.
  - House's turn:
    - The utility noise draws **Rosalind**.
    - The squawk draws **Mia** to the dining room.
    - #20 Dad **6**: Living room.
    - #21 Leo **1**: stays put (dining room).
    - Finding it: **spotted +1 (3)**; nobody is in the kitchen; the **mess +1 (4)**.
  - Searchers still answer noise (C7-13), so the kitchen is empty for round 4.
- **B-R4:**
  - Velvet is tempted (Knocker) and resists (CT 1).
  - All four eat, unseen. These were chosen in advance and rolled together:
    - **Biscuit**, Savage 4 dice. #22: **5 1 1 4**, a Scrape: eaten.
    - **Velvet**, Sneaky 2 dice. #23: **1 4**, a Scrape: eaten.
    - **Mags**, Sneaky 3 dice. #24: **4 4 1**, a Scrape: eaten.
    - **Tilly**, Sneaky 2 dice. #25: **3 1**, a Flop: not eaten.
  - **4 portions left, so half the cake is eaten and a Messy Getaway is locked in.** Biscuit and Velvet then move into the hall.
  - House's turn (current text):
    - The four kitchen noises count once and draw **Leo**.
    - The squawk draws Dad from the living room to the dining room. Dad and Rosalind tie at 2 rooms, and the Storyteller picks Dad.
    - Rosalind and Mia step back into the kitchen to be with the cake.
    - Finding it: **spotted fills Broom (5/5)**.
      - The Storyteller picks Tilly, the gang's door-opener.
      - Rosalind Shoos her out through the patio. The patio and the utility window are tied for nearest, and a mean Storyteller picks the patio. **Patio shut.**
      - Broom 0, **Patience 4**.
    - Then Leo finds the cake: **Broom 1**, and he starts Searching.
- **B-R5:**
  - The Clock: Dad carries the cake to the dining table.
  - Mags slips into the utility room and hides. Biscuit and Velvet hide in the hall.
  - Mia and Leo follow the cake. Dad finds it: **Broom 2**, and he starts Searching.
- **B-R6:**
  - **Mags climbs out through the utility window**: Sneaky 3 + 1 (CT) − 1 (Tricky) = 3 dice.
    - #43: **2 5 6**, a **Clean**.
  - Biscuit and Velvet move into the kitchen and hide.
- **B-R7:**
  - Velvet is tempted and resists (CT 0).
  - Biscuit and Velvet move into the utility room and hide. All four humans are guarding the cake.
- **B-R8:**
  - The cake is gone.
  - **Biscuit climbs out**: Savage 3 − 1 = 2 dice. #44: **3 4**, a **Scrape**: out.
  - **Velvet climbs out**: Sneaky 2 − 1 = 1 die. #45: **5**, a **Scrape**: out.
- **The robbery ends in round 8: Messy Getaway**, 4/8 eaten, nobody adopted. End Mood: Broom 2/4, Cuddle 0/4, Patience 4.
- **Under the old text** (all four kitchen noises drawing all four humans), the branch also ended Messy. That was in round 9, with Velvet meowing her way out past four Searchers (#27, Cuddle +2).

## Issues

| ID | Severity | Passage (file) | What I did | Suggested fix |
|---|---|---|---|---|
| C7-01 | major | Dad: "**Routine (d6):** 1–3 stays put; 4 Dining room; 5 Hall; 6 Living room." (`44-ch17-birthday-cake.html`) + "the human puts the prize in its place and stays in that room this round (unless a noise draws them away)" (`23-ch06-round.html`) + "At the end of any round it saw a cat that wasn’t hidden, it squawks: noise in its room." (`27-ch10-residents.html`) | The whole gang walked in by the free patio. Captain squawked, and Dad was the only human one room away, so he left the cake in round 1. His routine has no Kitchen result, so he never wandered back. Rounds 2–3 in the kitchen were unseen. | Give Dad a way back to the cake (e.g. "1–3 Kitchen"), or say "the Clock's human doesn't answer the parrot in the round they put the prize down". |
| C7-02 | major | "Eating half the cake is a Messy Getaway — and at this house that’s a good night." (`44-ch17`) + "Medium: one Chonky cat, or two cats; Normal and Big ways" and "It’s plain unless the house says otherwise" (`25-ch08-prize.html`) + all six ways Big and "The patio door is open and needs no roll" (`44-ch17`) | Carried it out: 2 step rolls and 2 Savage hauls, Clean in round 4, 4 rolls. The house's Hard features never applied: no Sweet roll, and no Sneaky roll in Rosalind's view. Eating (Branch B) took 5 eating rolls for half the cake. | Make the cake awkward to move ("Hauling the cake is Tricky: it wobbles"), or make the patio haul a roll ("the step down to the garden: Savage, Tricky"), and simulate it against the Hard target. |
| C7-03 | major | "At the end of any round it saw a cat that wasn’t hidden, it squawks" (`27-ch10`) vs the house's turn "Pets, then noise, then the humans’ routines" and "So do noisy entrances such as … squawking parrots" (`23-ch06`); Ch11's checklist and the tracker's Pets step don't mention the parrot. | Squawked in the Pets step, so it was dealt with in the same round's noise step, before the routines. Under the other reading (after the routines) Dad and Leo tie for it in round 1 and Dad stays with the cake. Branch A then ends on a Shoo! with the patio shut. | "Parrot: in the Pets step, if it saw a cat that wasn't hidden this round, it squawks (a noise in its room)." |
| C7-04 | major | "A Small prize only needs the roll when a human in either room can see it." and "It works: everyone moves, prize and all, and any noise is in the room it ends up in." (`25-ch08`) | The round-3 haul went from an empty kitchen into a dining room with three humans. I counted it as seen, taking Attention and Mood from humans in either room: +1 Broom. Under "seen only where you roll", the gang ends on Broom 3/5 and round 4's Push could have been paid in Broom. | "A haul is seen by any human in the room it leaves or the room it enters." |
| C7-05 | major | "One carrier rolls Sneaky (quietly) or Savage (heave); the others help (+1 die each)." (`25-ch08`) vs "Sneaky or Savage; carriers help" (`52-sheet-reference.html`) vs "one cat leads and rolls; up to two others help" (`21-ch04-rolling.html`) | Let non-carriers (Mags, Tilly) help Biscuit's hauls, then use their own Moves to follow. With carriers only, Biscuit hauls on 3 dice (4 with Cattitude), and a Flop goes from 3% to 12.5%. | "Any cat in the room may help a haul (+1 die, its Action); only carriers move with the prize." Fix the Quick Reference to match. |
| C7-06 | minor | "At the end of any round it saw a cat that wasn’t hidden" (`27-ch10`) | Counted cats who started the round in the dining room and walked out on their turn (round 2) as seen: a squawk. It drew Leo in, which didn't matter. | "…saw a cat that wasn't hidden at any time this round." |
| C7-07 | minor | "A prize’s spot can take several steps: up on the counter, then the foil off." … "Each carrier picks it up as its Action." (`25-ch08`) | Required both steps, counter and cover, before picking the cake up. If carrying a covered cake is allowed, the carry line is 3 rolls, and Tilly's Push (1 Broom) was wasted. | "You can take or eat the prize only once every step of its spot is done." |
| C7-08 | minor | "slip past their legs (Sneaky, Hard, in view of the human the house names)" (`25-ch08`); the cake only says "The front door keeps opening for guests" (`44-ch17`) | Not used, because the patio is free. Guests have no Attention, and nothing says whether their seeing a roll fills the Mood (v0.3 I-16). | "Front door (rounds 1–2): the guests have Attention 0 and fill no meter." |
| C7-09 | minor | "chases that cat out through the nearest entrance (Storyteller’s pick if two are as near) — then shuts it" (`22-ch05-mood.html`) | Branch B: from the kitchen, the patio and the utility window are tied for nearest, and a mean Storyteller shut the patio. That is the only door the cake fits through, so it turned the house into eat-only. Also unclear: is the front door an "entrance" for a Shoo! after round 2? If it is, a sacrifice in the hall resets Broom without closing the patio. | Say whether a Shoo! may use an entrance outside its rounds. Suggest that ties go to the entrance the cat came in by. |
| C7-10 | minor | same passage (`22-ch05`) | Where the Shooing human ends up isn't stated. I put Rosalind in the room of the door she shut (Branch B), which mattered for who found the cake that turn. | "The human ends in the room of that entrance." |
| C7-11 | minor | "the human puts it back where the Prize Clock last put it (wrapped again, if it was wrapped)" (`22-ch05`) + "A step done stays done for the whole gang." (`25-ch08`) | Branch A: after Biscuit's Shoo! the cover went back on (step 2 undone). Does "up on the counter" (step 1) also need redoing? I would have said no. | "When the prize is put back, its spot's steps must be done again", or "only the wrapping comes back". |
| C7-12 | minor | "The prize is got — outside, or every portion eaten" (`25-ch08`) | Not tested: can half a cake carried out count as "got"? If it can, the greedy combo is to eat 4 portions (Messy locked in), then haul the rest out for a Clean. | Say it: "A part-eaten prize carried outside is got." |
| C7-13 | minor | Noise "draws the closest awake human within two rooms who isn’t already in that room and isn’t holding a cat" (`23-ch06`) vs Searching "stay put if it’s in their room" (`23-ch06`) | Branch B round 3: a mess lure plus the parrot pulled both Searchers off the cake, and three portions were eaten unseen next round (v0.6 V6-02; REVIEW row 70 kept this on purpose). | If it stays, say so in the Searching list: "A Searching human still answers noise." |
| C7-14 | minor | "Sneaky to eat it quietly, Savage to wolf it down (a Foodie’s Knack)." (`25-ch08`) | Gave Biscuit's Savage eating the Foodie die. The parenthetical reads as "Savage only", but the instinct table says "find, steal and eat food" (REVIEW row 77 says food gets the Foodie's Knack). | "…Savage to wolf it down. A Foodie gets its Knack either way." |
| C7-15 | minor | "several noises in one room count as one" (`23-ch06`, edited during this playtest) | Branch B round 4: four eating Scrapes in the kitchen drew one human (under the old text, all four). That makes "everyone eats at once, in one room" the strong play. Also unstated: do several on-purpose noises in one room leave one mess or several? | Run it in the simulator against the eat-everything-at-once line, and add "…and leave one mess". |
| C7-16 | minor | "When a meter fills without a roll …, the Storyteller picks which cat that human can see gets it." and "If a meter fills and no human with free hands can see a cat, it stays full: the next cat seen on that side gets it. The Storyteller picks the cat at once, before anyone acts again." (`22-ch05`) | Branch B: Rosalind and Mia both spotted, so I gave the broom to the higher Attention (Rosalind). "Stays full … the next cat seen" and "picks the cat at once" read as contradictory. | "The Searching human with the highest Attention holds the broom", and "When a cat is next seen, the Storyteller picks it at once." |
| C7-17 | minor | Ch11's checklist: "Someone new beside the disturbed prize: +1 Broom, and Searching" and "Pets: wake sleeping dogs near noise; a dog with a cat in its room barks; roll the others’ routines." (`31-ch11-storyteller.html`); the tracker says the same (`51-sheet-tracker.html`) | Followed Ch6, which says "in the room the prize is in, or in the room where the Clock put it". "Beside" is narrower, and the parrot is missing from the Pets step. | Write "in the prize's room or its Clock room", and add "a parrot that saw a cat squawks" to the Pets line. |
| C7-18 | minor | "The robbery starts with every cat outside." (`25-ch08`) and the prize is held until round 1's Clock | Round 1 had 4 idle Actions (v0.3 had the same). Velvet, the Charmer, rolled nothing on the winning line, and Cuddle stayed at 0 at the "kids double Cuddle" house. | Design note: give round 1 something to do (a yard temptation, a guest to charm at the front door), and make the cake line need a Sweet beat. |
| C7-19 | minor | "Resist. Spend 1 Cattitude." + "Anything left at the end is lost" (`24-ch07-instincts.html`, `21-ch04`) | Round 4: had the Storyteller tempted Mags instead of Tilly, resisting would have cost Mags nothing real (her Cattitude was about to be lost). That's why a mean Storyteller tempts the cat with 0 Cattitude (v0.3 I-11, still true). | Fine as a tactic. Mention it in "Tempting fairly": "late in the robbery, tempt the cat who can't pay". |

**CORE-RULES vs the chapters:** I found no disagreement that affected play. The summary leaves out the new "The Storyteller picks the cat at once, before anyone acts again" (Ch5) and doesn't place the parrot in the house's turn (same gap as C7-03).

## Earlier-issues status (v0.3 cake playtest, I-01 to I-23)

| v0.3 issue | Status in v0.7 | Notes from this run |
|---|---|---|
| I-01 Prize Clock vs routines | **Fixed, but a new gap** | The Clock now acts first and Dad stays, but a noise still draws him away, and the parrot provides one for free (C7-01). |
| I-02 Noise in a room with a human does nothing | Fixed | "isn't already in that room", order, ties. Used 6 times. |
| I-03 Giving in has no effect | Fixed | The give-in table works. A forced give-in at 0 CT is the Storyteller's best tool (C7-19). |
| I-04 Steps for the whole gang | Fixed | "A step done stays done for the whole gang." Biscuit took the cake without climbing. |
| I-05 What an entrance uses up | Fixed | Move; a rolled entrance takes Move and Action; leaving can be the Action (Velvet in round 3). |
| I-06 Several watchers / who Shoos | Fixed | Highest Attention only; the highest Attention Shoos. |
| I-07 Do hiding spots exist? | Fixed | "Every room has somewhere to hide … unless the house says it hasn't." |
| I-08 Push paid in Mood when unseen | Fixed | "even if nobody saw". Tilly paid 1 Broom in round 2. |
| I-09 Walking in on the disturbed prize | Fixed (replaced) | Finding it at the end of the house's turn. It decided round 3 (+1). |
| I-10 Move/Action order | Fixed | "either way round" |
| I-11 Giving in, then walking out / resisting at the end | Partly | Giving in is now "before you move", but Tilly still walked out right after. Resisting late is still nearly free (C7-19). |
| I-12 The parrot | **Fixed, but a new gap** | It now has a cover roll and a squawk, but when it squawks is unclear (C7-03), and so is what "saw" means (C7-06). |
| I-13 One room or straight there | Fixed | "moves them straight to that room" |
| I-14 Gang size | N/A | Gang of 4. |
| I-15 Random cat creation | Fixed (not tested) | Used the ready-made gang. |
| I-16 Front door rounds / guests | Partly | The rounds are fixed (1–2), but the guests' Attention and Mood still aren't given (C7-08). |
| I-17 Getting it down isn't climbing | Fixed | Used in round 2. |
| I-18 Nearest-entrance tie | Fixed | "Storyteller's pick", but the pick can shut the only cake-sized exit (C7-09). |
| I-19 Holder's routine / Den door side | Fixed (not reached) | |
| I-20 A kid doubling a Flop on Cuddle | Mostly fixed (not reached) | "doubles Cuddle steps" (CORE: "once"). A Flop landing on Cuddle with a kid watching would presumably be 4; it's not spelled out. |
| I-21 Repeated Distracts | Fixed | "Each earlier distraction of that human that worked this robbery costs a die." |
| I-22 Helping in view | Fixed | "Helping another cat's roll is never a roll of its own." Who may help a haul is new (C7-05). |
| I-23 Superseded DESIGN rows | Not checked | Outside the rulebook. |

## Feel notes

- **Was it fun?** Round 4 was a real moment. Biscuit, with the cake in his jaws, one Broom step from the broom, rolled 2 1 1 2 under Aunt Rosalind's nose and spent his last Cattitude on the Push: 6. The haul itself feels great at the table ("heave!"), and making it a roll every time is right. The Push paid in Broom on an unseen roll (Tilly, round 2) was a good, honest choice: buy silence now with Mood you'll need later.
- **Was it Hard in a good way?** Not on the main line. The parrot did the gang's luring for them, and Dad's routine never takes him back to the kitchen. After that, Hard was just the Broom budget (Patience 5): the gang used 4 of 5. Rosalind's Attention 2 and the two kids, the features the chapter warns about, never touched a roll, because Savage hauls ignore Attention and nobody needed to be Sweet. Branch A shows the house *can* be Hard: with Dad left on the cake, the same line lost the cake to a Scrape on the last haul. So the difficulty hangs on one timing ruling about a parrot.
- **Did eating as a roll work?** Yes, as pressure. Every bite risks noise, noise brings a human, and the human finds the cake and starts Searching. In Branch B, 5 eating rolls (one Pushed) bought 4 portions, a lure round, a Shoo! and a lost Patience. But that is exactly why it never competes with carrying: Clean by eating takes 8 eating rolls plus 2 steps, against 4 rolls to carry the cake out. "You can also carry food out instead — sometimes that's fewer rolls" is an understatement at this house. And with "several noises in one room count as one", the right way to eat is all four cats in one round in one room (C7-15).
- **Was any line dominant?** Yes. Patio in, parrot lure, steps in the empty kitchen, Chonky carry, two Savage hauls (C7-02). The likeliest fixes are a Difficulty on hauling the cake, or Dad's routine pulling him back to the kitchen.
- **The Searchers are good.** A Searching human parked on the cake is a clear, scary obstacle. "Spotted" plus "found" plus a mess can add 3 Broom in one house's turn (Branch B round 3), which made the lure-and-eat plan feel costly in the right way. The free parrot lure is the odd one out: it costs nothing.
- **What an 8-year-old would find confusing:**
  - "Several noises in one room count as one" alongside "each human answers only one" and "closest within two rooms": that is three rules for one noise.
  - Why a Push can cost Broom "even if nobody saw".
  - Whether the parrot "saw" a cat that just walked through.
  - That a haul uses every carrier's Move *and* Action, while the helpers keep their Moves.
  - That Messy only needs "half the food eaten", even if cats are left behind, so half the gang can be adopted on a "Messy" night.

  The two-meter "fuller meter" Flop rule went down fine.

## Dice appendix

Every roll in the order it was made. M = main line. A = Branch A. B = Branch B, where B' marks the current-text replay. **SUPERSEDED** = rolled under the pre-edit noise text, and replaced by later rolls.

| # | Line | Purpose | Dice | Faces | Result |
|---|---|---|---|---|---|
| 1 | M | R1 routine: Aunt Rosalind (dining) | 1d6 | 3 | stays |
| 2 | M | R1 routine: Mia (living) | 1d6 | 3 | Dining room |
| 3 | M | R1 routine: Leo (living) | 1d6 | 5 | Hall |
| 4 | M | R2 Mags step 1, counter: Sneaky 3 +1 help +1 CT −1 Tricky | 4d6 | 3 6 4 2 | Clean |
| 5 | M | R2 Tilly step 2, cover: Streetwise 3 +1 Curious +1 CT −1 Tricky | 4d6 | 3 4 2 3 | Scrape |
| 6 | M | R2 Tilly Push (pays 1 Broom), reroll 4 | 4d6 | 1 3 6 5 | Clean |
| 7 | M | R2 routine: Dad (dining) | 1d6 | 4 | Dining room (stays) |
| 8 | M | R2 routine: Aunt Rosalind (dining) | 1d6 | 4 | stays |
| 9 | M | R2 routine: Mia (dining) | 1d6 | 4 | Hall |
| 10 | M | R3 haul kitchen to dining: Biscuit Savage 3 +2 helpers | 5d6 | 5 4 4 3 2 | Scrape |
| 11 | M | R3 routine: Dad (dining) | 1d6 | 6 | Living room |
| 12 | M | R3 routine: Aunt Rosalind (dining) | 1d6 | 3 | stays |
| 13 | M | R3 routine: Leo (dining) | 1d6 | 5 | Hall |
| 14 | M | R4 haul out through the patio: Biscuit Savage 3 +1 helper | 4d6 | 2 1 1 2 | Flop |
| 15 | M | R4 Biscuit Push (pays 1 CT), reroll 4 | 4d6 | 2 4 3 6 | Clean |
| 16 | B | B-R2 Biscuit eats: Savage 3 +1 Foodie | 4d6 | 4 1 5 2 | Scrape |
| 17 | B | B-R2 Biscuit Push (pays 1 CT), reroll 4 | 4d6 | 4 1 1 2 | Scrape (eaten) |
| 18 | B | B-R2 routine: Dad (dining) | 1d6 | 1 | stays |
| 19 | B | B-R2 routine: Mia (dining) | 1d6 | 5 | Kitchen |
| 20 | B | B-R3 routine: Dad (dining) | 1d6 | 6 | Living room |
| 21 | B | B-R3 routine: Leo (dining) | 1d6 | 1 | stays |
| 22 | B | B-R4 Biscuit eats: Savage 3 +1 Foodie | 4d6 | 5 1 1 4 | Scrape (eaten) |
| 23 | B | B-R4 Velvet eats: Sneaky 2 | 2d6 | 1 4 | Scrape (eaten) |
| 24 | B | B-R4 Mags eats: Sneaky 3 | 3d6 | 4 4 1 | Scrape (eaten) |
| 25 | B | B-R4 Tilly eats: Sneaky 2 | 2d6 | 3 1 | Flop |
| 26 | B | **SUPERSEDED** B-R6 Mags climbs out: Sneaky 3 +1 CT −1 | 3d6 | 3 5 2 | (Scrape) |
| 27 | B | **SUPERSEDED** B-R7 Velvet meows at the patio: Sweet 3 +1 Lap Cat −1 Attention | 3d6 | 3 3 4 | (Scrape) |
| 28 | B | **SUPERSEDED** B-R8 routine: Dad | 1d6 | 6 | (Living room) |
| 29 | B | **SUPERSEDED** B-R8 routine: Rosalind | 1d6 | 1 | (stays) |
| 30 | B | **SUPERSEDED** B-R8 routine: Mia | 1d6 | 1 | (stays) |
| 31 | B | **SUPERSEDED** B-R8 routine: Leo | 1d6 | 3 | (Dining room) |
| 32 | B | **SUPERSEDED** B-R9 Biscuit climbs out: Savage 3 −1 | 2d6 | 6 5 | (Clean) |
| 33 | A | A-R2 Velvet distracts Dad: Sweet 3 +1 Lap Cat +1 CT −1 Attention | 4d6 | 5 5 1 5 | Scrape |
| 34 | A | A-R2 Mags step 1: Sneaky 3 +1 CT −1 Tricky | 3d6 | 4 2 3 | Scrape |
| 35 | A | A-R2 Tilly step 2: Streetwise 3 +1 Curious +1 CT −1 Tricky | 4d6 | 6 1 1 4 | Clean |
| 36 | A | A-R2 routine: Dad (kitchen) | 1d6 | 2 | stays |
| 37 | A | A-R2 routine: Leo (dining) | 1d6 | 4 | Dining room |
| 38 | A | A-R3 haul kitchen to dining: Savage 3 +2 helpers | 5d6 | 2 3 3 4 2 | Scrape |
| 39 | A | A-R3 routine: Dad (dining) | 1d6 | 4 | Dining room |
| 40 | A | A-R3 routine: Leo (dining) | 1d6 | 4 | Dining room |
| 41 | A | A-R4 haul out through the patio: Savage 3 +1 helper (needs a Purrfect) | 4d6 | 2 2 5 2 | Scrape |
| 42 | A | A-R4 Biscuit Push (pays 1 CT), reroll 4 | 4d6 | 5 4 2 3 | Scrape (Shoo!) |
| 43 | B' | B'-R6 Mags climbs out: Sneaky 3 +1 CT −1 Tricky | 3d6 | 2 5 6 | Clean |
| 44 | B' | B'-R8 Biscuit climbs out: Savage 3 −1 Tricky | 2d6 | 3 4 | Scrape |
| 45 | B' | B'-R8 Velvet climbs out: Sneaky 2 −1 Tricky | 1d6 | 5 | Scrape |
| 46 | A | A-R2 re-check (current text): Mia's routine (dining) | 1d6 | 4 | Hall |

**Totals:**
- **Main line:** 15 roll events (34 dice). The cats made 4 rolls and 2 Pushes (25 dice); the Storyteller made 9 routine rolls (9 dice).
- **Branch B as it stands (B and B'):** 13 roll events. The cats made 8 rolls and 1 Push; the Storyteller made 4 routine rolls.
- **Branch A:** 11 roll events.
- **Superseded:** 7.

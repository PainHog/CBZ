# Playtest: The Birthday Cake (Hard), the ready-made gang of four, rules v0.9 after the fix round, real dice (verification)

*2026-10-21 · A verification playtest after the fix round that answered the two earlier v0.9 reports (Number 12 and Chef Marchetti's Salmon). One agent played the Storyteller and all four players, strictly by the rulebook source: Chapters 1–14 (`book/src/chapters/11-ch01` to `33-ch14`, including Chapter 3, Meet the Gang, and Chapter 9, The Getaway, with its Cred section), the house chapter `44-ch18-birthday-cake.html`, the floor plan `book/art/map-birthday-cake.svg` (read as text for its labels) and the three sheets (`50`, `51`, `52`). The simulator, the Foundry module, the design notes and the review log were not read; the two earlier v09 reports were read for format and for the issues the fixes answer. The gang is Chapter 3's ready-made gang without Pip, as the chapter says for four players. The Storyteller played the house by its chapter and Chapter 12 and tempted meanly, by the rules. The players played to win and to show off for Cred. Every die came from Node's `crypto.randomInt` through a logging script that wrote each roll and its purpose before the result was used. All 84 entries are in the Dice appendix, including two short supplementary getaways rolled to exercise the loot and warden rules that the main line never reached.*

## Summary

- **Outcome: Clean Getaway.** All 8 portions of the cake were eaten in the house (Mags 3, Biscuit 2, Tilly 2, Velvet 1), nobody was pinched, Scooped, Held or shut in, and all four cats reached the hideout in 4 getaway rounds. The house part ended at the end of round 10, a round before Lights Out (end of round 11). The cake was finished in round 6, two rounds before it would have gone (start of round 9).
- **The line:**
  1. **Round 1, three ways in.** Velvet said hello at the front door (Purrfect). Tilly (Purrfect) and Mags (Scrape) climbed the water butt into the utility room. Biscuit strolled in through the open patio door under Aunt Rosalind's nose. Mags's scrape drew Rosalind into the utility room, and Captain's squawk drew Leo into the dining room.
  2. **Round 2, the cake opened unseen.** Velvet distracted Dad (Clean). Mags climbed to the cake with Biscuit helping (Clean), and Tilly Pushed the wrapping off into a Clean. No noise in the kitchen at all. Then Captain squawked at Biscuit, which pulled Dad out of the kitchen: nobody found the open cake.
  3. **Round 3, four portions.** All four ate in an empty kitchen (Biscuit's Flop Pushed into a Purrfect). That is already a Messy Getaway. The noise brought Rosalind in, and she found the cake: Broom 2, Searching.
  4. **Round 4, six portions.** Velvet distracted the Searching Rosalind (Clean), and Biscuit and Mags ate under her nose. Leo and Dad came in and found it too (Broom 3).
  5. **Round 5, the cake goes to the table.** Dad carried it into the dining room. Velvet's distraction Flopped twice in front of him (Broom 5). Biscuit Pushed a flopped climb onto the table into a Clean, filling the Broom: **Shoo!** He was swept out of the patio door, which was shut behind him (Patience 5). Tilly rolled in the wrapped catnip toy in the empty utility room and got **the zoomies**; Mags tagged the utility room.
  6. **Round 6, the last two portions.** Velvet, out of Cattitude, had to give in to the sparkly candles. Mags and then Tilly ate the last two portions in front of three humans, and Tilly's Scrape filled the Broom: **Shoo!** (Patience 4).
  7. **Rounds 7–10, showing off on the way out.** Mags tagged the dining room and the kitchen in view (2 Cred each). Velvet tagged the hall over the Party Crashers' mark, and the living room. With the patio door shut, the gang got out by feeding the Broom on purpose: Tilly (back in for one round), Mags and Velvet were each Shooed in turn (Patience 3, then 2).
  - **Getaway:** party gate, bouncy castle, high back fence, ring road, one obstacle a round, two groups a round, no Flops. Mags Purrfected the gate; Biscuit led a group past the Party Crashers with a Clean. The van pulled up after round 2 (cats had been Shooed), and the warden never got within two spaces.
- **End Mood:** Broom 0/2, Cuddle 1/2, Patience 2 (from 6, after five Shoos).
- **Loot home:** none to carry. Count against the whole prize: 8 of 8 eaten, 0 lost, nobody pinched.
- **Cred:** **Marmalade Mags 6** (utility tag 1, dining-room tag in view 2, kitchen tag in view 2, a Purrfect on the party gate 1), Velvet 3 (the hall over the rivals 2, the living room 1), Big Biscuit 1 (led past the rivals), Two-Bin Tilly 1 (the catnip). **The Cat's Whiskers: Marmalade Mags.** Gang total 11: in a campaign, **2 Rep** (1 for the Clean Getaway, 1 for the gang's Cred of 8 or more on a night that wasn't Busted).
- **Rolls:**
  - **Cats in the house:** 21 rolls and 7 Pushes (28 entries). Final results: 4 Purrfect, 8 Clean, 7 Scrape, 2 Flop. Six first rolls were Flops; four of them were saved by a Push.
  - **Storyteller:** 20 rolls (16 routines, 4 noise tie-breaks).
  - **Main getaway:** 8 rolls and 2 Pushes: 1 Purrfect, 3 Clean, 4 Scrape, 0 Flop.
  - **Supplementary drills:** Drill L 10 entries, Drill W 16.
  - **Temptations:** 7 offered (6 resisted, 1 given in because Velvet had no Cattitude), and none in rounds 1, 8 and 10. The catnip was never offered (V-09).
- **Cat-turns in the house: 40** (4 cats × 10 rounds). 29 did something; 11 were idle, 10 of them in rounds 6–10 (9 by cats waiting outside).
- **Supplementary drills** (real dice, set positions, not the result):
  - **Drill L**, 3 pieces carried in sensible groups, nobody Shooed: the warden arrived after round 3, the loot die hit every roll the carrying group made, and all 3 pieces got home: Clean.
  - **Drill W**, 2 pieces, cats running alone where they could: a Sweet roll made by dropping a piece, a dropped piece picked up, a cat waiting, the warden stopping on the rearmost cats, two dodges that worked (the cats stayed put, he sprawled), the dropped loot lost on his space, and a second dodge that Flopped: Tilly pinched. Messy.
- **Issues: 17** (0 blockers, 2 major, 15 minor). **Top 5:**
  1. **V-02 (major): "Carrying it out whole would be a Clean Getaway" can't happen.** Four cats carry at most 5 pieces (a Chonky cat 2, the others 1 each), and the cake is 8 portions. The other 3 are left in the garden.
  2. **V-01 (major): the cake goes in round 8 or round 9?** The house's opening paragraph says it is "cut and served at the start of round 8"; *At a glance* and the Prize Clock say "Gone at the start of round 9".
  3. **V-12 (minor): a dodge that works leaves the cat on the warden's space.** It's not said whether cats can help a dodge, whether a sprawled warden still corners, or whether a Flop next round still moves him. In Drill W a cat dodged, Flopped the obstacle again, had to dodge again on the same space, and was pinched.
  4. **V-05 (minor): which entrance is "the last one still open"?** Does the front door count once its rounds are over? That decided which entrance stayed open after three of the five Shoos.
  5. **V-09 (minor): the catnip is still never offered as a temptation.** Giving in is a gift (Cred, Cattitude and no roll in view), so a mean Storyteller never offers it, and "it's still the Storyteller's one temptation a round" never fires.
- **The fixes:** every fixed rule this house could reach worked as written: the five spaces, the warden's arrival, "never passes a cat", the stay-put dodge, the group loot die, no Sweet with loot, outcomes against the whole prize, waiting, quiet unseen tags as messes, in-view tags as rolls and not messes, the zoomies wearing off, the rivals' point per group leader, Rep at 8 for the gang, the Den, the Shoo's last-entrance rule, and the sheets' getaway row. Five could not be reached here: the Scrapper temptation (no dog or house cat), the flap lock (no cat flap), a pet on the route (none), the human carrying the prize (it's put down at the start of round 1), and the zoomies' "every tag a roll" and doubling (Tilly never tagged). See the Fix checks table.
- **Headline feel:** a proper heist for six rounds. The cake came open in a silent round and was eaten in three, and the parrot turned out to be the gang's best lure. The tail was flat: from round 7, three of the four cats stood in the garden with nothing to do while the last two worked out how to get thrown out, because the first Shoo had shut the patio door.

## The gang

Chapter 3's ready-made gang, leaving out Pip (four players). Everyone starts with 2 Cattitude and 9 Lives.

| Cat | Body | Sneaky | Sweet | Savage | Streetwise | Instincts | Role tonight |
|---|---|---|---|---|---|---|---|
| **Two-Bin Tilly** | Lean | 2 | 1 | 1 | **3** | Curious, Climber | the wrapping; the catnip |
| **Big Biscuit** | **Chonky** | 1 | 1 | **3** | 2 | Scrapper, Foodie | the best eater (Savage 3 + Foodie) |
| **Velvet** | Lean | 2 | **3** | 1 | 1 | Lap Cat, Knocker | distractions |
| **Marmalade Mags** | Lean | **3** | 1 | 2 | 1 | Box Sitter, Hunter | the climb, quiet eating, tags |

**Against this house:**
- **Tempted where:** Tilly and Velvet anywhere (Curious and Knocker by the shiny things in every room). Mags in the hall, dining room and living room. Biscuit only in the kitchen (Foodie): there's no dog or house cat, so his Scrapper instinct never tempts.
- **Ways in:** the front door (rounds 1–2, one cat): Velvet's hello is Sweet 3 + Lap Cat = 4 dice against the guests' Attention 0. The utility window (a climb, Tricky): Tilly, Mags and Biscuit 2 dice each. The patio door: no roll, but it opens on Rosalind and the parrot.
- **Step 1, the climb** (Tricky): Tilly, Mags and Biscuit 2 each, Velvet 1.
- **Step 2, the wrapping** (Streetwise or Savage, Tricky): Tilly 3 (Curious), Biscuit 2.
- **Eating** (plain): Biscuit 4 (Savage + Foodie), Mags 3, Tilly 2, Velvet 2.
- **Distracting:** Dad (Attention 1) 3 dice; Rosalind (Attention 2) 2 dice; each earlier distraction of the same human costs a die.

**The house as the players see it:**
- **Rooms:** hall, kitchen, dining room, living room, utility room, downstairs loo (the Den). Every way is Big. Hall–kitchen, hall–living room, hall–dining room, kitchen–dining room, kitchen–utility room, hall–loo.
- **Humans:** Dad (Attention 1, kitchen), Aunt Rosalind (Attention 2, dining room), Mia and Leo (kids, Attention 1, living room). Captain the parrot lives in the dining room.
- **Distances:** every room is within two rooms of the kitchen, so any noise in the kitchen draws somebody unless all four humans are busy. The utility room and the loo are on nobody's routine.
- **Setup (four cats):** Patience 6. The cake is Medium with 8 portions (2 per cat), and hauling it is Tricky. Gone at the start of round 9; Lights Out at the end of round 11. The catnip stash (a wrapped catnip toy) is in the utility room; the Party Crashers have tagged the hall and hang about at the bouncy castle (obstacle 2).
- **The plan:** take the cake in the kitchen in rounds 2–4, before the Clock moves it into Rosalind's dining room. Give the catnip to Tilly once her wrapping job is done. Tag on the way out.

## Play log

Mood is written Broom/Cuddle out of Patience. "Seen" means a human in the room who is awake and not Distracted.

### Round 1: three ways in (0/0 of 6)

- **Prize Clock:** Dad puts the cake on the kitchen counter and stays with it, deaf to noise. **Temptation:** none (every cat is outside).
- **Velvet** says hello at the front door: **4 dice → #1: 3 6 6 4, Purrfect.** She's in the hall, quietly, Cattitude 3. The guests fill no meter.
- **Mags** climbs in at the utility window: Sneaky 3 − 1 = **2 dice → #2: 1 4, Scrape.** She's in, with a noise in the utility room.
- **Tilly** climbs after her: Sneaky 2 + Climber − 1 = **2 dice → #3: 6 6, Purrfect.** In, quietly, Cattitude 3.
- **Biscuit** walks in through the open patio door. That's free, even in view of Rosalind, but Captain sees him.
- **House:**
  - **Pets:** Captain saw a cat: he squawks ("CAT! PARTY! CAT!").
  - **Noise:** the utility noise comes first. Dad is in the next room but staying with the cake, so the closest free human within two rooms is Rosalind (dining room → kitchen → utility). She goes to the utility room. Next, the squawk: Dad is staying put and Rosalind has answered already, so it goes to the kids, two rooms away. **#4: 4 → Leo** goes to the dining room.
  - **Routines:** **#5: 1**, Mia stays in the living room.
  - **Finding it:** the cake is untouched.
- **End:** Dad (kitchen, with the cake); Rosalind, Tilly and Mags in the utility room; Leo, Biscuit and Captain in the dining room; Velvet in the hall; Mia in the living room. Cattitude: Tilly 3, Biscuit 2, Velvet 3, Mags 2.

### Round 2: the cake opened in silence (0/1)

- **Temptation:** the Storyteller tempts **Velvet**, the gang's distraction, with a glittery party bag on the edge of the hall table (Knocker). She **resists** (3→2). The catnip, right beside Tilly and Mags, wasn't offered: it would have been a gift (V-09).
- **Velvet** walks into the kitchen and distracts Dad: Sweet 3 + Lap Cat − 1 = **3 dice → #6: 2 6 5, Clean.** Cuddle 1. "Who's a lovely girl? Are you here for the party?"
- **Mags** (from the utility room) climbs to the cake, with **Biscuit** (from the dining room) helping: 3 + 1 − 1 = **3 dice → #7: 4 6 3, Clean.** Step 1 is done, and nobody saw it (Dad is Distracted).
- **Tilly** takes the plastic cover off: Streetwise 3 + Curious − 1 = **3 dice → #8: 4 1 2, Scrape.** A noise in the kitchen would bring someone in to find the open cake, so she **Pushes** for 1 Cattitude (3→2): **#9: 6 1 4, Clean.** Step 2 is done, quietly.
- **House:**
  - The Distraction ends.
  - **Pets:** Captain saw Biscuit at the start of the round (unhidden), so he squawks.
  - **Noise:** the only noise is the squawk in the dining room. Leo is already there. The closest free human is Dad, one room away, so **Dad walks out of the kitchen** to see what the bird's on about.
  - **Routines:** **#10: 3**, Rosalind stays in the utility room. **#11: 3**, Mia goes to the dining room. **#12: 5**, Leo goes to the hall.
  - **Finding it:** nobody is in the kitchen. **The open cake isn't found.**
- **End:** all four cats in the kitchen with the open cake; Dad and Mia in the dining room; Rosalind in the utility room; Leo in the hall. Broom 0, Cuddle 1.

### Round 3: four portions (0/1 → 2/2)

- **Temptation:** **Biscuit**, the best eater, is tempted by cocktail sausages by the cooker (Foodie). He **resists** (2→1).
- **The cats eat** in an empty kitchen, so nothing is seen:
  - **Biscuit:** Savage 3 + Foodie = **4 dice → #13: 3 1 3 1, Flop.** He **Pushes**, paying 1 Broom step (Broom 0→1, which lands even though nobody saw): **#17: 6 2 6 1, Purrfect.** He eats a portion (Cattitude 1→2).
  - **Mags:** Sneaky 3 → **#14: 6 1 6, Purrfect** (2→3).
  - **Tilly:** Sneaky 2 → **#15: 4 5, Scrape.**
  - **Velvet:** Sneaky 2 → **#16: 2 4, Scrape.**
  - **4 portions eaten:** half the cake, a Messy Getaway already, as long as everyone gets home.
- **House:**
  - **Noise:** the kitchen noise draws the closest human. Dad and Mia (dining room), Rosalind (utility room) and Leo (hall) are all one room away, so the highest Attention goes: **Rosalind**.
  - **Routines:** **#18: 5**, Dad goes to the dining room. **#19: 2**, Mia stays. **#20: 1**, Leo stays.
  - **Finding it:** Rosalind finds the cake half gone: **Broom 2**, and she starts **Searching**. "MIA'S CAKE!"
- **End:** Rosalind (Searching) and all four cats in the kitchen. Broom 2, Cuddle 1. Cattitude: Tilly 2, Biscuit 2, Velvet 2, Mags 3.

### Round 4: six portions (2/1 → 3/2)

- **Temptation:** **Velvet** again (she wasn't tempted last round), by a glass of lemonade on the edge of the counter (Knocker). She **resists** (2→1).
- **Velvet** distracts the Searching Rosalind: Sweet 3 + Lap Cat − 2 = **2 dice → #21: 6 2, Clean.** Cuddle 2.
- **The others eat** while Rosalind sees nobody:
  - **Biscuit:** **#22: 2 3 2 1, Flop.** He Pushes for his Cattitude (2→1): **#23: 1 2 3 6, Clean.** Portion 5.
  - **Mags:** **#24: 5 3 3, Scrape.** Portion 6.
  - **Tilly:** **#25: 2 1, Flop.** She Pushes (2→1): **#26: 1 3, still a Flop.**
- **Everyone then walks out**, using their Moves after their Actions, so a Searching Rosalind can't spot them at the end. Velvet and Biscuit go to the hall; Mags and Tilly go to the utility room.
- **House:**
  - **Noise:** the kitchen noise. Dad, Mia and Leo are all one room away with the same Attention: **#27: 5 → Leo** comes in.
  - **Routines:** **#28: 3**, Dad goes to the kitchen. **#29: 6**, Mia goes to the living room.
  - **Finding it:** Rosalind sees no cat. Leo and Dad find the cake: **Broom 3** (once), and both start Searching.
- **End:** Rosalind, Dad and Leo (all Searching) in the kitchen with 2 portions left; Velvet and Biscuit in the hall; Mags and Tilly in the utility room; Mia in the living room. Broom 3, Cuddle 2. Cattitude: Tilly 1, Biscuit 1, Velvet 1, Mags 3.

### Round 5: the cake goes to the table (3/2 → Shoo! → 2/2 of 5)

- **Prize Clock:** Dad picks up the cake (it's where the Clock put it) and carries it to the dining-room table, and stays with it, deaf. The new spot has one step: climb up to it. I ruled the cover stays off and the climb must be done again (V-06).
- **Temptation:** **Tilly**, by a rattling present by the washing machine (Curious). She **resists** with her last Cattitude (1→0).
- **Velvet** walks into the dining room and distracts Dad a second time: Sweet 3 + Lap Cat − 1 − 1 for the earlier distraction = **2 dice → #30: 3 1, Flop.** She Pushes for her last Cattitude: **#31: 3 1, Flop again.** Dad saw it: 2 steps on the fuller meter, **Broom 5/6.** "Will you get off my feet?"
- **Biscuit** walks in and climbs onto the table in front of Dad: Savage 3 − 1 = **2 dice → #32: 3 1, Flop.** That Flop fills Broom whatever he does, so he Pushes and pays with a Broom step, which costs him nothing (V-10): **#33: 3 6, Clean.** The climb is done. Broom is full, and Dad grabs the broom: **Shoo!**
  - Biscuit goes out through the patio door, the nearest entrance. Dad shuts it behind him: the utility window is still open, so the patio door isn't the last one (V-05).
  - After the Shoo: Broom 0, **Patience 5**, Cuddle 2 (below 5, so it stays). A cat has been Shooed, so the van will come after getaway round 2.
- **Tilly** goes for the catnip on purpose. The utility room is empty, so there's no roll. She rolls about in Gran's cat's present, yowling (a noise, not a mess): **1 Cred** (not doubled), and **the zoomies.** Then she walks into the kitchen.
- **Mags** tags the utility room. Nobody sees, so there's no roll and no noise, but it's a mess: **1 Cred.** Then she walks into the kitchen.
- **House:**
  - **Pets:** Captain saw Velvet and Biscuit, so he squawks.
  - **Noise:** the dining-room noise comes first (it includes the squawk). Rosalind and Leo are one room away, and Rosalind has the higher Attention, so she goes; a Searching human still answers noise first. Next, Tilly's yowl in the utility room: **Leo** goes there.
  - **Routines:** **#34: 5**, Mia goes to the kitchen. She isn't Searching, so she spots nobody.
  - **Finding it:** Dad and Rosalind (Searching) can see Velvet: **Broom 1.** Leo finds the tag in the utility room: **Broom 2.** The mess is cleared; the room stays tagged and Mags keeps her Cred.
- **End:** Dad, Rosalind, Velvet and Captain in the dining room, with the open cake (2 portions); Mia, Mags and Tilly in the kitchen; Leo in the utility room; Biscuit outside. Broom 2, Cuddle 2, Patience 5. The patio door is shut.

### Round 6: the last two portions (2/2 → Shoo! → 2/2 of 4)

- **Temptation:** **Velvet** (tempted in round 4, not round 5) is offered the sparkly birthday candles on the edge of the table (Knocker). She has no Cattitude, so she **must give in**. She goes first and knocks the box off the table: a noise, seen, **Broom 3** (+1 Cattitude, 0→1). Then she walks into the hall.
- **Mags** walks into the dining room and eats: Savage 2 → **#35: 5 1, Scrape.** Portion 7. **Broom 4.**
- **Tilly**, with the zoomies, walks in and eats the last portion: Savage 1 + zoomies = **2 dice → #36: 2 4, Scrape** (a noise, as every zoomies roll is). **All 8 portions are eaten.** Broom 5/5: **Shoo!**
  - Rosalind, who has the higher Attention, takes the broom. She opens the shut patio door, sweeps Tilly out and shuts it again; the window is still open. She stays in the dining room.
  - After the Shoo: Broom 0, **Patience 4**, Cuddle 2.
- **Biscuit** waits outside. Coming back in by the window would mean a climb in view of the Searching kid Leo, and a Flop would put 4 steps on Cuddle.
- **House:**
  - **Pets:** a squawk.
  - **Noise:** all of this round's noise is in the dining room, so it counts as one. Mia, one room away in the kitchen, comes in.
  - **Searching:** the cake is all eaten, so it no longer holds anyone. Dad can see Mags, so he stays. Leo (utility room) sees no cat and has no cat next door, so he rolls his routine: **#37: 6**, the living room.
  - **Finding it:** Dad sees Mags: **Broom 1.** Mia finds the empty cake board in the Clock's room: **Broom 2**, and she starts Searching (V-07).
- **End:** Dad, Rosalind and Mia (all Searching), Mags and Captain in the dining room; Velvet in the hall; Leo in the living room; Tilly and Biscuit outside. Broom 2, Cuddle 2, Patience 4. Cattitude: Tilly 0, Biscuit 1, Velvet 1, Mags 3.

### Round 7: tags, and the zoomies cut short (2/2 → Shoo! → 0/2 of 3)

- **Temptation:** **Mags**, by a balloon on a string drifting across the dining room (Hunter). She **resists** (3→2).
- **Mags** tags the dining room in front of three Searching humans: Savage 2, plain → **#38: 5 6, Clean.** It worked in view: **2 Cred** (Mags 3). It's not a mess, and the roll's step is the price: **Broom 3.** Then she walks into the empty kitchen.
- **Velvet** tags the empty hall over the Party Crashers' mark. That's no roll and no noise, but it's a mess: (1 + 1) = **2 Cred.** Then she walks into the downstairs loo, the Den, on her own. She isn't shut in.
- **Tilly**, with the zoomies, climbs back in at the window into the empty utility room: Sneaky 2 + Climber + zoomies − 1 = **3 dice → #39: 3 2 6, Clean.** It's still a noise, because of the zoomies.
- **House:**
  - **Pets:** Captain saw Mags, so he squawks.
  - **Noise:** Tilly's noise in the utility room comes first. Rosalind wins the tie two rooms away and goes there. Next, the squawk: Leo comes from the living room.
  - **Searching:** Dad and Mia can see no cat, so each steps into a next room with a cat in sight: the kitchen (Mags).
  - **Finding it:** Searching humans see Tilly and Mags: **Broom 4/4, Shoo!** The meter filled without a roll. The human with the highest Attention who spotted a cat is Rosalind, so the Storyteller gives it to the cat she can see, Tilly (V-11). Rosalind puts her out of the window, the last entrance still open, so it stays open.
  - After the Shoo: Broom 0, **Patience 3**, Cuddle 2 (below 3).
- **End:** Dad, Mia and Mags in the kitchen; Rosalind in the utility room; Leo in the dining room; Velvet in the loo; Biscuit and Tilly outside. Tilly's zoomies run lasted half a round: she never tagged, and nothing she scored was doubled.

### Round 8: feeding the Broom (0/2 → 2/2 of 3)

- **The gang's problem:**
  - The patio door is shut. The window is in the utility room, which a Searching human keeps visiting.
  - Cuddle 2/3 is the fuller meter, so any Flop in view would put 2 steps on Cuddle (4 with a kid watching): a Scoop, the Den, and a pinch at Lights Out.
  - With Patience 3, Broom can only become as full as Cuddle at 2/3. From then on, a non-Sweet Flop goes on Broom, and a Shoo! is a way out.
  - **The plan:** get Broom to 2 with spots and messes, then roll in view.
- **Temptation:** none. The only cat who could be tempted is Velvet (shiny things in the loo), and giving in would only help her: a noise brings a human, who spots her and helps her out. The Storyteller passes.
- **Velvet** walks into the hall and makes a noise on purpose. **Mags** waits in the kitchen in front of Dad and Mia (an idle turn).
- **House:**
  - **Noise:** in the hall. Dad, Mia and Leo are all one room away with the same Attention: **#40: 3 → Mia** comes.
  - **Searching:** Dad can see Mags, so he stays. Leo steps into a next room with a cat in sight; the Storyteller picks the kitchen. Rosalind sees no cat, and the kitchen is next door, so she steps in too.
  - **Finding it:** spotted: **Broom 1.** Mia finds the hall mess: **Broom 2.** I ruled the tag and the lure leave one mess between them (V-08).
- **End:** Dad, Leo, Rosalind and Mags in the kitchen; Mia and Velvet in the hall; the utility room is empty. Broom 2, Cuddle 2, Patience 3.

### Round 9: the kitchen tag, and Mags out (2/2 → Shoo! → 0/1 of 2)

- **Temptation:** **Velvet**, by a glittery balloon weight (Knocker). She **resists** with her last Cattitude (1→0).
- **Mags** tags the kitchen in front of Dad, Leo and Rosalind: Savage 2 → **#41: 1 1, Flop.** The meters are level (2 and 2), so the Flop goes on its own meter, Broom, and fills it whatever happens next. So she Pushes, paying with a Broom step that costs nothing (V-10): **#42: 1 4, Scrape.** The kitchen is tagged in view: **2 Cred** (Mags 5). **Shoo!**
  - Rosalind takes the broom. The patio door and the window are both one room away, and the Storyteller picks the window. It's the last entrance open, so it stays open, and Rosalind stays in the utility room.
  - After the Shoo: Broom 0, **Patience 2**, and Cuddle 2 drops to **1** (one below the new Patience).
- **Velvet** walks into the empty living room and tags it (no roll, a mess): **1 Cred** (Velvet 3).
- **House:**
  - **Noise:** in the kitchen. Mia comes from the hall.
  - **Searching:** Dad and Leo see no cat and have none next door. **#43: 1**, Dad stays. **#44: 3**, Leo goes to the dining room.
  - **Finding it:** nobody sees Velvet.
- **End:** Velvet alone inside, in the living room, with no Cattitude. The patio door is two rooms away and shut; the window is three rooms away. Two rounds to Lights Out.

### Round 10: Velvet thrown out (0/1 → Shoo! → the house is done)

- **Temptation:** none possible (Velvet was tempted last round).
- **Velvet** makes a noise on purpose in the living room.
- **House:**
  - **Noise:** Dad, Mia and Leo are all two rooms away: **#45: 1 → Dad** comes.
  - **Routines:** **#46: 2**, Mia stays in the kitchen. **#47: 4**, Leo stays in the dining room. **#48: 5**, Rosalind goes to the kitchen.
  - **Finding it:** Dad spots Velvet: **Broom 1.** He finds the living-room tag: **Broom 2/2, Shoo!** He opens the patio door, sweeps her out ("And STAY out!") and shuts it.
  - After the Shoo: Patience stays at 2 (its minimum).
- **End of the house part:** no free cat is inside and the prize is eaten, so the house is done at the end of round 10. Nobody is pinched.
  - **Loot:** 0 pieces; all 8 portions were eaten inside.
  - **Cattitude at the start of the getaway:** Tilly 0, Biscuit 1, Velvet 0, Mags 2.
  - Tilly's zoomies wear off.
  - There were five Shoos tonight (Biscuit, Tilly twice, Mags, Velvet), so the van pulls up after getaway round 2.
  - **Never tagged:** the loo.

### The getaway

**Route** (house page): 1 the party gate, through the guests' legs (Sweet; or Sneaky or Savage, Tricky); 2 next door's bouncy castle (Savage or Sneaky, Tricky; the Party Crashers); 3 the high back fence (Savage, Tricky; or Sneaky, Hard); 4 the ring road (Streetwise or Savage, Tricky).

**Spaces:** the garden, past 1, past 2, past 3, the hideout, as Chapter 9 now says. The tracker's getaway row has the same five columns. No meters fill out here.

| Round | Group (leader rolls; helpers) | Dice | Roll | Result | Cred | Warden, end of round |
|---|---|---|---|---|---|---|
| G1 party gate | Velvet (Sweet 3 + Lap Cat) + Tilly + Biscuit | 6 → 5 | #49: 6 4 5 3 5 | Clean, past 1 | — | not yet |
|  | Mags (Sneaky 3 + Box Sitter − 1) | 3 | #50: 2 6 6 | **Purrfect**, past 1 | **Mags +1**, Cattitude 2→3 |  |
| G2 bouncy castle (rivals) | Biscuit (Savage 3 − 1) + Velvet | 3 | #51: 1 6 2, Push #53: 1 2 | Clean, past 2 | **Biscuit +1** (led past the rivals) | the van pulls up; the warden is on the garden |
|  | Tilly (Sneaky 2 + Climber − 1) + Mags | 3 | #52: 4 5 5 | Scrape, past 2 | — |  |
| G3 high back fence | Biscuit (Savage 3 − 1) + Velvet | 3 | #54: 3 4 2 | Scrape, past 3 | — | past 1 |
|  | Mags (Sneaky 3 − 2) + Tilly | 2 | #55: 3 4 | Scrape, past 3 | — |  |
| G4 ring road | Tilly (Streetwise 3 − 1) + Velvet | 3 | #56: 1 5 2 | Scrape, home | — | — |
|  | Mags (Savage 2 + Hunter − 1) + Biscuit | 3 | #57: 6 2 2, Push #58: 2 4 | Clean, home | — |  |

- **G1.** Velvet's empty mouth makes the gate her obstacle: Sweet is plain, and two helpers take her to the 5-dice cap.
- **G2.** The two cats with the least Cred lead, to show up the rivals: Biscuit's Clean scores; Tilly's Scrape doesn't. Biscuit spends his last Cattitude on a Push for a Purrfect. A Push can't spoil a Clean, so it's free Cred-hunting.
- **G3 and G4.** Safe pairs, the best pools leading. Mags's spare Cattitude goes on a Push for a Purrfect that doesn't come.
- **Result:** everyone home after 4 rounds. Count against the whole prize: 8 of 8 eaten, nobody pinched: **Clean Getaway.**

**Final Cred:** Mags 6, Velvet 3, Biscuit 1, Tilly 1 (gang 11). **The Cat's Whiskers: Marmalade Mags**, who also ate three of the eight portions.

### Drill L: a getaway with loot, in sensible groups (supplementary, real dice; not the result)

**Setup:**
- As if the gang had eaten 5 portions and hauled the cake out of the patio door with 3 left (not replayed). So 3 pieces of loot, and the whole prize is still 8.
- Nobody was Shooed or Scooped, so the warden arrives after round 3.
- Cattitude as in the main line: Tilly 0, Biscuit 1, Velvet 0, Mags 2.
- **Share-out:** Biscuit 2, Mags 1, so all the loot is in one group and only one group loses the die.

| Round | Groups | Rolls | Result |
|---|---|---|---|
| 1 party gate | Velvet (Sweet 3 + Lap Cat, empty mouth) + Tilly, 5 dice · Mags (1 pc, Sneaky 3 + Box Sitter + 1 − 1 Tricky − 1 loot) + Biscuit (2 pcs), 3 dice | #59: 4 3 1 4 1 · #60: 2 6 6 | Scrape · **Purrfect** (Mags +1, 2→3). All on past 1. |
| 2 bouncy castle | Tilly (Sneaky 2 + Climber + 1 − 1) + Velvet, 3 dice · Mags + Biscuit, 2 dice (−1 loot) | #61: 3 6 6 · #62: 2 4 | **Purrfect** (Tilly +2: rivals and leap; 0→1) · Scrape, the loot safe. All on past 2. |
| 3 high back fence | Tilly (Savage 1 + Climber + 1 − 1) + Velvet, 2 dice · Biscuit (Savage 3 + 1 − 1 − 1 loot) + Mags, 2 dice | #63: 1 4 · #64: 2 6 | Scrape · Clean. All on past 3. **The van pulls up after round 3**, nobody on the garden. |
| 4 ring road | Tilly (Streetwise 3 + 1 − 1) + Velvet, 3 dice · Biscuit + Mags, 2 dice (−1 loot) | #65: 6 1 2, Push #67: 5 4 · #66: 2 6, Push #68: 3 | Clean · Clean. All home with 3 pieces. |

**Result:** 5 eaten + 3 home = 8 of 8, nobody pinched: **Clean.**
- The loot die took one die off each of the carrying group's four rolls. It didn't matter, because their dice were kind.
- No carrier ever led a Sweet roll: the gate went to Velvet's empty-mouthed group.
- With the warden arriving after round 3, he was never a threat to a gang moving one obstacle a round.

### Drill W: cats running alone (supplementary, real dice; not the result)

**Setup:**
- As if 6 portions had been eaten and 2 carried out: Velvet 1 piece, Tilly 1 piece.
- A cat was Shooed, so the warden arrives after round 2.
- Cattitude as in the main line.
- Each cat runs alone wherever it has at least a die. No Pushes for Purrfects.

- **Round 1, the gate:**
  - **Velvet** can't be Sweet with a piece in her mouth. So she drops it on the garden as part of the roll, "on purpose", and goes Sweet: **4 dice → #69: 6 5 5 4, Clean**, past 1.
  - **Mags**, alone: **#70: 2 5 1, Scrape**, past 1.
  - **Biscuit** picks up Velvet's piece instead of going on. He's Chonky with a single piece, so he loses no die.
  - **Tilly**, with her piece, has 0 dice on any approach (and can't be Sweet), so she **waits** (no roll).
- **Round 2:**
  - **Velvet** (1 die) → **#71: 5, Scrape**, past 2. No rivals' point.
  - **Mags** (2 dice) → **#72: 3 4, Scrape**, past 2.
  - **Biscuit leads Tilly** at the gate: Savage 3 + 1 − 1 Tricky − 1 for Tilly's piece (his own single piece doesn't count) = **2 dice → #73: 5 3, Scrape.** Both are on past 1 with their pieces.
  - **The van pulls up** on the garden. Nobody is there.
- **Round 3:**
  - **Mags leads Velvet** (Velvet alone would have 0 dice) over the fence, Sneaky Hard: **#74: 4 6, Clean**, past 3.
  - **Biscuit leads Tilly** over the castle: **#75: 3 5, Scrape**, past 2. No rivals' point.
  - **The warden moves 1**, to past 1.
- **Round 4:**
  - **Mags and Velvet** cross the ring road: **#76: 5 2 1, Scrape**, home.
  - **Biscuit and Tilly** go over the fence: **#77: 6 5, Clean**, past 3.
  - **The warden moves 1**, to past 2.
- **Round 5:**
  - **Tilly leads Biscuit** at the ring road: Streetwise 3 + 1 − 1 − 1 = **2 dice → #78: 1 3, Flop.** They're stuck on past 3, and both carriers drop their piece there. Tilly has no Cattitude to Push.
  - **The warden runs 2** (a Flop). He would reach the hideout, but he **never passes a cat**, so he stops on past 3. Both cats are cornered, and **the two pieces on his space are gone.**
  - **The dodges** (plain, each cat on its own; V-12): Tilly, Sneaky 2 → **#79: 4 1, Scrape**, it works. Biscuit, Savage 3 → **#80: 6 2 1, Clean.** Both **stay where they are**, and the warden sprawls over the wheelie bins.
- **Round 6:**
  - **Tilly leads Biscuit** again: 3 dice → **#81: 3 2 2, Flop.**
  - The warden doesn't move this round (he sprawled), but they're still on his space, so they're **cornered again.** Tilly → **#82: 3 2, Flop: pinched.** Biscuit → **#83: 2 6 2, Clean**, and the warden sprawls again.
- **Round 7:** Biscuit alone → **#84: 6 5, Clean**, home.

**Result:** 6 eaten + 0 home = 6 of 8, which is at least half: **Messy**, with Tilly pinched.
- The fixed dodge works: nobody was carried over an obstacle.
- But a cat that Flops the obstacle in front of a sprawled warden has to dodge again on the same space, and a Flop there is the pound (V-12).

**Not reached in any line:**
- a Scoop, a Held cat, the Den used as a Den, Lights Out;
- the Scrapper temptation (no dog or house cat here), a cat flap and its lock, a pet on the route;
- the human carrying the prize (the Clock puts it down at the start of round 1);
- the zoomies' "every tag a roll", "can't resist" and doubling;
- covering Captain's cage, the rivals nicking dropped loot.

## Issues

| ID | Severity | Passage (where) | What I ruled | Suggested fix |
|---|---|---|---|---|
| V-01 | major | "At the start of round 5 the cake goes to the dining-room table for the candles, and it will be cut and served at the start of round 8." (Ch 18, opening paragraph) vs "**Gone** at the start of round 9" (Ch 18, *At a glance*) and "Start of round 9 · Gone" (Ch 18, Prize Clock) | Gone at the start of round 9, as the table says, with Lights Out at the end of round 11. A Storyteller who reads the opener aloud and runs from it would end the cake a round early, and Lights Out with it. It didn't decide tonight (the cake was eaten by round 6). | Ch 18 opener: "…and it will be cut and served at the start of round 9." (The house text is copied from `book/src/houses/birthday-cake.html`, so fix it there.) |
| V-02 | major | "The cake **wobbles**: hauling it is Tricky. Carrying it out whole would be a Clean Getaway, but it takes two shaky hauls past a dining room full of people — eating it is the surer plan." (Ch 18, *How it plays*) vs "Share the pieces out: each cat carries **one piece**, a Chonky cat **two**. Pieces nobody can carry are left in the garden." (Ch 9, *The loot*) | The cake is 8 portions and four cats carry at most 5 (Biscuit 2, the others 1), so 3 are left in the garden: carrying it out whole is Messy at best. Three cats carry at most 4 of 6, and five cats 6 of 10. So the claim is never true. Also, from round 5 the cake is in the dining room beside the patio door, so it's one haul, not two. The players planned around eating, so it didn't change the line. In Drill L, Clean needed 5 eaten first. | Ch 18, *How it plays*: "The cake **wobbles**: hauling it is Tricky. You can't carry it all home anyway — four cats carry five portions at most (a Chonky cat two, the rest one each) — so eat at least three inside before you haul the rest out. Eating it all is the surer plan." (Or, if carrying it out whole should be a real option, the author could let food portions travel two to a cat; that changes a number.) |
| V-03 | minor | "**The party gate, through the guests’ legs** — Sweet; or Sneaky or Savage, Tricky (Knack: a Box Sitter’s; a Lap Cat’s; a Hunter’s, to bolt)." (Ch 18 getaway box) | The Knacks aren't in the order of the approaches, and it doesn't say which goes with which. I ruled Lap Cat for Sweet, Box Sitter for Sneaky (ducking among the legs) and Hunter for a Savage bolt. That gave Mags her 3 dice in G1 and Drill L. | "**The party gate, through the guests’ legs** — Sweet (a Lap Cat’s Knack), plain; or Sneaky (a Box Sitter’s, ducking between the legs) or Savage (a Hunter’s, to bolt), Tricky." |
| V-04 | minor | "the guests count as a human with Attention 0 who fills no meter, though a Scrape or Flop at the door is still a noise in the hall" (Ch 18, front door) | Do the guests count as someone in the hall who sees things in rounds 1–2, so that hiding, tagging or the catnip there is "in view"? I ruled they only watch the door roll. It didn't come up, but a gang that tags the hall in round 2 would ask. | "…a noise in the hall. The guests only watch the door: once a cat is in, they see nothing." |
| V-05 | minor | "Then they shut it behind the cat … **unless it’s the house’s last entrance still open**, which they leave open." (Ch 5, *Shoo!*) and "it works in rounds 1 and 2" (Ch 18, front door) | Is a front door past its rounds "still open"? I ruled no. So after the first Shoo shut the patio door, the utility window was "the last entrance still open" for the Shoos in rounds 7 and 9, and it stayed open. The other reading would have shut the window as well, and the late gang (with Cuddle one step from a Scoop) would have had no way out but Shoos. | Ch 5: "…unless it’s the house’s last entrance that still works (a front door past its rounds doesn’t count), which they leave open." |
| V-06 | minor | "A prize’s spot can take several **steps** … A step done stays done for the whole gang." (Ch 8) with the Clock "Start of round 5 · Dad puts it in the dining room … Step 1: climb up to it" (Ch 18) | When the Clock moves an opened, half-eaten cake, do the new spot's steps have to be done? Does the old step 2 (the cover) come back? I ruled the new spot's steps must be done (Biscuit climbed again, round 5), and anything already unwrapped stays unwrapped. | Ch 8, *Getting at it*: "When the Clock moves the prize, the steps of its new spot have to be done; anything already unwrapped stays unwrapped, and eaten portions stay eaten." |
| V-07 | minor | "The prize is **disturbed** if a step has been done, a portion eaten … Every awake human who isn’t Searching yet … in the room where the Clock put it, finds it: **Broom +1**" (Ch 6, *Finding it*) vs "while the prize is still inside (a prize that’s all eaten isn’t)" (Ch 6, *Searching*) | Can an all-eaten prize be found? At the end of round 6 Mia came into the dining room after the last portion was gone. I ruled she found the empty board (+1 Broom, Searching). That mattered: Broom 2 instead of 1. | Say which: "An empty plate still counts: a prize that's all eaten is found like any disturbed prize." Or "Once the prize is all eaten there's nothing left to find, only crumbs." |
| V-08 | minor | "A noise made on purpose leaves a **mess** (one per room, however many noises)" (Ch 6, *Luring*) and "A tag nobody saw is a **mess**" (Ch 9) | Velvet tagged the hall unseen (a mess) in round 7 and made a lure noise there in round 8. Is that one mess or two? I ruled one: Mia found it once (+1 Broom). | Ch 6: "A room holds one mess at a time, whatever left it (a lure, an unseen tag, a crash nobody saw)." |
| V-09 | minor | "It **tempts every cat** in its room, whatever its instincts (it’s still the Storyteller’s one temptation a round); giving in works like a Curious cat rummaging" (Ch 9, *The catnip stash*) | The wording fix reads cleanly, but the temptation never happens. Giving in pays 1 Cattitude, scores the same Cred and needs no roll in view. Going for it on purpose costs an Action and, in view, a roll. So it's always a gift, and a mean Storyteller never offers it. Tilly and Mags were beside it in rounds 2 and 5, and the Storyteller tempted someone else both times. The earlier reports saw the same. | Author's call: (a) **recommended:** "Giving in to the stash scores its Cred but no Cattitude: the catnip is its own reward." (b) "A cat that starts a round in the stash's room *is* tempted by it, and that's the Storyteller's one temptation that round." |
| V-10 | minor | "pay … **1 step** on the Mood meter that roll fills (Chapter 5) — even if nobody saw. A step paid this way … always lands" (Ch 4, *Push*) with "A meter never goes past full: steps beyond it are lost." (Ch 5) | When a Flop in view is already going to fill the meter, a Push paid with a step costs nothing: the extra step is lost. Biscuit (round 5) and Mags (round 9) both Pushed for free this way, and both rerolls worked (the climb done, the kitchen tagged). That's against "it always costs something". | Ch 4: "…or 1 step on the Mood meter that roll fills — but not if that meter is already full or the roll would fill it anyway: then pay Cattitude." (Or accept it, and add to Ch 12's *Questions at the table*: "a doomed cat may as well Push".) |
| V-11 | minor | "When a meter fills without a roll (a Searching human spots you, the prize or a mess is found), the Storyteller picks which cat **that human** can see gets it." (Ch 5, *Shoo!*) | In round 7, Rosalind spotted Tilly in the utility room while Dad and Mia spotted Mags in the kitchen: one +1 that filled Broom. Which human is "that human"? I ruled the one with the highest Attention, as for a roll (Rosalind), so Tilly got it. The Storyteller could otherwise have picked either cat. | "…the one with the highest Attention among the humans who did it (ties, the Storyteller) acts, and the Storyteller picks which cat that human can see gets it." |
| V-12 | minor | "A cat on the warden’s space at the end of the round must **dodge** … It works: the net swishes past and the warden goes sprawling over a bin; the cat stays where it is …, and he doesn’t move next round." and "he moves **1 space** — **2** if any cat’s roll ended in a Flop" (Ch 9, *A getaway round*) | The fixed dodge works, and nobody was carried over an obstacle. Three things aren't said: (1) can cats on the same space help a dodge? I ruled no; each cat dodges alone. (2) Does a sprawled warden still corner the cats on his space? I ruled yes. (3) Does a Flop in the sprawl round move him? I ruled no. In Drill W, Tilly dodged, Flopped the ring road the next round, and had to dodge again on the same space: Flop, pinched. That may be intended, but a player will expect a sprawled warden to be harmless for a round. | "…the cat stays where it is, and he doesn’t move at the end of next round, even after a Flop. He’s still there, though: a cat still on his space then dodges again. Each cat dodges on its own." |
| V-13 | minor | "A cat carrying loot has its mouth full: it can’t be Sweet (Chapter 8) unless it drops its loot first, on purpose, as part of that roll." (Ch 9) with "one leads and rolls, up to two help" (Ch 9) | Can a carrier *help* a Sweet roll? Helpers don't roll, but at the party gate "Sweet" is the guests being charmed. In Drill L the gang avoided the question: the carriers went in a Sneaky group. I'd rule yes: the carrier follows, it doesn't meow. Either way the group loses the loot die. | Add: "A carrier can still help a Sweet cat (it trots along behind, mouth full); the group loses the loot die as usual." Or: "…and it can’t help a Sweet roll either." |
| V-14 | minor | "A Flop: **pinched** — in the van, loot and all. Loot on his space is gone too." (Ch 9, *Cornered*) vs "loot there is gone" (Ch 12, getaway checklist) | Is loot lying on the warden's space gone whatever the dodges do, or only when a cat is pinched? The sentence sits in the Flop clause. I ruled always (the Ch 12 list). In Drill W, both pieces dropped by a Flop were lost when the warden ran onto that space, though both dodges worked. | Move it out of the Flop clause: "Any loot lying on the warden’s space when he stops is gone, whatever the dodges do." |
| V-15 | minor | "On the getaway they hang about on one obstacle. Any loot dropped **there** is nicked at once" (Ch 9, *The rivals*) | Spaces are now defined, but loot is dropped on spaces and the rivals stand on an obstacle. I'd rule a piece dropped by a group trying the rivals' obstacle, on the space in front of it, is nicked. That space is past 1 here. Not met: no Flop at the bouncy castle in any line. | "Any loot dropped on the space in front of their obstacle (by a Flop there, or on purpose) is nicked at once (gone)." |
| V-16 | minor | Quick Reference *The getaway* and *Cred* (`52-sheet-reference.html`) vs Ch 9 | The sheet matches the chapter on spaces, arrival, "never past a cat" and the stay-put dodge. It leaves out: no Sweet with loot; loot on the warden's space is gone; the rivals nick dropped loot; "not a Flop saved by a Push"; "each group's leader"; and that the catnip's 1 isn't doubled. A table using only the sheet would get Drill W's piece drop and the rivals wrong. | QR *The getaway*: add "Mouth full: no Sweet (drop the piece as part of the roll). Loot on the warden’s space, or dropped at the rivals, is gone. A Flop saved by a Push doesn’t speed him up." QR *Cred*: "the catnip 1 (not doubled) · each group’s leader past the rivals on a Clean or Purrfect 1". |
| V-17 | minor | "At the end of round 2 the van pulls up … (round 3 if nobody was Shooed or Scooped tonight" (Ch 9) vs the House Tracker (`51-sheet-tracker.html`) | The tracker records "Patience after each Shoo! or Scoop", which shows whether anyone was caught, but it has no getaway prompt for the warden's round. In a long night the Storyteller has to work it out from the Patience row. | Tracker, getaway row: add "Van arrives after round: 2 ☐ (someone Shooed or Scooped) · 3 ☐". |

*(17 issues: 0 blockers, 2 major, 15 minor.)*

### Fun and tone

- **Fun: rounds 1–6 were a proper heist.**
  - **The comic beats came from the rules:** Velvet's double-six hello to the party guests; the silent round where the cover came off a birthday cake behind a distracted Dad; Captain shrieking "CAT!" and pulling Dad out of the kitchen just in time; Rosalind finding half a cake ("MIA'S CAKE!"); Velvet forced by an empty Cattitude pile to knock the candles off the table; Tilly, with the zoomies, wolfing the last slice and being swept out of the patio door by Aunt Rosalind.
  - **Busy turns:** 22 of the 24 cat-turns in rounds 1–6 did something.
  - **The parrot was the best new toy.** A cat standing in the dining room makes Captain squawk in the Pets step, and that pulled Dad off the open cake in round 2. That is exactly the kind of plan the players should find, and it worked by the book.
- **Not fun: the tail, rounds 7–10.**
  - The first Shoo! from the dining room shut the patio door, and the Storyteller had no choice about it (it's in the room). From then on, the only way out was the utility window, in a room the Searching Rosalind kept coming back to.
  - With Cuddle the fuller meter and kids about, any Flop in view risked a Scoop and a pinch. So the gang's way out was to feed the Broom on purpose, with lures and messes, and get thrown out one at a time.
  - **Idle cats:** meanwhile Biscuit stood in the garden for five rounds and Tilly for three. 9 of the 16 cat-turns in rounds 7–10 were idle. Chapter 13 itself says "waiting is boring".
  - **Idea (author's call, not a rule proposal):** something for cats outside to do, such as yowling at the window as a lure from outside, or tagging the garden shed.
- **The zoomies were a damp squib.** Tilly took the nip in an empty room for no roll. She used the +1 die twice, got Shooed straight after eating the last portion, and came back for half a round, so nothing she scored was doubled. The fix ("every tag a roll") reads well, but this house never tested it.
- **The Cred race was a race this time.** Mags 6, Velvet 3, Biscuit 1, Tilly 1. The Cat's Whiskers went to the cat who also ate the most cake, and in-view tags (Mags's dining room and kitchen) were the big, risky, satisfying moments. The gang reached 8 Cred for the Rep in round 9 without forcing it. One night isn't enough to say whether 8 is too low.
- **Push-for-a-Purrfect** on the getaway was used four times (once in the main line's G2, once in G4, and twice in Drill L), with no Purrfect from any of them. It's still a nice use for Cattitude that would otherwise be lost.
- **Tone:** nothing broke the light, comic feel. Eating a child's whole birthday cake could read as mean, but the house's epigraph ("Happy birthday, Mia. Sorry about the cake.") and Rosalind's outrage keep it a cartoon. The broom, the bins and the warden's sprawl all stayed slapstick. Tilly's pinch in Drill W read as "the net finally caught something other than a bin lid".
- **For an 8-year-old:**
  - "Why can't we carry the cake home? The book says we can." (V-02)
  - "Is it round 8 or round 9?" (V-01)
  - "He fell over a bin, so why did he catch me?" (V-12)

## Fix checks

What each fix said, whether it came up tonight, and whether it worked. "Drill" means it came up only in a supplementary drill.

| Fixed rule | Where | Met? | Worked? | Notes |
|---|---|---|---|---|
| The route has five spaces: garden, past 1, past 2, past 3, hideout | Ch 9, *The route*; tracker | Main, drills | **Yes** | Every position and the warden's square were unambiguous, and the tracker's getaway row has the same five columns. |
| The warden arrives after round 2, or round 3 if nobody was Shooed or Scooped | Ch 9; Ch 12; QR | Main (round 2), Drill L (round 3) | **Yes** | Both branches were used. A gang moving one obstacle a round was never caught by a late warden. |
| He never passes a cat; he stops on the rearmost cat's space | Ch 9 | Drill W, round 5 | **Yes** | A Flop sent him 2 spaces, and he stopped on past 3 with the two stuck cats instead of reaching the hideout. |
| A dodge that works: the cat stays put, the warden sprawls and skips a move | Ch 9; Ch 12; QR | Drill W, rounds 5–6 | **Yes** (and V-12) | Nobody was carried over an obstacle. Not said: helpers, a sprawled warden still cornering, a Flop in the sprawl round. |
| A group loses 1 die if any cat in it carries loot (not a Chonky cat with a single piece) | Ch 9 | Drill L, Drill W | **Yes** | The carrying group lost the die on all four rolls in Drill L. In Drill W, Biscuit's single piece cost nothing, and Tilly's piece cost their group the die. |
| No Sweet with loot, unless the piece is dropped as part of the roll | Ch 9 | Drill W, Drill L | **Yes** (and V-13) | Velvet dropped her piece to go Sweet at the gate, and Biscuit picked it up. Whether a carrier can help a Sweet roll isn't said. |
| Outcomes count against the whole prize | Ch 9; QR | Main, drills | **Yes** | 8 of 8 (Clean), 8 of 8 (Drill L, Clean), 6 of 8 with a pinch (Drill W, Messy). No arguments about the total. |
| A cat can wait (no roll) | Ch 9; Ch 12 | Drill W | **Yes** | Tilly, with 0 dice, waited in the garden for a helper. |
| A pet on the route: every cat or group rolls past it | Ch 9 | **No** | — | This route has no pet. |
| A Flop saved by a Push doesn't speed the warden | Ch 9 | **No** | — | No Pushed Flop on any getaway. |
| Unseen tags: no roll, no noise, a mess found by a human ending a round there; the mess clears, the Cred and the tag stay | Ch 9; QR | Main, 4 times | **Yes** | Utility (found, +1), hall (found, +1, V-08), living room (found; it filled the Broom that put Velvet out). The rooms stayed tagged. |
| In-view tags: a roll, Sneaky or Savage, plain; +1 Cred if it works; not a mess | Ch 9; QR | Main, rounds 7 and 9 | **Yes** | Mags's dining-room tag (Clean) and kitchen tag (a Pushed Scrape) each scored 2, paid their Broom step, and left no mess. |
| The zoomies: +1 die; every roll a noise; every tag a roll; can't resist; ×2; wear off when the getaway starts | Ch 9; QR | Main, partly | **Yes, as far as it went** | +1 die and "every roll a noise" were used (round 6; round 7's Clean climb was still a noise). They wore off as the getaway started, although Tilly was already outside. Never met: a zoomies tag, a temptation while on zoomies, any doubled Cred. |
| The catnip as the Storyteller's one temptation a round | Ch 9 | **No** | Reads clearly (V-09) | Never offered: giving in is a gift, so the mean Storyteller tempted someone else in both rounds a cat stood beside it. |
| The catnip's own 1 Cred isn't doubled; the yowl is a noise, not a mess; then it tempts nobody | Ch 9 | Main, round 5 | **Yes** | Tilly scored 1. Her yowl drew Leo, and there was no mess for him to find from it. |
| The rivals' point goes to each group's leader (a cat alone counts) | Ch 9 | Main G2; Drill L | **Yes** | Biscuit's Clean scored and Tilly's Scrape didn't, in the same round. In Drill L, Tilly's Purrfect scored both the rivals and the leap. |
| Rep at 8 for the gang's Cred on a night that wasn't Busted | Ch 9; Ch 14; QR | Main | **Yes** | The gang scored 11, so 1 Rep (plus 1 for Clean). One cat reaching 8 alone would also be a gang total of 8, so there's no ambiguity. |
| The Den: a cat that walks in on its own isn't shut in | Ch 10; Ch 18 ways | Main, rounds 7–8 | **Yes** | Velvet walked into the loo and out again. Nobody was ever shut in. |
| The Scrapper temptation, and the dog-in-the-room exception | Ch 7 | **No** | — | No dog or house cat at this house, so Biscuit's Scrapper instinct never tempted. The new wording reads clearly. |
| The parrot squawks in the Pets step if it saw an unhidden cat at any time this round | Ch 6; Ch 11 | Main, 5 rounds | **Yes** | A cat that started the round in the dining room and left still got squawked at (round 2), and that lure kept the open cake unfound. Captain's cage was never covered. |
| The Shoo shuts the entrance unless it's the last one open (a cat flap gets locked) | Ch 5; QR | Main, 5 Shoos | **Yes** (and V-05) | The patio door was shut after the first Shoo, and opened and shut again for two more. The window, as the last one open, stayed open twice. There's no cat flap here, so the lock wasn't met. |
| The human carrying the prize answers noise and follows routine until the Clock first puts it down | Ch 8 | **No** | — | Dad puts the cake down at the start of round 1, so nobody carries it in a round when cats act. |
| Shiny things in every room, printed under the rooms table | Ch 18 | Main | **Yes** | They made 3 of the 7 temptations possible, all of them Velvet's (the hall twice, the dining room once), and a fourth in the loo that the Storyteller passed up. |
| Catnip stash and rivals' tag in the rooms table; Knacks printed on the route | Ch 18 | Main | **Yes** (and V-03) | Both were planned around from round 1. The gate's Knacks are printed, but their order is unclear. |
| The sheets match the chapters | `50`, `51`, `52` | Main | **Mostly** (V-16, V-17) | The cat sheet's Zoomies and Cred boxes and the tracker's five-space getaway row were all used. The QR leaves out a few getaway and Cred details, and the tracker has no prompt for the warden's round. |

**Earlier issues met again** (Number 12 v09 report = N12, Marchetti v09 report = MS):
- **Fixed, and the fix worked in play:**
  - N12 W-01 (the Den);
  - N12 W-02 / MS W-04 (spaces);
  - N12 W-03 / MS W-02 (dodges);
  - N12 W-04 / MS W-03 (the loot die);
  - N12 W-05 / MS W-01 (the whole prize);
  - N12 W-08 / MS W-13 (in-view tags aren't messes);
  - N12 W-09 / MS W-08 (Rep);
  - N12 W-11 (a found tag keeps its Cred);
  - N12 W-12 / MS W-14 (the nip's own point);
  - N12 W-13 / MS W-15 (the yowl isn't a mess);
  - N12 W-15 / MS W-24 (each group's leader);
  - N12 W-17 / MS W-11 (shiny things printed);
  - N12 W-18 (the stash and the rivals in the rooms table);
  - N12 W-24 (no-loot getaways kept quick);
  - N12 W-25 (the warden collects at the van);
  - MS W-05 (no Sweet with loot);
  - MS W-16 (the zoomies wear off at the getaway);
  - MS W-17 (the stash tempts nobody once taken);
  - MS W-25 (waiting);
  - MS W-27 (the tag examples are harmless now).
- **Fixed, but only partly:**
  - N12 W-19 / MS W-22: Knacks are printed on the route, but their order is unclear (V-03).
  - N12 W-26: the sheets are much closer; small gaps remain (V-16).
- **Fixed in the wording, but still doesn't happen in play:** N12 W-14 (the catnip as a temptation; V-09).
- **Seen in play:** MS W-21 (taking the broom on purpose is now in Chapter 12's questions). Rounds 8–10 were played exactly that way.
- **Not reachable here:**
  - N12 W-06 / W-07 (zoomies tags), N12 W-10 (cat flap), N12 W-20 (flap lock), N12 W-21 (the human carrying the prize), N12 W-23 (Charge);
  - MS W-07 (Scrapper), MS W-18 and W-19 (dogs), MS W-23 (a pet on the route), MS W-26 (a Pushed Flop on the getaway).

## Dice appendix

Every roll, in order, as logged by the script before it was used. Rolls #13–#16 were made in one command, before the Push decisions on them. Each roll was independent and read in order, and the Pushes (#17) were rolled afterwards.

| # | Dice | Faces | Purpose | Used as |
|---|---|---|---|---|
| 1 | 4d6 | 3 6 6 4 | R1 Velvet front door, say hello: Sweet 3 + Lap Cat 1, plain, guests Att 0 | Purrfect: in, quiet; Velvet Cattitude 2→3 |
| 2 | 2d6 | 1 4 | R1 Mags utility window: Sneaky 3 - 1 Tricky | Scrape: in, noise in the utility |
| 3 | 2d6 | 6 6 | R1 Tilly utility window: Sneaky 2 + Climber 1 - 1 Tricky | Purrfect: in, quiet; Tilly Cattitude 2→3 |
| 4 | 1d6 | 4 | R1 squawk tie-break Mia(1-3) vs Leo(4-6) | 4: Leo answers the squawk |
| 5 | 1d6 | 1 | R1 Mia routine (1-2 stay, 3 Dining, 4 Hall, 5 Kitchen, 6 Living) | 1: Mia stays in the living room |
| 6 | 3d6 | 2 6 5 | R2 Velvet Distract Dad (kitchen): Sweet 3 + Lap Cat 1 - Att 1 | Clean: Dad Distracted; Cuddle 1 |
| 7 | 3d6 | 4 6 3 | R2 Mags step 1 climb (kitchen, unseen): Sneaky 3 + Biscuit helps 1 - 1 Tricky | Clean: step 1 done, quiet |
| 8 | 3d6 | 4 1 2 | R2 Tilly step 2 wrapping (kitchen, unseen): Streetwise 3 + Curious 1 - 1 Tricky | Scrape (Pushed) |
| 9 | 3d6 | 6 1 4 | R2 Tilly Push wrapping (reroll 4 1 2), paid 1 Cattitude | Clean: step 2 done, quiet; Tilly 3→2 |
| 10 | 1d6 | 3 | R2 Rosalind routine (1-4 stay, 5 Kitchen, 6 Living) | 3: Rosalind stays in the utility |
| 11 | 1d6 | 3 | R2 Mia routine (1-2 stay, 3 Dining, 4 Hall, 5 Kitchen, 6 Living) | 3: Mia → dining room |
| 12 | 1d6 | 5 | R2 Leo routine (1-2 stay, 3-4 Dining, 5 Hall, 6 Living) | 5: Leo → hall |
| 13 | 4d6 | 3 1 3 1 | R3 Biscuit eat portion (kitchen, unseen): Savage 3 + Foodie 1 | Flop (Pushed) |
| 14 | 3d6 | 6 1 6 | R3 Mags eat portion (kitchen, unseen): Sneaky 3 | Purrfect: portion 1; Mags 2→3 |
| 15 | 2d6 | 4 5 | R3 Tilly eat portion (kitchen, unseen): Sneaky 2 | Scrape: portion 2, noise |
| 16 | 2d6 | 2 4 | R3 Velvet eat portion (kitchen, unseen): Sneaky 2 | Scrape: portion 3, noise |
| 17 | 4d6 | 6 2 6 1 | R3 Biscuit Push eat (reroll 3 1 3 1), paid 1 Broom step | Purrfect: portion 4; Broom 1 (the paid step lands); Biscuit 1→2 |
| 18 | 1d6 | 5 | R3 Dad routine (1 stay, 2-3 Kitchen, 4-5 Dining, 6 Living) | 5: Dad → dining room |
| 19 | 1d6 | 2 | R3 Mia routine (1-2 stay, 3 Dining, 4 Hall, 5 Kitchen, 6 Living) | 2: Mia stays |
| 20 | 1d6 | 1 | R3 Leo routine (1-2 stay, 3-4 Dining, 5 Hall, 6 Living) | 1: Leo stays |
| 21 | 2d6 | 6 2 | R4 Velvet Distract Rosalind (kitchen, Searching): Sweet 3 + Lap Cat 1 - Att 2 | Clean: Rosalind Distracted; Cuddle 2 |
| 22 | 4d6 | 2 3 2 1 | R4 Biscuit eat (kitchen, Rosalind Distracted): Savage 3 + Foodie 1 | Flop (Pushed) |
| 23 | 4d6 | 1 2 3 6 | R4 Biscuit Push eat (reroll 2 3 2 1), paid 1 Cattitude | Clean: portion 5; Biscuit 2→1 |
| 24 | 3d6 | 5 3 3 | R4 Mags eat (kitchen, Rosalind Distracted): Sneaky 3 | Scrape: portion 6, noise |
| 25 | 2d6 | 2 1 | R4 Tilly eat (kitchen, Rosalind Distracted): Sneaky 2 | Flop (Pushed) |
| 26 | 2d6 | 1 3 | R4 Tilly Push eat (reroll 2 1), paid 1 Cattitude | Flop: no portion; Tilly 2→1 |
| 27 | 1d6 | 5 | R4 kitchen noise tie-break among Dad(1-2) Mia(3-4) Leo(5-6), all 1 room, Att 1 | 5: Leo answers the kitchen noise |
| 28 | 1d6 | 3 | R4 Dad routine (1 stay, 2-3 Kitchen, 4-5 Dining, 6 Living) | 3: Dad → kitchen |
| 29 | 1d6 | 6 | R4 Mia routine (1-2 stay, 3 Dining, 4 Hall, 5 Kitchen, 6 Living) | 6: Mia → living room |
| 30 | 2d6 | 3 1 | R5 Velvet Distract Dad (dining, 2nd distraction): Sweet 3 + Lap Cat 1 - Att 1 - 1 earlier | Flop (Pushed) |
| 31 | 2d6 | 3 1 | R5 Velvet Push Distract (reroll 3 1), paid her last Cattitude | Flop: Broom 3→5; Velvet 1→0 |
| 32 | 2d6 | 3 1 | R5 Biscuit step 1 climb onto dining table, in view of Dad: Savage 3 - 1 Tricky | Flop (Pushed) |
| 33 | 2d6 | 3 6 | R5 Biscuit Push climb (reroll 3 1), paid 1 Broom step (meter fills either way) | Clean: dining-table climb done; Broom full: Shoo! Biscuit |
| 34 | 1d6 | 5 | R5 Mia routine (1-2 stay, 3 Dining, 4 Hall, 5 Kitchen, 6 Living) | 5: Mia → kitchen |
| 35 | 2d6 | 5 1 | R6 Mags eat (dining, in view of Dad+Rosalind, Searching): Savage 2 | Scrape: portion 7; Broom 4 |
| 36 | 2d6 | 2 4 | R6 Tilly eat last portion (dining, in view, zoomies): Savage 1 + zoomies 1 | Scrape: portion 8, the cake is gone; Broom full: Shoo! Tilly |
| 37 | 1d6 | 6 | R6 Leo routine (Searching, sees no cat, no cat next door): 1-2 stay, 3-4 Dining, 5 Hall, 6 Living | 6: Leo → living room |
| 38 | 2d6 | 5 6 | R7 Mags tag dining room in view (Dad, Rosalind, Mia Searching): Savage 2, plain | Clean: dining room tagged in view (Mags +2); Broom 3 |
| 39 | 3d6 | 3 2 6 | R7 Tilly back in through utility window (unseen, zoomies): Sneaky 2 + Climber 1 + zoomies 1 - 1 Tricky | Clean, but a noise (zoomies): Tilly back in |
| 40 | 1d6 | 3 | R8 hall noise tie-break among Dad(1-2) Mia(3-4) Leo(5-6), all 1 room, Att 1 | 3: Mia answers the hall lure |
| 41 | 2d6 | 1 1 | R9 Mags tag kitchen in view (Dad, Leo, Rosalind Searching): Savage 2, plain; Broom 2/3 Cuddle 2/3 level | Flop (Pushed) |
| 42 | 2d6 | 1 4 | R9 Mags Push kitchen tag (reroll 1 1), paid 1 Broom step (meter fills either way) | Scrape: kitchen tagged in view (Mags +2); Broom full: Shoo! Mags |
| 43 | 1d6 | 1 | R9 Dad routine (Searching, no cat in sight or next door): 1 stay, 2-3 Kitchen, 4-5 Dining, 6 Living | 1: Dad stays in the kitchen |
| 44 | 1d6 | 3 | R9 Leo routine (Searching, no cat in sight or next door): 1-2 stay, 3-4 Dining, 5 Hall, 6 Living | 3: Leo → dining room |
| 45 | 1d6 | 1 | R10 living-room lure tie-break among Dad(1-2) Mia(3-4) Leo(5-6), all 2 rooms, Att 1 | 1: Dad answers Velvet's lure |
| 46 | 1d6 | 2 | R10 Mia routine (Searching, no cat seen): 1-2 stay, 3 Dining, 4 Hall, 5 Kitchen, 6 Living | 2: Mia stays |
| 47 | 1d6 | 4 | R10 Leo routine (Searching, no cat seen): 1-2 stay, 3-4 Dining, 5 Hall, 6 Living | 4: Leo → dining room (stays) |
| 48 | 1d6 | 5 | R10 Rosalind routine (Searching, no cat seen): 1-4 stay, 5 Kitchen, 6 Living | 5: Rosalind → kitchen |
| 49 | 5d6 | 6 4 5 3 5 | G1 party gate: Velvet leads Tilly+Biscuit, Sweet 3 + Lap Cat 1 + 2 helpers = 6, cap 5, plain | Clean: all three over |
| 50 | 3d6 | 2 6 6 | G1 party gate: Mags solo, Sneaky 3 + Box Sitter 1 - 1 Tricky | Purrfect: over; Mags +1 Cred, 2→3 |
| 51 | 3d6 | 1 6 2 | G2 bouncy castle (rivals): Biscuit leads Velvet, Savage 3 + 1 helper - 1 Tricky | Clean: over; Biscuit +1 (led past the rivals) |
| 52 | 3d6 | 4 5 5 | G2 bouncy castle (rivals): Tilly leads Mags, Sneaky 2 + Climber 1 + 1 helper - 1 Tricky | Scrape: over |
| 53 | 2d6 | 1 2 | G2 Biscuit Push for Purrfect (reroll 1 2, keep 6), paid 1 Cattitude | Still Clean; Biscuit 1→0 |
| 54 | 3d6 | 3 4 2 | G3 high back fence: Biscuit leads Velvet, Savage 3 + 1 helper - 1 Tricky | Scrape: over |
| 55 | 2d6 | 3 4 | G3 high back fence: Mags leads Tilly, Sneaky 3 + 1 helper - 2 Hard | Scrape: over |
| 56 | 3d6 | 1 5 2 | G4 ring road: Tilly leads Velvet, Streetwise 3 + 1 helper - 1 Tricky | Scrape: home |
| 57 | 3d6 | 6 2 2 | G4 ring road: Mags leads Biscuit, Savage 2 + Hunter 1 (bolt) + 1 helper - 1 Tricky | Clean: home |
| 58 | 2d6 | 2 4 | G4 Mags Push for Purrfect (reroll 2 2, keep 6), paid 1 Cattitude | Still Clean; Mags 3→2 |
| 59 | 5d6 | 4 3 1 4 1 | DrillL G1 gate: Velvet (no loot) leads Tilly, Sweet 3 + Lap Cat 1 + 1 helper, plain | Scrape: over |
| 60 | 3d6 | 2 6 6 | DrillL G1 gate: Mags (1 pc) leads Biscuit (2 pcs), Sneaky 3 + Box Sitter 1 + 1 helper - 1 Tricky - 1 loot | Purrfect: over with all 3 pieces; Mags +1 (drill), 2→3 |
| 61 | 3d6 | 3 6 6 | DrillL G2 castle (rivals): Tilly leads Velvet, Sneaky 2 + Climber 1 + 1 helper - 1 Tricky | Purrfect: over; Tilly +2 (rivals, leap) (drill), 0→1 |
| 62 | 2d6 | 2 4 | DrillL G2 castle (rivals): Mags (1 pc) leads Biscuit (2 pcs), Sneaky 3 + 1 helper - 1 Tricky - 1 loot | Scrape: over with the loot |
| 63 | 2d6 | 1 4 | DrillL G3 fence: Tilly leads Velvet, Savage 1 + Climber 1 + 1 helper - 1 Tricky | Scrape: over |
| 64 | 2d6 | 2 6 | DrillL G3 fence: Biscuit (2 pcs) leads Mags (1 pc), Savage 3 + 1 helper - 1 Tricky - 1 loot | Clean: over with the loot |
| 65 | 3d6 | 6 1 2 | DrillL G4 ring road: Tilly leads Velvet, Streetwise 3 + 1 helper - 1 Tricky | Clean: home |
| 66 | 2d6 | 2 6 | DrillL G4 ring road: Biscuit (2 pcs) leads Mags (1 pc), Savage 3 + 1 helper - 1 Tricky - 1 loot | Clean: home with all 3 pieces |
| 67 | 2d6 | 5 4 | DrillL G4 Tilly Push for Purrfect (reroll 1 2), paid 1 Cattitude | Still Clean; Tilly 1→0 |
| 68 | 1d6 | 3 | DrillL G4 Biscuit Push for Purrfect (reroll 2), paid 1 Cattitude | Still Clean; Biscuit 1→0 |
| 69 | 4d6 | 6 5 5 4 | DrillW G1 gate: Velvet drops her piece as part of the roll, Sweet 3 + Lap Cat 1, plain | Clean: over; her piece lies in the garden |
| 70 | 3d6 | 2 5 1 | DrillW G1 gate: Mags solo (no loot), Sneaky 3 + Box Sitter 1 - 1 Tricky | Scrape: over |
| 71 | 1d6 | 5 | DrillW G2 castle (rivals): Velvet solo, Sneaky 2 - 1 Tricky | Scrape: over, no rivals' point |
| 72 | 2d6 | 3 4 | DrillW G2 castle (rivals): Mags solo, Sneaky 3 - 1 Tricky | Scrape: over |
| 73 | 2d6 | 5 3 | DrillW G2 gate: Biscuit (1 pc, free) leads Tilly (1 pc), Savage 3 + 1 helper - 1 Tricky - 1 loot | Scrape: over with both pieces |
| 74 | 2d6 | 4 6 | DrillW G3 fence: Mags leads Velvet, Sneaky 3 + 1 helper - 2 Hard | Clean: over |
| 75 | 2d6 | 3 5 | DrillW G3 castle (rivals): Biscuit (1 pc) leads Tilly (1 pc), Savage 3 + 1 helper - 1 Tricky - 1 loot | Scrape: over, no rivals' point |
| 76 | 3d6 | 5 2 1 | DrillW G4 ring road: Mags leads Velvet, Savage 2 + Hunter 1 + 1 helper - 1 Tricky | Scrape: home |
| 77 | 2d6 | 6 5 | DrillW G4 fence: Biscuit (1 pc) leads Tilly (1 pc), Savage 3 + 1 helper - 1 Tricky - 1 loot | Clean: over |
| 78 | 2d6 | 1 3 | DrillW G5 ring road: Tilly (1 pc) leads Biscuit (1 pc), Streetwise 3 + 1 helper - 1 Tricky - 1 loot | Flop: stuck on past 3, both pieces dropped |
| 79 | 2d6 | 4 1 | DrillW G5 cornered on past 3: Tilly dodge, Sneaky 2, plain | Scrape: dodge works, Tilly stays put |
| 80 | 3d6 | 6 2 1 | DrillW G5 cornered on past 3: Biscuit dodge, Savage 3, plain | Clean: dodge works, Biscuit stays put; the warden sprawls |
| 81 | 3d6 | 3 2 2 | DrillW G6 ring road: Tilly leads Biscuit (no loot now), Streetwise 3 + 1 helper - 1 Tricky | Flop: stuck again |
| 82 | 2d6 | 3 2 | DrillW G6 cornered again on past 3: Tilly dodge, Sneaky 2, plain | Flop: Tilly pinched |
| 83 | 3d6 | 2 6 2 | DrillW G6 cornered again on past 3: Biscuit dodge, Savage 3, plain | Clean: dodge works; the warden sprawls again |
| 84 | 2d6 | 6 5 | DrillW G7 ring road: Biscuit solo, Savage 3 - 1 Tricky | Clean: Biscuit home |

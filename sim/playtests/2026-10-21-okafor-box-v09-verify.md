# Playtest: The Okafors' Big Box (Standard), gang of 3 rolled cats, rules v0.9 after the fix round, real dice

*2026-10-21 · A verification playtest after the fix round, played strictly by the rulebook source: Chapters 1–14 (`book/src/chapters/11-ch01` to `33-ch14`, including Chapter 9, The Getaway, with "Cred: showing off"), the house chapter `42-ch16-okafor-box.html`, the floor plan `book/art/map-okafor-box.svg` (read as text for its labels) and the three sheets (`50`, `51`, `52`). One agent played the Storyteller and all three players. The Storyteller played the house by its chapter and Chapter 12 and tempted meanly, by the rules; the players played to win and to score Cred. The simulator, the Foundry module, the design notes and the review log were not read; the two earlier v0.9 reports (Number 12 and Chef Marchetti's Salmon) were read for format and for the issues the fix round addressed. Every die came from `crypto.randomInt` through a logging script that wrote each roll and its purpose to this playtest's own log before the result was used. All 75 rolls are in the Dice appendix, including a branch and a short drill rolled to reach rules the main line never touched.*

## Summary

- **Outcome: Clean Getaway.** All 3 pieces of the box got home and nobody was pinched, Shooed, Scooped, Held or shut in. The house part ended at the end of round 7 (of a possible 17), and the gang was home after 4 getaway rounds.
- **The line:**
  1. **Round 1.** Sully came in through the garage side door and tagged over the Satin Paws' mark (2 Cred). Dot came in through the dog door past the sleeping Noodle and tagged the kitchen (1). Mags climbed in through the bathroom window.
  2. **Round 2.** Mags rattled the loft ladder on the landing as a lure. Tayo came to look (and found the mess: Broom 1), and Mrs Okafor's routine took her off to the living room. The hall, and the box, were alone.
  3. **Round 3.** Mags went into Tayo's room (the Den) and rolled in his catnip fish: 1 Cred and **the zoomies**. Dot and Sully (Chonky) picked up the box in the empty hall.
  4. **Round 4.** A quiet Clean haul into the kitchen; Noodle slept through it. Mags tagged Tayo's room right under his nose (4 Cred).
  5. **Round 5.** The Clock sent Mrs Okafor back for the box. It was gone: Broom 3, and she started **Searching**. A noisy haul into the garage woke Noodle, who padded into the garage after them. Mags tagged the landing (a roll and a noise on the zoomies), and Tayo came up and found it (Broom 4).
  6. **Round 6.** The Storyteller tempted Dot to square up to Noodle (the new Scrapper rule); he resisted. A Clean haul took the box out of the side door. Mags tagged the hall in front of the Searching Mrs Okafor (4 Cred). Tayo came down at the yowl and found the box's spot empty (Broom 7/9).
  7. **Round 7.** Mags walked out of the dog door rather than risk a Shoo! for 2 more Cred.
  - **The getaway (4 rounds).** One group of three, the best leader each time, and every roll one die down for the loot. Dot's Flop at the terrier was Pushed into a Clean. Dot led over the Satin Paws' garage roofs with a Clean, then Pushed it into a Purrfect (2 Cred). The warden jumped out at the end of round 3 (nobody was Shooed or Scooped), and Sully crossed the main road with three 6s.
- **Loot home:** 3 of 3 pieces (the box and what's in it). **End Mood:** Broom 7/9, Cuddle 0/9, Patience 9.
- **Cred:** **Gutter Mags 11**, Lucky Dot 3, Two-Bin Sully 3 (the gang: 17). **The Cat's Whiskers: Gutter Mags.** In a campaign the night is worth **2 Rep**: 1 for the Clean Getaway, and 1 because the gang's Cred reached 8 (it did by the end of round 4) and the night wasn't Busted.
- **Rolls:**
  - **Cats in the house:** 7 rolls and 1 Push. Results: 3 Clean, 4 Scrape, 0 Flop, 0 Purrfect.
  - **Cats on the getaway:** 4 rolls and 2 Pushes. Final results: 1 Scrape, 1 Clean, 2 Purrfect, 0 Flop.
  - **Storyteller:** 11 rolls: 7 human routines, 3 for Noodle and 1 noise tie.
  - **Making the gang:** 29. **Branch S:** 10. **Drill W:** 11. **In all:** 75 dice-log entries.
- **Temptations:** 4 offered (Sully twice, Mags, Dot), 4 resisted. In rounds 1, 5 and 7 nobody could be tempted.
- **Cat-turns in the house: 21.** 18 were active (a roll, a help, a tag, a lure, a pick-up, the catnip or a hide) and 3 were idle (round 7: two cats outside, one walking out).
- **What-ifs (real dice, not the result):**
  - **Branch S** (from round 7, the Cred-hungry choice): Mags tags the living room, gets Shooed out of the dog door, and the dog door is locked behind her. The warden then arrives a round early, but the gang still gets home Clean.
  - **Drill W** (every cat running on its own): drops, a pick-up, waiting, four dodges and a sprawling warden. Stopped once the rules were covered.
- **Issues: 15** (0 blockers, 0 major, 15 minor). **The fixes held:** every fixed rule I met worked as written (see *Fix checks*). **Top 5:**
  1. **V-02:** a prize that's already out of the house is still "found" by anyone who walks into its Clock room. Tayo's find added the Broom step that turned Branch S into a Shoo!.
  2. **V-10:** the zoomie cat still runs away with the Cred (11 against 3 and 3; 13 against 2 and 1 in Branch S). The fix made it cost something (5 of the 7 Broom steps), but in a three-cat Large-box job the one cat who isn't carrying takes the nip and every tag.
  3. **V-01:** Chapters 5 and 6 say the Storyteller breaks ties between humans; Chapter 12 says roll a die. This came up three times.
  4. **V-08 and V-09:** dodge details. Does a sprawled warden skip his move even after a Flop? Can cornered cats help each other, and does the loot die count on a dodge?
  5. **V-03:** is the loot die taken off before or after the cap of 5? It changes a Climber's gate roll from 5 dice to 4.

## The gang

**Method:** Chapter 2's random method, rolling everything with real dice:
- **Name:** a d6 on each column. A repeat means rolling the Name column again.
- **Looks:** coat, mark (both a real d8) and eyes (a d6).
- **Approaches:** the 3 (a d6, with "move along" if it's taken), then the 2 (a d6, counting along from the 3, going round after Streetwise).
- **Instincts:** two d8s.
- **Body and quirk:** a d6 each.
- **Start:** Cattitude **3** each (a gang of three) and 9 Lives.

| Cat | Body | Sneaky | Sweet | Savage | Streetwise | Instincts (Knack) | Looks / quirk | Dice |
|---|---|---|---|---|---|---|---|---|
| **Lucky Dot** | Lean | **3** | 1 | 1 | 2 | Hunter (pounce, chase), Scrapper (face down animals) | Black, a notch in one ear, amber eyes; hates the rain | #1–#9 |
| **Two-Bin Sully** | **Chonky** | 1 | 1 | 2 | **3** | Knocker (knock, push, topple), Lap Cat (charm a human) | Cream, an old collar too big, blue eyes; collects bottle caps under the bakery steps | #10–#18 (#15: a 6, going round after Streetwise → Savage 2) |
| **Gutter Mags** | Lean | 2 | 1 | **3** | 1 | Foodie (find, steal, eat food), Climber (climb, jump, balance) | Cream, a tattoo (an anchor, picked from the three), blue eyes; talks to pigeons | #19–#29 (#19 rolled "Dot", taken; #24 "Sully", taken; #25 "Mags") |

**What the dice gave:**
- **One cat at 3 in each of Sneaky, Savage and Streetwise, and no Charmer at all.** Every cat has Sweet 1, so there are no Distracts worth trying and Noodle can't be befriended (Sweet 1 − 2 = 0 dice). The gang has to work round the humans: lures, empty rooms and quiet hauls.
- **Sully is Chonky,** so two cats can carry the Large box and the third is free.
- **Dot is the only Scrapper,** so an awake Noodle tempts him.
- **Sully is a Knocker:** the shiny things in every room tempt him anywhere in the house.
- **Mags is the Climber,** so the bathroom window and the garage roofs suit her.
- The name rule worked smoothly: two repeats, two rerolls of the Name column.

**Setup, the house's three-cat numbers** (*At a glance*):
- **Patience 9**, Mood 0/0.
- **The box** is Large: 3 pieces of loot.
- **The Prize Clock:** it's put down in the hall in round 1 and moved to the living room in round 5. It's **gone at the start of round 15**, and **Lights Out** falls at the end of round 17.
- **Cattitude:** 3 each.
- **Cred:** the catnip stash is Tayo's catnip fish, under the bed in Tayo's room (the Den). The Satin Paws have tagged the garage, and on the getaway they hang about on the garage roofs (obstacle 3).

**The house as the players see it:**
- **Rooms:** Hall (Mrs Okafor, Attention 1, with the box), Living room (Tayo, Attention 1, a kid), Kitchen (Noodle, dog, rating 2, soft, asleep), Garage, and upstairs the Landing, Bathroom and Tayo's room.
- **Ways:** Hall–Living room Big · Hall–Kitchen Big · Kitchen–Garage Big · Hall–Landing Normal · Landing–Bathroom Big · Landing–Tayo's room Big. The map shows no way between the living room and the kitchen. I ruled that "next door" means joined by a way.
- **Entrances:**
  1. Front door, in the hall: round 1 only, one cat.
  2. Dog door, in the kitchen: Normal, no roll. Nothing calls it noisy, so I ruled it quiet.
  3. Bathroom window: a climb, Tricky, Small things only.
  4. Garage side door, ajar: Big, no roll. It's the box's only way out after round 1.

**Pools against this house** (before helpers; the most dice each cat can roll):
- **Haul** (Sneaky or Savage, plain): Dot Sneaky 3; Mags Savage 3; Sully Savage 2 +1 Knocker = 3.
- **Bathroom window** (Tricky): Mags 3 (Savage + Climber); Dot 2; Sully 1.
- **Distract Mrs Okafor:** Sully 1 (Sweet + Lap Cat − Attention); the others 0.
- **Befriend Noodle:** 0 for everyone. **Drive Noodle off:** Mags 1; the others 0.
- **The getaway,** as one group of three with loot aboard: gate 4, terrier 3, garage roofs 3, main road 4.

**The plan:** Sully and Dot carry the box (Dot leads Sneaky hauls) along hall → kitchen → garage → side door. Mags, who isn't carrying, goes upstairs for the catnip. Her noise pulls the humans away from the box's route. The zoomie cat "can't resist" temptations, so she must never be a carrier: a carrier who gives in drops the box.

## Play log

### Round 1

- **Prize Clock:** Mrs Okafor puts the box down in the hall and stays with it this round, deaf to noise. It has no steps.
- **Temptation:** none, because every cat is outside.
- **The cats:**
  - **Sully** comes in through the garage side door (Move, no roll). He **tags the garage over the Satin Paws' mark** (Action). Nobody sees it: no roll, no noise, and it leaves a mess. 1 + 1 = **2 Cred.**
  - **Dot** comes in through the dog door (Move) and pads past the sleeping Noodle. He **tags the kitchen** unseen: **1 Cred**, and a mess.
  - **Mags** climbs the shed roof to the bathroom window: Savage 3, +1 Climber, −1 Tricky = **3 dice → #30: 1 1 4 = Scrape.** She's in, with a noise.
- **House:**
  - **Pets:** Noodle sleeps on, because nothing was noisy in the kitchen or next door.
  - **Noise:** the bathroom is two rooms from the hall, but Mrs Okafor is staying with the box, and Tayo is three rooms away. Nobody comes.
  - **Routines:** Tayo **#31: 4 → Tayo's room.**
  - **Finding it:** the box is untouched, and nobody is in the garage or the kitchen to find the tags.
- **End of round 1:** Mrs Okafor and the box in the hall; Dot and the sleeping Noodle in the kitchen; Sully in the garage; Mags in the bathroom; Tayo in his room. Broom 0, Cuddle 0. Cred: Sully 2, Dot 1.

### Round 2

- **Prize Clock:** nothing.
- **Temptation:** only **Sully** can be tempted (shiny things in the garage; Knocker). Dot has nothing in the kitchen while Noodle sleeps, and the bathroom has nothing for Mags. The Storyteller offers a bike bell on the edge of the workbench. Knocking it off would be a noise right next to the sleeping dog and two rooms from Mrs Okafor. Sully **resists** (3→2).
- **The cats:**
  - **Mags** walks onto the landing (Move) and **makes a noise on purpose** (Action): she rattles the loft ladder. It's a lure, and it leaves a mess.
  - **Sully** walks into the kitchen (Move) and **hides** behind the bin. **Dot** hides too. Both are simple Actions, with nobody watching.
- **House:**
  - **Pets:** the landing isn't next to the kitchen, so Noodle sleeps on.
  - **Noise:** Mrs Okafor (in the hall) and Tayo (in his room) are each one room from the landing, and both have Attention 1. Chapter 6 says the Storyteller picks; Chapter 12 says roll a die (V-01). I rolled: **#32: 5 → Tayo** goes to the landing.
  - **Routines:** Mrs Okafor **#33: 6 → living room.** The hall is empty, apart from a very large box.
  - **Finding it:** Tayo finds the ladder mess: **Broom 1.**
- **End of round 2:** the box alone in the hall; Mrs Okafor in the living room; Dot, Sully (both hidden) and the sleeping Noodle in the kitchen; Tayo and Mags on the landing. Broom 1/9.

### Round 3

- **Prize Clock:** nothing.
- **Temptation:** Sully was tempted last round, and Dot has nothing in the kitchen. **Mags** is on the landing (Climber), so the Storyteller offers the top of the banister. Giving in would cost her the Action she needs for the catnip, so she **resists** (3→2).
- **The cats:**
  - **Mags** walks into Tayo's room (Move). It's the Den, but she walked in on her own, so she isn't Shut In (the fixed rule). She **goes for the catnip fish on purpose** (Action). Nobody sees, so there's no roll. She rolls about yowling, which is a noise but not a mess. She scores **1 Cred** (not doubled) and **the zoomies**.
  - **Dot and Sully** walk into the hall (Move each) and **pick up the box** (Action each). Nobody sees, so there's no roll. Sully is Chonky, so two of them can carry it.
- **House:**
  - **Pets:** Noodle sleeps on.
  - **Noise:** the yowl draws Tayo from the landing (one room). Mrs Okafor is three rooms away.
  - **Routines:** Mrs Okafor **#34: 1 → stays** in the living room.
  - **Finding it:** the held box is disturbed, but nobody is in the hall, which is both the room it's in and its Clock room.
- **End of round 3:** Dot and Sully holding the box in the hall; Tayo and Mags (on the zoomies) in Tayo's room. Cattitude: Dot 3, Sully 2, Mags 2. Cred: Sully 2, Dot 1, Mags 1.

### Round 4

- **Temptation:** Mags was tempted last round. **Sully**, holding the box in the hall, is offered the car keys on the hall table (shiny things). Giving in would drop the box and clatter the keys beside the kitchen door. He **resists** (2→1).
- **The cats:**
  - **They haul the box from the hall into the kitchen.** Dot leads Sneaky 3, with Sully as his helper: **4 dice → #35: 6 4 2 1 = Clean.** Nobody is in either room, and it's quiet: Noodle snores on as the biggest box of the year slides past his basket.
  - **Mags tags Tayo's room in front of Tayo.** On the zoomies a tag is always a roll. She goes Savage 3, +1 zoomies = **4 dice → #36: 2 5 5 2 = Scrape.** It works. Tayo saw a Savage roll: **Broom 2** (a kid only doubles Cuddle). It's a noise, and because it was made in view it isn't a mess. (1 + 1 for in view) × 2 = **4 Cred** (Mags 5).
- **House:**
  - **Pets:** Noodle sleeps on.
  - **Noise:** Tayo is already in his room, and Mrs Okafor is three rooms away. Nobody comes.
  - **Routines:** Mrs Okafor **#37: 3 → stays.** Tayo **#38: 2 → stays.**
  - **Finding it:** nobody is in the kitchen or the hall.
- **End of round 4:** the box (held) in the kitchen with the sleeping Noodle. Broom 2/9. The gang's Cred is already 8.

### Round 5

- **Prize Clock:** the box should go to the living room, but the cats are holding it. So Mrs Okafor goes to where the Clock last put it, the hall, and finds it gone at once: **Broom 3**, and she starts **Searching**. She stays there this round, deaf to noise.
- **Temptation:** nobody can be tempted.
  - Sully was tempted last round.
  - Dot has nothing in the kitchen while Noodle sleeps.
  - Mags is in Tayo's room, where the stash, now taken, tempts nobody (the fixed rule).
- **The cats:**
  - **They haul the box from the kitchen into the garage.** Dot leads: **4 dice → #39: 1 5 2 3 = Scrape.** It works, but there's noise in the garage. No Push: a Push could Flop the haul, and the noise only risks the dog.
  - **Mags** walks onto the landing and **tags it**. On the zoomies that's a roll even unseen: Savage **4 dice → #40: 2 5 4 5 = Scrape.** 1 × 2 = **2 Cred** (Mags 7). It's a noise, and as nobody saw it, it's a mess.
- **House:**
  - **Pets:** the garage is next to the kitchen, so **Noodle wakes** and acts at once. There's no cat in the kitchen, so he rolls his routine: **#41: 4 → Garage**, straight into Dot and Sully. Under the fixed rule a dog that walks into a cat's room on its routine **barks from next turn**, so there's no bark now.
  - **Noise:**
    - **The garage:** Mrs Okafor is two rooms away, but the Clock holds her. Nobody comes.
    - **The landing:** Tayo comes out of his room.
  - **Finding it:**
    - **Spotted:** the Searching Mrs Okafor can see no cat.
    - **The prize:** nobody is in the garage, and the only human in the hall is already Searching.
    - **Messes:** Tayo finds the landing tag: **Broom 4.** The mess is cleared; the tag and its Cred stay.
- **End of round 5:** Dot, Sully, the box and an awake Noodle in the garage; Mrs Okafor (Searching) in the hall; Tayo and Mags on the landing. Broom 4/9.

### Round 6

- **Temptation:** Dot and Sully start their turns in an awake dog's room.
  - **Sully** has to deal with Noodle, so he can't be tempted.
  - **Dot** can be, as a Scrapper, by that dog (the fixed rule). The Storyteller offers it: squaring up to Noodle would drop the box on the garage floor (Sully lets go too), make a noise, and see Dot chased back into the kitchen. Dot **resists** (3→2). I log what would have happened next as V-06.
- **The cats:**
  - **They haul the box out through the side door.** Hauling out of an awake dog's room counts as leaving it, so Noodle takes no dice. Dot leads: **4 dice → #42: 2 6 1 4 = Clean.** The box is out of the house, quietly. Noodle watches it go and wags.
  - **Mags** goes down to the hall (Move) and **tags it in front of the Searching Mrs Okafor**: Savage **4 dice → #43: 5 4 6 3 = Clean.** She Pushes for a Purrfect (Cattitude 2→1): **#44: 4 3 4**, still a Clean. That's **Broom 5**, and a noise even on a Clean (the zoomies). (1 + 1) × 2 = **4 Cred** (Mags 11). Made in view, it isn't a mess.
- **House:**
  - **Pets:** there's no cat in the garage. Noodle **#45: 2 → stays.**
  - **Noise:** the yowl in the hall brings Tayo downstairs; his mum is already there.
  - **Searching:** the box is no longer inside, and Mrs Okafor can see Mags, so she stays.
  - **Finding it:**
    - **Spotted:** Mrs Okafor can see Mags: **Broom 6.**
    - **The prize:** Tayo isn't Searching yet, and he's in the box's Clock room, where the box isn't. He finds it gone: **Broom 7**, and he starts Searching. "MUM! The box is GONE!" I ruled this literally, although the box was already outside (V-02).
- **End of round 6:** the box, Dot and Sully outside; Mrs Okafor, Tayo (both Searching) and Mags in the hall; Noodle in the garage. Broom 7/9, Cuddle 0. Cattitude: Dot 2, Sully 1, Mags 1.

### Round 7

- **Temptation:** none possible. Mags is the only cat inside, and the hall has nothing for a Foodie or a Climber.
- **The cats:** Mags could tag the living room for 2 more Cred. But that's a noise and a mess in front of two Searching humans at Broom 7 of 9, which means a Shoo! (as Branch S shows), and a Shoo! brings the warden a round earlier for two cats carrying three pieces. She already has the Cat's Whiskers sewn up. She walks into the kitchen (Move) and out through the dog door (Action, no roll).
- **House:** these rolls change nothing, but I made them anyway. Noodle **#46: 1** stays. Mrs Okafor (Searching, with no cat in sight) **#47: 2** stays. Tayo **#48: 4 → his room.** Nothing is found.
- **End of the house part:** no free cat is inside and the prize is out, so the house is done at the end of round 7. Nobody is pinched. Nobody was Shooed or Scooped tonight, so **the warden arrives at the end of getaway round 3.**

### The getaway

- **The route** (from the house page), between five spaces (garden, past 1, past 2, past 3, hideout):
  1. **The side gate:** Streetwise or Savage (a Curious or Climber Knack).
  2. **Next door's terrier:** Savage, Sneaky or Sweet; rating 1.
  3. **The garage roofs:** Savage or Sneaky, Tricky. The Satin Paws hang about here.
  4. **The main road:** Streetwise or Savage (a Hunter Knack to bolt).
- **The zoomies wear off** as the getaway starts (the fixed rule). Nothing out here fills a meter.
- **Cattitude:** Dot 2, Sully 1, Mags 1.
- **The loot:** 3 pieces. Sully (Chonky) carries 2 and Dot carries 1, so a Flop only drops two pieces. Sully's two pieces count against the group, so every roll loses 1 die. I took that die off after the cap of 5 (V-03).
- **The groups:** one group of three, with the best pool leading. When two cats tie, the one with less Cred leads, for a shot at the rivals and a Purrfect.

| Round | Obstacle | Leader (helpers: the other two) | Dice | Roll | Result | Cred | Warden after |
|---|---|---|---|---|---|---|---|
| G1 | Side gate | Sully, Streetwise 3 +2 = 5, −1 loot | 4 | #49: 2 4 4 2 | Scrape: all to past 1 | — | not here yet |
| G2 | Terrier (rating 1) | Dot, Sneaky 3 +2 = 5, −1 terrier, −1 loot | 3 | #50: 2 3 3 → Push #51: 6 4 1 | **Flop, Pushed (2→1) into a Clean**: all to past 2 | — | not here yet |
| G3 | Garage roofs (Tricky, the Satin Paws) | Dot, Sneaky 3 +2 = 5, −1 Tricky, −1 loot | 3 | #52: 1 6 2 → Push #53: 2 6 | **Clean, Pushed (1→0) into a Purrfect**: all to past 3 | **Dot +1** (led past the rivals) **+1** (the leap), and +1 Cattitude | **arrives on the garden** (round 3: nobody was Shooed or Scooped) |
| G4 | Main road | Sully, Streetwise 3 +2 = 5, −1 loot | 4 | #54: 6 6 6 4 | **Purrfect**: all home | **Sully +1** (the leap), and +1 Cattitude | — |

**What the players decided:**
- **G2:** a Push was worth it. A Flop would have left the group stuck with two pieces dropped.
- **G3:** the Push was free Cred, because a Push can't spoil a Clean (the 6 stays).
- **G4:** Sully had nothing to Push with, and didn't need to.
- **Result:** 3 of 3 pieces home and nobody pinched: a **Clean Getaway.** The warden never got within two spaces.

**Final Cred:**
- **Mags 11:** the catnip 1, Tayo's room 4, the landing 2, the hall 4.
- **Dot 3:** the kitchen 1, past the Satin Paws 1, the garage-roof Purrfect 1.
- **Sully 3:** the garage over the Satin Paws 2, the main-road Purrfect 1.
- **The Cat's Whiskers: Gutter Mags.** The gang's 17 Cred is past the 8 for Rep.

### Branch S: Mags shows off once more (real dice; not the result)

The same position at the start of round 7. This time Mags takes the Cred-hungry choice.
- **The cats:** Mags walks into the empty living room and tags it (on the zoomies, a roll): Savage **4 dice → #55: 5 3 1 1 = Scrape.** That's 1 × 2 = **2 Cred** (Mags 13), a noise, and a mess.
- **House:**
  - **Pets:** Noodle **#56: 5 → living room**, straight into Mags's room. Once again, no bark on the turn he arrives (the fixed rule).
  - **Noise:** a tie between the two humans in the hall: **#57: 5 → Tayo** comes. Mrs Okafor is Searching and can see no cat, so she steps into the next room where a cat isn't hiding: the living room, too.
  - **Finding it:**
    - **Spotted:** **Broom 8.**
    - **Messes:** the living-room tag is found: **Broom 9/9: Shoo!** Both humans have Attention 1, so I broke the tie with a die: **#58: 2 → Mrs Okafor** takes the broom.
  - **The Shoo!:** the nearest entrance Mags fits through is the dog door, two rooms away; the side door and the bathroom window are three. Mrs Okafor sweeps her through the hall and the kitchen and out. The dog door is **locked** behind her (Chapter 5's cat-flap rule, V-05). The bathroom window and the side door are still open, so it isn't the last entrance. Mrs Okafor stays in the kitchen for the rest of the round, and finds Dot's round-1 tag there: Broom 1.
  - **After the Shoo:** Patience 8, and Cuddle stays at 0.
- **The house is done.** A cat was Shooed tonight, so **the warden arrives at the end of getaway round 2.**
- **The getaway:** the same single group, and the same loot (Sully 2, Dot 1).
  - **G1, the side gate:** Sully **#59: 1 2 1 6 = Clean.** He Pushes for a Purrfect (1→0): **#60: 3 3 2**, still a Clean.
  - **G2, the terrier:** Dot **#61: 2 1 5 = Scrape.** The van pulls up and the warden jumps out on the empty garden.
  - **G3, the garage roofs:** Dot **#62: 4 5 1 = Scrape**: over, but no rival point. He doesn't Push for the Clean. A Flop here (1 in 8) would drop two pieces straight into the Satin Paws' paws, and leave a Busted night. The warden moves to past 1.
  - **G4, the main road:** Mags leads **#63: 2 6 1 2 = Clean**, and Pushes her last Cattitude: **#64: 2 5 4**, still a Clean. They're home.
- **Branch S result:** a Clean Getaway (3 of 3). Cred: Mags 13, Sully 2, Dot 1. The early warden still never came within two spaces.

### Drill W: every cat for itself (real dice; set position; not the result)

**The position:** Branch S's end of the house part, so the warden arrives at the end of round 2.
- **Loot:** one piece each. Sully's single piece costs him nothing, because he's Chonky.
- **Cattitude:** Dot 2, Sully 1, Mags 1.
- **The plan:** each cat rolls alone, as many tables will try first. I stopped once the warden rules had been hit.

- **G1, the side gate:**
  - **Sully** (Streetwise 3, no die lost) **#65: 4 6 1 = Clean**: over, to past 1.
  - **Mags** (Savage 3 +1 Climber −1 loot = 3) **#67: 2 4 4 = Scrape**: over.
  - **Dot** (Streetwise 2 −1 loot = 1) **#66: 2 = Flop.** He Pushes (2→1): **#68: 2**, still a Flop. He's stuck on the garden and **drops his piece there**.
- **G2:**
  - **Dot** spends his turn **picking up his piece.**
  - **Sully and Mags wait** on past 1 (no roll) so the three can regroup.
  - **The warden** jumps out of the van on the garden, so **Dot is cornered.** A Sweet dodge is out, because his mouth is full: he would have to drop the piece on the warden's space, where it would be gone. He goes Sneaky 3 −1 loot = **2 dice → #69: 4 3 = Scrape: it works.** The net swishes past, and the warden goes sprawling over a bin. Dot stays on the garden, still carrying his piece and still facing the gate. The warden will skip his next move.
- **G3:**
  - **Dot** (1 die) **#70: 4 = Scrape**: over the gate to past 1, piece and all.
  - **Mags leads Sully at the terrier** (Savage 3 +1 −1 terrier −1 loot = **2 dice**) → **#71: 2 3 = Flop.** She Pushes her last Cattitude: **#72: 1 1**, still a Flop. They're stuck, and **both drop a piece** on past 1. I ruled the terrier doesn't chase them back to the garden (V-07).
  - **The warden** is sprawled, so he stays on the garden, although a cat Flopped (V-08).
- **G4:**
  - **Mags and Sully each pick up their piece. Dot waits** with them.
  - **The warden** moves 1, to past 1, the space of the rearmost cats. He would stop there anyway: he never passes a cat. **All three are cornered**, and each dodges alone (V-09):
    - **Dot:** Sneaky 3 −1 loot = 2 → **#73: 5 5 = Scrape.**
    - **Sully:** Savage 2 → **#74: 4 4 = Scrape.** His best dodge would have been Sweet with his Lap Cat Knack, but not with his mouth full.
    - **Mags:** Savage 3 −1 loot = 2 → **#75: 4 2 = Scrape.**
  - All three dodges work. The warden sprawls again and will skip his next move.
- **Stopped here:** all three cats are on past 1 with all 3 pieces, and the warden is sprawled on the same space. Cattitude: Dot 1, Sully 1, Mags 0.

**What the drill shows:**
- **The dodge fix plays right.** A cornered cat keeps its place (Dot still had to climb the gate), and a sprawled warden buys the gang a whole round.
- **Drops and pick-ups cost a turn each,** so splitting up is slow and dangerous. That's the chase Chapter 9 describes.
- **The "no Sweet with loot" rule bit twice.** It took away Sully's best dodge, and Dot's.

**Not reached in any line:**
- **The getaway:** a dodge Flop (a pinch), loot lost on the warden's space, the Satin Paws nicking a piece, a two-space warden move.
- **Humans:** a Scoop, a cat Held or shut in the Den, a Distract.
- **Noodle:** befriended, driven off, or barking.
- **Temptations:** none was given in to, so the catnip was never a temptation and the zoomies' "can't resist" never came up.
- **Elsewhere:** the front door, reopening a shut or locked entrance, Lights Out, a pinch in the house.
- **The human carrying the prize:** it can't happen at this house, because the Clock puts the box down at the start of round 1.

## Issues

### V-01 (minor) Two different tie rules between humans
- **Where:** Chapter 6, *Noise*; Chapter 5, *Shoo!* and *Scooped!*; Chapter 12, *Calling the roll*.
- **Passage:**
  - Chapter 6: "If two humans are as close, the one with the higher Attention goes; if that’s tied too, the Storyteller picks."
  - Chapter 5: "the human who saw it (the one with the highest Attention; if they’re tied, the Storyteller picks)".
  - Chapter 12: "When the rules make you pick between humans — two as close to a noise, two who saw the same roll — the one with the higher Attention goes first. Still tied? Roll a die. Save your own choices for which cat a meter falls on and whom to tempt."
- **What happened:** it came up three times: the landing noise in round 2, the living-room noise in Branch S, and who held the broom in Branch S. Mrs Okafor and Tayo both have Attention 1, so every tie at this house goes to the second step.
- **What I ruled:** a die, as Chapter 12 says.
- **Suggested fix:**
  - Chapter 6: "…if that’s tied too, roll a die."
  - Chapter 5 (both places): "(the one with the highest Attention; if they’re tied, roll a die)".

### V-02 (minor) A prize that's already outside is still "found" in its Clock room
- **Where:** Chapter 6, *Finding it*, against *Searching*.
- **Passage:** "The prize is disturbed if a step has been done, a portion eaten, or it isn’t where the Clock last put it. Every awake human who isn’t Searching yet or holding a cat, and is in the room the prize is in, or in the room where the Clock put it, finds it: Broom +1 (once, however many) and they start Searching." Compare *Searching*: "while the prize is still inside".
- **What happened:** in round 6 the box went out of the side door. Then Mags's yowl drew Tayo into the hall, its Clock room. Read literally, he found it gone: Broom +1, and Searching. That step took Broom to 7. In Branch S it made the difference between Broom 8 and a Shoo! (which also brought the warden a round earlier).
- **What I ruled:** as written. Fictionally it works ("The box is GONE!"), but a Storyteller reading the *Searching* clause could easily think finding stops once the prize is out.
- **Suggested fix (author's call):**
  - **Recommended:** keep the rule, and say so: "…or in the room where the Clock put it, finds it — even if the gang has already got it out of the house: the spot is empty."
  - **Or:** "While the prize is still inside, every awake human who…".

### V-03 (minor) Is the loot die taken off before or after the cap of 5?
- **Where:** Chapter 9, *Running with the loot*; Chapter 4, *Counting dice*; the Quick Reference.
- **Passage:**
  - Chapter 9: "A group loses 1 die if any cat in it carries loot (a Chonky cat with a single piece doesn’t count)".
  - Chapter 4: "You can never have more than 5 dice. Now take dice away: Tricky −1, Hard −2; a pet you’re dealing with takes its rating…; and on a Sneaky or Sweet roll, a watching human takes their Attention".
- **What happened:** the loot die isn't in Chapter 4's list. If Mags had led the gate (Savage 3 +1 Climber +2 helpers = 6), she'd roll 5 dice with the die taken off before the cap, or 4 after it. At the roofs it's 4 or 3.
- **What I ruled:** after the cap, like Tricky.
- **Suggested fix:** Chapter 9: "A group loses 1 die (take it off after the cap of 5, like Tricky) if any cat in it carries loot…". Quick Reference: "a carrier = −1 die to its group, after the cap".

### V-04 (minor) Three rooms are on nobody's routine, so the best tag in the house is free
- **Where:** Chapter 13, *Routines that make a house play*; Chapter 16, *Who lives here*.
- **Passage:**
  - Chapter 13: "Give most rooms a result on some routine. A room nobody ever visits becomes a safe place to wait, and waiting is boring — one quiet room (a loo, a spare bedroom) is fine; three is too many."
  - Mrs Okafor: "1–3 stays put; 4 Kitchen; 5–6 Living room". Tayo: "1–2 stays put; 3–4 Tayo's room; 5 Living room; 6 Kitchen".
- **What happened:** the garage, the landing and the bathroom are on no human's routine (Noodle's "4 Garage" finds no messes). By the house's own guideline that's too many quiet rooms. In round 1 Sully tagged over the Satin Paws in the garage, the best tag in the house: no roll, no noise, and a mess that nobody ever found. A human only reaches the garage when noise draws them, and by then the box is usually gone.
- **What I ruled:** as written.
- **Suggested fix (author's call, and the simulator's):** put the garage on Mrs Okafor's routine, for example "1–3 stays put; 4 Kitchen; 5 Living room; 6 Garage (the recycling bin)". It fits the fiction that she'll flatten the box for the recycling. Or say in *How it plays*: "Nobody goes in the garage unless they hear something: the Satin Paws' tag is there for the taking."

### V-05 (minor) Does a dog door lock like a cat flap after a Shoo!?
- **Where:** Chapter 5, *Shoo!*; Chapter 16, *How it plays* and the map's entrances.
- **Passage:**
  - Chapter 5: "Then they shut it behind the cat (a cat flap gets locked: Streetwise, Hard, from inside to unlock it), unless it’s the house’s last entrance still open".
  - The map: "2. Dog door — Normal; no roll".
  - The house: "If someone Shoos a cat out through the garage, the side door shuts — and that’s the box’s only way out."
- **What happened:** in Branch S, Mags was swept out of the dog door.
- **What I ruled:** it's a flap, so it's locked (Streetwise, Hard, from inside).
- **Suggested fix:**
  - Chapter 5: "(a cat flap or dog door gets locked: Streetwise, Hard, from inside to unlock it)".
  - Chapter 16, *How it plays*: "…A Shoo! through the dog door locks it, too."

### V-06 (minor) A Scrapper who gives in to the dog: can it still leave on its Move?
- **Where:** Chapter 7, *Temptation*; Chapter 11, *Charge*.
- **Passage:**
  - Chapter 7: "A cat that has to deal with a pet in its room this turn (Chapter 11) can’t be tempted, except a Scrapper by that pet: giving in, it squares up (a noise), which isn’t dealing with it, so it is chased back the way it came at the end of its turn."
  - Chapter 7: "Your Action this round is the instinct thing, done right away, in that room, before you move."
- **What happened:** in round 6 Dot was offered Noodle while he was carrying the box in the garage, and he resisted. If he had given in, he would drop the box (and Sully would let go too) and square up. After that he still has his Move: out through the side door, say. Is he then still "chased back the way it came", into the kitchen? "At the end of its turn" reads as unconditional, but *Charge* only chases a cat that "ends its turn there". Sully, left alone with a Large box he can't move, is covered by "the other carriers let go too".
- **What I ruled (it didn't happen):** he may use his Move to leave, and a cat that isn't in the dog's room at the end of its turn isn't chased.
- **Suggested fix:** Chapter 7: "…which isn’t dealing with it, so unless it leaves on its Move, it is chased back the way it came at the end of its turn."

### V-07 (minor) A Flop against a pet on the route: stuck, or chased back?
- **Where:** Chapter 9, *Running with the loot*; Chapter 11, *Beat it*.
- **Passage:**
  - Chapter 9: "A pet on the route takes its rating off the roll as usual (Chapter 11): every cat or group rolls to get past it, and beating it only gets that group past."
  - Chapter 11: "A Flop: the dog chases the cat who rolled back the way it came (that’s not its Move; a carrier drops the prize)."
- **What happened:** in Drill W, Mags and Sully Flopped at next door's terrier. "As usual (Chapter 11)" could pull in the chase back to the previous space.
- **What I ruled:** the getaway's own Flop rule. The group is stuck on its space and every carrier drops a piece. There's no chase back.
- **Suggested fix:** Chapter 9: "…and beating it only gets that group past. A Flop there is like any getaway Flop: the group is stuck, and its carriers drop a piece (the pet doesn’t chase it back)."

### V-08 (minor) A sprawled warden after a Flop, and after several dodges
- **Where:** Chapter 9, *A getaway round*, steps 2–3; the Quick Reference.
- **Passage:**
  - Step 2: "At the end of every round after that he moves 1 space — 2 if any cat’s roll ended in a Flop this round (not one saved by a Push)".
  - Step 3: "It works: the net swishes past and the warden goes sprawling over a bin; the cat stays where it is…, and he doesn’t move next round."
- **What happened:**
  - **Round 3 of Drill W:** the warden was sprawled, and Mags Flopped. Does the Flop's "2" beat "doesn't move"?
  - **Round 4:** three cats dodged him at once. Is that one skipped move, or three?
- **What I ruled:** the sprawl wins (no move), and any number of dodges in one round give one skipped move.
- **Suggested fix:**
  - Chapter 9: "…and he doesn’t move at the end of the next round, Flop or not (one skipped move, however many cats dodged him)."
  - Quick Reference: "(it works: you stay put and he skips his next move, Flop or not)".

### V-09 (minor) Dodging: helpers, and the loot die
- **Where:** Chapter 9, *A getaway round*, step 3, and *Running with the loot*.
- **Passage:**
  - "A cat on the warden’s space at the end of the round must dodge: Sneaky (slip between his boots), Savage (bolt) or Sweet (“I’m somebody’s cat!”), plain."
  - "A group loses 1 die if any cat in it carries loot".
- **What happened:** in round 4 of Drill W, all three cats were cornered together. Can one lead and two help, as they can on an obstacle? And does a carrier lose its loot die on a dodge, which isn't an obstacle?
- **What I ruled:** each cornered cat dodges on its own, and a carrier loses 1 die (Sully's single Chonky piece didn't count).
- **Suggested fix:** Chapter 9, step 3: "Each cornered cat dodges on its own (no helpers); a cat carrying loot loses 1 die, as on an obstacle." If the author would rather let a cornered group dodge together, say that instead: one roll, and a Flop pinches them all.

### V-10 (minor) The zoomie cat still runs away with the Cred
- **Where:** Chapter 9, the Cred table, *The catnip stash* and *Tagging*.
- **Passage:** "Anything you score with **the zoomies** ×2" and "a **tag is always a roll** (Sneaky or Savage, plain), seen or not; … everything it scores counts double."
- **What happened:**
  - **The numbers:** main line Mags 11, Dot 3, Sully 3. Branch S: Mags 13, Sully 2, Dot 1. Ten of Mags's 11 came from three zoomie tags (4, 2 and 4).
  - **The fix did its job:** every zoomie tag was a roll and a noise. Her spree drew Tayo three times and cost 5 of the night's 7 Broom steps, and in Branch S it ended in a Shoo!.
  - **But the structure still decides it.** A three-cat gang needs two cats on a Large box from round 3 to round 6. The one free cat is the natural choice for the nip (a carrier who "can't resist" drops the box) and for every tag. The Whiskers was settled by round 4.
  - **Sully's player made no roll in the house at all.**
- **What I ruled:** as written.
- **Suggested fix (author's call):**
  - **(a)** Keep it: the cost is real now, and the carriers had their moment on the getaway.
  - **(b)** "Anything you score with the zoomies **+1**" instead of ×2. That makes Mags 9 here: it narrows the gap but doesn't close it.
  - **(c)** Give the work itself some Cred, e.g. "Lead the haul that gets the prize out of the house · 1". This is new content, so it's for the author to decide and the simulator to test.
  - **Recommended:** (a), and have the simulator report how often the catnip cat ends up the Cat's Whiskers.

### V-11 (minor) The Okafors' Prize Clock table shows only the four-cat rounds
- **Where:** Chapter 16, *The Prize Clock* and *At a glance*.
- **Passage:**
  - The table: "Start of round 13 · Gone — unless the gang has got it out or a cat is holding it." and "End of round 15 · Lights Out: any cat still inside is pinched."
  - *At a glance*: "Three cats Patience 9, gone at the start of round 15, Lights Out at the end of round 17".
- **What happened:** a Storyteller running three cats who checks the Clock table mid-game reads 13 and 15. Chapter 12 explains that only the Gone row moves, but the table is the thing on the table.
- **What I ruled:** the three-cat numbers (15 and 17).
- **Suggested fix:** in the table, "Start of round 13 (three cats: 15)" and "End of round 15 (three cats: 17)". The page is generated, so the change belongs in its source. The same applies to every house page.

### V-12 (minor) Rep at 8 was reached in round 4
- **Where:** Chapter 9, *The Cat’s Whiskers*; Chapter 14, *What carries over*.
- **Passage:** "In a campaign, a night when the **gang’s Cred adds up to 8 or more**, and that wasn’t Busted, is worth 1 Rep".
- **What happened:** the wording is now clear (the fix for "whose Cred?" worked). But the gang had 8 by the end of round 4, before the box had left the kitchen, and ended the night at 16–17 in every line. Seven rooms plus the rivals' bonus make 8 from tags alone, for any size of gang. With the zoomies doubling, a three-cat gang clears 8 with no getaway Cred at all.
- **What I ruled:** as written: 1 Rep.
- **Suggested fix:** a number for the simulator, so it's the author's call. For example, report how often an average night reaches 8, by gang size, and consider scaling the threshold by gang size if it's nearly automatic.

### V-13 (minor) Chapter 5's example gives the Okafors Patience 7
- **Where:** Chapter 5, *Example*, against Chapter 16, *At a glance*.
- **Passage:** "The Okafors’ house has Patience 7." The house: "Patience 8 · … Three cats Patience 9 … Five cats Patience 7".
- **What happened:** the example has four named cats (Velvet, Pip, Biscuit and Mags), so the house's number is 8.
- **What I ruled:** the house's own numbers (9 for three cats).
- **Suggested fix:** "The Okafors’ house has Patience 8."

### V-14 (minor) "Loot dropped there": which space are the rivals on?
- **Where:** Chapter 9, *The rivals*; Chapter 16, the getaway box.
- **Passage:**
  - Chapter 9: "On the getaway they hang about on one obstacle. Any loot dropped there is **nicked at once** (gone)".
  - The house: "The garage roofs … The Satin Paws hang about here, and nick any loot that’s dropped".
- **What happened:** with the new five spaces, an obstacle lies between two spaces, while loot is dropped on a space. It shaped play in Branch S: Dot didn't Push his Scrape at the roofs for the rival point, because a Flop would have dropped two pieces "there".
- **What I ruled:** a piece dropped on the space in front of the rivals' obstacle is nicked: one dropped by a Flop there, or on purpose before trying it.
- **Suggested fix:** "Any loot dropped on the space in front of their obstacle — by a Flop there, or on purpose before the roll — is nicked at once (gone)."

### V-15 (minor) The Quick Reference's getaway block leaves out four rules
- **Where:** `52-sheet-reference.html`, *The getaway*, against Chapter 9.
- **Passage:** "The warden arrives after round 2 (round 3 if nobody was Shooed or Scooped), then moves 1 a round, 2 after a Flop, never past a cat. On his space: dodge (plain; it works: you stay put and he skips a move) or be pinched." Compare Chapter 9:
  - "(not one saved by a Push)";
  - "Loot on his space is gone too";
  - "A cat carrying loot has its mouth full: it can’t be Sweet… unless it drops its loot first, on purpose, as part of that roll";
  - "A Push still works, paid with Cattitude only".
- **What happened:** the sheet's *Push* block also says "Pay 1 Cattitude, or 1 step on that roll’s meter", which is wrong out on the route. Everything else on the three sheets matches the chapters (see *Fix checks*).
- **Suggested fix:** in *The getaway*: "…2 after a Flop (not one saved by a Push), never past a cat. On his space: dodge (plain; it works: you stay put and he skips a move) or be pinched, loot and all; loot on his space is gone. Out here: no meters, Push with Cattitude only, and a cat with loot in its mouth can’t be Sweet."

*(15 issues: 0 blockers, 0 major, 15 minor.)*

## Fix checks

| Rule (fixed this round) | Earlier issue | Where it came up | Worked? |
|---|---|---|---|
| **Getaway: five spaces** (garden, past 1–3, hideout) | N12 W-02, Salmon W-04 | Every getaway line; the tracker's row is "Garden · Past 1 · Past 2 · Past 3 · Hideout" | **Yes.** Counters, the warden and dropped pieces all had one obvious place. |
| **The warden's arrival** (end of round 2; round 3 if nobody was Shooed or Scooped) | N12 W-25, W-26 | Main line: round 3. Branch S and Drill W: round 2, after Mags's Shoo! | **Yes**, both ways. |
| **He never passes a cat** | Salmon W-02 | Drill W round 4: he stopped on past 1, where the rearmost cats were | **Yes** (a two-space move never came up). |
| **A dodge that works:** the cat stays put, the warden sprawls and skips a move | N12 W-03, Salmon W-02 | Drill W: four dodges (Dot twice, Sully, Mags) | **Yes.** Dot still had to climb the gate he was cornered in front of. Two edge cases: V-08, V-09. |
| **The loot die for a group** | N12 W-04, Salmon W-03 | Every main-line roll lost 1 die. Sully's single Chonky piece was free in Drill W. | **Yes.** Carrying now costs something whoever leads. The order against the cap: V-03. |
| **No Sweet with loot** | Salmon W-05 | Drill W: Dot's and Sully's dodges | **Yes.** It took away Sully's best dodge: a real choice. |
| **Outcomes against the whole prize** | N12 W-05, Salmon W-01 | 3 of 3 pieces home: Clean | **Yes.** |
| **Waiting** | Salmon W-25 | Drill W rounds 2 and 4 | **Yes.** |
| **Pets on the route** | Salmon W-23 | The terrier: the group rolled once, and beating it got that group past | **Yes.** A Flop there: V-07. |
| **Unseen tags are quiet messes** | Salmon W-12, W-13 | Round 1: the garage and kitchen tags, no roll and no noise | **Yes.** Neither mess was ever found (V-04). |
| **Tags in view are rolls, not messes** | N12 W-08, Salmon W-13 | Tayo's room (round 4) and the hall (round 6) | **Yes.** Each paid its Mood step and left no mess. |
| **A found tag clears the mess, not the Cred** | N12 W-11 | The landing tag, found by Tayo in round 5 | **Yes.** |
| **The zoomies: every tag a roll** | N12 W-06, Salmon W-06 | The landing tag (round 5) was a roll, a noise and a mess, and the noise brought the human who found it | **Yes**, the cost now bites. The doubling still decides the Whiskers: V-10 (partly worked). |
| **The zoomies wear off when the getaway starts** | Salmon W-16 | Mags on the route, without the extra die | **Yes.** |
| **The catnip's own point isn't doubled; the yowl isn't a mess** | N12 W-12, W-13; Salmon W-14, W-15 | Round 3 | **Yes.** |
| **The catnip is the one temptation a round, and tempts nobody once taken** | N12 W-14, Salmon W-17 | Mags went for it on purpose, so it was never offered as a temptation. From round 5 Tayo's room tempted nobody. | **Partly checked:** "tempts nobody" worked; the temptation itself wasn't reached. |
| **The rivals' point for each group's leader** | N12 W-15, Salmon W-24 | Dot: a Clean, Pushed into a Purrfect, at the roofs = 2 Cred. Branch S: a Scrape scored nothing. | **Yes.** |
| **A getaway Purrfect gives Cattitude, and a Pushed one counts** | N12 W-16 | Dot at the roofs, Sully on the road | **Yes.** |
| **Rep at 8 for the gang** | N12 W-09, Salmon W-08 | Gang 17: clearly 1 Rep | **The wording works.** The threshold: V-12. |
| **The Den:** a cat that walks in isn't shut in | N12 W-01 | Mags in Tayo's room (the Den) for the catnip and a tag, round 3–4 | **Yes.** |
| **The Scrapper temptation** | Salmon W-07 | Round 6: Dot, in an awake Noodle's room, could be tempted by him while Sully couldn't | **Yes** (resisted). After giving in: V-06. |
| **A dog barks from next turn after its routine walk** | Salmon W-18 | Round 5 (into the garage) and Branch S round 7 (into the living room): no bark on arrival | **Yes.** Both times the cats had gone before the next turn. |
| **The flap lock after a Shoo!** | N12 W-20 | Branch S: the dog door was locked, with the window and the side door still open | **Yes**, with a wording gap for dog doors (V-05). |
| **The human carrying the prize** | N12 W-21 | Not reachable here: the Clock puts the box down at the start of round 1. The read-aloud ("She drags it into the hall") agrees with Chapter 8. | **Not tested.** |
| **Shiny things, the stash and the rivals' tag in the rooms table** | N12 W-17, W-18; Salmon W-11 | Sully was tempted by shiny things in the garage and the hall; the players planned straight from the rooms table | **Yes.** |
| **Knacks printed on the route** | N12 W-19, Salmon W-22 | Climber and Curious at the gate; Climber at the roofs; Hunter on the road | **Yes.** |
| **The name and "going round" rules for making cats** | N12 W-22 | Sully's 2 (going round after Streetwise); Mags's two name rerolls | **Yes.** |
| **The sheets match the chapters** | N12 W-26 | Cat sheet (Cattitude 3 in a gang of three, a Zoomies box, Cred tonight); tracker (17 round columns fit the three-cat Lights Out; the getaway row; step 9); Quick Reference (Shooed or Scooped, Clean or Purrfect, the Cred block) | **Yes**, apart from V-15. |

**Earlier issues met again whose fix needs another look:** only N12 W-06 / Salmon W-06, the nip and the zoomies (V-10). Every other earlier issue I met is fixed.

## Feel notes

- **Was it fun? Yes: a tidy little caper with good comic beats.**
  - **The heist:** the lure on the landing sent Tayo upstairs while his mum wandered off. Two cats lifted the biggest box of the year out of an empty hall. Noodle snored through it sliding past his basket, then woke and padded into the garage just as it squeezed out of the side door.
  - **Mags upstairs on the zoomies** was the comic engine: yowling in a kid's bedroom, tagging it under his nose, and tagging the hall in front of Mrs Okafor. Then Tayo yelled "MUM! The box is GONE!"
  - **The getaway** had its moments: a Pushed Flop at the terrier, a Purrfect over the Satin Paws' roofs, and three 6s across the main road.
- **What wasn't fun:**
  - **The carriers were passengers in the house.** Sully's player made no roll at all: a tag, two resisted temptations, a hide, a pick-up and three helps. Dot's player only rolled hauls. In a three-cat Large-box job, two players spend rounds 3–6 holding a box. The getaway gave them their Cred and their best moments, and it needed to.
  - **The Cat's Whiskers was settled by round 4** (V-10).
- **The deadlines never bit.**
  - **The Prize Clock:** the box was out in round 6, with the prize not gone until round 15. The real deadline was round 5, when Mrs Okafor comes back for the box, and the gang beat it by moving early while the hall was empty.
  - **The getaway:** one group of three with 3–4 dice and Pushes is close to safe. The warden never got within two spaces in either real line, and there were no Flops left after Pushes in 8 rolls. The chase only came alive in the drill, when cats split up.
  - **The chase is the point of Chapter 9,** so the simulator might report how often the warden reaches a cat at all.
- **The new dodge is a joy.** "The net swishes past and the warden goes sprawling over a bin" is pure cartoon. Three cats dodging him at once on the terrier's doorstep was the best picture of the night. It's also fair: nobody skips an obstacle.
- **Tone:** nothing broke the light, comic feel. The Satin Paws are a great rival name for a cat gang. A tag is a cheek-rub or a tuft of fur, and the Shoo! is a broom and a skid.
- **How lucky was it?**
  - **The house:** Mrs Okafor's round-2 routine roll (a 6) emptied the hall, and every haul worked: two Cleans and a Scrape from 4 dice.
  - **The getaway:** two Purrfects in four rolls is well above the odds.
- **For an 8-year-old:**
  - "Why did Tayo find the box when it was already outside?" (V-02)
  - "Who comes when they're both as close?" (V-01)
  - "Does the dog door lock too?" (V-05)
  - "Do we get to help each other dodge?" (V-09)

## Dice appendix

Every roll, in order, as logged before use. Rolls #55–#64 are Branch S, and #65–#75 are Drill W: real dice, but not the night's result.

| # | Dice | Faces | Purpose | Used as |
|---|---|---|---|---|
| 1 | 2d6 | 4 5 | Cat 1 name | Lucky Dot |
| 2 | 1d8 | 1 | Cat 1 coat | Black |
| 3 | 1d8 | 1 | Cat 1 mark | A notch in one ear |
| 4 | 1d6 | 3 | Cat 1 eyes | Amber |
| 5 | 1d6 | 1 | Cat 1 the 3 | Sneaky 3 |
| 6 | 1d6 | 6 | Cat 1 the 2 | Third along from Sneaky: Streetwise 2 |
| 7 | 2d8 | 4 8 | Cat 1 instincts | Hunter, Scrapper |
| 8 | 1d6 | 1 | Cat 1 body | Lean |
| 9 | 1d6 | 1 | Cat 1 quirk | Hates the rain |
| 10 | 2d6 | 2 6 | Cat 2 name | Two-Bin Sully |
| 11 | 1d8 | 8 | Cat 2 coat | Cream |
| 12 | 1d8 | 5 | Cat 2 mark | An old collar, too big |
| 13 | 1d6 | 5 | Cat 2 eyes | Blue |
| 14 | 1d6 | 4 | Cat 2 the 3 | Streetwise 3 |
| 15 | 1d6 | 6 | Cat 2 the 2 | Going round: Sneaky, Sweet, Savage → Savage 2 |
| 16 | 2d8 | 2 5 | Cat 2 instincts | Knocker, Lap Cat |
| 17 | 1d6 | 5 | Cat 2 body | Chonky |
| 18 | 1d6 | 2 | Cat 2 quirk | Collects bottle caps |
| 19 | 2d6 | 3 5 | Cat 3 name | Gutter Dot: Dot taken |
| 20 | 1d8 | 8 | Cat 3 coat | Cream |
| 21 | 1d8 | 8 | Cat 3 mark | A tattoo (an anchor, picked) |
| 22 | 1d6 | 5 | Cat 3 eyes | Blue |
| 23 | 1d6 | 3 | Cat 3 the 3 | Savage 3 |
| 24 | 1d6 | 6 | Cat 3 Name column again | Sully: taken |
| 25 | 1d6 | 4 | Cat 3 Name column again | Gutter Mags |
| 26 | 1d6 | 3 | Cat 3 the 2 | Second along from Savage, going round → Sneaky 2 |
| 27 | 2d8 | 6 7 | Cat 3 instincts | Foodie, Climber |
| 28 | 1d6 | 2 | Cat 3 body | Lean |
| 29 | 1d6 | 6 | Cat 3 quirk | Talks to pigeons |
| 30 | 3d6 | 1 1 4 | R1 Mags climbs the bathroom window (Savage 3 +1 Climber −1 Tricky) | Scrape: in, noise |
| 31 | 1d6 | 4 | R1 Tayo's routine | Tayo's room |
| 32 | 1d6 | 5 | R2 noise tie on the landing (1–3 Mrs Okafor, 4–6 Tayo) | Tayo answers |
| 33 | 1d6 | 6 | R2 Mrs Okafor's routine | Living room: the hall is empty |
| 34 | 1d6 | 1 | R3 Mrs Okafor's routine | Stays |
| 35 | 4d6 | 6 4 2 1 | R4 haul hall → kitchen (Dot Sneaky 3 +1 Sully) | Clean |
| 36 | 4d6 | 2 5 5 2 | R4 Mags tags Tayo's room in view (Savage 3 +1 zoomies) | Scrape: Broom 2, 4 Cred |
| 37 | 1d6 | 3 | R4 Mrs Okafor's routine | Stays |
| 38 | 1d6 | 2 | R4 Tayo's routine | Stays |
| 39 | 4d6 | 1 5 2 3 | R5 haul kitchen → garage (Dot Sneaky 3 +1 Sully) | Scrape: noise in the garage |
| 40 | 4d6 | 2 5 4 5 | R5 Mags tags the landing unseen (Savage 3 +1 zoomies) | Scrape: 2 Cred, noise, mess |
| 41 | 1d6 | 4 | R5 Noodle wakes; routine | Garage |
| 42 | 4d6 | 2 6 1 4 | R6 haul out of the side door (Dot Sneaky 3 +1 Sully) | Clean: the box is out |
| 43 | 4d6 | 5 4 6 3 | R6 Mags tags the hall in view (Savage 3 +1 zoomies) | Clean |
| 44 | 3d6 | 4 3 4 | R6 Mags's Push (1 Cattitude) | Still Clean: Broom 5, 4 Cred |
| 45 | 1d6 | 2 | R6 Noodle's routine | Stays |
| 46 | 1d6 | 1 | R7 Noodle's routine | Stays |
| 47 | 1d6 | 2 | R7 Mrs Okafor's routine (Searching, no cat in sight) | Stays |
| 48 | 1d6 | 4 | R7 Tayo's routine (Searching, no cat in sight) | Tayo's room |
| 49 | 4d6 | 2 4 4 2 | G1 side gate (Sully Streetwise 3 +2 −1 loot) | Scrape: over |
| 50 | 3d6 | 2 3 3 | G2 terrier (Dot Sneaky 3 +2 −1 −1) | Flop |
| 51 | 3d6 | 6 4 1 | G2 Dot's Push (1 Cattitude) | Clean: over |
| 52 | 3d6 | 1 6 2 | G3 garage roofs (Dot Sneaky 3 +2 −1 Tricky −1 loot) | Clean |
| 53 | 2d6 | 2 6 | G3 Dot's Push for a Purrfect (1 Cattitude) | Purrfect: +2 Cred, +1 Cattitude |
| 54 | 4d6 | 6 6 6 4 | G4 main road (Sully Streetwise 3 +2 −1 loot) | Purrfect: home, +1 Cred, +1 Cattitude |
| 55 | 4d6 | 5 3 1 1 | Branch S R7: Mags tags the living room (Savage 3 +1 zoomies) | Scrape: 2 Cred, noise, mess |
| 56 | 1d6 | 5 | Branch S R7 Noodle's routine | Living room |
| 57 | 1d6 | 5 | Branch S R7 noise tie (1–3 Mrs Okafor, 4–6 Tayo) | Tayo answers |
| 58 | 1d6 | 2 | Branch S R7 Shoo! tie (1–3 Mrs Okafor, 4–6 Tayo) | Mrs Okafor: out of the dog door |
| 59 | 4d6 | 1 2 1 6 | Branch S G1 side gate (Sully) | Clean |
| 60 | 3d6 | 3 3 2 | Branch S G1 Sully's Push for a Purrfect | Still Clean |
| 61 | 3d6 | 2 1 5 | Branch S G2 terrier (Dot) | Scrape: over |
| 62 | 3d6 | 4 5 1 | Branch S G3 garage roofs (Dot) | Scrape: over, no rival point |
| 63 | 4d6 | 2 6 1 2 | Branch S G4 main road (Mags) | Clean |
| 64 | 3d6 | 2 5 4 | Branch S G4 Mags's Push for a Purrfect | Still Clean: home |
| 65 | 3d6 | 4 6 1 | Drill W G1 gate: Sully alone (Streetwise 3) | Clean: over |
| 66 | 1d6 | 2 | Drill W G1 gate: Dot alone (Streetwise 2 −1 loot) | Flop |
| 67 | 3d6 | 2 4 4 | Drill W G1 gate: Mags alone (Savage 3 +1 −1) | Scrape: over |
| 68 | 1d6 | 2 | Drill W G1 Dot's Push | Still Flop: stuck, drops his piece |
| 69 | 2d6 | 4 3 | Drill W G2 Dot's dodge (Sneaky 3 −1 loot) | Scrape: works, the warden sprawls |
| 70 | 1d6 | 4 | Drill W G3 gate: Dot with his piece (1 die) | Scrape: over |
| 71 | 2d6 | 2 3 | Drill W G3 terrier: Mags leads Sully (Savage 3 +1 −1 −1) | Flop |
| 72 | 2d6 | 1 1 | Drill W G3 Mags's Push (last Cattitude) | Still Flop: both drop a piece |
| 73 | 2d6 | 5 5 | Drill W G4 Dot's dodge (Sneaky 3 −1 loot) | Scrape: works |
| 74 | 2d6 | 4 4 | Drill W G4 Sully's dodge (Savage 2) | Scrape: works |
| 75 | 2d6 | 4 2 | Drill W G4 Mags's dodge (Savage 3 −1 loot) | Scrape: works |

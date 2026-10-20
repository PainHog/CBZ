# First playtest: Chef Marchetti's Salmon (Hard), three cats, real dice

*2026-10-20. One Storyteller and three players, all played by one agent, strictly by the rulebook source (`book/src/chapters/*.html`, v0.6): Chapters 4–10 for the rules, Chapter 2 for the cats, Chapter 11 for running the house, and Chapter 18 for the house. The house's map and ways come from the printed floor plan (`book/art/map-marchetti-salmon.svg`, generated from `sim/houses.mjs`). `docs/CORE-RULES.md` was used only to spot disagreements. I did not read the simulator's engine. Every die came from Node's `crypto.randomInt`, one logged command per roll. The log was written before each result was used, and all 69 rolls are in the Dice appendix.*

## Summary

- **Outcome: Clean Getaway, round 10 of a possible 13.** All 5 portions of the salmon were eaten, and every cat walked out of the dog door. Nobody was adopted.
  - Joe was Scooped once and put outside by Sam.
  - Nobody was Shooed.
  - The prize would have been gone at the start of round 11.
- **End Mood:** Broom 4/5, Cuddle 0/5, Patience 5 (started at 6; one Scoop). Cattitude left: Joe 0, Dot 0, Mags 1.
- **Rolls:**
  - Cats: 9 roll commands in the main line (8 rolls and 1 Push). Results: 2 Clean, 4 Scrape, 2 Flop, and the Push also Flopped.
  - Storyteller: 18 rolls (8 Chef routines, 3 Sam routines, 3 Sam holder rolls, 4 Brutus routines). **5 of the 8 Chef routine rolls could not change anything** (S-01).
  - Making the gang took 35 rolls.
  - The what-if branch took 7 rolls (4 cat, 3 Storyteller).
- **Cat-turns:** 30 in the main line (3 cats × 10 rounds).
  - 8 with a roll.
  - 13 active without a roll: helping, eating, walking out, or giving in.
  - 6 idle inside: 4 waiting on purpose, and 2 of Joe going limp while Held, which kept Sam blind.
  - 3 already outside.
  - **The last 5 Actions that won the game (eating 4 portions and walking out) needed no roll at all.**
- **Issues: 20** (0 blockers, 4 major, 16 minor).
- **What won it.** The gang went in together through the dog door and ganged up on Brutus (2 dice). They opened the stiff door, then sat in plain view in the kitchen and waited. The Chef's routine sent her to the hall, and **her routine has no way back** (S-01). Then Joe's failed distraction got him Scooped by Searching Sam, and **a human holding a cat sees nobody else** (S-02). After that the gang ate the salmon portion by portion, unseen, with **no rolls** (S-03).

**Top 5 issues**
1. **S-01 (major): Chef Marchetti's routine strands her in the hall.** "1–5 stays put; 6 Hall" has no "Kitchen" result. The first 6 takes the Attention-2 chef out of the kitchen for good. That contradicts "she never leaves her kitchen while there's a fish on the island", and it decided this game in round 4.
2. **S-02 (major): Getting Scooped is the best distraction, and a nearly full Cuddle meter turns every Sweet roll into a sure win.** Joe's 1-die distraction Flopped and filled Cuddle. Sam (Searching) then held him for 2 rounds, saw nobody, and the gang ate 4 portions under his nose.
3. **S-03 (major): Eating unseen is free and silent.** Once nobody can see the kitchen, a 5-portion prize costs 5 roll-free Actions. Hauling a Medium prize costs a roll every time, so delicious prizes are much easier than the book's Hard label suggests.
4. **S-04 (major): The book never says whether pets pass closed doors.** Brutus's routine (Kitchen, Hall, Living room) only works if he can go through the closed, stiff utility-room door. Only humans are said to pass doors.
5. **S-09 (minor, but it shaped the game): Temptations run out.** "never the same cat with the same thing twice" let a three-cat gang use up the kitchen's only three temptations by round 5. From then on the Storyteller had nothing to tempt anyone with in the room where the whole robbery happened.

**What-if branch B (the Chef returns to her kitchen on "stays put").** This is not the result of the playtest. Under this reading both humans start Searching in the kitchen in round 5. Joe's Flop gets him Scooped by the Chef, and Searching Sam still watches. The gang reaches 3 of 5 portions (the Messy threshold) only by round 8, thanks to two Sneaky Cleans and a Purrfect. By then Broom is full (Mags is Shooed), Joe is shut in the Den upstairs, and Brutus roams freely. The likely end is **Messy, with Joe at risk of adoption.** That feels like a Hard house; the main line didn't.

## Gang

Gang of three, so Chapter 8's *Gang size* applies:
- **Patience 6** (5 + 1).
- **The prize is gone at the start of round 11** (the sheet says 9, plus 2).
- **Lights Out at the end of round 13.**
- **3 Cattitude each.**
- **Portions:** 1 per cat + 2 = **5**. "At least half" (Messy) means 3.

Method: every step of Chapter 2's random method was rolled, including coat, mark, eyes and quirk.
- **The 3:** a d6 (1 Sneaky, 2 Sweet, 3 Savage, 4 Streetwise, 5–6 roll again). In a gang of three the one-of-each rule doesn't apply.
- **The 2:** a d6, counting along the list from the 3.
- **Instincts:** 2d8.
- **Body:** a d6.
- **Gang name:** a d6.

| Cat | Body | Sneaky | Sweet | Savage | Streetwise | Instincts | Looks, quirk | Dice |
|---|---|---|---|---|---|---|---|---|
| **Midnight Joe** (the Charmer) | Chonky | 2 | **3** | 1 | 1 | Foodie (food), Curious (open, search) | grey tabby, one white sock, green eyes; hates the rain | #1–11 |
| **Lucky Dot** (the Brains) | Chonky | 2 | 1 | 1 | **3** | Foodie (food), Scrapper (face down animals) | brown tabby, one white sock, green eyes; sleeps on the launderette roof | #12–23 (#17 rerolled a 6) |
| **Lucky Mags** (the Shadow) | Lean | **3** | 1 | 1 | 2 | Hunter (pounce, chase, fight), Climber (climb) | cream, white star on the chest, green eyes; never forgets a face with a broom | #24–34 |

Gang name: **the Bin Lid Gang** (#35).

What the dice gave this gang:
- **Every cat has Savage 1.** That's the worst possible gang to face a rating-3 dog that can't be befriended. A drive-off is at most 5 − 3 = **2 dice**, and only with all three cats and a Cattitude token.
- The Charmer has no Lap Cat Knack. Against the Chef's Attention 2, a first distraction is 1 die, or 2 with Cattitude.
- Only Mags is Lean, so only she fits the skylight. Joe and Dot would need the balcony (a Hard climb: 0 dice, or 1 with Cattitude).

Where each cat is tempted in this house:
- **Kitchen:** Joe and Dot (Foodie), Mags (Hunter).
- **Utility room:** Joe and Dot (Foodie).
- **Study:** Mags (Climber), Joe (Curious).
- **Any room with awake Brutus:** Dot (Scrapper).
- **The vacuum's room:** Mags (Hunter).
- Nobody in the gang is tempted by the living room or the bedroom.

## The house as the players see it

- **Ground floor:** Kitchen, Utility room, Living room, Hall. **Upstairs:** Landing, Bedroom, Study (the Den).
- **Ways:**
  - Hall–Kitchen (Big).
  - Hall–Living room (Big).
  - Kitchen–Utility room (Big, **closed stiff door: Streetwise or Savage, Hard**).
  - Hall–Landing (stairs, Normal).
  - Landing–Bedroom and Landing–Study (Big).
  - The kitchen doesn't touch the living room, and the utility room doesn't touch the hall.
- **Entrances:**
  1. **Front door** (hall): round 1 only, one cat, Sweet, or Sneaky Hard.
  2. **Dog door** (utility room): Normal, no roll.
  3. **Balcony door** (bedroom): a climb, Sneaky or Savage Hard, Small things only.
  4. **Skylight** (landing): Tight, a climb, Sneaky or Savage Tricky.
- **The only way out for a Medium salmon is the dog door**, through Brutus's room and the stiff door. The climbs take Small things only, and the front door works only in round 1.
- **Residents:**
  - **Chef Marchetti:** kitchen, Attention 2, Busy; routine 1–5 stays put, 6 Hall.
  - **Sam:** hall, Attention 1; routine 1–2 stays put, 3–4 Living room, 5 Kitchen, 6 Study.
  - **Brutus:** utility room, rating 3, awake, not soft; routine 1 stays put, 2 Kitchen, 3 Hall, 4 Living room, 5–6 sniff.
  - **Robot vacuum:** living room; goes Living room ↔ Hall.
- **Prize Clock:** salmon on the kitchen island at the start of round 1. Step 1 is Sneaky or Savage, Tricky (up on the island). Step 2 is Streetwise or Savage, Tricky (the paper off).

## Play log

Notation: dice are counted as *approach + Knack + helpers + Cattitude, capped at 5, minus difficulty, pet rating and Attention (Sneaky and Sweet only)*. "Seen" means a human who isn't Distracted is in the room. B/C/P = Broom / Cuddle / Patience.

### Round 1: in through the dog door, all together (B0 C0 P6)
- **Prize Clock:** the Chef puts the salmon on the island and stays in the kitchen this round. Sam is in the hall, Brutus in the utility room (awake), the vacuum in the living room.
- **Temptation:** none. All the cats are outside, and outside isn't a room with temptations.
- **Plan.** Split up and the cats are weak. Joe's front door would be 2–3 dice, but Dot alone at the dog door would face Brutus with 0 dice, and Joe and Dot can't use the skylight. Together at the dog door, all three can pool dice against Brutus. "The way in from upstairs is long but quiet", but for this gang it's closed.
- **Cats:** all three walk in through the dog door (their Move; no roll, not noisy). Brutus charges: each cat "must leave or deal with the dog before doing anything else".
  - **Dot drives Brutus off (Savage), with Joe and Mags helping:** Savage 1 + Scrapper 1 + 2 helpers + 1 Cattitude = 5, − 3 rating = **2 dice: 2, 4 → Scrape** (#36). It works, and makes noise. Dot's Cattitude 3→2.
  - I ruled that helping the drive-off counts as dealing with the dog for each helper (S-06).
  - Unseen: no human is in the utility room.
  - **Brutus is driven off:** he hides for rounds 1–3 and is back in the utility room, awake, at the end of round 3.
- **House:**
  - Pets: Brutus is hiding.
  - **Noise** (utility room): the Chef is closer but Busy, so it draws **Sam, 2 rooms away (hall → kitchen → utility room)**. He walks in and stays.
  - Routines: the Chef stays (the Clock round). Sam answered the noise. Nobody rolls.
  - Finding it: nothing.
  - The vacuum goes to the hall.

### Round 2: the stiff door, under Sam's eye (B0 C0 P6)
- **Temptation:** the Storyteller tempts **Dot with Brutus's food bowl** (utility room, Foodie). He's the obvious door-opener, and Sam would see him eat. **Dot resists** (Cattitude 2→1).
- **Cats:** **Dot opens the stiff door (Streetwise, Hard), with Joe and Mags helping:** 3 + 2 = 5, − 2 = **3 dice: 6, 4, 2 → Clean** (#37). Seen by Sam: Streetwise isn't reduced by Attention, but a Clean that isn't Sneaky still adds a step: **Broom 1**.
  - Helping in view: Chapter 4 says the helper "doesn't roll", but Chapter 6 lists "help another cat" among things that need a roll when seen. I followed Chapter 4 (S-05).
  - All three walk into the kitchen. The Chef sees cats walk in, which is free.
- **House:**
  - Chef routine **5 → stays** (#38).
  - Sam routine from the utility room **3 → Living room** (#39).
  - Finding it: nothing.
  - The vacuum goes to the living room. Brutus has 2 tokens left.

### Round 3: the first distraction fails twice (B1 C0 P6)
- **Temptation:** the Storyteller tempts **Joe with the Chef's bread** (kitchen, Foodie). He's the only cat who can distract her, so this is the meanest pick. **Joe resists** (Cattitude 3→2).
- **Cats:**
  - **Joe distracts the Chef** (Sweet; first time): 3 + 1 Cattitude = 4, − 2 Attention = **2 dice: 3, 1 → Flop** (#40). Cattitude 2→1.
  - **Push**, paid with **1 Cuddle step** (C 0→1), to save his last Cattitude: rerolls **3, 2 → Flop** (#41).
  - The Chef saw a Flop: 2 steps on the fuller meter. After the Push payment the meters were **level (B1, C1), so it goes on its own meter: Cuddle +2 → C3**.
  - Without the Push it would have been Broom 3. Paying for the Push changed which meter the Flop filled (S-07).
  - **Dot and Mags wait on purpose.** Joe's noise will bring Sam, and if they open the prize now, *both* humans start Searching at the end of the round. They sit in plain view, which is free.
- **House:**
  - **Noise** (kitchen): the Chef is Busy, so **Sam comes from the living room** (2 rooms) and stays.
  - Chef routine **2 → stays** (#42).
  - Finding it: the prize hasn't been touched.
  - The vacuum goes to the hall. **Brutus returns to the utility room, awake.**

### Round 4: the Chef walks out of her kitchen for good (B1 C3 P6)
- **Temptation:** **Dot with the kitchen food** (Foodie; a different thing from the bowl in round 2). The gang is waiting anyway, so **Dot gives in**: Cattitude 1→2, eats the Chef's prep, seen, **Broom 2**.
- **Cats:** Joe and Mags wait (idle).
- **House:**
  - Brutus (no cat in his room) routine **1 → stays** (#43).
  - **Chef routine 6 → Hall** (#44).
  - Sam routine from the kitchen **2 → stays** (#45).
  - The vacuum goes to the living room.
- **Finding (S-01).** From the hall, the Chef's routine reads "1–5 stays put; 6 Hall". Every result keeps her in the hall. Unless she starts Searching, the Attention-2 human who "never leaves her kitchen" has left it for the rest of the robbery.

### Round 5: distract Sam, open the salmon (B2 C3 P6)
- **Temptation:** the only kitchen temptation left is **Mags (Hunter: a fly over the stove)**. **Mags resists** (Cattitude 3→2).
- **Cats:**
  - **Joe distracts Sam** (Sweet; first time for Sam): 3 + 1 Cattitude = 4, − 1 Attention = **3 dice: 4, 2, 1 → Scrape** (#46). Sam is Distracted. **Cuddle 4.** Joe's Cattitude 1→0.
  - **Mags, step 1** (up on the island; Sneaky, Tricky), unseen: 3 + Climber 1 = 4, − 1 = **3 dice: 4, 2, 1 → Scrape** (#47). Done. The noise draws nobody: Sam is already here and the Chef is Busy.
  - **Dot, step 2** (the paper off; Streetwise, Tricky), unseen: 3 + 1 Cattitude = 4, − 1 = **3 dice: 1, 3, 6 → Clean** (#48). Done. Dot's Cattitude 2→1. **The salmon is open.**
  - All three stay in the kitchen. The Spotted check can't fire this round: Sam isn't Searching yet.
- **House:**
  - Brutus routine **3 → Hall** (straight there; the door is open) (#49).
  - Chef routine from the hall **1 → stays in the hall** (#50).
  - Sam routine from the kitchen **5 → "Kitchen" = stays** (#51).
  - **Finding it:** Sam is beside a disturbed prize, so **Broom 3** and **Sam starts Searching**. The Chef is in the hall: not in the prize's room or the Clock's room, so she doesn't find it.
  - The vacuum goes to the hall (now with the Chef and Brutus).

### Round 6: the Scoop that blinds Sam (B3 C4 P6)
- **Temptation:** **none possible.** Joe/Foodie, Dot/Foodie and Mags/Hunter have all been used in the kitchen, and no dog is in the room (S-09).
- **Cats:**
  - **Joe distracts Searching Sam again** (second time, so −1): 3 − 1 Attention − 1 = **1 die: 2 → Flop** (#52).
  - A Push couldn't help. Paying a Cuddle step makes C5, and then success (+1) or Flop (+2) both fill the meter. So no Push.
  - Flop seen: the fuller meter is **Cuddle, 4 + 2 = 6 = full → Scooped!** Sam picks Joe up. **Cuddle → 0, Patience → 5.**
  - **Sam is holding a cat, so he "sees nobody else and doesn't follow their routine".**
  - **Dot and Mags each eat a portion, unseen, no roll** (5→3 left).
- **House:**
  - Joe's noise draws nobody: the Chef is Busy and Sam is holding a cat.
  - Brutus routine from the hall **3 → stays** (#53).
  - Chef routine **2 → stays in the hall** (#54).
  - Sam holds Joe and skips his routine. Holder d6: **2 → keeps cuddling** (#55).
  - Finding it: Spotted? Sam sees nobody else. I ruled that the cat he's holding doesn't count (S-11).
  - The vacuum goes to the living room.

### Round 7: dinner under a cuddle (B3 C0 P5)
- **Temptation:** none possible (as in round 6).
- **Cats:**
  - Joe goes limp and purrs: staying Held keeps Sam blind.
  - **Dot and Mags each eat another portion, unseen, no roll** (3→1 left; 4 of 5 eaten, which is already Messy if everyone gets out).
- **House:**
  - Brutus routine **6 → sniff**: one room toward the nearest cat, so **into the kitchen** (#56).
  - Chef routine **6 → Hall** (stays) (#57).
  - Sam holder d6 **1 → keeps cuddling** (#58).
  - The vacuum goes to the hall.

### Round 8: Brutus in the kitchen (B3 C0 P5)
- **Temptation:** the kitchen now has an awake dog, which tempts Scrappers, so the Storyteller tempts **Dot to square up to Brutus**. Without Dot's help, Mags's drive-off drops to 0 dice. **Dot resists** (Cattitude 1→0).
  - If Dot had given in, would squaring up count as "dealing with" Brutus? The book doesn't say (S-13). Moot here.
- **Cats.** Dot and Mags start their turn in an awake dog's room, so they must leave or deal with him before eating.
  - Leaving doesn't help. Held Joe keeps Brutus barking and in place, because "an awake dog with a cat in its room barks … and stays put".
  - **Mags drives Brutus off, with Dot helping:** Savage 1 + Hunter (fight) 1 + 1 helper + 1 Cattitude = 4, − 3 = **1 die: 4 → Scrape** (#59). Unseen: Sam is holding and the Chef is in the hall. Mags's Cattitude 2→1.
  - **Brutus hides for rounds 8–10.** Both Actions are spent, so nobody eats this round.
- **House:**
  - The noise draws nobody.
  - Chef routine **4 → stays in the hall** (#60).
  - Sam holder d6 **6 → puts Joe outside: "Go on, home you go."** (#61)
  - The book doesn't say which entrance, whether it's shut, or where Sam ends up (S-10). The front door and the dog door are both one room away. **As the mean Storyteller I chose the dog door, and Sam ends up in the utility room**, Searching, right on the gang's way out. It isn't shut, because only a Shoo! shuts an entrance.
  - The vacuum goes to the living room.

### Round 9: the last portion (B3 C0 P5)
- **Temptation:** none possible. The utility room's Foodie temptation was already used on Dot in round 2, and Joe is outside.
- **Cats:**
  - **Mags** walks into the utility room past Sam and **out through the dog door**. I treated going out through an entrance with no roll as walking, which is free in view (S-20).
  - **Dot eats the last portion, unseen**: Sam is next door, and humans never see into the next room. **All 5 portions are eaten: the prize is got.** Dot then walks into the utility room.
- **House:**
  - Brutus is hiding.
  - Chef routine **3 → stays** (#62).
  - **Sam, Searching:** there's no prize left (I skipped rule 1, S-12). He can see Dot, so he stays.
  - Finding it: **Spotted, so Broom 4/5.**

### Round 10: out (B4 C0 P5)
- **Temptation:** none possible.
- **Cats:** **Dot walks out through the dog door.** No free cat is left inside, so the robbery ends.
- **Clean Getaway:** every portion eaten and nobody left behind. Joe, Mags and Dot are all outside.

### What-if branch B: the Chef goes back to her kitchen (rolled for real, not the result)
Reading: "stays put" for the Chef means "stays in her kitchen", as the house text suggests. The branch splits at round 5's house turn, where the Chef rolled 1: under this reading she walks back to the kitchen.
- **R5:** both Sam and the Chef are beside the open salmon, so **Broom 3 (once)**, and **both start Searching**. B3 C4 P6.
- **R6:**
  - No temptation possible.
  - **Joe distracts the Chef** (second time): 3 − 2 − 1 = 0, so roll 2 and keep the lower: **1, 2 → 1, Flop** (#63). Cuddle 4 + 2 = full, so the **Chef Scoops Joe** (Patience 5, C0) and is blind.
  - Searching Sam still watches. **Dot eats in view** (Sneaky 2 + Foodie 1 + 1 Cattitude, − 1 Attention = 3 dice: **3, 6, 1 → Clean**, no step) (#64).
  - **Mags eats in view** (Sneaky 3 + 1 Cattitude, − 1 = 3 dice: **6, 2, 3 → Clean**) (#65). 2 of 5 eaten.
  - Both step into the empty utility room, so Sam can't spot them.
  - Brutus sniffs **6 → kitchen** (#66). The Chef's holder d6 **4 → carries Joe to the Den** (the study, upstairs) (#67).
- **R7:**
  - Joe, shut in with no Cattitude, *must* give in to the study's Curious temptation (+1 Cattitude).
  - Searching Chef steps in next to the shut-in cat she can see, so **Broom 4/5** (S-18).
  - Brutus **4 → living room** (#68).
  - Dot and Mags wait in the utility room.
- **R8:**
  - **Mags walks in and eats in view of Searching Sam:** 3 dice, **6, 1, 6 → Purrfect** (#69). No step, +1 Cattitude. **3 of 5 eaten: the Messy threshold.**
  - She ends the round in the kitchen, so Spotted makes **Broom 5/5: Shoo!** (Patience 4).
- **Where it stood:**
  - Joe is shut in the Den: Dot needs 3 Moves to reach the landing, then a Streetwise roll to open the door.
  - Dot is alone downstairs.
  - Two portions are left and will be gone at the start of round 11.
  - The best likely result is **Messy**, and Joe may well be adopted.
  - Even this branch needed three Clean-or-better 3-dice rolls in a row (about 1 chance in 13) just to reach half the fish.

## Issues

| ID | Severity | Passage (file) | What I did | Suggested fix |
|---|---|---|---|---|
| S-01 | **major** | "<strong>1–5</strong> stays put; <strong>6</strong> Hall" for Chef Marchetti, against "she never leaves her kitchen while there’s a fish on the island" (`45-ch18-marchetti-salmon.html`; data in `sim/houses.mjs`) | Read it literally. Her round-4 roll of 6 took her to the hall, and every later roll kept her there. The Attention-2, Busy watcher left the game, and 5 of her 8 routine rolls were dead. Branch B plays the other reading. | Make her routine "1–5 Kitchen; 6 Hall", so a 6 is a one-round errand and not a permanent exit. |
| S-02 | **major** | "While the human is holding a cat, they see nobody else and don’t follow their routine — so a held cat is, in a way, the best distraction there is." (`26-ch09-caught.html`) | A Searching Sam held Joe for 2 rounds (holder rolls 2 and 1). He saw nobody, and the gang ate 4 portions next to him with no rolls. With Cuddle within 2 of full, Joe's 1-die distraction couldn't fail: a success distracts and a Flop Scoops. | Let a holder still see their own room; holding only stops them moving, following a routine or answering noise. Or the holder rolls straight away when they pick the cat up. |
| S-03 | **major** | "Eating one is an Action. You can also carry food out instead." (`25-ch08-prize.html`); "eat a portion" among the simple things (`23-ch06-round.html`) | Five portions eaten unseen took 5 Actions, no rolls and no noise. Carrying the same fish out would take a pick-up plus two haul rolls through Brutus's room. | Make eating a portion a roll every time, seen or not (Sneaky to eat quietly, Savage to wolf it down), like hauling. |
| S-04 | **major** | "<strong>Doors.</strong> Humans pass closed doors as if they were open and leave them as they found them." (`23-ch06-round.html`) | Brutus's routine (Kitchen, Hall, Living room) needs him to pass the closed stiff door. I ruled pets pass doors like humans. It stopped mattering after the gang opened the door in round 2. | Say "Humans and pets pass closed doors…", or say on the house page that Brutus stays behind his door until it's opened. |
| S-05 | minor | "A helper is in the same room, uses its Action, and doesn’t roll" (`21-ch04-rolling.html`), against "help another cat, hide, or make a noise … Seen, any of them is a roll" (`23-ch06-round.html`). CORE-RULES says "seen or not". | Round 2: Joe and Mags helped open the door in front of Sam with no roll of their own (Chapter 4). | Take "help another cat" out of Chapter 6's list of simple things that need a roll when seen. |
| S-06 | minor | "A cat that walks into an awake dog’s room … must leave or deal with the dog before doing anything else." (`27-ch10-residents.html`) | Rounds 1 and 8: I counted helping the cat who drives Brutus off as each helper "dealing with" him. | Add: "Helping the cat who deals with the dog counts as dealing with it." |
| S-07 | minor | Push: "or <strong>1 step</strong> to the Mood meter that roll would fill"; Flop: "whichever meter is <strong>fuller</strong> (its own meter if they’re level)" (`21-ch04-rolling.html`, `22-ch05-mood.html`) | Round 3: paying the Push with a Cuddle step made the meters level, so the re-Flop went on Cuddle (+2) and not on Broom. Players can steer Flops this way. | Say the Flop's meter is read before the Push is paid. |
| S-08 | minor | "Each time you distract the same human again in the same robbery, it costs a die." (`23-ch06-round.html`) | It's unclear whether Joe's failed round-3 try on the Chef counts. In branch B I counted it (−1). | "Each earlier try at distracting that human costs a die" (or "each earlier one that worked"). |
| S-09 | minor | "never the same cat with the same thing twice" (`24-ch07-instincts.html`) | In a three-cat gang the kitchen had only 3 cat-and-temptation pairs, all used by round 5. From round 6, waiting in the kitchen cost nothing. I also counted kitchen Foodie and utility-room Foodie as different "things". | "Never the same cat twice in a row" (or "the same cat with the same instinct twice in a row"). |
| S-10 | minor | "<strong>6</strong> Puts the cat outside: “Go on, home you go.”" (also 4–5 "Carries the cat to the Den … and shuts it in") (`26-ch09-caught.html`) | Which entrance? Is it shut? Where does the holder end up? I chose the dog door (tied nearest). Sam ended up in the utility room, and the door stayed open. | "…out through the nearest entrance (it stays open); the human stays in that room this round." Say the same for the Den. |
| S-11 | minor | "If a Searching human can see a cat: Broom +1" (`23-ch06-round.html`) and "they see nobody else" (`26-ch09-caught.html`) | Rounds 6–7: Searching Sam holding Joe didn't "spot" Joe. | Add: "A human holding a cat isn't Searching while they hold it." |
| S-12 | minor | Searching, step 1: "stay put if the prize is in their room, or step into its room if it’s next door" (`23-ch06-round.html`) | Round 9: every portion was eaten, so there was no prize. I went on to step 2. | Add: "(skip this once the prize is eaten or outside)". |
| S-13 | minor | Give in: "Your Action this round is the instinct thing, done right away" (`24-ch07-instincts.html`), against the Charge "before doing anything else" (`27-ch10-residents.html`) | Round 8: Dot was tempted to square up to Brutus. He resisted, so it was moot. If he gives in, has he dealt with the dog? | Add: "Squaring up isn't dealing with the dog: the Scrapper still has to leave or deal with it." |
| S-14 | minor | "Goes into a random next room at the end of each round." (`27-ch10-residents.html`), with the house's "Goes: Living room, Hall" | With only two rooms it just goes back and forth, with nothing to roll. It isn't clear whether it moves in the Pets step or after Finding it. It never came near the kitchen, so the ride and the Hunter temptation never came up. | Let it roam Living room, Hall and Kitchen, and say it moves "after Finding it". |
| S-15 | minor | CORE-RULES: "**Meow at a door** (Sweet) and a human there lets you out — not with your mouth full" (`docs/CORE-RULES.md`); no chapter has this rule | The chapters win, so I didn't use it. (The Quick Reference also says Sweet can "be let in or out".) | Add the rule to Chapter 8 (*Getting out*), or take it out of CORE-RULES and the Quick Reference. |
| S-16 | minor | "The way in from upstairs is long but quiet." (`45-ch18-marchetti-salmon.html`) | The dog door plus a three-cat drive-off (2 dice, 3 in 4) beat the upstairs routes easily. The skylight is Lean-only and the balcony is a Hard climb (0–1 dice for this gang). Neither was used. | Have "How it plays" point out the gang-up at the dog door, or make the dog door noisy so going in that way costs something. |
| S-17 | minor | Front door: "slip past their legs (Sneaky, Hard, in view of the human)" (`25-ch08-prize.html`); the map says "behind Sam" and the read-aloud has the Chef coming in | Not used. It's unclear which human's Attention counts, the Chef's (2) or Sam's (1). | Name the human on the house page: "Front door (Sam lets you in)". |
| S-18 | minor | Searching, step 2: "step into a next room where a cat isn’t hiding" (`23-ch06-round.html`) | Branch B only: a cat shut in the Den drew the Searching Chef upstairs and was spotted at the end of every round. | Add: "A Shut In cat doesn't draw Searching humans and isn't spotted." |
| S-19 | minor | Push: "The cat who rolled pays for it: 1 Cattitude, or 1 step to the Mood meter…" (`21-ch04-rolling.html`) | Round 6: paying the step would have filled Cuddle before the reroll. Does the Scoop happen first? I didn't push. | "If paying the step fills a meter, it happens after the reroll." |
| S-20 | minor | "Walking, sitting, washing and staring are free" (`22-ch05-mood.html`), against "Going out through one that needs no roll can be your Move or your Action" (`23-ch06-round.html`) | Rounds 9–10: Mags and Dot went out of the dog door in front of Searching Sam, and I treated it as walking (free). | Add to Chapter 5: "going in or out through an entrance that needs no roll counts as walking". |

## Feel notes

- **Was it fun?** The first four rounds were. Brutus being driven off in a shower of fur, Joe flopping twice in front of the Chef, and the gang deciding *not* to touch the fish because Sam was about to walk in all felt like the game the book promises. The tension came from the meters (C3 after one bad roll) and from a gang that had 1–2 dice for everything.
- **Was it hard in a good way?** Not after round 4. One die (the Chef's 6) removed the house's best defence for good. Another (Joe's Flop at C4) turned the other human into a blindfolded cuddler. From then on the robbery was bookkeeping: 5 eating Actions and 2 walks, no rolls. The book's designer note says a Hard house is won "a bit more than half the time". With S-01 and S-02 as written, this house is much easier than that whenever the Chef rolls a 6 early (1 in 6 a round). Branch B feels like a real Hard house.
- **Dominant line:**
  1. Everyone in through the dog door and gang up on Brutus.
  2. Open the stiff door.
  3. Sit in plain view in the kitchen. It's free, and the temptations run out.
  4. Wait for the Chef's 6.
  5. Distract whoever's left. When Cuddle is high, a failed distraction is just as good, because a Scoop blinds the holder.
  6. Eat the fish unseen, then walk out of the dog door.
  - Nothing in the house punishes waiting in plain view until the prize is touched.
- **Brutus:** the rating 3 felt big but fair. A drive-off needed the whole gang's Actions and a Cattitude, and gave three quiet rounds. Barking did nothing all game: the Chef is Busy, Sam was either in the same room or holding a cat, so no bark ever drew anyone. A held cat in his room pinned him in place (S-02), which was the one time he really got in the way.
- **The busy Chef:** "Busy" plus Attention 2 is a great idea: she can't be lured, so you must work under her nose. It was undone by her routine (S-01). If she comes back to the kitchen, she's the right villain.
- **Hauling vs eating:** with the only Medium exit being the dog door through Brutus's room, nobody would ever haul this salmon while eating it unseen is free (S-03). The hauling rules never came up.
- **The robot vacuum:** pure scenery. It stays in the living room and hall, far from the fish (S-14). It never tempted Mags, because she never set foot in its rooms.
- **Three cats:**
  - 3 Cattitude each felt right. The gang had 10 tokens in all (9, plus 1 from giving in), spent 9 on dice and resisting, and ended with 1.
  - Patience +1 mattered: the single Scoop left Broom at 3/5, not 3/4.
  - The extra 2 rounds on the Prize Clock didn't matter (we finished in round 10).
  - With three cats, one temptation or one Held cat stalls a third of the gang, and every pet roll needs all three. That made each round's plan feel tight, in a good way.
- **What might confuse an 8-year-old:**
  - Why does "stays put" mean the Chef never goes back to her kitchen?
  - Paying for a Push with a Cuddle step, then having the Flop land on Cuddle because the meters are now level.
  - Why helpers have to "deal with" a dog too.
  - Why a grown-up who is busy cuddling a cat can't see the other cats eating the dinner beside them. Kids will love that one, but it's a big loophole.

## Dice appendix

Every roll in order, as logged before use (`crypto.randomInt`). CAT = a player's roll, ST = the Storyteller's.

```
#1 [1d6] Cat1|name first bit d6 => 5
#2 [1d6] Cat1|name d6 => 2
#3 [1d8] Cat1|coat d8 => 2
#4 [1d6] Cat1|mark d6 => 2
#5 [1d6] Cat1|eyes d6 => 1
#6 [1d6] Cat1|approach for the 3 (1 Sn 2 Sw 3 Sa 4 St 5-6 reroll) => 2
#7 [1d6] Cat1|approach for the 2 counted from Sweet (1-2 Savage, 3-4 Streetwise, 5-6 Sneaky) => 5
#8 [1d8] Cat1|instinct A d8 => 6
#9 [1d8] Cat1|instinct B d8 => 1
#10 [1d6] Cat1|body d6 (1-3 Lean 4-6 Chonky) => 4
#11 [1d6] Cat1|quirk d6 => 1
#12 [1d6] Cat2|name first bit d6 => 4
#13 [1d6] Cat2|name d6 => 5
#14 [1d8] Cat2|coat d8 => 4
#15 [1d6] Cat2|mark d6 => 2
#16 [1d6] Cat2|eyes d6 => 1
#17 [1d6] Cat2|approach for the 3 (1 Sn 2 Sw 3 Sa 4 St 5-6 reroll) => 6
#18 [1d6] Cat2|approach for the 3 reroll (1 Sn 2 Sw 3 Sa 4 St 5-6 reroll) => 4
#19 [1d6] Cat2|approach for the 2 counted from Streetwise (1-2 Sneaky, 3-4 Sweet, 5-6 Savage) => 2
#20 [1d8] Cat2|instinct A d8 => 6
#21 [1d8] Cat2|instinct B d8 => 8
#22 [1d6] Cat2|body d6 (1-3 Lean 4-6 Chonky) => 6
#23 [1d6] Cat2|quirk d6 => 5
#24 [1d6] Cat3|name first bit d6 => 4
#25 [1d6] Cat3|name d6 => 4
#26 [1d8] Cat3|coat d8 => 8
#27 [1d6] Cat3|mark d6 => 4
#28 [1d6] Cat3|eyes d6 => 2
#29 [1d6] Cat3|approach for the 3 (1 Sn 2 Sw 3 Sa 4 St 5-6 reroll) => 1
#30 [1d6] Cat3|approach for the 2 counted from Sneaky (1-2 Sweet, 3-4 Savage, 5-6 Streetwise) => 5
#31 [1d8] Cat3|instinct A d8 => 4
#32 [1d8] Cat3|instinct B d8 => 7
#33 [1d6] Cat3|body d6 (1-3 Lean 4-6 Chonky) => 1
#34 [1d6] Cat3|quirk d6 => 4
#35 [1d6] Gang|gang name d6 => 1
#36 [2d6] R1 CAT|Dot leads drive-off Brutus, Savage 1+Scrapper 1+2 helpers+1 CT=5, -3 rating = 2 dice (unseen) => 2 4
#37 [3d6] R2 CAT|Dot leads open stiff kitchen door, Streetwise 3+2 helpers=5, Hard -2 = 3 dice (seen by Sam, Streetwise ignores Attention) => 6 4 2
#38 [1d6] R2 ST|Chef routine d6 (1-5 stay, 6 Hall) => 5
#39 [1d6] R2 ST|Sam routine d6 from Utility (1-2 stay, 3-4 Living, 5 Kitchen, 6 Study) => 3
#40 [2d6] R3 CAT|Joe distracts Chef (1st time), Sweet 3+1 CT=4, -2 Attention = 2 dice (seen; Cuddle) => 3 1
#41 [2d6] R3 CAT|Joe Push on distraction (paid +1 Cuddle), reroll both non-6 dice => 3 2
#42 [1d6] R3 ST|Chef routine d6 (1-5 stay, 6 Hall) => 2
#43 [1d6] R4 ST|Brutus routine d6 (1 stay, 2 Kitchen, 3 Hall, 4 Living, 5-6 sniff toward nearest cat) => 1
#44 [1d6] R4 ST|Chef routine d6 (1-5 stay, 6 Hall) => 6
#45 [1d6] R4 ST|Sam routine d6 from Kitchen (1-2 stay, 3-4 Living, 5 Kitchen, 6 Study) => 2
#46 [3d6] R5 CAT|Joe distracts Sam (1st time for Sam), Sweet 3+1 CT=4, -1 Attention = 3 dice (seen; Cuddle) => 4 2 1
#47 [3d6] R5 CAT|Mags step 1 (up on island), Sneaky 3+Climber 1, Tricky -1 = 3 dice (unseen: Sam distracted) => 4 2 1
#48 [3d6] R5 CAT|Dot step 2 (paper off), Streetwise 3+1 CT=4, Tricky -1 = 3 dice (unseen) => 1 3 6
#49 [1d6] R5 ST|Brutus routine d6 (1 stay, 2 Kitchen, 3 Hall, 4 Living, 5-6 sniff toward nearest cat) => 3
#50 [1d6] R5 ST|Chef routine d6 from Hall (1-5 stay, 6 Hall) => 1
#51 [1d6] R5 ST|Sam routine d6 from Kitchen (1-2 stay, 3-4 Living, 5 Kitchen, 6 Study) => 5
#52 [1d6] R6 CAT|Joe distracts Sam (2nd time), Sweet 3, -1 Att, -1 repeat = 1 die (seen; Cuddle) => 2
#53 [1d6] R6 ST|Brutus routine d6 from Hall (1 stay, 2 Kitchen, 3 Hall, 4 Living, 5-6 sniff toward nearest cat) => 3
#54 [1d6] R6 ST|Chef routine d6 from Hall (1-5 stay, 6 Hall) => 2
#55 [1d6] R6 ST|Sam holder d6 for Joe (1-3 cuddle, 4-5 Den, 6 outside) => 2
#56 [1d6] R7 ST|Brutus routine d6 from Hall (1 stay, 2 Kitchen, 3 Hall, 4 Living, 5-6 sniff toward nearest cat) => 6
#57 [1d6] R7 ST|Chef routine d6 from Hall (1-5 stay, 6 Hall) => 6
#58 [1d6] R7 ST|Sam holder d6 for Joe (1-3 cuddle, 4-5 Den, 6 outside) => 1
#59 [1d6] R8 CAT|Mags leads drive-off Brutus, Savage 1+Hunter(fight) 1+Dot helps 1+CT 1=4, -3 rating = 1 die (unseen) => 4
#60 [1d6] R8 ST|Chef routine d6 from Hall (1-5 stay, 6 Hall) => 4
#61 [1d6] R8 ST|Sam holder d6 for Joe (1-3 cuddle, 4-5 Den, 6 outside) => 6
#62 [1d6] R9 ST|Chef routine d6 from Hall (1-5 stay, 6 Hall) => 3
#63 [2d6] BRANCH-B R6 CAT|Joe distracts Chef (2nd), Sweet 3 -2 Att -1 repeat = 0 -> roll 2 keep lower (seen; Cuddle 4/6) => 1 2
#64 [3d6] BRANCH-B R6 CAT|Dot eats portion in view of Searching Sam, Sneaky 2+Foodie 1+CT 1=4, -1 Att = 3 dice => 3 6 1
#65 [3d6] BRANCH-B R6 CAT|Mags eats portion in view of Searching Sam, Sneaky 3+CT 1=4, -1 Att = 3 dice => 6 2 3
#66 [1d6] BRANCH-B R6 ST|Brutus routine d6 from Hall (1 stay, 2 Kitchen, 3 Hall, 4 Living, 5-6 sniff toward nearest cat) => 6
#67 [1d6] BRANCH-B R6 ST|Chef holder d6 for Joe (1-3 cuddle, 4-5 Den, 6 outside) => 4
#68 [1d6] BRANCH-B R7 ST|Brutus routine d6 from Kitchen (no cat there; 1 stay, 2 Kitchen, 3 Hall, 4 Living, 5-6 sniff toward nearest cat=Utility) => 4
#69 [3d6] BRANCH-B R8 CAT|Mags eats portion in view of Searching Sam, Sneaky 3+CT 1=4, -1 Att = 3 dice (Broom 4/5) => 6 1 6
```

Totals:
- 69 rolls: 35 making the gang, 9 cat rolls in the main line (8 rolls and 1 Push), 18 Storyteller rolls in the main line, and 7 in branch B (4 cat, 3 Storyteller).
- Temptation targets were chosen by the Storyteller, never rolled; the reason for each pick is in the play log.
- The robot vacuum needed no rolls: only one next room was ever allowed (S-14).

# Testing the Foundry system by hand (two clients)

There is no live Foundry in the cloud, so the automated tests run on a fake Foundry (`tools/fake-foundry.mjs`). This script checks the same things in **real Foundry v13** with two browser windows: you as the **Storyteller (GM)** and one **player**. It takes about 30 minutes. Each step says what you should see; if you see something else, note the step number, what happened, and any red error in the browser console (F12).

## 0. Set up (once)

1. Install the system. Nothing is released yet, so install it by hand: quit Foundry, unzip `Nine_Lives_Gang_Foundry_v0.8.0-test.zip` into the `Data/systems` folder of your Foundry user data (it holds a `cat-burglars` folder, so you end up with `Data/systems/cat-burglars/system.json`), and start Foundry again. Once a release exists you can instead use **Game Systems → Install System** with the manifest URL
   `https://github.com/PainHog/CBZ/releases/latest/download/system.json`.
2. Create a world with the **Nine Lives Gang** system and launch it.
3. **Game Settings → Users**: add a player called **Lena** (role Player). Open a second browser (or a private window) at the same address and log in as Lena. From now on, **GM** means your first window and **Lena** the second.
4. GM: open **Compendium Packs → Nine Lives Gang → The Ready-Made Gang**. Import **Two-Bin Tilly**, **Big Biscuit**, **Velvet** and **Marmalade Mags**.
5. GM: right-click Velvet and Tilly → **Configure Ownership** → Lena: Owner. Biscuit and Mags stay yours (you play them for the "second player").
6. GM: **Configure Settings → System Settings**: leave every Nine Lives Gang setting at its default for now.

## 1. Sheets and the roll dialog

1. Lena: open **Velvet**'s sheet. *See:* approaches Sweet 3, Sneaky 2, Savage 1, Streetwise 1, each with a **Roll** button; instincts Lap Cat and Knocker; body Lean; Cattitude 2; Lives 9.
2. Lena: change Cattitude to 3 and back to 2. *See:* it saves (close and reopen the sheet).
3. Lena: click **Roll Sweet**. *See:* a dialog with Sweet selected, a dice preview table, Difficulty "From what you're doing", Knack "From your instincts", Seen "As the house is". Click **Roll**. *See:* a roll card in chat with the dice, the highest one outlined, and the result (Flop / Scrape / Clean / Purrfect). There is no robbery yet, so it says nothing about the Mood.

## 2. Start the robbery

1. GM: click the **cat** button on the token controls (left toolbar) to open the **Robbery Tracker**. *See:* "No robbery yet" and **Start a robbery**.
2. GM: **Start a robbery** → house **The Chicken at Number 12**, tick the four cats → **Start**. *See:* a chat card "The Chicken at Number 12" with Patience 4, the chicken gone at the start of round 10, Lights Out at the end of round 12, and all four cats outside. Every cat's Cattitude is 2.
3. Lena: open the tracker from the card's **Open the Robbery Tracker** button. *See:* the same house, read-only for the residents, with buttons only under Velvet and Tilly.

## 3. Round 1: getting in

1. GM: **Begin round**. *See:* a "Round 1" card; the tracker shows Round 1 — The cats' turn. Mr Pell is in the hall holding the chicken; Pudding is in the kitchen.
2. Lena: under Velvet, click **Roll: In through the Front door (behind Mr Pell)**. *See:* the roll dialog says Mr Pell can see this; Sweet shows 3 dice (3 + Knack − Attention 1). Roll with **Sweet**.
3. Lena: on the card, *see* **Push (1 Cattitude)**, **Push (+1 Mood)** and **Accept**; the GM window shows **Accept** and **Not seen** instead. Lena clicks **Accept**. *See:* the card says "Applied to the robbery"; on a Scrape or Clean, Velvet is in the hall and **Cuddle** shows 1/4; the front door's line in the tracker says "tried this round" (one cat a round gets through it).
4. GM: under Mags, click **In through the Cat flap in the back door**. *See:* Mags is in the utility room; the room shows "Noise here this round".
5. Lena: look under Tilly (outside). *See:* no **Help …** buttons: cats outside can't help one coming in (a helper is in the same room, and outside isn't a room).
6. GM: under Biscuit, click **Roll: In through the Open kitchen window (up the bins)**. *See:* the dialog lists no helpers and no "Spend 1 Cattitude for +1 die" box (Cattitude only pays for a Push or for resisting now). Roll **Savage** (2 dice: Savage 3, Tricky −1).
7. GM: if it's a Flop, click **Push (1 Cattitude)**. *See:* the non-6 dice are rerolled, Biscuit's Cattitude drops to 1, and the card is final at once. On a success Biscuit is in the kitchen. Lena: under Tilly, **Roll: In through the Open kitchen window (up the bins)**, Sneaky, and Accept.
8. GM: **End round** → confirm. *See:* a "The house's turn" card: Pudding barks (a cat is in the kitchen), Mr Pell comes to see the noise in the utility room (the cat flap was the first noise), and the dice he rolled if any. Pudding does **not** chase Biscuit and Tilly out: they climbed in, so they had no Action left, and they deal with him first thing next turn.
9. GM (optional, the dog's chase): in a later round, move a cat that still has its Action into a room with an awake dog and **End round** without rolling against the dog. *See:* "… chases … back into the …" on the house-turn card, before the pets move.

## 4. Round 2: the Prize Clock, a temptation, the Mood

1. GM: **Begin round**. *See:* "Mr Pell puts the rotisserie chicken in the kitchen and stays there this round, answering no noise (2 steps to get at it)"; his badge in the tracker says "Stays with the prize: answers no noise this round"; and a **whispered** "Temptation" card (only the GM sees it) with one-click **Tempt …** buttons.
2. GM: click **Tempt Velvet: …** if offered, else any cat of Lena's. *See:* a public temptation card. Lena *sees* **Give in (+1 Cattitude)** and **Resist (1 Cattitude)**; every other cat's buttons in the tracker say they wait ("… is tempted and goes first").
3. Lena: **Resist**. *See:* that cat's Cattitude −1; the card says "Resisted".
4. GM: in the tracker header, click Broom **+1** three times. *See:* Broom 3/4.
5. GM: make a roll Mr Pell can see that fills Broom — e.g. under Biscuit (in the kitchen with Mr Pell) **Roll: Deal with Pudding**, Savage, and **Accept**. *See:* on a success Pudding is driven off; then, because Broom reached 4, a **Shoo!** card: Mr Pell chases Biscuit out of the kitchen window (the nearest entrance Biscuit fits through that works this round: the front door only works in round 1), shuts it (the cat flap is still open) and stays in the kitchen; Broom 0, **Patience 3**; Cuddle stays where it was (it was below 3). Biscuit is outside; the window shows SHUT.
6. GM: **Undo last Mood change** twice. *See:* the first puts Biscuit back in the kitchen with the window open and Patience 4 (Broom 4/4: full again, so the next change to the robbery would set it off once more — Mr Pell can see Biscuit); the second takes the roll's own step off (Broom 3/4). Then click Broom **−1** three times (Broom 0/4) so the rest of the round stays calm.
7. Lena: under Tilly, **Roll: Get at the rotisserie chicken: step 1 of 2**. On the card, GM clicks **Not seen**, then **Seen** again. *See:* the badge flips each time; then Lena **Accept**s. *See:* "Step 1 of 2 done".
8. GM (the Prize Clock's hold): in the tracker, under the utility room, click **Noise here**; then **End round**. *See:* the house-turn card says "Mr Pell stays with the rotisserie chicken (the Prize Clock's hold): the noise in the utility room doesn't draw them this round" and "Mr Pell stays with the rotisserie chicken (the Prize Clock)"; at the end, "Finding it": he is beside the chicken with a step done, so he finds it disturbed: +1 Broom, and starts **Searching** (the badge appears on Mr Pell).
9. GM: **Begin round**. *See:* the whispered Temptation card doesn't offer the cat you tempted last round.
10. GM (the Storyteller's pick): with Mr Pell Searching beside the chicken, leave two cats unhidden in his room, bring Broom to one short of full with **+1**, and **End round**. *See:* "Finding it" adds +1 Broom (a Searching human can see a cat), and because two cats are in sight a **whispered** card "Broom is full — The Storyteller's pick" offers **Mr Pell chases out …** for each of them; the tracker header shows the same buttons (Lena sees only the sentence), and every cat's buttons wait ("the Storyteller first picks which cat Mr Pell chases out"). Click one. *See:* the Shoo! card for that cat; the other stays. **Undo last Mood change** brings the cat back and the buttons return.

## 5. Rounds 3+: carrying it out

1. Get the chicken down (step 2), then pick it up: a Medium prize needs Biscuit (Chonky) alone, or two cats — have Velvet click **Help Two-Bin Tilly**, then Tilly **Pick up the rotisserie chicken**.
2. *See:* moving it is now **Roll: Haul the rotisserie chicken to the …** even when nobody watches; in the roll dialog the other carrier is ticked as a helper ("carrying it too") and can't be unticked.
3. Haul helpers: leave a third cat (one that hasn't acted) in the room. *See:* the haul's dialog lists it too, unticked, "helps, but stays here". Tick it and roll: the dice preview counts it (+1, at most +2 help in all); when the haul works, only the carriers move with the chicken and the helper stays behind with its Action spent. (A cat a dog is stopping isn't listed: it must deal with the dog first.)
4. Haul it to the utility room and out of the cat flap (the kitchen window is a climb: "Small things only").
5. *See:* when the prize is out and no free cat is inside, the round's end posts a **Leg it!** card: the getaway starts (section 8). Play it out; when everyone is home or pinched the outcome card says **Clean Getaway** (or Messy, or Busted) with the loot home. GM: click **Give the gang +1 Rep (campaign)** → each cat's Rep is 1.
6. If a cat was pinched, its owner sees **…: spend a Life to bust out of the pound** on the outcome card; clicking it takes one Life.

## 6. Core rules v0.8 on other houses (still true in v0.9)

1. **The parrot remembers (The Birthday Cake).** GM: start a robbery at **The Birthday Cake** and **Begin round**; move Aunt Rosalind to the living room (**Move:**). Lena: under Velvet, **In through the Patio door, ajar** (no roll), then **Hide**. *See:* in the dining room, Captain the parrot's line says "saw a cat this round: squawks in the Pets step", although Velvet is now hidden. GM: **End round**. *See:* "Captain the parrot squawks (it saw a cat earlier this round)"; Dad, who put the cake down this round, stays with it ("the Prize Clock's hold"), so somebody else comes to the dining room.
2. **The cake wobbles** (optional, if you play on until a cat carries the cake): *See:* **Roll: Haul the birthday cake …** offers Sneaky and Savage, both **Tricky**.
3. **A meter that waits (any house).** GM: with a human **Distracted** in a room where a cat stands unhidden, click Broom **+1** until it is full. *See:* no Shoo! yet; the tracker's log says "Broom is full, but nobody with free hands can see a cat: it stays full, and as soon as someone can, they act at once", and the header says so too. GM: **End round**. *See:* as the house's turn starts the human looks round: "Broom was waiting full: … can see … and acts at once", then the Shoo! card.
4. **Out and back in.** Lena: send a cat out through an entrance that needs no roll (Number 12's cat flap). *See:* its **In through …** buttons now say "it went out this turn: back in next round".
5. **Dozing (Grandpa Wendell's Catnip Mouse).** GM: play a few rounds. *See:* Grandpa rolls his doze die every house's turn — even in a round he answers a noise or Searches ("Grandpa Wendell nods off (d6 1)") — and when he has nodded off, the next house's turn says "Grandpa Wendell is asleep and stays put" (no routine roll for him). To try the Prize Clock's wake-up, put him to sleep from the console before round 4 begins: `game.catBurglars.robbery.overrides.patch("wendell", { asleepUntil: 4 })`, then **Begin round**. *See:* "Grandpa Wendell wakes up: there's the catnip mouse to see to", and he moves the mouse to the living room.
6. **Chased back out (The Okafors' Big Box).** GM: wake Noodle (console: `game.catBurglars.robbery.overrides.patch("noodle", { mode: "awake" })`). Lena: a cat comes in through the **Dog door** and does nothing else. GM: **End round**. *See:* "Noodle chases … back out through the Dog door: it only just came in!" — the cat is outside again.

## 7. Core rules v0.9 (any robbery at Number 12 unless it says)

1. **A Shoo! through a shut entrance.** GM: in the footer's **Ways and entrances**, **Shut** the kitchen window. Put Biscuit and Mr Pell in the kitchen (**Put:** / **Move:**) and bring Broom to one short of full with **+1**. GM: under Biscuit, a free **Savage** roll; **Accept**. *See:* "Shoo! Mr Pell grabs the broom and chases Big Biscuit out through the Open kitchen window (up the bins) (opening it first), shuts it and stays in the kitchen". The window shows SHUT again; the cat flap is still open.
2. **The human who shooed stays put.** GM: under the hall, click **Noise here**; **End round**. *See:* "Mr Pell stays by the entrance they shooed a cat out of: the noise in the hall doesn't draw them this round". Biscuit's **In through …** buttons said "it went out this turn: back in next round" until the next round began.
3. **The last open entrance stays open.** GM: **Shut** the cat flap too (the window is shut from step 1). With a cat and Mr Pell in the kitchen and Broom one short of full, fill Broom with a seen roll. *See:* the Shoo! card says "leaves it open (it's the last way in still open)", and the window shows open (the front door doesn't count: it only works in round 1).
4. **The other meter drops to one below.** GM: with Patience 4, set Cuddle to 3 (**+1** three times) and Broom to 3; fill Broom with a seen roll. *See:* "Broom empties; Patience drops to 3. Cuddle drops to 2, one below it: one catch never sets off the other." — and no Scooped! follows.
5. **A give-in stops one short.** GM: bring Cuddle to one below full; put Velvet and Mr Pell in the living room; **Tempt Velvet: Lap Cat**. Lena: **Give in**. *See:* "Cuddle +0 (…): … (giving in never fills a meter: it stops one short)" — no Scoop; Mr Pell is Distracted; later, Velvet's **Distract Mr Pell** says "(distracted 1× before: −1)" (the fuss counts as a distraction).
6. **A Knocker in view leaves no mess.** Tempt a Knocker in a room with an awake human; give in. *See:* +1 Broom (or one short of full), noise, and no "Mess here" in that room. Unseen (nobody in the room), it leaves the mess and no Broom.
7. **Distract and the Scoop.** With Cuddle one short of full and Mr Pell in Velvet's room, Velvet **Distract**s him: on a Scrape or Clean *see* "Scooped! Mr Pell picks Velvet up" and "The Scoop wins: Mr Pell picks Velvet up instead, and isn't Distracted" — he has no Distracted badge.
8. **A held cat can be helped.** With Velvet held, put Tilly in the same room. Lena: under Tilly, **Help Velvet**; then Velvet's **Roll: Wriggle free** lists Tilly as a ticked helper.
9. **The Den.** With a cat held, **End round** until the holder rolls 4 or 5. *See:* "… shuts … in the downstairs loo, … and stays just outside, in the hall" — the human is in the hall, not the loo.
10. **The party's front door (The Birthday Cake).** Round 1: one cat tries the front door (any result). *See:* every other cat's **In through the Front door (guests arriving)** says "one cat a round: it has been tried this round". Round 2: it works again for one cat; round 3: "only in round 1 or 2".
11. **Ties go to the higher Attention, then a die (The Birthday Cake).** Put Dad and Mia in the kitchen (both Attention 1) and make a noise in the utility room (**Noise here**), then **End round**. *See:* "… comes to see the noise in the utility room (as close as another and tied on Attention: a die, N)". With Aunt Rosalind (Attention 2) as close, she goes: "(as close as another: the higher Attention goes)".
12. **A befriended dog.** Befriend Pudding (Sweet). *See:* at End round no "Pudding barks" with cats in his room, but he still follows his routine; he no longer tempts Scrappers.
13. **Gang size and Rep.** Start Grandpa Wendell's with three cats. *See:* the start card's "Patience 10 (this house's own number for three cats)", gone at the start of round 11. Then give one cat Rep 3 on its sheet and start a new robbery with four cats. *See:* "Every cat starts with 3 Cattitude (the gang's Rep 3: +1)", and every cat's Cattitude is 3.
14. **The end.** With the prize got (or gone) and a cat still held, take every other cat outside and **End round**. *See:* the house-turn card's footer "No free cat is inside and the … is out: the house part ends at the end of the round, and the getaway starts (still inside, so pinched: …)", then the **Leg it!** card. With the prize still to get and everyone outside, nothing ends by itself: **End the robbery** is the gang running for it.

## 8. The getaway (Chapter 9)

Play on from section 5 (the chicken out of the house), or any robbery whose house part has ended.
1. *See:* the **Leg it!** card: the route (Mr Pell's back fence, the allotments, the alley wall, Station Road), who is pinched (any cat still inside), the loot shared out ("Big Biscuit 2 pieces, …"; what nobody can carry is left in the garden), and when the van pulls up (the end of round 1 if anyone was Shooed or Scooped tonight, else round 2). The tracker now shows the route: the garden, a space past each obstacle, the hideout; the cats with their loot; the warden's line.
2. Lena: under Tilly, **Roll: Over Mr Pell's back fence (carrying loot: −1 die)**. *See:* the dialog lists the other cats in the garden as helpers ("goes over with them"), says nobody can see this, and has no Attention; tick two of them. The card says "no meters" and offers **Push (1 Cattitude)** but no **Push (+1 Mood)**. On a success the three of them are past the fence.
3. GM: under Biscuit (2 pieces), **Drop a piece of loot here**. *See:* a card "drops a piece of loot on purpose"; the garden shows "Dropped loot here: 1"; Biscuit's next roll has no loot die (a Chonky cat with one piece runs free).
4. Roll Biscuit over and get a **Flop** (Push if you like). *See:* "Flop! … is stuck … and drops a piece of loot in the scramble", and once the warden is out, "the warden comes on two spaces this round".
5. GM: **End the getaway round**. *See:* round 1 with nobody caught: "a van is on its way"; when it arrives, "Screeeech! … the warden jumps out into the garden", and any loot lying on or behind the warden's space is scooped up.
6. Leave a cat on (or behind) the warden's space and **End the getaway round**. *See:* "Cornered! … must dodge the warden"; that cat's only button is **Roll: Dodge the warden!** (Sneaky, Savage or Sweet, plain), the GM's **End the getaway round** waits, and on a success the cat bolts to the space just ahead of the warden; on a Flop "Pinched! … loot and all".
7. A cat with room on a space where loot lies: **Grab a dropped piece** (its go for the round).
8. *See:* when the last cat is home or pinched, the outcome card: "Loot home: N of M", who went to the pound, and for a pinched cat its owner's **spend a Life to bust out of the pound**.
9. Off switch: **Run the getaway** off. *See:* getaway rolls say the Storyteller moves the gang by hand; **End the getaway round** only moves the round on; use the tracker's **Put:**, **Loot:** and **Warden:** selects, then **Count the loot**.
10. Shiny things: in any room, a Curious or Knocker cat can be tempted by "something shiny lying about" / "something sparkly on the edge of a table" — even in the downstairs loo.

## 9. The Storyteller away

1. GM: start a new robbery (any house), **Begin round**.
2. GM: close the GM window (log out).
3. Lena: make a roll from the tracker and **Accept** it. Try a Move button. *See:* the roll card stays "Final — waiting for the Storyteller's client"; the Move warns "The Storyteller isn't connected — nothing was changed."
4. GM: log back in. *See:* a notification "applied 1 roll made while the Storyteller was away"; the roll's effect and Mood are in the tracker.

## 10. Switching automations off

In **Configure Settings**, try each and check the "Off" behaviour:

| Setting | Set to | You should see |
|---|---|---|
| Automatic Mood | Confirm each change | Rolls don't move the meters; the tracker lists them with **Apply** / **Drop** |
| Automatic Mood | By hand | Nothing is written to the meters, and a full meter never goes off by itself (no Shoo! or Scooped! as a human walks in) |
| Fill in who sees a roll | off | The dialog's Seen defaults to "Not seen" and Attention to 0 |
| Rolls change the house | off | A working roll doesn't move the cat or open the door; the card says the Storyteller applies it by hand; use the tracker's **Put:** selects |
| The house's turn | Ask first / Run at once / By hand | End round asks / doesn't ask / only ends the round (nobody moves) |
| Roll routines | off | The house's turn moves nobody by routine (noise still draws humans) |
| Temptation | No prompt / Tempt at random | No whispered card / a random cat is tempted at Begin round |
| Spend and earn Cattitude | off | Pushes, resisting, giving in and Purrfects don't change any sheet, and a new robbery doesn't reset it |
| Run the Prize Clock | off | Begin round doesn't put the prize down or take it away (and nobody is held by it: noise draws everyone) |
| End the robbery by itself | off | No outcome card; end it with **End the robbery** |
| Run the getaway | off | The getaway's rolls move nobody and the warden stays put; move everyone with the tracker's **Put:** / **Loot:** / **Warden:** and **Count the loot** |
| Players can open the tracker | off | Lena's tracker button warns that the Storyteller keeps it |

## What to report

For anything unexpected: the step number, what you did, what you saw, and a screenshot of the tracker and the console. Rules questions (the automation read a rule differently from you) are just as useful as bugs: the readings it uses are listed in `docs/AUTOMATION.md` → Implementation notes.

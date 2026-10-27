# Testing the Foundry system by hand (two clients)

There is no live Foundry in the cloud, so the automated tests run on a fake Foundry (`tools/fake-foundry.mjs`). This script checks the same things in **real Foundry v13** with two browser windows: you as the **Storyteller (GM)** and one **player**. It takes about 30 minutes, and section 12 (the ready-to-play games) about 15 more. Each step says what you should see; if you see something else, note the step number, what happened, and any red error in the browser console (F12).

## 0. Set up (once)

1. Install the system. Nothing is released yet, so install it by hand: quit Foundry, unzip `Nine_Lives_Gang_Foundry_v0.9.0-test.zip` into the `Data/systems` folder of your Foundry user data (it holds a `cat-burglars` folder, so you end up with `Data/systems/cat-burglars/system.json`), and start Foundry again. Once a release exists you can instead use **Game Systems → Install System** with the manifest URL
   `https://github.com/PainHog/CBZ/releases/latest/download/system.json`.
2. Create a world with the **Nine Lives Gang** system and launch it.
3. **Game Settings → Users**: add a player called **Lena** (role Player). Open a second browser (or a private window) at the same address and log in as Lena. From now on, **GM** means your first window and **Lena** the second.
4. GM: open **Compendium Packs → Nine Lives Gang → Meet the Gang**. Import **Two-Bin Tilly**, **Big Biscuit**, **Velvet** and **Marmalade Mags**.
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
5. *See:* when the prize is out and no free cat is inside, the round's end posts a **Leg it!** card: the getaway starts (section 8). Play it out; when everyone is home or pinched the outcome card says **Clean Getaway** (or Messy, or Busted) with the loot home. GM: click **Give the gang +1 Rep (campaign: a Clean Getaway)** (+2 when the gang's Cred adds up to 8 or more, section 9) → each cat's Rep goes up by that.
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
14. **A Scrapper facing a dog (the fix round).** Put Biscuit in Pudding's room (Pudding awake), **Begin round**. *See:* the temptation prompt offers "Tempt Big Biscuit: Scrapper" ("Pudding, right there") and no other cat in that room. Give in: "You square up to it. Noise. (That isn't dealing with it: you still have to.)"; at **End round** Pudding chases Biscuit back the way he came.
15. **The Den and the cat flap (the fix round).** Walk a cat into the downstairs loo: it's free (no "Shut in the Den"), and the loo's door stays open. Fill Broom on a cat in the utility room with Mr Pell there: the Shoo! card says "… out through the Cat flap in the back door, locks it …"; a cat inside then has **Roll: Open the Cat flap in the back door again** (Streetwise, Hard).
16. **The end.** With the prize got (or gone) and a cat still held, take every other cat outside and **End round**. *See:* the house-turn card's footer "No free cat is inside and the … is out: the house part ends at the end of the round, and the getaway starts (still inside, so pinched: …)", then the **Leg it!** card. With the prize still to get and everyone outside, nothing ends by itself: **End the robbery** is the gang running for it.

## 8. The getaway (Chapter 9)

Play on from section 5 (the chicken out of the house), or any robbery whose house part has ended.
1. *See:* the **Leg it!** card: the route (Mr Pell's back fence, the allotments, the alley wall, Station Road), who is pinched (any cat still inside), the loot shared out ("Big Biscuit 2 pieces, …"; what nobody can carry is left in the garden), and when the van pulls up (the end of round 2 if anyone was Shooed or Scooped tonight, else round 3). The tracker now shows the route: the garden, a space past each obstacle, the hideout; the cats with their loot; the warden's line.
2. Lena: under Tilly, **Roll: Over Mr Pell's back fence (carrying loot: −1 die)**. *See:* the dialog lists the other cats in the garden as helpers ("goes over with them"), says nobody can see this, and has no Attention; tick two of them. The card says "no meters" and offers **Push (1 Cattitude)** but no **Push (+1 Mood)**. On a success the three of them are past the fence. A helper carrying loot is marked "carrying loot: the group loses a die": with a leader who runs free (Biscuit with one piece), ticking a loaded helper takes a die off. A cat carrying loot never sees a Sweet option (mouth full).
3. GM: under Biscuit (2 pieces), **Drop a piece of loot here**. *See:* a card "drops a piece of loot on purpose"; the garden shows "Dropped loot here: 1"; Biscuit's next roll has no loot die (a Chonky cat with one piece runs free).
4. Roll Biscuit over and get a **Flop** (Push if you like). *See:* "Flop! … is stuck … and drops a piece of loot in the scramble", and once the warden is out, "the warden comes on two spaces this round".
5. GM: **End the getaway round**. *See:* "a van is on its way… (it pulls up at the end of round 2)" (round 3 if nobody was caught); when it arrives, "Screeeech! … the warden jumps out into the garden", and any loot lying on or behind the warden's space is scooped up. He never gets past a cat: with a cat still in the garden he stays there ("he can't get past a cat").
6. Leave a cat on the warden's space and **End the getaway round**. *See:* "Cornered! … must dodge the warden"; that cat's only button is **Roll: Dodge the warden!** (Sneaky, Savage or Sweet, plain — no Sweet for a cat carrying loot), the GM's **End the getaway round** waits; on a success "the net swishes past, and the warden goes sprawling into the hedge" — the cat stays where it is, and at the next **End the getaway round** "he doesn't move this round"; on a Flop "Pinched! … loot and all".
7. A cat with room on a space where loot lies: **Grab a dropped piece** (its go for the round). Or **Wait here this round**. *See:* "… waits at …, keeping low" — that's its go.
8. *See:* when the last cat is home or pinched, the outcome card: "Loot home: N of M", who went to the pound, and for a pinched cat its owner's **spend a Life to bust out of the pound**.
9. Off switch: **Run the getaway** off. *See:* getaway rolls say the Storyteller moves the gang by hand; **End the getaway round** only moves the round on; use the tracker's **Put:**, **Loot:** and **Warden:** selects, then **Count the loot**.
10. Shiny things: in any room, a Curious or Knocker cat can be tempted by "something shiny lying about" / "something sparkly on the edge of a table" — even in the downstairs loo.

## 9. Cred: showing off (Chapter 9)

Start a new robbery at Number 12 with the four cats. *See:* the start card ends "Cred: the catnip stash is a catnip cushion on Mr Pell’s armchair (the living room); the Bin Lid Boys have tagged the kitchen, and hang about at the allotments on the getaway. Show off!"
1. GM: **Begin round**; move Pudding to the utility room (out of the way) and put Tilly in the kitchen (nobody there). Lena: under Tilly, **Tag the kitchen: leave the gang's mark (2 Cred, over the Bin Lid Boys' tag; it's a mess)**. *See:* no roll and no noise; a **Showing off!** card "… slap over the Bin Lid Boys' tag. Take that!" and "Two-Bin Tilly +2 Cred …"; the kitchen says "Tagged by the gang · The Bin Lid Boys' tag (tagged over!)" and "A mess, waiting to be found"; the header "Cred tonight: Two-Bin Tilly 2 · … — the Cat's Whiskers so far: Two-Bin Tilly"; Tilly's badge "Cred 2". A cat in the same room has no Tag button now.
2. GM: put Velvet in the room with Mr Pell. Lena: **Roll: Tag the … (+1 if it works in view)** (no "it's a mess"). *See:* the dialog offers Sneaky (Mr Pell's Attention takes a die) or Savage. If it works (a Sneaky Clean too), the card's lines say "right under their noses … They saw it go on: no mess to find later" and Velvet scores 2, and the room shows no mess; on a Flop "rumbled mid-scratch: no tag", with the Flop's Mood.
3. GM: put Biscuit in the living room. Next round, *see:* the whispered temptation card offers "Tempt Big Biscuit: The catnip stash", though Biscuit is a Scrapper and a Foodie. Click it, then **Give in** (Biscuit is yours). *See:* noise in the living room (+1 Broom if Mr Pell is there), Biscuit +1 Cred (not doubled) and the badge "Zoomies!"; on Biscuit's sheet "Cred tonight 1" and the **Zoomies** box ticked (on Lena's cats' sheets the box is greyed out). Nobody can be tempted by, or **Get into**, the catnip any more.
4. Next round, roll anything for Biscuit. *See:* the dialog's approach line says "the zoomies +1" (one die more, never more than 5) with the note "The zoomies: +1 die … this roll is a noise whatever happens"; the card says "Noise in the …" even on a Clean, and its lines "even a Clean comes with a yowl — noise!". In an empty room Biscuit's Tag button is a roll too ("the zoomies: a roll"), and its Cred is doubled.
5. A round later, tempt Biscuit with anything. *See:* "Big Biscuit has the zoomies: it can't resist anything", and only **Give in**.
6. GM: on the tracker, Biscuit's **Zoomies: off**, then **Zoomies: on**; Velvet's **Cred +1** and **−1**. *See:* the badges and the header follow. On Biscuit's sheet the GM can tick and untick **Zoomies** too.
7. Get the chicken out (section 5). *See:* the **Leg it!** card: "The Bin Lid Boys hang about at the allotments …" and "By the back fence Big Biscuit's zoomies have worn off"; on the tracker the allotments space says "The Bin Lid Boys hang about here: dropped loot is nicked at once …".
8. On the allotments, GM: **Drop a piece of loot here (the Bin Lid Boys nick it at once!)** for a cat with loot. *See:* "Nicked! The Bin Lid Boys snatch the dropped piece …", and no loot lies there. Lead a group over with a Clean or a Purrfect. *See:* "… leads the gang right past the Bin Lid Boys, tail high", +1 Cred for the leader only. A Purrfect over any obstacle: "+1 Cred for a Purrfect over … (what a leap)".
9. *See:* the outcome card: "Cred tonight: … — N for the gang.", "… is the Cat's Whiskers with N Cred …" (or "… tie on N Cred: they share the Cat's Whiskers …"), and when the gang's Cred adds up to 8 or more on a night that wasn't Busted the campaign line and the button "Give the gang +2 Rep (campaign: a Clean Getaway and N Cred tonight)" (+1 on a Messy night).
10. Off switch: **Score Cred** off. *See:* a tag still marks the room and leaves a mess, but the card says "(Cred is kept by hand: …)"; the zoomies add no die and no noise, and a cat with them may resist; keep score with the tracker's **Cred +1 / −1**.

## 10. The Storyteller away

1. GM: start a new robbery (any house), **Begin round**.
2. GM: close the GM window (log out).
3. Lena: make a roll from the tracker and **Accept** it. Try a Move button. *See:* the roll card stays "Final — waiting for the Storyteller's client"; the Move warns "The Storyteller isn't connected — nothing was changed."
4. GM: log back in. *See:* a notification "applied 1 roll made while the Storyteller was away"; the roll's effect and Mood are in the tracker.

## 11. Switching automations off

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
| Score Cred | off | Tags and the catnip are noted but score nothing ("Cred is kept by hand"); the zoomies add no die or noise and don't stop a resist; use the tracker's **Cred +1 / −1** and **Zoomies** |
| Players can open the tracker | off | Lena's tracker button warns that the Storyteller keeps it |
| Tokens follow the robbery | off | On a ready-to-play scene (section 12) nothing moves the tokens: they stay wherever you put them; switch it back on and the next change puts everyone where the robbery says |

## 12. Ready-to-play games (the quick start, and tokens that follow)

Use a **fresh world** for this section (nothing imported yet), with Lena logged in as before. It takes about 15 minutes; the five houses are the same steps.

1. GM: open the Robbery Tracker. *See:* "No robbery yet" with **Play a ready-made game** beside **Start a robbery**.
2. GM: **Play a ready-made game**. *See:* a dialog with the gang's tag, the five houses, the ready-made gang with pictures (with one player, Tilly, Biscuit and Velvet are ticked: Chapter 3's gang of three), the line about Configure Ownership. Pick **The Chicken at Number 12**, tick **Marmalade Mags** as well → **Let's go!**
3. *See, both windows:* the scene **The Chicken at Number 12** opens on its own: the floor plan on a cream page, the three entrance markers, a key "ENTRANCES 1 Front door …", and under the house **THE GETAWAY**: the van, the garden, three spaces, the hideout, the obstacles' names between them. Mr Pell's token stands in the hall and Pudding's in the kitchen; the four cats wait outside, spread over the front door, the cat flap and the kitchen window. The cats have their portraits as round tokens, half a grid square each; Mr Pell has the plain figure. No grid lines are drawn (the plan has its own squares). Lena sees no warden.
4. GM: check the sidebar. *See:* **Actors → Nine Lives Gang → The ready-made gang** (the four cats) and **→ The Chicken at Number 12** (Mr Pell, Pudding); **Scenes → Nine Lives Gang**; **Journal → Nine Lives Gang → The Chicken at Number 12**. The scene's journal (right-click the scene → Configure → Journal) is that entry. The chat has the robbery's start card, ending "Storyteller: hand each player a cat — right-click a cat → Configure Ownership."
5. GM: right-click Velvet → **Configure Ownership** → Lena: Owner. Lena: Velvet's token is now hers to select.
6. GM: **Begin round**. Lena: from the tracker, Velvet **In through the Front door**, roll and **Accept**. *See:* when the roll is applied, Velvet's token hops from outside the front door into the hall; no other token moves.
7. GM: Big Biscuit **In through the Cat flap in the back door**. *See:* his token hops into the utility room.
8. GM: drag Mr Pell's token into the living room. *See:* it stays there, and the tracker still has him in the hall. Now press the tracker's Broom **+1**. *See:* his token goes back to the hall.
9. GM: under Big Biscuit (in the utility room), **Roll: Hide**. *See:* when it works, his token goes see-through; when he does something else, solid again.
10. GM: **End round** and run the house's turn. *See:* wherever the house's turn moves Mr Pell and Pudding (the card says), their tokens go there, all at once; anyone Shooed or Scooped goes outside by the right entrance or stays in the human's room beside them (Held). A driven-off Pudding fades for you (hidden) and vanishes for Lena until he comes back.
11. GM: **End the robbery**. *See:* the getaway: the cats outside line up in **THE GARDEN**; any cat still inside sits **IN THE VAN**. Roll a cat **Over** the first obstacle: its token moves to the next space. **End the getaway round** until the van pulls up: the warden appears above the space he lands on and moves along with the gang. A cat home goes in **THE HIDEOUT**.
12. GM: **Clear**, then **Play a ready-made game** again at Number 12 with only Tilly, Biscuit and Velvet. *See:* no second scene, no second copies of anyone; Mags's token is gone from the scene; everyone is back at the start.
13. The other houses, each with **Play a ready-made game** (then **Begin round**, one cat in through a way with no roll, **End round**). *See* for each: its scene opens, the residents start where its journal says, the cats wait by its entrances, and the tokens follow:
   - **The Okafors' Big Box**: two floors side by side; Mrs Okafor in the hall, Tayo in the living room, Noodle asleep in the kitchen; a cat can wait by the garage side door (right of the garage) and the bathroom window (left of the upstairs).
   - **Grandpa Wendell's Catnip Mouse**: three floors (the cellar on the right); Grandpa in the hall, June in the kitchen, Pom-Pom and the robot vacuum in the living room. Big Biscuit never waits at the Tight cellar window.
   - **The Birthday Cake**: Dad in the kitchen, Aunt Rosalind and Captain in the dining room, Mia and Leo in the living room; the cats outside the front door, the patio door and the utility window.
   - **Chef Marchetti's Salmon**: Chef in the kitchen, Sam in the hall, Brutus in the utility room, the vacuum in the living room; a cat can wait on the roof above the skylight (the dashed square on the landing).
14. Players' own cats: GM, make a cat (or have Lena make one), then **Play a ready-made game** at any house: it is listed under **Bringing their own cats?** Tick it and untick a ready-made cat. *See:* it gets a token outside with the others and is in the robbery.

## What to report

For anything unexpected: the step number, what you did, what you saw, and a screenshot of the tracker and the console. Rules questions (the automation read a rule differently from you) are just as useful as bugs: the readings it uses are listed in `docs/AUTOMATION.md` → Implementation notes.

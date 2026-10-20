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
3. Lena: on the card, *see* **Push (1 Cattitude)**, **Push (+1 Mood)** and **Accept**; the GM window shows **Accept** and **Not seen** instead. Lena clicks **Accept**. *See:* the card says "Applied to the robbery"; on a Scrape or Clean, Velvet is in the hall and **Cuddle** shows 1/4; the front door is now shut (only one cat gets in).
4. GM: under Mags, click **In through the Cat flap in the back door**. *See:* Mags is in the utility room; the room shows "Noise here this round".
5. Lena: under Tilly, click **Help Big Biscuit**. *See:* "Will help Big Biscuit" under Tilly.
6. GM: under Biscuit, click **Roll: In through the Open kitchen window (up the bins)**. *See:* the dialog lists Tilly as a helper, already ticked. Roll **Savage**.
7. GM: if it's a Flop, click **Push (1 Cattitude)**. *See:* the non-6 dice are rerolled, Biscuit's Cattitude drops to 1, and the card is final at once. On a success, both Biscuit **and Tilly** are in the kitchen.
8. GM: **End round** → confirm. *See:* a "The house's turn" card: Pudding barks (a cat is in the kitchen), Mr Pell comes to see the noise in the utility room (the cat flap was the first noise), and the dice he rolled if any. Pudding does **not** chase Biscuit and Tilly out: they climbed in, so they had no Action left, and they deal with him first thing next turn.
9. GM (optional, the dog's chase): in a later round, move a cat that still has its Action into a room with an awake dog and **End round** without rolling against the dog. *See:* "… chases … back into the …" on the house-turn card, before the pets move.

## 4. Round 2: the Prize Clock, a temptation, the Mood

1. GM: **Begin round**. *See:* "Mr Pell puts the rotisserie chicken in the kitchen and stays there this round, answering no noise (2 steps to get at it)"; his badge in the tracker says "Stays with the prize: answers no noise this round"; and a **whispered** "Temptation" card (only the GM sees it) with one-click **Tempt …** buttons.
2. GM: click **Tempt Velvet: …** if offered, else any cat of Lena's. *See:* a public temptation card. Lena *sees* **Give in (+1 Cattitude)** and **Resist (1 Cattitude)**; every other cat's buttons in the tracker say they wait ("… is tempted and goes first").
3. Lena: **Resist**. *See:* that cat's Cattitude −1; the card says "Resisted".
4. GM: in the tracker header, click Broom **+1** three times. *See:* Broom 3/4.
5. GM: make a roll Mr Pell can see that fills Broom — e.g. under Biscuit (in the kitchen with Mr Pell) **Roll: Deal with Pudding**, Savage, and **Accept**. *See:* on a success Pudding is driven off; then, because Broom reached 4, a **Shoo!** card: Mr Pell chases Biscuit out of the kitchen window (the nearest entrance that works this round: the front door only works in round 1), shuts it and stays in the kitchen; Broom 0, **Patience 3**. Biscuit is outside; the window shows SHUT.
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
5. *See:* when the prize is out and no free cat is inside, the round's end posts **Clean Getaway** (or Messy). GM: click **Give the gang +1 Rep (campaign)** → each cat's Rep is 1.
6. If a cat was left inside, its owner sees **…: spend a Life to escape** on the outcome card; clicking it takes one Life.

## 6. Core rules v0.8 on other houses

1. **The parrot remembers (The Birthday Cake).** GM: start a robbery at **The Birthday Cake** and **Begin round**; move Aunt Rosalind to the living room (**Move:**). Lena: under Velvet, **In through the Patio door, ajar** (no roll), then **Hide**. *See:* in the dining room, Captain the parrot's line says "saw a cat this round: squawks in the Pets step", although Velvet is now hidden. GM: **End round**. *See:* "Captain the parrot squawks (it saw a cat earlier this round)"; Dad, who put the cake down this round, stays with it ("the Prize Clock's hold"), so somebody else comes to the dining room.
2. **The cake wobbles** (optional, if you play on until a cat carries the cake): *See:* **Roll: Haul the birthday cake …** offers Sneaky and Savage, both **Tricky**.
3. **A meter that waits (any house).** GM: with a human **Distracted** in a room where a cat stands unhidden, click Broom **+1** until it is full. *See:* no Shoo! yet; the tracker's log says "Broom is full, but nobody with free hands can see a cat: it stays full, and as soon as someone can, they act at once", and the header says so too. GM: **End round**. *See:* as the house's turn starts the human looks round: "Broom was waiting full: … can see … and acts at once", then the Shoo! card.
4. **Out and back in.** Lena: send a cat out through an entrance that needs no roll (Number 12's cat flap). *See:* its **In through …** buttons now say "it went out this turn: back in next round".
5. **Dozing (Grandpa Wendell's Catnip Mouse).** GM: play a few rounds. *See:* when Grandpa nods off, the next house's turn says "Grandpa Wendell is asleep and stays put" (no routine roll for him). To try the Prize Clock's wake-up, put him to sleep from the console before round 4 begins: `game.catBurglars.robbery.overrides.patch("wendell", { asleepUntil: 4 })`, then **Begin round**. *See:* "Grandpa Wendell wakes up: there's the catnip mouse to see to", and he moves the mouse to the living room.
6. **Chased back out (The Okafors' Big Box).** GM: wake Noodle (console: `game.catBurglars.robbery.overrides.patch("noodle", { mode: "awake" })`). Lena: a cat comes in through the **Dog door** and does nothing else. GM: **End round**. *See:* "Noodle chases … back out through the Dog door: it only just came in!" — the cat is outside again.

## 7. The Storyteller away

1. GM: start a new robbery (any house), **Begin round**.
2. GM: close the GM window (log out).
3. Lena: make a roll from the tracker and **Accept** it. Try a Move button. *See:* the roll card stays "Final — waiting for the Storyteller's client"; the Move warns "The Storyteller isn't connected — nothing was changed."
4. GM: log back in. *See:* a notification "applied 1 roll made while the Storyteller was away"; the roll's effect and Mood are in the tracker.

## 8. Switching automations off

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
| Spend and earn Cattitude | off | Pushes, dice, giving in and Purrfects don't change any sheet |
| Run the Prize Clock | off | Begin round doesn't put the prize down or take it away (and nobody is held by it: noise draws everyone) |
| End the robbery by itself | off | No outcome card; end it with **End the robbery** |
| Players can open the tracker | off | Lena's tracker button warns that the Storyteller keeps it |

## What to report

For anything unexpected: the step number, what you did, what you saw, and a screenshot of the tracker and the console. Rules questions (the automation read a rule differently from you) are just as useful as bugs: the readings it uses are listed in `docs/AUTOMATION.md` → Implementation notes.

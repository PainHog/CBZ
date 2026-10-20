# Testing the Foundry system by hand (two clients)

There is no live Foundry in the cloud, so the automated tests run on a fake Foundry (`tools/fake-foundry.mjs`). This script checks the same things in **real Foundry v13** with two browser windows: you as the **Storyteller (GM)** and one **player**. It takes about 30 minutes. Each step says what you should see; if you see something else, note the step number, what happened, and any red error in the browser console (F12).

## 0. Set up (once)

1. Install the system: in Foundry's setup screen, **Game Systems → Install System**, paste the manifest URL
   `https://github.com/PainHog/CBZ/releases/latest/download/system.json`
   (or copy this repository's folder to `Data/systems/cat-burglars`).
2. Create a world with the **Cat Burglars** system and launch it.
3. **Game Settings → Users**: add a player called **Lena** (role Player). Open a second browser (or a private window) at the same address and log in as Lena. From now on, **GM** means your first window and **Lena** the second.
4. GM: open **Compendium Packs → Cat Burglars → The Ready-Made Gang**. Import **Two-Bin Tilly**, **Big Biscuit**, **Velvet** and **Marmalade Mags**.
5. GM: right-click Velvet and Tilly → **Configure Ownership** → Lena: Owner. Biscuit and Mags stay yours (you play them for the "second player").
6. GM: **Configure Settings → System Settings**: leave every Cat Burglars setting at its default for now.

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

1. GM: **Begin round**. *See:* "Mr Pell puts the rotisserie chicken in the kitchen and stays there this round (2 steps to get at it)", and a **whispered** "Temptation" card (only the GM sees it) with one-click **Tempt …** buttons.
2. GM: click **Tempt Velvet: …** if offered, else any cat of Lena's. *See:* a public temptation card. Lena *sees* **Give in (+1 Cattitude)** and **Resist (1 Cattitude)**; every other cat's buttons in the tracker say they wait ("… is tempted and goes first").
3. Lena: **Resist**. *See:* that cat's Cattitude −1; the card says "Resisted".
4. GM: in the tracker header, click Broom **+1** three times. *See:* Broom 3/4.
5. GM: make a roll Mr Pell can see that fills Broom — e.g. under Biscuit (in the kitchen with Mr Pell) **Roll: Deal with Pudding**, Savage, and **Accept**. *See:* on a success Pudding is driven off; then, because Broom reached 4, a **Shoo!** card: Mr Pell chases Biscuit out of the kitchen window and shuts it; Broom 0, **Patience 3**. Biscuit is outside; the window shows SHUT.
6. GM: undo it: **Undo last Mood change**. *See:* Biscuit is back in the kitchen, the window open, Broom 4/4. Click **Undo** once more to remove the roll's own step too, if you like.
7. Lena: under Tilly, **Roll: Get at the rotisserie chicken: step 1 of 2**. On the card, GM clicks **Not seen**, then **Seen** again. *See:* the badge flips each time; then Lena **Accept**s. *See:* "Step 1 of 2 done".
8. GM: **End round**. *See:* noise answered, routines rolled with their d6 shown, and at the end "Finding it": anyone beside the chicken now that a step is done finds it disturbed: +1 Broom, and starts **Searching** (the badge appears on Mr Pell).
9. GM: **Begin round**. *See:* the whispered Temptation card doesn't offer the cat you tempted last round.
10. GM (the Storyteller's pick): with Mr Pell Searching beside the chicken, leave two cats unhidden in his room, bring Broom to one short of full with **+1**, and **End round**. *See:* "Finding it" adds +1 Broom (a Searching human can see a cat), and because two cats are in sight a **whispered** card "Broom is full — The Storyteller's pick" offers **Mr Pell chases out …** for each of them; the tracker header shows the same buttons (Lena sees only the sentence). Click one. *See:* the Shoo! card for that cat; the other stays. **Undo last Mood change** brings the cat back and the buttons return.

## 5. Rounds 3+: carrying it out

1. Get the chicken down (step 2), then pick it up: a Medium prize needs Biscuit (Chonky) alone, or two cats — have Velvet click **Help Two-Bin Tilly**, then Tilly **Pick up the rotisserie chicken**.
2. *See:* moving it is now **Roll: Haul the rotisserie chicken to the …** even when nobody watches; the other carrier is ticked as a helper and can't be unticked.
3. Haul it to the utility room and out of the cat flap (the kitchen window is a climb: "Small things only").
4. *See:* when the prize is out and no free cat is inside, the round's end posts **Clean Getaway** (or Messy). GM: click **Give the gang +1 Rep (campaign)** → each cat's Rep is 1.
5. If a cat was left inside, its owner sees **…: spend a Life to escape** on the outcome card; clicking it takes one Life.

## 6. The Storyteller away

1. GM: start a new robbery (any house), **Begin round**.
2. GM: close the GM window (log out).
3. Lena: make a roll from the tracker and **Accept** it. Try a Move button. *See:* the roll card stays "Final — waiting for the Storyteller's client"; the Move warns "The Storyteller isn't connected — nothing was changed."
4. GM: log back in. *See:* a notification "applied 1 roll made while the Storyteller was away"; the roll's effect and Mood are in the tracker.

## 7. Switching automations off

In **Configure Settings**, try each and check the "Off" behaviour:

| Setting | Set to | You should see |
|---|---|---|
| Automatic Mood | Confirm each change | Rolls don't move the meters; the tracker lists them with **Apply** / **Drop** |
| Fill in who sees a roll | off | The dialog's Seen defaults to "Not seen" and Attention to 0 |
| Rolls change the house | off | A working roll doesn't move the cat or open the door; the card says the Storyteller applies it by hand; use the tracker's **Put:** selects |
| The house's turn | Ask first / Run at once / By hand | End round asks / doesn't ask / only ends the round (nobody moves) |
| Roll routines | off | The house's turn moves nobody by routine (noise still draws humans) |
| Temptation | No prompt / Tempt at random | No whispered card / a random cat is tempted at Begin round |
| Spend and earn Cattitude | off | Pushes, dice, giving in and Purrfects don't change any sheet |
| Run the Prize Clock | off | Begin round doesn't put the prize down or take it away |
| End the robbery by itself | off | No outcome card; end it with **End the robbery** |
| Players can open the tracker | off | Lena's tracker button warns that the Storyteller keeps it |

## What to report

For anything unexpected: the step number, what you did, what you saw, and a screenshot of the tracker and the console. Rules questions (the automation read a rule differently from you) are just as useful as bugs: the readings it uses are listed in `docs/AUTOMATION.md` → Implementation notes.

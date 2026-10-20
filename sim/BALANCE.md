# Cat Burglars — balance (core rules v0.8)

**Adopted: package P10** (the defaults in `sim/params.mjs`; `docs/CORE-RULES.md` v0.8 describes it). The first tables run P9 (v0.7's rules) and P10 on today's houses; older studies follow.

## Short version
- **Gang of 4: Easy 90.3%, Standard 75.3%, Hard 57.9%** (targets ~90 / ~75 / 55–60). All three on target.
- **Gang-size parity within 7 points:** three cats 87.9 / 68.6 / 55.8, five cats 96.8 / 75.8 / 53.0 (five cats: Patience −1 only since the last v0.8 change; with the Clock a round sooner as well they ran 50.7 at Hard, 7 points behind four).
- **About 12 rolls a robbery**; Flops 15.5%, Purrfects 5.6%, temptations given in to 82%, 83% of cats spend at least half their Cattitude, a cat is Held or Shooed in 57% of Standard robberies, a cat is left behind in 3.5% of Easy and 15% of Hard robberies.
- **What v0.8 changed** (playtests at Grandpa Wendell's with five cats, and the cake with the ready-made gang): the human who puts the prize down stays with it that round, deaf to noise; any cat in the room may help a haul; the cake wobbles (Tricky to haul); owners' routines visit the prize's room. Three of four recent playtests were won by a free round-1 lure that pulled the owner off the prize; the simulated gang under-uses lures, so the simulator's earlier estimate of this rule's cost (8–12 points, v0.6) overstated it for real tables. Houses re-tuned (below).
- **Clean wins at Hard are a choice, not a wall.** A gang that eats where the food sits (the simulator's default, the policy that wins most) gets a Clean Getaway in 15% of its Hard wins. A gang that plays for the whole prize (`foodPolicy: smart`: carry it while more than 2 portions are left) gets one in **35%** of its wins at the cake (15.2 clean in 43.3 won) and **34%** at the Marchettis (16.1 in 47.0), but wins 11–16 points less often. The target now reads "≥ ⅓ when the gang plays for it" (`docs/DESIGN.md`).

| Hard house, gang of 4 | eat where it sits: win · clean | play for the whole prize: win · clean | carry everything out: win · clean |
|---|---|---|---|
| The Birthday Cake | 58.9 · 4.8 | 43.3 · 15.2 | 32.3 · 30.9 |
| Chef Marchetti's Salmon | 57.0 · 13.5 | 47.0 · 16.1 | 26.9 · 20.9 |

`node sim/run.mjs --runs 2000 --seed 1 --house birthday-cake --set foodPolicy=smart` (and `marchetti-salmon`; `eat`, `smart`, `carry`).
- **Caveat:** the gang plays by simple policies (`sim/NOTES.md`), not by real players; each round of playtests has found a line the policies miss. Treat ±5 points as noise from the policy, and expect sharp players to beat these numbers.

## How the rules got here
| Step | What changed | Why (what the simulator showed) |
|---|---|---|
| v0.1 → P1 | One two-ended Mood track became **two meters** (Broom, Cuddle) | Traces showed one cat's Sweet steps cancelling another cat's Broom steps: a single charmer made the Mood sit at Calm, and Hard houses won ~100%. |
| | **Every Action in view is a roll** | "Accept 1 step" for simple actions meant almost nothing was rolled under a human's nose. |
| | **Zero dice:** keep the lower of two, no better than a Scrape | The v0.1 reading (one die, a 6 is a Scrape) worked 50% of the time at −1 dice. |
| | **Distraction lasts this round** (was this and next) | Two rounds per Sweet roll let four cats eat an 8-portion cake under a watching human. |
| | Front door lets in **one** cat; **meow to be let out** | Every cat was walking in behind the human with a Sweet roll; chonky cats got stuck inside with no exit. |
| | Prize starts in the human's arms; spots take steps; carrying past a human is a roll | The prize fell into the gang's paws in round 1, in one roll. |
| P1 → P3 | **Repeat distractions −1 die**; **Attention resists Sweet**; **+1 Broom for a mess or a disturbed prize** | Easy was unlosable: one human could be distracted or lured away every round at no cost. |
| P3 → P4 | **Gang-size scaling** (3 cats: Patience +1, Clock +1; 5 cats: Clock −1) and **food portions per cat** | Gangs of 3 and 5 differed by 25–40 points. |
| P4 → P5 | **Lives become campaign-only** | Spending a Life sent a cat outside, which cost the gang more than being Held, and it made adoption almost never happen (3% at Hard). |
| P5 → P6 | **Cattitude also buys +1 die** | Cattitude was hoarded (41% of cats spent half; target ≥ 50%). |
| P6 → P7 | **Searching**; the owner fetches a prize the cats already have; pet routines; dogs confront on entry; reopen shut entrances | The box playtest won with no rolls by staging the prize in a room no routine visits: waiting was free. Standard fell 89 → 76 on the old houses' numbers, so two houses were re-tuned. |
| P7 → P8 | **Hauling** (moving a Medium or Large prize is a roll, seen or not); **carriers can't hide**; **finding it** at the end of the House phase (a human beside a disturbed prize notices; +1 Broom once a round); **Searching goes for the prize first**; **+1 Broom when a Searching human can see a cat**; messes wait to be found; a driven-off dog is back after 3 rounds counting this one; a failed pet roll chases the cat back; stronger gang scaling | Verification playtests: the box was won with 0 cat rolls by hiding with it and steering Searchers with a decoy; Number 12 (5 cats) was won with every roll under one Distraction, because a human already beside the prize never "walked in" on it. P8 cut every label 3–15 points, so the houses were re-tuned. Making the human who puts the prize down deaf to noise was tried and dropped: it cost 8–12 points and took away the gang's one answer to the Clock round. |
| P8 → P9 | **Holders still see**; **eating is a roll**; **temptation rotates** (never the same cat two rounds running); haul noise where the prize ends up; hauling out of a dog's room is leaving; Knocker's knack on hauls; loitering in a dog's room is chased out | Salmon playtest: a Scooped cat blinded its holder while four portions were eaten beside him, and five portions cost no rolls; both playtests ran out of temptations in the room where the gang waited. Box playtest: a bark lured the Searcher off the box. |
| P9 → P10 | **The Prize Clock's hold beats noise** (the human who puts the prize down stays with it that round); **any cat helps a haul**; a house can make hauling Tricky; **five cats: Patience −1 only** (the Clock no longer moves for five) | Wendell and cake playtests (and Number 12 before them) were won by a free round-1 lure. Five cats ran 7 points behind four at Hard; Patience −1 alone brings them within 5 (96.8 / 75.8 / 53.0). |
| houses (v0.8) | Number 12: gone on round 10. Cake: Patience 6; Dad's routine visits the kitchen and dining room twice each; hauling the cake is Tricky. Wendell: Grandpa's routine visits the hall twice, June's reaches the landing. Marchettis: gone on round 8. | Back on target after P10. |
| houses (v0.7) | Number 12: gone on round 9. Box: Patience 7 (gone 13). Cake: Patience 5. Salmon: Patience 6, gone on round 7; the chef's routine is 1–5 Kitchen, 6 Hall (was "stays put", which stranded her in the hall); the dog door is noisy; the vacuum reaches the kitchen. | Back on target after P9. |
| houses (v0.6) | Number 12: chicken gone on round 8. Box: Patience 8, gone on round 13. Mouse: Patience 7, gone on round 9. Cake: Patience 4. Salmon: Patience 5, gone on round 9. | Back on target after P8. |
| houses (v0.5) | Number 12: a dog, a 7-round clock, a closed utility door. Box: Patience 6, moved on round 5, gone on round 11. Mouse: Patience 6, moved on round 4, gone on round 11. Cake: gone on round 8. Chef: busy cooking, deaf to noise. | Each label now plays as labelled. |

Targets revised (see `docs/DESIGN.md`): Purrfects 2–6% (two 6s are rare with small pools), and Clean share of Hard wins ≥ ⅓ when the gang plays for the whole prize.

## Today's houses: v0.7 rules (P9) against v0.8 rules (P10)

`node sim/packages.mjs --runs 3000 --seed 1 --packages P9,P10`

### Gang of 4 against the targets

| | Easy | Standard | Hard | Clean share Easy / Hard | Caught ≥1 (Std) | Left behind Easy / Hard | Flop | Purrfect | Gave in | Spend ≥ ½ Cattitude | Rolls | Rounds |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **target** | ~90 | ~75 | 55–60 | ≥ 75 / ≥ 33 | ≥ 50 | ≤ 5 / ≥ 10 | 15–25 | 2–6 | ≥ 40 | ≥ 50 | — | — |
| P9 | 91.7 | 73.0 | 67.1 | 88 / 19 | 57.3 | 2.8 / 15.9 | 15.4 | 5.5 | 82.3 | 83.0 | 12.4 | 8.7 |
| P10 | 90.3 | 75.3 | 57.9 | 81 / 15 | 57.4 | 3.5 / 15.1 | 15.5 | 5.6 | 82.1 | 82.8 | 12.3 | 8.8 |

### Gang size (win % Easy / Standard / Hard)

| package | 3 cats | 4 cats | 5 cats |
|---|---|---|---|
| P9 | 88.5 / 68.1 / 61.8 | 91.7 / 73.0 / 67.1 | 96.8 / 72.0 / 61.4 |
| P10 | 87.9 / 68.6 / 55.8 | 90.3 / 75.3 / 57.9 | 96.8 / 75.8 / 53.0 |

### Per house, gang of 4 (win · clean · busted · left behind)

| house | label | P9 | P10 |
|---|---|---|---|
| The Chicken at Number 12 | easy | 91.7 · 80.3 · 8.3 · 2.8 | 90.3 · 72.7 · 9.7 · 3.5 |
| The Okafors' Big Box | standard | 71.6 · 71.2 · 28.4 · 9.4 | 77.6 · 77.3 · 22.4 · 7.0 |
| Grandpa Wendell's Catnip Mouse | standard | 74.4 · 72.3 · 25.6 · 11.3 | 73.0 · 70.2 · 27.0 · 10.5 |
| The Birthday Cake | hard | 78.2 · 12.3 · 21.8 · 18.4 | 59.9 · 5.1 · 40.1 · 16.7 |
| Chef Marchetti's Salmon | hard | 55.9 · 12.8 · 44.1 · 13.4 | 55.9 · 12.8 · 44.1 · 13.4 |

## Earlier study: v0.6 rules (P8) against v0.7 rules (P9), on the v0.7 houses

`node sim/packages.mjs --runs 3000 --seed 1 --packages P8,P9`

### Gang of 4 against the targets

| | Easy | Standard | Hard | Clean share Easy / Hard | Caught ≥1 (Std) | Left behind Easy / Hard | Flop | Purrfect | Gave in | Spend ≥ ½ Cattitude | Rolls | Rounds |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **target** | ~90 | ~75 | 55–60 | ≥ 75 / ≥ 33 | ≥ 50 | ≤ 5 / ≥ 10 | 15–25 | 2–6 | ≥ 40 | ≥ 50 | — | — |
| P8 | 94.1 | 72.9 | 66.5 | 93 / 20 | 61.0 | 2.5 / 19.1 | 16.4 | 4.9 | 82.2 | 78.1 | 10.4 | 8.3 |
| P9 | 89.4 | 72.3 | 56.1 | 81 / 10 | 59.5 | 5.0 / 21.3 | 15.3 | 5.5 | 82.1 | 82.8 | 11.9 | 8.5 |

### Gang size (win % Easy / Standard / Hard)

| package | 3 cats | 4 cats | 5 cats |
|---|---|---|---|
| P8 | 89.9 / 67.3 / 65.4 | 94.1 / 72.9 / 66.5 | 97.3 / 72.5 / 63.3 |
| P9 | 86.5 / 68.0 / 56.3 | 89.4 / 72.3 / 56.1 | 95.7 / 70.5 / 52.2 |

### Per house, gang of 4 (win · clean · busted · left behind)

| house | label | P8 | P9 |
|---|---|---|---|
| The Chicken at Number 12 | easy | 94.1 · 87.2 · 5.9 · 2.5 | 89.4 · 72.4 · 10.6 · 5.0 |
| The Okafors' Big Box | standard | 68.0 · 66.9 · 32.0 · 9.5 | 71.0 · 70.7 · 29.0 · 9.8 |
| Grandpa Wendell's Catnip Mouse | standard | 77.9 · 74.4 · 22.1 · 11.7 | 73.6 · 70.9 · 26.4 · 12.9 |
| The Birthday Cake | hard | 77.0 · 17.0 · 23.0 · 22.7 | 63.8 · 5.2 · 36.2 · 24.1 |
| Chef Marchetti's Salmon | hard | 56.0 · 9.6 · 44.0 · 15.4 | 48.4 · 6.5 · 51.6 · 18.5 |

## Earlier study: v0.5 rules (P7) against v0.6 rules (P8), on the v0.6 houses

`node sim/packages.mjs --runs 3000 --seed 1 --packages P7,P8`

### Gang of 4 against the targets

| | Easy | Standard | Hard | Clean share Easy / Hard | Caught ≥1 (Std) | Left behind Easy / Hard | Flop | Purrfect | Gave in | Spend ≥ ½ Cattitude | Rolls | Rounds |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **target** | ~90 | ~75 | 55–60 | ≥ 75 / ≥ 33 | ≥ 50 | ≤ 5 / ≥ 10 | 15–25 | 2–6 | ≥ 40 | ≥ 50 | — | — |
| P7 | 94.6 | 81.6 | 71.0 | 93 / 38 | 44.9 | 3.3 / 17.7 | 17.3 | 4.5 | 78.8 | 75.7 | 9.3 | 8.7 |
| P8 | 91.5 | 76.1 | 58.2 | 85 / 26 | 57.0 | 4.1 / 16.0 | 16.5 | 4.8 | 80.1 | 77.6 | 10.0 | 8.6 |

### Gang size (win % Easy / Standard / Hard)

| package | 3 cats | 4 cats | 5 cats |
|---|---|---|---|
| P7 | 88.0 / 71.7 / 66.1 | 94.6 / 81.6 / 71.0 | 97.7 / 88.4 / 77.9 |
| P8 | 88.5 / 69.8 / 64.1 | 91.5 / 76.1 / 58.2 | 95.1 / 78.3 / 53.3 |

### Per house, gang of 4 (win · clean · busted · left behind)

| house | label | P7 | P8 |
|---|---|---|---|
| The Chicken at Number 12 | easy | 94.6 · 87.6 · 5.4 · 3.3 | 91.5 · 77.8 · 8.5 · 4.1 |
| The Okafors' Big Box | standard | 80.2 · 77.1 · 19.8 · 7.6 | 74.3 · 73.2 · 25.7 · 8.0 |
| Grandpa Wendell's Catnip Mouse | standard | 82.9 · 77.6 · 17.1 · 13.2 | 77.9 · 74.4 · 22.1 · 11.7 |
| The Birthday Cake | hard | 70.3 · 13.3 · 29.7 · 24.2 | 54.2 · 8.1 · 45.8 · 21.5 |
| Chef Marchetti's Salmon | hard | 71.8 · 40.7 · 28.2 · 11.2 | 62.1 · 22.3 · 37.9 · 10.6 |

## Earlier study (the v0.5 houses)

`node sim/packages.mjs --runs 3000 --seed 1 --packages P1,P3,P5,P6,P7`

Each package runs every house with gangs of 3, 4 and 5 cats on the same gangs and dice. Win = Clean or Messy Getaway.

### Gang of 4 against the targets

| | Easy | Standard | Hard | Clean share Easy / Hard | Caught ≥1 (Std) | Left behind Easy / Hard | Flop | Purrfect | Gave in | Spend ≥ ½ Cattitude | Rolls | Rounds |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **target** | ~90 | ~75 | 55–60 | ≥ 75 / ≥ 33 | ≥ 50 | ≤ 5 / ≥ 10 | 15–25 | 2–6 | ≥ 40 | ≥ 50 | — | — |
| P1 | 92.1 | 94.6 | 61.4 | 91 / 47 | 18.1 | 0.8 / 1.8 | 11.1 | 4.6 | 71.5 | 31.1 | 7.5 | 8.1 |
| P3 | 89.0 | 87.8 | 52.6 | 84 / 46 | 33.9 | 0.7 / 2.5 | 17.4 | 2.7 | 67.1 | 40.9 | 7.5 | 8.4 |
| P5 | 91.1 | 88.6 | 53.7 | 86 / 41 | 33.9 | 4.6 / 19.5 | 19.4 | 2.5 | 68.0 | 43.0 | 8.3 | 8.7 |
| P6 | 92.5 | 88.8 | 59.6 | 88 / 42 | 33.0 | 4.4 / 19.1 | 15.9 | 4.8 | 75.1 | 73.8 | 8.1 | 8.7 |
| P7 | 92.2 | 75.9 | 56.0 | 85 / 40 | 53.9 | 5.6 / 15.6 | 16.7 | 4.7 | 74.4 | 75.9 | 8.6 | 9.0 |

### Gang size (win % Easy / Standard / Hard)

| package | 3 cats | 4 cats | 5 cats |
|---|---|---|---|
| P1 | 76.4 / 84.7 / 44.5 | 92.1 / 94.6 / 61.4 | 97.8 / 96.7 / 68.2 |
| P3 | 69.8 / 74.5 / 35.4 | 89.0 / 87.8 / 52.6 | 96.7 / 92.5 / 60.7 |
| P5 | 85.3 / 80.2 / 53.1 | 91.1 / 88.6 / 53.7 | 94.7 / 92.3 / 60.5 |
| P6 | 86.5 / 80.2 / 57.1 | 92.5 / 88.8 / 59.6 | 96.0 / 92.4 / 63.5 |
| P7 | 84.1 / 67.8 / 53.5 | 92.2 / 75.9 / 56.0 | 96.1 / 83.0 / 60.4 |

### Per house, gang of 4 (win · clean · busted · left behind)

| house | label | P1 | P3 | P5 | P6 | P7 |
|---|---|---|---|---|---|---|
| The Chicken at Number 12 | easy | 92.1 · 83.9 · 7.9 · 0.8 | 89.0 · 74.7 · 11.0 · 0.7 | 91.1 · 78.2 · 8.9 · 4.6 | 92.5 · 81.7 · 7.5 · 4.4 | 92.2 · 78.1 · 7.8 · 5.6 |
| The Okafors' Big Box | standard | 95.9 · 95.5 · 4.1 · 1.4 | 89.7 · 89.0 · 10.3 · 2.3 | 90.4 · 88.7 · 9.6 · 4.3 | 90.1 · 88.5 · 9.9 · 4.2 | 73.9 · 71.4 · 26.1 · 7.3 |
| Grandpa Wendell's Catnip Mouse | standard | 93.3 · 92.3 · 6.7 · 2.9 | 85.9 · 84.3 · 14.1 · 3.9 | 86.9 · 83.0 · 13.1 · 9.0 | 87.6 · 83.3 · 12.4 · 10.1 | 77.9 · 72.8 · 22.1 · 13.8 |
| The Birthday Cake | hard | 64.8 · 15.5 · 35.2 · 0.6 | 49.3 · 8.5 · 50.7 · 1.5 | 49.8 · 7.1 · 50.2 · 22.9 | 59.6 · 10.3 · 40.4 · 22.1 | 55.9 · 8.7 · 44.1 · 21.3 |
| Chef Marchetti's Salmon | hard | 58.0 · 42.5 · 42.0 · 3.0 | 56.0 · 40.2 · 44.0 · 3.5 | 57.7 · 37.4 · 42.3 · 16.1 | 59.5 · 39.4 · 40.5 · 16.0 | 56.1 · 35.7 · 43.9 · 10.0 |

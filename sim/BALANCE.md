# Cat Burglars — balance (core rules v0.5)

**Adopted: package P7** (the defaults in `sim/params.mjs`; `docs/CORE-RULES.md` v0.5 describes it). All rows use today's houses, so P1–P6 show what each earlier rule set would score on them.

## Short version
- **Gang of 4: Easy 92%, Standard 76%, Hard 56%** (targets ~90 / ~75 / 55–60). All three on target.
- **Hits:** Flops 17% of rolls, Purrfects 5%, temptations given in to 74% of the time, 76% of cats spend at least half their Cattitude, a cat gets Held or Shooed in 54% of Standard robberies, and a cat is left behind (adopted) in 16% of Hard robberies.
- **Misses, still open:**
  - **Left behind at Easy is 5.6%,** just over the ≤ 5% cap.
  - **Gang-size parity is ~±8 points, not ±5.** Three cats lose ~8 at Easy and Standard (the Large box needs all three to carry it); five cats gain ~4–7.
  - **About 8–9 rolls per robbery over ~9 rounds.** Both playtests found play thin (3 and 0 cat rolls). v0.5's Searching rule and the added Number 12 door are the first answer; the verification playtests will say whether it's enough.
- **Caveat:** the gang plays by simple policies (`sim/NOTES.md`), not by real players. Several house results moved 10–20 points when the policy got smarter, so treat ±5 points as noise from the policy.

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
| houses | Number 12: a dog, a 7-round clock, a closed utility door. Box: Patience 6, moved on round 5, gone on round 11. Mouse: Patience 6, moved on round 4, gone on round 11. Cake: gone on round 8. Chef: busy cooking, deaf to noise. | Each label now plays as labelled. |

Targets revised (see `docs/DESIGN.md`): Purrfects 2–6% (two 6s are rare with small pools), and Clean share of Hard wins ≥ ⅓.

`node sim/packages.mjs --runs 3000 --seed 1 --packages P1,P3,P5,P6,P7`

Each package runs every house with gangs of 3, 4 and 5 cats on the same gangs and dice. Win = Clean or Messy Getaway.

## Gang of 4 against the targets

| | Easy | Standard | Hard | Clean share Easy / Hard | Caught ≥1 (Std) | Left behind Easy / Hard | Flop | Purrfect | Gave in | Spend ≥ ½ Cattitude | Rolls | Rounds |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **target** | ~90 | ~75 | 55–60 | ≥ 75 / ≥ 33 | ≥ 50 | ≤ 5 / ≥ 10 | 15–25 | 2–6 | ≥ 40 | ≥ 50 | — | — |
| P1 | 92.1 | 94.6 | 61.4 | 91 / 47 | 18.1 | 0.8 / 1.8 | 11.1 | 4.6 | 71.5 | 31.1 | 7.5 | 8.1 |
| P3 | 89.0 | 87.8 | 52.6 | 84 / 46 | 33.9 | 0.7 / 2.5 | 17.4 | 2.7 | 67.1 | 40.9 | 7.5 | 8.4 |
| P5 | 91.1 | 88.6 | 53.7 | 86 / 41 | 33.9 | 4.6 / 19.5 | 19.4 | 2.5 | 68.0 | 43.0 | 8.3 | 8.7 |
| P6 | 92.5 | 88.8 | 59.6 | 88 / 42 | 33.0 | 4.4 / 19.1 | 15.9 | 4.8 | 75.1 | 73.8 | 8.1 | 8.7 |
| P7 | 92.2 | 75.9 | 56.0 | 85 / 40 | 53.9 | 5.6 / 15.6 | 16.7 | 4.7 | 74.4 | 75.9 | 8.6 | 9.0 |

## Gang size (win % Easy / Standard / Hard)

| package | 3 cats | 4 cats | 5 cats |
|---|---|---|---|
| P1 | 76.4 / 84.7 / 44.5 | 92.1 / 94.6 / 61.4 | 97.8 / 96.7 / 68.2 |
| P3 | 69.8 / 74.5 / 35.4 | 89.0 / 87.8 / 52.6 | 96.7 / 92.5 / 60.7 |
| P5 | 85.3 / 80.2 / 53.1 | 91.1 / 88.6 / 53.7 | 94.7 / 92.3 / 60.5 |
| P6 | 86.5 / 80.2 / 57.1 | 92.5 / 88.8 / 59.6 | 96.0 / 92.4 / 63.5 |
| P7 | 84.1 / 67.8 / 53.5 | 92.2 / 75.9 / 56.0 | 96.1 / 83.0 / 60.4 |

## Per house, gang of 4 (win · clean · busted · left behind)

| house | label | P1 | P3 | P5 | P6 | P7 |
|---|---|---|---|---|---|---|
| The Chicken at Number 12 | easy | 92.1 · 83.9 · 7.9 · 0.8 | 89.0 · 74.7 · 11.0 · 0.7 | 91.1 · 78.2 · 8.9 · 4.6 | 92.5 · 81.7 · 7.5 · 4.4 | 92.2 · 78.1 · 7.8 · 5.6 |
| The Okafors' Big Box | standard | 95.9 · 95.5 · 4.1 · 1.4 | 89.7 · 89.0 · 10.3 · 2.3 | 90.4 · 88.7 · 9.6 · 4.3 | 90.1 · 88.5 · 9.9 · 4.2 | 73.9 · 71.4 · 26.1 · 7.3 |
| Grandpa Wendell's Catnip Mouse | standard | 93.3 · 92.3 · 6.7 · 2.9 | 85.9 · 84.3 · 14.1 · 3.9 | 86.9 · 83.0 · 13.1 · 9.0 | 87.6 · 83.3 · 12.4 · 10.1 | 77.9 · 72.8 · 22.1 · 13.8 |
| The Birthday Cake | hard | 64.8 · 15.5 · 35.2 · 0.6 | 49.3 · 8.5 · 50.7 · 1.5 | 49.8 · 7.1 · 50.2 · 22.9 | 59.6 · 10.3 · 40.4 · 22.1 | 55.9 · 8.7 · 44.1 · 21.3 |
| Chef Marchetti's Salmon | hard | 58.0 · 42.5 · 42.0 · 3.0 | 56.0 · 40.2 · 44.0 · 3.5 | 57.7 · 37.4 · 42.3 · 16.1 | 59.5 · 39.4 · 40.5 · 16.0 | 56.1 · 35.7 · 43.9 · 10.0 |

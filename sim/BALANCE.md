# Cat Burglars — balance (core rules v0.4)

**Adopted: package P6** (the defaults in `sim/params.mjs`; `docs/CORE-RULES.md` v0.4 describes it). The tables below were re-run after the v0.4 playtest fixes (noise, the human staying with the prize, instinct effects, the parrot).

## Short version
- **Gang of 4: Easy 95%, Standard 77%, Hard 58%** (targets ~90 / ~75 / 55–60). Standard and Hard are on target; **Easy plays about 5 points easy.**
- **Hits:** Flops 16% of rolls, Purrfects 5%, temptations given in to 74% of the time, 74% of cats spend at least half their Cattitude, a cat gets Held or Shooed in about half of Standard robberies, and a cat is left behind (adopted) in 20% of Hard robberies and 3.5% of Easy ones.
- **Misses, still open:**
  - **Easy runs ~5 points easy (95%).** Every one-human tweak tried (shorter clock, Patience 4, a dog, a stiffer flap) left it at 94–98%.
  - **Gang-size parity is ~±10 points at Standard, not ±5.** Three cats lose ~10 at Standard (the Large box needs all three to carry it); five cats gain ~5. At Easy and Hard every size is within 4 points.
  - **About 8 rolls per robbery over ~9 rounds.** Many turns are moves and waits. The agent playtests should say whether that feels thin; if so, the houses need more obstacles on their routes.
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
| houses | Number 12: a dog and a 7-round clock. Box: moved on round 4, gone on round 10. Mouse: Patience 5, moved on round 4. Cake: gone on round 8. Chef: busy cooking, deaf to noise. | Each label now plays as labelled. |

Targets revised (see `docs/DESIGN.md`): Purrfects 2–6% (two 6s are rare with small pools), and Clean share of Hard wins ≥ ⅓.

`node sim/packages.mjs --runs 3000 --seed 1 --packages P1,P3,P5,P6`

Each package runs every house with gangs of 3, 4 and 5 cats on the same gangs and dice. Win = Clean or Messy Getaway.

## Gang of 4 against the targets

| | Easy | Standard | Hard | Clean share Easy / Hard | Caught ≥1 (Std) | Left behind Easy / Hard | Flop | Purrfect | Gave in | Spend ≥ ½ Cattitude | Rolls | Rounds |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **target** | ~90 | ~75 | 55–60 | ≥ 75 / ≥ 33 | ≥ 50 | ≤ 5 / ≥ 10 | 15–25 | 2–6 | ≥ 40 | ≥ 50 | — | — |
| P1 | 95.9 | 83.8 | 61.7 | 96 / 48 | 34.2 | 0.9 / 2.3 | 11.4 | 4.5 | 71.3 | 30.6 | 7.2 | 8.1 |
| P3 | 94.8 | 73.9 | 52.7 | 92 / 47 | 49.6 | 0.9 / 2.9 | 16.7 | 2.8 | 66.0 | 40.0 | 7.1 | 8.3 |
| P5 | 95.2 | 75.5 | 52.8 | 92 / 42 | 49.6 | 3.4 / 20.3 | 18.9 | 2.6 | 66.9 | 42.3 | 8.0 | 8.7 |
| P6 | 95.2 | 76.6 | 58.3 | 94 / 42 | 49.0 | 3.5 / 19.9 | 15.6 | 5.0 | 74.1 | 73.6 | 7.8 | 8.6 |

## Gang size (win % Easy / Standard / Hard)

| package | 3 cats | 4 cats | 5 cats |
|---|---|---|---|
| P1 | 91.3 / 68.6 / 45.5 | 95.9 / 83.8 / 61.7 | 98.7 / 89.1 / 67.8 |
| P3 | 86.7 / 53.7 / 36.2 | 94.8 / 73.9 / 52.7 | 97.6 / 80.4 / 61.2 |
| P5 | 92.5 / 66.8 / 53.4 | 95.2 / 75.5 / 52.8 | 96.2 / 80.7 / 59.6 |
| P6 | 93.1 / 67.0 / 57.4 | 95.2 / 76.6 / 58.3 | 97.2 / 81.4 / 62.3 |

## Per house, gang of 4 (win · clean · busted · left behind)

| house | label | P1 | P3 | P5 | P6 |
|---|---|---|---|---|---|
| The Chicken at Number 12 | easy | 95.9 · 91.9 · 4.1 · 0.9 | 94.8 · 87.1 · 5.2 · 0.9 | 95.2 · 88.0 · 4.8 · 3.4 | 95.2 · 89.3 · 4.8 · 3.5 |
| The Okafors' Big Box | standard | 81.5 · 80.8 · 18.5 · 3.2 | 71.6 · 70.7 · 28.4 · 4.5 | 73.1 · 71.4 · 26.9 · 7.3 | 73.5 · 71.7 · 26.5 · 6.7 |
| Grandpa Wendell's Catnip Mouse | standard | 86.0 · 84.9 · 14.0 · 3.3 | 76.2 · 75.0 · 23.8 · 4.8 | 78.0 · 74.0 · 22.0 · 12.7 | 79.6 · 74.7 · 20.4 · 13.5 |
| The Birthday Cake | hard | 64.8 · 15.5 · 35.2 · 0.6 | 49.3 · 8.5 · 50.7 · 1.5 | 49.8 · 7.1 · 50.2 · 22.9 | 59.6 · 10.3 · 40.4 · 22.1 |
| Chef Marchetti's Salmon | hard | 58.6 · 43.1 · 41.4 · 4.0 | 56.2 · 40.7 · 43.8 · 4.2 | 55.8 · 37.0 · 44.2 · 17.7 | 56.9 · 38.3 · 43.1 · 17.6 |

# Cat Burglars — balance (first simulation, core rules v0.3)

**Adopted: package P6** (the defaults in `sim/params.mjs`; `docs/CORE-RULES.md` v0.3 describes it).

## Short version
- **Gang of 4: Easy 95%, Standard 77%, Hard 60%** (targets ~90 / ~75 / 55–60). Standard and Hard are on target; **Easy plays about 5 points easy.**
- **Hits:** Flops 16% of rolls, Purrfects 5%, temptations given in to 75% of the time, 74% of cats spend at least half their Cattitude, a cat gets Held or Shooed in about half of Standard robberies, and a cat is left behind (adopted) in 22% of Hard robberies.
- **Misses, still open:**
  - **Easy runs ~5 points easy (95%).** Every one-human tweak tried (shorter clock, Patience 4, a dog, a stiffer flap) left it at 94–98%.
  - **Left behind at Easy is 5.3%,** just over the ≤ 5% cap.
  - **Gang-size parity is ~±9 points, not ±5.** Three cats lose ~9 at Standard (the Large box needs all three to carry it); five cats gain ~7 at Hard.
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
| P1 | 96.0 | 81.7 | 61.6 | 91 / 48 | 36.4 | 0.9 / 1.7 | 10.9 | 4.7 | 70.3 | 30.7 | 7.2 | 8.3 |
| P3 | 89.2 | 73.3 | 54.2 | 81 / 50 | 52.0 | 2.6 / 3.3 | 16.9 | 2.9 | 67.3 | 39.5 | 7.3 | 8.5 |
| P5 | 93.7 | 75.6 | 57.5 | 86 / 45 | 52.0 | 5.2 / 21.9 | 18.9 | 2.7 | 68.1 | 41.2 | 8.0 | 8.8 |
| P6 | 95.1 | 77.3 | 60.1 | 87 / 45 | 49.0 | 5.3 / 21.6 | 15.6 | 5.0 | 74.8 | 73.5 | 7.9 | 8.8 |

## Gang size (win % Easy / Standard / Hard)

| package | 3 cats | 4 cats | 5 cats |
|---|---|---|---|
| P1 | 87.2 / 67.2 / 45.0 | 96.0 / 81.7 / 61.6 | 99.0 / 85.7 / 70.6 |
| P3 | 78.5 / 57.0 / 38.1 | 89.2 / 73.3 / 54.2 | 97.6 / 78.8 / 62.3 |
| P5 | 91.6 / 68.5 / 55.0 | 93.7 / 75.6 / 57.5 | 96.3 / 80.8 / 63.9 |
| P6 | 92.9 / 68.4 / 56.3 | 95.1 / 77.3 / 60.1 | 97.9 / 81.8 / 67.0 |

## Per house, gang of 4 (win · clean · busted · left behind)

| house | label | P1 | P3 | P5 | P6 |
|---|---|---|---|---|---|
| The Chicken at Number 12 | easy | 96.0 · 87.6 · 4.0 · 0.9 | 89.2 · 72.6 · 10.8 · 2.6 | 93.7 · 80.3 · 6.3 · 5.2 | 95.1 · 82.7 · 4.9 · 5.3 |
| The Okafors' Big Box | standard | 80.5 · 80.2 · 19.5 · 2.5 | 70.1 · 69.4 · 29.9 · 4.7 | 72.3 · 70.9 · 27.7 · 7.6 | 75.4 · 73.6 · 24.6 · 6.9 |
| Grandpa Wendell's Catnip Mouse | standard | 82.9 · 81.8 · 17.1 · 4.0 | 76.4 · 74.8 · 23.6 · 5.1 | 78.9 · 73.7 · 21.1 · 14.5 | 79.1 · 72.5 · 20.9 · 15.9 |
| The Birthday Cake | hard | 61.3 · 13.4 · 38.7 · 0.4 | 48.8 · 9.8 · 51.2 · 2.7 | 53.0 · 7.8 · 47.0 · 30.2 | 59.4 · 10.4 · 40.6 · 29.4 |
| Chef Marchetti's Salmon | hard | 61.9 · 46.2 · 38.1 · 3.0 | 59.6 · 44.0 · 40.4 · 3.9 | 62.1 · 43.8 · 37.9 · 13.6 | 60.8 · 43.1 · 39.2 · 13.8 |

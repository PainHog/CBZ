# Simulator notes — policies, abstractions and gaps (core rules v0.8)

## Abstractions
- **Rooms are nodes.** No grid inside a room; a cat is in a room or outside. Humans walk to any room in one round.
- **Seeing is per room** (CORE-RULES "Seen"); nobody sees into the next room.
- **A spot** (counter, table, bag) is a list of steps; each step needs one working roll by any cat in the room.
- **Temptation effects** follow CORE-RULES v0.4 per instinct (Lap Cat's fuss distracts a human; Knocker leaves a mess; Box Sitter and Climber hide; Foodie is quiet; Hunter's chase is innocent in view). Giving in while carrying drops the prize.
- **Not modelled yet:** a cat loitering in a dog's room being chased out (simulated cats never loiter there), riding the robot vacuum, a shut-in cat meowing to lure a human, persuading a human to open an inside door, toddlers, teens (no house has one), the campaign.

## Gang policies (players' choices, not rules)
- **Entrance:** best chance of getting in, minus 0.15 per room from the prize; avoid an angry dog.
- **Distract:** each round, if the prize room (or the carriers' next room) has watchers, the best Sweet cat (2+) in or next to that room distracts one of them, unless that would fill Cuddle.
- **Lure:** if one watcher can't be distracted, a free cat in a neighbouring empty room knocks something over to pull them away. The policy lures only from a neighbouring room, one watcher at a time, and never uses a noisy entrance, a parrot or a dog's bark as a lure; four playtests found such lures to be the sharpest line at the table, so real players beat the simulated gang wherever a free noise sits next to the prize.
- **Wait:** while time allows, cats don't act in view of a watcher when the Broom meter is close to full (`boldness: mixed`). Carriers wait for the next room to clear until 3 rounds before Lights Out — but not when a Searching human is watching them (v0.6: waiting there costs +1 Broom a round).
- **Hide (v0.6):** a cat that ends the cats' turn with its Action unused, not carrying and not seen, hides (a free simple Action). Searching humans then walk past it and "spotted" doesn't fire.
- **Haul (v0.6):** the lead carrier rolls Sneaky or Savage, whichever has the better chance; the other carriers help.
- **Long shots:** a cat doesn't try a roll under 45% if a better cat is around, or under 30% at all, unless time is short.
- **Pets:** confront only with at least a 40% chance; otherwise leave the room.
- **Eat or carry:** food is always eaten on the spot (`foodPolicy: eat`). v0.7 made every bite a roll, so carrying food out is often fewer rolls at the table; a `smart` policy (carry while more than 2 portions are left and nobody watches) was tried, but the simulated carriers stall behind closed doors under a Searcher's eye and score far worse than playtesters do, so it stays off for the headline numbers. This is the main reason the Clean share of Hard wins reads low (15%); with `smart` it is 34–35% at both Hard houses, for 11–16 points of win rate (sim/BALANCE.md).
- **Push:** a Flop on an important roll, paid with Cattitude if any, else with the Mood only if no meter could fill.
- **Cattitude die:** spent on an important roll whenever the cat has 2+.
- **Resist a temptation:** when giving in would drop the prize, fill a meter, or happen at the prize with 3+ Cattitude.
- **Held:** wriggle (v0.7: the holder still sees the room, so going limp no longer covers the gang).
- **Rescue:** after the prize is got, a free cat opens the Den door if there are 2+ rounds left.
- **Parrot:** a cat at the prize with Streetwise 2+ covers the parrot's cage, but only when no human sees it.
- **Storyteller:** tempts a random eligible cat (`tempter: random`; the `mean` alternative is in the strict preset).

## Gaps the simulator had to fill (settled in CORE-RULES v0.4 unless noted)
1. **Nobody in sight when a meter fills** (from a mess or a disturbed prize): the meter stays full and the next cat seen on that side gets it. Now in CORE-RULES v0.3.
2. **Who a Shoo! or Scooped! hits:** the cat whose roll filled the meter.
3. **Where the human puts a dropped prize:** back in its current spot, which needs its steps again.
4. **A cat entering through a window into a watched room** rolls in view of that room.
5. **What a temptation does** when the room's temptation doesn't say: noise, plus a Broom step if seen. The book should give each instinct its own line.
6. **Noise from several rooms:** each human answers only the closest noise.

## Playtests
- `playtests/2026-10-19-birthday-cake.md` (Hard, 3 cats, v0.3): Clean Getaway in 5 rounds, 3 cat rolls; 23 issues, all settled in v0.4 (`book/REVIEW.md` rows 1–19). It also confirmed that a robbery can have very few rolls when the humans wander off.
- `playtests/2026-10-19-okafor-box.md` (Standard, 4 cats, v0.3): Clean Getaway in round 6 with **no cat rolls** (staging the box in an unvisited hall); 27 issues. Led to v0.5 (`book/REVIEW.md` rows 20–32): Searching, the owner fetching a taken prize, pet routines, dogs on entry, reopening entrances.

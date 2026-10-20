# Simulator notes — policies, abstractions and gaps (core rules v0.4)

## Abstractions
- **Rooms are nodes.** No grid inside a room; a cat is in a room or outside. Humans walk to any room in one round.
- **Seeing is per room** (CORE-RULES "Seen"); nobody sees into the next room.
- **A spot** (counter, table, bag) is a list of steps; each step needs one working roll by any cat in the room.
- **Temptation effects** follow CORE-RULES v0.4 per instinct (Lap Cat's fuss distracts a human; Knocker leaves a mess; Box Sitter and Climber hide; Foodie is quiet; Hunter's chase is innocent in view). Giving in while carrying drops the prize.
- **Not modelled yet:** riding the robot vacuum, a shut-in cat meowing to lure a human, persuading a human to open an inside door, toddlers, teens (no house has one), the campaign.

## Gang policies (players' choices, not rules)
- **Entrance:** best chance of getting in, minus 0.15 per room from the prize; avoid an angry dog.
- **Distract:** each round, if the prize room (or the carriers' next room) has watchers, the best Sweet cat (2+) in or next to that room distracts one of them, unless that would fill Cuddle.
- **Lure:** if one watcher can't be distracted, a free cat in a neighbouring empty room knocks something over to pull them away.
- **Wait:** while time allows, cats don't act in view of a watcher when the Broom meter is close to full (`boldness: mixed`). Carriers wait for the next room to clear until 3 rounds before Lights Out.
- **Long shots:** a cat doesn't try a roll under 45% if a better cat is around, or under 30% at all, unless time is short.
- **Pets:** confront only with at least a 40% chance; otherwise leave the room.
- **Eat or carry:** food is always eaten on the spot.
- **Push:** a Flop on an important roll, paid with Cattitude if any, else with the Mood only if no meter could fill.
- **Cattitude die:** spent on an important roll whenever the cat has 2+.
- **Resist a temptation:** when giving in would drop the prize, fill a meter, or happen at the prize with 3+ Cattitude.
- **Held:** stay limp while a gang mate works in that room (the holder sees nobody else); otherwise wriggle.
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

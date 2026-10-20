# Lessons from Heisty Spideys

What went wrong, or took several rounds, on Richard's first game. Each lesson lists what to do differently from the start.

## Balance
- **As written, the first rulebook was almost impossible to lose.**
  - The simulator found ~100% wins at every difficulty. Even reading every unclear rule against the players still gave 77%.
  - Causes:
    - Dice pools of ~9 against Difficulty ~2.5, so only 0.3% of rolls failed and half were Criticals.
    - Free bonus dice stacking (~3 per roll).
    - Criticals lowering the Alert, so it barely moved.
    - Planning and abilities that deleted obstacles with no roll.
  - **Do:**
    - Simulate the core dice math before writing chapters.
    - Cap bonus dice from all sources.
    - Never let a common good result undo the threat track.
    - Nothing should skip a roll for free.
- **Single tweaks didn't fix it; a package did.** The fix that worked:
  - Successes on 5–6.
  - A Partial needs at least half the Difficulty.
  - Two successful rolls per obstacle.
  - Criticals lower the Alert only at Difficulty 3+.
  - A +2 bonus-dice cap, with Silk exempt.
  - Capture on a failure at Full Alert.
- **Targets that played well:**
  - Win rates: Easy ~90%, Standard ~75%, Hard ~55–60%.
  - Some real risk of losing at Hard.
  - Resources actually get spent: the median player spends at least half.
  - Criticals 15–25% of rolls, Failures ~10%.
- **Losing must cost something even at the end:**
  - Getting caught on the last obstacle originally cost nothing.
  - Hitting the threat limit cost nothing once the loot was in hand.
- **Resources were hoarded** until the book told players to spend them, and spending felt worth it.

## Rules the book left undefined (decide these up front)
- **"Scene"**, used by many once-per-scene abilities.
- **When an enemy counts as active**, and how per-round threat increases tick outside strict turn order.
- **Opposed rolls versus Difficulty.** Cover, penalties and perks were all written as Difficulty changes, which meant nothing in an opposed roll. Resolved: the enemy's successes + 1 become your Difficulty.
- **Group checks.** Without them, every character rolls for every obstacle and a bigger party raises the threat faster. Resolved:
  - Everyone rolls, and the threat rises once, by the worst result.
  - A group check counts as both of an obstacle's two rolls.
  - The enemy rolls once per round, not once per character.
- **What happens at the threat limit:**
  - Can the track go past it?
  - Can it come back down?
  - Do the penalties apply at low limits?
- **Planning:**
  - Intel needs a cap.
  - Preparations can't auto-solve an obstacle.
  - The hidden obstacle must stay hidden.
- **NPCs need stats:** Speed, pools, an attack, and what a "hit" does. Ordinary humans had none at first.
- **Creatures need a way to be beaten or driven off,** and that must be worth doing.
- **Carrying loot:**
  - The size and speed rules.
  - Squeezing through gaps.
  - What "incomplete loot" means.
- **Heights, falls, line of sight, and what counts as one Action.**
- **Whether limits and rewards are per character or per group,** and what a replacement character inherits.
- **"One event, one trigger".** Decide whether one mishap can raise the threat several times.

## Ready-to-run scenarios
- **Every one needs:**
  - a gridded map with at least two entry points;
  - every obstacle with its roll and Difficulty;
  - 1–2 escape obstacles, at least one solvable without athletics;
  - stats for every NPC;
  - procedures for unpredictable NPCs (a d6 table, not a script).
- **Labels must match how hard they actually play.**
  - Creature-heavy locations played harder than "Hard" ones until they were tuned in the simulator.
- **Check the scenario text against its map,** room by room. A mismatch slipped through in Heisty.

## Character creation
- **Random tables need to cover every step,** with a reroll rule for duplicates.
- **Starting resources must not swing wildly by species.**

## Art (Richard catches these, so check them first)
- **Floating or partly-supported objects:**
  - a pencil half off a notepad;
  - a decal floating off a tin;
  - a towel with no rack.
- **Anatomy:** a cat with one eye.
- **Shapes cut off by the frame,** such as a half-drawn hook.
- **Impossible angles,** such as a tilted bottle cap.
- **Gadgets that couldn't work,** such as a launcher.
- **Sparse scenes and near-empty pages.**
- **The fix** was `book/art/ART-CHECKLIST.md` plus a mandatory object-table audit of every prop, which found ~50 more defects.
- **Look at every render yourself.**

## Layout
- **Check every build** with a contact sheet and a text diff.
- **Common problems:**
  - Chromium's shrink-to-fit;
  - page breaks ignored inside multi-column boxes;
  - end markers spilling onto the next page;
  - tables that must not split leaving holes.

## Foundry
- **Design for automation from the start.** Heisty retrofitted it in three parallel work packages plus integration, about 5,000 lines.
- **Model the threat track as a ledger.** Then cancels and "one event, one trigger" fall out naturally.
- **Keep pure logic in Foundry-free modules** with `node:test` tests.
- **Make writes GM-authoritative**, via `User#query` with a socket fallback.
- **Give every automation a settings toggle.**
- **No live Foundry exists in the cloud.** Use a fake-Foundry smoke test that runs a whole session as a GM and two players. Then the author runs `TESTING.md` for real.
- **v13 `User#query` handlers don't receive the sender.** Verify ownership from the payload.

## Process
- **Commit and push work-in-progress often.** Agents and sessions stop on usage limits; resume them, don't restart.
- **Parallel agents need disjoint file ownership.** When one package depends on another, tell the dependent agent the other's interface.
- **Keep the simulator measuring the version it was built for.** It imported live rules code, which silently changed its baseline. Freeze a copy of the old rules when the live rules change.

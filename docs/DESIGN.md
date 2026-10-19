# Cat Burglars — design document

This is a living document. The **Pitch** is Richard's own. **Decisions** lists only what Richard has approved. Everything under **Open questions** and **Suggestions** is undecided.

## Pitch (Richard Moore, 2026-10-19)

> Players are a gang of street cats, they saw a human carrying something delicious, or fun, or a box. Into the house. They must get it at all costs, without getting caught.

### What the pitch settles
- **Title:** *Cat Burglars*.
- **Player characters:** a **gang of street cats**.
- **The hook:** the gang **saw a human carry something into a house**. It could be something **delicious**, something **fun**, or **a box**.
- **Goal:** **get it at all costs**.
- **Constraint:** **without getting caught**.

## Decisions log
| Date | Decision | Notes |
|---|---|---|
| 2026-10-19 | Title, premise and core loop as in the pitch above | — |
| 2026-10-19 | Private repository, with the same toolchain as Heisty Spideys (book pipeline, simulator, Foundry system) | Building Foundry automation-first is the default from Heisty's lessons; confirm it in the first session |
| 2026-10-19 | **Identity (Q1), part A: instincts are the core mechanic.** Each cat has instincts (examples discussed: curiosity, knocking things off tables, sitting in boxes, chasing anything that moves). The Storyteller tempts the cats; giving in gets a strong effect but makes noise or mess; resisting costs something. Temptations in the house double as tools. | The test from the suggestions below ("a mechanic only a cat could have"). Which instincts, their effects and costs are still open (Q3, Q5). Temptation bonuses must respect a bonus cap (LESSONS: free bonus dice stacking). |
| 2026-10-19 | **Identity (Q1), part C: hiding in plain sight.** Cats can pass as pets: being seen isn't being caught; being seen *doing something* is. Suspicion tracks how the humans read the cats (stages discussed: cute → "whose cat is that?" → "out!"). Looking innocent (washing, a slow blink, purring) is a real move. | Stage names, numbers and line-of-sight rules still open (Q6, Q7). LESSONS: define "seen" and line of sight up front. |
| 2026-10-19 | **Identity (Q1), part of B: no casing or planning phase.** Play starts at the moment the gang gets in. The gang **chooses its way in from several entrances, not always the front door** (Richard). | Removes Heisty's planning problems (intel cap, preparations auto-solving obstacles, the hidden obstacle). Which entrances exist and how the choice plays is Q6; every ready-to-run house needs at least two (LESSONS). A target that keeps moving every round was set aside; a lighter version (the human moves it once or twice) can come back under Q6. |

## Open questions (work through these with Richard, roughly in this order)
1. **Identity versus Heisty Spideys.**
   - **Why it matters:** this is the closest of Richard's games to *Heisty Spideys*. Both have small animals, a house, a target inside, humans and pets as threats, and the need to avoid getting caught. Heisty even has a House Cat as an obstacle.
   - **The question:** what makes Cat Burglars feel different at the table? Possible directions include:
     - the cats' size and physicality (they can't hide in a crack);
     - "at all costs" (are the cats bolder, louder, more chaotic?);
     - the fact that the gang **saw the target go in**, so they chase a known prize instead of planning a heist;
     - cat behaviour as a mechanic (curiosity, distraction, knocking things off tables).
   - **Settle this first,** because it shapes every later answer.
   - **Settled 2026-10-19:** instincts (A) + hiding in plain sight (C) + no planning phase, with a choice of entrances. See the Decisions log.
2. **Engine.**
   - **The options:** reskin the proven *Heisty Spideys* engine, adapt it, or build something new.
   - **What the Heisty engine is:** a d6 pool with Successes on 5–6, Difficulty, an Alert track running to a Limit, and Silk Points. It is fully simulated, balanced and automated in Foundry.
   - **Trade-off:** reusing it saves months, but it pushes against question 1.
3. **The cats.**
   - Premade gang members or built characters?
   - Are there roles in the gang, and what are they?
   - What makes one cat play differently from another (coat, size, temperament, street skills)?
   - Is there a cat-specific resource, such as nine lives?
4. **The target.**
   - How the Storyteller picks what the human carried in (delicious, fun or a box). Is it a random table, a player vote, or a seed for the whole session?
   - Does the kind of target change how the heist plays (food smells, toys roll, boxes are big and irresistible)?
   - What counts as getting it: eaten on the spot, dragged out, or sat in?
5. **"At all costs".**
   - What can the gang spend or risk to succeed?
   - What does going too far cost them?
   - How does that tension sit with "without getting caught"?
6. **The house.**
   - How a house is structured: a map, rooms as obstacles, or a sequence.
   - **Ways in:** windows, cat flaps, open doors, following the human.
   - **Who lives there:** humans, a dog, a resident house cat, small children, a robot vacuum.
   - Does the house change between sessions?
7. **Getting caught.**
   - What raises suspicion, and what counts as caught (spotted, grabbed, shut in a room, put out, taken to the vet, adopted).
   - Is there a chase or an escape phase?
   - How lethal or permanent is it? This should stay family-friendly.
   - Can a caught cat still help the gang?
8. **Session and campaign.**
   - Is it a one-shot per target, or a campaign?
   - What carries over between sessions: gang reputation, territory, rival gangs, the neighbourhood's humans remembering the gang?
9. **The table:** number of players, session length, age and tone (cosy, slapstick, noir caper), and whether it is GM-full or GM-light.
10. **Art direction:** the palette and look, and how the gang is drawn.
11. **Foundry:** an online version from day one? The recommendation from Heisty is yes, built automation-first, with the rules designed so every rule can be automated.
12. **Name check:** "Cat Burglar(s)" is a common phrase, and other games and products use it. Search for them before committing to store pages or to art that carries the title.

## Rights note (not legal advice)
- **Real cats and street-cat life are free to use.**
- **Avoid famous cartoon and film cats,** in names and in looks. That means characters such as Garfield, Tom (*Tom and Jerry*), Top Cat, the DreamWorks Puss in Boots design, the Aristocats and Hello Kitty.
- **Check the final title and character names** with someone qualified before launch.

## Suggestions from the Heisty Spideys experience (for discussion, not decisions)
- **Heisty's structure maps onto this pitch almost one-to-one:**
  - **house:** the location;
  - **the thing the human carried in:** the loot;
  - **suspicion:** the Alert;
  - **getting out with it:** the Escape;
  - **a gang resource:** Silk.
  
  That is a strength for speed and balance, and a risk for identity (see question 1). A good test: is there a mechanic only a cat could have?
- **Decide early the things Heisty had to retrofit:**
  - group checks;
  - opposed rolls versus Difficulty;
  - what counts as a "scene";
  - stats for humans and pets;
  - carrying the target (a box is bulky; food can be eaten on the spot);
  - a map with at least two ways in for every ready-to-run house;
  - per-cat versus per-gang limits.

  See `docs/LESSONS.md`.
- **Set win-rate targets before writing rules.** Heisty settled on Easy ~90%, Standard ~75% and Hard ~55–60%.

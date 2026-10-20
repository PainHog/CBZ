# Kickoff prompt for the first design session

Start a new coding-assistant session with **only the CatBurglars repository** selected, then paste everything below the line.

---

I'm Richard Moore, and I'm starting a new tabletop RPG: **Cat Burglars**. You helped me finish my first game, *Heisty Spideys*. This repository already has the same toolchain set up: the rulebook pipeline, a simulator skeleton and a Foundry VTT system skeleton. Read these three documents first:

1. The working-rules file at the repository root: how we work. I decide all game content; you propose options and I choose.
2. `docs/DESIGN.md`: my pitch, the decisions so far, and the open questions.
3. `docs/LESSONS.md`: what went wrong on Heisty Spideys, and what to decide up front this time.

`docs/reference/` holds Heisty's balance study and its Foundry automation design, for reference. If we decide to reuse Heisty's engine, ask me to attach the SpideyHeist repository to the session so you can read its rulebook and code directly. My other games (SpideyHeist, DontGetForked) are read-only reference: never change, commit or push anything in them (see the working rules).

Today's goal is the **core design**, not writing chapters:

- Interview me through the open questions in `docs/DESIGN.md`, in order. Ask about one topic at a time, and give two or three concrete options for each, with your recommendation and why. Use what we learned on Heisty Spideys.
- Start with question 1: what makes Cat Burglars feel different from Heisty Spideys at the table. Then question 2, the engine: reuse Heisty's, adapt it, or build new. Lay out the trade-offs.
- After each decision, record it in the Decisions log in `docs/DESIGN.md`, then commit and push.
- Once the identity, the engine, the cats, the target, "at all costs", the house and getting caught are settled, write a one-page core rules summary in `docs/CORE-RULES.md`. Then build a first rough simulation in `sim/` against the win-rate targets we agree on.
- Don't write rulebook chapters or art until I've approved the core rules.

Flag early anything in my ideas that would cause the kinds of problems listed in `docs/LESSONS.md`.

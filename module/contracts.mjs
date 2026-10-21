/**
 * NINE LIVES GANG — Cross-package contracts.
 * Constants only: no imports, no Foundry globals, no logic. Every name that two
 * parts of the system must agree on (setting keys, chat-card kinds, GM operation
 * names, hook names, flag scopes) is declared here once and imported everywhere,
 * so packages built in parallel cannot drift apart; test/contracts.test.mjs
 * asserts each one is actually used. Change it only on purpose, together with
 * every user of it.
 */
export const SYSTEM_ID = "cat-burglars";
/** Flag scope for documents (flags["cat-burglars"]). */
export const FLAG = "cat-burglars";
/** CONFIG.queries handler name for GM-authoritative operations. */
export const QUERY = "cat-burglars.op";
/** Socket channel (system.json "socket": true). */
export const SOCKET = "system.cat-burglars";

/** World/client setting keys (AUTOMATION.md §8). */
export const SETTINGS = Object.freeze({
  migrationVersion: "systemMigrationVersion",
  robberyState: "robberyState",       // world, hidden: the robbery (AUTOMATION.md §2), written only by the active GM
  autoMood: "autoMood",               // "auto" | "confirm" | "manual"
  autoSeen: "autoSeen",               // the roll dialog fills in Seen, Attention and kids from the robbery
  autoEffects: "autoEffects",         // a roll's result changes the house (steps, doors, entrances, pets…)
  autoHouseTurn: "autoHouseTurn",     // "prompt" | "auto" | "manual"
  autoRoutines: "autoRoutines",       // humans' and pets' d6 routines are rolled and followed
  autoTemptation: "autoTemptation",   // "prompt" | "auto" | "off"
  autoCattitude: "autoCattitude",     // spends and gains change the cat's Cattitude
  autoPrizeClock: "autoPrizeClock",   // the Prize Clock moves the prize and takes it away
  autoOutcome: "autoOutcome",         // the robbery ends by itself and posts the outcome
  autoGetaway: "autoGetaway",         // the getaway: rolls move the gang, the warden comes on and corners cats (Ch 9)
  autoCred: "autoCred",               // Cred (Ch 9): tags, the catnip and the rivals score by themselves; the zoomies change rolls
  trackerForPlayers: "trackerForPlayers", // players may open the Robbery Tracker (read-only for the house)
  trackerPosition: "trackerPosition"  // client: where the tracker window was
});

/** Chat-card kinds (flags["cat-burglars"].card.kind). */
export const CARD = Object.freeze({
  roll: "roll",             // a cat's roll: dice, result, Mood, Push / Accept / Seen buttons
  temptation: "temptation", // the Storyteller tempts a cat: Give in / Resist
  temptPrompt: "temptPrompt", // whispered to the Storyteller: who can be tempted this round
  round: "round",           // a round begins: the Prize Clock
  houseTurn: "houseTurn",   // the house's turn: pets, noise, routines, discovery, holders
  mood: "mood",             // Shoo! / Scooped!
  moodPick: "moodPick",     // whispered to the Storyteller: a meter filled with no roll — which cat in sight gets it
  robbery: "robbery",       // a robbery starts
  getaway: "getaway",       // the getaway (Ch 9): the start, the warden, cornered cats, drops, pinches
  outcome: "outcome"        // Clean Getaway / Messy / Busted, with the campaign buttons
});

/** GM-authoritative operation names (players → the active GM via User#query). */
export const OPS = Object.freeze({
  catAct: "cat.act",             // { catId, optionId, helpers } a Move or simple thing that needs no roll
  catHelp: "cat.help",           // { catId, targetId|null }
  catTurn: "cat.turn",           // { catId, moved?, acted? } "I acted"
  temptAnswer: "tempt.answer",   // { catId, choice: "gaveIn"|"resisted" }
  rollFinalize: "roll.finalize", // { messageId } apply a final roll card now (when the GM's hook missed it)
  campaignLife: "campaign.life"  // { catId } a pinched cat's owner spends a Life to bust out of the pound
});

/** Hooks this system fires (other modules may listen). */
export const HOOKS = Object.freeze({
  robberyChanged: "catBurglars.robberyChanged", // (state) on every client, after any change
  rollResolved: "catBurglars.rollResolved",     // (message, card) a roll card was applied to the robbery
  moodTriggered: "catBurglars.moodTriggered",   // (event, state) Shoo! or Scooped!
  roundBegan: "catBurglars.roundBegan",         // (state)
  roundEnded: "catBurglars.roundEnded",         // (state, events)
  robberyEnded: "catBurglars.robberyEnded"      // (state, outcome)
});

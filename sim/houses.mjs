/**
 * The ready-to-run houses as data (draft v0.1; the rulebook's house chapter
 * will print the same data). Each house: rooms (hiding spots, temptations),
 * ways between rooms (size; closed doors with how to open them), entrances
 * (room, size, approach options, climb), humans (Attention, d6 routine),
 * pets, the Den, and the prize with its Prize Clock script.
 *
 * Approach options are [approach, Difficulty, ...knack tags].
 * A routine is six results for d6 1–6: "stay" or a room key to walk to.
 */

const climb = [["sneaky", 1, "climb"], ["savage", 1, "climb"]];
const hardClimb = [["sneaky", 2, "climb"], ["savage", 2, "climb"]];
const door = [["streetwise", 1, "open"], ["savage", 2]];
const stiffDoor = [["streetwise", 2, "open"], ["savage", 2]];
const wrapped = [["streetwise", 1, "open"], ["savage", 1, "fight"]];   // foil, cling film, a cake cover
const bag = [["streetwise", 1, "open"], ["sneaky", 1]];                // rummage in a shopping bag

export const HOUSES = [
  {
    key: "number-12", name: "The Chicken at Number 12", label: "easy", patience: 5,
    rooms: {
      hall: { name: "Hall", tempt: ["curious"] },
      living: { name: "Living room", tempt: ["boxSitter", "lapCat", "knocker"] },
      kitchen: { name: "Kitchen", tempt: ["foodie", "knocker", "climber"] },
      utility: { name: "Utility room", tempt: ["hunter", "curious"] },
      loo: { name: "Downstairs loo", tempt: [] },
    },
    ways: [["hall", "living", "big"], ["hall", "kitchen", "big"], ["kitchen", "utility", "big"], ["hall", "loo", "big"]],
    entrances: [
      { key: "front", name: "Front door (behind Mr Pell)", room: "hall", size: "big", rounds: [1], opts: [["sneaky", 2], ["sweet", 0, "charm"]] },
      { key: "flap", name: "Cat flap in the back door", room: "utility", size: "normal", opts: [], noisy: true },
      { key: "window", name: "Open kitchen window (up the bins)", room: "kitchen", size: "normal", climb: true, opts: climb },
    ],
    den: "loo",
    humans: [
      { key: "pell", name: "Mr Pell", kind: "grownup", attention: 1, start: "hall",
        routine: ["stay", "stay", "kitchen", "kitchen", "living", "living"] },
    ],
    pets: [],
    prize: {
      kind: "delicious", name: "rotisserie chicken", size: "medium", portions: 5,
      script: [{ round: 2, room: "kitchen", steps: [climb, wrapped], by: "pell" }], goneAt: 12,
    },
  },
  {
    key: "okafor-box", name: "The Okafors' Big Box", label: "standard", patience: 4,
    rooms: {
      hall: { name: "Hall", tempt: ["boxSitter"] },
      living: { name: "Living room", tempt: ["lapCat", "hunter", "knocker"] },
      kitchen: { name: "Kitchen", tempt: ["foodie", "curious"] },
      garage: { name: "Garage", tempt: ["hunter", "climber"] },
      landing: { name: "Landing", tempt: ["climber"] },
      bathroom: { name: "Bathroom", tempt: [] },
      kidsroom: { name: "Tayo's room", tempt: ["boxSitter"] },
    },
    ways: [["hall", "living", "big"], ["hall", "kitchen", "big"], ["kitchen", "garage", "big", door],
      ["hall", "landing", "normal"], ["landing", "bathroom", "big"], ["landing", "kidsroom", "big"]],
    entrances: [
      { key: "front", name: "Front door (behind the courier)", room: "hall", size: "big", rounds: [1], opts: [["sneaky", 2], ["sweet", 0, "charm"]] },
      { key: "dogdoor", name: "Dog door", room: "kitchen", size: "normal", opts: [] },
      { key: "bathwin", name: "Bathroom window (over the shed roof)", room: "bathroom", size: "normal", climb: true, opts: climb },
      { key: "garage", name: "Garage side door, ajar", room: "garage", size: "big", opts: [] },
    ],
    den: "kidsroom",
    humans: [
      { key: "mum", name: "Mrs Okafor", kind: "grownup", attention: 1, start: "hall",
        routine: ["stay", "stay", "stay", "kitchen", "living", "living"] },
      { key: "tayo", name: "Tayo", kind: "kid", attention: 1, start: "living",
        routine: ["stay", "stay", "kidsroom", "kidsroom", "living", "kitchen"] },
    ],
    pets: [{ key: "biscuit", name: "Biscuit", kind: "dog", rating: 2, soft: true, start: "kitchen", asleep: true,
      roam: ["kitchen", "hall", "living", "garage"] }],
    prize: {
      kind: "box", name: "big delivery box", size: "large",
      script: [{ round: 1, room: "hall", steps: [], by: "mum" }, { round: 3, room: "living", steps: [], by: "mum" }], goneAt: 10,
    },
  },
  {
    key: "wendell-mouse", name: "Grandpa Wendell's Catnip Mouse", label: "standard", patience: 4,
    rooms: {
      hall: { name: "Hall", tempt: ["curious"] },
      living: { name: "Living room", tempt: ["hunter", "lapCat", "boxSitter"] },
      kitchen: { name: "Kitchen", tempt: ["foodie", "knocker"] },
      cellar: { name: "Cellar", tempt: ["hunter", "curious"] },
      landing: { name: "Landing", tempt: [] },
      bedroom: { name: "Spare bedroom", tempt: ["climber", "boxSitter"] },
      bathroom: { name: "Bathroom", tempt: ["boxSitter"] },
    },
    ways: [["hall", "living", "big"], ["hall", "kitchen", "big"], ["kitchen", "cellar", "normal", door],
      ["hall", "landing", "normal"], ["landing", "bedroom", "big"], ["landing", "bathroom", "big"]],
    entrances: [
      { key: "front", name: "Front door (behind Grandpa)", room: "hall", size: "big", rounds: [1], opts: [["sneaky", 2], ["sweet", 0, "charm"]] },
      { key: "flap", name: "Duchess's microchip cat flap", room: "kitchen", size: "normal", opts: [["streetwise", 2, "open"]], jam: true, noisy: true },
      { key: "cellarwin", name: "Cracked cellar window", room: "cellar", size: "tight", opts: [] },
      { key: "bedwin", name: "Bedroom window (up the drainpipe)", room: "bedroom", size: "normal", climb: true, opts: hardClimb },
    ],
    den: "bathroom",
    humans: [
      { key: "wendell", name: "Grandpa Wendell", kind: "grandparent", attention: 0, start: "hall",
        routine: ["stay", "stay", "stay", "stay", "living", "kitchen"] },
      { key: "june", name: "June", kind: "grownup", attention: 1, start: "kitchen",
        routine: ["stay", "stay", "stay", "living", "hall", "kitchen"] },
    ],
    pets: [
      { key: "duchess", name: "Duchess", kind: "housecat", rating: 2, soft: true, start: "living" },
      { key: "roomba", name: "The robot vacuum", kind: "vacuum", start: "living", roam: ["living", "hall", "kitchen"] },
    ],
    prize: {
      kind: "fun", name: "catnip mouse", size: "small",
      script: [{ round: 1, room: "hall", steps: [bag], by: "wendell" }, { round: 3, room: "living", steps: [], by: "wendell" }], goneAt: 10,
    },
  },
  {
    key: "birthday-cake", name: "The Birthday Cake", label: "hard", patience: 3,
    rooms: {
      hall: { name: "Hall", tempt: ["curious", "boxSitter"] },
      kitchen: { name: "Kitchen", tempt: ["foodie", "knocker"] },
      dining: { name: "Dining room", tempt: ["hunter", "climber"] },
      living: { name: "Living room", tempt: ["hunter", "boxSitter", "lapCat"] },
      utility: { name: "Utility room", tempt: ["curious"] },
      loo: { name: "Downstairs loo", tempt: [] },
    },
    ways: [["hall", "kitchen", "big"], ["hall", "living", "big"], ["hall", "dining", "big"], ["kitchen", "dining", "big"],
      ["kitchen", "utility", "big"], ["hall", "loo", "big"]],
    entrances: [
      { key: "front", name: "Front door (guests arriving)", room: "hall", size: "big", rounds: [1, 2], opts: [["sneaky", 2], ["sweet", 0, "charm"]] },
      { key: "patio", name: "Patio door, ajar", room: "dining", size: "big", opts: [] },
      { key: "utilwin", name: "Utility window (up the water butt)", room: "utility", size: "normal", climb: true, opts: climb },
    ],
    den: "loo",
    humans: [
      { key: "dad", name: "Dad", kind: "grownup", attention: 1, start: "kitchen",
        routine: ["stay", "stay", "stay", "dining", "hall", "living"] },
      { key: "rosalind", name: "Aunt Rosalind", kind: "grownup", attention: 2, start: "dining",
        routine: ["stay", "stay", "stay", "stay", "kitchen", "living"] },
      { key: "mia", name: "Mia", kind: "kid", attention: 1, start: "living",
        routine: ["stay", "stay", "dining", "hall", "kitchen", "living"] },
      { key: "leo", name: "Leo", kind: "kid", attention: 1, start: "living",
        routine: ["stay", "stay", "dining", "dining", "hall", "living"] },
    ],
    pets: [{ key: "captain", name: "Captain the parrot", kind: "parrot", start: "dining" }],
    prize: {
      kind: "delicious", name: "birthday cake", size: "medium", portions: 8,
      script: [{ round: 1, room: "kitchen", steps: [climb, wrapped], by: "dad" }, { round: 5, room: "dining", steps: [climb], by: "dad" }], goneAt: 9,
    },
  },
  {
    key: "marchetti-salmon", name: "Chef Marchetti's Salmon", label: "hard", patience: 3,
    rooms: {
      hall: { name: "Hall", tempt: [] },
      kitchen: { name: "Kitchen", tempt: ["foodie", "knocker", "hunter"] },
      living: { name: "Living room", tempt: ["lapCat", "boxSitter"] },
      utility: { name: "Utility room", tempt: ["foodie"] },
      landing: { name: "Landing", tempt: [] },
      bedroom: { name: "Bedroom", tempt: ["boxSitter"] },
      study: { name: "Study", tempt: ["climber", "curious"] },
    },
    ways: [["hall", "kitchen", "big"], ["hall", "living", "big"], ["kitchen", "utility", "big", stiffDoor],
      ["hall", "landing", "normal"], ["landing", "bedroom", "big"], ["landing", "study", "big"]],
    entrances: [
      { key: "front", name: "Front door (behind Sam)", room: "hall", size: "big", rounds: [1], opts: [["sneaky", 2], ["sweet", 0, "charm"]] },
      { key: "dogdoor", name: "Brutus's dog door", room: "utility", size: "normal", opts: [] },
      { key: "balcony", name: "Balcony door (up the tree)", room: "bedroom", size: "normal", climb: true, opts: hardClimb },
      { key: "skylight", name: "Skylight, propped open", room: "landing", size: "tight", climb: true, opts: climb },
    ],
    den: "study",
    humans: [
      { key: "chef", name: "Chef Marchetti", kind: "grownup", attention: 2, start: "kitchen",
        routine: ["stay", "stay", "stay", "stay", "hall", "living"] },
      { key: "sam", name: "Sam", kind: "grownup", attention: 1, start: "hall",
        routine: ["stay", "stay", "living", "living", "kitchen", "study"] },
    ],
    pets: [
      { key: "brutus", name: "Brutus", kind: "dog", rating: 3, soft: false, start: "utility", asleep: false,
        roam: ["utility", "kitchen", "hall", "living"] },
      { key: "roomba", name: "The robot vacuum", kind: "vacuum", start: "living", roam: ["living", "hall"] },
    ],
    prize: {
      kind: "delicious", name: "whole salmon", size: "medium", portions: 6,
      script: [{ round: 1, room: "kitchen", steps: [climb, wrapped], by: "chef" }], goneAt: 10,
    },
  },
];

export const houseByKey = Object.fromEntries(HOUSES.map(h => [h.key, h]));

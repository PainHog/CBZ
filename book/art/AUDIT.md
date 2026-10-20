# Art audit (ART-CHECKLIST.md, mandatory method)

Every piece in `book/art/` was rendered (`node book/tools/preview-art.mjs`, plus large crops and the
chapter-head box at 7.14in × 1.8in) and looked at. For each piece: an **object table** (every object,
its contact points, what is under or holding each one) and a **character row** per figure, counted.
Rows marked **Fixed** were defects this audit found and corrected; the fix is in the generator.

Audited 2026-10-20 for version 0.5. Re-audit any piece whose generator changes.

## How the counts are kept right
- Cats come only from `tools/art-gen/cats.mjs`, dogs and other residents only from `residents.mjs`.
  The poses build in the counts:
  - **Side view (`catSide`)**: one eye (profile), two ears (the far one behind), four legs (two near,
    two far in the deep tone), one tail, whiskers on the near side plus the far side's tips.
  - **Sitting, front (`catSit`)**: two eyes, two ears, two front legs, two haunches with a hind paw
    showing at each side, one tail curled round the front paws, whiskers both sides.
  - **Curled asleep (`catCurl`)**: one closed eye (the visible side), two ears, both front paws under
    the chin, the near hind leg tucked (the far one hidden by the body), one tail wrapped round.
  - **Dog standing (`dogSide`)**: one eye, two ears, four legs, one tail.
  - **Dog lying (`dogLie`)**: one closed eye, two ears (the far one behind the head), two front legs
    stretched out, the near hind leg folded (the far one hidden), one tail.
- Every cat stands on y = its ground and carries its own contact shadow, so feet touch what they
  stand on.
- Every human's legs end in two shoes flat on the floor with a contact shadow, cropped by the top edge.
- **Gang marks** are checked against `ref-*.svg` and `README.md`, on the cat's own side. A side view
  facing right shows the cat's left side; flipped, its right.
  - Tilly: a red collar with a brass tag.
  - Biscuit: a notch in his left ear. It shows only when that ear is near or seen from the front.
  - Velvet: a white star on her chest and a white left forepaw.
  - Mags: a kink in her tail.
  - Pip: a ginger left face and left flank, a black right ear and right flank, a black shoulder spot
    and a black tail tip.
- **Original cats**: none of the five is modelled on a famous cartoon or film cat. The Wendells' house
  cat was renamed Pom-Pom, and she is drawn as a fluffy grey chonk, not as a white Persian.

## Colour meanings (§13–14), whole book
- **Broom red** (`alarm`, `alarmB`) appears only on:
  - the broom's band (ch-mood, ch-caught, spot-broom);
  - the BROOM label (ch-mood);
  - Tilly's collar, which is a fixed character mark (README).
- **Fixed:**
  - Moved off the reds: the toy mouse and the catnip mouse (now brick), the shelf jar lids, the
    window curtains (now deep amber), the default rug, the dog bed, the parrot's tail (now brick) and
    the coat-hook default.
  - The default human coat changed from red to dusk blue.
- **Cuddle pink** (`cuddle`) appears only on:
  - the CUDDLE label and the Cuddle cushion (ch-mood, spot-curl, spot-back);
  - the Den label on the maps (where Held cats go).
- **Fixed:** took the pink off the party bunting, the cake candles, a present and Pom-Pom's collar
  (now blue).
- **Black cats** (Velvet) always have the moonlit-blue rim line.

## Chapter-head pictures fill their box
- The chapter-head box is 7.14in × 1.8in, nearly 4:1, and the vignettes are 3:1.
- **Fixed:** every head showed blank side bands. Backdrops now run 170 units past both side edges
  (`kit.mjs` `BLEED`: room walls and floors, the night sky, ch-gang's fence, ch-welcome's house and
  pavement, ch-the-block's far roofs, the line-up's height chart, the table top in ch-making-a-house).
  The vignettes' SVGs set `overflow="visible"`, so the bands show more of the same place.
- Nothing that matters is drawn in the bleed. Each head was checked in a 7.14 × 1.8 box.

---

## Chapter vignettes (900×300)

### ch-number-12 — Mr Pell's kitchen
| Object | Contact points | Supported by |
|---|---|---|
| Room, door (ajar) | door frame to floor | floor, wall |
| Mr Pell's legs, two shoes | soles | floor (shadow); cropped by top edge |
| Window (open sash), sill | frame in wall; sill fixed to wall | wall, above the worktop |
| Shelf, 3 jars | shelf on 2 screwed brackets; jars on shelf | wall; shelf top |
| Wall clock | hangs on a nail | wall |
| Counter, worktop | plinth on floor | floor |
| Chicken on plate | plate base | worktop, within its outline |
| Fridge | base | floor (shadow) |
| Table, 2 legs | leg feet | floor (shadow) |
| Bin | base | floor (shadow) |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Tilly (side, right) | 1 profile | 2 | 4 on worktop | 1 | collar + tag ✓ |
| Mags (sitting) | 2 | 2 | 2 front + 2 haunch | 1 | ginger tabby, green ✓ |
| Biscuit (side, left) | 1 | 2 | 4 on floor | 1 | right side shows; notched ear is far side ✓ |

### ch-welcome — the street at night
| Object | Contact points | Supported by |
|---|---|---|
| Roof band over the house front | eaves on the wall top | the house wall (**Fixed**: there was no roof edge) |
| Moon | — (sky) | moved clear of the house (**Fixed**: it was half behind the house) |
| House front, 2 lit windows (sills on the wall), open door (hinged left), step | door on its hinges; step on the ground | wall; ground |
| Mr Pell from behind: 2 legs, 2 shoes, 2 arms, 2 ears; the bag held by its handles round his hand | shoes | step/ground |
| Garden wall with coping | base | pavement |
| Street lamp: post, base, head, warm glow, pool on the ground | base | pavement |
| Wheelie bin | wheel and base | pavement (in front of the lamp) |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Velvet, Tilly, Biscuit, Pip (sitting on the coping) | 2 each | 2 | 4 | 1 | star + sock, collar, notch (viewer's right), Pip's patches ✓ |
| Mags (side, walking on the coping) | 1 | 2 | 4 | 1, kinked | ✓ |

### ch-your-cat — the line-up
| Object | Contact points | Supported by |
|---|---|---|
| Height chart, its top bar | painted on the wall | wall |
| 4 numbered wooden blocks | bases | floor, in front of each cat (**Fixed**: they were cards with no clear support) |

| Figure | Eyes | Ears | Legs | Tail | Notes |
|---|---|---|---|---|---|
| Tortoiseshell, black-and-white, cream, Mags (sitting) | 2 each | 2 | 4 | 1 | random cats, not the gang; Mags ✓ |

### ch-gang — single file along the fence
- Fence planks stand on the ground (cropped by the bottom edge).
- The top rail sits on the planks and runs into the bleed (**Fixed**: it stopped at the frame).
- All five cats walk with their paws on the rail.

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Tilly, Biscuit, Velvet, Mags, Pip (side, right) | 1 | 2 | 4 | 1 | collar; notch on the near (left) ear; Velvet's left sock near; Mags's kink; Pip's left face and flank ginger, shoulder spot, tail tip ✓ |

### ch-rolling — the dice
- The rug lies flat on the floor (cropped by the bottom edge).
- Three dice stand on the rug, each with a shadow.

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Tilly (sitting, on the rug) | 2 | 2 | 4 | 1 | collar ✓ |
| Pip (crouched, side right) | 1 | 2 | 4 | 1 | ✓ |

### ch-mood — Broom and Cuddle
- The broom stands on its bristles on the floor. Its handle is held by a clip screwed to the wall.
- The cushion lies on the floor.
- The labels BROOM and CUDDLE are real words in the meters' colours.

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Velvet (sitting) | 2 | 2 | 4 | 1 | star, left sock (viewer's right), rim ✓ |

### ch-round — the hallway
- The door is ajar. The legs walk in with two shoes on the floor.
- The clock hangs on a nail. The shelf has 2 brackets and its jars stand on it.
- The plant pot stands on the floor.

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Mags (crouched low, side) | 1 | 2 | 4 | 1, low | ✓ |

### ch-instincts
- The table's legs stand on the floor.
- The glass stands inside the table top's outline, near the edge.
- The box stands on the floor.
- The toy mouse lies on the floor, with its string tail on the floor.
- The high shelf has 2 brackets.

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Velvet (side, on the table) | 1 | 2 | 4 | 1 | left sock near ✓ |
| Mags (sitting in the box, the front wall over her lower half) | 2 | 2 | hidden by the box front | hidden | ✓ |
| Tilly (curled on the shelf, within its length) | 1 closed | 2 | 3 paws showing | 1 | collar ✓ |

### ch-prize
- The counter stands on the floor. The chicken's plate sits on the worktop.
- The box stands on the floor.
- The toy mouse lies on the floor.

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Biscuit (sitting) | 2 | 2 | 4 | 1 | notch on the viewer's right ear ✓ |
| Tilly (side, left) | 1 | 2 | 4 | 1 | collar ✓ |
| Pip (crouched) | 1 | 2 | 4 | 1 | ✓ |

### ch-caught — Shoo!
| Object | Contact points | Supported by |
|---|---|---|
| Legs (2), shoes (2) | soles | floor; cropped by top |
| Broom | handle runs out of the top edge (held above the frame); bristles on the floor | the sweeper's hands; floor |
| Back door, swung open on its hinge side; doorway; lintel | hinge edge | frame |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Biscuit (running, side right) | 1 | 2 | 4 | 1 | notch near ✓ |

### ch-residents
- The window's sill is fixed to the wall.
- The sofa stands on its feet. Pom-Pom sits on the seat.
- The vacuum is on the floor.
- The parrot: the stand's feet are on the floor, the hook arm holds the cage by its ring, and both
  of the parrot's feet are on the perch.

| Figure | Eyes | Ears | Legs | Tail | Notes |
|---|---|---|---|---|---|
| Pom-Pom (sitting) | 2 | 2 | 4 | 1 fluffy | blue collar (**Fixed** from pink) |
| Pudding (standing) | 1 | 2 floppy | 4 | 1 | ✓ |
| Captain (parrot) | 1 profile | — | 2 feet on the perch | 1 (brick) | ✓ |

### ch-the-block — the roof ridge
- The far roofs stand on the bottom edge, and more roofs run into the bleed.
- The attic windows sit in the gables, above our ridge.
- Our roof is a hipped roof, its ridge at y = 200. The chimney stands on the ridge.

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Velvet, Tilly, Biscuit (sitting on the ridge) | 2 | 2 | 4 | 1 | ✓ |
| Pip (curled on the ridge) | 1 closed | 2 | 3 paws showing | 1 | ✓ |
| Mags (walking along the ridge) | 1 | 2 | 4 | 1 kinked | ✓ |

### ch-storyteller — the cut-away wall
| Object | Contact points | Supported by |
|---|---|---|
| Lamp (base, glow) | base | floor |
| Armchair | 2 feet showing | floor |
| Wall clock | nail | wall, clear of the legs (**Fixed**: it was hidden behind them) |
| Resident's legs, 2 shoes | soles | floor; cropped by top |
| The wall, cut through (hatched section) | floor to beyond the frame | — |
| Counter; chicken on its plate | plinth; plate | floor; worktop |
| Bin | base | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Tilly (creeping on the counter) | 1 | 2 | 4 | 1 | collar ✓ |
| Biscuit (sitting) | 2 | 2 | 4 | 1 | notch ✓ |

### ch-making-a-house — seen from above (one projection throughout)
| Object | Contact points | Supported by |
|---|---|---|
| Table top (planks, grain) | — | fills the frame and the bleed |
| Paper | flat, with a shadow | table |
| Pencil plan (walls with gaps, window line, arrows, dashed route, X, labels FRONT ROOM / KITCHEN / HALL / LOO) | drawn on the paper | paper |
| Pencil (eraser, ferrule, body, cone, lead) | lies wholly inside the paper's outline | paper |
| 3 dice (top faces 6, 4, 2) | flat, with shadows | table |
| Mug of tea (rim, tea, handle) | flat, with a shadow | table |
| A ginger paw | the leg enters from the bottom edge (cropped) and the paw touches the nearest die | Mags's leg (tabby stripes) |

### ch-okafor-box
| Object | Contact points | Supported by |
|---|---|---|
| Front door | in its frame | floor, wall |
| Coat hooks: board with 2 screws, 3 hooks; 2 coats hang by their loops | hooks | board → wall |
| Ball | bottom | floor (shadow) |
| Kitchen doorway (the room beyond) | — | — |
| Dog bed | base | the kitchen floor |
| Sealed parcel (tape, label squiggles, 2 arrows) | base | floor (shadow) |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Biscuit (pushing, head on the box) | 1 | 2 | 4 | 1 | notch near ✓ |
| Mags (pushing, flipped) | 1 | 2 | 4 | 1 kinked | ✓ |
| Tilly (sitting on the box lid) | 2 | 2 | 4 | 1 | collar ✓ |
| Noodle (asleep on the bed) | 1 closed | 2 | 2 front out, near hind folded | 1 | sausage dog ✓ |

### ch-wendell-mouse
| Object | Contact points | Supported by |
|---|---|---|
| Front door; coat hooks with Grandpa's coat | — | wall |
| Kitchen door (ajar); Grandpa's legs, 2 shoes | soles | floor; cropped by top |
| Window, sill | — | wall |
| Radiator | 2 feet | floor |
| Robot vacuum | base | floor |
| Paper bag (rim folded) | base | floor |
| Catnip mouse (head, 2 ears, eye, nose); its string tail | the mouse is inside the bag (body hidden); the tail goes out over the rim and hangs straight down the outside | bag |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Pom-Pom (sitting on the sill) | 2 | 2 | 4 | 1 | blue collar ✓ |
| Pip (stalking) | 1 | 2 | 4 | 1 | ✓ |
| Velvet (sitting) | 2 | 2 | 4 | 1 | star, sock ✓ |

### ch-birthday-cake
| Object | Contact points | Supported by |
|---|---|---|
| Bunting | string on 2 nails; flags hang from the string | wall |
| Parrot stand and cage | feet; hook holds the ring | floor |
| Speech bubble "PARTY!" | a graphic; its tail points at Captain | — |
| Table with cloth | 2 legs | floor |
| Cake on its plate (3 tiers, 4 unlit candles) | plate | inside the table top's outline |
| Chair (back post = back leg, front leg, stretcher, seat) | 2 legs | floor |
| 2 balloons | strings tied to the top of the chair's back post; they float up | chair |
| Dad's legs, 2 shoes | soles | floor |
| 2 presents | small one wholly on top of the big one | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Velvet (sitting on the chair seat) | 2 | 2 | 4 | 1 | star, sock ✓ |
| Pip (under the table) | 1 | 2 | 4 | 1 | ✓ |
| Captain | 1 | — | 2 feet on the perch | 1 | ✓ |

### ch-marchetti-salmon
| Object | Contact points | Supported by |
|---|---|---|
| Utility door (open) | frame | wall |
| Pan rail: 2 brackets screwed to the wall, 3 S-hooks over the rail; 3 pans hang straight down through their handle holes | hooks | rail → wall |
| Island | plinth | floor |
| Salmon parcel: paper and string, head out of one end; the tail fin lies flat (shown edge-on) | underside | worktop |
| Cooker; pot on the hob; steam rising | base; pot base | floor; hob |
| The chef's legs, 2 clogs | soles | floor (between the island and the stove); cropped by top |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Brutus (barking) | 1 | 2 folded (**Fixed**: they were pointed like a cat's) | 4 | 1 stub | mastiff ✓ |
| Biscuit (facing him) | 1 | 2 | 4 | 1 | right side shows ✓ |
| Mags (creeping on the island, nose at the fish's tail) | 1 | 2 | 4 | 1 | ✓ |

---

## Cover and part pages

### cover (612×792)
| Object | Contact points | Supported by |
|---|---|---|
| Sky, moon | — | — |
| House: roof, chimney on the roof, brick front, lit window with sill, open door on its hinge, light falling out | — | the house stands behind the garden wall |
| Street lamp, glow, pool | base | pavement |
| Garden wall with coping | — | full width, on the pavement |
| Pavement | — | — |
| Roast chicken (body, both drumsticks; one bone end held in Biscuit's teeth) | hangs straight down under his chin, clear of his legs and the ground | Biscuit's mouth |
| The gang's tag (2026-10-20): sprayed paint, a cat's head with two ears, whiskers both sides, a 9 inside, two short drips running straight down from the chin with a drop at each end | painted on the wall face | the garden wall: wholly on the bricks, below the coping, right of Biscuit's tail and clear of every cat; reads as paint (soft overspray, no outline of its own) |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Velvet, Tilly (sitting on the coping) | 2 | 2 | 4 | 1 | star, sock, rim; collar ✓ |
| Mags (walking on the coping) | 1 | 2 | 4 | 1 kinked | ✓ |
| Pip (sitting on the pavement, at 0.85× the size of a grown cat) | 2 | 2 | 4 | 1 | ✓ |
| Biscuit (walking left, flipped) | 1 | 2 | 4 | 1 | right side shows ✓ |

- The lettering (the spray-paint logo, tilted 2°) sits over the sky under the top scrim.
- The subject sits in the middle band, and the edition line is on the pavement.

### orn-tag (140×110; part pages, credits page, back cover)
- The same tag as on the cover wall, drawn in the page's colour (amber on dark, deep amber on cream).
- 1 head, 2 ears, 2 whiskers each side, one 9 (a closed loop and a tail), 2 drips running straight down, each ending in a drop.
- Nothing is cut by the frame. It is a printed mark, not an object, so nothing supports it.

### part-gang
- A framed night panel.
- The wall with its coping runs right across. The lamp stands on the ground.
- Five cats sit on the coping: 2 eyes, 2 ears, 4 legs and 1 tail each, every mark ✓.
- Pip is drawn smaller.

### part-robbery
| Object | Contact points | Supported by |
|---|---|---|
| Back wall; back door | frame | ground |
| Cat flap: the opening, and the flap swung out toward us on its top hinge | hinge | door |
| Fence | posts | ground |
| Grass | — | — |
| Chicken | hangs from Biscuit's mouth (as on the cover) | Biscuit |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Biscuit (walking right) | 1 | 2 | 4 | 1 | notch near ✓ |
| Pip (trotting) | 1 | 2 | 4 | 1 | ✓ |
| Tilly (walking on the fence rail) | 1 | 2 | 4 | 1 | collar ✓ |

### part-storyteller
- The house: the roof sits on the wall, the window sills are on the wall, and the door has its cat
  flap.
- A person at the upstairs window, lit from behind: head and shoulders only, no face, clipped to the
  window.
- The hedge stands on the ground.
- Five pairs of eyes in the gang's own colours: green (Tilly), amber (Biscuit), amber (Velvet),
  green (Mags), blue (Pip). Each pair has 2 eyes with slit pupils.

### part-houses
- Five houses stand on the pavement.
- The numbers 12, 31 and 5 are real text on the doors.
- Pom-Pom shows as a shape in Grandpa's window.
- The balloons are tied to Number 5's gatepost.
- Marchetti's: the balcony slab and railing sit on the wall, the tree trunk stands on the ground
  (cropped by the frame), and the skylight sits in the roof slope.

## Spots (400×300; the back-cover panel too)

| Piece | Objects → support | Figures (eyes / ears / legs / tail) |
|---|---|---|
| spot-back | wall patch with skirting; window with its sill on the wall; cushion → floor; Biscuit → cushion; plate → floor; 3 bones (2 on the plate, 1 lying across both) | Biscuit curled: 1 / 2 / 3 showing / 1 ✓ |
| spot-curl | cushion → floor; Pip → cushion top | Pip curled ✓ |
| spot-box | box → floor; its front wall in front of Mags | Mags sitting, upper half: 2 / 2 / — / — ✓ |
| spot-bin | wheelie bin (wheel) → floor; Tilly → lid | Tilly sitting: 2 / 2 / 4 / 1, collar ✓ |
| spot-mug | table → floor; Velvet → table top; the mug on its side → floor; the puddle and drops lie flat on the floor | Velvet: 2 / 2 / 4 / 1, star, sock ✓ |
| spot-wool | ball → floor (shadow); the loose strand lies along the floor | Pip crouched: 1 / 2 / 4 / 1 ✓ |
| spot-purrfect | 2 dice (both 6) → floor; sparkles are a graphic | Mags sitting: 2 / 2 / 4 / 1 ✓ |
| spot-noodle | dog bed → floor; Noodle → bed | Noodle lying: 1 closed / 2 / 2+1 / 1 ✓ |
| spot-vacuum | vacuum → floor; Pip → the vacuum's top; speed lines | Pip sitting ✓ |
| spot-paws | seen from above: floorboards; the prints are marks on the boards, each 1 pad and 4 toes | — |
| spot-fish | seen from above: floor tiles; plate → tiles (shadow); the skeleton lies flat on the plate | — |
| spot-pudding | rug lies flat; Pudding → rug | Pudding lying: 1 closed / 2 / 2+1 / 1 ✓ |
| spot-parrot | stand feet → floor; the hook holds the cage ring; the feet are on the perch | Captain ✓ |
| spot-pompom | bowl → floor; Pom-Pom → floor | Pom-Pom sitting: 2 / 2 / 4 / 1, blue collar ✓ |
| spot-broom | wall patch with skirting; the broom stands on the floor, its handle in a wall clip | Tilly slinking: 1 / 2 / 4 / 1, collar ✓ |

## Reference sheets and portraits
- **ref-tilly, ref-biscuit, ref-velvet, ref-mags, ref-pip**:
  - Each shows a side view walking (left side shown) and a front view sitting.
  - Counts per the model above.
  - Every mark sits on the cat's own side: Biscuit's left-ear notch shows on the near ear in the side
    view and on the viewer's right in the front view. Velvet's left sock likewise. Pip's black right
    ear is on the viewer's left in the front view (checked at 4× zoom).
- **portrait-tilly … portrait-pip**:
  - Each is a front sitting cat in a lamplit brick cameo, clear of the frame.
  - Marks ✓. Pip is drawn smaller.

## Maps (plan view)
- **map-number-12, map-okafor-box, map-wendell-mouse, map-birthday-cake, map-marchetti-salmon**:
  - No physics.
  - Checked:
    - every room label sits inside its room;
    - entrance markers sit on the wall they cross;
    - the stairs icons are inside rooms;
    - the prize stars carry their round;
    - the Den is shaded and labelled;
    - the legend matches the house data.
  - The generator (`scenes/maps.mjs`) is maintained in the main line, which also moved the stairs
    labels to stay inside their rooms. Re-check after that merge.

## Placeholders
- **placeholder, placeholder-wide, placeholder-cover**: generator tooling only. No chapter uses them now.

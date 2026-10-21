# Art audit (ART-CHECKLIST.md, mandatory method)

Every piece in `book/art/` was rendered (`node book/tools/preview-art.mjs`, plus zoomed crops of every
edge and small prop, the chapter heads in their 7.14in × 1.8in box, and the small tag at its print
sizes) and looked at. For each piece: an **object table** (every object, its contact points, what is
under or holding each one) and a **character row** per figure, counted, with every mark and piece of
gear checked against the reference sheets on the correct side. Rows marked **Fixed** were defects this
audit (or the author's review of 2026-10-21) found and corrected; the fix is in the generator.

**Audited 2026-10-21.** This replaces the audit of 2026-10-20, which had the facing rule backwards.
Re-audit any piece whose generator changes.

## How the counts are kept right
- Cats come only from `tools/art-gen/cats.mjs`, dogs and other residents only from `residents.mjs`.
  The poses build in the counts:
  - **Side view (`catSide`)**: one eye (profile), two ears (the far one behind), four legs (two near,
    two far in the deep tone, never hidden behind each other), one tail, whiskers on the near side plus
    the far side's tips. **Fixed** (the author: "disjointed … like animatronics that have seams"): every
    side view is now one silhouette — all the near parts' outlines are laid down first and all their
    fills on top, so only the outer outline is inked and no line crosses the body at a shoulder, hip,
    neck or tail root. Legs are single tapered shapes with small round paws. **Fixed** (2026-10-21,
    coordinator's review of the cover): running and leaping cats keep a body about 2.5–3 heads long
    (Pip shorter), the stretch going into the legs and tail. Checked at 100% zoom on every runner and
    leaper: no joins.
  - **Sitting, front (`catSit`)**: two eyes, two ears, two front legs, two haunches with a hind paw at
    each side, one tail curled round, whiskers both sides.
  - **Curled asleep (`catCurl`)**: one closed eye, two ears, front paws under the chin, the near hind
    leg tucked (the far one hidden), one tail wrapped round.
  - **Dog standing (`dogSide`)**: one eye, two ears, four legs, one tail; one silhouette like the cats.
  - **Dog lying (`dogLie`)**: two ears (the far one behind the head), two front legs stretched out with
    the head resting on them (or held up, awake), the near hind leg folded, one tail. **Fixed**: the
    foreleg and head are drawn in front of the body so the foreleg can't vanish into the silhouette.
- Every standing cat and dog carries its own contact shadow on the line it stands on. Cats in mid-air
  (leaping) have none.
- Every human indoors shows from the hips down, two legs ending in two shoes flat on the floor with a
  shadow, cropped by the top edge. **Fixed**: doors are now 330 tall, so the top of every door runs out of
  the frame too; no visible part of a person is ever taller than a door.
- **Which side shows** (README, "The gang's gear"): facing right a cat shows its **right** side;
  flipped, its **left**; from the front its left is on the viewer's right. **Fixed**: the templates
  had Pip mirrored, Velvet's sock and Biscuit's notch on the wrong side for some facings; every
  one-sided mark is now placed from that one rule, in the model, for every pose.
- The marks and gear, by cat (all on the reference sheets):
  - Tilly: red collar with a brass tag; brass stud in her right ear; fish-skeleton tattoo on her right
    foreleg.
  - Biscuit: a V notch cut into the outline of his left ear (**Fixed**: it was a step, not a cut);
    black do-rag knotted at the back; a too-heavy gold chain; the gang's sign on his right shoulder;
    MUM in a heart on his left shoulder.
  - Velvet: a white star on her chest and a white left forepaw; moonlit-blue rim line; no gear.
  - Mags: a kink at the tip of her tail; a roomy navy kerchief with white dots; a gold hoop in her
    left ear; a sardine with wings on her right hip.
  - Pip: ginger left face and left flank, black right ear and right flank, a black shoulder spot and
    tail tip; a too-big pale blue kerchief; a bottle-cap medal.
- **Original cats**: none of the five is modelled on a famous cartoon or film cat. Pom-Pom is a large
  fluffy silver longhair with her own face (level half-closed lids, a cream ruff), not a flat-faced
  "grumpy" cat and not a tabby, so she never reads as Tilly. **Fixed**: her ruff was spiky (it read as a
  lion's mane); it is now soft scallops in her own coat colour.

## Colour meanings (§13–14), whole book
- **Broom red** (`alarm`, `alarmB`) appears only on the broom's band (ch-mood, ch-caught, spot-broom),
  the BROOM label (ch-mood) and Tilly's collar (a fixed character mark).
- **Cuddle pink** (`cuddle`) appears only on the CUDDLE label and the pink cushion (ch-mood, spot-curl,
  spot-back) and THE DEN on the maps. **Fixed**: the friendship heart in spot-pudding was pink; it is
  now white.
- **Graffiti** uses window-glow cream, pale blue, light and dusk blue (the rivals' tag dull green):
  never Broom red or Cuddle pink. Graffiti is only on outdoor surfaces (checked piece by piece below).
- **Black cats** (Velvet, and the random black-and-white in ch-your-cat) always have the moonlit-blue
  rim line.

## Text and fonts (§15), whole book
- Every piece of text is in Alegreya Sans, Fraunces or the spray-paint face (with Fraunces as its
  fallback). **Fixed**: no piece uses a generic family alone (the maps and placeholders did).
- Real words only: BROOM, CUDDLE, PARTY!, the house numbers 12 / 31 / 5, FRONT ROOM / KITCHEN / HALL / LOO
  on the pencil plan, the line-up's numbers, the van's ANIMAL CONTROL, the throw-ups MEOW and NLG, the
  sheets' captions, the map labels, MUM in Biscuit's tattoo. Every word is whole: **Fixed** (2026-10-21):
  the van on the cover was cut by the left edge so only CONTROL showed; it is now wholly in the picture
  and its words sit inside its rear panel at every size.

## Chapter-head pictures fill their box
- The chapter-head box is 7.14in × 1.8in, nearly 4:1, and the vignettes are 3:1. Backdrops run 170 units
  past both side edges (`kit.mjs` `BLEED`) and the SVGs set `overflow="visible"`, so the bands show more
  of the same place. Nothing that matters is drawn in the bleed; each head was checked in the box.
- Nothing hangs below or above the band: **Fixed** (2026-10-21): the warden in ch-getaway hung below the
  night strip when the picture was shown on its own; he is now inside the frame and clipped cleanly at
  the band's bottom edge.

---

## Chapter vignettes (900×300)

### ch-welcome — the street at night
| Object | Contact points | Supported by |
|---|---|---|
| Moon, stars | — | sky |
| House front: slate roof band on the wall top, brick wall, 2 lit windows with sills fixed to the wall | wall | ground |
| Front door frame, the lit hall, the door swung open into the hall on its left hinges | hinges | frame |
| Mr Pell's keys: split ring and two keys hanging straight down from the lock, a glint | ring through the key in the lock | the door's lock |
| Step | — | pavement |
| Mr Pell from behind: head, 2 ears, 2 arms, 2 hands closed round the shopping bag's handles (**Fixed**: the hands didn't hold the handles), 2 legs, 2 shoes | shoes | the step (shadow) |
| Pavement | — | — |
| Garden wall with coping, nearer to us than the house: its foot runs below the bottom edge (**Fixed**: on the house's ground line the cats on top read half a man's height) | — | ground, below the frame |
| The gang's tag (cream) and a crown mark (blue), sprayed on the wall's face | paint | outdoor brick |
| Street lamp: base, post, head, glow, pool of light | base | pavement |
| Wheelie bin: body, lid, wheel and front foot, a paw-print tag | wheel and front foot (**Fixed**: it had no front foot) | pavement |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Velvet (sitting, front) | 2 | 2 | 4 | 1 | star; white sock on the viewer's right; rim ✓ |
| Tilly (sitting, head tilted) | 2 | 2 | 4 | 1 | collar + tag; stud on the viewer's left ear; fishbone on the viewer's left foreleg ✓ |
| Mags (walking right on the coping) | 1 | 2 | 4 (**Fixed**: she had 3) | 1, kinked | kerchief; sardine on her right hip; the hoop is on the far (left) ear ✓ |
| Biscuit (sitting) | 2 | 2 | 4 | 1 | do-rag; chain; notch on the viewer's right ear; sign on the viewer's left shoulder, MUM on the viewer's right ✓ |
| Pip (sitting, 0.82×) | 2 | 2 | 4 | 1 | ginger face on the viewer's right; black ear on the viewer's left; kerchief; bottle cap ✓ |

### ch-your-cat — the line-up
| Object | Contact points | Supported by |
|---|---|---|
| Height chart and its top bar | painted on the wall, into the bleed | wall |
| 4 numbered wooden blocks (1–4) | bases, with shadows | floor, in front of each cat |

| Figure | Eyes | Ears | Legs | Tail | Notes |
|---|---|---|---|---|---|
| Tortoiseshell (tough squint), black-and-white (rim line), cream (grin), Mags | 2 each | 2 | 4 | 1 | random cats, not the gang; Mags: kerchief, hoop on the viewer's right ear ✓ |

### ch-gang — single file along the fence
| Object | Contact points | Supported by |
|---|---|---|
| Fence boards | feet | ground, below the bottom edge |
| Top rail | on the boards, into the bleed | boards |
| Tags on the boards: the gang's tag, NLG throw-up, a fish mark, a crown mark | paint | outdoor fence |
| Moon, stars | — | sky |

| Figure (all walking right, paws on the rail) | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Tilly | 1 | 2 | 4 | 1 | collar + tag; stud in the near (right) ear; fishbone on the near foreleg ✓ |
| Biscuit | 1 | 2 | 4 | 1 | do-rag knotted at the back; chain; sign on the near (right) shoulder; the notched left ear is the far one ✓ |
| Velvet | 1 | 2 | 4 | 1 | the white sock on the far (left) forepaw; rim ✓ |
| Mags | 1 | 2 | 4 | 1, kinked | kerchief; sardine on the near hip; hoop on the far ear ✓ |
| Pip | 1 | 2 | 4 | 1, black tip | black right ear and right flank (near side); shoulder spot; kerchief; cap ✓ (**Fixed**: was mirrored) |

### ch-rolling — the dice
| Object | Contact points | Supported by |
|---|---|---|
| Rug | lies flat | floor |
| 3 dice (3, 6, 4), drawn big as the chapter's emblem | bases, with shadows | rug |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Tilly (sitting, tough squint at the six) | 2 | 2 | 4 | 1 | collar; stud and fishbone on the viewer's left ✓ |
| Pip (crouched to pounce, facing right) | 1 | 2 | 4 | 1 | right side: black ear and flank ✓ |

### ch-mood — Broom and Cuddle
| Object | Contact points | Supported by |
|---|---|---|
| Broom | bristles on the floor; handle held in a clip screwed to the wall | floor; wall clip |
| Pink cushion | lies on the floor | floor |
| Labels BROOM (Broom red), CUDDLE (Cuddle pink) | text on the wall | — |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Velvet (sitting, innocent) | 2 | 2 | 4 | 1 | star; sock on the viewer's right; rim ✓ |

### ch-round — the hallway
| Object | Contact points | Supported by |
|---|---|---|
| Door, ajar (its top out of the frame) | hinges | frame |
| Legs walking in, 2 shoes | soles | floor; cropped by the top edge |
| Wall clock | hangs on a nail | wall |
| Shelf with 3 jars | shelf on 2 brackets with struts screwed to the wall (**Fixed**: bare pegs); jars inside the shelf's length | wall; shelf |
| Potted plant | pot on the floor; every stem grows out of the soil (**Fixed**: stems floated above it) | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Mags (creeping low along the skirting, facing right) | 1 | 2 | 4 | 1, low | kerchief; sardine on the near hip ✓ |

### ch-instincts
| Object | Contact points | Supported by |
|---|---|---|
| Table | 2 legs | floor (shadow) |
| Glass, near the edge | base inside the table top's outline | table top |
| Cardboard box, flaps open; its front wall over Mags's lower half | base | floor |
| High shelf | 2 brackets with struts | wall |
| Toy mouse with its string tail | lies flat | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks |
|---|---|---|---|---|---|
| Velvet (on the table, eyeing the glass, facing right) | 1 | 2 | 4 | 1 | white sock on the far forepaw; rim ✓ |
| Mags (sitting in the box) | 2 | 2 | hidden by the box front | hidden | kerchief; hoop on the viewer's right ✓ |
| Tilly (curled on the shelf, within its length) | 1 closed | 2 | paws tucked | 1 | collar ✓ |

### ch-prize
| Object | Contact points | Supported by |
|---|---|---|
| Counter | plinth | floor |
| The roast chicken (the book's one chicken design) on its plate | plate's foot inside the worktop's outline (**Fixed**: plates overhung) | worktop |
| Big cardboard box, flaps open | base | floor |
| Toy mouse | lies flat | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Biscuit (sitting, gazing up at the chicken) | 2 | 2 | 4 | 1 | notch on the viewer's right; do-rag; chain; both tattoos on their sides ✓ |
| Tilly (sizing up the box, facing left) | 1 | 2 | 4 | 1 | left side: collar; the stud and fishbone are on her far (right) side, not shown ✓ |
| Pip (stalking the mouse, facing right) | 1 | 2 | 4 | 1 | right side ✓ |

### ch-caught — Shoo!
| Object | Contact points | Supported by |
|---|---|---|
| Back door frame; the night garden beyond (lawn, moon, stars) | frame in the wall | floor |
| Door leaf, swung open into the room | hinge side of the frame | frame |
| Sweeper's legs, 2 shoes | soles | floor; cropped by the top edge |
| Broom: handle runs out of the top edge (held above the frame), bristles on the floor, mid-sweep | hands above the frame; floor | — |
| Motion lines, dust puffs | puffs on the floor | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Biscuit (running flat out, facing right, a drumstick in his jaws, hanging from the bone) | 1 | 2 | 4 (one hind paw on the floor) | 1 | right side: sign tattoo; do-rag; chain ✓; body compact (**Fixed**) |

### ch-residents
| Object | Contact points | Supported by |
|---|---|---|
| Window (night) | sill fixed to the wall | wall |
| Sofa | feet | floor |
| Robot vacuum | its base | floor |
| Parrot stand and cage: the stand's feet on the floor; its arm ends in a J-hook; the cage's brass ring passes round the hook's bend; every bar runs from the base ring to the dome; the perch is fixed to the bars (**Fixed**: the ring sat beside the hook and some bars stopped short) | feet; hook; perch | floor; stand |

| Figure | Eyes | Ears | Legs | Tail | Notes |
|---|---|---|---|---|---|
| House cat (sitting on the sofa seat) | 2 | 2 | 4 | 1 | cream and white, green collar, no tag: not a gang cat, not Pom-Pom ✓ |
| Pudding (standing, facing left) | 1 | 2 | 4 | 1 | old spaniel; distinct from Noodle ✓ |
| Captain (on the perch) | 1 | — | 2 feet on the perch | 1 | ✓ |

### ch-the-block — the roof ridge
| Object | Contact points | Supported by |
|---|---|---|
| Far roofs with lit attic windows; moon | — | — |
| Our roof: slates, the ridge line | — | — |
| Chimney with its cap, the gang's tag on its bricks | base | roof (outdoor brick) |
- **Fixed**: the old version of this head had a wheelie bin balanced on one wheel. The head is now the
  roof ridge with no bin, and the shared bin drawing has its front foot on the ground (ch-welcome,
  spot-bin).

| Figure (all on the ridge line) | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Velvet, Tilly, Biscuit (sitting) | 2 | 2 | 4 | 1 | each as on the sheets ✓ |
| Pip (curled asleep) | 1 closed | 2 | tucked | 1 | ✓ |
| Mags (walking right) | 1 | 2 | 4 | 1, kinked | right side ✓ |

### ch-storyteller — the cut-away wall
| Object | Contact points | Supported by |
|---|---|---|
| Standard lamp: base, pole, shade above the frame with its glow | base | floor |
| Wing chair | feet | floor |
| Wall clock | nail | wall |
| Legs standing, 2 shoes | soles | floor; cropped by the top edge |
| The wall between, cut through and hatched | — | — |
| Counter, the chicken on its plate | plate inside the worktop's outline | worktop |
| Pedal bin | base | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Tilly (creeping right along the worktop) | 1 | 2 | 4 on the worktop | 1 | right side: stud, fishbone, collar ✓ |
| Biscuit (sitting on watch by the wall) | 2 | 2 | 4 | 1 | ✓ |

### ch-making-a-house — seen from above (one projection throughout)
| Object | Contact points | Supported by |
|---|---|---|
| Table boards and grain | — | — |
| Sheet of paper with its shadow, the pencil plan, labels, entrance arrows, the dashed route and X | lies flat | table |
| Pencil | wholly on the paper, with its shadow | paper |
| 3 dice (6, 4, 2), top faces up | lie flat, with shadows | table |
| Mug of tea, from above (rim, tea, handle) | lies flat, shadow | table |

| Figure | Count | Notes |
|---|---|---|
| Mags's paw, reaching in from the bottom edge to bat a die | 1 foreleg, 1 paw with toes | ginger tabby stripes ✓ |

### ch-getaway — the getaway (new, 2026-10-21)
| Object | Contact points | Supported by |
|---|---|---|
| Night sky, moon | — | — |
| Fence boards; top rail (**Fixed**: the rail sat 10 units above the cats' paws; it is now level with them) | feet below the band | ground |
| Tags on the boards: the gang's tag, a paw-print trail, MEOW throw-up | paint | outdoor fence |
| A dropped slice of cake, falling past the fence (motion lines) | — | falling |
| The warden: from the chest up, inside the frame, clipped cleanly at the band's bottom edge (**Fixed**) | — | ground below the band |
| His net: pole held in both hands, the ring on the pole's end, the net hanging from the ring; it swipes just behind Pip and clear of her (**Fixed**: it overlapped her) | both hands | the warden |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Velvet (running right, out in front) | 1 | 2 | 4, one hind paw on the rail | 1 | sock on the far forepaw; rim ✓ |
| Mags (running, a gold watch by its strap) | 1 | 2 | 4 | 1, kinked | right side: sardine; kerchief; hoop on the far ear ✓ |
| Biscuit (running, a drumstick) | 1 | 2 | 4 | 1 | sign tattoo; do-rag; chain ✓ |
| Tilly (running, a slice of cake) | 1 | 2 | 4 | 1 | stud; fishbone; collar ✓ |
| Pip (tripping over her kerchief, pitched forward, no paw on the rail) | 1 | 2 | 4 | 1 | right side; kerchief; cap ✓ |
| The warden | 1 (profile) | 1 | 2 arms, 2 hands (4 fingers and a thumb each, closed round the pole) | — | cap with paw badge, moustache, green jacket ✓ |

### ch-number-12 — Mr Pell's kitchen
| Object | Contact points | Supported by |
|---|---|---|
| Door, ajar; Mr Pell's legs in the doorway, 2 shoes | hinges; soles | frame; floor |
| Key hook: a small board screwed to the wall, one hook, a ring of keys hanging from it | screws; hook | wall |
| Shelf with 3 jars | 2 brackets with struts | wall |
| Counter, splashback tiles, the window above (lower sash raised; top out of the frame) with its sill fixed to the wall | plinth; sill | floor; wall |
| Tap, kettle | bases | worktop |
| Chicken in its foil on a plate | plate inside the worktop's outline | worktop |
| Fridge (top out of the frame) | base | floor |
| Table | 2 legs | floor |
| Pedal bin | base | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Tilly (creeping right along the worktop toward the chicken) | 1 | 2 | 4 | 1 | right side: stud, fishbone, collar ✓ |
| Mags (sitting under the table) | 2 | 2 | 4 | 1 | kerchief; hoop on the viewer's right ✓ |
| Biscuit (by the bin, facing left) | 1 | 2 | 4 | 1 | left side: notch in the near ear; MUM on the near shoulder ✓ |

### ch-okafor-box — the Okafors' hall
| Object | Contact points | Supported by |
|---|---|---|
| Front door, shut (top out of the frame) | hinges | frame |
| Coat rail: 3 hooks, 2 coats hanging from them, 1 hook empty | screws; hooks | wall |
| Tayo's ball | rests on the floor | floor |
| Doorway into the kitchen; the kitchen's wall, floor and skirting beyond | frame | — |
| Dog basket (back, front) with Noodle asleep inside | base | kitchen floor |
| Huge sealed delivery box: tape, a label, two "this way up" arrows | base | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Biscuit (shoving the left end, head down, facing right) | 1 | 2 | 4 | 1 | right side: sign tattoo; do-rag; chain ✓ |
| Mags (shoving the right end, facing left) | 1 | 2 | 4 | 1, kinked | left side: hoop in the near ear; kerchief ✓ |
| Tilly (riding on top of the box) | 2 | 2 | 4 | 1 | collar; stud and fishbone on the viewer's left ✓ |
| Noodle (asleep in the basket) | 1 closed | 2 | 2 front + folded hind | 1 | sausage dog, ginger; distinct from Pudding ✓ |

### ch-wendell-mouse — Grandpa Wendell's hall
| Object | Contact points | Supported by |
|---|---|---|
| Front door, shut | hinges | frame |
| Coat rail with one coat | hook | wall |
| Kitchen door, open; Grandpa's legs going through it, 2 shoes | hinges; soles | frame; floor |
| Front window (night), sill fixed to the wall | sill | wall |
| Radiator under it | 2 feet | floor |
| Robot vacuum (partly in the bleed) | base | floor |
| Pet-shop paper bag, standing open, the red catnip mouse peeking out of its mouth (**Fixed**: the bag was closed with the mouse on top of it) | base | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Pom-Pom (sitting on the sill, within its length, glaring down) | 2 | 2 | 4 | 1 | large fluffy silver longhair, 1.2×, no collar ✓ |
| Pip (stalking the bag, facing right) | 1 | 2 | 4 | 1 | right side; kerchief; cap ✓ |
| Velvet (sitting, waiting) | 2 | 2 | 4 | 1 | star; sock on the viewer's right; rim ✓ |

### ch-birthday-cake — Number 5 at the party
| Object | Contact points | Supported by |
|---|---|---|
| Bunting: a string with flags | pinned at both ends | wall |
| Parrot stand and cage (as ch-residents); speech bubble PARTY! pointing at the cage | feet; hook | floor; stand |
| Table with its cloth | 2 legs | floor |
| Chocolate birthday cake with candles, on its board | inside the table top's outline | table |
| Chair (facing left) | 4 legs (2 showing) | floor |
| 2 balloons, their strings tied to the chair's back | strings | chair back |
| Dad's legs, 2 shoes | soles | floor; cropped by the top edge |
| Stack of presents | bottom present on the floor, the top one within the bottom one's outline | floor |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Velvet (sitting on the chair seat) | 2 | 2 | 4 | 1 | star; sock on the viewer's right; rim ✓ |
| Pip (crouched under the table, facing right) | 1 | 2 | 4 | 1 | right side ✓ |
| Captain (in the cage) | 1 | — | 2 feet on the perch | 1 | ✓ |

### ch-marchetti-salmon — Chef Marchetti's kitchen
| Object | Contact points | Supported by |
|---|---|---|
| Utility room door, open (dark beyond) | hinges | frame |
| Pan rail with 3 pans | rail on its end brackets; each pan on an S-hook | wall; rail |
| The island counter; the salmon wrapped in paper and tied with string | plinth; the parcel inside the worktop's outline | floor; worktop |
| Cooker; a steaming pot on the hob | base; pot on the hob | floor; cooker |
| The chef's legs (white trousers), 2 shoes | soles | floor; cropped by the top edge |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Brutus (barking in the doorway, facing right) | 1 | 2 | 4 | 1 | enormous mastiff, about twice a cat's height (**Fixed**: made clearly bigger); his eye sits clear of the black ear (**Fixed**: the ear patch covered it); the barking mouth sits inside the muzzle (**Fixed**: the mouth line stuck out past the head) |
| Biscuit (squaring up to him, facing left) | 1 | 2 | 4 | 1 | left side: notch in the near ear; MUM on the near shoulder; do-rag; chain ✓ |
| Mags (creeping right along the island) | 1 | 2 | 4 | 1, kinked | right side: sardine ✓ |

---

## Cover, part pages, tags

### cover (612×792) — the getaway (new design, 2026-10-21)
| Object | Contact points | Supported by |
|---|---|---|
| Night sky with stars (the top third clear for the title), moon | — | — |
| The backs of the houses beyond the fence, 2 lit windows | — | behind the fence |
| Garden fence: boards and top rail | feet | the pavement line |
| Tags on the fence: the gang's tag, NLG throw-up, a fish mark | paint | outdoor fence |
| Pavement, kerb, road | — | — |
| Street lamp: base, post, head, glow | base | pavement |
| The van: wholly in the picture, both wheels on the road, contact shadow, ANIMAL CONTROL whole inside its rear panel (**Fixed**: cut by the left edge), the gang's tag small on its front panel | wheels | road |
| The warden: one boot on the road (shadow), the other lifted mid-stride | front boot | road |
| His net on its pole, held in both hands | hands | the warden |
| The drumstick Pip dropped, falling straight into the net (motion lines) | — | falling |
| Dotted leap arcs, a burst of surprise by Pip's face | — | graphic |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Tilly (springing off the fence, facing right, a slice of layer cake in her teeth) | 1 | 2 | 4 | 1 | right side: stud, fishbone, collar + tag ✓ |
| Biscuit (top of his leap, the whole roast chicken by one drumstick) | 1 | 2 | 4 | 1 | right side: sign tattoo; do-rag; chain; the notched ear is the far one ✓ |
| Mags (coming down, a gold watch by its strap) | 1 | 2 | 4 | 1, kinked | right side: sardine; kerchief; hoop on the far ear ✓ |
| Velvet (already away, running right along the pavement) | 1 | 2 | 4, one hind paw on the pavement (shadow) | 1 | white sock on the far forepaw; rim ✓ |
| Pip (head over heels at the fence top, just ahead of the net) | 1 | 2 | 4 | 1 | right side: black ear and flank; kerchief; cap ✓ |
| The warden | 1 (profile) | 1 | 2 arms, 2 hands (4 fingers and a thumb each), 2 legs, 2 boots | — | cap with paw badge, moustache, green jacket, reflective band ✓ |

- **Fixed** (2026-10-21): the leaping cats' bodies were stretched to about 4 heads long and Pip's read as
  a long tube; every runner and leaper is now about 2.5–3 heads long (Pip shorter), one continuous outline.
- **Fixed**: Mags's head ran outside the 8.75in POD cover trim; the gang sits within the safe area.
- The four leaping cats are in the air, so they cast no shadows; the dotted arcs show where they jumped.

### orn-tag (140×110; part pages, credits page, back cover)
- The gang's tag, sprayed: 1 head, 2 ears, 2 whiskers each side, one 9, 2 drips each ending in a drop;
  the page sets its colour. A printed mark, not an object. Nothing is cut by the frame.

### tag-small (140×92; new, 2026-10-21)
| Object | Contact points | Supported by |
|---|---|---|
| The same tag, small and clean: the head outline, 2 ears, the 9, 2 whiskers each side, as bold flat strokes in one colour (`currentColor`); no overspray, no drips | a printed mark | the page |
- Rendered at 0.3in, 0.45in and 0.6in on cream and on night blue: the head, both ears and the 9 read
  at 0.3in.

### part-gang — Part One
| Object | Contact points | Supported by |
|---|---|---|
| Framed night panel, moon | — | — |
| Garden wall with coping, right across | — | ground |
| Tags on the wall: the gang's tag, NLG, a crown mark, a fish mark | paint | outdoor brick |
| Street lamp | base | ground below the frame |

| Figure (all on the coping) | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Mags (on lookout, facing left, chin up) | 1 | 2 | 4 | 1, kinked | left side: hoop in the near ear; kerchief ✓ |
| Pip (sitting, big grin) | 2 | 2 | 4 | 1 | ✓ |
| Velvet (sitting, innocent) | 2 | 2 | 4 | 1 | ✓ |
| Biscuit (sitting, chain on show) | 2 | 2 | 4 | 1 | ✓ |
| Tilly (sitting, leaning on the lamp post) | 2 | 2 | 4 | 1 | collar; stud and fishbone on the viewer's left ✓ |

### part-robbery — Part Two
| Object | Contact points | Supported by |
|---|---|---|
| The back of the house: roof edge, gutter, brick wall, back door | frame | ground |
| Cat flap: its opening, the flap swung out toward us on its top hinge, swing lines | hinge | door |
| Fence; a paw-print trail and the gang's tag on it | boards | ground (outdoor) |
| Grass | — | — |
| The whole roast chicken, dragged: its back end on the ground (contact shadow), tipped up at the front by the drumstick in Biscuit's teeth; scuff marks behind it (**Fixed**: the author's call: Biscuit drags the chicken, it doesn't float from his mouth) | ground; the gripped drumstick | ground; Biscuit's teeth |

| Figure | Eyes | Ears | Legs | Tail | Marks and gear |
|---|---|---|---|---|---|
| Biscuit (braced, leaning back, hauling, facing right) | 1 | 2 | 4, all on the grass | 1 | right side: sign tattoo; do-rag; chain ✓ |
| Pip (trotting after him) | 1 | 2 | 4 | 1 | right side ✓ |
| Tilly (walking the fence's top rail) | 1 | 2 | 4 on the rail | 1 | right side ✓ |

### part-storyteller — Part Three
- The house: roof on the wall, window sills on the wall, the front door with its cat flap; the person at
  the upstairs window is lit from behind, head and shoulders only, clipped to the window, with the
  glazing bar and curtains in front.
- The hedge stands on the ground. Five pairs of eyes in the gang's colours: green (Tilly), amber
  (Biscuit), amber (Velvet), green (Mags), blue (Pip), 2 eyes each with slit pupils.
- No graffiti on the house (it is someone's home front).

### part-houses — Part Four
| Object | Contact points | Supported by |
|---|---|---|
| Number 12: roof, brick front, window, door with cat flap, the number 12 | door on the pavement | pavement |
| Number 31: roof, painted front, 2 windows, door (well below the sills), garage door, the number 31 | — | pavement |
| Grandpa Wendell's: roof, cream front, window with Pom-Pom's fluffy shape behind the glazing bar, door clear of the sill | — | pavement |
| Number 5: roof, brick front, 3 windows, door clear of the sills, the number 5; gatepost with 2 balloons tied to it | gatepost | pavement |
| Chef Marchetti's: roof; the skylight set inside the left-hand roof slope, propped open (**Fixed**: it stuck up out of the roof); windows; door; the bedroom balcony (slab and railing) on the left-hand side wall at the upstairs floor, matching the map's balcony door off the Bedroom | wall | pavement |
| The tree between Number 5 and Marchetti's, its branch reaching the balcony | trunk on the pavement | ground |
- **Fixed**: door frames ran into window sills on Numbers 31 and 5 and Wendell's; the doors are shorter
  and moved, Number 5 is narrower, and the tree moved to stand between the houses.

---

## Spots (400×300; the back-cover panel too)

| Piece | Objects → what supports them | Figures (eyes / ears / legs / tail; marks and gear) |
|---|---|---|
| spot-back | wall patch with skirting; window with its sill on the wall; pink cushion → floor; Biscuit → cushion; plate → floor; the bones (rib cage, 2 drumstick bones, a wishbone) lie within the plate's outline | Biscuit curled asleep: 1 closed / 2 / tucked / 1; do-rag ✓ |
| spot-curl | wall patch; radiator on 2 feet → floor, warmth rising; pink cushion → floor; Pip → cushion | Pip curled asleep ✓ |
| spot-bin | alley wall with coping; MEOW throw-up and an arrow mark on the bricks (outdoor); 2 wheelie bins, wheels and front feet → ground; a paw-print tag on the green bin | Tilly sitting on the green bin's lid: 2 / 2 / 4 / 1; collar ✓ |
| spot-purrfect | rug lies flat → floor; 2 dice, both 6 → rug (shadows); the shaker cup lying on its side, mouth toward the dice → rug (**Fixed**: it was cut by the frame); 3 sparkles (graphic) | Mags sitting, very pleased: 2 / 2 / 4 / 1; kerchief; hoop on the viewer's right ✓ |
| spot-mug | wall patch; side table: round top on one central leg and a foot → floor; a photo frame standing on the top; the mug lying on its side (handle up, mouth toward us with tea in it) → floor; the puddle and drops lie flat | Velvet sitting on the table top (within it): 2 / 2 / 4 / 1; star, sock, rim ✓ |
| spot-wool | knitting basket → floor, a green ball in it with 2 needles stuck in that ball; blue ball → floor (shadow); its loose end comes out from under the ball and lies flat along the floor to Pip's paws (**Fixed**: the strand floated) | Pip crouched to pounce: 1 / 2 / 4 / 1 ✓ |
| spot-box | the shoebox → floor, Biscuit squeezed in it, squeeze lines by his haunches; the lid lies flat on the floor (**Fixed**: the box and lid ran off the frame) | Biscuit sitting: 2 / 2 / front legs and haunches / 1; notch on the viewer's right; sign and MUM on their sides; chain; do-rag ✓ |
| spot-fish | seen from above: floor tiles; the fish-market paper and its string lie flat on the tiles; plate (shadow) → tiles; the skeleton (head, spine, ribs, tail fin) lies flat within the plate | — |
| spot-vacuum | wall patch; robot vacuum → floor; motion lines; a lost sock lying on the floor ahead | Pip sitting on the vacuum's lid ✓ |
| spot-broom | wall patch; broom on its bristles → floor, handle in a wall clip; dustpan standing on its edge on the floor, leaning on the wall | Tilly slinking low, facing right: 1 / 2 / 4 / 1; stud, fishbone, collar ✓ |
| spot-door | patch of brick wall; front door with cat flap → doorstep → pavement; doormat on the step; milk bottle on the step (shadow) | Velvet sitting on the pavement: 2 / 2 / 4 / 1 ✓ |
| spot-pompom | wall patch; framed picture of Pom-Pom hanging on its wire from a nail; her mat flat on the floor; her bowl (gold band, kibble) → mat | Pom-Pom sitting, large and fluffy: 2 / 2 / 4 / 1 ✓ |
| spot-pudding | his empty bowl → floor (shadow); a little white heart (**Fixed**: was Cuddle pink) | Pudding lying awake, tail thumping: 1 / 2 / 4 / 1; Biscuit sitting: 2 / 2 / 4 / 1 ✓ (**Fixed**: Biscuit was cut by the frame; the lino slab under Pudding was removed) |
| spot-noodle | dog basket → floor, Noodle asleep inside; Tayo's ball → floor; sleepy breath lines | Noodle: 1 closed / 2 / 4 / 1; Mags tiptoeing, facing left: hoop in the near ear ✓ (**Fixed**: Mags was cut by the frame) |
| spot-parrot | stand's feet → floor; the cage on the J-hook by its ring; a tea towel thrown over the dome, draped from the top down one side | Captain peering out: 1 / — / 2 feet on the perch / 1; Velvet strolling off, facing right: sock on the far forepaw ✓ |
| spot-paws | seen from above: floorboards; the plant pot on its side, soil spilled out, the plant's stems in the soil; the prints are mud marks on the boards (one cat walking, alternate left and right, each 1 pad and 4 toes) | — |
| spot-rivals (new, 2026-10-21) | alley wall with coping (outdoor); the rival crew's scruffy fish-skeleton scrawl in dull green; the gang's tag sprayed big over it, a fresh drip; the spray can lying on its side on the pavement (shadow), a dot of paint by its nozzle | Mags sitting, tough squint: 2 / 2 / 4 / 1; paint on her front paws; kerchief; hoop on the viewer's right ✓ |

---

## Reference sheets and portraits
- **ref-tilly, ref-biscuit, ref-velvet, ref-mags, ref-pip** (1000×530): each shows the cat walking
  facing right (its right side), walking facing left (its left side) and sitting from the front, with
  captions saying which side shows, and two lines spelling out every mark and piece of gear with its
  side. Checked at zoom: Biscuit's notch is on the near ear facing left, the far ear facing right and the
  viewer's right from the front; MUM shows facing left, the sign facing right; Tilly's stud and fishbone
  show facing right; Mags's hoop shows facing left; Velvet's white sock is on the near forepaw facing
  left; Pip's black ear and flank show facing right, her ginger face facing left.
- **ref-residents** (1000×460; new): Pudding, Noodle, Brutus (barking), Pom-Pom and a house cat, each
  standing or sitting on the ground line with a shadow, captioned. **Fixed**: Noodle's tail overlapped
  Pudding's head and Pom-Pom touched the house cat; respaced.
- **ref-warden** (1000×460; new): the warden mid-stride (one boot on the ground) with his net, and the
  van with both wheels on the ground. **Fixed**: the warden's captions ran off the left edge.
- **portrait-tilly … portrait-pip** (400×400): each a front sitting cat in a lamplit brick cameo, clear
  of the ring. Marks and gear on the correct sides ✓. Pip is drawn at 0.82×.

## Maps (plan view)
| Map | Floors | Checked |
|---|---|---|
| map-number-12 | ground floor | entrances 1–3 on the walls they cross; the kitchen–utility door drawn shut with its dashed swing clear of the labels; star (round 2); THE DEN (downstairs loo) |
| map-okafor-box | ground floor, upstairs | entrances; stairs icons inside their rooms; stars; THE DEN |
| map-wendell-mouse | ground floor, upstairs, cellar | entrances 1–4 (4 is the Spare bedroom window, matching the room's name); the cellar door at the top of the stairs drawn shut with its swing; stars (rounds 1 and 4); THE DEN (bathroom); the legend clear of the ground floor (**Fixed**) |
| map-birthday-cake | ground floor | entrances; star; THE DEN |
| map-marchetti-salmon | ground floor, upstairs | entrances 1–4 (3 the balcony door off the Bedroom's left wall, 4 the skylight as a dashed square on the Landing); the kitchen–utility door drawn shut with its swing; star (round 1); THE DEN (study); regenerated from the current house data (**Fixed**: it was stale) |

- One scale on every map: 1028 units across the full 7.14in figure width, so a grid square is 36pt
  (half an inch). **Fixed**: the maps were drawn at different scales. If a map figure is ever printed
  narrower than the full text width, its scale and its smallest text change with it.
- All text in Alegreya Sans (room names in Fraunces); the smallest is 7.5pt in print. **Fixed**: labels
  under 7pt, a generic sans-serif font, straight apostrophes ("Pom-Pom’s", "Brutus’s" now curly), "WAYS
  IN" (now ENTRANCES), door swings drawn into room labels, label collisions, inset labels, and loose
  space round the plans (each viewBox is cropped to its content).
- Every room label sits inside its room; entrance markers sit outside the wall they cross with 48 units
  clear; the closed-door rule is in the legend.

## Placeholders
- **placeholder, placeholder-wide, placeholder-cover**: generator tooling only (now in Alegreya Sans).
  No chapter uses them.

## Not in the book yet
- `ch-getaway`, `spot-rivals`, `tag-small`, `ref-residents`, `ref-warden` are built and audited above;
  the author places them in the text.

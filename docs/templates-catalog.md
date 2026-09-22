# Template catalog

Ideas only. Do not implement this list in one pass. **Live:** `quiet-luxury` on `/sofia` (adult birthday), `paper-envelope` on `/ivan-maria` (wedding), `dark-editorial` on `/kira` (evening gala), `garden-daylight` on `/olga-nikita` (garden wedding), `polaroid-story` on `/lera-max` (young couple, city wedding), `winter-frost` on `/dasha-ilya` (winter wedding).

Each row is a **skin**: different composition, motion, and audience — not a recolor of Quiet luxury. All rows use the same [content schema](./content-schema.md).

| # | Id | Name | For | What makes it different | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | `quiet-luxury` | Quiet luxury | Adult birthday | Cream, burgundy, gold; WebGL silk + grain; editorial serif; full-page scroll | Live |
| 2 | `paper-envelope` | Paper envelope | Classic wedding | First screen is a seal/envelope; page “opens” into a card; paper texture, little motion | Live |
| 3 | `dark-editorial` | Dark editorial | Evening gala, fashion-forward | Espresso canvas, ivory type, champagne gold, film stills, slow ken-burns, thin foil hairlines | Live |
| 4 | `garden-daylight` | Garden daylight | Garden or countryside wedding | Cotton paper, botanical etchings, arch photos, daylight sans + soft serif | Live |
| 5 | `minimal-swiss` | Minimal Swiss | City hall, design crowd | Grid, one accent color, huge type, almost no decoration, sharp rules | Idea |
| 6 | `polaroid-story` | Polaroid story | Young couple | Tilted prints, handwritten captions, horizontal snap gallery, playful type | Live |
| 7 | `gold-deco` | Gold deco | Formal banquet | Geometry, metallic lines, symmetrical lockup, 1920s poster hero | Idea |
| 8 | `winter-frost` | Winter frost | New Year, winter wedding | Ivory paper and candlelight on the page, frost and snow only behind the glass | Live |
| 9 | `seaside` | Seaside | Destination, coast | Horizon hero, salt-washed blues, wide type, map as the visual center | Idea |
| 10 | `kids-birthday` | Kids birthday | Children’s party | Bright, large tap targets, short copy, illustration-led; countdown still required | Idea |
| 11 | `corporate-evening` | Corporate evening | Company dinner | Strict hierarchy, agenda block, speakers optional later, restrained color | Idea |
| 12 | `folk-linen` | Folk linen | Countryside, tradition | Linen ground, folk motif, warm wood, slower serif, craft not luxury | Idea |
| 13 | `neon-night` | Neon night | Club, afterparty | Dark UI, one neon accent, kinetic type, gallery as posters | Idea |
| 14 | `watercolor` | Watercolor | Soft romantic | Painted washes, irregular edges, no WebGL; illustrations over photos | Idea |
| 15 | `newspaper` | Newspaper | Witty urban | Columns, masthead date, “edition” kicker, black/red ink | Idea |
| 16 | `zen-stone` | Zen stone | Small intimate | Lots of empty space, stone gray, one photo at a time, almost no gold | Idea |
| 17 | `vintage-film` | Vintage film | Nostalgia | 4:3 frames, light leaks, tickering countdown, grain heavier than #1 | Idea |
| 18 | `tropical` | Tropical | Summer villa | Saturated botanicals, shade/sun contrast, rounded type, lazy scroll | Idea |
| 19 | `sacred-minimal` | Sacred minimal | Church / temple adjacent | Quiet vertical rhythm, candle motif, no party clutter, long reading column | Idea |
| 20 | `afterparty-ticket` | Afterparty ticket | Second event, club invite | Stub/tear layout, barcode joke, time-first hero, RSVP as “claim ticket” | Idea |

When implementing, add `templateId` matching the **Id** column and keep fields from the schema. Next catalog skin is **one** other row — not the whole table.

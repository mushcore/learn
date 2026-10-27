# Path of Exile 1 fact bank

Covers Path of Exile 1 version 3.29, the Allflame challenge league (released 2026-07-24, scheduled to end 2026-11-09 per poewiki.net), checked on 2026-10-27. Mechanics come from poewiki.net pages read on 2026-10-27 (each entry gives the page's last-edited date). Prices and ladders are snapshots pulled on 2026-10-27 from the poe.ninja economy API and the official pathofexile.com ladder API; past-league price series cover Mirage (3.28) and Keepers (3.27). Note that 3.29 changed sockets: any gem fits any socket colour, and sockets are white by default.

### poe1.league.current
The current PoE1 challenge league is Allflame, release version 3.29.0, released 2026-07-24 7:00:00 PM and ending 2026-11-09 10:00:00 PM (15.4286 weeks).
| Challenge league | Release date | End date | Total weeks | Release version |
|---|---|---|---|---|
| Allflame | 2026-07-24 7:00:00 PM | 2026-11-09 10:00:00 PM | 15.4286 | 3.29.0 |
| Mirage | 2026-03-06 7:00:00 PM | 2026-07-20 10:00:00 PM | 19.4286 | 3.28.0 |
| Keepers | 2025-10-31 7:00:00 PM | 2026-03-02 9:00:00 PM | 17.4286 | 3.27.0 |
| Mercenaries | 2025-06-13 8:00:00 PM | 2025-10-27 9:00:00 PM | 19.4286 | 3.26.0 |
| Settlers | 2024-07-26 8:00:00 PM | 2025-06-09 10:00:00 PM | 45.4286 | 3.25.0 |
Source: https://www.poewiki.net/wiki/League (poewiki.net). Version: PoE1 3.29.0 Allflame league, table as shown 2026-10-27. Checked: 2026-10-27. Trust: wiki.
Notes: poe.ninja's economy leagues endpoint (https://poe.ninja/poe1/api/economy/leagues) lists "Allflame" first, which confirms it is the current challenge league. The wiki gives league lengths in weeks; there is a dataset of past league lengths in the same table (Onslaught 0.11.0 onward).

### poe1.vaal.gem-outcomes
A Vaal Orb used on a skill gem has four outcomes of equal weight (1/4 each): change the level by one, change the quality by 1 to 10, turn it into its Vaal version, or no effect. If level or quality is chosen, increase and decrease each have chance 1/2.
| Outcome | Probability |
|---|---|
| +1 gem level | 1/8 |
| -1 gem level | 1/8 |
| + (1-10) quality | 1/8 |
| - (1-10) quality | 1/8 |
| Becomes Vaal skill gem (or gains the base Vaal skill if transfigured) | 1/4 |
| No effect (only corrupted) | 1/4 |
Source: https://www.poewiki.net/wiki/Vaal_Orb (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-09-06). Checked: 2026-10-27. Trust: wiki.
Notes: The page states "Each effect has equal weight, meaning there is 1/4 chance on each possible effect. If quality or level is chosen, there is an equal 1/2 chance to increase or decrease the value", and "The chance of a gem exceeding the gem level cap is 1/8 (or 12.5%)". Quality can reach at most 23%. The page does not give how the 1-10 quality amount is distributed. The 1/8 rows are the page's 1/4 times 1/2. A Vaal Orb sold for 0.3195 chaos on 2026-10-27 (see poe1.price.currency-snapshot), which makes this usable for expected cost per +1 level.

### poe1.vaal.equipment-outcomes
A Vaal Orb on equipment applies one of four outcomes with equal chance: add a corruption implicit, turn one white socket non-white, reroll into a rare with six affixes and random sockets and links ("brick"), or no effect. On equipment that can hold six sockets, the chance of becoming a rare with six linked sockets is 1 in 144.
| Outcome | Probability |
|---|---|
| Gain a corruption implicit modifier | 1/4 |
| One white socket becomes non-white | 1/4 |
| Becomes rare, six random affixes, sockets and links rerolled | 1/4 |
| No effect (other than corrupted) | 1/4 |
Source: https://www.poewiki.net/wiki/Vaal_Orb (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-09-06). Checked: 2026-10-27. Trust: wiki.
Notes: Equal outcome weights and the 1/144 figure are cited on the wiki to Chris Wilson (GGG) statements from 2014 and 2015. Certain items (Tear of Purity, Voll's Vision) can instead transform; the page says that chance is unknown. The page also gives jewels four equal-chance outcomes.

### poe1.vaal.map-outcomes
A Vaal Orb on a map applies one of four outcomes, each about 24-25%: reroll with random affixes (a Tier 1-15 map then has a 50% chance to go up one tier), reroll into an eight-affix rare, add a Vaal implicit, or no effect.
Source: https://www.poewiki.net/wiki/Vaal_Orb (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-09-06). Checked: 2026-10-27. Trust: wiki.
Notes: The Tier 16 to Vaal Temple Map chance disagrees between pages: this page says 2% to 2.5%, and the Map page (https://www.poewiki.net/wiki/Map, last edited 2026-07-28) says "~10% chance" for Tier 16 to Vaal Temple. That number is left out of the statement (see Unverified). The ~24-25% figure is cited to a community spreadsheet, and the page gives no sample size.

### poe1.fusing.six-link-measured
A test of 100 000 Orbs of Fusing on a six-socket, 20% quality item found that the chance to six-link is about 0.1% (1 in 1000). There is a 95% chance that the mean number of orbs needed is between 836 and 1244. This means about a 77% chance to six-link within 1500 fusings and a 5% chance it takes more than 3000.
Source: https://www.poewiki.net/wiki/Orb_of_Fusing (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-07-26). Checked: 2026-10-27. Trust: measured (n = 100000).
Notes: n is the number of Orbs of Fusing used in the cited community test (the test's date is not given on the page). Each 1% item quality improves the result by 1%. A Fusing will not reroll an item that is already fully six-linked. Chris Wilson historically said the six-link odds were "very close to 1/1500", but that was before the quality change in 2.2.0. Good for geometric distribution, "at least one in n tries", and comparison with the bench price (poe1.fusing.bench-costs). An Orb of Fusing sold for 0.1098 chaos on 2026-10-27 (poe1.price.currency-snapshot).

### poe1.fusing.bench-costs
The Crafting Bench sets links for a fixed number of Orbs of Fusing.
| Effect | Cost |
|---|---|
| Two Linked Sockets | 1x Orb of Fusing |
| Three Linked Sockets | 3x Orb of Fusing |
| Four Linked Sockets | 5x Orb of Fusing |
| Five Linked Sockets | 150x Orb of Fusing |
| Six Linked Sockets | 1500x Orb of Fusing |
Source: https://www.poewiki.net/wiki/Orb_of_Fusing (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-07-26). Checked: 2026-10-27. Trust: wiki.
Notes: The wiki concludes that with the ~1/1000 measured rate, the 1500-fusing bench craft is "statistically not worthwhile" but removes variance. That makes it a clean expected value versus guaranteed cost comparison. On a corrupted item, each Fusing in the recipe also costs one Vaal Orb.

### poe1.sockets.count-weights
The number of sockets on a generated item is drawn by weight, subject to a minimum item level for each socket count.
| Number of sockets | Minimum ilvl | Weight (6S & 3S) | Weight (4S) |
|---|---|---|---|
| 1 | 1 | 50 | 100 |
| 2 | 1 | 120 | 90 |
| 3 | 2 | 100 | 80 |
| 4 | 25 | 30 | 30 |
| 5 | 35 | 5 | — |
| 6 | 50 | 1 | — |
Source: https://www.poewiki.net/wiki/Item_socket (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-09-01). Checked: 2026-10-27. Trust: wiki.
Notes: "6S & 3S" means item types that can have up to 6 or up to 3 sockets, and "4S" means up to 4 (boots, helmets, gloves). On a 6-socket-capable item with ilvl 50 or higher, all six weights apply (total 306). The page does not say if Jeweller's Orbs use the same weights; it only says they apply when an item is generated. Good for building a discrete distribution, E(X), and conditional probability given an ilvl cutoff. https://www.poewiki.net/wiki/Socket redirects to this page.

### poe1.sockets.colour-3-29
Since 3.29.0, sockets are white by default. Each socket generated has a small chance to roll red, green or blue, and that chance rises with item level. The colour chosen is proportional to the item's strength, dexterity and intelligence requirements. A Chromatic Orb rerolls colours and guarantees at least one coloured socket. Any gem can go in any socket, and a gem in a matching colour gains +10% quality.
Source: https://www.poewiki.net/wiki/Item_socket (poewiki.net). Version: PoE1 3.29.0 (wiki page last edited 2026-09-01). Checked: 2026-10-27. Trust: wiki.
Notes: Neither this page nor https://www.poewiki.net/wiki/Chromatic_Orb (last edited 2026-08-04) publishes a colour-probability formula. Pre-3.29 socket-colour calculators (e.g. Siveran's, linked from the Chromatic Orb page) do not reflect the 3.29 change. See Unverified. Vaal Orb and double corruption colour changes ignore attribute weights. A Chromatic Orb sold for 3.01 chaos on 2026-10-27.

### poe1.chaos.affix-count
A Chaos Orb rerolls all modifiers on a rare item. For regular items, the result has 4, 5, or 6 affixes in the ratio 8:3:1.
| Affix count | Weight | Probability |
|---|---|---|
| 4 | 8 | 8/12 |
| 5 | 3 | 3/12 |
| 6 | 1 | 1/12 |
Source: https://www.poewiki.net/wiki/Chaos_Orb (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-07-26). Checked: 2026-10-27. Trust: wiki.
Notes: The probability column is the page's 8:3:1 ratio divided by 12. A Chaos Orb is the price unit (1 chaos) on poe.ninja. Good for E(X) = expected affix count, variance, and geometric "chaos until six affixes".

### poe1.divine.reroll
A Divine Orb rerolls the numeric values of all explicit modifiers on a magic, rare or unique item, within each modifier's current tier. It does not change the tier and cannot reroll fractured modifiers. It is the "gold standard" trade currency, and the Chaos Orb is the lower-value "silver standard".
Source: https://www.poewiki.net/wiki/Divine_Orb (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-07-26). Checked: 2026-10-27. Trust: wiki.
Notes: The page does not say what distribution the reroll uses within a range (see Unverified), and gives no drop rate ("roughly dozens of times rarer than Chaos Orbs"). On 2026-10-27, 1 Divine = 340.0 chaos on the poe.ninja currency exchange (poe1.price.currency-snapshot).

### poe1.chance.unique-odds
An Orb of Chance turns a normal item into a random rarity. The wiki gives only rough odds of hitting a unique by unique tier: T5/T4 "1 in a few hundred", T3 "1 in a few thousands", T2 "1 in a couple tens of thousands", T1 "1 in multiple tens of thousands", T0 "1 in multiple hundreds of thousands". An Omen of Fortune guarantees a unique.
Source: https://www.poewiki.net/wiki/Orb_of_Chance (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-07-26). Checked: 2026-10-27. Trust: wiki.
Notes: These are order-of-magnitude phrases, not probabilities, so do not use them in a calculation. An Orb of Chance sold for 0.07062 chaos on 2026-10-27.

### poe1.damage.uniform-roll
Hit damage is an integer rolled uniformly between the minimum and maximum of the range. The expected value is the midpoint. A "Lucky" roll takes the better of two rolls and raises the average by about one sixth of (max - min). Examples on the page: a level 20 Fireball with min 1095, max 1643, average 1369, lucky average 1460.3 (+6.6%), and a level 20 Spark with min 63, max 1198, average 630.5, lucky average 819.6 (+30%).
Source: https://www.poewiki.net/wiki/Luck (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-07-07). Checked: 2026-10-27. Trust: wiki.
Notes: The page's own wording is: "Given an integer roll between min and max, the normal expected value is ..." and "...it is a byproduct of the fact our uniform variable only takes values over the integers". The formulas render as images, so they are not in the text. This is a discrete uniform. Lucky gives up to 33% more when min is near 0. The Damage page (https://www.poewiki.net/wiki/Damage, last edited 2025-07-28) adds that "The damage number rolled is rolled per hit, and not per skill use", and that each damage type in a hit has its own range roll. Teaches uniform E(X), and the max of two uniforms for Lucky.

### poe1.maps.tiers
There are 16 standard map tiers, each tied to an area level, and grouped by colour. Magic and rare monsters can drop maps 1 tier above the current map, and map bosses 2 tiers above. Three maps of the same tier sell to a vendor for one map one tier higher.
| Map tier group | Tier range | Map level range |
|---|---|---|
| Low (white) tier maps | 1-5 | 68-72 |
| Mid (yellow) tier maps | 6-10 | 73-77 |
| Top (red) tier maps | 11-16 | 78-83 |
Source: https://www.poewiki.net/wiki/Map (poewiki.net). Version: PoE1 3.29 Allflame (wiki page last edited 2026-07-28). Checked: 2026-10-27. Trust: wiki.
Notes: Atlas passives give a chance for Tier 1-15 maps found to be 1 tier higher: "Higher Map Tier Chance" 5% per node, and the "Shaping the Mountains/Skies/Valleys" notables 15%. An unidentified non-unique map gets a +30% item quantity bonus.

### poe1.price.currency-snapshot
poe.ninja currency-exchange prices in chaos for Allflame, pulled 2026-10-27.
| Currency | Price (chaos) |
|---|---|
| Chaos Orb | 1 |
| Divine Orb | 340.0 |
| Mirror of Kalandra | 384524 |
| Exalted Orb | 3.11 |
| Chromatic Orb | 3.01 |
| Vaal Orb | 0.3195 |
| Orb of Fusing | 0.1098 |
| Orb of Chance | 0.07062 |
| Jeweller's Orb | 0.0217 |
Source: https://poe.ninja/poe1/api/economy/exchange/current/overview?league=Allflame&type=Currency (poe.ninja). Version: PoE1 3.29 Allflame, snapshot 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 100).
Notes: n = 100 is the number of currency lines in the snapshot. The endpoint does not publish a sample size for each price. Values are the `primaryValue` field (primary currency = chaos). poe.ninja's older stash-based currency overview (https://poe.ninja/poe1/api/economy/stash/current/currency/overview?league=Allflame&type=Currency) gave Divine Orb chaosEquivalent 303.2 from 76 listings at 2026-10-27T20:19:43Z, so the two poe.ninja views differ by about 12%. The full list is in dataset poe1.data.exchange-currency-allflame. The old `/api/data/currencyoverview` route now returns 404.

### poe1.data.divine-chaos-allflame
Daily Divine Orb price in chaos for the Allflame league, from league start to 2026-10-27 (96 daily points; daysAgo 95 = league start day, 0 = 2026-10-27). Min 75.9, max 400.0, median 300.0 chaos. File: games/datasets/poe1-ninja-divine-chaos-allflame.csv.
Source: https://poe.ninja/poe1/api/economy/stash/current/currency/history?league=Allflame&type=Currency&id=3 (poe.ninja). Version: PoE1 3.29 Allflame, pulled 2026-10-27 (league still running). Checked: 2026-10-27. Trust: measured (n = 96).
Notes: Columns: daysAgo, receive_value_chaos (chaos received per Divine), receive_count (poe.ninja data points that day), pay_value_divine (Divine paid per chaos), pay_count. The values are as pulled. The day-1 point (count 2, 75.9 chaos) is thin. id 3 = Divine Orb in poe.ninja's currencyDetails. Min/max/median were computed from the file and are given here only as a check.

### poe1.data.divine-chaos-mirage
Daily Divine Orb price in chaos for the whole Mirage league (3.28, 2026-03-06 to 2026-07-20), 137 daily points (daysAgo 136 = first day, 0 = last day). Min 36.3, max 612.0, median 368.0 chaos. File: games/datasets/poe1-ninja-divine-chaos-mirage.csv.
Source: https://poe.ninja/poe1/api/economy/stash/current/currency/history?league=Mirage&type=Currency&id=3 (poe.ninja). Version: PoE1 3.28 Mirage league (ended 2026-07-20), pulled 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 137).
Notes: Same columns as poe1.data.divine-chaos-allflame. For an ended league, daysAgo counts back from the league's last day (137 points matches the wiki's 136-day span). The first point (count 10, 36.3) is thin.

### poe1.data.divine-chaos-keepers
Daily Divine Orb price in chaos for the whole Keepers league (3.27, 2025-10-31 to 2026-03-02), 123 daily points. Min 44.85, max 271.3, median 150.0 chaos. File: games/datasets/poe1-ninja-divine-chaos-keepers.csv.
Source: https://poe.ninja/poe1/api/economy/stash/current/currency/history?league=Keepers&type=Currency&id=3 (poe.ninja). Version: PoE1 3.27 Keepers league (ended 2026-03-02), pulled 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 123).
Notes: Same columns as the other Divine series. With three leagues there are comparable series to compare spread (CV) and skew.

### poe1.data.exchange-currency-allflame
Snapshot of 100 currency prices in chaos on the poe.ninja currency exchange, Allflame, 2026-10-27. Prices run from Rogue's Marker (0.0005529 chaos) to Mirror of Kalandra (384524 chaos), so the list is heavily right-skewed. File: games/datasets/poe1-ninja-exchange-currency-allflame-2026-10-27.csv.
Source: https://poe.ninja/poe1/api/economy/exchange/current/overview?league=Allflame&type=Currency (poe.ninja). Version: PoE1 3.29 Allflame, snapshot 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 100).
Notes: Columns: id, name, primaryValue_chaos, volumePrimaryValue_chaos (traded volume in chaos), maxVolumeCurrency, maxVolumeRate. Names were joined from the response's own `core.items`/`items` metadata. Good for skew, log scale, quartiles and outliers.

### poe1.data.ladder-allflame
2000 ladder entries from the official PoE1 ladder API, sampled in 200-entry pages on 2026-10-27. Allflame ranks 1-200, 7401-7600, 14801-15000. Hardcore Allflame ranks 1-200, 3001-3200, 7401-7600, 14801-15000. Ruthless Allflame ranks 1-200, 4601-4800, 9017-9216. File: games/datasets/poe1-ladder-allflame-2026-10-27.csv.
Source: https://www.pathofexile.com/api/ladders?offset=0&limit=200&id=Allflame (Grinding Gear Games). Version: PoE1 3.29 Allflame, pulled 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 2000).
Notes: Columns: ladder_id, rank, level, class, experience, dead. Character and account names were left out. The other pages are the same URL with offset=7400 or 14800, and with id=Hardcore%20Allflame (offsets 0, 3000, 7400, 14800) and id=Ruthless%20Allflame (offsets 0, 4600, 9016). The API caps each ladder at 15000 entries. Allflame and Hardcore Allflame report total 15000 and Ruthless reports 9216. Every sampled Allflame entry is level 100. Hardcore pages are constant within a page (100, 97, 93, 86). So only the Ruthless pages give a spread of levels, and the experience column varies within a level. poe.ninja's builds API is stated to be internal and not for third-party use (https://poe.ninja/docs/api), so it was not used.

### poe1.ladder.class-counts
Ascendancy counts in the sampled ladder pages (Allflame ranks 1-200, 7401-7600, 14801-15000; Hardcore Allflame ranks 1-200, 3001-3200, 7401-7600, 14801-15000).
| Ascendancy | Allflame (n = 600) | Hardcore Allflame (n = 800) |
|---|---|---|
| Luminary | 49 | 162 |
| Elementalist | 91 | 109 |
| Chieftain | 64 | 110 |
| Juggernaut | 44 | 68 |
| Necromancer | 42 | 59 |
| Occultist | 54 | 40 |
| Slayer | 35 | 33 |
| Hierophant | 15 | 47 |
| Champion | 39 | 17 |
| Deadeye | 55 | 1 |
| Berserker | 8 | 35 |
| Guardian | 23 | 18 |
| Gladiator | 4 | 35 |
| Ascendant | 24 | 6 |
| Inquisitor | 9 | 15 |
| Reliquarian | 6 | 18 |
| Pathfinder | 16 | 8 |
| Assassin | 13 | 10 |
| Trickster | 5 | 3 |
| Saboteur | 1 | 5 |
| Warden | 3 | 1 |
Source: https://www.pathofexile.com/api/ladders?offset=0&limit=200&id=Allflame (Grinding Gear Games). Version: PoE1 3.29 Allflame, pulled 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 1400).
Notes: Counted from dataset poe1.data.ladder-allflame. This is a sample of pages, not the whole ladder, so present it as "in these 1400 ladder characters". Good as a two-way table (ascendancy by softcore/hardcore) and for frequency tables and bar charts.

### poe1.ladder.hc-dead-by-rank
On the Hardcore Allflame ladder (2026-10-27), the share of characters flagged dead rises with rank band.
| Rank band | Dead | Alive | Total |
|---|---|---|---|
| 1-200 | 69 | 131 | 200 |
| 3001-3200 | 120 | 80 | 200 |
| 7401-7600 | 158 | 42 | 200 |
| 14801-15000 | 157 | 43 | 200 |
Source: https://www.pathofexile.com/api/ladders?offset=0&limit=200&id=Hardcore%20Allflame (Grinding Gear Games). Version: PoE1 3.29 Allflame, pulled 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 800).
Notes: Counted from the `dead` field in dataset poe1.data.ladder-allflame (offsets 0, 3000, 7400, 14800). Good for two-way tables, conditional probability P(dead | rank band), and testing for independence.

### poe1.ladder.ruthless-levels
Level frequencies on three pages of the Ruthless Allflame ladder (total 9216 entries) on 2026-10-27.
| Rank band | Level counts |
|---|---|
| 1-200 | 92: 88, 93: 53, 94: 29, 95: 15, 96: 7, 97: 7, 99: 1 |
| 4601-4800 | 17: 66, 18: 96, 19: 38 |
| 9017-9216 | 1: 200 |
Source: https://www.pathofexile.com/api/ladders?offset=0&limit=200&id=Ruthless%20Allflame (Grinding Gear Games). Version: PoE1 3.29 Allflame (Ruthless), pulled 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 600).
Notes: Counted from dataset poe1.data.ladder-allflame (offsets 0, 4600, 9016). Ranks 1-200 make a right-skewed frequency table suited to mean, median and mode.

## Unverified

- **poe1.sockets.chromatic-formula**: Tried https://www.poewiki.net/wiki/Chromatic_Orb and https://www.poewiki.net/wiki/Item_socket. Neither publishes a colour-weight formula, and 3.29.0 changed socket colouring (white by default, small chance per socket of a colour proportional to attributes). The pre-3.29 community formula (Siveran's calculator) cannot be assumed to still hold. Not usable.

- **poe1.divine.roll-distribution**: Tried https://www.poewiki.net/wiki/Divine_Orb. It says values reroll within the tier, but it does not say the reroll is uniform. Not usable as a uniform example. Use poe1.damage.uniform-roll instead.

- **poe1.drops.rate-per-hour**: Looked for a currency or divination-card drop rate per hour with a sample size, for Poisson and exponential lessons. The wiki Divine Orb page gives only "roughly dozens of times rarer than Chaos Orbs". The wiki The Doctor card page shows no drop weight. No non-banned source with a count per time interval and an n was found. Not usable.

- **poe1.chance.unique-probability**: The wiki Orb of Chance page gives only phrases ("1 in a few hundred" etc.) and no exact probabilities. Not usable for calculation.

- **poe1.vaal.t16-vaal-temple**: The Vaal Orb page says 2% to 2.5% and the Map page says ~10%. The pages conflict, so neither is usable.

- **poe1.ladder.level-distribution-softcore**: Every sampled Allflame (softcore) ladder entry, from ranks 1-200 down to 14801-15000, is level 100, and the API caps the ladder at 15000. So the softcore ladder has no level spread to teach from. Use poe1.ladder.ruthless-levels. poe.ninja builds level data was not used because poe.ninja states that its builds API is internal and not for third-party use (https://poe.ninja/docs/api).

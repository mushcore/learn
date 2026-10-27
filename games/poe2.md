# Path of Exile 2 fact bank

Path of Exile 2 is still in Early Access. This file covers PoE2 version 0.5.5e (patch released 2026-10-05) in the Forbidden Rites league, which launched with 0.5.5 on 2026-09-04. The Runes of Aldur league (0.5.0, 2026-05-29) runs alongside it, and the wiki lists Version 1.0.0, the official release, for 2026-12-11. Mechanics come from poe2wiki.net and poe2db.tw. Economy and build data come from poe.ninja and were pulled on 2026-10-27. Every entry was checked on 2026-10-27.

### poe2.version.current
The current PoE2 patch is 0.5.5e (2026-10-05), and the current challenge/event league is Forbidden Rites, launched with content update 0.5.5 on 2026-09-04.
- 0.5.0 Runes of Aldur league / Return of the Ancients expansion: 2026-05-29
- 0.5.5 Forbidden Rites league: 2026-09-04 (patch notes thread headed "Content Update 0.5.5 — Path of Exile 2: Forbidden Rites")
- 0.5.5b 2026-09-10, 0.5.5c 2026-09-17, 0.5.5d 2026-09-27, 0.5.5e 2026-10-05
- Version 1.0.0 official release: listed for 2026-12-11
Source: https://www.pathofexile.com/forum/view-thread/4000864 (Grinding Gear Games). Version: PoE2 0.5.5 Forbidden Rites, 2026-09-04. Checked: 2026-10-27. Trust: official.
Notes: The 0.5.5e notes are at https://www.pathofexile.com/forum/view-thread/4009785 (official, Alexander_GGG, Oct 5 2026), but that post does not name the league. The hotfix dates come from the poe2wiki versions table (https://www.poe2wiki.net/wiki/Version_history). The wiki calls Forbidden Rites an event league that "is not officially considered a 'full league'" and "will end in early December prior to the official release" (https://www.poe2wiki.net/wiki/Forbidden_Rites). poe.ninja lists "Forbidden Rites" first among its PoE2 economy leagues.

### poe2.currency.vaal-orb
A Vaal Orb "Modifies an item unpredictably and Corrupts it". Corrupted items cannot be modified again, and the outcome depends on the item's class and rarity.
- Stack size 20 (5000 in the currency tab); drop level 35
- 0.2.0: "Using a Vaal Orb on an item can no longer cause a modifier with a value of 1 to be reduced to 0."
- 0.3.0: more Vaal Orbs now come from the Trials of Chaos and fewer from other sources
Source: https://www.poe2wiki.net/wiki/Vaal_Orb (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-09-18). Checked: 2026-10-27. Trust: wiki.
Notes: The PoE2 Vaal Orb also adds an invisible "exclusive" enchantment. A Vaal Orb used on a strongbox corrupts every item that drops from it.

### poe2.corruption.outcomes-equipment
A Vaal Orb on non-unique equipment applies one of 4 outcomes: no change; reroll up to three modifiers into new modifiers; add a special Vaal enchantment; or add an item (augment) socket to a weapon or armour, ignoring the socket limit. On jewellery the socket outcome is "no change".
Source: https://www.poe2wiki.net/wiki/Corrupted (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-10-05). Checked: 2026-10-27. Trust: wiki.
Notes: The wiki's exact words are "The odds of each effect seem to be all equally likely, but the specific effect within each outcome may use a weight system". Equal weights are therefore the wiki's best reading, not a published rate. Teach "each of 4 outcomes, assumed 1/4" and say it is an assumption. The other outcome sets on the same page:
- Unique equipment: no change, a 0.78x–1.22x modifier multiplier, a Vaal enchantment, or a socket.
- Non-unique jewels: no change, reroll up to three, a Vaal enchantment, or add/remove a modifier.
- Waystones: 4 outcomes.
- Essence monsters: 5 outcomes.

### poe2.corruption.outcomes-gems
A Vaal Orb on a skill gem gives one of 4 outcomes: no change; permanently add or subtract one gem level; add or remove a socket; or ±10% quality, up to 23%.
Source: https://www.poe2wiki.net/wiki/Corrupted (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-10-05). Checked: 2026-10-27. Trust: wiki.
Notes: The equal-odds caveat from poe2.corruption.outcomes-equipment applies here too. The Gem page (https://www.poe2wiki.net/wiki/Gem) adds that corruption "cannot cause a skill gem to have more than 5 sockets" and that a gem can reach 23% base quality through corruption.

### poe2.corruption.unique-multiplier
One corruption outcome for unique equipment and unique jewels "Applies a modifier magnitude multiplier of 0.78x to 1.22x (in 0.01 increments)" to the explicit modifiers.
Source: https://www.poe2wiki.net/wiki/Corrupted (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-10-05). Checked: 2026-10-27. Trust: wiki.
Notes: The wiki gives the range and the step size but not whether every step is equally likely, so a discrete-uniform model is an assumption. Results are rounded, and the wiki notes testing that suggests `trunc(value + 0.5)`. The 0.5.0 change: the outcome "now multiplies each modifier based on the current value, instead of randomising the value".

### poe2.corruption.omen-of-corruption
With an Omen of Corruption active, a Vaal Orb loses its "No change" outcome, "making the outcome 1 of 3 effects instead of 1 of 4".
Source: https://www.poe2wiki.net/wiki/Omen_of_Corruption (poe2wiki). Version: removed in PoE2 0.5.0 ("Omen of Corruption can no longer be obtained"); wiki page edited 2026-06-01. Checked: 2026-10-27. Trust: wiki.
Notes: This is a good conditional-probability example, since removing one equally likely outcome turns 1/4 into 1/3. It no longer drops in 0.5.x, so present it as a past (0.1.0–0.4.x) mechanic.

### poe2.currency.exalted-orb
An Exalted Orb "Augments a Rare item with a new random modifier". Its help text says "Rare items can have up to six random modifiers."
- Stack size 20; drop level 5
Source: https://www.poe2wiki.net/wiki/Exalted_Orb (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2025-09-12; last listed change 0.1.0c). Checked: 2026-10-27. Trust: wiki.
Notes: In PoE2 the Exalted Orb is a common, low-value currency. On poe.ninja on 2026-10-27, 1 Divine Orb = 653.3 Exalted Orbs (see poe2.data.divine-exalted-daily-forbidden-rites). Greater and Perfect Exalted Orbs also exist.

### poe2.currency.divine-orb
A Divine Orb "Randomises the numeric values of modifiers on an item". It rerolls the values within the range of every implicit and explicit modifier, cannot be used on a Corrupted item, and has no effect on fractured modifiers.
- Stack size 10; drop level 35
- 0.5.0: "Divine Orbs are now more common."
Source: https://www.poe2wiki.net/wiki/Divine_Orb (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-06-04). Checked: 2026-10-27. Trust: wiki.
Notes: The Divine Orb is the primary price unit on poe.ninja's PoE2 exchange pages.

### poe2.items.affix-limits
Magic items can have up to one prefix and one suffix. Rare items can have up to six affixes (at most three prefixes and three suffixes). An Orb of Alchemy turns a normal item into a rare with four affixes, 2 prefixes and 2 suffixes. Jewels and tablets are limited to four affixes (2 prefixes, 2 suffixes).
Source: https://www.poe2wiki.net/wiki/Rarity (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-10-15). Checked: 2026-10-27. Trust: wiki.
Notes: PoE1 difference, in the page's words: "Unlike Path of Exile 1 you can't reroll those affixes with another orb". PoE2 has no Orb of Alteration-style reroll. Instead, an Orb of Annulment removes a random modifier and a Chaos Orb replaces one.

### poe2.items.unid-rare-mod-count
"Unidentifed rare items generate with 4, 5, or 6 modifiers with a ratio of 8:3:1 respectively."
| Modifiers | Ratio | Probability |
|---|---|---|
| 4 | 8 | 8/12 |
| 5 | 3 | 3/12 |
| 6 | 1 | 1/12 |
Source: https://www.poe2wiki.net/wiki/Rarity (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-10-15). Checked: 2026-10-27. Trust: wiki.
Notes: The page gives only the ratio. The probability column divides each ratio by the total 8+3+1 = 12. This is ideal for E(X) and Var(X). The wiki cites no source for the ratio.

### poe2.gems.support-sockets
Each skill gem starts with two support sockets. Jeweller's Orbs add up to three more, so a skill gem has 2–5 sockets.
| Currency | Effect | Drop level |
|---|---|---|
| Lesser Jeweller's Orb | Sets a Skill Gem to have 3 Support Gem Sockets | 25 |
| Greater Jeweller's Orb | Sets a Skill Gem to have 4 Support Gem Sockets | 45 |
| Perfect Jeweller's Orb | Sets a Skill Gem to have 5 Support Gem Sockets | 65 |
Source: https://www.poe2wiki.net/wiki/Gem_socket (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-07-15). Checked: 2026-10-27. Trust: wiki.
Notes: The Gem_socket page says "Skill gems can have 2-5 sockets", and calls them "3-6 linked" in PoE1 terms. The orb rows come from https://www.poe2wiki.net/wiki/Perfect_Jeweller%27s_Orb and its Lesser and Greater siblings. Since 0.2.0 the orbs set the socket count rather than adding one. PoE1 difference: support gems socket into the skill gem itself, not into linked sockets on gear. PoE2 has no Orb of Fusing (poe2wiki has no such page; the Orb_of_Fusing URL returns 404), and socket colours on gear do not exist. Support colour comes from attributes (see poe2.gems.support-attribute-limit).

### poe2.gems.skill-and-support-rules
Up to 9 skill gems can be bound at once by default. Two support gems of the same category cannot be socketed on the same skill. Since 0.3.0, the same skill gem cannot be socketed twice in the main skill sockets.
Source: https://www.poe2wiki.net/wiki/Gem (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-09-22). Checked: 2026-10-27. Trust: wiki.
Notes: Counting set-ups:
- Ordered choice of 5 supports for one skill from a pool with no repeats.
- Choice of 9 distinct skills.
The 0.3.0 version history also "Removed the restriction of having one of each support gem per character". The one-copy rule still applies to Lineage supports and to spirit-reservation supports of the same rank.

### poe2.gems.support-attribute-limit
The number of support gems of each colour is capped by attributes: "5 points of the stat allowing one support of that color" (Strength = red, Dexterity = green, Intelligence = blue).
- Wiki example: 20 Str, 40 Dex, 30 Int → 4 red, 8 green, 6 blue supports
Source: https://www.poe2wiki.net/wiki/Gem (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-09-22). Checked: 2026-10-27. Trust: wiki.

### poe2.gems.granted-skill-sockets
Skills granted by passives gain levels and sockets with character level, capping at level 90.
| Character level | Skill level | Sockets |
|---|---|---|
| 1 | 1 | 2 |
| 31 | 9 | 2 |
| 36 | 10 | 3 |
| 58 | 14 | 3 |
| 64 | 15 | 4 |
| 84 | 19 | 4 |
| 90 | 20 | 5 |
Source: https://www.poe2wiki.net/wiki/Gem_socket (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-07-15). Checked: 2026-10-27. Trust: wiki.
Notes: These are selected rows. The full table has 21 rows: 1/1, 3/2, 6/3, 10/4, 14/5, 18/6, 22/7, 26/8, 31/9 at 2 sockets; 36/10, 41/11, 46/12, 52/13, 58/14 at 3 sockets; 64/15, 66/16, 72/17, 78/18, 84/19 at 4 sockets; 90/20 at 5 sockets.

### poe2.items.augment-sockets
An Artificer's Orb adds augment (rune) sockets up to a limit. By default, body armours and two-handed weapons can have up to two, and other armour and weapons up to one. Corruption can add one more past that limit, but an item never has more sockets than the grid spaces it takes up.
Source: https://www.poe2wiki.net/wiki/Augment_socket (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-09-17). Checked: 2026-10-27. Trust: wiki.
Notes: PoE1 difference: these sockets hold augments (runes, soul cores, talismans) that add an enchantment. They have no colours or links, and skill gems never go in them. 0.4.0 renamed Rune Sockets to Augment Sockets.

### poe2.damage.hit-roll-uniform
After all multipliers are applied to a hit's minimum and maximum, the game "randomly chooses a number within this range". Without luck, the expected damage is (min + max)/2.
Source: https://www.poe2wiki.net/wiki/Luck (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-05-18). Checked: 2026-10-27. Trust: wiki.
Notes: The quoted roll step is on https://www.poe2wiki.net/wiki/Receiving_damage, under "Rolling for damage" (edited 2026-09-08). Neither page uses the word "uniform". The Luck page's mean (min+max)/2 and its lucky mean (min + 2·max)/3, which is the expected maximum of two uniform draws, are consistent with a continuous uniform roll. Lucky damage rolls twice and keeps the higher result; unlucky keeps the lower.

### poe2.damage.lucky-binary
A lucky binary roll (crit, hit, block) succeeds with probability 2p − p²; an unlucky one, p².
| Original | Lucky | Unlucky |
|---|---|---|
| 10% | 19% | 1% |
| 25% | 43.75% | 6.25% |
| 50% | 75% | 25% |
| 75% | 93.75% | 56.25% |
| 90% | 99% | 81% |
Source: https://www.poe2wiki.net/wiki/Luck (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-05-18). Checked: 2026-10-27. Trust: wiki.
Notes: These are complement rule examples: 1 − (1−p)² = 2p − p². The page's worked example: 40% crit → 64% lucky. Lucky damage adds (max − min)/6 to the mean. Example: a 600–800 range has a mean of 700, and lucky raises it to 733.3, +4.7%.

### poe2.weapons.one-hand-mace-bases
One-hand mace base types and their physical damage ranges (a hit rolls inside the range, after modifiers):
| Base | Drop level | Physical damage | Attacks/s | Crit |
|---|---|---|---|---|
| Wooden Club | 1 | 6–10 | 1.45 | 5% |
| Smithing Hammer | 4 | 11–18 | 1.45 | 5% |
| Slim Mace | 10 | 11–17 | 1.55 | 5% |
| Spiked Club | 16 | 15–24 | 1.45 | 5% |
| Plated Mace | 26 | 18–38 | 1.4 | 5% |
| Morning Star | 45 | 33–49 | 1.45 | 6.5% |
| Marching Mace | 54 | 33–69 | 1.4 | 5% |
| Crown Mace | 72 | 43–89 | 1.4 | 5% |
| Fortified Hammer | 79 | 60–73 | 1.4 | 5% |
Source: https://www.poe2wiki.net/wiki/Wooden_Club (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-06-01). Checked: 2026-10-27. Trust: wiki.
Notes: The other rows come from the wiki's cargo items/weapons table: `https://www.poe2wiki.net/w/api.php?action=cargoquery&tables=items,weapons&join_on=items._pageID=weapons._pageID&fields=items.name,weapons.physical_damage_min,weapons.physical_damage_max,...&where=items.class_id="One Hand Mace"`. Each base also has its own wiki page, e.g. https://www.poe2wiki.net/wiki/Crown_Mace. poe2db.tw (https://poe2db.tw/us/Wooden_Club, https://poe2db.tw/us/Crown_Mace) shows the same tooltip values, "Physical Damage: 6-10" and "43-89". Its raw data rows show `Weapon.minimum_damage 5 / maximum_damage 10` for both bases, so use the tooltip values. For teaching, pair a narrow range (Fortified Hammer 60–73) with a wide one (Crown Mace 43–89) to compare uniform variance (b−a)²/12.

### poe2.classes.ascendancy-structure
PoE2 Early Access has 8 playable classes and 22 regular ascendancy classes, plus one alternate ascendancy (Abyssal Lich):
- Warrior: Titan, Warbringer, Smith of Kitava
- Ranger: Deadeye, Pathfinder
- Huntress: Ritualist, Amazon, Spirit Walker
- Witch: Infernalist, Blood Mage, Lich
- Sorceress: Stormweaver, Chronomancer, Disciple of Varashta
- Mercenary: Witchhunter, Gemling Legionnaire, Tactician
- Monk: Invoker, Acolyte of Chayula, Martial Artist
- Druid: Shaman, Oracle
Source: https://www.poe2wiki.net/wiki/Character_class (poe2wiki). Version: PoE2 0.5.5e (wiki page edited 2026-09-24). Checked: 2026-10-27. Trust: wiki.
Notes: https://www.poe2wiki.net/wiki/Ascendancy_class says "Currently, there are 22 regular ascendancy classes available". It also says 4 trial tiers give 2 points each, for a total of 8 ascendancy points. The Character_class page also says "Currently, 8 of the 12 character classes are available in the game". Marauder, Duelist, Shadow and Templar are listed there without ascendancies. Sum rule example: 6×3 + 2×2 = 22.

### poe2.data.divine-exalted-daily-forbidden-rites
Daily Divine Orb exchange rate against the Exalted Orb and the Chaos Orb in the Forbidden Rites league, one row per day from 2026-09-04 (league start) to 2026-10-27: 54 rows. The Exalted rate ranges from 39.01 on day 1 to a high of 767.2. On 2026-10-27, 1 Divine = 653.3 Exalted = 10.38 Chaos.
Source: https://poe.ninja/poe2/api/economy/exchange/current/details?league=Forbidden%20Rites&type=Currency&id=divine-orb (poe.ninja). Version: PoE2 0.5.5–0.5.5e Forbidden Rites league, 2026-09-04 to 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 54).
Notes: The file is `games/datasets/poe2-ninja-divine-daily-forbidden-rites-2026-10-27.csv`. Columns: date, exalted_per_divine, exalted_pair_volume_divine, chaos_per_divine, chaos_pair_volume_divine. The volume columns are poe.ninja's `volumePrimaryValue`, the traded volume valued in Divine Orbs. Day 1 volumes are tiny (139 and 3), so treat 2026-09-04 as a likely outlier. The series has a strong upward trend over the league, which makes it good for time-series histograms and skew, and not i.i.d. Behind the series is poe.ninja's currency exchange detail endpoint. Its documented sibling is https://poe.ninja/poe2/api/economy/exchange/current/overview?league=Forbidden%20Rites&type=Currency (see https://poe.ninja/docs/api).

### poe2.data.currency-prices-forbidden-rites
A snapshot of 52 currency items in the Forbidden Rites league, each priced in Divine Orbs, with traded volume and 7-day change. Examples: Mirror of Kalandra 6310, Hinekora's Lock 2083, Perfect Jeweller's Orb 0.307, Chaos Orb 0.09636, Exalted Orb 0.001531.
Source: https://poe.ninja/poe2/api/economy/exchange/current/overview?league=Forbidden%20Rites&type=Currency (poe.ninja). Version: PoE2 0.5.5e Forbidden Rites league, snapshot 2026-10-27 20:39 UTC. Checked: 2026-10-27. Trust: measured (n = 52).
Notes: The file is `games/datasets/poe2-ninja-currency-prices-forbidden-rites-2026-10-27.csv`. Columns: id, name, value_divine, volume_divine, max_volume_currency, max_volume_rate, change_7d_pct. The prices span about seven orders of magnitude and are heavily right-skewed, which suits log scale, median vs mean, and IQR. n counts priced items, not trades. A Perfect Jeweller's Orb at 0.307 Divine against a Lesser at 0.0002031 Divine gives a cost-per-attempt EV problem.

### poe2.data.ascendancy-counts-forbidden-rites
poe.ninja's Forbidden Rites build ladder held 124,117 characters on 2026-10-27, split by ascendancy:
| Ascendancy | Characters |
|---|---|
| Gemling Legionnaire | 41,585 |
| Martial Artist | 12,980 |
| Disciple of Varashta | 9,070 |
| Oracle | 9,034 |
| Spirit Walker | 8,607 |
| Deadeye | 7,389 |
| Infernalist | 6,606 |
| Stormweaver | 4,180 |
| Titan | 3,267 |
| Blood Mage | 3,215 |
| Ritualist | 2,096 |
| Acolyte of Chayula | 2,019 |
| Lich | 1,858 |
| Witchhunter | 1,777 |
| Shaman | 1,730 |
| Pathfinder | 1,617 |
| Tactician | 1,460 |
| Chronomancer | 1,361 |
| Smith of Kitava | 1,157 |
| Abyssal Lich | 1,101 |
| Warbringer | 912 |
| Amazon | 692 |
| Invoker | 353 |
| no ascendancy (8 base classes) | 51 |
Source: https://poe.ninja/poe2/builds/forbiddenrites (poe.ninja). Version: PoE2 0.5.5e Forbidden Rites league, "Latest snapshot" 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 124117).
Notes: The file is `games/datasets/poe2-ninja-ascendancy-counts-forbidden-rites-2026-10-27.csv`, with columns base_class, ascendancy, characters and 31 rows. The "(none)" rows mean the base-class filter, e.g. `?class=Warrior` = 4. Each count is the page's "Found N characters" figure with `?class=<name>` applied. The 31 counts sum exactly to the unfiltered 124,117. The ladder covers the characters poe.ninja tracks; its level column spans 80–100. It is not every player. Group the counts by base class for a two-level frequency table. Gemling Legionnaire alone is 33.5% of the ladder (41,585 / 124,117). poe.ninja says its builds API is internal and not for third-party use (https://poe.ninja/docs/api), so these counts were read from the public web page, not the API.

### poe2.ninja.main-skill-shares
Share of the 124,117 Forbidden Rites ladder characters that use each main skill:
- Herald of Ice 18%
- Frost Bomb 17%
- Barrage 16%
- Spark 15%
- Comet 14%
- Elemental Weakness 14%
- Whirling Slash 13%
- Herald of Thunder 12%
- Twister 11%
- Wolf Pack 11%
- Arc 11%
- Frost Wall 10%
Weapon configuration: Wand / Sceptre 13%, Staff 12%, Spear 12%, Bow / Quiver 9%.
Source: https://poe.ninja/poe2/builds/forbiddenrites (poe.ninja). Version: PoE2 0.5.5e Forbidden Rites league, "Latest snapshot" 2026-10-27. Checked: 2026-10-27. Trust: measured (n = 124117).
Notes: A character can use several main skills, so these shares sum past 100%. They are not mutually exclusive categories, which makes them a good addition-rule trap. Each ascendancy-filtered page gives its own weapon split, for example Deadeye: Bow / Quiver 90% of 7,389. Combined with the ascendancy counts, that gives a two-way table (ascendancy × weapon).

## Unverified

- A measured drop rate with a sample size (Poisson/exponential), such as Divine Orbs per map or per hour in PoE2 0.5.x. poe2wiki and poe2db publish no drop rates, and no community spreadsheet with a stated n was found on an allowed domain. Not usable.
- Sacred Bloom chance from Ritual: the Forbidden Rites wiki page says "(~20%?)", with the question mark on the page itself. That is a guess, not a rate. Not usable.
- Vaal Orb outcome weights: the wiki only says the outcomes "seem to be all equally likely". GGG publishes no official weights. The entries above flag this as an assumption.
- A poe.ninja class/ascendancy history over time. Week-by-week "time machine" snapshots exist on the builds page but were not pulled; only the latest snapshot was recorded.

# Global MapleStory (GMS) fact bank

Covers GMS v.271 "MapleStory x Frieren: Beyond Journey's End" (patch notes posted 2026-09-08, last updated 2026-09-29; the v.271 Known Issues post of 2026-10-23 is the newest version notice on nexon.com), checked on 2026-10-27. Star Force rates come from Nexon's v.264 "Every Little Thing Every Precious Thing" patch notes (2025-11-11, the 30-star revamp), with the v.269 Enhancement Mode and the v.271 Star Catching removal noted against them. Random-box rates come from Nexon's "Random Box Rates" pages. Rankings are snapshots pulled on 2026-10-27 from Nexon's official ranking API (North America region). Wiki entries are from maplestorywiki.net, each with its last-edited date.

### gms.version.current
The current GMS version is v.271, "MapleStory x Frieren: Beyond Journey's End", whose patch notes were posted 2026-09-08 and last updated 2026-09-29.
| Version | Patch name | Patch notes posted |
|---|---|---|
| v.271 | MapleStory x Frieren: Beyond Journey's End | 2026-09-08 |
| v.270 | Ride the Lightning | 2026-07-21 |
| v.269 | Ride the Lightning | 2026-06-16 |
| v.268 | Maple University: 21st Anniversary | 2026-04-21 |
| v.264 | Every Little Thing Every Precious Thing | 2025-11-11 |
Source: https://www.nexon.com/maplestory/news/update (Nexon). Version: v.271, news list read 2026-10-27. Checked: 2026-10-27. Trust: official.
Notes: The news list also shows "v.271 Known Issues" (2026-10-23) and "Sign Up for the v.272 Public Test Server!" (2026-10-07), so v.272 is on the test server but not live. v.271 patch notes: https://www.nexon.com/maplestory/news/update/44597.

### gms.starforce.rates-15-plus
From 15 stars up, each Star Force attempt has three outcomes (success, maintain, destruction); since v.264 a failed attempt never lowers the star level.
| Current star level | Success | Maintain | Destruction |
|---|---|---|---|
| 15 | 30.00% | 67.90% | 2.10% |
| 16 | 30.00% | 67.90% | 2.10% |
| 17 | 15.00% | 78.20% | 6.80% |
| 18 | 15.00% | 78.20% | 6.80% |
| 19 | 15.00% | 76.50% | 8.50% |
| 20 | 30.00% | 59.50% | 10.50% |
| 21 | 15.00% | 72.25% | 12.75% |
| 22 | 15.00% | 68.00% | 17.00% |
| 23 | 10.00% | 72.00% | 18.00% |
| 24 | 10.00% | 72.00% | 18.00% |
| 25 | 10.00% | 72.00% | 18.00% |
| 26 | 7.00% | 74.40% | 18.60% |
| 27 | 5.00% | 76.00% | 19.00% |
| 28 | 3.00% | 77.60% | 19.40% |
| 29 | 1.00% | 79.20% | 19.80% |
Source: https://www.nexon.com/maplestory/news/update/32522 (Nexon). Version: v.264 Every Little Thing Every Precious Thing, patch notes 2025-11-11 (updated 2025-12-11). Checked: 2026-10-27. Trust: official.
Notes: The patch note says: "Star Force levels will no longer decrease when an enhancement fails. The possible outcomes are now: Success: Level increases / Maintain: Current Star Force level is kept / Destruction: Item is destroyed", and "The maximum Star Force enhancement level for equipment Lv. 138+ is now 30-Stars." Each row sums to 100%. IMPORTANT version caveat: these are the rates WITHOUT Star Catching. v.271 (patch note line "[Updated 9/10/2026]") says "Removed the Star Catching feature from Star Force Enhancement. The increased enhancement success rate from Star Catching is now permanently applied to Star Force Enhancement." Nexon did not print the new post-catch numbers; maplestorywiki.net (edited 2026-09-29) still shows this same table. Lessons should present this table as Nexon's published base rates and say that live v.271 success is slightly higher (see gms.starforce.star-catch). Sunny Sunday events can lower destruction chance (see gms.starforce.safeguard).

### gms.starforce.rates-0-14
Below 15 stars a Star Force attempt either succeeds or fails with no destruction, and the success chance drops by steps from 95% at 0 stars to 30% at 14 stars.
| Star step | Success | Failure |
|---|---|---|
| 0 → 1 | 95% | 5% |
| 1 → 2 | 90% | 10% |
| 2 → 3 | 85% | 15% |
| 3 → 4 | 85% | 15% |
| 4 → 5 | 80% | 20% |
| 5 → 6 | 75% | 25% |
| 6 → 7 | 70% | 30% |
| 7 → 8 | 65% | 35% |
| 8 → 9 | 60% | 40% |
| 9 → 10 | 55% | 45% |
| 10 → 11 | 50% | 50% |
| 11 → 12 | 45% | 55% |
| 12 → 13 | 40% | 60% |
| 13 → 14 | 35% | 65% |
| 14 → 15 | 30% | 70% |
Source: https://maplestorywiki.net/w/Star_Force_Enhancement (maplestorywiki.net). Version: KMS/GMS/JMS/MSEA tab of the probability table, wiki page last edited 2026-09-29 (after v.271). Checked: 2026-10-27. Trust: wiki.
Notes: The destruction column is empty for these rows; the page says "From 15★ and beyond (5★ and beyond for Superior items), items have a chance of becoming destroyed." On non-Superior items a failure keeps the star level, so attempts at a fixed star are independent Bernoulli trials (binomial / geometric). The same Star Catching caveat as gms.starforce.rates-15-plus applies. The wiki's 15-29 rows match Nexon's v.264 table exactly.

### gms.starforce.star-catch
Star Catching raised the Star Force success rate by 5% multiplicatively and lowered failure and destruction in proportion; in GMS it was removed in v.271 and its bonus is now always applied.
Source: https://maplestorywiki.net/w/Star_Force_Enhancement (maplestorywiki.net). Version: wiki page last edited 2026-09-29; removal is in GMS v.271 (patch note updated 2026-09-10). Checked: 2026-10-27. Trust: wiki.
Notes: The wiki says: "If successful, the success rate would have increased by 5% multiplicatively, and proportionally decreased the chances of failure and destruction", and that Star Catching "was removed as of the ... Post-Crown / Post-Ride The Lightning (KoreaMS and GlobalMS) Update as the multiplicative bonus of star catching was automatically applied to the base success rates." Nexon's v.271 wording: "Removed the Star Catching feature from Star Force Enhancement. The increased enhancement success rate from Star Catching is now permanently applied to Star Force Enhancement." (https://www.nexon.com/maplestory/news/update/44597). Neither page prints the resulting per-star numbers, so any lesson that applies the 1.05 factor must say it is computing them.

### gms.starforce.safeguard
Safeguard can be switched on for attempts from 15, 16 and 17 stars; it turns a destruction result into a maintain result and costs an extra 200% of the base meso cost.
Source: https://www.nexon.com/maplestory/news/update/32522 (Nexon). Version: v.264 Every Little Thing Every Precious Thing, 2025-11-11. Checked: 2026-10-27. Trust: official.
Notes: Nexon: "Safeguarding is now available up to 18-Star and the price to safeguard will be 200% of the base meso cost." The wiki (https://maplestorywiki.net/w/Star_Force_Enhancement, edited 2026-09-29) adds: "When an item is between 15★ to 17★ inclusive, the item can be safeguarded ... increase the cost of each upgrade attempt by 200% of its base cost (i.e. triple before any discounts) ... if the item were to be destroyed, it will instead act as if the attempt failed; the chance and behavior of successes are not affected." The wiki also says certain Sunny Sunday events reduce the destruction chance "by 30% when enhancing an item below 21★" and that these events run every 2 weeks in GMS.

### gms.starforce.enhancement-mode
Since v.269, attempts from 15 to 21 stars can use one of 4 Enhancement Mode levels: Level 1 is the standard rate and cost, Levels 2-3 lower the destruction rate, Level 4 sets destruction to 0%, and higher levels cost more mesos.
Source: https://www.nexon.com/maplestory/news/update/41138 (Nexon). Version: v.269 Ride the Lightning, patch notes 2026-06-16 (updated 2026-06-30). Checked: 2026-10-27. Trust: official.
Notes: Nexon: "When enhancing from 15-Star to 17-Star, Level 4 Enhancement Mode will not be available since Level 4 has the same destruction rate and cost as when Safeguard is enabled." Nexon did not publish the Level 2 and 3 rates or the per-level cost multipliers, so do not use numbers for them (see Unverified).

### gms.starforce.meso-cost
The meso cost of one GMS Star Force attempt depends on equipment level L and current star S, rounded to the nearest 100 mesos.
| Current star S | GMS cost per attempt |
|---|---|
| 0 to 9 | 1000 + L^3 × (S+1) / 25 |
| 10 | 1000 + L^3 × 11^2.7 / 400 |
| 11 | 1000 + L^3 × 12^2.7 / 220 |
| 12 | 1000 + L^3 × 13^2.7 / 150 |
| 13 | 1000 + L^3 × 14^2.7 / 110 |
| 14 | 1000 + L^3 × 15^2.7 / 75 |
| 15 | 1000 + L^3 × 16^2.7 / 200 |
| 16 | 1000 + L^3 × 17^2.7 / 200 |
| 17 | 1000 + L^3 × 18^2.7 / 150 |
| 18 | 1000 + L^3 × 19^2.7 / 70 |
| 19 | 1000 + L^3 × 20^2.7 / 45 |
| 20 | 1000 + L^3 × 21^2.7 / 200 |
| 21 | 1000 + L^3 × 22^2.7 / 125 |
| 22 to 29 | 1000 + L^3 × (S+1)^2.7 / 200 |
Source: https://maplestorywiki.net/w/Star_Force_Enhancement (maplestorywiki.net). Version: GMS column of "Base Meso Cost", wiki page last edited 2026-09-29. Checked: 2026-10-27. Trust: wiki.
Notes: The page writes the formulas in MathML with a ⌊ ⌉ (round) bracket and states "values are rounded to the nearest hundred and L is the equipment's level"; rows on the page are labelled "0★ → 10★" (S = 0 to 9), "10★ → 11★", and so on, and the page says GMS and KMS costs "equalize from 15★ onwards". Nexon's v.264 note only says "Meso costs have also been adjusted to scale based on both equipment level and enhancement level." Discounts (the page pairs two MVP/VIP tier names per rate): Silver/Gold 3%, Gold/Diamond 5%, Diamond+/Royal+ 10%, applying up to 16★→17★, and some Sunny Sundays 30% (multiplicative, applied before safeguard costs). DERIVED values (computed by us from these formulas, NOT printed on the page) for a Level 150 item, by current star S: 0: 136,000; 1: 271,000; 2: 406,000; 3: 541,000; 4: 676,000; 5: 811,000; 6: 946,000; 7: 1,081,000; 8: 1,216,000; 9: 1,351,000; 10: 5,470,800; 11: 12,579,800; 12: 22,900,700; 13: 38,145,000; 14: 67,400,800; 15: 30,087,200; 16: 35,437,900; 17: 55,134,800; 18: 136,714,200; 19: 244,255,300; 20: 62,696,400; 21: 113,738,800; 22: 80,152,000. A lesson using these must show the formula and say they are computed. Superior items instead cost a fixed 1000 + L^3.56 per attempt.

### gms.starforce.trace-recovery
Since v.264, a destroyed item's trace restores to a star level that depends on the star level at destruction.
| Star Force at destruction | Recovered star level |
|---|---|
| 15 - 19 | 12 |
| 20 | 15 |
| 21 - 22 | 17 |
| 23 - 25 | 19 |
| 26 - 30 | 20 |
Source: https://www.nexon.com/maplestory/news/update/32522 (Nexon). Version: v.264 Every Little Thing Every Precious Thing, 2025-11-11. Checked: 2026-10-27. Trust: official.
Notes: Useful as the "cost of a destruction" outcome in an expected-value table: a boom at 22 stars sends the item back to 17, not to 0.

### gms.starforce.max-stars
The maximum Star Force depends on the item's required level: 5 stars (Lv. 0-94), 8 (95-107), 10 (108-117), 15 (118-127), 20 (128-137) and 30 (138 and above).
Source: https://maplestorywiki.net/w/Star_Force_Enhancement (maplestorywiki.net). Version: wiki page last edited 2026-09-29. Checked: 2026-10-27. Trust: wiki.
Notes: Nexon's v.264 note confirms "The maximum Star Force enhancement level for equipment Lv. 138+ is now 30-Stars."

### gms.scroll.spell-trace-rates
Spell Trace scrolls come in 100%, 70%, 30% and 15% success rates, and during weekend Spell Trace Fever the rates become 100%, 95%, 45% and 25%.
| Normal success rate | Spell Trace Fever success rate |
|---|---|
| 100% | 100% (unchanged) |
| 70% | 95% |
| 30% | 45% |
| 15% | 25% |
Source: https://maplestorywiki.net/w/Scroll_Enhancement (maplestorywiki.net). Version: wiki page last edited 2026-09-15 (GMS v.271). Checked: 2026-10-27. Trust: wiki.
Notes: The page says Spell Trace Fever "occurs from Friday at 12:00 AM to Sunday at 11:59 PM Server Time" and "is also available at all times for players at MVP / VIP Gold tier and above." Diligence Level 100 adds +10% (additive) and the Enhancement Mastery guild skill adds +4% at Level 4. Scroll Enhancements are unavailable in Heroic (Reboot) worlds. Two scroll types with different success rates (e.g. 30% vs 70%) are a natural Bayes example.

### gms.scroll.chaos-outcomes
A successful Chaos Scroll changes each existing stat by a random amount from -5 to +5 with published probabilities; a Chaos Scroll of Goodness never lowers stats.
| Stat change | Chaos Scroll | Chaos Scroll of Goodness |
|---|---|---|
| -5 | 4.94% | - |
| -4 | 2.97% | - |
| -3 | 3.65% | - |
| -2 | 8.0% | - |
| -1 | 13.7% | - |
| +0 | 18.38% | 18.38% |
| +1 | 19.31% | 33.01% |
| +2 | 15.87% | 23.87% |
| +3 | 10.21% | 13.87% |
| +4 | 1.98% | 4.94% |
| +5 | 0.99% | 5.93% |
Source: https://maplestorywiki.net/w/Scroll_Enhancement (maplestorywiki.net). Version: wiki page last edited 2026-09-15 (GMS v.271). Checked: 2026-10-27. Trust: wiki.
Notes: Both columns sum to 100.00%. "Max HP and Max MP are increased by 10x the values." The Incredible versions use the same probabilities with -6/+6 in place of -5/+5 (Incredible Chaos Scroll) and +6 in place of +5 (Incredible Chaos Scroll of Goodness). Good E(X) and variance example: a discrete outcome table with values attached.

### gms.box.divine-wishing-bell
Nexon publishes the reward probabilities for the Divine Wishing Bell (3,500 NX each, 99,000 NX for 33), whose 33 listed rewards sum to 100.00%.
| Item | Rate |
|---|---|
| 100% 12-Star Enhancement (Lv. 150) | 5.00% |
| 100% 15-Star Enhancement (Lv. 150) | 0.70% |
| 100% 17-Star Enhancement (Lv. 150) | 0.50% |
| 100% 12-Star Enhancement (Lv. 160) | 5.00% |
| 100% 15-Star Enhancement (Lv. 160) | 0.60% |
| 100% 17-Star Enhancement (Lv. 160) | 0.20% |
| Karma Star Force 20-Star Enhancement (Lv. 160) | 0.06% |
| Karma Star Force 20-Star Enhancement (Lv. 200) | 0.03% |
| Karma Star Force 18-Star Enhancement (Lv. 250) | 0.09% |
| Abyssal Rebirth Flame | 8.00% |
| Magical Scroll - Two-handed weapon (ATT) Boost | 0.50% |
| Magical Scroll - One-Handed Weapon (ATT) | 0.50% |
| Magical Scroll - One-Handed Weapon (Magic ATT) | 0.50% |
| Magical Scroll for Magic ATT for Two-Handed Weapons | 0.50% |
| Premium Scroll for Accessory for ATT 100% | 0.50% |
| Premium Scroll for Accessory for Magic ATT 100% | 0.50% |
| Premium Scroll for Pet Equip for ATT 100% | 0.50% |
| Premium Scroll for Pet Equip. for Magic ATT 100% | 0.50% |
| Incredible Chaos Scroll of Goodness 100% | 3.00% |
| Pet Equipment Return Scroll | 1.00% |
| Pet Equipment Innocence Scroll 100% | 1.00% |
| Pet Equipment Pure Clean Slate Scroll 100% | 1.00% |
| 3x EXP Coupon (30 min) | 11.32% |
| 4x EXP Coupon (30 min) | 6.00% |
| Luxe Sauna Coupon | 1.00% |
| Advanced EXP Voucher | 3.00% |
| Advanced EXP Voucher | 1.00% |
| Arcane Symbol Selector Coupon | 17.00% |
| Sacred Symbol Selector Coupon | 17.00% |
| Symbol Selector Coupon | 0.50% |
| Faint Sol Erda Energy | 9.00% |
| Sol Erda Energy | 3.00% |
| Dense Sol Erda Energy | 1.00% |
Source: https://www.nexon.com/maplestory/general-post/33813 (Nexon). Version: rate post dated 2026-01-20, linked from the Random Box Rates page on 2026-10-27 (GMS v.271). Checked: 2026-10-27. Trust: official.
Notes: "Advanced EXP Voucher" appears twice on Nexon's page (3.00% and 1.00%); kept as printed. Nexon: "the displayed percentages are rounded, and the total sum of all rates may not add up to exactly 100%" (here they do). Interactive worlds only. Good for complement ("at least one 17-Star Enhancement in n bells") and geometric waiting time with a cost per try. Index page: https://www.nexon.com/maplestory/game/random-box-rates.

### gms.box.lucky-jewel-box
Nexon publishes the Lucky Jewel Box (2,200 NX) rates: one item from a 44-row primary table plus a separate Sol Erda Fragment bonus roll.
| Primary item | Rate |
|---|---|
| Onyx Apple (5) | 2.85% |
| Pure Equip Enhancement Scroll | 3.44% |
| Unique Potential Scroll 60% | 2.44% |
| Unique Potential Scroll 30% | 2.44% |
| Miracle Scroll for Armor for ATT 50% | 3.00% |
| Miracle Scroll for Armor for M ATT 50% | 4.00% |
| Scroll for Armor for ATT 70% | 4.00% |
| Scroll for Armor for Magic ATT 70% | 4.00% |
| Miracle Scroll for Accessory for ATT 50% | 4.00% |
| Miracle Scroll for Accessory for M ATT 50% | 4.00% |
| Scroll for Accessory for ATT 100% | 2.44% |
| Scroll for Accessory for Magic ATT 100% | 3.44% |
| Scroll for Pet Equip. for ATT 100% | 2.44% |
| Scroll for Pet Equip. for Magic ATT 100% | 3.44% |
| Bonus Epic Potential Scroll 100% | 3.00% |
| Unique Circulator | 3.44% |
| Pure Clean Slate Scroll 20% | 2.19% |
| Perfect Innocence Scroll 50% (2) | 1.00% |
| Eternal Rebirth Flame | 3.64% |
| Black Rebirth Flame | 2.44% |
| 100% 12-Star Enhancement (Lv. 150) | 7.00% |
| 100% 12-Star Enhancement (Lv. 160) | 7.00% |
| Lidium Heart (Permanent) | 1.94% |
| Crystal Heart (Permanent) | 1.50% |
| Garnet Heart (Permanent) | 1.94% |
| Unique Potential Scroll 80% | 1.94% |
| Unique Potential Scroll 100% | 0.50% |
| 100% 15-Star Enhancement (Lv. 150) | 4.00% |
| 100% 15-Star Enhancement (Lv. 160) | 4.00% |
| Legendary Potential Scroll 50% | 0.54% |
| X One-Handed Weapon Attack Scroll | 0.05% |
| X One-Handed Weapon Magic ATT Scroll | 0.05% |
| X Two-Handed Weapon Attack Scroll | 0.05% |
| X Two-Handed Weapon Magic ATT Scroll | 0.05% |
| 100% 17-Star Enhancement (Lv. 150) | 2.00% |
| 100% 17-Star Enhancement (Lv. 160) | 2.00% |
| 100% 20-Star Enhancement (Lv. 160) | 0.35% |
| 100% 18-Star Enhancement (Lv. 160) | 0.80% |
| 100% 17-Star Enhancement (Lv. 200) | 0.80% |
| 100% 18-Star Enhancement (Lv. 200) | 0.70% |
| 100% 20-Star Enhancement (Lv. 200) | 0.35% |
| Star Force +1-Star Enhancement Scroll 30% | 0.35% |
| Star Force +1-Star Enhancement Scroll 50% | 0.30% |
| 100% +1-Star Enhancement (Lv. 200) | 0.15% |

| Sol Erda Fragment bonus | Rate |
|---|---|
| Sol Erda Fragment (3) | 45.00% |
| Sol Erda Fragment (5) | 25.00% |
| Sol Erda Fragment (15) | 10.00% |
| Sol Erda Fragment (20) | 7.00% |
| Sol Erda Fragment (35) | 6.00% |
| Sol Erda Fragment (40) | 4.00% |
| Sol Erda Fragment (45) | 2.00% |
| Sol Erda Fragment (50) | 1.00% |
Source: https://www.nexon.com/maplestory/general-post/17098 (Nexon). Version: rate post dated 2022-07-12, still linked from the Random Box Rates page on 2026-10-27 (GMS v.271). Checked: 2026-10-27. Trust: official.
Notes: Both tables sum to 100.00% (primary: 44 rows; bonus: 8 rows). The Sol Erda bonus table is a clean discrete distribution for E(X) (expected fragments per box = sum of amount × rate). The post is old; the box being listed on the current rates page is the only evidence it is still sold, so say "Nexon's published rates" rather than "on sale now".

### gms.data.ranking-level-hero-2026-10-27
Levels of the top 500 Hero characters in Nexon's North America job ranking (both world types), pulled 2026-10-27; n = 500 of 227,326 ranked Heroes, levels 293-300.
Source: https://www.nexon.com/api/maplestory/no-auth/ranking/v2/na?type=job&id=Hero&reboot_index=0&page_index=1 (Nexon ranking API). Version: GMS v.271, snapshot 2026-10-27 13:44 UTC-7. Checked: 2026-10-27. Trust: official.
Notes: File `datasets/gms-ranking-level-hero-2026-10-27.csv`, columns rank, level, exp, job_name, world_id, 500 rows. Pulled with page_index = 1, 11, ..., 491 (10 rows per call; page_index is the starting rank). The human page is https://www.nexon.com/maplestory/rankings/north-america/job-ranking/explorer/Hero?world_type=both and its first 10 rows matched the pull. Level frequencies: 300: 6, 299: 11, 298: 13, 297: 24, 296: 59, 295: 200, 294: 102, 293: 85. exp is the exp into the current level (0 at level 300). reboot_index=0 total (227,326) equals reboot_index=1 (143,184) plus reboot_index=2 (84,142); the split into Heroic/Interactive is not labelled by the API, so do not name them. world_id is Nexon's numeric world code, not mapped to a world name here. Character names were dropped.

### gms.data.ranking-overall-legendary-2026-10-27
Level, job and world of the top 500 characters in Nexon's North America overall ("legendary") ranking, pulled 2026-10-27; n = 500, levels 297-300, 51 different jobs.
Source: https://www.nexon.com/api/maplestory/no-auth/ranking/v2/na?type=overall&id=legendary&reboot_index=0&page_index=1 (Nexon ranking API). Version: GMS v.271, snapshot 2026-10-27 13:45 UTC-7. Checked: 2026-10-27. Trust: official.
Notes: File `datasets/gms-ranking-overall-legendary-2026-10-27.csv`, columns rank, level, exp, job_name, world_id, 500 rows. Level counts: 300: 126, 299: 101, 298: 199, 297: 74. Most common jobs: Night Lord 61, Hero 37, Shadower 33, Bishop 30, Night Walker 26. world_id counts: 19: 167, 1: 165, 45: 154, 70: 14. Good for a job frequency table and a job × world two-way table. The API reported totalCount 16,744,864 ranked characters.

## Unverified

- **Cube tier-up rates (Glowing Cube, Bright Cube, Bonus Glowing / Bonus Bright, Red/Black names are not GMS).** maplestorywiki.net Cube, Glowing_Cube, Bright_Cube and Potential pages (fetched 2026-10-27) give no GMS rank-up rates; the Cube page says only that "In GlobalMS v239, probabilities of changing potential tiers were also changed" and links KMS/MSEA/CMS/TMS official probability pages, none for GMS. Nexon's news API only lists posts back to 2024-12-31, so the v.239 patch notes could not be located; StrategyWiki's Potential System page has no tier-up table. Third-party calculator pages (totalcalchub, gamerempire) were rejected as unsourced.
- **Potential line rates per cube.** Not published by Nexon for GMS on any page found; not on the wiki pages above.
- **Enhancement Mode Level 2 and 3 rates and meso multipliers (v.269).** Nexon's v.269 note gives only the qualitative description (see gms.starforce.enhancement-mode); no rate table found.
- **Post-v.271 Star Force success numbers with the Star Catch bonus built in.** Neither Nexon's v.271 note nor the wiki prints them.
- **A computed level-150 Star Force cost table as a sourced fact.** Only the formula is sourced; the level-150 numbers in gms.starforce.meso-cost Notes are our own computation.

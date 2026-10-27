# Datasets

Raw CSV pulls that back entries in the fact bank (`../README.md`). Files here are never edited after they are pulled. A lesson uses a subset and says which rows and columns.

One row per CSV:

| File | URL or API call | Date pulled | Columns | Rows |
| --- | --- | --- | --- | --- |
| `classic-founders-mfc-rates-2026-10-27.csv` | https://www.nexon.com/maplestory/general-post/45538 (rendered with scrapling fetch) | 2026-10-27 | item_name, rate | 50 |
| `classic-meowdb-monsters-2026-10-27.csv` | GET https://meowdb.com/msclassic/monsters (server-rendered table, default filter) | 2026-10-27 | meowdb_monster_id, name, level, hp, mp, p_dmg, m_dmg, p_def, m_def, acc, avoid, exp, map_count, attributes | 92 |
| `classic-meowdb-scrolls-2026-10-27.csv` | GET https://meowdb.com/msclassic/item-db/{id} for id 1-208 | 2026-10-27 | meowdb_item_id, name, tier, success_rate_pct, destroy_on_fail_pct, description | 208 |
| `classic-mfc-rates-grand-launch-2026-10-27.csv` | https://www.nexon.com/maplestory/general-post/46331 (rendered with scrapling fetch) | 2026-10-27 | item_name, rate | 50 |
| `gms-ranking-level-hero-2026-10-27.csv` | https://www.nexon.com/api/maplestory/no-auth/ranking/v2/na?type=job&id=Hero&reboot_index=0&page_index=N (N = 1, 11, ..., 491) | 2026-10-27 | rank, level, exp, job_name, world_id | 500 |
| `gms-ranking-overall-legendary-2026-10-27.csv` | https://www.nexon.com/api/maplestory/no-auth/ranking/v2/na?type=overall&id=legendary&reboot_index=0&page_index=N (N = 1, 11, ..., 491) | 2026-10-27 | rank, level, exp, job_name, world_id | 500 |
| `poe1-ladder-allflame-2026-10-27.csv` | https://www.pathofexile.com/api/ladders?offset=<o>&limit=200&id=<ladder> (Allflame, Hardcore Allflame, Ruthless Allflame) | 2026-10-27 | ladder_id, rank, level, class, experience, dead | 2000 |
| `poe1-ninja-divine-chaos-allflame.csv` | https://poe.ninja/poe1/api/economy/stash/current/currency/history?league=Allflame&type=Currency&id=3 | 2026-10-27 | daysAgo, receive_value_chaos, receive_count, pay_value_divine, pay_count | 96 |
| `poe1-ninja-divine-chaos-keepers.csv` | same endpoint with league=Keepers | 2026-10-27 | daysAgo, receive_value_chaos, receive_count, pay_value_divine, pay_count | 123 |
| `poe1-ninja-divine-chaos-mirage.csv` | same endpoint with league=Mirage | 2026-10-27 | daysAgo, receive_value_chaos, receive_count, pay_value_divine, pay_count | 137 |
| `poe1-ninja-exchange-currency-allflame-2026-10-27.csv` | https://poe.ninja/poe1/api/economy/exchange/current/overview?league=Allflame&type=Currency | 2026-10-27 | id, name, primaryValue_chaos, volumePrimaryValue_chaos, maxVolumeCurrency, maxVolumeRate | 100 |
| `poe2-ninja-ascendancy-counts-forbidden-rites-2026-10-27.csv` | https://poe.ninja/poe2/builds/forbiddenrites?class=<name> (public page, "Found N characters", 31 views) | 2026-10-27 | base_class, ascendancy, characters | 31 |
| `poe2-ninja-currency-prices-forbidden-rites-2026-10-27.csv` | https://poe.ninja/poe2/api/economy/exchange/current/overview?league=Forbidden%20Rites&type=Currency | 2026-10-27 | id, name, value_divine, volume_divine, max_volume_currency, max_volume_rate, change_7d_pct | 52 |
| `poe2-ninja-divine-daily-forbidden-rites-2026-10-27.csv` | https://poe.ninja/poe2/api/economy/exchange/current/details?league=Forbidden%20Rites&type=Currency&id=divine-orb | 2026-10-27 | date, exalted_per_divine, exalted_pair_volume_divine, chaos_per_divine, chaos_pair_volume_divine | 54 |

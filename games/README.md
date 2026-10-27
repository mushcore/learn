# Game fact bank

## Purpose

Every game number used in a MATH 3042 lesson comes from this bank, never from memory. A lesson cites bank entries by id, and `docs/superpowers/tools/fact-audit.py` refuses a lesson that cites an id not in the bank, uses game words with no citation, or labels a number with a game it did not cite.

## Files

| File | Game | Id prefix | Version it covers |
| --- | --- | --- | --- |
| `poe1.md` | Path of Exile | `poe1.` | 3.29, Allflame league |
| `poe2.md` | Path of Exile 2 | `poe2.` | 0.5.5e, Forbidden Rites league (early access) |
| `gms.md` | MapleStory (Global MapleStory, GMS) | `gms.` | v.271 |
| `ms-classic.md` | MapleStory Classic (Nexon's official Classic server) | `classic.` | Grand Launch Release Notes, 2026-10-20 (no public patch number) |

Ids for MapleStory Classic use the `classic.` prefix in file `ms-classic.md`. The file name and the prefix differ on purpose; the audit checks that each file only holds ids with its own prefix.

`datasets/` holds raw CSV pulls (see `datasets/README.md`). Entries may point at a dataset file.

## Entry grammar

One entry per `###` heading. Ids match `^[a-z0-9]+(\.[a-z0-9-]+)+$`.

```
### gms.starforce.rates
<one-sentence statement>
<optional table or list of numbers>
Source: <https URL> (<publisher>). Version: <patch or league, date>. Checked: YYYY-MM-DD. Trust: official | wiki | measured (n = <sample>).
Notes: <optional>
```

Source must be an https URL. Reddit, Google, Bing, YouTube and Discord are rejected as sources. Version, Checked and Trust are all required.

Candidates that cannot be sourced go under a final `## Unverified` heading in the file, with what was tried. The parser ignores everything below that heading, so a lesson can never cite them.

## Trust order

1. `official`: the publisher's own page (Nexon, Grinding Gear Games) or API.
2. `wiki`: the game's wiki, used when the publisher does not publish the figure.
3. `measured (n = <sample>)`: our own count or a third-party dataset such as poe.ninja. The sample size is required, as an integer.

Prefer a higher entry. When two sources disagree, keep the higher-trust one and say so in Notes.

## How a lesson cites

1. One line near the top of the lesson, after the front matter:

   `<!-- facts: gms.starforce.rates, poe1.fusing.sixlink -->`

   A lesson with no sourced game number writes `<!-- facts: none; <reason> -->` and must contain no game words or labels.

2. Every game number in the lesson text carries a bracket label right after it:

   `30 % [GMS, Star Force 15→16, checked 2026-10-27]`

   The first word is the game: `GMS`, `Classic`, `PoE1` or `PoE2`. It must match the prefix of at least one id on the facts line (`GMS` with `gms.`, `Classic` with `classic.`, `PoE1` with `poe1.`, `PoE2` with `poe2.`). The date is the entry's Checked date.

## Datasets

Datasets are never edited. A lesson or entry uses a subset (filtered rows, selected columns) and says which; the raw CSV stays as pulled.

## Audit

```
python -I docs/superpowers/tools/fact-audit.py --bank-only
python -I docs/superpowers/tools/fact-audit.py <lesson.md>...
```

`--bank DIR` points the tool at another bank directory. Exit status is 1 on any FAIL.

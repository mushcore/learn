---
title: Unipolar NRZ, polar NRZ-L & NRZ-I
minutes: 13
---

A line coding scheme is a rule that turns each bit into a voltage. The lecture starts with the three simplest rules. None of them guarantees that the voltage ever changes, and their problems come from that.

## Three families of schemes

| Family | Schemes named on the slide |
|---|---|
| **Unipolar** | NRZ |
| **Polar** | NRZ, RZ, and biphase (Manchester, and differential Manchester) |
| **Bipolar** | AMI |

RZ is in this list and nowhere else in the lecture: no slide gives its rule.

## Unipolar: every level on one side of the time axis

The slide calls these **unipolar (on-off keying)** schemes: *all the signal levels are on one side of the time axis, either above or below.*

Traditionally, a unipolar scheme was designed as a **non-return-to-zero (NRZ)** scheme. Slide wording: *NRZ because the signal does not return to zero at the middle of the bit.*

| Bit | Voltage |
|---|---|
| 1 | positive voltage |
| 0 | zero voltage |

The slide figure sends 1 0 1 1 0. With `+` for the positive level and `0` for the zero level:

| Bit | 1 | 0 | 1 | 1 | 0 |
|---|---|---|---|---|---|
| Unipolar NRZ | + | 0 | + | + | 0 |

### The slide's five bits in unipolar NRZ

```widget
line-code
{ "bits": "10110", "schemes": ["unipolar"], "scheme": "unipolar", "title": "Unipolar NRZ: positive voltage for 1, zero voltage for 0" }
```

## Polar: voltages on both sides of the time axis

Slide wording: *the voltages are on both sides of the time axis.* The lecture gives two polar NRZ schemes.

| | NRZ-L (Level) | NRZ-I (Invert) |
|---|---|---|
| What carries the bit | the **level**: two levels of voltage amplitude | the **change or lack of change** in the level of the voltage |
| Bit 0 | positive voltage level | no change |
| Bit 1 | negative voltage level | change |

The slide figure sends 0 1 0 0 1 1 1 0, with `−` for the negative level:

| Bit | 0 | 1 | 0 | 0 | 1 | 1 | 1 | 0 |
|---|---|---|---|---|---|---|---|---|
| NRZ-L | + | − | + | + | − | − | − | + |
| NRZ-I | + | − | − | − | + | − | + | + |

NRZ-I needs a level to start from. The figure takes the level before the first bit as positive, so the leading 0 stays positive. Its legend marks every bit boundary: *No inversion: Next bit is 0* and *Inversion: Next bit is 1*.

The same level can therefore mean either bit in NRZ-I. Bits 2, 3 and 4 are all negative in the figure, yet they are 1, 0, 0: only the first of them began with an inversion.

:::warn Other figures in the course material draw 1 as the high level
The slide-55 definition of NRZ-L is positive for 0 and negative for 1. The chart of common line code formats on slide 4, the self-synchronization figure and the complementary note (04a) all draw 1 high and 0 low. Use the slide-55 definition unless a question states its own.
:::

### NRZ-I decides at every bit boundary

At each boundary NRZ-I inverts for a 1 and holds for a 0, so bits 2 to 4 share one level although only bit 2 is a 1.

```widget
line-code-play
{ "bits": "01001110", "schemes": ["nrz-l", "nrz-i"], "scheme": "nrz-i", "title": "The slide's eight bits, drawn one bit at a time" }
```

### The slide's eight bits in NRZ-L and NRZ-I

```widget
line-code
{ "bits": "01001110", "schemes": ["nrz-l", "nrz-i"], "scheme": "nrz-l", "title": "Polar NRZ: the level carries the bit (NRZ-L) or the inversion does (NRZ-I)" }
```

## Three problems of polar NRZ

The slide after the figure is titled *Polar Schemes – Problems*:

| Problem | Slide detail |
|---|---|
| **DC components** | power density is very high around frequencies close to zero |
| **Baseline wandering** | a long sequence of 0s or 1s |
| **No self-synchronization** | a long sequence of 0s or 1s |

In NRZ-L a long sequence of either bit holds the voltage at one level. The receiver's running average drifts toward that level ([baseline wandering](#/comp3721-w4/baseline-dc)), and no transition arrives to reset its clock ([self-synchronization](#/comp3721-w4/self-synchronization)).

## NRZ-I cures the 1s, not the 0s

The complementary note (04a) describes the same NRZ-I rule, a transition to encode a 1 and none to encode a 0, and adds: *this solves the problem of consecutive 1s, but obviously does nothing for consecutive 0s.*

Every 1 is an inversion, so a run of 1s changes level at every bit. A run of 0s is still a flat line.

### Eight 1s, then eight 0s, in the three NRZ schemes

```widget
line-code
{ "bits": "1111111100000000", "schemes": ["unipolar", "nrz-l", "nrz-i"], "compare": true, "title": "Long runs: where each NRZ scheme stops changing" }
```

```quiz
[
  {
    "q": "In which family does the slide place AMI?",
    "options": ["Unipolar", "Polar", "Bipolar", "Biphase"],
    "answer": 2,
    "explain": "Unipolar: NRZ. Polar: NRZ, RZ, and biphase (Manchester, and differential Manchester). Bipolar: AMI. Biphase is a group inside the polar family, not a family of its own."
  },
  {
    "q": "In a unipolar scheme, the signal levels are on both sides of the time axis.",
    "type": "tf",
    "answer": false,
    "explain": "Unipolar: all the signal levels are on **one side** of the time axis, either above or below. Voltages on both sides of the time axis is the definition of a **polar** scheme."
  },
  {
    "q": "The bits 0 1 1 0 are sent with unipolar NRZ. Which signal is sent? (`+` positive, `−` negative, `0` zero, one symbol per bit)",
    "options": ["+ 0 0 +", "0 + + 0", "+ − − +", "− + + −"],
    "answer": 1,
    "explain": "Unipolar NRZ: positive voltage defines bit 1 and the zero voltage defines bit 0, so 0 1 1 0 is `0 + + 0`. `+ − − +` is the NRZ-L signal for the same bits."
  },
  {
    "q": "The bits 1 1 0 1 are sent with NRZ-L as slide 55 defines it. Which signal is sent?",
    "options": ["+ + − +", "− + + −", "0 0 + 0", "− − + −"],
    "answer": 3,
    "explain": "NRZ-L: positive voltage level for 0 and negative voltage level for 1, so 1 1 0 1 is `− − + −`. `+ + − +` draws 1 as the high level, the convention of the other figures, not of the slide-55 definition."
  },
  {
    "q": "The bits 1 1 0 1 are sent with NRZ-I. The level before the first bit is positive. Which signal is sent?",
    "options": ["− + + −", "− − + −", "+ − − +", "+ + − +"],
    "answer": 0,
    "explain": "No change for 0 and change for 1. Start positive: 1 inverts to `−`, 1 inverts to `+`, 0 stays `+`, 1 inverts to `−`. Result `− + + −`."
  },
  {
    "q": "Fill in the blank: in NRZ-I, the change or lack of change in the level of the voltage determines the ________ of the bit.",
    "type": "text",
    "answer": ["value"],
    "explain": "Slide wording: the change or lack of change in the level of the voltage determines the value of the bit. No change for 0 and change for 1."
  },
  {
    "q": "Select the three problems the slide lists for the polar NRZ schemes.",
    "options": ["DC components", "Three voltage levels", "Baseline wandering", "No self-synchronization", "A signal rate higher than Manchester's"],
    "answer": [0, 2, 3],
    "explain": "DC components (power density is very high around frequencies close to zero), baseline wandering and no self-synchronization (both from a long sequence of 0s or 1s). Three voltage levels describes a bipolar scheme."
  },
  {
    "q": "In NRZ-I, a long sequence of 1s leaves the signal at one level.",
    "type": "tf",
    "answer": false,
    "explain": "Every 1 is a change of level, so a run of 1s inverts at every bit. A long sequence of **0s** is the flat line: 04a says NRZ-I solves the problem of consecutive 1s but does nothing for consecutive 0s."
  },
  {
    "q": "An NRZ-I signal carries the bits 0 1 1 0 1 0 0 1. How many inversions does it make at the start of a bit?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "inversions",
    "explain": "One inversion for each 1 and none for a 0. The bits contain four 1s, so there are 4 inversions, whatever level the signal started from."
  },
  {
    "type": "match",
    "q": "Match each scheme to its rule.",
    "pairs": [
      ["Unipolar NRZ", "positive voltage for 1, zero voltage for 0"],
      ["NRZ-L", "positive level for 0, negative level for 1"],
      ["NRZ-I", "no change for 0, change for 1"]
    ],
    "explain": "Unipolar keeps every level on one side of the time axis. NRZ-L reads the level itself. NRZ-I reads whether the level changed at the start of the bit."
  },
  {
    "q": "Why is the scheme called non-return-to-zero?",
    "options": ["The zero voltage is never used", "The voltages are on both sides of the time axis", "The signal does not return to zero at the middle of the bit", "A bit 0 is never sent as a voltage"],
    "answer": 2,
    "explain": "Slide wording: NRZ because the signal does not return to zero at the middle of the bit. Unipolar NRZ does use the zero voltage: it defines bit 0."
  },
  {
    "q": "An NRZ-L signal (slide-55 definition) reads `− + + − −`. Which bits does it carry?",
    "options": ["0 1 1 0 0", "1 1 0 1 0", "1 0 1 0 1", "1 0 0 1 1"],
    "answer": 3,
    "explain": "Negative is 1 and positive is 0, so `− + + − −` is 1 0 0 1 1. Reading high as 1 gives 0 1 1 0 0, the other figures' convention."
  },
  {
    "q": "An NRZ-I signal reads `+ − − + +`. The level before the first bit was positive. Which bits does it carry?",
    "options": ["0 1 0 1 0", "0 1 1 0 0", "1 0 0 1 1", "0 1 1 0 1"],
    "answer": 0,
    "explain": "Read the boundaries, not the levels: `+` to `+` no change (0), `+` to `−` change (1), `−` to `−` no change (0), `−` to `+` change (1), `+` to `+` no change (0). The bits are 0 1 0 1 0. Reading the levels as NRZ-L gives 0 1 1 0 0."
  }
]
```

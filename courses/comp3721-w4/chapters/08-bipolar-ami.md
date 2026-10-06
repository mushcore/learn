---
title: Bipolar AMI & the schemes compared
minutes: 12
---

Unipolar and polar schemes use two voltage levels. The last scheme of the lecture adds a third, and with it all six rules can be set side by side.

## Bipolar: three voltage levels

The slide calls these **bipolar (multilevel binary)** schemes. They use three voltage levels: **positive, negative, zero**.

- The voltage level for one data element (bit) is at zero.
- The voltage level for the other element alternates between positive and negative.

## AMI: each 1 takes the opposite polarity to the 1 before it

**Alternate Mark Inversion (AMI)** is the one bipolar scheme of the lecture. The slide reads the name as *alternate 1 inversion*: the mark is the bit 1.

| Bit | Voltage |
|---|---|
| 0 | a neutral zero voltage |
| 1 | alternating positive and negative voltages |

The slide figure sends 0 1 0 0 1 0, and its first 1 is positive:

| Bit | 0 | 1 | 0 | 0 | 1 | 0 |
|---|---|---|---|---|---|---|
| AMI | 0 | + | 0 | 0 | − | 0 |

The second 1 is negative although two 0s separate it from the first. The alternation counts 1s only; the 0s in between change nothing.

### The slide's six bits in AMI

```widget
line-code
{ "bits": "010010", "schemes": ["ami"], "scheme": "ami", "title": "AMI: zero voltage for 0, alternating positive and negative voltages for 1" }
```

## What the AMI rule implies (not on the slides)

The slides give AMI's rule and state no properties for it. These follow from the rule:

- One signal element per bit, so $r = 1$, the same as the NRZ schemes.
- A run of 1s alternates `+ − + −`: a transition at every bit.
- A run of 0s stays at zero voltage: no transition, so the receiver has nothing to synchronize on.
- Each negative 1 cancels a positive 1, and a 0 adds nothing, so the mean amplitude stays at or near zero.

## The six schemes side by side

The lecture's summary slide names the families: unipolar, polar, and bipolar schemes.

| Scheme | Family | Levels | Bit 0 | Bit 1 | $r$ | Self-synchronization | Baseline wandering | DC component |
|---|---|---|---|---|---|---|---|---|
| Unipolar NRZ | unipolar | positive, zero | zero voltage | positive voltage | 1 | none in a long run of 0s or 1s (derived) | yes, in a long run (derived) | yes: every level is on one side of the axis (derived) |
| NRZ-L | polar | positive, negative | positive level | negative level | 1 | no: a long sequence of 0s or 1s | yes: a long sequence of 0s or 1s | yes |
| NRZ-I | polar | positive, negative | no change | change | 1 | no: the slide says 0s or 1s; 04a says only the 0s remain | yes | yes |
| Manchester | polar, biphase | positive, negative | high-to-low at the middle | low-to-high at the middle | $\frac{1}{2}$ | yes: transition at the middle of the bit | no | no |
| Differential Manchester | polar, biphase | positive, negative | inversion at the start | no inversion at the start | $\frac{1}{2}$ | yes: transition at the middle of the bit | no | no |
| AMI | bipolar | positive, negative, zero | zero voltage | alternating positive and negative | 1 | none in a long run of 0s (derived) | no: the average stays near zero (derived) | none: the 1s cancel (derived) |

The polar rows are slide statements. Cells marked (derived) are not on the slides; they follow from the scheme's rule. The $r$ column comes from the slide figures for $r = 1$ and $r = 1/2$.

Only the two Manchester schemes clear all three property columns. They pay for it with $r = 1/2$: twice the signal rate of the others for the same data rate.

### Ten bits in all six schemes

```widget
line-code
{ "bits": "0110000111", "schemes": ["unipolar", "nrz-l", "nrz-i", "manchester", "diff-manchester", "ami"], "compare": true, "title": "One bit pattern, six line coding schemes" }
```

```quiz
[
  {
    "q": "How many voltage levels does a bipolar scheme use?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "levels",
    "explain": "Three voltage levels: positive, negative, zero. One data element sits at zero and the other alternates between positive and negative."
  },
  {
    "q": "The bits 1 1 0 1 are sent with AMI. The first 1 is positive. Which signal is sent? (`+` positive, `−` negative, `0` zero)",
    "options": ["+ + 0 +", "+ − 0 +", "+ − 0 −", "− + 0 +"],
    "answer": 1,
    "explain": "0 is a neutral zero voltage and the 1s alternate: `+`, then `−`, then `0` for the 0, then `+` again. The third 1 is positive because the 1 before it was negative."
  },
  {
    "q": "The bits 1 0 0 1 1 are sent with AMI. The first 1 is positive. Which signal is sent?",
    "options": ["+ 0 0 + −", "+ 0 0 + +", "+ 0 0 − +", "− 0 0 − +"],
    "answer": 2,
    "explain": "The 0s between the 1s do not reset the alternation: first 1 `+`, second 1 `−`, third 1 `+`. Result `+ 0 0 − +`."
  },
  {
    "q": "Fill in the blank: AMI stands for Alternate ________ Inversion.",
    "type": "text",
    "answer": ["mark"],
    "explain": "Alternate Mark Inversion. The slide reads it as alternate 1 inversion: the mark is the bit 1."
  },
  {
    "q": "In AMI, bit 0 alternates between positive and negative voltages.",
    "type": "tf",
    "answer": false,
    "explain": "0 is a neutral zero voltage. Bit **1** is the one sent as alternating positive and negative voltages."
  },
  {
    "q": "What other name does the slide give to bipolar schemes?",
    "options": ["On-off keying", "Biphase", "Differential encoding", "Multilevel binary"],
    "answer": 3,
    "explain": "Bipolar (multilevel binary) schemes. On-off keying is the other name for unipolar schemes, biphase covers the two Manchester schemes, and differential encoding is NRZ-I and differential Manchester."
  },
  {
    "q": "Which scheme uses the zero voltage for bit 0 and a positive voltage for every bit 1?",
    "options": ["Unipolar NRZ", "AMI", "NRZ-L", "Manchester"],
    "answer": 0,
    "explain": "Unipolar NRZ: positive voltage defines bit 1 and the zero voltage defines bit 0, all on one side of the time axis. AMI also uses zero for 0, but its 1s alternate between positive and negative."
  },
  {
    "q": "Select every scheme that carries one data element per two signal elements ($r = \\frac{1}{2}$).",
    "options": ["NRZ-L", "Manchester", "AMI", "Differential Manchester", "NRZ-I"],
    "answer": [1, 3],
    "explain": "The two biphase schemes split every bit into two halves at opposite levels. NRZ-L, NRZ-I and AMI send one signal element per bit, $r = 1$."
  },
  {
    "type": "match",
    "q": "Match each scheme to the way it sends a bit 1.",
    "pairs": [
      ["Unipolar NRZ", "positive voltage, every time"],
      ["NRZ-L", "negative voltage level"],
      ["NRZ-I", "a change of level at the start of the bit"],
      ["Manchester", "low-to-high at the middle of the bit"],
      ["Differential Manchester", "no inversion at the start of the bit"],
      ["AMI", "alternating positive and negative voltages"]
    ],
    "explain": "Unipolar NRZ and NRZ-L read a level, NRZ-I and differential Manchester read the start of the bit, Manchester reads the direction of the middle transition, and AMI alternates the polarity of its 1s."
  },
  {
    "q": "An AMI signal reads `0 + − 0 +`. Which bits does it carry?",
    "options": ["1 0 0 1 0", "0 1 0 0 1", "0 1 1 0 1", "0 1 1 1 1"],
    "answer": 2,
    "explain": "Zero voltage is 0 and any non-zero voltage is 1, whatever its sign: `0 + − 0 +` is 0 1 1 0 1."
  },
  {
    "q": "In AMI, the polarity of a 1 depends on how many 0s came just before it.",
    "type": "tf",
    "answer": false,
    "explain": "It depends only on the previous 1: each 1 takes the opposite polarity. In the slide figure the second 1 is negative with two 0s in between."
  },
  {
    "q": "The bits 1 0 1 1 0 1 1 are sent with AMI, and the first 1 is positive. How many of the 1s are sent as a negative voltage?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "The five 1s alternate `+ − + − +`, so two are negative. The whole signal is `+ 0 − + 0 − +`."
  },
  {
    "q": "A long sequence of 0s is sent. Which of these schemes still has a transition in every bit?",
    "options": ["AMI", "NRZ-L", "Unipolar NRZ", "Manchester"],
    "answer": 3,
    "explain": "Manchester has a transition at the middle of every bit, which is what provides its self-synchronization. AMI and unipolar NRZ sit at zero voltage for a run of 0s and NRZ-L sits at the positive level."
  }
]
```

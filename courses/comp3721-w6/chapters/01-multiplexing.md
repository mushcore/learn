---
title: Bandwidth utilization and multiplexing
minutes: 12
---

Real links have limited bandwidth, and one link is often far wider than any single signal needs. Multiplexing lets several signals share that one link at the same time.

## Bandwidth utilization has two goals

Slide wording: *Bandwidth utilization is the wise use of available bandwidth.* The slide adds the reason: *We have links with limited bandwidths in real life!*

Two broad categories of technique exist, with different goals:

| Technique | Goal | What it does | In this course? |
|---|---|---|---|
| **Multiplexing** | *efficiency* | *We combine several channels into one* | yes |
| **Spectrum spreading** | *privacy* | spreads a signal over a wider band | *We do not discuss this technique in this class* |

## When a link can be shared

*Whenever the bandwidth of a medium linking two devices is greater than the bandwidth needs of the devices, the link can be shared.* The slide's example is fibre: *High-bandwidth media such as optical fiber has a bandwidth far in excess of that needed for the average transmission signal.* A single signal on such a link leaves most of the bandwidth idle.

## Multiplexing, the definition

Slide wording: *Multiplexing is the set of techniques that allow the simultaneous transmission of multiple signals across a single data link.* The slide's easy definition: *Combining several channels into one.*

## The highway analogy

The slides compare a link to a multi-lane highway.

| Highway | Network |
|---|---|
| Different vehicles | multiple signals |
| The multi-lane highway, *several lanes allowing multiple vehicles to travel in the same direction at the same time* | the transmission channel |
| Lane merging and traffic flow management | multiplexing |

The slide names the two techniques inside the analogy: *Time Division Multiplexing (TDM) where vehicles (signals) are given specific time slots to enter the highway, or Frequency Division Multiplexing (FDM) where each lane might be dedicated to a type of vehicle.* TDM shares the road in time; FDM gives each signal its own lane.

## MUX, DEMUX, one link and n channels

The slide figure has $n$ input lines entering a **MUX** (multiplexer), one link leaving it labelled *1 link, n channels*, and a **DEMUX** (demultiplexer) at the far end splitting the link back into $n$ output lines. The MUX combines; the DEMUX separates.

The boxed definitions:

:::info Link versus channel
*Link refers to the physical path. Channel refers to the portion of a link.*
:::

A link is the cable or the air between the MUX and the DEMUX. A channel is the share of that link that one input gets: a band of frequencies, a colour of light, or a slot of time. One link carries $n$ channels.

The FYI slide shows a commercial MUX box (an Omnitron iConverter 4xT1/E1 MUX): four T1/E1 lines in, one line out.

## Three techniques, analog or digital

| Technique | Signals | What is shared |
|---|---|---|
| **Frequency-Division Multiplexing (FDM)** | *analog signals* | the link's bandwidth, one frequency band per channel |
| **Wavelength-Division Multiplexing (WDM)** | *analog signals* | a fibre's light, one wavelength per channel |
| **Time-Division Multiplexing (TDM)** | *digital signals* | the link's time, one slot per channel |

FDM and WDM are the analog techniques; TDM is the digital one. The next lessons take them in that order.

## The same n inputs on one link, three ways

```widget
mux-link
{ "n": 3, "mode": "fdm", "title": "Three input lines into one link: switch between FDM bands, TDM slots and WDM colours" }
```

```quiz
[
  {
    "q": "Which of these is the slide's definition of bandwidth utilization?",
    "options": ["The ratio of data rate to bandwidth", "The wise use of available bandwidth", "The set of techniques that spread a signal for privacy", "The number of channels a link can carry"],
    "answer": 1,
    "explain": "Slide wording: bandwidth utilization is the wise use of available bandwidth. Links have limited bandwidths in real life, so they must be used well."
  },
  {
    "q": "What is the goal of multiplexing?",
    "options": ["Privacy", "Error control", "Efficiency", "Synchronization"],
    "answer": 2,
    "explain": "Multiplexing combines several channels into one for **efficiency**. Privacy is the goal of the other category, spectrum spreading, which the course does not cover."
  },
  {
    "q": "Spectrum spreading is a bandwidth-utilization technique whose goal is privacy.",
    "type": "tf",
    "answer": true,
    "explain": "The slides name two categories: multiplexing (goal efficiency) and spectrum spreading (goal privacy). Only multiplexing is taught in this class."
  },
  {
    "q": "Fill in the blank: multiplexing is the set of techniques that allow the simultaneous transmission of multiple signals across a single data ________.",
    "type": "text",
    "answer": ["link"],
    "explain": "A single data link. The easy definition is combining several channels into one; the link is the physical path that the channels share."
  },
  {
    "q": "In the slide's boxed definitions, which refers to the physical path?",
    "options": ["The channel", "The carrier", "The slot", "The link"],
    "answer": 3,
    "explain": "Link refers to the physical path. Channel refers to the portion of a link. One link carries n channels."
  },
  {
    "q": "A link can be shared whenever the bandwidth of the medium is smaller than the bandwidth needs of the devices.",
    "type": "tf",
    "answer": false,
    "explain": "The condition is the other way round: the link can be shared whenever the bandwidth of the medium is **greater** than the bandwidth needs of the devices. Fibre is the slide's example of bandwidth far in excess of what one signal needs."
  },
  {
    "q": "Which multiplexing technique is used with digital signals?",
    "options": ["TDM", "FDM", "WDM", "All three"],
    "answer": 0,
    "explain": "The slide marks FDM and WDM as analog-signal techniques and TDM as the digital-signal technique: time is shared, one slot per input."
  },
  {
    "q": "In the highway analogy, which technique gives each lane to a type of vehicle?",
    "options": ["TDM", "Spectrum spreading", "FDM", "WDM"],
    "answer": 2,
    "explain": "FDM: each lane might be dedicated to a type of vehicle, that is, each signal gets its own frequency band. TDM is the one where vehicles are given specific time slots to enter the highway."
  },
  {
    "q": "What does the device at the far end of a multiplexed link do?",
    "options": ["It amplifies the composite signal", "It modulates each signal onto a carrier", "It separates the link back into the n output lines", "It assigns time slots to the inputs"],
    "answer": 2,
    "explain": "The DEMUX (demultiplexer) splits the one link with n channels back into n output lines. The MUX at the sending end does the combining."
  }
]
```

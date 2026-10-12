---
title: "WDM: FDM for light"
minutes: 8
---

A fibre-optic cable can carry far more than one data stream. WDM fills it by sending several colours of light down the same fibre at once.

## WDM is analog and optical

Slide wording: *An analog multiplexing technique to combine optical signals.* The reason it exists: *Due to the high data rate of a fiber-optic cable, using it for a single line wastes the available bandwidth.*

Each data stream drives its own light source at its own wavelength $\lambda_1$, $\lambda_2$, $\lambda_3$, and the wavelengths travel together on one fibre.

## WDM versus FDM

| | FDM | WDM |
|---|---|---|
| Similarity | *Both combine different signals of different frequencies* | |
| Signals | electrical, on wire or air | *optical signals transmitted through fiber-optic channels* |
| Frequencies | kHz to GHz | *very high*: light |
| Combining device | modulators and an adder | *a prism* |

A wavelength is a frequency, so WDM is FDM carried out on light. The slide's spectrum charts make the point: the electromagnetic spectrum runs from radio through microwaves, infrared, visible light, ultraviolet and X-rays to gamma rays, and the radio bands alone go from ELF at 3 to 30 kHz up to EHF at 30 to 300 GHz. Light sits above all of the radio bands, so the "carriers" in WDM are enormously high frequencies. The charts are background; the examinable fact is that light means very high frequency.

## The prism combines and splits

Slide wording: *The combining and splitting of light sources are easily handled by a prism.* The figure shows a prism dispersing white light into colours and a second prism recombining them. In the textbook figure $\lambda_1$, $\lambda_2$, $\lambda_3$ enter a multiplexer prism, travel the fibre-optic cable as $\lambda_1 + \lambda_2 + \lambda_3$, and a demultiplexer prism separates them again.

The second figure on the slide says the same with data: Data Stream 1 to 4 enter a multiplexer, share a *Single Optical Fiber*, and a de-multiplexer returns four streams. The MUX is a prism, the DEMUX is a prism, and the link is the fibre. Each wavelength is one channel, exactly as each carrier is one channel in FDM.

## Three wavelengths on one fibre

```widget
mux-link
{ "n": 3, "mode": "wdm", "title": "WDM: three data streams as three wavelengths on a single optical fibre" }
```

```quiz
[
  {
    "q": "WDM is a digital multiplexing technique for fibre-optic cable.",
    "type": "tf",
    "answer": false,
    "explain": "WDM is an **analog** multiplexing technique to combine optical signals. Like FDM it combines signals of different frequencies; only TDM is digital."
  },
  {
    "q": "Fill in the blank: in WDM, the combining and splitting of light sources are easily handled by a ________.",
    "type": "text",
    "answer": ["prism"],
    "explain": "A prism. One prism acts as the multiplexer, combining the wavelengths onto the fibre, and another as the demultiplexer, splitting them apart."
  },
  {
    "q": "What do FDM and WDM have in common, according to the slide?",
    "options": ["Both use time slots", "Both combine different signals of different frequencies", "Both require a fibre-optic cable", "Both work only with digital data"],
    "answer": 1,
    "explain": "The similarity: both combine different signals of different frequencies. The difference is that WDM's signals are optical, on fibre, at very high frequencies."
  },
  {
    "q": "Why is WDM used on a fibre-optic cable?",
    "options": ["A fibre cannot carry an electrical carrier", "Light cannot be modulated", "Using the fibre for a single line wastes its available bandwidth", "Guard bands are impossible with light"],
    "answer": 2,
    "explain": "Due to the high data rate of a fibre-optic cable, using it for a single line wastes the available bandwidth. Several wavelengths share the fibre instead."
  },
  {
    "q": "In the textbook figure, what travels on the fibre-optic cable between the two prisms?",
    "options": ["λ₁ only, with λ₂ and λ₃ on separate fibres", "λ₁ + λ₂ + λ₃ together", "A digital frame of three slots", "White light with no data"],
    "answer": 1,
    "explain": "The multiplexer prism combines λ₁, λ₂ and λ₃ so the cable carries λ₁ + λ₂ + λ₃; the demultiplexer prism splits them back into three outputs."
  },
  {
    "q": "Which statement about the frequencies in WDM is the slide's?",
    "options": ["They are very high, because the signals are light", "They are the same as in AM radio", "They are below 4 kHz, like a voice channel", "They are not frequencies at all"],
    "answer": 0,
    "explain": "In WDM the multiplexing and demultiplexing involve optical signals through fibre-optic channels and the frequencies are very high. A wavelength of light is a frequency far above radio."
  }
]
```

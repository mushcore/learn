---
title: "Review 1b: phase and wavelength"
minutes: 15
---
This lesson teaches where a wave is in its cycle, and how far it travels during one cycle. It prepares the exam question that gives a fraction of a cycle or a frequency and asks for an angle or a distance.

## What phase is, in plain words

Two sine waves can be identical in height and speed, yet one starts at zero while the other starts at its peak. **Phase** says where in its cycle a wave is at time zero.

Think of a point running around a circle. One full lap is one cycle of the wave, so the wave's position is the point's angle on the circle.

A full lap is 360 degrees. Mathematicians also measure the same lap as $2\pi$ radians, a radian being just another unit of angle.

So a phase is a fraction of a lap, written as an angle. A quarter lap is a quarter of 360 degrees.

```diagram
{ "type": "grid", "title": "A fraction of a cycle is the same fraction of a full turn", "nodes": [
  { "id": "h0", "label": "Fraction", "row": 0, "col": 0 },
  { "id": "h1", "label": "Degrees", "row": 0, "col": 1 },
  { "id": "h2", "label": "Radians", "row": 0, "col": 2 },
  { "id": "a0", "label": "1/4", "row": 1, "col": 0 },
  { "id": "a1", "label": "90°", "row": 1, "col": 1 },
  { "id": "a2", "label": "π/2", "row": 1, "col": 2 },
  { "id": "b0", "label": "1/2", "row": 2, "col": 0 },
  { "id": "b1", "label": "180°", "row": 2, "col": 1 },
  { "id": "b2", "label": "π", "row": 2, "col": 2 },
  { "id": "c0", "label": "3/4", "row": 3, "col": 0 },
  { "id": "c1", "label": "270°", "row": 3, "col": 1 },
  { "id": "c2", "label": "3π/2", "row": 3, "col": 2 },
  { "id": "d0", "label": "1", "row": 4, "col": 0 },
  { "id": "d1", "label": "360°", "row": 4, "col": 1 },
  { "id": "d2", "label": "2π", "row": 4, "col": 2 }
], "hi": ["d1", "d2"], "caption": "One whole cycle is 360° = 2π rad, so multiply the fraction by 360° or by 2π." }
```

## A tiny case you can do in your head

A wave is shifted by half a cycle. Half of a full turn is:

$$\tfrac{1}{2} \times 360° = \mathbf{180°}$$

In radians, half of $2\pi$:

$$\tfrac{1}{2} \times 2\pi = \mathbf{\pi\ rad} = 3.14\ \text{rad}$$

That fits the picture: half a lap puts the point on the far side of the circle.

## The phase formula, with each symbol named

$$\varphi = \text{fraction} \times 360° \qquad \text{rad} = \text{degrees} \times \frac{2\pi}{360°}$$

- $\varphi$ is the phase, in degrees or radians.
- The fraction is the part of one cycle the wave is shifted by. At a time $t$ it is $t \div T$, where $T$ is the period.

The trap is mixing the two units. Write the degrees first, then convert with $2\pi/360$.

## The slide's phase example, worked

*A sine wave is offset 1/9 cycle with respect to time 0. What is its phase in degrees and radians?*

$$\varphi = \tfrac{1}{9} \times 360° = \mathbf{40°}$$

$$40° \times \frac{2\pi}{360°} = \frac{2\pi}{9} = \mathbf{0.698\ rad}$$

Check: 1/9 is a little less than 1/8, and 1/8 of a cycle is 45°.

## What wavelength is, in plain words

A wave does not stay put. It travels along the cable or through the air.

**Wavelength** is the distance it covers while it completes one cycle.

Think of footsteps. Your step length is your walking speed times the time one step takes.

The wave's step is one cycle. Its speed depends on what it travels through: fastest in a vacuum, slower in air, slower still in cable.

The frequency does not depend on the medium, because the sender sets it. The wavelength depends on both the frequency and the medium.

```diagram
{ "type": "flow", "title": "From frequency to wavelength", "nodes": [
  { "id": "f", "label": "Frequency f", "sub": "set by the sender" },
  { "id": "t", "label": "Period T = 1/f", "sub": "time of one cycle" },
  { "id": "l", "label": "λ = speed × T", "sub": "distance in one cycle" }
], "edges": [ { "from": "f", "to": "t" }, { "from": "t", "to": "l" } ], "hi": ["l"], "caption": "Speed times the time of one cycle is the distance of one cycle: 10 m/s × 0.5 s = 5 m." }
```

## A tiny wavelength case

A wave moves at 10 m/s and makes 2 cycles each second. One cycle takes half a second.

$$\lambda = 10\ \tfrac{\text{m}}{\text{s}} \times 0.5\ \text{s} = \mathbf{5\ m}$$

That makes sense: in one second it goes 10 m and fits 2 cycles, so each is 5 m.

## The wavelength formula, with each symbol named

$$\lambda = \frac{c}{f} = c \times T$$

- $\lambda$ is the wavelength, in metres. For light it comes out in micrometres, millionths of a metre.
- $c$ is the propagation speed, in m/s. In a vacuum $c = 3 \times 10^{8}$ m/s.
- $f$ is the frequency in Hz, and $T$ the period in seconds.

The trap is the powers of ten: divide the numbers, then subtract the exponents.

## The slide's red light, worked

*What is the wavelength of red light if its frequency is 4 × 10¹⁴ Hz? Assume the propagation speed is 3 × 10⁸ m/s.*

$$\lambda = \frac{c}{f} = \frac{3 \times 10^{8}\ \text{m/s}}{4 \times 10^{14}\ \text{Hz}} = 0.75 \times 10^{-6}\ \text{m} = \mathbf{0.75\ \mu m}$$

Check: light is measured in micrometres, and $10^{-6}$ m is one micrometre.

## The slide's bit length, worked

A digital signal sends bits instead of cycles. The **bit rate** is how many bits leave each second, and one bit lasts one over the bit rate.

The **bit length** is the wavelength idea for bits: the distance one bit occupies on the cable. The slide's cable runs at 1 Mbps with a speed of 2 × 10⁸ m/s.

$$\text{bit duration} = \frac{1}{10^{6}\ \text{bps}} = 10^{-6}\ \text{s} = 1\ \mu\text{s}$$

$$\text{bit length} = 2 \times 10^{8}\ \tfrac{\text{m}}{\text{s}} \times 10^{-6}\ \text{s} = \mathbf{200\ m}$$

Check: *this means a bit occupies 200 metres on this transmission medium.*

## Try it

```quiz
[
  {
    "q": "Treat a script's 30 ms tick as the period of a sine wave. A point 7.5 ms after time 0 is how far around the cycle, in radians? (Three decimals.)",
    "type": "numeric",
    "answer": 1.571,
    "tolerance": 0.002,
    "unit": "rad",
    "explain": "Formula: φ = (t ÷ T) × 360°, then rad = ° × 2π/360.\nSubstitution: 7.5 ms ÷ 30 ms = 1/4 cycle; 1/4 × 360° = 90°; 90° × 2π/360° = π/2.\nAnswer: 1.571 rad.\nCheck: a quarter cycle is where sin reaches its peak, 90° = π/2."
  },
  {
    "q": "A sine wave is offset 1/6 cycle with respect to time 0. What is its phase in degrees?",
    "type": "numeric",
    "answer": 60,
    "tolerance": 0,
    "unit": "°",
    "explain": "Formula: φ = fraction × 360°.\nSubstitution: φ = 1/6 × 360°.\nAnswer: 60°, which is π/3 = 1.047 rad.\nCheck: 1/6 is less than a quarter, so the angle is under 90°."
  },
  {
    "q": "The PC reaches the router over 2.4 GHz Wi-Fi. What is the wavelength of a 2.4 GHz sine in a vacuum, in cm?",
    "type": "numeric",
    "answer": 12.5,
    "tolerance": 0,
    "unit": "cm",
    "explain": "Formula: λ = c/f with c = 3 × 10⁸ m/s.\nSubstitution: λ = 3 × 10⁸ m/s ÷ 2.4 × 10⁹ Hz = 0.125 m.\nAnswer: 12.5 cm.\nCheck: gigahertz gives centimetres, as the red light at 10¹⁴ Hz gives micrometres; higher frequency, shorter wavelength."
  },
  {
    "q": "A 1 GHz signal travels in a cable at 2 × 10⁸ m/s. What is its wavelength, in m?",
    "type": "numeric",
    "answer": 0.2,
    "tolerance": 0,
    "unit": "m",
    "explain": "Formula: λ = propagation speed ÷ f.\nSubstitution: λ = 2 × 10⁸ m/s ÷ 10⁹ Hz.\nAnswer: 0.2 m.\nCheck: in a vacuum the same 1 GHz gives 0.3 m; the slower medium shortens the wavelength."
  },
  {
    "q": "The LAN link to a telemetry collector runs at 10 Mbps over cable at 2 × 10⁸ m/s. What is the bit length, in m?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "unit": "m",
    "explain": "Formula: bit length = propagation speed × bit duration, with bit duration = 1 ÷ bit rate.\nSubstitution: 1 ÷ 10⁷ bps = 10⁻⁷ s; 2 × 10⁸ m/s × 10⁻⁷ s.\nAnswer: 20 m.\nCheck: ten times the slide's 1 Mbps, so each bit is a tenth of its 200 m."
  },
  {
    "q": "True or false: when a signal passes from air into a cable, its frequency drops because the medium is slower.",
    "type": "tf",
    "answer": false,
    "explain": "Formula: λ = speed ÷ f, where the sender sets f.\nSubstitution: the speed drops in the cable, f stays what the sender made it.\nAnswer: false; the wavelength shrinks, the frequency does not change.\nCheck: slide wording, frequency is independent of the transmission medium."
  }
]
```

## Remember

- A phase is a fraction of one cycle times 360°, or times $2\pi$ for radians.
- Wavelength is speed divided by frequency. The frequency never depends on the medium.
- Bit length is speed times the duration of one bit.
- *On the sheet:* Sheet side 1, "Phase and wavelength".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "fraction of a cycle", "shifted" | φ = fraction × 360°; rad = ° × 2π/360 | ° or rad | 360° = 2π rad |
| "wavelength" | λ = c/f = c × T | m (μm for light) | higher f, shorter λ |
| "bit length" | speed × (1 ÷ bit rate) | m | 1 Mbps at 2 × 10⁸ m/s is 200 m |

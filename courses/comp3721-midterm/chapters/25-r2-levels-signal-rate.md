---
title: "Review 2a: bits per level, data rate vs signal rate, and the bandwidth of a digital signal"
minutes: 15
---
This lesson teaches how many bits one piece of a digital signal can carry, and how many pieces per second a link must send. It prepares you for questions like E04 exercise 2, which give two rates and ask for the number of levels.

## What a level and a signal element are, in plain words

A digital signal is a voltage that jumps between a few fixed heights. Each allowed height is called a level.

The signal holds one height for a short stretch of time, then moves to the next. One such stretch is a signal element, and the receiver reads the signal one element at a time.

More levels let one element say more. With two heights an element can only say 0 or 1, so it carries one bit.

With four heights it can say 00, 01, 10 or 11. Each element then carries two bits at once.

```diagram
{ "type": "grid", "title": "Four levels, four bit patterns", "nodes": [
  { "id": "h0", "label": "Level", "row": 0, "col": 0 },
  { "id": "h1", "label": "Bits it stands for", "row": 0, "col": 1 },
  { "id": "l4", "label": "Highest", "row": 1, "col": 0 },
  { "id": "b4", "label": "11", "row": 1, "col": 1 },
  { "id": "l3", "label": "Third", "row": 2, "col": 0 },
  { "id": "b3", "label": "10", "row": 2, "col": 1 },
  { "id": "l2", "label": "Second", "row": 3, "col": 0 },
  { "id": "b2", "label": "01", "row": 3, "col": 1 },
  { "id": "l1", "label": "Lowest", "row": 4, "col": 0 },
  { "id": "b1", "label": "00", "row": 4, "col": 1 }
], "hi": ["b1", "b2", "b3", "b4"], "caption": "Four levels need two bits each: two bits make exactly four patterns, one per level." }
```

A link can therefore be counted in two ways. The data rate counts bits per second, and its unit is bps.

The signal rate counts signal elements per second, and its unit is the baud. One baud is one signal element per second.

The width of the channel follows the signal rate, not the bit rate. Fewer elements per second means a narrower channel.

## A tiny case you can do in your head

**Bits per level.** Four levels need two bits, because two bits give four patterns:

$$ 2 \times 2 = \mathbf{4 \text{ patterns}} $$

Five levels need three bits. Two bits name only four levels, so the fifth level needs a third bit:

$$ 2 \times 2 \times 2 = 8 \ge 5 \quad \Rightarrow \quad \mathbf{3 \text{ bits}} $$

**Bits to elements.** A line sends 600 bits each second, and each element carries 2 bits. Divide the bits by the bits each element holds:

$$ 600 \div 2 = \mathbf{300 \text{ elements per second}} = 300 \text{ baud} $$

The answer makes sense: packing two bits into each element halves the number of elements.

```diagram
{ "type": "flow", "title": "From bits per second to hertz", "nodes": [
  { "id": "n", "label": "Data rate", "sub": "600 bps" },
  { "id": "r", "label": "÷ bits per element", "sub": "÷ 2" },
  { "id": "s", "label": "Signal rate", "sub": "300 baud" },
  { "id": "b", "label": "Bandwidth", "sub": "300 Hz" }
], "edges": [ { "from": "n", "to": "r" }, { "from": "r", "to": "s" }, { "from": "s", "to": "b", "label": "same number" } ], "hi": ["s"], "caption": "With c = 1, 600 bps at 2 bits per element is 300 baud, and the bandwidth is the same number in hertz, 300 Hz." }
```

## The formulas, with each symbol named

**Bits per level and levels from bits.**

$$ r = \log_2 L \qquad L = 2^r $$

- $L$ is the number of levels, the different signal elements the line can send.
- $r$ is the number of bits carried by each signal element, with no unit.

When $L$ is not a power of 2, round $\log_2 L$ up. On a calculator, $\log_2 x$ is $\log x \div \log 2$.

**Signal rate.** Slide wording: *S = c × N × 1/r*, where *c = case factor*.

$$ S = c \times N \times \frac{1}{r} $$

- $S$ is the signal rate, in baud.
- $N$ is the data rate, in bps.
- $r$ is the bits per signal element.
- $c$ is the case factor, with no unit.

The trap is $c$. Use $c = 1$ unless the question says "average" or gives $c$, and then use $c = \frac{1}{2}$.

**Bandwidth.** Slide wording: *The baud rate, not the bit rate, determines the required bandwidth for a digital signal.* The slide puts $B$ in place of $S$ in the same formula:

$$ B = c \times N \times \frac{1}{r} $$

- $B$ is the minimum bandwidth of the digital signal, in Hz.

## The slide's examples, worked

**Slide example.** *A signal is carrying data in which one data element is encoded as one signal element. If the bit rate is 100 kbps, what is the average value of the baud rate if c is 1/2?*

One data element per signal element means $r = 1$. Convert kbps to bps first:

$$ S = \frac{1}{2} \times 100\,000 \text{ bps} \times \frac{1}{1} = \mathbf{50\,000 \text{ baud}} = 50 \text{ kbaud} $$

Check: the average case sends half as many elements as bits, which is what $c = \frac{1}{2}$ means.

**E04 exercise 2.** *An analog signal has a bit rate of 8000 bps and a baud rate of 1000 baud. How many data elements are carried by each signal element? How many signal elements do we need? Assume c = 1 and each signal element corresponds to a signal level.*

Step 1, bits per element:

$$ r = \frac{N}{S} = \frac{8000 \text{ bps}}{1000 \text{ baud}} = \mathbf{8 \text{ bits per baud}} $$

Step 2, levels from bits:

$$ L = 2^r = 2^8 = \mathbf{256 \text{ levels}} $$

Check: $\log_2 256 = 8$, the bits per element back.

**Bandwidth of a digital signal.** A case of our own: 1 Mbps, $r = 1$, $c = \frac{1}{2}$.

$$ B = \frac{1}{2} \times 1\,000\,000 \text{ bps} \times \frac{1}{1} = \mathbf{500\,000 \text{ Hz}} = 500 \text{ kHz} $$

Check: the bandwidth in hertz is the same number as the signal rate in baud.

```widget
signal-rate
{ "show": "signal", "N": 100, "unit": "kbps", "r": "1", "c": "1/2", "title": "The slide example: 100 kbps, r = 1, c = 1/2; try r = 2 and c = 1" }
```

## Try it

The collector items are scripting variants of our own. Work each on paper in the four lines first.

```quiz
[
  {
    "q": "1. A line uses 12 different signal levels. How many bits must each level carry so that every level gets its own bit pattern?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: bits per level = ⌈log₂ L⌉.\nSubstitution: log₂ 12 = log 12 / log 2 = 3.58, rounded up.\nAnswer: **4 bits**.\nCheck: 2³ = 8 patterns is too few for 12 levels, 2⁴ = 16 is enough."
  },
  {
    "q": "2. A script's death notice leaves the house on a line carrying 48 kbps at a signal rate of 8000 baud. Assume c = 1 and each signal element corresponds to a signal level. How many signal levels does the line use?",
    "type": "numeric",
    "answer": 64,
    "tolerance": 0,
    "unit": "levels",
    "explain": "Formula: S = c × N × 1/r gives r = N/S, then L = 2^r.\nSubstitution: r = 48 000 bps / 8000 baud = 6 bits per baud, L = 2⁶.\nAnswer: **64 levels**.\nCheck: log₂ 64 = 6. E04 exercise 2 has the same shape: 8000/1000 = 8 bits, 256 levels."
  },
  {
    "q": "3. The telemetry collector on the LAN receives 9600 bps over a line code that carries 2 bits per signal element. What is the **average** signal rate, in baud?",
    "type": "numeric",
    "answer": 2400,
    "tolerance": 0,
    "unit": "baud",
    "explain": "Formula: S = c × N × 1/r, with c = 1/2 because the question says average.\nSubstitution: S = 1/2 × 9600 bps × 1/2.\nAnswer: **2400 baud**.\nCheck: 2 bits per element halves 9600 to 4800, and the average case halves it again."
  },
  {
    "q": "4. The same 9600 bps line code, 2 bits per signal element. The question gives no case. What minimum bandwidth does the slide formula give, in Hz?",
    "type": "numeric",
    "answer": 4800,
    "tolerance": 0,
    "unit": "Hz",
    "explain": "Formula: B = c × N × 1/r, with c = 1 because the question does not say average.\nSubstitution: B = 1 × 9600 bps × 1/2.\nAnswer: **4800 Hz**.\nCheck: the same number as the signal rate in baud. Using c = 1/2 here would give 2400 Hz, the case-factor trap."
  },
  {
    "q": "5. Two signals carry the same bit rate with the same case factor. The one that packs more bits into each signal element needs more bandwidth.",
    "type": "tf",
    "answer": false,
    "explain": "Formula: B = c × N × 1/r.\nSubstitution: a larger r makes 1/r smaller, with N and c unchanged.\nAnswer: **false**, it needs less bandwidth.\nCheck: slide wording, the baud rate, not the bit rate, determines the required bandwidth."
  },
  {
    "q": "6. Which quantity, by the slide's rule, sets the required bandwidth of a digital signal?",
    "options": ["The baud rate", "The bit rate", "The number of levels alone", "The case factor alone"],
    "answer": 0,
    "explain": "Formula: B = c × N × 1/r, the signal-rate formula with B in place of S.\nSubstitution: the right side is exactly S, the baud rate.\nAnswer: **the baud rate**.\nCheck: slide wording, the baud rate, not the bit rate, determines the required bandwidth for a digital signal."
  }
]
```

## Remember

- Bits per level is $\log_2 L$, rounded up when $L$ is not a power of 2. Levels from bits is $2^r$.
- $c = 1$ unless the question says "average" or gives $c$. Then $c = \frac{1}{2}$.
- Bandwidth comes from the baud rate, and it is the same number as $S$, in Hz.
- *On the sheet:* Sheet side 2, "Line coding: elements and rates (04)".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "levels", "signal element corresponds to a level" | r = ⌈log₂ L⌉, L = 2^r | bits, levels | 2^r ≥ L |
| "signal rate", "baud" | S = c × N × 1/r | baud | S ≤ N when r ≥ 1 |
| "bandwidth of a digital signal" | B = c × N × 1/r | Hz | same number as S |

---
title: "Review 3d: framing, byte stuffing and bit stuffing"
minutes: 15
---
This lesson teaches how a receiver finds where each frame starts and ends. It prepares you to stuff a byte string or a bit string by hand and count the extra bytes or bits.

## What a frame and a flag are, in plain words

Bits reach the receiver as one long stream. The data-link layer cuts that stream into *frames*, so each frame is told apart from the next.

If every frame has the same size, the receiver just counts. Slide 8 says fixed size needs *no need to define boundaries*.

Frames of varying size, *prevalent in LANs*, need a marker at each end. That marker is the *flag*, a special byte or bit pattern.

```diagram
{ "type": "flow", "title": "Slide 9: a character-oriented frame", "nodes": [
  { "id": "f1", "label": "Flag", "kind": "pill" }, { "id": "h", "label": "Header", "sub": "addresses" }, { "id": "d", "label": "Data", "sub": "any length" }, { "id": "t", "label": "Trailer", "sub": "error bits" }, { "id": "f2", "label": "Flag", "kind": "pill" }
], "edges": [ { "from": "f1", "to": "h" }, { "from": "h", "to": "d" }, { "from": "d", "to": "t" }, { "from": "t", "to": "f2" } ], "hi": ["f1", "f2"], "caption": "One flag opens the frame and one closes it. Everything between them is the frame." }
```

## What goes wrong without stuffing

Data such as images or audio can hold any byte at all. Sooner or later the flag byte turns up inside the data.

Slide 13 says the receiver *thinks it has reached the end of the frame*. It cuts the frame in two and the rest is garbage.

```diagram
{ "type": "flow", "title": "A flag byte hidden in the data", "nodes": [
  { "id": "a", "label": "Flag", "kind": "pill" }, { "id": "b", "label": "d" }, { "id": "c", "label": "Flag", "sub": "part of the data" }, { "id": "e", "label": "d d" }, { "id": "g", "label": "Flag", "kind": "pill" }
], "edges": [ { "from": "a", "to": "b" }, { "from": "b", "to": "c" }, { "from": "c", "to": "e", "dashed": true }, { "from": "e", "to": "g" } ], "hi": ["c"], "caption": "The receiver stops at the middle Flag, so the last two data bytes are lost from this frame." }
```

Stuffing changes the data just enough that a fake flag can never appear. The receiver then undoes the change.

## Byte stuffing: a tiny case

The sender puts one extra byte, the *escape character* ESC, in front of any Flag or ESC inside the data. Slide 14 says *whenever there is a flag or ESC in the text*.

Take the three bytes A FLAG B.

$$\text{A FLAG B} \to \text{A } \mathbf{ESC} \text{ FLAG B}$$

3 bytes become 4. The receiver removes each ESC and keeps the next byte as data, not as a flag.

The data's own ESC bytes get an ESC too. Without that, the receiver would delete a real ESC and lose it.

## Byte stuffing on the slide's string

Slide 15 sends the six bytes d Flag d d ESC d.

```diagram
{ "type": "grid", "title": "Slide 15: one byte at a time", "nodes": [
  { "id": "h0", "label": "data byte", "row": 0, "col": 0 }, { "id": "h1", "label": "sent", "row": 0, "col": 1 },
  { "id": "a0", "label": "d", "row": 1, "col": 0 }, { "id": "a1", "label": "d", "row": 1, "col": 1 },
  { "id": "b0", "label": "Flag", "row": 2, "col": 0 }, { "id": "b1", "label": "ESC Flag", "row": 2, "col": 1 },
  { "id": "c0", "label": "d", "row": 3, "col": 0 }, { "id": "c1", "label": "d", "row": 3, "col": 1 },
  { "id": "d0", "label": "d", "row": 4, "col": 0 }, { "id": "d1", "label": "d", "row": 4, "col": 1 },
  { "id": "e0", "label": "ESC", "row": 5, "col": 0 }, { "id": "e1", "label": "ESC ESC", "row": 5, "col": 1 },
  { "id": "f0", "label": "d", "row": 6, "col": 0 }, { "id": "f1", "label": "d", "row": 6, "col": 1 }
], "hi": ["b1", "e1"], "caption": "One Flag and one ESC in the data, so two ESC bytes go in: 6 bytes become 8." }
```

$$\text{d Flag d d ESC d} \to \text{d } \mathbf{ESC} \text{ Flag d d } \mathbf{ESC} \text{ ESC d}$$

The slide writes *Two extra bytes*. Check: the receiver strikes out each ESC it meets first and gets the six bytes back.

A game packet's payload can hold both special bytes too. Byte-stuff 07 FLAG 2C ESC 1F.

$$\text{07 FLAG 2C ESC 1F} \to \text{07 } \mathbf{ESC} \text{ FLAG 2C } \mathbf{ESC} \text{ ESC 1F}$$

5 bytes become 7. Predict each ESC before the widget inserts it.

```widget
stuff-play
{ "mode": "byte", "data": "07 FLAG 2C ESC 1F", "predict": true, "title": "A game packet's payload, byte-stuffed" }
```

## Bit stuffing: a tiny case

A bit-oriented frame uses the flag 01111110: a 0, six 1s, then a 0. Data that never holds six 1s in a row can never look like that flag.

So the sender counts 1s in a row. After five, it inserts a 0 and starts counting again.

Take the seven bits 0111111, a 0 and then six 1s.

$$0\,11111\,1 \to 0\,11111\,\mathbf{0}\,1 = \mathbf{01111101}$$

7 bits become 8. The receiver removes the 0 after any five 1s and gets 0111111 back.

## The rule, with each part named

Slide 19: *adding one extra 0 whenever five consecutive 1s follow a 0 in the data, so that the receiver does not mistake the pattern 01111110 for a flag.*

- The count is of 1s in a row. Any 0 resets it.
- At five, insert a 0 and restart the count.
- Insert the 0 even when the next data bit is already 0.

The trap is that last point. The receiver removes the bit after five 1s without looking, so skipping a stuff would delete a real data bit.

## Bit stuffing on the slide's string

Slide 21 stuffs the 22-bit data 0001111111001111101000.

```diagram
{ "type": "grid", "title": "07b slide 21: the counter of 1s", "nodes": [
  { "id": "h0", "label": "data piece", "row": 0, "col": 0 }, { "id": "h1", "label": "count", "row": 0, "col": 1 }, { "id": "h2", "label": "sent", "row": 0, "col": 2 },
  { "id": "a0", "label": "000", "row": 1, "col": 0 }, { "id": "a1", "label": "0", "row": 1, "col": 1 }, { "id": "a2", "label": "000", "row": 1, "col": 2 },
  { "id": "b0", "label": "11111", "row": 2, "col": 0 }, { "id": "b1", "label": "5: stuff", "row": 2, "col": 1 }, { "id": "b2", "label": "11111 0", "row": 2, "col": 2 },
  { "id": "c0", "label": "1100", "row": 3, "col": 0 }, { "id": "c1", "label": "2, then 0", "row": 3, "col": 1 }, { "id": "c2", "label": "1100", "row": 3, "col": 2 },
  { "id": "d0", "label": "11111", "row": 4, "col": 0 }, { "id": "d1", "label": "5: stuff", "row": 4, "col": 1 }, { "id": "d2", "label": "11111 0", "row": 4, "col": 2 },
  { "id": "e0", "label": "01000", "row": 5, "col": 0 }, { "id": "e1", "label": "0", "row": 5, "col": 1 }, { "id": "e2", "label": "01000", "row": 5, "col": 2 }
], "hi": ["b2", "d2"], "caption": "22 data bits → 24 sent: 000111110110011111001000. The second stuffed 0 goes in although the next data bit is already 0." }
```

$$0001111111001111101000 \to \mathbf{000111110110011111001000}$$

The slide writes *Two extra bits*. Check: removing the 0 after each run of five 1s gives the 22 bits back.

The flag pattern itself can sit inside a game payload, say 011111101111110, fifteen bits. Each run of six 1s is cut after five.

$$0\,11111\,1\,0\,11111\,1\,0 \to 0\,11111\,\mathbf{0}\,1\,0\,11111\,\mathbf{0}\,1\,0 = \mathbf{01111101011111010}$$

Fifteen bits become seventeen. No run of six 1s is left, so the receiver never sees a fake flag.

## Try it

Run the counter, or scan for special bytes, on paper first.

```quiz
[
  {
    "q": "Bit-stuff the data 0111111111110 (thirteen bits). Type the stuffed string.",
    "type": "text",
    "answer": ["011111011111010"],
    "explain": "Rule: after five consecutive 1s, insert a 0 and restart the count.\nSteps: 0 11111 → stuff 0; then 11111 → stuff 0; then 1 0.\nAnswer: 011111011111010, 15 bits, 2 extra.\nCheck: remove the 0 after each run of five 1s and the 13 data bits come back."
  },
  {
    "q": "Byte-stuff a payload whose bytes are: 2A ESC FLAG 07. Type the stuffed bytes separated by spaces.",
    "type": "text",
    "answer": ["2A ESC ESC ESC FLAG 07"],
    "explain": "Rule (slide 14): an ESC goes before every Flag or ESC in the data.\nSteps: 2A stays; ESC → ESC ESC; FLAG → ESC FLAG; 07 stays.\nAnswer: 2A ESC ESC ESC FLAG 07, 4 bytes become 6.\nCheck: the receiver removes each ESC and keeps the next byte: 2A ESC FLAG 07."
  },
  {
    "q": "The data is D1 FLAG ESC D2 FLAG (5 bytes). How many extra bytes does byte stuffing add?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bytes",
    "explain": "Rule: one ESC per Flag or ESC in the data.\nSubstitution: 2 FLAGs + 1 ESC in the data.\nAnswer: 3 extra bytes, D1 ESC FLAG ESC ESC D2 ESC FLAG.\nCheck: 5 + 3 = 8 bytes, and the receiver strikes out three ESCs."
  },
  {
    "q": "In bit stuffing, no 0 is stuffed when the bit after five consecutive 1s is already a 0.",
    "type": "tf",
    "answer": false,
    "explain": "Rule: insert the 0 whatever the next data bit is.\nSubstitution: on slide 21 the second stuffed 0 goes in before a data bit that is already 0.\nAnswer: false.\nCheck: the receiver removes the bit after any five 1s, so skipping the stuff would delete a real data bit."
  },
  {
    "q": "A receiver gets the stuffed data field 0001111101100. Unstuff it and type the data bits without spaces.",
    "type": "text",
    "answer": ["000111111100"],
    "explain": "Rule: remove the 0 that follows five consecutive 1s.\nSteps: 000 11111 [0] 1100 → 000 11111 1100.\nAnswer: 000111111100, 12 bits.\nCheck: stuffing it again, 000 11111 → stuff 0 → 1100, gives 0001111101100."
  },
  {
    "q": "Why does byte stuffing put an ESC in front of an ESC byte in the data, and not only in front of a Flag?",
    "options": ["The receiver removes every ESC it meets, so a bare data ESC would be deleted", "An ESC byte in the data ends the frame", "The trailer needs one ESC per data byte", "It makes the data a whole number of words"],
    "answer": 0,
    "explain": "Rule: slide 14, an ESC is added whenever there is a flag or ESC in the text.\nSubstitution: ESC in the data → ESC ESC, so the receiver removes the first and keeps the second.\nAnswer: without it, the receiver would remove the real ESC and lose that byte.\nCheck: slide 15's ESC is stuffed too, which is why there are two extra bytes, not one."
  }
]
```

## Remember

- Byte stuffing: an ESC goes before every Flag and every ESC in the data.
- Bit stuffing: a 0 goes in after every five 1s in a row, always, then the count restarts.
- *On the sheet:* Sheet side 4, "Framing, byte stuffing and bit stuffing (07b)".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "flag", "ESC", "byte stuffing" | ESC before each Flag or ESC | bytes, plus the extra count | unstuffing gives the input back |
| "bit stuffing", "01111110" | a 0 after five consecutive 1s | bits, plus the extra count | no six 1s in a row remain |

---
title: "Framing: fixed and variable size, the character-oriented frame and byte stuffing"
minutes: 18
---

The receiver gets one long stream of bits and has to know where each frame starts and ends, even when the flag byte turns up inside the data.

## Data-link control works node to node

Slide 3: *The data link control (DLC) deals with procedures for communication between two adjacent nodes (node-to-node communication). No matter whether the link is dedicated or broadcast.* Its three services are *Framing*, *Flow control* and *Error control*. *The other sublayer in data-link layer is MAC.* Week 6 split the layer the same way in [data-link services](#/comp3721-w6/data-link-services): DLC for what every link has in common, MAC for the shared medium.

## Framing packs bits into distinguishable frames

Slide 7: *The data-link layer needs to pack bits into frames, so that each frame is distinguishable from another.*

The slide asks why a message goes into several frames, and answers: *Inefficient flow and error control if the frame is very large → a single-bit error requires retransmission of the whole frame.*

*Framing in the data-link layer separates a message from one source to a destination by adding a sender address and a destination address.* The slide title is *Framing Analogy: Postal System*. The textbook's version: an envelope carries a sender and a destination address, which keeps one letter apart from the next.

## Fixed size needs no boundaries; variable size needs a delimiter

Slide 8:

| Frame size | Slide wording | Boundaries |
|---|---|---|
| Fixed | *no need to define boundaries, frame size is fixed!* | none needed |
| Variable | *prevalent in LANs (we need a way to define the end of a frame and the beginning of the next)* | a delimiter |

*To define the end of the frame we have two approaches: 1. Character (byte)-oriented approach 2. Bit-oriented approach.* The bit-oriented approach has [its own lesson](#/comp3721-w7/bit-stuffing).

## The character-oriented frame

The frame is one row: Flag | Header | data characters | Trailer | Flag. The data is a *Variable number of characters*. Slides 9 to 12 point at one field each:

| Field | Slide wording |
|---|---|
| Data | *Data to be carried are 8-bit characters from a coding system such as ASCII.* |
| Header | *Source and destination addresses and other control information.* |
| Trailer | *Error detection redundant bits.* |
| Flag (both ends) | *To separate one frame from the next. It is composed of protocol-dependent special characters (8-bit (1-byte)).* |

## The flag can appear inside the data

Slide 13: *Character-oriented framing was popular when only text was exchanged. In addition to text, we send other types of information such as graphs, audio, and video; any character used for the flag could also be part of the information. If this happens, the receiver, when it encounters this pattern in the middle of the data, thinks it has reached the end of the frame.*

## Byte stuffing puts ESC before every flag or ESC

Slide 14: *Byte stuffing (character stuffing) is the process of adding one extra byte (with a predefined bit pattern), which is called the escape character (ESC), whenever there is a flag or ESC in the text.*

Unstuffing: *Whenever the receiver encounters the ESC character, it removes it from the data section and treats the next character as data, not as a delimiting flag.*

The data's own ESC bytes are stuffed too. Without that, the receiver would remove a real ESC and treat the byte after it as data.

Slide 15 works one frame:

| Stage | Bytes |
|---|---|
| Data from upper layer (6 bytes) | d, Flag, d, d, ESC, d |
| Frame sent (8 data bytes) | Flag, Header, d, **ESC**, Flag, d, d, **ESC**, ESC, d, Trailer, Flag |
| Frame received | identical to the frame sent |
| Data to upper layer | d, Flag, d, d, ESC, d |

One Flag and one ESC in the data, so two ESCs go in: *Two extra bytes*, 6 bytes become 8.

## Byte stuffing in the slide's frame

Inserted ESC bytes are orange. The unstuffed row at the bottom should match the input.

```widget
stuffing
{ "mode": "byte", "data": "d FLAG d d ESC d" }
```

### One byte at a time

The sender checks each byte and puts an ESC in front of a Flag or an ESC. After the frame crosses the link, the receiver removes each ESC and keeps the byte after it.

```widget
stuff-play
{ "mode": "byte", "data": "d FLAG d d ESC d", "unstuff": true }
```

## Unicode pushes protocols toward bit-oriented framing

Slide 16, *The Other Problem!*: *The universal coding systems in use today, such as Unicode, have 16-bit and 32-bit. Characters that conflict with 8-bit characters. In general, the tendency is moving toward the bit-oriented protocols.*

## Stuff and unstuff three byte streams

Count the bytes first, then write the stream. FLAG and ESC are one byte each.

```quiz
[
  {
    "q": "The data is A FLAG B ESC C (5 bytes). How many bytes does the data field have after byte stuffing?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "unit": "bytes",
    "explain": "One FLAG and one ESC, so 2 ESCs are added: 5 + 2 = 7 bytes."
  },
  {
    "q": "Byte-stuff the data A FLAG B ESC C. Type the stuffed data field as bytes separated by single spaces, e.g. P ESC Q.",
    "type": "text",
    "answer": ["A ESC FLAG B ESC ESC C", "A,ESC,FLAG,B,ESC,ESC,C", "A, ESC, FLAG, B, ESC, ESC, C"],
    "explain": "A ESC FLAG B ESC ESC C. ESC goes before every flag or ESC in the text: A, ESC FLAG, B, ESC ESC, C. Stuffing only the FLAG leaves the data's own ESC unprotected, and the ESC always goes in front of the byte, never after it."
  },
  {
    "q": "The data is ESC ESC (2 bytes). How many bytes does the data field have after byte stuffing?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bytes",
    "explain": "Each ESC gets an ESC in front: ESC ESC ESC ESC, 2 + 2 = 4 bytes."
  },
  {
    "q": "The receiver gets the data field X ESC ESC ESC FLAG Y. What does it deliver to the upper layer? Type the bytes separated by single spaces, e.g. P ESC Q.",
    "type": "text",
    "answer": ["X ESC FLAG Y", "X,ESC,FLAG,Y", "X, ESC, FLAG, Y"],
    "explain": "The receiver removes each ESC and treats the next character as data: X; ESC → remove it, keep ESC; ESC → remove it, keep FLAG as data; Y. Result X ESC FLAG Y. The FLAG follows an ESC, so it does not end the frame."
  }
]
```

```quiz
[
  {
    "q": "Which frame size needs a way to define the end of a frame and the beginning of the next?",
    "options": ["Variable size", "Fixed size", "Both fixed and variable size", "Neither: the header gives the length"],
    "answer": 0,
    "explain": "Variable size: *we need a way to define the end of a frame and the beginning of the next*. Fixed size: *no need to define boundaries, frame size is fixed!*"
  },
  {
    "q": "Which frame size is prevalent in LANs?",
    "options": ["Variable size", "Fixed size", "Unicode size", "32-bit size"],
    "answer": 0,
    "explain": "Slide 8: Variable → *prevalent in LANs*. That is why the character-oriented and bit-oriented approaches exist."
  },
  {
    "q": "Match each field of the character-oriented frame to its content.",
    "type": "match",
    "pairs": [
      ["Flag", "Protocol-dependent special character that separates one frame from the next"],
      ["Header", "Source and destination addresses and other control information"],
      ["Data", "8-bit characters from a coding system such as ASCII"],
      ["Trailer", "Error detection redundant bits"]
    ],
    "explain": "Slides 9 to 12 point at one field each: Flag (both ends, 1 byte), Header (addresses and control), Data (variable number of 8-bit characters), Trailer (error-detection redundant bits)."
  },
  {
    "q": "The data is D1 FLAG ESC D2 FLAG (5 bytes). How many bytes does the data field have after byte stuffing?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "bytes",
    "explain": "Two FLAGs and one ESC each get an ESC in front: D1 ESC FLAG ESC ESC D2 ESC FLAG, 5 + 3 = 8 bytes."
  },
  {
    "q": "Same data, D1 FLAG ESC D2 FLAG. How many extra bytes does byte stuffing add?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bytes",
    "explain": "One ESC per FLAG or ESC in the data: 2 FLAGs + 1 ESC = 3 extra bytes (8 − 5)."
  },
  {
    "q": "In byte stuffing, only flag bytes in the data are stuffed.",
    "type": "tf",
    "answer": false,
    "explain": "An ESC is added *whenever there is a flag or ESC in the text*. On slide 15 the data's ESC is stuffed too, which is why there are two extra bytes, not one."
  },
  {
    "q": "Why did character-oriented framing fall out of favour?",
    "options": ["Graphs, audio and video can contain the flag pattern, and Unicode uses 16-bit and 32-bit characters", "Fixed-size frames replaced it in LANs", "It has no field for error-detection bits", "ASCII characters are 7 bits, too short for a flag"],
    "answer": 0,
    "explain": "Slide 13: it *was popular when only text was exchanged*; with graphs, audio and video *any character used for the flag could also be part of the information*. Slide 16: Unicode has 16-bit and 32-bit characters that conflict with 8-bit characters, so *the tendency is moving toward the bit-oriented protocols*."
  },
  {
    "q": "What is the extra byte added in byte stuffing called? (Its abbreviation is fine.)",
    "type": "text",
    "answer": ["ESC", "escape character", "escape", "the escape character", "escape character (ESC)"],
    "explain": "The escape character, ESC: *one extra byte (with a predefined bit pattern), which is called the escape character (ESC)*."
  },
  {
    "q": "When the receiver finds an ESC in the data section, what does it do?",
    "options": ["Removes the ESC and treats the next character as data", "Ends the frame", "Keeps the ESC and removes the next character", "Discards the frame as corrupted"],
    "answer": 0,
    "explain": "Slide 14: *it removes it from the data section and treats the next character as data, not as a delimiting flag.*"
  }
]
```

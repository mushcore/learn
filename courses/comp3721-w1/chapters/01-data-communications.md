---
title: What data communications is
minutes: 10
---

Lecture 01a opens with five definitions. Quiz 1 is written on 01a alone, and its fill-in-the-blank questions use this exact wording.

## Five definitions

| Term | Definition (slide wording) | Examples on the slide |
|---|---|---|
| **Communication** | exchange of information | |
| **Telecommunication** | communication **at a distance** | telephony, telegraphy, television |
| **Data** | raw facts or information presented in a form that is **agreed upon by the parties** (sender and receiver) | text, numbers, images, audio, video |
| **Data communications** | the exchange of data between **two devices** via some form of **transmission medium** | |
| **Data communications system** | a **network of hardware and software** that enables the exchange of data between devices over various transmission mediums | |

Each line builds on the one before it: distance, then the data exchanged, then the exchange itself via a medium, then the hardware and software that carry it out.

## What is the medium?

The slide's answers to *what other types of mediums we have?*:

- **Fibre optic**, which carries **light**.
- **Air or space**, which carries **radio waves** (electromagnetic waves).

Spoken English has a medium too: **variations in air pressure**, mechanical sound waves made by the mouth and diaphragm and received by the ears.

The slide's note on wired media reads like a true/false item: **in the case of a wired communication, we should use an electrically conductive material.** Copper conducts, which is why twisted-pair and coaxial cables are made of it. Fibre is a cable but carries light, not current.

## Two types of data communications

| | Digital communication | Analog communication |
|---|---|---|
| Definition | the **electronic transmission of information**, such as data, text, audio, or video, using **digital signals** over communication channels | the transmission of information using **continuous signals** that vary in **amplitude, frequency, or phase** to represent data |
| Key fact | all digital communication messages should be **represented and transmitted as bits** | the signal itself carries the information in its shape |

Every digital message is turned into bits before it is sent. Week 2 shows what those bits look like on the wire.

## Effectiveness: four fundamental characteristics

The effectiveness of a data communications system *depends on four fundamental characteristics*:

1. **Delivery**: deliver data to the **correct destination**.
2. **Accuracy**: deliver the data **accurately**.
3. **Timeliness**: deliver data in a **timely manner**.
4. **Jitter**: **uneven delay** in the delivery of audio or video packets.

Jitter is the odd one out. It is *uneven* delay, not total delay, and it matters for audio and video because packets must arrive at a steady rhythm. The slide lists **four** characteristics, not three.

## The benefits of data communication

- **Real-time data and information sharing and analysis**
- **Enhanced connectivity**
- **Cost saving**
- **Expanded social engagement**

```quiz
[
  {
    "q": "Communication at a distance, with telephony, telegraphy and television as examples, is called ___.",
    "type": "text",
    "answer": ["telecommunication", "telecommunications"],
    "explain": "Communication is the exchange of information; **telecommunication** is communication at a distance. The three tele- examples on the slide are telephony, telegraphy, and television."
  },
  {
    "q": "Data communications is the exchange of data between two devices via some form of ___.",
    "type": "text",
    "answer": ["transmission medium", "medium", "transmission media"],
    "explain": "The slide definition: data communications is the exchange of data between two devices **via some form of transmission medium**."
  },
  {
    "q": "Which is the slide's definition of *data*?",
    "options": [
      "Any electrical signal on a wire",
      "Raw facts or information presented in a form agreed upon by the parties (sender and receiver)",
      "Information stored only as bits",
      "A network of hardware and software"
    ],
    "answer": 1,
    "explain": "Data is raw facts or information presented in a form **agreed upon by the parties** (sender and receiver): text, numbers, images, audio, and video. The last option is the definition of a data communications *system*."
  },
  {
    "q": "A data communications system is a network of hardware and software that enables the exchange of data between devices over various transmission mediums.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide wording exactly. The key phrase is *network of hardware and software*."
  },
  {
    "q": "In digital communication, all messages should be represented and transmitted as bits.",
    "type": "tf",
    "answer": true,
    "explain": "Digital communication uses digital signals, and the slide states that all digital communication messages should be represented and transmitted as **bits**."
  },
  {
    "q": "Analog communication transmits information using continuous signals that vary in which three properties?",
    "options": [
      "Voltage, current, and resistance",
      "Amplitude, frequency, and phase",
      "Delivery, accuracy, and timeliness",
      "Bits, bytes, and frames"
    ],
    "answer": 1,
    "explain": "Analog communication uses continuous signals that vary in **amplitude, frequency, or phase** to represent data. These three parameters describe a sine wave, which Week 2 covers in detail."
  },
  {
    "q": "Which of these are among the four fundamental characteristics that the effectiveness of a data communications system depends on? Select all that apply.",
    "options": ["Delivery", "Accuracy", "Timeliness", "Jitter", "Cost", "Security"],
    "answer": [0, 1, 2, 3],
    "explain": "The four are delivery (correct destination), accuracy, timeliness, and jitter (uneven delay of audio/video packets). Cost is a *benefit* item (cost saving) and security is a *network criterion*, covered in a later lesson."
  },
  {
    "q": "The uneven delay in the delivery of audio or video packets is called ___.",
    "type": "text",
    "answer": ["jitter"],
    "explain": "**Jitter** is uneven delay. It matters for audio and video, where packets must arrive at a steady rhythm to play back smoothly."
  },
  {
    "q": "Fibre optic cable carries radio waves.",
    "type": "tf",
    "answer": false,
    "explain": "Fibre optic carries **light**. It is air or space that carries radio waves (electromagnetic waves)."
  },
  {
    "q": "In the case of a wired communication, we should use an electrically ___ material.",
    "type": "text",
    "answer": ["conductive", "conducting", "conductive material"],
    "explain": "The slide's note: for wired communication we should use an electrically **conductive** material, which is why copper is used for twisted-pair and coaxial cable."
  },
  {
    "q": "According to the lecture, what is the medium when two people communicate in spoken English?",
    "options": [
      "Electromagnetic waves in the air",
      "Variations in air pressure (mechanical sound waves)",
      "Light reflected between the speakers",
      "There is no medium for spoken communication"
    ],
    "answer": 1,
    "explain": "Speech travels as **variations in air pressure**, mechanical sound waves made by the mouth and diaphragm and received by the ears. Radio uses electromagnetic waves; sound does not."
  },
  {
    "q": "Which of the following is listed on the slide as a benefit of data communication? Select all that apply.",
    "options": ["Real-time data and information sharing and analysis", "Enhanced connectivity", "Cost saving", "Expanded social engagement", "Guaranteed accuracy"],
    "answer": [0, 1, 2, 3],
    "explain": "The four benefits are real-time sharing and analysis, enhanced connectivity, cost saving, and expanded social engagement. Accuracy is one of the four *effectiveness characteristics*, not a benefit."
  }
]
```

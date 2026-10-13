---
title: Line coding: data elements & signal elements
minutes: 11
---

A computer stores bits, and a link carries a signal. Lecture 04 turns one into the other, and it starts by separating what is sent from what carries it.

## Digital-to-digital conversion

A computer network is designed to send information from one point to another, and that information needs to be converted to either a **digital signal** or an **analog signal** for transmission. Lecture 04 takes digital data to a digital signal: **digital-to-digital conversion**, representing digital data by using digital signals.

## Line coding

Slide wording: *the process of converting digital data to digital signal*. A sequence of bits is converted to a digital signal.

The slide figure puts an **encoder** at the sender and a **decoder** at the receiver. The encoder turns the digital data into a digital signal for the link, and the decoder turns that signal back into digital data.

## Six common characteristics of line coding schemes

1. Signal element vs. data element
2. [Data rate vs. signal rate](#/comp3721-w4/data-rate-signal-rate)
3. [Bandwidth](#/comp3721-w4/digital-bandwidth)
4. [Baseline wandering](#/comp3721-w4/baseline-dc)
5. [Self-synchronization](#/comp3721-w4/self-synchronization)
6. [DC components](#/comp3721-w4/baseline-dc)

## Data element and signal element

| | Data element | Signal element |
|---|---|---|
| Also called | bit | symbol, state |
| Slide definition | the smallest entity that can represent a piece of information | the shortest unit (timewise) of a digital signal |
| Role | what we need to send; two types, 0 and 1 | it carries data elements |

The slide boxes the difference: *Data elements are what we need to send (logically). Signal elements are what we can send (physically).*

## The ratio r

**Ratio ($r$)**: the number of data elements carried by each signal element. It is different for each line coding scheme.

The slide figures write it as a fraction:

$$r = \frac{\text{data elements}}{\text{signal elements}}$$

## Four slide figures, four ratios

| Figure | Slide caption | Data elements | Signal elements | $r$ |
|---|---|---|---|---|
| a | one data element per one signal element | 1 | 1 | $1$ |
| b | one data element per two signal elements | 1 | 2 | $\frac{1}{2}$ |
| c | two data elements per one signal element | 2 | 1 | $2$ |
| d | four data elements per three signal elements | 4 | 3 | $\frac{4}{3}$ |

In figure a the signal holds one level for the whole bit. In figure b it changes level in the middle of every bit, so each bit costs two signal elements.

In figure c one signal element stands for a pair of bits. A pair has four possible values and a signal with $L$ levels can carry $\log_{2} L$ bits per level, so this signal needs four levels. Figure d sends the four bits 1101 as a group of three signal elements.

## Transportation analogy

The slide's analogy: each data element is a **person** who needs to be carried from one place to another, and a signal element is a **vehicle** that can carry people.

| Ratio | On the road |
|---|---|
| $r = 1$ | each person is driving a vehicle |
| $r > 1$ | more than one person is travelling in a vehicle (a carpool, for example) |
| $r = \frac{1}{2}$ | one person is driving a car and a trailer |

## Data elements and signal elements in the four figures

```widget
signal-elements
{ "case": "a" }
```

## Find r and the signal-element count for four new schemes

None of these schemes is on the slides; $r$ is still data elements over signal elements.

```quiz
[
  {
    "q": "A scheme sends 6 data elements as 4 signal elements. What is $r$?",
    "type": "numeric",
    "answer": 1.5,
    "tolerance": 0.01,
    "explain": "$r = \\frac{\\text{data elements}}{\\text{signal elements}} = \\frac{6}{4} = 1.5$. More than one bit rides in each signal element on average, so $r > 1$."
  },
  {
    "q": "A scheme with $r = \\frac{3}{2}$ sends 30 bits. How many signal elements does it use?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0.01,
    "unit": "signal elements",
    "explain": "Each signal element carries $\\frac{3}{2}$ data elements, so the count is $30 \\div \\frac{3}{2} = 30 \\times \\frac{2}{3} = 20$ signal elements."
  },
  {
    "q": "Each signal element of a scheme carries 3 bits, and each signal element is one voltage level. How many levels $L$ does the signal need?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.01,
    "unit": "levels",
    "explain": "A signal with $L$ levels carries $\\log_{2} L$ bits per level, so $\\log_{2} L = 3$ and $L = 2^{3} = 8$ levels."
  },
  {
    "q": "A scheme with $r = \\frac{1}{2}$ sends a 9-bit code. How many signal elements does it use?",
    "type": "numeric",
    "answer": 18,
    "tolerance": 0.01,
    "unit": "signal elements",
    "explain": "Two signal elements per data element: $9 \\div \\frac{1}{2} = 9 \\times 2 = 18$ signal elements."
  }
]
```

```quiz
[
  {
    "q": "Fill in the blank: the process of converting digital data to digital signal is called ________.",
    "type": "text",
    "answer": ["line coding", "line-coding", "linecoding"],
    "explain": "Line coding: a sequence of bits is converted to a digital signal. An encoder does it at the sender and a decoder re-creates the digital data at the receiver."
  },
  {
    "q": "Which statement is the slide's definition of a **signal element**?",
    "options": ["The smallest entity that can represent a piece of information", "The shortest unit (timewise) of a digital signal", "The number of bits sent in 1 second", "The range of frequencies contained in a signal"],
    "answer": 1,
    "explain": "A signal element (symbol, state) is the shortest unit (timewise) of a digital signal, and it carries data elements. The smallest entity that can represent a piece of information is a **data** element (bit)."
  },
  {
    "q": "Data elements are what we can send physically.",
    "type": "tf",
    "answer": false,
    "explain": "Data elements are what we **need** to send (logically). Signal elements are what we **can** send (physically)."
  },
  {
    "q": "Which two other names does the slide give for a signal element?",
    "options": ["Bit and byte", "Pulse and baud", "Frame and packet", "Symbol and state"],
    "answer": 3,
    "explain": "Signal element (symbol, state). Bit is the other name for a data element."
  },
  {
    "q": "A line coding scheme sends 4 data elements as 3 signal elements. What is $r$?",
    "type": "numeric",
    "answer": 1.3333,
    "tolerance": 0.01,
    "explain": "$r$ is the number of data elements carried by each signal element: $r = \\frac{4}{3} = 1.33$. This is slide figure d."
  },
  {
    "q": "A scheme uses two signal elements for every bit. What is $r$?",
    "type": "numeric",
    "answer": 0.5,
    "tolerance": 0.001,
    "explain": "One data element per two signal elements: $r = \\frac{1}{2} = 0.5$. This is slide figure b."
  },
  {
    "q": "In the transportation analogy, which picture is $r = \\frac{1}{2}$?",
    "options": ["Each person is driving a vehicle", "Several people are travelling in one vehicle (a carpool)", "One person is driving a car and a trailer", "A vehicle is travelling with no one in it"],
    "answer": 2,
    "explain": "A person is a data element and a vehicle is a signal element. One person with a car and a trailer is one data element using two signal elements, $r = \\frac{1}{2}$. Each person driving a vehicle is $r = 1$ and a carpool is $r > 1$."
  },
  {
    "q": "The ratio $r$ is the same for every line coding scheme.",
    "type": "tf",
    "answer": false,
    "explain": "$r$, the number of data elements carried by each signal element, is **different** for each line coding scheme. The slide figures show $1$, $\\frac{1}{2}$, $2$ and $\\frac{4}{3}$."
  },
  {
    "q": "Select the items on the slide's list of common characteristics of line coding schemes.",
    "options": ["Baseline wandering", "Attenuation", "Self-synchronization", "Crosstalk", "DC components"],
    "answer": [0, 2, 4],
    "explain": "The six are: signal element vs. data element, data rate vs. signal rate, bandwidth, baseline wandering, self-synchronization and DC components. Attenuation and crosstalk are transmission impairments from Lecture 03."
  },
  {
    "q": "One signal element carries 3 data elements. How many signal elements does it take to send 12 bits?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.01,
    "unit": "signal elements",
    "explain": "$r = 3$, so $12 / 3 = 4$ signal elements."
  },
  {
    "type": "match",
    "q": "Match each slide caption to its ratio.",
    "pairs": [
      ["One data element per one signal element", "r = 1"],
      ["One data element per two signal elements", "r = 1/2"],
      ["Two data elements per one signal element", "r = 2"],
      ["Four data elements per three signal elements", "r = 4/3"]
    ],
    "explain": "$r$ is data elements over signal elements: $\\frac{1}{1}$, $\\frac{1}{2}$, $\\frac{2}{1}$ and $\\frac{4}{3}$ for figures a to d."
  },
  {
    "q": "In the slide figure of line coding, which device at the sender turns the digital data into a digital signal?",
    "options": ["Encoder", "Decoder", "Modem", "Amplifier"],
    "answer": 0,
    "explain": "The encoder at the sender produces the digital signal; the decoder at the receiver turns it back into digital data. A modem converts between digital and **analog** signals, which is broadband transmission from Lecture 03."
  },
  {
    "q": "Which conversion does Lecture 04 discuss?",
    "options": ["Analog data to analog signals", "Digital data to digital signals", "Digital data to analog signals", "Analog data to digital data"],
    "answer": 1,
    "explain": "Digital-to-digital conversion: representing digital data by using digital signals."
  }
]
```

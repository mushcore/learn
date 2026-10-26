---
title: "Pipelining: cycle time and latency, superscalar CPUs"
minutes: 16
---

A CPU that finishes one instruction before it starts the next leaves most of its circuits idle. Pipelining keeps every stage busy, and two numbers measure what it buys: how often an instruction finishes, and how long one instruction takes.

## Three ways to make a processor faster

Slide 33, *Processors — Performance improvement*:

1. *Instruction-Level Parallelism (Pipelining)*
2. *Multithreading and Multicore Chips*
3. *Multiprocessors and Multi-computers*

The second and third are in [Multithreading, multicore, multiprocessors and multicomputers](#/comp4736-p1/parallel-processors).

## A five-stage pipeline works on five instructions at once

Slide 34 splits the work of one instruction into five units: S1 *Instruction fetch unit*, S2 *Instruction decode unit*, S3 *Operand fetch unit*, S4 *Instruction execution unit*, S5 *Write back unit*. Its second figure shows *the state of each stage as a function of time*; each cell holds an instruction number.

| Stage | t = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| S1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| S2 | | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| S3 | | | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| S4 | | | | 1 | 2 | 3 | 4 | 5 | 6 |
| S5 | | | | | 1 | 2 | 3 | 4 | 5 |

At t = 5 every stage is busy: S1 fetches instruction 5 while S5 writes back instruction 1. From then on one instruction leaves S5 every clock cycle.

## The car factory: the slowest station sets the cycle time

Slides 35 and 36 ask *Which assembly line is faster ?* about two lines that build the same car.

| Line | Stations | Box on slide 36 |
|---|---|---|
| One station | S, 4 hours, three workers on one car | *Cycle Time (CT) Every 4 hours 1 car* |
| Pipeline | S₁ 1 hour, S₂ 1 hour, S₃ 2 hours, one worker each | *Cycle Time (CT) Every 2 hours 1 car* |

On the pipelined line a car cannot leave S₂ until S₃ has released the car ahead of it, so all three stations move on the 2-hour beat of the slowest one. S₁ and S₂ finish their work in 1 hour and then wait.

### Three stations, one car per cycle

One step of the playback is one cycle. Watch S₁ and S₂ sit idle for half of every cycle, and count the cycles before car 1 comes out of S₃.

```widget
pipeline-play
{ "stages": [1, 1, 2], "unit": "h", "predict": true }
```

## Latency: each car still passes through every station

Slides 37 and 38 follow one grey car along the line: waiting, at S₁, at S₂, at S₃. The caption: *Latency for each car = 2 + 2 + 2 = 6 hours*. Each station holds the car for a full 2-hour cycle, even the two whose work takes 1 hour.

The slides answer slide 35's question only with the cycle-time boxes. Our answer, from the slide 39–40 formulas below (an in-class answer replaces this): the pipelined line is faster in throughput, one car every 2 hours against one every 4, but each car now takes 6 hours to build instead of 4. Pipelining raises throughput; it does not shorten the time for one item.

## The formulas, with and without pipelining

Slides 39 and 40 draw n stages S₁ … Sₙ with delays t₁ … tₙ:

| | Pipelining (slide 39) | No pipelining (slide 40) |
|---|---|---|
| Clock period | $T_p = \max\{t_1, t_2, \ldots, t_n\}$ | $T_p = t_1 + t_2 + \ldots + t_n$ |
| Throughput | $1 / T_p$ | $1 / T_p$ |
| Delay for each instruction | $n T_p$ | $T_p$ |

On the car factory: pipelined $T_p = \max\{1, 1, 2\} = 2$ h, throughput 1/2 car per hour, delay $3 \times 2 = 6$ h. Without pipelining $T_p = 1 + 1 + 2 = 4$ h, throughput 1/4 car per hour, delay 4 h. The slides give the formulas and the car numbers separately; this pairing is ours.

With delays in nanoseconds the throughput comes out per second. A clock period of 8 ns gives $1 / (8 \times 10^{-9}\text{ s}) = 0.125 \times 10^{9}$, that is 125 million instructions per second.

:::quiz The pipelined delay is not the sum of the stages
The pipelined delay is stages × clock period, because every stage is held for one full cycle. The sum of the stage delays is the clock period without pipelining.
:::

### The practice paper's three-stage pipeline

The instructor's written practice question has Fetch 3 ns, Decode 3 ns, Execute 5 ns. Work out the instructions per second and the delay for each instruction on paper, then check both against the stat row. The question is worked in full in [the written practice](#/comp4736-midterm/written-practice).

```widget
pipeline-play
{ "stages": [3, 3, 5], "unit": "ns" }
```

## Superscalar CPUs run several instructions in the same stage

Slides 41 and 42 show four figures.

| Figure (slide) | What it shows |
|---|---|
| *Dual five-stage pipelines with a common instruction fetch unit* (41) | one S1 feeds two rows of S2 → S3 → S4 → S5 |
| *A superscalar processor with five functional units* (41) | S1, S2, S3 once, then five S4 units, *ALU*, *ALU*, *LOAD*, *STORE*, *Floating point*, all feeding one S5 |
| *A three-stage pipeline* (42) | *Fetch unit* → *Decode unit* → *Execute unit* |
| *Superscalar CPU* (42) | two Fetch → Decode rows feed a *Holding buffer*, which feeds three execute units: *Integer arithmetic*, *Floating-point arithmetic*, *Boolean operations* |

A plain pipeline finishes at most one instruction per cycle. A superscalar design duplicates units so that two or more instructions can be in the same stage at once. Decoded instructions wait in the holding buffer until an execute unit of the right kind is free.

## Rate a four-stage and a five-stage pipeline

Every stage advances on the common clock. Give throughput in million instructions per second.

```quiz
[
  {
    "q": "A pipeline has four stages with delays 3 ns, 2 ns, 2 ns and 5 ns. What is its clock period $T_p$?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "unit": "ns",
    "explain": "Pipelined: $T_p = \\max\\{3, 2, 2, 5\\} = 5$ ns. The slowest stage sets the beat; the faster stages wait."
  },
  {
    "q": "Same pipeline (3, 2, 2, 5 ns). How many instructions per second can it complete, in millions?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 0,
    "unit": "million/s",
    "explain": "Throughput $= 1 / T_p = 1 / (5 \\times 10^{-9}) = 0.2 \\times 10^{9} = 200$ million instructions per second."
  },
  {
    "q": "Same pipeline (3, 2, 2, 5 ns). What is the delay for each instruction?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "unit": "ns",
    "explain": "Delay $= n T_p = 4 \\times 5 = 20$ ns. Each of the 4 stages holds the instruction for one 5 ns cycle. The sum 3 + 2 + 2 + 5 = 12 ns is the unpipelined clock period, not the pipelined delay."
  },
  {
    "q": "The same four stages (3, 2, 2, 5 ns) run without pipelining. What is the throughput, in million instructions per second?",
    "type": "numeric",
    "answer": 83.33,
    "tolerance": 0.05,
    "unit": "million/s",
    "explain": "No pipelining: $T_p = 3 + 2 + 2 + 5 = 12$ ns, throughput $= 1 / (12 \\times 10^{-9}) = 0.0833 \\times 10^{9} \\approx 83.33$ million per second. The delay for each instruction is $T_p = 12$ ns, less than the pipelined 20 ns, but the pipeline finishes 200 million per second."
  },
  {
    "q": "A five-stage pipeline has every stage at 2 ns. What is its throughput, in million instructions per second?",
    "type": "numeric",
    "answer": 500,
    "tolerance": 0,
    "unit": "million/s",
    "explain": "$T_p = \\max\\{2, 2, 2, 2, 2\\} = 2$ ns, throughput $= 1 / (2 \\times 10^{-9}) = 0.5 \\times 10^{9} = 500$ million per second."
  },
  {
    "q": "Same five-stage pipeline, every stage 2 ns. What is the delay for each instruction?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0,
    "unit": "ns",
    "explain": "Delay $= n T_p = 5 \\times 2 = 10$ ns. With equal stages the pipelined delay equals the sum of the stages, so nothing is lost to waiting."
  }
]
```

```quiz
[
  {
    "q": "Pipelining shortens the time it takes to complete one instruction.",
    "type": "tf",
    "answer": false,
    "explain": "Pipelining raises throughput, not the speed of one item. In the car factory a car takes 2 + 2 + 2 = 6 hours on the pipelined line against 4 hours on the one-station line, yet a car leaves every 2 hours instead of every 4."
  },
  {
    "q": "In a pipelined CPU, the clock period $T_p$ equals:",
    "options": [
      "the largest stage delay",
      "the sum of the stage delays",
      "the number of stages times the largest stage delay",
      "one divided by the largest stage delay"
    ],
    "answer": 0,
    "explain": "Slide 39: $T_p = \\max\\{t_1, \\ldots, t_n\\}$. The sum is the unpipelined clock period (slide 40), $n T_p$ is the pipelined delay for each instruction, and $1 / T_p$ is the throughput."
  },
  {
    "q": "A pipeline has three stages: 2 ns, 4 ns and 3 ns. How many instructions per second can it execute, in millions?",
    "type": "numeric",
    "answer": 250,
    "tolerance": 0,
    "unit": "million/s",
    "explain": "$T_p = \\max\\{2, 4, 3\\} = 4$ ns; throughput $= 1 / (4 \\times 10^{-9}) = 0.25 \\times 10^{9} = 250$ million instructions per second."
  },
  {
    "q": "Same pipeline (2, 4, 3 ns). What is the delay for each instruction?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "unit": "ns",
    "explain": "Delay $= n T_p = 3 \\times 4 = 12$ ns. Summing to 9 ns is the unpipelined answer."
  },
  {
    "q": "The same three stages (2, 4, 3 ns) run without pipelining. What is the delay for each instruction?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "unit": "ns",
    "explain": "Slide 40: without pipelining $T_p = 2 + 4 + 3 = 9$ ns and the delay for each instruction is $T_p$ itself, 9 ns. Throughput falls to $1 / 9$ ns $\\approx 111.1$ million per second."
  },
  {
    "q": "Without pipelining, the delay for each instruction is $n T_p$.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 40: without pipelining the delay for each instruction is $T_p$, where $T_p = t_1 + \\ldots + t_n$. $n T_p$ is the pipelined delay (slide 39)."
  },
  {
    "q": "Which unit is stage S3 of the slide's five-stage pipeline?",
    "options": ["Operand fetch unit", "Instruction decode unit", "Instruction execution unit", "Write back unit"],
    "answer": 0,
    "explain": "S1 Instruction fetch, S2 Instruction decode, S3 Operand fetch, S4 Instruction execution, S5 Write back."
  },
  {
    "q": "In the slide's superscalar CPU, where do decoded instructions wait for an execute unit?",
    "options": ["Holding buffer", "Write back unit", "Operand fetch unit", "Cache"],
    "answer": 0,
    "explain": "Two Fetch → Decode rows feed the holding buffer, which hands instructions to the integer, floating-point and Boolean execute units."
  },
  {
    "q": "Match each quantity to its formula from slides 39 and 40.",
    "type": "match",
    "pairs": [
      ["Clock period with pipelining", "max{t₁, …, tₙ}"],
      ["Clock period without pipelining", "t₁ + … + tₙ"],
      ["Throughput", "1 / Tₚ"],
      ["Delay for each instruction with pipelining", "n Tₚ"]
    ],
    "explain": "Pipelining: the slowest stage sets $T_p$ and an instruction spends one $T_p$ in each of n stages. Without pipelining one long period covers every stage. Throughput is $1 / T_p$ in both cases."
  }
]
```

---
title: CPU utilization = 1 − pⁿ
minutes: 17
---

Multiprogramming keeps several processes in memory so the CPU has work while one of them waits for I/O. Slides 43 to 46 put a number on how much that helps: how busy the CPU is with n processes, and how many processes it takes to keep it busy.

## A process waits for I/O a fraction p of its time

Slide 43, *CPU utilization, a probabilistic viewpoint*: *Suppose that a process spends a fraction p of its time waiting for I/O to complete. With n processes in memory at once, the probability that all n processes are waiting for I/O (in which case the CPU will be idle) is pⁿ. The CPU utilization is then given by the formula:*

$$\text{CPU utilization} = 1 - p^n$$

The CPU is idle only when every process is waiting at once. Any other moment has at least one process ready, so the CPU is busy. The idle fraction pⁿ is what slide 46 calls the *CPU waste*.

## The n = 3 derivation counts every case

Slide 44 builds the formula for three processes. Each one is waiting (idle) with probability p and busy with probability 1 − p:

| Case | P1 | P2 | P3 | Probability of the row | Sum over the case |
|---|---|---|---|---|---|
| 0 idle | 1 − p | 1 − p | 1 − p | (1 − p)³ | (1 − p)³ |
| 1 idle | p | 1 − p | 1 − p | p(1 − p)² | 3p(1 − p)² |
| 1 idle | 1 − p | p | 1 − p | p(1 − p)² | |
| 1 idle | 1 − p | 1 − p | p | p(1 − p)² | |
| 2 idle | 1 − p | p | p | p²(1 − p) | 3p²(1 − p) |
| 2 idle | p | 1 − p | p | p²(1 − p) | |
| 2 idle | p | p | 1 − p | p²(1 − p) | |
| 3 idle | p | p | p | p³ | p³ |

The slide's brace groups the 0-, 1- and 2-idle cases as *CPU - utilization*:

$$U = (1-p)^3 + 3p(1-p)^2 + 3p^2(1-p) = 1 - p^3$$

Only the last row leaves the CPU with nothing to do. Adding up the seven busy rows and subtracting the one idle row from 1 give the same answer, and the second way is the formula. Each row is a product of three factors because the model treats the processes as independent.

Any single row is also a question you can be asked. "Exactly one process waiting" is the three 1-idle rows together, 3p(1 − p)².

## The curve the slide draws

Slide 45 plots *CPU utilization (in percent)* against *Degree of multiprogramming*, n from 0 to 10, for *20% I/O wait*, *50% I/O wait* and *80% I/O wait*. The more a process waits, the more processes it takes to fill the CPU. The values below are 1 − pⁿ computed by us; the slide only plots them.

| n | 20 % I/O wait | 50 % I/O wait | 80 % I/O wait |
|---|---|---|---|
| 1 | 80 % | 50 % | 20 % |
| 2 | 96 % | 75 % | 36 % |
| 5 | 99.97 % | 96.9 % | 67.2 % |
| 10 | ≈ 100 % | 99.9 % | 89.3 % |

The point marked on the 80 % curve is the slide-46 example. Drag n down and the waste pⁿ grows fast.

```widget
cpu-util
{ "p": 0.8, "n": 10, "mode": "curve" }
```

## The slide-46 example: 80 % I/O wait

Slide 46:

- *From the figure it is clear that if processes spend 80% of their time waiting for I/O, at least 10 processes must be in memory at once to get the CPU waste below 10%.*
- *CPU waste = (0.8)¹⁰ ≈ 0.1074*
- *When you realize that an interactive process waiting for a user to type something at a terminal (or click on an icon) is in I/O wait state, it should be clear that I/O wait times of 80% and more are not unusual.*
- *It should be pointed out that the probabilistic model assumes that all n processes are independent.*

The arithmetic does not quite agree with the sentence: 0.1074 is 10.74 %, just above 10 %, and 0.8¹¹ ≈ 0.0859 is the first power below it, so strictly 11 processes are needed. The slide's answer is 10; know both numbers.

The method for "how many processes" is the same: raise p to n = 1, 2, 3, … and stop at the first pⁿ under the waste you are allowed.

## A RAM budget fixes n

In practice n is not chosen freely: it is however many processes fit in the memory the OS leaves. The practice paper's Q3 has 4 GB of RAM, an OS of 512 MB, 256 MB processes and a 99 % utilization target, and asks for the largest I/O wait that still meets it.

1. 4 GB = 4 × 1024 MB = 4096 MB.
2. Memory for processes: 4096 − 512 = 3584 MB.
3. Processes in memory: n = 3584 ÷ 256 = 14.
4. 0.99 = 1 − p¹⁴, so p¹⁴ = 0.01.
5. p = 0.01^(1/14) ≈ 0.72. Each process may wait on I/O up to about 72 % of its time.

Step 5 is the inverse: p = (1 − U)^(1/n). On a calculator, $0.01^{1/14} = e^{\ln 0.01 / 14}$. Count n in whole processes; a remainder of memory too small for one more process is unused.

```widget
cpu-util
{ "mode": "ram", "presets": true }
```

## Size three more systems

Each item uses the same three moves: 1 − pⁿ forward, n from the RAM budget, p or n from the target.

```quiz
[
  {
    "q": "Processes spend 60 % of their time waiting for I/O and 4 are in memory. What is the CPU utilization (as a fraction)?",
    "type": "numeric",
    "answer": 0.8704,
    "tolerance": 0.0005,
    "explain": "p = 0.6, n = 4. pⁿ = 0.6⁴ = 0.1296 (the CPU waste), so utilization = 1 − 0.1296 = 0.8704, about 87 %."
  },
  {
    "q": "A machine has 8 GB of RAM; the OS takes 1 GB and every process is 512 MB. How many processes fit in memory?",
    "type": "numeric",
    "answer": 14,
    "tolerance": 0,
    "explain": "8 GB = 8192 MB and 1 GB = 1024 MB. 8192 − 1024 = 7168 MB for processes; 7168 ÷ 512 = 14."
  },
  {
    "q": "Same machine (8 GB RAM, 1 GB OS, 512 MB processes). The goal is 95 % CPU utilization. What is the largest I/O wait fraction p that meets it?",
    "type": "numeric",
    "answer": 0.807,
    "tolerance": 0.002,
    "explain": "n = 14 from the RAM budget. 0.95 = 1 − p¹⁴, so p¹⁴ = 0.05 and p = 0.05^(1/14) = e^(ln 0.05 / 14) = e^(−2.9957 / 14) = e^(−0.2140) ≈ 0.807. Processes may wait on I/O up to about 81 % of the time."
  },
  {
    "q": "Processes spend 70 % of their time waiting for I/O. What is the smallest number of processes in memory that gets the CPU waste below 5 %?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "explain": "Waste = 0.7ⁿ. 0.7⁷ ≈ 0.0824, 0.7⁸ ≈ 0.0576 (still above 0.05), 0.7⁹ ≈ 0.0404 (below). So n = 9."
  },
  {
    "q": "Three independent processes are in memory, each waiting for I/O with probability 0.6. What is the probability that exactly one of them is waiting and the other two are ready?",
    "type": "numeric",
    "answer": 0.288,
    "tolerance": 0.0005,
    "explain": "These are slide 44's three 1-idle rows: 3p(1 − p)² = 3 × 0.6 × 0.4² = 3 × 0.6 × 0.16 = 0.288. The whole utilization is larger, 1 − 0.6³ = 0.784, because it also counts the 0-idle and 2-idle rows."
  }
]
```

```quiz
[
  {
    "q": "Processes spend 90 % of their time waiting for I/O and 5 are in memory. What is the CPU utilization (as a fraction)?",
    "type": "numeric",
    "answer": 0.4095,
    "tolerance": 0.0005,
    "explain": "1 − 0.9⁵ = 1 − 0.59049 = 0.40951. Even five processes leave the CPU idle 59 % of the time when each waits 90 %."
  },
  {
    "q": "The probabilistic model behind 1 − pⁿ assumes that all n processes are dependent.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 46: the probabilistic model assumes that all n processes are independent. That is what lets the probability that all are waiting be p × p × … × p = pⁿ."
  },
  {
    "q": "In CPU utilization = 1 − pⁿ, what does pⁿ stand for?",
    "options": [
      "The probability that all n processes are waiting for I/O, so the CPU is idle",
      "The probability that one particular process is waiting for I/O",
      "The fraction of its time a process spends computing",
      "The degree of multiprogramming"
    ],
    "answer": 0,
    "explain": "Slide 43: with n processes in memory, the probability that all n are waiting for I/O (in which case the CPU will be idle) is pⁿ. One process waits with probability p; it computes a fraction 1 − p; n is the degree of multiprogramming."
  },
  {
    "q": "According to slide 46, if processes spend 80 % of their time waiting for I/O, at least how many processes must be in memory to get the CPU waste below 10 %?",
    "options": ["10", "8", "5", "20"],
    "answer": 0,
    "explain": "The slide says at least 10 processes, with CPU waste = 0.8¹⁰ ≈ 0.1074. Strictly 0.1074 is 10.74 %, and 11 processes (0.8¹¹ ≈ 0.0859) are the first to go below 10 %; the slide's answer is 10."
  },
  {
    "q": "Processes spend 30 % of their time waiting for I/O and 2 are in memory. What is the CPU utilization (as a fraction)?",
    "type": "numeric",
    "answer": 0.91,
    "tolerance": 0.0005,
    "explain": "1 − 0.3² = 1 − 0.09 = 0.91."
  },
  {
    "q": "A machine has 2 GB of RAM, an OS of 512 MB and 128 MB processes. The goal is 90 % CPU utilization. What is the largest I/O wait fraction p that meets it?",
    "type": "numeric",
    "answer": 0.8254,
    "tolerance": 0.002,
    "explain": "2 GB = 2048 MB. (2048 − 512) ÷ 128 = 1536 ÷ 128 = 12 processes. 0.90 = 1 − p¹², so p¹² = 0.1 and p = 0.1^(1/12) = e^(ln 0.1 / 12) = e^(−0.1919) ≈ 0.825."
  },
  {
    "q": "In slide 44's derivation for three processes, the CPU is idle in the cases where two processes are waiting for I/O.",
    "type": "tf",
    "answer": false,
    "explain": "With two waiting, the third is ready, so the CPU is busy. Only the 3-idle row (probability p³) leaves the CPU idle, which is why U = 1 − p³."
  },
  {
    "q": "On slide 45's graph, what is on the x-axis?",
    "options": [
      "Degree of multiprogramming",
      "I/O wait fraction",
      "CPU utilization (in percent)",
      "Memory size"
    ],
    "answer": 0,
    "explain": "The x-axis is the degree of multiprogramming, n from 0 to 10; the y-axis is CPU utilization in percent. The I/O wait (20 %, 50 %, 80 %) labels the three curves."
  }
]
```

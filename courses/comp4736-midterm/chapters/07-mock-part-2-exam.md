---
title: Mock Part 2, five written calculations
minutes: 40
---

Five new questions in the shapes of the written practice, with new numbers. Work each on paper with every step shown, as Part 2 asks, then enter the numbers; each explanation gives the full working.

## Question 1: a four-stage pipeline

> A computer has a pipeline with four stages: Instruction fetch 2 nsec, Instruction decode 4 nsec, Operand fetch 3 nsec, Execute 4 nsec. How many instructions per second can this machine execute? Obtain the delay for each instruction. Then answer both again for the same four units without pipelining.

| Stage | Instruction fetch | Instruction decode | Operand fetch | Execute |
|---|---|---|---|---|
| Delay | 2 nsec | 4 nsec | 3 nsec | 4 nsec |

```quiz
[
  { "q": "Mock Q1. What is the clock period of the pipeline?", "type": "numeric", "answer": 4, "tolerance": 0, "unit": "ns", "explain": "Slide 39: $T_p = \\max\\{t_1, \\ldots, t_n\\} = \\max\\{2, 4, 3, 4\\} = 4$ ns. Two stages tie at 4 ns; the tie changes nothing." },
  { "q": "Mock Q1. How many instructions per second can the pipeline execute? (millions)", "type": "numeric", "answer": 250, "tolerance": 0, "unit": "million instructions/s", "explain": "Throughput $= 1/T_p = 1/(4 \\times 10^{-9}) = 0.25 \\times 10^9 = 250$ million instructions per second." },
  { "q": "Mock Q1. What is the delay for each instruction in the pipeline?", "type": "numeric", "answer": 16, "tolerance": 0, "unit": "ns", "explain": "Delay $= nT_p = 4 \\times 4 = 16$ ns: four stages, one 4 ns cycle in each. Not the 13 ns sum of the stage delays." },
  { "q": "Mock Q1. Without pipelining, how many instructions per second? (millions, one decimal)", "type": "numeric", "answer": 76.92, "tolerance": 0.05, "unit": "million instructions/s", "explain": "Slide 40: without pipelining $T_p = t_1 + t_2 + t_3 + t_4 = 2 + 4 + 3 + 4 = 13$ ns, and throughput $= 1/(13 \\times 10^{-9}) = 76.9$ million instructions per second. Pipelining raises the rate by 13/4 = 3.25 times." },
  { "q": "Mock Q1. Without pipelining, what is the delay for each instruction?", "type": "numeric", "answer": 13, "tolerance": 0, "unit": "ns", "explain": "Slide 40: delay for each instruction $= T_p = 13$ ns. The pipeline's 16 ns delay is longer, yet it finishes an instruction every 4 ns instead of every 13 ns: the car factory's trade of latency for throughput." }
]
```

## Question 2: CPU utilization for three jobs

> Consider the following situation and obtain the CPU utilization for each case: a) without multiprogramming (order of running A, B, C); b) with multiprogramming (order of running A, B, C). With multiprogramming, in each time unit the CPU goes to the first ready job in the order A, B, C.

| Process | CPU | I/O | Bursts in order |
|---|---|---|---|
| A | 3 | 4 | CPU 2, I/O 4, CPU 1 |
| B | 5 | 2 | CPU 4, I/O 2, CPU 1 |
| C | 4 | 3 | CPU 1, I/O 3, CPU 3 |

```quiz
[
  { "q": "Mock Q2(a). Without multiprogramming, how many time units of real time does the run take?", "type": "numeric", "answer": 21, "tolerance": 0, "unit": "time units", "explain": "One job at a time, the CPU idle during each I/O: total CPU 3 + 5 + 4 = 12, total I/O 4 + 2 + 3 = 9, real time 12 + 9 = 21 units. A takes times 0–6, B 7–13, C 14–20." },
  { "q": "Mock Q2(a). CPU utilization without multiprogramming? (three decimals)", "type": "numeric", "answer": 0.571, "tolerance": 0.002, "explain": "CPU utilization = total CPU time / total real time = 12/21 = 0.571." },
  { "q": "Mock Q2(b). With multiprogramming, how many time units of real time does the run take?", "type": "numeric", "answer": 14, "tolerance": 0, "unit": "time units", "explain": "Time 0–1 A (A then does I/O at 2–5). 2–5 B, four CPU units (B then does I/O at 6–7). 6 A, its last unit: A is done. 7 C, one unit (C then does I/O at 8–10). 8 B, its last unit: B is done. 9 and 10 idle: only C is left and it is in I/O. 11–13 C, three units. The run ends at time 13: 14 units." },
  { "q": "Mock Q2(b). CPU utilization with multiprogramming? (three decimals)", "type": "numeric", "answer": 0.857, "tolerance": 0.002, "explain": "The CPU is busy 12 of the 14 units (idle at 9 and 10): 12/(12 + 2) = 12/14 = 0.857." },
  { "q": "Mock Q2(b). In which time units is the CPU idle?", "options": ["9 and 10", "8 and 9", "10 and 11", "None; the CPU is never idle"], "answer": 0, "explain": "A finishes at 6 and B at 8. C's I/O covers 8, 9 and 10, so at 9 and 10 no job is ready; at 8 B is ready (its I/O ended at 7) and uses the CPU. C runs again at 11." }
]
```

## Question 3: the I/O wait 98 % utilization allows

> A computer has 8 GB of RAM of which the operating system occupies 1 GB. The processes are all 512 MB and have the same characteristics. If the goal is 98% CPU utilization, what is the maximum I/O wait that can be tolerated?

```quiz
[
  { "q": "Mock Q3. How much memory, in MB, is left for programs?", "type": "numeric", "answer": 7168, "tolerance": 0, "unit": "MB", "explain": "8 GB = 8 × 1024 = 8192 MB; 1 GB = 1024 MB. 8192 − 1024 = 7168 MB." },
  { "q": "Mock Q3. How many processes fit in memory?", "type": "numeric", "answer": 14, "tolerance": 0, "unit": "processes", "explain": "n = 7168 / 512 = 14 processes." },
  { "q": "Mock Q3. What is the maximum I/O wait fraction p? (two or three decimals)", "type": "numeric", "answer": 0.756, "tolerance": 0.005, "explain": "$1 - p^{14} = 0.98$, so $p^{14} = 0.02$ and $p = 0.02^{1/14} = e^{\\ln 0.02 / 14} = e^{-3.912/14} = e^{-0.2794} = 0.756$. A process may wait on I/O up to about 76 % of the time." },
  { "q": "Mock Q3. With the same 14 processes but 80 % I/O wait, what is the CPU utilization? (three decimals)", "type": "numeric", "answer": 0.956, "tolerance": 0.002, "explain": "$1 - 0.8^{14} = 1 - 0.0440 = 0.956$. Below the 98 % goal, which agrees with 0.8 being larger than the 0.756 limit." }
]
```

## Question 4: three 15-minute jobs at 40 % I/O wait

> Three jobs, each needing 15 minutes of CPU time, start simultaneously. How long will the last one take to complete if they run sequentially? How long if they run in parallel? Assume 40% I/O wait.

```quiz
[
  { "q": "Mock Q4. How long does one job take when it runs alone?", "type": "numeric", "answer": 25, "tolerance": 0, "unit": "min", "explain": "40 % of the job's real time T is I/O wait: 15 + 0.4T = T, so 0.6T = 15 and T = 25 min." },
  { "q": "Mock Q4. Running sequentially, when does the last job finish?", "type": "numeric", "answer": 75, "tolerance": 0, "unit": "min", "explain": "Three jobs one after another: 25 + 25 + 25 = 75 min." },
  { "q": "Mock Q4. CPU utilization with the three jobs in parallel? (three decimals)", "type": "numeric", "answer": 0.936, "tolerance": 0.001, "explain": "n = 3, p = 0.4: $1 - 0.4^3 = 1 - 0.064 = 0.936$." },
  { "q": "Mock Q4. Running in parallel, when does the last job finish? (minutes, one decimal)", "type": "numeric", "answer": 48.08, "tolerance": 0.05, "unit": "min", "explain": "The CPU must deliver 3 × 15 = 45 min of work at 0.936 utilization: $T_{total} = 45 / 0.936 = 48.1$ min, against 75 min sequentially." }
]
```

## Question 5: a direct-mapped cache with 8 lines

> A computer system uses a direct-mapped cache with 8 cache lines. Initially, all cache lines are empty. Each memory request represents one memory block. The following memory block requests occur from left to right:
> **5, 13, 2, 13, 8, 10, 21, 8, 3, 10, 16, 5, 3, 30, 24, 5**
> a. Calculate the total number of cache hits and cache misses.
> b. Determine the final contents of the cache lines.

```quiz
[
  { "q": "Mock Q5(a). How many cache misses?", "type": "numeric", "answer": 11, "tolerance": 0, "unit": "misses", "explain": "Line = block % 8. Trace (M = miss, H = hit): 5→5 M; 13→5 M (evicts 5); 2→2 M; 13→5 H; 8→0 M; 10→2 M (evicts 2); 21→5 M (evicts 13); 8→0 H; 3→3 M; 10→2 H; 16→0 M (evicts 8); 5→5 M (evicts 21); 3→3 H; 30→6 M; 24→0 M (evicts 16); 5→5 H. 11 misses." },
  { "q": "Mock Q5(a). How many cache hits?", "type": "numeric", "answer": 5, "tolerance": 0, "unit": "hits", "explain": "Requests 4 (13), 8 (8), 10 (10), 13 (3) and 16 (5) find their block already in its line: 5 hits. 16 − 11 = 5." },
  { "q": "Mock Q5(a). What is the miss rate, in percent?", "type": "numeric", "answer": 68.75, "tolerance": 0.05, "unit": "%", "explain": "Miss rate = misses / requests = 11/16 = 0.6875 = 68.75 %. Hit rate = 5/16 = 31.25 %." },
  { "q": "Mock Q5(b). Which block is in line 0 at the end?", "type": "numeric", "answer": 24, "tolerance": 0, "explain": "Blocks mapping to line 0 (a multiple of 8): 8, 8, 16, 24. The last one, 24 (request 15), stays." },
  { "q": "Mock Q5(b). Which block is in line 5 at the end?", "type": "numeric", "answer": 5, "tolerance": 0, "explain": "Line 5 history: 5, 13, 13 (hit), 21, 5, 5 (hit). The last block is 5." },
  { "q": "Mock Q5(b). How many of the 8 lines are still empty at the end?", "type": "numeric", "answer": 3, "tolerance": 0, "unit": "lines", "explain": "Lines used: 0 (24), 2 (10), 3 (3), 5 (5), 6 (30). No request maps to lines 1, 4 or 7, so 3 lines stay empty. Final: [0] 24, [1] empty, [2] 10, [3] 3, [4] empty, [5] 5, [6] 30, [7] empty." }
]
```

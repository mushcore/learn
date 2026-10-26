---
title: Practice Part 2, the five written questions worked
minutes: 45
---

Part 2 of the midterm is written: you show the arithmetic on paper. These are the instructor's five practice questions; work each one on paper, enter your number, then compare your steps with the instructor's.

## Question 1: a three-stage pipeline at 3, 3 and 5 ns

> A computer has a pipeline with three stages as shown below. How many instructions per second can this machine execute? Obtain the delay for each instruction.

| Stage | Fetch unit | Decode unit | Execute unit |
|---|---|---|---|
| Delay | 3 nsec | 3 nsec | 5 nsec |

```quiz
[
  { "q": "Practice Q1. How many instructions per second can the 3 / 3 / 5 ns pipeline execute? Answer in millions of instructions per second.", "type": "numeric", "answer": 200, "tolerance": 0, "unit": "million instructions/s", "explain": "The slowest stage sets the clock: $T_p = \\max\\{3, 3, 5\\} = 5$ ns. Throughput $= 1/T_p = 1/(5 \\times 10^{-9}) = 0.2 \\times 10^9 = 200$ million instructions per second." },
  { "q": "Practice Q1. What is the delay for each instruction in the same pipeline?", "type": "numeric", "answer": 15, "tolerance": 0, "unit": "ns", "explain": "Every stage takes one 5 ns clock cycle, and an instruction passes through 3 stages: delay $= nT_p = 3 \\times 5 = 15$ ns. The sum 3 + 3 + 5 = 11 ns is the no-pipelining clock period, not this answer." }
]
```

### The instructor's working

```text
F = 1/T = 1/5x10^(-9)=0.2 x 10^9 = 200 millions
Delay = 15 nsec
```

The formulas are slide 39's ([Pipelining](#/comp4736-p1/pipelining)):

| Pipelining (slide 39) | No pipelining (slide 40) |
|---|---|
| $T_p = \max\{t_1, t_2, \ldots, t_n\}$ | $T_p = t_1 + t_2 + \cdots + t_n$ |
| Throughput $= 1/T_p$ | Throughput $= 1/T_p$ |
| Delay for each instruction $= nT_p$ | Delay for each instruction $= T_p$ |

1. The clock period is the slowest stage, 5 ns. The two 3 ns stages finish early and wait for the clock.
2. One instruction leaves the pipeline every cycle: $1/(5\ \text{ns}) = 2 \times 10^8$, that is 200 million instructions per second.
3. Each instruction spends one full cycle in each of the 3 stages: $3 \times 5 = 15$ ns.

The delay is 15 ns, three times the 5 ns clock, and not the 11 ns sum of the stage delays; this is the car factory's "2 + 2 + 2 = 6 hours" on slide 37.

### One instruction leaves every 5 ns

The Execute box holds each instruction for a full cycle; count the cycles from Fetch to the end for instruction 1.

```widget
pipeline-play
{ "stages": [3, 3, 5], "unit": "ns" }
```

## Question 2: CPU utilization from a job timeline

> Consider the following situation and obtain the CPU utilization for each case.
> a) without multiprogramming (order of running A, B, C)
> b) with multiprogramming (order of running A, B, C)

The page gives *CPU utilization = total CPU time / total real time* and this table. Each job runs a CPU burst, does I/O, then runs again:

| Process | CPU | I/O | Bursts in order |
|---|---|---|---|
| A | 5 | 3 | CPU 2, I/O 3, CPU 3 |
| B | 2 | 6 | CPU 1, I/O 6, CPU 1 |
| C | 9 | 1 | CPU 8, I/O 1, CPU 1 |
| Total | 16 | 10 | |

```quiz
[
  { "q": "Practice Q2(a). CPU utilization without multiprogramming? Give a decimal to three places.", "type": "numeric", "answer": 0.615, "tolerance": 0.002, "explain": "Without multiprogramming the CPU waits through every I/O burst, so real time = 16 CPU + 10 I/O = 26 units. Utilization = 16/26 = 0.615." },
  { "q": "Practice Q2(b). CPU utilization with multiprogramming? Give a decimal to two or three places.", "type": "numeric", "answer": 0.941, "tolerance": 0.002, "explain": "With multiprogramming the CPU takes another ready job whenever the running one starts I/O. The timeline ends at time 16, so real time = 17 units; only time 15 is idle (C doing its I/O, A and B finished). Utilization = 16/17 = 0.94." }
]
```

### The instructor's working

```text
a) CPU utilization = 16/(16+10) = 16/26 = 0.615
b) CPU utilization = 16/(16+1)  = 16/17 = 0.94
```

**(a)** The jobs run one after the other and the CPU sits idle during each job's I/O. A occupies times 0 to 7, B 8 to 15, C 16 to 25: 26 units of real time, 16 of them with the CPU busy.

**(b)** Read from the instructor's timeline: in every time unit the CPU goes to the first job, in the order A, B, C, that is ready to compute. At time 5, A returns from I/O and takes the CPU back from C.

| Time | CPU runs | Why |
|---|---|---|
| 0–1 | A (CPU 1, 2) | A is first in the order |
| 2 | B (CPU 1) | A does I/O at 2–4 |
| 3–4 | C (CPU 1, 2) | B does I/O at 3–8 |
| 5–7 | A (CPU 3, 4, 5) | A's I/O is over; A comes before C |
| 8 | C (CPU 3) | A has finished, B is still in I/O |
| 9 | B (CPU 2) | B's I/O is over; B comes before C |
| 10–14 | C (CPU 4 to 8) | A and B have finished |
| 15 | idle | C does its 1 unit of I/O; no other job is left |
| 16 | C (CPU 9) | C finishes |

Time 0 to 16 is 17 units, 16 of them busy. The "+1" in the instructor's 16 + 1 is the idle unit at time 15. [Utilization from a job timeline](#/comp4736-p3/job-timelines) teaches the procedure.

### The CPU column fills in one time unit at a time

Watch time 15 in the multiprogrammed chart: it is the only empty CPU cell.

```widget
multiprog-play
{}
```

## Question 3: how much I/O wait 99 % utilization allows

> A computer has 4 GB of RAM of which the operating system occupies 512 MB. The processes are all 256 MB (for simplicity) and have the same characteristics. If the goal is 99% CPU utilization, what is the maximum I/O wait that can be tolerated?

```quiz
[
  { "q": "Practice Q3. How many 256 MB processes fit in memory?", "type": "numeric", "answer": 14, "tolerance": 0, "unit": "processes", "explain": "4 GB = 4 × 1024 MB = 4096 MB. Memory for programs = 4096 − 512 = 3584 MB. 3584 / 256 = 14 processes." },
  { "q": "Practice Q3. What is the maximum I/O wait fraction p for 99 % CPU utilization? Give two decimal places.", "type": "numeric", "answer": 0.72, "tolerance": 0.005, "explain": "$1 - p^{14} = 0.99$, so $p^{14} = 0.01$ and $p = 0.01^{1/14} = 0.7197 \\approx 0.72$. Each process may wait on I/O up to about 72 % of the time." }
]
```

### The instructor's working

```text
4 GB = 4 x 2^10 x 2^20 = 4 x 1024 x 2^20 = 4096 MB
Memory occupied by programs = 4096 MB – 512 MB = 3584 MB
# loaded programs in RAM = 3584/256 = 14
Utilization = 1 – p^14 => 0.99 = 1 – p^14 => p^14 = 0.01 => p ≈ 0.72
```

The model is slide 43's ([Modeling multiprogramming](#/comp4736-p3/modeling-multiprogramming)): *Suppose that a process spends a fraction p of its time waiting for I/O to complete. With n processes in memory at once, the probability that all n processes are waiting for I/O (in which case the CPU will be idle) is pⁿ.* So utilization $= 1 - p^n$.

1. Convert with 1 GB = 1024 MB, not 1000: 4096 MB.
2. Take the OS off the top: 3584 MB for programs.
3. Divide by the process size: n = 14.
4. Solve $1 - p^{14} = 0.99$ for p. On a calculator, $0.01^{1/14}$ is `0.01 ^ (1/14)`, or $e^{\ln 0.01 / 14} = e^{-0.3289} = 0.7197$.

### RAM budget to n, then n to p

The RAM tab loads the 4 GB / 512 MB / 256 MB case and solves for p at 99 %.

```widget
cpu-util
{ "mode": "ram" }
```

## Question 4: two 20-minute jobs at 50 % I/O wait

> Multiple jobs can run in parallel and finish faster than if they had run sequentially. Suppose that two jobs, each needing 20 minutes of CPU time, start simultaneously. How long will the last one take to complete if they run sequentially? How long if they run in parallel? Assume 50% I/O wait.

```quiz
[
  { "q": "Practice Q4. Running sequentially, when does the last job finish? (minutes)", "type": "numeric", "answer": 80, "tolerance": 0, "unit": "min", "explain": "Alone, a job computes only half the time: 20 + ½T = T, so T = 40 min. Two jobs one after the other: 40 + 40 = 80 min." },
  { "q": "Practice Q4. Running in parallel, when does the last job finish? (minutes, one decimal)", "type": "numeric", "answer": 53.33, "tolerance": 0.05, "unit": "min", "explain": "With n = 2 and p = ½, utilization = 1 − (½)² = ¾. The CPU must deliver 20 + 20 = 40 min of work at ¾ efficiency: 40 / ¾ = 160/3 ≈ 53.3 min." }
]
```

### The instructor's working

```text
20 + (1/2)xT = T => T = 40 minutes for each process
Running sequentially = 40 + 40 = 80 minutes
Running in parallel:
CPU utilization = 1 – (1/2)^2 = 3/4
CPU utilization = 40/Ttotal=>Ttotal= 40/(3/4) = 160/3 ≈ 53.3 minutes
```

1. One job alone: half of its real time T is I/O wait, so its 20 CPU minutes are the other half. $T = 20 / 0.5 = 40$ min.
2. Sequentially the second job starts at 40 and ends at 80 min.
3. In parallel, n = 2 processes with p = 0.5: utilization $1 - 0.5^2 = 0.75$.
4. The 40 in the last line is the two jobs' combined CPU time, 20 + 20, not the 40 min from step 1. Real time = work ÷ utilization $= 40 / 0.75 = 53.3$ min.

### Sequential against parallel jobs

The parallel tab computes T alone, k × T, and k × C ÷ (1 − pᵏ) for the paper's numbers.

```widget
cpu-util
{ "mode": "parallel" }
```

## Question 5: a direct-mapped cache with 4 lines

> A computer system uses a direct-mapped cache with 4 cache lines. Initially, all cache lines are empty. Each memory request represents one memory block. The following memory block requests occur from left to right:
> **10, 22, 11, 25, 19, 11, 24, 6, 15, 19, 10, 0, 0, 6, 29, 11, 26, 12, 10, 12**
> a. Calculate the total number of cache hits and cache misses.
> b. Determine the final contents of all four cache lines after processing the entire sequence of memory requests. List the memory block stored in each cache line.

```quiz
[
  { "q": "Practice Q5(a). How many cache misses?", "type": "numeric", "answer": 18, "tolerance": 0, "unit": "misses", "explain": "Line = block % 4. Only requests 13 (block 0, already in line 0) and 20 (block 12, already in line 0) find their block; the other 18 miss." },
  { "q": "Practice Q5(a). How many cache hits?", "type": "numeric", "answer": 2, "tolerance": 0, "unit": "hits", "explain": "Requests 13 (0 after 0) and 20 (12 after 12, with only line-2 requests between). 20 requests − 18 misses = 2 hits." },
  { "q": "Practice Q5(b). The final contents of the four lines.", "type": "fill", "code": "[0] ___\n[1] ___\n[2] ___\n[3] ___", "answer": ["12", "29", "10", "11"], "explain": "The last block mapped to each line stays: line 0 last gets 12 (request 20), line 1 gets 29 (request 15), line 2 gets 10 (request 19), line 3 gets 11 (request 16)." }
]
```

### The instructor's working

The slide 54 rule ([Cache lines and sets](#/comp4736-p1/cache-mapping)) is *CI = MI % (# of cache lines)*. The instructor lists each line's history; the subscript is the request number and a red subscript is a hit:

```text
[0]  24_7, 0_12, 0_13 (hit), 12_18, 12_20 (hit)
[1]  25_4, 29_15
[2]  10_1, 22_2, 6_8, 10_11, 6_14, 26_17, 10_19
[3]  11_3, 19_5, 11_6, 15_9, 19_10, 11_16

Miss : 18    Hit : 2    Miss rate : 90.000%    Hit rate : 10.000%
Final: [0] 12  [1] 29  [2] 10  [3] 11
```

Request by request:

| # | Block | Block % 4 | Line held | Result |
|---|---|---|---|---|
| 1 | 10 | 2 | empty | miss |
| 2 | 22 | 2 | 10 | miss, evicts 10 |
| 3 | 11 | 3 | empty | miss |
| 4 | 25 | 1 | empty | miss |
| 5 | 19 | 3 | 11 | miss, evicts 11 |
| 6 | 11 | 3 | 19 | miss, evicts 19 |
| 7 | 24 | 0 | empty | miss |
| 8 | 6 | 2 | 22 | miss, evicts 22 |
| 9 | 15 | 3 | 11 | miss, evicts 11 |
| 10 | 19 | 3 | 15 | miss, evicts 15 |
| 11 | 10 | 2 | 6 | miss, evicts 6 |
| 12 | 0 | 0 | 24 | miss, evicts 24 |
| 13 | 0 | 0 | 0 | **hit** |
| 14 | 6 | 2 | 10 | miss, evicts 10 |
| 15 | 29 | 1 | 25 | miss, evicts 25 |
| 16 | 11 | 3 | 19 | miss, evicts 19 |
| 17 | 26 | 2 | 6 | miss, evicts 6 |
| 18 | 12 | 0 | 0 | miss, evicts 0 |
| 19 | 10 | 2 | 26 | miss, evicts 26 |
| 20 | 12 | 0 | 12 | **hit** |

Line 3 shows why the miss count is so high: 11, 19 and 15 all map to it and keep evicting each other. Miss rate = 18/20 = 90 %.

### The trace, one request per step

Each step writes the modulo out, lights the line and names the evicted block.

```widget
cache-map-play
{ "lines": 4, "requests": "10 22 11 25 19 11 24 6 15 19 10 0 0 6 29 11 26 12 10 12" }
```

```quiz
[
  { "q": "In a pipeline, the delay for each instruction is the sum of the stage delays.", "type": "tf", "answer": false, "explain": "With pipelining the delay is $nT_p$: the number of stages times the slowest stage (3 × 5 = 15 ns in practice Q1). The sum of the stage delays is the clock period without pipelining (slide 40), where delay = $T_p$." },
  { "q": "What sets the clock period of a pipeline?", "options": ["The slowest stage", "The sum of the stage delays", "The number of stages", "The fastest stage"], "answer": 0, "explain": "Slide 39: $T_p = \\max\\{t_1, \\ldots, t_n\\}$. Every stage must finish within one cycle, so the slowest one decides; in the car factory the 2-hour station gives one car every 2 hours." },
  { "q": "In practice Q2(b), why is the CPU idle at time 15?", "options": ["C is doing its one unit of I/O and A and B have already finished", "B is still in its 6-unit I/O burst", "A has returned from I/O but waits for C", "The OS is switching from B to C"], "answer": 0, "explain": "A finished at 7 and B at 9. C's 8th CPU unit is at 14; its single I/O unit falls at 15 and no other job is left to run, so the cell is empty. C's last CPU unit is at 16, giving 17 units of real time." },
  { "q": "In practice Q4, the parallel answer is 40 ÷ ¾. What is the 40?", "options": ["The two jobs' combined CPU time, 20 + 20 minutes", "The time one job takes alone at 50 % I/O wait", "Half of the 80-minute sequential time", "The sum of both jobs' I/O wait"], "answer": 0, "explain": "Real time = CPU work ÷ utilization. The work is 20 + 20 = 40 CPU minutes; that it equals the 40-minute single-job time is a coincidence of these numbers." },
  { "q": "In a direct-mapped cache with 4 lines, which line does memory block 26 go to?", "type": "numeric", "answer": 2, "tolerance": 0, "explain": "CI = MI % (# of cache lines) = 26 % 4 = 2 (26 = 6 × 4 + 2)." },
  { "q": "In practice Q3, p ≈ 0.72 means each process may spend up to about 72 % of its time waiting for I/O and 14 such processes still keep the CPU 99 % busy.", "type": "tf", "answer": true, "explain": "p is the fraction of time a process waits for I/O. $1 - 0.72^{14} \\approx 1 - 0.01 = 0.99$. A larger p would push utilization below 99 %." }
]
```

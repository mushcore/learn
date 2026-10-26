---
title: Utilization from a job timeline, with and without multiprogramming
minutes: 18
---

The formula 1 − pⁿ gives an average. Two of the practice paper's written questions ask for something more concrete: draw what the CPU does in each time unit for a few named jobs and divide, or compare the finishing times of jobs run one after another and run together.

## CPU utilization is CPU time over real time

The practice paper's Q2 states the rule it uses: **CPU utilization = total CPU time / total real time**. The CPU time is fixed by the jobs. Only the real time changes, and multiprogramming shortens it by doing one job's I/O while another job computes.

Q2's three jobs each compute, wait for I/O, then compute again. The table gives the bursts in the order each job runs them, one time unit per number:

| Job | CPU | I/O | CPU | CPU total | I/O total |
|---|---|---|---|---|---|
| A | 2 | 3 | 3 | 5 | 3 |
| B | 1 | 6 | 1 | 2 | 6 |
| C | 8 | 1 | 1 | 9 | 1 |
| Sum | | | | 16 | 10 |

## The jobs run one after another

Run in the order A, B, C, each job finishes before the next starts. While a job waits for I/O, nothing else is in memory, so the CPU sits idle.

| Time units | CPU | Why |
|---|---|---|
| 0–1 | A | A's first burst |
| 2–4 | idle | A doing I/O |
| 5–7 | A | A's second burst, A done |
| 8 | B | |
| 9–14 | idle | B doing I/O |
| 15 | B | B done |
| 16–23 | C | |
| 24 | idle | C doing I/O |
| 25 | C | C done |

The real time is every burst added end to end: 16 + 10 = 26 units. Utilization = 16 / 26 = 0.615.

## The same jobs with multiprogramming

All three jobs are in memory from time 0. When the running job starts I/O, the CPU takes the next job that is ready, in the order A, B, C, and I/O for different jobs overlaps. The practice paper's chart also gives a job coming back from I/O the CPU ahead of a later job: at time 5 A returns and C waits, and at time 9 B returns and C waits.

| Time units | CPU | Doing I/O |
|---|---|---|
| 0–1 | A | |
| 2 | B | A |
| 3–4 | C | A, B |
| 5–7 | A | B |
| 8 | C | B |
| 9 | B | |
| 10–14 | C | |
| 15 | idle | C |
| 16 | C | |

The CPU still does 16 units of work, but the jobs finish at time 17. The only idle unit is 15, when A and B are finished and C is in its I/O. Utilization = 16 / 17 = 0.94.

### The CPU column fills in one time unit at a time

The default is Q2's three jobs. Before each unit, decide who has the CPU; the unit to watch is 15, where nothing is ready.

```widget
multiprog-play
{ "predict": true }
```

## Two jobs with 50 % I/O wait

The practice paper's Q4: two jobs, each needing 20 minutes of CPU time, start together with 50 % I/O wait. How long until the last one finishes, run sequentially and run in parallel?

**One job alone.** The CPU is busy half the time, so a job of 20 CPU-minutes takes T where 20 + ½T = T: the 20 minutes of computing plus the half of T spent waiting. T = 40 minutes.

**Sequentially.** The second job starts when the first ends: 40 + 40 = 80 minutes.

**In parallel.** With both jobs in memory the CPU is idle only when both wait, so slide 43's model with n = 2 gives utilization 1 − (½)² = ¾. The CPU must deliver 20 + 20 = 40 CPU-minutes at ¾ efficiency: T = 40 ÷ ¾ = 160 / 3 ≈ 53.3 minutes.

The general form, for k jobs of C CPU-minutes each with I/O wait p:

| Quantity | Formula | Q4 |
|---|---|---|
| One job alone | T = C ÷ (1 − p) | 20 ÷ 0.5 = 40 |
| Sequential, last finishes | k × T | 2 × 40 = 80 |
| Parallel utilization | 1 − pᵏ | 1 − 0.25 = 0.75 |
| Parallel, last finishes | k × C ÷ (1 − pᵏ) | 40 ÷ 0.75 = 53.3 |

The "40" on the paper's last line is the two jobs' combined CPU time, not the 40-minute single-job time. Treating the jobs as finishing together is the model's simplification; it assumes, like slide 46, that the jobs are independent and stay in memory together until the end.

```widget
cpu-util
{ "mode": "parallel" }
```

## Chart three new jobs and time three 15-minute jobs

Draw the slot table on paper before you enter a number. The scheduling rule is the one from Q2's chart: first ready job in the order A, B, C.

```quiz
[
  {
    "q": "Jobs run in the order A, B, C with these bursts: A = CPU 2, I/O 2, CPU 2; B = CPU 1, I/O 5, CPU 2; C = CPU 2, I/O 1, CPU 4. **Without** multiprogramming, what is the CPU utilization (as a fraction)?",
    "type": "numeric",
    "answer": 0.619,
    "tolerance": 0.001,
    "explain": "CPU time = A 4 + B 3 + C 6 = 13. I/O time = 2 + 5 + 1 = 8. Run one after another the real time is 13 + 8 = 21. Slots: 0–1 A, 2–3 idle, 4–5 A, 6 B, 7–11 idle, 12–13 B, 14–15 C, 16 idle, 17–20 C. Utilization = 13 / 21 = 0.619."
  },
  {
    "q": "Same jobs (A = CPU 2, I/O 2, CPU 2; B = CPU 1, I/O 5, CPU 2; C = CPU 2, I/O 1, CPU 4), now **with** multiprogramming, the CPU going to the first ready job in the order A, B, C. At what time does the last job finish (how many time units in total)?",
    "type": "numeric",
    "answer": 14,
    "tolerance": 0,
    "explain": "Slots: 0–1 A; 2 B (A in I/O 2–3); 3 C (B in I/O 3–7); 4–5 A, back from I/O ahead of C, and A is done; 6 C; 7 idle (B and C both in I/O); 8–9 B, back ahead of C, and B is done; 10–13 C. Total 14 units."
  },
  {
    "q": "For the same multiprogrammed run, what is the CPU utilization (as a fraction)?",
    "type": "numeric",
    "answer": 0.929,
    "tolerance": 0.001,
    "explain": "CPU busy 13 units (every slot except 7) out of 14: 13 / 14 = 0.929. Without multiprogramming the same work took 21 units, 0.619."
  },
  {
    "q": "Three jobs, each needing 15 minutes of CPU time, have 40 % I/O wait. Run sequentially, when does the last one finish (minutes)?",
    "type": "numeric",
    "answer": 75,
    "tolerance": 0,
    "explain": "One job alone: T = 15 ÷ (1 − 0.4) = 15 ÷ 0.6 = 25 minutes (15 computing + 0.4 × 25 = 10 waiting). Three in a row: 3 × 25 = 75 minutes."
  },
  {
    "q": "The same three jobs (15 CPU-minutes each, 40 % I/O wait) run in parallel. When does the last one finish (minutes)?",
    "type": "numeric",
    "answer": 48.08,
    "tolerance": 0.05,
    "explain": "Utilization with three in memory = 1 − 0.4³ = 1 − 0.064 = 0.936. Total CPU work = 3 × 15 = 45 minutes. T = 45 ÷ 0.936 ≈ 48.08 minutes, against 75 sequentially."
  }
]
```

```quiz
[
  {
    "q": "Without multiprogramming, the total real time for a set of jobs is the sum of every job's CPU time and I/O time.",
    "type": "tf",
    "answer": true,
    "explain": "One job at a time means nothing overlaps: each I/O burst leaves the CPU idle, so the real time is all the bursts end to end."
  },
  {
    "q": "With multiprogramming, what happens when the running job starts an I/O burst?",
    "options": [
      "The CPU takes the next ready job",
      "The CPU waits until that job's I/O finishes",
      "The job is terminated and restarted later",
      "Every other job also starts its I/O"
    ],
    "answer": 0,
    "explain": "The point of keeping several jobs in memory: when one starts I/O, the CPU runs another that is ready, so the I/O time overlaps with computing. Waiting is what happens without multiprogramming."
  },
  {
    "q": "Job X needs 6 units of CPU and 4 units of I/O; job Y needs 3 units of CPU and 7 units of I/O. Run without multiprogramming, what is the CPU utilization (as a fraction)?",
    "type": "numeric",
    "answer": 0.45,
    "tolerance": 0.001,
    "explain": "CPU time = 6 + 3 = 9. Real time = 9 + 4 + 7 = 20. Utilization = 9 / 20 = 0.45. The order of the bursts does not matter when nothing overlaps."
  },
  {
    "q": "Jobs in the order X, Y: X = CPU 1, I/O 3, CPU 2; Y = CPU 2, I/O 2, CPU 1. With multiprogramming (first ready job in the order X, Y), what is the CPU utilization (as a fraction)?",
    "type": "numeric",
    "answer": 0.857,
    "tolerance": 0.001,
    "explain": "Slots: 0 X (X then in I/O 1–3); 1–2 Y (Y then in I/O 3–4); 3 idle (both in I/O); 4–5 X, back ahead of Y, X done; 6 Y. Busy 6 of 7 units: 6 / 7 = 0.857."
  },
  {
    "q": "A job needs 30 minutes of CPU time and has 75 % I/O wait. Running alone, how long does it take (minutes)?",
    "type": "numeric",
    "answer": 120,
    "tolerance": 0,
    "explain": "The CPU is busy 1 − 0.75 = 25 % of the time, so T = 30 ÷ 0.25 = 120 minutes. Check: 30 + 0.75 × 120 = 30 + 90 = 120."
  },
  {
    "q": "Two jobs, each needing 10 minutes of CPU time, run in parallel with 80 % I/O wait. When does the last one finish (minutes)?",
    "type": "numeric",
    "answer": 55.56,
    "tolerance": 0.05,
    "explain": "Utilization = 1 − 0.8² = 1 − 0.64 = 0.36. Total CPU work = 2 × 10 = 20 minutes. T = 20 ÷ 0.36 ≈ 55.56 minutes. Sequentially it would be 2 × (10 ÷ 0.2) = 100 minutes."
  },
  {
    "q": "For k jobs running in parallel, each with I/O wait fraction p, which expression gives the CPU utilization?",
    "options": ["1 − pᵏ", "pᵏ", "1 − p", "k(1 − p)"],
    "answer": 0,
    "explain": "The CPU is idle only when all k jobs are waiting at once, probability pᵏ, so utilization is 1 − pᵏ (slide 43 with n = k). 1 − p is one job alone; pᵏ is the waste."
  },
  {
    "q": "In a multiprogrammed job timeline, the CPU is idle in a time unit only when every unfinished job is doing I/O.",
    "type": "tf",
    "answer": true,
    "explain": "If any unfinished job were ready, the CPU would take it. In the practice paper's chart the only idle unit is 15, when A and B are done and C is in its I/O."
  }
]
```

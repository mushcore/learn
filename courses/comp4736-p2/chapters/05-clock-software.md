---
title: "The clock driver's duties: time of day, quantum, accounting"
minutes: 15
---

The clock hardware only interrupts at known intervals. The clock driver is the software that turns those ticks into the time of day, a limit on how long each process runs, and a record of the CPU time each one used.

## The six duties of a clock driver

Slide 33: *Typical duties of a clock driver:*

1. *Maintaining the time of day.*
2. *Preventing processes from running longer than allowed.*
3. *Accounting for CPU usage.*
4. *Handling alarm system call from user processes.*
5. *Providing watchdog timers for parts of system itself.*
6. *Profiling, monitoring, statistics gathering.*

Slides 34 to 37 take duties 1 to 3, in this lesson. Slides 38 to 40 take duties 4 and 5 ([alarms and watchdogs](#/comp4736-p2/alarms-and-watchdogs)). Duty 6 has no slide of its own.

## Time of day in ticks

Slide 34 counts every tick since a fixed moment in one counter. The instructor's arithmetic for a 60 Hz clock:

- *Clock rate f = 60 Hz and a 32-bit counter*
- *T = 1/f = 1/60 ≈ 0.0167 second*
- *The largest unsigned 32-bit binary number = 2³² − 1 = 4294967295*
- *Total time = 4294967295 × 0.0167 = 71725953.8265 seconds = 2.274 years*
- *Will overflow in just over 2 years.*

Seconds become years by dividing by 365 × 86400 = 31536000 seconds per year. The slide rounds 1/60 to 0.0167 s; the exact 4294967295 ÷ 60 = 71582788 s is 2.27 years, still just over 2 years.

A wider counter fixes the overflow: *Total time = (2⁶⁴ − 1) × 0.0167 = 9768538369.8297023773 years*, about ten billion years. The slide names the price: *Makes maintaining the counter more expensive since it has to be done many times a second.*

## Time of day in seconds

Slide 35: *The time of day is maintained in seconds, rather than in ticks.* A second, smaller counter holds the *Number of ticks in current second*. At 60 Hz, *1 second = 60 ticks*, so that counter runs 0 to 59, and each time it wraps the seconds counter goes up by 1.

- *Total time = 4294967295 × 1 = 4294967295 seconds ≈ 136 years*
- *Will work until the twenty-second century.*

4294967295 ÷ 31536000 = 136.2 years. The clock rate drops out of this answer: the 32-bit counter counts seconds, however many ticks make up a second.

## Counting ticks from boot

Slide 36: *Count in ticks, but to do that relative to the time the system was booted, rather than relative to a fixed external moment.* The rule for reading the clock is *Current time = the stored time of day in the memory + counter*. The boot time is stored once, in seconds, so the tick counter only has to cover the time since boot.

The three slide figures side by side:

| Slide | Method | What is stored | Overflow (60 Hz) |
|---|---|---|---|
| 34 | Time of day in ticks | one tick counter, drawn 64 bits wide | 2.274 years at 32 bits |
| 35 | Time of day in seconds | a 32-bit seconds counter + the number of ticks in the current second | 136 years |
| 36 | Ticks since boot | a 32-bit counter in ticks + the system boot time in seconds | the counter covers only the time since boot |

## The quantum counter in clock ticks

Duty 2 on slide 37: *Whenever a process is started, the scheduler initializes a counter to the value of that process' quantum in clock ticks. At every clock interrupt, the clock driver decrements the quantum counter by 1. When it gets to zero, the clock driver calls the scheduler to set up another process.*

A quantum given in seconds becomes ticks by dividing by the tick period, which is the same as multiplying by the clock rate:

$$\text{ticks} = \dfrac{\text{quantum}}{T} = \text{quantum} \times f$$

This counter is software. In [the clock hardware lesson](#/comp4736-p2/clock-hardware) the holding register counted crystal pulses; here the driver counts whole clock ticks.

## Timing a process for CPU accounting

Duty 3 on slide 37: *Start a second timer, distinct from the main system timer, whenever a process is started up. When that process is stopped, the timer can be read out to tell how long the process has run. To do things right, the second timer should be saved when an interrupt occurs and restored afterward.* Without the save and restore, the time spent handling an interrupt would be charged to whichever process it interrupted.

## Overflow three new tick counters

Each clock below keeps a 32-bit tick counter, as on slide 34. Use 365-day years and the exact period 1/f.

```quiz
[
  {
    "q": "A 100 Hz clock keeps the time of day in a 32-bit tick counter. After how many years does it overflow?",
    "type": "numeric",
    "answer": 1.3619,
    "tolerance": 0.01,
    "unit": "years",
    "explain": "$T = 1/100$ = 0.01 s. Total time = 4294967295 × 0.01 = 42949672.95 s. Divide by 31536000 s per year: **1.36 years**. A faster clock overflows sooner."
  },
  {
    "q": "A 1000 Hz clock keeps the time of day in a 32-bit tick counter. After how many days does it overflow?",
    "type": "numeric",
    "answer": 49.71,
    "tolerance": 0.1,
    "unit": "days",
    "explain": "$T = 1/1000$ = 0.001 s. Total time = 4294967295 × 0.001 = 4294967.295 s. Divide by 86400 s per day: **49.7 days**."
  },
  {
    "q": "A 100 Hz clock keeps the time of day in seconds plus the number of ticks in the current second. What is the largest value the ticks-in-current-second counter reaches?",
    "type": "numeric",
    "answer": 99,
    "tolerance": 0,
    "explain": "At 100 Hz, 1 second = 100 ticks, so the counter runs 0 to **99**; the next tick resets it to 0 and adds 1 to the seconds counter."
  },
  {
    "q": "On a 60 Hz clock the scheduler gives a process a quantum of 20 clock ticks. How long does the process run before the clock driver calls the scheduler?",
    "type": "numeric",
    "answer": 0.3333,
    "tolerance": 0.002,
    "unit": "s",
    "explain": "quantum = ticks × T = 20 × (1/60) s = **0.333 s**. With the slide's rounded 0.0167 s the product is 0.334 s, also accepted."
  }
]
```

```quiz
[
  {
    "q": "A 50 Hz clock keeps the time of day in a 32-bit tick counter. After how many years does it overflow?",
    "type": "numeric",
    "answer": 2.7239,
    "tolerance": 0.01,
    "unit": "years",
    "explain": "$T = 1/50$ = 0.02 s. Total time = 4294967295 × 0.02 = 85899345.9 s. Divide by 31536000 s per year: **2.72 years**."
  },
  {
    "q": "A 50 Hz clock and a 200 ms quantum: to what value does the scheduler initialize the quantum counter?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0,
    "unit": "ticks",
    "explain": "ticks = quantum × f = 0.2 s × 50 Hz = **10 ticks**. The clock driver decrements the counter by 1 at each of the 10 interrupts."
  },
  {
    "q": "Which duty of the clock driver does the quantum counter serve?",
    "options": [
      "Preventing processes from running longer than allowed",
      "Accounting for CPU usage",
      "Maintaining the time of day",
      "Providing watchdog timers for parts of system itself"
    ],
    "answer": 0,
    "explain": "Duty 2. The scheduler loads the quantum in clock ticks, the driver decrements it each interrupt, and at zero *calls the scheduler to set up another process*. CPU accounting uses a separate second timer."
  },
  {
    "q": "With a 32-bit counter, keeping the time of day in seconds overflows sooner than keeping it in ticks.",
    "type": "tf",
    "answer": false,
    "explain": "The reverse. A tick comes many times a second, so at 60 Hz the tick counter lasts 2.274 years while the seconds counter lasts 4294967295 s ≈ 136 years."
  },
  {
    "q": "Put the six duties of a clock driver in the slide's order.",
    "type": "reorder",
    "lines": [
      "Maintaining the time of day",
      "Preventing processes from running longer than allowed",
      "Accounting for CPU usage",
      "Handling alarm system call from user processes",
      "Providing watchdog timers for parts of system itself",
      "Profiling, monitoring, statistics gathering"
    ],
    "explain": "Slide 33's list. Slides 34 to 40 explain the first five in this order; profiling has no slide of its own."
  },
  {
    "q": "When the system counts ticks relative to boot time, how is the current time found?",
    "options": [
      "The stored time of day in the memory + counter",
      "The counter × the clock rate",
      "The stored boot time − counter",
      "The counter ÷ 60"
    ],
    "answer": 0,
    "explain": "Slide 36: *Current time = the stored time of day in the memory + counter*. The boot time is stored in seconds and the 32-bit counter adds the ticks since boot."
  },
  {
    "q": "The timer used for CPU accounting is the main system timer, read when the process stops.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 37: *Start a second timer, distinct from the main system timer, whenever a process is started up.* It is *saved when an interrupt occurs and restored afterward*."
  },
  {
    "q": "A 64-bit tick counter makes maintaining the counter cheaper than a 32-bit one.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 34: it *makes maintaining the counter more expensive since it has to be done many times a second*. The gain is the overflow, pushed out to about ten billion years."
  },
  {
    "q": "When the quantum counter gets to zero, the clock driver calls the ___ to set up another process.",
    "type": "text",
    "answer": ["scheduler", "the scheduler"],
    "explain": "Slide 37: *When it gets to zero, the clock driver calls the scheduler to set up another process.*"
  }
]
```

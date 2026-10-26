---
title: "Multithreading, multicore, multiprocessors and multicomputers"
minutes: 12
---

A pipeline overlaps the stages of instructions inside one processor. The other two improvements on slide 33 add hardware instead: a CPU that holds more than one thread, a chip with several cores, and a machine with several CPUs.

## Multithreading: one CPU holds the state of two threads

Slide 43's first bullet, under the heading *Multithreading and Multicore Chips*:

*Allows the CPU to hold the state of two different threads and then switch back and forth on a nanosecond time scale e.g. SPARC, the Power5, the Intel Xeon, and the Intel Core family.*

The bullet does not name the technique; the heading does. A thread's state is what it needs to resume: its program counter, its registers. Because the CPU keeps two copies on the chip, switching from one thread to the other costs nanoseconds instead of a save and a reload through memory. "Switch back and forth" also tells you that one thread runs at any instant: multithreading hides waiting, it does not double the work done. Intel sells this as hyper-threading, a name that is not on the slide.

Threads themselves are Part 4 of the course.

## Multicore: several complete processors on one chip

The second bullet: *Multicore chips , CPU chips now have four, eight, or more complete processors or cores on them e.g. Intel Xeon Phi and the Tilera TilePro, more than 60 cores on a single chip.*

Each core is a complete processor with its own pipeline, so the cores really do run at the same time. The `lscpu` output from Lab 1 shows both ideas on the course's cloud machine: `Core(s) per socket: 16` and `Thread(s) per core: 1`, so 16 cores and no multithreading on any of them.

## Shared or separate L2 caches

Slide 44 draws two quad-core chips:

| Heading | Caption | Caches |
|---|---|---|
| *Intel multicore chips* | *(a) A quad-core chip with a shared L2 cache.* | each core has its own L1; one L2 in the middle serves all four |
| *AMD* | *(b) A quad-core chip with separate L2 caches.* | each core has its own L1 and its own L2 |

In both designs L1 belongs to one core. A shared L2 lets one busy core use more of it; separate L2s keep the cores from competing for it. The same split shows in Lab 1's `lscpu`: `L1d: 512 KiB (16 instances)` is one 32 KiB L1 per core, while `L3: 64 MiB (2 instances)` is shared by groups of cores. Cache lines and sets are in [Cache lines, sets, direct mapping and replacement](#/comp4736-p1/cache-mapping).

## Multiprocessors share memory; multicomputers have local memories

Slide 45 is headed *Processor-Level Parallelism* twice, once for *Multiprocessors* and once for *Multi-computers*, over one figure:

| Figure 2-8 | What is drawn |
|---|---|
| *(a) A single-bus multiprocessor.* | four CPUs and one *Shared memory* on one *Bus* |
| *(b) A multicomputer with local memories.* | four CPUs, each wired to its own box labelled *Local memories*, plus a *Shared memory* box on the same *Bus* |

In (a) every CPU's reads and writes cross the one bus to the one memory, so the CPUs compete for the bus. In (b) each CPU keeps its own program and data in its local memory and uses the bus only for what it must share. Tanenbaum's Modern Operating Systems uses "multicomputer" for CPUs that share no memory at all and talk over a network [from memory of the textbook, unverified]; the slide's figure still draws a shared memory on the bus.

## Where the parallelism sits

Slide 33 lists three improvements; with slides 41 to 45 they sort into six techniques:

| Technique | Where the parallelism is | Slide example |
|---|---|---|
| Pipelining | the stages of successive instructions, one CPU | five-stage pipeline (34) |
| Superscalar | several execute units in one CPU | five functional units (41) |
| Multithreading | two threads' state in one CPU, switched in nanoseconds | SPARC, Power5, Intel Xeon, Intel Core (43) |
| Multicore | several complete cores on one chip | Intel Xeon Phi, Tilera TilePro (43) |
| Multiprocessor | several CPUs, one shared memory on one bus | figure 2-8 (a) (45) |
| Multicomputer | several CPUs, each with local memory | figure 2-8 (b) (45) |

The first two are instruction-level parallelism, the middle two live on the chip, and the last two are processor-level parallelism.

```quiz
[
  {
    "q": "Multithreading allows the CPU to hold the state of two different threads and switch back and forth on a millisecond time scale.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 43 says a *nanosecond* time scale. Both threads' state stays on the chip, so a switch needs no save and reload through memory."
  },
  {
    "q": "On slide 44, which quad-core chip has a single L2 cache shared by all four cores?",
    "options": ["Intel", "AMD", "Tilera TilePro", "SPARC"],
    "answer": 0,
    "explain": "Slide 44 heads the shared-L2 chip *Intel multicore chips* and the separate-L2 chip *AMD*. Tilera TilePro is the slide-43 example of more than 60 cores; SPARC is a multithreading example."
  },
  {
    "q": "In both quad-core designs on slide 44, every core has its own L1 cache.",
    "type": "tf",
    "answer": true,
    "explain": "The two chips differ only at L2: one shared L2 (Intel) or one L2 per core (AMD). L1 is per core in both."
  },
  {
    "q": "Which chip does slide 43 give as an example of more than 60 cores on a single chip?",
    "options": ["Tilera TilePro", "Power5", "Intel Core", "SPARC"],
    "answer": 0,
    "explain": "Multicore examples: Intel Xeon Phi and the Tilera TilePro, more than 60 cores. SPARC, Power5, Intel Xeon and Intel Core are the slide's multithreading examples."
  },
  {
    "q": "In a single-bus multiprocessor, each CPU has its own local memory.",
    "type": "tf",
    "answer": false,
    "explain": "Figure 2-8 (a): four CPUs and one shared memory on one bus. Local memories are the multicomputer of figure 2-8 (b)."
  },
  {
    "q": "Slide 45 classes multiprocessors and multicomputers as which kind of parallelism?",
    "options": ["Processor-level", "Instruction-level", "Pipelining", "Superscalar"],
    "answer": 0,
    "explain": "Both are headed *Processor-Level Parallelism*. Instruction-level parallelism is pipelining (slide 33), and a superscalar CPU extends it with extra execute units."
  },
  {
    "q": "CPU chips with four, eight or more complete processors on them are called ______ chips.",
    "type": "text",
    "answer": ["multicore", "multi-core", "multicore chips"],
    "explain": "Slide 43: *Multicore chips*; each complete processor on the chip is a core."
  },
  {
    "q": "Match each technique to what it adds.",
    "type": "match",
    "pairs": [
      ["Pipelining", "overlaps the stages of successive instructions"],
      ["Multithreading", "keeps two threads' state in one CPU"],
      ["Multicore", "puts several complete processors on one chip"],
      ["Multiprocessor", "several CPUs share one memory over one bus"],
      ["Multicomputer", "each CPU has its own local memory"]
    ],
    "explain": "Pipelining is instruction-level (slide 34). Multithreading and multicore are slide 43. The single-bus multiprocessor and the multicomputer with local memories are figure 2-8 on slide 45."
  }
]
```

---
title: A thread is a flow of execution with its own PC, registers and stack
minutes: 12
---

A process in Part 3 had one flow of control: one program counter stepping through its code. This lesson names the thing that steps and gives the four reasons to want several of them in one process.

## A thread is a flow of execution, also called a lightweight process

Slide 1 defines it:

> *A thread is a flow of execution through the process code, with its own program counter, system registers and stack.*

> *A thread is also called a lightweight process. Threads provide a way to improve application performance through parallelism.*

Three things belong to the thread alone:

| The thread's own | Why it cannot be shared |
|---|---|
| program counter | each thread is at a different instruction of the same code |
| registers | each thread is in the middle of its own calculation |
| stack | each thread has its own chain of procedure calls in progress |

Everything else, the code itself, the global variables and the open files, belongs to the process and every thread in it uses the same copy. That split is [the next chapter's table](#/comp4736-p4/classical-thread-model).

The definition is the instructor's wording. Tanenbaum reaches the same idea from the other side on slide 12: a process groups resources, and the thread is the part of it that executes.

"Lightweight" is the point of motivation 2 below: a thread brings only those three items with it, so it is cheap to make.

## Four reasons to have threads

Slide 2, *Motivation for Threads*:

1. *The main reason for having threads is that in many applications, multiple activities are going on at once. Some of these may block from time to time. By decomposing such an application into multiple sequential threads that run in quasi-parallel, the programming model becomes simpler.*
2. *Since they are lighter weight than processes, they are easier and faster to create and destroy than processes. Creating a thread goes 10–100 times faster than creating a process.*
3. *Threads yield no performance gain when all of them are CPU bound, but when there is substantial computing and also substantial I/O, having threads allows these activities to overlap, thus speeding up the application.*
4. *Threads are useful on systems with multiple CPUs, where real parallelism is possible.*

## Simpler programs, cheaper creation

Motivation 1 is about the programmer. Each activity is written as an ordinary sequential loop that may block. The slide's *quasi-parallel* means the threads only appear to run at once: on one CPU they take turns, as processes do. The word processor in [the next lesson](#/comp4736-p4/thread-usage) is the slide's example.

Motivation 2 is a ratio. If creating a process takes 1 ms, creating a thread takes between 1/100 and 1/10 of that, 0.01 to 0.1 ms. Thread creation is cheap because the thread brings only its PC, registers and stack, and shares the rest.

## Speed comes from overlap, or from more CPUs

Motivation 3 has a condition in it. If every thread only computes, there is nothing to overlap: on one CPU the threads take turns doing the same work, and the program finishes no sooner. The gain comes when one thread waits for I/O, such as a disk read, while another uses the CPU.

Motivation 4 is the other source of speed. With several CPUs, threads of one process can run at the same instant, which is *real parallelism*, not the quasi-parallel turn-taking of motivation 1.

```quiz
[
  {
    "q": "Complete slide 1's definition.",
    "type": "fill",
    "code": "A thread is a flow of execution through the process code,\nwith its own ___ ___, system ___ and ___.",
    "answer": ["program", "counter", "registers", "stack"],
    "explain": "*A thread is a flow of execution through the process code, with its own program counter, system registers and stack.* These are the items each thread keeps for itself."
  },
  {
    "q": "A thread is also called a _______ process.",
    "type": "text",
    "answer": ["lightweight", "light-weight", "light weight"],
    "explain": "Slide 1: *A thread is also called a lightweight process.* It is light because it carries only its own PC, registers and stack and shares everything else with its process."
  },
  {
    "q": "Threads give a performance gain even when all of them are CPU bound.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 2: threads yield *no performance gain when all of them are CPU bound*. The gain comes when there is substantial computing and also substantial I/O, so the two can overlap."
  },
  {
    "q": "According to slide 2, creating a thread is how much faster than creating a process?",
    "options": ["10–100 times faster", "2–10 times faster", "100–1000 times faster", "about the same"],
    "answer": 0,
    "explain": "*Creating a thread goes 10–100 times faster than creating a process*, because threads are lighter weight than processes."
  },
  {
    "q": "Creating a process takes 2 ms on some system. Using slide 2's range, what is the longest that creating a thread should take, in ms?",
    "type": "numeric",
    "answer": 0.2,
    "tolerance": 0.001,
    "unit": "ms",
    "explain": "Thread creation is 10 to 100 times faster. The slowest case is 10 times faster: 2 ms / 10 = 0.2 ms. The fastest is 2 ms / 100 = 0.02 ms."
  },
  {
    "q": "Threads are useful on systems with multiple CPUs because there real parallelism is possible.",
    "type": "tf",
    "answer": true,
    "explain": "Motivation 4 on slide 2. On one CPU threads run in quasi-parallel, taking turns; with several CPUs they can run at the same instant."
  },
  {
    "q": "Why does decomposing an application into threads make the programming model simpler?",
    "options": [
      "Each of several activities that may block is written as its own sequential thread, run in quasi-parallel",
      "Threads have no protection between them, so no locks are needed",
      "Each thread gets its own address space, so activities cannot interfere",
      "The kernel schedules threads round-robin within the process"
    ],
    "answer": 0,
    "explain": "Motivation 1: many applications have *multiple activities going on at once*, some of which block; splitting them into *multiple sequential threads that run in quasi-parallel* keeps each one a simple loop. Threads share one address space, so they can interfere."
  },
  {
    "q": "Which of these is NOT one of the thread's own items in slide 1's definition?",
    "options": ["Global variables", "Program counter", "System registers", "Stack"],
    "answer": 0,
    "explain": "The definition lists program counter, system registers and stack. Global variables belong to the process and are shared by all its threads."
  }
]
```

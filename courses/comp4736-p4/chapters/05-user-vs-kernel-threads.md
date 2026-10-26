---
title: Threads in user space, threads in the kernel
minutes: 17
---

A threads package can live entirely inside the process, or the kernel can manage every thread itself. Where it lives decides what happens when one thread blocks, and how much each thread operation costs.

## Threads in user space

Slide 24 names three ways to implement threads: in user space, in the kernel, and hybrid ([the next lesson](#/comp4736-p4/hybrid-models)). Slide 25 on the first: *The threads package is put entirely in user space. The kernel knows nothing about them. As far as the kernel is concerned, it is managing ordinary, single-threaded processes.*

Such a package *can be implemented on an operating system that does not support threads*, and *threads are implemented by a library*. The threads run on top of a **run-time system**, *a collection of procedures that manage threads*, such as `pthread_create`, `pthread_exit`, `pthread_join` and `pthread_yield`.

## The thread table and where the tables live

Slide 26: *each process needs its own private thread table to keep track of the threads in that process.* It is like the kernel's process table, but it holds only the per-thread properties: program counter, stack pointer, registers, state. *The thread table is managed by the run-time system.*

The two figures place the tables differently:

| | A user-level threads package (slide 28) | A threads package managed by the kernel (slide 33) |
|---|---|---|
| Inside each process | the threads, a run-time system, a thread table | the threads only |
| In the kernel | the process table | the process table and a thread table |

## Three advantages of user-level threads

The run-time system switches threads with procedure calls inside the process, so slide 26 lists three advantages:

1. *No trap is needed, no context switch is needed, the memory cache need not be flushed, and so on. This makes thread scheduling very fast.*
2. *They allow each process to have its own customized scheduling algorithm.*
3. *They also scale better, since kernel threads invariably require some table space and stack space in the kernel, which can be a problem if there are a very large number of threads.*

:::quiz The practice paper's key says the opposite
The practice paper's key marks thread switching as the action that costs more overhead with user-level threads than with kernel-level threads. On the exam, answer as the key does, and know the slide's reason for the reverse: no trap and no context switch.
:::

## The two problems of user-level packages

Slide 27: *Despite their better performance, user-level threads packages have some major problems.*

- **Blocking system calls.** *Suppose that a thread reads from the keyboard before any keys have been hit. Letting the thread actually make the system call is unacceptable, since this will stop all the threads.* The kernel sees one single-threaded process, so it blocks the whole process.
- **No clock interrupts.** Once a thread starts running, no other thread in that process runs unless the first one *voluntarily gives up the CPU*. *Within a single process, there are no clock interrupts, making it impossible to schedule processes round-robin fashion (taking turns). Unless a thread enters the run-time system of its own free will, the scheduler will never get a chance.*

## Threads in the kernel

Slide 29 removes the run-time system and the thread table from each process. *The kernel has a thread table that keeps track of all the threads in the system.* The information is the same as with user-level threads, now kept in the kernel. *The kernel also maintains the traditional process table to keep track of processes.*

## When a kernel thread blocks

Slide 30: *When a thread blocks, the kernel, at its option, can run either another thread from the same process (if one is ready) or a thread from a different process.* With user-level threads, by contrast, *the run-time system keeps running threads from its own process until the kernel takes the CPU away from it (or there are no ready threads left to run).*

Slide 31 adds two advantages and the price:

- *Kernel threads do not require any new, nonblocking system calls.*
- On a **page fault**, *the kernel can easily check to see if the process has any other runnable threads, and if so, run one of them while waiting for the required page to be brought in from the disk.*
- *Their main disadvantage is that the cost of a system call is substantial.* Every thread operation is a system call, so frequent creation and termination cost much more.

### One blocking call under each model

Press the blocking-call button under user-level, then under kernel-level: watch which threads stop.

```widget
thread-models
{ "model": "user" }
```

## The slide-32 comparison table

Slide 32, **Difference between User-Level & Kernel-Level Thread**:

| S.N. | User-Level Threads | Kernel-Level Thread |
|---|---|---|
| 1 | *User-level threads are faster to create and manage.* | *Kernel-level threads are slower to create and manage.* |
| 2 | *Implementation is by a thread library at the user level.* | *Operating system supports creation of Kernel threads.* |
| 3 | *User-level thread is generic and can run on any operating system.* | *Kernel-level thread is specific to the operating system.* |
| 4 | *Multi-threaded applications cannot take advantage of multiprocessing.* | *Kernel routines themselves can be multithreaded.* |

Row 4 follows from slide 25: the kernel sees one single-threaded process, so it never runs two of its threads on two CPUs at once.

## Pick the package that suffers in six programs

For each new program, decide which implementation has the problem.

```quiz
[
  {
    "q": "A chat client's network thread calls `read` on a socket that has no data waiting. Under which implementation do the client's other threads stop as well?",
    "options": ["User-level threads", "Kernel-level threads", "Both", "Neither"],
    "answer": 0,
    "explain": "With user-level threads the kernel sees one single-threaded process. The blocking `read` blocks that process, which *will stop all the threads* (slide 27). With kernel threads the kernel can run another thread of the same process (slide 30)."
  },
  {
    "q": "Under user-level threads, a simulation thread runs a long loop and never calls into the run-time system. What happens to the other threads of its process?",
    "options": [
      "They do not run until it gives up the CPU",
      "A clock interrupt lets the run-time system switch to one of them",
      "The kernel schedules them round-robin with the looping thread",
      "They run in parallel on another CPU"
    ],
    "answer": 0,
    "explain": "*Within a single process, there are no clock interrupts*, so round-robin is impossible. *Unless a thread enters the run-time system of its own free will, the scheduler will never get a chance* (slide 27). The kernel does not know the other threads exist, so it cannot schedule them or put them on another CPU."
  },
  {
    "q": "A server creates and destroys one thread for each of 50,000 short requests per second. Which implementation pays more overhead for those thread operations?",
    "options": ["Kernel-level threads", "User-level threads", "Neither: thread creation is free"],
    "answer": 0,
    "explain": "Every kernel-thread operation is a system call, and *the cost of a system call is substantial* (slide 31). The slide-32 table agrees: kernel-level threads *are slower to create and manage*."
  },
  {
    "q": "A program needs 100,000 threads. Which implementation does slide 26 say scales better, and why?",
    "options": [
      "User-level, because kernel threads require table space and stack space in the kernel",
      "Kernel-level, because the kernel's thread table tracks all the threads in the system",
      "User-level, because user-level threads can use several CPUs",
      "Kernel-level, because no run-time system is needed in each process"
    ],
    "answer": 0,
    "explain": "*They also scale better, since kernel threads invariably require some table space and stack space in the kernel, which can be a problem if there are a very large number of threads.* User-level threads cannot use several CPUs at once (slide 32, row 4)."
  },
  {
    "q": "A thread touches a page that is not in memory. Under kernel threads, what can the kernel do while the page is brought in from the disk?",
    "options": [
      "Run another runnable thread of the same process",
      "Nothing: the whole process must wait",
      "Ask the run-time system to pick a thread",
      "Flush the memory cache and retry"
    ],
    "answer": 0,
    "explain": "Slide 31: *the kernel can easily check to see if the process has any other runnable threads, and if so, run one of them while waiting for the required page to be brought in from the disk.* There is no run-time system in a kernel-threads process."
  },
  {
    "q": "A small embedded operating system has no thread support at all. Which implementation can a program on it still use?",
    "options": ["User-level threads", "Kernel-level threads", "Neither"],
    "answer": 0,
    "explain": "A user-level package *can be implemented on an operating system that does not support threads*; *threads are implemented by a library* (slide 25). Kernel threads need the operating system to support their creation (slide 32, row 2)."
  }
]
```

```quiz
[
  {
    "q": "With user-level threads, the kernel keeps track of every thread and schedules each one.",
    "type": "tf",
    "answer": false,
    "explain": "*The kernel knows nothing about them. As far as the kernel is concerned, it is managing ordinary, single-threaded processes* (slide 25). The run-time system in each process schedules the threads."
  },
  {
    "q": "Where is the thread table kept in a user-level threads package?",
    "options": [
      "In each process, managed by the run-time system",
      "In the kernel, next to the process table",
      "In the kernel, one table for all the threads in the system",
      "There is no thread table"
    ],
    "answer": 0,
    "explain": "Slide 26: *each process needs its own private thread table*, and *the thread table is managed by the run-time system.* One table in the kernel for all the threads in the system is the kernel-threads design (slide 29)."
  },
  {
    "q": "Switching between user-level threads needs no trap and no context switch, which makes thread scheduling very fast.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 26: *No trap is needed, no context switch is needed, the memory cache need not be flushed, and so on. This makes thread scheduling very fast.*"
  },
  {
    "q": "On the practice paper's answer key, which action usually costs more overhead with user-level threads than with kernel-level threads?",
    "options": ["Thread switching", "Thread termination", "Thread creation"],
    "answer": 0,
    "explain": "The key says thread switching. The slides say the reverse: user-level switching needs no trap and no context switch (slide 26), and user-level threads *are faster to create and manage* (slide 32). Answer as the key does on the exam; know the slide's reason."
  },
  {
    "q": "Fill in the two problems of user-level threads packages (slide 27).",
    "type": "fill",
    "code": "Problem 1: ___ system calls: one thread's call will stop all the threads\nProblem 2: no ___ interrupts within a single process: a thread runs until it voluntarily gives up the CPU",
    "answer": ["blocking", "clock"],
    "explain": "Blocking system calls (a keyboard read before any key is hit *will stop all the threads*) and no clock interrupts (*unless a thread enters the run-time system of its own free will, the scheduler will never get a chance*)."
  },
  {
    "q": "A kernel-level thread blocks on a disk read. What may the kernel do next?",
    "options": [
      "Run another thread from the same process or a thread from a different process",
      "Block every thread in the same process",
      "Only run a thread from a different process",
      "Wait for the run-time system to yield the CPU"
    ],
    "answer": 0,
    "explain": "Slide 30: *the kernel, at its option, can run either another thread from the same process (if one is ready) or a thread from a different process.* Blocking every thread of the process is the user-level problem."
  },
  {
    "q": "Kernel threads require new, nonblocking system calls.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 31: *Kernel threads do not require any new, nonblocking system calls.* The kernel can block one thread and run another."
  },
  {
    "q": "Name the collection of procedures that manages user-level threads inside each process.",
    "type": "text",
    "answer": ["run-time system", "runtime system", "run time system"],
    "explain": "The **run-time system**, *a collection of procedures that manage threads*, such as `pthread_create`, `pthread_exit`, `pthread_join` and `pthread_yield` (slide 25). It also manages the thread table."
  },
  {
    "q": "Which statements from the slide-32 table describe kernel-level threads? Select all.",
    "options": [
      "Slower to create and manage",
      "Specific to the operating system",
      "Kernel routines themselves can be multithreaded",
      "Generic and can run on any operating system",
      "Implementation is by a thread library at the user level"
    ],
    "answer": [0, 1, 2],
    "explain": "Kernel-level: slower to create and manage, the operating system supports their creation, specific to the operating system, kernel routines can be multithreaded. Generic and library-implemented are the user-level column."
  },
  {
    "q": "According to slide 31, what is the main disadvantage of kernel threads?",
    "options": [
      "The cost of a system call is substantial",
      "One blocking system call stops all the threads",
      "There are no clock interrupts within a process",
      "They cannot run on an operating system without thread support"
    ],
    "answer": 0,
    "explain": "*Their main disadvantage is that the cost of a system call is substantial*: every thread operation is a system call. The blocking call and the missing clock interrupts are the user-level problems (slide 27)."
  }
]
```

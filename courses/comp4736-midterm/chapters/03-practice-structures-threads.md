---
title: Practice Part 1, OS structures, clocks and threads
minutes: 14
---
Ten of the 74 practice questions test lecture Parts 2 and 4: seven on OS structures and clocks, three on threads. They are here verbatim with the instructor's key, grouped by the slide fact each one tests. One key (Q7) disagrees with the slides; it is flagged where it appears.

## A microkernel keeps drivers in user space; a layer uses only the layer below

Four structure questions, and two of them are the same sentence (Q26 and Q29). The slide facts behind them:

- Microkernel, slide 15: *A microkernel OS minimizes the core kernel's responsibilities, running essential services (like inter-process communication and basic scheduling) within the kernel, while other services (like drivers and file systems) run in user space.* The MINIX 3 figure on slide 14 draws Disk, TTY, Netw and Print as user-mode processes above the microkernel.
- Layered, slide 11: *A layered system OS organizes functions into hierarchical layers, where each layer relies only on the one below it.* Its listed disadvantage is *overhead due to strict layer interactions*.
- Hypervisors, slide 24: a type 1 hypervisor sits on the bare hardware (ESXi, slide 25: *No need for an operating system*); a type 2 hypervisor runs on a *Host operating system* (VirtualBox on Windows 10, slide 26). The slide shows the cost only through the figure: every guest request passes through the host OS as well as the hypervisor.

```quiz
[
  {
    "q": "**Q26.** In a microkernel-based operating system, device drivers are part of the kernel.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 15: drivers and file systems *run in user space*; only essential services such as inter-process communication and basic scheduling stay in the kernel. In the MINIX 3 figure the drivers are ordinary user-mode processes. Drivers inside the kernel describes a monolithic system. [Microkernels and client-server](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "q": "**Q29.** In a microkernel-based operating system, device drivers are part of the kernel.",
    "type": "tf",
    "answer": false,
    "explain": "The same statement as Q26, asked twice on the paper. False: in a microkernel the drivers (Disk, TTY, Netw, Print in the MINIX 3 figure) run as user-mode processes, which is why a crashed driver does not crash the system (the slide's *Stability* advantage). [Microkernels and client-server](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "q": "**Q42.** In a layered operating system, each layer can communicate directly with any other layer.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 11: *each layer relies only on the one below it*. In the THE system (slide 10) layer 4, user programs, reaches the processor only through layers 3 down to 0. That strictness is the slide's listed disadvantage, overhead from strict layer interactions. [Monolithic and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "q": "**Q43.** What is the primary disadvantage of Type 2 hypervisors?",
    "options": [
      "They are more difficult to manage and configure.",
      "They have limited hardware support.",
      "They have higher overhead due to the host operating system."
    ],
    "answer": 2,
    "explain": "A type 2 hypervisor (VirtualBox, slide 26) is a program on a host operating system (Windows 10 in the screenshot), so a guest's work passes through the host OS as well as the hypervisor. A type 1 hypervisor (ESXi) runs directly on the hardware with no OS underneath. The slides make no claim about management or hardware support for either type; the extra host layer is the difference they draw. [Virtual machines](#/comp4736-p2/virtual-machines)"
  }
]
```

## The clock hardware has three parts; the clock driver is software

Slide 29: *Clocks are built out of three components:* a **crystal oscillator** that generates a periodic signal, a **counter** that the signal makes *count down to zero* (at zero it *causes a CPU interrupt*), and a **holding register** whose value *is copied into the counter*. Slide 32 works the units: a 500-MHz crystal pulses the counter every 1 / (500 × 10⁶) s = 2 ns. To get an interrupt after a time t, load t ÷ (pulse period) into the holding register.

Slide 33 is a different object, the **clock driver**: the software whose *typical duties* are maintaining the time of day, preventing processes from running longer than allowed, CPU accounting, the alarm system call, watchdog timers, and profiling.

```quiz
[
  {
    "q": "**Q2.** A system has a clock tick of 2 nanoseconds. The operating system gives each process a time quantum of 40 milliseconds.\n\nWhat value should be loaded into the clock/timer register to generate an interrupt after one process quantum?",
    "options": ["20", "20,000,000", "20,000", "40,000,000"],
    "answer": 1,
    "explain": "The counter drops by one per 2 ns pulse and interrupts at zero, so the register holds the number of pulses in one quantum. Convert to one unit first: 40 ms = 40 × 10⁻³ s = 40 × 10⁶ ns = 40,000,000 ns. Then 40,000,000 ns ÷ 2 ns = **20,000,000** pulses. Forgetting to divide by 2 gives 40,000,000; dividing 40 by 2 without converting ms to ns gives 20. [Clock hardware](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "**Q67.** In a clock with the cycle time of 2 ns ,the frequency is equal to .",
    "options": ["2 GHz", "5GHz", "50 MHz", "200 MHZ", "0.5 GHz"],
    "answer": 4,
    "explain": "f = 1 / T = 1 / (2 × 10⁻⁹ s) = 0.5 × 10⁹ Hz = 500 MHz = **0.5 GHz**. Slide 32 runs the same pair the other way: a 500-MHz crystal pulses the counter every 2 nsec. 500 MHz is not offered, so the answer is written in GHz. [Clock hardware](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "**Q68.** The clocks drivers are built out of three components:\n1) Crystal oscillator\n2) Counter\n3) Holding register",
    "type": "tf",
    "answer": false,
    "explain": "The list is slide 29's, but slide 29 says *Clocks are built out of three components*: the hardware, a programmable clock. A clock driver is software (slide 33, its six duties), so it is not built out of an oscillator, a counter and a register. One swapped word makes the slide sentence false. [Clock hardware](#/comp4736-p2/clock-hardware) · [Clock software](#/comp4736-p2/clock-software)"
  }
]
```

## User-level threads switch without a trap, and one blocking call stops them all

Slide 26, threads managed in user space by a run-time system: *No trap is needed, no context switch is needed, the memory cache need not be flushed, and so on. This makes thread scheduling very fast.* Slide 27 gives the price: a thread that makes a blocking system call, such as a keyboard read before any key is hit, *will stop all the threads*, because the kernel sees one single-threaded process and blocks it. Slide 31 puts the overhead on the other side: for kernel threads *the cost of a system call is substantial*, and the slide 32 table says user-level threads are *faster to create and manage*.

The key to Q7 says the opposite of slides 26 and 32. It is the graded answer on the practice paper; the explanation gives the slide version as well.

```quiz
[
  {
    "q": "**Q7.** Which of these actions usually involves increased overhead in user-level threads when compared to kernel-level threads?",
    "options": ["Thread switching", "Thread termination", "Thread creation"],
    "answer": 0,
    "explain": "**The instructor's key is thread switching, and this item is graded that way.** The slides say the reverse: switching user-level threads needs *no trap*, *no context switch* and no cache flush, which *makes thread scheduling very fast* (slide 26), and the slide 32 table lists user-level threads as *faster to create and manage*. On the slides, kernel threads carry the overhead because every thread operation is a system call (slide 31). If the real midterm asks this, answer as the key does and raise it with the instructor. [User-level vs kernel-level threads](#/comp4736-p4/user-vs-kernel-threads)"
  },
  {
    "q": "**Q48.** In a system with user-level threads, if one thread blocks for I/O, what happens to the other threads?",
    "options": [
      "They are also blocked",
      "They are terminated",
      "They continue to execute in parallel",
      "They are unaffected"
    ],
    "answer": 0,
    "explain": "The kernel knows nothing about user-level threads (slide 25); it sees one process. When one thread makes a blocking system call, the kernel blocks that whole process, which *will stop all the threads* (slide 27). Nothing is terminated; the threads resume when the call returns. Carrying on unaffected is what kernel threads allow: the kernel can run another thread of the same process (slide 30). [User-level vs kernel-level threads](#/comp4736-p4/user-vs-kernel-threads)"
  },
  {
    "q": "**Q72.** In ------  the memory cache need not be flushed.",
    "options": [
      "both user and kernel level threads",
      "kernel level threads",
      "user level threads"
    ],
    "answer": 2,
    "explain": "Slide 26, on threads in user space: *No trap is needed, no context switch is needed, the memory cache need not be flushed*. The run-time system switches threads inside one process with a few procedure calls. A kernel-level switch goes through the kernel, so the claim does not hold for both. [User-level vs kernel-level threads](#/comp4736-p4/user-vs-kernel-threads)"
  }
]
```

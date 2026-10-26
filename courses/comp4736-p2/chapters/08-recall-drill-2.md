---
title: "Recall drill: Part 2 (closed book)"
minutes: 20
---
The midterm allows no notes, so every list, name and number of Part 2 has to come from memory. Answer each item before looking anything up; the tables at the end are for the re-read afterwards.

## OS structures from memory

Slides 1 to 27: the five structures taught, their parts, their examples and the virtual-machine vocabulary.

```quiz
[
  {
    "type": "text",
    "q": "Name the structure: the operating system operates as a single program in kernel mode, organized as a collection of procedures combined into a single executable.",
    "answer": ["monolithic", "monolithic system", "monolithic systems", "monolithic kernel"],
    "explain": "Slide 2, the monolithic system. Slide 5 adds that all its components *operate within a single address space and share the same privilege level*. Examples (slide 6): Linux, Microsoft Windows. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "type": "fill",
    "q": "Fill in slide 2's basic structure of a monolithic OS.",
    "code": "1 - A ___ program that invokes service procedures.\n2 - A set of ___ procedures handling system calls.\n3 - The ___ procedures that support the service procedures.",
    "answer": ["main", "service", "utility"],
    "explain": "Main program, service procedures, utility procedures. Slide 4's analogies: the main program is the boss, the service procedures are the tools in the toolbox, the utility procedures are helper tools. The slide-3 figure labels the top tier *Main procedure*. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "type": "match",
    "q": "Match each command from slide 9's kernel-module session to what it does.",
    "pairs": [
      ["insmod", "inserting a module into the Linux kernel"],
      ["dmesg", "printing the kernel ring buffer"],
      ["lsmod", "showing the status of modules in the Linux kernel"],
      ["rmmod", "removing a module from the Linux kernel"]
    ],
    "explain": "Slide 9 runs them in the order insmod, dmesg (`Hello, world`), lsmod (`mod_example 16384 0`), rmmod, dmesg again (`Goodbye, world`). The module is a loadable extension: slide 2's *shared libraries in Linux and DLLs in Windows*. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "type": "fill",
    "q": "Fill in where and by whom the THE system was built (slide 10).",
    "code": "the THE system built at the Technische Hogeschool ___ in the Netherlands\nby E. W. ___ (___) and his students",
    "answer": ["Eindhoven", "Dijkstra", "1968"],
    "explain": "Slide 10: *the THE system built at the Technische Hogeschool Eindhoven in the Netherlands by E. W. Dijkstra (1968) and his students.* It is the slide's layered-system example. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "type": "reorder",
    "q": "Order the layers of the THE operating system as slide 10's table prints them, layer 5 at the top down to layer 0.",
    "lines": [
      "The operator",
      "User programs",
      "Input/output management",
      "Operator-process communication",
      "Memory and drum management",
      "Processor allocation and multiprogramming"
    ],
    "explain": "5 the operator, 4 user programs, 3 input/output management, 2 operator-process communication, 1 memory and drum management, 0 processor allocation and multiprogramming. Each layer is *constructed upon the one below it* and *relies only on the one below it* (slides 10, 11). [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "type": "reorder",
    "q": "Order the MS-DOS layers of slide 12, top to bottom.",
    "lines": [
      "application program",
      "resident system program",
      "MS-DOS device drivers",
      "ROM BIOS device drivers"
    ],
    "explain": "Slide 12, top to bottom: application program, resident system program, MS-DOS device drivers, ROM BIOS device drivers. Unlike THE, the upper two layers also have arrows straight down to the ROM BIOS device drivers. Slide 13 prints 'a' (hex 61) both ways: `int 21` through DOS, `int 10` through the BIOS. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "type": "match",
    "q": "Match each structure to the slide's example of it.",
    "pairs": [
      ["Monolithic system", "Linux, Microsoft Windows"],
      ["Layered system", "THE (Dijkstra) and MS-DOS"],
      ["Microkernel", "MINIX 3, HelenOS, the L4 family"],
      ["Client-server model", "a client, a file server, a process server and a terminal server on a network"],
      ["Virtual machines", "VM/370 with CMS"]
    ],
    "explain": "Slides 6, 10 and 12, 16, 17 and 23. The full microkernel list on slide 16 is *Minix, HelenOS, Horizon, The L4 microkernel family, Zircon (Fuchsia OS)*. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered) · [Microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server) · [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "type": "text",
    "q": "Name the structure that splits the OS into small, well-defined modules, only one of which runs in kernel mode while the rest run as relatively powerless ordinary user processes.",
    "answer": ["microkernel", "a microkernel", "microkernels"],
    "explain": "Slide 14: the basic idea is to *achieve high reliability by splitting the operating system up into small, well-defined modules, only one of which—the microkernel—runs in kernel mode*. [Microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "type": "fill",
    "q": "Fill in slide 15: what a microkernel keeps in the kernel and what it moves out.",
    "code": "running essential services (like inter-process ___ and basic ___) within the kernel,\nwhile other services (like ___ and file systems) run in user space.",
    "answer": ["communication", "scheduling", "drivers"],
    "explain": "IPC and basic scheduling stay in the kernel; drivers and file systems run in user space. Advantages: modularity and stability. Disadvantages: performance (more communication between user-space services and the microkernel) and complexity. [Microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "type": "text",
    "q": "In the client-server model, communication between clients and servers is often by ___ passing.",
    "answer": ["message", "messages"],
    "explain": "Slide 17: *Servers provide some service. Clients use these services. Communication between clients and servers is often by message passing.* The model works *for a single machine or for a network of machines*. [Microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "type": "match",
    "q": "Match each hosting arrangement of slide 18 to its description.",
    "pairs": [
      ["Shared hosting", "a login account on a Web server, but no control over the server software"],
      ["Dedicated hosting", "your own machine, very flexible but not cost effective"],
      ["With virtualization", "each customer can have different fully controllable operating systems on the same machine"]
    ],
    "explain": "Slide 18: *Virtualization allows you to run two or more operating systems using only one machine.* Shared and dedicated hosting are the two no-virtualization options. [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "type": "text",
    "q": "In VM/370, what is the single user OS that runs on each virtual 370 called?",
    "answer": ["CMS", "Cambridge Monitor System", "Conversational Monitor System"],
    "explain": "Slide 23: *CMS is a single user OS*. CP/CMS is *Control Program/Cambridge Monitor System* on the slide; Tanenbaum's book expands CMS as Conversational Monitor System. An application's system calls trap to CMS; CMS's I/O instructions trap to VM/370 on the bare hardware. [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "type": "text",
    "q": "Slide 24 gives the hypervisor a second name in brackets. What is it?",
    "answer": ["virtual machine monitor", "VMM", "a virtual machine monitor"],
    "explain": "Slide 24: *Hypervisor (virtual machine monitor)*. Its three figures are (a) a type 1 hypervisor, (b) a pure type 2 hypervisor (a machine simulator on the host OS), (c) a practical type 2 hypervisor (with a kernel module in the host OS). [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "type": "text",
    "q": "Which type of hypervisor runs directly on system hardware, with no need for an operating system? Answer with the number.",
    "answer": ["1", "type 1", "one", "type one", "type-1"],
    "explain": "Slide 25, ESXi (Elastic Sky X Integrated): *Type-1 hypervisor*, *Runs directly on system hardware*, *No need for an operating system (OS)*. [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "type": "text",
    "q": "VirtualBox runs on a host operating system. Which type of hypervisor is it? Answer with the number.",
    "answer": ["2", "type 2", "two", "type two", "type-2"],
    "explain": "Slide 26: *Type 2 hypervisor(VirtualBox)* on *Host OS (Windows 10)*, running *Guest OS (Tiny Core Linux)*. [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "type": "match",
    "q": "Match each label from slides 25 and 26 to what it names on the slides.",
    "pairs": [
      ["Type 1 hypervisor", "ESXi"],
      ["Type 2 hypervisor", "VirtualBox"],
      ["Host OS", "Windows 10"],
      ["Guest OS", "Tiny Core Linux"]
    ],
    "explain": "ESXi is the type 1 example; VirtualBox is the type 2 example, running on the host OS Windows 10 with Tiny Core Linux as the guest. [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "type": "text",
    "q": "The agenda on slide 1 lists a sixth structure, printed in grey, that no slide covers. Name it.",
    "answer": ["exokernel", "exokernels", "exokernel systems"],
    "explain": "Slide 1: monolithic systems, layered systems, microkernels, client-server systems, virtual machines, and exokernels in grey. The deck jumps from virtual machines (slide 27) to clocks (slide 28). [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  }
]
```

## Clocks from memory

Slides 28 to 40: the hardware, the two modes, the six duties and every number the slides compute.

```quiz
[
  {
    "type": "fill",
    "q": "Clocks are built out of three components. Fill them in.",
    "code": "1) crystal ___\n2) ___\n3) ___ register",
    "answer": ["oscillator", "counter", "holding"],
    "explain": "Slide 29: the crystal oscillator generates a periodic signal (*several hundred megahertz to a few gigahertz*); the counter counts down to zero and *causes a CPU interrupt*; the holding register's value *is copied into the counter*. *All the clock hardware does is generate interrupts at known intervals.* [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "type": "fill",
    "q": "Fill in slide 31's two modes.",
    "code": "One-shot mode: when the counter gets to zero, it causes an interrupt and ___\n  until it is explicitly started again by the software.\nSquare-wave mode: after getting to zero it causes an interrupt, the value of the\n  ___ register is copied into the counter and whole process is repeated again\n  indefinitely. These periodic interrupts are called clock ___.",
    "answer": ["stops", "holding", "ticks"],
    "explain": "One-shot: one interrupt, then the clock stops until software starts it again. Square-wave: the holding register reloads the counter each time, so the interrupts repeat; they are the clock ticks. [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "type": "text",
    "q": "Which mode of a programmable clock produces clock ticks?",
    "answer": ["square-wave", "square wave", "square-wave mode", "square wave mode"],
    "explain": "Slide 31: in square-wave mode the process *is repeated again indefinitely. These periodic interrupts are called clock ticks.* One-shot mode interrupts once and stops. [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "type": "numeric",
    "q": "Slide 32: a 500-MHz crystal pulses the counter every how many nanoseconds?",
    "answer": 2,
    "tolerance": 0,
    "unit": "ns",
    "explain": "T = 1/f = 1/(500 × 10⁶) sec = 10⁹ / (500 × 10⁶) nsec = **2 nsec**. [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "type": "numeric",
    "q": "Same 500-MHz crystal with an unsigned 32-bit register: what is the longest interval between interrupts, in seconds?",
    "answer": 8.59,
    "tolerance": 0.02,
    "unit": "s",
    "explain": "(2³² − 1) × 2 nsec = 4,294,967,295 × 2 = 8,589,934,590 nsec ≈ **8.6 sec**. Slide 32: *interrupts can be programmed to occur at intervals from 2 nsec to 8.6 sec*. [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "type": "reorder",
    "q": "Put the typical duties of a clock driver in slide 33's order.",
    "lines": [
      "Maintaining the time of day.",
      "Preventing processes from running longer than allowed.",
      "Accounting for CPU usage.",
      "Handling alarm system call from user processes.",
      "Providing watchdog timers for parts of system itself.",
      "Profiling, monitoring, statistics gathering."
    ],
    "explain": "Slide 33's six duties. Slides 34 to 40 take duties 1 to 5 in this order (time of day 34–36, quantum and accounting 37, alarms 38–39, watchdog 40); duty 6 has no further slide. The clock driver is software; the clock it drives is the three-component hardware. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "type": "numeric",
    "q": "Slide 34: the time of day is a 32-bit count of ticks at 60 Hz. In how many years does it overflow?",
    "answer": 2.274,
    "tolerance": 0.01,
    "unit": "years",
    "explain": "T = 1/60 ≈ 0.0167 s. 4294967295 × 0.0167 = 71725953.8265 seconds = **2.274 years**: *Will overflow in just over 2 years.* With the exact 1/60 the total is 71,582,788 s ≈ 2.27 years; both are accepted. A 64-bit counter lasts 9768538369.8 years but *makes maintaining the counter more expensive since it has to be done many times a second*. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "type": "numeric",
    "q": "Slide 35: the time of day is kept as a 32-bit count of seconds instead. About how many years does it last?",
    "answer": 136,
    "tolerance": 0.5,
    "unit": "years",
    "explain": "4294967295 × 1 = 4294967295 seconds ÷ 31,536,000 s per year ≈ **136 years**: *Will work until the twenty-second century.* Beside it sits a count of the *Number of ticks in current second* (60 ticks per second at 60 Hz). [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "type": "fill",
    "q": "Fill in slide 36, the third way of keeping the time of day.",
    "code": "Count in ticks, but to do that relative to the time the system was ___,\nrather than relative to a fixed external moment.\nCurrent time = the stored time of day in the ___ + ___",
    "answer": ["booted", "memory", "counter"],
    "explain": "Slide 36: a 32-bit *Counter in ticks* plus the *System boot time in seconds*. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "type": "fill",
    "q": "Fill in slide 37, preventing processes from running longer than allowed.",
    "code": "Whenever a process is started, the scheduler initializes a counter to the value\nof that process' quantum in clock ___. At every clock interrupt, the clock driver\n___ the quantum counter by 1. When it gets to zero, the clock driver calls the\n___ to set up another process.",
    "answer": ["ticks", "decrements", "scheduler"],
    "explain": "The quantum is stored in ticks, counted down one per clock interrupt, and at zero the scheduler picks another process. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "type": "fill",
    "q": "Fill in slide 37, accounting for CPU usage.",
    "code": "Start a ___ timer, distinct from the main system timer, whenever a process is\nstarted up. ... To do things right, the second timer should be ___ when an\ninterrupt occurs and ___ afterward.",
    "answer": ["second", "saved", "restored"],
    "explain": "When the process stops, the second timer is read out to tell how long the process has run. Saving it across an interrupt keeps the interrupt's time off the process's bill. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "type": "fill",
    "q": "Fill in slide 38: how one clock serves many alarm requests.",
    "code": "simulate multiple clocks by chaining all the pending clock requests together,\nsorted on time, in a ___ ___.\nEach entry on the list tells how many clock ticks following the ___ one to wait\nbefore causing a signal.",
    "answer": ["linked", "list", "previous"],
    "explain": "A process can ask for *a signal, interrupt, message,…* after an interval. With many requests pending, one clock and a sorted linked list of differences replace many clocks. [Alarm system calls, the next-signal list and watchdog timers](#/comp4736-p2/alarms-and-watchdogs)"
  },
  {
    "type": "fill",
    "q": "Slide 39's example: current time 4200, signals pending for 4203, 4207, 4213, 4215 and 4216. Fill in Next signal, the list, and Next signal after the first signal fires.",
    "code": "Next signal: ___\nClock header -> ___ -> ___ -> ___ -> ___ -> ___ -> X\nafter the first signal is caused and removed: Next signal = ___",
    "answer": ["3", "3", "4", "6", "2", "1", "4"],
    "explain": "4203 − 4200 = 3, 4207 − 4203 = 4, 4213 − 4207 = 6, 4215 − 4213 = 2, 4216 − 4215 = 1. *On each tick, Next signal is decremented. When Next signal = 0, the signal corresponding to the first item on the list is caused, and that item is removed from the list. Then Next signal = 4.* [Alarm system calls, the next-signal list and watchdog timers](#/comp4736-p2/alarms-and-watchdogs)"
  },
  {
    "type": "text",
    "q": "Name the timer that can reset a system that stops running, especially used in embedded systems.",
    "answer": ["watchdog", "watchdog timer", "watchdog timers", "a watchdog timer"],
    "explain": "Slide 40, duty 5: *Detect and recover from crashes, infinite loops*; *a watchdog timer may reset a system that stops running, especially used in embedded system.* The slide shows an Arduino UNO. [Alarm system calls, the next-signal list and watchdog timers](#/comp4736-p2/alarms-and-watchdogs)"
  }
]
```

## The Part 2 facts, for the re-read

| Structure | Slide definition | Good | Bad | Examples |
|---|---|---|---|---|
| Monolithic | single program in kernel mode; procedures in a single executable; single address space, same privilege level | high efficiency, minimal communication overhead | complex to debug and maintain; one error can crash the system; lacks modularity | Linux, Microsoft Windows |
| Layered | hierarchy of layers, each relies only on the one below | simpler design and debugging; modularity, maintainability | overhead from strict layer interactions; less efficient than monolithic | THE, MS-DOS |
| Microkernel | only the microkernel in kernel mode; IPC and basic scheduling in the kernel, drivers and file systems in user space | modularity; stability | performance (more communication); complexity | Minix, HelenOS, Horizon, L4 family, Zircon (Fuchsia) |
| Client-server | servers provide services, clients use them, often by message passing; one machine or a network | | | client, file server, process server, terminal server |
| Virtual machines | two or more OSes on one machine | | | VM/370 with CMS; ESXi (type 1); VirtualBox (type 2) |

| List | Members, in the slide's order |
|---|---|
| Monolithic parts (slide 2) | main program; service procedures (system calls); utility procedures |
| Kernel-module commands (slide 9) | insmod insert; dmesg kernel ring buffer; lsmod status; rmmod remove |
| THE layers, 5 to 0 (slide 10) | operator; user programs; input/output management; operator-process communication; memory and drum management; processor allocation and multiprogramming |
| MS-DOS, top to bottom (slide 12) | application program; resident system program; MS-DOS device drivers; ROM BIOS device drivers |
| VM/370 (slide 23) | 370 bare hardware; VM/370 (virtualization layer); a CMS (single user OS) on each virtual 370 |
| Hypervisors (slide 24) | (a) type 1 on the hardware; (b) pure type 2, machine simulator on the host OS; (c) practical type 2 with a kernel module |
| Clock components (slide 29) | crystal oscillator; counter; holding register |
| Clock-driver duties (slide 33) | time of day; preventing overruns; CPU accounting; alarm system call; watchdog timers; profiling, monitoring, statistics |

| Number | Working |
|---|---|
| 500 MHz → 2 nsec | T = 1/(500 × 10⁶) s |
| 2 nsec to 8.6 sec | (2³² − 1) × 2 nsec = 8,589,934,590 nsec |
| 60 Hz, 32-bit ticks: 2.274 years | 4294967295 × 0.0167 = 71725953.8265 s |
| 64-bit ticks: 9768538369.8 years | (2⁶⁴ − 1) × 0.0167 s |
| 32-bit seconds: 136 years | 4294967295 s, until the twenty-second century |
| Quantum register value | quantum ÷ pulse period (40 ms ÷ 2 ns = 20,000,000) |
| Alarm list 3, 4, 6, 2, 1 | 4203, 4207, 4213, 4215, 4216 minus the previous time, from 4200 |

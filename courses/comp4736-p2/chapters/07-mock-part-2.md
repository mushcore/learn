---
title: "Mock midterm: Part 2"
minutes: 30
---
A Part 2 section in the midterm's two formats: T/F and MCQ as in LockDown Browser, then written clock calculations to work on paper before typing the number. Closed book, a calculator allowed.

```quiz
[
  {
    "q": "Which OS structure operates as a single program in kernel mode, organized as a collection of procedures combined into a single executable?",
    "options": ["Monolithic system", "Layered system", "Microkernel", "Client-server system"],
    "answer": 0,
    "explain": "Slide 2: *The operating system operates as a single program in kernel mode, organized as a collection of procedures combined into a single executable.* That is the monolithic system; the slide's examples are Linux and Microsoft Windows. A layered system is a hierarchy where each layer relies only on the one below; a microkernel keeps only one module in kernel mode; the client-server model has clients using services that servers provide. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "q": "In a monolithic system, the file system and the device drivers run in separate address spaces at different privilege levels.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 5: *all OS components (process management, file system, drivers, memory management) operate within a single address space and share the same privilege level.* That sharing is why the design is efficient (*minimal communication overhead*) and why *an error in one component can crash the entire system*. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "q": "In the basic structure of a monolithic OS, which part handles system calls?",
    "options": ["The service procedures", "The main program", "The utility procedures", "The loadable extensions"],
    "answer": 0,
    "explain": "Slide 2's three parts: *A main program that invokes service procedures*, *A set of service procedures handling system calls*, *Utility procedures that support the service procedures.* Slide 4 calls the main program the boss and the service procedures the tools in the toolbox; utility procedures are helper tools that never deal with users directly. Loadable extensions are drivers or file systems loaded on demand. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "q": "After loading a kernel module, which command shows the status of modules in the Linux kernel?",
    "options": ["lsmod", "insmod", "rmmod", "dmesg"],
    "answer": 0,
    "explain": "Slide 9's session: `insmod` inserts a module into the Linux kernel, `dmesg` prints the kernel ring buffer (where `Hello, world` appears), `lsmod` shows the status of modules (`mod_example 16384 0`), and `rmmod` removes the module (after which `dmesg` also shows `Goodbye, world`). [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "q": "In Dijkstra's THE system, which layer is memory and drum management?",
    "options": ["Layer 1", "Layer 0", "Layer 2", "Layer 3"],
    "answer": 0,
    "explain": "Slide 10's table, bottom up: 0 processor allocation and multiprogramming, 1 memory and drum management, 2 operator-process communication, 3 input/output management, 4 user programs, 5 the operator. THE was built at the Technische Hogeschool Eindhoven by E. W. Dijkstra (1968) and his students. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "q": "Which of these is the slide's disadvantage of a layered system?",
    "options": [
      "Less efficient than monolithic systems, as lower layers may slow down upper ones",
      "Simplifies design and debugging by isolating functions",
      "Lacks modularity, complicating the process of modifying or replacing individual components",
      "A failure in a user-space service is less likely to crash the entire system"
    ],
    "answer": 0,
    "explain": "Slide 11 lists two disadvantages of the layered system: *Can introduce overhead due to strict layer interactions* and *Less efficient than monolithic systems, as lower layers may slow down upper ones.* Simplified design and debugging is the layered system's advantage. Lacking modularity is the monolithic system's weakness (slide 5), and the user-space failure sentence is the microkernel's stability advantage (slide 15). [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "q": "In MS-DOS, an application program can reach the ROM BIOS device drivers directly, skipping the layers in between.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 12's MS-DOS figure stacks application program, resident system program, MS-DOS device drivers and ROM BIOS device drivers, and draws two long arrows that bypass the middle: from the application program and from the resident system program straight down to the ROM BIOS device drivers. Slide 13 shows both paths printing 'a': `int 21` through DOS and `int 10` through the BIOS. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "q": "Select the services a microkernel OS runs within the kernel, according to the slide.",
    "options": ["Inter-process communication", "Basic scheduling", "File systems", "Device drivers"],
    "answer": [0, 1],
    "explain": "Slide 15: *A microkernel OS minimizes the core kernel's responsibilities, running essential services (like inter-process communication and basic scheduling) within the kernel, while other services (like drivers and file systems) run in user space.* In the MINIX 3 figure (slide 14), Disk, TTY, Netw and Print are user-mode processes. [Microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "q": "In a microkernel OS, a failure in a user-space service is likely to crash the entire system.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 15, the stability advantage: *A failure in a user-space service is less likely to crash the entire system.* The services run as *relatively powerless ordinary user processes* (slide 14). Crashing the entire system on one component's error is the monolithic system's stability problem (slide 5). [Microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "q": "Which of these is not on the slide's list of microkernel examples?",
    "options": ["Linux", "Minix", "HelenOS", "Zircon (Fuchsia OS)"],
    "answer": 0,
    "explain": "Slide 16: *Minix, HelenOS, Horizon, The L4 microkernel family, Zircon (Fuchsia OS).* Linux is the slide's monolithic example (slide 6, with Microsoft Windows); its drivers are kernel modules loaded into the kernel itself. [Microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "q": "What is the slide's performance disadvantage of a microkernel?",
    "options": [
      "Potentially higher overhead due to increased communication between user-space services and the microkernel",
      "Overhead due to strict layer interactions",
      "An error in one component can crash the entire system",
      "Higher overhead because every guest request passes through a host operating system"
    ],
    "answer": 0,
    "explain": "Slide 15: *Performance: Potentially higher overhead due to increased communication between user-space services and the microkernel.* The other microkernel disadvantage is complexity, a more complex design than monolithic kernels. Strict layer interactions are the layered system's overhead; crashing the entire system is the monolithic stability problem; the host-OS overhead belongs to a type 2 hypervisor. [Microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "q": "The client-server model is an abstraction that can only be used for a network of machines.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 17: *Client-server model is an abstraction that can be used for a single machine or for a network of machines.* The figure shows the network case: a client, a file server, a process server and a terminal server, each on its own kernel, with a message from client to server. Communication *is often by message passing*. [Microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "q": "Where does a type 1 hypervisor run?",
    "options": [
      "Directly on the system hardware, with no operating system underneath",
      "On a host operating system such as Windows 10",
      "Inside a CMS on a virtual 370",
      "As a kernel module inside the host operating system"
    ],
    "answer": 0,
    "explain": "Slide 25, ESXi: *Type-1 hypervisor*, *Runs directly on system hardware*, *No need for an operating system (OS)*. In slide 24 (a) the type 1 hypervisor is the bottom bar with Windows and Linux guests on it. A type 2 hypervisor runs on a host operating system; the practical type 2 of figure (c) adds a kernel module in the host OS. [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "q": "In the slide-26 screenshot, Windows 10 is the guest OS and Tiny Core Linux is the host OS.",
    "type": "tf",
    "answer": false,
    "explain": "The labels on slide 26 are the other way round: *Host OS (Windows 10)* is the machine's own OS, *Type 2 hypervisor(VirtualBox)* runs on it, and *Guest OS (Tiny Core Linux)* runs inside VirtualBox (its terminal shows `pstree -p`). [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "q": "In the structure of VM/370 with CMS, what is CMS?",
    "options": [
      "A single user OS running on each virtual 370",
      "The virtualization layer running on the 370 bare hardware",
      "A type 2 hypervisor running on a host operating system",
      "A server that provides files to clients over a network"
    ],
    "answer": 0,
    "explain": "Slide 23: VM/370 is the *VM-Virtualization Layer* on the *370 Bare hardware*, and it gives each CMS its own virtual 370; the instructor's note says *CMS is a single user OS*. The slide expands CP/CMS as Control Program/Cambridge Monitor System; Tanenbaum's book says Conversational Monitor System. [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "q": "In VM/370 with CMS, an application on one virtual 370 makes a system call. Where does it trap?",
    "options": ["To CMS", "To VM/370", "To the 370 bare hardware", "To the host operating system"],
    "answer": 0,
    "explain": "Slide 23's figure: *System calls here* points into the space above CMS, with *Trap here* on CMS. It is CMS's own I/O instructions that trap to VM/370 (*I/O instructions here*, *Trap here* on VM/370). VM/370 has no host OS under it; it runs on the bare hardware. [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "q": "All the clock hardware does is generate interrupts at known intervals.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 29, underlined: *All the clock hardware does is generate interrupts at known intervals.* Everything else, from the time of day to watchdog timers, is the clock driver's software job (slide 33). [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "A programmable clock is in one-shot mode. What happens when the counter gets to zero?",
    "options": [
      "It causes an interrupt and stops until it is explicitly started again by the software",
      "It causes an interrupt, the holding register is copied into the counter, and the process repeats indefinitely",
      "It calls the scheduler to set up another process",
      "It resets a system that stops running"
    ],
    "answer": 0,
    "explain": "Slide 31: in one-shot mode the clock copies the holding register into the counter, decrements at each crystal pulse, and at zero *causes an interrupt and stops until it is explicitly started again by the software.* Copying the holding register back and repeating is square-wave mode. Calling the scheduler is the clock driver at the end of a quantum; resetting a stopped system is a watchdog timer. [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "The periodic interrupts of one-shot mode are called clock ticks.",
    "type": "tf",
    "answer": false,
    "explain": "One-shot mode gives one interrupt and stops, so it has no periodic interrupts. Slide 31, square-wave mode: the process is *repeated again indefinitely. These periodic interrupts are called clock ticks.* [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "Which of these is not one of the typical duties of a clock driver?",
    "options": [
      "Generating a periodic signal at several hundred megahertz",
      "Accounting for CPU usage",
      "Providing watchdog timers for parts of system itself",
      "Profiling, monitoring, statistics gathering"
    ],
    "answer": 0,
    "explain": "The periodic signal comes from the crystal oscillator, a hardware component (slide 29), not from the driver. Slide 33's six duties of the clock driver: maintaining the time of day; preventing processes from running longer than allowed; accounting for CPU usage; handling alarm system call from user processes; providing watchdog timers for parts of system itself; profiling, monitoring, statistics gathering. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "q": "A process's quantum counter reaches zero. What does the clock driver do?",
    "options": [
      "Calls the scheduler to set up another process",
      "Causes the signal for the first item on the alarm list",
      "Resets the system",
      "Reads out the second timer to tell how long the process has run"
    ],
    "answer": 0,
    "explain": "Slide 37: the scheduler *initializes a counter to the value of that process' quantum in clock ticks*; at every clock interrupt the driver *decrements the quantum counter by 1*, and *When it gets to zero, the clock driver calls the scheduler to set up another process.* The alarm list fires on Next signal = 0, a watchdog resets a stopped system, and the second timer is CPU accounting. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "q": "For CPU accounting, the second timer should be saved when an interrupt occurs and restored afterward.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 37: start *a second timer, distinct from the main system timer* when a process starts, read it out when the process stops, and *To do things right, the second timer should be saved when an interrupt occurs and restored afterward.* Otherwise the interrupt's time would be charged to the process. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "q": "Keeping the time of day in seconds rather than in ticks needs a second, smaller count beside the 32-bit seconds counter. What does it count?",
    "options": [
      "The number of ticks in the current second",
      "The system boot time in seconds",
      "The ticks left in the current process's quantum",
      "The ticks until the next alarm signal"
    ],
    "answer": 0,
    "explain": "Slide 35's figure: a 32-bit *Time of day in seconds* box with a smaller *Number of ticks in current second* box beside it (0 to 59 at 60 Hz). System boot time in seconds belongs to the third method (slide 36), where *Current time = the stored time of day in the memory + counter*. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "q": "Each entry on the alarm list tells how many clock ticks after the current time to wait before causing its signal.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 38: *Each entry on the list tells how many clock ticks following the previous one to wait before causing a signal.* Only the first entry counts from the current time. In the slide's example (current time 4200; signals at 4203, 4207, 4213, 4215, 4216) the list is 3, 4, 6, 2, 1, not 3, 7, 13, 15, 16. [Alarm system calls, the next-signal list and watchdog timers](#/comp4736-p2/alarms-and-watchdogs)"
  },
  {
    "q": "An embedded controller gets stuck in an infinite loop and is reset automatically. Which clock-driver duty did this?",
    "options": [
      "Providing watchdog timers for parts of system itself",
      "Handling alarm system call from user processes",
      "Preventing processes from running longer than allowed",
      "Maintaining the time of day"
    ],
    "answer": 0,
    "explain": "Slide 40: watchdog timers *Detect and recover from crashes, infinite loops*; *a watchdog timer may reset a system that stops running, especially used in embedded system.* Preventing overruns ends a quantum by calling the scheduler, it does not reset the system; the alarm call signals a process that asked for a warning. [Alarm system calls, the next-signal list and watchdog timers](#/comp4736-p2/alarms-and-watchdogs)"
  }
]
```

## Written section: periods, register values, overflow and the alarm list

Work each on paper first: the formula, the substitution with units, the number.

```quiz
[
  {
    "q": "A programmable clock uses a 400-MHz crystal. How often is the counter pulsed, in nanoseconds?",
    "type": "numeric",
    "answer": 2.5,
    "tolerance": 0,
    "unit": "ns",
    "explain": "T = 1/f = 1/(400 × 10⁶) s = 10⁹ / (400 × 10⁶) ns = **2.5 ns**. Slide 32 does the same with 500 MHz: 2 nsec. [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "The same 400-MHz clock has an unsigned 32-bit holding register. What is the longest interval it can be programmed to interrupt after, in seconds?",
    "type": "numeric",
    "answer": 10.737,
    "tolerance": 0.04,
    "unit": "s",
    "explain": "Largest count = 2³² − 1 = 4,294,967,295 pulses. Longest interval = 4,294,967,295 × 2.5 ns = 10,737,418,237.5 ns ≈ **10.74 s**. The shortest is one pulse, 2.5 ns. Slide 32's version: (2³² − 1) × 2 nsec = 8,589,934,590 nsec ≈ 8.6 sec. [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "A clock has a cycle time of 1.25 ns. What is its frequency, in MHz?",
    "type": "numeric",
    "answer": 800,
    "tolerance": 0,
    "unit": "MHz",
    "explain": "f = 1/T = 1/(1.25 × 10⁻⁹ s) = 0.8 × 10⁹ Hz = **800 MHz** (0.8 GHz). [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "A clock is driven by a 200-MHz crystal. The OS gives each process a quantum of 30 ms. What value should be loaded into the holding register to interrupt after one quantum?",
    "type": "numeric",
    "answer": 6000000,
    "tolerance": 0,
    "explain": "Pulse period T = 1/(200 × 10⁶) s = 5 ns. Put both times in one unit: 30 ms = 30 × 10⁻³ s = 30,000,000 ns. Register value = 30,000,000 ns ÷ 5 ns = **6,000,000** pulses. The counter is decremented once per pulse and interrupts at zero. [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "The same 200-MHz crystal drives a clock whose holding register is only 16 bits (unsigned). What is the longest interval it can time, in microseconds? (Notice whether the 30-ms quantum fits.)",
    "type": "numeric",
    "answer": 327.675,
    "tolerance": 0.5,
    "unit": "µs",
    "explain": "Largest 16-bit count = 2¹⁶ − 1 = 65,535 pulses. Longest interval = 65,535 × 5 ns = 327,675 ns = **327.675 µs**, about 0.33 ms. A 30-ms quantum needs 6,000,000 pulses, far more than 65,535, so it does not fit in one load. [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "A system keeps the time of day as a 32-bit unsigned count of ticks, with a 50-Hz clock. How many years until the counter overflows? Use 365-day years.",
    "type": "numeric",
    "answer": 2.724,
    "tolerance": 0.01,
    "unit": "years",
    "explain": "T = 1/50 = 0.02 s per tick. Total time = (2³² − 1) × 0.02 = 4,294,967,295 × 0.02 = 85,899,345.9 s. One year = 365 × 86,400 = 31,536,000 s, so 85,899,345.9 ÷ 31,536,000 = **2.724 years**. Slide 34's 60-Hz version: 4294967295 × 0.0167 = 71725953.8265 seconds = 2.274 years. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "q": "A clock ticks at 250 Hz. The scheduler gives a process a 40-ms quantum. What value does it put in the quantum counter?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0,
    "unit": "ticks",
    "explain": "Slide 37: the scheduler initializes the counter to the quantum *in clock ticks*. One tick = 1/250 s = 4 ms, so 40 ms ÷ 4 ms = **10 ticks**. The clock driver decrements the counter by 1 at every clock interrupt and calls the scheduler when it reaches 0. [The clock driver's duties: time of day, quantum, accounting](#/comp4736-p2/clock-software)"
  },
  {
    "type": "fill",
    "q": "The current time is 7500. Signals are pending for 7502, 7509, 7510, 7516 and 7524. Fill in Next signal and the five list entries, in order.",
    "code": "Current time: 7500\nNext signal:  ___\nClock header -> ___ -> ___ -> ___ -> ___ -> ___ -> null",
    "answer": ["2", "2", "7", "1", "6", "8"],
    "explain": "Each entry is the ticks *following the previous one* (slide 38): 7502 − 7500 = 2, 7509 − 7502 = 7, 7510 − 7509 = 1, 7516 − 7510 = 6, 7524 − 7516 = 8. Next signal starts at the first entry, 2. Check: 2 + 7 + 1 + 6 + 8 = 24 = 7524 − 7500. [Alarm system calls, the next-signal list and watchdog timers](#/comp4736-p2/alarms-and-watchdogs)"
  },
  {
    "q": "Same list (current time 7500; signals at 7502, 7509, 7510, 7516, 7524). What is the value of Next signal when the current time is 7513?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "ticks",
    "explain": "By 7513 three signals have fired: 7502 (Next signal reached 0 and the 2-entry was removed, then Next signal = 7), 7509 (then Next signal = 1) and 7510 (then Next signal = 6). Three ticks later, at 7513, Next signal = 6 − 3 = **3**, counting down to the signal at 7516. The list left is 6 → 8. [Alarm system calls, the next-signal list and watchdog timers](#/comp4736-p2/alarms-and-watchdogs)"
  }
]
```

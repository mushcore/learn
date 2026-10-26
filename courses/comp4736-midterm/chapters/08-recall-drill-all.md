---
title: Recall drill, all five Parts (closed book)
minutes: 35
---

The midterm allows no cheat sheet, so every list, table and number below must come from memory. Answer each block before you look at the tables at the end; the drill keeps to the facts the practice paper asks, and each Part's own drill goes further.

## Part 1: levels, rings, pipeline and cache formulas, I/O, the zoo and file types

```quiz
[
  {
    "type": "reorder",
    "q": "Put the six levels of the multilevel machine in order from Level 5 (top) to Level 0 (bottom).",
    "lines": [
      "High programming language level",
      "Assembly language level",
      "Operating System (OS) level",
      "Instruction Set Architecture (ISA) level",
      "Microarchitecture level",
      "Digital level"
    ],
    "explain": "Slide 2: 5 high-level language (Java, Python, C++), 4 assembly (human readable, hard to work with), 3 OS (memory management, processes execution, system resource protection), 2 ISA (the basic operations, not the implementation), 1 microarchitecture (ALU, registers, microprograms), 0 digital (transistors; AND, OR, NOT). [The six-level machine](#/comp4736-p1/multilevel-machines)"
  },
  {
    "type": "fill",
    "q": "Slide 12: what an operating system is. Type each word in lower case.",
    "code": "1. A ___\n2. An ___ machine\n3. A ___ manager that provides many abstraction layers",
    "answer": ["software", "extended", "resource"],
    "explain": "A software, an extended machine, a resource manager. The extended-machine slide adds: operating systems turn ugly hardware into beautiful abstractions. [Software, extended machine, resource manager](#/comp4736-p1/what-the-os-is)"
  },
  {
    "type": "fill",
    "q": "Fill in the x86 ring numbers.",
    "code": "Ring ___          kernel mode, most privileged\nRings ___ and ___   operating system services (device drivers, etc.)\nRing ___          user mode, least privileged, relies on system calls",
    "answer": ["0", "1", "2", "3"],
    "explain": "Slides 17–18. Kernel mode is also called supervisor mode: complete access to all the hardware and any instruction. User mode gets only a subset; instructions that control the machine or do I/O are forbidden. [Kernel mode, user mode and the four x86 rings](#/comp4736-p1/kernel-and-user-mode)"
  },
  {
    "type": "fill",
    "q": "Complete the pipeline formulas of slides 39–40.",
    "code": "// pipelined, n stages with delays t1 ... tn\nTp         = ___{t1, t2, ..., tn}\nThroughput = 1 / Tp\nDelay      = ___ * Tp\n// no pipelining\nTp         = t1 + t2 + ... + tn\nDelay      = Tp",
    "answer": ["max", "n"],
    "explain": "The slowest stage sets the clock period, and each instruction spends one period in each of the n stages. The practice paper's 3/3/5 ns pipeline: Tp = 5 ns, 200 million instructions/s, delay 3 × 5 = 15 ns (not the 11 ns sum). [Pipelining: cycle time and latency](#/comp4736-p1/pipelining)"
  },
  {
    "type": "numeric",
    "q": "The slide's car factory has stations of 1 h, 1 h and 2 h. What is the latency for each car, in hours?",
    "answer": 6,
    "tolerance": 0,
    "unit": "h",
    "explain": "Cycle time = 2 hours (every 2 hours 1 car), latency = 2 + 2 + 2 = 6 hours. The single 4-hour station gives 1 car every 4 hours with a latency of 4 hours: the pipeline is faster in throughput, slower per car. [Pipelining](#/comp4736-p1/pipelining)"
  },
  {
    "type": "numeric",
    "q": "Slide 51: L1D cache 32 KB × 2, 64-byte lines, 8-way set associative. How many cache lines?",
    "answer": 1024,
    "tolerance": 0,
    "explain": "Total L1D = 32 KB × 2 = 64 KB; lines = 64 × 1024 ÷ 64 = 1024. (Per core it would be 512.) [Cache lines, sets, direct mapping](#/comp4736-p1/cache-mapping)"
  },
  {
    "type": "numeric",
    "q": "Same L1D cache (1024 lines, 8-way). How many sets?",
    "answer": 128,
    "tolerance": 0,
    "explain": "Sets = lines ÷ ways = 1024 ÷ 8 = 128. (Per core: 512 ÷ 8 = 64.) [Cache lines, sets, direct mapping](#/comp4736-p1/cache-mapping)"
  },
  {
    "type": "fill",
    "q": "Complete the direct-mapping formula of slide 54 with its operator.",
    "code": "CI = MI ___ (# of cache lines)",
    "answer": ["%", "mod"],
    "explain": "The cache index is the memory index modulo the number of lines: with 4 lines, 3 → 3, 10 → 2, 13 → 1. The slide's 15-request trace gives 12 misses and 3 hits (80 % / 20 %). [Cache lines, sets, direct mapping](#/comp4736-p1/cache-mapping)"
  },
  {
    "type": "fill",
    "q": "Slide 46, typical access times in the memory hierarchy.",
    "code": "Registers      ___ nsec    < 1 KB\nCache          ___ nsec    4 MB\nMain memory    ___ nsec    1 - 8 GB\nMagnetic disk  ___ msec    1 - 4 TB",
    "answer": ["1", "2", "10", "10"],
    "explain": "1 nsec, 2 nsec, 10 nsec, 10 msec. The last unit is milliseconds: the disk is about a million times slower than main memory. [The memory hierarchy](#/comp4736-p1/memory-and-registers)"
  },
  {
    "type": "fill",
    "q": "Name the five cache replacement algorithms of slide 57 (capitalised as shown).",
    "code": "1. Least Recently Used (___)\n2. First In First Out (___)\n3. Least Frequently Used (___)\n4. ___\n5. ___ algorithm",
    "answer": ["LRU", "FIFO", "LFU", "Random", "Clock"],
    "explain": "LRU, FIFO, LFU, Random, Clock algorithm. The slide names them without defining them. [Cache lines, sets, direct mapping and replacement](#/comp4736-p1/cache-mapping)"
  },
  {
    "type": "match",
    "q": "Match each register to what it holds (slide 47).",
    "pairs": [
      ["PC", "the memory address of the next instruction to be fetched"],
      ["Stack pointer", "the top of the current stack in memory"],
      ["PSW", "condition code bits, CPU priority, the mode (user or kernel)"]
    ],
    "explain": "User programs may normally read the entire PSW but typically may write only some of its fields. The fastest memory is a register; registers are not only in CPUs (controllers have them too). [PC, SP, PSW](#/comp4736-p1/memory-and-registers)"
  },
  {
    "type": "match",
    "q": "Match each of the three ways to do I/O to what happens (slides 65–66).",
    "pairs": [
      ["Busy waiting", "the driver polls the device in a tight loop, tying up the CPU"],
      ["Using interrupt", "the driver starts the device and returns; the OS blocks the caller and looks for other work"],
      ["DMA", "a chip moves the bytes without the CPU and causes an interrupt when done"]
    ],
    "explain": "The driver runs in kernel mode and talks to the controller through its registers (disk address, memory address, sector count, direction). [Controllers, drivers, busy waiting, interrupts and DMA](#/comp4736-p1/io-devices)"
  },
  {
    "type": "fill",
    "q": "Slide 60, disk timings.",
    "code": "next cylinder      about ___ msec\nrandom cylinder    ___ to 10 msec\nrotational delay   5 to ___ msec\ntransfer           50 to ___ MB/sec",
    "answer": ["1", "5", "10", "160"],
    "explain": "1 msec, 5 to 10 msec, 5 to 10 msec, 50 MB/sec on low-end disks to 160 MB/sec on faster ones. Platters rotate at 5400, 7200, 10,800 RPM or more. [Disks and SSDs](#/comp4736-p1/disks)"
  },
  {
    "type": "match",
    "q": "Match each bus to its slide sentence (slides 70–71).",
    "pairs": [
      ["SCSI", "up to 640 MB/sec, mostly in servers and workstations"],
      ["USB", "a device functions immediately, without requiring a reboot"],
      ["PCI", "an internal synchronous bus for adapters such as sound and network cards"],
      ["PCI-Express", "a devoted path, called a lane, to a single chip known as a switch"]
    ],
    "explain": "The three bus types the practice paper names are data, address and control buses; there is no utility bus. [Buses](#/comp4736-p1/buses)"
  },
  {
    "q": "Select every processor the slide lists under RISC.",
    "options": ["AVR", "ARM", "MIPS", "AMD", "Pentium", "VAX"],
    "answer": [0, 1, 2],
    "explain": "Slide 32: RISC AVR, ARM, MIPS (hardwired approach); CISC AMD, Pentium, VAX (microprogrammed approach). [ALU, control unit, RISC and CISC](#/comp4736-p1/cpu)"
  },
  {
    "type": "match",
    "q": "Match each OS zoo category to the slide's example.",
    "pairs": [
      ["Mainframe", "OS/390"],
      ["Server", "Solaris"],
      ["Handheld", "Android and iOS"],
      ["Embedded", "QNX and VxWorks"],
      ["Sensor node", "TinyOS"],
      ["Real-time", "eCos"],
      ["Smart card", "JVM"]
    ],
    "explain": "Slides 73–76. Mainframes offer batch, transaction processing and timesharing; embedded systems do not accept user-installed software; real-time systems have time as a key parameter. Multiprocessor (Windows, Linux) and personal computer OSes complete the nine. [The OS zoo](#/comp4736-p1/os-zoo-processes-files)"
  },
  {
    "type": "match",
    "q": "Match each Linux file-type letter to its type (slide 88).",
    "pairs": [
      ["d", "directory"],
      ["c", "character device file"],
      ["b", "block device file"],
      ["s", "local socket file"],
      ["p", "named pipe"],
      ["l", "symbolic link"]
    ],
    "explain": "A dash (-) is a regular file. The nine characters after the letter are the protection bits. [Files and protection](#/comp4736-p1/os-zoo-processes-files)"
  },
  {
    "type": "numeric",
    "q": "Write the protection bits rwxr-x--- in octal.",
    "answer": 750,
    "tolerance": 0,
    "explain": "Three 3-bit fields, owner, group, others, with r = 4, w = 2, x = 1: rwx = 7, r-x = 5, --- = 0, so 750. [Files and protection](#/comp4736-p1/os-zoo-processes-files)"
  }
]
```

## Part 2: clock duties, clock hardware and its arithmetic, the structures

```quiz
[
  {
    "type": "reorder",
    "q": "Put the six typical duties of a clock driver in slide 33's order.",
    "lines": [
      "Maintaining the time of day",
      "Preventing processes from running longer than allowed",
      "Accounting for CPU usage",
      "Handling alarm system call from user processes",
      "Providing watchdog timers for parts of system itself",
      "Profiling, monitoring, statistics gathering"
    ],
    "explain": "Slides 34–40 take duties 1 to 5 in this order; duty 6 has no further slide. [The clock driver's duties](#/comp4736-p2/clock-software)"
  },
  {
    "type": "fill",
    "q": "Slide 29: clocks are built out of three components (capitalised as on the slide).",
    "code": "1) ___ oscillator\n2) ___\n3) ___ register",
    "answer": ["Crystal", "Counter", "Holding"],
    "explain": "The crystal generates the periodic signal, the counter counts down to zero and causes a CPU interrupt, and the holding register's value is copied into the counter. These make the programmable clock (hardware); a clock driver is software, which is why the practice paper's 'clock drivers are built out of three components' is False. [Clock hardware](#/comp4736-p2/clock-hardware)"
  },
  {
    "type": "match",
    "q": "Match each clock mode to its behaviour (slide 31).",
    "pairs": [
      ["One-shot mode", "interrupts once, then stops until it is explicitly started again by the software"],
      ["Square-wave mode", "reloads the counter from the holding register and repeats indefinitely: clock ticks"]
    ],
    "explain": "All the clock hardware does is generate interrupts at known intervals. [Clock hardware](#/comp4736-p2/clock-hardware)"
  },
  {
    "type": "numeric",
    "q": "Slide 32: a 500-MHz crystal pulses the counter every how many nanoseconds?",
    "answer": 2,
    "tolerance": 0,
    "unit": "ns",
    "explain": "T = 1/f = 1/(500 × 10⁶) s = 2 nsec. [Clock hardware](#/comp4736-p2/clock-hardware)"
  },
  {
    "type": "numeric",
    "q": "Same clock with an unsigned 32-bit holding register: the longest interval it can time, in seconds?",
    "answer": 8.6,
    "tolerance": 0.05,
    "unit": "s",
    "explain": "(2³² − 1) × 2 nsec = 8,589,934,590 nsec ≈ 8.6 sec; interrupts can be programmed from 2 nsec to 8.6 sec. [Clock hardware](#/comp4736-p2/clock-hardware)"
  },
  {
    "type": "numeric",
    "q": "Slide 34: time of day kept in ticks, 60 Hz, 32-bit counter. It overflows after how many years?",
    "answer": 2.274,
    "tolerance": 0.01,
    "unit": "years",
    "explain": "T = 1/60 ≈ 0.0167 s; 4294967295 × 0.0167 = 71725953.8 s = 2.274 years, 'just over 2 years'. (Exact 1/60 gives 2.27.) A 64-bit counter lasts about 9.77 × 10⁹ years but costs more to maintain. [The clock driver's duties](#/comp4736-p2/clock-software)"
  },
  {
    "type": "numeric",
    "q": "Slide 35: time of day kept in seconds in a 32-bit counter. It lasts about how many years?",
    "answer": 136,
    "tolerance": 0.5,
    "unit": "years",
    "explain": "4294967295 s ÷ 31,536,000 s/year ≈ 136 years, 'until the twenty-second century'. The third way counts ticks relative to boot: current time = stored time of day + counter. [The clock driver's duties](#/comp4736-p2/clock-software)"
  },
  {
    "type": "numeric",
    "q": "Current time 1000; alarms pending at 1005, 1006 and 1010. In the next-signal linked list, what is the entry for the 1010 alarm?",
    "answer": 4,
    "tolerance": 0,
    "unit": "ticks",
    "explain": "Each entry tells how many clock ticks following the previous one to wait: 1005 − 1000 = 5, 1006 − 1005 = 1, 1010 − 1006 = 4. The slide's list for 4200 and 4203, 4207, 4213, 4215, 4216 is 3 → 4 → 6 → 2 → 1. [Alarm system calls and the next-signal list](#/comp4736-p2/alarms-and-watchdogs)"
  },
  {
    "type": "fill",
    "q": "Slide 2: the basic structure of a monolithic OS (lower case).",
    "code": "1 - a ___ program that invokes service procedures\n2 - a set of ___ procedures handling system calls\n3 - the ___ procedures that support the service procedures",
    "answer": ["main", "service", "utility"],
    "explain": "Main program (the boss), service procedures (the tools), utility procedures (helper tools). All of it runs as a single program in kernel mode, in a single address space. [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "type": "match",
    "q": "Match each structure to the slides' example.",
    "pairs": [
      ["Monolithic", "Linux and Windows"],
      ["Layered", "the THE system and MS-DOS"],
      ["Microkernel", "MINIX 3 and L4"],
      ["Type 1 hypervisor", "ESXi"],
      ["Type 2 hypervisor", "VirtualBox"]
    ],
    "explain": "In a microkernel OS drivers run in user space, not in the kernel. In a layered OS each layer relies only on the one below. A type 2 hypervisor runs on a host OS, so it has the host's overhead. [Microkernels](#/comp4736-p2/microkernels-and-client-server), [virtual machines](#/comp4736-p2/virtual-machines)"
  }
]
```

## Part 3: creation, termination, states, 1 − pⁿ, fork, ps letters and segments

```quiz
[
  {
    "type": "reorder",
    "q": "Put the four principal events that create processes in slide 10's order.",
    "lines": [
      "System initialization",
      "Execution of a process-creation system call by a running process",
      "A user request to create a new process",
      "Initiation of a batch job"
    ],
    "explain": "Batch jobs apply only to the batch systems found on large mainframes. Background processes created at boot that handle email, Web pages, printing are daemons. [The four events that create a process](#/comp4736-p3/process-creation)"
  },
  {
    "type": "reorder",
    "q": "Put the four termination conditions in slide 17's order.",
    "lines": [
      "Normal exit (voluntary)",
      "Error exit (voluntary)",
      "Fatal error (involuntary)",
      "Killed by another process (involuntary)"
    ],
    "explain": "Normal exit is exit in UNIX and ExitProcess in Windows; killing another process is kill in UNIX and TerminateProcess in Win32. [The four ways a process ends](#/comp4736-p3/process-termination)"
  },
  {
    "type": "fill",
    "q": "The four transitions of slide 26. Type the state names capitalised: Running, Ready, Blocked.",
    "code": "1  Running -> ___   process blocks for input\n2  Running -> ___   scheduler picks another process\n3  Ready   -> ___   scheduler picks this process\n4  Blocked -> ___   input becomes available",
    "answer": ["Blocked", "Ready", "Running", "Ready"],
    "explain": "Transitions 2 and 3 are caused by the process scheduler without the process knowing. There is no Blocked → Running and no Ready → Blocked arrow. [Running, Ready, Blocked](#/comp4736-p3/process-states)"
  },
  {
    "type": "text",
    "q": "Write the CPU utilization formula for n processes that each wait for I/O a fraction p of the time.",
    "answer": ["1 - p^n", "1-p^n", "1 − pⁿ", "1 − p^n", "1-p**n", "1 - p**n", "1-pⁿ", "1 - pⁿ"],
    "explain": "Slide 43: the CPU is idle only when all n processes wait at once, probability pⁿ, so utilization = 1 − pⁿ. The model assumes the n processes are independent. [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "type": "numeric",
    "q": "Slide 46: with 80 % I/O wait, at least how many processes does the slide say must be in memory to get the CPU waste below 10 %?",
    "answer": 10,
    "tolerance": 0,
    "unit": "processes",
    "explain": "The slide says 10, with CPU waste = 0.8¹⁰ ≈ 0.1074. That is 10.74 %, just above 10 %; by the arithmetic 11 processes are needed (0.8¹¹ ≈ 0.0859). Answer the slide's 10 and know why 11 is the strict answer. [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "type": "numeric",
    "q": "A machine has 2 GB of RAM; the OS takes 512 MB and each process 128 MB. How many processes fit (the n in 1 − pⁿ)?",
    "answer": 12,
    "tolerance": 0,
    "unit": "processes",
    "explain": "2 GB = 2048 MB; 2048 − 512 = 1536 MB for processes; 1536 ÷ 128 = 12. The practice paper's version: 4096 − 512 = 3584 MB ÷ 256 = 14, then p¹⁴ = 0.01 gives p ≈ 0.72. [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "type": "fill",
    "q": "fork()'s three return values (Part 5 slide 23).",
    "code": "pid = fork();\n// fork fails:       pid == ___\n// in the child:     pid == ___\n// in the parent:    pid ___ 0, the child's process ID",
    "answer": ["-1", "0", ">"],
    "explain": "Part 3 slide 48: parent_pid 4508 forks; the parent's fork_return_value is the child's pid 4509, the child's is 0. Both continue at the instruction after the fork. [fork() and the shell](#/comp4736-p3/fork-and-the-shell)"
  },
  {
    "type": "match",
    "q": "Match each ps state letter to its man ps meaning (slide 59).",
    "pairs": [
      ["D", "uninterruptible sleep (usually IO, cannot be killed)"],
      ["I", "idle kernel thread"],
      ["R", "running or runnable (on run queue)"],
      ["S", "interruptible sleep (waiting for an event, can be killed)"],
      ["T", "stopped by job control signal"],
      ["Z", "defunct (zombie), terminated but not reaped by its parent"]
    ],
    "explain": "X is dead (should never be seen). SIGSTOP moves R to T and SIGCONT moves it back (slide 61). [The state letters D I R S T X Z](#/comp4736-p3/linux-process-states)"
  },
  {
    "type": "match",
    "q": "Match each region of the Linux process address space to what it holds (slide 47).",
    "pairs": [
      ["Text", "program code"],
      ["Data", "initialized global (or static) variables"],
      ["BSS", "uninitialized global (or static) variables"],
      ["Stack", "local variables, return address, and parameters"]
    ],
    "explain": "From lower to higher address: text, data, BSS, heap (grows up), stack (grows down), then kernel space. The classic UNIX picture has three segments, text, data and stack: data grows upward, stack grows downward. [Text, data, BSS, heap, stack](#/comp4736-p3/linux-address-space)"
  },
  {
    "type": "match",
    "q": "Match each process-table field to its column of slide 40.",
    "pairs": [
      ["Program counter", "process management"],
      ["Pointer to stack segment info", "memory management"],
      ["Working directory", "file management"]
    ],
    "explain": "One process table for the whole system, an array of structures with one entry per process (so 'each process has its own process table' is False). 15 process-management, 3 memory-management and 5 file-management fields. [The process table, the PCB and the context switch](#/comp4736-p3/process-table)"
  }
]
```

## Part 4: per-thread items, hybrid mappings, Pthreads

```quiz
[
  {
    "q": "Select every item that is private to each thread (slide 15).",
    "options": ["Program counter", "Registers", "Stack", "State", "Address space", "Global variables", "Open files", "Child processes"],
    "answer": [0, 1, 2, 3],
    "explain": "Per thread: program counter, registers, stack, state. Per process: address space, global variables, open files, child processes, pending alarms, signals and signal handlers, accounting information. [What is shared and what is private](#/comp4736-p4/classical-thread-model)"
  },
  {
    "type": "fill",
    "q": "Slide 2: creating a thread goes how many times faster than creating a process?",
    "code": "Creating a thread goes ___-___ times faster than creating a process.",
    "answer": ["10", "100"],
    "explain": "10–100 times faster. Threads give no performance gain when all of them are CPU bound; they help when computing and I/O can overlap, and on multiple CPUs. [What is a thread](#/comp4736-p4/what-is-a-thread)"
  },
  {
    "q": "Select the two problems of user-level threads (slide 27).",
    "options": ["A blocking system call by one thread stops all the threads", "No clock interrupts within a single process", "The memory cache must be flushed on every thread switch", "Each process cannot have its own scheduling algorithm"],
    "answer": [0, 1],
    "explain": "Blocking system calls and no clock interrupts (a thread runs until it gives up the CPU of its own free will). The advantages are the reverse of the distractors: no trap, no context switch, the memory cache need not be flushed, customized scheduling, better scaling. [Threads in user space, threads in the kernel](#/comp4736-p4/user-vs-kernel-threads)"
  },
  {
    "type": "match",
    "q": "Match each hybrid mapping to its property (slides 38–42).",
    "pairs": [
      ["Many to one", "lack of true concurrency; the kernel is unaware of the user threads"],
      ["One to one", "true concurrency, but many kernel threads add overhead"],
      ["Many to many", "user threads on an equal or smaller number of kernel threads"]
    ],
    "explain": "In the hybrid model the kernel is aware of only the kernel-level threads; this gives the ultimate in flexibility (slide 34). [Hybrid implementations](#/comp4736-p4/hybrid-models)"
  },
  {
    "type": "match",
    "q": "Match each Pthreads call to its description (slide 19).",
    "pairs": [
      ["Pthread_create", "Create a new thread"],
      ["Pthread_exit", "Terminate the calling thread"],
      ["Pthread_join", "Wait for a specific thread to exit"],
      ["Pthread_yield", "Release the CPU to let another thread run"],
      ["Pthread_attr_init", "Create and initialize a thread's attribute structure"],
      ["Pthread_attr_destroy", "Remove a thread's attribute structure"]
    ],
    "explain": "Pthreads is supported by most UNIX systems and defines over 60 function calls; the demo compiles with gcc main.c -lpthread. [The Pthreads calls](#/comp4736-p4/pthreads)"
  }
]
```

## Part 5: the eleven steps, file descriptors, registers, the POSIX and Win32 tables

```quiz
[
  {
    "type": "reorder",
    "q": "Put the steps of read(fd, buffer, nbytes) in order, step 1 first.",
    "lines": [
      "Push nbytes",
      "Push &buffer",
      "Push fd",
      "Call the library procedure read",
      "The library procedure puts the system-call number in a register",
      "Execute TRAP: switch from user mode to kernel mode at a fixed kernel address",
      "Kernel examines the number and dispatches through the table of handler pointers",
      "The system-call handler runs",
      "Return to the library procedure at the instruction after the TRAP",
      "The library procedure returns to the user program",
      "The user program cleans up the stack (increment SP)"
    ],
    "explain": "Steps 1–3 push the parameters in reverse order (nbytes, &buffer, fd); 4 is a normal procedure call; 5 the system-call number; 6 TRAP; 7 dispatch; 8 handler; 9 back to the library; 10 back to the user program; 11 the user program cleans up the stack. [The eleven steps of read](#/comp4736-p5/eleven-steps)"
  },
  {
    "type": "fill",
    "q": "File descriptor numbers of the standard streams (slide 5).",
    "code": "stdin  ___\nstdout ___\nstderr ___",
    "answer": ["0", "1", "2"],
    "explain": "stdin 0 (keyboard or file, <), stdout 1 (terminal or file, 1>), stderr 2 (terminal or file, 2>). After close(1), write(1, …) fails because fd 1 is closed. [stdin, stdout, stderr](#/comp4736-p5/standard-streams)"
  },
  {
    "type": "fill",
    "q": "Slide 11: the 32-bit x86 Linux system-call convention.",
    "code": "system call number  ->  ___\narguments           ->  ___, ECX, ...\ninterrupt           ->  int ___h\nresult              ->  ___",
    "answer": ["EAX", "EBX", "80", "EAX"],
    "explain": "Number in EAX (4 = sys_write, 1 = sys_exit), arguments in EBX, ECX, …, int 80h, result in EAX. On x86-64 the instruction is syscall with the number in rax. [x86 registers, int 80h](#/comp4736-p5/registers-and-int80)"
  },
  {
    "type": "match",
    "q": "Match each interrupt class to the slide's example (slide 1).",
    "pairs": [
      ["External interrupt (hardware), asynchronous", "moving the mouse or pressing a key"],
      ["Internal interrupt (exception), synchronous", "1/0"],
      ["Software interrupt (trap), synchronous", "system calls"]
    ],
    "explain": "A system call is invoked by a software interrupt. C programs can make system calls directly, and library functions use them too. [External, internal and software interrupts](#/comp4736-p5/interrupt-classes)"
  },
  {
    "type": "match",
    "q": "Match each POSIX call to the name of what it returns (slides 22, 39–41).",
    "pairs": [
      ["fork", "pid, a process id"],
      ["open", "fd, a file descriptor"],
      ["read", "n, a byte count"],
      ["lseek", "position, an offset within the file"],
      ["time", "seconds, the elapsed time"],
      ["mkdir", "s, −1 if an error has occurred"]
    ],
    "explain": "The caption of every POSIX table: the return code s is −1 if an error has occurred; pid is a process id, fd a file descriptor, n a byte count, position an offset within the file, seconds the elapsed time. The fd is an int. [The POSIX system calls and what they return](#/comp4736-p5/posix-tables)"
  },
  {
    "type": "match",
    "q": "Match each UNIX call to its Win32 equivalent (slides 48–49).",
    "pairs": [
      ["fork", "CreateProcess"],
      ["waitpid", "WaitForSingleObject"],
      ["exit", "ExitProcess"],
      ["open", "CreateFile"],
      ["lseek", "SetFilePointer"],
      ["unlink", "DeleteFile"]
    ],
    "explain": "Also close → CloseHandle, read → ReadFile, write → WriteFile, stat → GetFileAttributesEx, mkdir → CreateDirectory, chdir → SetCurrentDirectory, time → GetLocalTime. [The Win32 API against UNIX](#/comp4736-p5/win32-api)"
  },
  {
    "q": "Select every UNIX call that has no Win32 equivalent on the slide.",
    "options": ["execve", "link", "mount", "kill", "fork", "unlink", "open"],
    "answer": [0, 1, 2, 3],
    "explain": "(none) rows: execve (CreateProcess = fork + execve), link (no links), mount and umount (no mount), chmod (no security, although NT does), kill (no signals). unlink is DeleteFile. [The Win32 API against UNIX](#/comp4736-p5/win32-api)"
  }
]
```

## Twenty names from their definitions

```quiz
[
  { "type": "text", "q": "Processes that stay in the background to handle some activity such as email, Web pages, news or printing.", "answer": ["daemon", "daemons"], "explain": "Part 3 slide 11. [Process creation](#/comp4736-p3/process-creation)" },
  { "type": "text", "q": "A terminated child whose parent has not waited for it; it still lives in the system's task list.", "answer": ["zombie", "zombie process", "defunct", "defunct process"], "explain": "Part 3 slide 63; ps shows it as Z. [Zombie and orphan processes](#/comp4736-p3/zombies-and-orphans)" },
  { "type": "text", "q": "The process that adopts an orphan: the parent of all the processes, with pid 1.", "answer": ["init", "init process"], "explain": "Part 3 slide 67; in the slide's container the PID-1 process is tini. [Zombie and orphan processes](#/comp4736-p3/zombies-and-orphans)" },
  { "type": "text", "q": "The unique number that identifies every file in UNIX, an index into the table of i-nodes.", "answer": ["i-number", "inumber", "i number"], "explain": "Part 1 slide 80; a directory is a file of (i-number, ASCII name) pairs. [Files](#/comp4736-p1/os-zoo-processes-files)" },
  { "type": "text", "q": "The instruction executed in step 6 that switches from user mode to kernel mode.", "answer": ["TRAP", "trap", "trap instruction", "TRAP instruction"], "explain": "Part 5 slide 19. [The eleven steps](#/comp4736-p5/eleven-steps)" },
  { "type": "text", "q": "The data structure that represents a single process; a crucial component within the process table (abbreviation).", "answer": ["PCB", "process control block"], "explain": "Part 3 slide 31: a context switch saves the running process's context into its PCB. [The process table and the PCB](#/comp4736-p3/process-table)" },
  { "type": "text", "q": "The location, typically at a fixed place near the bottom of memory, associated with each I/O class and holding the handler's address.", "answer": ["interrupt vector", "interrupt vector table"], "explain": "Part 3 slide 41: the hardware loads the new program counter from the interrupt vector. [Interrupts](#/comp4736-p3/interrupts)" },
  { "type": "text", "q": "The other name for a virtual machine monitor.", "answer": ["hypervisor"], "explain": "Part 2 slide 24: type 1 on the hardware (ESXi), type 2 on a host OS (VirtualBox). [Virtual machines](#/comp4736-p2/virtual-machines)" },
  { "type": "text", "q": "The periodic interrupts of a clock in square-wave mode.", "answer": ["clock ticks", "clock tick", "ticks"], "explain": "Part 2 slide 31. [Clock hardware](#/comp4736-p2/clock-hardware)" },
  { "type": "text", "q": "A timer that detects and recovers from crashes and infinite loops, e.g. resets an embedded system that stops running.", "answer": ["watchdog timer", "watchdog", "watchdog timers"], "explain": "Part 2 slide 40, the clock driver's fifth duty. [Watchdog timers](#/comp4736-p2/alarms-and-watchdogs)" },
  { "type": "text", "q": "The other name for a thread.", "answer": ["lightweight process", "light weight process", "light-weight process"], "explain": "Part 4 slide 1: a flow of execution with its own program counter, system registers and stack. [What is a thread](#/comp4736-p4/what-is-a-thread)" },
  { "type": "text", "q": "A thread the system creates when a message arrives, to handle that message.", "answer": ["pop-up thread", "popup thread", "pop up thread"], "explain": "Part 4 slide 50: brand new, no history to restore, so quick to create. [Pop-up threads](#/comp4736-p4/pop-up-threads)" },
  { "type": "text", "q": "The collection of procedures that manage user-level threads, e.g. pthread_create and pthread_yield.", "answer": ["run-time system", "runtime system", "run time system"], "explain": "Part 4 slide 25; it also manages each process's thread table. [Threads in user space](#/comp4736-p4/user-vs-kernel-threads)" },
  { "type": "text", "q": "What an OS provides so that C programs can make system calls, because the calls themselves often must be written in assembly.", "answer": ["procedure library", "a procedure library"], "explain": "Part 5 slide 2. [The system-call interface](#/comp4736-p5/system-call-interface)" },
  { "type": "text", "q": "The rapid switching of the CPU back and forth among processes.", "answer": ["multiprogramming"], "explain": "Part 3 slide 7: at any one instant the CPU runs only one process, for tens or hundreds of milliseconds each. [A process is a program in execution](#/comp4736-p3/process-model)" },
  { "type": "text", "q": "The software that talks to a controller, giving it commands and accepting responses; it runs in kernel mode.", "answer": ["device driver", "driver"], "explain": "Part 1 slide 64. A disk needs a driver; registers, cache and main memory do not. [Controllers and drivers](#/comp4736-p1/io-devices)" },
  { "type": "text", "q": "A sort of pseudofile that connects two processes, one's output becoming the other's input.", "answer": ["pipe"], "explain": "Part 1 slide 85. [Files, mount, pipes](#/comp4736-p1/os-zoo-processes-files)" },
  { "type": "text", "q": "The system call that attaches a file system (a CD-ROM, a USB disk) to the root file system at a directory.", "answer": ["mount"], "explain": "Part 1 slide 84, Part 5 slide 47; nearly always on an empty directory. [link and mount](#/comp4736-p5/links-and-mount)" },
  { "type": "text", "q": "The OS table, an array of structures with one entry per process.", "answer": ["process table"], "explain": "Part 3 slide 30: the entry holds what must be saved so the process can be restarted as if it had never been stopped. [The process table](#/comp4736-p3/process-table)" },
  { "type": "text", "q": "Saving the state of the running process and loading the saved state of another so that it can resume.", "answer": ["context switch", "context switching"], "explain": "Part 3 slide 31: save P1 state, restore P2 state, and back. [The context switch](#/comp4736-p3/process-table)" }
]
```

## The same facts as tables

### Part 1

| Fact | Value |
|---|---|
| Six levels, top to bottom | 5 high-level language, 4 assembly, 3 OS, 2 ISA, 1 microarchitecture, 0 digital |
| An OS is | a software; an extended machine; a resource manager |
| Resource-manager views | top down: abstractions; bottom up: manage pieces; alternative: orderly, controlled allocation |
| Sharing | CPU and printer in time; RAM and disk in space |
| Rings | 0 kernel; 1 and 2 OS services (drivers); 3 user, relies on system calls |
| CPU parts | ALU, control unit, registers |
| RISC / CISC | AVR, ARM, MIPS, hardwired / AMD, Pentium, VAX, microprogrammed |
| Pipelined | Tp = max tᵢ; throughput 1/Tp; delay n Tp |
| Not pipelined | Tp = Σ tᵢ; throughput 1/Tp; delay Tp |
| Car factory | 4 h station: 1 car / 4 h; 1 h, 1 h, 2 h stations: 1 car / 2 h, latency 6 h |
| Memory hierarchy | registers 1 nsec, cache 2 nsec, main memory 10 nsec, disk 10 msec |
| Registers | PC: next instruction's address; SP: top of stack; PSW: condition codes, priority, mode |
| Cache | lines = size ÷ line size; sets = lines ÷ ways; CI = MI % lines; L1D 1024 lines, 128 sets |
| Replacement | LRU, FIFO, LFU, Random, Clock |
| Disk | next cylinder 1 msec; random 5–10 msec; rotation 5–10 msec; 50–160 MB/sec |
| I/O | busy waiting (CPU polls), interrupt (caller blocked), DMA (chip copies, then interrupts) |
| Buses | SCSI 640 MB/sec; USB no reboot; PCI internal synchronous; PCI-Express lanes to a switch |
| File types | - regular, d directory, c character, b block, s socket, p named pipe, l symbolic link |
| rwx | owner, group, others; r 4, w 2, x 1 |

### Part 2

| Fact | Value |
|---|---|
| Monolithic parts | main program, service procedures, utility procedures |
| Examples | monolithic Linux, Windows; layered THE, MS-DOS; microkernel MINIX 3, L4; type 1 ESXi; type 2 VirtualBox |
| Clock components | crystal oscillator, counter, holding register |
| Modes | one-shot: stops after one interrupt; square-wave: repeats, clock ticks |
| 500 MHz, 32 bits | 2 nsec to 8.6 sec |
| Register value | quantum ÷ period (40 ms ÷ 2 ns = 20 000 000) |
| Six duties | time of day; prevent overruns (quantum); CPU accounting; alarms; watchdog timers; profiling |
| 60 Hz, 32 bits | ticks overflow in 2.274 years; seconds last 136 years |
| Alarm list | differences from the previous entry: 3 → 4 → 6 → 2 → 1 |

### Part 3

| Fact | Value |
|---|---|
| Creation | system initialization; process-creation system call; user request; batch job |
| Termination | normal exit, error exit (voluntary); fatal error, killed by another process (involuntary) |
| States | Running, Ready, Blocked |
| Transitions | 1 Running → Blocked; 2 Running → Ready; 3 Ready → Running; 4 Blocked → Ready |
| Utilization | 1 − pⁿ; slide 46 says at least 10 processes (0.8¹⁰ ≈ 0.1074); arithmetic says 11 (0.8¹¹ ≈ 0.0859) |
| fork returns | −1 fails; 0 in the child; child's pid in the parent |
| Linux regions | text, data, BSS, heap, stack, kernel space |
| ps letters | D uninterruptible, I idle, R running, S interruptible, T stopped, X dead, Z zombie |
| Orphan | adopted by init, pid 1 |

### Part 4

| Fact | Value |
|---|---|
| Per thread | program counter, registers, stack, state |
| Per process | address space, global variables, open files, child processes, pending alarms, signals and handlers, accounting |
| Thread creation | 10–100 times faster than a process |
| User-level problems | blocking system calls stop all threads; no clock interrupts within a process |
| Mappings | many to one: no true concurrency; one to one: true concurrency, overhead; many to many: equal or fewer kernel threads |
| Pthreads | create, exit, join, yield, attr_init, attr_destroy |

### Part 5

| Fact | Value |
|---|---|
| Interrupt classes | external asynchronous (mouse, key); internal synchronous (1/0); software synchronous (system calls) |
| fds | stdin 0, stdout 1, stderr 2 |
| x86 convention | number in EAX, arguments in EBX, ECX, …, int 80h, result in EAX |
| Eleven steps | 1–3 push in reverse order, 4 call, 5 number in register, 6 TRAP, 7 dispatch, 8 handler, 9 return to library, 10 return to program, 11 clean stack |
| Return names | pid, fd, n, position, seconds; s = −1 on error |
| Win32 | fork CreateProcess; waitpid WaitForSingleObject; exit ExitProcess; open CreateFile; lseek SetFilePointer; unlink DeleteFile |
| No Win32 | execve, link, mount, umount, chmod, kill |

Each Part's own drill asks the rest: [Part 1](#/comp4736-p1/recall-drill-1), [Part 2](#/comp4736-p2/recall-drill-2), [Part 3](#/comp4736-p3/recall-drill-3), [Part 4](#/comp4736-p4/recall-drill-4), [Part 5](#/comp4736-p5/recall-drill-5).

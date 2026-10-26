---
title: Recall drill, Part 1 (closed book)
minutes: 30
---

The midterm allows no notes, so every list, ring number and figure from Part 1 has to come from memory. Answer each block before you look at the tables at the end. In the fill-in blanks, type words exactly as the slide capitalises them; the stem says when the case matters.

## Levels, the OS, kernel and user mode (slides 2–23)

```quiz
[
  {
    "type": "reorder",
    "q": "Put the six levels of the multilevel machine in order, top (Level 5) to bottom (Level 0).",
    "lines": [
      "Level 5: High programming language level",
      "Level 4: Assembly language level",
      "Level 3: Operating System (OS) level",
      "Level 2: Instruction Set Architecture (ISA) level",
      "Level 1: Microarchitecture level",
      "Level 0: Digital level"
    ],
    "explain": "Slide 2. From the top: high-level language (Java, Python, C++), assembly (human readable, hard to work with), OS (memory management, processes execution, system resource protection), ISA (the basic operations a computer must support), microarchitecture (ALU, registers, microprograms execute the machine code), digital (transistors; AND, OR, NOT). See [the six-level machine](#/comp4736-p1/multilevel-machines)."
  },
  {
    "type": "fill",
    "q": "Slide 3: the three gates that are the building blocks of any digital circuits (capitals, in the slide's order).",
    "code": "___, ___, and ___ are the building blocks of any digital circuits",
    "answer": ["AND", "OR", "NOT"],
    "explain": "Level 0, the digital level: *Device level made of transistors and in turn transistors are made of semiconductors.*"
  },
  {
    "type": "fill",
    "q": "Slide 12: the three things an operating system is (lowercase).",
    "code": "1. A ___\n2. An extended ___\n3. A resource ___ that provides many abstraction layers",
    "answer": ["software", "machine", "manager"],
    "explain": "Slide 12, with the hard-drive example: reading a track needs many steps, and the OS abstraction is `read(int fd, void *buf, size_t count)`. See [software, extended machine, resource manager](#/comp4736-p1/what-the-os-is)."
  },
  {
    "type": "match",
    "q": "Match each view of the OS as a resource manager to its sentence on slide 21.",
    "pairs": [
      ["Top down view", "Provide abstractions to application programs"],
      ["Bottom up view", "Manage pieces of complex system"],
      ["Alternative view", "Provide orderly, controlled allocation of resources"]
    ],
    "explain": "Slide 21. The extended-machine role is slide 20's separate sentence: *Operating systems turn ugly hardware into beautiful abstractions*."
  },
  {
    "type": "fill",
    "q": "Slide 23: how each resource is shared (lowercase, one word each).",
    "code": "CPU     -> ___ sharing\nRAM     -> ___ sharing\nDisk    -> ___ sharing\nPrinter -> ___ sharing",
    "answer": ["time", "space", "space", "time"],
    "explain": "Slide 22: sharing *in time and in space*, e.g. multiprogramming, where each program gets a fair amount of time and memory space, and sharing a printer."
  },
  {
    "type": "text",
    "q": "Kernel mode is also called ________ mode.",
    "answer": ["supervisor", "supervisor mode"],
    "explain": "Slide 16. In kernel mode the OS *has complete access to all the hardware and can execute any instruction the machine is capable of executing*. User mode has only a subset; instructions that affect control of the machine or do Input/Output are forbidden. See [kernel mode, user mode and the rings](#/comp4736-p1/kernel-and-user-mode)."
  },
  {
    "type": "fill",
    "q": "Slide 18: the ring numbers of the Intel x86 privilege levels.",
    "code": "Ring ___ (Kernel Mode): most privileged, the OS kernel\nRing ___ and ___ : Operating System Services (Device Drivers, Etc.)\nRing ___ (User Mode): least privileged, relies on system calls",
    "answer": ["0", "1", "2", "3"],
    "explain": "Slide 17 draws them as concentric circles, Ring 0 at the centre. Slide 18 also says device drivers run in Ring 0, so it puts drivers in two places; Windows and Linux in practice use only Rings 0 and 3."
  },
  {
    "type": "text",
    "q": "What does Ring 3 code rely on to request services from the operating system? (two words)",
    "answer": ["system calls", "system call", "syscalls", "a system call"],
    "explain": "Slide 18: Ring 3 *can't execute privileged instructions directly or access hardware resources directly. Instead, it relies on system calls to request services from the operating system.*"
  }
]
```

## The CPU, pipelining and parallel processors (slides 24–45)

```quiz
[
  {
    "type": "fill",
    "q": "The three parts of the CPU on slide 26 (capitalised as the slide writes them).",
    "code": "CPU = ___ + Control ___ + ___",
    "answer": ["ALU", "Unit", "Registers"],
    "explain": "ALU, Control Unit and Registers. The ALU is made of logic gates and does arithmetic and logic; data storage is not an ALU operation. See [ALU, control unit, registers](#/comp4736-p1/cpu)."
  },
  {
    "type": "fill",
    "q": "Slide 30: the ALU computes B − A as (one letter, then one digit).",
    "code": "B - A = B + NOT(___) + ___",
    "answer": ["A", "1"],
    "explain": "With A = 3 = 00000011 and B = 4 = 00000100: 00000100 + 11111100 + 1 = 100000001, result 00000001 = 1 with a carry out of 1. Control bits F0, F1, ENA, ENB, INVA, INC are all 1."
  },
  {
    "type": "reorder",
    "q": "Put slide 31's path from source code to execution in order.",
    "lines": [
      "High-level code (C++, Java, JavaScript)",
      "Compiler",
      "Machine code",
      "Memory",
      "Registers in the CPU",
      "Control Unit (microprogram or hardwired) decodes",
      "ALU executes"
    ],
    "explain": "Slide 31, *Fetch-Decode-Execute*: the compiler produces machine code that sits in memory; the CPU fetches it into registers, the control unit decodes it, the ALU executes, and the result goes back to the registers."
  },
  {
    "type": "fill",
    "q": "Slide 32: complete the RISC and CISC columns (names in capitals; the approach capitalised).",
    "code": "RISC: AVR, ARM, ___     -> ___ Approach\nCISC: AMD, Pentium, ___ -> ___ Approach",
    "answer": ["MIPS", "Hardwired", "VAX", "Microprogrammed"],
    "explain": "RISC: AVR, ARM, MIPS, hardwired. CISC: AMD, Pentium, VAX, microprogrammed."
  },
  {
    "type": "fill",
    "q": "Slide 33: the three ways processor performance is improved (one word per blank, capitalised).",
    "code": "1. Instruction-Level Parallelism (___)\n2. Multithreading and ___ Chips\n3. Multiprocessors and Multi-___",
    "answer": ["Pipelining", "Multicore", "computers"],
    "explain": "Slide 33. Pipelining is slides 34-42, multithreading and multicore slides 43-44, multiprocessors and multicomputers slide 45. See [pipelining](#/comp4736-p1/pipelining)."
  },
  {
    "type": "reorder",
    "q": "Put the five stages of slide 34's pipeline in order, S1 to S5.",
    "lines": [
      "S1 Instruction fetch unit",
      "S2 Instruction decode unit",
      "S3 Operand fetch unit",
      "S4 Instruction execution unit",
      "S5 Write back unit"
    ],
    "explain": "Slide 34 (a). In (b), instruction 1 reaches S5 at clock cycle 5, and from then one instruction finishes every cycle."
  },
  {
    "type": "fill",
    "q": "The car factory (slides 35-38): fill in the hours.",
    "code": "One station, 4 hours:        Cycle Time = every ___ hours 1 car\nS1 1 h, S2 1 h, S3 2 h:      Cycle Time = every ___ hours 1 car\nLatency for each car = 2 + 2 + 2 = ___ hours",
    "answer": ["4", "2", "6"],
    "explain": "The slowest station (2 h) sets the cycle time, and each car spends one cycle in each of the 3 stations. The pipelined line is faster in throughput, though one car takes 6 h instead of 4 h."
  },
  {
    "type": "fill",
    "q": "Slides 39-40: the pipeline formulas (lowercase `max`, then the letter for the number of stages).",
    "code": "Pipelined:      Tp = ___{t1, t2, ..., tn}   Throughput = 1/Tp   Delay = ___ Tp\nNo pipelining:  Tp = t1 + t2 + ... + tn      Throughput = 1/Tp   Delay = Tp",
    "answer": ["max", "n"],
    "explain": "The practice paper's 3/3/5 ns pipeline: Tp = 5 ns, 1/5 ns = 200 million instructions per second, delay 3 × 5 = 15 ns."
  },
  {
    "type": "text",
    "q": "In slide 42's superscalar CPU, the two decode units feed a ________ before the three execute units.",
    "answer": ["holding buffer", "a holding buffer"],
    "explain": "The three execute units are integer arithmetic, floating-point arithmetic and Boolean operations. Slide 41's superscalar processor has five functional units in S4: ALU, ALU, LOAD, STORE, floating point."
  },
  {
    "type": "match",
    "q": "Match each slide 44-45 figure to what it shows.",
    "pairs": [
      ["Intel quad-core chip", "four cores sharing one L2 cache"],
      ["AMD quad-core chip", "four cores, each with its own L2 cache"],
      ["Multiprocessor", "several CPUs and one shared memory on a single bus"],
      ["Multicomputer", "several CPUs, each with its own local memory"]
    ],
    "explain": "Slide 43: multithreading lets the CPU hold the state of two threads and switch on a nanosecond time scale; multicore chips have four, eight or more cores (Intel Xeon Phi, Tilera TilePro with more than 60). See [multithreading and multicore](#/comp4736-p1/parallel-processors)."
  }
]
```

## Memory, registers and cache (slides 46–58)

```quiz
[
  {
    "type": "fill",
    "q": "Slide 46's memory hierarchy: typical access time and capacity (numbers only).",
    "code": "Registers      ___ nsec   < 1 KB\nCache          ___ nsec   ___ MB\nMain memory    ___ nsec   1-8 GB\nMagnetic disk  ___ msec   1-4 TB",
    "answer": ["1", "2", "4", "10", "10"],
    "explain": "Registers are the fastest memory. The disk's 10 is in msec, a million times the main memory's 10 nsec. See [the memory hierarchy and registers](#/comp4736-p1/memory-and-registers)."
  },
  {
    "type": "match",
    "q": "Match each register on slide 47 to its role.",
    "pairs": [
      ["PC (program counter)", "contains the memory address of the next instruction to be fetched"],
      ["Stack pointer", "points to the top of the current stack in memory"],
      ["PSW (Program Status Word)", "condition code bits, CPU priority, the mode (user or kernel) and other control bits"]
    ],
    "explain": "User programs may normally read the entire PSW but typically may write only some of its fields; the PSW plays an important role in system calls and I/O."
  },
  {
    "type": "match",
    "q": "Match each EFLAGS flag to its bit position (slides 48-49).",
    "pairs": [
      ["CF, carry flag", "bit 0"],
      ["PF, parity flag", "bit 2"],
      ["AF, auxiliary carry flag", "bit 4"],
      ["ZF, zero flag", "bit 6"],
      ["SF, sign flag", "bit 7"],
      ["IF, interrupt enable flag", "bit 9"],
      ["OF, overflow flag", "bit 11"],
      ["IOPL, I/O privilege level", "bits 12 and 13"]
    ],
    "explain": "CF: carry or borrow out of the most-significant bit, unsigned overflow. PF: even number of 1 bits in the low byte. AF: carry out of bit 3, for BCD. ZF: result is zero. SF: equals the sign bit. OF: signed overflow. Bit 1 is reserved and always 1, which is why 0x246 means PF, ZF and IF are set."
  },
  {
    "type": "fill",
    "q": "Slide 51's L1D example, the CPU-Z numbers (numbers only).",
    "code": "Total L1D = 32 KB x ___ = 64 KB\nNumber of cache lines = 64 KB / ___ B = ___\nNumber of sets = 1024 / ___ = ___",
    "answer": ["2", "64", "1024", "8", "128"],
    "explain": "Lines = cache size / line size; sets = lines / ways (8-way set associative). The slide adds both cores' L1D; one core alone would be 512 lines and 64 sets. See [cache lines and direct mapping](#/comp4736-p1/cache-mapping)."
  },
  {
    "type": "text",
    "q": "Direct mapping (slide 54): CI = MI % (________). Name what MI is divided by.",
    "answer": ["# of cache lines", "number of cache lines", "the number of cache lines", "cache lines", "lines", "# cache lines", "no. of cache lines"],
    "explain": "With 4 lines: 3 % 4 = 3, 10 % 4 = 2, 13 % 4 = 1. The slide-55 trace 9 2 3 0 12 12 7 0 6 4 6 1 7 2 14 gives 12 misses and 3 hits, an 80 % miss rate."
  },
  {
    "type": "fill",
    "q": "Slide 52: a 64-byte line and memory address 260 (numbers only).",
    "code": "260 is pulled in with line ___, which holds bytes ___ to ___",
    "answer": ["4", "256", "319"],
    "explain": "⌊260 / 64⌋ = 4, numbering lines from 0; 4 × 64 = 256 to 5 × 64 − 1 = 319, and the address is at offset 4."
  },
  {
    "type": "fill",
    "q": "Slide 53: the three mapping techniques (one capitalised word per blank).",
    "code": "1. ___ mapping\n2. ___ mapping\n3. Set - ___ mapping",
    "answer": ["Direct", "Associative", "Associative"],
    "explain": "Direct, associative, set-associative. The CPU-Z caches are all set associative (8-way L1, 4-way L2, 12-way L3)."
  },
  {
    "type": "reorder",
    "q": "Put slide 57's four caching system issues in order, A to D.",
    "lines": [
      "A. When to put a new item into the cache.",
      "B. Which cache line to put the new item in.",
      "C. Which item to remove from the cache when a slot is needed.",
      "D. Where to put a newly evicted item in the larger memory."
    ],
    "explain": "Put it in, place it, choose what to evict, store the evicted item. Issue C is what the replacement algorithms decide."
  },
  {
    "type": "fill",
    "q": "Slide 57's five cache replacement algorithms (capitalised words).",
    "code": "1. Least ___ Used (LRU)\n2. First In First ___ (FIFO)\n3. Least ___ Used (LFU)\n4. ___\n5. ___ algorithm",
    "answer": ["Recently", "Out", "Frequently", "Random", "Clock"],
    "explain": "The slide names them only; it does not define them."
  },
  {
    "type": "fill",
    "q": "Slide 58: three ways of organising a 96-bit memory (numbers only).",
    "code": "(a) ___ cells of 8 bits\n(b) 8 cells of ___ bits\n(c) ___ cells of 16 bits",
    "answer": ["12", "12", "6"],
    "explain": "12 × 8 = 8 × 12 = 6 × 16 = 96. The basic unit of memory is the bit {0, 1}; 1 byte = 8 bits; a word is 1, 2, … bytes."
  }
]
```

## Disks, I/O and buses (slides 59–72)

```quiz
[
  {
    "type": "fill",
    "q": "Slide 59: disk rotation speeds in RPM (numbers only, no commas).",
    "code": "5400, 7200, ___ RPM or more",
    "answer": ["10800", "10,800"],
    "explain": "One or more metal platters; a mechanical arm pivots over them from the corner; the outer cylinders contain more sectors than the inner ones. See [disks and SSDs](#/comp4736-p1/disks)."
  },
  {
    "type": "numeric",
    "q": "Slide 60: moving the arm from one cylinder to the next takes about how many msec?",
    "answer": 1,
    "tolerance": 0,
    "unit": "msec",
    "explain": "Next cylinder ≈ 1 msec; a random cylinder 5 to 10 msec; rotational delay 5 to 10 msec more."
  },
  {
    "type": "fill",
    "q": "Slide 60: the transfer rates once the sector is under the head (numbers only).",
    "code": "___ MB/sec on low-end disks to ___ MB/sec on faster ones",
    "answer": ["50", "160"],
    "explain": "SSDs (slide 61) have no moving parts, store data in flash memory and keep it when the power is off."
  },
  {
    "type": "fill",
    "q": "Slide 64: a minimal disk controller's registers (lowercase).",
    "code": "disk ___, memory ___, sector ___, and ___ (read or write)",
    "answer": ["address", "address", "count", "direction"],
    "explain": "The driver gets a command from the OS and translates it into values written to these registers. The driver *has to be put into the operating system so it can run in kernel mode*. See [controllers, drivers and the three ways to do I/O](#/comp4736-p1/io-devices)."
  },
  {
    "type": "text",
    "q": "The software that talks to a controller, giving it commands and accepting responses, is called a ________.",
    "answer": ["device driver", "driver"],
    "explain": "Slide 63: an I/O unit is a mechanical component plus an electronic component, the device controller or adapter, *a chip or a set of chips that physically controls the device*."
  },
  {
    "type": "fill",
    "q": "Slides 65-66: the three ways to do input and output (capitals as the slide writes them).",
    "code": "1. ___ waiting\n2. Using ___\n3. Use of special hardware e.g. ___ (Direct Memory Access)",
    "answer": ["Busy", "interrupt", "DMA"],
    "explain": "Busy waiting ties up the CPU polling; with an interrupt the OS blocks the caller and looks for other work; with DMA the CPU sets up the chip, lets it go, and is interrupted when it is done."
  },
  {
    "type": "reorder",
    "q": "Put slide 68's interrupt processing in order.",
    "lines": [
      "1. Interrupt (during the current instruction)",
      "2. Dispatch to handler",
      "3. Return (to the next instruction)"
    ],
    "explain": "*Interrupt processing involves taking the interrupt, running the interrupt handler, and returning to the user program.*"
  },
  {
    "type": "match",
    "q": "Match each bus to the slide's sentence about it (slides 70-71).",
    "pairs": [
      ["SCSI", "high-performance, mostly in servers and workstations, up to 640 MB/sec"],
      ["USB", "a device functions immediately, without requiring a reboot"],
      ["DMI", "links the processor package to the Platform Controller Hub"],
      ["PCI", "an internal synchronous bus for adapters such as sound and network cards"],
      ["PCI-Express", "a devoted path, called a lane, to a single chip known as a switch"]
    ],
    "explain": "Slide 70 gives DMI (Direct Media Interface) no description; its place in slide 69's x86 figure is the link between the processor and the Platform Controller Hub. PCI-Express is not a shared bus; each lane sends and receives. See [buses](#/comp4736-p1/buses)."
  }
]
```

## The OS zoo, processes, files and protection (slides 73–88)

```quiz
[
  {
    "type": "match",
    "q": "Match each category in the OS zoo to the slide's example or description.",
    "pairs": [
      ["Mainframe", "OS/390; batch, transaction processing and timesharing"],
      ["Server", "Solaris, FreeBSD, Windows Server 201x"],
      ["Multiprocessor", "Windows and Linux, with no description on the slide"],
      ["Personal computer", "Windows 7, Windows 8, Apple's OS X"],
      ["Handheld computer", "Android and Apple's iOS"],
      ["Embedded", "QNX and VxWorks; no user-installed software"],
      ["Sensor node", "TinyOS"],
      ["Real-time", "eCos; time as a key parameter"],
      ["Smart card", "a Java Virtual Machine interpreter in ROM"]
    ],
    "explain": "Slides 73-76, nine categories. Linux appears under mainframe, server, multiprocessor and personal computer, so it cannot identify one. See [the OS zoo, processes and files](#/comp4736-p1/os-zoo-processes-files)."
  },
  {
    "type": "text",
    "q": "The OS table that holds all the information about each process other than its address space, an array of structures, is the ________.",
    "answer": ["process table", "the process table"],
    "explain": "Slide 77: a process is a *program in execution*, associated with an address space and a set of resources, a container for everything needed to run the program."
  },
  {
    "type": "fill",
    "q": "Slide 78: a UNIX process's three segments and how two of them grow (lowercase).",
    "code": "___ segment (the program code), ___ segment (the variables), ___ segment\nThe data segment grows ___ and the stack grows ___",
    "answer": ["text", "data", "stack", "upward", "downward"],
    "explain": "From address FFFF down: stack, gap, data, text at 0000. On the stack figure the top of stack moves from 100 down to 97."
  },
  {
    "type": "text",
    "q": "Every file in UNIX has a unique number that is an index into a table of i-nodes. What is it called?",
    "answer": ["i-number", "inumber", "i number", "inode number", "i-node number"],
    "explain": "Slide 80: the i-node tells who owns the file, where its disk blocks are, and so on. A directory is a file of (i-number, ASCII name) pairs; `ls -i` prints the i-numbers."
  },
  {
    "type": "text",
    "q": "If the permissions allow a file to be opened, the system returns a small integer to use in subsequent operations. What is it called?",
    "answer": ["file descriptor", "a file descriptor", "fd"],
    "explain": "Slide 82. If access is prohibited, an error code is returned instead."
  },
  {
    "type": "text",
    "q": "Which system call attaches the CD-ROM's file system to the root file system wherever the program wants it?",
    "answer": ["mount", "mount()"],
    "explain": "Slide 84: *File systems are nearly always mounted on empty directories.*"
  },
  {
    "type": "text",
    "q": "A sort of pseudofile that can be used to connect two processes is a ________.",
    "answer": ["pipe", "a pipe"],
    "explain": "Slide 85: one process generates output that another uses as input. Slide 86's `cat test.txt | tr … | sort | uniq -c | sort -rn` counts word frequencies through five pipes."
  },
  {
    "type": "fill",
    "q": "Slide 87: the UNIX protection code (lowercase).",
    "code": "a ___-bit code: three 3-bit fields, one for the ___,\none for other members of the owner's ___, and one for everyone ___.\nEach field has a bit for read, write and execute: the ___ bits.",
    "answer": ["9", "owner", "group", "else", "rwx"],
    "explain": "Each field is one octal digit: r = 4, w = 2, x = 1. `rw-r--r--` is 644; `rwxr-xr-x` is 755."
  },
  {
    "type": "match",
    "q": "Match each Linux file-type letter to its type (slide 88).",
    "pairs": [
      ["-", "regular file"],
      ["d", "directory"],
      ["c", "character device file"],
      ["b", "block device file"],
      ["s", "local socket file"],
      ["p", "named pipe"],
      ["l", "symbolic link"]
    ],
    "explain": "The letter is the first character of an `ls -l` line; the nine protection bits follow it."
  }
]
```

## The same facts as tables

### Levels, OS roles, rings

| Level | Name | Slide sentence |
|---|---|---|
| 5 | High programming language | Java, Python, C++ |
| 4 | Assembly language | human readable, hard to work with, time consuming, many lines |
| 3 | Operating System | memory management, processes execution, system resource protection |
| 2 | ISA | the basic operations a computer must support, not the implementation |
| 1 | Microarchitecture | machine code executed with ALU, registers, microprograms |
| 0 | Digital | transistors, semiconductors; AND, OR, NOT |

| Fact | Value |
|---|---|
| An OS is | a software; an extended machine; a resource manager |
| Resource-manager views | top down: abstractions; bottom up: manage pieces; alternative: orderly, controlled allocation |
| Time sharing / space sharing | CPU, printer / RAM, disk |
| Kernel mode | also supervisor mode; complete access, any instruction |
| User mode | subset of instructions; no machine control, no I/O |
| Rings | 0 kernel; 1 and 2 OS services (device drivers); 3 user, relies on system calls |

### CPU and pipelining

| Fact | Value |
|---|---|
| CPU parts | ALU, Control Unit, Registers |
| B − A | B + NOT(A) + 1; F0 F1 ENA ENB INVA INC all 1 |
| Slide 31 path | high-level code → compiler → machine code → memory → registers → control unit → ALU |
| RISC | AVR, ARM, MIPS; hardwired |
| CISC | AMD, Pentium, VAX; microprogrammed |
| Performance improvements | pipelining; multithreading and multicore; multiprocessors and multicomputers |
| Five stages | instruction fetch, instruction decode, operand fetch, instruction execution, write back |
| Pipelined | $T_p = \max\{t_i\}$, throughput $1/T_p$, delay $nT_p$ |
| Not pipelined | $T_p = \sum t_i$, throughput $1/T_p$, delay $T_p$ |
| Car factory | 1 car per 4 h → 1 car per 2 h; latency 2 + 2 + 2 = 6 h |
| Superscalar | holding buffer before integer, floating-point and Boolean units |
| Multithreading | two thread states, switch on a nanosecond time scale |
| Intel / AMD quad-core | shared L2 / separate L2 |
| Multiprocessor / multicomputer | shared memory / local memories |

### Memory and cache

| Level | Access time | Capacity |
|---|---|---|
| Registers | 1 nsec | < 1 KB |
| Cache | 2 nsec | 4 MB |
| Main memory | 10 nsec | 1-8 GB |
| Magnetic disk | 10 msec | 1-4 TB |

| Fact | Value |
|---|---|
| PC / SP / PSW | next instruction's address / top of the stack / condition codes, priority, mode |
| EFLAGS bits | CF 0, PF 2, AF 4, ZF 6, SF 7, IF 9, OF 11, IOPL 12-13 |
| Lines | cache size ÷ line size: 64 KB ÷ 64 B = 1024 |
| Sets | lines ÷ ways: 1024 ÷ 8 = 128 |
| Address → line | ⌊address ÷ line size⌋: 260 → line 4 (256-319) |
| Direct mapping | CI = MI % (# of cache lines); slide trace 12 misses, 3 hits |
| Mapping techniques | direct, associative, set-associative |
| Caching issues | A when to put in; B which line; C which to remove; D where the evicted item goes |
| Replacement | LRU, FIFO, LFU, Random, Clock |
| 96-bit memory | 12 × 8, 8 × 12, 6 × 16 |

### Disks, I/O, buses

| Fact | Value |
|---|---|
| RPM | 5400, 7200, 10 800 or more |
| Arm | next cylinder ≈ 1 msec; random 5-10 msec |
| Rotational delay | 5-10 msec |
| Transfer | 50 MB/sec (low-end) to 160 MB/sec |
| SSD | no moving parts, flash, keeps data without power |
| Controller registers | disk address, memory address, sector count, direction |
| I/O methods | busy waiting (CPU polls); interrupt (OS finds other work); DMA (chip transfers, then interrupts) |
| Interrupt processing | interrupt → dispatch to handler → return to next instruction |
| SCSI / USB / DMI / PCI / PCI-Express | 640 MB/sec, servers / no reboot / processor to hub / internal synchronous / lanes to a switch |

### OS zoo, processes, files, protection

| Category | Example |
|---|---|
| Mainframe | OS/390, Linux; batch, transaction processing, timesharing |
| Server | Solaris, FreeBSD, Linux, Windows Server 201x |
| Multiprocessor | Windows, Linux |
| Personal computer | Linux, FreeBSD, Windows 7, Windows 8, OS X |
| Handheld | Android, iOS |
| Embedded | Embedded Linux, QNX, VxWorks; no user-installed software |
| Sensor node | TinyOS |
| Real-time | eCos |
| Smart card | JVM |

| Fact | Value |
|---|---|
| Process | program in execution; address space; process table = array of structures |
| Segments | text (code), data (variables, grows up), stack (grows down) |
| Files | logical units of information created by processes |
| i-number | index into the table of i-nodes |
| Directory | file of (i-number, ASCII name) pairs |
| open | file descriptor, or an error code |
| mount | nearly always on empty directories |
| pipe | pseudofile connecting two processes |
| Protection | 9 bits: owner, group, others; rwx = 4, 2, 1 |
| Type letters | - regular, d directory, c character device, b block device, s local socket, p named pipe, l symbolic link |

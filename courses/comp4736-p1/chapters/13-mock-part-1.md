---
title: Mock midterm, Part 1 material
minutes: 40
---

The midterm's Part 1 is T/F and MCQ in LockDown Browser; its Part 2 is written arithmetic. This mock covers lecture Part 1 only, in that shape: short stems that each test one slide fact, then the calculations the written paper asks. The practice paper's own questions are in the Midterm module, so every item here is a new wording or a new set of numbers. Closed book, as the real one: no notes, a calculator only.

```quiz
[
  {
    "q": "In the six-level machine, which level has the main duties *Memory management, processes execution, and system resource protection*?",
    "options": [
      "Level 3, the Operating System level",
      "Level 2, the Instruction Set Architecture level",
      "Level 1, the Microarchitecture level",
      "Level 4, the Assembly language level"
    ],
    "answer": 0,
    "explain": "Slides 8 and 11: the OS level is Level 3, with Linux, Windows and Mac as examples. Below it, Level 2 (ISA) is the set of basic operations, Level 1 (microarchitecture) executes machine code with ALU, registers and microprograms; above it, Level 4 is assembly. See [the six-level machine](#/comp4736-p1/multilevel-machines)."
  },
  {
    "q": "At which level are the compiled machine-code instructions *executed in this level employing ALU, Registers, and Microprograms*?",
    "options": [
      "Microarchitecture level",
      "Digital level",
      "Instruction Set Architecture level",
      "Operating System level"
    ],
    "answer": 0,
    "explain": "Slide 5, Level 1. The digital level (Level 0) below it is transistors and the AND, OR, NOT gates; the ISA (Level 2) only lists the operations the computer must support and is not concerned with how they are built."
  },
  {
    "q": "The Instruction Set Architecture is concerned with the implementation specific details of a computer.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 6: *The ISA is not concerned with the implementation specific details of a computer. It is only concerned with the set or collection of basic operations the computer must support.* The ATmega16 table on slide 7 (ADD, SUB, RJMP, MOV …) is such a set."
  },
  {
    "q": "On slide 23's resource-manager diagram, which two resources are shared in space?",
    "options": [
      "RAM and Disk",
      "CPU and Printer",
      "CPU and RAM",
      "Disk and Printer"
    ],
    "answer": 0,
    "explain": "Resource management shares *in time and in space* (slide 22). The CPU and the printer are time-shared: one program or one print job at a time, taking turns. RAM and the disk are space-shared: each program holds its own part at once."
  },
  {
    "q": "In slide 20's extended-machine figure, the beautiful interface lies between the operating system and the hardware.",
    "type": "tf",
    "answer": false,
    "explain": "The figure runs top to bottom: application programs, *Beautiful interface*, operating system, *Ugly interface*, hardware. The hardware side is the ugly one; the OS hands the programs the beautiful one. Caption: *Operating systems turn ugly hardware into beautiful abstractions*. The practice paper swaps \"hardware\" for \"software\", and that version is False."
  },
  {
    "q": "What is the other name the slide gives for kernel mode?",
    "options": [
      "Supervisor mode",
      "User mode",
      "Ring 3",
      "Real-time mode"
    ],
    "answer": 0,
    "explain": "Slide 16: *kernel mode (also called supervisor mode)*. In it the OS *has complete access to all the hardware and can execute any instruction the machine is capable of executing*. Ring 3 is the x86 name for user mode. See [kernel mode, user mode and the rings](#/comp4736-p1/kernel-and-user-mode)."
  },
  {
    "q": "Instructions that affect control of the machine are available to user-mode programs.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 16: *Instructions that affect control of the machine or do Input/Output are forbidden to user-mode programs.* User mode gets *only a subset of the machine instructions*."
  },
  {
    "q": "Ring 3 is the most privileged level of the Intel x86 architecture.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 18: Ring 0 (kernel mode) is the most privileged, reserved for the OS kernel. Ring 3 (user mode) is the least privileged, where user applications run. Rings 1 and 2 hold *Operating System Services (Device Drivers, Etc.)*."
  },
  {
    "q": "A program running in Ring 3 needs data from the disk. What does slide 18 say it relies on?",
    "options": [
      "System calls to request services from the operating system",
      "Direct access to the disk controller's registers",
      "Running its own code in Ring 0",
      "The DMA chip, which it sets up itself"
    ],
    "answer": 0,
    "explain": "Ring 3 code *can't execute privileged instructions directly or access hardware resources directly. Instead, it relies on system calls to request services from the operating system.* Writing controller registers is the driver's job, and the driver runs in kernel mode; setting up the DMA chip is done by the CPU in the kernel."
  },
  {
    "q": "On the RISC vs CISC slide, which processor is listed as CISC?",
    "options": [
      "VAX",
      "ARM",
      "AVR",
      "MIPS"
    ],
    "answer": 0,
    "explain": "Slide 32: RISC column AVR, ARM, MIPS, *Hardwired Approach*; CISC column AMD, Pentium, VAX, *Microprogrammed Approach*. See [ALU, control unit, registers](#/comp4736-p1/cpu)."
  },
  {
    "q": "In the slides' car factory, the three-station line (1 hour, 1 hour, 2 hours) has a latency for each car of",
    "options": [
      "6 hours",
      "4 hours",
      "2 hours",
      "3 hours"
    ],
    "answer": 0,
    "explain": "Slides 37-38: *Latency for each car = 2 + 2 + 2 = 6 hours*. Each station is one 2-hour cycle, because the slowest station sets the cycle time. A car still leaves every 2 hours, against every 4 hours on the one-station line, so the pipelined line is faster in throughput even though each car takes longer. See [pipelining](#/comp4736-p1/pipelining)."
  },
  {
    "q": "Pipelining shortens the time each single instruction takes from fetch to write back.",
    "type": "tf",
    "answer": false,
    "explain": "Pipelining raises throughput, not the speed of one instruction. With pipelining the delay for each instruction is $nT_p$ with $T_p = \\max\\{t_1, \\ldots, t_n\\}$; without it, the delay is $T_p = t_1 + \\cdots + t_n$, which is never larger. The car factory: 6 hours per car pipelined, 4 hours on one station."
  },
  {
    "q": "A multithreaded CPU holds the state of two different threads and switches back and forth on what time scale?",
    "options": [
      "Nanosecond",
      "Millisecond",
      "Microsecond",
      "Second"
    ],
    "answer": 0,
    "explain": "Slide 43: *hold the state of two different threads and then switch back and forth on a nanosecond time scale*, e.g. SPARC, the Power5, the Intel Xeon and the Intel Core family. Multicore chips are the separate idea of four, eight or more complete cores on one chip. See [multithreading and multicore](#/comp4736-p1/parallel-processors)."
  },
  {
    "q": "On the memory-hierarchy slide, what is the typical access time of main memory?",
    "options": [
      "10 nsec",
      "1 nsec",
      "2 nsec",
      "10 msec"
    ],
    "answer": 0,
    "explain": "Slide 46: registers 1 nsec, < 1 KB; cache 2 nsec, 4 MB; main memory 10 nsec, 1-8 GB; magnetic disk 10 msec, 1-4 TB. The disk is a million times slower than main memory: msec, not nsec. See [the memory hierarchy and registers](#/comp4736-p1/memory-and-registers)."
  },
  {
    "q": "The stack pointer contains the memory address of the next instruction to be fetched.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 47: that is the **PC** (program counter). The stack pointer *points to the top of the current stack in memory*. The PSW holds the condition code bits, the CPU priority, the mode (user or kernel) and other control bits."
  },
  {
    "q": "User programs may normally read the entire PSW and write all of its fields.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 47: *User programs may normally read the entire PSW but typically may write only some of its fields.* The PSW holds the mode bit; a user program that could write it could switch itself into kernel mode. *The PSW plays an important role in system calls and I/O.*"
  },
  {
    "q": "Which EFLAGS flag indicates an overflow condition for unsigned-integer arithmetic?",
    "options": [
      "CF, the carry flag (bit 0)",
      "OF, the overflow flag (bit 11)",
      "ZF, the zero flag (bit 6)",
      "SF, the sign flag (bit 7)"
    ],
    "answer": 0,
    "explain": "Slide 49: CF is set on a carry or borrow out of the most-significant bit and *indicates an overflow condition for unsigned-integer arithmetic*. OF is the signed (two's complement) one. ZF is set when the result is zero; SF copies the most-significant bit."
  },
  {
    "q": "Historically, the speed of memories has increased, not their capacity.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 50 says the reverse: *The capacity of memories are increased, not speed.* CPUs are faster than memories, so *the slower the memory, the more cycles the CPU will have to wait*. The practical solution is cache memory (L1, L2 and L3) in fixed-size blocks, cache lines, typically 64 bytes. See [cache lines and direct mapping](#/comp4736-p1/cache-mapping)."
  },
  {
    "q": "Which of these is a mapping technique, not a cache replacement algorithm?",
    "options": [
      "Set-associative mapping",
      "Least Recently Used (LRU)",
      "First In First Out (FIFO)",
      "Clock algorithm"
    ],
    "answer": 0,
    "explain": "Slide 53's three mapping techniques decide where a block may go: direct, associative, set-associative. Slide 57's five replacement algorithms decide which block leaves when a slot is needed: LRU, FIFO, LFU, Random, Clock."
  },
  {
    "q": "In direct mapping, a memory block can be placed in exactly one cache line.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 54: CI = MI % (# of cache lines), one answer per block. With 4 lines, block 3 goes to line 3, block 10 to line 2, block 13 to line 1. Two blocks with the same remainder evict each other, which is where direct mapping's misses come from."
  },
  {
    "q": "Moving a disk arm from one cylinder to the next takes about",
    "options": [
      "1 msec",
      "5 to 10 msec",
      "10 nsec",
      "10 msec"
    ],
    "answer": 0,
    "explain": "Slide 60: next cylinder about 1 msec; a random cylinder 5 to 10 msec; then the rotational delay, another 5 to 10 msec; then transfer at 50 MB/sec (low-end) to 160 MB/sec. See [disks and SSDs](#/comp4736-p1/disks)."
  },
  {
    "q": "Which of these is NOT one of the registers of the slide's minimal disk controller?",
    "options": [
      "Program counter",
      "Disk address",
      "Sector count",
      "Direction (read or write)"
    ],
    "answer": 0,
    "explain": "Slide 64: *registers for specifying the disk address, memory address, sector count, and direction (read or write)*. The program counter is a CPU register. Controllers having registers is also why \"registers are used just only in CPUs\" is False. See [controllers, drivers and the three ways to do I/O](#/comp4736-p1/io-devices)."
  },
  {
    "type": "match",
    "q": "Match each way of doing I/O to what the CPU does while the transfer runs.",
    "pairs": [
      [
        "Busy waiting",
        "sits in a tight loop polling the device until it is done"
      ],
      [
        "Using interrupt",
        "returns from the driver; the OS blocks the caller if need be and looks for other work"
      ],
      [
        "DMA",
        "sets up the chip with byte count, addresses and direction, lets it go, and is interrupted when it is done"
      ]
    ],
    "explain": "Slides 65-66. Busy waiting *has the disadvantage of tying up the CPU polling the device until it is finished*. With interrupts, the controller *generates an interrupt to signal completion*. With DMA (Direct Memory Access), the CPU only sets the transfer up; *When the DMA chip is done, it causes an interrupt.*"
  },
  {
    "q": "Which bus is a high-performance bus found mostly in servers and workstations, running at up to 640 MB/sec?",
    "options": [
      "SCSI",
      "USB",
      "PCI",
      "DMI"
    ],
    "answer": 0,
    "explain": "Slide 70: SCSI (Small Computer System Interface), for fast disks, scanners and other devices needing considerable bandwidth. USB devices *function immediately, without requiring a reboot*; PCI is *An internal synchronous bus* for adapters; DMI links the processor to the Platform Controller Hub. See [buses](#/comp4736-p1/buses)."
  },
  {
    "q": "PCI-Express uses a shared bus configuration.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 71: PCI-Express is *Not using a shared bus configuration and has a devoted path, called a lane, to a single chip known as a switch*. Each lane has conductors for sending and receiving; x1, x2 and x16 are 1, 2 and 16 lanes. The shared bus on slide 72 is PCI and PCI-X."
  },
  {
    "q": "TinyOS is the slide's example of which kind of operating system?",
    "options": [
      "Sensor node",
      "Embedded",
      "Real-time",
      "Smart card"
    ],
    "answer": 0,
    "explain": "Slide 75: sensor node OS (TinyOS), tiny computers talking wirelessly to each other and a base station. Embedded: Embedded Linux, QNX, VxWorks. Real-time: eCos. Smart card: JVM. See [the OS zoo](#/comp4736-p1/os-zoo-processes-files)."
  },
  {
    "q": "Which phrase is the slide's short definition of a process?",
    "options": [
      "Program in execution",
      "Logical units of information created by processes",
      "A way of grouping files together",
      "A sort of pseudofile that can be used to connect two processes"
    ],
    "answer": 0,
    "explain": "Slide 77: a process is a *program in execution*, associated with an address space and a set of resources, a container holding all the information needed to run the program. The other three are slide 80's file and directory, and slide 85's pipe."
  },
  {
    "q": "The process table stores the contents of each process's address space.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 77: the process table holds *all the information about each process, other than the contents of its own address space*. It is *an array of structures, one for each process currently in existence*."
  },
  {
    "q": "File systems are nearly always mounted on empty directories.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 84: the mount system call attaches the CD-ROM's file system to the root file system wherever the program wants it; *File systems are nearly always mounted on empty directories.* In the figure the CD-ROM's x and y appear under the empty directory b."
  }
]
```

## The written part: pipeline, clock, cache, address, protection bits, ALU

Each answer is one number (or one string). Work it on paper first; the explanation shows the full working the written paper expects.

```quiz
[
  {
    "q": "A computer has a pipeline with five stages of 3 ns, 4 ns, 2 ns, 4 ns and 2 ns. How many instructions per second can it execute? Answer in millions of instructions per second.",
    "type": "numeric",
    "answer": 250,
    "tolerance": 0,
    "unit": "million/s",
    "explain": "The clock period is the slowest stage: $T_p = \\max\\{3, 4, 2, 4, 2\\} = 4$ ns. Throughput = $1 / T_p = 1 / (4 \\times 10^{-9}) = 0.25 \\times 10^9$ = 250 million instructions per second."
  },
  {
    "q": "Same five-stage pipeline (3, 4, 2, 4, 2 ns). What is the delay for each instruction, in ns?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "unit": "ns",
    "explain": "Delay = $nT_p = 5 \\times 4 = 20$ ns. Every stage advances on the common 4 ns clock, so an instruction spends one full cycle in each of the 5 stages. The sum of the raw stage times, 15 ns, is not the pipelined delay."
  },
  {
    "q": "The same five units are run without pipelining. How many instructions per second now? Answer in millions of instructions per second, to two decimals.",
    "type": "numeric",
    "answer": 66.667,
    "tolerance": 0.05,
    "unit": "million/s",
    "explain": "No pipelining (slide 40): $T_p = t_1 + \\cdots + t_n = 3 + 4 + 2 + 4 + 2 = 15$ ns, throughput = $1 / (15 \\times 10^{-9}) \\approx 66.67$ million instructions per second, and the delay for each instruction is $T_p = 15$ ns. Pipelining gives 250 million per second at a delay of 20 ns."
  },
  {
    "q": "A CPU clock runs at 2.5 GHz. What is its clock period, in ns?",
    "type": "numeric",
    "answer": 0.4,
    "tolerance": 0.001,
    "unit": "ns",
    "explain": "Period = 1 / frequency = $1 / (2.5 \\times 10^9)$ s = $0.4 \\times 10^{-9}$ s = 0.4 ns. The pipeline question runs the same relation the other way: a 4 ns period gives $1/(4 \\times 10^{-9}) = 250$ million cycles per second."
  },
  {
    "q": "A direct-mapped cache has 4 lines, all empty at the start. The memory block requests, left to right, are 8, 13, 6, 8, 21, 13, 3, 6, 17, 21, 9, 3. How many cache hits?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "hits",
    "explain": "CI = MI % 4. 8→0 miss; 13→1 miss; 6→2 miss; 8→0 **hit**; 21→1 miss (evicts 13); 13→1 miss (evicts 21); 3→3 miss; 6→2 **hit**; 17→1 miss; 21→1 miss; 9→1 miss; 3→3 **hit**. Three hits: 8, 6 and 3 were still in their lines. Line 1 gets six requests (13, 21, 13, 17, 21, 9 all leave remainder 1), each for a different block from the one it holds, so it never hits."
  },
  {
    "q": "Same trace (8, 13, 6, 8, 21, 13, 3, 6, 17, 21, 9, 3 on 4 lines). How many cache misses?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "unit": "misses",
    "explain": "12 requests − 3 hits = 9 misses: miss rate 9/12 = 75 %, hit rate 3/12 = 25 %. The four first touches of an empty line (8, 13, 6, 3) are misses too."
  },
  {
    "q": "Same trace. Fill in the block each cache line holds at the end.",
    "type": "fill",
    "code": "[0] ___\n[1] ___\n[2] ___\n[3] ___",
    "answer": ["8", "9", "6", "3"],
    "explain": "Line 0 only ever saw 8; line 1's last arrival is 9 (request 11); line 2 only ever saw 6; line 3's 3 was hit at the end. Final contents [0] 8, [1] 9, [2] 6, [3] 3."
  },
  {
    "q": "Slide 56's laptop has a 6 MB, 12-way set-associative L3 cache with a 64-byte line size. How many cache lines does it have? (1 MB = 2^20 bytes.)",
    "type": "numeric",
    "answer": 98304,
    "tolerance": 0,
    "unit": "lines",
    "explain": "Lines = cache size / line size = $6 \\times 2^{20} / 64 = 6 \\times 16384 = 98304$. The slide-51 method: 64 KB / 64 B = 1024 lines for the L1D."
  },
  {
    "q": "Same L3 cache (6 MB, 12-way, 64-byte lines). How many sets?",
    "type": "numeric",
    "answer": 8192,
    "tolerance": 0,
    "unit": "sets",
    "explain": "Sets = lines / ways = 98304 / 12 = 8192. On slide 51 the 8-way L1D gives 1024 / 8 = 128 sets; the way count is the number in the descriptor (\"12-way set associative\")."
  },
  {
    "q": "With a 64-byte line size, a program references memory address 1000. Which line (numbered from 0) is pulled into the cache?",
    "type": "numeric",
    "answer": 15,
    "tolerance": 0,
    "explain": "Line = ⌊1000 / 64⌋ = 15, since 15 × 64 = 960 and 16 × 64 = 1024. Line 15 holds bytes 960-1023 and the address is at offset 1000 − 960 = 40. Slide 52's example: address 260 is in line 4, bytes 256-319."
  },
  {
    "q": "A file's permission string is `rw--wxr--`. What is its octal value?",
    "type": "numeric",
    "answer": 634,
    "tolerance": 0,
    "explain": "Three 3-bit fields, owner, group, everyone else, each r = 4, w = 2, x = 1. Owner `rw-` = 4 + 2 = 6; group `-wx` = 2 + 1 = 3; others `r--` = 4. Octal 634."
  },
  {
    "q": "Write the nine-character permission string for octal mode 750 (no type letter).",
    "type": "text",
    "answer": ["rwxr-x---"],
    "explain": "7 = 4 + 2 + 1 = `rwx` for the owner; 5 = 4 + 1 = `r-x` for the group; 0 = `---` for everyone else: `rwxr-x---`."
  },
  {
    "q": "The ALU gets A = 6 and B = 9 in 8 bits with F0 = 1, F1 = 1, ENA = 1, ENB = 0, INVA = 1, INC = 1. What value does it output (as a signed decimal)?",
    "type": "numeric",
    "answer": -6,
    "tolerance": 0,
    "explain": "On slide 28 this row is −A. ENB = 0 removes B, so the adder sums NOT(A) + 0 + 1: NOT(00000110) = 11111001, plus 1 = 11111010, which is −6 in two's complement. With ENB = 1 the same bits would give B − A = 3."
  }
]
```

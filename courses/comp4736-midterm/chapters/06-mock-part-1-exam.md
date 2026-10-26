---
title: Mock Part 1 (T/F and MCQ, 50 questions)
minutes: 45
---

Fifty new questions in the practice paper's format and in its proportions by lecture Part: 28 from Part 1, 5 from Part 2, 8 from Part 3, 2 from Part 4 and 7 from Part 5, mixed as the paper mixes them. Answer all fifty closed book in 45 minutes, then read the explanation of every miss; each one names the slide fact and links the lesson that teaches it.

```quiz
[
  {
    "q": "Which level of the multilevel machine has as its main duties memory management, processes execution, and system resource protection?",
    "options": ["Level 3, the operating system level", "Level 2, the instruction set architecture level", "Level 1, the microarchitecture level", "Level 4, the assembly language level"],
    "answer": 0,
    "explain": "Slide 8: the OS level (Level 3) has the main duties memory management, processes execution and system resource protection, e.g. Linux, Windows, Mac. The ISA (Level 2) is the set of basic operations, the microarchitecture (Level 1) executes machine code with the ALU, registers and microprograms, and assembly (Level 4) is the human-readable language above the OS. [The six-level machine](#/comp4736-p1/multilevel-machines)"
  },
  {
    "q": "The ISA is concerned with the implementation specific details of a computer.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide 6: the ISA describes the design of a computer in terms of the basic operations it must support and is NOT concerned with the implementation specific details; it is only concerned with the set of basic operations. How the operations are built is the microarchitecture's business. [The six-level machine](#/comp4736-p1/multilevel-machines)"
  },
  {
    "q": "Which of the following is NOT one of the four principal events that cause processes to be created?",
    "options": ["System initialization", "A user request to create a new process", "Initiation of a batch job", "Normal exit"],
    "answer": 3,
    "explain": "Slide 10 lists four creation events: system initialization, execution of a process-creation system call by a running process, a user request to create a new process, and initiation of a batch job. Normal exit is the first of the four termination conditions (slide 17), not a creation event. [The four events that create a process](#/comp4736-p3/process-creation)"
  },
  {
    "q": "Instructions that affect control of the machine or do Input/Output are forbidden to user-mode programs.",
    "type": "tf",
    "answer": true,
    "explain": "True, slide 16 word for word. In user mode only a subset of the machine instructions is available; in kernel mode (also called supervisor mode) the OS has complete access to all the hardware and can execute any instruction. A user program that needs I/O asks the kernel through a system call. [Kernel mode, user mode and the four x86 rings](#/comp4736-p1/kernel-and-user-mode)"
  },
  {
    "q": "Which Intel x86 privilege ring is the least privileged?",
    "options": ["Ring 3", "Ring 0", "Ring 1", "Ring 2"],
    "answer": 0,
    "explain": "Slides 17–18: Ring 0 (kernel mode) is the most privileged, reserved for the kernel; Rings 1 and 2 hold OS services such as device drivers; Ring 3 (user mode) is the least privileged, where user applications run, and it relies on system calls to request services from the OS. [Kernel mode, user mode and the four x86 rings](#/comp4736-p1/kernel-and-user-mode)"
  },
  {
    "q": "In which OS structure does only one module run in kernel mode while the rest run as relatively powerless ordinary user processes?",
    "options": ["Microkernel", "Monolithic system", "Layered system", "Client-server model"],
    "answer": 0,
    "explain": "Slide 14: a microkernel achieves high reliability by splitting the OS into small, well-defined modules, only one of which, the microkernel, runs in kernel mode. Only IPC and basic scheduling stay in the kernel; drivers and file systems run in user space (slide 15). A monolithic OS is the opposite: a single program in kernel mode. [Microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server)"
  },
  {
    "q": "Which view of the operating system as a resource manager is described as 'Provide abstractions to application programs'?",
    "options": ["Top down view", "Bottom up view", "Alternative view", "None of the mentioned"],
    "answer": 0,
    "explain": "Slide 21 gives three views: top down, provide abstractions to application programs; bottom up, manage pieces of a complex system; alternative, provide orderly, controlled allocation of resources. [Software, extended machine, resource manager](#/comp4736-p1/what-the-os-is)"
  },
  {
    "q": "On the resource-manager diagram (CPU, RAM, disk, printer), which resource is shared in space?",
    "options": ["RAM", "CPU", "Printer", "All of the mentioned"],
    "answer": 0,
    "explain": "Slides 22–23: resources are shared in time or in space. CPU and printer are time sharing (one user after another); RAM and disk are space sharing (each program gets part of it at once). Multiprogramming gives each program a fair amount of time and memory space. [Software, extended machine, resource manager](#/comp4736-p1/what-the-os-is)"
  },
  {
    "q": "Dividing by zero (1/0) raises which class of interrupt?",
    "options": ["Internal interrupt (exception), synchronous", "External interrupt (hardware interrupt), asynchronous", "Software interrupt (trap), synchronous", "None of the mentioned"],
    "answer": 0,
    "explain": "Part 5 slide 1: external (hardware) interrupts are asynchronous, e.g. moving the mouse or pressing a key; internal interrupts (exceptions) are synchronous and generated by the CPU itself whenever some unusual condition occurs, e.g. 1/0; software interrupts (traps) are synchronous, e.g. system calls. [External, internal and software interrupts](#/comp4736-p5/interrupt-classes)"
  },
  {
    "q": "The ALU computes B − A as B + NOT(A) + 1.",
    "type": "tf",
    "answer": true,
    "explain": "True. Slides 29–30 work B − A with A = 3 and B = 4 in 8 bits: 00000100 + NOT(00000011) + 1 = 00000100 + 11111100 + 1 = 100000001. The red leading 1 is the carry out, so the result is 00000001 = 1. The table row for B − A sets INVA, F0, F1, ENA, ENB and INC all to 1. [ALU, control unit, registers](#/comp4736-p1/cpu)"
  },
  {
    "q": "Which processor does the RISC vs CISC slide list as a CISC example?",
    "options": ["Pentium", "ARM", "AVR", "MIPS"],
    "answer": 0,
    "explain": "Slide 32: RISC examples AVR, ARM, MIPS (hardwired approach); CISC examples AMD, Pentium, VAX (microprogrammed approach). [ALU, control unit, registers](#/comp4736-p1/cpu)"
  },
  {
    "q": "According to the RISC vs CISC slide, RISC processors use the",
    "options": ["Hardwired approach", "Microprogrammed approach", "Superscalar approach"],
    "answer": 0,
    "explain": "Slide 32's last row: RISC, hardwired approach; CISC, microprogrammed approach. Slide 31 shows the same choice inside the control unit: Microprogram OR Hardwired. Superscalar is a pipelining design (slides 41–42), not a control-unit approach. [ALU, control unit, registers](#/comp4736-p1/cpu)"
  },
  {
    "q": "Which state transition happens when the scheduler decides the running process has run long enough and another process should have some CPU time?",
    "options": ["Running → Ready", "Running → Blocked", "Blocked → Ready", "Ready → Running"],
    "answer": 0,
    "explain": "Slide 28: transition 2 (Running → Ready) occurs when the scheduler decides the running process has run long enough. Transition 1 (Running → Blocked) is the process blocking for input, 3 (Ready → Running) is the scheduler picking this process, 4 (Blocked → Ready) is the input becoming available. [Running, Ready, Blocked and the four transitions](#/comp4736-p3/process-states)"
  },
  {
    "q": "A pipeline has three stages taking 2, 2 and 6 ns. What is the delay of each instruction through the pipeline?",
    "options": ["18 ns", "10 ns", "6 ns", "12 ns"],
    "answer": 0,
    "explain": "Slide 39: clock period Tp = max{t1, …, tn} = max{2, 2, 6} = 6 ns, and delay for each instruction = n Tp = 3 × 6 = 18 ns. 10 ns is the sum of the stages, which is the period without pipelining (slide 40); 6 ns is one cycle. Throughput is 1 / 6 ns ≈ 166.7 million instructions per second. [Pipelining: cycle time and latency](#/comp4736-p1/pipelining)"
  },
  {
    "q": "Pipelining shortens the delay of each individual instruction.",
    "type": "tf",
    "answer": false,
    "explain": "False. Pipelining raises throughput, not speed per item. In the car factory (slides 35–38) the one-station line takes 4 hours per car; the pipelined line of 1 h, 1 h and 2 h stations delivers a car every 2 hours, but each car's latency is 2 + 2 + 2 = 6 hours, because every stage takes one 2-hour cycle. [Pipelining: cycle time and latency](#/comp4736-p1/pipelining)"
  },
  {
    "q": "Which item is private to each thread rather than shared by all threads in a process?",
    "options": ["Stack", "Global variables", "Open files", "Pending alarms"],
    "answer": 0,
    "explain": "Part 4 slides 14–15: per process items are address space, global variables, open files, child processes, pending alarms, signals and signal handlers, accounting information; per thread items are program counter, registers, stack and state. Slide 16: each thread has its own stack. [What is shared and what is private](#/comp4736-p4/classical-thread-model)"
  },
  {
    "q": "In which design does each CPU have its own local memory?",
    "options": ["A multicomputer", "A single-bus multiprocessor", "A quad-core chip with a shared L2 cache", "A superscalar processor"],
    "answer": 0,
    "explain": "Slide 45: (a) a single-bus multiprocessor has four CPUs and one shared memory on one bus; (b) a multicomputer gives each CPU its own local memory. The shared-L2 quad-core is the Intel chip of slide 44 (the AMD chip has separate L2 caches). [Multithreading, multicore, multiprocessors and multicomputers](#/comp4736-p1/parallel-processors)"
  },
  {
    "q": "On the memory hierarchy slide, what is the typical access time of main memory?",
    "options": ["10 nsec", "2 nsec", "1 nsec", "10 msec"],
    "answer": 0,
    "explain": "Slide 46: registers 1 nsec (< 1 KB), cache 2 nsec (4 MB), main memory 10 nsec (1–8 GB), magnetic disk 10 msec (1–4 TB). The disk is a million times slower than main memory: msec, not nsec. [The memory hierarchy, PC, SP, PSW](#/comp4736-p1/memory-and-registers)"
  },
  {
    "q": "In a layered operating system, each layer relies only on the one above it.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide 11: each layer relies only on the one BELOW it; slide 10: a hierarchy of layers, each one constructed upon the one below it (the THE system, Dijkstra 1968, layer 0 processor allocation up to layer 5 the operator). [Monolithic systems and layered systems](#/comp4736-p2/monolithic-and-layered)"
  },
  {
    "q": "Which register points to the top of the current stack in memory?",
    "options": ["Stack pointer", "Program counter", "Program status word (PSW)"],
    "answer": 0,
    "explain": "Slide 47: the PC contains the memory address of the next instruction to be fetched; the stack pointer points to the top of the current stack in memory; the PSW contains the condition code bits, the CPU priority, the mode (user or kernel) and other control bits. [The memory hierarchy, PC, SP, PSW](#/comp4736-p1/memory-and-registers)"
  },
  {
    "q": "In the eleven steps of read(fd, buffer, nbytes), which step switches from user mode to kernel mode?",
    "options": ["Step 6: executing a TRAP instruction", "Step 4: calling the library procedure", "Step 7: dispatching to the system-call handler", "Step 11: cleaning up the stack"],
    "answer": 0,
    "explain": "Part 5 slide 19: step 6 executes a TRAP instruction to switch from user mode to kernel mode and start execution at a fixed address within the kernel. Step 4 is an ordinary procedure call (still user mode), step 7 is already kernel code dispatching through the table of handler pointers, and step 11 is the user program cleaning up the stack. [The eleven steps of read](#/comp4736-p5/eleven-steps)"
  },
  {
    "q": "User programs may normally read the entire PSW but typically may write only some of its fields.",
    "type": "tf",
    "answer": true,
    "explain": "True, slide 47. One of the PSW's fields is the mode bit (user or kernel); if a user program could write it, it could switch itself into kernel mode. The slide adds that the PSW plays an important role in system calls and I/O. [The memory hierarchy, PC, SP, PSW](#/comp4736-p1/memory-and-registers)"
  },
  {
    "q": "Which EFLAGS flag is set if the result of an operation is zero?",
    "options": ["ZF", "CF", "SF", "OF"],
    "answer": 0,
    "explain": "Slide 49: ZF (bit 6) is set if the result is zero. CF (bit 0) is set on a carry or borrow out of the most-significant bit (unsigned overflow); SF (bit 7) equals the most-significant bit, the sign bit; OF (bit 11) signals signed (two's complement) overflow. [The memory hierarchy, PC, SP, PSW and EFLAGS](#/comp4736-p1/memory-and-registers)"
  },
  {
    "q": "Transitions 2 and 3 (Running → Ready and Ready → Running) are caused by the process itself.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide 28: transitions 2 and 3 are caused by the process scheduler, a part of the operating system, without the process even knowing about them. Transition 1 is the OS discovering the process cannot continue; transition 4 is the external event the process was waiting for. [Running, Ready, Blocked and the four transitions](#/comp4736-p3/process-states)"
  },
  {
    "q": "A 256 KB cache has 64-byte lines and is 4-way set associative. How many sets does it have?",
    "options": ["1024", "4096", "256", "64"],
    "answer": 0,
    "explain": "Lines = cache size ÷ line size = 256 × 1024 ÷ 64 = 4096 lines. Sets = lines ÷ ways = 4096 ÷ 4 = 1024 sets. The slide-51 example does the same with the L1D: 64 KB ÷ 64 B = 1024 lines, ÷ 8 (8-way) = 128 sets. 4096 is the line count, the step before dividing by the ways. [Cache lines, sets, direct mapping](#/comp4736-p1/cache-mapping)"
  },
  {
    "q": "With 64-byte cache lines numbered from 0, which line holds memory address 400?",
    "options": ["6", "7", "16", "5"],
    "answer": 0,
    "explain": "Line = ⌊address ÷ line size⌋ = ⌊400 ÷ 64⌋ = 6, because 6 × 64 = 384 and line 6 spans bytes 384–447. 16 is the remainder, the byte offset inside the line. Slide 52 does the same for address 260: line 4, bytes 256–319. [Cache lines, sets, direct mapping](#/comp4736-p1/cache-mapping)"
  },
  {
    "q": "ESXi (Elastic Sky X Integrated) is",
    "options": ["a type 1 hypervisor that runs directly on system hardware", "a type 2 hypervisor that runs on a host operating system", "a single user OS that runs on top of VM/370", "a microkernel"],
    "answer": 0,
    "explain": "Slide 25: ESXi is a type-1 hypervisor, runs directly on system hardware, no need for an operating system. VirtualBox is the slide's type 2 example, running on the host OS Windows 10 (slide 26). CMS is the single user OS on VM/370 (slide 23). [Virtual machines and hypervisors](#/comp4736-p2/virtual-machines)"
  },
  {
    "q": "A direct-mapped cache has 8 lines. Into which cache line does memory block 29 go?",
    "options": ["5", "1", "3", "7"],
    "answer": 0,
    "explain": "Direct mapping, slide 54: CI = MI % (# of cache lines) = 29 % 8 = 5, since 3 × 8 = 24 and 29 − 24 = 5. 1 would be 29 % 4, the answer for a 4-line cache; 3 is the quotient, not the remainder. [Cache lines, sets, direct mapping](#/comp4736-p1/cache-mapping)"
  },
  {
    "q": "fork() returns 0 in the parent process.",
    "type": "tf",
    "answer": false,
    "explain": "False. Part 5 slide 23: pid = −1, fork fails; pid = 0, the return value in the child process; pid > 0, the return value in the parent, the process ID of the child. In the slide-27 program the parent prints pid = 736 and the child prints pid = 0. [fork returns three ways](#/comp4736-p5/fork-programs)"
  },
  {
    "q": "Moving the disk arm from one cylinder to the next takes about 10 msec.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide 60: one cylinder to the next takes about 1 msec; to a random cylinder typically 5 to 10 msec; then the rotational delay adds 5 to 10 msec; transfer runs at 50 MB/sec on low-end disks to 160 MB/sec on faster ones. [Disks and SSDs](#/comp4736-p1/disks)"
  },
  {
    "q": "Each process spends 60 % of its time waiting for I/O, and 3 processes are in memory. What is the CPU utilization?",
    "options": ["78.4 %", "21.6 %", "93.6 %", "40 %"],
    "answer": 0,
    "explain": "Slide 43: CPU utilization = 1 − pⁿ = 1 − 0.6³ = 1 − 0.216 = 0.784 = 78.4 %. 21.6 % is pⁿ, the probability all three wait at once (the CPU is idle); 93.6 % is 1 − 0.4³, which swaps p and 1 − p; 40 % is one process alone (1 − 0.6). [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "q": "SSDs store data in flash memory, and the data is lost when the power is off.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide 61: SSDs do not have moving parts, do not contain platters, and store data in (Flash) memory; they also store a lot of data which is NOT lost when the power is off. [Disks and SSDs](#/comp4736-p1/disks)"
  },
  {
    "q": "The disadvantage of busy waiting is that",
    "options": ["it ties up the CPU polling the device until it is finished", "the OS always blocks the caller and looks for other work", "it needs a special DMA chip", "the driver has to run in user mode"],
    "answer": 0,
    "explain": "Slide 65: in busy waiting the driver starts the I/O and sits in a tight loop continuously polling the device; the method has the disadvantage of tying up the CPU polling the device until it is finished. Blocking the caller and looking for other work is the interrupt method (slide 66); the DMA chip is the third method. [Controllers, drivers, busy waiting, interrupts and DMA](#/comp4736-p1/io-devices)"
  },
  {
    "q": "What is the Win32 equivalent of the UNIX call open?",
    "options": ["CreateFile", "CreateProcess", "ReadFile", "SetFilePointer"],
    "answer": 0,
    "explain": "Part 5 slides 48–49: open → CreateFile (create a file or open an existing file); fork → CreateProcess; read → ReadFile; lseek → SetFilePointer. execve has no Win32 equivalent because CreateProcess = fork + execve. [The Win32 API against UNIX](#/comp4736-p5/win32-api)"
  },
  {
    "q": "In which I/O method does the CPU tell a chip how many bytes to transfer, the device and memory addresses involved and the direction, and then let it go?",
    "options": ["DMA (Direct Memory Access)", "Busy waiting", "Using interrupt"],
    "answer": 0,
    "explain": "Slide 66, method 3, use of special hardware: the CPU sets up the DMA chip with the byte count, the device and memory addresses and the direction, and lets it go; when the DMA chip is done, it causes an interrupt. [Controllers, drivers, busy waiting, interrupts and DMA](#/comp4736-p1/io-devices)"
  },
  {
    "q": "Processes in UNIX can disinherit their children.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide 24: processes in UNIX cannot disinherit their children. In Windows there is no process hierarchy (all processes are equal); the parent gets a token called a handle, and it is free to pass the handle to another process, which invalidates the hierarchy. [The four ways a process ends, and process hierarchies](#/comp4736-p3/process-termination)"
  },
  {
    "q": "Which bus is intended for fast disks and scanners, is found mostly in servers and workstations, and can run at up to 640 MB/sec?",
    "options": ["SCSI", "USB", "PCI", "PCI-Express"],
    "answer": 0,
    "explain": "Slide 70: SCSI (Small Computer System Interface) is a high-performance bus, mostly in servers and workstations, up to 640 MB/sec. USB devices work immediately without a reboot; PCI is an internal synchronous bus for adapters; PCI-Express (slide 71) gives each device a devoted path, a lane, to a switch. [Buses](#/comp4736-p1/buses)"
  },
  {
    "q": "A clock is driven by a 250-MHz crystal, and the OS gives each process a quantum of 20 ms. What value is loaded into the holding register so the counter interrupts after one quantum?",
    "options": ["5,000,000", "10,000,000", "5,000", "50,000,000"],
    "answer": 0,
    "explain": "Period T = 1/f = 1/(250 × 10⁶) s = 4 ns, so the counter is decremented every 4 ns (slide 32 does the same with 500 MHz → 2 nsec). Count = quantum ÷ period = 20 × 10⁻³ ÷ 4 × 10⁻⁹ = 5 × 10⁶ = 5,000,000. 10,000,000 uses the 2 ns of the slide's 500-MHz crystal; 5,000 divides by 4 μs instead of 4 ns. [Clock hardware](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "In the OS zoo, TinyOS is an example of which kind of operating system?",
    "options": ["Sensor node operating system", "Embedded operating system", "Real-time operating system", "Smart card operating system"],
    "answer": 0,
    "explain": "Slides 73–76: sensor node, TinyOS; embedded, Embedded Linux, QNX and VxWorks (they do not accept user-installed software); real-time, eCos (time is a key parameter); smart card, JVM. [The OS zoo, processes, files](#/comp4736-p1/os-zoo-processes-files)"
  },
  {
    "q": "A process shown with state Z in ps is",
    "options": ["a defunct (zombie) process, terminated but not reaped by its parent", "stopped by a job control signal", "in uninterruptible sleep, usually I/O", "an idle kernel thread"],
    "answer": 0,
    "explain": "Part 3 slide 59 (man ps): D uninterruptible sleep (usually IO, cannot be killed), I idle kernel thread, R running or runnable, S interruptible sleep, T stopped by job control signal, X dead, Z defunct (zombie), terminated but not reaped by its parent. A zombie stays in the task list until the parent waits for it. [pstree, ps, top and the state letters](#/comp4736-p3/linux-process-states)"
  },
  {
    "q": "File systems are nearly always mounted on non-empty directories.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide 84: the mount system call attaches the file system on the CD-ROM to the root file system wherever the program wants it; file systems are nearly always mounted on EMPTY directories. In the figure the CD-ROM's x and y appear under the empty directory b. [The OS zoo, processes, files, mount](#/comp4736-p1/os-zoo-processes-files)"
  },
  {
    "q": "After link(\"/usr/jim/memo\", \"/usr/ast/note\"), the new entry note gets an i-number of its own.",
    "type": "tf",
    "answer": false,
    "explain": "False. Part 5 slide 42: after the link, /usr/ast/note has i-number 70, the same as /usr/jim/memo: two names, one file. A hard link shares the i-node and raises its link count (my_file and my_file_h_link both show Links: 2, slide 43); a symbolic link is a separate file with its own i-node that holds the name. [link, hard and symbolic links, mount](#/comp4736-p5/links-and-mount)"
  },
  {
    "q": "Which hybrid thread mapping suffers from a lack of true concurrency, because all user threads are bound to a single kernel thread?",
    "options": ["Many to one", "One to one", "Many to many"],
    "answer": 0,
    "explain": "Part 4 slide 38: many to one is managed by the user-level thread library, the kernel is unaware of individual user threads, and it lacks true concurrency. One to one (slide 40) gives true concurrency but creating many kernel threads adds overhead; many to many (slide 42) maps user threads onto an equal or smaller number of kernel threads, a balance between the two. [Hybrid implementations](#/comp4736-p4/hybrid-models)"
  },
  {
    "q": "The protection bits r-xrw---x in octal are equal to",
    "options": ["561", "165", "651", "516"],
    "answer": 0,
    "explain": "Slide 87: the 9-bit code is three 3-bit rwx fields, owner, group, others, with r = 4, w = 2, x = 1. r-x = 4 + 0 + 1 = 5; rw- = 4 + 2 + 0 = 6; --x = 0 + 0 + 1 = 1. So 561. 165 reads the fields backwards. [The OS zoo, processes, files and protection](#/comp4736-p1/os-zoo-processes-files)"
  },
  {
    "q": "When a program is started in the background with ./program.exe &, the number the shell prints after the job number ([1] 1243) is the same process ID that pstree -p then shows for that program.",
    "type": "tf",
    "answer": true,
    "explain": "True. Part 3 slide 21: the shell prints [1] 1243, pstree -p shows program(1243), and kill 1243 terminates it ([1]+ Terminated). [1] is the job number; 1243 is the PID that every tool (pstree, ps, kill) uses for the same process. [The four ways a process ends](#/comp4736-p3/process-termination)"
  },
  {
    "q": "In ls -l output, a line whose first character is p is a",
    "options": ["named pipe", "local socket file", "symbolic link", "block device file"],
    "answer": 0,
    "explain": "Slide 88, Linux file types: - regular file, d directory, c character device file, b block device file, s local socket file, p named pipe, l symbolic link. The slide's example is prw-r--r-- my_npipe_dev. [The OS zoo, processes, files and protection](#/comp4736-p1/os-zoo-processes-files)"
  },
  {
    "q": "In square-wave mode, the periodic interrupts are called clock ticks.",
    "type": "tf",
    "answer": true,
    "explain": "True, slide 31. In square-wave mode, after the counter reaches zero and interrupts, the holding register is copied into the counter again and the process repeats indefinitely; these periodic interrupts are the clock ticks. In one-shot mode the clock stops until it is explicitly started again by the software. [Clock hardware: crystal, counter, holding register](#/comp4736-p2/clock-hardware)"
  },
  {
    "q": "In the Linux process address space, where do uninitialized global (or static) variables live?",
    "options": ["BSS", "Data", "Heap", "Stack"],
    "answer": 0,
    "explain": "Part 3 slide 47, from lower to higher address: text (program code), data (initialized global or static variables), BSS (Block Started by Symbols, uninitialized global or static variables), heap (grows up), stack (local variables, return address and parameters; grows down), then kernel space. [Text, data, BSS, heap, stack](#/comp4736-p3/linux-address-space)"
  },
  {
    "q": "Most I/O system calls, by default, are blocking calls.",
    "type": "tf",
    "answer": true,
    "explain": "True, Part 5 slide 53. A blocking call suspends the process until the operation completes; a non-blocking call returns immediately (slide 54), enabled with fcntl(fd, F_SETFL, O_NONBLOCK). POSIX AIO (aio_read, aio_write, …) is the asynchronous alternative. [Blocking, non-blocking and asynchronous I/O](#/comp4736-p5/blocking-io)"
  },
  {
    "q": "In 32-bit x86 Linux, which register holds the system call number before int 80h is executed?",
    "options": ["EAX", "EBX", "ECX", "EDX"],
    "answer": 0,
    "explain": "Part 5 slide 11: the system call number goes in EAX; the arguments in EBX, ECX, etc.; then int 80h; and the result usually comes back in EAX. The hello-world program puts 4 (sys_write) in EAX and the file descriptor 1 in EBX. [x86 registers, int 80h](#/comp4736-p5/registers-and-int80)"
  }
]
```

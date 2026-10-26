---
title: "Recall drill: Part 3 (closed book)"
minutes: 30
---
Every list, name and number from Part 3 that the closed-book midterm can ask for, produced from memory first; the tables below hold the same facts for the re-read after a miss.

```quiz
[
  {
    "type": "reorder",
    "q": "Put the four principal events that cause processes to be created in the slide's order.",
    "lines": [
      "System initialization",
      "Execution of a process-creation system call by a running process",
      "A user request to create a new process",
      "Initiation of a batch job"
    ],
    "explain": "Slide 10. Boot creates foreground processes and daemons; a running process creates helpers (the network-fetch and shared-buffer example); a user types a command or clicks an icon; the batch case *applies only to the batch systems found on large mainframes*. [The four events that create a process](#/comp4736-p3/process-creation)"
  },
  {
    "type": "text",
    "q": "Processes that stay in the background to handle some activity such as email, Web pages, news and printing are called ___.",
    "answer": ["daemons", "daemon", "daemon processes"],
    "explain": "Slide 11. Boot-time processes that interact with users are foreground processes; the background ones not associated with particular users are daemons. [The four events that create a process](#/comp4736-p3/process-creation)"
  },
  {
    "type": "reorder",
    "q": "Put the four typical conditions that terminate a process in the slide's order.",
    "lines": [
      "Normal exit",
      "Error exit",
      "Fatal error",
      "Killed by another process"
    ],
    "explain": "Slide 17. The first two are voluntary (the process decides to leave), the last two involuntary. [The four ways a process ends, and process hierarchies](#/comp4736-p3/process-termination)"
  },
  {
    "type": "fill",
    "q": "Tag each termination condition as the slide does: type voluntary or involuntary.",
    "code": "1. Normal exit (___)\n2. Error exit (___)\n3. Fatal error (___)\n4. Killed by another process (___)",
    "answer": ["voluntary", "voluntary", "involuntary", "involuntary"],
    "explain": "An error exit is the process noticing a problem and exiting on its own (`cc foo.c` with no such file). A fatal error is *an error caused by the process, often due to a program bug*: illegal instruction, nonexistent memory, divide by zero. [The four ways a process ends, and process hierarchies](#/comp4736-p3/process-termination)"
  },
  {
    "type": "match",
    "q": "Match each call to what it does.",
    "pairs": [
      ["exit", "UNIX: tell the OS that this process is finished"],
      ["ExitProcess", "Windows: tell the OS that this process is finished"],
      ["kill", "UNIX: tell the OS to kill some other process"],
      ["TerminateProcess", "Win32: tell the OS to kill some other process"]
    ],
    "explain": "Slides 18 and 21. For a kill, *the killer must have the necessary authorization to do in the killee*. [The four ways a process ends, and process hierarchies](#/comp4736-p3/process-termination)"
  },
  {
    "type": "text",
    "q": "In UNIX, a process and all of its children and further descendants together form a ___.",
    "answer": ["process group", "a process group"],
    "explain": "Slide 23. A keyboard signal goes to every member of the process group currently associated with the keyboard; each can catch it, ignore it, or take the default action, which is to be killed by the signal. [The four ways a process ends, and process hierarchies](#/comp4736-p3/process-termination)"
  },
  {
    "type": "text",
    "q": "Windows has no process hierarchy. What is the special token a Windows parent gets to control its child, which it may pass to another process?",
    "answer": ["handle", "a handle"],
    "explain": "Slide 24. Passing the handle on invalidates the hierarchy; *Processes in UNIX cannot disinherit their children.* [The four ways a process ends, and process hierarchies](#/comp4736-p3/process-termination)"
  },
  {
    "type": "text",
    "q": "A process is just an instance of an ___ program, including the current values of the program counter (PC), registers, and variables. Type the missing word.",
    "answer": ["executing"],
    "explain": "Slide 2. Without *executing* the sentence describes a program, and the practice paper marks that version False. [A process is a program in execution](#/comp4736-p3/process-model)"
  },
  {
    "type": "fill",
    "q": "Complete the three numbered multiprogramming sentences of slide 7, one word per blank.",
    "code": "1. The CPU switches from process to process ___.\n2. The CPU runs each process for tens or hundreds of ___.\n3. Strictly speaking, at any one instant the CPU is running only ___ process.",
    "answer": ["quickly", "milliseconds", "one"],
    "explain": "Slide 7: *The rapid switching back and forth is called multiprogramming.* Figure (a) has one program counter, figure (b) the conceptual model of four independent, sequential processes, figure (c) *Only one program is active at once*. [A process is a program in execution](#/comp4736-p3/process-model)"
  },
  {
    "type": "text",
    "q": "The rapid switching back and forth between processes is called ___.",
    "answer": ["multiprogramming"],
    "explain": "Slide 7, last sentence. [A process is a program in execution](#/comp4736-p3/process-model)"
  },
  {
    "type": "fill",
    "q": "Complete slide 6: the three segments of a UNIX process and their growth directions (lower case, one word per blank).",
    "code": "the ___ segment (i.e., the program code), the ___ segment (i.e., the variables), and the ___ segment.\nThe data segment grows ___ and the stack grows ___.",
    "answer": ["text", "data", "stack", "upward", "downward"],
    "explain": "Slide 6. In the figure text sits at 0000, data above it, the stack at FFFF, and the gap between data and stack is where both grow. [A process is a program in execution](#/comp4736-p3/process-model)"
  },
  {
    "type": "fill",
    "q": "Name the three process states, capitalized as on slide 25.",
    "code": "1. ___ (actually using the CPU at that instant)\n2. ___ (scheduled and runnable; temporarily stopped to let another process run)\n3. ___ (unable to run until some external event happens)",
    "answer": ["Running", "Ready", "Blocked"],
    "explain": "Slide 25, with the slide's parentheticals. [Running, Ready, Blocked and the four transitions](#/comp4736-p3/process-states)"
  },
  {
    "type": "fill",
    "q": "Fill in the from and to state of each numbered transition (Running, Ready or Blocked). The legend is the slide's.",
    "code": "1. ___ -> ___   Process blocks for input\n2. ___ -> ___   Scheduler picks another process\n3. ___ -> ___   Scheduler picks this process\n4. ___ -> ___   Input becomes available",
    "answer": ["Running", "Blocked", "Running", "Ready", "Ready", "Running", "Blocked", "Ready"],
    "explain": "Slide 26. There is no Blocked to Running and no Ready to Blocked arrow. After transition 4, *if no other process is running at that instant, transition 3 will be triggered and the process will start running*. [Running, Ready, Blocked and the four transitions](#/comp4736-p3/process-states)"
  },
  {
    "type": "text",
    "q": "Transitions 2 and 3 are caused by which part of the operating system, without the process even knowing about them?",
    "answer": ["process scheduler", "the process scheduler", "scheduler", "the scheduler"],
    "explain": "Slide 28. Transition 1 *occurs when the operating system discovers that a process cannot continue right now*; transition 4 is caused by the external event. [Running, Ready, Blocked and the four transitions](#/comp4736-p3/process-states)"
  },
  {
    "type": "text",
    "q": "Name the system call some systems provide so that a process can put itself into the blocked state.",
    "answer": ["pause", "pause()"],
    "explain": "Slide 27. In UNIX a process that reads from a pipe or terminal with no input available is blocked automatically. [Running, Ready, Blocked and the four transitions](#/comp4736-p3/process-states)"
  },
  {
    "type": "text",
    "q": "The operating system's table (an array of structures) with one entry per process is called the ___.",
    "answer": ["process table", "the process table"],
    "explain": "Slide 30. The entry holds everything that must be saved when *the process is switched from running to ready or blocked state* so that it can be restarted later as if it had never been stopped. There is one table for the system, not one per process. [The process table, the PCB and the context switch](#/comp4736-p3/process-table)"
  },
  {
    "type": "fill",
    "q": "How many fields does each column of the slide-40 table list?",
    "code": "Process management: ___ fields\nMemory management: ___ fields\nFile management: ___ fields",
    "answer": ["15", "3", "5"],
    "explain": "Slide 40: 15 + 3 + 5 = 23. Memory management is the three segment pointers (text, data, stack); file management is root directory, working directory, file descriptors, user ID, group ID. [The process table, the PCB and the context switch](#/comp4736-p3/process-table)"
  },
  {
    "type": "match",
    "q": "Match each process table field to its column on slide 40.",
    "pairs": [
      ["Program status word", "Process management"],
      ["Pointer to data segment info", "Memory management"],
      ["Group ID", "File management"]
    ],
    "explain": "Registers, program counter, PSW, stack pointer, process state, priority, scheduling parameters, process ID, parent process, process group, signals and the four time fields are process management. [The process table, the PCB and the context switch](#/comp4736-p3/process-table)"
  },
  {
    "type": "text",
    "q": "Saving the current state of a running process and loading the saved state of another process so that it can resume execution is called a ___.",
    "answer": ["context switch", "a context switch", "context switching"],
    "explain": "Slide 31. Slide 32 draws it: save P1 state, restore P2 state, then save P2 state, restore P1 state. [The process table, the PCB and the context switch](#/comp4736-p3/process-table)"
  },
  {
    "type": "text",
    "q": "The data structure that represents a single process in the operating system, a crucial component within the process table, is the ___ (three-letter abbreviation or full name).",
    "answer": ["PCB", "process control block", "PCB (Process Control Block)"],
    "explain": "Slide 31: the context (program counter, register values, other state) is saved into the process's PCB. [The process table, the PCB and the context switch](#/comp4736-p3/process-table)"
  },
  {
    "type": "reorder",
    "q": "Put the skeleton of what the lowest level of the operating system does when an interrupt occurs in the slide's order.",
    "lines": [
      "Hardware stacks program counter, etc.",
      "Hardware loads new program counter from interrupt vector.",
      "Assembly language procedure saves registers.",
      "Assembly language procedure sets up new stack.",
      "C interrupt service runs (typically reads and buffers input).",
      "Scheduler decides which process is to run next.",
      "C procedure returns to the assembly code.",
      "Assembly language procedure starts up new current process."
    ],
    "explain": "Slide 41: hardware twice, assembly twice, then the C service and the scheduler, then back through C and assembly. [What the lowest level of the OS does when an interrupt occurs](#/comp4736-p3/interrupts)"
  },
  {
    "type": "text",
    "q": "The location associated with each I/O class, typically at a fixed location near the bottom of memory, from which the hardware loads the new program counter, is called the ___.",
    "answer": ["interrupt vector", "the interrupt vector"],
    "explain": "Slide 41. Slide 42's x86 real-mode table holds 256 four-byte entries (IP, CS) from address 00000000. [What the lowest level of the OS does when an interrupt occurs](#/comp4736-p3/interrupts)"
  },
  {
    "type": "text",
    "q": "Each of n processes in memory waits for I/O a fraction p of its time. Type the CPU utilization formula (write powers with ^, for example 1 - p^n).",
    "answer": ["1 - p^n", "1-p^n", "1 − p^n", "1−p^n", "1 - pⁿ", "1-pⁿ", "1 − pⁿ", "1−pⁿ", "1 - (p^n)", "1-(p^n)"],
    "explain": "Slide 43: pⁿ is the probability that all n processes are waiting for I/O, the CPU idle case; *CPU utilization = 1 − pⁿ*. The model assumes that all n processes are independent. [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "type": "fill",
    "q": "Complete the slide-46 claim and its number.",
    "code": "if processes spend ___% of their time waiting for I/O, at least ___ processes must be in memory at once to get the CPU waste below ___%.\nCPU waste = (0.8)^10 = ___ (four decimals)",
    "answer": ["80", "10", "10", "0.1074"],
    "explain": "Slide 46 as printed. 0.1074 is 10.74 %, which is not below 10 %; by the arithmetic 11 processes are needed (0.8¹¹ ≈ 0.0859). The slide's answer is 10. [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "type": "fill",
    "q": "The formula the practice paper prints for utilization from a job timeline.",
    "code": "CPU utilization = total ___ time / total ___ time",
    "answer": ["CPU", "real"],
    "explain": "Without multiprogramming, real time is the sum of every CPU and I/O burst; with multiprogramming, it is the length of the overlapped Gantt chart. [Utilization from a job timeline, with and without multiprogramming](#/comp4736-p3/job-timelines)"
  },
  {
    "type": "reorder",
    "q": "Put the regions of the Linux process address space in the slide-47 order, from higher address to lower address.",
    "lines": ["Kernel space", "Stack", "Heap", "BSS", "Data", "Text"],
    "explain": "Slide 47. Everything from the stack down to text is user space; the stack grows down and the heap grows up into the gap between them. [Text, data, BSS, heap, stack and /proc](#/comp4736-p3/linux-address-space)"
  },
  {
    "type": "match",
    "q": "Match each region of the Linux address space to what the slide says it holds.",
    "pairs": [
      ["Stack", "Local variables, return address, and parameters"],
      ["BSS", "Uninitialized global (or static) variables"],
      ["Data", "Initialized global (or static) variables"],
      ["Text", "Program code"]
    ],
    "explain": "Slide 47's callouts. The heap has no callout; in `/proc/<pid>/maps` it shows as `[heap]` (slide 53). [Text, data, BSS, heap, stack and /proc](#/comp4736-p3/linux-address-space)"
  },
  {
    "type": "text",
    "q": "What does BSS stand for?",
    "answer": ["Block Started by Symbols", "block started by symbol", "block started by symbols"],
    "explain": "Slide 47: *Block Started by Symbols. Uninitialized global (or static) variables*. [Text, data, BSS, heap, stack and /proc](#/comp4736-p3/linux-address-space)"
  },
  {
    "type": "text",
    "q": "The proc filesystem is a ___ which provides an interface to kernel data structures, commonly mounted at /proc.",
    "answer": ["pseudo-filesystem", "pseudo filesystem", "pseudo-file system", "pseudo file system", "a pseudo-filesystem"],
    "explain": "Slide 50 (`man proc`). Every process in Linux is represented by a directory in /proc named by its PID, and `/proc/<pid>/maps` shows its address space. [Text, data, BSS, heap, stack and /proc](#/comp4736-p3/linux-address-space)"
  },
  {
    "type": "fill",
    "q": "The slide-48 fork figure: the main process has parent_pid = 4508 and the child gets child_pid = 4509. What does `fork()` return in each?",
    "code": "Parent process: fork_return_value = ___\nChild process:  fork_return_value = ___",
    "answer": ["4509", "0"],
    "explain": "The parent gets the child's PID, the child gets 0, and the parent keeps its own PID 4508. Lab 4's program printed the same pattern with its own numbers. [fork(), parent_pid 4508 and child 4509, and the stripped-down shell](#/comp4736-p3/fork-and-the-shell)"
  },
  {
    "type": "fill",
    "q": "Complete the two calls of the slide-49 stripped-down shell.",
    "code": "if (fork() != 0) {\n    /* Parent code. */\n    ___(-1, &status, 0);              /* wait for child to exit */\n} else {\n    /* Child code. */\n    ___(command, parameters, 0);      /* execute command */\n}",
    "answer": ["waitpid", "execve"],
    "explain": "Only the parent sees a nonzero return, so it waits; the child gets 0 and executes the command. Throughout this book, TRUE is assumed to be defined as 1, so `while (TRUE)` repeats forever. [fork(), parent_pid 4508 and child 4509, and the stripped-down shell](#/comp4736-p3/fork-and-the-shell)"
  },
  {
    "type": "match",
    "q": "Match each monitoring tool to its one-line description on slide 54.",
    "pairs": [
      ["pstree", "display a tree of processes"],
      ["ps", "report a snapshot of the current processes"],
      ["top", "display Linux processes"]
    ],
    "explain": "Slide 54's examples: `pstree -p -T`, `ps aux`, `top`. htop is the interactive variant shown on slide 58. [pstree, ps, top and the state letters D I R S T X Z](#/comp4736-p3/linux-process-states)"
  },
  {
    "type": "match",
    "q": "Match each top column to the slide-57 label.",
    "pairs": [
      ["PR", "Priority"],
      ["NI", "Nice value"],
      ["VIRT", "Virtual Image"],
      ["RES", "Resident size"],
      ["SHR", "Shared Mem size"],
      ["S", "Process Status"]
    ],
    "explain": "Slide 57 also labels PID (Process ID), USER (User name), %CPU (CPU usage) and %MEM (Memory usage). [pstree, ps, top and the state letters D I R S T X Z](#/comp4736-p3/linux-process-states)"
  },
  {
    "type": "match",
    "q": "Match each ps state letter to its meaning from `man ps` (slide 59).",
    "pairs": [
      ["D", "uninterruptible sleep (usually IO and cannot be killed)"],
      ["I", "Idle kernel thread"],
      ["R", "running or runnable (on run queue)"],
      ["S", "interruptible sleep (waiting for an event to complete and can be killed)"],
      ["T", "stopped by job control signal"],
      ["X", "dead (should never be seen)"],
      ["Z", "defunct (zombie) process, terminated but not reaped by its parent"]
    ],
    "explain": "D, I, R, S, T, X, Z in the slide's order. D cannot be killed and S can, which is why D leaves only on *wake up* and S on *wake up/signal* in the slide-61 diagram. [pstree, ps, top and the state letters D I R S T X Z](#/comp4736-p3/linux-process-states)"
  },
  {
    "type": "match",
    "q": "Match each extra STAT flag to its meaning (slide 59).",
    "pairs": [
      ["<", "high-priority (not nice to other users)"],
      ["N", "low-priority (nice to other users)"],
      ["+", "is in the foreground process group"]
    ],
    "explain": "`sleep 10000` shows SN on slide 60: interruptible sleep, low priority. `ps ax` itself shows RN+: running, low priority, foreground. [pstree, ps, top and the state letters D I R S T X Z](#/comp4736-p3/linux-process-states)"
  },
  {
    "type": "match",
    "q": "Match each label on the slide-61 Linux state diagram to the arrow it sits on.",
    "pairs": [
      ["SIGSTOP", "R to T"],
      ["SIGCONT", "T to R"],
      ["Exit()", "R to Z"],
      ["wake up", "D to R"],
      ["wake up/signal", "S to R"]
    ],
    "explain": "The arrows R to D and R to S are unlabelled, and no arrow leaves Z. [pstree, ps, top and the state letters D I R S T X Z](#/comp4736-p3/linux-process-states)"
  },
  {
    "type": "text",
    "q": "A process that has terminated but whose parent did not wait for it, so it still lives in the system's task list, is called a ___ process.",
    "answer": ["zombie", "defunct", "zombie process"],
    "explain": "Slide 63: *The parent process is responsible for waiting for child process to terminate and then cleaning up the child process entry from the process table.* A zombie *doesn't consume many system resources, but it does continue to live in the system's task list*. ps shows it as Z. [Zombie and orphan processes](#/comp4736-p3/zombies-and-orphans)"
  },
  {
    "type": "text",
    "q": "A process whose parent dies (or terminates) before it, while it keeps running, is called an ___ process.",
    "answer": ["orphan", "orphan process"],
    "explain": "Slide 67. It is automatically adopted by init. [Zombie and orphan processes](#/comp4736-p3/zombies-and-orphans)"
  },
  {
    "type": "fill",
    "q": "Who adopts an orphan, and with what PID?",
    "code": "The child process will be automatically adopted by the ___ process (the parent of all the processes with the pid of ___).",
    "answer": ["init", "1"],
    "explain": "Slide 67. In the slide's container the PID 1 process is `tini`, so the orphan a.out(475) reappeared directly under tini(1). [Zombie and orphan processes](#/comp4736-p3/zombies-and-orphans)"
  }
]
```

## The process model

| Fact | Slide |
|---|---|
| Process: *an instance of an executing program, including the current values of the program counter (PC), registers, and variables* | 2 |
| One program run three times: three processes, same name, three PIDs (main 1475, 1476, 1477 under bash 1352) | 3 |
| Three segments: text (program code), data (variables), stack; data grows upward, stack grows downward, gap between | 6 |
| Multiprogramming: switches quickly; tens or hundreds of milliseconds per process; only one process at any instant | 7 |
| Figures: (a) one program counter, (b) four program counters, the conceptual model, (c) *Only one program is active at once* | 7–9 |

## Creation, termination and hierarchies

| Creation events (slide 10) | Termination conditions (slide 17) |
|---|---|
| 1. System initialization (foreground processes and daemons) | 1. Normal exit (voluntary): `exit` / `ExitProcess` |
| 2. Execution of a process-creation system call by a running process | 2. Error exit (voluntary): `cc foo.c`, no such file |
| 3. A user request to create a new process (command or icon) | 3. Fatal error (involuntary): illegal instruction, nonexistent memory, divide by zero |
| 4. Initiation of a batch job (only batch systems on large mainframes) | 4. Killed by another process (involuntary): `kill` / `TerminateProcess` |

| Hierarchy | UNIX | Windows |
|---|---|---|
| Structure | process group: a process and all its descendants | no process hierarchy; all processes are equal |
| Control | keyboard signal to every member; catch, ignore, or default (be killed) | parent gets a handle and may pass it on |
| Disinherit | cannot disinherit children | passing the handle invalidates the hierarchy |

## States and transitions

| # | From → To | Legend | Caused by |
|---|---|---|---|
| 1 | Running → Blocked | Process blocks for input | the OS discovers the process cannot continue (`pause`, empty pipe) |
| 2 | Running → Ready | Scheduler picks another process | process scheduler: run long enough |
| 3 | Ready → Running | Scheduler picks this process | process scheduler: others had their fair share |
| 4 | Blocked → Ready | Input becomes available | the external event |

Running: actually using the CPU. Ready: scheduled and runnable, temporarily stopped. Blocked: unable to run until some external event happens. No Blocked → Running, no Ready → Blocked.

## Process table, context switch and interrupts

| Fact | Slide |
|---|---|
| Process table: an array of structures, one entry per process; the entry is what must be saved to restart *as if it had never been stopped* | 30 |
| Context switch: save the running process's state, load another's; the context goes into the PCB, a component of the process table | 31–32 |
| Entry fields: process management 15, memory management 3 (text, data, stack pointers), file management 5 (root dir, working dir, file descriptors, user ID, group ID) | 40 |
| Interrupt skeleton: HW stacks PC; HW loads PC from interrupt vector; asm saves registers; asm sets up stack; C service runs; scheduler decides; C returns to asm; asm starts new current process | 41 |
| Interrupt vector: fixed location near the bottom of memory; x86 real mode 256 × 4-byte IP:CS entries from 00000000 | 41–42 |

## Modeling multiprogramming

| Fact | Value |
|---|---|
| CPU utilization (slide 43) | 1 − pⁿ; pⁿ = all n waiting = CPU idle |
| n = 3 cases (slide 44) | (1 − p)³ + 3p(1 − p)² + 3p²(1 − p) = 1 − p³ |
| Slide 46 | 80 % I/O wait, 10 processes, waste (0.8)¹⁰ ≈ 0.1074; strictly 11 for below 10 % |
| Assumption | all n processes independent |
| RAM budget | n = (RAM − OS) ÷ process size; then p = (1 − U)^(1/n) |
| Timeline | utilization = total CPU time ÷ total real time |
| Parallel jobs | one job alone: T = CPU time ÷ (1 − p); in parallel: total CPU ÷ (1 − pⁿ) |

## Linux processes

| Fact | Slide |
|---|---|
| Address space, high to low: kernel space, stack (locals, return address, parameters), heap, BSS (uninitialized globals), data (initialized globals), text (program code) | 47 |
| `fork()`: parent gets child_pid (4509), child gets 0; parent keeps 4508 | 48 |
| Shell: parent `waitpid(-1, &status, 0)`, child `execve(command, parameters, 0)` | 49 |
| /proc: pseudo-filesystem, interface to kernel data structures; one directory per PID; `maps` = address space | 50–53 |
| pstree (tree), ps (snapshot), top (display Linux processes); top columns PR, NI, VIRT, RES, SHR, S | 54–57 |
| D uninterruptible sleep, I idle kernel thread, R running/runnable, S interruptible sleep, T stopped, X dead, Z zombie; < high, N low priority, + foreground | 59 |
| Diagram: R→T SIGSTOP, T→R SIGCONT, R→Z Exit(), D→R wake up, S→R wake up/signal | 61 |
| Zombie: parent did not wait; little resource use, still in the task list (child 1550 Z, "1 zombie") | 63–64 |
| Orphan: parent died first; adopted by init, pid 1 (a.out 475 moved under tini 1) | 67–68 |

---
title: "Mock midterm: Part 3"
minutes: 35
---
A Part 3 section in the midterm's two formats: T/F and MCQ as in LockDown Browser, then written calculations to work on paper before typing the number. Closed book, a calculator allowed; give utilizations as decimals to three places.

```quiz
[
  {
    "q": "Which of these is the slide's definition of a process?",
    "options": [
      "An instance of an executing program, including the current values of the program counter, registers, and variables",
      "The program code stored in an executable file such as main.exe",
      "A table, an array of structures, with one entry per running program",
      "A data structure that represents a single process in the operating system"
    ],
    "answer": 0,
    "explain": "Slide 2: *A process is just an instance of an executing program, including the current values of the program counter (PC), registers, and variables.* The file main.exe is the program, not the process. An array of structures with one entry per process is the process table, and the data structure that represents a single process is the PCB. Dropping the word *executing* makes the definition false. [A process is a program in execution](#/comp4736-p3/process-model)"
  },
  {
    "q": "The same main.exe is started three times from one bash shell. What does `pstree -p` show under bash?",
    "options": [
      "Three processes named main, each with a different process ID",
      "One process named main with three program counters",
      "Three processes named main that share one process ID",
      "One process named main, because a program can be loaded only once"
    ],
    "answer": 0,
    "explain": "Slide 3 shows exactly this: `bash(1352)` with children `main(1475)`, `main(1476)` and `main(1477)`. One program file run three times gives three processes: same process name, three process IDs. [A process is a program in execution](#/comp4736-p3/process-model)"
  },
  {
    "q": "Strictly speaking, at any one instant a single CPU in a multiprogramming system is running several processes at once.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 7, sentence 3: *Strictly speaking, at any one instant the CPU is running only one process.* The CPU switches quickly, running each process for tens or hundreds of milliseconds, so over a second several processes make progress. Figure (c) draws only one bar at any time. [A process is a program in execution](#/comp4736-p3/process-model)"
  },
  {
    "q": "In the three-segment UNIX model, the data segment grows downward and the stack grows upward.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 6: *The data segment grows upward and the stack grows downward.* Text sits at address 0000, data above it, the stack at FFFF, and the gap between data and stack is the room both grow into. [A process is a program in execution](#/comp4736-p3/process-model)"
  },
  {
    "q": "The slide's example of a store chain running inventory management at the end of the day illustrates which process-creation event?",
    "options": [
      "Initiation of a batch job",
      "System initialization",
      "A user request to create a new process",
      "Execution of a process-creation system call by a running process"
    ],
    "answer": 0,
    "explain": "Slide 16: the batch-job case *applies only to the batch systems found on large mainframes*; users submit batch jobs, and when the OS has the resources it creates a process and runs the next job from the input queue in it. System initialization is boot time (daemons); a user request is typing a command or clicking an icon; the system-call case is the network-fetch and shared-buffer example. [The four events that create a process](#/comp4736-p3/process-creation)"
  },
  {
    "q": "Processes created at boot that interact with users and perform work for them are called daemons.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 11 splits the boot-time processes in two. Those interacting with users are **foreground processes**. Daemons are the background ones: *Processes that stay in the background to handle some activity such as email, Web pages, news, printing, and so on are called daemons.* [The four events that create a process](#/comp4736-p3/process-creation)"
  },
  {
    "q": "A user runs the compiler on a file that does not exist; the compiler prints `no input files` and exits. Which termination condition is this?",
    "options": [
      "Error exit (voluntary)",
      "Fatal error (involuntary)",
      "Normal exit (voluntary)",
      "Killed by another process (involuntary)"
    ],
    "answer": 0,
    "explain": "Slide 19: with `cc foo.c` and no such file, *the compiler simply announces this fact and exits*. The process notices the problem itself and leaves, so it is an error exit, voluntary. The gcc output says \"fatal error\", but condition 3, fatal error, is an error caused by the process, such as a bug, that the OS acts on. [The four ways a process ends, and process hierarchies](#/comp4736-p3/process-termination)"
  },
  {
    "q": "A program references nonexistent memory and the operating system ends it. Which termination condition is this?",
    "options": [
      "Fatal error (involuntary)",
      "Error exit (voluntary)",
      "Normal exit (voluntary)",
      "Killed by another process (involuntary)"
    ],
    "answer": 0,
    "explain": "Slide 20: the third reason is *an error caused by the process, often due to a program bug. Examples include executing an illegal instruction, referencing nonexistent memory, or dividing by zero.* In UNIX the process can ask to handle some of these errors itself, and is then signaled instead of terminated. [The four ways a process ends, and process hierarchies](#/comp4736-p3/process-termination)"
  },
  {
    "q": "Which call does a Windows process use to kill another process?",
    "options": ["TerminateProcess", "ExitProcess", "kill", "exit"],
    "answer": 0,
    "explain": "Slide 21: *In UNIX this call is kill. The corresponding Win32 function is TerminateProcess.* `exit` (UNIX) and `ExitProcess` (Windows) end the calling process itself, the normal exit of slide 18. In both systems the killer needs the authorization to do in the killee. [The four ways a process ends, and process hierarchies](#/comp4736-p3/process-termination)"
  },
  {
    "q": "A UNIX parent can hand its control token for a child to another process, which ends the parent-child relationship.",
    "type": "tf",
    "answer": false,
    "explain": "The token is the Windows **handle** (slide 24): the Windows parent is free to pass it to another process, *thus invalidating the hierarchy*. Windows *has no concept of a process hierarchy*. In UNIX the hierarchy is fixed: *Processes in UNIX cannot disinherit their children.* [The four ways a process ends, and process hierarchies](#/comp4736-p3/process-termination)"
  },
  {
    "q": "What is the Blocked state?",
    "options": [
      "Unable to run until some external event happens",
      "Actually using the CPU at that instant",
      "Scheduled and runnable; temporarily stopped to let another process run",
      "Terminated but not yet reaped by its parent"
    ],
    "answer": 0,
    "explain": "Slide 25: Running is *actually using the CPU at that instant*, Ready is *scheduled and runnable; temporarily stopped to let another process run*, Blocked is *unable to run until some external event happens*. Terminated but not reaped is the Linux zombie, Z. [Running, Ready, Blocked and the four transitions](#/comp4736-p3/process-states)"
  },
  {
    "q": "The running process has used the CPU long enough and the scheduler gives the CPU to another process. Which transition does the first process make?",
    "options": [
      "Running to Ready (transition 2)",
      "Running to Blocked (transition 1)",
      "Ready to Running (transition 3)",
      "Blocked to Ready (transition 4)"
    ],
    "answer": 0,
    "explain": "Slide 28: *Transition 2 occurs when the scheduler decides that the running process has run long enough, and it is time to let another process have some CPU time.* The process is still runnable, so it goes to Ready, not Blocked. Transition 1 happens when the process cannot continue, for example reading a pipe with no input. [Running, Ready, Blocked and the four transitions](#/comp4736-p3/process-states)"
  },
  {
    "q": "When the input a blocked process was waiting for arrives, transition 4 moves it straight from Blocked to Running.",
    "type": "tf",
    "answer": false,
    "explain": "Transition 4 is Blocked to Ready (*Input becomes available*). Slide 29: *If no other process is running at that instant, transition 3 will be triggered and the process will start running.* Otherwise it waits in Ready. The diagram has no Blocked to Running arrow. [Running, Ready, Blocked and the four transitions](#/comp4736-p3/process-states)"
  },
  {
    "q": "Transitions 2 and 3 are caused by the process scheduler, without the process even knowing about them.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 28, verbatim: *Transitions 2 and 3 are caused by the process scheduler, a part of the operating system, without the process even knowing about them.* Transition 1 is discovered by the OS when the process cannot continue; transition 4 is caused by the external event. [Running, Ready, Blocked and the four transitions](#/comp4736-p3/process-states)"
  },
  {
    "q": "In the slide's table of process table entry fields, which field is listed under file management?",
    "options": ["Working directory", "Program counter", "Pointer to stack segment info", "Priority"],
    "answer": 0,
    "explain": "Slide 40 has three columns. File management (5 fields): root directory, working directory, file descriptors, user ID, group ID. Memory management (3): pointers to text, data and stack segment info. Process management (15) holds the program counter and the priority, with registers, PSW, stack pointer, process state and the rest. [The process table, the PCB and the context switch](#/comp4736-p3/process-table)"
  },
  {
    "q": "During a context switch, where does the operating system save the outgoing process's program counter and register values?",
    "options": [
      "In the process's PCB (Process Control Block)",
      "In the interrupt vector",
      "In the process's text segment",
      "In the BSS segment"
    ],
    "answer": 0,
    "explain": "Slide 31: the scheduler *must save the current process's context, including its program counter, register values, and other relevant state information, into the process's PCB*. The PCB is *a crucial component within the process table*. The interrupt vector holds handler addresses, the text segment holds program code, BSS holds uninitialized globals. [The process table, the PCB and the context switch](#/comp4736-p3/process-table)"
  },
  {
    "q": "In the skeleton of what the lowest level of the OS does on an interrupt, which step comes right after *Hardware stacks program counter, etc.*?",
    "options": [
      "Hardware loads new program counter from interrupt vector",
      "Assembly language procedure saves registers",
      "C interrupt service runs",
      "Scheduler decides which process is to run next"
    ],
    "answer": 0,
    "explain": "Slide 41, steps 1 to 8: hardware stacks the PC; hardware loads the new PC from the interrupt vector; assembly saves registers; assembly sets up a new stack; the C interrupt service runs; the scheduler decides who runs next; C returns to the assembly code; assembly starts up the new current process. Both of the first two steps are done by hardware. [What the lowest level of the OS does when an interrupt occurs](#/comp4736-p3/interrupts)"
  },
  {
    "q": "The interrupt vector is typically at a fixed location near the top of memory.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 41: *Associated with each I/O class is a location (typically at a fixed location near the bottom of memory) called the interrupt vector.* The x86 real-mode table on slide 42 starts at address 00000000: 256 entries of 4 bytes (IP, CS) up to 000003FF. [What the lowest level of the OS does when an interrupt occurs](#/comp4736-p3/interrupts)"
  },
  {
    "q": "In the probabilistic model, the CPU utilization with n processes in memory, each waiting for I/O a fraction p of its time, is pⁿ.",
    "type": "tf",
    "answer": false,
    "explain": "pⁿ is *the probability that all n processes are waiting for I/O (in which case the CPU will be idle)*: the CPU waste. Slide 43: *CPU utilization = 1 − pⁿ*. Slide 46 adds that the model *assumes that all n processes are independent*. [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "q": "Which region of the Linux process address space holds local variables, the return address and parameters?",
    "options": ["Stack", "Heap", "Data", "BSS"],
    "answer": 0,
    "explain": "Slide 47, from higher to lower address: kernel space, stack (*Local variables, return address, and parameters*), heap, BSS (*Uninitialized global (or static) variables*), data (*Initialized global (or static) variables*), text (*Program code*). The stack grows down and the heap grows up. [Text, data, BSS, heap, stack and /proc](#/comp4736-p3/linux-address-space)"
  },
  {
    "q": "A parent with PID 6120 calls `fork()` and the new child gets PID 6121. What value does `fork()` return in the parent?",
    "options": ["6121", "6120", "0", "-1"],
    "answer": 0,
    "explain": "Slide 48: in the parent *fork_return_value = child_pid*, in the child *fork_return_value = 0*. The parent keeps its own PID 6120 (`getpid()` still prints 6120) but `fork()` hands it the child's PID, 6121. The slide's numbers are 4508 and 4509. [fork(), parent_pid 4508 and child 4509, and the stripped-down shell](#/comp4736-p3/fork-and-the-shell)"
  },
  {
    "q": "In the slide's stripped-down shell, what does the child process do after `fork()`?",
    "options": [
      "Calls `execve(command, parameters, 0)` to execute the command",
      "Calls `waitpid(-1, &status, 0)` to wait for the parent",
      "Calls `type_prompt()` to display the prompt again",
      "Calls `read_command(command, parameters)` to read the next line"
    ],
    "answer": 0,
    "explain": "Slide 49: `if (fork( ) != 0)` is the parent branch, because only the parent gets a nonzero return; it runs `waitpid(-1, &status, 0)`, *wait for child to exit*. The child gets 0, takes the else branch and runs `execve(command, parameters, 0)`, *execute command*. The prompt and the read happen in the parent's loop. [fork(), parent_pid 4508 and child 4509, and the stripped-down shell](#/comp4736-p3/fork-and-the-shell)"
  },
  {
    "q": "`ps` shows a process with STAT `D`. What does that mean?",
    "options": [
      "Uninterruptible sleep, usually IO, and it cannot be killed",
      "Interruptible sleep, waiting for an event to complete, and it can be killed",
      "Stopped by job control signal",
      "Defunct (zombie): terminated but not reaped by its parent"
    ],
    "answer": 0,
    "explain": "Slide 59 (`man ps`): D *uninterruptible sleep (usually IO and cannot be killed)*, S *interruptible sleep (waiting for an event to complete and can be killed)*, T *stopped by job control signal*, Z *defunct (\"zombie\") process, terminated but not reaped by its parent*. On the slide-61 diagram, D returns to R only on *wake up*. [pstree, ps, top and the state letters D I R S T X Z](#/comp4736-p3/linux-process-states)"
  },
  {
    "q": "On the slide's Linux state diagram, which label is on the arrow from R (running/runnable) to T (stopped)?",
    "options": ["SIGSTOP", "SIGCONT", "Exit()", "wake up/signal"],
    "answer": 0,
    "explain": "Slide 61: R to T is SIGSTOP and T back to R is SIGCONT; R to Z is Exit(); S to R is wake up/signal; D to R is wake up. No arrow leaves Z. [pstree, ps, top and the state letters D I R S T X Z](#/comp4736-p3/linux-process-states)"
  },
  {
    "q": "A child prints one line and calls `exit(0)` at once; its parent prints a line, calls `sleep(60)` and never calls `wait()`. During those 60 seconds, which states does `ps` show?",
    "options": [
      "Parent S, child Z",
      "Parent R, child X",
      "Parent Z, child S",
      "Parent D, child T"
    ],
    "answer": 0,
    "explain": "The sleeping parent waits for its timer: S, interruptible sleep (slide 60 shows `sleep 10000` in S). The child has terminated but nobody waited for it, so it is a zombie, Z: *The zombie process can be easily created when the parent process does not wait for the child process termination* (slide 63). The slide-64 top screen shows the same pair, parent 1549 in S and child 1550 in Z. [Zombie and orphan processes](#/comp4736-p3/zombies-and-orphans)"
  },
  {
    "q": "`pstree` shows `a.out(812)───a.out(813)`. Process 812 terminates while 813 keeps running. Who is 813's parent now?",
    "options": [
      "The init process, PID 1",
      "Its old parent 812, which stays in the tree as a zombie",
      "Nobody: the kernel kills 813 when its parent dies",
      "The bash shell that started 812"
    ],
    "answer": 0,
    "explain": "Slide 67: *The child process will be automatically adopted by the init process (the parent of all the processes with the pid of 1).* That is an orphan. In the slide's container the init role is played by `tini(1)`: after a.out(474) ended, a.out(475) appeared directly under tini(1). [Zombie and orphan processes](#/comp4736-p3/zombies-and-orphans)"
  }
]
```

## Part 2: written calculations

Work each on paper first, as the written part asks: the formula, the substitution, the number.

```quiz
[
  {
    "q": "Three jobs run in the order A, B, C. Job A: CPU 5, I/O 2, CPU 2. Job B: CPU 2, I/O 2, CPU 1. Job C: CPU 3, I/O 2, CPU 2 (time units). Without multiprogramming, each job runs to completion before the next starts. What is the CPU utilization?",
    "type": "numeric",
    "answer": 0.714,
    "tolerance": 0.002,
    "explain": "CPU utilization = total CPU time ÷ total real time. CPU time = (5 + 2) + (2 + 1) + (3 + 2) = 15. Without multiprogramming the CPU idles during every I/O burst, so real time = 9 + 5 + 7 = 21. Utilization = 15 ÷ 21 = 0.714. [Utilization from a job timeline, with and without multiprogramming](#/comp4736-p3/job-timelines)"
  },
  {
    "q": "Same three jobs (A: CPU 5, I/O 2, CPU 2; B: CPU 2, I/O 2, CPU 1; C: CPU 3, I/O 2, CPU 2), now with multiprogramming: whenever a job starts I/O, the CPU takes the next ready job, A before B before C. What is the CPU utilization?",
    "type": "numeric",
    "answer": 0.882,
    "tolerance": 0.002,
    "explain": "CPU owner slot by slot: time 0–4 A, 5–6 B, 7–8 A, 9 B, 10–12 C, 13–14 idle, 15–16 C. A's I/O runs during 5–6, so B takes the CPU; A is ready again at 7 just as B starts its I/O (7–8). B is back at 9 for its last unit. C runs 10–12, then its I/O (13–14) leaves nobody ready, so the CPU idles two units. Busy 15 of 17 units: 15 ÷ 17 = 0.882. [Utilization from a job timeline, with and without multiprogramming](#/comp4736-p3/job-timelines)"
  },
  {
    "q": "Five processes are in memory and each spends 75 % of its time waiting for I/O. What is the CPU utilization?",
    "type": "numeric",
    "answer": 0.7627,
    "tolerance": 0.001,
    "explain": "CPU utilization = 1 − pⁿ = 1 − 0.75⁵ = 1 − 0.2373 = 0.7627, about 76 %. The CPU is idle only when all five wait at once (probability 0.2373). [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "q": "Three independent processes are in memory, each waiting for I/O with probability 0.6. Using the slide-44 case table, what is the probability that exactly two of the three are waiting for I/O?",
    "type": "numeric",
    "answer": 0.432,
    "tolerance": 0.001,
    "explain": "The '2 idle' rows of the table are three cases, each with probability p²(1 − p): sum 3p²(1 − p) = 3 × 0.36 × 0.4 = 0.432. The CPU is still busy in this case (one process is ready). Adding the 0-, 1- and 2-idle rows gives U = 1 − p³ = 1 − 0.216 = 0.784. [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "q": "A computer has 6 GB of RAM, of which the operating system occupies 1 GB. Every process needs 640 MB. How many processes fit in memory at once?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "explain": "6 GB = 6 × 1024 MB = 6144 MB; 1 GB = 1024 MB. Memory left for processes = 6144 − 1024 = 5120 MB. n = 5120 ÷ 640 = 8 processes. [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "q": "Same machine (8 processes of 640 MB fit beside the OS). If the goal is 90 % CPU utilization, what is the largest I/O-wait fraction p each process can have? Answer as a decimal.",
    "type": "numeric",
    "answer": 0.7499,
    "tolerance": 0.002,
    "explain": "0.90 = 1 − p⁸, so p⁸ = 0.10 and p = 0.10^(1/8). With logs: ln 0.1 ÷ 8 = −2.3026 ÷ 8 = −0.2878, and e^(−0.2878) = 0.7499 ≈ 0.75. Each process may wait on I/O up to about 75 % of its time. [CPU utilization = 1 − pⁿ](#/comp4736-p3/modeling-multiprogramming)"
  },
  {
    "q": "Two jobs, each needing 12 minutes of CPU time, start at the same time. Each spends 75 % of its time waiting for I/O. How long until the last one completes if they run sequentially, in minutes?",
    "type": "numeric",
    "answer": 96,
    "tolerance": 0,
    "unit": "min",
    "explain": "Alone, a job uses the CPU only 25 % of the time: 12 + 0.75 T = T gives T = 12 ÷ 0.25 = 48 minutes per job. Sequentially the second job finishes at 48 + 48 = 96 minutes. [Utilization from a job timeline, with and without multiprogramming](#/comp4736-p3/job-timelines)"
  },
  {
    "q": "Same two jobs (12 CPU-minutes each, 75 % I/O wait). How long until the last one completes if they run in parallel, in minutes?",
    "type": "numeric",
    "answer": 54.857,
    "tolerance": 0.05,
    "unit": "min",
    "explain": "With n = 2 in memory, CPU utilization = 1 − 0.75² = 1 − 0.5625 = 0.4375. The CPU must deliver 12 + 12 = 24 minutes of work, so T = 24 ÷ 0.4375 = 54.86 minutes, against 96 sequentially. [Utilization from a job timeline, with and without multiprogramming](#/comp4736-p3/job-timelines)"
  },
  {
    "q": "How many processes exist when the `printf` line is reached, counting the original?",
    "code": "int main() {\n    fork();\n    fork();\n    printf(\"hello\\n\");\n    return 0;\n}",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "The first `fork()` gives 2 processes, and both continue at the next line. Each of the two then runs the second `fork()`, so 2 × 2 = 4 processes reach `printf`, and `hello` prints 4 times. In general n forks in a row give 2ⁿ processes. [fork(), parent_pid 4508 and child 4509, and the stripped-down shell](#/comp4736-p3/fork-and-the-shell)"
  }
]
```

---
title: Practice Part 1, processes and system calls
minutes: 22
---
Twenty-two of the 74 practice questions test lecture Parts 3 and 5, eleven each. They are here verbatim with the instructor's key, grouped by the slide fact each one tests. Q21 and Q35 are the same question, and their key ("text") disagrees with the slides; the explanation says so.

## A process is an instance of an executing program, and the CPU has one program counter

Part 3, slide 2: *A process is just an instance of an executing program, including the current values of the program counter (PC), registers, and variables.* The practice paper drops one word from that sentence.

Slides 7 to 9 draw multiprogramming three ways. Figure (a) has *One program counter* jumping between A, B, C and D in memory; figure (b) is the *Conceptual model* with four program counters; figure (c) is the timeline, captioned *Only one program is active at once.* Slide 7 says it in words: *Strictly speaking, at any one instant the CPU is running only one process.* Each process's own PC exists only as a saved value in its process-table entry (slide 30).

Slide 6 names the three UNIX segments: *the text segment (i.e., the program code), the data segment (i.e., the variables), and the stack segment*. Slide 47 adds the Linux heap and BSS. None of these holds the live PC and registers; slide 31 saves those into the process's PCB on a context switch. The practice key nonetheless answers "text" for Q21 and Q35.

```quiz
[
  {
    "q": "**Q58.** A process is just an instance of a program, including the current values of the program counter (PC), registers, and variables.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 2 reads *an instance of an executing program*. The paper's version drops *executing*, and the key marks it False: a program on disk is a file, a process is that program running. [The process model](#/comp4736-p3/process-model)"
  },
  {
    "q": "**Q39.** In a multiprogramming system each process has its own program counter.",
    "type": "tf",
    "answer": false,
    "explain": "The key reads this as the physical register. Figure (a) of slide 7 has *One program counter* that jumps from process to process. The four program counters of figure (b) are the *Conceptual model*: each process's logical PC is a value saved in its process-table entry and loaded back into the one real PC when it runs again. [The process model](#/comp4736-p3/process-model)"
  },
  {
    "q": "**Q61.** In a multiprogramming system with four processes, which of the following can occur when using a single-core CPU? (Each option is a Process (A, B, C, D) against Time plot, described in words.)",
    "options": [
      "A, B, C, D run in turn, then A, B, C, D again; A's second bar starts just before D's first bar ends, so two processes briefly overlap",
      "A, B, C, D run in turn, then A, B, C, D again; each bar starts exactly where the previous one ends",
      "A, B, C and D each run as one long bar over the same whole interval",
      "A, B, C and D all run together for a short bar at the very start, then each runs once more in turn"
    ],
    "answer": 1,
    "explain": "One core runs one process at a time: *Strictly speaking, at any one instant the CPU is running only one process* (slide 7), and figure (c) is captioned *Only one program is active at once.* So the bars may interleave but never overlap, not even for a moment. Every plot with two bars over the same instant needs a second core. [The process model](#/comp4736-p3/process-model)"
  },
  {
    "q": "**Q21.** Which of the following includes the current activity represented by the value of Program Counter and the contents of the processor's registers.",
    "options": ["heap", "data", "text", "stack"],
    "answer": 2,
    "explain": "**Graded as the key has it: text.** On the slides none of the segments holds the PC and registers: slide 6 makes text *the program code* and data *the variables*, the stack holds local variables, return addresses and parameters (slide 47), and the PC and registers are part of the process itself (slide 2), saved into its PCB on a context switch (slide 31). The key appears to follow Silberschatz's Operating System Concepts (not the course textbook), whose definition lists the text section and the current activity (PC and registers) side by side. Answer text on the exam if the item returns. [The process model](#/comp4736-p3/process-model)"
  },
  {
    "q": "**Q35.** Which of the following includes the current activity represented by the value of program counter and the contents of the processor's registers.",
    "options": ["stack", "heap", "text", "data"],
    "answer": 2,
    "explain": "The same question as Q21 with the options reordered, and the same key: text. The slide view: text is the program code (slide 6); the live PC and registers belong to the running process and are saved into its PCB when it is switched out (slide 31). Grade yourself by the key. [The process model](#/comp4736-p3/process-model)"
  }
]
```

## Each process owns its resources, and one process table lists them all

Part 4, slides 14 and 15, *Per process items*: address space, global variables, open files, child processes, pending alarms, signals and signal handlers, accounting information. Per thread: program counter, registers, stack, state. Part 3, slide 30: *the operating system maintains a table (an array of structures), called the process table, with one entry per process.* There is one table; each process is a row.

```quiz
[
  {
    "q": "**Q14.** In operating system, each process has its own __________",
    "options": [
      "open files",
      "pending alarms, signals, and signal handlers",
      "address space and global variables",
      "all of the mentioned"
    ],
    "answer": 3,
    "explain": "All three are in the *Per process items* column of the Part 4 table: address space, global variables, open files, child processes, pending alarms, signals and signal handlers, accounting information. Threads of one process share every one of them; a thread owns only its PC, registers, stack and state. [The classical thread model](#/comp4736-p4/classical-thread-model)"
  },
  {
    "q": "**Q36.** Each process has its own process table.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 30: the OS keeps one *process table*, *with one entry per process*. Each process has its own entry (its PCB, slide 31), holding the PC, stack pointer, memory allocation, open files and the rest. [The process table](#/comp4736-p3/process-table)"
  }
]
```

## Daemons, the ready state, the missing transition and the ways to terminate

- Slide 11: *Processes that stay in the background to handle some activity such as email, Web pages, news, printing, and so on are called daemons.*
- Slide 25, the three states: **Running** (*actually using the CPU at that instant*), **Ready** (*scheduled and runnable; temporarily stopped to let another process run*), **Blocked** (*unable to run until some external event happens*).
- Slide 26 draws four transitions: 1 Running → Blocked, 2 Running → Ready, 3 Ready → Running, 4 Blocked → Ready. There is no Blocked → Running arrow: when the event arrives the process goes to Ready, and runs only when the scheduler picks it (slide 29).
- Slide 17, termination: normal exit (voluntary), error exit (voluntary), fatal error (involuntary), killed by another process (involuntary).

```quiz
[
  {
    "q": "**Q16.** A process that stay in the background to handle some activity is called:",
    "options": ["Kernel thread", "Daemon", "User thread"],
    "answer": 1,
    "explain": "Slide 11: processes that stay in the background to handle email, Web pages, news or printing *are called daemons*. They are created at system initialization, the first of the four creation events. Kernel and user threads are Part 4 terms for threads, not background processes. [Process creation](#/comp4736-p3/process-creation)"
  },
  {
    "q": "**Q30.** What is the ready state of a process?",
    "options": [
      "when process is using the CPU",
      "none of the mentioned",
      "when process is scheduled to run after some execution",
      "when process is unable to run until some task has been completed"
    ],
    "answer": 2,
    "explain": "Slide 25: Ready is *scheduled and runnable; temporarily stopped to let another process run*. Using the CPU is Running; unable to run until something completes is Blocked (*unable to run until some external event happens*). [Process states](#/comp4736-p3/process-states)"
  },
  {
    "q": "**Q47.** Which of the following state transitions is not possible ?",
    "options": ["blocked to ready", "running to blocked", "ready to running", "blocked to running"],
    "answer": 3,
    "explain": "Slide 26 draws exactly four arrows: running → blocked (blocks for input), running → ready (scheduler picks another), ready → running (scheduler picks this one), blocked → ready (input becomes available). Blocked → running is not one of them: a process whose input arrives goes to ready first, and runs only when the scheduler picks it (transition 4, then 3, slide 29). [Process states](#/comp4736-p3/process-states)"
  },
  {
    "q": "**Q73.** A process can be terminated due to:",
    "options": ["fatal error", "normal exit", "killed by another process", "all of the mentioned"],
    "answer": 3,
    "explain": "Slide 17 lists four conditions: normal exit (voluntary), error exit (voluntary), fatal error (involuntary), killed by another process (involuntary). Three of the four are offered, so all of the mentioned. Killing uses `kill` in UNIX and `TerminateProcess` in Win32 (slide 21). [Process termination](#/comp4736-p3/process-termination)"
  }
]
```

## System calls are the interface to the OS, entered by a software interrupt

Part 5, slide 2: *OS provides the set of system calls that is an interface between the operating system and the user programs.* Because system calls are *highly machine dependent and often must be expressed in assembly code*, the OS also *provides a procedure library to make system calls from C programs*. Slide 18 shows the direct route as well: `syscall()` invokes a call by number, *useful … when invoking a system call that has no wrapper function in the C library.* Slide 1 classifies interrupts: hardware interrupts are asynchronous, exceptions (1/0) and **software interrupts (traps)** are synchronous, and the software interrupt's example is *System calls*.

```quiz
[
  {
    "q": "**Q17.** Choose the correct statements.",
    "options": [
      "**A.** C programs can directly make system calls",
      "**B.** Library functions in C can use system calls",
      "**C.** Both (A) and (B)",
      "**D.** Library functions don't use system calls."
    ],
    "answer": 2,
    "explain": "Both are on the slides. Library functions use system calls: the OS *provides a procedure library to make system calls from C programs* (slide 2), and `printf` ends in a `write`. C programs can also make them directly: slide 6 calls `read(0, buffer, 100)` itself, and slide 18 calls `syscall(SYS_read, …)` by number. [The system-call interface](#/comp4736-p5/system-call-interface)"
  },
  {
    "q": "**Q19.** What invokes the system calls?",
    "options": ["A software interrupt", "A privileged instruction", "An indirect jump", "Polling"],
    "answer": 0,
    "explain": "Slide 1's third column: *Software interrupts (traps)*, synchronous, *Examples: System calls*. In the eleven steps, step 6 executes a TRAP instruction to switch from user mode to kernel mode. A privileged instruction is one only kernel mode may run, so a user program cannot use one to enter the kernel; polling is busy waiting on a device. [Interrupt classes](#/comp4736-p5/interrupt-classes) · [The eleven steps](#/comp4736-p5/eleven-steps)"
  },
  {
    "q": "**Q20.** Operating System provides the different types of services to the user. For accessing these services, the interface is provided by the _______",
    "options": ["system calls.", "native library.", "application programming interface.", "none of the mentioned."],
    "answer": 0,
    "explain": "Slide 2: *OS provides the set of system calls that is an interface between the operating system and the user programs.* The library and an API sit on top of the system calls (the procedure library makes them callable from C); the interface the OS itself provides is the system calls. [The system-call interface](#/comp4736-p5/system-call-interface)"
  }
]
```

## A file descriptor is a small int: opened, used, closed, copied by fork

Part 1, the files slide: *Before a file is read or written, it must be opened by checking the permissions. If the access is permitted, the system returns a small integer called a file descriptor to use in subsequent operations.* Part 5, slide 5: every process starts with stdin on fd 0, stdout on fd 1 and stderr on fd 2. The POSIX file table (slide 39) gives `fd = open(file, how, ...)`, `s = close(fd)` (*Close an open file*), `n = read(fd, buffer, nbytes)` and `n = write(fd, buffer, nbytes)`; its caption says *The return code s is −1 if an error has occurred*. `fork()` creates *a child process identical to the parent* (slide 22), and the open file descriptors are part of what is copied: the process-table entry carries a *File descriptors* field (Part 3, slide 40).

```quiz
[
  {
    "q": "**Q51.** Before a file is read or written, it must be opened by checking the permissions.",
    "type": "tf",
    "answer": true,
    "explain": "This is the Part 1 files slide word for word: *Before a file is read or written, it must be opened by checking the permissions.* If access is permitted, `open` returns a file descriptor; if not, an error code. [Processes, files and protection](#/comp4736-p1/os-zoo-processes-files)"
  },
  {
    "q": "**Q28.** Open system call returns the file descriptor as _______.",
    "options": ["int", "float", "double", "char"],
    "answer": 0,
    "explain": "The system *returns a small integer called a file descriptor* (Part 1 files slide). The standard streams are 0, 1 and 2, so the first file a program opens usually gets 3. In C the prototype is `int open(const char *pathname, int flags, ...)`, and it returns −1 on error. [Standard streams](#/comp4736-p5/standard-streams)"
  },
  {
    "q": "**Q65.** What does the close() system call do?",
    "options": ["Deletes the file", "Clears the file contents", "Changes file permissions", "Releases a file descriptor"],
    "answer": 3,
    "explain": "Slide 39: `s = close(fd)`, *Close an open file*. The descriptor is released and the file stays as it was. Removing a file's name is `unlink` (slide 40), changing permissions is `chmod` (slide 41). [The POSIX tables](#/comp4736-p5/posix-tables)"
  },
  {
    "q": "**Q66.** A process calls fork(). What happens to the file descriptors in the child process?",
    "options": [
      "File descriptors are reset to 0, 1, and 2",
      "All file descriptors are closed",
      "The child gets copies of the parent's file descriptors",
      "Only stdin is copied"
    ],
    "answer": 2,
    "explain": "`fork()` creates *a child process identical to the parent* (slide 22), and the open file descriptors are in what is copied (the *File descriptors* field of the process-table entry, Part 3 slide 40). That is why a child's `printf` reaches the same terminal as its parent's: both have fd 1. [Fork programs](#/comp4736-p5/fork-programs)"
  },
  {
    "q": "**Q45.** Consider this code. What happens when write(1, \"Hello\\n\", 6) is executed?",
    "code": "#include <unistd.h>\n\nint main() {\n    close(1);\n    write(1, \"Hello\\n\", 6);\n    return 0;\n}",
    "options": [
      "Hello is printed to the terminal",
      "Hello is printed to stderr",
      "write() fails because FD 1 is closed",
      "The program automatically reopens FD 1"
    ],
    "answer": 2,
    "explain": "`close(1)` releases fd 1, stdout. The next `write(1, …)` names a descriptor the process no longer has open, so it writes nothing and returns −1, the POSIX error return. stderr is a separate descriptor, 2, and nothing reopens fd 1 unless the program calls `open` again. [Standard streams](#/comp4736-p5/standard-streams)"
  },
  {
    "q": "**Q56.** Match each standard stream with its correct file descriptor number and purpose.",
    "type": "match",
    "pairs": [["stdin", "0"], ["stderr", "2"], ["stdout", "1"]],
    "explain": "Slide 5: standard input (stdin), fd **0**, keyboard or file, redirected with `<`; standard output (stdout), fd **1**, terminal or file, `1>` or `>`; standard error (stderr), fd **2**, terminal or file, `2>`. [Standard streams](#/comp4736-p5/standard-streams)"
  }
]
```

## Nine protection bits decide who may read, write and run a file

Part 1, the protection slide: each file has a *9-bit binary protection code* in three 3-bit fields, owner, group and everyone else, with *a bit for read access, a bit for write access, and a bit for execute access*. Each field is one octal digit: r = 4, w = 2, x = 1. `ls -l` prints the nine bits after the file-type letter. A file whose fields carry no `x` cannot be run as `./name`, whatever the program inside it does; the shell reports Permission denied (shell behaviour, not on the slides).

```quiz
[
  {
    "q": "**Q62.** The protection bits **rw-r-x-w-** in octal is equal to",
    "options": ["652", "256", "351", "615"],
    "answer": 0,
    "explain": "Split into three fields and add r = 4, w = 2, x = 1 in each. Owner `rw-` = 4 + 2 + 0 = 6; group `r-x` = 4 + 0 + 1 = 5; others `-w-` = 0 + 2 + 0 = 2. Written owner, group, others: **652**. Reading the fields in the wrong order gives 256. `chmod 652 file` (slide 41, *Change a file's protection bits*) sets exactly this. [Processes, files and protection](#/comp4736-p1/os-zoo-processes-files)"
  },
  {
    "q": "**Q27.** Consider the following c code after running the code (a.out) the results is",
    "code": "#include <unistd.h>\n\nvoid main(){\n        sleep(1);\n        printf(\" -- Hello --\\n\");\n}\n\n~/lab3$ ls -al a.out\n-rw-r--r-- 1 user user 16000 Feb  3 05:19 a.out",
    "options": [
      "None of the mentioned",
      "The terminal shows `~/lab3$ ./a.out`, then ` -- Hello --` with the next prompt `~/lab3$` on the same line",
      "The terminal shows `~/lab3$ ./a.out`, then ` -- Hello --` on its own line"
    ],
    "answer": 0,
    "explain": "Read the `ls -al` line before the code. The protection bits are `rw-r--r--`: owner read and write, group and others read only, and no `x` in any field. `./a.out` therefore never starts; the shell refuses with Permission denied, and neither terminal picture can appear. Had it run, the `\\n` in the `printf` would put the prompt on the next line. [Processes, files and protection](#/comp4736-p1/os-zoo-processes-files)"
  }
]
```

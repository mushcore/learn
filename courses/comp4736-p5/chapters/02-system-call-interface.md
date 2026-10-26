---
title: The system-call interface and the procedure library
minutes: 12
---

A user program cannot run kernel code directly, yet it needs the kernel to read a file or start a process. Slide 2 names the interface that sits between them, and says why C programs reach it through a library.

## Two main functions of an operating system (slide 2)

Slide 2 opens with the definition from Part 1, underlined: *Providing abstractions to user programs and managing the computer's resources.*

The next sentence says which of the two a program actually sees: *The interaction between user programs and the operating system mainly involves managing abstractions, while resource management is handled automatically and is mostly invisible to the users.* A program asks for a file, a process or a directory (abstractions). It never asks for a disk block or a time slice; the OS hands those out on its own.

## System calls are the interface between the OS and user programs

*OS provides the set of **system calls** that is an interface between the operating system and the user programs.* Every service a program gets from the OS, it gets by making a system call. The slide adds two numbered facts:

1. *The system calls vary from operating system to operating system.* Linux has `fork` and `execve`; Windows offers `CreateProcess` instead ([the Win32 API](#/comp4736-p5/win32-api)).
2. *System calls are highly machine dependent and often must be expressed in assembly code. So an OS provides a **procedure library** to make system calls from C programs and often from other languages as well.*

The second point is the reason the library exists. Making a call means putting a number and the arguments in particular registers and executing a trap instruction, and both the registers and the instruction change from one CPU to the next ([x86 registers and int 80h](#/comp4736-p5/registers-and-int80)). The library wraps that assembly in an ordinary C function, so a C program writes `read(fd, buffer, nbytes)` and the library procedure does the machine-dependent part ([the eleven steps](#/comp4736-p5/eleven-steps)).

Two consequences follow, and both are true at once. A C program can make system calls directly: it calls the library procedure, or the generic `syscall()` function with a call number (slide 18). And the C library's own functions use system calls underneath: `printf` ends up calling `write` on file descriptor 1.

## The man page section number: 2 is system calls (slides 3–4)

The Linux Programmer's Manual is split into numbered sections, and slide 3 shows the list:

| Section | Contents |
|---|---|
| 1 | Executable programs or shell commands |
| **2** | **System calls (functions provided by the kernel)** |
| 3 | Library calls (functions within program libraries) |
| 4 | Special files (usually found in /dev) |
| 5 | File formats and conventions, e.g. /etc/passwd |
| 6 | Games |
| 7 | Miscellaneous (including macro packages and conventions) |
| 8 | System administration commands (usually only for root) |
| 9 | Kernel routines [Non standard] |

The number in parentheses after a page's name is its section. Slide 4 circles three headers and draws an arrow from each to its line:

| Header | Section | What it is |
|---|---|---|
| FORK(2) | 2 | a system call: *fork - create a child process*, `pid_t fork(void);` |
| LS(1) | 1 | a shell command: *ls - list directory contents* |
| SUDO(8) | 8 | an administration command |

Section 3 holds the library calls that wrap system calls: the `exec` family (`execl`, `execvp`, …) is EXEC(3), while the system call they all reach, `execve`, is in section 2 ([execve and the shell](#/comp4736-p5/execve-and-the-shell)).

```quiz
[
  {
    "q": "System calls are the same on every operating system.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 2, point 1: *The system calls vary from operating system to operating system.* UNIX's fork + execve is one call, CreateProcess, in Win32."
  },
  {
    "q": "Why does an OS provide a procedure library?",
    "options": [
      "System calls are highly machine dependent and often must be expressed in assembly code",
      "Resource management is handled automatically and is mostly invisible to the users",
      "User programs mainly interact with the OS to manage the computer's resources",
      "Library calls are in section 3 of the manual"
    ],
    "answer": 0,
    "explain": "Slide 2, point 2: system calls are machine dependent and often must be written in assembly, *so an OS provides a procedure library to make system calls from C programs*. The resource-management sentence is true but explains what users do not see, and the interaction is mainly about abstractions, not resources."
  },
  {
    "q": "The services an OS offers are reached through the interface provided by ___.",
    "type": "text",
    "answer": ["system calls", "the system calls", "system call", "the set of system calls"],
    "explain": "Slide 2: *OS provides the set of system calls that is an interface between the operating system and the user programs.*"
  },
  {
    "q": "The interaction between user programs and the operating system mainly involves managing resources.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 2 says the interaction *mainly involves managing abstractions*; resource management *is handled automatically and is mostly invisible to the users*."
  },
  {
    "q": "Which statements are correct?",
    "options": [
      "A C program can make system calls",
      "Library functions in C can use system calls",
      "System calls are written once and run unchanged on every CPU",
      "Library functions never use system calls"
    ],
    "answer": [0, 1],
    "explain": "A C program makes system calls through the procedure library (or `syscall()` with a number), and C library functions such as `printf` call `write` underneath. System calls are *highly machine dependent*, so they are not the same on every CPU."
  },
  {
    "q": "Match each man page header with its manual section.",
    "type": "match",
    "pairs": [
      ["FORK(2)", "System calls (functions provided by the kernel)"],
      ["LS(1)", "Executable programs or shell commands"],
      ["SUDO(8)", "System administration commands"],
      ["EXEC(3)", "Library calls (functions within program libraries)"]
    ],
    "explain": "The number in parentheses is the section (slides 3–4). fork is a system call (2), ls a shell command (1), sudo an administration command (8), and the exec family are library functions (3) that reach the execve system call."
  },
  {
    "q": "In which section of the Linux manual are system calls documented?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "Section 2: *System calls (functions provided by the kernel)*. FORK(2) is the slide's example."
  }
]
```

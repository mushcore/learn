---
title: Kernel mode, user mode and the four x86 rings
minutes: 13
---

The operating system must be able to touch every device and every instruction, and a user's program must not, or one buggy program could wreck the machine for everyone. The CPU enforces the difference with modes of operation.

## Kernel and user mode

Slide 16 gives the two modes.

**Kernel mode** (also called **supervisor mode**): *The operating system, the most fundamental piece of software, runs in kernel mode. In this mode it has complete access to all the hardware and can execute any instruction the machine is capable of executing.*

**User mode**: *The rest of the software runs in user mode, in which only a subset of the machine instructions is available.* The slide underlines the rule that follows: *Instructions that affect control of the machine or do Input/Output are forbidden to user-mode programs.*

So the split is by instruction, not by program size or importance. Two kinds are off limits in user mode:

- instructions that control the machine itself, such as disabling interrupts or changing the memory map;
- instructions that do input/output, such as writing to a disk controller.

Lab 2 applied the rule to single instructions: setting the time-of-day clock is kernel-only, while reading it is allowed in user mode, because reading the time controls nothing.

Every ordinary program you compile and run, a C program included, runs in user mode. The mode currently in force is recorded in a CPU register, the PSW, which holds *the mode (user or kernel)* among its bits ([registers lesson](#/comp4736-p1/memory-and-registers)).

## Four privilege rings on Intel x86

Slide 17, *Intel x86 architecture — Four privilege levels or security rings*: *These rings are used for various levels of privilege and access control within the CPU, typically in an operating system context.*

The figure is four concentric circles. **Ring 0** is the centre and the colour key marks it *Most privileged*; **Ring 3** is the outer ring, *Least privileged*. Rings 1 and 2 lie between.

Slide 18 describes each ring:

| Ring | Slide 18 |
|---|---|
| Ring 0 (Kernel Mode) | *This is the most privileged level, reserved for the operating system kernel. Code running in Ring 0 has unrestricted access to all hardware and system resources. It can execute privileged instructions and manage memory, devices, and processes. Device drivers and the core operating system components run in Ring 0.* |
| Ring 1 and 2 | *Operating System Services (Device Drivers, Etc.).* |
| Ring 3 (User Mode) | *Ring 3 is the least privileged level and is where user applications run. Code running in this ring has limited access to system resources and hardware. It can't execute privileged instructions directly or access hardware resources directly. Instead, it relies on system calls to request services from the operating system.* |

Kernel mode is Ring 0 and user mode is Ring 3. The slide places device drivers both in Ring 0 and in Rings 1 and 2; either answer matches the slide, and in practice (not on the slides) Windows and Linux use only Rings 0 and 3.

## A user program asks; it does not do

A Ring 3 program that needs the disk, the network or the screen cannot execute the I/O instruction itself. If it tries, the CPU refuses, because I/O instructions are forbidden in user mode. Instead it makes a **system call**: it asks the operating system, running in Ring 0, to do the work and hand back the result. That is the meaning of *relies on system calls to request services from the operating system*. The `read(fd, buf, count)` call from [the previous lesson](#/comp4736-p1/what-the-os-is) is one. Part 5 of the course follows a system call step by step.

## Where the operating system fits in

Slide 19, *Components of a Modern Computer*, has the figure *Where the operating system fits in.* Read top to bottom:

| Layer | Mode (left brace) | Right brace |
|---|---|---|
| Web browser, E-mail reader, Music player | User mode | Software |
| User interface program | User mode | Software |
| Operating system | Kernel mode | Software |
| Hardware | (none) | Hardware |

Two things in the figure are easy to misplace. The user interface program, the program the user types commands into or clicks in, is drawn above the operating system and runs in user mode; it is not part of the kernel. And the operating system is software, the third layer of software, even though it is the one that runs in kernel mode.

```quiz
[
  {
    "q": "Fill in the ring numbers from slides 17 and 18.",
    "type": "fill",
    "code": "Ring ___            kernel mode, most privileged\nRings ___ and ___   operating system services (device drivers, etc.)\nRing ___            user mode, least privileged",
    "answer": ["0", "1", "2", "3"],
    "explain": "Ring 0 is the centre of the circles, reserved for the kernel. Rings 1 and 2 are OS services. Ring 3, the outside, is where user applications run."
  },
  {
    "q": "User programs can do Input/Output directly, without the operating system.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 16: instructions that affect control of the machine or do Input/Output are forbidden to user-mode programs. Ring 3 code relies on system calls to have the OS do it."
  },
  {
    "q": "Kernel mode is also called ________ mode.",
    "options": ["supervisor", "user", "protected", "Ring 3"],
    "answer": 0,
    "explain": "Slide 16: kernel mode (also called supervisor mode). Ring 3 is user mode, the opposite end."
  },
  {
    "q": "When you run a compiled C program, the CPU executes its instructions in ________ mode.",
    "options": ["user", "kernel", "supervisor", "Ring 0"],
    "answer": 0,
    "explain": "Only the operating system runs in kernel (supervisor) mode, which is Ring 0. The rest of the software, an ordinary C program included, runs in user mode, Ring 3."
  },
  {
    "q": "Which of these should be allowed only in kernel mode? Select all that apply.",
    "options": ["Halt the CPU", "Write a command into a disk controller's register", "Add two registers", "Compare two numbers and branch"],
    "answer": [0, 1],
    "explain": "Halting the CPU affects control of the machine, and writing a controller register is I/O: both are forbidden in user mode. Adding, comparing and branching change nothing outside the program, so user mode may do them."
  },
  {
    "q": "Ring 3 is the most privileged level.",
    "type": "tf",
    "answer": false,
    "explain": "Ring 3 is the least privileged level, where user applications run. Ring 0, the centre, is the most privileged, reserved for the operating system kernel."
  },
  {
    "q": "Code in Ring 3 cannot access hardware directly. What does slide 18 say it relies on instead?",
    "type": "text",
    "answer": ["system calls", "system call", "a system call", "syscalls", "syscall"],
    "explain": "Ring 3 relies on system calls to request services from the operating system, which runs in Ring 0."
  },
  {
    "q": "A program in Ring 3 needs to write a block to the disk. What does it do?",
    "options": ["Make a system call so the OS does the write", "Execute the disk I/O instruction itself", "Set the mode bit in the PSW to kernel, then write", "Ask the user interface program to write it"],
    "answer": 0,
    "explain": "I/O instructions are forbidden in user mode, and user programs may typically write only some fields of the PSW, not the mode. The user interface program runs in user mode too. The only route is a system call into the kernel."
  },
  {
    "q": "In slide 19's figure, the user interface program runs in kernel mode.",
    "type": "tf",
    "answer": false,
    "explain": "The User mode brace covers the applications (web browser, e-mail reader, music player) and the user interface program. Only the operating system is under the Kernel mode brace."
  },
  {
    "q": "In slide 19's figure, the operating system is drawn as part of the hardware.",
    "type": "tf",
    "answer": false,
    "explain": "The Software brace spans the top three boxes: applications, user interface program and operating system. Only the grey box at the bottom is hardware."
  }
]
```

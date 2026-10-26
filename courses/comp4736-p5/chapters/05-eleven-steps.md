---
title: The eleven steps of read(fd, buffer, nbytes)
minutes: 16
---

A C program calls `read` like any other function, yet the bytes come from the kernel. Slides 19 to 21 follow one call, *read(fd, buffer, nbytes)*, through the eleven steps that take it into the kernel and back.

## The figure: user space above, kernel space below

Slide 21 draws memory from address 0 at the bottom to 0xFFFFFFFF at the top. The shaded band at the bottom is **Kernel space (Operating system)**; everything above it is **User space**. Three blocks sit on the figure:

| Region | Block | Rows, top to bottom |
|---|---|---|
| User space | Library procedure read | Return to caller · Trap to the kernel · Put code for read in register |
| User space | User program calling read | Increment SP · Call read · Push fd · Push &buffer · Push nbytes |
| Kernel space | Dispatch, a table, Sys call handler | Dispatch → table → Sys call handler |

Every step is one numbered row or arrow on that figure. The user program's block is read bottom-up: its first action is the lowest row.

## Steps 1 to 5 run in user space

Slide 19, in the slide's words:

- **Steps 1, 2, and 3**: *pushing the parameters onto the stack in reverse order.* The last parameter goes first: Push nbytes (1), Push &buffer (2), Push fd (3). fd ends up on top of the stack.
- **Step 4**: *calling to the library procedure. This instruction is the normal procedure-call instruction used to call all procedures.* Nothing special happens yet; `read` is an ordinary function in the C library.
- **Step 5**: *The library procedure, possibly written in assembly language, typically puts the system-call number in a place where the operating system expects it, such as a register.* On 32-bit x86 Linux that register is EAX, and sys_read is number 3 ([x86 registers and int 80h](#/comp4736-p5/registers-and-int80)).

This is the **procedure library** of slide 2 at work. The system call itself needs assembly, so the library procedure hides steps 5 and 6 behind a C function the program can call.

## Steps 6 to 8 cross into the kernel

- **Step 6**: executing a **TRAP instruction** *to switch from user mode to kernel mode and start execution at a fixed address within the kernel.* On x86 Linux the TRAP is `int 80h`.
- **Step 7**: *The kernel code that starts following the TRAP examines the system-call number and then dispatches to the correct system-call handler, usually via a table of pointers to system-call handlers indexed on system-call number.* That table is the striped box between Dispatch and the handler.
- **Step 8**: *At that point the system-call handler runs.* For read, this is where the bytes land in buffer.

The fixed address is the point of the TRAP. A user program cannot jump into any kernel code it likes; it enters at one place, and the kernel picks the handler from the number left in step 5.

## Steps 9 to 11 return to the caller

Slide 20:

- **Step 9**: *Once it has completed its work, control may be returned to the user-space library procedure at the instruction following the TRAP instruction.*
- **Step 10**: *This procedure then returns to the user program in the usual way procedure calls return.*
- **Step 11**: *To finish the job, the user program has to clean up the stack, as it does after any procedure call.* The figure's row is "Increment SP": dropping the three parameters moves the stack pointer back.

Step 11 belongs to the user program, not the kernel and not the library procedure. The caller pushed the parameters in steps 1 to 3, so the caller removes them.

### Eleven arrows, one per step

The widget draws the slide 21 figure with the stack on the right and a mode flag. With predict on, it asks which step comes next and whether the CPU is in user or kernel mode after it. The slide text names the mode only at step 6; the table below the widget gives it for every step.

```widget
syscall-steps-play
{ "predict": true }
```

## Kernel mode runs from the TRAP to the return

Steps 7 and 8 run entirely in kernel mode. Step 6 starts in user mode inside the library procedure, and its TRAP ends in kernel mode at the fixed address. Step 9 starts in the kernel and lands back in user mode, at the instruction after the TRAP. Steps 1 to 5, 10 and 11 never leave user mode.

| Steps | Who runs | Mode |
|---|---|---|
| 1–3 | user program | user |
| 4 | user program → library procedure | user |
| 5 | library procedure | user |
| 6 | library procedure → kernel (TRAP) | user → kernel |
| 7, 8 | kernel: dispatch, then the handler | kernel |
| 9 | handler → library procedure | kernel → user |
| 10 | library procedure → user program | user |
| 11 | user program | user |

The TRAP of step 6 is slide 1's **software interrupt**: synchronous, raised by the program itself ([interrupt classes](#/comp4736-p5/interrupt-classes)).

## Trace the steps for write(fd, buf, n)

A program on 32-bit x86 Linux calls `write(fd, buf, n)`. The same eleven steps apply with write's parameters and write's system-call number.

```quiz
[
  {
    "q": "Put the eleven steps of `write(fd, buf, n)` in order.",
    "type": "reorder",
    "lines": [
      "Push n",
      "Push buf",
      "Push fd",
      "Call write, the library procedure",
      "Put the code for write in a register",
      "Trap to the kernel",
      "Dispatch through the table of handler pointers",
      "The write handler runs",
      "Return to the library procedure, after the TRAP",
      "Return to the user program",
      "Increment SP"
    ],
    "explain": "Steps 1–3 push the parameters in reverse order: n, then buf, then fd. Step 4 calls the library procedure, step 5 puts the system-call number in a register, step 6 traps to the kernel, step 7 dispatches through the table, step 8 runs the handler, step 9 returns to the library procedure after the TRAP, step 10 returns to the user program, step 11 cleans up the stack."
  },
  {
    "q": "In step 5 of this write call, what does the library procedure put, and where?",
    "options": [
      "write's system-call number, 4, in EAX",
      "the byte count n, in EAX",
      "write's system-call number, in the dispatch table",
      "the address of buf, on the stack"
    ],
    "answer": 0,
    "explain": "Step 5 puts the system-call number where the OS expects it, such as a register. On 32-bit x86 the number goes in EAX, and slide 11's table gives sys_write = 4. The parameters were already pushed in steps 1–3; the dispatch table is read by the kernel in step 7, not written by the library."
  },
  {
    "q": "A program calls `lseek(fd, offset, whence)`. Which parameter is pushed in step 1?",
    "options": ["whence", "fd", "offset", "the system-call number"],
    "answer": 0,
    "explain": "Steps 1–3 push the parameters in reverse order, so the last parameter goes first: whence (step 1), offset (step 2), fd (step 3). The system-call number is not pushed; step 5 puts it in a register."
  },
  {
    "q": "At which step of the write call does the CPU switch from user mode to kernel mode?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "explain": "Step 6 executes the TRAP instruction, which switches from user mode to kernel mode and starts execution at a fixed address within the kernel. Steps 1–5 all run in user mode."
  },
  {
    "q": "In step 7, the kernel finds the write handler in a table of pointers. What is that table indexed on?",
    "type": "text",
    "answer": ["system-call number", "system call number", "the system-call number", "the system call number", "syscall number", "call number"],
    "explain": "Step 7: the kernel examines the system-call number and dispatches via a table of pointers to system-call handlers indexed on system-call number. The number is the one step 5 left in the register (4 for write on 32-bit x86)."
  }
]
```

```quiz
[
  {
    "q": "Put the eleven steps of `read(fd, buffer, nbytes)` in the order of slide 21.",
    "type": "reorder",
    "lines": [
      "Push nbytes",
      "Push &buffer",
      "Push fd",
      "Call read",
      "Put code for read in register",
      "Trap to the kernel",
      "Dispatch to the handler through the table",
      "Sys call handler runs",
      "Return to the library procedure, after the TRAP",
      "Return to caller",
      "Increment SP"
    ],
    "explain": "1–3 push nbytes, &buffer, fd (reverse order); 4 call read; 5 put code for read in register; 6 trap to the kernel; 7 dispatch through the table; 8 the handler runs; 9 back to the library procedure at the instruction after the TRAP; 10 return to caller, the user program; 11 increment SP to clean up the stack."
  },
  {
    "q": "The parameters of `read(fd, buffer, nbytes)` are pushed in the order fd, buffer, nbytes.",
    "type": "tf",
    "answer": false,
    "explain": "Steps 1, 2 and 3 push the parameters onto the stack in reverse order: nbytes first, then &buffer, then fd."
  },
  {
    "q": "Step 11, cleaning up the stack, is done by:",
    "options": ["the user program", "the library procedure", "the system-call handler", "the kernel's dispatch code"],
    "answer": 0,
    "explain": "To finish the job, the user program has to clean up the stack, as it does after any procedure call (Increment SP). The caller pushed the parameters, so the caller removes them."
  },
  {
    "q": "What does the TRAP instruction do in step 6?",
    "options": [
      "Switches from user mode to kernel mode and starts execution at a fixed address within the kernel",
      "Puts the system-call number in a place where the operating system expects it",
      "Dispatches to the correct system-call handler through a table of pointers",
      "Returns to the user program in the usual way procedure calls return"
    ],
    "answer": 0,
    "explain": "Step 6 is the TRAP: user mode to kernel mode, at a fixed address. Putting the number in a register is step 5, dispatching through the table is step 7, and returning in the usual way is step 10."
  },
  {
    "q": "Step 4 uses a special instruction that switches the CPU into kernel mode.",
    "type": "tf",
    "answer": false,
    "explain": "Step 4 is the normal procedure-call instruction used to call all procedures; the library procedure is ordinary user code. The switch to kernel mode is the TRAP in step 6."
  },
  {
    "q": "In step 7, how does the kernel choose which handler to run?",
    "options": [
      "It indexes a table of pointers to system-call handlers on the system-call number",
      "It reads the first parameter on the stack",
      "The TRAP instruction jumps straight to the handler for read",
      "The library procedure calls the handler directly"
    ],
    "answer": 0,
    "explain": "The kernel code that starts after the TRAP examines the system-call number and dispatches via a table of pointers to system-call handlers indexed on system-call number. The TRAP always lands at the same fixed address; the table is what makes the choice."
  },
  {
    "q": "Name the instruction executed in step 6 to enter the kernel.",
    "type": "text",
    "answer": ["TRAP", "trap", "TRAP instruction", "trap instruction"],
    "explain": "Step 6 executes a TRAP instruction. On x86 Linux the TRAP is int 80h."
  },
  {
    "q": "In step 9, control returns to the user-space library procedure at the instruction following the TRAP instruction.",
    "type": "tf",
    "answer": true,
    "explain": "That is slide 20's step 9 word for word. The library procedure then returns to the user program in step 10."
  },
  {
    "q": "Which step puts the system-call number in a register?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "explain": "Step 5: the library procedure, possibly written in assembly language, typically puts the system-call number in a place where the operating system expects it, such as a register (Put code for read in register on the figure)."
  }
]
```

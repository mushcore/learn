---
title: What the lowest level of the OS does when an interrupt occurs
minutes: 13
---

A context switch needs something to take the CPU away from the running process. On slide 41 that something is an interrupt, and the slide lists the eight things that happen between the interrupt and the next process running.

## A disk interrupt arrives while a user process runs

Slide 41 opens: *The illusion of multiple sequential processes maintained on one (or each) CPU. Suppose that user process  is running when a disk interrupt happens.* The slide has a gap where a process number belongs; Tanenbaum's text says user process 3.

The running process did not ask for the interrupt. Some other process was blocked waiting for that disk, and the interrupt is the external event of [transition 4](#/comp4736-p3/process-states).

## The eight steps of the interrupt skeleton

Slide 41, *Skeleton of what the lowest level of the operating system does when an interrupt occurs*:

1. *Hardware stacks program counter, etc.*
2. *Hardware loads new program counter from interrupt vector.*
3. *Assembly language procedure saves registers.*
4. *Assembly language procedure sets up new stack.*
5. *C interrupt service runs (typically reads and buffers input).*
6. *Scheduler decides which process is to run next.*
7. *C procedure returns to the assembly code.*
8. *Assembly language procedure starts up new current process.*

The list moves through three kinds of code, and the order follows from what each one needs.

| Steps | Who does it | Why there |
|---|---|---|
| 1, 2 | Hardware | No software can run until the program counter points at it. |
| 3, 4, 8 | Assembly language | C cannot name the registers or move the stack pointer. |
| 5, 6, 7 | C | The real work: handle the device, then pick the next process. |

The "why" column is Tanenbaum's reasoning, not slide text.

Steps 1 and 3 together are the save half of [a context switch](#/comp4736-p3/process-table): the program counter goes onto the stack first, then the registers, and from there into the process table entry. Step 8 is the restore half. The process it starts is whichever one step 6 chose. It can be the interrupted process, resumed as if it had never been stopped, or the process the disk was serving, now ready (transition 4) and picked to run (transition 3). That reading of step 6 is ours; the slide stops at the list.

:::quiz Step 8 and the interrupted process
The skeleton does not end by "returning to the interrupted process". The slide's last step starts up the *new current process*, which the scheduler chose in step 6 and may be a different one.
:::

## The interrupt vector says where the handler is

The last sentence on slide 41: *Associated with each I/O class is a location (typically at a fixed location near the bottom of memory) called the interrupt vector.*

The vector holds the address of that class's interrupt service procedure. Step 2 is the hardware reading it: the disk's vector gives the new program counter, so the CPU's next instruction is the first one of the disk handler.

## The x86 Interrupt Vector Table in real mode

Slide 42, *Interrupt Vector Table of x86 processors running in real mode* (source: Wikipedia), draws the table from address 00000000 upward, four entries per 16-byte row:

| Address | +00 | +04 | +08 | +0C |
|---|---|---|---|---|
| 000003F0 | INT 0xFC | INT 0xFD | INT 0xFE | INT 0xFF |
| … | … | … | … | … |
| 00000020 | INT 0x08 | INT 0x09 | INT 0x0A | INT 0x0B |
| 00000010 | INT 0x04 | INT 0x05 | INT 0x06 | INT 0x07 |
| 00000000 | INT 0x00 | INT 0x01 | INT 0x02 | INT 0x03 |

Each entry is 4 bytes: an IP (instruction pointer, the offset) followed by a CS (code segment). Together they are the far address of the handler. The figure's arrows run left to right along a row and bottom to top up the table.

Read from the figure rather than stated on the slide: 256 vectors, INT 0x00 to INT 0xFF, fill addresses 0x000 to 0x3FF, so the table is the first 1 KB of memory, which is *near the bottom of memory* as slide 41 says. Interrupt number k sits at address 4 × k, so INT 0x10 is at 0x40, the first entry of the row labelled 00000040.

The slide does not name the interrupts. On Intel processors the first ones are 0 divide error, 1 debug, 2 non-maskable interrupt (NMI), 3 breakpoint and 4 overflow; this comes from Intel's documentation, not the deck.

```quiz
[
  {
    "q": "Put the steps of slide 41's interrupt skeleton in order.",
    "type": "reorder",
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
    "explain": "Hardware first (stack the PC, load the new PC from the vector), then assembly (save registers, new stack), then C (service the device, run the scheduler, return), then assembly again to start the process the scheduler chose."
  },
  {
    "q": "The interrupt vector is typically at a fixed location near the bottom of memory.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 41: associated with each I/O class is a location, typically at a fixed location near the bottom of memory, called the interrupt vector. The x86 real-mode table on slide 42 starts at address 00000000."
  },
  {
    "q": "Which skeleton step does the hardware perform?",
    "options": [
      "Loads new program counter from interrupt vector",
      "Saves registers",
      "Sets up new stack",
      "Decides which process is to run next"
    ],
    "answer": 0,
    "explain": "Steps 1 and 2 are hardware: stacking the program counter and loading the new one from the interrupt vector. Saving registers and setting up the stack are assembly language procedures; choosing the next process is the scheduler."
  },
  {
    "q": "The scheduler decides which process is to run next before the C interrupt service runs.",
    "type": "tf",
    "answer": false,
    "explain": "The C interrupt service is step 5 and the scheduler is step 6. The device is serviced first (typically reading and buffering input), which may unblock a process the scheduler can then choose."
  },
  {
    "q": "What does the C interrupt service typically do, according to slide 41?",
    "options": [
      "Reads and buffers input",
      "Saves registers",
      "Loads the new program counter",
      "Starts up the new current process"
    ],
    "answer": 0,
    "explain": "Step 5: C interrupt service runs (typically reads and buffers input). Saving registers and starting the new process are assembly steps; loading the program counter is hardware."
  },
  {
    "q": "Associated with each I/O class is a location, typically fixed near the bottom of memory, called the ___.",
    "type": "text",
    "answer": ["interrupt vector", "the interrupt vector"],
    "explain": "The interrupt vector holds the address of the class's interrupt service procedure; step 2 loads it into the program counter."
  },
  {
    "q": "In slide 42's real-mode Interrupt Vector Table, how many bytes does each entry take?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "Each entry is an IP followed by a CS, 2 bytes each, so the rows step by 4: +00, +04, +08, +0C. Four entries fill a 16-byte row."
  },
  {
    "q": "The last skeleton step returns control to the process that was interrupted.",
    "type": "tf",
    "answer": false,
    "explain": "Step 8: the assembly language procedure starts up the new current process, the one the scheduler chose in step 6. That may be the interrupted process or another one, such as the process that was waiting for the disk."
  }
]
```

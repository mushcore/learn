---
title: A process is a program in execution
minutes: 15
---

A program is a file on disk, yet `ps` lists processes, and one CPU seems to run dozens of them at once. What is a process, what memory does it own, and how does one CPU share itself among many?

## A process is a running instance of a program

Slide 2 gives the definition: *A process is just an instance of an executing program, including the current values of the program counter (PC), registers, and variables.*

The program is the passive part, the code. The process adds the state that changes while the code runs: where execution has reached (the program counter), what the CPU registers hold, and what each variable holds right now.

## One program file, three processes (slide 3)

```cpp pin main.c
#include <stdio.h>
#include <unistd.h>

int main()
{
    printf(" Preocess ID : %ld \n", getpid());
    sleep(100);
    return 0;
}
```

Slide 3 compiles `main.c` (1 KB) into `main.exe` (164 KB) and starts it three times from bash. `getpid()` returns the ID of the process that calls it, and `sleep(100)` keeps each run alive for 100 seconds so all three can be seen together. "Preocess" is the slide's own typo. Lab 1 ran the same program with `sleep(1)`.

Three runs of one file: before reading on, say how many processes the tree shows and what differs between them.

```text
OS:>>
?(1)───mintty(1351)───bash(1352)─┬─main(1477)
                                 ├─main(1475)
                                 └─main(1476)
```

Three processes. They share the process name `main`; each has its own process ID in brackets, 1475, 1476 and 1477. All three are children of bash(1352). The number `getpid()` prints is the same number that this tree and `ps` show for that process.

## The CPU runs machine code at memory locations (slides 4 and 5)

```cpp pin sum.c
#include <stdio.h>
int main()
{
    int sum = 0;
    for(int i=0; i<5; i++){
        sum += i;
    }
    return 0;
}
```

Slide 5 lines this source up against its disassembly in three columns: **memory location** (the hex address), **machine code** (the instruction bytes) and **assembly code** (the mnemonic). At every instant the program counter holds one of these addresses.

| Memory location | Machine code | Assembly code |
|---|---|---|
| 401102 | 55 | push rbp |
| 401103 | 48 89 e5 | mov rbp,rsp |
| 401106 | c7 45 fc 00 00 00 00 | mov DWORD PTR [rbp-0x4],0x0 |
| 40110d | c7 45 f8 00 00 00 00 | mov DWORD PTR [rbp-0x8],0x0 |
| 401114 | 83 7d f8 04 | cmp DWORD PTR [rbp-0x8],0x4 |
| 401118 | 7f 0c | jg 401126 <main+0x24> |
| 40111a | 8b 45 f8 | mov eax,DWORD PTR [rbp-0x8] |
| 40111d | 01 45 fc | add DWORD PTR [rbp-0x4],eax |
| 401120 | 83 45 f8 01 | add DWORD PTR [rbp-0x8],0x1 |
| 401124 | eb ee | jmp 401114 <main+0x12> |
| 401126 | b8 00 00 00 00 | mov eax,0x0 |
| 40112b | 5d | pop rbp |
| 40112c | c3 | ret |
| 40112d | 0f 1f 00 | nop DWORD PTR [rax] |

`int sum = 0;` is the store at 401106, so `sum` lives at `[rbp-0x4]`; `int i=0` is the store at 40110d, putting `i` at `[rbp-0x8]`. The test `i<5` becomes a compare with 4 and `jg 401126`: leave the loop once `i` is greater than 4. `sum += i;` is the pair at 40111a and 40111d, and `jmp 401114` goes back to the test. `return 0;` is the `mov eax,0x0` at 401126.

## Three segments: text, data and stack (slide 6)

*Processes in UNIX have their memory divided up into three segments: the text segment (i.e., the program code), the data segment (i.e., the variables), and the stack segment. The data segment grows upward and the stack grows downward.*

| Address (hex) | Segment | Arrow on the figure |
|---|---|---|
| FFFF (top) | Stack | down |
| | Gap | none (free space) |
| | Data | up |
| 0000 (bottom) | Text | none |

The gap is the free space that data and stack grow into from opposite ends. Linux splits the same picture into five regions in [Text, data, BSS, heap, stack and /proc](#/comp4736-p3/linux-address-space).

## One CPU switching between processes (slides 7 to 9)

Slide 7 lists three facts about a multiprogramming system:

1. *The CPU switches from process to process quickly.*
2. *The CPU runs each process for tens or hundreds of milliseconds.*
3. *Strictly speaking, at any one instant the CPU is running only one process.*

*The rapid switching back and forth is called multiprogramming.*

The slides draw the same four programs A, B, C, D three ways:

| Figure | Slide | What it shows |
|---|---|---|
| (a) Multiprogramming of four programs | 7 | **one program counter** jumping between A, B, C and D in one memory; each jump is a *process switch* |
| (b) Conceptual model of four independent, sequential processes | 8 | **four program counters**, one per process, each running straight down its own code |
| (c) Only one program is active at once | 9 | process against time: bars A, B, C, D, then A, B, C, D again, never two at the same time |

Figure (a) is what the hardware does. Figure (b) is the model each process sees: its own program counter, as if it had the CPU to itself. Figure (c) is the timeline that reconciles the two.

### Which process runs at t₁, t₂ and t₃

The instructor drew three dashed markers on figure (c) without printing an answer. Our reading of the figure (an in-class answer replaces this): at t₂ the CPU is running C, during its first turn; at t₃ it is running D, during its second turn. t₁ falls exactly where A's first bar ends and B's begins, a process switch: A runs just before t₁ and B just after, and by sentence 3 never both.

```quiz
[
  {
    "q": "The CPU runs each process for tens or hundreds of seconds.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 7: *The CPU runs each process for tens or hundreds of milliseconds.* Switching every few seconds would make interactive programs feel frozen."
  },
  {
    "q": "Strictly speaking, at any one instant the CPU can be running several processes.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 7: *Strictly speaking, at any one instant the CPU is running only one process.* The parallelism is an illusion built from fast switching; figure (c) never shows two bars at the same time."
  },
  {
    "q": "In a multiprogramming system, the CPU switches from process to process quickly.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 7, sentence 1, word for word."
  },
  {
    "q": "The rapid switching of the CPU back and forth between processes is called ___.",
    "type": "text",
    "answer": ["multiprogramming", "multi-programming"],
    "explain": "Slide 7: *The rapid switching back and forth is called multiprogramming.*"
  },
  {
    "q": "In the UNIX three-segment model, which segment grows downward?",
    "options": ["Stack segment", "Data segment", "Text segment", "Gap"],
    "answer": 0,
    "explain": "Slide 6: *The data segment grows upward and the stack grows downward.* The stack starts at the top (FFFF) and grows toward the gap; text sits at the bottom and does not grow; the gap is the free space between data and stack."
  },
  {
    "q": "The data segment grows downward and the stack grows upward.",
    "type": "tf",
    "answer": false,
    "explain": "Swapped. Data sits just above text and grows upward; the stack starts at the top and grows downward, so they grow toward each other into the gap."
  },
  {
    "q": "A process is an instance of an executing program, including the current values of:",
    "options": [
      "the program counter, registers, and variables",
      "the text, data, and stack segments",
      "the process ID, the parent, and the children",
      "the memory location, machine code, and assembly code"
    ],
    "answer": 0,
    "explain": "Slide 2: *A process is just an instance of an executing program, including the current values of the program counter (PC), registers, and variables.* The segments (slide 6) are how its memory is laid out; the three columns are slide 5's disassembly."
  },
  {
    "q": "In the conceptual model of four independent, sequential processes (figure b), how many program counters are drawn?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "Figure (b) draws four program counters, one per process. Figure (a), the real hardware, has one program counter that jumps between them."
  },
  {
    "q": "One `main.exe` is started three times. The three processes have the same name and the same process ID.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 3: three processes named `main`, with three different IDs, 1475, 1476 and 1477. One program file can be the code of many processes; each process gets its own ID."
  },
  {
    "q": "The process ID printed by `getpid()` inside a running program is the same number that `ps` lists for that process.",
    "type": "tf",
    "answer": true,
    "explain": "`getpid()` returns the calling process's own ID, the number the OS uses for it everywhere: `ps`, `pstree` (in brackets after the name) and /proc."
  },
  {
    "q": "In slide 5's disassembly, what is the column holding values such as `55` and `48 89 e5`?",
    "options": ["Machine code", "Memory location", "Assembly code", "Program counter"],
    "answer": 0,
    "explain": "The grey hex bytes are the machine code. The memory location is the address column (401102, 401103 …) and the assembly code is the mnemonic (`push rbp`, `mov rbp,rsp`)."
  }
]
```

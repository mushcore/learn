---
title: The process table, the PCB and the context switch
minutes: 16
---

A process that leaves the CPU must come back exactly where it stopped. The process table is where the operating system keeps everything it needs to make that happen, and the context switch is the act of filling and reading it.

## The process table has one entry per process

Slide 30: *To implement the process model, the operating system maintains a table (an array of structures), called the process table, with one entry per process.*

The entry holds *the process' state, including its program counter, stack pointer, memory allocation, the status of its open files, its accounting and scheduling information, and everything else about the process that must be saved when the process is switched from running to ready or blocked state so that it can be restarted later as if it had never been stopped.*

The two transitions that leave Running are the ones from [the state diagram](#/comp4736-p3/process-states): transition 1 to Blocked and transition 2 to Ready. Either way the entry is written on the way out and read on the way back in.

## Saving one process's state and loading another's

Slide 31 gives the two definitions:

- *A context switch refers to the process of saving the current state of a running process and loading the saved state of another process so that it can resume execution.*
- *PCB is a data structure that represents a single process in the operating system. The PCB is a crucial component within the process table.*

When the scheduler switches, *it must save the current process's context, including its program counter, register values, and other relevant state information, into the process's PCB (Process Control Block).* Tanenbaum's text calls the process-table entry itself a process control block; the slide keeps the two words apart, with the PCB as part of the table.

Slide 32 draws the CPU as a downward time arrow with this sequence:

1. Process P1 runs.
2. Save P1 state.
3. Restore P2 state.
4. Process P2 runs.
5. Save P2 state.
6. Restore P1 state.
7. Process P1 runs again.

Every switch is a save followed by a restore. Save arrows point from the CPU into the state box; restore arrows point from the state box back to the CPU.

### The two PCBs fill and drain

The CPU column holds the running process's program counter, stack pointer and registers. Watch the values leave the CPU for PCB1 on a save and come back unchanged on the restore two steps later.

```widget
context-switch-play
{ "rounds": 2, "predict": true }
```

## getcontext captures a context

Slides 33 and 34 make a context visible on Linux. A `ucontext_t` is the slide's user-level context: per the code comment, a signal mask, stack info, a link to the next context and an embedded machine-level context holding *General-purpose registers: RIP, RSP, RAX, etc.*

```cpp pin get_context.c
#include <stdio.h>
#include <ucontext.h>
#include <unistd.h>
#define REG_RIP 16

/* user-level context (uc), includes
   1) signal mask,
   2) stack info,
   3) link to next context,
   and an embedded machine-level context (mc).

   Machine-level context (mc) contains
   General-purpose registers: RIP, RSP, RAX, etc.
   . . . . . . .
*/
int main(int argc, const char *argv[]){
    ucontext_t ctx;
    printf("Capturing context...\n");
    getcontext(&ctx);
    printf("Context captured. Ready to inspect.\n");
    printf("RIP: %llx\n", (unsigned long long)ctx.uc_mcontext.gregs[REG_RIP]);
    return 0;
}
```

The program prints three lines. Say what each one is before reading the slide's run.

```text
Capturing context...
Context captured. Ready to inspect.
RIP: 56f2d961c1f2
```

`getcontext(&ctx);` copies the running state into `ctx`, which is what a save does. RIP is the x86-64 program counter, read from slot `REG_RIP` (16) of `ctx.uc_mcontext.gregs`; the hex value is an address inside this program's text and changes from run to run. Slide 34 prints the whole `ucontext_t` in a debugger: dozens of numbers, all of which a real switch must save.

## setcontext jumps back into a saved context

```cpp pin set_context.c
#include <stdio.h>
#include <ucontext.h>
#include <unistd.h>

int main(){
    ucontext_t context;

    getcontext(&context);
    puts("Hello OS ");
    sleep(1);
    setcontext(&context);
    return 0;
}
```

How many times does this print, and does it ever reach `return 0;`? Decide before reading on.

```text
Hello OS
Hello OS
Hello OS
Hello OS
Hello OS
Hello OS
```

The slide's window shows six lines and the program is still going. `setcontext(&context);` restores the state saved by `getcontext(&context);`, including the program counter, so execution resumes on the line after the save: `puts("Hello OS ");` runs again, one line per second, forever. That is the restore half of a context switch: the process continues as if it had never been stopped.

## A saved virtual machine is a whole-machine context switch

Slides 36 to 39 have no text. A DOS virtual machine running the MS-DOS Editor is closed with *Save the machine state*, shows as Saved, is started again (*Restoring virtual machine*), and the editor's welcome box is exactly where it was. Our reading: the saved machine state plays the part of the PCB, for a whole computer instead of one process.

## Some of the fields of a typical process table entry

Slide 40 sorts the entry's fields into three columns:

| Process management | Memory management | File management |
|---|---|---|
| Registers | Pointer to text segment info | Root directory |
| Program counter | Pointer to data segment info | Working directory |
| Program status word | Pointer to stack segment info | File descriptors |
| Stack pointer | | User ID |
| Process state | | Group ID |
| Priority | | |
| Scheduling parameters | | |
| Process ID | | |
| Parent process | | |
| Process group | | |
| Signals | | |
| Time when process started | | |
| CPU time used | | |
| Children's CPU time | | |
| Time of next alarm | | |

That is 15, 3 and 5 fields. Memory management is only the three segment pointers, one per segment of [the process's memory](#/comp4736-p3/process-model).

:::quiz User ID and Group ID
User ID and Group ID sound like they describe the process, but slide 40 puts them under file management, beside the root directory, working directory and file descriptors. Process ID, parent process and process group are the process-management ones.
:::

```quiz
[
  {
    "q": "Match each field of a process table entry to its column on slide 40.",
    "type": "match",
    "pairs": [
      ["Program counter", "Process management"],
      ["Pointer to stack segment info", "Memory management"],
      ["Working directory", "File management"]
    ],
    "explain": "Process management holds the CPU state and scheduling data (registers, program counter, PSW, stack pointer, state, priority, IDs, times). Memory management is the three segment pointers. File management is root directory, working directory, file descriptors, user ID and group ID."
  },
  {
    "q": "The process table entry stores what must be saved when the process is switched from running to ready or blocked, so that it can be restarted later how?",
    "options": [
      "As if it had never been stopped",
      "From the beginning of its program",
      "With a new process ID",
      "Only after its parent calls wait"
    ],
    "answer": 0,
    "explain": "Slide 30: everything that must be saved is kept so the process can be restarted later as if it had never been stopped. It resumes mid-program with the same PID; restarting from the beginning would lose its work."
  },
  {
    "q": "The process table is a linked list of structures, with one entry per process.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 30 calls it a table (an array of structures), called the process table, with one entry per process."
  },
  {
    "q": "Saving the current state of a running process and loading the saved state of another process so that it can resume execution is called a ___.",
    "type": "text",
    "answer": ["context switch", "a context switch"],
    "explain": "Slide 31's definition of a context switch. The state is saved into the process's PCB."
  },
  {
    "q": "The PCB is a crucial component within the process table.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 31: PCB is a data structure that represents a single process in the operating system, and it is a crucial component within the process table."
  },
  {
    "q": "Which column of slide 40 holds User ID and Group ID?",
    "options": ["File management", "Process management", "Memory management", "None; they are not in the table"],
    "answer": 0,
    "explain": "User ID and Group ID sit with root directory, working directory and file descriptors under file management. Process ID, parent process and process group are under process management."
  },
  {
    "q": "Put slide 32's context-switch sequence in order.",
    "type": "reorder",
    "lines": [
      "Process P1 runs",
      "Save P1 state",
      "Restore P2 state",
      "Process P2 runs",
      "Save P2 state",
      "Restore P1 state",
      "Process P1 runs again"
    ],
    "explain": "Each switch saves the outgoing process's state into its PCB and then restores the incoming process's state from its PCB: save P1, restore P2, and later save P2, restore P1."
  },
  {
    "q": "In slide 35's program, where does execution continue after `setcontext(&context);`?",
    "code": "getcontext(&context);\nputs(\"Hello OS \");\nsleep(1);\nsetcontext(&context);\nreturn 0;",
    "options": [
      "At the line after getcontext(&context), so Hello OS prints again",
      "At return 0, so the program ends",
      "At the start of main",
      "Nowhere; setcontext terminates the process"
    ],
    "answer": 0,
    "explain": "setcontext restores the context getcontext saved, including the program counter, so the CPU resumes just after the save. puts runs again, and the loop never reaches return 0."
  }
]
```

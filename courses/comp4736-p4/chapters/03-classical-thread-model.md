---
title: "Resource grouping versus execution: what is shared and what is private"
minutes: 15
---

A process does two jobs at once: it holds resources and it runs. Pulling those two jobs apart is what lets one process hold several threads, and it decides which items the threads share and which each keeps for itself.

## The process model is two concepts, resource grouping and execution

Slide 12: *The process model is based on two independent concepts: resource grouping and execution(thread)*.

- Resource grouping: *A process has an address space containing program text and data, as well as other resources. These resources may include open files, child processes, pending alarms, signal handlers, accounting information, and more. By putting them together in the form of a process, they can be managed more easily.*
- Execution: *The other concept a process has is a thread of execution, usually shortened to just thread.*

The process is the container; the thread is what runs inside it. The classical thread model allows several threads in one container.

## All threads in a process share one address space

Slide 13:

- *Different threads in a process are not as independent as different processes. All threads have exactly the same address space, which means that they also share the same global variables.*
- *Since every thread can access every memory address within the process' address space, one thread can read, write, or even wipe out another thread's stack.*
- *There is no protection between threads because (1) it is impossible, and (2) it should not be necessary*

Reason (1) follows from the sentence before it: every thread can reach every address, so there is nothing for the hardware to fence off. Reason (2) is that the threads of one process belong to one program, written to cooperate.

## Per process items and per thread items

Slides 14 and 15 show one table twice, first outlining the left column (*The first column lists some items shared by all threads in a process.*), then the right (*The second one lists some items private to each thread.*).

| Per process items | Per thread items |
|---|---|
| Address space | Program counter |
| Global variables | Registers |
| Open files | Stack |
| Child processes | State |
| Pending alarms | |
| Signals and signal handlers | |
| Accounting information | |

The left column is slide 12's resource grouping, plus the global variables that live in the shared address space. The right column is what a flow of execution needs to be paused and resumed: where it is (program counter), its working values (registers), its calls in progress (stack), and whether it is running, ready or blocked (state). Slide 1's definition named the first three.

Seven items on the left, four on the right. A file opened by one thread is open for all of them, and a global variable written by one thread is seen by the others.

## Each thread has its own stack

Slide 16's heading is *Each thread has its own stack*. Its figure draws one process with Thread 1, Thread 2 and Thread 3, and under each thread a stack of a different height.

Each thread calls its own procedures, so each needs its own frames: local variables and return addresses for the calls it has made and not yet returned from. The heights differ because each thread is at a different depth of calls. Slide 13 still applies: the stacks are separate, not protected, and another thread can overwrite one.

## A thread is running, blocked, ready or terminated

Slide 17: *A thread can be in any one of several states: running, blocked, ready, or terminated.*

| State | Slide 17 |
|---|---|
| running | *A running thread currently has the CPU and is active.* |
| blocked | *A blocked thread is waiting for some event to unblock it.* A system call to read from the keyboard blocks it *until input is typed*; it can also wait *for some other thread to unblock it*. |
| ready | *A ready thread is scheduled to run and will as soon as its turn comes up.* |
| terminated | listed, not described |

*The transitions between thread states are the same as those between process states.* Slide 17 draws no diagram; the process-state diagram and its four transitions are in [Part 3](#/comp4736-p3/process-states).

Slide 17 does not describe terminated. From slide 19's `Pthread_exit` (*Terminate the calling thread*), a terminated thread has finished and will not run again. An in-class answer replaces this.

## Multithreading: several threads in one process

Slide 18: *The term multithreading is also used to describe the situation of allowing multiple threads in the same process. In this case the CPU switches rapidly back and forth among the threads, providing the illusion that the threads are running in parallel, albeit on a slower CPU than the real one.*

Its figure, *(a) Three processes each with one thread. (b) One process with three threads.*:

| | (a) | (b) |
|---|---|---|
| Processes | 3 | 1 |
| Threads | 3, one in each | 3 |
| Address spaces | 3, separate | 1, shared |

Both pictures have three threads. In (a) each thread has its own resources and the processes are protected from each other; in (b) the three threads share one set of resources and nothing protects them from each other. With three threads on one CPU, each runs as if on a CPU one third as fast.

```quiz
[
  {
    "q": "Which of these are per thread items in the classical thread model? Select all that apply.",
    "options": ["Program counter", "Registers", "Stack", "State", "Global variables", "Open files", "Address space"],
    "answer": [0, 1, 2, 3],
    "explain": "The per thread column (slide 15) is program counter, registers, stack and state. Address space, global variables and open files are per process items, shared by all threads in a process."
  },
  {
    "q": "Which of these are per process items, shared by all threads in a process? Select all that apply.",
    "options": ["Child processes", "Pending alarms", "Signals and signal handlers", "Accounting information", "Program counter", "Stack"],
    "answer": [0, 1, 2, 3],
    "explain": "Slide 14's left column: address space, global variables, open files, child processes, pending alarms, signals and signal handlers, accounting information. Program counter and stack are private to each thread."
  },
  {
    "q": "Threads in the same process have separate global variables.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 13: *All threads have exactly the same address space, which means that they also share the same global variables.*"
  },
  {
    "q": "One thread can read, write, or even wipe out another thread's stack in the same process.",
    "type": "tf",
    "answer": true,
    "explain": "Each thread has its own stack, but *every thread can access every memory address within the process' address space*, so nothing stops one thread overwriting another's stack."
  },
  {
    "q": "Slide 13 gives two reasons there is no protection between threads. Which pair is it?",
    "options": [
      "It is impossible, and it should not be necessary",
      "It is too slow, and the kernel does not know about threads",
      "Threads have no stack, and they share registers",
      "The hardware forbids it, and the run-time system handles it"
    ],
    "answer": 0,
    "explain": "*There is no protection between threads because (1) it is impossible, and (2) it should not be necessary.* Every thread can reach every address, and the threads of one process belong to one program written to cooperate."
  },
  {
    "q": "The process model is based on two independent concepts. Name them.",
    "type": "fill",
    "code": "resource ___ and ___ (thread)",
    "answer": ["grouping", "execution"],
    "explain": "Slide 12: *resource grouping and execution(thread)*. The process groups resources; the thread is the execution."
  },
  {
    "q": "List slide 17's four thread states.",
    "type": "fill",
    "code": "A thread can be in any one of several states:\n___, ___, ___, or ___.",
    "answer": ["running", "blocked", "ready", "terminated"],
    "explain": "*A thread can be in any one of several states: running, blocked, ready, or terminated.* The transitions between them are the same as between process states."
  },
  {
    "q": "A thread that has called read on the keyboard and is waiting for a key press is in which state?",
    "options": ["Blocked", "Ready", "Running", "Terminated"],
    "answer": 0,
    "explain": "Slide 17's own example: a thread that makes a system call to read from the keyboard *is blocked until input is typed*."
  },
  {
    "q": "In slide 18's figure (b), one process with three threads, how many address spaces are there?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "One process means one address space, shared by all three threads. Figure (a), three processes with one thread each, has three."
  }
]
```

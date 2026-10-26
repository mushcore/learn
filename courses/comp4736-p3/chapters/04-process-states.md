---
title: Running, Ready, Blocked and the four transitions
minutes: 16
---

A process does not run from start to finish in one go: it stops to wait for input, and it gives up the CPU so others can run. Slides 25 to 29 name the three states it moves between and the four arrows that connect them.

## Three states a process may be in (slide 25)

*Three states a process may be in:*

1. **Running** *(actually using the CPU at that instant)*
2. **Ready** *(scheduled and runnable; temporarily stopped to let another process run)*
3. **Blocked** *(unable to run until some external event happens)*

Ready and Blocked both mean "not running", for different reasons. A ready process would run if it were given the CPU. A blocked process cannot run even if the CPU is idle, because the thing it needs has not happened yet.

## Four numbered arrows (slide 26)

The figure puts Running at the top, Blocked at the bottom left and Ready at the bottom right. Its caption: *A process can be in running, blocked, or ready state. Transitions between these states are as shown.*

| # | From → To | Legend on the figure |
|---|---|---|
| 1 | Running → Blocked | *Process blocks for input* |
| 2 | Running → Ready | *Scheduler picks another process* |
| 3 | Ready → Running | *Scheduler picks this process* |
| 4 | Blocked → Ready | *Input becomes available* |

Two arrows are missing on purpose. There is no Blocked → Running and no Ready → Blocked: a waiting process whose input arrives must pass through Ready, and only a running process can discover that it has to wait.

## Transition 1 and the pipe that has no input (slide 27)

*Transition 1 occurs when the operating system discovers that a process cannot continue right now.* It happens in two ways:

- *In some systems the process can execute a system call, such as pause, to get into blocked state.*
- *In other systems, including UNIX, when a process reads from a pipe or special file (e.g., a terminal) and there is no input available, the process is automatically blocked.*

The slide shows a pipeline of four processes and numbers the stages 1 to 4 in red:

```text
OS:>> cat data.txt | tr '[A-Z]' 'a-z'| tr -C '[a-z]' '\n' | grep cow
cow
cows
cows
```

The slide does not say how its red 1 to 4 relate to the four transitions. Our reading (an in-class answer replaces this): they number the four processes, 1 = `cat`, 2 and 3 = the two `tr`, 4 = `grep`, not the transitions. Each later stage reads from the pipe before it; whenever that pipe is empty, the reader takes transition 1 and waits.

## Transitions 2 and 3 (slide 28)

*Transitions 2 and 3 are caused by the process scheduler, a part of the operating system, without the process even knowing about them.*

- *Transition 2 occurs when the scheduler decides that the running process has run long enough, and it is time to let another process have some CPU time.*
- *Transition 3 occurs when all the other processes have had their fair share and it is time for the first process to get the CPU to run again.*

Transition 1 starts with something the process does, asking for input that is not there. Transitions 2 and 3 are done to it.

## Transition 4 and what follows it (slide 29)

*Transition 4 occurs when the external event for which a process was waiting (such as the arrival of some input) happens.*

What follows depends on the CPU. *If no other process is running at that instant, transition 3 will be triggered and the process will start running. Otherwise it may have to wait in ready state for a little while until the CPU is available and its turn comes.*

### Watch one process move through the four transitions

Each step is one event for one process; the token moves along a numbered arrow and the caption quotes the slide's sentence for it. With predict on, name the transition before the token moves.

```widget
process-states-play
{ "model": "three", "predict": true }
```

## Number the transitions for a text editor and a video encoder

One CPU runs two processes: a text editor that waits for keystrokes and a video encoder that never waits for I/O. Give the transition number from slide 26.

```quiz
[
  {
    "q": "The editor is running and asks for the next keystroke. The user has not typed anything. Which transition does the editor take?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "Reading from a terminal with no input available: the OS discovers the editor cannot continue right now, so it moves Running → Blocked, transition 1 (*Process blocks for input*)."
  },
  {
    "q": "While the editor is blocked, the user presses a key. Which transition does the editor take?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "The external event it was waiting for has happened: Blocked → Ready, transition 4 (*Input becomes available*). It goes to Ready, not straight to Running."
  },
  {
    "q": "The encoder has been running for its full share of CPU time, and the scheduler takes the CPU away to give it to the editor. Which transition does the encoder take?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "The scheduler decided the running process has run long enough: Running → Ready, transition 2 (*Scheduler picks another process*). The encoder is still runnable, so it is Ready, not Blocked."
  },
  {
    "q": "In the same moment, which transition does the editor take?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "The scheduler gives the ready editor the CPU: Ready → Running, transition 3 (*Scheduler picks this process*). Transitions 2 and 3 happen together: one process leaves the CPU and another gets it."
  },
  {
    "q": "The encoder has finished and nothing else is running when the editor's keystroke arrives. Which transitions does the editor take, in order?",
    "options": ["4, then 3", "4 only, straight to Running", "3 only", "1, then 4"],
    "answer": 0,
    "explain": "Slide 29: the event gives transition 4 (Blocked → Ready), and *if no other process is running at that instant, transition 3 will be triggered*. There is no Blocked → Running arrow, so it is always two steps."
  }
]
```

```quiz
[
  {
    "q": "Transition 2 is caused by the process itself when it decides it has run long enough.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 28: *Transitions 2 and 3 are caused by the process scheduler, a part of the operating system, without the process even knowing about them.* The scheduler decides the running process has run long enough."
  },
  {
    "q": "Transitions 2 and 3 are caused by the process scheduler without the process even knowing about them.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 28, word for word. Transition 1 is the one the process triggers, by asking for input that is not there or by calling `pause`."
  },
  {
    "q": "When the input a blocked process is waiting for arrives, the process moves directly from Blocked to Running.",
    "type": "tf",
    "answer": false,
    "explain": "Transition 4 goes Blocked → Ready. The figure has no Blocked → Running arrow; if the CPU happens to be free, transition 3 follows at once (slide 29)."
  },
  {
    "q": "A process in the Ready state is unable to run until some external event happens.",
    "type": "tf",
    "answer": false,
    "explain": "That is Blocked. Ready is *scheduled and runnable; temporarily stopped to let another process run*: it only needs the CPU."
  },
  {
    "q": "In UNIX, a process that reads from a pipe and finds no input available is automatically blocked.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 27: *when a process reads from a pipe or special file (e.g., a terminal) and there is no input available, the process is automatically blocked.* That is transition 1."
  },
  {
    "q": "If no other process is running at the instant a blocked process's event happens, transition 3 will be triggered and the process will start running.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 29. Otherwise it waits in Ready until the CPU is available and its turn comes."
  },
  {
    "q": "Match each state to the slide's description of it.",
    "type": "match",
    "pairs": [
      ["Running", "actually using the CPU at that instant"],
      ["Ready", "scheduled and runnable; temporarily stopped to let another process run"],
      ["Blocked", "unable to run until some external event happens"]
    ],
    "explain": "Slide 25's three states with their parentheticals."
  },
  {
    "q": "Transition 1 occurs when:",
    "options": [
      "the operating system discovers that a process cannot continue right now",
      "the scheduler decides that the running process has run long enough",
      "the external event for which a process was waiting happens",
      "all the other processes have had their fair share"
    ],
    "answer": 0,
    "explain": "Slide 27. The others are transition 2 (run long enough), transition 4 (the event happens) and transition 3 (the others have had their fair share)."
  },
  {
    "q": "In some systems a process can execute a system call to get itself into blocked state. Which call does the slide name?",
    "options": ["pause", "kill", "exit", "fork"],
    "answer": 0,
    "explain": "Slide 27: *the process can execute a system call, such as pause, to get into blocked state.* `kill` and `exit` end processes; `fork` creates one."
  },
  {
    "q": "Fill in the from and to state of each transition.",
    "type": "fill",
    "code": "1:  ___ → ___\n2:  ___ → ___\n3:  ___ → ___\n4:  ___ → ___",
    "answer": ["Running", "Blocked", "Running", "Ready", "Ready", "Running", "Blocked", "Ready"],
    "explain": "Slide 26: 1 Running → Blocked (process blocks for input), 2 Running → Ready (scheduler picks another process), 3 Ready → Running (scheduler picks this process), 4 Blocked → Ready (input becomes available)."
  }
]
```

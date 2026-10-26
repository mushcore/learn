---
title: The four ways a process ends, and process hierarchies
minutes: 14
---

A process that was created must also end, either because it chose to or because something stopped it. Once processes create processes, the OS must also decide whether parent and child stay connected.

## Four conditions terminate a process (slide 17)

*Typical conditions which terminate a process:*

| # | Condition | Tag | Slide |
|---|---|---|---|
| 1 | *Normal exit* | *(voluntary)* | 18 |
| 2 | *Error exit* | *(voluntary)* | 19 |
| 3 | *Fatal error* | *(involuntary)* | 20 |
| 4 | *Killed by another process* | *(involuntary)* | 21 |

The tag says who decides. In 1 and 2 the process itself calls for its own end; in 3 and 4 the end is imposed on it.

## Normal exit (slide 18)

*Most processes terminate because they have done their work.* A compiler that has compiled its program *executes a system call to tell the operating system that it is finished. This call is* **exit** *in UNIX and* **ExitProcess** *in Windows.*

*Screen-oriented programs also support voluntary termination.* The slide's screenshots show a window's red Close button and a File menu with **Close Ctrl+W**: clicking either tells the process *to remove any temporary files it has open and then terminate*.

## Error exit (slide 19)

*The second reason for termination is that the process discovers a fatal error. For example, if a user types the command cc foo.c to compile the program foo.c and no such file exists, the compiler simply announces this fact and exits.* The slide's terminal runs it with `gcc`:

```text
~$ gcc foo.c
gcc: error: foo.c: No such file or directory
gcc: fatal error: no input files
compilation terminated.
~$
```

The slide says "fatal error" here, and gcc prints "fatal error", yet *Fatal error* is the name of condition 3. Teach the slide's split: in an error exit the process notices the problem and exits on its own, so it is voluntary; condition 3 is an error the process causes and cannot handle.

*Screen-oriented interactive processes generally do not exit when given bad parameters. Instead they pop up a dialog box and ask the user to try again.*

## Fatal error (slide 20)

*The third reason for termination is an error caused by the process, often due to a program bug. Examples include executing an illegal instruction, referencing nonexistent memory, or dividing by zero.*

The process does not choose this end. There is one escape: *In some systems (e.g., UNIX), a process can tell the operating system that it wishes to handle certain errors itself, in which case the process is signaled (interrupted) instead of terminated when one of the errors occurs.*

## Killed by another process (slide 21)

*The fourth reason a process might terminate is that the process executes a system call telling the operating system to kill some other process.* In UNIX the call is **kill**; *the corresponding Win32 function is* **TerminateProcess**. *In both cases, the killer must have the necessary authorization to do in the killee.*

The slide's terminal does it from the shell:

```text
OS:>> ./program.exe  &
[1] 1243
OS:>>  Process waitng 30 seconds.

OS:>> pstree -p
?(1)───mintty(1169)───bash(1170)─┬─program(1243)
                                 └─pstree(1244)
OS:>> kill 1243
OS:>> fg
-bash: fg: job has terminated
[1]+  Terminated              ./program.exe
OS:>>
```

The `&` starts the program in the background as job 1 with PID 1243, and pstree shows it under bash(1170). The kill command names that PID, and `fg` finds nothing left to bring back: job 1 was terminated before its 30 seconds were up.

## Process hierarchies in UNIX (slides 22 and 23)

Slide 22: *In some systems, when a process creates another process, the parent process and child process continue to be associated in certain ways. The child process can itself create more processes.*

Slide 23: *In UNIX, a process and all of its children and further descendants together form a process group.* Keyboard signals use it: *When a user sends a signal from the keyboard, the signal is delivered to all members of the process group currently associated with the keyboard.* Each member then has three choices: *Individually, each process can catch the signal, ignore the signal, or take the default action, which is to be killed by the signal.*

## Process hierarchies in Windows (slide 24)

*In contrast, Windows has no concept of a process hierarchy. All processes are equal.*

*The only hint of a process hierarchy is that when a process is created, the parent is given a special token (called a handle) that it can use to control the child. However, it is free to pass this token to some other process, thus invalidating the hierarchy. Processes in UNIX cannot disinherit their children.*


```quiz
[
  {
    "q": "Match each event to the termination condition it is, with the slide's tag.",
    "type": "match",
    "pairs": [
      ["A compiler finishes its work and calls `exit`", "Normal exit (voluntary)"],
      ["`cc foo.c` finds no file foo.c, says so and exits", "Error exit (voluntary)"],
      ["The process executes an illegal instruction", "Fatal error (involuntary)"],
      ["Another process calls `kill` with this process's PID", "Killed by another process (involuntary)"]
    ],
    "explain": "Slide 17's four conditions. The two voluntary ones are the process's own decision (done, or noticed a problem and quit); the two involuntary ones are imposed on it (a bug the OS acts on, or another process's kill)."
  },
  {
    "q": "Which termination conditions are involuntary? Select all.",
    "options": ["Fatal error", "Killed by another process", "Normal exit", "Error exit"],
    "answer": [0, 1],
    "explain": "Slide 17: normal exit and error exit are voluntary; fatal error and killed by another process are involuntary. The error exit is voluntary even though slide 19 says the process *discovers a fatal error*: the process notices and exits on its own."
  },
  {
    "q": "Windows has a concept of a process hierarchy, in which the parent can never give up control of its child.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 24: *Windows has no concept of a process hierarchy. All processes are equal.* The parent gets a handle and is free to pass it to another process. It is UNIX processes that *cannot disinherit their children*."
  },
  {
    "q": "In UNIX, which system call tells the operating system to kill some other process?",
    "options": ["kill", "exit", "TerminateProcess", "ExitProcess"],
    "answer": 0,
    "explain": "Slide 21: *In UNIX this call is kill. The corresponding Win32 function is TerminateProcess.* `exit` (UNIX) and `ExitProcess` (Windows) end the calling process itself."
  },
  {
    "q": "What is the Windows call a process uses to tell the operating system that it is finished?",
    "type": "text",
    "answer": ["ExitProcess", "ExitProcess()"],
    "explain": "Slide 18: *This call is exit in UNIX and ExitProcess in Windows.*"
  },
  {
    "q": "A program references nonexistent memory and the OS terminates it. Which condition is this?",
    "options": ["Fatal error", "Error exit", "Normal exit", "Killed by another process"],
    "answer": 0,
    "explain": "Slide 20: a fatal error is *an error caused by the process, often due to a program bug*, with the examples illegal instruction, nonexistent memory and dividing by zero. An error exit is the process itself noticing a problem (no input file) and quitting."
  },
  {
    "q": "When a user sends a signal from the keyboard in UNIX, it is delivered to:",
    "options": [
      "all members of the process group currently associated with the keyboard",
      "only the process that was started last",
      "only the parent of the process group",
      "the init process, which forwards it"
    ],
    "answer": 0,
    "explain": "Slide 23: *the signal is delivered to all members of the process group currently associated with the keyboard.* Each member then catches it, ignores it, or takes the default action."
  },
  {
    "q": "In UNIX, a process that receives a keyboard signal and does nothing special takes the default action, which is to be killed by the signal.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 23: *each process can catch the signal, ignore the signal, or take the default action, which is to be killed by the signal.*"
  },
  {
    "q": "In UNIX, a process can ask to handle certain errors itself; it is then signaled (interrupted) instead of terminated when one of them occurs.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 20, the exception to the fatal-error condition: *In some systems (e.g., UNIX), a process can tell the operating system that it wishes to handle certain errors itself, in which case the process is signaled (interrupted) instead of terminated.*"
  },
  {
    "q": "In Windows, the special token a parent receives to control its child is called a ___.",
    "type": "text",
    "answer": ["handle"],
    "explain": "Slide 24: *the parent is given a special token (called a handle) that it can use to control the child*, and it may pass the handle on, *thus invalidating the hierarchy*."
  }
]
```

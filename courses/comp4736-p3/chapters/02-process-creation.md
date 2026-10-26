---
title: The four events that create a process
minutes: 12
---

Every process on a running system was started by something: the boot, another process, a user, or a job queue. Slide 10 names the four events, and slides 11 to 16 give one example of each.

## Four principal events create processes (slide 10)

*Four principal events that cause processes to be created:*

1. *System initialization.*
2. *Execution of a process-creation system call by a running process.*
3. *A user request to create a new process.*
4. *Initiation of a batch job.*

## Event 1, system initialization: foreground and background processes (slide 11)

*When an operating system is booted, typically numerous processes are created.* The slide sorts them in two:

1. Some are **foreground processes**, *interacting with (human) users and perform work for them*.
2. *Others run in the background and are not associated with particular users, but instead have some specific function.*

*Processes that stay in the background to handle some activity such as email, Web pages, news, printing, and so on are called daemons.*

### Background processes on Windows 10 and Ubuntu (slides 12 and 13)

Slide 12 opens the Windows 10 Task Manager on its **Services** tab, with columns Name, PID, Description, Status and Group: Windows Update (`wuauserv`, PID 6160), Windows Search, Windows Defender Antivirus Service and the rest, every one Running with nobody using it. Several services share PID 5224, so one host process can carry more than one service.

Slide 13 runs `ps -aux | less` on Ubuntu 18.04.4 LTS, highlighting the USER and PID columns:

```text
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.1  0.1 225984  9744 ?        Ss   14:31   0:11 /sbin/init splash
root         2  0.0  0.0      0     0 ?        S    14:31   0:00 [kthreadd]
root         7  0.0  0.0      0     0 ?        S    14:31   0:00 [ksoftirqd/0]
```

Every row on the slide belongs to root and has `?` in the TTY column: no terminal, no user. PID 1 is `/sbin/init splash`, the first process the boot creates; it returns in [Zombie and orphan processes](#/comp4736-p3/zombies-and-orphans) as the process that adopts orphans.

## Event 2, a running process creates helpers (slide 14)

*Often a running process will issue system calls to create one or more new processes to help it do its job.*

The slide's example: *if a large amount of data is being fetched over a network for subsequent processing, it may be convenient to create one process to fetch the data and put them in a shared buffer while a second process removes the data items and processes them.* On a multiprocessor each of the two can run on its own CPU, which *may also make the job go faster*.

On Linux the creation call is `fork()` (slide 48), taught in [fork() and the stripped-down shell](#/comp4736-p3/fork-and-the-shell).

## Event 3, a user starts a program (slide 15)

*In interactive systems, users can start a program by typing a command or (double) clicking on an icon. Taking either of these actions starts a new process and runs the selected program in it.*

The slide's terminal types a command and gets a new process, which prints its own ID:

```text
OS:>> ls
main.c  main.exe
OS:>> ./main.exe
 Preocess ID : 1487
OS:>>
```

That is slide 3's program from [A process is a program in execution](#/comp4736-p3/process-model), started once more and given a new ID, 1487. One more rule for windowed UNIX: *In command-based UNIX systems running X, the new process takes over the window in which it was started.*

## Event 4, the OS starts the next batch job (slide 16)

*The last situation in which processes are created applies only to the batch systems found on large mainframes.* The slide's example is *inventory management at the end of a day at a chain of stores*: *users can submit batch jobs to the system (possibly remotely).*

Nobody is waiting at a screen. The OS decides when: *When the operating system decides that it has the resources to run another job, it creates a new process and runs the next job from the input queue in it.*

Slide 16 illustrates batch work with Canada's advanced research computing service, the Digital Research Alliance of Canada (alliancecan.ca), a present-day home for large jobs submitted to a queue (our reading of the pictures; the slide has no caption).

```quiz
[
  {
    "q": "Which process-creation event applies only to the batch systems found on large mainframes?",
    "options": [
      "Initiation of a batch job",
      "System initialization",
      "A user request to create a new process",
      "Execution of a process-creation system call by a running process"
    ],
    "answer": 0,
    "explain": "Slide 16: *The last situation in which processes are created applies only to the batch systems found on large mainframes.* The other three events happen on any system: at boot, when a running process asks for helpers, and when a user types a command or clicks an icon."
  },
  {
    "q": "Processes that stay in the background to handle some activity such as email, Web pages, news and printing are called ___.",
    "type": "text",
    "answer": ["daemons", "daemon", "daemon processes"],
    "explain": "Slide 11. They are created at system initialization, are not associated with particular users, and each has some specific function."
  },
  {
    "q": "A user double-clicks an icon and the program opens. Which creation event is this?",
    "options": [
      "A user request to create a new process",
      "Initiation of a batch job",
      "System initialization",
      "Execution of a process-creation system call by a running process"
    ],
    "answer": 0,
    "explain": "Slide 15: *users can start a program by typing a command or (double) clicking on an icon. Taking either of these actions starts a new process and runs the selected program in it.*"
  },
  {
    "q": "A program creates one process to download a large file into a shared buffer and a second process to take items out of the buffer and process them. Which creation event made the two processes?",
    "options": [
      "Execution of a process-creation system call by a running process",
      "A user request to create a new process",
      "Initiation of a batch job",
      "System initialization"
    ],
    "answer": 0,
    "explain": "Slide 14: *Often a running process will issue system calls to create one or more new processes to help it do its job*, with exactly this fetch-and-process example."
  },
  {
    "q": "Foreground processes run in the background, are not associated with particular users, and have some specific function.",
    "type": "tf",
    "answer": false,
    "explain": "That is the slide's description of background processes. Foreground processes are *interacting with (human) users and perform work for them* (slide 11)."
  },
  {
    "q": "When an operating system is booted, typically only one process is created.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 11: *When an operating system is booted, typically numerous processes are created*, some foreground and some background. Slide 13's `ps` listing shows dozens right after boot."
  },
  {
    "q": "In a batch system, when does the OS create the process for the next job?",
    "options": [
      "When it decides that it has the resources to run another job",
      "When the user double-clicks the job's icon",
      "When the system is booted",
      "When the previous job's parent calls a process-creation system call"
    ],
    "answer": 0,
    "explain": "Slide 16: *When the operating system decides that it has the resources to run another job, it creates a new process and runs the next job from the input queue in it.* The user only submits the job, possibly remotely."
  },
  {
    "q": "In command-based UNIX systems running X, the new process takes over the window in which it was started.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 15, word for word."
  },
  {
    "q": "In slide 13's `ps -aux` listing on Ubuntu, which command has PID 1?",
    "options": ["/sbin/init splash", "[kthreadd]", "/bin/bash", "ps -aux"],
    "answer": 0,
    "explain": "PID 1 is `/sbin/init splash`, the first process the boot creates. `[kthreadd]` is PID 2. Slide 67 calls init *the parent of all the processes*."
  }
]
```

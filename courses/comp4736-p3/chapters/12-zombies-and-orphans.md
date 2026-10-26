---
title: Zombie and orphan processes
minutes: 15
---

A child that ends before its parent has waited for it, and a child whose parent ends first, both leave the process table in an odd state. Linux names the first a zombie and the second an orphan.

## A child the parent never waits for becomes a zombie

Slide 63:

*The parent process is responsible for waiting for child process to terminate and then cleaning up the child process entry from the process table.*

*The zombie process can be easily created when the parent process does not wait for the child process termination. A zombie process doesn't consume many system resources, but it does continue to live in the system's task list.*

The slide's figure, left to right:

1. The parent process calls `fork()`; the child process appears.
2. The child calls `exec()` and runs its program.
3. The child calls `exit()` and becomes a **zombie process**.
4. An arrow runs from the zombie back up to the parent, and the parent's dashed `wait()` line is **struck through**: the parent never waits, so the zombie stays.

The child's program has finished, but its entry stays in the process table until the parent waits for it. In `ps` that is state Z, *terminated but not reaped by its parent* ([the ps state letters](#/comp4736-p3/linux-process-states)).

## Slide 64 runs top while the parent is still alive

The demo program printed two lines, then `top` ran while the parent was still alive. The slides do not show the program's source.

```text
~$ ./a.out
Child: pid is 1550
Parent: pid is 1549
~$
```

Before reading the `top` screen: which state letter will 1550 show, which will 1549 show, and what will 1550's memory columns read?

```text
top - 23:58:38 up  4:15,  0 users,  load average: 1.84, 1.99, 2.58
Tasks:   9 total,   1 running,   7 sleeping,   0 stopped,   1 zombie
%Cpu(s): 13.2 us,  6.0 sy,  1.8 ni, 75.4 id,  2.7 wa,  0.0 hi,  0.8 si,  0.0 st
MiB Mem :  32104.4 total,  10043.8 free,   3500.7 used,  18559.8 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.  26939.4 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
      8 user      38  18  963500 111260  33800 S   2.0   0.3   1:27.32 node
      1 user      20   0    2500    584    520 S   0.0   0.0   0:00.06 tini
      7 user      38  18    2616    600    528 S   0.0   0.0   0:00.00 sh
     20 user      38  18   12180   6788   5956 S   0.0   0.0   0:00.01 sshd
    363 user      38  18    8116   6056   3308 S   0.0   0.0   0:00.13 bash
    910 user      38  18    8116   6232   3484 S   0.0   0.0   0:00.08 bash
   1549 user      38  18    2364    512    444 S   0.0   0.0   0:00.00 a.out
   1550 user      38  18       0      0      0 Z   0.0   0.0   0:00.00 a.out
   1551 user      38  18    7904   3612   3096 R   0.0   0.0   0:00.00 top
```

The slide's red arrow runs from *1 zombie* to the Z on PID 1550, the child. Its VIRT, RES and SHR are all 0: the zombie holds no memory, which is what *doesn't consume many system resources* means. It still has a row, which is what *continue to live in the system's task list* means. The parent 1549 is alive in S, not waiting for it.

## Slide 66 adds wait() to the parent

Slide 65 redraws the figure with `wait()` no longer struck through and the zombie box crossed out with a no-entry sign. Slide 66 runs the fixed program. Will the child show up in `top` this time?

```text
~$ ./a.out
Child: pid is 1850
Parent: pid is 1849
~$
```

```text
top - 00:14:44 up  4:31,  0 users,  load average: 1.55, 1.86, 2.08
Tasks:   8 total,   1 running,   7 sleeping,   0 stopped,   0 zombie
%Cpu(s): 11.3 us,  4.4 sy,  1.8 ni, 81.3 id,  0.7 wa,  0.0 hi,  0.6 si,  0.0 st
MiB Mem :  32104.4 total,  10316.8 free,   3168.3 used,  18619.2 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.  27271.3 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
      8 user      38  18  964264 113720  33800 S  10.6   0.3   2:11.88 node
      1 user      20   0    2500    584    520 S   0.0   0.0   0:00.08 tini
      7 user      38  18    2616    600    528 S   0.0   0.0   0:00.00 sh
     20 user      38  18   12180   6788   5956 S   0.0   0.0   0:00.01 sshd
    363 user      38  18    8116   6056   3308 S   0.0   0.0   0:00.14 bash
    910 user      38  18    8116   6232   3484 S   0.0   0.0   0:00.08 bash
   1848 user      38  18    7904   3540   3024 R   0.0   0.0   0:00.00 top
   1849 user      38  18    2364    572    508 S   0.0   0.0   0:00.00 a.out
```

*0 zombie*, and only the parent 1849 is listed: its `wait` cleaned up 1850's entry as soon as the child exited.

### The zombie forms at exit() and disappears at wait()

Watch the child's box turn into a zombie when it exits while the parent is busy elsewhere, and stay that way until a `wait` reaps it.

```widget
fork-play
{ "preset": "zombie" }
```

## An orphan is adopted by init, pid 1

Slide 67: *The parent dies (or terminates) before its child.* The child keeps running with no parent, and *the child process will be automatically adopted by the init process (the parent of all the processes with the pid of 1).*

The slide's demo runs `pstree -p -T` twice. In the first tree `a.out(474)` is the parent and `a.out(475)` its child. Then 474 ends while 475 keeps running. Where does 475 hang in the second tree?

```text
~$ pstree -p -T
tini(1)───sh(6)───node(7)─┬─bash(273)───pstree(476)
                          ├─bash(433)───a.out(474)───a.out(475)
                          └─sshd(19)
~$ pstree -p -T
tini(1)─┬─a.out(475)
        └─sh(6)───node(7)─┬─bash(273)───pstree(477)
                          ├─bash(433)
                          └─sshd(19)
~$
```

Slide 68 labels the second tree: **Parent** tini(1), **Child** a.out(475). This machine is a container, and its PID 1 is `tini`, which plays init's role; on the Ubuntu screenshots earlier in the deck PID 1 is `/sbin/init`. When the orphan exits, init waits for it, so an orphan does not stay a zombie.

### The parent exits first and init takes the child

The parent's box disappears while the child still runs, and the child's parent pointer moves to PID 1.

```widget
fork-play
{ "preset": "orphan" }
```

## Name the states in three new programs

Each program below is new, not from the slides; the parent has PID 3100 and its child PID 3101. Answer for the moment 5 seconds after the program starts.

```quiz
[
  {
    "q": "Program A. What state letters does `ps` show for the parent and the child?",
    "code": "pid_t pid = fork();\nif (pid == 0) {\n    printf(\"child done\\n\");\n    exit(0);\n} else {\n    sleep(60);\n}\n\nparent: ___\nchild:  ___",
    "type": "fill",
    "answer": ["S", "Z"],
    "explain": "The child prints and calls `exit(0)` at once; the parent is in `sleep(60)` and never calls `wait`. The parent is waiting for its timer, interruptible sleep S. The child has terminated but is not reaped: Z."
  },
  {
    "q": "Program B adds `wait(NULL);` before `sleep(60);` in the parent. How many zombies does top count 5 seconds in?",
    "code": "pid_t pid = fork();\nif (pid == 0) {\n    printf(\"child done\\n\");\n    exit(0);\n} else {\n    wait(NULL);\n    sleep(60);\n}",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0,
    "explain": "The parent's `wait(NULL)` returns as soon as the child exits and cleans up its entry, so the child is gone before the parent starts sleeping: 0 zombie, as on slide 66."
  },
  {
    "q": "Program C. The parent returns at once and the child sleeps. After 5 seconds, what does `getppid()` print in the child?",
    "code": "pid_t pid = fork();\nif (pid == 0) {\n    sleep(5);\n    printf(\"my parent is %d\\n\", getppid());\n}\nreturn 0;",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "The parent 3100 ends before its child, so 3101 is an orphan and is adopted by the init process, pid 1. `getppid()` now returns 1, not 3100."
  },
  {
    "q": "In Program C, what is the child called while its original parent is gone?",
    "type": "text",
    "answer": ["orphan", "an orphan", "orphan process", "an orphan process"],
    "explain": "A process whose parent dies (or terminates) before it is an orphan; init (pid 1) adopts it."
  },
  {
    "q": "Program A's parent wakes after 60 seconds and returns without calling `wait`. What happens to the zombie 3101?",
    "options": ["init adopts it and reaps it, so it disappears", "It stays in the task list until reboot", "It turns back into R", "It becomes an orphan in state T"],
    "answer": 0,
    "explain": "When the parent ends, its zombie child is an orphan too and is adopted by init (pid 1), which waits for it. Our addition from how init works, not a slide."
  }
]
```

```quiz
[
  {
    "q": "A zombie process uses a lot of memory.",
    "type": "tf",
    "answer": false,
    "explain": "*A zombie process doesn't consume many system resources, but it does continue to live in the system's task list.* On slide 64 the zombie's VIRT, RES and SHR are all 0."
  },
  {
    "q": "An orphan process is adopted by the ___ process.",
    "type": "text",
    "answer": ["init", "init process"],
    "explain": "*The child process will be automatically adopted by the init process (the parent of all the processes with the pid of 1).* In the slide's container, that process is `tini`."
  },
  {
    "q": "What is the pid of the process that adopts orphans?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "init is the parent of all the processes, with the pid of 1. Slide 68 shows a.out(475) moving under tini(1)."
  },
  {
    "q": "Which call by the parent removes a zombie child?",
    "options": ["wait()", "exit()", "exec()", "fork()"],
    "answer": 0,
    "explain": "The parent is responsible for waiting for the child to terminate and then cleaning up its entry from the process table. Slide 65 restores `wait()` and the zombie is gone. `exit()` is what makes the child a zombie."
  },
  {
    "q": "Who is responsible for cleaning up a terminated child's entry from the process table?",
    "options": ["The parent process", "The child process itself", "The scheduler", "The init process, always"],
    "answer": 0,
    "explain": "Slide 63: *The parent process is responsible for waiting for child process to terminate and then cleaning up the child process entry from the process table.* init does it only for children it has adopted."
  },
  {
    "q": "A zombie process continues to live in the system's task list.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide's sentence. On slide 64 the zombie 1550 still has its own row in `top`, with state Z, and the summary counts 1 zombie."
  },
  {
    "q": "An orphan is a process whose child has terminated before it.",
    "type": "tf",
    "answer": false,
    "explain": "It is the other way round: an orphan is a child whose parent dies (or terminates) first. A child that terminates while its parent has not waited is a zombie."
  },
  {
    "q": "In slide 64's top screen, which PID is the zombie?",
    "options": ["1550", "1549", "1551", "1"],
    "answer": 0,
    "explain": "The program printed *Child: pid is 1550*, and 1550's row shows Z. 1549 is the parent in S; 1551 is `top` itself in R."
  }
]
```

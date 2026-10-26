---
title: pstree, ps, top and the state letters D I R S T X Z
minutes: 16
---

Linux reports each process's state as one letter, and the three-state model's Blocked turns into two different letters there. This lesson reads the tools that show those letters and the diagram that connects them.

## Three tools look at running processes

Slide 54:

| Command | Slide description | Slide example |
|---|---|---|
| `pstree` | *display a tree of processes* | `pstree -p -T` |
| `ps` | *report a snapshot of the current processes* | `ps aux` |
| `top` | *display Linux processes* | `top` |

`htop` (slide 58) is the interactive version of `top`, with CPU meters and function keys such as F5 Tree and F9 Kill.

Slide 55 runs the first two in a container:

```text
~$ pstree -p -T
tini(1)───sh(7)───node(8)─┬─bash(746)───pstree(859)
                          ├─bash(748)
                          └─sshd(20)
~$ ps ax
  PID TTY      STAT   TIME COMMAND
    1 ?        Ss     0:00 /cocalc/bin/tini -v -g -- sh -c env -i
    7 ?        SN     0:00 sh -c env -i /cocalc/init/init.sh $COC
    8 ?        RNl    0:10 node --optimize-for-size --gc-interval
   20 ?        SN     0:00 sshd: /usr/sbin/sshd -D -p 2222 -h /tm
  314 pts/0    SNs    0:00 /bin/bash
  401 pts/0    SN     0:00 sleep 10000
  403 pts/0    RN+    0:00 ps ax
~$
```

`-p` prints each PID in brackets, so the tree shows who created whom: PID 1 at the root, and `pstree(859)` as a child of the `bash` that ran it. The `ps` column to read is **STAT**: the first letter is the state, the letters after it are flags.

## The state letters from man ps

Slide 59 boxes the `man ps` table:

| Code | Meaning (slide 59) |
|---|---|
| D | *uninterruptible sleep (usually IO and cannot be killed)* |
| I | *Idle kernel thread* |
| R | *running or runnable (on run queue)* |
| S | *interruptible sleep (waiting for an event to complete and can be killed)* |
| T | *stopped by job control signal* |
| X | *dead (should never be seen)* |
| Z | *defunct ("zombie") process, terminated but not reaped by its parent* |
| < | *high-priority (not nice to other users)* |
| N | *low-priority (nice to other users)* |
| + | *is in the foreground process group* |

Slide 60 boxes the row `401 pts/0 SN 0:00 sleep 10000`: `sleep` is waiting for its timer, so S, interruptible sleep, with N for low priority. `ps ax` itself shows `RN+`: it is the one running, and it is in the terminal's foreground. The screenshots also carry `s` (Ss, SNs) and `l` (RNl), which slide 59 does not list; from `man ps`, not the slide: `s` is a session leader, `l` is multi-threaded.

Compared with the three states of [Running, Ready, Blocked](#/comp4736-p3/process-states) (our mapping, not a slide): R covers both Running and Ready, since a process on the run queue is R whether or not it holds the CPU; S and D are two kinds of Blocked, told apart by whether a signal can wake the process; T and Z have no three-state equivalent.

## top shows one row per process and a state count

Slides 56 and 57 annotate a `top` screen. Its summary line counts the states, *Tasks: 160 total, 1 running, 159 sleeping, 0 stopped, 0 zombie*, and the columns are labelled:

| Column | Slide label | Column | Slide label |
|---|---|---|---|
| PID | Process ID | RES | Resident size |
| USER | User name | SHR | Shared Mem size |
| PR | Priority | S | Process Status |
| NI | Nice value | %CPU | CPU usage |
| VIRT | Virtual Image | %MEM | Memory usage |

The S column carries the same letters as STAT: `top` itself is R, `systemd` is S, and the `kworker` kernel threads are I.

## Slide 61 connects R, S, D, T and Z

| From | To | Arrow label |
|---|---|---|
| R | D | (unlabelled) |
| D | R | **wake up** |
| R | S | (unlabelled) |
| S | R | **wake up/signal** |
| R | T | **SIGSTOP** |
| T | R | **SIGCONT** |
| R | Z | **Exit()** |

R is the centre: every other state is entered from R. Most processes spend most of their time in S: slide 56's `top` counts 159 of its 160 tasks as sleeping and only 1 as running, which is `top` itself. D returns only on *wake up*, while S returns on *wake up/signal*: that is the slide-59 difference between *cannot be killed* and *can be killed*. No arrow leaves Z; a zombie waits for its parent ([zombies and orphans](#/comp4736-p3/zombies-and-orphans)).

### One process through R, S, D, T and Z

Each event moves the token along one of slide 61's arrows. In predict mode, name the state letter the event leads to before the token moves.

```widget
process-states-play
{ "model": "linux", "predict": true }
```

## A stopped process shows T

Slide 62, under the banner *T stopped by job control signal*, stops a running `./a.out`. The shell prints `[1]+  Stopped  ./a.out`, `top`'s summary changes to *1 stopped*, and the `a.out` row (PID 8266) shows **T** in the S column. The slide does not show how the job was stopped. Our answer, not on the slide: pressing Ctrl-Z in the terminal sends SIGTSTP, a job-control stop signal that lands in T just as SIGSTOP does, and `fg` or `kill -CONT 8266` sends SIGCONT to resume it; an in-class answer replaces this.

## Decode a new ps listing

A different machine prints this `ps ax` excerpt.

```quiz
[
  {
    "q": "Which process cannot be killed right now?",
    "code": "  PID TTY      STAT   TIME COMMAND\n  612 ?        Ss     0:01 cron\n 2210 pts/1    D      0:03 cp big.iso /mnt/usb\n 2214 pts/1    T      0:00 vim notes.txt\n 2230 pts/1    Z      0:00 [worker] <defunct>\n 2241 pts/1    R+     0:00 ps ax",
    "options": ["2210 cp", "612 cron", "2214 vim", "2241 ps"],
    "answer": 0,
    "explain": "STAT `D`: uninterruptible sleep, usually IO and cannot be killed. `cp` is waiting on the USB disk. `cron` is S (interruptible, can be killed), `vim` is T and `ps` is R."
  },
  {
    "q": "Which signal moves `vim` (PID 2214) back to R?",
    "options": ["SIGCONT", "SIGSTOP", "Exit()", "wake up"],
    "answer": 0,
    "explain": "T is *stopped by job control signal*; on slide 61 the T → R arrow is SIGCONT. SIGSTOP is the arrow into T."
  },
  {
    "q": "What has happened to PID 2230?",
    "options": ["It has terminated, but its parent has not reaped it", "It is waiting for disk IO", "It is stopped and can be resumed", "It is an idle kernel thread"],
    "answer": 0,
    "explain": "STAT `Z`: defunct (\"zombie\") process, terminated but not reaped by its parent. `ps` even prints `<defunct>` after the name."
  },
  {
    "q": "What does the `+` in `R+` say about PID 2241?",
    "options": ["It is in the foreground process group", "It has high priority", "It has low priority", "It is multi-threaded"],
    "answer": 0,
    "explain": "From slide 59: `+` is in the foreground process group. High priority is `<`, low priority is `N`."
  },
  {
    "q": "In `top` on this machine, what would the summary line count as zombie?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "Exactly one process in the excerpt has state Z (PID 2230), so the Tasks line would read 1 zombie, as slide 64's does."
  }
]
```

```quiz
[
  {
    "q": "Match each ps state code to its meaning.",
    "type": "match",
    "pairs": [
      ["D", "uninterruptible sleep (usually IO)"],
      ["R", "running or runnable (on run queue)"],
      ["S", "interruptible sleep (waiting for an event)"],
      ["T", "stopped by job control signal"],
      ["Z", "terminated but not reaped by its parent"]
    ],
    "explain": "The slide-59 `man ps` table: D uninterruptible sleep, R running or runnable, S interruptible sleep, T stopped by job control signal, Z defunct (\"zombie\"). The remaining codes are I (idle kernel thread) and X (dead, should never be seen)."
  },
  {
    "q": "A process in state D (uninterruptible sleep) can be killed.",
    "type": "tf",
    "answer": false,
    "explain": "D is *uninterruptible sleep (usually IO and cannot be killed)*. S is the sleep that can be killed; on slide 61 S returns to R on *wake up/signal*, D only on *wake up*."
  },
  {
    "q": "Which signal moves a stopped process (T) back to R?",
    "options": ["SIGCONT", "SIGSTOP", "SIGKILL", "Exit()"],
    "answer": 0,
    "explain": "Slide 61: R → T is SIGSTOP, T → R is SIGCONT. Exit() is the arrow from R to Z."
  },
  {
    "q": "Which state letter should never be seen?",
    "type": "text",
    "answer": ["X"],
    "explain": "X is *dead (should never be seen)*. Z, the other end-of-life letter, is seen: it is a terminated process its parent has not reaped yet."
  },
  {
    "q": "Which command does slide 54 describe as \"display a tree of processes\"?",
    "options": ["pstree", "ps", "top", "htop"],
    "answer": 0,
    "explain": "`pstree` displays a tree of processes (`pstree -p -T` adds PIDs). `ps` reports a snapshot of the current processes and `top` displays Linux processes."
  },
  {
    "q": "On slide 60, `sleep 10000` shows STAT `SN`. What does the N mean?",
    "options": ["low-priority (nice to other users)", "high-priority (not nice to other users)", "not yet reaped", "no terminal"],
    "answer": 0,
    "explain": "N is *low-priority (nice to other users)*; `<` is high priority. The S before it is the state: interruptible sleep, waiting for the timer."
  },
  {
    "q": "In the slide-57 annotations, what does top's NI column show?",
    "options": ["Nice value", "Priority", "Process Status", "Virtual Image"],
    "answer": 0,
    "explain": "NI = Nice value. PR is Priority, S is Process Status, VIRT is Virtual Image."
  },
  {
    "q": "On the slide-61 diagram, which arrow leads into Z?",
    "options": ["Exit() from R", "SIGSTOP from R", "wake up from D", "SIGCONT from T"],
    "answer": 0,
    "explain": "R → Z is labelled Exit(). No arrow leaves Z: only the parent's wait removes the zombie."
  },
  {
    "q": "A process waiting on the run queue for the CPU shows state S.",
    "type": "tf",
    "answer": false,
    "explain": "R is *running or runnable (on run queue)*. A runnable process waiting its turn is R; S is a process waiting for an event, such as a timer or input."
  }
]
```

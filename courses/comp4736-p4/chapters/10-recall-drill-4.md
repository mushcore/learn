---
title: Recall drill, Part 4 (closed book)
minutes: 25
---

The midterm gives you no notes, so every Part 4 list, name and number has to come out of memory. Produce each answer before you check it; the tables at the end are for the re-read afterwards. Type blanks in lowercase unless the slide capitalises the word.

What a thread is, why threads exist, and the two usage examples.

```quiz
[
  {
    "type": "fill",
    "q": "Slide 1: the three things a thread has of its own (lowercase).",
    "code": "A thread is a flow of execution through the process code, with its own ___, system ___ and ___.",
    "answer": ["program counter", "registers", "stack"],
    "explain": "*A thread is a flow of execution through the process code, with its own program counter, system registers and stack.* Everything else (address space, globals, open files) belongs to the process. See [what a thread is](#/comp4736-p4/what-is-a-thread)."
  },
  {
    "type": "text",
    "q": "Slide 1: a thread is also called a ________.",
    "answer": ["lightweight process", "light weight process", "light-weight process"],
    "explain": "*A thread is also called a lightweight process. Threads provide a way to improve application performance through parallelism.*"
  },
  {
    "type": "reorder",
    "q": "Put slide 2's four motivations for threads in the slide's order.",
    "lines": [
      "Many activities at once, some of which block: sequential threads in quasi-parallel make the programming model simpler",
      "Lighter weight than processes: creating a thread goes 10–100 times faster",
      "Substantial computing and substantial I/O can overlap (no gain when all threads are CPU bound)",
      "Systems with multiple CPUs, where real parallelism is possible"
    ],
    "explain": "1 is *the main reason for having threads*, the simpler programming model. 2 is speed of creation and destruction. 3 is overlap, with the trap that CPU-bound threads gain nothing. 4 is real parallelism on multiple CPUs."
  },
  {
    "type": "fill",
    "q": "Slide 2, motivation 2: the two numbers.",
    "code": "Creating a thread goes ___–___ times faster than creating a process.",
    "answer": ["10", "100"],
    "explain": "*Creating a thread goes 10–100 times faster than creating a process.*"
  },
  {
    "type": "fill",
    "q": "Slide 2, motivation 3: when do threads give no gain?",
    "code": "Threads yield no performance gain when all of them are ___ bound.",
    "answer": ["CPU", "cpu"],
    "explain": "*Threads yield no performance gain when all of them are CPU bound, but when there is substantial computing and also substantial I/O, having threads allows these activities to overlap, thus speeding up the application.*"
  },
  {
    "type": "fill",
    "q": "Slide 2, motivation 1: how the sequential threads run.",
    "code": "decomposing such an application into multiple sequential threads that run in ___",
    "answer": ["quasi-parallel", "quasi parallel"],
    "explain": "*By decomposing such an application into multiple sequential threads that run in quasi-parallel, the programming model becomes simpler.*"
  },
  {
    "type": "text",
    "q": "Slides 3–4: the word processor's three threads interact with the user, reformat in the background, and do what?",
    "answer": ["disk backups", "disk backup", "backups", "backup", "handle the disk backups", "saves the file to disk", "save the file to disk", "autosave", "auto save", "automatically saves the file", "automatically save the file to disk", "saving the file to disk"],
    "explain": "*The third thread can handle the disk backups without interfering with the other two e.g. automatically saving the entire file to disk every few minutes.* See [thread usage](#/comp4736-p4/thread-usage)."
  },
  {
    "type": "text",
    "q": "Which Web-server thread reads incoming requests for work from the network?",
    "answer": ["dispatcher", "dispatcher thread", "the dispatcher", "the dispatcher thread"],
    "explain": "Slide 8: *The dispatcher thread, reads incoming requests for work from the network. After examining the request, it chooses an idle (i.e., blocked) worker thread and hands it the request.*"
  },
  {
    "type": "reorder",
    "q": "Put slide 8's account of one Web request in order.",
    "lines": [
      "The dispatcher reads an incoming request from the network",
      "It chooses an idle (blocked) worker thread and hands it the request",
      "It wakes the worker, moving it from blocked state to ready state",
      "The worker checks whether the Web page cache can satisfy the request",
      "If not, the worker starts a disk read and blocks until it completes",
      "Another thread is chosen to run, possibly the dispatcher"
    ],
    "explain": "The dispatcher loop is `get_next_request(&buf)` then `handoff_work(&buf)`; the worker loop is `wait_for_work`, `look_for_page_in_cache`, `read_page_from_disk` if the page is not cached, `return_page` (slide 10). The Web page cache is the one *to which all threads have access*."
  },
  {
    "type": "fill",
    "q": "Slide 8: the worker's state transition when the dispatcher wakes it (lowercase).",
    "code": "moving it from ___ state to ___ state",
    "answer": ["blocked", "ready"],
    "explain": "*The dispatcher then wakes up the sleeping worker, moving it from blocked state to ready state.*"
  },
  {
    "type": "match",
    "q": "Slide 11, three ways to construct a server: match each model to its characteristics.",
    "pairs": [
      ["Threads", "Parallelism, blocking system calls"],
      ["Single-threaded process", "No parallelism, blocking system calls"],
      ["Finite-state machine", "Parallelism, nonblocking system calls, interrupts"]
    ],
    "explain": "Only the single-threaded process has no parallelism. Only the finite-state machine uses nonblocking calls and interrupts."
  }
]
```

The classical thread model and Pthreads.

```quiz
[
  {
    "type": "fill",
    "q": "Slide 12: the process model's two independent concepts (lowercase).",
    "code": "The process model is based on two independent concepts: resource ___ and ___(thread)",
    "answer": ["grouping", "execution"],
    "explain": "*The process model is based on two independent concepts: resource grouping and execution(thread).* See [the classical thread model](#/comp4736-p4/classical-thread-model)."
  },
  {
    "q": "Select every per-thread item (slide 15, private to each thread).",
    "options": ["Program counter", "Registers", "Stack", "State", "Address space", "Global variables", "Open files", "Child processes", "Pending alarms", "Signals and signal handlers", "Accounting information"],
    "answer": [0, 1, 2, 3],
    "explain": "Per thread: program counter, registers, stack, state. The other seven are per process, *shared by all threads in a process*."
  },
  {
    "q": "Select every per-process item (slide 14, shared by all threads in a process).",
    "options": ["Address space", "Global variables", "Open files", "Child processes", "Pending alarms", "Signals and signal handlers", "Accounting information", "Program counter", "Registers", "Stack", "State"],
    "answer": [0, 1, 2, 3, 4, 5, 6],
    "explain": "Per process, seven items: address space, global variables, open files, child processes, pending alarms, signals and signal handlers, accounting information. Per thread, four: program counter, registers, stack, state."
  },
  {
    "type": "fill",
    "q": "Slide 13: the two reasons there is no protection between threads (lowercase).",
    "code": "There is no protection between threads because (1) it is ___, and (2) it should not be ___",
    "answer": ["impossible", "necessary"],
    "explain": "*There is no protection between threads because (1) it is impossible, and (2) it should not be necessary.* Since every thread can access every address, *one thread can read, write, or even wipe out another thread's stack*."
  },
  {
    "type": "fill",
    "q": "Slide 17: the four thread states (lowercase).",
    "code": "running, ___, ready, ___",
    "answer": ["blocked", "terminated"],
    "explain": "*A thread can be in any one of several states: running, blocked, ready, or terminated.* *The transitions between thread states are the same as those between process states.*"
  },
  {
    "type": "text",
    "q": "Slide 18: the term for allowing multiple threads in the same process.",
    "answer": ["multithreading", "multi-threading"],
    "explain": "*The term multithreading is also used to describe the situation of allowing multiple threads in the same process.* The CPU switches rapidly among the threads, *providing the illusion that the threads are running in parallel*."
  },
  {
    "type": "match",
    "q": "Slide 19: match each Pthreads call to its description.",
    "pairs": [
      ["Pthread_create", "Create a new thread"],
      ["Pthread_exit", "Terminate the calling thread"],
      ["Pthread_join", "Wait for a specific thread to exit"],
      ["Pthread_yield", "Release the CPU to let another thread run"],
      ["Pthread_attr_init", "Create and initialize a thread's attribute structure"],
      ["Pthread_attr_destroy", "Remove a thread's attribute structure"]
    ],
    "explain": "The slide capitalises the names; the real calls are lowercase, `pthread_create` and so on, as the demo programs write them. See [Pthreads](#/comp4736-p4/pthreads)."
  },
  {
    "type": "fill",
    "q": "Slide 19: how many function calls Pthreads defines.",
    "code": "Supported by most UNIX systems. Defines over ___ function calls",
    "answer": ["60"],
    "explain": "*Defines over 60 function calls*; slide 19 lists six of them."
  },
  {
    "type": "fill",
    "q": "Slide 22: the flag that links the Pthreads library.",
    "code": "~$ gcc main.c ___",
    "answer": ["-lpthread"],
    "explain": "`gcc main.c -lpthread`, then `./a.out`. `pstree -p` showed a.out(1182) with threads {a.out}(1183) and (1184), and `ls /proc/1182/task/` listed 1182 1183 1184."
  },
  {
    "type": "text",
    "q": "Slide 23: the system call that returns the caller's thread ID (TID).",
    "answer": ["gettid", "gettid()"],
    "explain": "*gettid - get thread identification.* *In a multithreaded process, all threads have the same PID, but each one has a unique TID.*"
  }
]
```

User-level and kernel threads, hybrids, Java and pop-up threads.

```quiz
[
  {
    "type": "text",
    "q": "Slide 25: the collection of procedures that manage user-level threads.",
    "answer": ["run-time system", "runtime system", "run time system", "the run-time system", "the runtime system"],
    "explain": "*The threads run on top of a run-time system, which is a collection of procedures that manage threads e.g. pthread_create, pthread_exit, pthread_join, and pthread_yield.* See [user versus kernel threads](#/comp4736-p4/user-vs-kernel-threads)."
  },
  {
    "type": "text",
    "q": "Slide 26: the private table each process needs to keep track of its user-level threads.",
    "answer": ["thread table", "the thread table"],
    "explain": "It is *analogous to the kernel's process table*, but it keeps only the per-thread properties (program counter, stack pointer, registers, state), and *The thread table is managed by the run-time system.* With kernel threads, the kernel's thread table *keeps track of all the threads in the system*."
  },
  {
    "type": "fill",
    "q": "Slide 26: why user-level thread scheduling is very fast (lowercase).",
    "code": "No ___ is needed, no context switch is needed, the memory cache need not be ___",
    "answer": ["trap", "flushed"],
    "explain": "*No trap is needed, no context switch is needed, the memory cache need not be flushed, and so on. This makes thread scheduling very fast.* The practice paper's Q7 key marks thread switching as the user-level overhead, which contradicts this slide; know the slide's reason and the key."
  },
  {
    "q": "Select the three advantages of user-level threads (slide 26).",
    "options": ["Very fast thread scheduling", "A customized scheduling algorithm per process", "They scale better", "No new, nonblocking system calls are needed", "On a page fault, another runnable thread can run", "Kernel routines themselves can be multithreaded"],
    "answer": [0, 1, 2],
    "explain": "User-level: fast scheduling, *customized scheduling algorithm*, *They also scale better* (kernel threads *invariably require some table space and stack space in the kernel*). The other three are kernel-thread facts (slides 31 and 32)."
  },
  {
    "type": "fill",
    "q": "Slide 27: the two problems of user-level threads (lowercase).",
    "code": "1. The problem of how ___ system calls are implemented.\n2. Within a single process, there are no ___ interrupts.",
    "answer": ["blocking", "clock"],
    "explain": "A real blocking call *will stop all the threads*. With no clock interrupts, *Unless a thread enters the run-time system of its own free will, the scheduler will never get a chance.*"
  },
  {
    "type": "fill",
    "q": "Slide 30: what the kernel can do when a kernel thread blocks (lowercase).",
    "code": "the kernel, at its option, can run either another thread from the ___ process (if one is ready) or a thread from a ___ process.",
    "answer": ["same", "different"],
    "explain": "*When a thread blocks, the kernel, at its option, can run either another thread from the same process (if one is ready) or a thread from a different process.*"
  },
  {
    "type": "fill",
    "q": "Slide 31: the main disadvantage of kernel threads (lowercase).",
    "code": "Their main disadvantage is that the cost of a ___ is substantial",
    "answer": ["system call", "syscall"],
    "explain": "*Their main disadvantage is that the cost of a system call is substantial.* Their advantages on the same slide: they *do not require any new, nonblocking system calls*, and on a page fault the kernel can run another runnable thread of the process."
  },
  {
    "q": "Select every row of slide 32's table that describes kernel-level threads.",
    "options": ["Slower to create and manage", "The operating system supports their creation", "Specific to the operating system", "Kernel routines themselves can be multithreaded", "Faster to create and manage", "Implemented by a thread library at the user level", "Generic and can run on any operating system", "Multi-threaded applications cannot take advantage of multiprocessing"],
    "answer": [0, 1, 2, 3],
    "explain": "Kernel-level: slower, created by the operating system, OS-specific, kernel routines can be multithreaded. User-level: faster, a thread library, generic, *cannot take advantage of multiprocessing*."
  },
  {
    "type": "fill",
    "q": "Slide 34: what the kernel sees in a hybrid implementation (lowercase).",
    "code": "the kernel is aware of only the ___-level threads and schedules those.",
    "answer": ["kernel"],
    "explain": "Hybrid: *use kernel-level threads and then multiplex user-level threads onto some or all of them*, which gives *the ultimate in flexibility*. See [hybrid models](#/comp4736-p4/hybrid-models)."
  },
  {
    "type": "match",
    "q": "Slides 36–42: match each mapping to its property.",
    "pairs": [
      ["Many-to-one", "lack of true concurrency; the kernel is unaware of individual user threads"],
      ["One-to-one", "true concurrency, but many kernel threads introduce overhead"],
      ["Many-to-many", "an equal or smaller number of kernel threads; library and kernel work together"]
    ],
    "explain": "Many to one: *many user threads to one kernel thread*. One to one: *one user thread to one kernel thread*. Many to many: *many user-level threads to many kernel-level threads*, *a balance between concurrency and thread creation overhead*."
  },
  {
    "type": "fill",
    "q": "Slide 42: many-to-many (lowercase).",
    "code": "Multiple user threads are mapped onto an ___ or ___ number of kernel threads.",
    "answer": ["equal", "smaller"],
    "explain": "*Multiple user threads are mapped onto an equal or smaller number of kernel threads.*"
  },
  {
    "type": "match",
    "q": "Slides 43–47: match each way of making a Java thread to its code.",
    "pairs": [
      ["Method 1, extending the Thread class", "class MyThread extends Thread"],
      ["Method 2, implementing the Runnable interface", "class MyRunnable implements Runnable"],
      ["Method 3, a lambda expression", "Runnable r = () -> { ... };"],
      ["A virtual thread", "Thread.ofVirtual().unstarted(r1)"]
    ],
    "explain": "Each method puts the work in `run()` and launches it with `start()`. The virtual thread's `isVirtual()` prints true; the platform thread T prints false. See [Java threads](#/comp4736-p4/java-threads)."
  },
  {
    "type": "text",
    "q": "Slide 49: the project name Java virtual threads are also known by.",
    "answer": ["Project Loom", "Loom"],
    "explain": "*Virtual threads (also known as \"Project Loom\" virtual threads)* are *lightweight, user-space threads that are managed by the Java Virtual Machine (JVM) itself*. Platform threads are *managed by the operating system*."
  },
  {
    "type": "text",
    "q": "Slide 50: the name of a thread the system creates when a message arrives.",
    "answer": ["pop-up thread", "popup thread", "pop up thread", "pop-up"],
    "explain": "*The arrival of a message causes the system to create a new thread to handle the message. Such a thread is called a pop-up thread.* See [pop-up threads](#/comp4736-p4/pop-up-threads)."
  },
  {
    "type": "fill",
    "q": "Slide 50: why a pop-up thread is quick to create (lowercase).",
    "code": "they are brand new, they do not have any ___—registers, stack, whatever—that must be restored.",
    "answer": ["history"],
    "explain": "*Each one starts out fresh and each one is identical to all the others. This makes it possible to create such a thread quickly*, and *the latency between message arrival and the start of processing can be made very short*."
  }
]
```

## What a thread is and why

| Item | Content |
|---|---|
| Definition (slide 1) | a flow of execution through the process code, with its own program counter, system registers and stack; also called a lightweight process |
| Motivation 1 | many activities at once, some block; sequential threads in quasi-parallel make the programming model simpler |
| Motivation 2 | lighter weight; creating a thread goes 10–100 times faster than creating a process |
| Motivation 3 | no performance gain when all are CPU bound; substantial computing and I/O overlap |
| Motivation 4 | multiple CPUs, where real parallelism is possible |

## Thread usage

| Example | Threads |
|---|---|
| Word processor (slides 3–4) | one interacts with the user; one reformats in the background; one does disk backups every few minutes |
| Web server (slides 8–10) | dispatcher reads requests, hands one to an idle (blocked) worker, moves it blocked → ready; worker checks the Web page cache (shared by all threads), else reads the disk and blocks |

| Server model (slide 11) | Characteristics |
|---|---|
| Threads | Parallelism, blocking system calls |
| Single-threaded process | No parallelism, blocking system calls |
| Finite-state machine | Parallelism, nonblocking system calls, interrupts |

## The classical thread model

| Per process items | Per thread items |
|---|---|
| Address space | Program counter |
| Global variables | Registers |
| Open files | Stack |
| Child processes | State |
| Pending alarms | |
| Signals and signal handlers | |
| Accounting information | |

Two concepts: resource grouping and execution (thread). Same address space, same globals; one thread can wipe out another's stack; no protection because it is impossible and should not be necessary. States: running, blocked, ready, terminated, with the same transitions as process states.

## Pthreads

| Thread call | Description |
|---|---|
| Pthread_create | Create a new thread |
| Pthread_exit | Terminate the calling thread |
| Pthread_join | Wait for a specific thread to exit |
| Pthread_yield | Release the CPU to let another thread run |
| Pthread_attr_init | Create and initialize a thread's attribute structure |
| Pthread_attr_destroy | Remove a thread's attribute structure |

Over 60 calls. Compile with `gcc main.c -lpthread`. `/proc/<pid>/task` lists one entry per thread, the main thread's TID equal to the PID. gettid: same PID for all threads, a unique TID each.

## User-level and kernel threads

| | User-level (slides 25–28) | Kernel (slides 29–33) |
|---|---|---|
| Who knows | the kernel knows nothing about them | the kernel's thread table tracks all threads in the system |
| Managed by | a run-time system and a thread table per process | the kernel; no run-time system or thread table in each process |
| Advantages | no trap, no context switch, no cache flush: very fast scheduling; customized scheduling; scale better | no new nonblocking system calls; on a page fault, another runnable thread runs |
| Problems | a blocking system call stops all the threads; no clock interrupts within a process | the cost of a system call is substantial |
| When a thread blocks | the whole process blocks | the kernel runs another thread of the same process or a different one |

| Slide 32 | User-Level Threads | Kernel-Level Thread |
|---|---|---|
| 1 | faster to create and manage | slower to create and manage |
| 2 | a thread library at the user level | the operating system supports creation |
| 3 | generic, runs on any operating system | specific to the operating system |
| 4 | cannot take advantage of multiprocessing | kernel routines themselves can be multithreaded |

The practice paper's Q7 key says thread switching has more overhead with user-level threads; slide 26 says user-level scheduling is very fast.

## Hybrids, Java, pop-up threads

| Mapping | Property |
|---|---|
| Many-to-one | many user threads on one kernel thread; managed by the user-level library; lack of true concurrency |
| One-to-one | a dedicated kernel thread each; true concurrency; overhead |
| Many-to-many | an equal or smaller number of kernel threads; balance; library and kernel work together |

Hybrid: multiplex user-level threads onto some or all kernel threads; the kernel is aware of only the kernel-level threads; the ultimate in flexibility. Java platform threads are managed by the OS, heavyweight; virtual threads (Project Loom) are lightweight user-space threads managed by the JVM. A pop-up thread is created when a message arrives; it has no history to restore, so it starts quickly.

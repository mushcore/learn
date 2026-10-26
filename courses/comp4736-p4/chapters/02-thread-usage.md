---
title: The word processor, the web server and three ways to build a server
minutes: 15
---

The slides give two programs that need threads: a word processor with three jobs, and a Web server that must keep taking requests while it waits for the disk. Slide 11 then compares the threaded server with two ways of building it without threads.

## The word processor has three threads

Slide 3, *Example 1*: *One thread interacts with the user and the other handles reformatting in the background. The third thread can handle the disk backups without interfering with the other two e.g. automatically saving the entire file to disk every few minutes to protect the user against losing a day's work in the event of a program crash, system crash, or power failure.*

Slide 4's figure, *A word processor with three threads*, draws one process above the kernel with three threads inside it, each wired to what it works on:

| Thread | Wired to (figure) | Job |
|---|---|---|
| interactive | Keyboard | reads what the user types |
| reformatting | the document's pages | reformats in the background |
| backup | Disk | saves the whole file every few minutes |

The three jobs work on one document. Because threads share their process's memory, all three see the same copy of it; three separate processes would each have their own.

Slides 5–7 are Process Explorer screenshots of real programs: WINWORD.EXE runs 35 threads, Acrobat.exe 28 and javaw.exe 18.

## The Web server: a dispatcher, workers and a shared page cache

Slide 8, *Example 2*: *The dispatcher thread, reads incoming requests for work from the network. After examining the request, it chooses an idle (i.e., blocked) worker thread and hands it the request. The dispatcher then wakes up the sleeping worker, moving it from blocked state to ready state.*

*When the worker wakes up, it checks to see if the request can be satisfied from the Web page cache, to which all threads have access. If not, it starts a read operation to get the page from the disk and blocks until the disk operation completes. When the thread blocks on the disk operation, another thread is chosen to run, possibly the dispatcher.*

Slide 9's figure, *A multithreaded Web server*: one Web server process in user space holding a dispatcher thread, several worker threads and a shaded Web page cache. The *Network connection* comes up through the kernel to the dispatcher.

An idle worker is a blocked worker: it is waiting for work. Waking it moves it to ready, not to running; the scheduler decides when it gets the CPU.

## The outline code for the dispatcher and the worker

Slide 10, *A rough outline of the code for the previous figure. (a) Dispatcher thread. (b) Worker thread.*

```c
/* (a) Dispatcher thread */
while (TRUE) {
    get_next_request(&buf);
    handoff_work(&buf);
}

/* (b) Worker thread */
while (TRUE) {
    wait_for_work(&buf)
    look_for_page_in_cache(&buf, &page);
    if (page_not_in_cache(&page))
        read_page_from_disk(&buf, &page);
    return_page(&page);
}
```

The slide has no semicolon after `wait_for_work(&buf)`; the listing keeps it that way.

Both loops are plain sequential code with calls that block. `handoff_work(&buf)` is the hand-over and the wake-up of slide 8. `wait_for_work(&buf)` is where an idle worker sits blocked. `read_page_from_disk(&buf, &page)` runs only on a cache miss, and only that worker blocks on it.

While one worker waits for the disk, can the server accept the next request? Decide before you read on.

It can. The block stops one thread, not the process: the dispatcher, or another worker with a cached page, is chosen to run. This is motivation 3 of [the previous lesson](#/comp4736-p4/what-is-a-thread) at work, computing and I/O overlapping.

## Three ways to construct a server

Slide 11, *Three ways to construct a server*:

| Model | Characteristics |
|---|---|
| Threads | Parallelism, blocking system calls |
| Single-threaded process | No parallelism, blocking system calls |
| Finite-state machine | Parallelism, nonblocking system calls, interrupts |

Read the table as a trade. The threaded server keeps the simple blocking calls of slide 10 and still overlaps requests, because a blocked call stops only the thread that made it. A single-threaded process also uses blocking calls, but with one thread a disk read stops the whole server, so there is no parallelism. The finite-state machine gets parallelism without threads by switching to nonblocking calls and being told by interrupts when each one finishes.

Only the threaded server has both parallelism and blocking system calls; the other two each give one up.

```quiz
[
  {
    "q": "Match each way to construct a server to its characteristics on slide 11.",
    "type": "match",
    "pairs": [
      ["Threads", "Parallelism, blocking system calls"],
      ["Single-threaded process", "No parallelism, blocking system calls"],
      ["Finite-state machine", "Parallelism, nonblocking system calls, interrupts"]
    ],
    "explain": "Threads keep blocking calls and still get parallelism, because a blocked call stops only one thread. One thread with blocking calls has no parallelism. The finite-state machine gets parallelism by using nonblocking calls and interrupts instead of threads."
  },
  {
    "q": "In the multithreaded Web server, which thread wakes up a sleeping worker?",
    "options": ["The dispatcher thread", "Another worker thread", "The kernel's disk thread", "The worker wakes itself when the cache changes"],
    "answer": 0,
    "explain": "Slide 8: the dispatcher reads a request, chooses an idle worker, hands it the request and *wakes up the sleeping worker, moving it from blocked state to ready state*."
  },
  {
    "q": "When a worker thread reads a page from the disk, the whole Web server process blocks until the read completes.",
    "type": "tf",
    "answer": false,
    "explain": "Only that worker blocks. Slide 8: *When the thread blocks on the disk operation, another thread is chosen to run, possibly the dispatcher.*"
  },
  {
    "q": "The dispatcher moves a worker from which state to which state?",
    "options": ["Blocked to ready", "Blocked to running", "Ready to running", "Running to ready"],
    "answer": 0,
    "explain": "An idle worker is blocked (*an idle (i.e., blocked) worker thread*). The dispatcher moves it *from blocked state to ready state*; the scheduler later gives it the CPU."
  },
  {
    "q": "What does a worker check first when it wakes up?",
    "options": ["Whether the request can be satisfied from the Web page cache", "Whether the disk is idle", "Whether the dispatcher has another request", "Whether another worker already holds the page"],
    "answer": 0,
    "explain": "Slide 8: it checks the Web page cache, *to which all threads have access*. Only if the page is not there does it read from the disk."
  },
  {
    "q": "Put the worker thread's loop body in order (slide 10b).",
    "type": "reorder",
    "lines": [
      "wait_for_work(&buf)",
      "look_for_page_in_cache(&buf, &page);",
      "if (page_not_in_cache(&page))",
      "    read_page_from_disk(&buf, &page);",
      "return_page(&page);"
    ],
    "explain": "Wait for the dispatcher's hand-over, look in the cache, read from disk only on a miss, then return the page. The slide prints `wait_for_work(&buf)` without a semicolon."
  },
  {
    "q": "In slide 3's word processor, what does the third thread do?",
    "options": ["Automatically saves the entire file to disk every few minutes", "Reformats the document in the background", "Interacts with the user", "Checks spelling as the user types"],
    "answer": 0,
    "explain": "The third thread handles disk backups *without interfering with the other two*, saving the file every few minutes against a program crash, system crash or power failure. One thread interacts with the user; one reformats."
  },
  {
    "q": "In slide 5's Process Explorer screenshot, how many threads does WINWORD.EXE have?",
    "type": "numeric",
    "answer": 35,
    "tolerance": 0,
    "explain": "Count: 35. Acrobat.exe shows 28 and javaw.exe 18 on slides 6 and 7."
  }
]
```

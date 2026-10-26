---
title: "Hybrid implementations: many-to-one, one-to-one, many-to-many"
minutes: 14
---

User-level threads switch fast but block together; kernel threads block independently but every thread operation is a system call. A hybrid implementation tries to keep the advantages of both.

## Hybrid implementations

Slide 34: *Various ways have been investigated to try to combine the advantages of user level threads with kernel-level threads.* *One way is use kernel-level threads and then multiplex user-level threads onto some or all of them.* The programmer decides how many kernel threads to use and how many user-level threads to put on each one. *This model gives the ultimate in flexibility.*

## What the kernel sees in a hybrid

The same slide continues: *With this approach, the kernel is aware of only the kernel-level threads and schedules those.* The user-level threads on top *are created, destroyed, and scheduled just like user-level threads in a process that runs on an operating system without multithreading capability.* *In this model, each kernel-level thread has some set of user-level threads that take turns using it.*

The slide-35 figure, **Multiplexing user-level threads onto kernel-level threads**, shows one process with two groups of user threads. Each group merges into one line that runs down into kernel space; the labels read "Multiple user threads on a kernel thread" and "Kernel thread". There are two kernel threads in all.

Tanenbaum describes only this multiplexing scheme. The three named relationships on slides 36 to 42 are the instructor's framing, not the book's.

## Three relationships between user and kernel threads

Slide 36 lists them in this order:

| Relationship | Slide 36 |
|---|---|
| Many to one | *many user threads to one kernel thread* |
| Many to many | *many user-level threads to many kernel-level threads* |
| One to one | *one user thread to one kernel thread* |

The detail slides take many-to-many last, as this lesson does.

## Many to one

Slide 37 draws four `t` circles in user space whose lines meet at one dot; a single line runs from the dot down to one `k` circle in kernel space. Slide 38:

- *Multiple user threads are mapped onto a single kernel thread.*
- *All user threads within a process share the same kernel thread.*
- *Managed by the user-level thread library, and the kernel remains unaware of individual user threads.*
- *Easy thread creation and management, it suffers from a lack of true concurrency since all threads are bound to a single kernel thread.*

This is the user-level package of [the previous lesson](#/comp4736-p4/user-vs-kernel-threads) seen from the kernel's side. The slides do not draw the conclusion, but it follows: when the one kernel thread blocks in a system call, every user thread on it waits.

## One to one

Slide 39 draws four `t` circles, each with its own vertical line to its own `k` circle. Slide 40:

- *Each user thread is mapped onto a separate kernel thread.*
- *Each user thread has a dedicated kernel thread for execution.*
- *Provides true concurrency as each user thread can be scheduled independently by the kernel.*
- *However, creating and managing many kernel threads can introduce overhead.*

By the same inference, this is the kernel-threads package from the kernel's side: one blocked thread leaves the others runnable, and every creation costs a system call.

## Many to many

Slide 41 draws four `t` circles whose lines meet at one dot in user space, and from the dot lines fan out to four `k` circles. Slide 42:

- *Combines aspects of the previous two models.*
- *Multiple user threads are mapped onto an equal or smaller number of kernel threads.*
- *It provides a balance between concurrency and thread creation overhead.*
- *The user-level thread library and the kernel work together to schedule and manage the execution of threads.*

The slide-35 multiplexing figure is one case of this shape: several user threads on two kernel threads.

### The three mappings with one thread blocking

The widget opens on many-to-many. Press the blocking-call button, then switch to many-to-one and one-to-one and press it again; count how many user threads stop each time.

```widget
thread-models
{ "model": "hybrid", "mapping": "many-to-many" }
```

```quiz
[
  {
    "q": "Match each relationship to its property on slides 38, 40 and 42.",
    "type": "match",
    "pairs": [
      ["Many to one", "Lack of true concurrency"],
      ["One to one", "True concurrency, but many kernel threads can introduce overhead"],
      ["Many to many", "A balance between concurrency and thread creation overhead"]
    ],
    "explain": "Many to one binds every thread to a single kernel thread, so there is no true concurrency. One to one gives each user thread its own kernel thread: true concurrency, with the overhead of many kernel threads. Many to many maps onto an equal or smaller number of kernel threads and sits between the two."
  },
  {
    "q": "In the many-to-one model, the kernel schedules each user thread.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 38: many-to-one is *managed by the user-level thread library, and the kernel remains unaware of individual user threads.* The kernel schedules only the one kernel thread."
  },
  {
    "q": "In a hybrid implementation, the kernel is aware of only the kernel-level threads and schedules those.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 34: *the kernel is aware of only the kernel-level threads and schedules those.* The user-level threads on each kernel thread are scheduled by the library and take turns using it."
  },
  {
    "q": "In the many-to-many model, multiple user threads are mapped onto how many kernel threads?",
    "options": [
      "An equal or smaller number",
      "Exactly one",
      "A strictly larger number",
      "One per user thread, no more and no fewer"
    ],
    "answer": 0,
    "explain": "Slide 42: *Multiple user threads are mapped onto an equal or smaller number of kernel threads.* Exactly one is many-to-one; one per user thread is one-to-one."
  },
  {
    "q": "Which model gives each user thread a dedicated kernel thread for execution?",
    "options": ["One to one", "Many to one", "Many to many", "A user-level threads package"],
    "answer": 0,
    "explain": "Slide 40: *Each user thread has a dedicated kernel thread for execution*, so each can be scheduled independently by the kernel. Many to one shares a single kernel thread; many to many shares an equal or smaller number."
  },
  {
    "q": "Slide 34 says the one-to-one model gives the ultimate in flexibility.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 34 uses *the ultimate in flexibility* for the hybrid scheme: kernel-level threads with user-level threads multiplexed onto some or all of them, the programmer choosing how many of each. One to one is slide 40's model."
  },
  {
    "q": "In the many-to-many model, the user-level thread library and the ___ work together to schedule and manage the execution of threads. Name the missing word.",
    "type": "text",
    "answer": ["kernel"],
    "explain": "Slide 42: *The user-level thread library and the kernel work together to schedule and manage the execution of threads.*"
  },
  {
    "q": "In the many-to-one model, what manages the user threads?",
    "options": [
      "The user-level thread library",
      "The kernel's thread table",
      "The kernel and the library together",
      "The kernel's process table"
    ],
    "answer": 0,
    "explain": "Slide 38: *Managed by the user-level thread library, and the kernel remains unaware of individual user threads.* The library and the kernel working together is many-to-many."
  },
  {
    "q": "How many kernel threads does the slide-35 figure, multiplexing user-level threads onto kernel-level threads, show?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "Two groups of user threads, each merged onto one kernel thread: two kernel threads in all, each with some set of user-level threads that take turns using it."
  }
]
```

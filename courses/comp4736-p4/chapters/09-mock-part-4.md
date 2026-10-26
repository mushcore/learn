---
title: Mock midterm, Part 4 (threads)
minutes: 25
---

Part 4 in the midterm's Part 1 format: short T/F and MCQ items, one fact each, with a few blanks and matches for the names and lists. Closed book, so answer every item before you open its explanation. The practice paper's three Part-4 questions are in the Midterm module; these are new wordings of the same 51 slides.

```quiz
[
  {
    "q": "A thread is also called a heavyweight process.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 1: *A thread is also called a lightweight process. Threads provide a way to improve application performance through parallelism.* It is lighter than a process because it brings only its own program counter, registers and stack, and shares everything else with the other threads of its process. See [what a thread is](#/comp4736-p4/what-is-a-thread)."
  },
  {
    "q": "Slide 1 defines a thread as a flow of execution through the process code, with its own what?",
    "options": ["Program counter, system registers and stack", "Address space, global variables and open files", "Child processes, pending alarms and signal handlers", "Thread table, run-time system and process table"],
    "answer": 0,
    "explain": "*A thread is a flow of execution through the process code, with its own program counter, system registers and stack.* Address space, global variables, open files, child processes, pending alarms and signal handlers are per-process items that every thread of the process shares. The thread table and run-time system belong to a user-level threads package; the process table is the kernel's."
  },
  {
    "type": "fill",
    "q": "Slide 2, motivation 2. Fill in the two numbers.",
    "code": "Creating a thread goes ___–___ times faster than creating a process.",
    "answer": ["10", "100"],
    "explain": "*Creating a thread goes 10–100 times faster than creating a process*, because threads are *lighter weight than processes* and so *easier and faster to create and destroy*."
  },
  {
    "q": "Threads give a large performance gain when all of them are CPU bound.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 2, motivation 3: *Threads yield no performance gain when all of them are CPU bound, but when there is substantial computing and also substantial I/O, having threads allows these activities to overlap, thus speeding up the application.* The gain comes from overlapping computing with I/O, or from real parallelism on multiple CPUs (motivation 4)."
  },
  {
    "q": "Which of these is not one of the three threads of the slide's word processor?",
    "options": ["A thread that reads incoming requests for work from the network", "A thread that interacts with the user", "A thread that handles reformatting in the background", "A thread that handles the disk backups"],
    "answer": 0,
    "explain": "Slides 3–4: one thread interacts with the user (the keyboard), one reformats the document in the background, and the third handles disk backups, *automatically saving the entire file to disk every few minutes*. Reading requests from the network is the Web server's dispatcher thread. See [thread usage](#/comp4736-p4/thread-usage)."
  },
  {
    "q": "In the multithreaded Web server, the dispatcher hands a request to an idle worker and wakes it up. Which state transition does that cause for the worker?",
    "options": ["Blocked to ready", "Ready to running", "Running to blocked", "Blocked to running"],
    "answer": 0,
    "explain": "Slide 8: *The dispatcher then wakes up the sleeping worker, moving it from blocked state to ready state.* The idle worker was blocked (the slide says *an idle (i.e., blocked) worker thread*). Ready is not running: the worker runs only when it is scheduled."
  },
  {
    "q": "When a worker thread of the Web server blocks on a disk read, the whole server process stops until the disk operation completes.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 8: *When the thread blocks on the disk operation, another thread is chosen to run, possibly the dispatcher.* Only that worker waits. A single-threaded server is the one that stops: *No parallelism, blocking system calls* (slide 11)."
  },
  {
    "type": "match",
    "q": "Match each way to construct a server (slide 11) to its characteristics.",
    "pairs": [
      ["Threads", "Parallelism, blocking system calls"],
      ["Single-threaded process", "No parallelism, blocking system calls"],
      ["Finite-state machine", "Parallelism, nonblocking system calls, interrupts"]
    ],
    "explain": "Threads keep the simple blocking calls and still get parallelism, because one blocked thread does not stop the others. A single-threaded process blocks the whole server on every call. A finite-state machine gets parallelism by never blocking: it uses nonblocking calls and interrupts."
  },
  {
    "q": "Slide 12 says the process model is based on two independent concepts. Which two?",
    "options": ["Resource grouping and execution (thread)", "Address space and stack", "User mode and kernel mode", "The thread table and the process table"],
    "answer": 0,
    "explain": "*The process model is based on two independent concepts: resource grouping and execution(thread).* Resource grouping is the address space plus open files, child processes, pending alarms, signal handlers and accounting information. The other concept is *a thread of execution, usually shortened to just thread.* See [the classical thread model](#/comp4736-p4/classical-thread-model)."
  },
  {
    "q": "Select every item that is private to each thread (a per-thread item).",
    "options": ["Program counter", "Registers", "Stack", "State", "Open files", "Global variables", "Address space"],
    "answer": [0, 1, 2, 3],
    "explain": "Slide 15's column of items *private to each thread* is program counter, registers, stack and state. Open files, global variables and address space are in slide 14's column, items *shared by all threads in a process*, together with child processes, pending alarms, signals and signal handlers, and accounting information."
  },
  {
    "q": "Each thread in a process gets its own copy of the process's global variables.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 13: *All threads have exactly the same address space, which means that they also share the same global variables.* Global variables are a per-process item. What each thread has of its own is its program counter, registers, stack and state."
  },
  {
    "q": "Why is there no protection between the threads of one process?",
    "options": ["It is impossible, and it should not be necessary", "The kernel already protects each thread's stack", "Each thread runs in its own address space", "The run-time system flushes the memory cache on every switch"],
    "answer": 0,
    "explain": "Slide 13: *There is no protection between threads because (1) it is impossible, and (2) it should not be necessary.* It is impossible because every thread can reach every address in the shared address space, so *one thread can read, write, or even wipe out another thread's stack*. The other three options describe protection the slides never give threads: the kernel does not guard stacks, the address space is shared, and cache flushing is about switching cost."
  },
  {
    "type": "fill",
    "q": "Slide 17 lists the thread states. Fill in the missing one (lowercase).",
    "code": "running, ___, ready, terminated",
    "answer": ["blocked"],
    "explain": "*A thread can be in any one of several states: running, blocked, ready, or terminated.* A blocked thread *is waiting for some event to unblock it*, such as keyboard input. *The transitions between thread states are the same as those between process states.*"
  },
  {
    "q": "Which Pthreads call waits for a specific thread to exit?",
    "options": ["pthread_join", "pthread_exit", "pthread_yield", "pthread_attr_destroy"],
    "answer": 0,
    "explain": "Slide 19: Pthread_join, *Wait for a specific thread to exit*. Pthread_exit terminates the calling thread, Pthread_yield releases the CPU to let another thread run, and Pthread_attr_destroy removes a thread's attribute structure. The instructor's demo calls `pthread_join(tid1, NULL)` and `pthread_join(tid2, NULL)` so that `main` does not return before both threads finish. See [Pthreads](#/comp4736-p4/pthreads)."
  },
  {
    "q": "What does pthread_yield do?",
    "options": ["Release the CPU to let another thread run", "Terminate the calling thread", "Create a new thread", "Create and initialize a thread's attribute structure"],
    "answer": 0,
    "explain": "Slide 19: Pthread_yield, *Release the CPU to let another thread run*. The other three are Pthread_exit, Pthread_create and Pthread_attr_init. With user-level threads a yield matters most: the run-time system gets the CPU back only when a thread gives it up."
  },
  {
    "q": "A program runs as process 3050 on Linux and creates four threads with pthread_create. How many entries does `ls /proc/3050/task/` list while all four threads are alive?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "explain": "One task per thread: the main thread, whose thread ID equals the PID (3050), plus the four created threads, 4 + 1 = 5. The slide-22 demo shows the same rule with two created threads: `ls /proc/1182/task/` prints 1182 1183 1184."
  },
  {
    "q": "According to the gettid man page on slide 23, how are thread IDs and process IDs related in a multithreaded process?",
    "options": ["All threads have the same PID, but each one has a unique TID", "Each thread has its own PID and its own TID", "Every thread's TID equals the PID", "Only the main thread has a TID"],
    "answer": 0,
    "explain": "*In a multithreaded process, all threads have the same PID, but each one has a unique TID.* In a single-threaded process *the thread ID is equal to the process ID*. Slide 23's output shows process 2271 with threads 2272 and 2273."
  },
  {
    "q": "With threads implemented entirely in user space, the kernel knows nothing about the threads.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 25: *The threads package is put entirely in user space. The kernel knows nothing about them. As far as the kernel is concerned, it is managing ordinary, single-threaded processes.* That is why such a package can run on an operating system that does not support threads. See [user versus kernel threads](#/comp4736-p4/user-vs-kernel-threads)."
  },
  {
    "q": "With user-level threads, what manages each process's private thread table?",
    "options": ["The run-time system", "The kernel", "The dispatcher thread", "The Java Virtual Machine"],
    "answer": 0,
    "explain": "Slide 26: *The thread table is managed by the run-time system*, the collection of procedures that manage threads (pthread_create, pthread_exit, pthread_join, pthread_yield). With kernel threads there is no thread table in each process; the kernel's thread table keeps track of all the threads in the system."
  },
  {
    "q": "Select the advantages slide 26 gives for user-level threads.",
    "options": ["No trap, no context switch and no cache flush, which makes thread scheduling very fast", "Each process can have its own customized scheduling algorithm", "They scale better, since kernel threads need table space and stack space in the kernel", "They do not require any new, nonblocking system calls", "On a page fault, another runnable thread of the process can run"],
    "answer": [0, 1, 2],
    "explain": "Slide 26's three advantages: *No trap is needed, no context switch is needed, the memory cache need not be flushed, and so on. This makes thread scheduling very fast*; *customized scheduling algorithm*; *They also scale better*. Needing no new nonblocking calls and running another thread on a page fault are kernel-thread advantages (slide 31). The practice paper's Q7 key marks thread switching as the operation with more overhead under user-level threads, the opposite of this slide; this item follows the slide, and the Midterm module covers what the key marks."
  },
  {
    "q": "A user-level thread reads from the keyboard before any key has been hit, and the run-time system lets it make the real blocking system call. What happens?",
    "options": ["All the threads of that process stop", "Only that thread blocks; the run-time system runs another thread", "The kernel runs another thread of the same process", "A clock interrupt lets the run-time system switch threads"],
    "answer": 0,
    "explain": "Slide 27: *Letting the thread actually make the system call is unacceptable, since this will stop all the threads.* The kernel sees one single-threaded process and blocks it. Only kernel threads let the kernel run another thread of the same process, and a user-level package gets no clock interrupts within the process."
  },
  {
    "q": "Within a single process using user-level threads, clock interrupts let the run-time system schedule the threads round-robin.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 27: *Within a single process, there are no clock interrupts, making it impossible to schedule processes round-robin fashion (taking turns). Unless a thread enters the run-time system of its own free will, the scheduler will never get a chance.* A running thread keeps the CPU until it voluntarily gives it up."
  },
  {
    "q": "With threads implemented in the kernel, what can the kernel do when a thread blocks?",
    "options": ["Run either another ready thread from the same process or a thread from a different process", "Only run another thread from the same process", "Only run a thread from a different process", "Nothing until the blocked thread's process is rescheduled by its run-time system"],
    "answer": 0,
    "explain": "Slide 30: *When a thread blocks, the kernel, at its option, can run either another thread from the same process (if one is ready) or a thread from a different process.* With user-level threads, the run-time system keeps running threads of its own process until the kernel takes the CPU away."
  },
  {
    "q": "What is the main disadvantage of kernel threads, according to slide 31?",
    "options": ["The cost of a system call is substantial", "A blocking system call stops all the threads", "There are no clock interrupts within a single process", "Multi-threaded applications cannot use multiple processors"],
    "answer": 0,
    "explain": "*Their main disadvantage is that the cost of a system call is substantial*, so if thread operations such as creation and termination are common, much more overhead is incurred. Stopping all threads on a blocking call and having no clock interrupts are the user-level problems; *cannot take advantage of multiprocessing* is the user-level row of slide 32's table."
  },
  {
    "q": "Slide 32 compares user-level and kernel-level threads. Which statement belongs to kernel-level threads?",
    "options": ["Specific to the operating system", "Generic and can run on any operating system", "Implementation is by a thread library at the user level", "Faster to create and manage"],
    "answer": 0,
    "explain": "Kernel-level column: *slower to create and manage*; the *Operating system supports creation of Kernel threads*; *specific to the operating system*; *Kernel routines themselves can be multithreaded*. The other three statements are the user-level column, which also says multi-threaded applications *cannot take advantage of multiprocessing*."
  },
  {
    "q": "In a hybrid implementation, which threads is the kernel aware of?",
    "options": ["Only the kernel-level threads", "Every user-level thread", "Only the user-level threads", "Neither; the run-time system schedules everything"],
    "answer": 0,
    "explain": "Slide 34: *the kernel is aware of only the kernel-level threads and schedules those.* User-level threads are multiplexed on top of them, and *each kernel-level thread has some set of user-level threads that take turns using it*. The programmer chooses how many kernel threads to use, which gives *the ultimate in flexibility*. See [hybrid models](#/comp4736-p4/hybrid-models)."
  },
  {
    "type": "match",
    "q": "Match each mapping model to the property the slides give it.",
    "pairs": [
      ["Many-to-one", "lack of true concurrency, since all threads are bound to a single kernel thread"],
      ["One-to-one", "true concurrency, but creating many kernel threads can introduce overhead"],
      ["Many-to-many", "an equal or smaller number of kernel threads, balancing concurrency and creation overhead"]
    ],
    "explain": "Many-to-one (slide 38) is managed by the user-level thread library and the kernel is unaware of individual user threads. One-to-one (slide 40) gives each user thread a dedicated kernel thread. Many-to-many (slide 42) *Combines aspects of the previous two models*; the library and the kernel work together."
  },
  {
    "q": "The many-to-one model provides true concurrency, because the kernel can schedule each user thread independently.",
    "type": "tf",
    "answer": false,
    "explain": "That describes one-to-one: *Provides true concurrency as each user thread can be scheduled independently by the kernel* (slide 40). Many-to-one *suffers from a lack of true concurrency since all threads are bound to a single kernel thread* (slide 38), and the kernel *remains unaware of individual user threads*."
  },
  {
    "q": "Who manages Java virtual threads, according to slide 49?",
    "options": ["The Java Virtual Machine", "The operating system kernel", "The C library's run-time system", "The dispatcher thread"],
    "answer": 0,
    "explain": "*Virtual threads are lightweight, user-space threads that are managed by the Java Virtual Machine (JVM) itself, rather than relying on native operating system threads.* Platform threads are the ones *managed by the operating system* (slide 48). See [Java threads](#/comp4736-p4/java-threads)."
  },
  {
    "type": "text",
    "q": "Java virtual threads are also known as which project's virtual threads?",
    "answer": ["Project Loom", "Loom"],
    "explain": "Slide 49: *Virtual threads (also known as \"Project Loom\" virtual threads) are a new concurrency mechanism introduced as an experimental feature in more recent versions of Java.* The slide-47 demo creates one with `Thread.ofVirtual().unstarted(r1)`, and `isVirtual()` prints true for it."
  },
  {
    "q": "A class implements the Runnable interface to create a Java thread. Which method does it override with the thread's work?",
    "options": ["run()", "start()", "main()", "join()"],
    "answer": 0,
    "explain": "`MyRunnable` overrides `run()` on slide 44, as `MyThread` does on slide 43. `start()` is called on the Thread object to launch the new thread, which then executes `run()`; `join()` waits for a thread to finish, and `main()` is the program's entry point."
  },
  {
    "q": "Why can a pop-up thread be created quickly?",
    "options": ["It is brand new, so it has no history (registers, stack) that must be restored", "It borrows the stack of the existing thread", "It is created without the kernel by a user-level library", "It is the dispatcher thread, which is already running"],
    "answer": 0,
    "explain": "Slide 50: *since they are brand new, they do not have any history—registers, stack, whatever—that must be restored. Each one starts out fresh and each one is identical to all the others. This makes it possible to create such a thread quickly.* See [pop-up threads](#/comp4736-p4/pop-up-threads)."
  },
  {
    "q": "A pop-up thread is created by the arrival of a message.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 50: *The arrival of a message causes the system to create a new thread to handle the message. Such a thread is called a pop-up thread.* The result is that *the latency between message arrival and the start of processing can be made very short*."
  }
]
```

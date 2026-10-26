# COMP 4736 Part 4 — Threads — facts transcribed from the instructor's deck

Source file: `D:/BCIT/COMP4736/lectures/Part_4_Threads.pdf` (51 pages, title slide "Thread"). Downloaded 2026-10-26.
Every slide carries the footer "Tanenbaum & Bo,Modern Operating Systems:4th ed., (c) 2013 Prentice-Hall, Inc. All rights reserved." (slides 5-7 and 46-47 have no footer).
Textbook: Tanenbaum & Bos, *Modern Operating Systems*, 4th ed. Reading per the course outline: Chapter 2 (Processes and Threads; this deck covers the threads part). The textbook was not opened for this transcription; anything attributed to it is from memory and labelled `[unverified, from memory of Tanenbaum]`.
Slide numbers are PDF pages; progressive builds are transcribed once.

## What is a thread (slide 1)
- Title "Thread". "**What is Thread?** A thread is a flow of execution through the process code, with its own **program counter, system registers and stack**."
- "A thread is also called a **lightweight process**. Threads provide a way to improve application performance through **parallelism**."

## Motivation for threads (slide 2)
- Title "Thread", subtitle "Motivation for Threads". Four numbered points:
  1. "The main reason for having threads is that in many applications, multiple activities are going on at once. Some of these may block from time to time. By decomposing such an application into multiple sequential threads that run in **quasi-parallel**, the programming model becomes simpler."
  2. "Since they are lighter weight than processes, they are easier and faster to create and destroy than processes. Creating a thread goes **10–100 times faster** than creating a process."
  3. "Threads yield **no performance gain when all of them are CPU bound**, but when there is substantial computing and also substantial I/O, having threads allows these activities to **overlap**, thus speeding up the application."
  4. "Threads are useful on systems with **multiple CPUs**, where real parallelism is possible."

## Thread usage — Example 1, the word processor (slides 3-7)
- Slide 3, "Example 1: One thread interacts with the user and the other handles reformatting in the background. The third thread can handle the disk backups without interfering with the other two e.g. automatically saving the entire file to disk every few minutes to protect the user against losing a day's work in the event of a program crash, system crash, or power failure."
- Slide 4 figure, caption "**A word processor with three threads.**" A box (the process, user space) above a box labelled **Kernel**. Inside the process a circle holding three wavy lines (three threads). Left: a **Keyboard** wired to one thread. Right: a **Disk** (cylinder) wired to another thread. Top: six columns of document text (the Gettysburg Address: "Four score and seven years ago, our fathers brought forth upon this continent a new nation…") bracketed and wired to the middle thread (the reformatting thread's document).
- Slides 5-7 (no title, no caption): three Windows Process Explorer "Properties" dialogs, **Threads** tab, showing that real applications are multithreaded:
  - Slide 5: **WINWORD.EXE:56456**, "Count: **35**" threads. Selected thread TID 61612, CPU 0.15, Cycles Delta 33,267,478, start address WINWORD.EXE+0x1000; other start addresses include clr.dll!CoUninitializeEE+0x135a0, clr.dll!_CorExeMain+0x90f0, mso20win32client.dll!Ordinal1029+0x192, ntdll.dll!TpIsTimerSet+0x40, CRYPT32.dll!CryptDecodeObject+0x30, rasman.dll!RasSignalMonitorThreadExit+0x160, combase.dll!RoRegisterActivationFactories+0x1f60. Details pane: Thread ID 61612; Start Time 10:25:21 PM 2021-01-23; State Wait:UserRequest; Base Priority 8; Kernel Time 0:00:01.000; Dynamic Priority 10; User Time 0:00:00.968; I/O Priority Normal; Context Switches 7,309; Memory Priority 5; Cycles 5,596,404,931; Ideal Processor 2. Buttons Stack, Module, Permissions, Kill, Suspend.
  - Slide 6: **Acrobat.exe:30996**, "Count: **28**". Selected TID 29412, CPU < 0.01, Cycles Delta 347,868, start Acrobat.exe+0x4630; others include Acrobat.dll!CTJPEGDecoderReadNextTile+0x45e0 / +0x28e0, shcore.dll!Ordinal186+0x30, ucrtbase.dll!_o____lc_collate_cp_func+0x10, Acrobat.dll!DllCanUnloadNow+0x118670. Details: Start Time 4:01:08 PM 2021-01-01; State Wait:WrUserRequest; Base Priority 8; Kernel Time 0:14:00.312; Dynamic Priority 10; User Time 0:42:23.750; Context Switches 13,569,940; Memory Priority 5; Cycles 10,719,948,966,693; Ideal Processor 1.
  - Slide 7: **javaw.exe:61556**, "Count: **18**". TIDs 54180 (CPU 0.01, 817,585), 62188 (< 0.01, 31,626), then 55724, 60316, 62020, 62088, 42060, 60420, 54236 (selected, javaw.exe+0x95ab), 60688 (javaw.exe+0x1487a), 61048, 42828, 62648, 57884, 53840, 57556, 58484, 6628; most start at ucrtbase.dll!_o____lc_collate_cp_func+0x10. Details: Thread ID 54236; Start Time 10:26:30 PM 2021-01-23; State Wait:UserRequest; Base Priority 8; Kernel Time 0:00:00.015; Dynamic Priority 8; User Time 0:00:00.015; Context Switches 27; Memory Priority 5; Cycles 60,891,156; Ideal Processor 0.

## Thread usage — Example 2, the multithreaded Web server (slides 8-10)
- Slide 8, "Example 2: The **dispatcher thread**, reads incoming requests for work from the network. After examining the request, it chooses an idle (i.e., blocked) **worker thread** and hands it the request. The dispatcher then wakes up the sleeping worker, moving it from **blocked state to ready state**."
- "When the worker wakes up, it checks to see if the request can be satisfied from the **Web page cache**, to which all threads have access. If not, it starts a read operation to get the page from the disk and blocks until the disk operation completes. When the thread blocks on the disk operation, another thread is chosen to run, possibly the dispatcher."
- Slide 9 figure, caption "**A multithreaded Web server.**" A box split into **User space** (top) and **Kernel space** (bottom, labelled **Kernel**). "Web server process" points to a circle in user space. Inside: "Dispatcher thread" (one wavy line, top left) with arrows fanning out to three wavy lines, one labelled "Worker thread"; below them a shaded box "Web page cache". A line labelled "**Network connection**" enters from below the kernel, passes through the kernel and reaches the dispatcher thread.
- Slide 10, caption "**A rough outline of the code for the previous figure . (a) Dispatcher thread. (b) Worker thread.**" (spacing before the period as on the slide)

(a) Dispatcher thread:
```c
while (TRUE) {
    get_next_request(&buf);
    handoff_work(&buf);
}
```
(b) Worker thread (the slide has no semicolon after `wait_for_work(&buf)`):
```c
while (TRUE) {
    wait_for_work(&buf)
    look_for_page_in_cache(&buf, &page);
    if (page_not_in_cache(&page))
        read_page_from_disk(&buf, &page);
    return_page(&page);
}
```

## Thread usage — three ways to construct a server (slide 11)
- Table, caption "**Three ways to construct a server.**"

| Model | Characteristics |
|---|---|
| Threads | Parallelism, blocking system calls |
| Single-threaded process | No parallelism, blocking system calls |
| Finite-state machine | Parallelism, nonblocking system calls, interrupts |

- The slide gives no prose about the single-threaded or finite-state-machine server. [unverified, from memory of Tanenbaum: the single-threaded server handles one request at a time and blocks on the disk; the finite-state machine uses nonblocking reads, records each request's state in a table and is driven by completion signals/interrupts.]

## The classical thread model — resource grouping and execution (slides 12-13)
- Slide 12: "The process model is based on **two independent concepts: resource grouping and execution(thread)**"
  - "A process has an **address space** containing program text and data, as well as other resources. These resources may include open files, child processes, pending alarms, signal handlers, accounting information, and more. By putting them together in the form of a process, they can be managed more easily."
  - "The other concept a process has is a **thread of execution**, usually shortened to just thread."
- Slide 13: "Different threads in a process are not as independent as different processes. All threads have **exactly the same address space**, which means that they also **share the same global variables**."
- "Since every thread can access every memory address within the process' address space, **one thread can read, write, or even wipe out another thread's stack**."
- "There is **no protection between threads** because (1) it is impossible, and (2) it should not be necessary"

## The classical thread model — shared and private items (slides 14-15)
- One table shown twice (build): slide 14 outlines the left column in red with the caption line "The first column lists some items **shared by all threads in a process**."; slide 15 outlines the right column in green with "The second one lists some items **private to each thread**."

| Per process items | Per thread items |
|---|---|
| Address space | Program counter |
| Global variables | Registers |
| Open files | Stack |
| Child processes | State |
| Pending alarms | |
| Signals and signal handlers | |
| Accounting information | |

## The classical thread model — each thread has its own stack (slide 16)
- Heading "**Each thread has its own stack**". Figure: a box with **Kernel** at the bottom; in user space a circle labelled "Process" holds three wavy lines labelled "Thread 1", "Thread 2", "Thread 3"; under each a small stack (stacked rectangles of different heights). Labels: "Thread 1's stack" (left arrow), "Thread 3's stack" (right arrow).

## The classical thread model — thread states (slide 17)
- "A thread can be in any one of several states: **running**, **blocked**, **ready**, or **terminated**."
  - "A running thread currently has the CPU and is active."
  - "A blocked thread is waiting for some event to unblock it. For example, when a thread performs a system call to read from the keyboard, it is blocked until input is typed. A thread can block waiting for some external event to happen or for some other thread to unblock it."
  - "A ready thread is scheduled to run and will as soon as its turn comes up."
- "The transitions between thread states are **the same as those between process states**." (No state diagram on this slide; terminated is listed but not described.)

## The classical thread model — multithreading (slide 18)
- "The term **multithreading** is also used to describe the situation of allowing multiple threads in the same process. In this case the CPU switches rapidly back and forth among the threads, providing the illusion that the threads are running in parallel, albeit on a slower CPU than the real one."
- Figure, caption "**(a) Three processes each with one thread. (b) One process with three threads.**" (a): a box split into User space / Kernel space (Kernel); three circles labelled Process 1, Process 2, Process 3, each with one wavy line; one label "Thread" with arrows to all three. (b): same box; one circle labelled "Process" with three wavy lines, three upward arrows, label "Thread"; Kernel below.

## POSIX Threads — Pthreads and its calls (slide 19)
- "The threads package : **Pthreads**" — "Supported by most UNIX systems"; "Defines **over 60 function calls**".
- Table, caption "**Some of the Pthreads function calls.**" (call names capitalised as on the slide)

| Thread call | Description |
|---|---|
| Pthread_create | Create a new thread |
| Pthread_exit | Terminate the calling thread |
| Pthread_join | Wait for a specific thread to exit |
| Pthread_yield | Release the CPU to let another thread run |
| Pthread_attr_init | Create and initialize a thread's attribute structure |
| Pthread_attr_destroy | Remove a thread's attribute structure |

## POSIX Threads — example program (slides 20-21)
- Caption on both: "**An example program using threads.**" Slide 20 shows the top of the listing, torn off after the `pthread_create` line; slide 21 repeats from `int status, i;` (torn top) to the end. Combined, verbatim:

```c
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

#define NUMBER_OF_THREADS     10

void *print_hello_world(void *tid)
{
     /* This function prints the thread's identifier and then exits. */
     printf("Hello World. Greetings from thread %d\n", tid);
     pthread_exit(NULL);
}

int main(int argc, char *argv[])
{
     /* The main program creates 10 threads and then exits. */
     pthread_t threads[NUMBER_OF_THREADS];
     int status, i;

     for(i=0; i < NUMBER_OF_THREADS; i++) {
          printf("Main here. Creating thread %d\n", i);
          status = pthread_create(&threads[i], NULL, print_hello_world, (void *)i);

          if (status != 0) {
               printf("Oops. pthread_create returned error code %d\n", status);
               exit(-1);
          }
     }
     exit(NULL);
}
```
- No output is shown for this program.

## POSIX Threads — instructor's demo, pthread_join and thread IDs (slides 22-23)
- Slide 22 (title only "POSIX Threads"): an editor screenshot of lines 19-29 of a `main.c` (lines 1-18, including `func`, are not shown):

```c
19  int main()
20  {
21      int thread_number_1 = 1;
22      int thread_number_2 = 2;
23      pthread_t tid1, tid2;
24      pthread_create(&tid1, NULL, func, &thread_number_1);
25      pthread_create(&tid2, NULL, func, &thread_number_2);
26      pthread_join(tid1, NULL);
27      pthread_join(tid2, NULL);
28      return 0;
29  }
```
- Left terminal (commands highlighted yellow, a red arrow at `./a.out`):
```
~$ gcc main.c -lpthread
~$ ./a.out
Thread #2
Thread #1
Thread #2
Thread #1
Thread #2
```
- Right terminal (`pstree` result and `ls` output boxed in red dashes):
```
~$
~$ pstree -p | grep a.out
tini(1)---sh(6)---node(7)-+-bash(439)---a.out(1182)-+-{a.out}(1183)
                          |                         `-{a.out}(1184)
~$ ls /proc/1182/task/
1182  1183  1184
~$
```
  (The process a.out has PID 1182; its two created threads appear as {a.out} 1183 and 1184; /proc/1182/task lists all three task IDs.)
- OPEN: `func` (lines 1-18) is not shown. The output has 5 lines with #2 printed first and #1/#2 interleaved; the slide does not explain the count or the order.
- Slide 23 (title only "POSIX Threads"): a terminal showing the man page **GETTID(2)**, "Linux Programmer's Manual":
  - NAME: "**gettid - get thread identification**" (highlighted)
  - SYNOPSIS: `#include <sys/types.h>` / `pid_t gettid(void);`
  - DESCRIPTION: "gettid() returns the caller's thread ID (TID). In a single-threaded process, the thread ID is equal to the process ID (PID, as returned by getpid(2)). In a multithreaded process, all threads have the same PID, but each one has a unique TID. For further details, see the discussion of CLONE_THREAD in clone(2)."
  - RETURN VALUE: "On success, returns the thread ID of the calling thread."
- Below it, output of a modified program (its code is not shown):
```
~$ ./a.out
Thread #1 ID :  2272
Thread #2 ID :  2273
Thread #1 ID :  2272
Thread #2 ID :  2273
```
```
~$ pstree -p | grep a.out
tini(1)---sh(6)---node(7)-+-bash(439)---a.out(2271)-+-{a.out}(2272)
                          |                         `-{a.out}(2273)
~$
~$
```
  (Process PID 2271; thread #1 TID 2272, thread #2 TID 2273.)

## Implementing threads — overview (slide 24)
- Three approaches: "Implementing Threads in User Space"; "Implementing Threads in the Kernel"; "Hybrid Implementations".

## Implementing threads in user space (slides 25-28)
- Slide 25: "The threads package is put **entirely in user space**. The **kernel knows nothing about them**. As far as the kernel is concerned, it is managing ordinary, single-threaded processes."
- "A user-level threads package can be implemented on an operating system that **does not support threads**. With this approach, threads are implemented by a **library**."
- "The threads run on top of a **run-time system**, which is a collection of procedures that manage threads e.g. *pthread_create*, *pthread_exit*, *pthread_join*, and *pthread_yield*."
- Slide 26: "When threads are managed in user space, each process needs its own private **thread table** to keep track of the threads in that process. This table is analogous to the kernel's process table, except that it keeps track only of the per-thread properties, such as each thread's program counter, stack pointer, registers, state, and so forth. The thread table is managed by the run-time system."
  - "No trap is needed, no context switch is needed, the memory cache need not be flushed, and so on. <u>This makes thread scheduling very fast</u>."
  - "User-level threads also have other advantages. They allow each process to have its own <u>customized scheduling algorithm</u>."
  - "<u>They also scale better</u>, since kernel threads invariably require some table space and stack space in the kernel, which can be a problem if there are a very large number of threads."
- Slide 27: "Despite their better performance, user-level threads packages have some major problems."
  - "The problem of how **blocking system calls** are implemented. Suppose that a thread reads from the keyboard before any keys have been hit. Letting the thread actually make the system call is unacceptable, since this will **stop all the threads**."
  - "Another problem with user-level thread packages is that if a thread starts running, no other thread in that process will ever run unless the first thread **voluntarily gives up the CPU**. Within a single process, there are **no clock interrupts**, making it impossible to schedule processes round-robin fashion (taking turns). Unless a thread enters the run-time system of its own free will, the scheduler will never get a chance."
- Slide 28 figure, title "Implementing Threads in User Space", caption "**A user-level threads package.**" A box split into User space / Kernel space. User space: two circles (processes), the left with three wavy lines, the right with four; at the bottom of each circle a bar with a small table at its right end. Labels: "Process" (arrow to left circle), "Thread" (arrow to a wavy line), "Run-time system" (arrow to the bar), "Thread table" (arrow to the small table inside the bar). Kernel space: "Kernel" and a small two-row table labelled "Process table".

## Implementing threads in the kernel (slides 29-33)
- Slide 29 (bullets):
  - "No run-time system is needed in each."
  - "No thread table in each process."
  - "The kernel has a <u>thread table</u> that keeps track of **all the threads in the system**."
  - "The information is the same as with user-level threads, but now kept in the kernel instead of in user space"
  - "<u>The kernel also maintains the traditional process table to keep track of processes</u>."
- Slide 30:
  - "When a thread blocks, the kernel, at its option, can run either another thread from the same process (if one is ready) or a thread from a different process."
  - "With user-level threads, the run-time system keeps running threads from its own process until the kernel takes the CPU away from it (or there are no ready threads left to run)."
- Slide 31: "Kernel threads **do not require any new, nonblocking system calls**. In addition, if one thread in a process causes a **page fault**, the kernel can easily check to see if the process has any other runnable threads, and if so, run one of them while waiting for the required page to be brought in from the disk."
  - "<u>Their main disadvantage is that the cost of a system call is substantial</u>, so if thread operations (creation, termination, etc.) a common, much more overhead will be incurred." (Slide reads "a common"; means "are common".)
- Slide 32 (title "Implementing Threads"; the text extraction misses this table), heading "**Difference between User-Level & Kernel-Level Thread**":

| S.N. | User-Level Threads | Kernel-Level Thread |
|---|---|---|
| 1 | User-level threads are faster to create and manage. | Kernel-level threads are slower to create and manage. |
| 2 | Implementation is by a thread library at the user level. | Operating system supports creation of Kernel threads. |
| 3 | User-level thread is generic and can run on any operating system. | Kernel-level thread is specific to the operating system. |
| 4 | Multi-threaded applications cannot take advantage of multiprocessing. | Kernel routines themselves can be multithreaded. |

- Slide 33 figure, title "Implementing Threads in the Kernel", caption "**A threads package managed by the kernel.**" A box: user space holds two circles (three and four wavy lines), labels "Process" and "Thread"; **no run-time system or thread table inside the processes**. The kernel strip holds "Kernel", a small two-row "Process table" and a taller many-row "Thread table".

## Hybrid implementations (slides 34-35)
- Slide 34: "Various ways have been investigated to try to combine the advantages of user level threads with kernel-level threads."
- "One way is use kernel-level threads and then **multiplex user-level threads onto some or all of them**. the programmer can determine how many kernel threads to use and how many user-level threads to multiplex on each one. This model gives the **ultimate in flexibility**."
- "With this approach, the kernel is **aware of only the kernel-level threads** and schedules those. Some of those threads may have multiple user-level threads multiplexed on top of them. These user-level threads are created, destroyed, and scheduled just like user-level threads in a process that runs on an operating system without multithreading capability. In this model, each kernel-level thread has some set of user-level threads that take turns using it."
- Slide 35 figure, caption "**Multiplexing user-level threads onto kernel-level threads.**" A box split into User space / Kernel space (Kernel). A circle in user space; inside, two groups of user threads (wavy lines) each merging into one wavy line that runs down into kernel space; label "**Multiple user threads on a kernel thread**" (two arrows, one to each group) and "**Kernel thread**" (arrow to a line in the kernel strip). Two kernel threads in total.

## Hybrid implementations — the three mapping models (slides 36-42)
- Slide 36 (list order as on the slide; descriptions in green):
  - "**Many to one relationship**" — "many user threads to one kernel thread"
  - "**Many to many relationship**" — "many user-level threads to many kernel-level threads"
  - "**One to one relationship**" — "one user thread to one kernel thread"
- Slide 37 diagram "Many to one relationship": a green **User space** box with four orange circles "t" (a dashed arc between the middle two, meaning "and more") whose lines meet at one black dot; one line from the dot down into a blue **Kernel space** box to a single grey circle "k".
- Slide 38, "Many to one relationship": "Multiple user threads are mapped onto a single kernel thread." "All user threads within a process share the same kernel thread." "Managed by the **user-level thread library**, and the kernel remains unaware of individual user threads." "Easy thread creation and management, it suffers from a **lack of true concurrency** since all threads are bound to a single kernel thread."
- Slide 39 diagram "One to one relationship": four "t" circles in user space (dashes between the third and fourth), each with its own vertical line to its own "k" circle in kernel space (dashes between the third and fourth).
- Slide 40, "One to one relationship": "Each user thread is mapped onto a separate kernel thread." "Each user thread has a dedicated kernel thread for execution." "Provides **true concurrency** as each user thread can be scheduled independently by the kernel." "However, creating and managing many kernel threads can introduce **overhead**."
- Slide 41 diagram "Many to many relationship": four "t" circles (dashed arc) whose lines meet at one dot in user space; from the dot, lines fan out to four "k" circles in kernel space (dashes between the second and third).
- Slide 42, "Many to many relationship": "Combines aspects of the previous two models." "Multiple user threads are mapped onto an **equal or smaller number** of kernel threads." "It provides a **balance between concurrency and thread creation overhead**." "The user-level thread library and the kernel **work together** to schedule and manage the execution of threads."
- Note: detailed slides run many-to-one, one-to-one, many-to-many; slide 36 lists many-to-many second.

## Java threads — platform threads, three ways to create (slides 43-45)
- Slide 43, "Java Threads / Platform Threads", "**Method 1 (Extending the Thread Class):**"
```java
class MyThread extends Thread{
        public void run(){
            String threadName = Thread.currentThread().getName();
            System.out.println(threadName);
        }
    }

public class Main {

    public static void main(String[] args) {

        MyThread t1 = new MyThread();
        t1.setName("T1");
        t1.start();
        System.out.println("Hello World");
        MyThread t2 = new MyThread();
        t2.setName("T2");
        t2.start();

    }
}
```
  Output shown:
```
Hello World
T1
T2
```
- Slide 44, "**Method 2 (Implementing the Runnable Interface):**"
```java
public class Main {
    static class MyRunnable implements Runnable {
        @Override
        public void run(){
            String threadName = Thread.currentThread().getName();
            System.out.println(threadName);
        }
    }
    public static void main(String[] args) {

        Thread t1 = new Thread( new MyRunnable());
        t1.start();
        System.out.println("Hello World");
        Thread t2 = new Thread( new MyRunnable());
        t2.start();
    }
}
```
  Output shown:
```
Hello World
Thread-0
Thread-1
```
  (No setName, so the default names Thread-0 and Thread-1 appear.)
- Slide 45, "**Method 3 (using Lambda Expressions):**"
```java
public class Main {

    public static void main(String[] args) {
    Runnable r = () -> {
            String threadName = Thread.currentThread().getName();
            System.out.println(threadName);
    };
        Thread t1 = new Thread(r, "T1");
        t1.start();
        System.out.println("Hello World");
        Thread t2 = new Thread(r, "T2");
        t2.start();
    }
}
```
  Output shown:
```
Hello World
T1
T2
```
- In all three outputs "Hello World" prints before T1 even though t1.start() is called first; the slides do not comment on this.

## Java threads — virtual threads, code (slides 46-47)
- Slide 46, "Java Threads / Virtual Threads" (no footer):
```java
public class VThread {
    public static void main(String args[]){
        String name = Thread.currentThread().getName();
        System.out.println(name + ", is virtual ?  " + Thread.currentThread().isVirtual());
        System.out.println(name + ", state ?  " + Thread.currentThread().getState());
        System.out.println(name + ", is alive ?  " + Thread.currentThread().isAlive());
    }
}
```
  Terminal:
```
asp@asp-VB:~/Desktop/javaExam$ javac --release 19 --enable-preview  VThread.java
Note: VThread.java uses preview features of Java SE 19.
Note: Recompile with -Xlint:preview for details.
asp@asp-VB:~/Desktop/javaExam$ java  --enable-preview  VThread
main, is virtual ?  false
main, state ?  RUNNABLE
main, is alive ?  true
asp@asp-VB:~/Desktop/javaExam$
```
- Slide 47, "Java Threads / Virtual Threads" (file tab `VThread.java`, no footer):
```java
public class VThread {
    public static void main(String args[]){
        Runnable r1 = () ->{
        String name = Thread.currentThread().getName();
        System.out.println(name + ", is virtual ?  " + Thread.currentThread().isVirtual());
        };

        Thread vT1 = Thread.ofVirtual().unstarted(r1);
        vT1.setName("VT");
        vT1.start();
        Thread T2 = new Thread(r1);
        T2.setName("T");
        T2.start();

        try{
            T2.join();
            vT1.join();
        }catch (InterruptedException e){
            e.printStackTrace();
        }
    }
}
```
  Terminal (commands highlighted):
```
asp@asp-VB:~/Desktop/javaExam$ javac --release 19 --enable-preview  VThread.java
Note: VThread.java uses preview features of Java SE 19.
Note: Recompile with -Xlint:preview for details.
asp@asp-VB:~/Desktop/javaExam$ java  --enable-preview  VThread
VT, is virtual ?  true
T, is virtual ?  false
asp@asp-VB:~/Desktop/javaExam$
```
  (The demo uses **Java SE 19 preview** features: `--release 19 --enable-preview`.)

## Java threads — platform threads vs virtual threads (slides 48-49)
- Slide 48, "Java Threads / **Platform Threads**" (items 1 and 3 in blue):
  1. "They are **managed by the operating system**."
  2. "Each thread has its own execution context, including its own stack, program counter, and registers."
  3. "Creating and managing threads can be **resource-intensive**, especially when a large number of threads are involved."
  4. "Threads are **heavyweight** in terms of resource usage, which can limit the scalability of applications that require a high degree of concurrency."
- Diagram: three groups of three green circles "**VT**" at the top; each group has one line down to a blue box "**Platform Thread**" in the band labelled **JVM**; a dashed horizontal line separates the JVM from the band labelled **OS Kernel**; each Platform Thread has one line down to a grey box "**Thread**". A hand-drawn green brace under the first group of three VTs with an arrow pointing to the first Platform Thread. (9 VTs on 3 platform threads on 3 kernel threads: VTs many-to-one onto a platform thread, platform thread one-to-one onto an OS thread.)
- Slide 49, "Java Threads / **Virtual Threads**" (items 1, 3, 5 in green):
  1. "Virtual threads (also known as "**Project Loom**" virtual threads) are a new concurrency mechanism introduced as an **experimental feature** in more recent versions of Java."
  2. "Virtual threads are **lightweight, user-space threads** that are **managed by the Java Virtual Machine (JVM)** itself, rather than relying on native operating system threads."
  3. "Virtual threads are much more **memory-efficient** compared to traditional threads, as they share resources such as stacks and registers."
  4. "They are designed to be easy to create and manage, allowing developers to create **large numbers of concurrent tasks** without incurring the overhead associated with creating many native threads."
  5. "Virtual threads are particularly suited for tasks with **high concurrency requirements**, such as handling network connections or processing asynchronous tasks."
  6. "While virtual threads provide a more lightweight concurrency model, they are still subject to the same programming models as traditional threads and **require proper synchronization** to ensure thread safety."

## Pop-up threads (slides 50-51)
- Slide 50: "The arrival of a message causes the system to create a new thread to handle the message. Such a thread is called a <u>**pop-up thread**</u>. The new thread is given the incoming message to process. The result of using pop-up threads is that the **latency between message arrival and the start of processing can be made very short**."
- "A key advantage of pop-up threads is that since <u>they are brand new, they do not have any history—registers, stack, whatever—that must be restored</u>. Each one starts out fresh and each one is identical to all the others. This makes it possible to create such a thread quickly."
- Slide 51 figure, caption "**Creation of a new thread when a message arrives. (a) Before the message arrives. (b) After the message arrives.**" Two machines (boxes) on a bar labelled "Network". (a): a circle labelled "Process" with one wavy line labelled "Existing thread". (b): the same circle with two wavy lines; "Incoming message" arrives along the network and up into the circle to a new wavy line labelled "**Pop-up thread created to handle incoming message**".

## Beyond the slides (label as such in the lessons)
- The slide 1 definition ("flow of execution through the process code … system registers and stack") and the slide 32 comparison table are not Tanenbaum's wording [unverified, from memory of Tanenbaum]; they read like a web tutorial. Teach them as the instructor's wording.
- The many-to-one / one-to-one / many-to-many terminology (slides 36-42) is not how Tanenbaum frames it; Tanenbaum describes only the hybrid multiplexing of slide 35 [unverified, from memory of Tanenbaum]. Java platform/virtual threads (slides 43-49) are not in Tanenbaum at all.
- Tanenbaum's §2.2 also covers scheduler activations, making single-threaded code multithreaded, and a POSIX threads discussion with thread attributes [unverified, from memory of Tanenbaum]; the deck skips scheduler activations and making code multithreaded. Do not present them as course material.
- The slide 20-21 program passes `i` cast to `(void *)` and prints `tid` with `%d`; this is the textbook listing as printed and is not portable C. Not discussed on the slides.

## Conflicts and open questions
- Slide 31 "if thread operations (creation, termination, etc.) a common" — typo for "are common".
- Slide 29 "No run-time system is needed in each." — the noun is missing (presumably "each process").
- Slide 19 capitalises the calls (Pthread_create …); slides 20-23 and 25 use lowercase `pthread_create`, `pthread_exit`, `pthread_join`, `pthread_yield`. Real POSIX names are lowercase.
- Slide 49 says virtual threads "share resources such as stacks and registers" and are an "experimental feature". Slides 46-47 use Java SE 19 preview. [unverified: virtual threads became final in Java 21 (JEP 444), and each virtual thread has its own stack stored on the heap, mounted on a carrier (platform) thread.] Teach the slide wording; flag the claim if a question asks about it.
- Slide 48 is titled "Platform Threads" but its diagram shows virtual threads (VT) mapped onto platform threads, and platform threads one-to-one onto OS kernel threads.
- Slide 36 lists many-to-many second; the detail slides show it last.
- OPEN: slide 22's `func` (lines 1-18) is not shown, so the 5-line output (Thread #2, #1, #2, #1, #2) cannot be explained from the slide. Slide 23's program that prints "Thread #N ID : <tid>" is also not shown (presumably it calls gettid()).
- OPEN: slide 17 lists the terminated state but does not describe it, and gives no state diagram; it defers to "the same as those between process states" (the process-state diagram is in an earlier part).
- The Java outputs (slides 43-45) show "Hello World" first; thread output order is not guaranteed and the slides do not say so.

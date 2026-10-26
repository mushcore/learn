---
title: The Pthreads calls and the two-thread demo
minutes: 16
---

Threads need a programming interface, and on UNIX it is the POSIX threads package. This lesson gives the slide's six calls, reads the textbook's ten-thread program, and follows the instructor's two-thread demo into `pstree` and `/proc`.

## Pthreads defines over 60 function calls; the slide lists six

Slide 19: *The threads package : Pthreads*. *Supported by most UNIX systems*. *Defines over 60 function calls*.

*Some of the Pthreads function calls.*

| Thread call | Description |
|---|---|
| Pthread_create | Create a new thread |
| Pthread_exit | Terminate the calling thread |
| Pthread_join | Wait for a specific thread to exit |
| Pthread_yield | Release the CPU to let another thread run |
| Pthread_attr_init | Create and initialize a thread's attribute structure |
| Pthread_attr_destroy | Remove a thread's attribute structure |

Slide 19 capitalises the names; the real C functions are lowercase, `pthread_create` and so on, as slides 20–23 write them.

Two pairs are easy to swap. `Pthread_exit` ends the thread that calls it; `Pthread_join` makes the caller wait for a different thread to end. `Pthread_attr_init` makes an attribute structure and `Pthread_attr_destroy` removes it.

## The textbook's program creates ten threads and exits

Slides 20–21, *An example program using threads.*

```cpp pin hello_threads.c
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

`pthread_create(&threads[i], NULL, print_hello_world, (void *)i)` takes four arguments: where to store the new thread's ID, the attributes (`NULL` for the defaults, instead of a structure from `Pthread_attr_init`), the function the thread starts in, and the one argument that function receives. It returns 0 on success, so `status != 0` is the error check.

What lines does this program print, and can you say in what order? Decide before you read on.

The slide shows no output. Main prints `Main here. Creating thread 0` up to `Creating thread 9`, and each thread that runs prints `Hello World. Greetings from thread` with its number, then calls `pthread_exit(NULL)`. The order is not fixed: after each create, the scheduler decides whether main or a new thread runs next. Main never waits for its threads, and `exit(NULL)` ends the whole process, every thread with it, so a thread that has not run yet may never print.

Passing `i` cast to `(void *)` and printing it with `%d` is the textbook's listing as printed; it is not portable C.

## The instructor's demo creates two threads and joins both

Slide 22 shows lines 19–29 of a `main.c`. Lines 1–18, the includes and the function `func` that both threads run, are off screen.

```cpp pin main.c
int main()
{
    int thread_number_1 = 1;
    int thread_number_2 = 2;
    pthread_t tid1, tid2;
    pthread_create(&tid1, NULL, func, &thread_number_1);
    pthread_create(&tid2, NULL, func, &thread_number_2);
    pthread_join(tid1, NULL);
    pthread_join(tid2, NULL);
    return 0;
}
```

Each `pthread_create` starts a thread in `func`, passing the address of its number: `&thread_number_1` for the first, `&thread_number_2` for the second. Then `pthread_join(tid1, NULL)` and `pthread_join(tid2, NULL)` hold main until both threads have exited, so `return 0` cannot end the process under them, unlike the ten-thread program's `exit(NULL)`.

While it runs, how many threads does this process have? Decide before you read on.

Three: main's own thread plus the two it created. The left terminal compiles and runs it:

```text
~$ gcc main.c -lpthread
~$ ./a.out
Thread #2
Thread #1
Thread #2
Thread #1
Thread #2
```

`-lpthread` links the Pthreads library. Thread #2 printed first although `tid1` was created first: once both exist, the scheduler picks which runs. The lines interleave, so the two threads were running at the same time. Slide 22 does not show `func`, so the count of five lines and their exact order cannot be explained from the slide. An in-class answer replaces this.

The right terminal looks at the running process:

```text
~$ pstree -p | grep a.out
tini(1)---sh(6)---node(7)-+-bash(439)---a.out(1182)-+-{a.out}(1183)
                          |                         `-{a.out}(1184)
~$ ls /proc/1182/task/
1182  1183  1184
```

The process `a.out` has PID 1182. `pstree` draws its two created threads in braces, `{a.out}(1183)` and `{a.out}(1184)`, as children of it. Under `/proc/1182/task/` Linux lists one entry per thread: 1182 for the main thread, 1183 and 1184 for the two created. To Linux each thread is a task under its process.

## gettid returns each thread's own ID

Slide 23 opens the manual page *GETTID(2)*: *gettid - get thread identification*, `pid_t gettid(void);`.

*gettid() returns the caller's thread ID (TID). In a single-threaded process, the thread ID is equal to the process ID (PID, as returned by getpid(2)). In a multithreaded process, all threads have the same PID, but each one has a unique TID.*

A modified program, its code not shown, prints each thread's TID. The process is 2271; using slide 22's pattern, predict the two TIDs before you read on.

```text
~$ ./a.out
Thread #1 ID :  2272
Thread #2 ID :  2273
Thread #1 ID :  2272
Thread #2 ID :  2273
~$ pstree -p | grep a.out
tini(1)---sh(6)---node(7)-+-bash(439)---a.out(2271)-+-{a.out}(2272)
                          |                         `-{a.out}(2273)
```

Thread #1 is 2272 and thread #2 is 2273, the numbers `pstree` shows in braces. A `getpid()` call in either thread would return 2271, the process's PID; only the main thread's TID equals it.

## Count the tasks and IDs of two new processes

Use slides 22–23: one task per thread under `/proc/<pid>/task/`, and the main thread's TID equals the PID.

```quiz
[
  {
    "q": "`pstree -p` shows `server(4100)` with `{server}(4101)`, `{server}(4102)` and `{server}(4103)` under it. How many entries does `ls /proc/4100/task/` list?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "One entry per thread: the main thread 4100 plus the three created threads 4101, 4102, 4103, so 1 + 3 = 4."
  },
  {
    "q": "In that `server` process, thread 4102 calls `getpid()`. What does it return?",
    "type": "numeric",
    "answer": 4100,
    "tolerance": 0,
    "explain": "*In a multithreaded process, all threads have the same PID*: 4100. Its `gettid()` would return 4102."
  },
  {
    "q": "In the same process, the main thread calls `gettid()`. What does it return?",
    "type": "numeric",
    "answer": 4100,
    "tolerance": 0,
    "explain": "The main thread's TID equals the PID, as 1182 does in `/proc/1182/task/` on slide 22. The created threads have their own TIDs, 4101 to 4103."
  },
  {
    "q": "A single-threaded process has PID 905. What does `gettid()` return in it?",
    "type": "numeric",
    "answer": 905,
    "tolerance": 0,
    "explain": "Slide 23: *In a single-threaded process, the thread ID is equal to the process ID.* So 905."
  }
]
```

```quiz
[
  {
    "q": "Match each Pthreads call to its description on slide 19.",
    "type": "match",
    "pairs": [
      ["Pthread_create", "Create a new thread"],
      ["Pthread_exit", "Terminate the calling thread"],
      ["Pthread_join", "Wait for a specific thread to exit"],
      ["Pthread_yield", "Release the CPU to let another thread run"],
      ["Pthread_attr_init", "Create and initialize a thread's attribute structure"],
      ["Pthread_attr_destroy", "Remove a thread's attribute structure"]
    ],
    "explain": "Create, exit and join manage a thread's life; yield gives up the CPU; attr_init and attr_destroy make and remove the attribute structure that can be passed to create instead of NULL."
  },
  {
    "q": "Complete the command that compiled the instructor's demo.",
    "type": "fill",
    "code": "gcc main.c ___",
    "answer": ["-lpthread"],
    "explain": "`gcc main.c -lpthread` links the Pthreads library into the program, then `./a.out` runs it."
  },
  {
    "q": "A process has created two threads with `pthread_create`, and all three threads are still running. How many entries does `/proc/<pid>/task/` list?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "The main thread plus the two created: slide 22 lists 1182, 1183 and 1184 under `/proc/1182/task/`."
  },
  {
    "q": "Which call makes the caller wait until a specific thread has exited?",
    "options": ["pthread_join", "pthread_exit", "pthread_yield", "pthread_attr_destroy"],
    "answer": 0,
    "explain": "`pthread_join`: *Wait for a specific thread to exit*. `pthread_exit` terminates the calling thread itself; `pthread_yield` only releases the CPU."
  },
  {
    "q": "According to slide 19, Pthreads defines over _______ function calls.",
    "type": "numeric",
    "answer": 60,
    "tolerance": 0,
    "explain": "*Supported by most UNIX systems*; *Defines over 60 function calls*. The slide's table lists six of them."
  },
  {
    "q": "In a multithreaded process, every thread has a unique PID.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 23: *all threads have the same PID, but each one has a unique TID.* `gettid()` returns the TID; `getpid()` returns the shared PID."
  },
  {
    "q": "In slide 22's demo, why does `main` call `pthread_join` twice before `return 0`?",
    "options": [
      "To wait until both created threads have exited before the process ends",
      "To create the two threads",
      "To give the CPU to the other thread",
      "To remove the threads' attribute structures"
    ],
    "answer": 0,
    "explain": "Each `pthread_join` waits for one specific thread to exit. Returning from `main` ends the process and every thread in it, so main waits for `tid1` and `tid2` first."
  },
  {
    "q": "In the textbook's ten-thread program, the order of the \"Main here\" and \"Hello World\" lines is fixed: main's ten lines always print first.",
    "type": "tf",
    "answer": false,
    "explain": "After each `pthread_create` the scheduler decides whether main or a new thread runs next, so the lines can interleave. Main also calls `exit` without joining, so some threads may never print."
  }
]
```

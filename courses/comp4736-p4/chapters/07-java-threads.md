---
title: Java platform threads three ways, and virtual threads
minutes: 16
---

Java gives every thread a `Thread` object. Slides 43 to 45 create ordinary platform threads in three ways; slides 46 to 49 add virtual threads, which the Java Virtual Machine manages itself. The listings are Java, shown read-only.

## Method 1: extend the Thread class

```cpp pin Main.java
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

`class MyThread extends Thread` overrides `public void run()`: that method is the code the new thread executes. `t1.setName("T1");` names the thread, and `t1.start();` creates the thread and returns at once. Inside `run()`, `Thread.currentThread().getName()` gives the name of whichever thread is executing it.

Write the lines this prints, in order, before you read on.

```text
Hello World
T1
T2
```

`Hello World` comes first even though `t1.start();` runs before it: `main` keeps going after `start()` returns, and reaches its `println` before T1 gets the CPU. The slides do not comment on the order; Java does not guarantee it, and another run may print T1 first.

## Method 2: implement the Runnable interface

```cpp pin Main.java
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

`MyRunnable implements Runnable` supplies the `run()` method, and `@Override` marks it as the interface's method. The thread itself is a plain `Thread`, built around the task with `new Thread( new MyRunnable())`. There is no `setName` call this time.

Write the lines this prints before you read on.

```text
Hello World
Thread-0
Thread-1
```

Without a name, Java numbers its threads in creation order: the first is `Thread-0`, the second `Thread-1`.

## Method 3: a lambda expression

```cpp pin Main.java
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

`Runnable r = () -> {` writes the task inline, with no named class. One `Runnable` serves both threads, and the constructor `new Thread(r, "T1")` takes the name as its second argument. The output is Method 1's: `Hello World`, `T1`, `T2`.

## Asking the main thread what it is

```cpp pin VThread.java
public class VThread {
    public static void main(String args[]){
        String name = Thread.currentThread().getName();
        System.out.println(name + ", is virtual ?  " + Thread.currentThread().isVirtual());
        System.out.println(name + ", state ?  " + Thread.currentThread().getState());
        System.out.println(name + ", is alive ?  " + Thread.currentThread().isAlive());
    }
}
```

The program asks three questions of the thread running `main`: `isVirtual()`, `getState()` and `isAlive()`. The slide compiles it with `javac --release 19 --enable-preview`, because virtual threads were a Java SE 19 preview feature. Write the three answers before you read on.

```text
main, is virtual ?  false
main, state ?  RUNNABLE
main, is alive ?  true
```

The thread that runs `main` is called `main`, it is a platform thread, and while it prints it is running.

## A virtual thread and a platform thread on one task

```cpp pin VThread.java
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

`Thread.ofVirtual().unstarted(r1)` builds a virtual thread that has not started yet; `new Thread(r1)` builds a platform thread around the same task. `T2.join();` and `vT1.join();` make `main` wait for both to finish. Write the two lines it prints before you read on.

```text
VT, is virtual ?  true
T, is virtual ?  false
```

## Platform threads (slide 48)

Slide 48, **Platform Threads**:

1. *They are managed by the operating system.*
2. *Each thread has its own execution context, including its own stack, program counter, and registers.*
3. *Creating and managing threads can be resource-intensive, especially when a large number of threads are involved.*
4. *Threads are heavyweight in terms of resource usage, which can limit the scalability of applications that require a high degree of concurrency.*

The slide's diagram, despite the title, shows virtual threads on top:

| Layer | Boxes in the diagram |
|---|---|
| Virtual threads (VT) | 9, in three groups of three |
| JVM: Platform Thread | 3, one per group |
| OS Kernel: Thread | 3, one per platform thread |

In the [hybrid lesson's](#/comp4736-p4/hybrid-models) terms, each group of virtual threads is many-to-one onto a platform thread, and each platform thread is one-to-one onto a kernel thread. The slide does not name the mappings.

## Virtual threads (slide 49)

Slide 49, **Virtual Threads**:

1. *Virtual threads (also known as "Project Loom" virtual threads) are a new concurrency mechanism introduced as an experimental feature in more recent versions of Java.*
2. *Virtual threads are lightweight, user-space threads that are managed by the Java Virtual Machine (JVM) itself, rather than relying on native operating system threads.*
3. *Virtual threads are much more memory-efficient compared to traditional threads, as they share resources such as stacks and registers.*
4. *They are designed to be easy to create and manage, allowing developers to create large numbers of concurrent tasks without incurring the overhead associated with creating many native threads.*
5. *Virtual threads are particularly suited for tasks with high concurrency requirements, such as handling network connections or processing asynchronous tasks.*
6. *While virtual threads provide a more lightweight concurrency model, they are still subject to the same programming models as traditional threads and require proper synchronization to ensure thread safety.*

The JDK documentation differs on two points (JEP 444, not the slides): virtual threads became a final feature in Java 21, and each virtual thread has its own stack, kept on the heap and mounted on a platform thread while it runs.

```quiz
[
  {
    "q": "Virtual threads are managed by the operating system kernel.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 49: virtual threads are *lightweight, user-space threads that are managed by the Java Virtual Machine (JVM) itself, rather than relying on native operating system threads.* Platform threads are the ones managed by the operating system (slide 48)."
  },
  {
    "q": "In Method 1, which method does `MyThread` override with the code the new thread runs?",
    "options": ["run()", "start()", "main()", "setName()"],
    "answer": 0,
    "explain": "`public void run()` holds the thread's code. `start()` is the call that creates the thread, which then executes `run()`; `setName()` only names it."
  },
  {
    "q": "Which call makes `t1` begin running on a new thread?",
    "options": ["t1.start()", "t1.run()", "t1.setName(\"T1\")", "new MyThread()"],
    "answer": 0,
    "explain": "All three methods call `t1.start()`. Constructing the object with `new` creates no running thread, and `setName` only labels it."
  },
  {
    "q": "Method 2's program gains a third thread, created and started after `t2` the same way: `Thread t3 = new Thread( new MyRunnable()); t3.start();`. What name does `t3` print?",
    "type": "text",
    "answer": ["Thread-2"],
    "explain": "Unnamed threads are numbered in creation order: `t1` printed Thread-0 and `t2` Thread-1 on slide 44, so `t3` prints Thread-2."
  },
  {
    "q": "On slide 46, what does `Thread.currentThread().isVirtual()` return when called from `main`?",
    "options": ["false", "true", "RUNNABLE", "main"],
    "answer": 0,
    "explain": "The output line is `main, is virtual ?  false`: the main thread is a platform thread. RUNNABLE is what `getState()` returned, and main is the thread's name."
  },
  {
    "q": "Virtual threads are also known by the name of the Java project that introduced them. Name the project.",
    "type": "text",
    "answer": ["Project Loom", "Loom"],
    "explain": "Slide 49: *Virtual threads (also known as \"Project Loom\" virtual threads)*."
  },
  {
    "q": "Platform threads are lightweight in terms of resource usage.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 48: *Threads are heavyweight in terms of resource usage*, and creating many of them *can be resource-intensive*. Lightweight is slide 49's word for virtual threads."
  },
  {
    "q": "In the slide-48 diagram, how many OS kernel threads carry the nine virtual threads?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "Nine VTs in three groups of three; each group sits on one Platform Thread in the JVM (3), and each Platform Thread on one kernel Thread (3)."
  },
  {
    "q": "Slide 49 says virtual threads are more memory-efficient because they share resources such as stacks and registers.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide's sentence, so it is true for this course. The JDK documentation (JEP 444, Java 21) says each virtual thread has its own stack, stored on the heap."
  },
  {
    "q": "Which expression on slide 47 creates the virtual thread?",
    "options": [
      "Thread.ofVirtual().unstarted(r1)",
      "new Thread(r1)",
      "Thread.currentThread()",
      "vT1.join()"
    ],
    "answer": 0,
    "explain": "`Thread.ofVirtual().unstarted(r1)` builds the virtual thread VT, which prints `is virtual ?  true`. `new Thread(r1)` builds the platform thread T; `currentThread()` returns the running thread; `join()` waits for one to finish."
  },
  {
    "q": "Virtual threads do not require synchronization, because the JVM manages them.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 49: they *are still subject to the same programming models as traditional threads and require proper synchronization to ensure thread safety.*"
  }
]
```

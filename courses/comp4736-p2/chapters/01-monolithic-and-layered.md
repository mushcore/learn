---
title: Monolithic systems and layered systems
minutes: 16
---

How the code of an operating system is split up decides what one bug can break and what each call costs. The first two structures answer that in opposite ways: one big program, or a stack of layers.

## Six structures on the agenda, five taught

Slide 1 lists the structures in order: *Monolithic systems*, *Layered systems*, *Microkernels*, *Client- server systems*, *Virtual machines* and *Exokernels*. Exokernels are printed in grey and no slide in the deck covers them, so this course does not teach them. The first two are here; [microkernels and the client-server model](#/comp4736-p2/microkernels-and-client-server) and [virtual machines](#/comp4736-p2/virtual-machines) follow.

## A monolithic OS is one program in kernel mode

Slide 2: *The operating system operates as a single program in kernel mode, organized as a collection of procedures combined into a single executable.*

The slide adds *loadable extensions (like device drivers or file systems) that are loaded on demand, such as shared libraries in Linux and DLLs in Windows.*

## Main program, service procedures, utility procedures

Slide 2 gives the basic structure in three parts, and slide 4 gives each one an analogy:

| Part | Slide 2 | Slide 4 analogy |
|---|---|---|
| 1. Main program | *A main program that invokes service procedures.* | the *"boss" of the system*; *it decides when and how to use different tools (services)* |
| 2. Service procedures | *A set of service procedures handling system calls.* | *tools in the toolbox*; *each one does a specific job, like reading a file, writing to disk, or managing memory* |
| 3. Utility procedures | *Utility procedures that support the service procedures.* | *helper tools*; *they don't interact with users directly* |

Slide 3 draws a three-level call graph: the main procedure (the figure's name for the main program) calls each of six service procedures, which call five utility procedures, several of them shared.

## What a single address space buys and costs

Slide 5: *all OS components (process management, file system, drivers, memory management) operate within a single address space and share the same privilege level.* Drivers included: they run in kernel mode with everything else.

| Gain | Cost |
|---|---|
| *high efficiency due to minimal communication overhead* | *complexity, making debugging and maintenance difficult* |
| | **Stability**: *an error in one component can crash the entire system* |
| | *lacks modularity*, so modifying or replacing one component is hard |

Slide 6 names the examples: *Linux, Microsoft Windows, etc.* Slide 7 draws Linux over the hardware (CPU, RAM, I/O) as, top to bottom, user programs and compilers, *System Libraries*, *Kernel* and *Kernel Modules*, Linux's loadable extensions.

## Linux loads a module into the running kernel

```cpp pin mod_example.c
#include <linux/module.h>   /* Needed by all modules */
#include <linux/kernel.h>   /* Needed for KERN_INFO */
#include <linux/init.h>     /* Needed for the macros */

MODULE_LICENSE("GPL");
MODULE_AUTHOR("COMP-4735");
MODULE_DESCRIPTION("HELLO WORLD");


static int __init hello_init(void){
    printk(KERN_INFO "Hello, world \n");
    return 0;
}

static void __exit hello_exit(void) {
    printk(KERN_INFO "Goodbye, world\n");
}


module_init(hello_init);
module_exit(hello_exit);
```

Slide 8's module has no `main`. `module_init(hello_init)` names the function the kernel calls when the module is inserted, and `module_exit(hello_exit)` the one it calls on removal. `printk` is the kernel's print: it writes to the kernel ring buffer, not to a terminal. The author string `MODULE_AUTHOR("COMP-4735")` is the slide's, with 4735, not 4736.

Building it produces `mod_example.ko`, the kernel object slide 9 points at. Slide 9's session inserts the module, reads the ring buffer, removes the module and reads it again. Write the lines each `sudo dmesg` prints before you read on.

```text
$ sudo insmod mod_example.ko
$ sudo dmesg
[ 4601.329914] Hello, world
$ sudo lsmod  | grep mod_example
mod_example            16384  0
$ sudo rmmod  mod_example
$ sudo dmesg
[ 4601.329914] Hello, world
[ 5046.866271] Goodbye, world
```

The first `dmesg` shows only the line `hello_init` printed during `insmod`. The second keeps that line and adds the one `hello_exit` printed during `rmmod`, because the ring buffer is a log, not a screen. The four commands, as slide 9 labels them:

| Command | Slide 9 |
|---|---|
| `insmod` | *Inserting a module into the Linux Kernel* |
| `dmesg` | *Printing the kernel ring buffer* |
| `lsmod` | *Showing the status of modules in the Linux Kernel* |
| `rmmod` | *Removing a module from the Linux Kernel* |

## THE system: six layers, each built on the one below

Slide 10: *The operating system is organized as a hierarchy of layers, each one constructed upon the one below it*, e.g. the THE system built at the *Technische Hogeschool Eindhoven* in the Netherlands by *E. W. Dijkstra (1968)* and his students.

| Layer | Function |
|---|---|
| 5 | *The operator* |
| 4 | *User programs* |
| 3 | *Input/output management* |
| 2 | *Operator-process communication* |
| 1 | *Memory and drum management* |
| 0 | *Processor allocation and multiprogramming* |

Layer 0, nearest the hardware, allocates the processor; the human operator is layer 5, at the top.

## Layering trades speed for modularity

Slide 11: *A layered system OS organizes functions into hierarchical layers, where each layer relies only on the one below it.*

| Advantages | Disadvantages |
|---|---|
| *Simplifies design and debugging by isolating functions.* | *Can introduce overhead due to strict layer interactions.* |
| *Enhances modularity and maintainability.* | *Less efficient than monolithic systems, as lower layers may slow down upper ones.* |

The two structures are mirror images. Monolithic buys efficiency with complexity; layered buys modularity with overhead.

## MS-DOS: four layers and two long arrows

Slide 12 stacks MS-DOS in four layers, top to bottom: *application program*, *resident system program*, *MS-DOS device drivers*, *ROM BIOS device drivers*. Each layer has an arrow to the one below, and two long arrows run straight down to the ROM BIOS device drivers: one from the resident system program and one from the application program.

:::quiz Strict layering is the definition, MS-DOS is the exception
Slide 11 defines a layered system as one where each layer relies only on the one below it. A statement that a layer in a layered OS can talk directly to any other layer is False, even though the MS-DOS figure draws arrows that skip layers.
:::

Slide 13 shows both routes in DOS DEBUG. Both print hex `61`, which the slide's ASCII table shows is `a` (decimal 97). The first goes through the MS-DOS device drivers with `int 21`:

```text
-a 100
0DB4:0100 mov ah, 02
0DB4:0102 mov dl, 61
0DB4:0104 int 21
0DB4:0106 int 20
0DB4:0108
-g 108
a
Program terminated normally (0000)
```

The second skips them and calls the ROM BIOS device drivers with `int 10`:

```text
0DB4:0100 mov ah, 0e
0DB4:0102 mov al, 61
0DB4:0104 int 10
0DB4:0106 int 20
0DB4:0108
-g 108
a
Program terminated normally (0000)
```

`int 20` ends both with *Program terminated normally (0000)*. Not on the slide, from DOS documentation: INT 21h with AH = 02 writes the character in DL; INT 10h with AH = 0Eh is BIOS teletype output of AL.

```quiz
[
  {
    "q": "In a monolithic operating system, device drivers run in user mode.",
    "type": "tf",
    "answer": false,
    "explain": "A monolithic OS operates as a single program in kernel mode. All components, drivers included, operate within a single address space and share the same privilege level."
  },
  {
    "q": "In the basic structure of a monolithic OS, which part handles system calls?",
    "options": ["The main program", "The service procedures", "The utility procedures", "The kernel modules"],
    "answer": 1,
    "explain": "A set of service procedures handles system calls (the tools in the toolbox). The main program invokes them, and the utility procedures support them."
  },
  {
    "q": "Fill in the three parts of a monolithic OS's basic structure.",
    "type": "fill",
    "code": "1 - A ___ program that invokes service procedures.\n2 - A set of ___ procedures handling system calls.\n3 - ___ procedures that support the service procedures.",
    "answer": ["main", "service", "utility"],
    "explain": "Main program (the boss), service procedures (the tools), utility procedures (the helper tools)."
  },
  {
    "q": "Which is a disadvantage of a monolithic OS on slide 5?",
    "options": [
      "An error in one component can crash the entire system",
      "Overhead due to strict layer interactions",
      "Higher overhead from communication between user-space services and the kernel",
      "Lower layers may slow down upper ones"
    ],
    "answer": 0,
    "explain": "Stability is a concern in a monolithic OS because everything shares one address space and one privilege level. Strict layer overhead and slow lower layers are the layered system's costs; user-space communication overhead is the microkernel's."
  },
  {
    "q": "Which command prints the kernel ring buffer, where a module's printk output appears?",
    "type": "text",
    "answer": ["dmesg", "sudo dmesg"],
    "explain": "dmesg prints the kernel ring buffer. insmod inserts a module, lsmod shows the status of modules, rmmod removes one."
  },
  {
    "q": "After `sudo rmmod mod_example`, which function of the slide's module has just run?",
    "options": ["hello_exit", "hello_init", "module_init"],
    "answer": 0,
    "explain": "module_exit(hello_exit) registers hello_exit as the function called when the module is removed, so dmesg then also shows Goodbye, world. hello_init ran at insmod; module_init is the macro that registered it, not a function the kernel calls on removal."
  },
  {
    "q": "Put the layers of Dijkstra's THE system in order, from layer 0 at the bottom to layer 5 at the top.",
    "type": "reorder",
    "lines": [
      "Processor allocation and multiprogramming",
      "Memory and drum management",
      "Operator-process communication",
      "Input/output management",
      "User programs",
      "The operator"
    ],
    "explain": "0 processor allocation and multiprogramming, 1 memory and drum management, 2 operator-process communication, 3 input/output management, 4 user programs, 5 the operator. Each layer is constructed upon the one below it."
  },
  {
    "q": "A layered system is more efficient than a monolithic system.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 11 lists it as a disadvantage: layered systems are less efficient than monolithic systems, as lower layers may slow down upper ones, and strict layer interactions add overhead."
  },
  {
    "q": "In the MS-DOS figure, which layers does the application program have an arrow to?",
    "options": ["Resident system program", "MS-DOS device drivers", "ROM BIOS device drivers", "Operator-process communication"],
    "answer": [0, 2],
    "explain": "The application program has a thick arrow to the resident system program, the layer below it, and a long arrow straight down to the ROM BIOS device drivers, skipping the MS-DOS device drivers. Operator-process communication is layer 2 of THE, not an MS-DOS layer."
  },
  {
    "q": "Match each system to its structure as the slides describe it.",
    "type": "match",
    "pairs": [
      ["THE system", "Layered: Dijkstra and students, Eindhoven, 1968"],
      ["MS-DOS", "Layered: application program down to ROM BIOS device drivers"],
      ["Linux", "Monolithic: kernel plus loadable kernel modules"],
      ["Microsoft Windows", "Monolithic: loadable extensions as DLLs"]
    ],
    "explain": "Slide 6 names Linux and Microsoft Windows as monolithic; slide 2 names shared libraries in Linux and DLLs in Windows as loadable extensions. THE (slide 10) and MS-DOS (slide 12) are the layered examples."
  }
]
```

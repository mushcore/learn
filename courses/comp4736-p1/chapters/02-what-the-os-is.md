---
title: Software, extended machine, resource manager
minutes: 14
---

The operating system is Level 3 of the stack, but a level number does not say what it does for a program or for the machine. The slides answer with three descriptions, two pictures and one table.

## An operating system is three things

Slide 12, *Operating System*:

1. *A software*
2. *An extended machine*
3. *A resource manager that provides many abstraction layers*

The first says what it is made of: programs, not circuits. The second says what it offers the programs above it. The third says what it does with the hardware below it.

## Reading a disk without knowing about tracks

Slide 12's example: *Reading and writing on hard drive require many steps and is not easy task without using the operating system.* The figure is a stack of platters on a spindle, with one ring labelled **track**. Under the heading *OS-abstraction* the slide shows the call a program uses instead:

```c
ssize_t    read(int fd, void *buf, size_t count);
```

The program names an open file, a buffer to fill and a byte count. It never names a platter, a track or a sector; the operating system turns this one call into the many steps the hardware needs.

## The car's controls are the interface

Slide 13: *Think of the car's controls as the OS interface between the driver and the complicated hardware.*

| The driver uses (simple controls) | The car interface hides (complex systems) |
|---|---|
| Steering wheel | Engine |
| Accelerator / brake | Transmission |
| Gear selector | Fuel system |
| Dashboard | Braking system, electronics, sensors |

Slide 14 lists what the driver does not normally need to know, such as how fuel is injected or how the transmission changes gears internally. A program stands where the driver stands, and the OS is the dashboard and pedals.

## What happens behind a double-click

Slide 15: *You double-click a text file, and it opens in a text editor*. The user sees three things: mouse, double-click, text appears. Behind them the slide lists sixteen steps:

| # | Step (slide 15) | Done by |
|---|---|---|
| 1 | Mouse movement | user |
| 2 | Mouse hardware sends data | hardware |
| 3 | OS mouse driver receives it | OS |
| 4 | OS updates mouse position | OS |
| 5 | You click the text-file icon | user |
| 6 | OS GUI detects the click | OS |
| 7 | OS determines which file you selected | OS |
| 8 | OS identifies the file name and location | OS |
| 9 | OS determines which application should open it | OS |
| 10 | OS starts/activates the text editor | OS |
| 11 | Text editor asks OS to open the file | editor |
| 12 | OS file system finds the file's disk blocks | OS |
| 13 | OS storage driver communicates with the HDD/SSD | OS |
| 14 | Storage device transfers data to RAM | hardware |
| 15 | OS gives the data to the text editor | OS |
| 16 | Text editor displays the text | editor |

Ten of the sixteen steps are the operating system's. The editor does two: it asks for the file (step 11) and shows it (step 16). It never talks to the disk.

## The extended machine

Slide 20, *The Operating System as an Extended Machine*, draws three layers: application programs on top, the operating system in the middle, hardware at the bottom. Between hardware and OS is the **ugly interface** (drawn as ugly faces and a toad); between OS and applications is the **beautiful interface** (a queen, a castle, a peacock, a flower). The underlined caption:

*Operating systems turn ugly hardware into beautiful abstractions*

That is the extended machine: the programs above see a machine with files and calls like `read`, which is easier to use than the real one.

:::quiz Hardware, not software
The practice paper swaps one word: "Operating systems turn ugly software into beautiful abstractions" is False. The ugly side is the hardware.
:::

## Three views of the resource manager

Slide 21, *The Operating System as a Resource Manager*:

- **Top down view** – *Provide abstractions to application programs.*
- **Bottom up view** – *Manage pieces of complex system.*
- **Alternative view** – *Provide orderly, controlled allocation of resources.*

Top down looks from the programs, so it repeats the extended machine. Bottom up looks from the hardware's many pieces. The alternative view is the one about allocation: who gets which resource, and when.

## Sharing in time and in space

Slide 22: *Resource management includes sharing resources in two different ways: in time and in space.* Its example: *Multiprogramming (each program gets a fair amount of time and memory space for execution) and sharing printer.*

Sharing in time means users take turns with the whole resource. Sharing in space means each user gets a part of it at once. Slide 23 sorts four resources:

| Resource | Sharing (slide 23) |
|---|---|
| CPU | Time sharing |
| RAM | Space sharing |
| Disk | Space sharing |
| Printer | Time sharing |

A printer cannot print half of two jobs on one page, so jobs take turns. Memory can hold several programs at once, each in its own part. Multiprogramming uses both ways: programs take turns on the CPU while each keeps its own space in RAM.

```quiz
[
  {
    "q": "Operating systems turn ugly software into beautiful abstractions.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 20's sentence is: Operating systems turn ugly **hardware** into beautiful abstractions. The ugly interface sits between the hardware and the OS; the beautiful one between the OS and the application programs."
  },
  {
    "q": "Which view of the OS as a resource manager is \"provide orderly, controlled allocation of resources\"?",
    "options": ["Alternative view", "Top down view", "Bottom up view", "Extended machine view"],
    "answer": 0,
    "explain": "Slide 21: top down view, provide abstractions to application programs; bottom up view, manage pieces of complex system; alternative view, provide orderly, controlled allocation of resources. The extended machine is slide 20's separate description, not one of the three views."
  },
  {
    "q": "Match each resource-manager view to its wording on slide 21.",
    "type": "match",
    "pairs": [
      ["Top down view", "Provide abstractions to application programs"],
      ["Bottom up view", "Manage pieces of complex system"],
      ["Alternative view", "Provide orderly, controlled allocation of resources"]
    ],
    "explain": "Top down starts from the programs (abstractions), bottom up from the hardware (pieces), and the alternative view is about allocating resources."
  },
  {
    "q": "Slide 12: an operating system is a software, a resource manager that provides many abstraction layers, and an ________.",
    "type": "text",
    "answer": ["extended machine", "an extended machine"],
    "explain": "The three: 1. A software 2. An extended machine 3. A resource manager that provides many abstraction layers."
  },
  {
    "q": "Which of these describes an operating system?",
    "options": ["A software", "An extended machine", "A resource manager", "All of these"],
    "answer": 3,
    "explain": "Slide 12 lists all three as what an operating system is. A question with an \"all of the mentioned\" option and three true descriptions wants that option."
  },
  {
    "q": "Which resources does slide 23 list as shared in space?",
    "options": ["RAM", "Disk", "CPU", "Printer"],
    "answer": [0, 1],
    "explain": "RAM and Disk are space sharing: each program holds part of the resource at the same time. CPU and Printer are time sharing: programs take turns with the whole resource."
  },
  {
    "q": "The printer is shared in space.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 23 puts the printer under time sharing, with the CPU. Jobs take turns on it; they do not each get part of it."
  },
  {
    "q": "In slide 22's multiprogramming example, each program gets a fair amount of ________ for execution.",
    "options": ["time and memory space", "time only", "memory space only", "disk space and printer time"],
    "answer": 0,
    "explain": "Slide 22: multiprogramming (each program gets a fair amount of time and memory space for execution). It shares the CPU in time and the memory in space."
  },
  {
    "q": "To read a file with the OS abstraction `read(int fd, void *buf, size_t count)`, a program must name the disk track the data is on.",
    "type": "tf",
    "answer": false,
    "explain": "The call names only an open file, a buffer and a byte count. Finding the track and the many steps of reading the hard drive are the operating system's job; that is why slide 12 calls it an abstraction."
  },
  {
    "q": "Put these steps of slide 15's double-click in order.",
    "type": "reorder",
    "lines": [
      "OS GUI detects the click",
      "OS determines which application should open it",
      "Text editor asks OS to open the file",
      "OS file system finds the file's disk blocks",
      "Storage device transfers data to RAM",
      "Text editor displays the text"
    ],
    "explain": "The OS finds out what was clicked and which program opens it, starts the editor, the editor asks the OS for the file, the OS finds the blocks and drives the storage device, the data reaches RAM, and only then does the editor show the text."
  }
]
```

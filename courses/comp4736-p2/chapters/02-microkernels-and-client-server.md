---
title: Microkernels and the client-server model
minutes: 14
---

In a [monolithic system](#/comp4736-p2/monolithic-and-layered) one bad driver can take the whole machine down, because every component runs in kernel mode. A microkernel moves almost everything out of kernel mode so that a failure stays where it started.

## Only the microkernel runs in kernel mode

Slide 14: *The basic idea is to achieve high reliability by splitting the operating system up into small, well-defined modules, only one of which—the microkernel—runs in kernel mode and the rest run as relatively powerless ordinary user processes.*

"Relatively powerless" is the point. A user process cannot touch the hardware or another process's memory directly, so a driver written as a user process can crash without corrupting the kernel. The cost is that it must ask the kernel for anything privileged.

The slide's example is MINIX 3, captioned *Simplified structure of the MINIX 3 system*. Its four bands, bottom to top:

| Band | Mode | What it holds |
|---|---|---|
| Microkernel | kernel | *Microkernel handles interrupts, processes, scheduling, IPC*, with two circles, Clock and Sys |
| Drivers | user | Disk, TTY, Netw, Print, Other |
| Servers | user | FS, Proc., Reinc., Other |
| User progs. | user | Shell, Make, Other |

A brace marks the top three bands *User mode*, and a label *Process* points at a circle in each of them: every driver, every server and every user program is a separate process. The disk driver and the file system (FS) both sit above the line, in user mode. Clock and Sys are the only pieces drawn inside the kernel band.

## What stays in the kernel and what moves out

Slide 15: *A microkernel OS minimizes the core kernel's responsibilities, running essential services (like inter-process communication and basic scheduling) within the kernel, while other services (like drivers and file systems) run in user space.*

So the kernel keeps inter-process communication (IPC) and basic scheduling; drivers and file systems move to user space. IPC has to stay, because once the file system is a process, a program that wants to read a file must send that process a message, and the kernel carries it.

| | Microkernel (slide 15) |
|---|---|
| Advantage | *Modularity: Easier to add, modify, or replace components without affecting the core kernel.* |
| Advantage | *Stability: A failure in a user-space service is less likely to crash the entire system.* |
| Disadvantage | *Performance: Potentially higher overhead due to increased communication between user-space services and the microkernel.* |
| Disadvantage | *Complexity: More complex design and implementation compared to monolithic kernels.* |

Set beside the monolithic slide, the two lists swap places:

| | Monolithic (slide 5) | Microkernel (slide 15) |
|---|---|---|
| In kernel mode | everything: process management, file system, drivers, memory management | IPC and basic scheduling |
| One component fails | *can crash the entire system* | *less likely to crash the entire system* |
| Speed | *high efficiency due to minimal communication overhead* | *potentially higher overhead* from messages to and from the kernel |
| Changing a component | *lacks modularity* | easier to add, modify or replace |

Note the slide's hedges: a user-space failure is *less likely* to crash the system, and the overhead is *potentially* higher. Neither is absolute.

## Minix, HelenOS, Horizon, L4, Zircon

Slide 16: *Examples: Minix, HelenOS, Horizon, The L4 microkernel family, Zircon (Fuchsia OS).* The screenshot beside the list is a MINIX 3 desktop with a control panel, a process listing and a terminal, so a microkernel system can still have an ordinary graphical desktop. Linux and Windows are the monolithic examples; none of the five here is.

## Servers provide a service, clients use it

Slide 17 states the client-server model in four bullets:

- *Servers provide some service.*
- *Clients use these services.*
- *Communication between clients and servers is often by message passing.*
- *Client-server model is an abstraction that can be used for a single machine or for a network of machines.*

The slide's figure, *The client-server model over a network*, draws four machines on one line labelled Network. Each machine is a service on top of its own Kernel: a Client, a File server, a Process server and a Terminal server. A curved arrow, *Message from client to server*, leaves the client, goes down through its kernel, across the network and up into the file server.

The single-machine case is the MINIX 3 picture again: FS and Proc. in the servers band are servers, user programs are clients, and the microkernel's IPC carries the messages between them.

```quiz
[
  {
    "q": "In a microkernel OS, which services run inside the kernel according to slide 15?",
    "options": [
      "Inter-process communication and basic scheduling",
      "Device drivers and file systems",
      "The file server and the process server",
      "Process management, file system, drivers and memory management"
    ],
    "answer": 0,
    "explain": "A microkernel minimizes the core kernel's responsibilities: essential services like inter-process communication and basic scheduling stay in the kernel, while drivers and file systems run in user space. All four components together in kernel mode is the monolithic system of slide 5."
  },
  {
    "q": "In a microkernel OS, a crash in a device driver brings down the whole system.",
    "type": "tf",
    "answer": false,
    "explain": "Drivers run in user space as relatively powerless ordinary user processes, so a failure in a user-space service is less likely to crash the entire system. Crashing everything is the monolithic system's stability problem."
  },
  {
    "q": "In the client-server model, clients and servers communicate by ______ passing.",
    "type": "text",
    "answer": ["message", "messages"],
    "explain": "Communication between clients and servers is often by message passing; the figure's arrow is labelled Message from client to server."
  },
  {
    "q": "In a microkernel-based OS, the file system is part of the kernel.",
    "type": "tf",
    "answer": false,
    "explain": "File systems are among the other services that run in user space. In MINIX 3 the FS circle is in the servers band, above the kernel."
  },
  {
    "q": "Which is a disadvantage of a microkernel on slide 15?",
    "options": [
      "Higher overhead due to increased communication between user-space services and the microkernel",
      "An error in one component can crash the entire system",
      "Lacks modularity, so components are hard to replace",
      "Lower layers may slow down upper ones"
    ],
    "answer": 0,
    "explain": "The microkernel's disadvantages are performance (more communication with the kernel) and complexity. Crashing everything and lacking modularity are monolithic costs; lower layers slowing upper ones is the layered system's."
  },
  {
    "q": "Which of these is not one of slide 16's microkernel examples?",
    "options": ["Linux", "HelenOS", "Zircon (Fuchsia OS)", "The L4 microkernel family"],
    "answer": 0,
    "explain": "Slide 16 lists Minix, HelenOS, Horizon, the L4 microkernel family and Zircon (Fuchsia OS). Linux is slide 6's monolithic example."
  },
  {
    "q": "What does the MINIX 3 microkernel handle, according to the slide 14 figure?",
    "options": [
      "Interrupts, processes, scheduling, IPC",
      "Disk, TTY, network and printer drivers",
      "The file system and the reincarnation server",
      "The shell and make"
    ],
    "answer": 0,
    "explain": "The kernel band reads Microkernel handles interrupts, processes, scheduling, IPC. Drivers, servers (FS, Proc., Reinc.) and user programs (Shell, Make) are all user-mode processes."
  },
  {
    "q": "The client-server model only applies to a network of machines.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 17: the client-server model is an abstraction that can be used for a single machine or for a network of machines."
  },
  {
    "q": "A microkernel keeps IPC in the kernel. What does IPC stand for?",
    "type": "text",
    "answer": ["inter-process communication", "interprocess communication", "inter process communication"],
    "explain": "IPC is inter-process communication. It stays in the kernel because drivers and servers are separate user processes, and every request between them is a message the kernel carries."
  }
]
```

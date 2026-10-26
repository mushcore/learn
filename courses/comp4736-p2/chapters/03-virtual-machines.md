---
title: Virtual machines and hypervisors
minutes: 15
---

A company that runs its mail server, Web server and FTP server on separate computers pays for three machines so that one crash cannot take down the other two. Virtual machines give the same isolation on one computer, and a hypervisor is the layer that makes it work.

## Virtualization and Web hosting

Slide 18: *Virtualization allows you to run two or more operating systems using only one machine.*

- *Before Virtualization: Many companies have traditionally run their mail servers, Web servers, FTP servers, and other servers on separate computers.*
- *After Virtualization: They can run many servers on the same machine without having a crash of one server bring down the rest.*

The slide's example is Web hosting:

| Hosting | Virtualization | What the customer gets |
|---|---|---|
| Shared hosting | no | *a login account on a Web server, but no control over the server software* |
| Dedicated hosting | no | *you have your own machine, very flexible but not cost effective* |
| A virtual machine | yes | *Each customer can have different fully controllable operating systems on the same machine.* |

Virtualization is the middle ground: the control of dedicated hosting at a share of one machine's cost.

## VirtualBox gives each guest its own hardware

Slides 19 to 22 are VirtualBox Manager screenshots of one physical machine holding three guests, each with its own memory, disk and devices:

| VM | Operating system | Base memory | Disk |
|---|---|---|---|
| winXP | Windows XP (32-bit) | 1199 MB | winXP.vdi, 8.00 GB |
| Ubuntu18.04.3 | Ubuntu (64-bit) | 4024 MB | Ubuntu18.04.3.vdi, 10.00 GB |
| Dos | DOS | 64 MB | Dos.vdi, 200.00 MB |

Slide 22 opens winXP's settings: the memory slider runs from 4 MB to 8192 MB, the processor slider from 1 CPU to 4 CPUs, and the execution cap from 1% to 100%. Each guest believes it owns that hardware.

## VM/370 gives each user a virtual 370

Slide 23 is headed *Control Program/Cambridge Monitor System (CP/CMS)*, and its figure is *The structure of VM/370 with CMS*. Bottom to top:

| Level | Figure label | Role |
|---|---|---|
| 1 | *370 Bare hardware* | the real IBM 370 |
| 2 | *VM/370*, annotated *(VM-Virtualization Layer)* | runs on the bare hardware and creates the copies |
| 3 | *Virtual 370s*, one *CMS* in each | three copies of the 370, each running its own CMS |
| 4 | *App* above a CMS | the user's application |

The instructor's annotation reads *CMS is a single user OS*. Each user gets a whole virtual machine with a simple one-user OS on it, and VM/370 does the sharing underneath.

The figure has two traps, one per level. *System calls here* goes from the application down into CMS, marked *Trap here*: a system call is handled by the guest OS. *I/O instructions here* goes from CMS down into VM/370, marked *Trap here*: when CMS tries to do real I/O, the virtualization layer catches it and does it on the real hardware.

The slide expands CMS as *Cambridge Monitor System*. Tanenbaum's book calls it the Conversational Monitor System; the letters stand for the same system.

## Three hypervisor figures: type 1, pure type 2, practical type 2

Slide 24's figure is captioned *(a) A type 1 hypervisor. (b) A pure type 2 hypervisor. (c) A practical type 2 hypervisor.*, with the red line *Hypervisor (virtual machine monitor)* under it: the two names are one thing.

| Figure | Bottom layer | On top of it | Guests |
|---|---|---|---|
| (a) type 1 | *Type 1 hypervisor* (on the hardware) | Windows (Excel, Word), Linux (Mplayer, Apollon), more | guest OSes side by side |
| (b) pure type 2 | *Host operating system* | a *Machine simulator* beside *Host OS process* circles | a *Guest OS* with *Guest OS process* circles |
| (c) practical type 2 | *Host operating system* with a small *Kernel module* in it | a *Type 2 hypervisor* beside host processes | a *Guest OS* with guest processes |

The slide gives no prose definition, so read it off the figure. A type 1 hypervisor is the lowest software on the machine; guest operating systems run directly on it. A type 2 hypervisor is a program running on an ordinary host operating system, next to the host's other processes. In (c) the type 2 hypervisor adds a kernel module to the host OS, which (b)'s machine simulator does not have.

The practice paper's answer for the main disadvantage of a type 2 hypervisor is "higher overhead due to the host operating system": every guest request passes through the host OS as well.

## ESXi and VirtualBox

Slide 25, *Example: ESXi (Elastic Sky X Integrated)*:

1. *Type-1 hypervisor*
2. *Runs directly on system hardware*
3. *No need for an operating system (OS)*

The screenshot is ESXi's host web client: you manage an ESXi machine from a browser, because there is no desktop OS on it.

Slide 26 is a Windows 10 desktop with three labels. *Type 2 hypervisor(VirtualBox)* points at the VirtualBox icon and Manager window. *Host OS (Windows 10)* points at the Windows taskbar. *Guest OS (Tiny Core Linux)* points at a Tiny Core window running inside VirtualBox. Its terminal runs `pstree -p` and shows its own `init(1)` at the root: the guest has a complete process tree of its own, unaware of Windows.

## Is the CoCalc terminal real or virtual

Slide 27 asks *Real or Virtual machine(type 1 or 2)?* over a CoCalc browser terminal, where typing `ESXi (Elastic Sky X Integrated):` into bash gives a syntax error. The slide prints no answer; an in-class answer replaces this one. The source notes' answer, unverified: it is virtual. CoCalc is a cloud service, so the shell runs on a cloud virtual machine, not on your own hardware, and the syntax error shows it is bash, not an ESXi console. Cloud providers usually run guests on hypervisors that sit directly on the server hardware, which would make it type 1, but nothing in the screenshot confirms that.

```quiz
[
  {
    "q": "A type 2 hypervisor runs directly on the hardware.",
    "type": "tf",
    "answer": false,
    "explain": "A type 2 hypervisor runs on a host operating system, as VirtualBox runs on Windows 10. Running directly on system hardware with no need for an OS is the type 1 hypervisor, such as ESXi."
  },
  {
    "q": "Match each name from the slides to its description.",
    "type": "match",
    "pairs": [
      ["ESXi", "Type 1 hypervisor; runs directly on system hardware"],
      ["VirtualBox", "Type 2 hypervisor on a Windows 10 host"],
      ["CMS", "A single user OS, one in each virtual 370"],
      ["VM/370", "The virtualization layer on the 370 bare hardware"],
      ["Tiny Core Linux", "The guest OS in the slide 26 screenshot"]
    ],
    "explain": "ESXi is slide 25's type 1 example; VirtualBox is slide 26's type 2 example with host Windows 10 and guest Tiny Core Linux. In VM/370 with CMS, VM/370 runs on the bare hardware and each virtual 370 runs CMS, a single user OS."
  },
  {
    "q": "What does virtualization allow, in slide 18's words?",
    "options": [
      "Running two or more operating systems using only one machine",
      "Running one operating system across several machines",
      "Running every OS service as a user process",
      "Running servers on separate computers so that one crash cannot bring down the rest"
    ],
    "answer": 0,
    "explain": "Virtualization allows you to run two or more operating systems using only one machine. Separate computers per server is the before-virtualization picture; OS services as user processes is the microkernel."
  },
  {
    "q": "A hypervisor is also called a virtual machine ______.",
    "type": "text",
    "answer": ["monitor", "monitor (VMM)", "VMM"],
    "explain": "Slide 24: Hypervisor (virtual machine monitor)."
  },
  {
    "q": "In VM/370 with CMS, where does a system call made by an application trap?",
    "options": ["To CMS", "To VM/370", "To the 370 bare hardware", "To the host operating system"],
    "answer": 0,
    "explain": "System calls trap to CMS, the guest OS in that virtual 370. It is CMS's I/O instructions that trap to VM/370, which runs on the bare hardware. VM/370 has no host operating system."
  },
  {
    "q": "CMS is a multi-user operating system.",
    "type": "tf",
    "answer": false,
    "explain": "The slide's annotation says CMS is a single user OS. Each user gets a virtual 370 running CMS; VM/370 does the sharing."
  },
  {
    "q": "Which hosting gives a login account on a Web server but no control over the server software?",
    "options": ["Shared hosting", "Dedicated hosting", "A virtual machine per customer", "A type 1 hypervisor"],
    "answer": 0,
    "explain": "Shared hosting (no virtualization) is a login account with no control over the server software. Dedicated hosting is your own machine, very flexible but not cost effective. With virtualization, each customer has a fully controllable OS on the same machine."
  },
  {
    "q": "In slide 24's practical type 2 hypervisor, what does the host operating system contain that the pure type 2 figure lacks?",
    "options": ["A kernel module", "A machine simulator", "A guest OS", "A type 1 hypervisor"],
    "answer": 0,
    "explain": "Figure (c) draws a small kernel module inside the host OS under the type 2 hypervisor. Figure (b) runs a machine simulator on the host OS instead, with no kernel module. Both carry a guest OS on top."
  },
  {
    "q": "What is the main disadvantage of a type 2 hypervisor?",
    "options": [
      "Higher overhead due to the host operating system",
      "It needs no operating system underneath",
      "A crash of one guest brings down the other guests",
      "It cannot run more than one guest OS"
    ],
    "answer": 0,
    "explain": "A type 2 hypervisor runs on a host OS, so guest requests also pass through the host: higher overhead. Needing no OS is the type 1 hypervisor's property, and isolating guests from each other's crashes is the point of virtualization for both types."
  },
  {
    "q": "After virtualization, a crash of one server running on a shared machine brings down the rest.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 18: after virtualization, companies can run many servers on the same machine without having a crash of one server bring down the rest."
  }
]
```

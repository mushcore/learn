# COMP 4736 Part 2 — "OS Structures and Clocks": facts and worked answers transcribed from the instructor's deck

Source file: `D:/BCIT/COMP4736/lectures/Part_2_OS_Structures_and_Clocks.pdf` (40 pages; text extract `Part_2_OS_Structures_and_Clocks.txt`, page renders `Part_2_OS_Structures_and_Clocks_pages/p001.png`-`p040.png`). Downloaded 2026-10-26.
Textbook: Tanenbaum & Bos, *Modern Operating Systems*, 4th ed. (Pearson/Prentice-Hall, 2013). Course outline reading: **Chapter 1 and 5** (OS structures are Ch 1; clocks are Ch 5, I/O). The textbook was not opened for this transcription; anything attributed to it is from memory and labelled `[unverified, from memory of Tanenbaum]`.
Every slide carries the footer "Tanenbaum & Bo, Modern Operating Systems:4th ed., (c) 2013 Prentice-Hall, Inc. All rights reserved." (sic, "Bo"; slides 28-40 write "Tanenbaum & Bo,Modern"). Slides 19-22, 26 and 27 have no footer.
Slide numbers are PDF pages; progressive builds are transcribed once.

## Agenda: Operating System Structure (slide 1)
- Title "**Operating System Structure**", numbered list:
  1. Monolithic systems
  2. Layered systems
  3. Microkernels
  4. Client- server systems (sic, space after the hyphen)
  5. Virtual machines
  6. Exokernels — **printed in grey** (de-emphasised). No slide in the deck covers exokernels; the deck jumps from virtual machines (slide 27) to clocks (slide 28).

## Monolithic systems — definition and basic structure (slide 2)
- "The operating system operates as a **single program in kernel mode**, organized as a **collection of procedures combined into a single executable**."
- "Besides the core OS, many systems support **loadable extensions** (like device drivers or file systems) that are loaded on demand, such as **shared libraries in Linux and DLLs in Windows**."
- "The basic structure of an OS consists of:
  1 - A **main program** that invokes service procedures.
  2 - A set of **service procedures** handling system calls.
  3 - **Utility procedures** that support the service procedures."

## Monolithic systems — simple structuring model figure (slide 3)
- Caption: "**A simple structuring model for a monolithic system.**"
- Figure: three tiers separated by two horizontal dashed lines, labels on the right:
  - Top tier, label "**Main procedure**": one large circle.
  - Middle tier, label "**Service procedures**": six circles in a row. The main procedure has a line to every one of the six.
  - Bottom tier, label "**Utility procedures**": five smaller circles.
  - Lines from service procedures to utility procedures cross each other: most service procedures connect to one or two utility procedures, several utility procedures are shared by more than one service procedure, and the third service procedure from the left has no line down. (Exact edge-by-edge wiring is not load-bearing; the point is a three-level call graph: main → services → shared utilities.) Note the figure says "Main procedure" where slide 2 says "main program".

## Monolithic systems — the three parts explained (slide 4)
- "**1. Main Program**
  - This is like the "boss" of the system.
  - It decides when and how to use different tools (services).
  - For example, when you open a file, the main program figures out what needs to be done."
- "**2. Service Procedures**
  - These are like tools in the toolbox.
  - Each one does a specific job, like reading a file, writing to disk, or managing memory.
  - When a program asks the OS to do something (like a system call), these service procedures handle it."
- "**3. Utility Procedures**
  - These are helper tools.
  - They don't interact with users directly but support the service procedures.
  - For example, they might help with copying data or managing low-level details."

## Monolithic systems — properties (slide 5)
- "In a monolithic system, all OS components (process management, file system, drivers, memory management) operate **within a single address space** and **share the same privilege level**."
- "This design offers **high efficiency due to minimal communication overhead** but comes with **complexity, making debugging and maintenance difficult**."
- "**Stability** is a concern, as an error in one component can crash the entire system."
- "Additionally, the system **lacks modularity**, complicating the process of modifying or replacing individual components."

## Monolithic systems — examples (slide 6)
- "Examples : Linux, Microsoft Windows, etc."

## Monolithic systems — Linux Operating System figure (slide 7)
- Title "Monolithic Systems", subtitle "**Linux Operating System**".
- Figure: a large rounded box "**Linux OS**" containing, top to bottom:
  - a row of four boxes: "System Software" | "User process" | "User Utility" | "Compilers"
  - a full-width bar "**System Libraries**"
  - a full-width bar "**Kernel**"
  - a full-width bar "**Kernel Modules**"
- A thick black arrow points down from the Linux OS box to a box "**Hardware**" containing three boxes "CPU" | "RAM" | "I/O".

## Monolithic systems — a loadable kernel module, code (slide 8)
- No caption; a C listing (a Linux "hello world" kernel module, the loadable-extension example). Verbatim:

```c
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
- Note: the author string is "COMP-4735" (not 4736). "Hello, world \n" has a space before `\n`; "Goodbye, world\n" does not.

## Monolithic systems — building and loading the module, terminal screenshots (slide 9)
- Top screenshot, a directory listing after building:
```
-rwxrwx--- 1 asp asp   476 Jan 15 13:46 mod_example.c
-rw-rw-r-- 1 asp asp 62264 Jan 15 14:09 mod_example.ko
-rw-rw-r-- 1 asp asp    56 Jan 15 14:09 mod_example.mod
-rw-rw-r-- 1 asp asp   855 Jan 15 14:09 mod_example.mod.c
-rw-rw-r-- 1 asp asp 50064 Jan 15 14:09 mod_example.mod.o
-rw-rw-r-- 1 asp asp 13544 Jan 15 14:09 mod_example.o
-rw-rw-r-- 1 asp asp    56 Jan 15 14:09 modules.order
-rw-rw-r-- 1 asp asp     0 Jan 15 14:09 Module.symvers
```
  The `mod_example.ko` line is highlighted with a red hand-drawn arrow (the built kernel object).
- Bottom screenshot, shell session in `asp@asp-VB:~/Desktop/Codes/Lab_kernel/notes$`, with yellow annotations:
```
$ sudo insmod mod_example.ko          <- "Inserting a module into the Linux Kernel"
$ sudo dmesg                          <- "Printing the kernel ring buffer"
[ 4601.329914] Hello, world
$ sudo lsmod  | grep mod_example      <- "Showing the status of modules in the Linux Kernel"
mod_example            16384  0
$ sudo rmmod  mod_example             <- "Removing a module from the Linux Kernel"
$ sudo dmesg
[ 4601.329914] Hello, world
[ 5046.866271] Goodbye, world
$ cat /var/log/kern.log | grep world
Jan 15 13:30:16 asp-VB kernel: [ 1633.639733] Hello, world
Jan 15 13:30:41 asp-VB kernel: [ 1658.968341] Goodbye, world
```
- Commands and their slide meanings: **insmod** = inserting a module into the Linux kernel; **dmesg** = printing the kernel ring buffer; **lsmod** = showing the status of modules in the Linux kernel; **rmmod** = removing a module from the Linux kernel.

## Layered systems — THE system (slide 10)
- "The operating system is organized as a **hierarchy of layers, each one constructed upon the one below it**, e.g. the **THE system** built at the **Technische Hogeschool Eindhoven** in the Netherlands by **E. W. Dijkstra (1968)** and his students." ("Technische Hogeschool Eindhoven" is a hyperlink on the slide.)
- Table, caption "**Structure of the THE operating system.**":

| Layer | Function |
|---|---|
| 5 | The operator |
| 4 | User programs |
| 3 | Input/output management |
| 2 | Operator-process communication |
| 1 | Memory and drum management |
| 0 | Processor allocation and multiprogramming |

## Layered systems — definition, advantages, disadvantages (slide 11)
- "A layered system OS organizes functions into hierarchical layers, where **each layer relies only on the one below it**."
- **Advantages:** "Simplifies design and debugging by isolating functions." "Enhances modularity and maintainability."
- **Disadvantages:** "Can introduce overhead due to strict layer interactions." "Less efficient than monolithic systems, as lower layers may slow down upper ones."

## Layered systems — MS-DOS figure (slide 12)
- Title "Layered Systems", subtitle "**MS - DOS**".
- Figure, four boxes stacked, each narrower than the one above except the bottom:
  1. "**application program**" (top)
  2. "**resident system program**"
  3. "**MS-DOS device drivers**"
  4. "**ROM BIOS device drivers**" (bottom)
- Thick arrows: application program → resident system program → MS-DOS device drivers → ROM BIOS device drivers (each layer to the one below). Two extra long arrows on the right: one from **resident system program straight down to ROM BIOS device drivers** and one from **application program straight down to ROM BIOS device drivers**. (So in MS-DOS, upper layers can bypass the layers in between and reach the BIOS directly.)

## Layered systems — MS-DOS, DEBUG assembly demo (slide 13)
- The slide-12 figure is repeated small on the left. A blue arrow from "MS-DOS device drivers" points to a DOS DEBUG screenshot; a blue arrow from "ROM BIOS device drivers" points to a second screenshot.
- Top-right inset, an ASCII table excerpt (columns Dec Hx Oct Html Chr):

| Dec | Hx | Oct | Html | Chr |
|---|---|---|---|---|
| 96 | 60 | 140 | &#96; | ` |
| 97 | **61** | 141 | &#97; | **a** |
| 98 | 62 | 142 | &#98; | b |
| 99 | 63 | 143 | &#99; | c |
| 100 | 64 | 144 | &#100; | d |

  Row 97 is highlighted yellow on "61" and "a": hex 61 = 'a'.
- Screenshot 1 (via **MS-DOS** device drivers, DOS interrupt 21h):
```
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
- Screenshot 2 (via **ROM BIOS** device drivers, BIOS interrupt 10h):
```
0DB4:0100 mov ah, 0e
0DB4:0102 mov al, 61
0DB4:0104 int 10
0DB4:0106 int 20
0DB4:0108
-g 108
a
Program terminated normally (0000)
```
- Hand-drawn annotations in both: a yellow arrow from the `61` operand to the printed "a"; a green arrow from `int 20` to "Program terminated normally (0000)".
- [unverified, from memory of standard DOS/BIOS documentation, not on the slide] INT 21h function AH=02 writes the character in DL to standard output; INT 10h function AH=0Eh is BIOS teletype output of the character in AL; INT 20h terminates the program. The slide only shows the code and its output.

## Microkernels — idea and MINIX 3 figure (slide 14)
- "The basic idea is to **achieve high reliability by splitting the operating system up into small, well-defined modules, only one of which—the microkernel—runs in kernel mode** and the rest run as **relatively powerless ordinary user processes**."
- Figure, caption "**Simplified structure of the MINIX 3 system.**": four horizontal bands, bottom to top:
  - Bottom, dark grey (kernel mode): text "**Microkernel handles interrupts, processes, scheduling, IPC**", with two circles "**Clock**" and "**Sys**".
  - Band labelled "**Drivers**": circles "Disk", "TTY", "Netw", "Print", "...", "Other".
  - Band labelled "**Servers**": circles "FS", "Proc.", "Reinc.", "...", "Other".
  - Top band labelled "**User progs.**": circles "Shell", "Make", "...", "Other".
  - A brace on the left spans the top three bands: "**User mode**".
  - A label "**Process**" at top right with arrows to the "Other" circle in each of the three user-mode bands (each circle is a process).

## Microkernels — definition, advantages, disadvantages (slide 15)
- "A microkernel OS **minimizes the core kernel's responsibilities**, running essential services (like **inter-process communication and basic scheduling**) within the kernel, while other services (like **drivers and file systems**) run in **user space**."
- **Advantages:**
  - "**Modularity:** Easier to add, modify, or replace components without affecting the core kernel."
  - "**Stability:** A failure in a user-space service is less likely to crash the entire system."
- **Disadvantages:**
  - "**Performance:** Potentially higher overhead due to increased communication between user-space services and the microkernel."
  - "**Complexity:** More complex design and implementation compared to monolithic kernels."

## Microkernels — examples (slide 16)
- "Examples: **Minix, HelenOS, Horizon, The L4 microkernel family, Zircon (Fuchsia OS).**"
- Screenshot captioned "**MINIX 3**": a MINIX 3 desktop (raccoon mascot in the centre) with windows: Panel settings, Time and date (calendar January 2007), Colors and fonts settings, Control panel (Icons, Colors and Fonts, Screen Saver, Panel, Keyboard, Window Manager, Display, Install New Software, Time and date), a `top`-style process listing, a terminal. Decorative; shows MINIX 3 has a GUI.

## Client-server model (slide 17)
- Bullets:
  - "**Servers provide some service.**"
  - "**Clients use these services.**"
  - "Communication between clients and servers is often by **message passing**."
  - "Client-server model is an abstraction that can be used for a **single machine or for a network of machines**."
- Figure, caption "**The client-server model over a network.**": four machines in a row, each a two-row box (service on top, "Kernel" underneath), each kernel attached by a line to a horizontal line labelled "**Network**"; "• • •" at both ends.
  - Machine 1: "Client" / "Kernel"
  - Machine 2: "File server" / "Kernel"
  - Machine 3: "Process server" / "Kernel"
  - Machine 4: "Terminal server" / "Kernel"
  - A curved arrow from the Client (Machine 1) down through its kernel and up into the File server (Machine 2), labelled "**Message from client to server**".

## Virtual machines — virtualization and web hosting (slide 18)
- "**Virtualization allows you to run two or more operating systems using only one machine.**"
- "**Before Virtualization**: Many companies have traditionally run their mail servers, Web servers, FTP servers, and other servers on separate computers."
- "**After Virtualization**: They can run many servers on the same machine without having a crash of one server bring down the rest."
- "**Web hosting world**:
  - **NO Virtualization**
    - **Shared hosting**, a login account on a Web server, but no control over the server software
    - **Dedicated hosting**, you have your own machine, very flexible but not cost effective.
  - **With Virtualization**
    - Each customer can have different fully controllable operating systems on the same machine."

## Virtual machines — VirtualBox screenshots (slides 19-22)
- Slide 19: "Oracle VM VirtualBox Manager" window. Three VMs listed, all "Powered Off": **winXP** (selected), **Ubuntu18.04.3**, **Dos**. Toolbar: New, Settings, Discard, Start. Details for winXP: General — Name: winXP; Operating System: Windows XP (32-bit). System — Base Memory: 1199 MB; Boot Order: Floppy, Optical, Hard Disk; Acceleration: VT-x/AMD-V, Nested Paging. Display — Video Memory: 18 MB; Graphics Controller: VBoxVGA; Remote Desktop Server: Disabled; Recording: Disabled. Storage — Controller: IDE; IDE Primary Master: winXP.vdi (Normal, 8.00 GB); IDE Secondary Master: [Optical Drive] VBoxGuestAdditions.iso (56.92 MB). Audio — Host Driver: Windows DirectSound; Controller: ICH AC97. Network — Adapter 1: Intel PRO/1000 T Server (NAT). USB — USB Controller: OHCI; Device Filters: 0 (0 active). Shared folders. Preview pane "winXP".
- Slide 20: same manager, **Ubuntu18.04.3** selected. General — Operating System: Ubuntu (64-bit). System — Base Memory: 4024 MB; Boot Order: Floppy, Optical, Hard Disk; Acceleration: VT-x/AMD-V, Nested Paging, KVM Paravirtualization. Display — Video Memory: 16 MB; Graphics Controller: VMSVGA; Remote Desktop Server: Disabled; Recording: Disabled. Storage — Controller: IDE; IDE Secondary Master: [Optical Drive] Empty; Controller: SATA; SATA Port 0: Ubuntu18.04.3.vdi (Normal, 10.00 GB). Audio — Windows DirectSound; ICH AC97. Network — Adapter 1: Intel PRO/1000 MT Desktop (NAT). USB — OHCI; 0 (0 active).
- Slide 21: **Dos** selected. General — Operating System: DOS. System — Base Memory: 64 MB; Boot Order: Floppy, Optical, Hard Disk; Acceleration: VT-x/AMD-V, Nested Paging. Display — Video Memory: 9 MB; Scale-factor: 1.25; Graphics Controller: VBoxVGA; Remote Desktop Server: Disabled; Recording: Disabled. Storage — Controller: Floppy; Floppy Device 0: Disk04.img (**Inaccessible**); Controller: IDE; IDE Primary Master: Dos.vdi (Normal, 200.00 MB); IDE Secondary Master: [Optical Drive] Windows 3.11.iso (**Inaccessible**). Audio — Host Driver: Windows DirectSound; Controller: SoundBlaster 16. Network — Adapter 1: PCnet-FAST III (NAT). USB — Disabled.
- Slide 22: two overlapping "winXP - Settings" dialogs, System page.
  - Motherboard tab: Base Memory slider set to **1199 MB** (range **4 MB** to **8192 MB**); Boot Order: Floppy [x], Optical [x], Hard Disk [x], Network [ ]; Chipset, Pointing Device, Extended Features (partly hidden).
  - Processor tab: Processor(s): **1** (slider **1 CPU** to **4 CPUs**); Execution Cap: **100%** (slider **1%** to **100%**); Extended Features: [ ] Enable PAE/NX, [ ] Enable Nested VT-x/AMD-V.
  - Settings sidebar: General, System, Display, Storage, Audio, Network, Serial Ports, USB, Shared Folders, User Interface.
- Point of slides 19-22: one physical machine hosts several guest OSes (Windows XP, Ubuntu, DOS), each given its own virtual memory size, CPUs, disks and devices.

## Virtual machines — CP/CMS and VM/370 (slide 23)
- Heading: "**Control Program/Cambridge Monitor System (CP/CMS)**".
- Figure, caption "**The structure of VM/370 with CMS.**", bottom to top:
  - "**370 Bare hardware**" (bottom bar)
  - "**VM/370**" with red annotation "**(VM-Virtualization Layer)**"
  - Three side-by-side boxes, each "**CMS**" with an empty space above it (where applications run); a label "**Virtual 370s**" with three arrows, one to each box.
  - Left side labels: "**I/O instructions here**" → arrow into the left CMS; from there a downward arrow into VM/370 with "**Trap here**".
  - Right side labels: "**System calls here**" → arrow into the space above the right CMS, a downward arrow into CMS with "**Trap here**".
  - Instructor annotations: red dashed arrow from "**CMS is a single user OS**" to the left CMS box; green dashed arrow from "**App**" to the space above the left CMS.
- Reading the figure: an application's system calls trap to CMS (the single-user OS in its own virtual 370); CMS's I/O instructions trap to VM/370, which runs on the bare hardware and gives each CMS its own virtual 370.

## Virtual machines rediscovered — hypervisor types (slide 24)
- Figure, caption "**(a) A type 1 hypervisor. (b) A pure type 2 hypervisor. (c) A practical type 2 hypervisor.**"
  - **(a)**: bottom bar "**Type 1 hypervisor**"; on it side-by-side guest boxes "**Windows**" (light grey) and "**Linux**" (dark grey) and "..." (more). Inside Windows, above a dashed line, two process circles labelled "**Excel**", "**Word**"; inside Linux, two circles "**Mplayer**", "**Apollon**".
  - **(b)**: bottom bar "**Host operating system**"; on it "**Machine simulator**" with a grey "**Guest OS**" box on top holding three circles labelled "**Guest OS process**"; beside the machine simulator, two circles labelled "**Host OS process**".
  - **(c)**: bottom bar "**Host operating system**" with a small dark box at its right end labelled "**Kernel module**"; on it "**Type 2 hypervisor**" with a grey "**Guest OS**" box on top holding three circles "**Guest OS process**"; beside the hypervisor, two host-OS process circles (unlabelled here).
- Red text under the caption: "**Hypervisor (virtual machine monitor)**".
- The slide gives no prose definition of type 1 vs type 2; the figure shows type 1 sitting directly on the hardware with guest OSes on top, type 2 running on a host operating system.

## Virtual machines rediscovered — ESXi, a type 1 example (slide 25)
- Heading "**Type 1 hypervisor**". "**Example:** ESXi (Elastic Sky X Integrated):
  1. Type-1 hypervisor
  2. Runs directly on system hardware
  3. No need for an operating system (OS)"
- Screenshot: the VMware ESXi host web client (browser, "Not secure" https address), host "localhost.localdomain", Navigator: Host (Manage, Monitor), Virtual Machines, Storage, Networking; panels Hardware, Configuration, System Information, Performance summary last hour, Recent tasks. Fine print is not legible; decorative.

## Virtual machines rediscovered — VirtualBox, a type 2 example (slide 26)
- Screenshot of a Windows 10 desktop with labels and red arrows:
  - "**Type 2 hypervisor(VirtualBox)**" → arrows to the "Oracle VM VirtualBox" desktop icon and to the open "Oracle VM VirtualBox Manager" window (VMs winXP, Ubuntu18.04, Dos, and a running one "ls", partly hidden).
  - "**Host OS (Windows 10)**" → arrow to the Windows taskbar (Start button; clock 3:41 PM, 2020-08-21).
  - "**Guest OS (Tiny Core Linux)**" → arrow to a Tiny Core ("core") desktop window running inside, with a terminal showing:
```
tc@box:/home$ pstree -p
init(1)-+-Xvesa(1156)
        |-flwm(1158)
        |-sh(869)
        |-udevd(165)-+-udevd(317)
        |            `-udevd(349)
        |-udhcpc(897)
        `-wbar(1187)---aterm(1280)---sh(1281)---pstree(1298)
tc@box:/home$
```

## Virtual machines rediscovered — "Real or Virtual machine(type 1 or 2)?" (slide 27)
- Prompt: "**Real or Virtual machine(type 1 or 2)?**"
- Screenshot: a **CoCalc** web page in a browser ("Thank you for trying CoCalc! Please sign up to avoid losing your work."; tabs Files, New, Log, Find, "T1.term"; toolbar File, −, +, Pause, ...). The terminal shows:
```
~$
~$ fg
sleep 30
^C
~$ fg
sleep 30
ESXi (Elastic Sky X Integrated):
[1]-  Done                    sleep 30
~$ ESXi (Elastic Sky X Integrated):
bash: syntax error near unexpected token `Elastic'
~$
~$ █
```
  The last command and its error are highlighted yellow.
- **OPEN:** the slide asks whether this terminal is a real machine or a virtual machine, and if virtual, type 1 or type 2; no answer is printed. [my answer, unverified] It is virtual: CoCalc is a cloud service, so the bash shell runs in a project container on a cloud virtual machine, not on the student's own hardware; typing "ESXi (Elastic Sky X Integrated):" into bash only gives a syntax error, so the shell is not an ESXi console. Cloud providers run guests on hypervisors that sit directly on the server hardware, i.e. type 1 (e.g. KVM on Google Cloud), but the slide gives no way to confirm this from the screenshot.

## Clocks (Timers) — title slide (slide 28)
- Title "**Clocks (Timers)**". Images only: a photo of a crystal oscillator can marked "18.083MHz", an hourglass icon, an alarm-clock icon, a stopwatch icon. No text.

## Clock hardware — three components (slide 29)
- "**Clocks are built out of three components:**
  1) **Crystal oscillator** — Can generate a periodic signal, typically in the range of **several hundred megahertz to a few gigahertz**, depending on the crystal chosen.
  2) **Counter** — This signal is fed into the counter to make it **count down to zero**. When the counter gets to zero, it **causes a CPU interrupt**.
  3) **Holding register** — The value of the holding register is **copied into the counter**."
- Underlined: "**All the clock hardware does is generate interrupts at known intervals.**"

## Clock hardware — a programmable clock figure (slide 30)
- Caption "**A programmable clock.**"
- Figure: a crystal symbol labelled "**Crystal oscillator**" at top, wired to the right end of a row of cells (a register), labelled "**Counter is decremented at each pulse**". Below it a second row of cells labelled "**Holding register is used to load the counter**", with an upward arrow from the holding register into the counter.

## Clock hardware — one-shot and square-wave modes (slide 31)
- "**One-shot mode** — When the clock is started, it copies the value of the holding register into the counter and then decrements the counter at each pulse from the crystal. When the counter gets to zero, it causes an interrupt and **stops until it is explicitly started again by the software**."
- "**Square-wave mode** — After getting to zero it causes an interrupt, the value of the holding register is copied into the counter and whole process is **repeated again indefinitely**. These periodic interrupts are called **clock ticks**." ("clock ticks" underlined.)

## Clock hardware — programmable interval range, worked example (slide 32)
- "The advantage of the programmable clock is that its **interrupt frequency can be controlled by software**."
- "If a **500-MHz** crystal is used, then the counter is pulsed every **2 nsec**. With (unsigned) **32-bit** registers, interrupts can be programmed to occur at intervals from **2 nsec to 8.6 sec**."
- Instructor's arithmetic (in red), step by step:
  - T = 1/f = 1/(500 × 10⁶) sec = 10⁹ / (500 × 10⁶) nsec = **2 nsec**
  - 32-bit register: (2³² − 1) × 2 nsec = **8,589,934,590 nsec ≈ 8.6 sec**
- Shortest interval = holding register 1 → 1 pulse = 2 nsec; longest = 2³² − 1 = 4,294,967,295 pulses × 2 nsec.

## Clock software — duties of a clock driver (slide 33)
- "**Typical duties of a clock driver:**
  1. Maintaining the time of day.
  2. Preventing processes from running longer than allowed.
  3. Accounting for CPU usage.
  4. Handling alarm system call from user processes.
  5. Providing watchdog timers for parts of system itself.
  6. Profiling, monitoring, statistics gathering."
- Slides 34-40 take duties 1-5 in order; duty 6 has no further slide.

## Clock software — time of day in ticks, worked example (slide 34)
- Subtitle "Maintaining the time of day". Heading "**Time of day in ticks**".
- Instructor's arithmetic, verbatim:
  - "Clock rate f = **60 Hz** and a **32-bit** counter"
  - "T = 1/f = 1/60 ≈ **0.0167 second**"
  - "The largest unsigned 32-bit binary number = 2³² − 1 = **4294967295**"
  - "Total time = 4294967295 × 0.0167 = **71725953.8265 seconds = 2.274 years**"
  - "**Will overflow in just over 2 years.**"
  - "The largest unsigned 64-bit binary number = 2⁶⁴ − 1"
  - "Total time = (2⁶⁴ − 1) × 0.0167 = **9768538369.8297023773 years**"
- Figure: one box "**Time of day in ticks**" with a width bracket "**64 bits**".
- "**Makes maintaining the counter more expensive since it has to be done many times a second.**" (The cost of the 64-bit counter.)
- Checks (mine): 71725953.8265 s ÷ (365 × 86400 = 31,536,000 s/yr) = 2.274 years. The slide uses the rounded period 0.0167 s; with the exact 1/60 s the 32-bit total is 4294967295/60 = 71,582,788.25 s ≈ 2.27 years, and the 64-bit total is ≈ 9.75 × 10⁹ years rather than 9.77 × 10⁹. Teach the slide's numbers; both round to "just over 2 years" and "about 10 billion years".

## Clock software — time of day in seconds, worked example (slide 35)
- Subtitle "Maintaining the time of day". Heading "**Time of day in seconds**".
- "The time of day is maintained in **seconds, rather than in ticks**."
- Instructor's arithmetic:
  - "Clock rate f = 60 Hz and a 32-bit counter"
  - "1 second = **60 ticks**"
  - "The largest unsigned 32-bit binary number = 2³² − 1 = 4294967295"
  - "Total time = 4294967295 × 1 = **4294967295 seconds ≈ 136 years**"
  - "**Will work until the twenty-second century.**"
- Figure: a box with width bracket "**32 bits**" labelled "**Time of day in seconds**", and beside it a smaller box labelled "**Number of ticks in current second**" (the tick count within the current second, 0-59 at 60 Hz).
- Check (mine): 4294967295 ÷ 31,536,000 = 136.19 years.

## Clock software — counting from boot time (slide 36)
- Subtitle "Maintaining the time of day".
- "**Count in ticks, but to do that relative to the time the system was booted, rather than relative to a fixed external moment.**"
- "**Current time = the stored time of day in the memory + counter**"
- Figure: a box "**Counter in ticks**" with width bracket "**32 bits**"; below it a box labelled "**System boot time in seconds**".

## Clock software — preventing overruns; CPU accounting (slide 37)
- **Preventing processes from running longer than allowed**: "Whenever a process is started, the scheduler **initializes a counter to the value of that process' quantum in clock ticks**. At every clock interrupt, the clock driver **decrements the quantum counter by 1**. When it gets to zero, the clock driver **calls the scheduler to set up another process**."
- **Accounting for CPU usage**: "Start a **second timer, distinct from the main system timer**, whenever a process is started up. When that process is stopped, the timer can be read out to tell how long the process has run. To do things right, the second timer should be **saved when an interrupt occurs and restored afterward**."

## Clock software — alarm system call (slide 38)
- Subtitle "**Handling alarm system call from user processes**".
- "In many systems, a process can request that the operating system give it a warning (**a signal, interrupt, message,…**) after a certain interval. If many signals are expected, it is more efficient to **simulate multiple clocks by chaining all the pending clock requests together, sorted on time, in a linked list**."
- "**Each entry on the list tells how many clock ticks following the previous one to wait before causing a signal.**"
- "Example: Signals are pending for **4203, 4207, 4213, 4215, and 4216**."

## Clock software — simulating multiple timers with a single clock, worked example (slide 39)
- "Example: Signals are pending for 4203, 4207, 4213, 4215, and 4216."
- "the next interrupt occurs in **3 ticks**. On each tick, *Next signal* is decremented. When *Next signal = 0*, the signal corresponding to the first item on the list is caused, and that item is removed from the list. Then ***Next signal = 4***."
- Figure, caption "**Simulating multiple timers with a single clock.**":
  - Box "**Current time**" = **4200**.
  - Box "**Next signal**" = **3**.
  - Box "**Clock header**" with an arrow to a linked list of five two-field nodes: **[3|•] → [4|•] → [6|•] → [2|•] → [1|X]** (X = null pointer, end of list).
- Arithmetic behind the list (each entry = ticks after the previous signal):

| Pending signal time | Calculation | List entry |
|---|---|---|
| 4203 | 4203 − 4200 (current time) | 3 |
| 4207 | 4207 − 4203 | 4 |
| 4213 | 4213 − 4207 | 6 |
| 4215 | 4215 − 4213 | 2 |
| 4216 | 4216 − 4215 | 1 |

  (The table is my layout of the figure's numbers; the subtractions are implied by "Each entry on the list tells how many clock ticks following the previous one", slide 38.) After 3 ticks (time 4203) the first signal fires, the 3-node is removed, and Next signal takes the next entry, 4.

## Clock software — watchdog timers (slide 40)
- Subtitle "**Providing watchdog timers for parts of system itself**".
- "**Detect and recover from crashes, infinite loops** Example: For instance, a watchdog timer may **reset a system that stops running**, especially used in **embedded system**."
- Images: a bulldog drawing (watchdog pun), an Arduino UNO board, a video-camera icon linking to https://www.youtube.com/watch?v=GC6dGypGctQ.

## Beyond the slides (label as such in the lessons)
- [unverified, from memory of Tanenbaum] Tanenbaum's Ch 1 OS-structure section covers monolithic, layered, microkernels, client-server, virtual machines and exokernels. An **exokernel** gives each user-level virtual machine a subset of the real machine's resources (e.g. disk blocks) and only checks that each VM uses only what it was allocated, so no remapping layer is needed. The deck lists exokernels (greyed out) and never covers them.
- [unverified, from memory of Tanenbaum] Tanenbaum expands CMS as "**Conversational** Monitor System"; the slide says "**Cambridge** Monitor System". Historically CMS began as the Cambridge Monitor System under CP-67 and was renamed Conversational Monitor System under VM/370. Teach the slide's wording, mention the other.
- [unverified, from memory of Tanenbaum] Tanenbaum defines a type 1 hypervisor as running on the bare metal and a type 2 hypervisor as relying on a host OS (e.g. VirtualBox, VMware Workstation); the "practical" type 2 of fig (c) uses a kernel module in the host for performance. The deck states these only through the figure (slide 24) and examples (slides 25-26).
- [unverified, from memory of Tanenbaum] Tanenbaum's microkernel examples are Integrity, K42, L4, PikeOS, QNX, Symbian and MINIX 3; the slide's list (Minix, HelenOS, Horizon, L4 family, Zircon) is the instructor's own.
- The MS-DOS interrupt semantics on slide 13 (INT 21h/AH=02, INT 10h/AH=0Eh, INT 20h) are from general DOS knowledge, not the slide.

## Conflicts and open questions
- **OPEN (slide 27)**: "Real or Virtual machine(type 1 or 2)?" — no printed answer; my unverified answer is above.
- Slide 1 lists "6. Exokernels" (greyed) but no slide covers it.
- Slide 2 says "main program"; the slide-3 figure says "Main procedure". Same thing.
- Slide 8's module author string is "COMP-4735", not 4736 (likely reused from an earlier course code).
- Slide 23 expands CMS as "Cambridge Monitor System" (see Beyond the slides).
- Slide 34 uses T ≈ 0.0167 s, so its totals (71725953.8265 s, 2.274 years, 9768538369.83 years) are slightly larger than exact 1/60 s arithmetic (71,582,788.25 s ≈ 2.27 years; ≈ 9.75 × 10⁹ years). Teach the slide's numbers.
- Slide 33 duty 6 (profiling, monitoring, statistics gathering) has no explanatory slide.
- Slides 19-22, 26, 27 have no footer; slides 28-40 have "Bo,Modern" without a space. Cosmetic.

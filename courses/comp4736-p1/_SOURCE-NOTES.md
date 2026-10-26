# COMP 4736 Part 1 — "Introduction": facts, figures and worked answers transcribed from the instructor's deck

Source file: `D:/BCIT/COMP4736/lectures/Part_1_Introduction_reduced.pdf` (88 pages; text in `Part_1_Introduction_reduced.txt`, rendered pages in `Part_1_Introduction_reduced_pages/p001.png` … `p088.png`). Downloaded 2026-10-26.
Textbook: Tanenbaum & Bos, *Modern Operating Systems*, 4th ed. Reading per the course outline: **Chapter 1 and lecture notes**. The textbook was not opened for this transcription; anything attributed to it is from memory and labelled `[unverified, from memory of Tanenbaum]`. Several figures (multilevel machine, ALU, 96-bit memory, five-stage pipeline, superscalar, multiprocessor) are from Tanenbaum's *Structured Computer Organization* although the slide footer credits MOS 4th ed.
Every content slide carries the footer "Tanenbaum & Bo, Modern Operating Systems:4th ed., (c) 2013 Prentice-Hall, Inc. All rights reserved." (sic, "Bo"); it is not repeated below.
Slide numbers are PDF pages; progressive builds are transcribed once.

## Title (slide 1)
- "**Introduction**" (red title, nothing else).

## Current multilevel machines (slides 2-10)
- Slide 2 title "**Current Multilevel Machines**". Six stacked boxes, top to bottom:

| Level | Box label (slide wording) |
|---|---|
| Level 5 | High programming language level |
| Level 4 | Assembly language level |
| Level 3 | Operating System (OS) level |
| Level 2 | Instruction Set Architecture (ISA) level |
| Level 1 | Microarchitecture level |
| Level 0 | Digital level |

  (The text extraction scrambles the level numbers; the images are authoritative: OS = Level 3, ISA = Level 2, Microarchitecture = Level 1.)
- Slides 3-10 are a build that greys out every level but one and adds a caption:
  - **Level 0, Digital level** (slide 3): "Device level made of transistors and in turn transistors are made of semiconductors. AND, OR, and NOT are the building blocks of any digital circuits"
  - Slide 4, figure headed "Digital level": (i) the three gate symbols labelled **AND**, **OR**, **NOT**; (ii) a memory circuit (Tanenbaum's 4 × 3 memory): inputs "Data in" I₂ I₁ I₀, address A₁ A₀, control CS, RD, OE; D flip-flops (D Q, CK) in rows "Word 0", "Word 1", "Word 2", "Word 3"; "Write gate", "Word 0 select line", "Word 1 select line", "Word 2 select line"; "CS • RD̄"; outputs O₂ O₁ O₀; "Output enable = CS • RD • OE"; (iii) a 1-bit ALU circuit (same as slide 27: Logical unit, Carry in, NVA, A, ENA, B, ENB, AB, A + B, B̄, Output, Sum, Enable lines, F₀, F₁, Decoder, Full adder, Carry out); an arrow from the ALU circuit points to (iv) a CPU block: **CPU** containing **Control Unit**, **ALU** (double arrow between them) and **Registers** (a stack of six register boxes, double arrows to Control Unit and ALU).
  - **Level 1, Microarchitecture level** (slide 5): "Assume that a program written in a high level language is translated to the low level machine language. A file is created after compilation containing some instructions in machine codes. The instructions are executed in this level employing ALU, Registers, and Microprograms."
  - **Level 2, ISA level** (slide 6): "An ISA describes the design of a Computer in terms of the basic operations it must support. The ISA is not concerned with the implementation specific details of a computer. It is only concerned with the set or collection of basic operations the computer must support."
  - Slide 7, "**ATmega16 (8-bit AVR microcontroller )**", screenshot "Instruction Set Summary" (an example ISA). Columns Mnemonics | Operands | Description | Operation | Flags | #Clocks. Legible rows:

| Mnemonics | Operands | Description | Operation | Flags | #Clocks |
|---|---|---|---|---|---|
| **ARITHMETIC AND LOGIC INSTRUCTIONS** | | | | | |
| ADD | Rd, Rr | Add two Registers | Rd ← Rd + Rr | Z,C,N,V,H | 1 |
| ADC | Rd, Rr | Add with Carry two Registers | Rd ← Rd + Rr + C | Z,C,N,V,H | 1 |
| ADIW | Rdl,K | Add Immediate to Word | Rdh:Rdl ← Rdh:Rdl + K | Z,C,N,V,S | 2 |
| SUB | Rd, Rr | Subtract two Registers | Rd ← Rd - Rr | Z,C,N,V,H | 1 |
| SUBI | Rd, K | Subtract Constant from Register | Rd ← Rd - K | Z,C,N,V,H | 1 |
| SBC | Rd, Rr | Subtract with Carry two Registers | Rd ← Rd - Rr - C | Z,C,N,V,H | 1 |
| SBCI | Rd, K | Subtract with Carry Constant from Reg. | Rd ← Rd - K - C | Z,C,N,V,H | 1 |
| **BRANCH INSTRUCTIONS** | | | | | |
| RJMP | k | Relative Jump | PC ← PC + k + 1 | None | 2 |
| IJMP | | Indirect Jump to (Z) | PC ← Z | None | 2 |
| JMP | k | Direct Jump | PC ← k | None | 3 |
| RCALL | k | Relative Subroutine Call | PC ← PC + k + 1 | None | 3 |
| ICALL | | Indirect Call to (Z) | PC ← Z | None | 3 |
| CALL | k | Direct Subroutine Call | PC ← k | None | 4 |
| RET | | Subroutine Return | PC ← STACK | None | 4 |
| **DATA TRANSFER INSTRUCTIONS** | | | | | |
| MOV | Rd, Rr | Move Between Registers | Rd ← Rr | None | 1 |
| MOVW | Rd, Rr | Copy Register Word | Rd+1:Rd ← Rr+1:Rr | None | 1 |
| LDI | Rd, K | Load Immediate | Rd ← K | None | 1 |
| LD | Rd, X | Load Indirect | Rd ← (X) | None | 2 |
| LD | Rd, X+ | Load Indirect and Post-Inc. | Rd ← (X), X ← X + 1 | None | 2 |
| LD | Rd, - X | Load Indirect and Pre-Dec. | X ← X - 1, Rd ← (X) | None | 2 |
| **BIT AND BIT-TEST INSTRUCTIONS** | | | | | |
| SBI | P,b | Set Bit in I/O Register | I/O(P,b) ← 1 | None | 2 |
| CBI | P,b | Clear Bit in I/O Register | I/O(P,b) ← 0 | None | 2 |
| LSL | Rd | Logical Shift Left | Rd(n+1) ← Rd(n), Rd(0) ← 0 | Z,C,N,V | 1 |
| LSR | Rd | Logical Shift Right | Rd(n) ← Rd(n+1), Rd(7) ← 0 | Z,C,N,V | 1 |
| ROL | Rd | Rotate Left Through Carry | Rd(0)←C,Rd(n+1)← Rd(n),C←Rd(7) | Z,C,N,V | 1 |
| ROR | Rd | Rotate Right Through Carry | Rd(7)←C,Rd(n)← Rd(n+1),C←Rd(0) | Z,C,N,V | 1 |
| ASR | Rd | Arithmetic Shift Right | Rd(n) ← Rd(n+1), n=0..6 | Z,C,N,V | 1 |
| SWAP | Rd | Swap Nibbles | Rd(3..0)↔Rd(7..4), Rd(7..4)↔Rd(3..0) | None | 1 |

  (RET, the LD -X row and SWAP are cut off at the bottom of their sections in the screenshot; their text is half-visible and read as above.)
  - **Level 3, OS level** (slide 8): "Main duties : Memory management, processes execution, and system resource protection."
  - **Level 4, Assembly language level** (slide 9): "Human readable language, hard to work with, time consuming, and even a simple program contains many lines."
  - **Level 5, High programming language level** (slide 10): "In this level people usually write programs in languages such as Java, Python, and C++."

## Operating System (OS) (slides 11-15)
- Slide 11, heading "**Operating System (OS)**", the level stack with Level 3 highlighted: "Main duties : Memory management, processes execution, and system resource protection. e.g. Linux, windows, Mac"
- Slide 12, "**Operating System**":
  1. "A software"
  2. "An extended machine"
  3. "A resource manager that provides many abstraction layers"
  - "e.g. Reading and writing on hard drive require many steps and is not easy task without using the operating system."
  - Figure: a stack of four green platters on a spindle labelled "**Hard drive**", an arrow to one ring labelled "**track**".
  - "OS-abstraction" (underlined), then the call:

```c
ssize_t    read(int fd, void *buf, size_t count);
```

- Slide 13: "Think of the car's controls as the OS interface between the driver and the complicated hardware." Three photos (dashboard, hand on wheel and foot on pedal, engine) and a diagram: **DRIVER** → "simple controls" → box **CAR INTERFACE**: "Steering wheel", "Accelerator / brake", "Gear selector", "Dashboard" → box "**Complex systems**": "Engine", "Transmission", "Fuel system", "Braking system", "Electronics", "Sensors".
- Slide 14, same heading sentence. Box: "The driver doesn't normally need to know: • how fuel is injected into the engine • how the transmission changes gears internally • how the engine produces torque • how the braking system creates hydraulic pressure • how the sensors communicate • how the engine computer controls fuel and ignition". Yellow-boxed: "The driver simply uses: **Steering wheel + pedals + gear selector + dashboard**".
- Slide 15, "**You double-click a text file, and it opens in a text editor**". (Not in the text file; image only.)
  - "From the user's perspective: Mouse → Double-click text file → Text appears"
  - Screenshot: desktop icon "myfile.txt" with "1st click", then "2nd click (double-click)" → Notepad window "myfile.txt - Notepad" showing "This is the content of myfile.txt. It has been opened by double-clicking the file on the desktop." (status bar "Ln 3, Col 1 | 100% | Windows (CRLF) | UTF-8").
  - "What happens behind the scenes?" (each step joined by ↓):
    1. Mouse movement
    2. Mouse hardware sends data
    3. OS mouse driver receives it
    4. OS updates mouse position
    5. You click the text-file icon
    6. OS GUI detects the click
    7. OS determines which file you selected
    8. OS identifies the file name and location
    9. OS determines which application should open it
    10. OS starts/activates the text editor
    11. Text editor asks OS to open the file
    12. OS file system finds the file's disk blocks
    13. OS storage driver communicates with the HDD/SSD
    14. Storage device transfers data to RAM
    15. OS gives the data to the text editor
    16. Text editor displays the text

## Kernel and user mode; x86 rings (slides 16-19)
- Slide 16, "**Kernel and User mode**":
  - "**kernel mode** (also called **supervisor mode**) The operating system, the most fundamental piece of software, runs in **kernel mode**. In this mode it has complete access to all the hardware and can execute any instruction the machine is capable of executing." (the last sentence underlined)
  - "**User mode** The rest of the software runs in **user mode**, in which only a subset of the machine instructions is available." "Instructions that affect control of the machine or do **Input/Output** are forbidden to user-mode programs." (underlined)
- Slide 17, "**Intel x86 architecture — Four privilege levels or security rings**": "These rings are used for various levels of privilege and access control within the CPU, typically in an operating system context." Figure: concentric circles, centre outward **Ring 0** (red), **Ring 1** (lavender), **Ring 2** (yellow), **Ring 3** (light green). A colour key bar: top (green) "**Least privileged**", bottom (red) "**Most privileged**".
- Slide 18, same title:
  - "**Ring 0 (Kernel Mode):** This is the most privileged level, reserved for the operating system kernel. Code running in Ring 0 has unrestricted access to all hardware and system resources. It can execute privileged instructions and manage memory, devices, and processes. Device drivers and the core operating system components run in Ring 0."
  - "**Ring 1 and 2 :** Operating System Services (Device Drivers, Etc.)."
  - "**Ring 3 (User Mode):** Ring 3 is the least privileged level and is where user applications run. Code running in this ring has limited access to system resources and hardware. It can't execute privileged instructions directly or access hardware resources directly. Instead, it relies on system calls to request services from the operating system."
- Slide 19, "**Components of a Modern Computer**", figure "Where the operating system fits in.": stacked boxes, top to bottom: a box with three circles labelled "Web browser", "E-mail reader", "Music player"; "User interface program"; "Operating system"; a dark-grey box (hardware). Braces on the left: "**User mode**" spans the top two boxes; "**Kernel mode**" spans "Operating system". Braces on the right: "**Software**" spans the top three boxes; "**Hardware**" spans the grey box.

## The OS as an extended machine and as a resource manager (slides 20-23)
- Slide 20, "**The Operating System as an Extended Machine**". Figure, top to bottom: "Application programs"; a row of pretty pictures (queen, castle, peacock, flower); arrow "← **Beautiful interface**"; "Operating system"; a row of ugly faces and a toad; arrow "← **Ugly interface**"; "Hardware" (grey). Caption (underlined): "**Operating systems turn ugly hardware into beautiful abstractions**".
- Slide 21, "**The Operating System as a Resource Manager**":
  - "**Top down view** – Provide abstractions to application programs."
  - "**Bottom up view** – Manage pieces of complex system."
  - "**Alternative view** – Provide orderly, controlled allocation of resources."
- Slide 22: "Resource management includes sharing resources in two different ways: in **time** and in **space**." "E.g. Multiprogramming (each program gets a fair amount of time and memory space for execution) and sharing printer."
- Slide 23 diagram: OPERATING SYSTEM → RESOURCE MANAGER → four branches:

| Resource | Sharing |
|---|---|
| CPU | Time sharing |
| RAM | Space sharing |
| Disk | Space sharing |
| Printer | Time sharing |

## Computer hardware review (slides 24-26)
- Slide 24, "**Computer hardware review**", figure "Some of the components of a simple personal computer": a horizontal **Bus** with, left to right, **CPU** (containing a small box **MMU**), **Memory**, **Video controller** (→ **Monitor**), **Keyboard controller** (→ **Keyboard**), **USB controller** (→ **USB printer**), **Hard disk controller** (→ **Hard disk drive**). Inset: a Windows Device Manager tree "CAS-Y61200": Central Processor(s), Motherboard, Memory, Bus, Video Adapter (expanded: Intel UHD Graphics), Monitor, Drives, Audio, Network, Ports, Smart Battery.
- Slide 25: photo of an ASUS motherboard (P5GD1-VM) and its back-panel connectors. No text.
- Slide 26, "**CPU**": a movie-camera icon (a video link in the original deck) and the block diagram: **CPU** box containing **Control Unit**, **ALU** (↕ between them) and **Registers** (six register slots; ↔ to Control Unit and ↔ to ALU).

## ALU (slides 27-30)
- Slide 27, "**ALU**", Tanenbaum's 1-bit ALU circuit. Labels: inputs "NVA" (the INVA line; the left edge of the label is cropped), "A", "ENA", "B", "ENB"; A AND ENA is XORed with INVA; B AND ENB. Dashed box "**Logical unit**" with gates producing "**AB**", "**A + B**", "**B̄**". Dashed box "**Decoder**" with inputs **F₀**, **F₁**, inverters and four AND gates driving the "**Enable lines**". Dashed box "**Full adder**" (two XORs, two ANDs, one OR) with "**Carry in**" from the top and "**Carry out**" at the bottom; its output "**Sum**". All four results feed an OR gate → "**Output**".
- Slide 28, "**ALU** — Logic gates — ALU (list of operations)":

| F₀ | F₁ | ENA | ENB | INVA | INC | Function |
|---|---|---|---|---|---|---|
| 0 | 1 | 1 | 0 | 0 | 0 | A |
| 0 | 1 | 0 | 1 | 0 | 0 | B |
| 0 | 1 | 1 | 0 | 1 | 0 | Ā |
| 1 | 0 | 1 | 1 | 0 | 0 | B̄ |
| 1 | 1 | 1 | 1 | 0 | 0 | A + B |
| 1 | 1 | 1 | 1 | 0 | 1 | A + B + 1 |
| 1 | 1 | 1 | 0 | 0 | 1 | A + 1 |
| 1 | 1 | 0 | 1 | 0 | 1 | B + 1 |
| 1 | 1 | 1 | 1 | 1 | 1 | B − A |
| 1 | 1 | 0 | 1 | 1 | 0 | B − 1 |
| 1 | 1 | 1 | 0 | 1 | 1 | −A |
| 0 | 0 | 1 | 1 | 0 | 0 | A AND B |
| 0 | 1 | 1 | 1 | 0 | 0 | A OR B |
| 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 | 1 | 0 | −1 |

- **Example (slides 29-30)**: "Use the ALU operation table to obtain B – A where A = 3 and B = 4 (use 8-bit representation for each number)."
  - Slide 29 (blank row to fill):

|   | A | B | INVA | F0 | F1 | ENA | ENB | INC | Res (Out) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 00000011 | 00000100 | | | | | | | |

  - Slide 30 (filled):

|   | A | B | INVA | F0 | F1 | ENA | ENB | INC | Res (Out) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 00000011 | 00000100 | 1 | 1 | 1 | 1 | 1 | 1 | **1**00000001 |

    (The leading 1 of the result is red: it is the carry out.)
  - Instructor's arithmetic, verbatim:
    - "B – A = B + NOT(A) + 1 = 00000100 +NOT(00000011) + 1"
    - "= 00000100 + 11111100 + 1 = 100000000+1 = **1**00000001" (leading 1 red)
  - Simulator figure (Logisim-style): input B = **4** shown as 00000100, input A = **3** shown as 00000011, switches **ENB = 1**, **ENA = 1**, **INVA = 1**, **Cin = 1**, **F0 = 1**, **F1 = 1**; outputs **Cout = 1**, **Res = 00000001** (decimal display **1**). (The INC input is the pin labelled "Cin" in the simulator.)
  - Final answer: B − A = 00000001 = **1**, with carry out 1 (discarded in 8-bit two's-complement).

## Control unit and RISC vs CISC (slides 31-32)
- Slide 31, "**Control unit — Instruction execution**", "**Fetch-Decode-Execute**". Figure: a scroll "High Level Code C++, Java, JavaScript" → arrow labelled "**Compiler**" → a red scroll "**Machine code**" → arrow → box "**Memory**" holding four lines `00101010`, `10101000` (red), `11101110`, `1010100` (red; 7 bits as printed). A broad arrow from Memory into the **CPU** box, landing on a small table "**Registers**". Inside the CPU, a cycle: Registers → "**Control Unit**" box "**Microprogram OR Hardwired**" → "**ALU**" → back to Registers.
- Slide 32, "**RISC vs CISC**":

| RISC | CISC |
|---|---|
| AVR | AMD |
| ARM | Pentium |
| MIPS | VAX |
| **Hardwired Approach** | **Microprogrammed Approach** |

## Processors: performance improvement (slides 33-45)
- Slide 33, "**Processors — Performance improvement**": "▪ Instruction-Level Parallelism (Pipelining) ▪ Multithreading and Multicore Chips ▪ Multiprocessors and Multi-computers"
- Slide 34, "Instruction-Level Parallelism — Pipelining". Figure (a) "A five-stage pipeline": **S1** Instruction fetch unit → **S2** Instruction decode unit → **S3** Operand fetch unit → **S4** Instruction execution unit → **S5** Write back unit. Figure (b) "The state of each stage as a function of time. Nine clock cycles are illustrated.":

| Stage | t=1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| S1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| S2 | | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| S3 | | | 1 | 2 | 3 | 4 | 5 | 6 | 7 … |
| S4 | | | | 1 | 2 | 3 | 4 | 5 | 6 |
| S5 | | | | | 1 | 2 | 3 | 4 | 5 |

  (Numbers in cells are instruction numbers; "Time →" under the columns.)
- **Pipelining example (slides 35-38)**, heading "Pipelining":
  - Slide 35: "**Example:** Car factory (the process of making a car) Which assembly line is faster ?" Figure, two rows of cars (outlines = unfinished, red = finished): top line has one station **S, 4 Hours** with three workers on one car; bottom line has three stations **S₁ 1 Hour**, **S₂ 1 Hour**, **S₃ 2 Hour**, one worker each, three cars in progress at once.
  - Slide 36 adds two boxes: next to the top line "**Cycle Time (CT) Every 4 hours 1 car**"; next to the bottom line "**Cycle Time (CT) Every 2 hours 1 car**".
  - Slides 37 and 38 (identical): "**Example:** Latency for each car". Four rows of the three-station line (S₁ 1 Hour, S₂ 1 Hour, S₃ 2 Hour) at successive steps, one car shaded grey as it moves: waiting, at S₁, at S₂, at S₃. Caption: "**Latency for each car = 2 + 2 + 2 = 6 hours**".
  - Worked result: one-station line CT = 4 hours (1 car every 4 hours); pipelined line CT = 2 hours (1 car every 2 hours, the longest stage); pipelined latency per car = 2 + 2 + 2 = 6 hours (each of the 3 stages takes one 2-hour cycle).
  - OPEN: slide 35's question "Which assembly line is faster ?" is answered only by the CT boxes. [my answer, unverified] The pipelined line is faster in throughput (1 car per 2 hours vs 1 per 4 hours) even though each car's latency rises from 4 to 6 hours.
- Slide 39, "**Processors** — Instruction-Level Parallelism — **Pipelining**": stage boxes **S₁ t1**, **S₂ t2**, **S₃ t3**, ····, **Sₙ₋₂ tn-2**, **Sₙ₋₁ tn-1**, **Sₙ tn**. Boxed formulas:
  - "Clock period Tₚ = max {t₁, t₂, ⋯, tₙ}"
  - "Throughput = 1 / Tₚ"
  - "Delay for each instruction = nTₚ"
- Slide 40, "Instruction-Level Parallelism — **No Pipelining**":
  - "Clock period Tₚ = t₁ + t₂ + ⋯ + tₙ"
  - "Throughput = 1 / Tₚ"
  - "Delay for each instruction = Tₚ"
  - (Applied to the car example: pipelined Tₚ = max{1, 1, 2} = 2 h, throughput 1/2 car per hour, delay 3 × 2 = 6 h; no pipelining Tₚ = 1 + 1 + 2 = 4 h, throughput 1/4, delay 4 h. This pairing is the slides' formulas applied to the slides' numbers.)
- Slide 41, "Instruction-Level Parallelism":
  - Figure "**A superscalar processor with five functional units**": S1 Instruction fetch unit → S2 Instruction decode unit → S3 Operand fetch unit → fans out to five S4 units **ALU**, **ALU**, **LOAD**, **STORE**, **Floating point** → all converge on S5 Write back unit.
  - Figure "**Dual five-stage pipelines with a common instruction fetch unit**": one S1 Instruction fetch unit feeding two parallel rows of S2 Instruction decode unit → S3 Operand fetch unit → S4 Instruction execution unit → S5 Write back unit.
- Slide 42, "Instruction-Level Parallelism":
  - "**A three-stage pipeline**": Fetch unit → Decode unit → Execute unit.
  - "**Superscalar CPU**": two rows Fetch unit → Decode unit, both feeding an oval "**Holding buffer**", which feeds three Execute units labelled "**Integer arithmetic**", "**Floating-point arithmetic**", "**Boolean operations**".
- Slide 43, "**Multithreading and Multicore Chips**":
  - "Allows the CPU to hold the state of two different threads and then switch back and forth on a nanosecond time scale e.g. SPARC, the Power5, the Intel Xeon, and the Intel Core family." (the definition part underlined; the bullet does not name the term; it describes multithreading)
  - "**Multicore chips** , CPU chips now have four, eight, or more complete processors or cores on them e.g. Intel Xeon Phi and the Tilera TilePro, more than 60 cores on a single chip."
- Slide 44, headings "**Intel multicore chips**" over (a) and "**AMD**" over (b). (a) "A quad-core chip with a shared L2 cache.": Core 1, Core 2, Core 3, Core 4, each with a small hatched L1 square, all connected to one central "L2 cache" block. (b) "A quad-core chip with separate L2 caches.": Core 1-4 each with a hatched corner labelled "**L1 cache**" and its own "**L2**" box.
- Slide 45, "**Multiprocessors and Multi-computers**": "Processor-Level Parallelism — **Multiprocessors**" and "Processor-Level Parallelism — **Multi-computers**". Figure 2-8: (a) "A single-bus multiprocessor": four **CPU** boxes and one "**Shared memory**" on one **Bus**. (b) "A multicomputer with local memories": four CPU boxes, each with its own box above labelled "**Local memories**", plus a "Shared memory" box, on one Bus.

## Memory hierarchy and registers (slides 46-49)
- Slide 46, "**Memory**", figure "A typical memory hierarchy. The numbers are very rough approximations." A pyramid with two red-boxed headings and downward arrows "**Typical access time**" (left) and "**Typical capacity**" (right):

| Typical access time | Level | Typical capacity |
|---|---|---|
| 1 nsec | Registers | <1 KB |
| 2 nsec | Cache | 4 MB |
| 10 nsec | Main memory | 1 - 8 GB |
| 10 msec | Magnetic disk | 1 - 4 TB |

- Slide 47, "**Registers**":
  - "Local fast memories"
  - "All CPUs contain some registers inside to hold key variables and temporary results e.g."
    - "**PC** (program counter) which contains the memory address of the next instruction to be fetched."
    - "**Stack pointer**, which points to the top of the current stack in memory."
    - "**PSW** (Program Status Word) which contains the condition code bits, which are set by comparison instructions, the CPU priority, the mode (user or kernel), and various other control bits. User programs may normally read the entire PSW but typically may write only some of its fields."
    - "The PSW plays an important role in system calls and I/O."
- Slide 48, "**EFLAGS Register**" (Intel figure). 32-bit register, bits 31 → 0:

| Bits | 31-22 | 21 | 20 | 19 | 18 | 17 | 16 | 15 | 14 | 13-12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Content | 0 (reserved, grey) | ID | VIP | VIF | AC | VM | RF | 0 | NT | IOPL | OF | DF | IF | TF | SF | ZF | 0 | AF | 0 | PF | 1 | CF |

  Legend list (letter = flag class): X ID Flag (ID); X Virtual Interrupt Pending (VIP); X Virtual Interrupt Flag (VIF); X Alignment Check (AC); X Virtual-8086 Mode (VM); X Resume Flag (RF); X Nested Task (NT); X I/O Privilege Level (IOPL); S Overflow Flag (OF); C Direction Flag (DF); X Interrupt Enable Flag (IF); X Trap Flag (TF); S Sign Flag (SF); S Zero Flag (ZF); S Auxiliary Carry Flag (AF); S Parity Flag (PF); S Carry Flag (CF). "S Indicates a Status Flag; C Indicates a Control Flag; X Indicates a System Flag". Grey key: "Reserved bit positions. DO NOT USE. Always set to values previously read."
- Slide 49, "**EFLAGS Register**", flag definitions verbatim:
  - "**CF (bit 0)** **Carry flag** — Set if an arithmetic operation generates a carry or a borrow out of the most-significant bit of the result; cleared otherwise. This flag indicates an overflow condition for unsigned-integer arithmetic. It is also used in multiple-precision arithmetic."
  - "**PF (bit 2)** **Parity flag** — Set if the least-significant byte of the result contains an even number of 1 bits; cleared otherwise."
  - "**AF (bit 4)** **Auxiliary Carry flag** — Set if an arithmetic operation generates a carry or a borrow out of bit 3 of the result; cleared otherwise. This flag is used in binary-coded decimal (BCD) arithmetic."
  - "**ZF (bit 6)** **Zero flag** — Set if the result is zero; cleared otherwise."
  - "**SF (bit 7)** **Sign flag** — Set equal to the most-significant bit of the result, which is the sign bit of a signed integer. (0 indicates a positive value and 1 indicates a negative value.)"
  - "**OF (bit 11)** **Overflow flag** — Set if the integer result is too large a positive number or too small a negative number (excluding the sign-bit) to fit in the destination operand; cleared otherwise. This flag indicates an overflow condition for signed-integer (two's complement) arithmetic."
  - "**IOPL (bits 12 and 13)** **I/O privilege level field** — Indicates the I/O privilege level of the currently running program or task. The current privilege level (CPL) of the currently running program or task must be less than or equal to the I/O privilege level to access the I/O address space. The POPF and IRET instructions can modify this field only when operating at a CPL of 0."

## Cache memory (slides 50-57)
- Slide 50, "**Cache Memory**":
  - "**Imbalance Between CPU and Memory** • Historically, CPU is faster than memories. • The capacity of memories are increased, not speed. • The slower the memory, the more cycles the CPU will have to wait."
  - "**Practical Solution** • Cache memory (**L1**, **L2**, and **L3**) • Main memories and caches are divided up into fixed-size blocks (**cache lines**) e.g. typically 64 bytes."
  - CPU-Z "Caches" tab screenshot:

| Cache | Size | × | Descriptor |
|---|---|---|---|
| L1 D-Cache | 32 KBytes | x 2 | 8-way set associative, 64-byte line size |
| L1 I-Cache | 32 KBytes | x 2 | 8-way set associative, 64-byte line size |
| L2 Cache | 256 KBytes | x 2 | 4-way set associative, 64-byte line size |
| L3 Cache | 3 MBytes | | 12-way set associative, 64-byte line size |

- **Example (slide 51)**: "Obtain the number of cache lines and sets for **L1D** Cache?" (same CPU-Z screenshot). Instructor's arithmetic, verbatim:
  - "Total L1D = 32KB x 2 = 64 KB"
  - "Number of cache lines = 64 KB/64B = 64x1024/64 = **1024**"
  - "Number of sets = Number of cache lines/8 = **128**" (8 = the 8-way associativity from the descriptor)
- **Example (slide 52)**: "a **64-byte** line size, a reference to memory address 260, what line is pulled into one cash line ?" (sic "cash"). Figure: five columns, each a cache line of 64 bytes with its address range: **0-63**, **64-127**, **128-191**, **192-255**, **256-319**; brace below "**cache lines**". A box "**260**" with an arrow into the fifth column, which is framed by a red dashed box.
  - Answer shown by the figure: the line holding addresses **256 to 319** is pulled in. [my arithmetic, unverified] 260 ÷ 64 = 4 remainder 4, so it is line number 4 (counting from 0), byte offset 4.
- Slide 53, "**Mapping Techniques**": "1. **Direct mapping.** 2. **Associative mapping.** 3. **Set - Associative mapping.**" Figure: **Memory** with 16 blocks indexed 0-15 (index labels coloured in groups of four: 0-3 red, 4-7 blue, 8-11 orange, 12-15 green); **Cache** with 4 lines indexed 0-3. Arrows: memory block 3 (red) → cache line 3; block 10 (orange) → cache line 2; block 13 (green) → cache line 1; cache line 0 empty. Tags at the right of the cache: line 1 ← 13, line 2 ← 10, line 3 ← 3.
- Slide 54 adds callouts "**Memory Index (MI)**" (pointing at the memory indexes) and "**Cache Index (CI)**" (pointing at the cache indexes), and the box:

```
Direct mapping
      CI = MI % (# of cache lines)
e.g.
# of cache lines = 4
CI = 3  % 4 = 3
CI = 10 % 4 = 2
CI = 13 % 4 = 1
```

- **Direct-mapping trace (slide 55)**, heading "Direct mapping". "MI" reference string (green bar): **9 2 3 0 12 12 7 0 6 4 6 1 7 2 14** (15 references). Per-line history as printed (subscript = reference position; red subscript = hit):
  - "[0] 0₄, 12₅, 12₆(red), 0₈, 4₁₀,"
  - "[1] 9₁, 1₁₂,"
  - "[2] 2₂, 6₉, 6₁₁(red), 2₁₄, 14₁₅,"
  - "[3] 3₃, 7₇, 7₁₃(red),"
  - Result box: "**Miss : 12  Hit : 3  Miss rate : 80.000%  Hit rate : 20.000%**"
  - Step by step (CI = MI % 4; my reconstruction of the printed history, which it matches):

| # | MI | CI = MI % 4 | Line held before | Result |
|---|---|---|---|---|
| 1 | 9 | 1 | empty | miss |
| 2 | 2 | 2 | empty | miss |
| 3 | 3 | 3 | empty | miss |
| 4 | 0 | 0 | empty | miss |
| 5 | 12 | 0 | 0 | miss |
| 6 | 12 | 0 | 12 | **hit** |
| 7 | 7 | 3 | 3 | miss |
| 8 | 0 | 0 | 12 | miss |
| 9 | 6 | 2 | 2 | miss |
| 10 | 4 | 0 | 0 | miss |
| 11 | 6 | 2 | 6 | **hit** |
| 12 | 1 | 1 | 9 | miss |
| 13 | 7 | 3 | 7 | **hit** |
| 14 | 2 | 2 | 6 | miss |
| 15 | 14 | 2 | 2 | miss |

    Misses 12, hits 3; miss rate 12/15 = 80%, hit rate 3/15 = 20%.
- Slide 56, "**Cache size vs Memory size**": two CPU-Z screenshots.
  - CPU tab: Name Intel Core i5 10310U; Code Name Comet Lake-U/Y; Max TDP 15.0 W; Package Socket 1528 FCBGA; Technology 14 nm; Core VID 0.634 V; Specification Intel® Core™ i5-10310U CPU @ 1.70GHz; Family 6, Model E, Stepping C; Ext. Family 6, Ext. Model 8E, Revision C0; Instructions MMX, SSE, SSE2, SSE3, SSSE3, SSE4.1, SSE4.2, EM64T, VT-x, AES, AVX, AVX2, FMA3; Clocks (Core #0): Core Speed 897.80 MHz, Multiplier x 9.0 (4 - 44), Bus Speed 99.76 MHz; Selection Socket #1. Cache (highlighted yellow): L1 Data **4 x 32 KBytes 8-way**; L1 Inst. **4 x 32 KBytes 8-way**; Level 2 **4 x 256 KBytes 4-way**; Level 3 **6 MBytes 12-way**. Yellow callout: "**64-byte line  Total < 8MB**".
  - Memory tab: General Type **DDR4**, Size **16 GBytes**, Channel # Single, Uncore Frequency 598.5 MHz. Red callout: "**Total = 16GB**". Timings: DRAM Frequency 665.1 MHz; FSB:DRAM 1:10; CAS# Latency (CL) 10.0 clocks; RAS# to CAS# Delay (tRCD) 10 clocks; RAS# Precharge (tRP) 10 clocks; Cycle Time (tRAS) 28 clocks; Row Refresh Cycle Time (tRFC) 234 clocks; Command Rate (CR) 1T.
  - [my arithmetic, unverified] cache total = 4×32 + 4×32 + 4×256 KB + 6 MB = 1.25 MB + 6 MB = 7.25 MB, hence "< 8MB" against 16 GB of RAM.
- Slide 57, "**Cache size vs Memory size**":
  - "**Caching system issues** A. When to put a new item into the cache. B. Which cache line to put the new item in. C. Which item to remove from the cache when a slot is needed. D. Where to put a newly evicted item in the larger memory."
  - "There are some algorithms which are used to replace the existing block in the cache memory with the new fetched data."
  - "**Cache Replacement Algorithms** 1. Least Recently Used (LRU). 2. First In First Out (FIFO). 3. Least Frequently Used (LFU). 4. Random. 5. Clock algorithm." (Named only; no slide defines them.)

## RAM (slide 58)
- "**RAM** 1. Memory is part of computer and contains a number of cells. 2. Programs and data are stored in memory. 3. The basic unit of memory is **bit {0, 1}**. 4. Other Units 1 byte = 8 bits. word = 1, 2, .. Byte"
- Figure "Three ways of organizing a 96-bit memory":
  - (a) addresses **0-11**, each cell **8 bits** (12 × 8 = 96)
  - (b) addresses **0-7**, "1 Cell" brace, each cell **12 bits** (8 × 12 = 96)
  - (c) addresses **0-5**, each cell **16 bits** (6 × 16 = 96)
- Table:

| Computer | Bits/cell |
|---|---|
| Burroughs B1700 | 1 |
| IBM PC | 8 |
| DEC PDP-8 | 12 |
| IBM 1130 | 16 |
| DEC PDP-15 | 18 |
| XDS 940 | 24 |
| Electrologica X8 | 27 |
| XDS Sigma 9 | 32 |
| Honeywell 6180 | 36 |
| CDC 3600 | 48 |
| CDC Cyber | 60 |

## Disks and SSDs (slides 59-62)
- Slide 59, "**Disks**": "• A disk consists of one or more metal platters that rotate at 5400, 7200, 10,800 RPM or more. • A mechanical arm pivots over the platters from the corner. • The outer cylinders contain more sectors than the inner ones."
  - Figure "Structure of a disk drive": four platters on a spindle with surfaces labelled **Surface 0** (bottom) to **Surface 7** (top), two surfaces per platter; heads on an arm assembly labelled "**Read/write head (1 per surface)**"; a double arrow "**Direction of arm motion**".
- Slide 60, "**Disks**": "• Moving the arm from one cylinder to the next takes about **1 msec**. Moving it to a random cylinder typically takes **5 to 10 msec**, depending on the drive. • Once the arm is on the correct track, the drive must wait for the needed sector to rotate under the head, an additional delay of **5 msec to 10 msec**, depending on the drive's RPM. • Once the sector is under the head, reading or writing occurs at a rate of **50 MB/sec** on low-end disks to **160 MB/sec** on faster ones."
- Slide 61, "**Solid State Disks**": photos of a Western Digital "WD BLUE 500GB 3D NAND SATA SSD Solid State Drive" and an Intel SSD circuit board. "• SSDs do not have moving parts, do not contain platters in the shape of disks, and store data in (Flash) memory. • they also store a lot of data which is not lost when the power is off."
- Slide 62, "**Solid State Disks**": CrystalDiskInfo 8.14.2 x64 screenshot: "SAMSUNG MZVLB512HBJQ-000L7 512.1 GB"; Health Status Good 100 %; Temperature 42 °C; Firmware 5M2QEXF7; Serial Number S4ENNX3R233750; Interface NVM Express; Transfer Mode PCIe 3.0 x4 | PCIe 3.0 x4; Drive Letter C:; Standard NVM Express 1.3; Features S.M.A.R.T., TRIM, VolatileWriteCache; Total Host Reads 2785 GB; Total Host Writes 3495 GB; Rotation Rate ---- (SSD); Power On Count 248 count; Power On Hours 623 hours; attribute row "01 Critical Warning 00000000000000".

## I/O devices (slides 63-68)
- Slide 63, "**I/O Devices**": "I/O units often consist of a **mechanical component** and an **electronic component** (device controller or adapter)." "The controller is a chip or a set of chips that physically controls the device." (underlined). Photo of the underside of a hard disk with arrows: "**Controller**" → the circuit board; "**Disks**" → the platter housing; "**Device**" → the whole drive.
- Slide 64, "**I/O Devices**":
  - "I/O devices also interact heavily with the operating system."
  - "The software that talks to a controller, giving it commands and accepting responses, is called a **device driver.** the driver has to be put into the operating system so it can run in kernel mode."
  - "Every controller has a small number of registers that are used to communicate with it."
  - "For example, a minimal disk controller might have registers for specifying the disk address, memory address, sector count, and direction (read or write)."
  - "**To activate the controller, the driver gets a command from the operating system, then translates it into the appropriate values to write into the device registers.**" (bold, underlined)
- Slide 65: "Input and output can be done in three different ways:"
  - "1. **Busy waiting** User program issues a system call, which the kernel then translates into a procedure call to the appropriate driver. The driver then starts the I/O and sits in a tight loop continuously polling the device to see if it is done (usually there is some bit that indicates that the device is still busy). When the I/O has completed, the driver puts the data (if any) where they are needed and returns. The operating system then returns control to the caller. This method is called busy waiting and has the disadvantage of tying up the CPU polling the device until it is finished." (last clause underlined)
- Slide 66:
  - "2. **Using interrupt** The second method is for the driver to start the device and ask it to give an interrupt when it is finished. At that point the driver returns. The operating system then blocks the caller if need be and looks for other work to do. When the controller detects the end of the transfer, it generates an **interrupt** to signal completion."
  - "3. **Use of special hardware** e.g. DMA (**Direct Memory Access**) The CPU sets up the DMA chip, telling it how many bytes to transfer, the device and memory addresses involved, and the direction, and lets it go. When the DMA chip is done, it causes an interrupt."
- Slide 67, figure "The steps in starting an I/O device and getting an interrupt": boxes **CPU**, **Interrupt controller**, **Disk controller** (with **Disk drive** above it), on a shared bus. Numbered arrows: **1** CPU → (along the bus) → Disk controller; **2** Disk controller → Interrupt controller; **3** Interrupt controller → CPU (thick arrow, direct); **4** Interrupt controller → (along the bus) → CPU. The slide gives no text for the steps.
  - [unverified, from memory of Tanenbaum] 1 = the driver tells the controller what to do by writing its device registers; 2 = when done, the controller signals the interrupt controller; 3 = the interrupt controller asserts a pin on the CPU; 4 = the interrupt controller puts the device number on the bus so the CPU can read it.
- Slide 68, figure "Interrupt processing involves taking the interrupt, running the interrupt handler, and returning to the user program": a memory column; rows "**Current instruction**", "**Next instruction**"; arrow "**1. Interrupt**" from Current instruction down into a grey (kernel) region; "**2. Dispatch to handler**" pointing at a small box labelled "**Interrupt handler**"; arrow "**3. Return**" from the handler back up to Next instruction.

## Buses (slides 69-72)
- Slide 69, "**I/O Devices — Buses**", figure "The structure of a large x86 system": the processor package (grey) holding **Core1/Cache**, **Core2/Cache**, **Shared cache**, **GPU Cores**, **Memory controllers**; Memory controllers ↔ **DDR3 Memory** on both sides; **PCIe** → **Graphics**. The package connects by **DMI** down to the **Platform Controller Hub**, which connects to four **PCIe slot** boxes (left), **SATA**, **USB 2.0 ports**, **USB 3.0 ports**, **Gigabit Ethernet** (via **PCIe**) (right), and **More PCIe devices** (below).
- Slide 70:
  - "**SCSI** (**Small Computer System Interface**) The SCSI bus is a high-performance bus intended for fast disks, scanners, and other devices needing considerable bandwidth. Nowadays, we find them mostly in servers and workstations. They can run at up to **640 MB/sec**."
  - "**USB** (**Universal Serial Bus**) Any USB device can be connected to a computer and it will function immediately, without requiring a reboot."
  - "**DMI** (Direct Media Interface) bus." (no further text)
  - "**PCI bus** An internal synchronous bus for interconnecting chips, expansion boards, and processor/memory subsystems e.g. used for connecting adapters such as hard disks, sound cards, network cards and graphics cards."
- Slide 71: "**PCI-Express** Ideal for video and graphics applications. Not using a shared bus configuration and has a devoted path, called a lane, to a single chip known as a switch." "Each lane (1x) has conductors for sending and receiving data (red and green colored arrows)." Figure: three PCI-E device ↔ Switch pairs: **x1** "1 lane" (one red up-arrow pair, one green down-arrow pair), **x2** "2 lanes", **x16** "16 lanes" (with "…").
- Slide 72, figure (no text): left, "**Shared BUS**": a **Host device** and three "**PCI PCI-X device**" boxes all on one horizontal bus line (↕ arrows). Right: **Host device** ↕ "**Switch (chip)**"; three "**PCI-E device**" boxes each joined to the switch by its own thick arrow labelled "**Lane(s)**".

## The Operating System Zoo (slides 73-76)
1. "**Mainframe Operating Systems** (*OS/390 and Linux*) Room-sized computers. A mainframe with 1000 disks and millions of gigabytes of data is not unusual. They typically offer three kinds of services: batch, transaction processing, and timesharing." (slide 73)
2. "**Server Operating Systems** (*Solaris, FreeBSD, Linux and Windows Server 201x*) They run on servers, which are either very large personal computers, workstations, or even mainframes." (slide 73)
3. "**Multiprocessor Operating Systems** (*Windows and Linux*)" (slide 74; no description)
4. "**Personal Computer Operating Systems** (*Linux, FreeBSD, Windows 7, Windows 8, and Apple's OS X*)" (slide 74; no description)
5. "**Handheld Computer Operating Systems** (*Android and Apple's iOS*)" (slide 74; no description)
6. "**Embedded Operating Systems** (*Embedded Linux, QNX and VxWorks*) Embedded systems run on the computers that control devices that are not generally thought of as computers and which do not accept user-installed software. Typical examples are microwave ovens, TV sets, cars, DVD recorders, traditional phones, and MP3 players." (slide 74)
7. "**Sensor Node Operating Systems** (*TinyOS*) Networks of tiny sensor nodes are being deployed for numerous purposes. These nodes are tiny computers that communicate with each other and with a base station using wireless communication. Sensor networks are used to protect the perimeters of buildings, guard national borders, detect fires in forests, measure temperature and precipitation for weather forecasting, glean information about enemy movements on battlefields, and much more." (slide 75)
8. "**Real-Time Operating Systems** (eCos) These systems are characterized by having time as a key parameter For example, in industrial process-control systems, real-time computers have to collect data about the production process and use it to control machines in the factory." (slide 75)
9. "**Smart Card Operating Systems** (*JVM*) Some smart cards are Java oriented. This means that the ROM on the smart card holds an interpreter for the Java Virtual Machine (JVM). Java applets (small programs) are downloaded to the card and are interpreted by the JVM interpreter." (slide 76)

## Processes (slides 77-79)
- Slide 77, "**Processes**": "• Key concept in all operating systems. • program in execution. • Process is associated with an address space. • Each process has some set of addresses it can use, typically running from 0 up to some maximum (address space). • Also associated with set of resources. • Process can be thought of as a container. – Holds all information needed to run program"
  - "In many operating systems, all the information about each process, other than the contents of its own address space, is stored in an operating system table called the **process table**, which is an array of structures, one for each process currently in existence."
- Slide 78: "Processes in UNIX have their memory divided up into three segments: the text segment (i.e., the program code), the data segment (i.e., the variables), and the stack segment. The data segment grows upward and the stack grows downward."
  - Left figure (stack detail): addresses in red decimal and hex, four cells: **100 0x64 A** (callout "**Base Of Stack**"), **99 0x63 B**, **98 0x62 C**, **97 0x61 D** (blue, callout "**Top Of Stack (TOS)**"). The stack has grown down from 100 to 97.
  - Right figure, "Processes have three segments: text, data, and stack.": column headed "Address (hex)", top **FFFF**, bottom **0000**. Top to bottom: **Stack** (arrow pointing down), **Gap** (hatched), **Data** (arrow pointing up), **Text**.
- Slide 79, figure "A process tree. Process A created two child processes, B and C. Process B created three child processes, D, E, and F.": A → B, C; B → D, E, F.
  - Terminal output (pstree-style):

```
OS:>>
?(1)──mintty(345)──bash(346)──child_fork(598)─┬─child_fork(601)
                                              └─child_fork(599)──child_fork(600)
```

## Files (slides 80-86)
- Slide 80, "**Files**":
  - "a major function of the operating system is to hide the peculiarities of the disks and other I/O devices and present the programmer with a nice, clean abstract model of device-independent files."
  - "**Files** are logical units of information created by processes."
  - "**Directory,** a way of grouping files together. File hierarchies are organized as trees."
  - "Every file in UNIX has a unique number, its i-number, that identifies it. This i-number is an index into a table of i-nodes, one per file, telling who owns the file, where its disk blocks are, and so on."
  - "A directory is simply a file containing a set of (i-number, ASCII name) pairs."
- Slide 81 (no title): terminal session:

```
~$ pwd
/home/user
~$ ls -i --format=single-column
133 T1.term
258 main1
259 main2
  6 main2.c
261 temp
```

  - The i-number column is boxed; a callout explains it: "**-i, --inode** print the index number of each file". An arrow runs from "6 main2.c" to a box "**Inode 6**": a header row "**Attributes**" and five shaded rows braced "**Disk addresses**"; an arrow from one disk-address row points to a run of shaded blocks in a grid (the file's disk blocks).
- Slide 82: "Every file within the directory hierarchy can be specified by giving its path name from the root directory. The path for file CS101 is"

```
/Faculty/Prof.Brown/Courses/CS101        (Unix)
\Faculty\Prof.Brown\Courses\CS101        (MS_DOS)
```

  - "Before a file is read or written, it must be opened by checking the permissions. If the access is permitted, the system returns a small integer called a file descriptor to use in subsequent operations. If the access is prohibited, an error code is returned."
- Slide 83, figure "A file system for a university department.": **Root directory** → **Students** and **Faculty**. Students → **Robbert**, **Matty**, **Leo** (directories, with arrows onward). Faculty → **Prof.Brown**, **Prof.Green**, **Prof.White**. Prof.Brown → **Courses**, **Papers**, **Grants**, **Committees**. Courses → **CS101**, **CS105**. Papers and Grants → small circles braced "**Files**" (three each). Committees → **SOSP**, **COST-11**. (Directories drawn as stacked-row boxes, files as circles.)
- Slide 84: "The mount system call allows the file system on the CD-ROM to be attached to the root file system wherever the program wants it to be." "File systems are nearly always mounted on empty directories." (last two words underlined)
  - Figure "(a) Before mounting, the files on the CD-ROM are not accessible. (b) After mounting, they are part of the file hierarchy.": (a) **Root** → a, b; a → c, d; b empty. Separate **CD-ROM** → x, y. (b) one tree: root → a, b; a → c, d; **b → x, y** (the CD-ROM is mounted on b).
- Slide 85: "•A **pipe** is a sort of pseudofile that can be used to connect two processes. One process generates some output that another process uses as input." Figure "Two processes connected by a pipe.": circle **Process A** —**Pipe**— circle **Process B**.
- Slide 86 (no title): terminal running a pipeline (word-frequency count):

```
OS:>> cat test.txt | tr '[A-Z]' '[a-z]' | tr -C '[a-z]' '\n'|sort| uniq -c|sort -rn
    283
    115 the
     52 and
     31 to
     22 of
     21 was
     20 cow
     19 they
     18 in
     17 that
     16 as
     15 her
     14 their
     14 a
     13 out
     12 she
     11 bell
     11 at
     10 so
      9 with
```

  (The first line, 283 with no word, counts the empty lines produced by the non-letter-to-newline translation.) [my reading, unverified]

## Protection (slides 87-88)
- Slide 87, "**Protection**": "Computers contain large amounts of information that users often want to protect and keep confidential. This information may include email, business plans, tax returns, and much more. It is up to the operating system to manage the system security so that files, for example, are accessible only to authorized users."
  - "Files in UNIX are protected by assigning each one a 9-bit binary protection code. The protection code consists of three 3-bit fields, one for the owner, one for other members of the owner's group (users are divided into groups by the system administrator), and one for everyone else. Each field has a bit for read access, a bit for write access, and a bit for execute access. These 3 bits are known as the **rwx** bits." (the three fields underlined, "one for the owner", "one for other members of the owner's group", "one for everyone else" in red)
  - Terminal:

```
-rw-r--r-- 1 A01234567 AD+Group(513)  6340 Jul 18 21:30 res.txt
-rwxr-xr-x 1 A01234567 AD+Group(513)   191 Jul 18 21:50 run.txt
```

- Slide 88, "**Protection — Linux file types**":

| Letter | Type (slide wording) |
|---|---|
| – | regular file |
| d | directory |
| c | character device file |
| b | block device file |
| s | local socket file |
| p | named pipe |
| l | symbolic link |

  - Callout "**Protection bits**" points at the nine characters after the type letter (highlighted `rwxrwxr-x` on the first line). Arrows link "–", "p" and "l" in the list to example lines.

```
asp@asp-VirtualBox:~/Desktop/test$ ls -al
total 12
drwxrwxr-x 3 asp  asp  4096 Jun 17 08:33 .
drwxr-xr-x 4 asp  asp  4096 Jun 17 08:23 ..
drwxrwxr-x 2 asp  asp  4096 Jun 17 08:25 libs
lrwxrwxrwx 1 asp  asp     8 Jun 17 08:25 l_thread -> thread.c
brw-r--r-- 1 root root 1, 2 Jun 17 08:28 my_block_dev
crw-r--r-- 1 root root 4, 3 Jun 17 08:29 my_char_dev
prw-r--r-- 1 root root    0 Jun 17 08:30 my_npipe_dev
-rw-rw-r-- 1 asp  asp     0 Jun 17 08:23 thread.c
asp@asp-VirtualBox:~/Desktop/test$
```

  (The first column, the type letters d d d l b c p -, is highlighted.)

## Beyond the slides (label as such in lessons)
- The deck ends at slide 88 with no summary slide and no system-calls section.
- Terms the caller's checklist mentions but the deck never shows: **daemon**, **interrupt vector**. Not on any slide.
- The ALU example's simulator labels the INC input "Cin"; the operation table calls it INC.
- Pipelining formula application to the car example (slide 40 note) is ours; the slides give the formulas and the car numbers separately.
- The step-by-step direct-mapping table on slide 55 is our reconstruction; it matches the printed per-line history and totals exactly.

## Conflicts and open questions
- Slide 18 says "Device drivers and the core operating system components run in Ring 0" and also "Ring 1 and 2 : Operating System Services (Device Drivers, Etc.)". The slide puts device drivers in both places. [unverified, from memory of Tanenbaum / common practice] Mainstream OSes (Windows, Linux) use only Ring 0 and Ring 3; rings 1-2 are rarely used.
- Slide 51 adds the two cores' L1D caches (32 KB × 2 = 64 KB) before dividing. Per core it would be 32 KB / 64 B = 512 lines and 512 / 8 = 64 sets. Teach the slide's 1024 / 128 and note the convention.
- Slide 27's ALU figure label reads "NVA" (cropped "INVA").
- Slide 31's fourth memory word "1010100" has 7 bits, the others 8.
- Slide 52 writes "cash line" (means cache line).
- Slide 35: OPEN "Which assembly line is faster ?" (see the pipelining section for the [my answer, unverified]).
- Slide 67's numbered steps 1-4 have no text on the slide.
- Slide 75's real-time example "eCos" is not italicised like the other examples (cosmetic).
- Slide 70's "DMI (Direct Media Interface) bus." has no definition.
- Slide 43's first bullet describes multithreading without naming it.
- Footer credits MOS 4th ed. but slides 2-10, 27-30, 34, 41, 45 and 58 reproduce figures that are from Tanenbaum's *Structured Computer Organization* [unverified, from memory of Tanenbaum].

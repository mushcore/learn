---
title: The six-level machine
minutes: 12
---

A computer is too complicated to describe in one piece, so the course describes it as a stack of levels, each built from the one below. The operating system is one of those levels, and its neighbours explain what it hides and what it serves.

## Six levels, numbered from the bottom

Slide 2, *Current Multilevel Machines*, stacks six boxes. Level 0 is at the bottom, and every level is built out of the level beneath it.

| Level | Slide 2 label | What slides 3 to 10 put there |
|---|---|---|
| 5 | High programming language level | Java, Python, C++ |
| 4 | Assembly language level | human-readable instructions, many lines |
| 3 | Operating System (OS) level | memory, processes, protection |
| 2 | Instruction Set Architecture (ISA) level | the list of basic operations |
| 1 | Microarchitecture level | ALU, registers, microprograms |
| 0 | Digital level | transistors and logic gates |

The operating system sits in the middle: two language levels above it, three hardware levels below it. Slides 3 to 10 grey out every box but one and caption it, one level per slide.

## Level 0, the digital level

Slide 3: *Device level made of transistors and in turn transistors are made of semiconductors. AND, OR, and NOT are the building blocks of any digital circuits*

Slide 4 shows how far those three gates reach. It draws the AND, OR and NOT symbols, then a small memory built from gates and D flip-flops (four words of three bits each, with select lines and an output enable), then a 1-bit ALU built from gates, and an arrow from that ALU to a CPU block holding a **Control Unit**, an **ALU** and **Registers**. Memory, the ALU and the registers are all gates underneath. The CPU block returns in [the CPU lesson](#/comp4736-p1/cpu).

## Level 1, the microarchitecture level

Slide 5 follows a program down to this level: *Assume that a program written in a high level language is translated to the low level machine language. A file is created after compilation containing some instructions in machine codes. The instructions are executed in this level employing ALU, Registers, and Microprograms.*

Compiling happens far above. Executing the resulting machine code happens here, with real circuits.

## Level 2, the ISA level

Slide 6 defines it in three sentences: *An ISA describes the design of a Computer in terms of the basic operations it must support. The ISA is not concerned with the implementation specific details of a computer. It is only concerned with the set or collection of basic operations the computer must support.*

The ISA answers **what** the machine can do. **How** it does it (which ALU, how many registers, microprogrammed or not) belongs to Level 1. Two processors with the same ISA can be built quite differently inside.

Slide 7 gives a real ISA as the example: the *Instruction Set Summary* of the **ATmega16 (8-bit AVR microcontroller)**. Three of its rows:

| Mnemonics | Operands | Description | Operation | Flags | #Clocks |
|---|---|---|---|---|---|
| ADD | Rd, Rr | Add two Registers | Rd ← Rd + Rr | Z,C,N,V,H | 1 |
| RJMP | k | Relative Jump | PC ← PC + k + 1 | None | 2 |
| LDI | Rd, K | Load Immediate | Rd ← K | None | 1 |

The table is grouped into arithmetic and logic, branch, data transfer, and bit and bit-test instructions. Every row says what an instruction does, which flags it touches and how many clock cycles it takes. No row says how the adder is wired: that is exactly the line slide 6 draws.

## Level 3, the operating system level

Slide 8: *Main duties : Memory management, processes execution, and system resource protection.* Slide 11 repeats the sentence and adds *e.g. Linux, windows, Mac*.

Those three duties are the rest of this course: memory, processes, and keeping programs from damaging each other or the hardware. [The next lesson](#/comp4736-p1/what-the-os-is) says what kind of thing the OS is.

## Levels 4 and 5, the language levels

Slide 9 describes assembly language: *Human readable language, hard to work with, time consuming, and even a simple program contains many lines.*

Slide 10 describes the top: *In this level people usually write programs in languages such as Java, Python, and C++.*

A Level 5 program does not run as written. A compiler turns it into the machine code that slide 5 has Level 1 execute.

```quiz
[
  {
    "q": "Write the level number of each box on slide 2.",
    "type": "fill",
    "code": "Level ___   High programming language level\nLevel ___   Assembly language level\nLevel ___   Operating System (OS) level\nLevel ___   Instruction Set Architecture (ISA) level\nLevel ___   Microarchitecture level\nLevel ___   Digital level",
    "answer": ["5", "4", "3", "2", "1", "0"],
    "explain": "Numbering starts at the bottom: Digital 0, Microarchitecture 1, ISA 2, OS 3, Assembly 4, High programming language 5. The OS sits above the ISA and below assembly."
  },
  {
    "q": "Match each level to the slide's description of it.",
    "type": "match",
    "pairs": [
      ["Digital level", "Device level made of transistors; AND, OR and NOT are the building blocks"],
      ["Microarchitecture level", "Machine-code instructions are executed using ALU, Registers and Microprograms"],
      ["ISA level", "The set of basic operations the computer must support"],
      ["OS level", "Memory management, processes execution, and system resource protection"],
      ["Assembly language level", "Human readable, hard to work with, time consuming"],
      ["High programming language level", "Programs written in Java, Python and C++"]
    ],
    "explain": "Slides 3 to 10 caption one level each, from Level 0 (digital) up to Level 5 (high-level languages)."
  },
  {
    "q": "The ISA specifies how the computer's ALU is built.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 6: the ISA is not concerned with the implementation specific details of a computer. It is only concerned with the set of basic operations the computer must support. How the ALU is built belongs to the microarchitecture level."
  },
  {
    "q": "Which level's main duties are memory management, processes execution, and system resource protection?",
    "options": ["Operating System (OS) level", "Instruction Set Architecture (ISA) level", "Microarchitecture level", "Assembly language level"],
    "answer": 0,
    "explain": "Slide 8 gives these as the OS level's main duties; slide 11 adds Linux, Windows and Mac as examples."
  },
  {
    "q": "At which level are the compiled machine-code instructions executed using the ALU, registers and microprograms?",
    "options": ["Microarchitecture level", "Digital level", "ISA level", "OS level"],
    "answer": 0,
    "explain": "Slide 5: a file of machine code is created after compilation, and the instructions are executed in the microarchitecture level employing ALU, Registers, and Microprograms. The digital level below supplies the gates those parts are made of."
  },
  {
    "q": "AND, OR, and NOT are the building blocks of any digital circuits.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 3, the digital level. Slide 4 then builds a memory, a 1-bit ALU and the CPU block out of those gates."
  },
  {
    "q": "Slide 3: transistors are in turn made of ________.",
    "type": "text",
    "answer": ["semiconductors", "semiconductor"],
    "explain": "The digital level is a device level made of transistors, and transistors are made of semiconductors."
  },
  {
    "q": "Slide 7's ATmega16 Instruction Set Summary (ADD, RJMP, LDI, ...) is an example of which level?",
    "options": ["ISA level", "Assembly language level", "Microarchitecture level", "Digital level"],
    "answer": 0,
    "explain": "The table lists the basic operations the 8-bit AVR microcontroller supports, with their flags and clock counts, and nothing about circuits: an instruction set architecture."
  },
  {
    "q": "The assembly language level sits directly below the operating system level.",
    "type": "tf",
    "answer": false,
    "explain": "Assembly is Level 4, directly above the OS at Level 3. Directly below the OS is the ISA, Level 2."
  }
]
```

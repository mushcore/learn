---
title: ALU, control unit, registers, fetch-decode-execute, RISC and CISC
minutes: 18
---

The operating system manages the CPU, so it helps to know what is inside one: what does the arithmetic, what decides which arithmetic to do, and where the numbers wait in between.

## The CPU and its neighbours on the bus

Slide 24, *Some of the components of a simple personal computer*, puts everything on one horizontal **Bus**:

| On the bus | Connected device |
|---|---|
| CPU (with a small **MMU** box inside) | |
| Memory | |
| Video controller | Monitor |
| Keyboard controller | Keyboard |
| USB controller | USB printer |
| Hard disk controller | Hard disk drive |

Only the CPU and memory sit on the bus directly. Every device reaches it through its own **controller**, which is why [the I/O lesson](#/comp4736-p1/io-devices) talks to controllers, not to disks. The monitor, keyboard, printer and disk are peripherals; the CPU is not.

## The CPU block on slide 26

Slide 26 draws the CPU as one box holding a **Control Unit**, an **ALU** and **Registers** (six register slots), with arrows between each pair. The same block closes the digital-level figure on slide 4, where it is built from gates. Registers get their own lesson ([PC, stack pointer, PSW](#/comp4736-p1/memory-and-registers)); this one covers the other two.

## Inside the 1-bit ALU

Slide 27 is a 1-bit ALU circuit in three dashed boxes:

- a **Logical unit** producing *AB*, *A + B* and *B̄* (here *A + B* is the OR gate's output);
- a **Decoder** that turns the two inputs **F₀** and **F₁** into four **Enable lines**, choosing which result reaches the **Output**;
- a **Full adder** with **Carry in**, **Sum** and **Carry out**.

Before A and B reach those boxes, **ENA** and **ENB** can switch either input off, and **INVA** can invert A. The slide's example uses an 8-bit ALU: eight bits side by side, the carry out of each bit feeding the carry in of the next.

## Six control bits choose the operation

Slide 28, *ALU (list of operations)*. INC is the carry into the lowest bit, so INC = 1 adds one.

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

In this table *A + B* is addition: F₀F₁ = 11 selects the full adder. Every row is a logic or arithmetic result. None of them stores anything; holding values is the registers' job.

## B − A in 8 bits

Slides 29 and 30: *Use the ALU operation table to obtain B – A where A = 3 and B = 4 (use 8-bit representation for each number).* A = `00000011`, B = `00000100`.

Write the six control bits and the 9-bit result (carry out first) before you read on.

The slide's filled row:

| A | B | INVA | F0 | F1 | ENA | ENB | INC | Res (Out) |
|---|---|---|---|---|---|---|---|---|
| 00000011 | 00000100 | 1 | 1 | 1 | 1 | 1 | 1 | **1**00000001 |

The instructor's arithmetic, as on the slide:

- *B – A = B + NOT(A) + 1 = 00000100 +NOT(00000011) + 1*
- *= 00000100 + 11111100 + 1 = 100000000+1 = 100000001*

Each bit has a reason. ENA = ENB = 1 lets both numbers in. INVA = 1 turns A into NOT A = `11111100`. F₀F₁ = 11 picks the adder, and INC = 1 adds the final 1. NOT A + 1 is −A in two's complement, so the adder is really computing B + (−A).

The leading 1, red on the slide, is the carry out. In 8 bits it falls off, and **Res = 00000001 = 1**, which is 4 − 3. The slide's simulator shows the same: Cout = 1, Res = 1 (its carry-in pin is labelled Cin; the table calls it INC).

### B − A with A = 3 and B = 4 on the ALU

The widget sets the six control bits for the chosen operation and shows NOT A, the sum and the carry. Click bits of A or B to try other values.

```widget
alu-calc
{ "a": 3, "b": 4, "op": "sub" }
```

## Fetch-decode-execute

Slide 31, *Control unit — Instruction execution*, follows one program. *High Level Code C++, Java, JavaScript* goes through the **Compiler** and becomes *Machine code*, binary words stored in **Memory**. From memory an instruction travels into the CPU's **Registers**. The **Control Unit** decodes it and directs the **ALU** to execute it; the result goes back to the registers, and the cycle repeats with the next instruction.

The control unit is the part that decodes instructions and coordinates the others. It computes nothing itself. Its box on slide 31 reads *Microprogram OR Hardwired*: the two ways to build one.

## RISC and CISC

Slide 32 pairs each way with a family of processors:

| RISC | CISC |
|---|---|
| AVR | AMD |
| ARM | Pentium |
| MIPS | VAX |
| **Hardwired Approach** | **Microprogrammed Approach** |

A hardwired control unit decodes with fixed logic gates. A microprogrammed one runs each machine instruction as a short internal program, the *Microprograms* of slide 5's Level 1. The ATmega16 from [the multilevel lesson](#/comp4736-p1/multilevel-machines) is an AVR, so it is a RISC chip.

## Subtract 5 from 9, and 6 from 2, on the 8-bit ALU

Use the B − A row of slide 28 and 8-bit numbers. Write each line by hand before you check.

```quiz
[
  {
    "q": "A = 5 and B = 9. Fill in NOT A (8 bits) and B + NOT A + 1 (9 bits, carry out first).",
    "type": "fill",
    "code": "A              =  00000101\nNOT A          =  ___\nB              =  00001001\nB + NOT A + 1  = ___",
    "answer": ["11111010", "100000100"],
    "explain": "NOT A flips every bit: 00000101 → 11111010 (250). B + NOT A = 9 + 250 = 259 = 1 00000011. Adding INC's 1 gives 260 = 1 00000100. The leading 1 is the carry out."
  },
  {
    "q": "A = 5 and B = 9. What decimal value does the ALU's 8-bit Res show for B − A?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "Drop the carry out from 1 00000100: Res = 00000100 = 4, and 9 − 5 = 4."
  },
  {
    "q": "A = 6 and B = 2. What does the ALU produce for B − A?",
    "options": ["Res 11111100, carry out 0", "Res 00000100, carry out 1", "Res 11111100, carry out 1", "Res 00000100, carry out 0"],
    "answer": 0,
    "explain": "NOT A = NOT 00000110 = 11111001 (249). B + NOT A = 2 + 249 = 251 = 11111011. Adding 1 gives 252 = 11111100. 252 is below 256, so nothing carries out of bit 7: carry out 0."
  },
  {
    "q": "Read Res = 11111100 as a signed 8-bit two's-complement number. What is it in decimal?",
    "type": "numeric",
    "answer": -4,
    "tolerance": 0,
    "explain": "The top bit is 1, so the value is negative: 252 − 256 = −4. Check: invert 11111100 → 00000011 and add 1 → 00000100 = 4, so the number is −4, and 2 − 6 = −4."
  },
  {
    "q": "Write the six control bits that make the ALU compute A + 1.",
    "type": "fill",
    "code": "F0 = ___  F1 = ___  ENA = ___  ENB = ___  INVA = ___  INC = ___",
    "answer": ["1", "1", "1", "0", "0", "1"],
    "explain": "F0F1 = 11 selects the adder. ENA = 1 lets A in, ENB = 0 blocks B (it becomes 0), INVA = 0 keeps A as it is, and INC = 1 adds the 1: A + 0 + 1."
  }
]
```

```quiz
[
  {
    "q": "Slide 26's CPU block is made of which three parts?",
    "options": ["ALU, Control Unit and Registers", "ALU, Control Unit and RAM", "Cache, ALU and RAM", "Control Unit, RAM and Cache"],
    "answer": 0,
    "explain": "The CPU box holds a Control Unit, an ALU and Registers. RAM is the Memory box on the bus outside the CPU, and cache is a memory level, not one of the three parts."
  },
  {
    "q": "An ALU is built from logic gates.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 27's 1-bit ALU is gates: the logical unit (AND, OR, NOT), the decoder and the full adder. Slide 3 says AND, OR, and NOT are the building blocks of any digital circuits."
  },
  {
    "q": "Which of these is not an operation the ALU performs?",
    "options": ["Storing data", "A AND B", "B − A", "−A"],
    "answer": 0,
    "explain": "Every row of slide 28's operation list is a logic or arithmetic result (A AND B, A OR B, A + B, B − A, −A, ...). Holding data is the job of the registers and memory."
  },
  {
    "q": "What does the control unit do in the fetch-decode-execute cycle?",
    "options": ["Decodes instructions and coordinates the ALU and registers", "Performs the arithmetic and logic operations", "Stores the program's instructions", "Compiles high-level code into machine code"],
    "answer": 0,
    "explain": "On slide 31 the instruction comes from memory into the registers, the control unit decodes it and directs the ALU, which does the arithmetic. Memory stores the program, and the compiler runs before any of this."
  },
  {
    "q": "Put the steps of slide 31 in order for one instruction.",
    "type": "reorder",
    "lines": [
      "The compiler turns high-level code into machine code",
      "The machine code is stored in memory",
      "The instruction is fetched from memory into the CPU's registers",
      "The control unit decodes it",
      "The ALU executes it and the result returns to the registers"
    ],
    "explain": "Compile, store, then the cycle itself: fetch into the registers, decode in the control unit, execute in the ALU. The cycle repeats for the next instruction."
  },
  {
    "q": "Which processors does slide 32 list as RISC?",
    "options": ["AVR", "ARM", "MIPS", "Pentium", "VAX", "AMD"],
    "answer": [0, 1, 2],
    "explain": "RISC: AVR, ARM, MIPS (hardwired approach). CISC: AMD, Pentium, VAX (microprogrammed approach)."
  },
  {
    "q": "On slide 32, CISC processors use the ________ approach.",
    "options": ["microprogrammed", "hardwired", "pipelined", "superscalar"],
    "answer": 0,
    "explain": "RISC goes with the hardwired approach and CISC with the microprogrammed approach. Pipelining and superscalar design are performance improvements in the next lesson, not control-unit approaches."
  },
  {
    "q": "In the slide's B − A example (A = 3, B = 4), the carry out is 0.",
    "type": "tf",
    "answer": false,
    "explain": "00000100 + 11111100 + 1 = 100000001: the red leading 1 is a carry out of 1. Res keeps the low 8 bits, 00000001 = 1."
  },
  {
    "q": "Which ALU input inverts A?",
    "type": "text",
    "answer": ["INVA"],
    "explain": "INVA = 1 turns A into NOT A before it reaches the logical unit and the adder. ENA and ENB enable A and B; INC adds 1."
  },
  {
    "q": "In slide 24's figure, where is the MMU?",
    "options": ["Inside the CPU", "Inside the memory", "In the hard disk controller", "On the bus between the CPU and memory"],
    "answer": 0,
    "explain": "The MMU is drawn as a small box inside the CPU. The memory and the controllers are separate boxes on the bus."
  }
]
```

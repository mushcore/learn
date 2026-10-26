---
title: "The memory hierarchy, PC, SP, PSW and EFLAGS"
minutes: 14
---

No memory is at once fast, large and cheap, so a computer stacks several kinds, from a few registers inside the CPU down to the disk. The registers at the top also hold the CPU's own state: where the program is, where its stack is, and what mode it runs in.

## The memory hierarchy: faster at the top, larger at the bottom

Slide 46, *A typical memory hierarchy. The numbers are very rough approximations.* Two arrows run down the pyramid, *Typical access time* and *Typical capacity*:

| Level | Typical access time | Typical capacity |
|---|---|---|
| Registers | 1 nsec | <1 KB |
| Cache | 2 nsec | 4 MB |
| Main memory | 10 nsec | 1 - 8 GB |
| Magnetic disk | 10 msec | 1 - 4 TB |

Mind the unit on the last row: the disk is in milliseconds, the rest in nanoseconds. Each level down is slower and larger, and the jump from main memory to disk is by far the biggest. Registers are the fastest memory in the machine; the disk is the slowest. The cache between the CPU and main memory gets its own lesson, [Cache lines, sets, direct mapping and replacement](#/comp4736-p1/cache-mapping); the disk's timings are in [Disks and SSDs](#/comp4736-p1/disks).

## Registers: the PC, the stack pointer and the PSW

Slide 47, *Registers*: *Local fast memories*. *All CPUs contain some registers inside to hold key variables and temporary results e.g.*

| Register | Slide 47 |
|---|---|
| **PC** (program counter) | *contains the memory address of the next instruction to be fetched.* |
| **Stack pointer** | *points to the top of the current stack in memory.* |
| **PSW** (Program Status Word) | *contains the condition code bits, which are set by comparison instructions, the CPU priority, the mode (user or kernel), and various other control bits.* |

Two more sentences on the PSW: *User programs may normally read the entire PSW but typically may write only some of its fields.* and *The PSW plays an important role in system calls and I/O.* The PC holds an address, not the instruction itself. The mode bit is why the PSW's write rule matters: a user program that could write the mode field could switch itself into kernel mode, the protection that [Kernel mode, user mode and the four x86 rings](#/comp4736-p1/kernel-and-user-mode) depends on.

## Controllers have registers too

Registers are not only in the CPU. Slide 64, on I/O devices: *Every controller has a small number of registers that are used to communicate with it.* A disk controller has registers for the disk address, memory address, sector count and direction; the driver writes them to start a transfer. That is the rest of [Controllers, drivers, busy waiting, interrupts and DMA](#/comp4736-p1/io-devices).

## The EFLAGS register: Intel's PSW

Slide 48 shows Intel's 32-bit *EFLAGS Register* bit by bit. Each flag is a *Status Flag* (S), a *Control Flag* (C) or a *System Flag* (X); the grey positions are *Reserved bit positions. DO NOT USE. Always set to values previously read.* Bit 1 always reads 1.

| Bit | Flag | Class |
|---|---|---|
| 0 | CF Carry | S |
| 1 | (reserved, always 1) | |
| 2 | PF Parity | S |
| 4 | AF Auxiliary Carry | S |
| 6 | ZF Zero | S |
| 7 | SF Sign | S |
| 8 | TF Trap | X |
| 9 | IF Interrupt Enable | X |
| 10 | DF Direction | C |
| 11 | OF Overflow | S |
| 12–13 | IOPL I/O Privilege Level | X |
| 14 | NT Nested Task | X |
| 16–21 | RF, VM, AC, VIF, VIP, ID | X |

Slide 49 defines the status flags:

- **CF**: *Set if an arithmetic operation generates a carry or a borrow out of the most-significant bit of the result*. It *indicates an overflow condition for unsigned-integer arithmetic.*
- **PF**: *Set if the least-significant byte of the result contains an even number of 1 bits*.
- **AF**: a carry or borrow *out of bit 3 of the result*, used in BCD arithmetic.
- **ZF**: *Set if the result is zero; cleared otherwise.*
- **SF**: *Set equal to the most-significant bit of the result, which is the sign bit of a signed integer.*
- **OF**: the result is too large or too small to fit the destination; it *indicates an overflow condition for signed-integer (two's complement) arithmetic.*
- **IOPL** (bits 12 and 13): the current privilege level *must be less than or equal to the I/O privilege level to access the I/O address space.*

To read a value, write each hex digit as 4 bits and number the bits from 0 on the right. `0x00000046` ends in `0100 0110`: bits 1, 2 and 6 are set, so PF and ZF are on, plus the reserved bit 1.

## Read the flags in three EFLAGS values

Expand the low hex digits to bits and use the table above.

```quiz
[
  {
    "q": "EFLAGS holds `0x00000847`. Which flags are set?",
    "options": ["CF", "PF", "ZF", "SF", "OF", "IF"],
    "answer": [0, 1, 2, 4],
    "explain": "`0x847` = `1000 0100 0111`: bits 0, 1, 2, 6 and 11. Bit 0 is CF, bit 1 is the reserved 1, bit 2 is PF, bit 6 is ZF, bit 11 is OF. SF (bit 7) and IF (bit 9) are 0."
  },
  {
    "q": "EFLAGS holds `0x00000282`. Which flags are set?",
    "options": ["CF", "PF", "ZF", "SF", "IF", "OF"],
    "answer": [3, 4],
    "explain": "`0x282` = `0010 1000 0010`: bits 1, 7 and 9. Bit 1 is the reserved 1, bit 7 is SF, bit 9 is IF. Bits 0, 2, 6 and 11 are 0, so CF, PF, ZF and OF are clear."
  },
  {
    "q": "An arithmetic instruction produces the result 0. Which of these flags must be set?",
    "options": ["ZF", "PF", "SF", "CF"],
    "answer": [0, 1],
    "explain": "ZF: *Set if the result is zero*. PF: the low byte `00000000` holds zero 1 bits, and zero is an even number, so PF is set. SF copies the top bit, which is 0, so SF is clear. CF depends on whether the operation carried or borrowed out of the top bit, which a zero result does not tell you."
  },
  {
    "q": "An 8-bit result is `10000000`. Which of these flags are set?",
    "options": ["SF", "PF", "ZF"],
    "answer": [0],
    "explain": "SF copies the most-significant bit, 1, so SF is set. The byte holds one 1 bit, an odd number, so PF is clear. The result is not zero, so ZF is clear."
  }
]
```

```quiz
[
  {
    "q": "Which of the following is the fastest memory?",
    "options": ["Register", "Cache", "Main memory", "Magnetic disk"],
    "answer": 0,
    "explain": "Slide 46: registers 1 nsec, cache 2 nsec, main memory 10 nsec, magnetic disk 10 msec. Registers sit at the top of the hierarchy, inside the CPU."
  },
  {
    "q": "Fill in the typical access times from slide 46.",
    "type": "fill",
    "code": "Registers       ___ nsec\nCache           ___ nsec\nMain memory     ___ nsec\nMagnetic disk   ___ msec",
    "answer": ["1", "2", "10", "10"],
    "explain": "1 nsec, 2 nsec, 10 nsec, then 10 msec for the disk: the same 10, but milliseconds, a million times longer."
  },
  {
    "q": "On slide 46, how many times longer is a typical magnetic disk access than a typical main memory access?",
    "type": "numeric",
    "answer": 1000000,
    "tolerance": 0,
    "explain": "$10\\text{ msec} / 10\\text{ nsec} = (10 \\times 10^{-3}) / (10 \\times 10^{-9}) = 10^{6}$, one million."
  },
  {
    "q": "Match each register to what it holds.",
    "type": "match",
    "pairs": [
      ["PC", "the memory address of the next instruction to be fetched"],
      ["Stack pointer", "the top of the current stack in memory"],
      ["PSW", "condition code bits, CPU priority and the user or kernel mode"]
    ],
    "explain": "Slide 47. The PC holds an address, not the instruction. The PSW also carries various other control bits and plays an important role in system calls and I/O."
  },
  {
    "q": "User programs may normally write every field of the PSW.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 47: user programs may normally *read* the entire PSW but typically may *write* only some of its fields. If a user program could write the mode bit it could put itself in kernel mode."
  },
  {
    "q": "Registers exist only inside the CPU.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 64: every device controller has a small number of registers used to communicate with it, for example a disk controller's disk address, memory address, sector count and direction."
  },
  {
    "q": "Which EFLAGS flag is set if the result of an operation is zero? Give its two-letter name.",
    "type": "text",
    "answer": ["ZF", "zero flag", "Z"],
    "explain": "ZF, bit 6: *Set if the result is zero; cleared otherwise.*"
  },
  {
    "q": "The carry flag (CF) indicates an overflow condition for signed-integer arithmetic.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 49: CF indicates overflow for **unsigned**-integer arithmetic. OF (bit 11) is the flag for signed-integer (two's complement) overflow."
  },
  {
    "q": "Which field of the PSW records whether the CPU is in user or kernel mode?",
    "options": ["the mode", "the condition code bits", "the CPU priority", "the program counter"],
    "answer": 0,
    "explain": "Slide 47 lists the PSW's contents: the condition code bits (set by comparison instructions), the CPU priority, the mode (user or kernel) and various other control bits. The program counter is a separate register."
  }
]
```

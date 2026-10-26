---
title: Controllers, drivers, busy waiting, interrupts and DMA
minutes: 16
---

A disk transfer takes milliseconds and the CPU runs an instruction in nanoseconds. This lesson is about who sends the device its commands and what the CPU does while the device works.

## An I/O unit is a mechanical part and a controller

Slide 63: *I/O units often consist of a mechanical component and an electronic component (device controller or adapter).* *The controller is a chip or a set of chips that physically controls the device.*

The slide's photo is the underside of a hard disk. The circuit board is labelled **Controller**, the platter housing **Disks**, and the whole drive **Device**. A controller is also called an **adapter**.

## The device driver runs in kernel mode and writes the controller's registers

Slide 64 in four sentences:

- *The software that talks to a controller, giving it commands and accepting responses, is called a device driver.*
- *the driver has to be put into the operating system so it can run in kernel mode.*
- *Every controller has a small number of registers that are used to communicate with it.*
- *To activate the controller, the driver gets a command from the operating system, then translates it into the appropriate values to write into the device registers.*

The slide's minimal disk controller has four registers: *disk address, memory address, sector count, and direction (read or write)*. The driver needs kernel mode because user mode forbids *instructions that affect control of the machine or do Input/Output* ([kernel and user mode](#/comp4736-p1/kernel-and-user-mode)).

Controllers having registers is the fact behind the practice paper's "Registers are used just only in CPUs": False, as the [registers lesson](#/comp4736-p1/memory-and-registers) says. A device needs a driver because it sits behind a controller. Registers, cache and main memory are reached by ordinary instructions and need none.

## Busy waiting, interrupts and DMA

Slide 65 opens with *Input and output can be done in three different ways*. In each one the driver starts the device; they differ in what the CPU does next.

**1. Busy waiting** (slide 65). *User program issues a system call, which the kernel then translates into a procedure call to the appropriate driver. The driver then starts the I/O and sits in a tight loop continuously polling the device to see if it is done.* A busy bit says whether the device is still working. When it clears, the driver puts the data where they are needed and returns, and the OS returns control to the caller. The cost: *tying up the CPU polling the device until it is finished*.

**2. Using interrupt** (slide 66). *The second method is for the driver to start the device and ask it to give an interrupt when it is finished. At that point the driver returns. The operating system then blocks the caller if need be and looks for other work to do.* When the transfer ends, the controller *generates an interrupt to signal completion*.

**3. Use of special hardware**, DMA, **Direct Memory Access** (slide 66). *The CPU sets up the DMA chip, telling it how many bytes to transfer, the device and memory addresses involved, and the direction, and lets it go. When the DMA chip is done, it causes an interrupt.*

| Method | During the transfer the CPU… | The end is signalled by |
|---|---|---|
| Busy waiting | polls the device in a tight loop | the busy bit clearing |
| Interrupt | runs other work; the caller is blocked | an interrupt from the controller |
| DMA | runs other work; the DMA chip moves the bytes | one interrupt from the DMA chip |

Under busy waiting nothing else runs; under interrupts and DMA the caller waits and the CPU does not.

### The CPU's three ways to wait

Each step lights the part that is working and the caption names what the CPU is doing. Switch between the busy, interrupt and DMA buttons and watch the CPU's row: polling in one mode, running another process in the other two.

```widget
interrupt-io-play
{ "mode": "interrupt", "predict": true }
```

## Four numbered arrows from the controller to the CPU

Slide 67's figure, *The steps in starting an I/O device and getting an interrupt*, draws the CPU, an **interrupt controller** and the disk controller on one bus, with four numbered arrows. The slide gives no text for them; the step meanings are Tanenbaum's for the same figure, not the slide's.

| Arrow | From → to (on the figure) | Step (Tanenbaum) |
|---|---|---|
| 1 | CPU → disk controller | the driver writes the controller's registers to start it |
| 2 | disk controller → interrupt controller | the transfer is done; the controller signals |
| 3 | interrupt controller → CPU | the interrupt controller asserts a pin on the CPU |
| 4 | interrupt controller → CPU, along the bus | it puts the device's number on the bus |

The CPU uses that number to find the handler. Tanenbaum calls the table of handler addresses the **interrupt vector**; the term is not on the slides.

## Interrupt processing: take it, run the handler, return

Slide 68's caption: *Interrupt processing involves taking the interrupt, running the interrupt handler, and returning to the user program.* The figure numbers the three moves:

1. **Interrupt**: arrives while the current instruction runs; control drops into the kernel.
2. **Dispatch to handler**: the interrupt handler runs.
3. **Return**: control comes back to the user program's next instruction.

The user program resumes at its next instruction as if nothing had happened. Part 3 takes this sequence apart step by step ([interrupts](#/comp4736-p3/interrupts)).

```quiz
[
  {
    "q": "Match each I/O method to what the CPU does while the device works.",
    "type": "match",
    "pairs": [
      ["Busy waiting", "Polls the device in a tight loop until it is done"],
      ["Using interrupt", "Runs other work while the caller is blocked, until the controller interrupts"],
      ["DMA", "Sets up a chip with the byte count, addresses and direction, then runs other work until that chip interrupts"]
    ],
    "explain": "Slides 65–66. Busy waiting ties up the CPU *polling the device until it is finished*. With an interrupt the OS *blocks the caller if need be and looks for other work to do*. With DMA the CPU hands the transfer to the chip, and *When the DMA chip is done, it causes an interrupt.*"
  },
  {
    "q": "Busy waiting leaves the CPU free to run other processes during the I/O.",
    "type": "tf",
    "answer": false,
    "explain": "Busy waiting *has the disadvantage of tying up the CPU polling the device until it is finished* (slide 65). The interrupt and DMA methods are the ones that free the CPU."
  },
  {
    "q": "Name the special chip that transfers data between a device and memory without the CPU copying each byte (give its abbreviation).",
    "type": "text",
    "answer": ["DMA", "DMA chip", "Direct Memory Access", "DMA controller"],
    "explain": "Slide 66: *Use of special hardware e.g. DMA (Direct Memory Access)*. The CPU tells the DMA chip how many bytes, the device and memory addresses and the direction; *When the DMA chip is done, it causes an interrupt.*"
  },
  {
    "q": "Which of these needs a device driver?",
    "options": ["Disk", "Register", "Cache", "Main memory"],
    "answer": 0,
    "explain": "A disk sits behind a controller, and *the software that talks to a controller* is the device driver (slide 64). Registers, cache and main memory are reached by ordinary CPU instructions."
  },
  {
    "q": "The device driver runs in user mode so that a faulty driver cannot crash the system.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 64: *the driver has to be put into the operating system so it can run in kernel mode.* Talking to a controller is I/O, and I/O instructions are forbidden in user mode."
  },
  {
    "q": "Fill in the four registers of the slide's minimal disk controller.",
    "type": "fill",
    "code": "disk ___, memory ___, sector ___, and ___ (read or write)",
    "answer": ["address", "address", "count", "direction"],
    "explain": "Slide 64: *registers for specifying the disk address, memory address, sector count, and direction (read or write).*"
  },
  {
    "q": "Put the busy-waiting sequence of slide 65 in order.",
    "type": "reorder",
    "lines": [
      "The user program issues a system call",
      "The kernel translates it into a procedure call to the appropriate driver",
      "The driver starts the I/O and polls the device in a tight loop",
      "The driver puts the data where they are needed and returns",
      "The operating system returns control to the caller"
    ],
    "explain": "Slide 65, in its own order: system call → kernel calls the driver → driver starts the I/O and polls the busy bit → data delivered, driver returns → OS returns control to the caller."
  },
  {
    "q": "Registers are found only inside the CPU.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 64: *Every controller has a small number of registers that are used to communicate with it.* The driver writes those device registers to start the controller."
  },
  {
    "q": "What does slide 68 say interrupt processing involves?",
    "options": [
      "Taking the interrupt, running the interrupt handler, and returning to the user program",
      "Polling the busy bit, copying the data, and returning to the caller",
      "Setting up the DMA chip, transferring the bytes, and blocking the caller",
      "Saving the PSW, switching to user mode, and running the driver"
    ],
    "answer": 0,
    "explain": "Slide 68's caption: *Interrupt processing involves taking the interrupt, running the interrupt handler, and returning to the user program.* The figure numbers them 1. Interrupt, 2. Dispatch to handler, 3. Return."
  },
  {
    "q": "An I/O unit often consists of a mechanical component and an electronic component. What two names does slide 63 give the electronic component?",
    "options": [
      "Device controller or adapter",
      "Device driver or handler",
      "Interrupt controller or switch",
      "DMA chip or bus"
    ],
    "answer": 0,
    "explain": "Slide 63: *an electronic component (device controller or adapter)*. The driver is software in the OS; the controller is *a chip or a set of chips that physically controls the device*."
  }
]
```

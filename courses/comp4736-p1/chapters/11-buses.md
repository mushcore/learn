---
title: "Buses: SCSI, USB, DMI, PCI, PCI-Express"
minutes: 12
---

The simple PC on slide 24 joins the CPU, memory and every controller with one bus. A real x86 machine has several buses at different speeds, each with its own job.

## The structure of a large x86 system

Slide 69's figure, *The structure of a large x86 system*, from the top down:

- The **processor package** holds Core1 and Core2 (each with its cache), a shared cache, GPU cores and the **memory controllers**.
- The memory controllers connect to **DDR3 memory** on both sides.
- A **PCIe** link runs from the package to **Graphics**.
- **DMI** runs down from the package to the **Platform Controller Hub**.
- The Platform Controller Hub connects four **PCIe slots**, **SATA**, **USB 2.0 ports**, **USB 3.0 ports**, **Gigabit Ethernet** (over PCIe) and **More PCIe devices**.

Memory and graphics hang directly off the processor; slower devices go through the hub.

## Five buses and the slide's sentence for each

| Bus | Full name | Slide 70–71 wording |
|---|---|---|
| SCSI | Small Computer System Interface | *a high-performance bus intended for fast disks, scanners, and other devices needing considerable bandwidth. Nowadays, we find them mostly in servers and workstations. They can run at up to 640 MB/sec.* |
| USB | Universal Serial Bus | *Any USB device can be connected to a computer and it will function immediately, without requiring a reboot.* |
| DMI | Direct Media Interface | *DMI (Direct Media Interface) bus.* (no further text) |
| PCI | PCI bus | *An internal synchronous bus for interconnecting chips, expansion boards, and processor/memory subsystems* |
| PCI-Express | PCIe | *Ideal for video and graphics applications.* |

Slide 70 gives DMI a name and nothing else. The figure supplies its job: it is the link between the processor package and the Platform Controller Hub.

PCI's examples are *adapters such as hard disks, sound cards, network cards and graphics cards*; "adapter" is slide 63's other word for a device controller ([I/O devices](#/comp4736-p1/io-devices)).

SCSI's 640 MB/sec is four times the fastest disk transfer rate on slide 60 (160 MB/sec), which is why one SCSI bus can serve several fast disks.

## PCI-Express gives each device its own lane to a switch

Slide 71: PCI-Express is *Not using a shared bus configuration and has a devoted path, called a lane, to a single chip known as a switch.* *Each lane (1x) has conductors for sending and receiving data (red and green colored arrows).*

The figure pairs a PCI-E device with a switch three times:

| Label | Lanes |
|---|---|
| x1 | 1 lane |
| x2 | 2 lanes |
| x16 | 16 lanes |

Every lane carries data both ways at once, one conductor set each way. More lanes means more paths in parallel, so a graphics card uses x16. The SSD on slide 62 reports "PCIe 3.0 x4": four lanes ([disks](#/comp4736-p1/disks)).

Slide 72 draws the contrast with no text:

| Shared bus (PCI, PCI-X) | PCI-Express |
|---|---|
| the host device and three PCI/PCI-X devices on one line | the host device connects to a switch chip |
| every device takes turns on the same wires | each PCI-E device has its own lane(s) to the switch |

On a shared bus one device's transfer blocks the others. With lanes two devices can send at the same time.

## Address, data and control buses

This part is not on the slides, but the practice paper uses the terms. A bus is a collection of wires that connects several devices, and textbooks split a system bus by what its wires carry: an **address bus** (where to read or write), a **data bus** (the bits themselves) and a **control bus** (read, write, interrupt and timing signals). Those three are the whole standard list.

```quiz
[
  {
    "q": "Match each bus to its slide description.",
    "type": "match",
    "pairs": [
      ["SCSI", "High-performance bus for fast disks and scanners, mostly in servers and workstations, up to 640 MB/sec"],
      ["USB", "A device works as soon as it is plugged in, without a reboot"],
      ["PCI", "Internal synchronous bus for chips, expansion boards and processor/memory subsystems"],
      ["PCI-Express", "A devoted path, called a lane, to a single chip known as a switch"],
      ["DMI", "Links the processor package to the Platform Controller Hub"]
    ],
    "explain": "Slides 69–71. SCSI: *They can run at up to 640 MB/sec.* USB: *it will function immediately, without requiring a reboot.* PCI: *An internal synchronous bus*. PCI-Express: *a devoted path, called a lane, to a single chip known as a switch.* DMI has no text on slide 70; on the slide-69 figure it joins the processor to the Platform Controller Hub."
  },
  {
    "q": "What does USB stand for?",
    "options": ["Universal Serial Bus", "Universal System Bus", "Unified Serial Bus", "Universal Synchronous Bus"],
    "answer": 0,
    "explain": "Slide 70: **USB** (**Universal Serial Bus**). Its slide fact: *Any USB device can be connected to a computer and it will function immediately, without requiring a reboot.*"
  },
  {
    "q": "Up to how many MB/sec can a SCSI bus run, according to slide 70?",
    "type": "numeric",
    "answer": 640,
    "tolerance": 0,
    "unit": "MB/sec",
    "explain": "*They can run at up to 640 MB/sec.* Compare 50 to 160 MB/sec for a disk's own transfer rate (slide 60)."
  },
  {
    "q": "PCI-Express connects its devices with a shared bus configuration.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 71: PCI-Express is *Not using a shared bus configuration and has a devoted path, called a lane, to a single chip known as a switch.* The shared bus on slide 72 is PCI / PCI-X."
  },
  {
    "q": "The PCI bus is an internal asynchronous bus for interconnecting chips, expansion boards, and processor/memory subsystems.",
    "type": "tf",
    "answer": false,
    "explain": "One word changed. Slide 70: *An internal synchronous bus for interconnecting chips, expansion boards, and processor/memory subsystems*."
  },
  {
    "q": "In PCI-Express, what is the devoted path from a device to the switch called?",
    "type": "text",
    "answer": ["lane", "a lane", "lanes"],
    "explain": "*a devoted path, called a lane, to a single chip known as a switch* (slide 71). *Each lane (1x) has conductors for sending and receiving data*."
  },
  {
    "q": "How many lanes does an x16 PCI-Express device have?",
    "type": "numeric",
    "answer": 16,
    "tolerance": 0,
    "explain": "The slide-71 figure labels x1 = 1 lane, x2 = 2 lanes, x16 = 16 lanes. Each lane both sends and receives."
  },
  {
    "q": "In the slide's large x86 system, which bus joins the processor package to the Platform Controller Hub?",
    "options": ["DMI", "PCIe", "SATA", "SCSI"],
    "answer": 0,
    "explain": "Slide 69: DMI runs from the package down to the Platform Controller Hub. PCIe connects the package to Graphics and the hub to its slots and Gigabit Ethernet; SATA is one of the hub's connections; SCSI is not in that figure."
  },
  {
    "q": "Which of the following is NOT a type of system bus?",
    "options": ["Utility bus", "Address bus", "Data bus", "Control bus"],
    "answer": 0,
    "explain": "A system bus is split into address, data and control lines (standard textbook terms, not on the slides). There is no utility bus."
  },
  {
    "q": "Where does slide 70 say SCSI buses are mostly found nowadays?",
    "options": ["In servers and workstations", "In handheld computers", "In smart cards", "In embedded systems"],
    "answer": 0,
    "explain": "*Nowadays, we find them mostly in servers and workstations.* SCSI is *intended for fast disks, scanners, and other devices needing considerable bandwidth*."
  }
]
```

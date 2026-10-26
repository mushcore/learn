---
title: Disks and SSDs
minutes: 12
---

Main memory forgets everything at power-off, so files live on a disk. On the [memory hierarchy](#/comp4736-p1/memory-and-registers) a disk access costs about 10 msec against 10 nsec for main memory, a factor of a million, and this lesson shows where those milliseconds go.

## A disk is a stack of platters that rotate at a fixed speed

Slide 59 in three bullets:

- *A disk consists of one or more metal platters that rotate at 5400, 7200, 10,800 RPM or more.*
- *A mechanical arm pivots over the platters from the corner.*
- *The outer cylinders contain more sectors than the inner ones.*

The figure "Structure of a disk drive" labels these parts:

| Part on the figure | What the slide shows |
|---|---|
| Platters | four, on one spindle |
| Surfaces | Surface 0 (bottom) to Surface 7 (top), two per platter |
| Heads | *Read/write head (1 per surface)*, all on one arm assembly |
| Arm | a double arrow, *Direction of arm motion* |

Four platters give eight surfaces, so the drive has eight heads, and they move together because they share one arm.

The words for the places on a surface:

- A **track** is one ring on a surface (slide 12 used it for the "read a hard drive directly" example).
- A **sector** is one piece of a track, the unit that has to *rotate under the head*.
- A **cylinder** is the set of tracks under all the heads at one arm position. The slide uses the word without defining it; this definition is Tanenbaum's.

An outer ring is longer than an inner one, so it holds more sectors. That is the reason for the third bullet.

## Moving the arm, waiting for the sector, reading the data

Slide 60 gives three delays, in the order a read pays them:

| Delay | Slide wording | Time or rate |
|---|---|---|
| Arm to the next cylinder | *Moving the arm from one cylinder to the next takes about 1 msec.* | ≈ 1 msec |
| Arm to a random cylinder | *Moving it to a random cylinder typically takes 5 to 10 msec, depending on the drive.* | 5 to 10 msec |
| Sector rotates under the head | *the drive must wait for the needed sector to rotate under the head, an additional delay of 5 msec to 10 msec, depending on the drive's RPM* | 5 to 10 msec |
| Reading or writing | *reading or writing occurs at a rate of 50 MB/sec on low-end disks to 160 MB/sec on faster ones* | 50 to 160 MB/sec |

Tanenbaum calls the first two the **seek time** and the third the **rotational delay**; the slide describes them without the names. Only the rotational wait is tied to the RPM: a platter that spins faster brings the sector round sooner.

The arithmetic below is ours, from the slide's numbers. A random read of one 4 KB block pays 5 to 10 msec to move the arm and 5 to 10 msec for the rotation, 10 to 20 msec before the first byte. Then 4 KB at 50 MB/sec takes under 0.1 msec. The mechanical delays are more than a hundred times the transfer, which is why the hierarchy slide puts the disk at 10 msec.

## An SSD has no platters and no arm

Slide 61: *SSDs do not have moving parts, do not contain platters in the shape of disks, and store data in (Flash) memory.* And: *they also store a lot of data which is not lost when the power is off.*

With no arm and nothing rotating, an SSD pays neither of the mechanical delays above. It is still storage that keeps its data without power, like a disk and unlike RAM.

Slide 62 is a CrystalDiskInfo screenshot of a real SSD:

| Field | Value on the slide |
|---|---|
| Drive | SAMSUNG MZVLB512HBJQ-000L7, 512.1 GB |
| Interface | NVM Express |
| Transfer Mode | PCIe 3.0 x4 |
| Rotation Rate | ---- (SSD) |
| Health Status | Good, 100 % |

The rotation rate is blank because nothing rotates. "PCIe 3.0 x4" means the drive is wired to four PCI-Express lanes, a bus the [buses lesson](#/comp4736-p1/buses) covers. The controller that drives either kind of disk is the subject of the [next lesson](#/comp4736-p1/io-devices).

```quiz
[
  {
    "q": "A disk's platters rotate at 5400, 7200, 10,800 RPM or more.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 59: *A disk consists of one or more metal platters that rotate at 5400, 7200, 10,800 RPM or more.*"
  },
  {
    "q": "About how many milliseconds does it take to move the arm from one cylinder to the next?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "unit": "msec",
    "explain": "Slide 60: *Moving the arm from one cylinder to the next takes about 1 msec.* A move to a random cylinder takes 5 to 10 msec."
  },
  {
    "q": "The inner cylinders of a disk contain more sectors than the outer ones.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 59 says the reverse: *The outer cylinders contain more sectors than the inner ones.* An outer ring is longer, so it holds more sectors."
  },
  {
    "q": "The slide says one of the disk's delays depends on the drive's RPM. Which one?",
    "options": [
      "Waiting for the needed sector to rotate under the head",
      "Moving the arm from one cylinder to the next",
      "Moving the arm to a random cylinder",
      "Writing data once the sector is under the head"
    ],
    "answer": 0,
    "explain": "Slide 60: the wait for the sector to rotate under the head is *an additional delay of 5 msec to 10 msec, depending on the drive's RPM*. The random-cylinder arm move depends *on the drive*; the next-cylinder move is about 1 msec."
  },
  {
    "q": "A drive has 3 platters, recorded on both sides, with one read/write head per surface. How many heads does it have?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "explain": "Two surfaces per platter: 3 × 2 = 6 surfaces. The figure's label is *Read/write head (1 per surface)*, so 6 heads."
  },
  {
    "q": "Once the sector is under the head, a fast disk transfers at the slide's top rate. How many seconds does it take to read 80 MB?",
    "type": "numeric",
    "answer": 0.5,
    "tolerance": 0.001,
    "unit": "s",
    "explain": "Slide 60's fast rate is 160 MB/sec. Time = 80 MB ÷ 160 MB/sec = 0.5 s. A low-end disk at 50 MB/sec would take 80 ÷ 50 = 1.6 s."
  },
  {
    "q": "What range of transfer rates does slide 60 give for reading or writing once the sector is under the head?",
    "options": ["50 to 160 MB/sec", "5 to 10 MB/sec", "160 to 640 MB/sec", "1 to 10 MB/sec"],
    "answer": 0,
    "explain": "*50 MB/sec on low-end disks to 160 MB/sec on faster ones.* 5 to 10 is the slide's range in msec for the arm and rotation delays; 640 MB/sec is the SCSI bus figure on slide 70."
  },
  {
    "q": "SSDs store data in Flash memory, so their data is lost when the power is off.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 61: SSDs *store data in (Flash) memory* and *store a lot of data which is not lost when the power is off.* They have no moving parts and no platters."
  },
  {
    "q": "What are the rotating metal disks inside a hard disk called?",
    "type": "text",
    "answer": ["platters", "platter"],
    "explain": "Slide 59: *one or more metal platters*. Each platter has two surfaces, and each surface has its own read/write head."
  }
]
```

---
title: The OS zoo, processes, files, mount, pipes and protection
minutes: 18
---

Slides 73 to 88 list the kinds of operating system, then the abstractions they all offer: processes, files and file protection.

## The operating system zoo has nine kinds

| # | Kind (slides 73–76) | Slide examples | Slide wording |
|---|---|---|---|
| 1 | Mainframe | OS/390 and Linux | *Room-sized computers. A mainframe with 1000 disks and millions of gigabytes of data is not unusual. They typically offer three kinds of services: batch, transaction processing, and timesharing.* |
| 2 | Server | Solaris, FreeBSD, Linux and Windows Server 201x | *They run on servers, which are either very large personal computers, workstations, or even mainframes.* |
| 3 | Multiprocessor | Windows and Linux | (no description) |
| 4 | Personal computer | Linux, FreeBSD, Windows 7, Windows 8, and Apple's OS X | (no description) |
| 5 | Handheld computer | Android and Apple's iOS | (no description) |
| 6 | Embedded | Embedded Linux, QNX and VxWorks | *computers that control devices that are not generally thought of as computers and which do not accept user-installed software* |
| 7 | Sensor node | TinyOS | *tiny computers that communicate with each other and with a base station using wireless communication* |
| 8 | Real-time | eCos | *characterized by having time as a key parameter*, e.g. *industrial process-control systems* |
| 9 | Smart card | JVM | *the ROM on the smart card holds an interpreter for the Java Virtual Machine (JVM)* |

Embedded examples: *microwave ovens, TV sets, cars, DVD recorders, traditional phones, and MP3 players*. Linux appears in five rows, so it never identifies a kind on its own.

## A process is a program in execution

Slide 77:

- *Key concept in all operating systems.*
- *program in execution.*
- *Process is associated with an address space.* The addresses run *from 0 up to some maximum*.
- *Also associated with set of resources.*
- *Process can be thought of as a container.* It *Holds all information needed to run program*.

Everything about a process except its address space lives in the **process table**: *an array of structures, one for each process currently in existence*. One table, one entry per process ([the process model](#/comp4736-p3/process-model)).

## Three segments: text, data and stack

Slide 78: *Processes in UNIX have their memory divided up into three segments: the text segment (i.e., the program code), the data segment (i.e., the variables), and the stack segment. The data segment grows upward and the stack grows downward.*

| Address (hex) | Segment | Grows |
|---|---|---|
| FFFF (top) | Stack | down |
| | Gap | the free space both grow into |
| | Data | up |
| 0000 (bottom) | Text | fixed |

The stack figure grows from the **base of stack**, 100 (0x64) holding A, down to the **top of stack**, 97 (0x61) holding D ([Linux address space](#/comp4736-p3/linux-address-space)).

## Processes form a tree

Slide 79: *Process A created two child processes, B and C. Process B created three child processes, D, E, and F.* The slide's `pstree` output from a real run:

```text
OS:>>
?(1)──mintty(345)──bash(346)──child_fork(598)─┬─child_fork(601)
                                              └─child_fork(599)──child_fork(600)
```

Process 598 created 601 and 599, and 599 created 600 ([Linux process states](#/comp4736-p3/linux-process-states)). A background process that handles an activity such as mail or printing is a **daemon**: Tanenbaum's term, not on these slides.

## Files, directories and i-numbers

Slide 80:

- The OS presents *a nice, clean abstract model of device-independent files*.
- *Files are logical units of information created by processes.*
- *Directory, a way of grouping files together. File hierarchies are organized as trees.*
- *Every file in UNIX has a unique number, its i-number, that identifies it. This i-number is an index into a table of i-nodes, one per file, telling who owns the file, where its disk blocks are, and so on.*
- *A directory is simply a file containing a set of (i-number, ASCII name) pairs.*

Slide 81 lists those numbers with `ls -i`:

```text
~$ ls -i --format=single-column
133 T1.term
258 main1
259 main2
  6 main2.c
261 temp
```

The figure follows `6 main2.c` to **Inode 6**: a block of attributes, then disk addresses that point at the file's blocks on the disk.

## Path names, file descriptors and the department tree

Slide 82: *Every file within the directory hierarchy can be specified by giving its path name from the root directory.* For CS101 in the slide-83 department tree:

```text
/Faculty/Prof.Brown/Courses/CS101        (Unix)
\Faculty\Prof.Brown\Courses\CS101        (MS_DOS)
```

*Before a file is read or written, it must be opened by checking the permissions. If the access is permitted, the system returns a small integer called a file descriptor to use in subsequent operations. If the access is prohibited, an error code is returned.* Part 5 numbers the first three descriptors ([standard streams](#/comp4736-p5/standard-streams)).

## Mount attaches a file system to an empty directory

Slide 84: *The mount system call allows the file system on the CD-ROM to be attached to the root file system wherever the program wants it to be.* *File systems are nearly always mounted on empty directories.*

| | Root tree | CD-ROM |
|---|---|---|
| (a) before mounting | root → a, b; a → c, d; b empty | x, y, not accessible |
| (b) after mounting on b | root → a, b; a → c, d; b → x, y | part of the hierarchy |

Directory b was empty, so nothing was hidden ([links and mount](#/comp4736-p5/links-and-mount)).

## A pipe connects two processes

Slide 85: *A pipe is a sort of pseudofile that can be used to connect two processes. One process generates some output that another process uses as input.* Slide 86 chains five pipes into a word-frequency count:

```text
OS:>> cat test.txt | tr '[A-Z]' '[a-z]' | tr -C '[a-z]' '\n'|sort| uniq -c|sort -rn
    283
    115 the
     52 and
```

What each stage does (standard Unix, not on the slide):

| Stage | Output passed down the pipe |
|---|---|
| `cat test.txt` | the file's text |
| `tr '[A-Z]' '[a-z]'` | the same text in lower case |
| `tr -C '[a-z]' '\n'` | every non-letter turned into a newline: one word per line |
| `sort` | equal words next to each other |
| `uniq -c` | each word once, with its count |
| `sort -rn` | largest count first |

The 283 counts the empty lines. Lab 1 piped `lscpu` into `grep cache` the same way.

## Protection: a 9-bit code in three 3-bit fields

Slide 87: *Files in UNIX are protected by assigning each one a 9-bit binary protection code. The protection code consists of three 3-bit fields, one for the owner, one for other members of the owner's group (users are divided into groups by the system administrator), and one for everyone else. Each field has a bit for read access, a bit for write access, and a bit for execute access. These 3 bits are known as the rwx bits.*

`chmod` writes the code as three octal digits, one per field, adding r = 4, w = 2 and x = 1 (`-` is 0). The practice paper's `rw-r-x-w-`: owner 4 + 2 = 6, group 4 + 1 = 5, others 2, so 652.

### Nine bits, one octal digit per field

Clicking a bit updates the `ls -l` string, the octal code and the sentence on who may do what.

```widget
rwx-bits
{ "mode": "rw-r-x-w-" }
```

## The letter before the nine bits is the file type

Slide 88, *Linux file types*:

| Letter | Type |
|---|---|
| - | regular file |
| d | directory |
| c | character device file |
| b | block device file |
| s | local socket file |
| p | named pipe |
| l | symbolic link |

The slide's `ls -al` shows six of them (no socket):

```text
drwxrwxr-x 2 asp  asp  4096 Jun 17 08:25 libs
lrwxrwxrwx 1 asp  asp     8 Jun 17 08:25 l_thread -> thread.c
brw-r--r-- 1 root root 1, 2 Jun 17 08:28 my_block_dev
crw-r--r-- 1 root root 4, 3 Jun 17 08:29 my_char_dev
prw-r--r-- 1 root root    0 Jun 17 08:30 my_npipe_dev
-rw-rw-r-- 1 asp  asp     0 Jun 17 08:23 thread.c
```

## Convert five more protection codes

Add 4, 2, 1 for r, w, x in each field; the type letter is not part of the number.

```quiz
[
  {
    "q": "What is `r-xrw---x` in octal?",
    "type": "numeric",
    "answer": 561,
    "tolerance": 0,
    "explain": "Owner `r-x` = 4 + 0 + 1 = 5. Group `rw-` = 4 + 2 + 0 = 6. Others `--x` = 0 + 0 + 1 = 1. Code 561."
  },
  {
    "q": "What is `-wxr--rw-` in octal?",
    "type": "numeric",
    "answer": 346,
    "tolerance": 0,
    "explain": "Owner `-wx` = 0 + 2 + 1 = 3. Group `r--` = 4. Others `rw-` = 4 + 2 = 6. Code 346."
  },
  {
    "q": "What is `rwx-w-r--` in octal?",
    "type": "numeric",
    "answer": 724,
    "tolerance": 0,
    "explain": "Owner `rwx` = 4 + 2 + 1 = 7. Group `-w-` = 2. Others `r--` = 4. Code 724."
  },
  {
    "q": "Write the nine protection characters for octal 640, one field per blank.",
    "type": "fill",
    "code": "owner ___  group ___  others ___",
    "answer": ["rw-", "r--", "---"],
    "explain": "6 = 4 + 2 = `rw-`; 4 = `r--`; 0 = `---`. The full string is `rw-r-----`: the owner reads and writes, the group only reads, everyone else has no access."
  },
  {
    "q": "`ls -l` prints `prw--w----` for a file. What is it, and what is its protection code in octal?",
    "options": [
      "A named pipe, 620",
      "A named pipe, 602",
      "A regular file, 620",
      "A local socket file, 620"
    ],
    "answer": 0,
    "explain": "The first letter `p` is a named pipe (slide 88; `s` would be a local socket, `-` a regular file). Then owner `rw-` = 6, group `-w-` = 2, others `---` = 0: 620."
  }
]
```

```quiz
[
  {
    "q": "Match each kind of operating system to the example the slides give for it.",
    "type": "match",
    "pairs": [
      ["Mainframe", "OS/390"],
      ["Server", "Solaris"],
      ["Handheld computer", "Android and Apple's iOS"],
      ["Embedded", "QNX and VxWorks"],
      ["Sensor node", "TinyOS"],
      ["Real-time", "eCos"],
      ["Smart card", "JVM"]
    ],
    "explain": "Slides 73–76. Linux is left out because it appears under mainframe, server, multiprocessor and personal computer. Embedded systems *do not accept user-installed software*; real-time systems have *time as a key parameter*; a Java smart card's ROM *holds an interpreter for the Java Virtual Machine (JVM)*."
  },
  {
    "q": "What is the unique number of a UNIX file, the index into the table of i-nodes, called?",
    "type": "text",
    "answer": ["i-number", "inumber", "i number", "inode number", "i-node number"],
    "explain": "Slide 80: *Every file in UNIX has a unique number, its i-number, that identifies it. This i-number is an index into a table of i-nodes*. `ls -i` prints it (slide 81)."
  },
  {
    "q": "Name the system call that attaches the file system on a CD-ROM to the root file system.",
    "type": "text",
    "answer": ["mount", "mount()"],
    "explain": "Slide 84: *The mount system call allows the file system on the CD-ROM to be attached to the root file system wherever the program wants it to be.* *File systems are nearly always mounted on empty directories.*"
  },
  {
    "q": "What is the pseudofile that connects two processes, so that one process's output becomes the other's input?",
    "type": "text",
    "answer": ["pipe", "a pipe"],
    "explain": "Slide 85: *A pipe is a sort of pseudofile that can be used to connect two processes. One process generates some output that another process uses as input.*"
  },
  {
    "q": "A background process that handles an activity such as mail or printing, not tied to a user at a terminal, is called a ______.",
    "type": "text",
    "answer": ["daemon", "daemons"],
    "explain": "A daemon (Tanenbaum's term; not on the Part 1 slides, but on the practice paper). It runs in the background waiting for work, such as incoming mail or print requests."
  },
  {
    "q": "What is the protection code `r--r-x-wx` in octal?",
    "type": "numeric",
    "answer": 453,
    "tolerance": 0,
    "explain": "Owner `r--` = 4. Group `r-x` = 4 + 1 = 5. Others `-wx` = 2 + 1 = 3. Code 453."
  },
  {
    "q": "Match each `ls -l` type letter to its meaning on slide 88.",
    "type": "match",
    "pairs": [
      ["-", "regular file"],
      ["d", "directory"],
      ["c", "character device file"],
      ["b", "block device file"],
      ["s", "local socket file"],
      ["p", "named pipe"],
      ["l", "symbolic link"]
    ],
    "explain": "Slide 88's list, verbatim. In the slide's `ls -al`, `l_thread -> thread.c` is the `l` line and `my_npipe_dev` the `p` line."
  },
  {
    "q": "Each process has its own process table.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 77: the process table is *an array of structures, one for each process currently in existence*. There is one table, with one entry per process."
  },
  {
    "q": "What does the system return when a file is opened and the permission check passes?",
    "options": [
      "A small integer called a file descriptor",
      "The file's i-number",
      "An error code",
      "The file's path name from the root directory"
    ],
    "answer": 0,
    "explain": "Slide 82: *If the access is permitted, the system returns a small integer called a file descriptor to use in subsequent operations. If the access is prohibited, an error code is returned.*"
  },
  {
    "q": "In a UNIX process's memory, which segment grows downward?",
    "options": ["The stack segment", "The data segment", "The text segment", "The gap"],
    "answer": 0,
    "explain": "Slide 78: *The data segment grows upward and the stack grows downward.* The text segment (the program code) does not grow; the gap is the free space between data and stack."
  }
]
```

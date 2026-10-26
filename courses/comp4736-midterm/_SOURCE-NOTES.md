# COMP 4736 Midterm: source notes (practice Part 1 + Part 2)

**Files transcribed**
- `D:/BCIT/COMP4736/midterm/MidtermPart1Practice_pages/p001.png` … `p011.png`: D2L **Midterm_Practice_Part_1** results page, 74 questions, 74 marks.
- `D:/BCIT/COMP4736/midterm/Midterm_Part2_Practice_Sol_Fall_2026_pages/p001.png` … `p003.png` and `D:/BCIT/COMP4736/midterm/Midterm_Part2_Practice_Sol_Fall_2026.txt`: written-part practice with instructor solutions. (The .txt is in a legacy encoding; its "−" and "≈" characters are undecodable. The page images show them and were used.)
- Downloaded 2026-10-26.

**Exam facts**
- Course: COMP 4736 Operating Systems, BCIT. Textbook: Tanenbaum & Bos, *Modern Operating Systems*, 4th ed.
- Midterm: this week, Oct 26–30 2026. Closed book, LockDown Browser.
- Part 1: T/F and MCQ, online. Part 2: written.
- Topics: lecture Part 1 Introduction; Part 2 OS Structures and Clocks; Part 3 Processes; Part 4 Threads; Part 5 System Calls.

**How to read the Part 1 results page**
- The attempt is "Written Oct 20, 2026 4:06 PM - Oct 26, 2026 9:15 AM • Attempt 1 of Unlimited". Attempt Score **1 / 74 - 1.35 %**; Overall Grade (Highest Attempt) 1 / 74 - 1.35 %.
- The student clicked through without answering. The blue arrow ➡ marks the correct option. A ✓ next to a filled radio is the student's choice and is shown only where the choice was right (only Q1).
- Marks per question are not printed. 74 questions for 74 marks implies 1 mark each (Q56, a 3-item matching question, presumably split across its items).
- The `Part N` tag on each question is my assignment of the lecture Part it tests. "Key note" lines are my comments, not D2L's.

---

## Practice Part 1

### Page p001

**Q1** · MCQ · Part 1
Which of the following operations is NOT typically performed by the ALU?
- Logical AND
- Multiplication
- Addition
- Data storage

Correct: **Data storage**. No arrow shown; the student's choice "Data storage" has a ✓ and a filled radio (this is the 1 mark scored).

**Q2** · MCQ · Part 2 (clocks) · calculation
A system has a clock tick of 2 nanoseconds. The operating system gives each process a time quantum of 40 milliseconds.

What value should be loaded into the clock/timer register to generate an interrupt after one process quantum?
- 20
- 20,000,000
- 20,000
- 40,000,000

Correct: **20,000,000**. (Check: 40 ms / 2 ns = 40×10⁻³ / 2×10⁻⁹ = 2×10⁷.)

**Q3** · MCQ · Part 1
What does the Control Unit do during the instruction execution cycle?
- Stores data in registers
- Displays output on the monitor
- Decodes instructions and coordinates CPU operations
- Initiates power supply to the CPU

Correct: **Decodes instructions and coordinates CPU operations**.

**Q4** · MCQ · Part 1
Which of the following memory of the computer is used to speed up the computer processing?
- ROM
- None of the mentioned
- Cache memory
- RAM

Correct: **Cache memory**.

**Q5** · T/F · Part 1 (question on p001, options on p002)
Operating systems turn ugly software into beautiful abstractions.
- True
- False

Correct: **False**. Key note: the textbook sentence is "turn ugly *hardware* into beautiful abstractions"; the swap to "software" makes it false. Same statement as Q69.

### Page p002

**Q6** · MCQ · Part 1
What is the primary purpose of cache memory in a computer system?
- To manage the overall memory hierarchy of the system.
- All of the mentioned
- To provide long-term storage for programs and files.
- To speed up data access by storing frequently used data.

Correct: **To speed up data access by storing frequently used data.**

**Q7** · MCQ · Part 4
Which of these actions usually involves increased overhead in user-level threads when compared to kernel-level threads?
- Thread switching
- Thread termination
- Thread creation

Correct (per arrow): **Thread switching**. Key note: the textbook says user-level thread switching is *cheaper* than kernel-level (no trap, no context switch, no cache flush; compare Q72). The key is as D2L shows it; worth asking the instructor.

**Q8** · T/F · Part 1
ALUs are made of logic gates.
- True
- False

Correct: **True**.

**Q9** · T/F · Part 1
Registers are used just only in CPUs.
- True
- False

Correct: **False**.

**Q10** · MCQ · Part 1
The three main parts of central processing unit (CPU processor) is -----
- Cache, ALU, and RAM
- Control Unit, RAM, and Cache
- ALU, Control Unit, and RAM
- ALU, Control Unit, and Registers

Correct: **ALU, Control Unit, and Registers**. (Same as Q25.)

**Q11** · MCQ · Part 1
---- contains the memory address of the next instruction to be fetched.
- Program status word
- Stack pointer
- Program counter

Correct: **Program counter**.

**Q12** · MCQ · Part 1
The design of a computer in terms of the basic operations it must support is described by ------.
- Microarchitecture
- Operating System
- Instruction set architecture

Correct: **Instruction set architecture**. (Same as Q44.)

**Q13** · MCQ · Part 1
Which of the following is fastest memory?
- Main Memory
- Register
- Cache Memory
- Secondary Memory

Correct: **Register**.

### Page p003

**Q14** · MCQ · Part 3
In operating system, each process has its own __________
- open files
- pending alarms, signals, and signal handlers
- address space and global variables
- all of the mentioned

Correct: **all of the mentioned**.

**Q15** · MCQ · Part 1 (cache) · calculation
With a 64-byte line size and a reference to memory address 151, what line is pulled into one cash line ?

Figure: memory drawn as five columns of 64-byte lines, labelled underneath **0, 1, 2, 3, 4**. Column labels down the left/bottom of each column: line 0 spans 0 (bottom) to 63 (top); line 1 spans 64 to 127; line 2 spans 128 to 191; line 3 spans 192 to 255; line 4 spans 256 to 319.
- 0
- 1
- 3
- 4
- 2

Correct: **2**. (Check: ⌊151 / 64⌋ = 2; line 2 holds bytes 128–191.)

**Q16** · MCQ · Part 3
A process that stay in the background to handle some activity is called:
- Kernel thread
- Daemon
- User thread

Correct: **Daemon**.

**Q17** · MCQ · Part 5
Choose the correct statements.
- **A.** C programs can directly make system calls
- **B.** Library functions in C can use system calls
- **C.** Both (A) and (B)
- **D.** Library functions don't use system calls.

Correct: **C. Both (A) and (B)**.

**Q18** · MCQ · Part 1
What is an operating system?
- collection of programs that manages hardware resources
- all of the mentioned
- system service provider to the application programs
- interface between the hardware and application programs

Correct: **all of the mentioned**. (Same as Q71.)

**Q19** · MCQ · Part 5
What invokes the system calls?
- A software interrupt
- A privileged instruction
- An indirect jump
- Polling

Correct: **A software interrupt**.

**Q20** · MCQ · Part 5 (question on p003, options on p004)
Operating System provides the different types of services to the user. For accessing these services, the interface is provided by the _______
- system calls.
- native library.
- application programming interface.
- none of the mentioned.

Correct: **system calls.**

### Page p004

**Q21** · MCQ · Part 3
Which of the following includes the current activity represented by the value of Program Counter and the contents of the processor's registers.
- heap
- data
- text
- stack

Correct (per arrow): **text**. Key note: in the textbook the PC and registers are part of the process (its execution context), not its text segment; the key nonetheless says "text". Same question as Q35, same key.

**Q22** · MCQ · Part 1
RAM stands for -------
- read only memory
- None of these
- random access memory
- random address memory

Correct: **random access memory**.

**Q23** · MCQ · Part 1
What happens when a program in execution encounters an I/O operation in multiprogramming?
- The program is paused and another program is executed
- The program is moved to secondary memory
- The I/O operation is skipped
- The program is terminated

Correct: **The program is paused and another program is executed**.

**Q24** · MCQ · Part 1
What is the primary purpose of registers in a CPU?
- To provide long-term storage for programs and files
- To perform arithmetic and logical operations
- To connect the CPU to other hardware components
- To store data and instructions during program execution

Correct: **To store data and instructions during program execution**.

**Q25** · MCQ · Part 1
The three main parts of central processing unit (CPU) are -----
- Cache, ALU, and RAM
- Control Unit, RAM, and Cache
- ALU, Control Unit, and RAM
- ALU, Control Unit, and Registers

Correct: **ALU, Control Unit, and Registers**.

**Q26** · T/F · Part 2
In a microkernel-based operating system, device drivers are part of the kernel.
- True
- False

Correct: **False**. (Same as Q29.)

**Q27** · MCQ · Part 5 (code spans p004–p005)
Consider the following c code after running the code (a.out) the results is

```c
#include <unistd.h>

void main(){
        sleep(1);
        printf(" -- Hello --\n");
}
```
```
~/lab3$ ls -al a.out
-rw-r--r-- 1 user user 16000 Feb  3 05:19 a.out
```
Options:
- None of the mentioned
- (terminal image)
  ```
  ~/lab3$ ./a.out
   -- Hello --~/lab3$
  ```
- (terminal image)
  ```
  ~/lab3$ ./a.out
   -- Hello --
  ```

Correct: **None of the mentioned**. Reason (mine): `a.out` has permissions `-rw-r--r--`, with no execute bit, so `./a.out` fails with "Permission denied" and prints nothing.

### Page p005

**Q28** · MCQ · Part 5
Open system call returns the file descriptor as _______.
- int
- float
- double
- char

Correct: **int**.

**Q29** · T/F · Part 2
In a microkernel-based operating system, device drivers are part of the kernel.
- True
- False

Correct: **False**. (Duplicate of Q26.)

**Q30** · MCQ · Part 3
What is the ready state of a process?
- when process is using the CPU
- none of the mentioned
- when process is scheduled to run after some execution
- when process is unable to run until some task has been completed

Correct: **when process is scheduled to run after some execution**.

**Q31** · MCQ · Part 1
A file containing a set of i-number and ASCII name is called:
- pseudo file
- root file
- directory

Correct: **directory**.

**Q32** · MCQ · Part 1
By operating system, the resource management can be done via
- **d)** none of the mentioned
- **a)** time division multiplexing
- **c)** both (a) and (b)
- **b)** space division multiplexing

Correct: **c) both (a) and (b)**.

**Q33** · MCQ · Part 1
Out of the following, which one needs a device driver?
- Register
- Main memory
- Cache
- Disk

Correct: **Disk**.

**Q34** · MCQ · Part 1 (options span p005–p006)
Which of the following is not considered as a peripheral device?
- CPU
- All of the mentioned
- Monitor
- Keyboard

Correct: **CPU**. (Same as Q53.)

### Page p006

**Q35** · MCQ · Part 3
Which of the following includes the current activity represented by the value of program counter and the contents of the processor's registers.
- stack
- heap
- text
- data

Correct (per arrow): **text**. (Same as Q21; see the key note there.)

**Q36** · T/F · Part 3
Each process has its own process table.
- True
- False

Correct: **False**. (There is one process table with one entry per process.)

**Q37** · T/F · Part 1
In Assembly language a simple program contains a few lines of codes.
- True
- False

Correct: **False**.

**Q38** · MCQ · Part 1
Which type of registers store the memory address of the next instruction to be executed?
- Accumulator
- Program Counter
- Instruction Register
- Memory Data Register

Correct: **Program Counter**.

**Q39** · T/F · Part 3
In a multiprogramming system each process has its own program counter.
- True
- False

Correct: **False**. Key note: Tanenbaum Fig. 2-1(a) shows one physical program counter; each process has its own *logical* PC, saved and loaded on each switch. The key reads the statement as "physical PC".

**Q40** · MCQ · Part 1
Which of the following is a disadvantage of multiprogramming?
- Increased system complexity
- Reduced responsiveness for individual programs
- All of the mentioned
- Increased memory requirements

Correct: **All of the mentioned**.

**Q41** · T/F · Part 1
Files are logical units of information created by programs.
- True
- False

Correct: **False**. Key note: the textbook says "created by *processes*".

**Q42** · T/F · Part 2
In a layered operating system, each layer can communicate directly with any other layer.
- True
- False

Correct: **False**.

**Q43** · MCQ · Part 2 (options span p006–p007)
What is the primary disadvantage of Type 2 hypervisors?
- They are more difficult to manage and configure.
- They have limited hardware support.
- They have higher overhead due to the host operating system.

Correct: **They have higher overhead due to the host operating system.** (The second option is cut across the page break but readable. Three options visible.)

### Page p007

**Q44** · MCQ · Part 1
The design of a computer in terms of the basic operations it must support is described by ------.
- Operating System
- Instruction Set Architecture
- Microarchitecture

Correct: **Instruction Set Architecture**. (Same as Q12.)

**Q45** · MCQ · Part 5
Consider this code:
```c
#include <unistd.h>

int main() {
    close(1);
    write(1, "Hello\n", 6);
    return 0;
}
```
What happens when write(1, "Hello\n", 6) is executed?
- Hello is printed to the terminal
- Hello is printed to stderr
- write() fails because FD 1 is closed
- The program automatically reopens FD 1

Correct: **write() fails because FD 1 is closed**.

**Q46** · MCQ · Part 1
Main memory is also called as - - - -
- Hard Disk
- PROM
- RAM
- ROM

Correct: **RAM**.

**Q47** · MCQ · Part 3
Which of the following state transitions is not possible ?
- blocked to ready
- running to blocked
- ready to running
- blocked to running

Correct: **blocked to running**.

**Q48** · MCQ · Part 4
In a system with user-level threads, if one thread blocks for I/O, what happens to the other threads?
- They are also blocked
- They are terminated
- They continue to execute in parallel
- They are unaffected

Correct: **They are also blocked**.

**Q49** · MCQ · Part 1
Which of the type of OS reads and reacts in terms of actual time?
- Mainframe Operating Systems
- Embedded Operating Systems
- Real time Operating Systems
- Server Operating Systems

Correct: **Real time Operating Systems**.

**Q50** · MCQ · Part 1 (stem on p007, options on p008)
Assembly language
- need not be translated into machine language.
- uses alphabetic codes in place of binary numbers used in machine language.
- None of these
- is the easiest language to write programs.

Correct: **uses alphabetic codes in place of binary numbers used in machine language.**

### Page p008

**Q51** · T/F · Part 5
Before a file is read or written, it must be opened by checking the permissions.
- True
- False

Correct: **True**.

**Q52** · MCQ · Part 1
In a ---- machine the word size is equal to 4 bytes.
- 64-bit
- 16-bit
- 8-bit
- 32-bit

Correct: **32-bit**.

**Q53** · MCQ · Part 1
Which of the following is not considered as a peripheral device?
- Monitor
- All of the mentioned
- CPU
- Keyboard

Correct: **CPU**. (Same as Q34.)

**Q54** · MCQ · Part 1
The USB stands for -------.
- Universal System Bus
- Universal Serial By-pass
- Universal Serial Bus
- United Serial Bus

Correct: **Universal Serial Bus**.

**Q55** · MCQ · Part 1
A collection of wires that connects several devices or computer parts is called - - ---
- link wire
- bidirectional wire
- bus
- cable

Correct: **bus**.

**Q56** · Matching · Part 5
Match each standard stream with its correct file descriptor number and purpose.

| Item | Choices |
|---|---|
| _____ stdin | 1. 0 |
| _____ stderr | 2. 1 |
| _____ stdout | 3. 2 |

Each blank has a red ✗ (unanswered). D2L shows the correct choice number in blue before each item: stdin **(1)**, stderr **(3)**, stdout **(2)**.
Correct: **stdin → 0, stdout → 1, stderr → 2**.

**Q57** · MCQ · Part 1
When we execute a C program, CPU runs in ______ mode.
- supervisory
- user
- kernel
- system

Correct: **user**.

**Q58** · T/F · Part 3 (stem on p009)
A process is just an instance of a program, including the current values of the program counter (PC), registers, and variables.
- True
- False

Correct: **False**. Key note: the textbook sentence is "an instance of an *executing* program"; dropping "executing" makes it false.

### Page p009

**Q59** · MCQ · Part 1
Which level of cache memory typically has the largest capacity but slower access times?
- L3 cache
- L2 cache
- L1 cache
- Main memory

Correct: **L3 cache**.

**Q60** · MCQ · Part 1
User communicates with a computer with the help of which devices?
- c) Software device
- a) Input device
- b) Output device
- d) Both a and b

Correct: **d) Both a and b**.

**Q61** · MCQ · Part 3 (options span p009–p010)
In a multiprogramming system with four processes, which of the following can occur when using a single-core CPU?

All four options are Process (A, B, C, D on the vertical axis) vs Time → plots made of short horizontal bars.
- Option 1: a staircase, each process running in turn twice: A, B, C, D, then A, B, C, D. As far as I can read the screenshot, the second A bar starts slightly before the first D bar ends, so two processes overlap for a moment.
- Option 2 (**arrow**): the same staircase, A → B → C → D → A → B → C → D, each bar starting where the previous one ends. Only one process is running at any instant.
- Option 3: four long bars, A, B, C and D all running over the same whole interval at once.
- Option 4: A, B, C and D each have a short bar at the very start, all at the same time; later each has one more bar, in turn A, B, C, D.

Correct: **Option 2** (one process at a time, interleaved; the textbook's Fig. 2-1(c) idea). Options 1 and 2 differ only in that small overlap, which is hard to see at this resolution.

### Page p010

**Q62** · MCQ · Part 5 · calculation
The protection bits **rw-r-x-w-** in octal is equal to
- 652
- 256
- 351
- 615

Correct: **652**. (Check: rw- = 6, r-x = 5, -w- = 2.)

**Q63** · MCQ · Part 1
Which of the following is NOT one of the types of buses?
- Control bus
- Data bus
- Utility bus
- Address bus

Correct: **Utility bus**.

**Q64** · MCQ · Part 1
The function of Control Unit in the CPU is ------
- to store program instructions
- to transfer data to primary storage
- to perform arithmetic and logical operations
- to decode program instructions

Correct: **to decode program instructions**.

**Q65** · MCQ · Part 5
What does the close() system call do?
- Deletes the file
- Clears the file contents
- Changes file permissions
- Releases a file descriptor

Correct: **Releases a file descriptor**.

**Q66** · MCQ · Part 5
A process calls fork(). What happens to the file descriptors in the child process?
- File descriptors are reset to 0, 1, and 2
- All file descriptors are closed
- The child gets copies of the parent's file descriptors
- Only stdin is copied

Correct: **The child gets copies of the parent's file descriptors**.

**Q67** · MCQ · Part 2 (clocks) · calculation
In a clock with the cycle time of 2 ns ,the frequency is equal to .
- 2 GHz
- 5GHz
- 50 MHz
- 200 MHZ
- 0.5 GHz

Correct: **0.5 GHz**. (Check: 1 / 2 ns = 5×10⁸ Hz.)

**Q68** · T/F · Part 2 (clocks) (stem spans p010–p011)
The clocks drivers are built out of three components:
1) Crystal oscillator
2) Counter
3) Holding register
- True
- False

Correct: **False**. Key note: the textbook says a *programmable clock* (the hardware) is built from crystal oscillator, counter and holding register. A *clock driver* is software, so the statement is false.

### Page p011

**Q69** · T/F · Part 1
Operating systems turn ugly software into beautiful abstractions.
- True
- False

Correct: **False**. (Same as Q5.)

**Q70** · MCQ · Part 1
What is multiprogramming in operating systems?
- Execution of a single program at a time
- Execution of programs without the need for an operating system
- Execution of multiple programs simultaneously on multiple processors
- Execution of multiple programs simultaneously on a single processor

Correct: **Execution of multiple programs simultaneously on a single processor**.

**Q71** · MCQ · Part 1
What is an operating system?
- system service provider to the application programs
- collection of programs that manages hardware resources
- interface between the hardware and application programs
- all of the mentioned

Correct: **all of the mentioned**. (Same as Q18.)

**Q72** · MCQ · Part 4
In ------  the memory cache need not be flushed.
- both user and kernel level threads
- kernel level threads
- user level threads

Correct: **user level threads**.

**Q73** · MCQ · Part 3
A process can be terminated due to:
- fatal error
- normal exit
- killed by another process
- all of the mentioned

Correct: **all of the mentioned**.

**Q74** · MCQ · Part 1
A --- is a way of grouping files together.
- file
- program
- directory
- process

Correct: **directory**.

### Part 1 tallies (my count)

- **By type:** MCQ (single answer) 59; T/F 14 (Q5, 8, 9, 26, 29, 36, 37, 39, 41, 42, 51, 58, 68, 69); matching 1 (Q56); multi-select 0; fill-in 0. Total 74.
- **By lecture Part:**
  - Part 1 Introduction, 42: Q1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 18, 22, 23, 24, 25, 31, 32, 33, 34, 37, 38, 40, 41, 44, 46, 49, 50, 52, 53, 54, 55, 57, 59, 60, 63, 64, 69, 70, 71, 74.
  - Part 2 OS Structures and Clocks, 7: Q2, 26, 29, 42, 43, 67, 68.
  - Part 3 Processes, 11: Q14, 16, 21, 30, 35, 36, 39, 47, 58, 61, 73.
  - Part 4 Threads, 3: Q7, 48, 72.
  - Part 5 System Calls, 11: Q17, 19, 20, 27, 28, 45, 51, 56, 62, 65, 66.
- **Repeated questions:** Q5 = Q69; Q10 = Q25; Q12 = Q44; Q18 = Q71; Q21 = Q35; Q26 = Q29; Q34 = Q53; Q11 ≈ Q38.
- **Calculation questions:** Q2 (timer count 2×10⁷), Q15 (address 151 → line 2), Q52 (4-byte word = 32-bit), Q62 (rw-r-x-w- = 652), Q67 (2 ns → 0.5 GHz).

---

## Practice Part 2 (written, with instructor solutions)

The instructor's working is in red on the page images and is copied verbatim below.

### Q1: pipeline (lecture Part 1)

> 1) A computer has a pipeline with three stages as shown below. How many instructions per second can this machine execute? Obtain the delay for each instruction.

**Figure:** Fetch unit → Decode unit → Execute unit. Stage delays printed under each box: **Fetch 3 nsec, Decode 3 nsec, Execute 5 nsec**.

**Instructor's working:**
```
F = 1/T = 1/5x10^(-9)=0.2 x 10^9 = 200 millions
Delay = 15 nsec
```

**Recomputation:** the slowest stage (5 ns) sets the clock. Throughput = 1 / 5 ns = 2×10⁸ = **200 million instructions/s**. In a synchronous pipeline every stage takes one 5 ns cycle, so each instruction's latency is 3 × 5 = **15 ns**. **Agree.** (Summing the raw stage delays, 3 + 3 + 5, gives 11 ns. That is the wrong answer here because stages advance on the common clock, the same synchronous-clock idea as Lab 2 Q11.)

### Q2: CPU utilization with and without multiprogramming (lecture Part 1 / Part 3)

> 2) Consider the following situation and obtain the CPU utilization for each case.

Formula on the page: **CPU utilization = total CPU time / total real time**

**Table:**

| | CPU | I/O |
|---|---|---|
| Process A | 5 | 3 |
| Process B | 2 | 6 |
| Process C | 9 | 1 |
| (totals) | 16 | 10 |

**Per-process bars.** Each cell is one time unit; the number is the count within that burst; blue = CPU, peach = I/O.
- Process A: CPU 1, 2 | I/O 1, 2, 3 | CPU 3, 4, 5. (CPU 2, I/O 3, CPU 3.)
- Process B: CPU 1 | I/O 1, 2, 3, 4, 5, 6 | CPU 2. (CPU 1, I/O 6, CPU 1.)
- Process C: CPU 1, 2, 3, 4, 5, 6, 7, 8 | I/O 1 | CPU 9. (CPU 8, I/O 1, CPU 1.)

> a) without multiprogramming (order of running A, B, C)

**Timeline (Time 0–25):**

| Process | Slots |
|---|---|
| A | CPU at 0–1 (1, 2); I/O at 2–4 (1, 2, 3); CPU at 5–7 (3, 4, 5) |
| B | CPU at 8 (1); I/O at 9–14 (1–6); CPU at 15 (2) |
| C | CPU at 16–23 (1–8); I/O at 24 (1); CPU at 25 (9) |

**Instructor:** `CPU utilization = 16/(16+10) = 16/26 = 0.615`

> b) with multiprogramming (order of running A, B, C)

**Timeline (Time 0–16; the axis is drawn to 25 but the last cell used is 16):**

| Process | Slots |
|---|---|
| A | CPU at 0–1 (1, 2); I/O at 2–4 (1, 2, 3); CPU at 5–7 (3, 4, 5) |
| B | CPU at 2 (1); I/O at 3–8 (1–6); CPU at 9 (2) |
| C | CPU at 3–4 (1, 2); CPU at 8 (3); CPU at 10–14 (4, 5, 6, 7, 8); I/O at 15 (1); CPU at 16 (9) |

**Instructor:** `CPU utilization = 16/(16+1) = 16/17 = 0.94`

**Recomputation:**
- (a) Run serially, total real time = 16 CPU + 10 I/O = 26 units, so 16/26 = **0.615**. **Agree.**
- (b) CPU owner in each slot: 0 A, 1 A, 2 B, 3 C, 4 C, 5 A, 6 A, 7 A, 8 C, 9 B, 10–14 C, **15 idle** (C doing its I/O, nobody else left), 16 C. That is 16 busy slots out of 17, so 16/17 = **0.941**. **Agree.**

### Q3: memory and I/O wait (lecture Part 3, modeling multiprogramming)

> 3) A computer has 4 GB of RAM of which the operating system occupies 512 MB. The processes are all 256 MB (for simplicity) and have the same characteristics. If the goal is 99% CPU utilization, what is the maximum I/O wait that can be tolerated?

**Instructor's working:**
```
4 GB = 4 x 2^10 x 2^20 = 4 x 1024 x 2^20 = 4096 MB
Memory occupied by programs = 4096 MB – 512 MB = 3584 MB
# loaded programs in RAM = 3584/256 = 14
Utilization = 1 – p^14 => 0.99 = 1 – p^14 => p^14 = 0.01 => p ≈ 0.72
```

**Recomputation:** (4096 − 512) / 256 = 14 processes. p = 0.01^(1/14) = e^(ln 0.01 / 14) = e^(−4.60517/14) = e^(−0.32894) = **0.7197 ≈ 0.72**. A process may wait on I/O up to about 72% of the time. **Agree.**

### Q4: sequential vs parallel jobs (lecture Part 3, modeling multiprogramming)

> 4) Multiple jobs can run in parallel and finish faster than if they had run sequentially. Suppose that two jobs, each needing 20 minutes of CPU time, start simultaneously. How long will the last one take to complete if they run sequentially? How long if they run in parallel? Assume 50% I/O wait.

**Instructor's working:**
```
20 + (1/2)xT = T => T = 40 minutes for each process
Running sequentially = 40 + 40 = 80 minutes
Running in parallel:
CPU utilization = 1 – (1/2)^2 = 3/4
CPU utilization = 40/Ttotal=>Ttotal= 40/(3/4) = 160/3 ≈ 53.3 minutes
```

**Recomputation:**
- One job alone keeps the CPU busy 50% of the time, so 20 min of CPU takes T = 20 / 0.5 = 40 min.
- Sequentially, the last job finishes at 40 + 40 = **80 min**.
- In parallel, utilization = 1 − 0.5² = 0.75. The CPU must deliver 20 + 20 = 40 min of work, so T = 40 / 0.75 = 160/3 = **53.33 min**.
- **Agree.** (The "40" in the instructor's last line is the two jobs' combined CPU time, not the 40 min single-job time.)

### Q5: direct-mapped cache (lecture Part 1)

> 5) A computer system uses a direct-mapped cache with 4 cache lines. Initially, all cache lines are empty. Each memory request represents one memory block.
> The following memory block requests occur from left to right:
> **10, 22, 11, 25, 19, 11, 24, 6, 15, 19, 10, 0, 0, 6, 29, 11, 26, 12, 10, 12**
>   a. Calculate the total number of cache hits and cache misses.
>   b. Determine the final contents of all four cache lines after processing the entire sequence of memory requests. List the memory block stored in each cache line.

**Instructor's per-line trace.** The subscript is the request's position in the sequence; blue = miss, red = hit.
```
[0]  24₇, 0₁₂, 0₁₃(red), 12₁₈, 12₂₀(red),
[1]  25₄, 29₁₅,
[2]  10₁, 22₂, 6₈, 10₁₁, 6₁₄, 26₁₇, 10₁₉,
[3]  11₃, 19₅, 11₆, 15₉, 19₁₀, 11₁₆,
```
Boxed result:
```
Miss : 18
Hit  : 2
Miss rate : 90.000%
Hit  rate : 10.000%
```
Final contents (instructor):
```
[0] 12
[1] 29
[2] 10
[3] 11
```

**Recomputation (line = block mod 4):**

| # | Block | Line | H/M | Line contents after |
|---|---|---|---|---|
| 1 | 10 | 2 | M | [2]=10 |
| 2 | 22 | 2 | M | [2]=22 |
| 3 | 11 | 3 | M | [3]=11 |
| 4 | 25 | 1 | M | [1]=25 |
| 5 | 19 | 3 | M | [3]=19 |
| 6 | 11 | 3 | M | [3]=11 |
| 7 | 24 | 0 | M | [0]=24 |
| 8 | 6 | 2 | M | [2]=6 |
| 9 | 15 | 3 | M | [3]=15 |
| 10 | 19 | 3 | M | [3]=19 |
| 11 | 10 | 2 | M | [2]=10 |
| 12 | 0 | 0 | M | [0]=0 |
| 13 | 0 | 0 | **H** | [0]=0 |
| 14 | 6 | 2 | M | [2]=6 |
| 15 | 29 | 1 | M | [1]=29 |
| 16 | 11 | 3 | M | [3]=11 |
| 17 | 26 | 2 | M | [2]=26 |
| 18 | 12 | 0 | M | [0]=12 |
| 19 | 10 | 2 | M | [2]=10 |
| 20 | 12 | 0 | **H** | [0]=12 |

Result: **18 misses, 2 hits** (miss rate 90%, hit rate 10%). Final lines: **[0] 12, [1] 29, [2] 10, [3] 11**. **Agree.**

### Unreadable or uncertain
- Part 1 Q61: options 1 and 2 differ only by a small bar overlap, which is hard to judge at screenshot resolution. The arrow is clearly on option 2.
- Part 1 Q43: one option is cut by the page break but is still readable. Q27's code listing spans the break; no lines appear lost.
- No arrow on Q1, because the student's own choice was correct.

# COMP 4736 Part 3 (Processes): facts, figures and worked answers transcribed from the instructor's deck

Source file: `D:/BCIT/COMP4736/lectures/Part_3_Processes.pdf` (68 slides, title slide "Processes and Threads / Chapter 2"; text dump `Part_3_Processes.txt`, rendered pages `Part_3_Processes_pages/p001.png` … `p068.png`). Downloaded 2026-10-26.
Every page image was viewed; the text dump misses all screenshots, code, tables and most figure labels, so everything below marked as code, table or figure comes from the page images.
Textbook: Tanenbaum & Bos, *Modern Operating Systems*, 4th ed. (slide footer: "Tanenbaum & Bo, Modern Operating Systems: 4th ed., (c) 2013 Prentice-Hall, Inc."). Course outline reading: **Chapter 2 and lecture notes**. The textbook was not opened for this transcription; anything attributed to it is from memory and labelled `[unverified, from memory of Tanenbaum]`.
The deck covers processes only; despite the title "Processes and Threads", no slide covers threads.
Slide numbers are PDF pages; progressive builds are transcribed once.

## Title (slide 1)
- "**Processes and Threads**", "Chapter 2".

## The process model: definition (slide 2)
- "A **process** is just an instance of an executing program, including the current values of the program counter (PC), registers, and variables."

## The process model: example program, file and running processes (slide 3)
- "Example:" with three labelled panels: **Code**, **Location**, **Processes**.
- Code (verbatim, including the slide's typo "Preocess"):
```c
#include <stdio.h>
#include <unistd.h>

int main()
{
    printf(" Preocess ID : %ld \n", getpid());
    sleep(100);
    return 0;
}
```
- Location (Windows Explorer listing):

| Name | Date modified | Type | Size |
|---|---|---|---|
| main.c | 2020-07-19 3:09 PM | C File | 1 KB |
| main.exe | 2020-07-19 3:06 PM | Application | 164 KB |

- Processes (terminal, a pstree view), with arrows labelled "**Process Name**" (pointing at `main`) and "**Process ID**" (pointing at the number in brackets):
```
OS:>>
?(1)───mintty(1351)───bash(1352)─┬─main(1477)
                                 ├─main(1475)
                                 └─main(1476)
```
- Point of the slide (our reading): one program file (main.exe) run three times gives three processes, same name `main`, three different process IDs 1475, 1476, 1477, children of bash(1352).

## The process model: source to assembly to machine code (slides 4-5)
- Slide 4 code (verbatim):
```c
#include <stdio.h>
int main()
{
    int sum = 0;
    for(int i=0; i<5; i++){
        sum += i;
    }
    return 0;
}
```
- Slide 5: the same C source, colour-coded line by line against its disassembly. Arrows label the three columns "**Memory location**" (the hex address column), "**Assembly code**" (the mnemonic) and "**Machine code**" (the grey hex bytes above each instruction). Listing, `main:` (address, machine code, assembly):

| Memory location | Machine code | Assembly code |
|---|---|---|
| 401102 | 55 | push rbp |
| 401103 | 48 89 e5 | mov rbp,rsp |
| 401106 | c7 45 fc 00 00 00 00 | mov DWORD PTR [rbp-0x4],0x0 |
| 40110d | c7 45 f8 00 00 00 00 | mov DWORD PTR [rbp-0x8],0x0 |
| 401114 | 83 7d f8 04 | cmp DWORD PTR [rbp-0x8],0x4 |
| 401118 | 7f 0c | jg 401126 <main+0x24> |
| 40111a | 8b 45 f8 | mov eax,DWORD PTR [rbp-0x8] |
| 40111d | 01 45 fc | add DWORD PTR [rbp-0x4],eax |
| 401120 | 83 45 f8 01 | add DWORD PTR [rbp-0x8],0x1 |
| 401124 | eb ee | jmp 401114 <main+0x12> |
| 401126 | b8 00 00 00 00 | mov eax,0x0 |
| 40112b | 5d | pop rbp |
| 40112c | c3 | ret |
| 40112d | 0f 1f 00 | nop DWORD PTR [rax] |

- Colour mapping on the slide: `{` (function entry) ↔ push/mov rbp (green); `int sum = 0;` ↔ 401106 (yellow); `for(int i=0; i<5; i++){` ↔ 40110d, 401114, 401118, 401120, 401124 (lavender); `sum += i;` ↔ 40111a, 40111d (pink); `return 0;` ↔ 401126 (blue); `}` ↔ 40112b, 40112c, 40112d (orange). So `sum` lives at [rbp-0x4] and `i` at [rbp-0x8]; the loop test is `i > 4 → exit` (cmp with 0x4, jg).

## The process model: memory segments (slide 6)
- "Processes in UNIX have their memory divided up into three segments: the **text segment** (i.e., the program code), the **data segment** (i.e., the variables), and the **stack segment**. The data segment grows upward and the stack grows downward."
- Figure: "Address (hex)" from **FFFF** (top) to **0000** (bottom): Stack (arrow down) / **Gap** (hatched) / Data (arrow up) / Text. Caption: "**Processes have three segments: text, data, and stack.**"

## The process model: multiprogramming (slides 7-9)
- Slide 7, "Multiprogramming system": "1. The CPU switches from process to process quickly. 2. The CPU runs each process for tens or hundreds of milliseconds. 3. Strictly speaking, at any one instant the CPU is running only one process." "The rapid switching back and forth is called **multiprogramming**."
- Figure (a) "**Multiprogramming of four programs**": "**One program counter**" threading down through one memory column holding A, B, C (largest), D; label "**Process switch**" at the jumps between them.
- Slide 8 figure (b): "**Four program counters**", arrows to four boxes A, B, C, D, each with its own downward arrow. Caption: "**Conceptual model of four independent, sequential processes.**"
- Slide 9 figure (c): axes "Process" (A, B, C, D) against "Time →"; bars run A, B, C, D, then A, B, C, D again, never two at the same time. Three dashed red time markers **t₁**, **t₂**, **t₃** (added by the instructor): t₁ falls at the end of A's first bar / start of B's; t₂ falls on C's first bar; t₃ falls on D's second bar. Caption (underlined): "**Only one program is active at once.**"
- OPEN: the t₁, t₂, t₃ markers pose an implicit "which process is running at t₁, t₂, t₃?" with no printed answer. From the figure: t₂ → C, t₃ → D; t₁ sits on the A/B boundary.

## Process creation: four events (slide 10)
- "Four principal events that cause processes to be created: 1. **System initialization.** 2. **Execution of a process-creation system call by a running process.** 3. **A user request to create a new process.** 4. **Initiation of a batch job.**"

## Process creation 1: system initialization, daemons (slides 11-13)
- "When an operating system is booted, typically numerous processes are created. 1) Some of these are **foreground processes**, interacting with (human) users and perform work for them. 2) Others run in the **background** and are not associated with particular users, but instead have some specific function. Processes that stay in the background to handle some activity such as email, Web pages, news, printing, and so on are called **daemons**."
- Slide 12, "**Windows 10**": Task Manager, **Services** tab (highlighted: "Task Manager", "Services", column headers "PID", "Status", "Group"). Columns Name | PID | Description | Status | Group. First rows: vpnagent 29180 Cisco AnyConnect Secure Mobility Agent Running; WpnUserService_1c2879 6508 Windows Push Notifications User Service_1c2879 Running UnistackSvcGroup; UserDataSvc_1c2879 5224 User Data Access_1c2879 Running UnistackSvcGroup; UnistoreSvc_1c2879 5224 User Data Storage_1c2879 Running UnistackSvcGroup; PrintWorkflowUserSvc_1c2… 30772 PrintWorkflow_1c2879 Running PrintWorkflow; … wuauserv 6160 Windows Update Running netsvcs; WSearch 9120 Windows Search Running; wscsvc 1560 Security Center Running LocalServiceNetworkRestricted; … WinDefend 3884 Windows Defender Antivirus Service Running; … TrustedInstaller 16684 Windows Modules Installer Running; … (all listed services show Status "Running"). Note several services share one PID (5224 appears for UserDataSvc, UnistoreSvc, PimIndexMaintenanceSvc, OneSyncSvc): services grouped in one host process.
- Slide 13, "**Ubuntu 18.04.4 LTS**", command "**ps -aux | less**" (highlighted columns USER, PID). Header: `USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND`. Rows (all USER root, TTY ?, START 14:31):

| PID | %CPU | %MEM | VSZ | RSS | STAT | TIME | COMMAND |
|---|---|---|---|---|---|---|---|
| 1 | 0.1 | 0.1 | 225984 | 9744 | Ss | 0:11 | /sbin/init splash |
| 2 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [kthreadd] |
| 6 | 0.0 | 0.0 | 0 | 0 | I< | 0:00 | [mm_percpu_wq] |
| 7 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [ksoftirqd/0] |
| 8 | 0.4 | 0.0 | 0 | 0 | I | 0:33 | [rcu_sched] |
| 9 | 0.0 | 0.0 | 0 | 0 | I | 0:00 | [rcu_bh] |
| 10 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [migration/0] |
| 11 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [watchdog/0] |
| 12 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [cpuhp/0] |
| 13 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [cpuhp/1] |
| 14 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [watchdog/1] |
| 15 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [migration/1] |
| 16 | 0.0 | 0.0 | 0 | 0 | S | 0:03 | [ksoftirqd/1] |
| 19 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [cpuhp/2] |
| 20 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [watchdog/2] |
| 21 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [migration/2] |
| 22 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [ksoftirqd/2] |
| 24 | 0.0 | 0.0 | 0 | 0 | I< | 0:00 | [kworker/2:0H] |
| 25 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [cpuhp/3] |
| 26 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [watchdog/3] |
| 27 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [migration/3] |
| 28 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [ksoftirqd/3] |
| 30 | 0.0 | 0.0 | 0 | 0 | I< | 0:00 | [kworker/3:0H] |
| 31 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [kdevtmpfs] |
| 32 | 0.0 | 0.0 | 0 | 0 | I< | 0:00 | [netns] |
| 33 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [rcu_tasks_kthre] |
| 34 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [kauditd] |
| 39 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [khungtaskd] |
| 40 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [oom_reaper] |
| 41 | 0.0 | 0.0 | 0 | 0 | I< | 0:00 | [writeback] |
| 42 | 0.0 | 0.0 | 0 | 0 | S | 0:00 | [kcompactd0] |
| 43 | 0.0 | 0.0 | 0 | 0 | SN | 0:00 | [ksmd] |
| 44 | 0.0 | 0.0 | 0 | 0 | SN | 0:00 | [khugepaged] |
| 45 | 0.0 | 0.0 | 0 | 0 | I< | 0:00 | [crypto] |

- PID 1 is `/sbin/init splash` (links to init on slide 67).

## Process creation 2: process-creation system call by a running process (slide 14)
- "Often a running process will issue system calls to create one or more new processes to help it do its job."
- "For example, if a large amount of data is being fetched over a network for subsequent processing, it may be convenient to create one process to fetch the data and put them in a shared buffer while a second process removes the data items and processes them. On a multiprocessor, allowing each process to run on a different CPU may also make the job go faster."

## Process creation 3: user request (slide 15)
- "In interactive systems, users can start a program by typing a command or (double) clicking on an icon. Taking either of these actions starts a new process and runs the selected program in it."
- "In command-based UNIX systems running X, the new process takes over the window in which it was started."
- Terminal:
```
OS:>> ls
main.c  main.exe
OS:>> ./main.exe
 Preocess ID : 1487
OS:>>
```

## Process creation 4: batch job (slide 16)
- "The last situation in which processes are created applies only to the batch systems found on large mainframes. Think of inventory management at the end of a day at a chain of stores. Here users can submit batch jobs to the system (possibly remotely)."
- "When the operating system decides that it has the resources to run another job, it creates a new process and runs the next job from the input queue in it."
- Images (decorative): "What is Advanced Research Computing (ARC)?" bubble chart (Supercomputing, Data Mining, Computationally Intensive, Parallel Computing, Big Data, Storage, High Performance Computing (HPC), High Performance Data Analysis (HPDA), Data Intensive Simulation & Analysis, File Transfer, Services, Highly Qualified Personnel, Software & Middleware); Digital Research Alliance of Canada "Strategic Plan 2022-2025" page; link https://alliancecan.ca/en.

## Process termination: four conditions (slide 17)
- "Typical conditions which terminate a process: 1. **Normal exit (voluntary).** 2. **Error exit (voluntary).** 3. **Fatal error (involuntary).** 4. **Killed by another process (involuntary).**"

## Termination 1: normal exit (slide 18)
- "Most processes terminate because they have done their work. When a compiler has compiled the program given to it, the compiler executes a system call to tell the operating system that it is finished. This call is **exit** in UNIX and **ExitProcess** in Windows."
- "Screen-oriented programs also support voluntary termination. Word processors, Internet browsers, and similar programs always have an icon or menu item that the user can click to tell the process to remove any temporary files it has open and then terminate."
- Screenshots labelled "**Close**": a window's red × button with tooltip "Close" (tab "ORAJI-THESIS-20…"), and a File menu (Export To, Attach to Email…, Revert, **Close Ctrl+W**, Properties… Ctrl+D, Print… Ctrl+P).

## Termination 2: error exit (slide 19)
- "The second reason for termination is that the process discovers a fatal error. For example, if a user types the command *cc foo.c* to compile the program *foo.c* and no such file exists, the compiler simply announces this fact and exits."
- Terminal:
```
~$ gcc foo.c
gcc: error: foo.c: No such file or directory
gcc: fatal error: no input files
compilation terminated.
~$
```
- "Screen-oriented interactive processes generally do not exit when given bad parameters. Instead they pop up a dialog box and ask the user to try again."
- Note: the slide's wording for an *error exit* is "discovers a fatal error", and the gcc output says "fatal error", yet "Fatal error" is the name of condition 3 (involuntary). Keep the distinction: error exit = the process notices the problem and exits on its own; fatal error = an error caused by the process (bug) that the OS acts on.

## Termination 3: fatal error (slide 20)
- "The third reason for termination is an error caused by the process, often due to a program bug. Examples include executing an illegal instruction, referencing nonexistent memory, or dividing by zero."
- "In some systems (e.g., UNIX), a process can tell the operating system that it wishes to handle certain errors itself, in which case the process is signaled (interrupted) instead of terminated when one of the errors occurs."

## Termination 4: killed by another process (slide 21)
- "The fourth reason a process might terminate is that the process executes a system call telling the operating system to kill some other process. In UNIX this call is **kill**. The corresponding Win32 function is **TerminateProcess**. In both cases, the killer must have the necessary authorization to do in the killee."
- Terminal (verbatim, including "waitng"):
```
OS:>> ./program.exe  &
[1] 1243
OS:>>  Process waitng 30 seconds.

OS:>> pstree -p
?(1)───mintty(1169)───bash(1170)─┬─program(1243)
                                 └─pstree(1244)
OS:>> kill 1243
OS:>> fg
-bash: fg: job has terminated
[1]+  Terminated              ./program.exe
OS:>>
```

## Process hierarchies (slides 22-24)
- Slide 22: "In some systems, when a process creates another process, the parent process and child process continue to be associated in certain ways. The child process can itself create more processes."
- Slide 23, **UNIX**: "In UNIX, a process and all of its children and further descendants together form a **process group**." "When a user sends a signal from the keyboard, the signal is delivered to all members of the process group currently associated with the keyboard." "Individually, each process can catch the signal, ignore the signal, or take the default action, which is to be killed by the signal."
- Slide 24, **Windows**: "In contrast, Windows has no concept of a process hierarchy. All processes are equal." "The only hint of a process hierarchy is that when a process is created, the parent is given a special token (called a **handle**) that it can use to control the child." "However, it is free to pass this token to some other process, thus invalidating the hierarchy. Processes in UNIX cannot disinherit their children."

## Process states (slides 25-29)
- Slide 25: "Three states a process may be in: 1. **Running** (actually using the CPU at that instant) 2. **Ready** (scheduled and runnable; temporarily stopped to let another process run) 3. **Blocked** (unable to run until some external event happens)."
- Slide 26 figure: three ovals Running (top), Blocked (bottom left), Ready (bottom right). Arrows: **1** Running → Blocked; **2** Running → Ready; **3** Ready → Running; **4** Blocked → Ready. Legend: "1. Process blocks for input 2. Scheduler picks another process 3. Scheduler picks this process 4. Input becomes available". Caption: "A process can be in running, blocked, or ready state. Transitions between these states are as shown." (There is no Blocked → Running and no Ready → Blocked arrow.)

| # | From → To | Legend | Caused by |
|---|---|---|---|
| 1 | Running → Blocked | Process blocks for input | OS discovers the process cannot continue (slide 27) |
| 2 | Running → Ready | Scheduler picks another process | process scheduler (slide 28) |
| 3 | Ready → Running | Scheduler picks this process | process scheduler (slide 28) |
| 4 | Blocked → Ready | Input becomes available | external event (slide 29) |

- Slide 27: "**Transition 1** occurs when the operating system discovers that a process cannot continue right now." "In some systems the process can execute a system call, such as **pause**, to get into blocked state." "In other systems, including UNIX, when a process reads from a pipe or special file (e.g., a terminal) and there is no input available, the process is automatically blocked." Terminal, with red numbers 1, 2, 3, 4 under the four pipeline stages:
```
OS:>>
OS:>> cat data.txt | tr '[A-Z]' 'a-z'| tr -C '[a-z]' '\n' | grep cow
cow
cows
cows
```
  (1 = `cat data.txt`, 2 = `tr '[A-Z]' 'a-z'`, 3 = `tr -C '[a-z]' '\n'`, 4 = `grep cow`.)
- OPEN: the slide numbers the four pipeline processes 1-4 beside the state diagram whose transitions are also numbered 1-4, without saying how they relate. Our reading: the numbers label the four processes of the pipeline; each later stage blocks (transition 1) when the pipe from the previous stage has no input yet. Do not teach "stage k = transition k".
- Slide 28: "**Transitions 2 and 3** are caused by the **process scheduler**, a part of the operating system, without the process even knowing about them." "**Transition 2** occurs when the scheduler decides that the running process has run long enough, and it is time to let another process have some CPU time." "**Transition 3** occurs when all the other processes have had their fair share and it is time for the first process to get the CPU to run again."
- Slide 29: "**Transition 4** occurs when the external event for which a process was waiting (such as the arrival of some input) happens." "If no other process is running at that instant, transition 3 will be triggered and the process will start running." "Otherwise it may have to wait in *ready* state for a little while until the CPU is available and its turn comes."

## Implementation of processes: process table (slide 30)
- "To implement the process model, the operating system maintains a table (an array of structures), called the **process table**, with one entry per process."
- "This entry contains important information about the process' state, including its program counter, stack pointer, memory allocation, the status of its open files, its accounting and scheduling information, and everything else about the process that must be saved when *the process is switched from running to ready or blocked state* (green, underlined) so that it can be restarted later as if it had never been stopped."

## Context switch and PCB (slides 31-32)
- Slide 31: "A **context switch** refers to the process of saving the current state of a running process and loading the saved state of another process so that it can resume execution." "When the CPU scheduler decides to switch from one process to another, it must save the current process's context, including its program counter, register values, and other relevant state information, into the process's **PCB (Process Control Block)**." "PCB is a data structure that represents a single process in the operating system. The PCB is a crucial component within the process table."
- Slide 32 figure: a vertical "**CPU**" time arrow (downward). Sequence: **Process P1** (running) → arrow right → "**Save P1 state**" → "**Restore P2 state**" → arrow left → **Process P2** (running) → arrow right → "**Save P2 state**" → "**Restore P1 state**" → arrow left → **Process P1**. (Save arrows point from the process to the state box; restore arrows point from the state box back to the CPU.)

## Context switch demo: getcontext / setcontext (slides 33-35)
- Slide 33 code (verbatim, editor line numbers dropped; breakpoint on line 16 `int main`):
```c
#include <stdio.h>
#include <ucontext.h>
#include <unistd.h>
#define REG_RIP 16

/* user-level context (uc), includes
   1) signal mask,
   2) stack info,
   3) link to next context,
   and an embedded machine-level context (mc).

   Machine-level context (mc) contains
   General-purpose registers: RIP, RSP, RAX, etc.
   . . . . . . .
*/
int main(int argc, const char *argv[]){
    ucontext_t ctx;
    printf("Capturing context...\n");
    getcontext(&ctx);
    printf("Context captured. Ready to inspect.\n");
    printf("RIP: %llx\n", (unsigned long long)ctx.uc_mcontext.gregs[REG_RIP]);
    return 0;
}
```
  Output:
```
Capturing context...
Context captured. Ready to inspect.
RIP: 56f2d961c1f2
```
- Facts stated in the code comment: a user-level context (uc) includes 1) signal mask, 2) stack info, 3) link to next context, and an embedded machine-level context (mc); the mc contains general-purpose registers RIP, RSP, RAX, etc. `REG_RIP` is defined as 16 (the index of RIP in `gregs`).
- Slide 34: a debugger session (buttons start, pause, continue, step over, step into, step out, help) after `p ctx`, printing the whole `ucontext_t` (first lines verbatim):
```
p ctx
$5 = {uc_flags = 140737353863488, uc_link = 0xffffffff, uc_stack = {
    ss_sp = 0x7ffff7daec40, ss_flags = -6128, ss_size = 0}, uc_mcontext = {
    gregs = {140737488349184, 140737488349192, 140733193388039,
      140737488349264, 140737353899408, 0, 140737488349192, 140737353899408,
      140737353866368, 140737354131072, 140737353895936, 140737488349200,
      140737353899034, 140737354117984, 140737353944517, 140737353897360,
      140737354083125, 676612543333817696, 140737352283740, 1,
      -3866529821160794880, 0, 1}, fpregs = 0x7fffffffe880, __reserved1 = {
      140737353225526, 8388608, 140737352255748, 17179863168,
      14580214252548756736, 73325480322620, 140737353991104,
      140737488350016}}, uc_sigmask = {__val = {140737354037399, 0, 0, 0, 1,
      140737351620416, 140737354131072, 140737354128048, 140737354088359, 13,
      140737354130144, 73325480293968, 3, 17179869184, 2, 1241245548544}},
  __fpregs_mem = {cwd = 289, swd = 0, ftw = 0, fop = 0, rip = 140737353888296,
    rdp = 3573412790848, mxcsr = 1, mxcr_mask = 0, _st = {{significand = {0,
          0, 0, 0}, exponent = 0, __glibc_reserved1 = {0, 0, 0}}, {
        significand = {2432, 0, 2432, 0}, exponent = 2432,
  ...
--Type <RET> for more, q to quit, c to continue without paging--
```
  (The dump continues with repeated `significand = {2432, 0, 2432, 0}, exponent = 2432` entries, then `significand = {256, 0, 0, 0}`, `xmm = {{element = {512, 1024, 0, 0}}, ...`. Shown only to illustrate how much state a context holds; the individual numbers are not course material.)
- Slide 35 code (verbatim):
```c
#include <stdio.h>
#include <ucontext.h>
#include <unistd.h>

int main(){
    ucontext_t context;

    getcontext(&context);
    puts("Hello OS ");
    sleep(1);
    setcontext(&context);
    return 0;
}
```
  Output: `Hello OS` printed six times in the visible window (and continuing): `setcontext` restores the saved context, so execution resumes just after `getcontext` and loops forever; `return 0;` is never reached.

## Context switch analogy: saving and restoring a virtual machine (slides 36-39, no text)
- Four screenshot-only slides (Oracle VM VirtualBox Manager with VMs MikroTik_RouterOS_CHR, DOS, Linux, kali-linux-2022.4-virtualb…):
  - Slide 36: the DOS VM is **Running**; at `C:\>` the user types `edit`; the MS-DOS Editor opens ("Welcome to the MS-DOS Editor / Copyright (C) Microsoft Corporation, 1987-1991. All rights reserved. < Press Enter to see the Survival Guide > < Press ESC to clear this dialog box >").
  - Slide 37: closing the VM opens "**Close Virtual Machine** — You want to: (•) **Save the machine state** / ( ) Send the shutdown signal (greyed) / ( ) Power off the machine — OK / Cancel / Help"; the manager then shows DOS "**Saved**" (red arrow). VM details: Base Memory 32 MB; Boot Order Floppy, Optical, Hard Disk; Acceleration VT-x/AMD-V, Nested Paging; Video Memory 9 MB; Scale-factor 1.50; Graphics Controller VBoxVGA; Remote Desktop Server Disabled; Recording Disabled; Audio Host Driver Windows DirectSound, Controller SoundBlaster 16; Network Adapter 1 PCnet-FAST III (NAT); USB Disabled.
  - Slide 38: starting the saved VM shows "**DOS: Restoring virtual machine**" / "Restoring virtual machine …", status "Restoring".
  - Slide 39: the VM is Running again with the MS-DOS Editor welcome dialog exactly where it was left.
- No caption states the point. Our reading (label as such): saved machine state ↔ saved process context (PCB); restore ↔ load the saved state so execution resumes "as if it had never been stopped" (slide 30).

## Process table entry fields (slide 40)
- Caption: "**Some of the fields of a typical process table entry.**"

| Process management | Memory management | File management |
|---|---|---|
| Registers | Pointer to text segment info | Root directory |
| Program counter | Pointer to data segment info | Working directory |
| Program status word | Pointer to stack segment info | File descriptors |
| Stack pointer | | User ID |
| Process state | | Group ID |
| Priority | | |
| Scheduling parameters | | |
| Process ID | | |
| Parent process | | |
| Process group | | |
| Signals | | |
| Time when process started | | |
| CPU time used | | |
| Children's CPU time | | |
| Time of next alarm | | |

- Counts: 15 process-management fields, 3 memory-management, 5 file-management (23 total).

## Interrupt handling skeleton and the interrupt vector (slide 41)
- "The illusion of multiple sequential processes maintained on one (or each) CPU. Suppose that user process  is running when a disk interrupt happens." (The slide has a double space where a process number would be; see Conflicts.)
- "Skeleton of what the lowest level of the operating system does when an interrupt occurs." (boxed list):
  1. Hardware stacks program counter, etc.
  2. Hardware loads new program counter from interrupt vector.
  3. Assembly language procedure saves registers.
  4. Assembly language procedure sets up new stack.
  5. C interrupt service runs (typically reads and buffers input).
  6. Scheduler decides which process is to run next.
  7. C procedure returns to the assembly code.
  8. Assembly language procedure starts up new current process.
- "Associated with each I/O class is a location (typically at a fixed location near the bottom of memory) called the **interrupt vector**."

## Interrupt Vector Table, x86 real mode (slide 42)
- Caption: "**Interrupt Vector Table of x86 processors running in real mode.**" "Source: WIKIPEDIA".
- Figure: rows by base address, columns +00, +04, +08, +0C; each 4-byte entry is a pair **IP** (pink) | **CS** (blue), labelled with its interrupt number. Bottom rows: 00000000 → INT 0x00, 0x01, 0x02, 0x03; 00000010 → INT 0x04-0x07; 00000020 → INT 0x08-0x0B; 00000030 → INT 0x0C-0x0F; 00000040 → INT 0x10-0x13; 00000050 → INT 0x14-0x17; 00000060 → INT 0x18, 0x19, 0x1A …; (wavy break, dots); top rows 000003C0 (… INT 0xF3), 000003D0 (INT 0xF4 … 0xF7), 000003E0 (INT 0xF8 … 0xFB), 000003F0 (INT 0xFC, 0xFD, 0xFE, 0xFF). Arrows: left-to-right along a row, bottom-to-top up the table.
- Facts readable from the figure: each vector is 4 bytes (IP then CS); 256 vectors (0x00-0xFF) from address 0x000 to 0x3FF; the table sits at the bottom of memory (matches "near the bottom of memory", slide 41). Entry address = 4 × interrupt number (our arithmetic: INT 0x10 at 0x40, INT 0xFF at 0x3FC).

## Modeling multiprogramming: CPU utilization (slides 43-46)
- Slide 43, "CPU utilization, a probabilistic viewpoint": "Suppose that a process spends a fraction *p* of its time waiting for I/O to complete. With *n* processes in memory at once, the probability that all *n* processes are waiting for I/O (in which case the CPU will be idle) is *pⁿ*. The CPU utilization is then given by the formula:" **CPU utilization = 1 − pⁿ**.
- Slide 44 (no title text beyond "Modeling Multiprogramming"), the derivation for **n = 3** (P1, P2, P3), each process idle (waiting) with probability p and busy with 1 − p:

| Case | P1 | P2 | P3 | Probability | Sum |
|---|---|---|---|---|---|
| 0 idle | 1-p | 1-p | 1-p | (1 − p)³ | (1 − p)³ |
| 1 idle | p | 1-p | 1-p | p(1 − p)² | 3p(1 − p)² |
| 1 idle | 1-p | p | 1-p | p(1 − p)² | |
| 1 idle | 1-p | 1-p | p | p(1 − p)² | |
| 2 idle | 1-p | p | p | p²(1 − p) | 3p²(1 − p) |
| 2 idle | p | 1-p | p | p²(1 − p) | |
| 2 idle | p | p | 1-p | p²(1 − p) | |
| 3 idle | p | p | p | p³ | p³ |

  A brace groups the 0-, 1- and 2-idle rows as "**CPU - utilization**": **U = (1 − p)³ + 3p(1 − p)² + 3p²(1 − p)**, **U = 1 − p³**. (The CPU is idle only in the "3 idle" row.)
- Slide 45 figure: x-axis "**Degree of multiprogramming**" 0-10; y-axis "**CPU utilization (in percent)**" 0-100 (ticks 20, 40, 60, 80, 100); three curves "**20% I/O wait**", "**50% I/O wait**", "**80% I/O wait**", labelled "CPU utilization = 1 − pⁿ". Plotted dots, read from the figure and consistent with 1 − pⁿ (values computed by us, label as such):

| n | p = 0.2 | p = 0.5 | p = 0.8 |
|---|---|---|---|
| 1 | 80 % | 50 % | 20 % |
| 2 | 96 % | 75 % | 36 % |
| 3 | 99.2 % | 87.5 % | 48.8 % |
| 4 | 99.8 % | 93.75 % | 59.0 % |
| 5 | ≈100 % | 96.9 % | 67.2 % |
| 6 | ≈100 % | 98.4 % | 73.8 % |
| 7 | ≈100 % | 99.2 % | 79.0 % |
| 8 | ≈100 % | 99.6 % | 83.2 % |
| 10 | ≈100 % | 99.9 % | 89.3 % |

  (The 20 % curve has dots only at n = 1 and 2 before flattening; the 50 % curve's dots run to n = 6 and join the 20 % curve; the 80 % curve has dots at 1-8 and 10.)
- Slide 46, the instructor's worked claim: "From the figure it is clear that if processes spend **80%** of their time waiting for I/O, at least **10 processes** must be in memory at once to get the CPU waste below **10%**." "**CPU waste = (0.8)¹⁰ ≈ 0.1074**" "When you realize that an interactive process waiting for a user to type something at a terminal (or click on an icon) is in I/O wait state, it should be clear that I/O wait times of 80% and more are not unusual." "It should be pointed out that the probabilistic model assumes that all *n* processes are independent."
- Arithmetic check (ours): 0.8¹⁰ = 0.107374… ≈ 0.1074, i.e. 10.74 % waste, utilization 1 − 0.1074 = 0.8926 ≈ 89.3 %. That is *above* 10 %, not below; 0.8¹¹ ≈ 0.0859 (8.6 %) is the first below 10 %. See Conflicts.

## Linux: process address space (slide 47)
- Title "Linux / Processes in Unix". Figure, from **Higher address** (top) to **Lower address** (bottom):

| Region | Callout |
|---|---|
| Kernel space | |
| Stack (grows down, arrow) | "Local variables, return address, and parameters" |
| (gap; heap grows up, arrow) | |
| Heap | |
| BSS | "**B**lock **S**tarted by **S**ymbols. Uninitialized global (or static) variables" |
| Data | "Initialized global (or static) variables" |
| Text | "Program code" |

- A dashed bracket marks Stack down to Text as "**User space**"; Kernel space lies above it.

## Linux: process creation with fork() (slide 48)
- Figure: "Main process (Parent)" (callout "e.g. parent_pid = 4508") → "**fork()**" → two boxes:
  - "**Parent process**: fork_return_value = child_pid (4509)" (callout "e.g. parent_pid = 4508")
  - "**Child process**: fork_return_value = 0" (callout "e.g. child_pid = 4509")
- So fork() returns the child's PID (4509) in the parent and 0 in the child; the parent keeps its own PID 4508.

## Linux: a stripped-down shell (slide 49)
- Code (verbatim, comments aligned at the right on the slide):
```c
#define TRUE 1

while (TRUE) {                                  /* repeat forever */
    type_prompt( );                             /* display prompt on the screen */
    read_command(command, parameters);          /* read input from terminal */

    if (fork( ) != 0) {                         /* fork off child process */
        /* Parent code. */
        waitpid(−1, &status, 0);                /* wait for child to exit */
    } else {
        /* Child code. */
        execve(command, parameters, 0);         /* execute command */
    }
}
```
- Caption: "**A stripped-down shell.** Throughout this book, *TRUE* is assumed to be defined as 1."

## Linux: the /proc pseudo-filesystem (slides 50-53)
- Slide 50, title "process information pseudo-filesystem (proc)"; boxed `man proc`: "The proc filesystem is a pseudo-filesystem which provides an interface to kernel data structures. It is commonly mounted at /proc." Then: "The /proc/ directory contains a wealth of information detailing system hardware and any running processes. In addition, some of the files within /proc/ can be manipulated by users and applications to communicate configuration changes to the kernel (fedora documentation)."
  Terminal `~$ ls /proc/` shows numeric directories **1, 20, 7, 746, 748, 8, 946** and entries: acpi, bootconfig, buddyinfo, bus, cgroups, cmdline, consoles, cpuinfo, crypto, devices, diskstats, dma, driver, dynamic_debug, execdomains, fb, filesystems, fs, interrupts, iomem, ioports, irq, kallsyms, kcore, key-users, keys, kmsg, kpagecgroup, kpagecount, kpageflags, loadavg, locks, mdstat, meminfo, misc, modules, mounts, mtrr, net, pagetypeinfo, partitions, pressure, schedstat, scsi, self, slabinfo, softirqs, spl, stat, swaps, sys, sysrq-trigger, sysvipc, thread-self, timer_list, tty, uptime, version, version_signature, vmallocinfo, vmstat, zoneinfo.
- Slide 51: "Every process in Linux is represented by a directory in /proc e.g." Callouts "**New process**" on `sleep 10000 &`, "**Process ID**" on `1680`, "**New folder is created**" on the `1680` entry:
```
~$ sleep 10000 &
[1] 1680
~$ ls /proc/
1          diskstats      kpagecount   softirqs
1680       dma            kpageflags   spl
169…       driver         loadavg      stat
…          dynamic_debug  locks        swaps
…          …ains          mdstat       sys
…          …              meminfo      sysrq-trigger
748        filesystems    misc         sysvipc
```
- Slide 52: `~$ ls /proc/1680/` lists: arch_status, attr, autogroup, auxv, cgroup, clear_refs, cmdline, comm, coredump_filter, cpu_resctrl_groups, cpuset, cwd, environ, exe, fd, fdinfo, gid_map, io, limits, loginuid, map_files, maps, mem, mountinfo, mounts, mountstats, net, ns, numa_maps, oom_adj, oom_score, oom_score_adj, pagemap, patch_state, personality, projid_map, root, sched, schedstat, sessionid, setgroups, smaps, smaps_rollup, stack, stat, statm, status, syscall, task, timens_offsets, timers, timerslack_ns, uid_map, wchan.
- Slide 53, "e.g. process address space":
```
~$ cat  /proc/1680/maps
5558f1db2000-5558f1db4000 r--p 00000000 00:cf 26481965   /usr/bin/sleep
5558f1db4000-5558f1db8000 r-xp 00002000 00:cf 26481965   /usr/bin/sleep
5558f1db8000-5558f1dba000 r--p 00006000 00:cf 26481965   /usr/bin/sleep
5558f1dbb000-5558f1dbc000 r--p 00008000 00:cf 26481965   /usr/bin/sleep
5558f1dbc000-5558f1dbd000 rw-p 00009000 00:cf 26481965   /usr/bin/sleep
5558f326d000-5558f328e000 rw-p 00000000 00:00 0          [heap]
7f31af675000-7f31af6a7000 r--p 00000000 00:cf 41908341   /usr/lib/locale/C.UTF-8/LC_CTYPE
7f31af6a7000-7f31af81a000 r--p 00000000 00:cf 41908340   /usr/lib/locale/C.UTF-8/LC_COLLATE
7f31af81a000-7f31af83c000 r--p 00000000 00:cf 41899982   /lib/x86_64-linux-gnu/libc-2.31.so
7f31af83c000-7f31af9b4000 r-xp 00022000 00:cf 41899982   /lib/x86_64-linux-gnu/libc-2.31.so
7f31af9b4000-7f31afa02000 r--p 0019a000 00:cf 41899982   /lib/x86_64-linux-gnu/libc-2.31.so
7f31afa02000-7f31afa06000 r--p 001e7000 00:cf 41899982   /lib/x86_64-linux-gnu/libc-2.31.so
7f31afa06000-7f31afa08000 rw-p 001eb000 00:cf 41899982   /lib/x86_64-linux-gnu/libc-2.31.so
7f31afa08000-7f31afa0e000 rw-p 00000000 00:00 0
7f31afa3a000-7f31afa3b000 r--p 00000000 00:cf 41908346   /usr/lib/locale/C.UTF-8/LC_NUMERIC
7f31afa3b000-7f31afa3c000 r--p 00000000 00:cf 41908349   /usr/lib/locale/C.UTF-8/LC_TIME
```
  Reading (ours): the `r-xp` mapping of /usr/bin/sleep is its text (code); the `rw-p` mapping is its data; `[heap]` sits just above; libc is mapped high. Ties to slide 47.

## Linux: process monitoring tools, pstree / ps / top (htop) (slides 54-58)
- Slide 54 (boxed):
  - "**pstree** - display a tree of processes", e.g. `pstree -p -T`
  - "**ps** - report a snapshot of the current processes", e.g. `ps aux`
  - "**top** - display Linux processes", e.g. `top`
- Slide 55 (highlights "Pstree, ps"):
```
~$ pstree -p -T
tini(1)───sh(7)───node(8)─┬─bash(746)───pstree(859)
                          ├─bash(748)
                          └─sshd(20)
~$
```
```
~$ ps ax
  PID TTY      STAT   TIME COMMAND
    1 ?        Ss     0:00 /cocalc/bin/tini -v -g -- sh -c env -i
    7 ?        SN     0:00 sh -c env -i /cocalc/init/init.sh $COC
    8 ?        RNl    0:10 node --optimize-for-size --gc-interval
   20 ?        SN     0:00 sshd: /usr/sbin/sshd -D -p 2222 -h /tm
  314 pts/0    SNs    0:00 /bin/bash
  401 pts/0    SN     0:00 sleep 10000
  403 pts/0    RN+    0:00 ps ax
~$
```
  (Lines are cut off at the right edge on the slide.)
- Slide 56 (highlights "top"), a top screen:
```
Tasks: 160 total,   1 running, 159 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.7 us,  0.0 sy,  0.0 ni, 99.3 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :    971.5 total,    117.5 free,    402.5 used,    451.6 buff/cache
MiB Swap:    448.5 total,    307.1 free,    141.4 used.    417.1 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   1233 root      20   0  306476  69736  13224 S   0.7   7.0   0:06.99 Xorg
   1935 asp       20   0  313944  27712  19276 S   0.7   2.8   0:02.74 xfce4-terminal
   8140 asp       20   0   11856   3604   3096 R   0.3   0.4   0:00.06 top
      1 root      20   0  102960  10488   6744 S   0.0   1.1   0:02.40 systemd
      2 root      20   0       0      0      0 S   0.0   0.0   0:00.00 kthreadd
      3 root       0 -20       0      0      0 I   0.0   0.0   0:00.00 rcu_gp
      4 root       0 -20       0      0      0 I   0.0   0.0   0:00.00 rcu_par_gp
      6 root       0 -20       0      0      0 I   0.0   0.0   0:00.00 kworker/0:0H-events_highpri
      7 root      20   0       0      0      0 I   0.0   0.0   0:01.74 kworker/0:1-events
      9 root       0 -20       0      0      0 I   0.0   0.0   0:00.00 mm_percpu_wq
     10 root      20   0       0      0      0 S   0.0   0.0   0:00.00 rcu_tasks_rude_
     11 root      20   0       0      0      0 S   0.0   0.0   0:00.00 rcu_tasks_trace
     12 root      20   0       0      0      0 S   0.0   0.0   0:00.31 ksoftirqd/0
     13 root      20   0       0      0      0 I   0.0   0.0   0:00.64 rcu_sched
     14 root      rt   0       0      0      0 S   0.0   0.0   0:00.03 migration/0
```
  Highlighted: the Tasks line (160 total, 1 running, 159 sleeping, 0 stopped, 0 zombie).
- Slide 57, the same top screen with annotations naming the columns:

| top column | Slide label |
|---|---|
| PID | Process ID |
| USER | User name |
| PR | Priority |
| NI | Nice value |
| VIRT | Virtual Image |
| RES | Resident size |
| SHR | Shared Mem size |
| S | Process Status |
| %CPU | CPU usage |
| %MEM | Memory usage |

- Slide 58 (highlights "htop"): an htop screen in an "Ubuntu" window: CPU meters 0-7 (0: 0.0%, 1: 1.3%, 2: 0.0%, 3: 0.0%, 4: 0.7%, 5: 0.0%, 6: 0.0%, 7: 0.7%); Mem 586M/3.79G; Swp 0K/1.00G; "Tasks: 50, 57 thr; 1 running"; "Load average: 0.00 0.03 0.09"; "Uptime: 00:23:16". Columns PID USER PRI NI VIRT RES SHR S CPU% MEM% TIME+ Command. Rows: 1 root 20 0 162M 11732 8212 S 0.7 0.3 0:15.50 /sbin/init; 762 root 20 0 44220 37492 9984 S 0.7 0.9 0:09.29 python3 /snap/ubuntu-…; 2 root 20 0 2280 1300 1188 S 0.0 0.0 0:00.01 /init; 7 root 20 0 2308 136 132 S 0.0 0.0 0:00.01 plan9 --control-socke…; 8 root 20 0 2308 136 132 S 0.0 0.0 0:00.00 plan9 --control-socke…; 9 root 20 0 2280 1300 1188 S 0.0 0.0 0:00.00 /init; 63 root 19 -1 47904 16684 15564 S 0.0 0.4 0:00.22 /lib/systemd/systemd-…; 96 root 20 0 22944 6544 4440 S 0.0 0.2 0:00.22 /lib/systemd/systemd-…; 118 root 20 0 4496 148 0 S 0.0 0.0 0:00.00 snapfuse /var/lib/sna…; 122 root 20 0 4760 2164 1624 S 0.0 0.1 0:01.14 snapfuse /var/lib/sna…; 123 root 20 0 4496 176 32 S 0.0 0.0 0:00.00 snapfuse /var/lib/sna…. Function keys: F1 Help, F2 Setup, F3 Search, F4 Filter, F5 Tree, F6 SortBy, F7 Nice −, F8 Nice +, F9 Kill, F10 Quit.

## Linux: process state codes from `man ps` (slides 59-60)
- Slide 59, boxed `man ps`:
  - **D** uninterruptible sleep (usually IO and cannot be killed)
  - **I** Idle kernel thread
  - **R** running or runnable (on run queue)
  - **S** interruptible sleep (waiting for an event to complete and can be killed)
  - **T** stopped by job control signal
  - **X** dead (should never be seen)
  - **Z** defunct ("zombie") process, terminated but not reaped by its parent
  - **<** high-priority (not nice to other users)
  - **N** low-priority (nice to other users)
  - **+** is in the foreground process group
- Slide 60: banner "S interruptible sleep (waiting for an event to complete)"; the same `ps ax` output as slide 55 with STAT highlighted and the row `401 pts/0 SN 0:00 sleep 10000` boxed: `sleep 10000` is in state **S** (sleeping, waiting for its timer), with **N** (low priority).
- OPEN: the screenshots also show STAT flags **s** (Ss, SNs) and **l** (RNl) that slide 59 does not list. `[unverified, from memory of man ps]`: s = is a session leader, l = is multi-threaded. Not on the slides; do not quiz.

## Linux: process state diagram (slide 61)
- Five states: **(D) Uninterruptible Sleep**, **(R) Running/Runnable** (centre), **(T) Stopped**, **(S) Interruptible Sleep**, **(Z) Zombie**. Arrows:

| From → To | Label |
|---|---|
| R → D | (unlabelled) |
| D → R | **wake up** |
| R → S | (unlabelled) |
| S → R | **wake up/signal** |
| R → T | **SIGSTOP** |
| T → R | **SIGCONT** |
| R → Z | **Exit()** |

- Note: D returns only on "wake up", S on "wake up/signal" (matches slide 59: D cannot be killed, S can). No arrow leaves Z.

## Linux: stopped state demo (slide 62)
- Banner "T stopped by job control signal".
```
asp@asp-VirtualBox:~/Desktop/OS$ ./a.out
[1]+  Stopped                 ./a.out
asp@asp-VirtualBox:~/Desktop/OS$
```
- top (boxed "1 stopped,"):
```
Tasks: 161 total,   1 running, 159 sleeping,   1 stopped,   0 zombie
%Cpu(s):  0.3 us,  0.0 sy,  0.0 ni, 99.7 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :    971.5 total,     87.0 free,    446.5 used,    438.1 buff/cache
MiB Swap:    448.5 total,    307.4 free,    141.1 used.    367.3 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   8266 asp       20   0    2364    512    448 T   0.0   0.1   0:00.00 a.out
```
- The slide does not show how the job was stopped (no keystroke or signal shown).

## Linux: zombie process (slides 63-66)
- Slide 63: "The parent process is responsible for waiting for child process to terminate and then cleaning up the child process entry from the process table." "The zombie process can be easily created when the parent process does not wait for the child process termination. A zombie process doesn't consume many system resources, but it does continue to live in the system's task list."
  Figure: Parent process → (fork()) → Child process → (exec()) → Child process → (exit()) → **Zombie process** → up arrow to Parent process; the dashed Parent → Parent line is labelled **wait()** with wait() **struck through** (the parent does not wait).
- Slide 64: program output and top:
```
~$ ./a.out
Child: pid is 1550
Parent: pid is 1549
~$
```
```
top - 23:58:38 up  4:15,  0 users,  load average: 1.84, 1.99, 2.58
Tasks:   9 total,   1 running,   7 sleeping,   0 stopped,   1 zombie
%Cpu(s): 13.2 us,  6.0 sy,  1.8 ni, 75.4 id,  2.7 wa,  0.0 hi,  0.8 si,  0.0 st
MiB Mem :  32104.4 total,  10043.8 free,   3500.7 used,  18559.8 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.  26939.4 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
      8 user      38  18  963500 111260  33800 S   2.0   0.3   1:27.32 node
      1 user      20   0    2500    584    520 S   0.0   0.0   0:00.06 tini
      7 user      38  18    2616    600    528 S   0.0   0.0   0:00.00 sh
     20 user      38  18   12180   6788   5956 S   0.0   0.0   0:00.01 sshd
    363 user      38  18    8116   6056   3308 S   0.0   0.0   0:00.13 bash
    910 user      38  18    8116   6232   3484 S   0.0   0.0   0:00.08 bash
   1549 user      38  18    2364    512    444 S   0.0   0.0   0:00.00 a.out
   1550 user      38  18       0      0      0 Z   0.0   0.0   0:00.00 a.out
   1551 user      38  18    7904   3612   3096 R   0.0   0.0   0:00.00 top
```
  "1 zombie" is highlighted with a red dotted arrow to the **Z** of PID 1550 (the child); parent 1549 is still alive in S. The zombie's VIRT, RES and SHR are all 0.
- Slide 65: the same diagram with **wait()** not struck through, and the "Zombie process" box crossed out by a red "no entry" sign: when the parent waits, no zombie remains.
- Slide 66: the fixed program:
```
~$ ./a.out
Child: pid is 1850
Parent: pid is 1849
~$
```
```
top - 00:14:44 up  4:31,  0 users,  load average: 1.55, 1.86, 2.08
Tasks:   8 total,   1 running,   7 sleeping,   0 stopped,   0 zombie
%Cpu(s): 11.3 us,  4.4 sy,  1.8 ni, 81.3 id,  0.7 wa,  0.0 hi,  0.6 si,  0.0 st
MiB Mem :  32104.4 total,  10316.8 free,   3168.3 used,  18619.2 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.  27271.3 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
      8 user      38  18  964264 113720  33800 S  10.6   0.3   2:11.88 node
      1 user      20   0    2500    584    520 S   0.0   0.0   0:00.08 tini
      7 user      38  18    2616    600    528 S   0.0   0.0   0:00.00 sh
     20 user      38  18   12180   6788   5956 S   0.0   0.0   0:00.01 sshd
    363 user      38  18    8116   6056   3308 S   0.0   0.0   0:00.14 bash
    910 user      38  18    8116   6232   3484 S   0.0   0.0   0:00.08 bash
   1848 user      38  18    7904   3540   3024 R   0.0   0.0   0:00.00 top
   1849 user      38  18    2364    572    508 S   0.0   0.0   0:00.00 a.out
```
  "0 zombie" highlighted; only the parent 1849 is listed (boxed); the child 1850 is gone.
- The source of `a.out` is **not shown** on any zombie slide; only its output. Do not invent the program as slide material.

## Linux: orphan process (slides 67-68)
- Slide 67: "The parent dies (or terminates) before its child. It means that the child process is still running even thought the parent process has terminated. The child process will be automatically adopted by the **init** process (the parent of all the processes with the pid of 1)."
```
~$ pstree -p -T
tini(1)───sh(6)───node(7)─┬─bash(273)───pstree(476)
                          ├─bash(433)───a.out(474)───a.out(475)
                          └─sshd(19)
~$ pstree -p -T
tini(1)─┬─a.out(475)
        └─sh(6)───node(7)─┬─bash(273)───pstree(477)
                          ├─bash(433)
                          └─sshd(19)
~$
```
- Slide 68, the same screen with callouts: in the first tree, "**Parent**" → a.out(474), "**Child**" → a.out(475); in the second tree, "**Parent**" → tini(1), "**Child**" → a.out(475). So after a.out(474) terminated, its child 475 was re-parented to PID 1 (here `tini`, playing init's role in this container).
- No code is shown for the orphan program.

## Beyond the slides (label as such in the lessons)
- Computed curve values in the slide-45 table are ours (1 − pⁿ); the slide only plots them.
- The t₁/t₂/t₃ answers, the pipeline reading on slide 27, the VirtualBox-as-context-switch reading on slides 36-39, and the /proc/maps segment reading are ours.
- Interrupt-vector address arithmetic (entry = 4 × number, 256 entries × 4 bytes = 1 KB at 0x000-0x3FF) is read from the figure, not stated in words.
- `[unverified, from memory of Tanenbaum]`: Tanenbaum's text describes the process-table entry as "sometimes called a process control block"; the slides' PCB definition (slide 31) is the instructor's wording.
- `[unverified, from memory of Tanenbaum]`: the stripped-down shell (Fig. 1-19) and the three-segment figure (Fig. 1-20) are in Chapter 1 §1.6 of the book, not Chapter 2; the 1 − pⁿ curve is Fig. 2-6, the state diagram Fig. 2-2, the table Fig. 2-4, the interrupt skeleton Fig. 2-5.
- Linux D/R/S/T/Z, /proc, pstree/ps/top/htop, zombie and orphan material is instructor material, not from Tanenbaum Chapter 2.

## Conflicts and open questions
- **Slide 46 arithmetic contradicts its own claim.** "At least 10 processes must be in memory at once to get the CPU waste below 10%", but the slide's own number is 0.8¹⁰ ≈ 0.1074 = 10.74 %, which is *above* 10 %. Strictly, 11 processes are needed (0.8¹¹ ≈ 0.0859). The wording is Tanenbaum's `[unverified, from memory of Tanenbaum]`, where it reads as a figure-reading approximation. Teach the slide's sentence and number verbatim and flag the gap; a quiz may expect "10".
- Slide 41: "Suppose that user process  is running" has a missing number (double space). `[unverified, from memory of Tanenbaum]`: the book says "user process 3".
- Slide 19: an *error exit* is described as the process discovering "a fatal error", and the gcc output says "fatal error", while "Fatal error" is the separate condition 3. Keep the voluntary/involuntary split.
- Slide 19 text says `cc foo.c`; the screenshot runs `gcc foo.c`.
- Slide 6 shows three segments (text, data, stack) with addresses 0000-FFFF; slide 47 shows five user regions (text, data, BSS, heap, stack) plus kernel space. Both are slide material: the first is the classic UNIX model, the second the Linux layout.
- Slide 3 and 15 code print "Preocess ID" (typo in the program); slide 21 output "Process waitng" (typo).
- Slide 67 "even thought" (typo for "even though").
- OPEN (slide 9): which process is running at t₁, t₂, t₃: no printed answer.
- OPEN (slide 27): meaning of the red 1-4 under the pipeline is not stated.
- OPEN (slides 55, 60): STAT flags s and l appear without definition.
- OPEN (slide 62): how the process was stopped (Ctrl-Z / SIGTSTP vs SIGSTOP) is not shown; slide 61 names only SIGSTOP / SIGCONT.
- Slide 1 title says "Processes and Threads" but no thread content appears in this deck.

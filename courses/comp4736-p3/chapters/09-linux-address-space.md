---
title: Text, data, BSS, heap, stack and /proc
minutes: 15
---

A running program's variables live at real addresses, and Linux lets you read the map of those addresses from a file. This lesson places every kind of variable in its region and then finds the regions in `/proc`.

## Slide 47 splits user space into five regions

Slide 47 ("Linux / Processes in Unix") draws one process's address space, highest address at the top:

| Region | Slide callout | Growth |
|---|---|---|
| Kernel space | | |
| Stack | *Local variables, return address, and parameters* | grows down |
| (gap) | | |
| Heap | | grows up |
| BSS | *Block Started by Symbols. Uninitialized global (or static) variables* | |
| Data | *Initialized global (or static) variables* | |
| Text | *Program code* | |

The dashed bracket labels Stack down to Text as **user space**; kernel space sits above it. The stack and heap arrows point at each other across the gap, so each can grow until they meet.

Slide 6 drew the classic UNIX picture with three segments: text, data and stack ([A process is a program in execution](#/comp4736-p3/process-model)). Slide 47 is the Linux layout of the same idea: the old "data" is split into initialized data, BSS and the heap, and kernel space is shown on top.

In C terms:

- `int count = 5;` outside any function: **data** (initialized global).
- `int total;` outside any function, or `static int hits;` inside one: **BSS** (uninitialized global or static).
- `int i;` inside a function, its parameters, and the return address of the call: **stack**.
- The block `malloc` hands back: **heap**.
- The compiled instructions of `main`: **text**.

## Every process is a directory in /proc

Slide 50 quotes `man proc`: *The proc filesystem is a pseudo-filesystem which provides an interface to kernel data structures. It is commonly mounted at /proc.* Nothing in it is stored on disk; the kernel generates each file when you read it. The slide adds that some files *can be manipulated by users and applications to communicate configuration changes to the kernel*.

Slide 51: *Every process in Linux is represented by a directory in /proc.* The demo starts `sleep 10000 &`, the shell answers `[1] 1680`, and `ls /proc/` now lists a new folder `1680` among the numbered ones (1, 748 …). Slide 52 lists what is inside `/proc/1680/`: among others `cmdline`, `cwd`, `environ`, `exe`, `fd`, `maps`, `stat`, `status` and `task`.

## /proc/PID/maps lists the address space

Slide 53, *e.g. process address space*, prints the map of the sleeping process:

```text
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

Each line is one mapped range: start-end address, permissions (`r` read, `w` write, `x` execute, `p` private), offset into the file, device, inode, and the file or a name in brackets. The slide does not label the lines; this reading is ours and ties them to slide 47:

| Permissions | Region |
|---|---|
| `r-xp` of `/usr/bin/sleep` | text: the only executable mapping of the program |
| `rw-p` of `/usr/bin/sleep` | data: writable, backed by the file |
| `[heap]` | heap, just above the program |
| `[stack]` | stack, near the top of user space (not in the slide's excerpt) |

Shared libraries such as `libc` are mapped far higher, with their own text (`r-xp`) and data (`rw-p`).

## Lab 4's program prints where its variables live

Lab 4 compiled this program with `gcc -static` and ran it:

```cpp pin main2.c
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>

int global_variable = 100;
int un_global_variable;

int main()
{
    char str[30];
    int *ptr;
    int local_variable = 200;
    int un_local_variable;

    ptr = (int*) malloc(2 * sizeof(int));

    pid_t pid;
    pid = getpid();

    printf("\n");
    printf(" Global variable                : %p\n", &global_variable);
    printf(" Uninitialized global variable  : %p\n", &un_global_variable);

    printf(" Local variable                 : %p\n", &local_variable);
    printf(" Uninitialized local variable   : %p\n", &un_local_variable);

    printf(" Memory allocation              : %p\n\n", ptr);
    printf("  ======== The Process Address Space ( pid = %d )========\n\n", pid);

    sprintf(str, "cat -b /proc/%d/maps", pid);
    system(str);
    free(ptr);

    return 0;
}
```

The exact addresses cannot be predicted, but their sizes can. Before reading on, decide which of the five printed addresses sit close together, which one is by far the largest pair, and which numbered maps line each will fall in.

```text
~$ gcc -static main2.c -o main2.out
~$ ./main2.out

 Global variable                : 0x4b40d0
 Uninitialized global variable  : 0x4b5a90
 Local variable                 : 0x7ffdef98229c
 Uninitialized local variable   : 0x7ffdef9822a0
 Memory allocation              : 0xfdc440

 ======== The Process Address Space ( pid = 111 )========

     1  00400000-00401000 r--p 00000000 00:25 1407     /home/user/main2.out
     2  00401000-00489000 r-xp 00001000 00:25 1407     /home/user/main2.out
     3  00489000-004b0000 r--p 00089000 00:25 1407     /home/user/main2.out
     4  004b0000-004b4000 r--p 000b0000 00:25 1407     /home/user/main2.out
     5  004b4000-004b6000 rw-p 000b4000 00:25 1407     /home/user/main2.out
     6  004b6000-004bc000 rw-p 00000000 00:00 0
     7  00fdb000-00ffd000 rw-p 00000000 00:00 0        [heap]
     8  78c22c06c000-78c22c070000 r--p 00000000 00:00 0   [vvar]
     9  78c22c070000-78c22c072000 r--p 00000000 00:00 0   [vvar_vclock]
    10  78c22c072000-78c22c074000 r-xp 00000000 00:00 0   [vdso]
    11  7ffdef963000-7ffdef984000 rw-p 00000000 00:00 0   [stack]
    12  ffffffffff600000-ffffffffff601000 --xp 00000000 00:00 0   [vsyscall]
```

- `int global_variable = 100;` (0x4b40d0) and `int un_global_variable;` (0x4b5a90) both fall in line 5, the program's `rw-p` range: data, with BSS starting right after it in the same page range.
- `int local_variable = 200;` and `int un_local_variable;` are 4 bytes apart near 0x7ffd…, inside line 11, `[stack]`. Initialized or not, a local lives on the stack.
- `malloc(2 * sizeof(int))` returned 0xfdc440, inside line 7, `[heap]`.
- The code itself is line 2, the only `r-xp` range of `main2.out`: text.

The program reads its own map: `sprintf(str, "cat -b /proc/%d/maps", pid);` builds the command with its own PID, and `cat -b` numbers the lines.

## Place five addresses in a new maps listing

A program `calc` prints its variables' addresses and then its own map. Answer each from the listing.

```quiz
[
  {
    "q": "The global `int total = 7;` is at 0x55e4a2a03010. Which numbered line holds it?",
    "code": "1  55e4a2a00000-55e4a2a01000 r--p 00000000 08:01 5512  /home/user/calc\n2  55e4a2a01000-55e4a2a02000 r-xp 00001000 08:01 5512  /home/user/calc\n3  55e4a2a02000-55e4a2a03000 r--p 00002000 08:01 5512  /home/user/calc\n4  55e4a2a03000-55e4a2a04000 rw-p 00003000 08:01 5512  /home/user/calc\n5  55e4a3b1e000-55e4a3b3f000 rw-p 00000000 00:00 0     [heap]\n6  7f2c11a00000-7f2c11bd5000 r-xp 00028000 08:01 2231  /usr/lib/x86_64-linux-gnu/libc.so.6\n7  7ffd5c6e1000-7ffd5c702000 rw-p 00000000 00:00 0     [stack]",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "55e4a2a03000 ≤ 55e4a2a03010 < 55e4a2a04000, so line 4. It is the program's `rw-p` range: initialized globals are in the data region."
  },
  {
    "q": "`malloc` returned 0x55e4a3b1e2a0. Which numbered line holds it?",
    "code": "1  55e4a2a00000-55e4a2a01000 r--p 00000000 08:01 5512  /home/user/calc\n2  55e4a2a01000-55e4a2a02000 r-xp 00001000 08:01 5512  /home/user/calc\n3  55e4a2a02000-55e4a2a03000 r--p 00002000 08:01 5512  /home/user/calc\n4  55e4a2a03000-55e4a2a04000 rw-p 00003000 08:01 5512  /home/user/calc\n5  55e4a3b1e000-55e4a3b3f000 rw-p 00000000 00:00 0     [heap]\n6  7f2c11a00000-7f2c11bd5000 r-xp 00028000 08:01 2231  /usr/lib/x86_64-linux-gnu/libc.so.6\n7  7ffd5c6e1000-7ffd5c702000 rw-p 00000000 00:00 0     [stack]",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "explain": "55e4a3b1e000 ≤ 55e4a3b1e2a0 < 55e4a3b3f000, so line 5, `[heap]`. Memory from `malloc` comes from the heap."
  },
  {
    "q": "A local `int i` inside `main` is at 0x7ffd5c700a4c. Which numbered line holds it?",
    "code": "1  55e4a2a00000-55e4a2a01000 r--p 00000000 08:01 5512  /home/user/calc\n2  55e4a2a01000-55e4a2a02000 r-xp 00001000 08:01 5512  /home/user/calc\n3  55e4a2a02000-55e4a2a03000 r--p 00002000 08:01 5512  /home/user/calc\n4  55e4a2a03000-55e4a2a04000 rw-p 00003000 08:01 5512  /home/user/calc\n5  55e4a3b1e000-55e4a3b3f000 rw-p 00000000 00:00 0     [heap]\n6  7f2c11a00000-7f2c11bd5000 r-xp 00028000 08:01 2231  /usr/lib/x86_64-linux-gnu/libc.so.6\n7  7ffd5c6e1000-7ffd5c702000 rw-p 00000000 00:00 0     [stack]",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "7ffd5c6e1000 ≤ 7ffd5c700a4c < 7ffd5c702000 (6e1000 < 700a4c < 702000), so line 7, `[stack]`. Local variables live on the stack."
  },
  {
    "q": "Which line of the `calc` listing holds the program's own machine code?",
    "options": ["Line 2, the r-xp range of calc", "Line 4, the rw-p range of calc", "Line 6, the r-xp range of libc", "Line 1, the first range of calc"],
    "answer": 0,
    "explain": "Text is program code, so it must be executable: the `x` in `r-xp`. Of the ranges backed by `/home/user/calc`, only line 2 has it. Line 6 is executable too, but it is libc's code, not the program's."
  },
  {
    "q": "`calc` also declares `static int calls;` inside a function, with no initializer. In which slide-47 region does it live?",
    "type": "text",
    "answer": ["BSS", "bss", "Block Started by Symbols"],
    "explain": "A static variable is stored like a global, not on the stack. Uninitialized global (or static) variables go in BSS; with an initializer it would be in data."
  }
]
```

```quiz
[
  {
    "q": "Match each region of the slide-47 address space to what it holds.",
    "type": "match",
    "pairs": [
      ["Text", "Program code"],
      ["Data", "Initialized global (or static) variables"],
      ["BSS", "Uninitialized global (or static) variables"],
      ["Stack", "Local variables, return address, and parameters"],
      ["Heap", "Memory handed out by malloc at run time"]
    ],
    "explain": "Slide 47's callouts, from the bottom: Text is program code, Data the initialized globals, BSS the uninitialized globals, and the Stack holds locals, the return address and parameters. The heap has no callout on the slide; Lab 4's `malloc` result landed in `[heap]`."
  },
  {
    "q": "Uninitialized global variables live in the ___ segment.",
    "type": "text",
    "answer": ["BSS", "bss"],
    "explain": "BSS, *Block Started by Symbols*: uninitialized global (or static) variables. Initialized ones are in the data segment."
  },
  {
    "q": "What does BSS stand for on slide 47?",
    "options": ["Block Started by Symbols", "Basic Stack Segment", "Binary Static Storage", "Base Segment Start"],
    "answer": 0,
    "explain": "The slide bolds the initials: **B**lock **S**tarted by **S**ymbols."
  },
  {
    "q": "In the Linux address space, the stack grows upward toward the heap.",
    "type": "tf",
    "answer": false,
    "explain": "The stack sits high, just under kernel space, and grows down; the heap sits above BSS and grows up. They grow toward each other across the gap."
  },
  {
    "q": "Which region is at the highest address in slide 47's figure?",
    "options": ["Kernel space", "Stack", "Heap", "Text"],
    "answer": 0,
    "explain": "From the top: kernel space, then the stack, the gap, heap, BSS, data and text at the lower address. User space is stack down to text."
  },
  {
    "q": "The proc filesystem is a pseudo-filesystem which provides an interface to user data structures.",
    "type": "tf",
    "answer": false,
    "explain": "`man proc` on slide 50: an interface to **kernel** data structures, commonly mounted at /proc. Its files are generated by the kernel, not stored on disk."
  },
  {
    "q": "After `sleep 10000 &` prints `[1] 1680`, what new entry appears in `/proc`?",
    "options": ["A directory named 1680", "A file named sleep", "A directory named sleep", "Nothing; /proc lists only kernel threads"],
    "answer": 0,
    "explain": "Every process in Linux is represented by a directory in /proc, named by its process ID. Slide 51's `ls /proc/` shows the new folder 1680."
  },
  {
    "q": "Which file in a process's /proc directory shows its address space?",
    "options": ["maps", "status", "cmdline", "environ"],
    "answer": 0,
    "explain": "Slide 53 runs `cat /proc/1680/maps` under the heading *e.g. process address space*. `status`, `cmdline` and `environ` are in the same directory (slide 52) but hold other information."
  },
  {
    "q": "In a maps listing, which permission string marks a program's text?",
    "options": ["r-xp", "rw-p", "r--p", "---p"],
    "answer": 0,
    "explain": "Program code must be executable, so its range carries `x`: `r-xp`. Data and the heap are writable (`rw-p`); `r--p` ranges are read-only data such as constants."
  }
]
```

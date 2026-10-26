---
title: The Win32 API against UNIX, and strace
minutes: 13
---

Windows offers the same services as the POSIX calls under different names, and a few UNIX calls have no Windows counterpart at all. The last two slides on Linux show how to see which system calls a program actually makes.

## The UNIX calls and their Win32 equivalents

Slides 48–49, *The Windows Win32 API* (the table is split across the two slides; lseek and stat appear on both):

| UNIX | Win32 | Description |
|---|---|---|
| fork | CreateProcess | Create a new process |
| waitpid | WaitForSingleObject | Can wait for a process to exit |
| execve | (none) | CreateProcess = fork + execve |
| exit | ExitProcess | Terminate execution |
| open | CreateFile | Create a file or open an existing file |
| close | CloseHandle | Close a file |
| read | ReadFile | Read data from a file |
| write | WriteFile | Write data to a file |
| lseek | SetFilePointer | Move the file pointer |
| stat | GetFileAttributesEx | Get various file attributes |
| mkdir | CreateDirectory | Create a new directory |
| rmdir | RemoveDirectory | Remove an empty directory |
| link | (none) | Win32 does not support links |
| unlink | DeleteFile | Destroy an existing file |
| mount | (none) | Win32 does not support mount |
| umount | (none) | Win32 does not support mount |
| chdir | SetCurrentDirectory | Change the current working directory |
| chmod | (none) | Win32 does not support security (although NT does) |
| kill | (none) | Win32 does not support signals |
| time | GetLocalTime | Get the current time |

Both columns are the same services seen from two operating systems, which is slide 2's point: the set of system calls varies from OS to OS. Most rows are a rename: the Win32 name says in words what the UNIX abbreviation does (`lseek` moves the file pointer, so `SetFilePointer`). Learn the six **(none)** rows as a group:

- **execve**: not missing, merged. *CreateProcess = fork + execve*: one call creates the process and loads the program into it, the two steps the [stripped-down shell](#/comp4736-p5/execve-and-the-shell) does separately.
- **link**: *Win32 does not support links*.
- **mount** and **umount**: *Win32 does not support mount*.
- **chmod**: *Win32 does not support security (although NT does)*.
- **kill**: *Win32 does not support signals*.

:::quiz unlink is not a (none) row
`link` has no Win32 equivalent, but `unlink` does: *DeleteFile*, *Destroy an existing file*. Likewise `fork` maps to `CreateProcess` while `execve` is the (none).
:::

## strace traces system calls and signals

Slide 50 shows the manual header *strace - trace system calls and signals* and the option the demo uses:

*-c --summary-only Count time, calls, and errors for each system call and report a summary on program exit, suppressing the regular output.*

The "regular output" it suppresses is strace's own line-per-call trace; the program's output still appears.

## strace -c on a hello-world program

Slide 51 runs `strace -c` on the smallest C program in the deck.

```cpp pin hello.c
#include <time.h>
#include <unistd.h>
#include <stdio.h>

int main(){
  printf("Hello world!\n");
  return 0;
}
```

The program has one statement that does I/O, `printf("Hello world!\n");`, and then `return 0;`. Guess how many system calls the whole run makes, and which one prints the text, before reading the table.

```text
~$ strace  -c ./a.out
Hello world!
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
  0.00    0.000000           0         1           read
  0.00    0.000000           0         1           write
  0.00    0.000000           0         2           close
  0.00    0.000000           0         3           fstat
  0.00    0.000000           0         7           mmap
  0.00    0.000000           0         3           mprotect
  0.00    0.000000           0         1           munmap
  0.00    0.000000           0         3           brk
  0.00    0.000000           0         6           pread64
  0.00    0.000000           0         1         1 access
  0.00    0.000000           0         1           execve
  0.00    0.000000           0         2         1 arch_prctl
  0.00    0.000000           0         2           openat
------ ----------- ----------- --------- --------- ----------------
100.00    0.000000                    33         2 total
~$
```

- `Hello world!` is the program's own output, printed through the single `write`. `printf` is a library procedure; `write` is the system call underneath it, reached through the [procedure library](#/comp4736-p5/system-call-interface) and the [eleven steps](#/comp4736-p5/eleven-steps) with a TRAP into the kernel.
- The `execve` is the call that loaded `./a.out` into the process, as in the shell loop.
- Not on the slide: the other calls (openat, mmap, mprotect, fstat, close, brk) load and set up the C library before `main` runs.
- **33** calls in total, **2** errors: one from `access`, one from `arch_prctl`.
- Every time is 0.000000 seconds: the run is too short to measure.

```quiz
[
  {
    "q": "Match each UNIX call to its Win32 equivalent.",
    "type": "match",
    "pairs": [
      ["fork", "CreateProcess"],
      ["waitpid", "WaitForSingleObject"],
      ["open", "CreateFile"],
      ["lseek", "SetFilePointer"],
      ["unlink", "DeleteFile"],
      ["time", "GetLocalTime"]
    ],
    "explain": "fork → CreateProcess (create a new process), waitpid → WaitForSingleObject (can wait for a process to exit), open → CreateFile (create a file or open an existing file), lseek → SetFilePointer (move the file pointer), unlink → DeleteFile (destroy an existing file), time → GetLocalTime (get the current time)."
  },
  {
    "q": "Which UNIX call has no Win32 equivalent?",
    "options": ["link", "unlink", "mkdir", "chdir"],
    "answer": 0,
    "explain": "link: Win32 does not support links. unlink is DeleteFile, mkdir is CreateDirectory, chdir is SetCurrentDirectory."
  },
  {
    "q": "In Win32, fork + execve is one call. Name it.",
    "type": "text",
    "answer": ["CreateProcess", "CreateProcess()"],
    "explain": "The execve row reads (none) with the description CreateProcess = fork + execve: one call creates the process and runs the program in it."
  },
  {
    "q": "Which Win32 call corresponds to `stat`?",
    "options": ["GetFileAttributesEx", "SetFilePointer", "CreateFile", "ReadFile"],
    "answer": 0,
    "explain": "stat → GetFileAttributesEx, get various file attributes. SetFilePointer is lseek, CreateFile is open, ReadFile is read."
  },
  {
    "q": "The Win32 table says Win32 does not support signals, so `kill` has no equivalent.",
    "type": "tf",
    "answer": true,
    "explain": "kill → (none), Win32 does not support signals. The other (none) rows are execve, link, mount, umount and chmod."
  },
  {
    "q": "The Win32 table says Windows NT does not support security either, so `chmod` has no equivalent anywhere in Windows.",
    "type": "tf",
    "answer": false,
    "explain": "The row reads: Win32 does not support security (although NT does). Win32 lacks a chmod equivalent, but NT does support security."
  },
  {
    "q": "How many system calls in total did `strace -c` count for the hello-world program?",
    "type": "numeric",
    "answer": 33,
    "tolerance": 0,
    "explain": "1 read + 1 write + 2 close + 3 fstat + 7 mmap + 3 mprotect + 1 munmap + 3 brk + 6 pread64 + 1 access + 1 execve + 2 arch_prctl + 2 openat = 33, with 2 errors."
  },
  {
    "q": "Which system call printed `Hello world!`?",
    "options": ["write", "read", "openat", "execve"],
    "answer": 0,
    "explain": "printf is a library procedure; the bytes reach the terminal through the one write call in the table. execve loaded the program; openat opened library files."
  },
  {
    "q": "What does `strace -c` do?",
    "options": [
      "Counts time, calls, and errors for each system call and reports a summary on program exit",
      "Prints every system call as it happens, with its arguments",
      "Replaces the program with a traced copy, like execve",
      "Traces only signals, not system calls"
    ],
    "answer": 0,
    "explain": "-c --summary-only: count time, calls, and errors for each system call and report a summary on program exit, suppressing the regular output (the per-call trace that strace prints without -c)."
  }
]
```

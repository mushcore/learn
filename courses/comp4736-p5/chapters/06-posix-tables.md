---
title: The POSIX system calls and what they return
minutes: 14
---

Slides 22 and 39 to 41 list the major POSIX system calls in four tables. Each row names the call, its parameters and the variable that receives its return value, and that left-hand variable is half of what there is to learn.

## The caption names every return value

Every POSIX table slide carries the same caption:

*Some of the major POSIX system calls. The return code s is −1 if an error has occurred. The return codes are as follows: pid is a process id, fd is a file descriptor, n is a byte count, position is an offset within the file, and seconds is the elapsed time.*

So the name on the left of `=` tells you what comes back:

| Return code | Meaning | Calls in the four tables |
|---|---|---|
| s | −1 if an error has occurred | execve, close, stat, mkdir, rmdir, link, unlink, mount, umount, chdir, chmod, kill |
| pid | a process id | fork, waitpid |
| fd | a file descriptor | open |
| n | a byte count | read, write |
| position | an offset within the file | lseek |
| seconds | the elapsed time | time |

A call whose only news is success or failure returns s. A call that produces something returns that thing instead: a process id, a descriptor, a count, a position, a time. fork shows that such a call can still signal failure with −1, since slide 23 lists *pid=-1* as *fork fails*. Only `exit(status)` has no return code: the process that calls it is gone, and its status goes to the parent that waits for it.

## Process management (slide 22)

| Call | Description |
|---|---|
| `pid = fork( )` | Create a child process identical to the parent |
| `pid = waitpid(pid, &statloc, options)` | Wait for a child to terminate |
| `s = execve(name, argv, environp)` | Replace a process' core image |
| `exit(status)` | Terminate process execution and return status |

fork's pid means different things in the two processes it leaves behind; [the fork programs](#/comp4736-p5/fork-programs) show all three cases. waitpid takes a pid as its first parameter and returns one. The `&` in `&statloc` passes an address, so the kernel can write the child's exit status into the caller's variable (Tanenbaum §1.6.1, not on the slide). The slide 32 program calls it as `waitpid(-1, &status, 0)`. execve returns s, which is useful only when it fails ([execve and the shell](#/comp4736-p5/execve-and-the-shell)).

## File management (slide 39)

| Call | Description |
|---|---|
| `fd = open(file, how, ...)` | Open a file for reading, writing, or both |
| `s = close(fd)` | Close an open file |
| `n = read(fd, buffer, nbytes)` | Read data from a file into a buffer |
| `n = write(fd, buffer, nbytes)` | Write data from a buffer into a file |
| `position = lseek(fd, offset, whence)` | Move the file pointer |
| `s = stat(name, &buf)` | Get a file's status information |

open is the only call here that hands out an fd; every other file call takes one. Its `how` parameter says which of the description's three cases is meant: reading, writing, or both. fds 0, 1 and 2 are already open when a program starts ([standard streams](#/comp4736-p5/standard-streams)), which is why the slide 6 demo could call `read(fd, buffer, 100)` with fd = 0 and no open. read and write return n, the number of bytes actually moved, which can be smaller than nbytes: the demo asked for 100 and got 13. lseek returns the new position, an offset within the file; whence says what offset is measured from, the start, the current position or the end (Tanenbaum §1.6.2, not on the slide). stat, like waitpid, takes an address and fills the structure there.

## Directory and file system management (slide 40)

| Call | Description |
|---|---|
| `s = mkdir(name, mode)` | Create a new directory |
| `s = rmdir(name)` | Remove an empty directory |
| `s = link(name1, name2)` | Create a new entry, name2, pointing to name1 |
| `s = unlink(name)` | Remove a directory entry |
| `s = mount(special, name, flag)` | Mount a file system |
| `s = umount(special)` | Unmount a file system |

Every call in this table returns s. Two descriptions are narrower than the call's name suggests: rmdir removes only an **empty** directory, and unlink removes a **directory entry**, not necessarily the file's data. A file with a second name made by link survives the unlink of its first name ([links and mount](#/comp4736-p5/links-and-mount)).

## Miscellaneous (slide 41)

| Call | Description |
|---|---|
| `s = chdir(dirname)` | Change the working directory |
| `s = chmod(name, mode)` | Change a file's protection bits |
| `s = kill(pid, signal)` | Send a signal to a process |
| `seconds = time(&seconds)` | Get the elapsed time since Jan. 1, 1970 |

kill's description is *Send a signal to a process*: terminating the process is only one of the things a signal can do. time is the one call here that does not return s, and it delivers its answer twice, as the return value and through the `&seconds` address.

```quiz
[
  {
    "q": "Match each POSIX call to the return code on the left of its `=` in the slide tables.",
    "type": "match",
    "pairs": [
      ["fork", "pid"],
      ["open", "fd"],
      ["read", "n"],
      ["lseek", "position"],
      ["time", "seconds"],
      ["mkdir", "s"]
    ],
    "explain": "pid = fork( ), fd = open(file, how, ...), n = read(fd, buffer, nbytes), position = lseek(fd, offset, whence), seconds = time(&seconds), s = mkdir(name, mode). The caption: pid is a process id, fd a file descriptor, n a byte count, position an offset within the file, seconds the elapsed time, and s is −1 on error."
  },
  {
    "q": "Match each call to its description in the slide tables.",
    "type": "match",
    "pairs": [
      ["execve", "Replace a process' core image"],
      ["rmdir", "Remove an empty directory"],
      ["unlink", "Remove a directory entry"],
      ["link", "Create a new entry, name2, pointing to name1"],
      ["chmod", "Change a file's protection bits"],
      ["stat", "Get a file's status information"]
    ],
    "explain": "execve is process management (slide 22); stat is file management (slide 39); rmdir, unlink and link are directory and file system management (slide 40); chmod is miscellaneous (slide 41)."
  },
  {
    "q": "Fill in the parameters of waitpid as the slide 22 table writes it.",
    "type": "fill",
    "code": "pid = waitpid(___, &statloc, ___)",
    "answer": ["pid", "options"],
    "explain": "pid = waitpid(pid, &statloc, options): wait for a child to terminate. The slide 32 program calls it as waitpid(-1, &status, 0)."
  },
  {
    "q": "Fill in the parameters of lseek as the slide 39 table writes it.",
    "type": "fill",
    "code": "position = lseek(fd, ___, ___)",
    "answer": ["offset", "whence"],
    "explain": "position = lseek(fd, offset, whence): move the file pointer. It returns position, an offset within the file."
  },
  {
    "q": "Which call replaces a process' core image?",
    "options": ["execve", "fork", "exit", "waitpid"],
    "answer": 0,
    "explain": "s = execve(name, argv, environp): Replace a process' core image. fork creates a child process identical to the parent, exit terminates process execution and returns status, and waitpid waits for a child to terminate."
  },
  {
    "q": "The return code s is 0 if an error has occurred.",
    "type": "tf",
    "answer": false,
    "explain": "The caption says the return code s is −1 if an error has occurred."
  },
  {
    "q": "In `n = read(fd, buffer, nbytes)`, what does n count?",
    "options": ["bytes", "file descriptors", "processes", "seconds"],
    "answer": 0,
    "explain": "n is a byte count: the number of bytes read, which can be smaller than nbytes. The slide 6 demo asked for 100 and read returned 13."
  },
  {
    "q": "Which call belongs to the directory and file system management table?",
    "options": ["mount", "chdir", "lseek", "waitpid"],
    "answer": 0,
    "explain": "Slide 40 lists mkdir, rmdir, link, unlink, mount and umount. chdir is miscellaneous (slide 41), lseek is file management (slide 39), and waitpid is process management (slide 22)."
  },
  {
    "q": "Complete slide 41's description: `s = kill(pid, signal)` sends a ______ to a process.",
    "type": "text",
    "answer": ["signal"],
    "explain": "kill: Send a signal to a process. Ending the process is one possible effect of a signal, not the call's definition."
  },
  {
    "q": "`seconds = time(&seconds)` gets the elapsed time since Jan. 1 of which year?",
    "type": "numeric",
    "answer": 1970,
    "tolerance": 0,
    "explain": "time: Get the elapsed time since Jan. 1, 1970. Its return code is seconds, the elapsed time."
  }
]
```

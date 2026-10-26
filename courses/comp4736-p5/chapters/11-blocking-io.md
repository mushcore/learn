---
title: Blocking, non-blocking and asynchronous I/O
minutes: 13
---

A `read` on a slow device can leave the process waiting for a long time. The last slides of Part 5 compare three ways to handle that wait: block, return at once and check later, or let the operation finish in the background.

## Blocking: the process waits until the call completes

Slide 52 frames the topic: *System calls are the mechanism by which programs interact with the kernel of an operating system. In the context of file I/O operations, system calls like open, read, and write play a critical role. These operations can be executed in either blocking or non-blocking modes.*

Slide 53: *A blocking system call suspends the execution of the process until the operation is completed.* Reading a file, the program waits until the read is finished. And the sentence to remember: ***Most I/O system calls, by default, are blocking calls.***

```cpp pin blocking_open.c
int fd = open("file.txt", O_RDONLY);  // Blocking call
```

In the slide's example, `open("file.txt", O_RDONLY)` *blocks the process until the file is opened, which means that the program execution is paused until the operation completes.* Nothing after the line runs until `fd` holds a file descriptor (or −1).

In Part 3's terms the process goes from running to blocked while it waits, and back to ready when the I/O completes.

## Non-blocking: return immediately, check later

Slide 54: *A non-blocking system call returns immediately, even if the requested operation hasn't been completed. Instead of waiting, the program continues executing other code while periodically checking if the operation has finished.* The slide's use case is a wait that would waste resources, *such as reading from a network socket or file*.

```cpp pin nonblocking_fcntl.c
#include <fcntl.h>

int fd = open("file.txt", O_RDONLY);
fcntl(fd, F_SETFL, O_NONBLOCK);  // Set the file descriptor to non-blocking mode
```

*To enable non-blocking mode, you often use the fcntl system call to modify the file descriptor.* The file is opened as usual, then `fcntl(fd, F_SETFL, O_NONBLOCK)` sets the file-status flags (`F_SETFL`) of that descriptor to include `O_NONBLOCK`. From then on a read on `fd` that has no data ready returns at once instead of suspending the process.

## POSIX AIO: start the I/O and do other work

Slide 55: *POSIX Asynchronous I/O (AIO) provides another method of non-blocking I/O where you can initiate I/O operations and have them complete asynchronously, i.e., in the background. This allows a program to perform other tasks while waiting for the operation to complete.* The five functions: **aio_read, aio_write, aio_error, aio_return** and **aio_fsync**.

```cpp pin aio_read.c
#include <aio.h>

struct aiocb cb;
int fd = open("file.txt", O_RDONLY);

cb.aio_fildes = fd;
cb.aio_buf = buffer;
cb.aio_nbytes = sizeof(buffer);
cb.aio_offset = 0;

aio_read(&cb);  // Asynchronous read call

// You can perform other tasks here while the read operation is ongoing
```

`struct aiocb cb;` is the control block that describes the request. Its four fields are the familiar arguments of `read(fd, buffer, nbytes)` plus a file position: `cb.aio_fildes = fd;` the descriptor, `cb.aio_buf = buffer;` where the data goes, `cb.aio_nbytes = sizeof(buffer);` how many bytes, `cb.aio_offset = 0;` where in the file to start. `aio_read(&cb);` starts the read and returns; the program carries on. Not on the slide (from the man pages): `aio_error` later tells whether the request has finished, and `aio_return` gives its result, the byte count a blocking `read` would have returned. The fragment never declares `buffer`.

The slide labels the `open` line in green: **Blocking open**. Only the read is asynchronous.

## O_NONBLOCK passed to open

Slide 57 passes the flag at open time instead of through `fcntl`, labelled **Non-blocking open**:

```cpp pin nonblocking_open.c
int fd = open("example.txt", O_RDONLY | O_NONBLOCK);
```

`O_RDONLY | O_NONBLOCK` combines the two flags with bitwise OR. A red arrow leads from `open` to a man-page note whose first sentence is left readable: *Note that this flag has no effect for regular files and block devices;* the rest is scribbled out. So on an ordinary file like `example.txt`, `O_NONBLOCK` changes nothing (the man page, not the slide, names where it does matter: pipes, sockets and terminals). That is why the AIO slide uses `aio_read` for the background read of a regular file.

## Blocking against non-blocking

Slide 58, *Comparison of Blocking and Non-Blocking Approaches*:

| Blocking I/O | Non-blocking I/O |
|---|---|
| Simpler code flow. | Prevents program from being stalled while waiting for I/O. |
| Easier to implement in cases where performance or responsiveness isn't critical. | Requires more complex logic (e.g., checking if the operation is complete or using event loops). |
| Program execution pauses until the I/O operation is complete. | Useful for applications that need to stay responsive (like GUIs or network servers). |

```quiz
[
  {
    "q": "A non-blocking read waits until the data has arrived before returning.",
    "type": "tf",
    "answer": false,
    "explain": "A non-blocking system call returns immediately, even if the requested operation hasn't been completed; the program checks later whether it has finished. Waiting until completion is blocking."
  },
  {
    "q": "Most I/O system calls, by default, are blocking calls.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 53's wording. Non-blocking mode has to be asked for, with `fcntl` or a flag to `open`."
  },
  {
    "q": "Which system call do the slides use to switch an open file descriptor to non-blocking mode?",
    "options": ["fcntl", "lseek", "stat", "aio_read"],
    "answer": 0,
    "explain": "`fcntl(fd, F_SETFL, O_NONBLOCK)`: to enable non-blocking mode, you often use the fcntl system call to modify the file descriptor. lseek moves the file pointer, stat gets status information, aio_read starts an asynchronous read."
  },
  {
    "q": "Name the flag that makes a file descriptor non-blocking.",
    "type": "text",
    "answer": ["O_NONBLOCK"],
    "explain": "`O_NONBLOCK`, set with `fcntl(fd, F_SETFL, O_NONBLOCK)` or passed to `open` as `O_RDONLY | O_NONBLOCK`."
  },
  {
    "q": "Which of these are POSIX AIO functions named on slide 55? Select all.",
    "options": ["aio_read", "aio_error", "aio_fsync", "fcntl", "waitpid"],
    "answer": [0, 1, 2],
    "explain": "The five: aio_read, aio_write, aio_error, aio_return and aio_fsync. fcntl sets non-blocking mode; waitpid waits for a child process."
  },
  {
    "q": "In the AIO example, which `struct aiocb` field holds the file descriptor?",
    "options": ["aio_fildes", "aio_buf", "aio_nbytes", "aio_offset"],
    "answer": 0,
    "explain": "`cb.aio_fildes = fd;`. aio_buf is where the data goes, aio_nbytes how many bytes, aio_offset the starting position in the file."
  },
  {
    "q": "In the AIO example, the `open` call is labelled a blocking open.",
    "type": "tf",
    "answer": true,
    "explain": "The green annotation on slide 56 says Blocking open: the plain `open(\"file.txt\", O_RDONLY)` blocks; only `aio_read(&cb)` runs in the background."
  },
  {
    "q": "According to the man-page note on slide 57, `O_NONBLOCK` has no effect for which files?",
    "options": [
      "regular files and block devices",
      "sockets and pipes",
      "terminals and network connections",
      "files opened with O_RDONLY"
    ],
    "answer": 0,
    "explain": "Note that this flag has no effect for regular files and block devices. That is why the AIO example reads its regular file with aio_read instead."
  },
  {
    "q": "Which approach does slide 58 call useful for applications that need to stay responsive, like GUIs or network servers?",
    "options": ["Non-blocking I/O", "Blocking I/O", "Busy waiting", "Mounting a file system"],
    "answer": 0,
    "explain": "Non-blocking I/O prevents the program from being stalled while waiting for I/O, at the price of more complex logic (checking for completion, event loops)."
  },
  {
    "q": "Blocking I/O requires more complex logic, such as checking if the operation is complete or using event loops.",
    "type": "tf",
    "answer": false,
    "explain": "That is the cost of non-blocking I/O. Blocking I/O has the simpler code flow: execution pauses until the I/O operation is complete."
  }
]
```

---
title: "stdin, stdout, stderr: file descriptors 0, 1, 2"
minutes: 15
---

A system call does not name a file by its path every time; it names an open file by a small integer, the file descriptor. Every Linux process starts with three of them already open, and slides 5–9 show the `read` and `write` calls using them.

## Three standard streams, three file descriptors (slide 5)

| Stream | Symbol | fd | Connected to | Slide's examples |
|---|---|---|---|---|
| standard input (stdin) | `<` | **0** | keyboard or file | `cat` / `cat < myfile.txt` |
| standard output (stdout) | `1>` | **1** | terminal or file | `cat 1> myfile.txt` or `cat > myfile.txt` |
| standard error (stderr) | `2>` | **2** | terminal or file | `cat myfile` / `cat myfile 2> log_error` |

The fd is the number a program passes as the first argument of `read` and `write`. The shell's redirection symbols change what the number is connected to before the program starts; the program still reads fd 0 and writes fd 1. A bare `>` means `1>`, which is why the slide gives `cat > myfile.txt` as the same command as `cat 1> myfile.txt`. In `cat myfile 2> log_error`, any error message `cat` prints goes into the file `log_error` while normal output stays on the terminal.

## read(0, buffer, 100) takes its bytes from stdin (slides 6–7)

```cpp pin read_demo.c
#include <stdio.h>
#include <fcntl.h>
#include <stdlib.h>
#include <unistd.h>

int main(){
  int fd=0, size;
  char *buffer = (char *) calloc(100, sizeof(char));
  size = read(fd, buffer, 100);
  printf("called read(% d, buffer, 100). returned that %d bytes were read.\n", fd, size);
  buffer[size] = '\0';
  printf("Those bytes are as follows: %s \n", buffer);
}
```

`int fd=0, size;` picks stdin. `size = read(fd, buffer, 100);` asks for at most 100 bytes and returns how many it actually got. `read` does not add a string terminator, so `buffer[size] = '\0';` puts one after the last byte before the second `printf` prints the buffer as a string.

The program runs twice: first with the user typing `Hello World` and pressing Enter, then as `./a.out < myFile`, where `myFile` holds the sentence `Hello from my file.` Write the lines each run prints, with the byte counts, before you read on.

```text
~$
~$ ./a.out
Hello World
called read( 0, buffer, 100). returned that 13 bytes were read.
Those bytes are as follows: Hello World

~$
~$ ./a.out < myFile
called read( 0, buffer, 100). returned that 21 bytes were read.
Those bytes are as follows: Hello from my file.

```

- `read( 0,` has a space before the 0 because the format is `% d`: the space flag prints a blank in front of a positive number.
- The count includes every byte read, the newline from Enter as well. `Hello World` is 11 characters, plus the newline makes 12, which is what slide 9 reports for the same input; slide 7's 13 is one byte more than the typed text accounts for, and the slide does not say what it was.
- The blank line after `Hello World` is the buffer's own newline followed by the format's `" \n"`.
- In the second run nobody types. The shell connected fd 0 to `myFile`, so `read` returned the file's 21 bytes: the 19 visible characters of `Hello from my file.` plus 2 bytes the terminal does not show, such as the line ending. `read` stops at the end of the file, well short of 100.

### write(1, buffer, size) sends the same bytes to stdout (slides 8–9)

Slide 8 is the same program with one line added before the closing brace: `write(1, buffer, size);`. It writes the `size` bytes just read to fd 1. Write what each run now prints after the two `printf` lines, before you read on.

```text
~$
~$
~$ ./a.out
Hello World
called read( 0, buffer, 100). returned that 12 bytes were read.
Those bytes are as follows: Hello World

Hello World
~$
~$
~$ ./a.out < myFile
called read( 0, buffer, 100). returned that 21 bytes were read.
Those bytes are as follows: Hello from my file.

Hello from my file.
~$
```

The red arrows on slide 9 point at the last line of each run: the bytes copied from stdin to stdout unchanged. `write` does no formatting, so it prints exactly `size` bytes, and because those bytes end with a newline, the prompt `~$` starts on the next line.

## Count the bytes for new inputs and redirections

Each run uses `read(0, buffer, 100)` from slide 6.

```quiz
[
  {
    "q": "The user runs `./a.out` and types `OS lab`, then presses Enter. How many bytes does `read` return?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "`O`, `S`, space, `l`, `a`, `b` = 6 characters, plus 1 newline from Enter = 7 bytes."
  },
  {
    "q": "`notes.txt` holds 40 bytes. The user runs `./a.out < notes.txt`. How many bytes does `read` return?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0,
    "explain": "fd 0 is now the file. `read` asks for up to 100 bytes and the file ends after 40, so it returns 40, as slide 7's run returned the 21 bytes of `myFile`."
  },
  {
    "q": "`big.txt` holds 150 bytes. The user runs `./a.out < big.txt`. How many bytes does this one `read` return?",
    "type": "numeric",
    "answer": 100,
    "tolerance": 0,
    "explain": "The third argument, 100, is the most `read` will return in one call. 150 bytes are available, so it returns 100; another `read` would get the remaining 50."
  },
  {
    "q": "Slide 8's program is run as `./a.out 1> out.txt` and the user types `Hi` then Enter. Where does the line written by `write(1, buffer, size)` appear?",
    "options": [
      "In out.txt",
      "On the terminal",
      "In log_error",
      "Nowhere: write ignores redirection"
    ],
    "answer": 0,
    "explain": "`1>` connects fd 1 (stdout) to `out.txt` before the program starts, and `write(1, …)` writes to fd 1. The two `printf` lines also go to stdout, so they land in `out.txt` too."
  }
]
```

```quiz
[
  {
    "q": "Fill in the file descriptor numbers.",
    "type": "fill",
    "code": "stdin  = fd ___\nstdout = fd ___\nstderr = fd ___",
    "answer": ["0", "1", "2"],
    "explain": "Slide 5: standard input is 0, standard output is 1, standard error is 2."
  },
  {
    "q": "The user types `Hi` and presses Enter. How many bytes does `read(0, buffer, 100)` return?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "`H` and `i` are 2 bytes, and Enter adds a newline: 2 + 1 = 3."
  },
  {
    "q": "Which redirection symbol sends standard error to a file?",
    "options": ["`2>`", "`1>`", "`<`", "`>`"],
    "answer": 0,
    "explain": "Slide 5: stderr's symbol is `2>`, as in `cat myfile 2> log_error`. `1>` and `>` redirect stdout; `<` redirects stdin."
  },
  {
    "q": "In `./a.out < myFile`, the program reads `myFile` through file descriptor 1.",
    "type": "tf",
    "answer": false,
    "explain": "`<` redirects standard input, fd **0**. The program's `read(0, …)` is unchanged; the shell connected fd 0 to the file instead of the keyboard. fd 1 is stdout."
  },
  {
    "q": "`cat > myfile.txt` and `cat 1> myfile.txt` both redirect standard output.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 5 lists both as stdout examples: a bare `>` means `1>`."
  },
  {
    "q": "What does `read(fd, buffer, 100)` return when it succeeds?",
    "options": [
      "The number of bytes read",
      "The file descriptor it read from",
      "A pointer to the buffer",
      "Always 100"
    ],
    "answer": 0,
    "explain": "It returns the count of bytes read, 13 or 12 or 21 in the slides' runs. The 100 is only the most it may read."
  },
  {
    "q": "Which file descriptor does `write(1, buffer, size)` write to?",
    "options": ["Standard output", "Standard input", "Standard error", "The file the user typed"],
    "answer": 0,
    "explain": "fd 1 is stdout (slide 5), so slide 9's extra line appears on the terminal, or in a file if stdout is redirected."
  },
  {
    "q": "Match each stream with where slide 5 says it can be connected.",
    "type": "match",
    "pairs": [
      ["stdin (fd 0)", "keyboard or file"],
      ["stdout (fd 1)", "terminal or file, symbol 1>"],
      ["stderr (fd 2)", "terminal or file, symbol 2>"]
    ],
    "explain": "stdin comes from the keyboard or a file (`<`); stdout and stderr both go to the terminal or a file, told apart by `1>` and `2>`."
  }
]
```

---
title: x86 registers, int 80h and the syscall table
minutes: 18
---

The procedure library hides the machine-dependent part of a system call. Slides 10–18 open it up: on x86 Linux a call is a number in one register, its arguments in others, and one instruction that enters the kernel.

## x86 registers come in four widths (slide 10)

| Width | Registers |
|---|---|
| 8 bit | A, B, C, D, … |
| 16 bit | AX, BX, CX, DX, … |
| 32 bit | EAX, EBX, ECX, EDX, … |
| 64 bit | RAX, RBX, RCX, RDX, … |

The slide's figure is a DOS DEBUG register dump that starts `AX=0000  BX=0000`, with the callout *AX = 0000h(16 bits)*: four hex digits are 16 bits.

## The x86 convention: number in EAX, arguments in EBX, ECX (slide 11)

1. *System call number: EAX register.*
2. *Arguments to the system call : registers EBX, ECX, etc.*
3. *Invoke the relevant interrupt (e.g. 80h is used for kernel call).*
4. *The result, usually returned in the EAX register.*

EAX does two jobs: it carries the call number in and the result out. Step 3 is the software interrupt of [the interrupt classes](#/comp4736-p5/interrupt-classes); `80h` and `0x80` are the same number, 128, in two notations. The slide's table gives the first six calls:

| eax | Name | ebx | ecx | edx |
|---|---|---|---|---|
| 1 | sys_exit | int | - | - |
| 2 | sys_fork | struct pt_regs | - | - |
| 3 | sys_read | unsigned int | char * | size_t |
| 4 | sys_write | unsigned int | const char * | size_t |
| 5 | sys_open | const char * | int | int |
| 6 | sys_close | unsigned int | - | - |

The slide's table has two more columns, headed "esx" and "edi", both empty for these six calls; "esx" is the slide's spelling of the register the man page (slide 15) calls esi. For `sys_read` the three argument types are the fd, the buffer address and the byte count of `read(fd, buffer, nbytes)`.

## Hello world in NASM (slides 12–13)

```nasm
section .text
    global _start    ;must be declared for using gcc
_start:              ;tell linker entry point
    mov edx, len     ;message length
    mov ecx, msg     ;message to write
    mov ebx, 1       ;file descriptor (stdout)
    mov eax, 4       ;system call number (sys_write)
    int 0x80         ;call kernel
    mov eax, 1       ;system call number (sys_exit)
    int 0x80         ;call kernel

section .data

msg db  'Hello, world!', 0xa    ;our dear string
len equ $ - msg         ;length of our dear string
```

Before reading on, name the call each `int 0x80` makes and work out the value of `len`.

The first block fills the registers exactly as the table says: `mov eax, 4` selects sys_write, `mov ebx, 1` is the fd (stdout, from [the standard streams](#/comp4736-p5/standard-streams)), `mov ecx, msg` the buffer and `mov edx, len` the count. `len equ $ - msg` subtracts the string's start address from the current address: 13 characters of `Hello, world!` plus the newline byte `0xa` = 14. Then `mov eax, 1` and a second `int 0x80` make sys_exit. Slide 13 assembles, links and runs it:

```text
~$ nasm -felf  hello.asm
~$ ld -m elf_i386  -o hello hello.o
~$ ./hello
Hello, world!
~$
```

## man syscall: the instruction and registers per architecture (slides 14–15)

`man syscall` has a table of *the instruction used to transition to kernel mode (which might not be the fastest or best way to transition to the kernel, so you might have to refer to vdso(7))*, the number register, the result registers, and a second table of argument registers. Three of its rows:

| Arch | Instruction | Call # | Ret val | arg1 | arg2 | arg3 | arg4 | arg5 | arg6 |
|---|---|---|---|---|---|---|---|---|---|
| i386 | `int $0x80` | eax | eax | ebx | ecx | edx | esi | edi | ebp |
| x86-64 | `syscall` | rax | rax | rdi | rsi | rdx | r10 | r8 | r9 |
| mips | `syscall` | v0 | v0 | a0 | a1 | a2 | a3 | | |

The i386 row is slide 11's convention; `int $0x80` is the same instruction written in the other assembler syntax. On 64-bit x86 the kernel is entered with the `syscall` instruction, not `int 0x80`, and the arguments start at rdi, not ebx.

## The call numbers differ between 32-bit and 64-bit (slide 16)

`ausyscall --dump` prints *Using x86_64 syscall table:* followed by the numbers, from `0 read` up to `449 futex_waitv`.

| Call | 32-bit x86, `int 0x80` (slide 11) | x86_64 (slide 16) |
|---|---|---|
| read | 3 | 0 |
| write | 4 | 1 |
| open | 5 | 2 |
| close | 6 | 3 |

The slide does not comment on the shift, but it is slide 2's point made concrete: the number is machine dependent.

## MIPS: the service number goes in $v0 (slide 17)

```mips
.data
        my_string: .asciiz "\nHello, World!\n"

.text
        main:
                li $v0, 15
                la $a0, 1
                la $a1, my_string
                la $a2, 15
                syscall

                li $v0, 10
                syscall
```

The legend reads *write to file (15)*, *$a0 = file descriptor; $a1 = address of output buffer; $a2 = number of characters to write*. The program prints `Hello, World!`. The two 15s mean different things: `li $v0, 15` is the service number, and `la $a2, 15` is the length of `"\nHello, World!\n"`, 1 + 13 + 1 = 15. The slide does not say what service 10 is; in the MARS and SPIM simulators it is exit (not on the slide).

## syscall() calls by number from C (slide 18)

*syscall() is a small library function that invokes the system call whose assembly language interface has the specified number with the specified arguments. Employing syscall() is useful, for example, when invoking a system call that has no wrapper function in the C library.*

```cpp pin syscall_demo.c
#include <unistd.h>
#include <sys/syscall.h>
#include <stdio.h>

#define STDIN_FILENO 0
#define BUFFER_SIZE 100

int main() {
    char buffer[BUFFER_SIZE];
    ssize_t bytesRead;

    printf("Enter your message: ");
    fflush(stdout);
    bytesRead = syscall(SYS_read, STDIN_FILENO, buffer, BUFFER_SIZE - 1);
    if (bytesRead == -1) {
        perror("Read error");
        return 1;
    }
    buffer[bytesRead] = '\0';
    printf("You message is : %s\n", buffer);
    return 0;
}
```

`syscall(SYS_read, STDIN_FILENO, buffer, BUFFER_SIZE - 1)` is `read(0, buffer, 99)` without the wrapper: `SYS_read` is the call number, the rest are the arguments. Asking for `BUFFER_SIZE - 1` leaves room for the `'\0'`. The user types `Hello world!` and presses Enter; write what the terminal shows before you read on.

```text
Enter your message: Hello world!
You message is : Hello world!
```

`fflush(stdout);` pushes the prompt out before `syscall` waits for the keyboard, so the typing appears on the prompt's line. `if (bytesRead == -1)` is the error check every system call needs: −1 means failure. "You message" is the program's own spelling.

## Load the registers for new calls

Each item uses slide 11's 32-bit table unless it names x86_64 or MIPS.

```quiz
[
  {
    "q": "Fill in the registers to read up to 64 bytes from stdin into `buf`.",
    "type": "fill",
    "code": "mov eax, ___     ;sys_read\nmov ebx, ___     ;file descriptor (stdin)\nmov ecx, buf\nmov edx, ___     ;byte count\nint 0x80",
    "answer": ["3", "0", "64"],
    "explain": "sys_read is 3 in slide 11's table; stdin is fd 0; the count goes in EDX, the third argument register: 64. The byte count read comes back in EAX."
  },
  {
    "q": "To close file descriptor 5, which registers are loaded?",
    "options": ["eax = 6, ebx = 5", "eax = 5, ebx = 6", "eax = 3, ebx = 5", "eax = 6, ecx = 5"],
    "answer": 0,
    "explain": "sys_close is call 6, so EAX = 6; its only argument, the fd, is the first argument and goes in EBX = 5. 5 in EAX would be sys_open."
  },
  {
    "q": "A NASM program defines `msg db 'Bye!', 0xa` and `len equ $ - msg`. What is `len`?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "explain": "`Bye!` is 4 characters (B, y, e, !) plus the newline byte 0xa = 5."
  },
  {
    "q": "The same read of 64 bytes from stdin runs on x86_64. Which number goes in rax?",
    "options": ["0", "3", "1", "64"],
    "answer": 0,
    "explain": "On x86_64 read is 0 (slide 16); 3 is its 32-bit number. The arguments go in rdi (fd 0), rsi (buf), rdx (64), and the instruction is `syscall`."
  },
  {
    "q": "In slide 17's MIPS program, the string is changed to `\"Hi\\n\"`. Which line must change so exactly those characters are written?",
    "options": ["`la $a2, 3`", "`li $v0, 3`", "`la $a0, 3`", "`li $v0, 10`"],
    "answer": 0,
    "explain": "$a2 holds the number of characters to write: `H`, `i` and the newline = 3. $v0 stays 15 (write to file) and $a0 stays 1, the file descriptor."
  }
]
```

```quiz
[
  {
    "q": "On 32-bit x86 Linux, which register holds the system call number?",
    "options": ["EAX", "EBX", "ECX", "EDX"],
    "answer": 0,
    "explain": "Slide 11: *System call number: EAX register.* EBX, ECX and EDX carry the arguments."
  },
  {
    "q": "Name the instruction that enters the kernel for a system call on 32-bit x86 Linux.",
    "type": "text",
    "answer": ["int 80h", "int 0x80", "int $0x80", "int 128"],
    "explain": "*80h is used for kernel call* (slide 11); the NASM program writes it `int 0x80`, and `man syscall` writes `int $0x80`."
  },
  {
    "q": "On 32-bit x86 Linux, the result of a system call usually comes back in EBX.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 11: *The result, usually returned in the EAX register.* EBX holds the first argument."
  },
  {
    "q": "Match each register with its width.",
    "type": "match",
    "pairs": [
      ["A", "8 bit"],
      ["AX", "16 bit"],
      ["EAX", "32 bit"],
      ["RAX", "64 bit"]
    ],
    "explain": "Slide 10: A, B, C, D are 8 bit; AX… 16 bit (*AX = 0000h(16 bits)*); EAX… 32 bit; RAX… 64 bit."
  },
  {
    "q": "Which instruction enters the kernel on x86-64?",
    "options": ["`syscall`", "`int $0x80`", "`svc #0`", "`li $v0, 15`"],
    "answer": 0,
    "explain": "`man syscall` (slide 14): x86-64 uses `syscall` with the number in rax. `int $0x80` is i386, `svc #0` is arm64, and `li $v0, 15` loads a MIPS service number."
  },
  {
    "q": "In slide 12's hello world, what does `mov ebx, 1` load?",
    "options": [
      "The file descriptor for stdout",
      "The system call number for sys_exit",
      "The message length",
      "The address of the message"
    ],
    "answer": 0,
    "explain": "EBX is the first argument of sys_write, the fd; 1 is stdout. The call number 4 goes in EAX, the address in ECX and the length in EDX."
  },
  {
    "q": "In the x86_64 syscall table, read is system call 3.",
    "type": "tf",
    "answer": false,
    "explain": "`ausyscall --dump` (slide 16): read is **0** on x86_64. 3 is read on 32-bit x86 (slide 11) and close on x86_64."
  },
  {
    "q": "When is `syscall()` useful, according to its man page?",
    "options": [
      "When invoking a system call that has no wrapper function in the C library",
      "When a program needs to avoid entering kernel mode",
      "When the system call number is not known",
      "Only on MIPS"
    ],
    "answer": 0,
    "explain": "Slide 18: *Employing syscall() is useful, for example, when invoking a system call that has no wrapper function in the C library.* It still enters the kernel, and it needs the call's number."
  },
  {
    "q": "In slide 17's MIPS program, which register holds the service number?",
    "type": "text",
    "answer": ["$v0", "v0"],
    "explain": "`li $v0, 15` selects *write to file (15)*; $a0, $a1, $a2 hold the fd, buffer address and count, as in `man syscall`'s mips row (number in v0, arguments from a0)."
  }
]
```

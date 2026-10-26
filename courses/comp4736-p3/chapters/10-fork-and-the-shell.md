---
title: fork(), parent_pid 4508 and child 4509, and the stripped-down shell
minutes: 15
---

Every command you type into a Linux shell runs in a new process, and Linux makes a new process by copying the one that asks. This lesson is the rule that tells the copy from the original, and the five-line loop a shell is built from.

## getpid() returns the calling process's ID

Lab 1 ran this program. Its listing misspells the string as "Preocess"; the line below is corrected to match what the lab's screenshot printed.

```cpp pin main.c
#include <stdio.h>
#include <unistd.h>

int main()
{
    printf(" Process ID : %d \n", getpid());
    sleep(1);
    return 0;
}
```

Write the line this prints. Which part of it can you not know before the program runs?

```text
 Process ID : 3178


...Program finished with exit code 0
Press ENTER to exit console.
```

`printf(" Process ID : %d \n", getpid());` prints whatever number the operating system gave this process; the last two lines are the online compiler's own message. The same program run in the Linux terminal printed `Process ID : 94`: every run is a new process with a new PID. `sleep(1);` keeps the process alive for a second, long enough to catch it with `ps`.

## fork() gives the parent the child's PID and the child 0

Slide 48 draws one process calling `fork()` and becoming two:

| Box on the slide | Its PID (callout) | fork_return_value |
|---|---|---|
| Main process (Parent), before the call | parent_pid = 4508 | |
| Parent process, after | parent_pid = 4508 | child_pid (4509) |
| Child process | child_pid = 4509 | 0 |

The child is a copy of the parent: same code, same variables, same position in the program. Part 5's slide 25 puts it as *execution in both the parent and child process continues at the instruction following the fork*. The child does not start again at `main`. The only thing that differs is the value `fork()` hands back, so the program tests it to decide which process it is. Part 5 adds the third value, −1 when the fork fails, and traces every slide program with its output: [fork returns three ways](#/comp4736-p5/fork-programs).

## Lab 4's program prints both return values

```cpp pin main1.c
#include <stdio.h>
#include <unistd.h>

int main(){

    pid_t fork_return = fork();
    pid_t  pid = getpid();
    printf("fork return value = %d , pid = %d \n", fork_return, pid);
    sleep(1);

    return 0;
}
```

Lab 4 started it in the background; the shell reported the job as `[1] 88`, and the child received PID 91. Write the two `fork return value` lines it prints, numbers included, before you read on.

```text
~$ ./main1.out & ps -e -o comm,stat,ppid,pid | grep main1.out
[1] 88
fork return value = 91 , pid = 88
fork return value = 0 , pid = 91
main1.out       S         83      88
main1.out       S         88      91
```

- `pid_t fork_return = fork();` runs once but returns twice: 91 in the parent, 0 in the child.
- `pid_t  pid = getpid();` runs in both processes after the fork, so each prints its own PID, 88 and 91.
- The `ps` lines confirm the family: 91's parent (PPID) is 88, and 88's parent is 83, the shell. Both are in state S because `sleep(1);` has them waiting.

The parent's line came first here, but nothing in the program forces that order.

### fork returns twice

Step the program and watch the tree: one box splits into two at `fork()`, the parent's box shows the child's PID as the return value, and the child's shows 0. In predict mode, name the return value in each box before it appears.

```widget
fork-play
{ "preset": "lab 4 main1", "predict": true }
```

## The stripped-down shell forks, then the parent waits and the child runs the command

Slide 49:

```c
#define TRUE 1

while (TRUE) {                                  /* repeat forever */
    type_prompt( );                             /* display prompt on the screen */
    read_command(command, parameters);          /* read input from terminal */

    if (fork( ) != 0) {                         /* fork off child process */
        /* Parent code. */
        waitpid(-1, &status, 0);                /* wait for child to exit */
    } else {
        /* Child code. */
        execve(command, parameters, 0);         /* execute command */
    }
}
```

*A stripped-down shell. Throughout this book, TRUE is assumed to be defined as 1.*

The test `fork( ) != 0` uses the return-value rule. In the shell itself `fork()` returned the child's PID, which is not 0, so the shell runs the parent branch: `waitpid(-1, &status, 0)` blocks until a child exits. In the child `fork()` returned 0, so it takes the `else` branch and calls `execve(command, parameters, 0)`, which replaces the copied shell with the program the user named. When that program exits, the shell's `waitpid` returns and the loop prints the next prompt.

## Trace one fork in a process with PID 2600

A process with PID 2600 runs the program below, and the child it creates receives PID 2611.

```quiz
[
  {
    "q": "Fill in the two lines this program prints (one from each process).",
    "type": "fill",
    "code": "pid_t r = fork();\nif (r == 0)\n    printf(\"child: r = %d, me = %d\\n\", r, getpid());\nelse\n    printf(\"parent: r = %d, me = %d\\n\", r, getpid());\n\nparent: r = ___, me = ___\nchild: r = ___, me = ___",
    "answer": ["2611", "2600", "0", "2611"],
    "explain": "In the parent `fork()` returns the child's PID, 2611, and `getpid()` gives the parent's own 2600. In the child `fork()` returns 0 and `getpid()` gives 2611. Each process takes one branch, so each prints one line."
  },
  {
    "q": "How many lines does the program print in total?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "Two processes run the `if` after the fork. The parent (r = 2611) takes the `else` branch, the child (r = 0) the `if` branch: one line each, 2 lines."
  },
  {
    "q": "Which of the two lines appears first?",
    "options": ["Either; the program does not fix the order", "Always the parent's", "Always the child's", "The one from the lower PID"],
    "answer": 0,
    "explain": "Both processes are ready to run after the fork and the scheduler decides which goes first. Only a `wait` in the parent would force the child's line first."
  },
  {
    "q": "The user types `ls` into the stripped-down shell (PID 700); the fork creates PID 701. Which process calls `execve`?",
    "options": ["701, the child", "700, the shell", "Both", "Neither; waitpid runs ls"],
    "answer": 0,
    "explain": "In 701 `fork()` returned 0, so `fork( ) != 0` is false and the child takes the `else` branch: `execve(command, parameters, 0)`. In 700 it returned 701, so the shell takes the parent branch and waits."
  },
  {
    "q": "In that run, what does `fork()` return inside the shell process 700?",
    "type": "numeric",
    "answer": 701,
    "tolerance": 0,
    "explain": "The parent receives the child's PID: 701, as slide 48's parent receives child_pid 4509."
  }
]
```

```quiz
[
  {
    "q": "Slide 48: fork() returns ___ in the child and ___ in the parent.",
    "type": "fill",
    "code": "child:  fork_return_value = ___\nparent: fork_return_value = ___",
    "answer": ["0", "4509"],
    "explain": "The child gets 0; the parent (parent_pid 4508) gets the child's PID, child_pid 4509."
  },
  {
    "q": "After fork(), the child process starts executing at main().",
    "type": "tf",
    "answer": false,
    "explain": "Execution in both the parent and the child continues at the instruction following the fork. The child is a copy of the parent at that point, not a fresh start."
  },
  {
    "q": "In the stripped-down shell, which call makes the parent wait for the command to finish?",
    "options": ["waitpid(-1, &status, 0)", "execve(command, parameters, 0)", "read_command(command, parameters)", "type_prompt()"],
    "answer": 0,
    "explain": "The parent branch calls `waitpid(-1, &status, 0)`, commented *wait for child to exit*. `execve` is the child's call that runs the command; the other two read the command line."
  },
  {
    "q": "In the stripped-down shell, which call does the child make?",
    "options": ["execve", "waitpid", "fork", "type_prompt"],
    "answer": 0,
    "explain": "In the child `fork()` returned 0, so `fork( ) != 0` is false and it runs `execve(command, parameters, 0)`, *execute command*."
  },
  {
    "q": "In slide 48, the parent's fork_return_value equals the parent's own PID, 4508.",
    "type": "tf",
    "answer": false,
    "explain": "The parent's fork_return_value is child_pid (4509). The parent keeps its own PID 4508, which `getpid()` would return, but fork returns the child's."
  },
  {
    "q": "Why does the stripped-down shell test `fork( ) != 0`?",
    "options": ["Only the parent receives a non-zero value, so the test splits parent code from child code", "fork returns 0 when it fails", "A non-zero value means the command was not found", "It checks that TRUE is defined as 1"],
    "answer": 0,
    "explain": "fork returns the child's PID (non-zero) in the parent and 0 in the child. The `if` sends the parent to `waitpid` and the child to `execve`."
  },
  {
    "q": "Which function returns the PID of the process that calls it?",
    "type": "text",
    "answer": ["getpid", "getpid()"],
    "explain": "`getpid()` returns the calling process's ID; Lab 1's program printed 3178 with it, and a second run printed 94."
  },
  {
    "q": "A program is run twice in a row. Both runs print the same process ID.",
    "type": "tf",
    "answer": false,
    "explain": "Each run is a new process and gets a new PID from the operating system: the same Lab 1 program printed 3178 in one environment and 94 in another."
  }
]
```

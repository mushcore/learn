---
title: "fork returns three ways: every slide program and its output"
minutes: 18
---

One call to `fork` comes back in two processes, with a different value in each. Slides 23 to 32 run three programs whose output follows from two facts: what fork returned in this process, and where each process resumes.

## fork returns three ways (slide 23)

| Return value | Slide wording |
|---|---|
| pid = −1 | *fork fails* |
| pid = 0 | *return value in the child process* |
| pid > 0 | *return value in the parent process (returns the process ID of the child process to the parent process)* |

Slide 24 draws it as a fork in the road: the main process calls `pid=fork()`; the branch labelled pid>0 continues as the main process, the branch labelled pid=0 is the child process. Slide 25 gives the rule every program below depends on:

*Successful fork (fork()≥0): Execution in both the parent and child process continues at the instruction following the fork.*

The child is a copy of the parent, variables included, so after the fork each process has its own `pid` variable holding its own return value. Lab 4 printed both numbers in each process: the parent's fork returned 91 while its own process id was 88, and the child's fork returned 0 while its process id was 91. The parent's return value is the child's process id.

Part 3 covers why processes are created this way and what happens when one of them exits first: [fork and the shell](#/comp4736-p3/fork-and-the-shell), [zombies and orphans](#/comp4736-p3/zombies-and-orphans).

## Program 1: two printf calls after the fork (slides 26–28)

```cpp pin fork_lines.c
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
int main()
{
    printf("Line number : %d  \n", __LINE__);
    pid_t pid;
    pid = fork();
    printf("Line number : %d , pid = %d \n", __LINE__, pid);
    printf("Line number : %d , pid = %d \n", __LINE__, pid);

    return 0;
}
```

`__LINE__` is the source line number, so every printf labels itself with 6, 9 or 10. Assume the child gets process id 736 and the parent runs first. Write the lines this prints, in order, before you read on.

```text
~$ ./a.out
Line number : 6
Line number : 9  , pid = 736
Line number : 10 , pid = 736
Line number : 9  , pid = 0
Line number : 10 , pid = 0
~$
```

`printf("Line number : %d  \n", __LINE__);` runs once, because only one process exists before line 8. `pid = fork();` makes two processes, and both continue at line 9, so lines 9 and 10 each print twice: 1 + 2 + 2 = 5 lines. Slide 28 boxes the first three lines **Parent** (its pid variable holds 736, the child's id) and the last two **Child** (pid = 0). The program does not fix the order of the parent's and child's lines; on the slide's run the parent finished first.

### The fork splits one process into two

The widget steps the same program with the listing on the left and the process boxes on the right. With predict on, it asks how many processes exist after each line and which value fork returned in each box.

```widget
fork-play
{ "preset": "fork and print pids", "predict": true }
```

## Program 2: an if (pid==0) branch (slides 29–31)

```cpp pin fork_branch.c
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
int main()
{
    printf("Line number : %d  \n", __LINE__);
    pid_t pid;
    pid = fork();
    if (pid==0){
        printf("Line number : %d  , pid = %d \n", __LINE__, pid);
        return 0;
    }
    printf("Line number : %d , pid = %d \n", __LINE__, pid);

    return 0;
}
```

Slide 29 shows only `~$ ./a.out` and a large question mark. The child's process id is 984. How many lines print, which line numbers appear, and which pid value does each carry?

```text
~$ ./a.out
Line number : 6
Line number : 13 , pid = 984
Line number : 10  , pid = 0
~$
```

The test `if (pid==0){` is true only in the child, so the child prints line 10 with pid = 0 and then `return 0;` on line 11 ends it before it can reach line 13. The parent's pid is 984, so it skips the branch and prints line 13. Three lines in all: the branch gives each process its own body after the shared start. Slide 31 boxes the first two lines **Parent** and the line-10 line **Child**.

### Each process takes one side of the branch

```widget
fork-play
{ "preset": "parent and child branch", "predict": true }
```

## Program 3: the child sums 1 to 100 while the parent waits (slide 32)

```cpp pin fork_waitpid.c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main()
{
    int status;
    pid_t fork_return = fork();
    if (fork_return == 0){
        int sum = 0;
        for(int i=1; i<101; i++){
            sum += i;
            }
        printf("child done : sum = %d \n", sum);
    }
    else{
        printf("Line : %d \n", __LINE__);
        waitpid(-1, &status, 0);
    }
    printf("Line : %d , Fork return = %d \n", __LINE__, fork_return);
    return 0;
}
```

The child's process id is 1825. Write the four lines this prints, and decide which of them must come last whatever order the two processes run in.

```text
~$ ./a.out
Line : 17
child done : sum = 5050
Line : 20 , Fork return = 0
Line : 20 , Fork return = 1825
~$
```

The parent takes the `else{` side, prints line 17 and stops in `waitpid(-1, &status, 0);` until a child terminates. The child runs `sum += i;` for i = 1 to 100, giving 100 × 101 ÷ 2 = 5050, prints it, and has no `return` in its branch, so it also reaches line 20 with fork_return = 0. Only after the child ends does the parent leave waitpid and print line 20 with 1825. The waitpid is what guarantees the parent's line 20 comes last; nothing orders "Line : 17" against the child's sum line, and the slide's run printed the parent's first.

### waitpid parks the parent until the child ends

```widget
fork-play
{ "preset": "fork and waitpid", "predict": true }
```

## Count the processes and lines in new fork programs

Every process that reaches a `fork()` becomes two, so straight-line code with n forks ends with 2ⁿ processes. Count each printf by how many processes reach it.

```quiz
[
  {
    "q": "How many processes exist when this program reaches its printf, counting the original?",
    "code": "int main() {\n    fork();\n    fork();\n    printf(\"hi\\n\");\n    return 0;\n}",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "The first fork turns 1 process into 2. Both of them run the second fork, so 2 become 4. Two forks in a row: 2² = 4 processes, and \"hi\" prints 4 times."
  },
  {
    "q": "How many lines does this program print in total?",
    "code": "int main() {\n    printf(\"A\\n\");\n    fork();\n    printf(\"B\\n\");\n    fork();\n    printf(\"C\\n\");\n    return 0;\n}",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "A is printed by the 1 process that exists before any fork. After the first fork 2 processes print B. After the second fork 4 processes print C. 1 + 2 + 4 = 7 lines."
  },
  {
    "q": "A program calls `fork();` three times in a row and then returns. How many processes ran it, counting the original?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "explain": "Each fork doubles the processes that reach it: 1 → 2 → 4 → 8. Three forks: 2³ = 8."
  },
  {
    "q": "How many times does this program print x?",
    "code": "int main() {\n    pid_t pid = fork();\n    if (pid == 0)\n        fork();\n    printf(\"x\\n\");\n    return 0;\n}",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "The first fork gives a parent (pid > 0) and a child (pid = 0). Only the child passes the test, so only the child forks again, giving it a child of its own. Processes: parent, child, grandchild = 3, and each prints x once. The 2ⁿ rule needs every process to reach every fork; the if stops the parent."
  },
  {
    "q": "The child's process id is 5120. What does the parent print?",
    "code": "pid_t pid = fork();\nif (pid == 0)\n    printf(\"child sees %d\\n\", pid);\nelse\n    printf(\"parent sees %d\\n\", pid);",
    "options": ["parent sees 5120", "parent sees 0", "parent sees -1", "parent sees its own process id"],
    "answer": 0,
    "explain": "In the parent, fork returns the process ID of the child, so pid = 5120 and the else branch prints it. The child's fork returns 0, so the child prints \"child sees 0\". −1 would mean the fork failed and there is no child."
  },
  {
    "q": "In a program with two forks in a row, the second `fork()` is executed by two processes.",
    "type": "tf",
    "answer": true,
    "explain": "Execution in both the parent and child continues at the instruction following the first fork, and the next instruction is the second fork. Both processes run it, which is how 2 become 4."
  }
]
```

```quiz
[
  {
    "q": "After a successful fork, what value does fork return in the child process?",
    "options": ["0", "the child's process id", "the parent's process id", "−1"],
    "answer": 0,
    "explain": "pid = 0 is the return value in the child process. The parent gets the child's process id; −1 means the fork failed."
  },
  {
    "q": "After a successful fork, what value does fork return in the parent process?",
    "options": ["the child's process id", "0", "the parent's own process id", "−1"],
    "answer": 0,
    "explain": "pid > 0 is the return value in the parent process: fork returns the process ID of the child process to the parent. In slide 27 the parent saw 736, the child's id."
  },
  {
    "q": "The child's fork() returns the parent's process id.",
    "type": "tf",
    "answer": false,
    "explain": "The child's fork returns 0. It is the parent whose fork returns a process id, and that id is the child's."
  },
  {
    "q": "Fill in the return values from slide 23.",
    "type": "fill",
    "code": "pid = ___   /* fork fails */\npid = ___   /* return value in the child process */",
    "answer": ["-1", "0"],
    "explain": "pid = −1: fork fails. pid = 0: the return value in the child process. pid > 0: the return value in the parent, the child's process ID."
  },
  {
    "q": "After a successful fork, the child process starts executing from the beginning of main.",
    "type": "tf",
    "answer": false,
    "explain": "Execution in both the parent and child process continues at the instruction following the fork. That is why slide 27's line 6 prints only once."
  },
  {
    "q": "How many lines does the slide 26 program (one printf before the fork, two after it) print?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "explain": "Line 6 runs in 1 process before the fork. Lines 9 and 10 run in 2 processes after it: 1 + 2 × 2 = 5."
  },
  {
    "q": "In the slide 29 program, why does the child never print line 13?",
    "options": [
      "The child returns at line 11, inside the if (pid==0) branch",
      "The child's pid is not 0, so it skips line 13",
      "The parent waits in waitpid, so line 13 never runs in the child",
      "The child starts executing after line 13"
    ],
    "answer": 0,
    "explain": "In the child pid = 0, so it enters the branch, prints line 10 and executes return 0 on line 11, ending before line 13. The program has no waitpid, and the child resumes at the instruction after the fork, not after line 13."
  },
  {
    "q": "In the slide 32 program, why is \"Line : 20 , Fork return = 1825\" guaranteed to print last?",
    "options": [
      "The parent is blocked in waitpid until the child terminates",
      "The child always runs before the parent after a fork",
      "Fork return = 1825 is printed by the child, which is slower",
      "printf output is sorted by process id"
    ],
    "answer": 0,
    "explain": "That line is the parent's (fork returned the child's id, 1825). The parent calls waitpid(-1, &status, 0) at line 18 and cannot reach line 20 until the child has printed its sum, printed its own line 20 and ended. Without the wait the order between the two processes is not fixed."
  },
  {
    "q": "Process 4100 calls fork and the new child is given process id 4103. The child prints the value fork returned and then its own `getpid()`. What does it print?",
    "options": ["0 and 4103", "4103 and 4103", "0 and 4100", "4103 and 4100"],
    "answer": 0,
    "explain": "In the child fork returns 0, and getpid() gives the child's own id, 4103. The parent would print 4103 (fork's return) and 4100 (its own id), as Lab 4's run showed with 91 and 88."
  }
]
```

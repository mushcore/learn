---
title: What the midterm looks like and how to study for a closed-book paper
minutes: 10
---

The midterm is closed book, so whatever you cannot produce from memory in the exam room does not count. This lesson sets out what the paper contains, what the practice paper shows about its questions, and the order to study in.

## The Details page: two parts, five decks, closed book

The instructor's *Midterm Exam Details* post, item by item:

| Item | The Details page |
|---|---|
| Format | *Two parts, Part 1 (T/F, MCQ . . . ) + Part 2 (on the paper or online).* |
| Topics | Introduction (`Part_1_Introduction_reduced`), OS Structures and Clocks (`Part_2_OS_Structures_and_Clocks`), Processes (`Part_3_Processes`), Threads (`Part_4_Threads`), System Calls (`Part_5_system_call`) |
| Makeup | *Makeup Exams: Not available.* |
| Policy | *Closed book (no cellphone, cheat sheet, and lecture notes or books ).* |
| Laptop | Part 1, and probably Part 2, on your own laptop: *make sure it's fully charged.* |
| Bring | *Bring a blank paper and a calculator (LockDown Browser also offers calculator).* |
| ID | *Bring your student ID card.* |
| Software | *The exam will be conducted using LockDown Browser. Please ensure that it is installed and working properly before the exam.* |
| Practice | Posted under Quizzes, `Midterm_Practice_Part_1` |

The exam runs in exam week, Oct 26–30 2026, with no classes; your slot is on the Learning Hub. Week 7, Concurrency 1, is not on the list of topics.

## The practice paper: 74 questions, 42 of them from Part 1

The posted practice has 74 questions for 74 marks: 59 MCQ, 14 T/F and one matching question (Q56, three standard streams to their file descriptors). By lecture Part:

| Lecture Part | Questions | Worked in |
|---|---|---|
| 1 Introduction | 42 | [the 42 Introduction questions](#/comp4736-midterm/practice-part-1-intro) |
| 2 OS Structures and Clocks | 7 | [structures, clocks and threads](#/comp4736-midterm/practice-structures-threads) |
| 3 Processes | 11 | [processes and system calls](#/comp4736-midterm/practice-processes-syscalls) |
| 4 Threads | 3 | [structures, clocks and threads](#/comp4736-midterm/practice-structures-threads) |
| 5 System Calls | 11 | [processes and system calls](#/comp4736-midterm/practice-processes-syscalls) |

Five Part 1 questions are arithmetic: Q2 (timer register 40 ms ÷ 2 ns), Q15 (address 151 to a cache line), Q52 (word size), Q62 (rwx bits to octal) and Q67 (2 ns to a frequency). The written practice is five calculations: pipeline rate and delay, CPU utilization from a job timeline, 1 − pⁿ with a RAM budget, two parallel jobs with I/O wait, and a direct-mapped cache trace. They are worked in [Practice Part 2](#/comp4736-midterm/written-practice).

## The bank is small: seven questions appear twice

Q5 = Q69, Q10 = Q25, Q12 = Q44, Q18 = Q71, Q21 = Q35, Q26 = Q29 and Q34 = Q53 are the same question, sometimes with the options reordered. Q11 and Q38 ask the same fact in different words. Expect repeats.

Most T/F items are a slide sentence with one word changed. Q5 swaps *hardware* for "software", Q41 swaps *processes* for "programs", Q37 turns *many lines* into "a few lines", Q58 drops *executing*. Each one is False, and you catch it only if you know the slide sentence word for word.

## Three keys a textbook reader gets wrong

The graded answer is the instructor's key. These three are taught as the key has them, with the textbook's view beside it.

| Question | Key | The textbook |
|---|---|---|
| Q7: which action has more overhead in user-level threads than kernel-level | Thread switching | User-level switching is cheaper: no trap, no context switch, no cache flush (the key to Q72 says the same) |
| Q21 and Q35: what holds the PC and the register contents | text | The PC and registers are the process's execution context; the text segment is the program code |
| Q68: clock drivers are built from a crystal oscillator, counter and holding register | False | Those three build a *programmable clock*, the hardware; the driver is software, so the one word "drivers" makes it False |

Q7 is in [structures, clocks and threads](#/comp4736-midterm/practice-structures-threads) with Q68; Q21 and Q35 are in [processes and system calls](#/comp4736-midterm/practice-processes-syscalls).

## Study by producing, not re-reading

1. For each Part, take its recall drill cold and write every list and number before you check.
2. Take the Part's mock timed, then the full [mock Part 1](#/comp4736-midterm/mock-part-1-exam) in about 45 minutes.
3. Do the [five written questions](#/comp4736-midterm/written-practice) on paper, then [mock Part 2](#/comp4736-midterm/mock-part-2-exam) with every step shown.
4. Finish with the [recall drill across all five Parts](#/comp4736-midterm/recall-drill-all).

| Part | Mock | Recall drill |
|---|---|---|
| 1 Introduction | [mock Part 1](#/comp4736-p1/mock-part-1) | [drill Part 1](#/comp4736-p1/recall-drill-1) |
| 2 OS Structures and Clocks | [mock Part 2](#/comp4736-p2/mock-part-2) | [drill Part 2](#/comp4736-p2/recall-drill-2) |
| 3 Processes | [mock Part 3](#/comp4736-p3/mock-part-3) | [drill Part 3](#/comp4736-p3/recall-drill-3) |
| 4 Threads | [mock Part 4](#/comp4736-p4/mock-part-4) | [drill Part 4](#/comp4736-p4/recall-drill-4) |
| 5 System Calls | [mock Part 5](#/comp4736-p5/mock-part-5) | [drill Part 5](#/comp4736-p5/recall-drill-5) |

```quiz
[
  { "q": "A one-page cheat sheet is allowed in the midterm.", "type": "tf", "answer": false, "explain": "The Details page: *Closed book (no cellphone, cheat sheet, and lecture notes or books ).* Nothing but blank paper, a calculator and your student ID comes in." },
  { "q": "How is Part 1 of the midterm written?", "options": ["T/F and MCQ in LockDown Browser on your own laptop", "Written answers on paper only", "T/F and MCQ on paper with a cheat sheet", "A take-home quiz on the Learning Hub"], "answer": 0, "explain": "Part 1 is *T/F, MCQ* and *The exam will be conducted using LockDown Browser*, on your own laptop, fully charged. Part 2 is written, *on the paper or online*." },
  { "q": "How many of the practice paper's 74 Part 1 questions come from lecture Part 1, Introduction?", "type": "numeric", "answer": 42, "tolerance": 0, "explain": "42 of 74. The rest: Part 2 has 7, Part 3 has 11, Part 4 has 3, Part 5 has 11; 42 + 7 + 11 + 3 + 11 = 74." },
  { "q": "If you miss the midterm, a makeup exam can be arranged.", "type": "tf", "answer": false, "explain": "The Details page: *Makeup Exams: Not available.*" },
  { "q": "Which of these is NOT a midterm topic?", "options": ["Concurrency 1", "OS Structures and Clocks", "Threads", "System Calls"], "answer": 0, "explain": "The Details page lists five decks: Introduction, OS Structures and Clocks, Processes, Threads and System Calls. Week 7's Concurrency 1 comes after them and is not on the midterm." },
  { "q": "On the practice paper, the key to Q21 and Q35 says the PC and the register contents are part of which segment?", "options": ["text", "stack", "heap", "data"], "answer": 0, "explain": "The key says text. The textbook places the PC and registers in the process's execution context, not in the text segment, which Part 1 slide 78 calls *the program code*. On the exam, answer as the key does." }
]
```

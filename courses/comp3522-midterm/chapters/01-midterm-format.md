---
title: What the midterm looks like and how to study
minutes: 12
---

The midterm is a paper exam in five question shapes, and the 105-mark practice paper shows every one of them; the real paper's total is not given.

## When, where, what you may bring

**Thursday Oct 29, 3:30 pm, room SW03-1710, 90 minutes, written on paper.** The instructor's words: "Come 10 minutes early to make sure we don't start late." It covers all the topics up to and including Week 7.

You may bring **one page, double-sided cheat sheet, handwritten or printed with Arial size 10 font and up**. The practice paper's instruction 2 says "closed-book exam. No cheat sheets"; that is the older template, and the Midterm Info slide from Week 7 is the rule that applies.

The rest of the practice paper's instructions carry over. No phones: if yours rings you earn zero. No electronic devices, calculators, watches, music players or headphones. No talking, eyes on your own paper. Answers go on the exam itself, and you may write on the back. Nobody is admitted after 30 minutes and nobody leaves during the first 30. No questions during the exam except for a supposed typo. Then: "Good luck. You've got this."

## The marks

| Part | Questions | Marks |
|---|---|---|
| A: Theory | 1 to 16, short written answers | 66 |
| B: Code | 20 to 28, read code or write code | 39 |
| Total | | 105 |

Questions 17, 18 and 19 do not exist on the practice paper; the numbering jumps from 16 to 20. The sixteen printed Part A marks add up to 57, so the cover's 66 includes the marks of the removed questions. Part B's nine questions add up to exactly 39: Q20 (7), Q21 (3), Q22 (3), Q23 (2), Q24 (3), Q25 (3), Q26 (10), Q27 (4), Q28 (4). Q26, the file-to-stack program, is worth 10 on its own, more than any other question on the paper, so leave time for it.

## The five question shapes and how to answer each

**Multiple choice and true/false.** The statements come from slide wording, so a sentence that sounds almost right is the trap: `struct` and `class` differ only in default access, a reference cannot be re-seated, there is no `abstract` keyword.

**Definitions** ("What is a reference?"). Three moves earn full marks: define it in the slide's term (an alias for an existing variable), contrast it with the thing it is confused with (a pointer holds an address and can be re-pointed), and give one line of code (`int& ref = n;`). A question that says "Be specific" or "Code snippets may be used" is asking for the code line.

**Read a code snippet and write the output.** The hint tells you how many lines to expect; use it as a check, not a guess. Count by rule: a by-value parameter costs one copy constructor; a by-value return costs one only when it returns a parameter or an object that outlives the call, because `return T(...)` is elided under C++17 and g++ elides a returned local (NRVO); base constructors run before derived, members before the body; every object destroyed at scope end prints its destructor in reverse order of construction; a temporary dies at the end of its full expression. Write the lines as you trace, then count them.

**Short coding question.** Use the signature exactly as printed. The stream operators return the stream (`return os;`, `return is;`), take the object as `const Fraction&` for output and `Fraction&` for input, and are declared `friend` inside the class so they can read private members.

**Long coding question.** "Long questions are guided: broken down into multiple parts, ask you to write individual functions." Each part is marked on its own, and the paper says "You may assume the code from the Fraction questions (21, 22, 23) is available to you", so write every part even if an earlier one went wrong.

## The instructor's study plan

1. Go over the slides and the links in the slides.
2. Understand the code samples referenced in the slides (sample.cpp and the weekly projects).
3. Recall what we did in labs and assignments.
4. Try out the coding challenges within the lectures.
5. Try out the COMP 3522 Practice Midterm (Week 6 folder), which the next three lessons work through.
6. Go over your old quizzes: Activities > Quizzes > Quiz 2 (down arrow) > Submissions > Attempt 1.

Not sure about a topic? Search "`topic` geeks for geeks" (for example "multiple inheritance geeks for geeks"), use tutorialspoint, or ask the instructor. Next week is review; request topics anonymously at https://forms.gle/HAcpDu8cZTw5yY9bA.

```quiz
[
  {
    "q": "The midterm is written...",
    "options": ["on paper, 90 minutes, Oct 29 at 3:30 pm in SW03-1710", "online on the Learning Hub, 60 minutes", "on paper, 120 minutes, in the usual lab room", "on your laptop with CLion"],
    "answer": 0,
    "explain": "Midterm Info slide: Oct 29, 3:30 pm, SW03-1710, 90 minutes, on paper. Arrive 10 minutes early."
  },
  {
    "q": "The practice paper says the exam is closed-book with no cheat sheets, so nothing may be brought in.",
    "type": "tf",
    "answer": false,
    "explain": "The Midterm Info slide is newer and allows one double-sided page, handwritten or printed in Arial 10 or larger. The practice paper's line is the old template."
  },
  {
    "q": "Which weeks does the midterm cover?",
    "options": ["Weeks 1 to 4", "Weeks 1 to 6", "Weeks 1 to 7", "Weeks 5 to 7 only"],
    "answer": 2,
    "explain": "All the topics up to and including Week 7 material, even though the practice paper is 80% Weeks 1 to 4."
  },
  {
    "q": "A definition question says 'Be specific. Code snippets may be used.' Full marks need...",
    "options": ["the slide's definition alone", "a page of code", "a diagram only", "the definition, a contrast with the related concept, and one line of code"],
    "answer": 3,
    "explain": "Define in the slide's term, contrast with what it is confused with, and show the code line the question invites."
  },
  {
    "q": "What is the mark split of the practice paper?",
    "options": ["Part A 50 + Part B 50 = 100", "Part A 66 + Part B 39 = 105", "Part A 39 + Part B 66 = 105", "Part A 57 + Part B 43 = 100"],
    "answer": 1,
    "explain": "Theory is Part A out of 66; code is Part B out of 39; total 105. Q26 alone is 10 of Part B's 39."
  },
  {
    "q": "Where does the instructor say to find your old quiz attempts?",
    "options": ["Content > Week 6", "Grades > Feedback", "Activities > Quizzes > Quiz 2 > Submissions > Attempt 1", "the course GitHub repository"],
    "answer": 2,
    "explain": "Study strategy item 6 on the Midterm Info slide, with the down arrow next to the quiz name."
  }
]
```

---
title: "Core 1: the printed cheat sheet: what is on each band and when to open it"
minutes: 10
---
The midterm allows one page, double-sided, handwritten or printed in Arial 10 pt or larger. The printed sheet is built to that rule: one Letter page in landscape, three columns per side, every character Arial 10 pt, code included. Colour carries the structure: a dark band names each question shape, yellow marks the paper's own words, blue is plain English beside the code, red is a trap. A pass strip sits under the title at the top of side 1: band 2 definitions (57 marks), band 3 Fraction Q21 to Q26 (24) and band 1 Q20 trace (7) cover 88 of the practice paper's 96 marks, so do those first and band 4 last.

[Print page](/courses/comp3522-midterm/sheet/index.html) (also saved as [sheet.pdf](/courses/comp3522-midterm/sheet/sheet.pdf), and copied to `D:/BCIT/COMP3522/COMP3522 - Midterm Cheatsheet.pdf`). Print double-sided on Letter, landscape, at actual size (not "fit to page"), and check the printout against the PDF.

## Which band answers which question

The sheet is ordered by the shape of the question on the paper, not by week. Read the question, name its shape, open that band.

| Question shape | Open | Band |
|---|---|---|
| Any C++ word you do not recognise in a question | Side 1 | 0. Reading C++: the words every question uses |
| Write the output of a class program (constructor and destructor lines) | Side 1 | 1. "What is printed by this code?": the rule table |
| Output with pass by value, return by value (Q20 shape) | Side 1 | 1. Q20 shape |
| Output with two base classes or virtual inheritance (Q27, Q28 shape) | Side 1 | 1. Q27 / Q28 shape |
| Output with slicing, a virtual or non-virtual destructor, a virtual function | Side 1 | 1. Parent/Child shape |
| "What is X? How is it different from Y? When is it used?" (marks in brackets) | Side 1 bottom, side 2 | 2. Definitions |
| Write the Fraction class, `operator<<`, `operator>>`, or the file-reading `main` | Side 2 | 3. Fraction, all parts |
| Write a copy constructor for a class owning an array; write an abstract class | Side 2 | 3. Deep copy; abstract class |
| True/false or multiple choice on exceptions, STL, static, elision, the right-left rule, Week 1 | Side 2 | 4. True/false and multiple choice traps |

## The band map

- **Side 1, band 0, Reading C++:** eight rows, one per symbol a definition or trace question uses: class and object, constructor, copy constructor, destructor, initializer list, reference, pointer, `virtual`. Each row says the thing in one plain sentence.
- **Side 1, band 1, What is printed:** the method (born, copied, dies), the fourteen-row rule table, Q20 line by line with the fourteen lines numbered, Q27 and Q28 side by side with the one-sentence "why different", the Parent/Child program's five variants, the Animal/Bird virtual-function trace, and the by-value friend that prints 1.
- **Side 1 right column and side 2, band 2, Definitions:** the sixteen Part A answers in the paper's order, each one paragraph in three labelled moves (**Name:**, **Contrast:**, **Code:**), plus a **Used when:** line for Q1, Q3 and Q4, with the a/b/c parts kept for Q7 and Q15; the yellow cue carries the question's own words.
- **Side 2, band 3, Write the code:** the whole Fraction class with Q21 to Q25 marked and `main` for Q26, the marking notes, `operator+`, then `Character` with a deep copy constructor and destructor, and `Shape` with `Circle`.
- **Side 2, band 4, Traps:** one entry per topic: exceptions, STL, static and elision, the right-left rule (the procedure and two of the slide declarations), Week 1 arithmetic.

## Know these cold: they are not on the sheet

- **Why the trace rules hold:** a by-value parameter is a new object, a temporary dies at the end of its full expression, bases are built before members and members before the body, and destruction runs in reverse. The table lists results; the reasoning has to be yours.
- **How to read a declaration:** only two readings are printed, so a new declaration has to be read with the procedure itself.
- **The three moves of a definition:** say what it is, say what it is confused with, give one line of code. Band 2 has the content, not the habit.
- **The `while (in >> a >> b)` idiom:** the read is the loop condition, so the loop stops at end of file or on bad input, with no extra last pass.
- **Copy-and-swap as code:** band 2 gives the `operator=` line and the three steps; the `mySwap` body is not printed, so know that it swaps every member.

```quiz
[
  {
    "q": "The paper asks for the output of a program with `B : virtual public A` and `C : virtual public B`. Which band do you open?",
    "options": ["1. What is printed, the Q27 / Q28 shape", "4. Traps, the right-left rule", "3. Write the code", "2. Definitions, the Diamond entry"],
    "answer": 0,
    "explain": "An output question with constructor and destructor lines belongs to band 1. Q28, the virtual-inheritance case, sits there side by side with Q27 with the one-sentence reason. The Diamond entry in band 2 explains the shape, but it does not list output lines."
  },
  {
    "q": "The paper asks you to write `operator>>` for the Fraction class. Which band do you open?",
    "options": ["3. Write the code, Fraction", "2. Definitions", "0. Reading C++", "4. Traps, STL"],
    "answer": 0,
    "explain": "Band 3 carries the whole Fraction class with Q21 to Q25 marked, `operator>>` included: it reads into the non-const reference and returns the stream."
  },
  {
    "q": "The paper asks what `int (**ppf)();` is. Which band do you open?",
    "options": ["4. Traps, the right-left rule", "0. Reading C++", "1. What is printed", "2. Definitions"],
    "answer": 0,
    "explain": "The right-left rule lives in band 4 on side 2: the procedure in one line and two slide declarations with their readings. `int (**ppf)();` is one of them: a pointer to a pointer to a function returning an int."
  },
  {
    "q": "The paper asks which handler runs when an `invalid_argument` is thrown and the first handler catches `exception&`. Which band do you open?",
    "options": ["4. Traps, Exceptions", "3. Write the code", "2. Definitions", "0. Reading C++"],
    "answer": 0,
    "explain": "The Exceptions line of band 4 has the handler order rule: the first match wins, so the child type goes first and `catch (...)` goes last. Here the parent handler is first, so it catches the `invalid_argument`."
  },
  {
    "q": "The paper asks whether `l.sort()` or `sort(l.begin(), l.end())` is right for a `list`. Which band do you open?",
    "options": ["4. Traps, STL", "3. Write the code", "2. Definitions", "1. What is printed"],
    "answer": 0,
    "explain": "The STL line of band 4 says `sort` needs random access (vector, deque) and that `list` has its own `l.sort()`."
  },
  {
    "q": "The sheet prints the Fraction class and the file-reading `main` in full on side 2.",
    "type": "tf",
    "answer": true,
    "explain": "Band 3, the second band on side 2, holds the whole class, `main` for Q26 and the marking notes."
  },
  {
    "q": "The right-left rule is on side 1, next to the trace table.",
    "type": "tf",
    "answer": false,
    "explain": "The right-left rule is in band 4 on side 2. Side 1 holds the decoder, the trace band and the first two definitions."
  },
  {
    "q": "Code on the sheet is printed in a smaller monospace font so whole functions fit.",
    "type": "tf",
    "answer": false,
    "explain": "The midterm rule is Arial 10 pt or larger, so code is in Arial 10 pt as well. A light grey box marks it as code, and the blue note beside a line says what the line does."
  },
  {
    "q": "Band 4 says that `Number n = createNumber(5);` makes one object when `createNumber` returns `Number(n)`.",
    "type": "tf",
    "answer": true,
    "explain": "Since C++17, `return Number(n);` is guaranteed elision, so only one object is made. The same line marks the named-local return as an NRVO with \"no guarantee\", in the slide's words."
  },
  {
    "q": "The sheet prints the `while (in >> num >> den)` loop, so the idiom does not need to be understood before the exam.",
    "type": "tf",
    "answer": false,
    "explain": "The loop is printed inside Q26, but writing a new reading loop under time pressure means knowing why it works: the read is the condition, so it stops at end of file or on bad input with no extra pass."
  }
]
```

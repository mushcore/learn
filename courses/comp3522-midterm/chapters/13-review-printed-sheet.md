---
title: "Review 7: the printed cheat sheet: what is on each side and when to open it"
minutes: 10
---
The midterm allows one page, double-sided, handwritten or printed in Arial 10 pt or larger. The printed sheet is built to that rule: one Letter page, three columns per side, every character Arial 10 pt, code included.

[Print page](/courses/comp3522-midterm/sheet/index.html) (also saved as [sheet.pdf](/courses/comp3522-midterm/sheet/sheet.pdf), and copied to `D:/BCIT/COMP3522/COMP3522 - Midterm Cheatsheet.pdf`). Print double-sided on Letter, Arial 10, check the printout against the PDF.

## Which section answers which question

| Question shape | Open | Section |
|---|---|---|
| Write the output of a class program (constructor and destructor lines) | Side 1 | A. Trace rules |
| Output with virtual inheritance or two base classes | Side 1 | A. Trace rules (Q27, Q28) |
| Pointer or reference code, `new`/`delete`, a leak or a dangling pointer | Side 1 | B. Pointers, references, memory |
| "Define and explain" a term (marks in brackets) | Side 1 | C. Definitions in three moves |
| "What is `x`?" for a declaration such as `int *(*pap)[];` | Side 1 | D. Right-left rule |
| Write the Fraction class, `operator<<`, `operator>>` or the file-reading `main` | Side 2 | E. Fraction, complete |
| Deep copy, `operator=`, abstract class, interface, diamond | Side 2 | F. Deep copy, copy-and-swap, abstract, interface, diamond |
| Which handler runs, what `what()` prints, what happens if nothing catches | Side 2 | G. Exceptions |
| `map` insert versus `[]`, iterator kinds, `sort` with a comparator | Side 2 | H. STL |
| A static member, or how many `Number` objects a return makes | Side 2 | I. Static, copy elision |
| Integer division, `%`, `setprecision`, recovering `cin` | Side 2 | J. Week 1 syntax |

## The section map

- **Side 1, A. Trace rules:** the 14-row table of what each line constructs and destroys, Q20 annotated line by line, ParentChild's 8 lines, Q27 and Q28 side by side.
- **Side 1, B. Pointers, references, memory:** the box picture, `*p` and `int& r`, swap by value, pointer and reference, leak and dangling, stack versus heap, `v.at(5)`.
- **Side 1, C. Definitions in three moves:** Q1 to Q16 of the practice paper, each with its marks.
- **Side 1, D. Right-left rule:** the five steps in the slide's words and the six declarations with their readings.
- **Side 2, E. Fraction, complete:** the includes, the whole class with Q21 to Q25 marked, `main` for Q26, the `getline` and vector variants, where the marks go.
- **Side 2, F. Deep copy, copy-and-swap, abstract, interface, diamond:** `Character` with a deep copy constructor and copy-and-swap, `Shape` and `Circle`, the person diamond, the friend and `virtual` rules.
- **Side 2, G. Exceptions:** a custom exception, child-first handlers, `catch (...)` last, the termination and `noexcept` rules.
- **Side 2, H. STL:** the `map` bag, the `set` and `priority_queue` facts, the iterator-kind table, `sort` with `byHp`, `partition`.
- **Side 2, I. Static, copy elision:** `Mob` with its three static members, the static function rules, the four `Number` return cases.
- **Side 2, J. Week 1 syntax:** negative division and `%`, `fixed << setprecision(2)`, the `cin.clear()` and `cin.ignore` lines.

## Know these cold: they are not on the sheet

- **Why the trace rules hold:** a by-value parameter is a new object, a temporary dies at the end of its full expression, bases are built before members and members before the body, and destruction runs in reverse. The table lists results; the reasoning has to be yours.
- **How to read a declaration:** six readings are printed, but a new declaration has to be read with the procedure itself.
- **The three moves of a definition:** say what it is, show it in one line of code, give the consequence or the trap. Section C has the content, not the habit.
- **The `while (in >> a >> b)` idiom:** the read is the loop condition, so the loop stops at end of file or on bad input, with no extra last pass.
- **Which week each topic is from:** Week 1 syntax, Weeks 2 to 4 classes and memory, Week 5 exceptions, Week 6 STL, Week 7 static, copy elision and the right-left rule. The sheet is ordered by question shape, not by week.

```quiz
[
  {
    "q": "The paper asks for the output of a program with `B : virtual public A` and `C : virtual public B`. Which section do you open?",
    "options": ["A. Trace rules", "D. Right-left rule", "F. Deep copy, copy-and-swap, abstract, interface, diamond", "I. Static, copy elision"],
    "answer": 0,
    "explain": "An output question with constructor and destructor lines belongs to section A. Q28, the virtual-inheritance case, sits there side by side with Q27. Section F explains the diamond, but it does not list output lines."
  },
  {
    "q": "The paper asks you to write `operator>>` for the Fraction class. Which section do you open?",
    "options": ["E. Fraction, complete", "C. Definitions in three moves", "F. Deep copy, copy-and-swap, abstract, interface, diamond", "H. STL"],
    "answer": 0,
    "explain": "Section E carries the whole Fraction class with Q21 to Q25 marked, `operator>>` included: it reads into the non-const reference and returns the stream."
  },
  {
    "q": "The paper asks what `int (**ppf)();` is. Which section do you open?",
    "options": ["D. Right-left rule", "B. Pointers, references, memory", "A. Trace rules", "J. Week 1 syntax"],
    "answer": 0,
    "explain": "Section D lists the five steps and the six slide declarations with their readings. `int (**ppf)();` is one of them: a pointer to a pointer to a function returning an int."
  },
  {
    "q": "The paper asks which handler runs when an `invalid_argument` is thrown and the first handler catches `exception&`. Which section do you open?",
    "options": ["G. Exceptions", "E. Fraction, complete", "H. STL", "C. Definitions in three moves"],
    "answer": 0,
    "explain": "Section G has the handler order rule: the first match wins, so the child type goes first and `catch (...)` goes last."
  },
  {
    "q": "The paper asks whether `l.sort()` or `sort(l.begin(), l.end())` is right for a `list`. Which section do you open?",
    "options": ["H. STL", "J. Week 1 syntax", "I. Static, copy elision", "B. Pointers, references, memory"],
    "answer": 0,
    "explain": "Section H has the iterator-kind table: `list` is bidirectional, and `std::sort` needs random access, so a list uses its own `l.sort()`."
  },
  {
    "q": "The sheet prints the Fraction class and the file-reading `main` in full on side 2.",
    "type": "tf",
    "answer": true,
    "explain": "Section E, the first section on side 2, holds the whole class, `main` for Q26, and the `getline` and vector variants."
  },
  {
    "q": "The right-left rule is on side 2, next to the STL table.",
    "type": "tf",
    "answer": false,
    "explain": "The right-left rule is section D on side 1. Side 2 runs E to J: Fraction, design, exceptions, STL, static and Week 1 syntax."
  },
  {
    "q": "Code on the sheet is printed in a smaller monospace font so whole functions fit.",
    "type": "tf",
    "answer": false,
    "explain": "The midterm rule is Arial 10 pt or larger, so code is in Arial 10 pt as well. A light grey box marks it as code instead of a different font."
  },
  {
    "q": "Section I shows that `Number n = createNumber(5);` makes one object when `createNumber` returns `Number(n)`.",
    "type": "tf",
    "answer": true,
    "explain": "Since C++17, `return Number(n);` is guaranteed elision, so only one object is made. Section I also marks the named-local return as an optional NRVO and the parameter return as a copy."
  },
  {
    "q": "The sheet prints the `while (in >> num >> den)` loop, so the idiom does not need to be understood before the exam.",
    "type": "tf",
    "answer": false,
    "explain": "The loop is printed inside Q26, but writing a new reading loop under time pressure means knowing why it works: the read is the condition, so it stops at end of file or on bad input with no extra pass."
  }
]
```

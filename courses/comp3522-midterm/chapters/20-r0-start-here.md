---
title: "Start here: how to use this chapter, the three-move answer, and the trace method"
minutes: 10
---
This lesson says what the exam looks like, how the short lessons after it work, and why part 1 of this review is the path to a pass. It also teaches the two habits every other lesson uses: the three-move answer and the trace method.

## The exam, in four short paragraphs

The midterm is on paper, 90 minutes, Thursday at 3:30 pm in SW03-1710. It covers Weeks 1 to 7.

You may bring one page, double-sided, handwritten or printed in Arial 10 pt or larger. The printed sheet for this module is built to that rule. Print it before you read on.

The questions come in five shapes: multiple choice and true or false, definitions, read a program and write its output, a short coding question, and a long coding question split into guided parts.

The practice paper is the only sample. Its sixteen definitions are worth 57 marks, its three output questions 15, and its six Fraction parts 24. Every definition and the whole Fraction class are printed on the sheet.

## How this chapter works

Each lesson teaches one idea. It opens in plain words with no code, then shows the smallest program that uses the idea, then states the rule in the slide's words, then works the practice paper's own question.

Read a lesson top to bottom and do its Try-it before moving on. The Remember list at the end names the band of the sheet where the idea is printed.

Nothing in a lesson points forward to another lesson. If a word is new, the sentence where it appears says what it means.

## Part 1 is the path to a pass

Half the marks come from three skills: write a definition in three moves from band 2 of the sheet, adapt the Fraction class from band 3, and apply the trace rules from band 1. The eleven Core lessons of part 1 teach those three skills and nothing else. They take about three hours.

| Lesson | What it is | Marks on the practice paper | Band |
|---|---|---|---|
| Core 1 | the printed cheat sheet | all of them | every band |
| Core 2 | an object is born and dies | the base of every trace | 1 |
| Core 3 | a variable is a box | Q4 (4) | 2 |
| Core 4 | references and swap | Q2, Q3 (7) | 2 |
| Core 5 | the stack and the heap | Q5, Q6 (8) | 2 |
| Core 6 | the three-move definition, the copy constructor | Q1 (4) | 2 |
| Core 7 | `const` in two places, when the destructor runs | Q7, Q8 (9) | 2 |
| Core 8 | the Fraction class from zero | Q21, Q22, Q23 (8) | 3 |
| Core 9 | the stream operators | Q24, Q25 (6) | 3 |
| Core 10 | reading Fractions.txt into a stack | Q26 (10) | 3 |
| Core 11 | when a copy is made, and Q20 | Q20 (7) | 1 |

That is 63 marks of the practice paper's 96, all answerable from the sheet once the idea is understood.

Part 2 holds the other fourteen lessons, the Extras, in mark order. Extra 1 (Q9 to Q12, 11 marks, short and all on the sheet) and Extra 2 (Q27 and Q28, 8 marks) come first. Take them only when part 1 is done.

## The three-move answer

A definition question is marked on facts, not on length. Three moves earn the marks every time.

```diagram
{ "type": "flow", "title": "How to answer a definition question", "nodes": [
  { "id": "d", "label": "Name it", "sub": "in the slide's words" },
  { "id": "c", "label": "Contrast it", "sub": "with the confused thing" },
  { "id": "x", "label": "One line of code", "sub": "that shows it" }
], "edges": [ { "from": "d", "to": "c" }, { "from": "c", "to": "x" } ], "hi": ["d"], "caption": "Name, contrast, code: three sentences, three marks." }
```

Take "What is a reference? How is it different from a pointer?" as the example.

Move one names it in the slide's words: a reference is an alias, another name for an existing variable.

Move two contrasts it with the thing it is confused with: a pointer holds an address and can be pointed somewhere else, while a reference is fixed to one variable for life.

Move three gives one line of code: `int& ref = n;`.

A question that adds "when is it used" wants a fourth move: a short list of the moments, each with its line of code. A question that says "Be specific" or "Code snippets may be used" is asking for move three.

Band 2 of the sheet prints all sixteen answers in this shape. In the exam, find the question's words in band 2, then write the three moves in your own hand.

## The trace method: born, copied, dies

An output question prints a program whose constructors and destructor each print a line. The output is a record of objects being born and dying, so you read the program one statement at a time and ask three questions.

Does this statement create a new object? Then a constructor line prints.

Does it create the new object as a copy of another? Then the line is the copy constructor's.

Does an object stop existing here, at a closing brace, at a `delete`, or at the end of a statement that made a temporary? Then a destructor line prints, and objects die in the reverse order of their birth.

```diagram
{ "type": "grid", "title": "Three statements, four lines", "nodes": [
  { "id": "h0", "label": "Statement", "row": 0, "col": 0 },
  { "id": "h1", "label": "Question", "row": 0, "col": 1 },
  { "id": "h2", "label": "Line printed", "row": 0, "col": 2 },
  { "id": "a0", "label": "Mob a;", "row": 1, "col": 0 },
  { "id": "a1", "label": "new object?", "row": 1, "col": 1 },
  { "id": "a2", "label": "constructor", "row": 1, "col": 2 },
  { "id": "b0", "label": "Mob b = a;", "row": 2, "col": 0 },
  { "id": "b1", "label": "new object as a copy?", "row": 2, "col": 1 },
  { "id": "b2", "label": "copy constructor", "row": 2, "col": 2 },
  { "id": "c0", "label": "}", "row": 3, "col": 0 },
  { "id": "c1", "label": "objects die?", "row": 3, "col": 1 },
  { "id": "c2", "label": "destructor for b, then for a", "row": 3, "col": 2 }
], "hi": ["c2"], "caption": "Every statement is one of three events; the closing brace kills the youngest object first." }
```

Band 1 of the sheet prints the full rule table and the practice paper's three programs with their lines. The method is yours to apply; the table is there to check each row against.

## Try it

```quiz
[
  {
    "q": "A definition question says \"Be specific. Code snippets may be used.\" Which move is it asking for?",
    "options": ["The third move: one line of code that shows the thing", "The first move only, in more words", "A list of every week the topic appeared in", "A diagram of memory"],
    "answer": 0,
    "explain": "The three moves are name, contrast, code. \"Code snippets may be used\" is the paper's way of saying the code line earns a mark. Name it in the slide's words first, contrast it second, then write the line."
  },
  {
    "q": "On the practice paper, which single question is worth the most marks?",
    "options": ["Q26, the program that reads Fractions.txt into a stack", "Q20, the fourteen-line output trace", "Q15, the diamond", "Q7, the two uses of const"],
    "answer": 0,
    "explain": "Q26 is worth 10 on its own. Q20 is 7, Q7 and Q15 are 6 each. The whole Fraction program is printed in band 3 of the sheet, so leave time to adapt it."
  },
  {
    "q": "Objects created in one block are destroyed in the same order they were created.",
    "type": "tf",
    "answer": false,
    "explain": "They are destroyed in the reverse order: the youngest object dies first. In a block that creates `a` then `b`, the closing brace prints `b`'s destructor line before `a`'s."
  },
  {
    "q": "In the exam a question asks you to write `operator>>` for a class. Which band of the sheet do you open?",
    "options": ["Band 3, write the function, class or program", "Band 1, what is printed by this code", "Band 0, reading C++", "Band 4, true or false and multiple choice traps"],
    "answer": 0,
    "explain": "Band 3 holds the whole Fraction class with Q21 to Q25 marked, `operator>>` included. Band 1 is for output traces and band 4 for the short-answer traps."
  }
]
```

## Remember

- Definitions: name it, contrast it, one line of code. Band 2 has the content; the habit is yours.
- Traces: for each statement ask born, copied or dies; destruction runs in reverse. Band 1 has the table.
- The path to a pass is part 1: eleven Core lessons, about three hours, 63 marks. Part 2 waits until part 1 is done.

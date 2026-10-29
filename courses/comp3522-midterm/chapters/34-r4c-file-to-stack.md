---
title: "Core 10: reading Fractions.txt into a stack: the Q26 program"
minutes: 25
---
This lesson writes Q26, the program that reads Fractions.txt into a stack and prints it. At 10 marks it is the biggest single part of the paper.

## What a stack is, in plain words

A stack is a pile of plates. You put a new plate on the top, and you take plates off the top.

So the last plate in is the first plate out. Three items pushed come back in reverse order.

The library has a ready-made one, called `std::stack`. Its three doors are `push` to add on top, `top` to look at the top, and `pop` to remove it.

```diagram
{ "type": "grid", "title": "The stack after reading three rows", "nodes": [
  { "id": "h0", "label": "place", "row": 0, "col": 0 },
  { "id": "h1", "label": "holds", "row": 0, "col": 1 },
  { "id": "h2", "label": "pushed", "row": 0, "col": 2 },
  { "id": "h3", "label": "popped", "row": 0, "col": 3 },
  { "id": "a0", "label": "top", "row": 1, "col": 0 },
  { "id": "a1", "label": "5/6", "row": 1, "col": 1 },
  { "id": "a2", "label": "third", "row": 1, "col": 2 },
  { "id": "a3", "label": "first", "row": 1, "col": 3 },
  { "id": "b0", "label": "middle", "row": 2, "col": 0 },
  { "id": "b1", "label": "3/4", "row": 2, "col": 1 },
  { "id": "b2", "label": "second", "row": 2, "col": 2 },
  { "id": "b3", "label": "second", "row": 2, "col": 3 },
  { "id": "c0", "label": "bottom", "row": 3, "col": 0 },
  { "id": "c1", "label": "1/2", "row": 3, "col": 1 },
  { "id": "c2", "label": "first", "row": 3, "col": 2 },
  { "id": "c3", "label": "third", "row": 3, "col": 3 }
], "hi": ["a1", "a3"], "caption": "Last in, first out: the row read last sits on top, so it is the first one printed." }
```

## A tiny program you can run in your head

```cpp run pin QuestStack.cpp
// predict: Write all four lines printed.
#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    stack<string> quests;
    quests.push("Lith Harbor");
    quests.push("Kerning City");
    quests.push("Ellinia");
    cout << quests.size() << " quests" << endl;
    while (!quests.empty()) {
        cout << quests.top() << endl;
        quests.pop();
    }
}
```

1. The three `push` calls pile up the towns, and `cout << quests.size() << " quests" << endl;` prints `3 quests`.
2. `cout << quests.top() << endl;` shows the town pushed last, `Ellinia`, and `quests.pop();` removes it.
3. The next pass shows `Kerning City`.
4. The last pass shows `Lith Harbor`, and `while (!quests.empty())` is then false.

A stack always hands back the newest item first.

## What a file stream is, in plain words

A file stream is a stream that reads from a file instead of the keyboard. Once it is open, it reads exactly like `cin`.

Opening can fail, for example when the file is missing. A stream that failed to open makes every later read fail, so the program checks the open first.

Reading a file is a loop that asks for the next two numbers each time. The read itself is the loop's test: it is true while the reads work, and false once one fails.

A read fails at the end of the file, or when it meets text where a number should be. Either way, the loop stops by itself.

```cpp run pin OpenCheck.cpp
// predict: The app's server has no Fractions.txt. Write the line printed.
#include <fstream>
#include <iostream>
using namespace std;

int main() {
    ifstream in("Fractions.txt");
    if (!in.is_open()) {
        cout << "Could not open Fractions.txt" << endl;
        return 1;
    }
    cout << "opened" << endl;
    return 0;
}
```

1. `ifstream in("Fractions.txt");` tries to open the file, finds nothing, and `if (!in.is_open())` is true. The program prints `Could not open Fractions.txt` and leaves `main` with `return 1;`.

On paper the message goes to `cerr`, the error stream. Here it goes to `cout` so the output box shows it.

Below, two string streams built from the same text play the file twice, once per loop. The middle row is broken on purpose.

```cpp run pin TwoLoops.cpp
// predict: The three rows are 1 2, then 3 x, then 5 6. Write every line printed.
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string rows = "1 2\n3 x\n5 6\n";
    int num, den;

    istringstream in(rows);
    while (in >> num >> den) {
        cout << "loop 1 read " << num << "/" << den << endl;
    }
    cout << "loop 1 stopped" << endl;

    istringstream file(rows);
    string line;
    while (getline(file, line)) {
        istringstream iss(line);
        if (iss >> num >> den) {
            cout << "loop 2 read " << num << "/" << den << endl;
        } else {
            cout << "loop 2 skipped " << line << endl;
        }
    }
    return 0;
}
```

1. `while (in >> num >> den)` reads 1 and 2: `loop 1 read 1/2`.
2. On the second pass `>> num` reads 3, but `>> den` meets `x` and fails. The loop ends with 5 and 6 never read: `loop 1 stopped`.
3. `while (getline(file, line))` hands over the text `1 2`, and `istringstream iss(line);` makes a fresh stream from it: `loop 2 read 1/2`.
4. `3 x` fails inside its own `iss`, so the `else` branch prints `loop 2 skipped 3 x`. The outer `getline` is not affected.
5. `5 6` gives `loop 2 read 5/6`. The next `getline` finds the end, and the loop stops.

## The rules, in the slide's words

| Piece | The rule |
|---|---|
| Opening | From `<fstream>`, `ifstream` reads, `ofstream` writes and `fstream` does both. The slide checks with `if (!f.is_open()) { cerr << "Unable to open file" << endl; exit(1); }`. |
| The `>>` loop | `in >> num >> den` is `(in >> num) >> den`, and each `>>` returns the stream. A stream in a condition is true while no read has failed. |
| The last row | Reading the last number of a file with no final newline still succeeds. It sets only eofbit, and the stream stays true until a read actually fails. |
| The `getline` loop | `getline(cin, input)` "reads a line into the string, tosses the newline, returns the stream". An `istringstream` is a stream that reads from a string. |
| `push` | It stores a copy, made by your copy constructor. The temporary in `push(Fraction(num, den))` dies at the end of the statement. |
| A throw in the loop | It jumps out of the loop and out of the `try` block, straight to the `catch`. The rows after it are never read. |
| The end | When the stack dies, it destroys every object it still holds. |

Q26 says "You may assume that there are no zeros in the file". So both loops earn the marks, and the `>>` loop is shorter.

## The paper's question, worked

The model answer is the whole Part B question in one file, in the paper's order. In the app the rows come from the stdin box, so `istream& in = cin;` stands in for the `ifstream` lines and the open check.

```diagram
{ "type": "flow", "title": "Where each part runs in Q26", "nodes": [
  { "id": "r", "label": "row 1 2", "sub": "Fractions.txt" },
  { "id": "x", "label": "in >> num >> den", "sub": "loop test" },
  { "id": "c", "label": "Fraction(num, den)", "sub": "Q21" },
  { "id": "p", "label": "push copies it", "sub": "Q22; temp gets Q23" },
  { "id": "t", "label": "top() then pop()", "sub": "last row first" },
  { "id": "o", "label": "cout << top()", "sub": "Q24" }
], "edges": [ { "from": "r", "to": "x" }, { "from": "x", "to": "c" }, { "from": "c", "to": "p" }, { "from": "p", "to": "t" }, { "from": "t", "to": "o" } ], "hi": ["c", "p"], "caption": "Fraction declares a copy constructor and a destructor, so it gets no move constructor: push stores a copy made by Q22, and the temporary is destroyed at the end of the statement by Q23." }
```

```cpp run pin FractionQ26.cpp
// stdin: 1 2\n3 4\n5 6
// predict: The rows of Fractions.txt are 1 2, 3 4, 5 6. Write all four lines printed.
#include <iostream>
#include <stack>
#include <stdexcept>
using namespace std;

class Fraction {
private:
    int numerator;
    int denominator;
public:
    // Q21: constructor that throws on a zero denominator
    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {
        if (denominator == 0) {
            throw invalid_argument("Denominator cannot be zero");
        }
    }
    // Q22: copy constructor
    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}
    // Q23: destructor (nothing to free)
    ~Fraction() {}
    // Q24 / Q25: friendly stream operators
    friend ostream& operator<<(ostream& os, const Fraction& fraction);
    friend istream& operator>>(istream& is, Fraction& fraction);
};

ostream& operator<<(ostream& os, const Fraction& fraction) {
    os << fraction.numerator << "/" << fraction.denominator;
    return os;
}

istream& operator>>(istream& is, Fraction& fraction) {
    is >> fraction.numerator >> fraction.denominator;
    return is;
}

// Q26: on paper, ifstream in("Fractions.txt") plus the open check; here cin stands in
int main() {
    istream& in = cin;
    stack<Fraction> fractions;
    int num, den;
    while (in >> num >> den) {
        fractions.push(Fraction(num, den));
    }
    while (!fractions.empty()) {
        cout << fractions.top() << endl;
        fractions.pop();
    }
    try {
        Fraction bad(1, 0);
    } catch (invalid_argument& e) {
        cout << "caught: " << e.what() << endl;
    }
    return 0;
}
```

1. `while (in >> num >> den)` runs three times, and `fractions.push(Fraction(num, den));` stores 1/2, then 3/4, then 5/6. The first `cout << fractions.top() << endl;` prints the row pushed last: `5/6`.
2. `fractions.pop();` removes it, and the next `top()` prints `3/4`.
3. Then `1/2`, and `while (!fractions.empty())` is now false.
4. `Fraction bad(1, 0);` throws, and `catch (invalid_argument& e)` prints `caught: Denominator cannot be zero`.

## Write Q26

Q26 is band 3's `int main()` block: add `#include <fstream>` and `<stack>` at the top, and leave out its `try` lines, which only test Q21.

```challenge
{"prompt": "Q26. Write main: a <code>stack&lt;Fraction&gt;</code>, a <code>while (cin &gt;&gt; num &gt;&gt; den)</code> loop that pushes <code>Fraction(num, den)</code>, then print <code>3 fractions</code> (the stack's <code>size()</code>) and every Fraction by <code>top()</code> and <code>pop()</code>. The stdin box holds the three rows of Fractions.txt.", "starter": "#include <iostream>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\n// Questions 21 to 24, available to you\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    // Q26: on paper, ifstream in(\"Fractions.txt\") and the open check come first.\n    // Here the rows arrive on cin. Push one Fraction per row onto a stack<Fraction>,\n    // print \"N fractions\", then print the stack with top() and pop().\n    return 0;\n}\n", "stdin": "1 2\n3 4\n5 6", "expected": "3 fractions\n5/6\n3/4\n1/2", "hints": ["<code>stack&lt;Fraction&gt; fractions; int num, den;</code>", "<code>while (cin &gt;&gt; num &gt;&gt; den) { fractions.push(Fraction(num, den)); }</code>", "<code>cout &lt;&lt; fractions.size() &lt;&lt; \" fractions\" &lt;&lt; endl;</code> then <code>while (!fractions.empty()) { cout &lt;&lt; fractions.top() &lt;&lt; endl; fractions.pop(); }</code>"], "solution": "#include <iostream>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\n// Questions 21 to 24, available to you\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    stack<Fraction> fractions;\n    int num, den;\n    while (cin >> num >> den) {\n        fractions.push(Fraction(num, den));\n    }\n    cout << fractions.size() << \" fractions\" << endl;\n    while (!fractions.empty()) {\n        cout << fractions.top() << endl;\n        fractions.pop();\n    }\n    return 0;\n}\n"}
```

The marks for the whole long question:

| Part | Marks | What earns them |
|---|---|---|
| Q21 | 3 | A `throw` inside the constructor, guarded by `if (denominator == 0)`, and both members stored. `invalid_argument` with `#include <stdexcept>` is the Week 5 answer. |
| Q22 | 3 | The parameter is `const Fraction&`, and both members are copied. |
| Q23 | 2 | `~Fraction() {}` or `= default`, because there is nothing to `delete`. |
| Q24 | 3 | Declared `friend`, writes to `os` and not `cout`, takes `const Fraction&`, and **returns `os`**. |
| Q25 | 3 | Declared `friend`, reads into the non-const `Fraction&`, and **returns `is`**. |
| Q26 | 10 | `#include <fstream>` and `<stack>`, `ifstream in("Fractions.txt")`, the open check, `while (in >> num >> den)` or `getline` with `istringstream`, `push(Fraction(num, den))`, and the result shown with `top()` and `pop()`. |

## Try it

```quiz
[
  { "q": "A `Mob` prints in its constructor, copy constructor and destructor. What does this program print?", "code": "#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nclass Mob {\n    int id;\n    string name;\npublic:\n    Mob(int id, string name) : id(id), name(name) { cout << \"spawn \" << name << endl; }\n    Mob(const Mob& other) : id(other.id), name(other.name) { cout << \"copy \" << name << endl; }\n    ~Mob() { cout << \"gone \" << name << endl; }\n};\n\nint main() {\n    stack<Mob> hunt;\n    hunt.push(Mob(7, \"Slime\"));\n    cout << \"pushed\" << endl;\n    return 0;\n}", "options": ["spawn Slime\ncopy Slime\ngone Slime\npushed\ngone Slime", "spawn Slime\npushed\ngone Slime", "spawn Slime\ncopy Slime\npushed\ngone Slime\ngone Slime", "spawn Slime\ngone Slime\npushed"], "answer": 0, "explain": "1. `Mob(7, \"Slime\")` builds a temporary: `spawn Slime`.\n2. `push` stores its own copy. Mob declares a copy constructor and a destructor, so it gets no move constructor, and the copy constructor runs: `copy Slime`.\n3. At the `;` the temporary dies: `gone Slime`.\n4. `pushed`.\n5. At the end of main, `hunt` is destroyed and takes the stored Mob with it: `gone Slime`." },
  { "q": "The constructor throws on a zero denominator, and the `try` wraps the whole loop. What does this print?", "code": "#include <iostream>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n};\n\nint main() {\n    stack<Fraction> s;\n    int rows[3][2] = {{1, 2}, {3, 0}, {5, 6}};\n    try {\n        for (auto& r : rows) {\n            s.push(Fraction(r[0], r[1]));\n            cout << \"pushed \" << r[0] << \"/\" << r[1] << endl;\n        }\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    cout << s.size() << \" on the stack\" << endl;\n    return 0;\n}", "options": ["pushed 1/2\ncaught: Denominator cannot be zero\n1 on the stack", "pushed 1/2\ncaught: Denominator cannot be zero\npushed 5/6\n2 on the stack", "pushed 1/2\npushed 3/0\npushed 5/6\n3 on the stack", "caught: Denominator cannot be zero\n0 on the stack"], "answer": 0, "explain": "1. Row 1 2: the Fraction is built and pushed: `pushed 1/2`.\n2. Row 3 0: `Fraction(3, 0)` throws before `push` runs, so nothing is added and `pushed 3/0` is skipped.\n3. The throw leaves the `for` loop and the `try` block, so row 5 6 is never read: `caught: Denominator cannot be zero`.\n4. The stack holds one Fraction: `1 on the stack`.\n5. To skip only the bad row, put the `try` inside the loop, around the `push`." },
  { "type": "free", "q": "Q26 asks you to open Fractions.txt. Write the opening lines with the check, and say what the rest of the program would do if the file were missing and there were no check.", "model": "`ifstream in(\"Fractions.txt\"); if (!in.is_open()) { cerr << \"Could not open Fractions.txt\" << endl; return 1; }` (or `if (!in)`). Without the check, the first `in >> num` fails at once, the `while` loop never runs, and the program carries on with an empty stack and prints nothing, so a missing file looks the same as an empty one.", "points": ["`ifstream in(\"Fractions.txt\");` with `#include <fstream>`", "the check `if (!in.is_open())` or `if (!in)`", "an error message (to `cerr`) and leaving `main` (`return 1;` or `exit(1)`)", "without it the first read fails, the loop never runs, and the stack stays empty with no error shown"], "rows": 5, "explain": "1. The Week 2 slide opens with a constructor that names the file and checks `is_open()`.\n2. A stream that failed to open is in a failed state, so every `>>` fails.\n3. That ends the loop at once: no crash, just an empty stack, which is why the check is a marked point." },
  { "type": "text", "q": "The `getline` form puts each line into an `istringstream`. Which header declares `istringstream`? Write it as you would after `#include`.", "answer": ["<sstream>", "sstream"], "explain": "1. `istringstream` lives in `<sstream>`, the string-stream header.\n2. `getline` for strings is in `<string>`; `ifstream` is in `<fstream>`.\n3. On paper the getline form of Q26 needs all three headers, plus `<stack>`." },
  { "q": "Fractions.txt holds two rows, `2 3` and `4 5`, with no newline after the last 5. How many Fractions does `while (in >> num >> den) fractions.push(Fraction(num, den));` push?", "options": ["2", "1: the last read reaches the end of file and is dropped", "3: the end of file counts as one more row", "0: the loop needs a newline after every row"], "answer": 0, "explain": "1. The reads of 2 and 3 succeed: push 2/3.\n2. Reading 5 hits the end of the file. That sets only eofbit, and the stream still tests true, so 4/5 is pushed.\n3. The next `in >> num` finds nothing and sets failbit; the condition is false and the loop stops.\n4. Two pushes." }
]
```

## Remember

- A stack gives back the last row pushed first.
- `while (in >> num >> den)` stops by itself: the read is the test, and it fails at the end of the file.
- `push` stores a copy made by your Q22 copy constructor, and the temporary dies at the `;`.
- *On the sheet:* Sheet side 2, band 3 "Write the function / class / program", Fraction. Sheet side 2, band 4 "True/false and multiple choice traps", STL and Week 1.

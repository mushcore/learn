---
title: "Review 4: write Fraction from a blank page (Q21 to Q26: 24 marks of code)"
minutes: 60
---
:::quiz What the paper asks and what earns the marks
Part B's long coding question builds one class, Fraction, in six parts: Q21 (3) a constructor that throws on a zero denominator, Q22 (3) the copy constructor, Q23 (2) the destructor, Q24 (3) the insertion operator, Q25 (3) the extraction operator, Q26 (10) a program that reads `Fractions.txt` into a `std::stack<Fraction>`. 24 marks of handwritten code. The Midterm Info slide says long questions are "guided: broken down into multiple parts, ask you to write individual functions", so each part is marked on its own: a broken Q21 does not cost the Q26 marks. The marker looks for the signature, the one or two lines that do the work, and the `return` that makes the operator chain.
:::

**Understand before the exam (cannot be looked up):**

- How a constructor runs: the initializer list fills the members, then the body runs; a `throw` in the body means no object exists.
- Why `cout << a << b` needs `operator<<` to return the stream it was given, and why that operator cannot be a member of Fraction.
- Why `while (in >> num >> den)` stops by itself: each `>>` returns the stream, and the stream tests false once a read fails.
- Where Q26 copies: `push` stores a copy, made by your Q22 copy constructor; a stack hands back the last row first.
- Writing all six parts from a blank page, in the paper's order, in about 25 minutes.

**On the sheet (look up, do not memorise):**

- The six answers, the file-to-stack `main`, `operator+`, `operator==`, `operator<` and the `getline` + `istringstream` form: *Sheet side 2, "E. Fraction, complete"*.
- `invalid_argument` and the `<stdexcept>` family, catch by reference: *Sheet side 2, "G. Exceptions"*.
- `stack`, `vector`, `sort` with `operator<`: *Sheet side 2, "H. STL"*.
- `ifstream`, the open check and file modes: *Sheet side 2, "J. Week 1 syntax"*.

Do if time is short: "The class, from zero", "Q21 to Q26, worked", the six challenges and the marking table. The rest are marked "if time".

## The class, from zero

A Fraction object is two `int` boxes with one rule: the bottom box is never 0. The class keeps both boxes `private`, so only its own functions (and its friends) can touch them, and every way in goes through a public function that keeps the rule.

```diagram
{ "type": "grid", "title": "Two Fraction objects after the first two lines of main", "nodes": [
  { "id": "h0", "label": "object", "row": 0, "col": 0 },
  { "id": "h1", "label": "numerator", "row": 0, "col": 1 },
  { "id": "h2", "label": "denominator", "row": 0, "col": 2 },
  { "id": "h3", "label": "built by", "row": 0, "col": 3 },
  { "id": "a0", "label": "half", "row": 1, "col": 0 },
  { "id": "a1", "label": "1", "row": 1, "col": 1 },
  { "id": "a2", "label": "2", "row": 1, "col": 2 },
  { "id": "a3", "label": "Fraction(1, 2)", "row": 1, "col": 3 },
  { "id": "b0", "label": "typed", "row": 2, "col": 0 },
  { "id": "b1", "label": "0, then 3", "row": 2, "col": 1 },
  { "id": "b2", "label": "1, then 4", "row": 2, "col": 2 },
  { "id": "b3", "label": "Fraction(0, 1), then cin >> typed", "row": 2, "col": 3 }
], "hi": ["b1", "b2"], "caption": "The constructor fills both boxes once and checks the denominator. operator>> later overwrites the same two boxes directly: no constructor runs, so no check runs." }
```

**The tiny case.** `Fraction half(1, 2);` calls the two-int constructor. Its head `: numerator(numerator), denominator(denominator)` is the initializer list: each member is built from the parameter of the same name before the body's first line. Inside the list, the name outside the parentheses is always the member, so the shadowing is safe. Then the body checks `denominator == 0`.

**Throwing.** The Week 5 slides say C++ lets us throw anything, but "it is best, however, to define exception types or use exceptions from the standard library". `<stdexcept>` gives `invalid_argument`, a `logic_error`; its `what()` returns the message you passed. A constructor that throws creates no object, so no destructor runs for it.

**Friends.** The Week 4 slide: "A friend declaration grants a function (or another class) access to private and protected members; the declaration appears in the class body; the definition appears outside the class body." The stream operators need that access to read and write the two private boxes.

**Why not a member.** An operator is either a member of the left operand's type or a friendly non-member. In `cout << half` the left operand is `cout`, an `ostream`, a class you cannot edit. So `operator<<` is a non-member, declared `friend` inside Fraction.

**Why return the stream.** `cout << half << " and " << typed` groups from the left:

```diagram
{ "type": "flow", "title": "One chained output statement, call by call", "nodes": [
  { "id": "c1", "label": "operator<<(cout, half)", "sub": "writes 1/2, returns cout" },
  { "id": "c2", "label": "cout << \" and \"", "sub": "returns cout" },
  { "id": "c3", "label": "operator<<(cout, typed)", "sub": "writes 3/4, returns cout" },
  { "id": "c4", "label": "cout << endl", "sub": "newline" }
], "edges": [ { "from": "c1", "to": "c2" }, { "from": "c2", "to": "c3" }, { "from": "c3", "to": "c4" } ], "hi": ["c1", "c3"], "caption": "Each call's result is the left operand of the next. A void operator<< leaves << \" and \" with nothing on its left, and the line does not compile." }
```

The canonical forms on the Week 4 slides: `friend std::ostream& operator<<(std::ostream& os, const T& obj) { os << obj.myString; return os; }` and `friend std::istream& operator>>(std::istream& is, T& obj) { is >> obj.myVar; return is; }`. Output takes `const T&` (printing changes nothing); input takes a plain `T&` (it writes into the object).

```cpp run pin FractionPieces.cpp
// stdin: 3 4
// predict: The stdin box holds 3 4. Write every line printed.
#include <iostream>
#include <stdexcept>
using namespace std;

class Fraction {
private:
    int numerator;
    int denominator;
public:
    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {
        if (denominator == 0) {
            throw invalid_argument("Denominator cannot be zero");
        }
        cout << "made " << numerator << "/" << denominator << endl;
    }
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

int main() {
    Fraction half(1, 2);
    Fraction typed(0, 1);
    cin >> typed;
    cout << half << " and " << typed << endl;
    try {
        Fraction bad(5, 0);
        cout << "never printed" << endl;
    } catch (const invalid_argument& e) {
        cout << "caught: " << e.what() << endl;
    }
    return 0;
}
```

1. `Fraction half(1, 2);` runs the initializer list (1 and 2), the check passes, the body prints `made 1/2`.
2. `Fraction typed(0, 1);` prints `made 0/1`. A denominator of 1 passes; only 0 throws.
3. `cin >> typed;` is the call `operator>>(cin, typed)`: it reads 3 and 4 straight into typed's boxes and prints nothing. Then `cout << half << " and " << typed << endl;` prints `1/2 and 3/4`.
4. `Fraction bad(5, 0);` throws from the body before the print, so `never printed` is skipped, bad never exists, and the handler prints `caught: Denominator cannot be zero`.

```widget
op-dispatch
{ "expr": "cout << a" }
```

```quiz
[
  { "q": "The stdin box is changed to `3 0` and the program runs again. What does the third line show?", "options": ["`1/2 and 3/0`", "`caught: Denominator cannot be zero`", "`1/2 and 0/1`", "nothing: the program stops at `cin >> typed;`"], "answer": 0, "explain": "1. `cin >> typed;` calls `operator>>`, which writes 3 and 0 straight into the private members.\n2. No constructor runs, so the `denominator == 0` check never runs either.\n3. The output line prints `1/2 and 3/0`.\n4. The fourth line is still `caught: ...`, from `Fraction bad(5, 0)`. To guard input as well, `operator>>` would have to check (or build a Fraction with the constructor) itself." },
  { "q": "Why is `operator<<` for Fraction written as a friendly non-member and not as a member function of Fraction?", "options": ["the left operand of `cout << half` is an `ostream`, and a member operator belongs to its left operand's class", "a member function cannot return a reference to a stream", "friend functions run faster because they skip the `this` pointer", "member functions cannot read private data members"], "answer": 0, "explain": "1. `cout << half` is the call `operator<<(cout, half)`.\n2. A member operator is a member of the left operand's type, here `ostream`, which you cannot edit.\n3. So it is a non-member; it needs `friend` only because it reads the private `numerator` and `denominator`." },
  { "q": "Q24 is written with `void operator<<(ostream& os, const Fraction& fraction)` and the same body without `return os;`. Which statement still compiles?", "options": ["`cout << half;`", "`cout << half << endl;`", "`cout << \"x\" << half << endl;`", "none of them"], "answer": 0, "explain": "1. `cout << half;` is one call; its result is thrown away, so `void` is fine.\n2. `cout << half << endl;` needs the result of `cout << half` as the left operand of `<< endl`; a `void` result has none, so it does not compile.\n3. The third line has the same problem after `half`.\n4. Returning `ostream&` is what earns the chaining mark." }
]
```

## Reading rows: `while (in >> num >> den)` and `getline` + `istringstream`

On paper Q26 opens the file the Week 2 way (`<fstream>`): `ifstream` reads, `ofstream` writes, `fstream` does both, and the slide checks the open with `if (!f.is_open()) { cerr << "Unable to open file" << endl; exit(1); }`. In Q26, inside `main`, `return 1;` does the same job:

```cpp
ifstream in("Fractions.txt");
if (!in.is_open()) {
    cerr << "Could not open Fractions.txt" << endl;
    return 1;
}
```

After that, `in` reads like `cin`, with either of two loops.

**The `>>` loop.** `in >> num >> den` is `(in >> num) >> den`; each `>>` returns the stream. In a condition, a stream is true while no read has failed. A failed read (end of file, or text where an `int` should be) sets failbit, the condition is false, and the loop ends. Whitespace and newlines between the numbers do not matter. Reading the last number of a file with no final newline still succeeds: it sets only eofbit, and the stream tests true until a read actually fails.

**The `getline` loop.** The Week 2 slide: `getline(cin, input)` "reads a line into the string, tosses the newline, returns the stream", with the idiom `while (getline (cin, line)) { /* process */ }`. Each line then goes into an `istringstream` (from `<sstream>`), a stream that reads from a string, and `>>` works on it as on `cin`.

The program below has no file, so two `istringstream` objects built from the same text play the file twice, one for each loop. The middle row is broken on purpose.

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

1. Loop 1, first pass: `while (in >> num >> den)` reads 1 and 2: `loop 1 read 1/2`.
2. Second pass: `>> num` reads 3, `>> den` meets `x` and fails, the condition is false, and the loop ends with 5 and 6 never read: `loop 1 stopped`.
3. Loop 2: `while (getline(file, line))` hands over `1 2`; `istringstream iss(line);` makes a fresh stream for that line: `loop 2 read 1/2`.
4. `3 x` fails inside its own `iss`, and the `else` branch prints `loop 2 skipped 3 x`. The outer `getline` is not affected.
5. `5 6` gives `loop 2 read 5/6`; the next `getline` finds the end and the loop stops.

Q26 says "You may assume that there are no zeros in the file", and each row is two integers, so both loops earn the marks. The `>>` loop is shorter to write; the `getline` form is the one to use when a bad row must be skipped, not end the reading.

## Q21 to Q26, worked

The model answer below is the whole Part B question in one file, in the paper's order. In the app the rows come from the stdin box: `istream& in = cin;` stands in for the `ifstream` lines above, and everything after the open check is identical.

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

1. `while (in >> num >> den)` runs three times; each `fractions.push(Fraction(num, den));` stores 1/2, then 3/4, then 5/6. The fourth read fails at the end of input. `cout << fractions.top() << endl;` prints the last row pushed: `5/6`.
2. `fractions.pop();` removes it; the next `top()` prints `3/4`.
3. Then `1/2`; `while (!fractions.empty())` is now false.
4. `Fraction bad(1, 0);` throws, and `catch (invalid_argument& e)` prints `caught: Denominator cannot be zero`.

On paper `main` is the `ifstream` block, then the loop, then `in.close();` (optional: the stream closes itself at the end of `main`), then the `top()`/`pop()` loop. Q25 is declared and defined but not called here: the loop reads two `int`s and lets the Q21 constructor check them. Using it instead, `Fraction f(0, 1); while (in >> f) fractions.push(f);` also works.

## Write each part from a blank page

Each challenge gives the paper's signature (or, for Q21, its description) and a `main` that tests the part. Write the part on paper first, then type it. Q22 and Q23 print a line only so the check can see them run; the paper answers have empty bodies.

### Q21 (3 marks): the constructor that throws

```challenge
{"prompt": "Q21. Write the constructor <code>Fraction(int numerator, int denominator)</code>: an initializer list that stores both members, then <code>throw invalid_argument(\"Denominator cannot be zero\")</code> when the denominator is 0. main is written: 2/3 must build, 1/0 must be caught.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    // Q21: write the constructor Fraction(int numerator, int denominator)\n};\n\nint main() {\n    Fraction ok(2, 3);\n    cout << \"2/3 built\" << endl;\n    try {\n        Fraction bad(1, 0);\n        cout << \"1/0 built\" << endl;\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}\n", "expected": "2/3 built\ncaught: Denominator cannot be zero", "hints": ["The head: <code>Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator)</code>.", "The body: <code>if (denominator == 0) { throw invalid_argument(\"Denominator cannot be zero\"); }</code>.", "<code>invalid_argument</code> comes from <code>#include &lt;stdexcept&gt;</code>, already in the starter."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n};\n\nint main() {\n    Fraction ok(2, 3);\n    cout << \"2/3 built\" << endl;\n    try {\n        Fraction bad(1, 0);\n        cout << \"1/0 built\" << endl;\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}\n"}
```

### Q22 (3 marks): the copy constructor

```challenge
{"prompt": "Q22. Write the copy constructor. For this check only, its body prints <code>copy constructor</code> (on paper the body is empty). main copies three times: <code>Fraction b(a);</code>, <code>Fraction c = a;</code> and the by-value call <code>showByValue(c)</code>.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    // Q22: copy constructor (for this check only, print \"copy constructor\" in its body)\n\n    void show() const { cout << numerator << \"/\" << denominator << endl; }\n};\n\nvoid showByValue(Fraction f) {\n    f.show();\n}\n\nint main() {\n    Fraction a(2, 5);\n    Fraction b(a);\n    Fraction c = a;\n    showByValue(c);\n    b.show();\n    return 0;\n}\n", "expected": "copy constructor\ncopy constructor\ncopy constructor\n2/5\n2/5", "hints": ["The signature: <code>Fraction(const Fraction&amp; other)</code>.", "Copy both members in the initializer list: <code>: numerator(other.numerator), denominator(other.denominator)</code>.", "Body: <code>{ cout &lt;&lt; \"copy constructor\" &lt;&lt; endl; }</code>."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {\n        cout << \"copy constructor\" << endl;\n    }\n    void show() const { cout << numerator << \"/\" << denominator << endl; }\n};\n\nvoid showByValue(Fraction f) {\n    f.show();\n}\n\nint main() {\n    Fraction a(2, 5);\n    Fraction b(a);\n    Fraction c = a;\n    showByValue(c);\n    b.show();\n    return 0;\n}\n"}
```

`const` lets a `const Fraction` be copied; `&` matters more. A by-value parameter would itself be a copy, needing the copy constructor to build it, forever; g++ rejects `Fraction(Fraction other)` outright. The three copies here are the three moments that run it: `Fraction b(a);`, `Fraction c = a;`, and passing by value.

### Q23 (2 marks): the destructor

```challenge
{"prompt": "Q23. Write the destructor. For this check only, its body prints <code>~Fraction</code>, a space, then <code>numerator/denominator</code> (on paper <code>~Fraction() {}</code> is the whole answer).", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    // Q23: destructor (for this check only, print \"~Fraction n/d\" in its body)\n};\n\nint main() {\n    Fraction a(1, 4);\n    {\n        Fraction b(3, 4);\n        cout << \"inner block ends\" << endl;\n    }\n    cout << \"main ends\" << endl;\n    return 0;\n}\n", "expected": "inner block ends\n~Fraction 3/4\nmain ends\n~Fraction 1/4", "hints": ["The signature: <code>~Fraction()</code>, no parameters, no return type.", "Body: <code>{ cout &lt;&lt; \"~Fraction \" &lt;&lt; numerator &lt;&lt; \"/\" &lt;&lt; denominator &lt;&lt; endl; }</code>.", "b dies at the inner closing brace; a dies at the end of main."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {\n        cout << \"~Fraction \" << numerator << \"/\" << denominator << endl;\n    }\n};\n\nint main() {\n    Fraction a(1, 4);\n    {\n        Fraction b(3, 4);\n        cout << \"inner block ends\" << endl;\n    }\n    cout << \"main ends\" << endl;\n    return 0;\n}\n"}
```

Fraction owns no `new` memory, so `~Fraction() {}` or `~Fraction() = default;` is the full answer. Locals die at their closing brace, in reverse order of construction.

### Q24 (3 marks): the insertion operator

```challenge
{"prompt": "Q24. Write the insertion operator as a friend: the <code>friend</code> declaration inside the class, the definition outside with the paper's first line. Write <code>numerator/denominator</code> to <code>os</code> and return <code>os</code>.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    // Q24: the friend declaration goes here\n};\n\n// Q24: the paper prints this first line\n// ostream& operator<<(ostream& os, const Fraction& fraction) {\n\nint main() {\n    Fraction a(1, 2);\n    Fraction b(7, 8);\n    cout << a << \" < \" << b << endl;\n    return 0;\n}\n", "expected": "1/2 < 7/8", "hints": ["Inside the class: <code>friend ostream&amp; operator&lt;&lt;(ostream&amp; os, const Fraction&amp; fraction);</code>", "Body: <code>os &lt;&lt; fraction.numerator &lt;&lt; \"/\" &lt;&lt; fraction.denominator;</code>", "Last line: <code>return os;</code> (without it, <code>&lt;&lt; \" &lt; \"</code> has no left operand)."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    Fraction a(1, 2);\n    Fraction b(7, 8);\n    cout << a << \" < \" << b << endl;\n    return 0;\n}\n"}
```

### Q25 (3 marks): the extraction operator

```challenge
{"prompt": "Q25. Write the extraction operator as a friend with the paper's first line: read the two ints from <code>is</code> into <code>fraction</code>'s members and return <code>is</code>. The stdin box holds two rows.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    // Q25: the friend declaration goes here\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\n// Q25: the paper prints this first line\n// istream& operator>>(istream& is, Fraction& fraction) {\n\nint main() {\n    Fraction f(0, 1);\n    Fraction g(0, 1);\n    cin >> f >> g;\n    cout << f << \" \" << g << endl;\n    return 0;\n}\n", "stdin": "2 3\n9 10", "expected": "2/3 9/10", "hints": ["Inside the class: <code>friend istream&amp; operator&gt;&gt;(istream&amp; is, Fraction&amp; fraction);</code>", "Body: <code>is &gt;&gt; fraction.numerator &gt;&gt; fraction.denominator;</code>", "Last line: <code>return is;</code>, so <code>cin &gt;&gt; f &gt;&gt; g</code> chains."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    friend istream& operator>>(istream& is, Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nistream& operator>>(istream& is, Fraction& fraction) {\n    is >> fraction.numerator >> fraction.denominator;\n    return is;\n}\n\nint main() {\n    Fraction f(0, 1);\n    Fraction g(0, 1);\n    cin >> f >> g;\n    cout << f << \" \" << g << endl;\n    return 0;\n}\n"}
```

### Q26 (10 marks): Fractions.txt into a stack

```challenge
{"prompt": "Q26. Write main: a <code>stack&lt;Fraction&gt;</code>, a <code>while (cin &gt;&gt; num &gt;&gt; den)</code> loop that pushes <code>Fraction(num, den)</code>, then print <code>3 fractions</code> (the stack's <code>size()</code>) and every Fraction by <code>top()</code> and <code>pop()</code>. The stdin box holds the three rows of Fractions.txt.", "starter": "#include <iostream>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\n// Questions 21 to 24, available to you\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    // Q26: on paper, ifstream in(\"Fractions.txt\") and the open check come first.\n    // Here the rows arrive on cin. Push one Fraction per row onto a stack<Fraction>,\n    // print \"N fractions\", then print the stack with top() and pop().\n    return 0;\n}\n", "stdin": "1 2\n3 4\n5 6", "expected": "3 fractions\n5/6\n3/4\n1/2", "hints": ["<code>stack&lt;Fraction&gt; fractions; int num, den;</code>", "<code>while (cin &gt;&gt; num &gt;&gt; den) { fractions.push(Fraction(num, den)); }</code>", "<code>cout &lt;&lt; fractions.size() &lt;&lt; \" fractions\" &lt;&lt; endl;</code> then <code>while (!fractions.empty()) { cout &lt;&lt; fractions.top() &lt;&lt; endl; fractions.pop(); }</code>"], "solution": "#include <iostream>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\n// Questions 21 to 24, available to you\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    stack<Fraction> fractions;\n    int num, den;\n    while (cin >> num >> den) {\n        fractions.push(Fraction(num, den));\n    }\n    cout << fractions.size() << \" fractions\" << endl;\n    while (!fractions.empty()) {\n        cout << fractions.top() << endl;\n        fractions.pop();\n    }\n    return 0;\n}\n"}
```

### Marking notes

| Part | Marks | What earns them |
|---|---|---|
| Q21 | 3 | A `throw` inside the constructor, guarded by `if (denominator == 0)`; both members stored. Any thrown type is accepted; `invalid_argument` with `#include <stdexcept>` is the Week 5 answer. |
| Q22 | 3 | The parameter is `const Fraction&`; both members copied (initializer list or body). |
| Q23 | 2 | `~Fraction() {}` or `= default`: there is nothing to `delete`. |
| Q24 | 3 | Declared `friend`; writes to `os`, not `cout`; takes `const Fraction&`; **returns `os`**. |
| Q25 | 3 | Declared `friend`; reads into the non-const `Fraction&`; **returns `is`**. |
| Q26 | 10 | `#include <fstream>` and `<stack>`; `ifstream in("Fractions.txt")`; the open check; `while (in >> num >> den)` (or `getline` + `istringstream`); `push(Fraction(num, den))`; the result shown with `top()` and `pop()`. |

## Variants the long question may swap in (if time)

The paper may swap in another operator, container or getter: a few lines on top of the same class.

### `operator+`

The Week 4 rule: `+` "doesn't change the left argument", so it is a friendly non-member, and `a + b` is a new value, so it returns a Fraction by value. To add $\frac{a}{b} + \frac{c}{d}$, use the common denominator $bd$: the result is $\frac{ad + cb}{bd}$.

```challenge
{"prompt": "Write <code>operator+</code> as a friendly non-member that returns a new Fraction: numerator <code>a.numerator * b.denominator + b.numerator * a.denominator</code>, denominator <code>a.denominator * b.denominator</code>. Do not reduce.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    // friend declaration of operator+ here\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\n// Fraction operator+(const Fraction& a, const Fraction& b) {\n\nint main() {\n    Fraction half(1, 2);\n    Fraction third(1, 3);\n    Fraction sixth(1, 6);\n    cout << half + third << endl;\n    cout << half + third + sixth << endl;\n    cout << half << endl;\n    return 0;\n}\n", "expected": "5/6\n36/36\n1/2", "hints": ["Inside the class: <code>friend Fraction operator+(const Fraction&amp; a, const Fraction&amp; b);</code>", "Body: <code>return Fraction(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);</code>", "<code>half + third + sixth</code> is <code>(half + third) + sixth</code> = 5/6 + 1/6 = (30 + 6)/36."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    friend Fraction operator+(const Fraction& a, const Fraction& b);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nFraction operator+(const Fraction& a, const Fraction& b) {\n    return Fraction(a.numerator * b.denominator + b.numerator * a.denominator,\n                    a.denominator * b.denominator);\n}\n\nint main() {\n    Fraction half(1, 2);\n    Fraction third(1, 3);\n    Fraction sixth(1, 6);\n    cout << half + third << endl;\n    cout << half + third + sixth << endl;\n    cout << half << endl;\n    return 0;\n}\n"}
```

The slides also define `operator+` through `+=` (`lhs += rhs; return lhs;` with `lhs` taken by copy). Either form earns the marks if it returns a new Fraction and leaves both operands unchanged: `half` still prints `1/2`.

### `operator==` and `operator!=`

1/2 and 2/4 are equal although no member matches, so compare by cross-multiplying: $\frac{a}{b} = \frac{c}{d}$ exactly when $ad = cb$ (denominators non-zero). The slides then write `!=` from `==`: `return !operator==(lhs,rhs); //or !(lhs == rhs)`.

```challenge
{"prompt": "Write <code>operator==</code> by cross-multiplying (1/2 equals 2/4 because 1 × 4 == 2 × 2), and <code>operator!=</code> in terms of it, the slides' way.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    // friend declarations of operator== and operator!= here\n};\n\n// bool operator==(const Fraction& a, const Fraction& b) {\n\n// bool operator!=(const Fraction& a, const Fraction& b) {\n\nint main() {\n    cout << boolalpha;\n    cout << (Fraction(1, 2) == Fraction(2, 4)) << endl;\n    cout << (Fraction(1, 2) == Fraction(2, 3)) << endl;\n    cout << (Fraction(1, 2) != Fraction(2, 3)) << endl;\n    return 0;\n}\n", "expected": "true\nfalse\ntrue", "hints": ["Inside the class: <code>friend bool operator==(const Fraction&amp; a, const Fraction&amp; b);</code> and the same for <code>!=</code>.", "<code>return a.numerator * b.denominator == b.numerator * a.denominator;</code>", "<code>return !(a == b);</code>"], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend bool operator==(const Fraction& a, const Fraction& b);\n    friend bool operator!=(const Fraction& a, const Fraction& b);\n};\n\nbool operator==(const Fraction& a, const Fraction& b) {\n    return a.numerator * b.denominator == b.numerator * a.denominator;\n}\n\nbool operator!=(const Fraction& a, const Fraction& b) {\n    return !(a == b);\n}\n\nint main() {\n    cout << boolalpha;\n    cout << (Fraction(1, 2) == Fraction(2, 4)) << endl;\n    cout << (Fraction(1, 2) == Fraction(2, 3)) << endl;\n    cout << (Fraction(1, 2) != Fraction(2, 3)) << endl;\n    return 0;\n}\n"}
```

### `operator<` and a `vector<Fraction>` with `sort`

The Week 4 slide: "the standard library's algorithms and types always expect `operator<`". `sort(v.begin(), v.end())` calls it to order the elements. Cross-multiply again: with positive denominators, $\frac{a}{b} < \frac{c}{d}$ exactly when $ad < cb$.

```challenge
{"prompt": "Write <code>operator&lt;</code> (cross-multiply, denominators positive), then main: read every row from <code>cin</code> into a <code>vector&lt;Fraction&gt;</code>, <code>sort</code> it, and print one Fraction per line with a ranged for.", "starter": "#include <algorithm>\n#include <iostream>\n#include <stdexcept>\n#include <vector>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    // friend declaration of operator< here\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\n// bool operator<(const Fraction& a, const Fraction& b) {\n\nint main() {\n    // read every row from cin into a vector<Fraction>,\n    // sort it, then print one Fraction per line\n    return 0;\n}\n", "stdin": "3 4\n1 3\n1 2\n2 3", "expected": "1/3\n1/2\n2/3\n3/4", "hints": ["<code>return a.numerator * b.denominator &lt; b.numerator * a.denominator;</code>", "<code>while (cin &gt;&gt; num &gt;&gt; den) { fractions.push_back(Fraction(num, den)); }</code>", "<code>sort(fractions.begin(), fractions.end());</code> then <code>for (const Fraction&amp; f : fractions) { cout &lt;&lt; f &lt;&lt; endl; }</code>"], "solution": "#include <algorithm>\n#include <iostream>\n#include <stdexcept>\n#include <vector>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    friend bool operator<(const Fraction& a, const Fraction& b);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nbool operator<(const Fraction& a, const Fraction& b) {\n    return a.numerator * b.denominator < b.numerator * a.denominator;\n}\n\nint main() {\n    vector<Fraction> fractions;\n    int num, den;\n    while (cin >> num >> den) {\n        fractions.push_back(Fraction(num, den));\n    }\n    sort(fractions.begin(), fractions.end());\n    for (const Fraction& f : fractions) {\n        cout << f << endl;\n    }\n    return 0;\n}\n"}
```

After `sort` the smallest is first; a stack would only give back its top.

### A const getter

A getter promises not to change the object: `const` after the parameter list. Only const member functions can be called on a `const Fraction` or through a `const Fraction&`.

```challenge
{"prompt": "Write the getters <code>getNumerator()</code> and <code>getDenominator()</code>. main calls them on a <code>const Fraction</code> and through a <code>const Fraction&amp;</code>, so they must be const member functions.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    // getNumerator() and getDenominator() here\n};\n\ndouble toDouble(const Fraction& f) {\n    return static_cast<double>(f.getNumerator()) / f.getDenominator();\n}\n\nint main() {\n    const Fraction half(1, 2);\n    cout << half.getNumerator() << endl;\n    cout << toDouble(Fraction(3, 4)) << endl;\n    return 0;\n}\n", "expected": "1\n0.75", "hints": ["<code>int getNumerator() const { return numerator; }</code>", "<code>int getDenominator() const { return denominator; }</code>", "Without the <code>const</code> after the parentheses, <code>half.getNumerator()</code> does not compile: half is const."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    int getNumerator() const { return numerator; }\n    int getDenominator() const { return denominator; }\n};\n\ndouble toDouble(const Fraction& f) {\n    return static_cast<double>(f.getNumerator()) / f.getDenominator();\n}\n\nint main() {\n    const Fraction half(1, 2);\n    cout << half.getNumerator() << endl;\n    cout << toDouble(Fraction(3, 4)) << endl;\n    return 0;\n}\n"}
```

### The same question on a new class: route steps from route.txt

A quester's starter route runs in legs: the island, Lith, the class's job leg, the 10-30 leg, the 2nd-job leg. A `Step` stores an order number and a leg name; `route.txt` lists the steps out of order, and the program must sort them. Every part of Q21 to Q26 comes back: a constructor that throws, a const getter, the two friends, a read loop, and a container.

```challenge
{"prompt": "The same long question on a new class. A <code>Step</code> of a starter route has an order number and a leg name. Write parts (a) to (f) as the comments in the starter say. The stdin box holds route.txt; one row has order 0.", "starter": "#include <algorithm>\n#include <iostream>\n#include <stdexcept>\n#include <string>\n#include <vector>\nusing namespace std;\n\nclass Step {\nprivate:\n    int order;\n    string leg;\npublic:\n    // (a) Step(int order, string leg): store both; throw\n    //     invalid_argument(\"order must be 1 or more\") when order < 1\n    // (b) int getOrder() const\n    // (c) friend declarations of operator<< and operator<\n};\n\n// (d) operator<< prints the order, a space, then the leg\n// (e) operator< compares by order\n\nint main() {\n    // (f) on paper: ifstream in(\"route.txt\"); here the rows arrive on cin.\n    // Push one Step per row into a vector<Step>; catch a bad row by reference,\n    // print \"skipped: \" and what(), and keep reading. Sort, print each Step,\n    // then print \"last step \" and the last Step's order.\n    return 0;\n}\n", "stdin": "3 job\n1 island\n0 test\n2 Lith\n5 2nd-job\n4 10-30", "expected": "skipped: order must be 1 or more\n1 island\n2 Lith\n3 job\n4 10-30\n5 2nd-job\nlast step 5", "hints": ["(a) <code>Step(int order, string leg) : order(order), leg(leg) { if (order &lt; 1) { throw invalid_argument(\"order must be 1 or more\"); } }</code>", "(f) Put the <code>try</code> inside the <code>while (cin &gt;&gt; order &gt;&gt; leg)</code> loop, around <code>route.push_back(Step(order, leg));</code>, so one bad row does not end the reading.", "<code>sort(route.begin(), route.end());</code> uses your <code>operator&lt;</code>. After the sort, <code>route.back()</code> is the Step with the largest order: print its <code>getOrder()</code>."], "solution": "#include <algorithm>\n#include <iostream>\n#include <stdexcept>\n#include <string>\n#include <vector>\nusing namespace std;\n\nclass Step {\nprivate:\n    int order;\n    string leg;\npublic:\n    Step(int order, string leg) : order(order), leg(leg) {\n        if (order < 1) {\n            throw invalid_argument(\"order must be 1 or more\");\n        }\n    }\n    int getOrder() const { return order; }\n    friend ostream& operator<<(ostream& os, const Step& step);\n    friend bool operator<(const Step& a, const Step& b);\n};\n\nostream& operator<<(ostream& os, const Step& step) {\n    os << step.order << \" \" << step.leg;\n    return os;\n}\n\nbool operator<(const Step& a, const Step& b) {\n    return a.order < b.order;\n}\n\nint main() {\n    vector<Step> route;\n    int order;\n    string leg;\n    while (cin >> order >> leg) {\n        try {\n            route.push_back(Step(order, leg));\n        } catch (const invalid_argument& e) {\n            cout << \"skipped: \" << e.what() << endl;\n        }\n    }\n    sort(route.begin(), route.end());\n    for (const Step& s : route) {\n        cout << s << endl;\n    }\n    cout << \"last step \" << route.back().getOrder() << endl;\n    return 0;\n}\n"}
```

## New variants

```quiz
[
  { "q": "A `Mob` prints in its constructor, copy constructor and destructor. What does this program print?", "code": "#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nclass Mob {\n    int id;\n    string name;\npublic:\n    Mob(int id, string name) : id(id), name(name) { cout << \"spawn \" << name << endl; }\n    Mob(const Mob& other) : id(other.id), name(other.name) { cout << \"copy \" << name << endl; }\n    ~Mob() { cout << \"gone \" << name << endl; }\n};\n\nint main() {\n    stack<Mob> hunt;\n    hunt.push(Mob(7, \"Slime\"));\n    cout << \"pushed\" << endl;\n    return 0;\n}", "options": ["spawn Slime\ncopy Slime\ngone Slime\npushed\ngone Slime", "spawn Slime\npushed\ngone Slime", "spawn Slime\ncopy Slime\npushed\ngone Slime\ngone Slime", "spawn Slime\ngone Slime\npushed"], "answer": 0, "explain": "1. `Mob(7, \"Slime\")` builds a temporary: `spawn Slime`.\n2. `push` stores its own copy. Mob declares a copy constructor and a destructor, so it gets no move constructor, and the copy constructor runs: `copy Slime`.\n3. At the `;` the temporary dies: `gone Slime`.\n4. `pushed`.\n5. At the end of main, `hunt` is destroyed and takes the stored Mob with it: `gone Slime`." },
  { "q": "The constructor throws on a zero denominator, and the `try` wraps the whole loop. What does this print?", "code": "#include <iostream>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n};\n\nint main() {\n    stack<Fraction> s;\n    int rows[3][2] = {{1, 2}, {3, 0}, {5, 6}};\n    try {\n        for (auto& r : rows) {\n            s.push(Fraction(r[0], r[1]));\n            cout << \"pushed \" << r[0] << \"/\" << r[1] << endl;\n        }\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    cout << s.size() << \" on the stack\" << endl;\n    return 0;\n}", "options": ["pushed 1/2\ncaught: Denominator cannot be zero\n1 on the stack", "pushed 1/2\ncaught: Denominator cannot be zero\npushed 5/6\n2 on the stack", "pushed 1/2\npushed 3/0\npushed 5/6\n3 on the stack", "caught: Denominator cannot be zero\n0 on the stack"], "answer": 0, "explain": "1. Row 1 2: the Fraction is built and pushed: `pushed 1/2`.\n2. Row 3 0: `Fraction(3, 0)` throws before `push` runs, so nothing is added and `pushed 3/0` is skipped.\n3. The throw leaves the `for` loop and the `try` block, so row 5 6 is never read: `caught: Denominator cannot be zero`.\n4. The stack holds one Fraction: `1 on the stack`.\n5. To skip only the bad row, put the `try` inside the loop, as in the route.txt challenge." },
  { "q": "`operator+` returns a new Fraction and never reduces it. What does this print?", "code": "#include <iostream>\nusing namespace std;\n\nclass Fraction {\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int n, int d) : numerator(n), denominator(d) {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    friend Fraction operator+(const Fraction& a, const Fraction& b);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nFraction operator+(const Fraction& a, const Fraction& b) {\n    return Fraction(a.numerator * b.denominator + b.numerator * a.denominator,\n                    a.denominator * b.denominator);\n}\n\nint main() {\n    Fraction quarter(1, 4);\n    cout << quarter + quarter << \" \" << quarter << endl;\n    return 0;\n}", "options": ["8/16 1/4", "2/4 1/4", "1/2 1/4", "8/16 8/16"], "answer": 0, "explain": "1. `quarter + quarter` is $(1 \\times 4 + 1 \\times 4) / (4 \\times 4) = 8/16$; nothing divides out the common factor.\n2. Both parameters are `const Fraction&`, and the result is a new object, so `quarter` still prints `1/4`." },
  { "q": "This Q25 compiles: `istream& operator>>(istream& is, const Fraction& fraction) { is >> fraction.numerator >> fraction.denominator; return is; }`", "type": "tf", "answer": false, "explain": "1. Through a `const Fraction&` the members are read-only.\n2. `is >> fraction.numerator` must write into an `int`, and there is no `>>` that writes into a `const int`, so g++ rejects it.\n3. The paper's signature has a plain `Fraction&` for exactly this reason; `const` belongs on the Q24 parameter." },
  { "type": "free", "q": "Q26 asks you to open Fractions.txt. Write the opening lines with the check, and say what the rest of the program would do if the file were missing and there were no check.", "model": "`ifstream in(\"Fractions.txt\"); if (!in.is_open()) { cerr << \"Could not open Fractions.txt\" << endl; return 1; }` (or `if (!in)`). Without the check, the first `in >> num` fails at once, the `while` loop never runs, and the program carries on with an empty stack and prints nothing, so a missing file looks the same as an empty one.", "points": ["`ifstream in(\"Fractions.txt\");` with `#include <fstream>`", "the check `if (!in.is_open())` or `if (!in)`", "an error message (to `cerr`) and leaving `main` (`return 1;` or `exit(1)`)", "without it the first read fails, the loop never runs, and the stack stays empty with no error shown"], "rows": 5, "explain": "1. The Week 2 slide opens with a constructor that names the file and checks `is_open()`.\n2. A stream that failed to open is in a failed state, so every `>>` fails.\n3. That ends the loop at once: no crash, just an empty stack, which is why the check is a marked point." },
  { "type": "text", "q": "The `getline` form puts each line into an `istringstream`. Which header declares `istringstream`? Write it as you would after `#include`.", "answer": ["<sstream>", "sstream"], "explain": "1. `istringstream` lives in `<sstream>`, the string-stream header.\n2. `getline` for strings is in `<string>`; `ifstream` is in `<fstream>`.\n3. On paper the getline form of Q26 needs all three headers, plus `<stack>`." },
  { "q": "Fractions.txt holds two rows, `2 3` and `4 5`, with no newline after the last 5. How many Fractions does `while (in >> num >> den) fractions.push(Fraction(num, den));` push?", "options": ["2", "1: the last read reaches the end of file and is dropped", "3: the end of file counts as one more row", "0: the loop needs a newline after every row"], "answer": 0, "explain": "1. The reads of 2 and 3 succeed: push 2/3.\n2. Reading 5 hits the end of the file. That sets only eofbit, and the stream still tests true, so 4/5 is pushed.\n3. The next `in >> num` finds nothing and sets failbit; the condition is false and the loop stops.\n4. Two pushes." }
]
```

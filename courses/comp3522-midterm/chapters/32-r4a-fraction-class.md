---
title: "Core 8: the Fraction class from zero: the constructor that throws, the copy constructor, the destructor (Q21 to Q23)"
minutes: 20
---
This lesson builds the first three parts of the Fraction class: the part that makes a fraction, the part that copies one, and the part that cleans one up. They are Q21, Q22 and Q23 of the paper's long coding question, worth 8 marks.

## What a class is, in plain words

A class is the design for a box. Each object made from it is one box with its own data inside.

The data sits behind a locked lid called `private`. Only the class's own functions can open that lid.

The class also has public doors: functions that any code may call. Every way in goes through a door, so the class can check what comes in.

A Fraction box holds two whole numbers, a top and a bottom. Its one rule is that the bottom is never 0.

```diagram
{ "type": "tree", "title": "One Fraction object", "nodes": [
  { "id": "o", "label": "a Fraction object" },
  { "id": "pr", "label": "private: the data", "parent": "o" },
  { "id": "pu", "label": "public: the doors", "parent": "o" },
  { "id": "n", "label": "numerator", "sub": "the top", "parent": "pr" },
  { "id": "d", "label": "denominator", "sub": "never 0", "parent": "pr" },
  { "id": "c1", "label": "constructor", "sub": "Q21", "parent": "pu" },
  { "id": "c2", "label": "copy constructor", "sub": "Q22", "parent": "pu" },
  { "id": "c3", "label": "destructor", "sub": "Q23", "parent": "pu" }
], "hi": ["d", "c1"], "caption": "Code outside the class reaches the two numbers only through the public doors, so the constructor can keep the rule that the bottom is never 0." }
```

## The three doors this lesson writes

A constructor is the door that runs when an object is born. It fills the two numbers and can refuse a bad bottom.

Its head can carry an initializer list. After a colon, each member is named with the value it starts with, and all of them are filled before the body's first line.

To refuse, the constructor throws an exception. An exception is a signal that something went wrong, and it jumps straight to the nearest matching `catch`.

A copy constructor is the door that builds a new object as a copy of one that already exists. A destructor is the door that runs when an object dies.

```diagram
{ "type": "flow", "title": "Fraction bad(5, 0); step by step", "nodes": [
  { "id": "s1", "label": "initializer list", "sub": "fills 5 and 0" },
  { "id": "s2", "label": "body checks", "sub": "is the bottom 0?" },
  { "id": "s3", "label": "throw", "sub": "invalid_argument" },
  { "id": "s4", "label": "catch runs", "sub": "bad never existed" }
], "edges": [ { "from": "s1", "to": "s2" }, { "from": "s2", "to": "s3", "label": "yes" }, { "from": "s3", "to": "s4" } ], "hi": ["s3"], "caption": "A constructor that throws never finishes, so no object exists and no destructor runs for it." }
```

## A tiny program you can run in your head

```cpp run pin ThrowingConstructor.cpp
// predict: Write every line printed.
#include <iostream>
#include <stdexcept>
using namespace std;

class Fraction {
    int numerator;
    int denominator;
public:
    Fraction(int n, int d) : numerator(n), denominator(d) {
        if (d == 0) {
            throw invalid_argument("Denominator cannot be zero");
        }
        cout << "made " << numerator << "/" << denominator << endl;
    }
};

int main() {
    Fraction half(1, 2);
    try {
        Fraction bad(5, 0);
        cout << "never printed" << endl;
    } catch (const invalid_argument& e) {
        cout << "caught: " << e.what() << endl;
    }
}
```

1. `Fraction half(1, 2);` runs the list `numerator(n), denominator(d)`. The check `if (d == 0)` is false, so the body prints `made 1/2`.
2. `Fraction bad(5, 0);` fills both members, then the check is true. The `throw` leaves the constructor before its print, skips the `never printed` line, and the handler prints `caught: Denominator cannot be zero`.

The second fraction was refused at birth, so the output is one success and one catch.

## The rules, in the slide's words

The Week 5 slides say C++ lets us throw anything, but "it is best, however, to define exception types or use exceptions from the standard library".

| Part | The rule |
|---|---|
| Throwing | `invalid_argument` comes from `#include <stdexcept>`. Its `what()` returns the message you passed to it. |
| A constructor that throws | No object is created, so no destructor runs for it. Objects already built in the block die in reverse order, then the `catch` runs. |
| Copy constructor | `Fraction(const Fraction& other)` runs for `Fraction b(a);`, for `Fraction c = a;` and for a by-value parameter. The assignment `c = b;` between two existing objects does not run it. |
| Destructor | `~Fraction() {}` or `= default` is the whole answer, because Fraction owns no memory from `new`. Locals die at their closing brace, in reverse order of birth. |

:::warn The copy constructor's `&`
A by-value parameter is itself a copy, so building it would need the copy constructor, forever. g++ rejects `Fraction(Fraction other)` outright.
:::

## The paper's question, worked

The paper asks for Q21, a constructor that throws on a zero denominator, then Q22, the copy constructor, then Q23, the destructor. The model answer below adds a print to Q22 and Q23 so you can see them run. On paper both bodies are empty.

```cpp run pin FractionQ21to23.cpp
// predict: Write all six lines printed.
#include <iostream>
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
    // Q22: copy constructor (the print is for this run only)
    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {
        cout << "copy " << numerator << "/" << denominator << endl;
    }
    // Q23: destructor (the print is for this run only)
    ~Fraction() {
        cout << "~Fraction " << numerator << "/" << denominator << endl;
    }
};

int main() {
    Fraction a(1, 2);
    {
        Fraction b(a);
        cout << "inner block ends" << endl;
    }
    try {
        Fraction bad(1, 0);
    } catch (invalid_argument& e) {
        cout << "caught: " << e.what() << endl;
    }
    cout << "main ends" << endl;
    return 0;
}
```

In `numerator(numerator)` the name outside the parentheses is always the member. The name inside is the parameter, so the same name twice is safe.

1. `Fraction a(1, 2);` passes the check and prints nothing. `Fraction b(a);` runs the copy constructor: `copy 1/2`.
2. `cout << "inner block ends" << endl;` prints `inner block ends`.
3. The inner closing brace ends b's life, and its destructor prints `~Fraction 1/2`.
4. `Fraction bad(1, 0);` throws, so no destructor runs for it. The handler prints `caught: Denominator cannot be zero`.
5. `cout << "main ends" << endl;` prints `main ends`.
6. The end of main ends a's life: `~Fraction 1/2`.

## Write Q21, Q22 and Q23

Q21 to Q23 are band 3's lines from `Fraction(int n, int d)` to `~Fraction() {}`: copy them, and add `#include <stdexcept>` for `invalid_argument`.

### Q21 (3 marks): the constructor that throws

```challenge
{"prompt": "Q21. Write the constructor <code>Fraction(int numerator, int denominator)</code>: an initializer list that stores both members, then <code>throw invalid_argument(\"Denominator cannot be zero\")</code> when the denominator is 0. main is written: 2/3 must build, 1/0 must be caught.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    // Q21: write the constructor Fraction(int numerator, int denominator)\n};\n\nint main() {\n    Fraction ok(2, 3);\n    cout << \"2/3 built\" << endl;\n    try {\n        Fraction bad(1, 0);\n        cout << \"1/0 built\" << endl;\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}\n", "expected": "2/3 built\ncaught: Denominator cannot be zero", "hints": ["The head: <code>Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator)</code>.", "The body: <code>if (denominator == 0) { throw invalid_argument(\"Denominator cannot be zero\"); }</code>.", "<code>invalid_argument</code> comes from <code>#include &lt;stdexcept&gt;</code>, already in the starter."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n};\n\nint main() {\n    Fraction ok(2, 3);\n    cout << \"2/3 built\" << endl;\n    try {\n        Fraction bad(1, 0);\n        cout << \"1/0 built\" << endl;\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}\n"}
```

### Q22 (3 marks): the copy constructor

```challenge
{"prompt": "Q22. Write the copy constructor. For this check only, its body prints <code>copy constructor</code> (on paper the body is empty). main copies three times: <code>Fraction b(a);</code>, <code>Fraction c = a;</code> and the by-value call <code>showByValue(c)</code>.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    // Q22: copy constructor (for this check only, print \"copy constructor\" in its body)\n\n    void show() const { cout << numerator << \"/\" << denominator << endl; }\n};\n\nvoid showByValue(Fraction f) {\n    f.show();\n}\n\nint main() {\n    Fraction a(2, 5);\n    Fraction b(a);\n    Fraction c = a;\n    showByValue(c);\n    b.show();\n    return 0;\n}\n", "expected": "copy constructor\ncopy constructor\ncopy constructor\n2/5\n2/5", "hints": ["The signature: <code>Fraction(const Fraction&amp; other)</code>.", "Copy both members in the initializer list: <code>: numerator(other.numerator), denominator(other.denominator)</code>.", "Body: <code>{ cout &lt;&lt; \"copy constructor\" &lt;&lt; endl; }</code>."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {\n        cout << \"copy constructor\" << endl;\n    }\n    void show() const { cout << numerator << \"/\" << denominator << endl; }\n};\n\nvoid showByValue(Fraction f) {\n    f.show();\n}\n\nint main() {\n    Fraction a(2, 5);\n    Fraction b(a);\n    Fraction c = a;\n    showByValue(c);\n    b.show();\n    return 0;\n}\n"}
```

### Q23 (2 marks): the destructor

```challenge
{"prompt": "Q23. Write the destructor. For this check only, its body prints <code>~Fraction</code>, a space, then <code>numerator/denominator</code> (on paper <code>~Fraction() {}</code> is the whole answer).", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    // Q23: destructor (for this check only, print \"~Fraction n/d\" in its body)\n};\n\nint main() {\n    Fraction a(1, 4);\n    {\n        Fraction b(3, 4);\n        cout << \"inner block ends\" << endl;\n    }\n    cout << \"main ends\" << endl;\n    return 0;\n}\n", "expected": "inner block ends\n~Fraction 3/4\nmain ends\n~Fraction 1/4", "hints": ["The signature: <code>~Fraction()</code>, no parameters, no return type.", "Body: <code>{ cout &lt;&lt; \"~Fraction \" &lt;&lt; numerator &lt;&lt; \"/\" &lt;&lt; denominator &lt;&lt; endl; }</code>.", "b dies at the inner closing brace; a dies at the end of main."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {\n        cout << \"~Fraction \" << numerator << \"/\" << denominator << endl;\n    }\n};\n\nint main() {\n    Fraction a(1, 4);\n    {\n        Fraction b(3, 4);\n        cout << \"inner block ends\" << endl;\n    }\n    cout << \"main ends\" << endl;\n    return 0;\n}\n"}
```

| Part | Marks | What earns them |
|---|---|---|
| Q21 | 3 | A `throw` inside the constructor, guarded by `if (denominator == 0)`, and both members stored. Any thrown type is accepted, and `invalid_argument` with `#include <stdexcept>` is the Week 5 answer. |
| Q22 | 3 | The parameter is `const Fraction&`, and both members are copied in the initializer list or the body. |
| Q23 | 2 | `~Fraction() {}` or `= default`, because there is nothing to `delete`. |

## Try it

```quiz
[
  { "q": "A `Mob` constructor throws when the hit points are not positive. What does this program print?", "code": "#include <iostream>\n#include <stdexcept>\n#include <string>\nusing namespace std;\n\nclass Mob {\n    string name;\n    int hp;\npublic:\n    Mob(string name, int hp) : name(name), hp(hp) {\n        if (hp <= 0) {\n            throw invalid_argument(\"hp must be positive\");\n        }\n        cout << \"spawn \" << name << endl;\n    }\n    ~Mob() { cout << \"gone \" << name << endl; }\n};\n\nint main() {\n    try {\n        Mob slime(\"Slime\", 50);\n        Mob ghost(\"Ghost\", 0);\n        cout << \"both spawned\" << endl;\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}", "options": ["spawn Slime\ngone Slime\ncaught: hp must be positive", "spawn Slime\ncaught: hp must be positive\ngone Slime", "spawn Slime\ngone Ghost\ngone Slime\ncaught: hp must be positive", "spawn Slime\nspawn Ghost\nboth spawned\ngone Ghost\ngone Slime"], "answer": 0, "explain": "1. `Mob slime(\"Slime\", 50);` passes the check: `spawn Slime`.\n2. `Mob ghost(\"Ghost\", 0);` throws before its print. Ghost never exists, so it gets no destructor, and `both spawned` is skipped.\n3. The throw leaves the `try` block, which destroys the objects already built in it: `gone Slime`.\n4. Only then does the handler run: `caught: hp must be positive`." },
  { "q": "The copy constructor prints `copy`. What does this program print?", "code": "#include <iostream>\nusing namespace std;\n\nclass Fraction {\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int n, int d) : numerator(n), denominator(d) {}\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {\n        cout << \"copy\" << endl;\n    }\n};\n\nint main() {\n    Fraction a(1, 2);\n    Fraction b(a);\n    Fraction c = a;\n    c = b;\n    cout << \"done\" << endl;\n    return 0;\n}", "options": ["copy\ncopy\ndone", "copy\ncopy\ncopy\ndone", "copy\ndone", "done"], "answer": 0, "explain": "1. `Fraction b(a);` makes a new object from a: `copy`.\n2. `Fraction c = a;` also makes a new object, so the `=` here is a copy: `copy`.\n3. `c = b;` is an assignment between two objects that already exist. The copy constructor does not run, and nothing prints.\n4. `done`." },
  { "q": "This copy constructor compiles: `Fraction(Fraction other) : numerator(other.numerator), denominator(other.denominator) {}`", "type": "tf", "answer": false, "explain": "1. Passing `other` by value would make a copy of the argument.\n2. Making that copy would call this same copy constructor, which would need another copy, forever.\n3. g++ rejects it, so the paper's signature takes `const Fraction&`." },
  { "q": "`Fraction bad(5, 0);` throws from the Q21 constructor inside a `try` block. What is true of `bad`?", "options": ["No object exists, and no destructor runs for it", "It holds 5 and 0, and its destructor runs at the closing brace", "It holds 5 and 0 until the `catch` block ends", "It holds 0 and 1, the safe default"], "answer": 0, "explain": "1. The initializer list fills the members, then the body's check throws.\n2. The constructor never finishes, so the object never exists.\n3. An object that never existed gets no destructor." },
  { "type": "free", "q": "Q22 (3 marks). Write the copy constructor for Fraction and say why its parameter is `const Fraction&`.", "model": "A copy constructor builds a new object from an existing one of the same class: `Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}`. The `&` is required, because a by-value parameter would itself need a copy and so call the copy constructor forever. The `const` promises not to change the original and lets a `const Fraction` be copied.", "points": ["the signature `Fraction(const Fraction& other)`", "both members copied from `other`", "`&`: by value would call the copy constructor forever, so it does not compile", "`const`: the original is not changed, and a const Fraction can be copied"], "rows": 4, "explain": "1. Name it: the constructor that builds a new object from an existing one.\n2. Contrast: an assignment `c = b;` between two existing objects does not run it.\n3. One line of code: the signature with its initializer list." }
]
```

## Remember

- A constructor that throws makes no object, so nothing is destroyed for it.
- The copy constructor takes `const Fraction&`: by value it would call itself forever.
- Leaving a block destroys its objects in reverse order, before the `catch` runs.
- *On the sheet:* Sheet side 2, band 3 "Write the function / class / program", Fraction. Sheet side 2, band 4 "True/false and multiple choice traps", Exceptions.

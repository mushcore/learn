---
title: Part B: the Fraction questions (Q21 to Q26)
minutes: 35
---

Six Part B questions, 24 marks, build one class step by step: a constructor that throws, a copy constructor, a destructor, the two stream operators, and a program that reads `Fractions.txt` into a `std::stack<Fraction>`. Write each part on paper first, then make it compile in the challenge; the finished program is pinned at the end.

## Q21 (3). The constructor that throws

Question as printed: "Suppose we want to develop and implement a class called Fraction. A Fraction stores a numerator and a denominator, both as integers. Write a Fraction constructor that throws an exception if the user tries to instantiate a Fraction with a denominator of 0 (zero). Assume there are two private data members, both of type int, called numerator and denominator, defined in the Fraction class."

The marker wants a `throw` inside the constructor body guarded by `if (denominator == 0)`. Any thrown type is accepted; the Week 5 answer is `std::invalid_argument("Denominator cannot be zero")` from `<stdexcept>`, whose `what()` carries the message to the handler. Initialize the members in the initializer list as usual; the check comes after.

```challenge
{ "prompt": "Write the Q21 constructor <code>Fraction(int numerator, int denominator)</code>: store both members and <code>throw invalid_argument(\"Denominator cannot be zero\")</code> when the denominator is 0. main is written and must print <code>caught: Denominator cannot be zero</code>.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    // Q21: your constructor here\n};\n\nint main() {\n    try {\n        Fraction bad(1, 0);\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}\n", "expected": "caught: Denominator cannot be zero", "hints": ["Initializer list first: <code>: numerator(numerator), denominator(denominator)</code>.", "Then <code>if (denominator == 0) { throw invalid_argument(\"Denominator cannot be zero\"); }</code>.", "The parameter names may shadow the members; inside the initializer list <code>numerator(numerator)</code> still means member(parameter)."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n};\n\nint main() {\n    try {\n        Fraction bad(1, 0);\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}\n" }
```

Taught in [Week 5: throw, try and catch](#/comp3522-w5/throw-try-catch).

## Q22 (3) and Q23 (2). Copy constructor and destructor

Q22: "Implement a copy constructor for the Fraction class described in question 21." Q23: "Implement a destructor for the Fraction class described in question 21."

The copy constructor must take `const Fraction&` and copy both members: `Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}`. A by-value parameter would call the copy constructor to build itself, forever. The destructor is `~Fraction() {}`; Fraction owns no pointer, so there is nothing to `delete`, and `~Fraction() = default;` earns the same marks. The challenge adds a print to each so you can see when they run: copies on `Fraction twin(half);`, destructors at the closing brace in reverse order of construction.

```challenge
{ "prompt": "Add the Q22 copy constructor (print <code>copy constructor</code>) and the Q23 destructor (print <code>destroying n/d</code> with the two members). The expected output shows the copy happening and the three objects dying in reverse order at the end of the block.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    // Q22: copy constructor, prints \"copy constructor\"\n\n    // Q23: destructor, prints \"destroying \" << numerator << \"/\" << denominator\n\n};\n\nint main() {\n    {\n        Fraction half(1, 2);\n        Fraction third(1, 3);\n        Fraction twin(half);\n        cout << \"end of block\" << endl;\n    }\n    cout << \"after block\" << endl;\n    return 0;\n}\n", "expected": "copy constructor\nend of block\ndestroying 1/2\ndestroying 1/3\ndestroying 1/2\nafter block", "hints": ["<code>Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) { cout << \"copy constructor\" << endl; }</code>", "<code>~Fraction() { cout << \"destroying \" << numerator << \"/\" << denominator << endl; }</code>", "twin (1/2) dies first, then third (1/3), then half (1/2): reverse order of construction."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {\n        cout << \"copy constructor\" << endl;\n    }\n    ~Fraction() {\n        cout << \"destroying \" << numerator << \"/\" << denominator << endl;\n    }\n};\n\nint main() {\n    {\n        Fraction half(1, 2);\n        Fraction third(1, 3);\n        Fraction twin(half);\n        cout << \"end of block\" << endl;\n    }\n    cout << \"after block\" << endl;\n    return 0;\n}\n" }
```

Taught in [Week 3: the copy constructor](#/comp3522-w3/copy-constructor) and [the destructor](#/comp3522-w3/destructor).

## Q24 (3). The insertion operator

"Write an insertion operator for the Fraction class. The insertion operator is a friend function to the Fraction class, and it has the following signature: `ostream& operator<<(ostream& os, const Fraction& fraction) {`"

```widget
op-dispatch
{ "expr": "cout << a" }
```

`cout << half` is the call `operator<<(cout, half)`. The left operand is an `ostream`, a class you cannot edit, so the function cannot be a member of Fraction; it is a non-member declared `friend` inside the class so it may read `fraction.numerator` and `fraction.denominator`. Two marks live in the signature's two references: the Fraction is `const Fraction&` because printing does not change it, and the function **returns `os`** so that `cout << half << endl` chains. Write to `os`, never to `cout` directly.

```challenge
{ "prompt": "Write the Q24 operator as a friend: declare it inside the class with <code>friend</code>, define it outside, write <code>numerator/denominator</code> to <code>os</code> and return <code>os</code>. main must print <code>1/2</code>.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    // Q24: friend declaration here\n};\n\n// Q24: definition here\n\nint main() {\n    Fraction half(1, 2);\n    cout << half << endl;\n    return 0;\n}\n", "expected": "1/2", "hints": ["Inside the class: <code>friend ostream& operator<<(ostream& os, const Fraction& fraction);</code>", "Outside: <code>os << fraction.numerator << \"/\" << fraction.denominator; return os;</code>", "Without <code>return os;</code> the <code>&lt;&lt; endl</code> that follows has nothing to apply to and the program does not compile."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    Fraction half(1, 2);\n    cout << half << endl;\n    return 0;\n}\n" }
```

## Q25 (3). The extraction operator

"Write an extraction operator for the Fraction class. The extraction operator is a friend function to the Fraction class, and it has the following signature: `istream& operator>>(istream& is, Fraction& fraction) {`"

Mirror image: read with `is >> fraction.numerator >> fraction.denominator;` and `return is;`. The Fraction parameter is a plain `Fraction&`, not const, because the whole point is to write into it. Returning `is` lets `cin >> f >> g` chain and lets `while (in >> f)` test the stream.

```challenge
{ "prompt": "Write the Q25 operator as a friend: read the two integers into <code>fraction</code>'s members from <code>is</code> and return <code>is</code>. The stdin box holds <code>3 4 5 6</code>; main reads two Fractions and must print <code>3/4</code> then <code>5/6</code>.", "stdin": "3 4 5 6", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    // Q25: friend declaration here\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\n// Q25: definition here\n\nint main() {\n    Fraction f(0, 1);\n    Fraction g(0, 1);\n    cin >> f >> g;\n    cout << f << endl << g << endl;\n    return 0;\n}\n", "expected": "3/4\n5/6", "hints": ["Inside the class: <code>friend istream& operator>>(istream& is, Fraction& fraction);</code>", "Outside: <code>is >> fraction.numerator >> fraction.denominator; return is;</code>", "The second parameter must not be const: the operator writes into it."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    friend istream& operator>>(istream& is, Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nistream& operator>>(istream& is, Fraction& fraction) {\n    is >> fraction.numerator >> fraction.denominator;\n    return is;\n}\n\nint main() {\n    Fraction f(0, 1);\n    Fraction g(0, 1);\n    cin >> f >> g;\n    cout << f << endl << g << endl;\n    return 0;\n}\n" }
```

Taught in [Week 4: operator overloading](#/comp3522-w4/operator-overloading) (the Date stream operators) and [friends](#/comp3522-w4/friends).

## Q26 (10). Fractions.txt into a stack

"I have a text document called Fractions.txt. It contains rows (lines) of numbers. Each line contains 2 integers separated by whitespace. I would like to open the file. I would like to use each row to create a Fraction object. Use the first integer in the line as the numerator, and the second integer as the denominator. I would like to store these new Fraction objects in a std::stack<Fraction>. Write a program that does this. You may assume the code from the Fraction questions (21, 22, 23) is available to you. You may assume that there are no zeros in the file."

Ten marks, spread over these points: `#include <fstream>` and `#include <stack>`; open the file with `ifstream in("Fractions.txt");`; check that it opened; read two ints per row with `while (in >> num >> den)`, which stops cleanly at end of file; push `Fraction(num, den)`; show the result with `top()` and `pop()`. The exam version of main opens the file:

```cpp
int main() {
    ifstream in("Fractions.txt");
    if (!in.is_open()) {
        cerr << "Could not open Fractions.txt" << endl;
        return 1;
    }
    stack<Fraction> fractions;
    int num, den;
    while (in >> num >> den) {
        fractions.push(Fraction(num, den));
    }
    in.close();
    // ... print by popping
}
```

The app cannot supply a file, so the runnable version below reads the same rows from the stdin box through `istream& in = cin;` and everything after the open is identical. A stack pops the last pushed first, so the rows `1 2`, `3 4`, `5 6` come back out as `5/6`, `3/4`, `1/2`.

```challenge
{ "prompt": "Write the Q26 main: a <code>stack&lt;Fraction&gt;</code>, a <code>while (cin >> num >> den)</code> loop that pushes <code>Fraction(num, den)</code>, then print every Fraction by <code>top()</code> and <code>pop()</code> until <code>empty()</code>. The stdin box holds the three rows of Fractions.txt; the output must be <code>5/6</code>, <code>3/4</code>, <code>1/2</code> on three lines.", "stdin": "1 2\n3 4\n5 6", "starter": "#include <iostream>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) throw invalid_argument(\"Denominator cannot be zero\");\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    // Q26: read rows from cin (standing in for ifstream in(\"Fractions.txt\")) into a stack, then print by popping\n    return 0;\n}\n", "expected": "5/6\n3/4\n1/2", "hints": ["<code>stack&lt;Fraction&gt; fractions; int num, den;</code>", "<code>while (cin >> num >> den) { fractions.push(Fraction(num, den)); }</code>", "<code>while (!fractions.empty()) { cout << fractions.top() << endl; fractions.pop(); }</code>"], "solution": "#include <iostream>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) throw invalid_argument(\"Denominator cannot be zero\");\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    stack<Fraction> fractions;\n    int num, den;\n    while (cin >> num >> den) {\n        fractions.push(Fraction(num, den));\n    }\n    while (!fractions.empty()) {\n        cout << fractions.top() << endl;\n        fractions.pop();\n    }\n    return 0;\n}\n" }
```

Taught in [Week 2: file streams](#/comp3522-w2/file-streams) and [Week 3: Lab 3, the stack](#/comp3522-w3/lab3-stack).

## The whole answer in one program

```cpp run pin Fraction.cpp
// stdin: 1 2\n3 4\n5 6
// predict: The input rows are 1 2, 3 4, 5 6. Write the four lines printed.
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
    // Q24 / Q25: friend stream operators
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

// Q26: read the rows into a stack (the exam opens ifstream in("Fractions.txt"); here cin stands in)
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

The six answers in one file, in the order the paper asks for them. `fractions.push(Fraction(num, den));` builds each Fraction with the Q21 constructor and copies it into the stack with the Q22 copy constructor; `cout << fractions.top() << endl;` is the Q24 operator; the Q25 operator is declared and defined but unused here, because the loop reads two ints and lets the constructor validate them. The final `try` block exercises Q21 and prints the fourth line, `caught: Denominator cannot be zero`.

```quiz
[
  {
    "type": "fill",
    "q": "Complete the Q24 signature.",
    "code": "ostream& operator<<(ostream& os, ___ fraction);",
    "answer": ["const Fraction&", "const Fraction &"],
    "explain": "Printing does not modify the Fraction, and a reference avoids the copy: const Fraction&. The paper prints this exact signature."
  },
  {
    "type": "fill",
    "q": "Complete the last statement of the insertion operator so that `cout << a << b` chains.",
    "code": "ostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    ___\n}",
    "answer": ["return os;", "return os"],
    "explain": "The operator returns the stream it wrote to, so the next << applies to the same stream."
  },
  {
    "type": "fill",
    "q": "Complete the Q25 signature's two stream types.",
    "code": "___ operator>>(___ is, Fraction& fraction);",
    "answer": ["istream&", "istream&"],
    "explain": "Extraction takes and returns an istream by reference (cin or an ifstream). The Fraction is a non-const reference because it is written into."
  },
  {
    "type": "fill",
    "q": "Which header gives you `std::stack`?",
    "code": "#include ___",
    "answer": ["<stack>", "stack"],
    "explain": "std::stack lives in <stack>; the file needs <fstream> as well. Forgetting a header is an easy mark to lose on paper."
  },
  {
    "type": "spotbug",
    "q": "Click the line that stops `cout << half << endl;` from compiling.",
    "code": "void operator<<(ostream& os, const Fraction& fraction)\n{\n    os << fraction.numerator << \"/\" << fraction.denominator;\n}",
    "answer": 1,
    "explain": "A void return gives `cout << half` no value, so `<< endl` has nothing to apply to. Return ostream& and end with return os;."
  },
  {
    "q": "Why must the copy constructor's parameter be a reference, `Fraction(const Fraction& other)`?",
    "options": ["a by-value parameter would need the copy constructor to build itself: infinite recursion", "references are faster to type", "the compiler requires const on all constructors", "so the parameter can be nullptr"],
    "answer": 0,
    "explain": "Passing by value copies, and copying is what we are defining. const lets const Fractions be copied too."
  },
  {
    "q": "Q26: after pushing rows `1 2`, `3 4`, `5 6` onto a `std::stack<Fraction>`, what does the first `top()` return?",
    "options": ["1/2", "3/4", "5/6", "the stack is empty until you pop"],
    "answer": 2,
    "explain": "LIFO: the last pushed row is on top. Printing by top()/pop() gives 5/6, 3/4, 1/2."
  },
  {
    "q": "Why is `while (in >> num >> den)` the right loop for Fractions.txt?",
    "options": ["it reads one line at a time regardless of content", "it throws when the file ends", "it skips the first line", "the extraction returns the stream, which tests false when a read fails at end of file, so the loop stops by itself with no eof check"],
    "answer": 3,
    "explain": "operator>> returns the istream; in a condition it converts to false once failbit or eofbit is set. Whitespace separates the two integers whether on one line or several."
  },
  {
    "q": "Q23: Fraction has only two `int` members. Which destructors earn full marks? (select all)",
    "options": ["`~Fraction() {}`", "`~Fraction() = default;`", "`~Fraction() { delete numerator; }`", "no destructor can be written for a class without pointers"],
    "answer": [0, 1],
    "explain": "Nothing is owned, so an empty or defaulted destructor is correct. delete on an int member does not compile."
  },
  {
    "q": "Which exception type does the Week 5 answer throw in the Q21 constructor, and which header declares it?",
    "options": ["`std::runtime_error` from `<iostream>`", "`std::invalid_argument` from `<stdexcept>`", "`std::bad_alloc` from `<new>`", "an `int` from `<exception>`"],
    "answer": 1,
    "explain": "invalid_argument is the logic_error for a bad argument value; its what() returns the message the catch block prints. Any thrown type earns the Q21 marks, but this is the idiomatic one."
  }
]
```

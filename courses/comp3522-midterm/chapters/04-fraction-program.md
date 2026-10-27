---
title: Part B: the Fraction questions (Q21 to Q26)
minutes: 35
---

Six Part B questions, 24 marks, build one class step by step: a constructor that throws, a copy constructor, a destructor, the two stream operators, and a program that reads `Fractions.txt` into a `std::stack<Fraction>`. Write each part on paper first, then make it compile in the challenge; the finished program is pinned at the end.

## Q21 (3). The constructor that throws

Question as printed: "Suppose we want to develop and implement a class called Fraction. A Fraction stores a numerator and a denominator, both as integers. Write a Fraction constructor that throws an exception if the user tries to instantiate a Fraction with a denominator of 0 (zero). Assume there are two private data members, both of type int, called numerator and denominator, defined in the Fraction class."

```challenge
{ "prompt": "Write the Q21 constructor <code>Fraction(int numerator, int denominator)</code>: store both members and <code>throw invalid_argument(\"Denominator cannot be zero\")</code> when the denominator is 0. main is written and must print <code>caught: Denominator cannot be zero</code>.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    // Q21: your constructor here\n};\n\nint main() {\n    try {\n        Fraction bad(1, 0);\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}\n", "expected": "caught: Denominator cannot be zero", "hints": ["Initializer list first: <code>: numerator(numerator), denominator(denominator)</code>.", "Then <code>if (denominator == 0) { throw invalid_argument(\"Denominator cannot be zero\"); }</code>.", "The parameter names may shadow the members; inside the initializer list <code>numerator(numerator)</code> still means member(parameter)."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n};\n\nint main() {\n    try {\n        Fraction bad(1, 0);\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}\n" }
```

The marker wants a `throw` inside the constructor body guarded by `if (denominator == 0)`. Any thrown type is accepted; the Week 5 answer is `std::invalid_argument("Denominator cannot be zero")` from `<stdexcept>`, whose `what()` carries the message to the handler. Initialize the members in the initializer list as usual; the check comes after.

Taught in [Week 5: throw, try and catch](#/comp3522-w5/throw-try-catch).

## Q22 (3) and Q23 (2). Copy constructor and destructor

Q22: "Implement a copy constructor for the Fraction class described in question 21." Q23: "Implement a destructor for the Fraction class described in question 21."

The challenge adds a print to each so you can see when they run.

```challenge
{ "prompt": "Add the Q22 copy constructor (print <code>copy constructor</code>) and the Q23 destructor (print <code>destroying n/d</code> with the two members). The expected output shows the copy happening and the three objects dying in reverse order at the end of the block.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    // Q22: copy constructor, prints \"copy constructor\"\n\n    // Q23: destructor, prints \"destroying \" << numerator << \"/\" << denominator\n\n};\n\nint main() {\n    {\n        Fraction half(1, 2);\n        Fraction third(1, 3);\n        Fraction twin(half);\n        cout << \"end of block\" << endl;\n    }\n    cout << \"after block\" << endl;\n    return 0;\n}\n", "expected": "copy constructor\nend of block\ndestroying 1/2\ndestroying 1/3\ndestroying 1/2\nafter block", "hints": ["<code>Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) { cout << \"copy constructor\" << endl; }</code>", "<code>~Fraction() { cout << \"destroying \" << numerator << \"/\" << denominator << endl; }</code>", "twin (1/2) dies first, then third (1/3), then half (1/2): reverse order of construction."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {\n        cout << \"copy constructor\" << endl;\n    }\n    ~Fraction() {\n        cout << \"destroying \" << numerator << \"/\" << denominator << endl;\n    }\n};\n\nint main() {\n    {\n        Fraction half(1, 2);\n        Fraction third(1, 3);\n        Fraction twin(half);\n        cout << \"end of block\" << endl;\n    }\n    cout << \"after block\" << endl;\n    return 0;\n}\n" }
```

The copy constructor must take `const Fraction&` and copy both members: `Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}`. A by-value parameter would call the copy constructor to build itself, forever. The destructor is `~Fraction() {}`; Fraction owns no pointer, so there is nothing to `delete`, and `~Fraction() = default;` earns the same marks. In the challenge the copy runs on `Fraction twin(half);`, and the destructors run at the closing brace in reverse order of construction.

Taught in [Week 3: the copy constructor](#/comp3522-w3/copy-constructor) and [the destructor](#/comp3522-w3/destructor).

## Q24 (3). The insertion operator

"Write an insertion operator for the Fraction class. The insertion operator is a friend function to the Fraction class, and it has the following signature: `ostream& operator<<(ostream& os, const Fraction& fraction) {`"

```widget
op-dispatch
{ "expr": "cout << a" }
```

`cout << half` is the call `operator<<(cout, half)`. The left operand is an `ostream`, a class you cannot edit, so the function cannot be a member of Fraction; it is a non-member declared `friend` inside the class so it may read `fraction.numerator` and `fraction.denominator`.

```challenge
{ "prompt": "Write the Q24 operator as a friend: declare it inside the class with <code>friend</code>, define it outside, write <code>numerator/denominator</code> to <code>os</code> and return <code>os</code>. main must print <code>1/2</code>.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    // Q24: friend declaration here\n};\n\n// Q24: definition here\n\nint main() {\n    Fraction half(1, 2);\n    cout << half << endl;\n    return 0;\n}\n", "expected": "1/2", "hints": ["Inside the class: <code>friend ostream& operator<<(ostream& os, const Fraction& fraction);</code>", "Outside: <code>os << fraction.numerator << \"/\" << fraction.denominator; return os;</code>", "Without <code>return os;</code> the <code>&lt;&lt; endl</code> that follows has nothing to apply to and the program does not compile."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    Fraction half(1, 2);\n    cout << half << endl;\n    return 0;\n}\n" }
```

Two marks live in the signature's two references: the Fraction is `const Fraction&` because printing does not change it, and the function **returns `os`** so that `cout << half << endl` chains. Write to `os`, never to `cout` directly.

## Q25 (3). The extraction operator

"Write an extraction operator for the Fraction class. The extraction operator is a friend function to the Fraction class, and it has the following signature: `istream& operator>>(istream& is, Fraction& fraction) {`"

```challenge
{ "prompt": "Write the Q25 operator as a friend: read the two integers into <code>fraction</code>'s members from <code>is</code> and return <code>is</code>. The stdin box holds <code>3 4 5 6</code>; main reads two Fractions and must print <code>3/4</code> then <code>5/6</code>.", "stdin": "3 4 5 6", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    // Q25: friend declaration here\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\n// Q25: definition here\n\nint main() {\n    Fraction f(0, 1);\n    Fraction g(0, 1);\n    cin >> f >> g;\n    cout << f << endl << g << endl;\n    return 0;\n}\n", "expected": "3/4\n5/6", "hints": ["Inside the class: <code>friend istream& operator>>(istream& is, Fraction& fraction);</code>", "Outside: <code>is >> fraction.numerator >> fraction.denominator; return is;</code>", "The second parameter must not be const: the operator writes into it."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    friend istream& operator>>(istream& is, Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nistream& operator>>(istream& is, Fraction& fraction) {\n    is >> fraction.numerator >> fraction.denominator;\n    return is;\n}\n\nint main() {\n    Fraction f(0, 1);\n    Fraction g(0, 1);\n    cin >> f >> g;\n    cout << f << endl << g << endl;\n    return 0;\n}\n" }
```

Mirror image of Q24: read with `is >> fraction.numerator >> fraction.denominator;` and `return is;`. The Fraction parameter is a plain `Fraction&`, not const, because the whole point is to write into it. Returning `is` lets `cin >> f >> g` chain and lets `while (in >> f)` test the stream.

Taught in [Week 4: operator overloading](#/comp3522-w4/operator-overloading) (the Date stream operators) and [friends](#/comp3522-w4/friends).

## Q26 (10). Fractions.txt into a stack

"I have a text document called Fractions.txt. It contains rows (lines) of numbers. Each line contains 2 integers separated by whitespace. I would like to open the file. I would like to use each row to create a Fraction object. Use the first integer in the line as the numerator, and the second integer as the denominator. I would like to store these new Fraction objects in a std::stack<Fraction>. Write a program that does this. You may assume the code from the Fraction questions (21, 22, 23) is available to you. You may assume that there are no zeros in the file."

The app cannot supply a file, so the challenge reads the same rows from the stdin box, with `cin` standing in for the file; everything after the open is identical.

```challenge
{ "prompt": "Write the Q26 main: a <code>stack&lt;Fraction&gt;</code>, a <code>while (cin >> num >> den)</code> loop that pushes <code>Fraction(num, den)</code>, then print every Fraction by <code>top()</code> and <code>pop()</code> until <code>empty()</code>. The stdin box holds the three rows of Fractions.txt; the output is the three Fractions, one per line, in the order the stack gives them back.", "stdin": "1 2\n3 4\n5 6", "starter": "#include <iostream>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) throw invalid_argument(\"Denominator cannot be zero\");\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    // Q26: read rows from cin (standing in for ifstream in(\"Fractions.txt\")) into a stack, then print by popping\n    return 0;\n}\n", "expected": "5/6\n3/4\n1/2", "hints": ["<code>stack&lt;Fraction&gt; fractions; int num, den;</code>", "<code>while (cin >> num >> den) { fractions.push(Fraction(num, den)); }</code>", "<code>while (!fractions.empty()) { cout << fractions.top() << endl; fractions.pop(); }</code>"], "solution": "#include <iostream>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) throw invalid_argument(\"Denominator cannot be zero\");\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    stack<Fraction> fractions;\n    int num, den;\n    while (cin >> num >> den) {\n        fractions.push(Fraction(num, den));\n    }\n    while (!fractions.empty()) {\n        cout << fractions.top() << endl;\n        fractions.pop();\n    }\n    return 0;\n}\n" }
```

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

The pinned program below does the same through `istream& in = cin;`. A stack pops the last pushed first.

Taught in [Week 2: file streams](#/comp3522-w2/file-streams) and [Week 3: Lab 3, the stack](#/comp3522-w3/lab3-stack).

## The whole answer in one program

```cpp run pin Fraction.cpp
// stdin: 1 2\n3 4\n5 6
// predict: The input rows are 1 2, 3 4, 5 6. Write the first three lines printed.
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

## Build a `Time` class the way Q21 to Q26 build Fraction

The same guided long question on a new class: a `Time` of hours and minutes that refuses minutes outside 0 to 59, read from a file into a `std::queue`.

```challenge
{"prompt": "Parts (a) to (e) of the long question on <code>Time</code>: (a) a constructor that stores both members and throws <code>invalid_argument(\"minutes must be 0 to 59\")</code> for minutes outside 0 to 59; (b) a copy constructor; (c) a destructor; (d) and (e) a friend <code>operator&lt;&lt;</code> that prints <code>hours:mm</code> with two-digit minutes and returns the stream.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Time {\nprivate:\n    int hours;\n    int minutes;\npublic:\n    // (a) constructor Time(int hours, int minutes): store both, and throw\n    //     invalid_argument(\"minutes must be 0 to 59\") when minutes is outside 0..59\n    // (b) copy constructor\n    // (c) destructor\n    // (d) friend declaration of operator<<\n};\n\n// (e) operator<< prints hours, ':', then minutes with two digits (9:05, 12:30)\n\nint main() {\n    Time a(9, 5);\n    Time b(a);\n    cout << a << \" \" << b << \" \" << Time(12, 30) << endl;\n    try {\n        Time bad(3, 60);\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}\n", "expected": "9:05 9:05 12:30\ncaught: minutes must be 0 to 59", "hints": ["(a) <code>Time(int hours, int minutes) : hours(hours), minutes(minutes) { if (minutes &lt; 0 || minutes &gt; 59) throw invalid_argument(\"minutes must be 0 to 59\"); }</code>", "(b) <code>Time(const Time&amp; other) : hours(other.hours), minutes(other.minutes) {}</code>", "(e) <code>os &lt;&lt; t.hours &lt;&lt; \":\" &lt;&lt; (t.minutes &lt; 10 ? \"0\" : \"\") &lt;&lt; t.minutes; return os;</code>"], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Time {\nprivate:\n    int hours;\n    int minutes;\npublic:\n    Time(int hours, int minutes) : hours(hours), minutes(minutes) {\n        if (minutes < 0 || minutes > 59) {\n            throw invalid_argument(\"minutes must be 0 to 59\");\n        }\n    }\n    Time(const Time& other) : hours(other.hours), minutes(other.minutes) {}\n    ~Time() {}\n    friend ostream& operator<<(ostream& os, const Time& t);\n};\n\nostream& operator<<(ostream& os, const Time& t) {\n    os << t.hours << \":\" << (t.minutes < 10 ? \"0\" : \"\") << t.minutes;\n    return os;\n}\n\nint main() {\n    Time a(9, 5);\n    Time b(a);\n    cout << a << \" \" << b << \" \" << Time(12, 30) << endl;\n    try {\n        Time bad(3, 60);\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}\n"}
```

```quiz
[
  {
    "q": "Q21 style. Complete the guard so 0 and 59 are accepted and 60 is rejected.",
    "type": "fill",
    "code": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Time {\n    int hours, minutes;\npublic:\n    Time(int hours, int minutes) : hours(hours), minutes(minutes) {\n        if (minutes < 0 || minutes ___ 59) {\n            throw invalid_argument(\"minutes must be 0 to 59\");\n        }\n    }\n};\n\nint main() {\n    for (int m : {0, 59, 60}) {\n        try {\n            Time t(8, m);\n            cout << m << \" ok \";\n        } catch (invalid_argument& e) {\n            cout << m << \" rejected\";\n        }\n    }\n    cout << endl;\n    return 0;\n}",
    "answer": [
      ">"
    ],
    "explain": "Valid minutes are 0 to 59 inclusive, so the constructor throws when `minutes < 0 || minutes > 59`. With `>=` the 59 would be rejected too. The loop prints `0 ok 59 ok 60 rejected`."
  },
  {
    "q": "Q26 style. What does this print? (The rows are pushed into both a queue and a stack.)",
    "code": "#include <iostream>\n#include <queue>\n#include <stack>\n#include <stdexcept>\nusing namespace std;\n\nclass Time {\nprivate:\n    int hours;\n    int minutes;\npublic:\n    Time(int hours, int minutes) : hours(hours), minutes(minutes) {\n        if (minutes < 0 || minutes > 59) {\n            throw invalid_argument(\"minutes must be 0 to 59\");\n        }\n    }\n    Time(const Time& other) : hours(other.hours), minutes(other.minutes) {}\n    ~Time() {}\n    friend ostream& operator<<(ostream& os, const Time& t);\n};\n\nostream& operator<<(ostream& os, const Time& t) {\n    os << t.hours << \":\" << (t.minutes < 10 ? \"0\" : \"\") << t.minutes;\n    return os;\n}\n\nint main() {\n    queue<Time> line;\n    stack<Time> pile;\n    int rows[3][2] = {{9, 5}, {12, 30}, {17, 0}};\n    for (auto& r : rows) {\n        line.push(Time(r[0], r[1]));\n        pile.push(Time(r[0], r[1]));\n    }\n    cout << line.front() << \" \" << pile.top() << \" \" << line.back() << endl;\n    return 0;\n}",
    "options": [
      "`9:05 17:00 17:00`",
      "`9:05 9:05 17:00`",
      "`17:00 9:05 9:05`",
      "`9:5 17:0 17:0`"
    ],
    "answer": 0,
    "explain": "A queue is FIFO: `front()` is the first row pushed, 9:05, and `back()` the last, 17:00. A stack is LIFO: `top()` is the last row pushed, 17:00. The operator pads a minute below 10 with a 0, so 5 prints as `05` and 0 as `00`."
  },
  {
    "q": "Q22 style. Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Time {\n    int hours, minutes;\npublic:\n    Time(int h, int m) : hours(h), minutes(m) {}\n    Time(Time other) : hours(other.hours), minutes(other.minutes) {}\n};\n\nint main() {\n    Time a(9, 30);\n    Time b(a);\n    return 0;\n}",
    "answer": [
      8
    ],
    "explain": "A copy constructor that takes its parameter by value would need the copy constructor to build that parameter, forever, so g++ refuses: invalid constructor; you probably meant 'Time (const Time&)'. Write `Time(const Time& other)`."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Time {\n    int hours, minutes;\npublic:\n    Time(int h, int m) : hours(h), minutes(m) {\n        if (m < 0 || m > 59) throw invalid_argument(\"bad minutes\");\n        cout << \"made \" << h << endl;\n    }\n    Time(const Time& other) : hours(other.hours), minutes(other.minutes) { cout << \"copy \" << hours << endl; }\n    ~Time() { cout << \"gone \" << hours << endl; }\n};\n\nint main() {\n    try {\n        Time a(7, 15);\n        Time b = a;\n        Time c(2, 75);\n        cout << \"all made\" << endl;\n    } catch (invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n    return 0;\n}",
    "options": [
      "`made 7`\n`copy 7`\n`gone 7`\n`gone 7`\n`caught: bad minutes`",
      "`made 7`\n`copy 7`\n`caught: bad minutes`\n`gone 7`\n`gone 7`",
      "`made 7`\n`copy 7`\n`gone 2`\n`gone 7`\n`gone 7`\n`caught: bad minutes`",
      "`made 7`\n`copy 7`\n`all made`\n`gone 2`\n`gone 7`\n`gone 7`"
    ],
    "answer": 0,
    "explain": "a is made (`made 7`) and b is copied from it (`copy 7`). `Time c(2, 75)` throws before printing, so c never exists and `gone 2` never prints, and `all made` is skipped. Leaving the try block destroys b and a, in reverse order, before the handler runs: `gone 7`, `gone 7`. Then `caught: bad minutes`."
  }
]
```

```challenge
{"prompt": "Part (f), the program: read rows of <code>hours minutes</code> from <code>cin</code> (in the exam, <code>ifstream in(\"Times.txt\")</code>) and push a <code>Time</code> for each into a <code>std::queue&lt;Time&gt;</code>. A row whose constructor throws is caught, skipped and counted. Print the queue front to back with <code>front()</code> and <code>pop()</code>, then <code>skipped N</code>.", "starter": "#include <iostream>\n#include <queue>\n#include <stdexcept>\nusing namespace std;\n\nclass Time {\nprivate:\n    int hours;\n    int minutes;\npublic:\n    Time(int hours, int minutes) : hours(hours), minutes(minutes) {\n        if (minutes < 0 || minutes > 59) {\n            throw invalid_argument(\"minutes must be 0 to 59\");\n        }\n    }\n    Time(const Time& other) : hours(other.hours), minutes(other.minutes) {}\n    ~Time() {}\n    friend ostream& operator<<(ostream& os, const Time& t);\n};\n\nostream& operator<<(ostream& os, const Time& t) {\n    os << t.hours << \":\" << (t.minutes < 10 ? \"0\" : \"\") << t.minutes;\n    return os;\n}\n\nint main() {\n    // Rows of \"hours minutes\" arrive on cin (standing in for ifstream in(\"Times.txt\")).\n    // Push a Time for each valid row into a std::queue<Time>. A row whose Time\n    // constructor throws is skipped and counted. Then print the queue front to back,\n    // one Time per line, and finally \"skipped N\".\n    return 0;\n}\n", "expected": "9:05\n13:30\nskipped 1", "stdin": "9 5\n10 75\n13 30", "hints": ["<code>while (cin &gt;&gt; h &gt;&gt; m)</code> stops by itself at the end of input.", "Put the <code>try</code> around the push inside the loop, so one bad row does not end the reading.", "<code>while (!times.empty()) { cout &lt;&lt; times.front() &lt;&lt; endl; times.pop(); }</code>"], "solution": "#include <iostream>\n#include <queue>\n#include <stdexcept>\nusing namespace std;\n\nclass Time {\nprivate:\n    int hours;\n    int minutes;\npublic:\n    Time(int hours, int minutes) : hours(hours), minutes(minutes) {\n        if (minutes < 0 || minutes > 59) {\n            throw invalid_argument(\"minutes must be 0 to 59\");\n        }\n    }\n    Time(const Time& other) : hours(other.hours), minutes(other.minutes) {}\n    ~Time() {}\n    friend ostream& operator<<(ostream& os, const Time& t);\n};\n\nostream& operator<<(ostream& os, const Time& t) {\n    os << t.hours << \":\" << (t.minutes < 10 ? \"0\" : \"\") << t.minutes;\n    return os;\n}\n\nint main() {\n    queue<Time> times;\n    int skipped = 0;\n    int h, m;\n    while (cin >> h >> m) {\n        try {\n            times.push(Time(h, m));\n        } catch (const invalid_argument&) {\n            ++skipped;\n        }\n    }\n    while (!times.empty()) {\n        cout << times.front() << endl;\n        times.pop();\n    }\n    cout << \"skipped \" << skipped << endl;\n    return 0;\n}\n"}
```

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
    "q": "Why does the insertion operator end by handing back the stream it wrote to, so that `cout << a << b` works?",
    "options": ["`cout << a << b` is `(cout << a) << b`: `<< b` needs that stream as its left operand", "returning the stream flushes it, so the output appears on screen at once", "a friend function must always return one of its own reference parameters", "returning the stream lets the compiler skip copying the Fraction argument"],
    "answer": 0,
    "explain": "The chain groups left to right: `cout << a` runs first and its result is the left operand of `<< b`, so the operator returns the ostream by reference."
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
    "options": ["passing by value would itself call the copy constructor, recursing forever", "a reference parameter is shorter to write than a full Fraction value", "the compiler requires every constructor parameter to be declared const", "a reference lets the caller pass nullptr when there is nothing to copy"],
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
    "options": ["it reads exactly one line at a time, whatever that line contains", "it throws an exception as soon as the file reaches its end", "it skips the header line before reading the first fraction", "each `>>` returns the stream, which tests false once a read fails at the end"],
    "answer": 3,
    "explain": "operator>> returns the istream, and in a condition it is false only when failbit or badbit is set. eofbit alone leaves it true: a last read that reaches the end of the file without a trailing newline still succeeds and its row is used. The next read finds nothing, sets failbit, and the loop stops. Whitespace separates the two integers whether on one line or several."
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

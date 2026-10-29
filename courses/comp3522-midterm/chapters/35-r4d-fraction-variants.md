---
title: "Extra 9: the parts the long question may swap in: plus, equals, less-than, sort, a getter"
minutes: 25
---
The paper's long question may swap one of its parts for another small function on the same class. This lesson writes each one: adding, comparing, sorting, a getter, and the whole question on a new class.

## What the swapped-in parts are, in plain words

Each part is a few lines added to the same Fraction box. The two private numbers stay as they are, and only a new door is added.

Adding two fractions makes a third one and leaves both inputs alone. So the adding function hands back a new fraction instead of changing one.

Comparing two fractions answers yes or no. Two fractions can be equal with different numbers inside, like one half and two quarters.

Sorting puts a list in order from smallest to largest. The library's sort only needs a way to ask "is this one smaller than that one?".

A getter is a door that hands out one number and changes nothing. It carries a mark that promises so.

```diagram
{ "type": "grid", "title": "The four swapped-in parts", "nodes": [
  { "id": "h0", "label": "part", "row": 0, "col": 0 },
  { "id": "h1", "label": "written as", "row": 0, "col": 1 },
  { "id": "h2", "label": "returns", "row": 0, "col": 2 },
  { "id": "a0", "label": "a + b", "row": 1, "col": 0 },
  { "id": "a1", "label": "friend", "sub": "two const&", "row": 1, "col": 1 },
  { "id": "a2", "label": "a new Fraction", "row": 1, "col": 2 },
  { "id": "b0", "label": "a == b", "row": 2, "col": 0 },
  { "id": "b1", "label": "friend", "sub": "cross-multiply", "row": 2, "col": 1 },
  { "id": "b2", "label": "bool", "row": 2, "col": 2 },
  { "id": "c0", "label": "a < b", "row": 3, "col": 0 },
  { "id": "c1", "label": "friend", "sub": "cross-multiply", "row": 3, "col": 1 },
  { "id": "c2", "label": "bool", "sub": "sort calls it", "row": 3, "col": 2 },
  { "id": "d0", "label": "a getter", "row": 4, "col": 0 },
  { "id": "d1", "label": "const member", "row": 4, "col": 1 },
  { "id": "d2", "label": "int", "row": 4, "col": 2 }
], "hi": ["a2", "b1", "c1"], "caption": "Every swapped-in part reads the private numbers, so each is a friend or a member, and only adding builds a new Fraction." }
```

## A tiny program you can run in your head

```cpp run pin AddFractions.cpp
// predict: Write both lines printed.
#include <iostream>
using namespace std;

class Fraction {
    int numerator;
    int denominator;
public:
    Fraction(int n, int d) : numerator(n), denominator(d) {}
    friend ostream& operator<<(ostream& os, const Fraction& f);
    friend Fraction operator+(const Fraction& a, const Fraction& b);
};

ostream& operator<<(ostream& os, const Fraction& f) {
    os << f.numerator << "/" << f.denominator;
    return os;
}

Fraction operator+(const Fraction& a, const Fraction& b) {
    return Fraction(a.numerator * b.denominator + b.numerator * a.denominator,
                    a.denominator * b.denominator);
}

int main() {
    Fraction quarter(1, 4);
    Fraction half(1, 2);
    cout << quarter + half << endl;
    cout << quarter << endl;
}
```

1. `cout << quarter + half << endl;` calls `operator+`. Its `return Fraction(...)` builds 1 × 2 + 1 × 4 over 4 × 2, so the line is `6/8`.
2. `cout << quarter << endl;` prints `1/4`. Both parameters are `const Fraction&`, so neither input changed.

Nothing divides 6/8 down to 3/4, because the function only multiplies and adds.

## The rules, in the slide's words

- **Adding.** The Week 4 rule: `+` "doesn't change the left argument", so it is a friendly non-member that returns a Fraction by value. With the common bottom $bd$, $\frac{a}{b} + \frac{c}{d} = \frac{ad + cb}{bd}$.
- **Equal.** $\frac{a}{b} = \frac{c}{d}$ exactly when $ad = cb$. The slides then write `!=` from `==`: `return !operator==(lhs,rhs); //or !(lhs == rhs)`.
- **Less than.** The Week 4 slide: "the standard library's algorithms and types always expect `operator<`". With positive bottoms, $\frac{a}{b} < \frac{c}{d}$ exactly when $ad < cb$.
- **Getter.** Only const member functions can be called on a `const Fraction` or through a `const Fraction&`.

:::warn Compare by cross-multiplying
1/2 and 2/4 are equal although no member matches. A comparison member by member gets them wrong.
:::

## Write `operator+`

Band 3 prints this answer as one line under the class, with `n` and `d` short for the member names. The slides also define `+` through `+=`, and either form earns the marks if both operands stay unchanged.

```challenge
{"prompt": "Write <code>operator+</code> as a friendly non-member that returns a new Fraction: numerator <code>a.numerator * b.denominator + b.numerator * a.denominator</code>, denominator <code>a.denominator * b.denominator</code>. Do not reduce.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    // friend declaration of operator+ here\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\n// Fraction operator+(const Fraction& a, const Fraction& b) {\n\nint main() {\n    Fraction half(1, 2);\n    Fraction third(1, 3);\n    Fraction sixth(1, 6);\n    cout << half + third << endl;\n    cout << half + third + sixth << endl;\n    cout << half << endl;\n    return 0;\n}\n", "expected": "5/6\n36/36\n1/2", "hints": ["Inside the class: <code>friend Fraction operator+(const Fraction&amp; a, const Fraction&amp; b);</code>", "Body: <code>return Fraction(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);</code>", "<code>half + third + sixth</code> is <code>(half + third) + sixth</code> = 5/6 + 1/6 = (30 + 6)/36."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    friend Fraction operator+(const Fraction& a, const Fraction& b);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nFraction operator+(const Fraction& a, const Fraction& b) {\n    return Fraction(a.numerator * b.denominator + b.numerator * a.denominator,\n                    a.denominator * b.denominator);\n}\n\nint main() {\n    Fraction half(1, 2);\n    Fraction third(1, 3);\n    Fraction sixth(1, 6);\n    cout << half + third << endl;\n    cout << half + third + sixth << endl;\n    cout << half << endl;\n    return 0;\n}\n"}
```

## Write `operator==` and `operator!=`

Equal means the cross products match. Not-equal is just the opposite of equal, so it calls `==` instead of repeating the arithmetic.

```challenge
{"prompt": "Write <code>operator==</code> by cross-multiplying (1/2 equals 2/4 because 1 × 4 == 2 × 2), and <code>operator!=</code> in terms of it, the slides' way.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    // friend declarations of operator== and operator!= here\n};\n\n// bool operator==(const Fraction& a, const Fraction& b) {\n\n// bool operator!=(const Fraction& a, const Fraction& b) {\n\nint main() {\n    cout << boolalpha;\n    cout << (Fraction(1, 2) == Fraction(2, 4)) << endl;\n    cout << (Fraction(1, 2) == Fraction(2, 3)) << endl;\n    cout << (Fraction(1, 2) != Fraction(2, 3)) << endl;\n    return 0;\n}\n", "expected": "true\nfalse\ntrue", "hints": ["Inside the class: <code>friend bool operator==(const Fraction&amp; a, const Fraction&amp; b);</code> and the same for <code>!=</code>.", "<code>return a.numerator * b.denominator == b.numerator * a.denominator;</code>", "<code>return !(a == b);</code>"], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend bool operator==(const Fraction& a, const Fraction& b);\n    friend bool operator!=(const Fraction& a, const Fraction& b);\n};\n\nbool operator==(const Fraction& a, const Fraction& b) {\n    return a.numerator * b.denominator == b.numerator * a.denominator;\n}\n\nbool operator!=(const Fraction& a, const Fraction& b) {\n    return !(a == b);\n}\n\nint main() {\n    cout << boolalpha;\n    cout << (Fraction(1, 2) == Fraction(2, 4)) << endl;\n    cout << (Fraction(1, 2) == Fraction(2, 3)) << endl;\n    cout << (Fraction(1, 2) != Fraction(2, 3)) << endl;\n    return 0;\n}\n"}
```

## Write `operator<` and sort a `vector<Fraction>`

A vector is a list that grows as you add to it. `sort` reorders it by calling your `operator<` on pairs, and a ranged for then visits each element in turn.

Band 3's `friend bool operator<` lines are this answer, written inside the class.

```challenge
{"prompt": "Write <code>operator&lt;</code> (cross-multiply, denominators positive), then main: read every row from <code>cin</code> into a <code>vector&lt;Fraction&gt;</code>, <code>sort</code> it, and print one Fraction per line with a ranged for.", "starter": "#include <algorithm>\n#include <iostream>\n#include <stdexcept>\n#include <vector>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    // friend declaration of operator< here\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\n// bool operator<(const Fraction& a, const Fraction& b) {\n\nint main() {\n    // read every row from cin into a vector<Fraction>,\n    // sort it, then print one Fraction per line\n    return 0;\n}\n", "stdin": "3 4\n1 3\n1 2\n2 3", "expected": "1/3\n1/2\n2/3\n3/4", "hints": ["<code>return a.numerator * b.denominator &lt; b.numerator * a.denominator;</code>", "<code>while (cin &gt;&gt; num &gt;&gt; den) { fractions.push_back(Fraction(num, den)); }</code>", "<code>sort(fractions.begin(), fractions.end());</code> then <code>for (const Fraction&amp; f : fractions) { cout &lt;&lt; f &lt;&lt; endl; }</code>"], "solution": "#include <algorithm>\n#include <iostream>\n#include <stdexcept>\n#include <vector>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    friend bool operator<(const Fraction& a, const Fraction& b);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nbool operator<(const Fraction& a, const Fraction& b) {\n    return a.numerator * b.denominator < b.numerator * a.denominator;\n}\n\nint main() {\n    vector<Fraction> fractions;\n    int num, den;\n    while (cin >> num >> den) {\n        fractions.push_back(Fraction(num, den));\n    }\n    sort(fractions.begin(), fractions.end());\n    for (const Fraction& f : fractions) {\n        cout << f << endl;\n    }\n    return 0;\n}\n"}
```

After `sort` the smallest is first. A stack would only give back its top.

## Write a const getter

The word `const` after the parameter list is the promise not to change the object. Without it, a `const Fraction` cannot call the getter at all.

```challenge
{"prompt": "Write the getters <code>getNumerator()</code> and <code>getDenominator()</code>. main calls them on a <code>const Fraction</code> and through a <code>const Fraction&amp;</code>, so they must be const member functions.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    // getNumerator() and getDenominator() here\n};\n\ndouble toDouble(const Fraction& f) {\n    return static_cast<double>(f.getNumerator()) / f.getDenominator();\n}\n\nint main() {\n    const Fraction half(1, 2);\n    cout << half.getNumerator() << endl;\n    cout << toDouble(Fraction(3, 4)) << endl;\n    return 0;\n}\n", "expected": "1\n0.75", "hints": ["<code>int getNumerator() const { return numerator; }</code>", "<code>int getDenominator() const { return denominator; }</code>", "Without the <code>const</code> after the parentheses, <code>half.getNumerator()</code> does not compile: half is const."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    int getNumerator() const { return numerator; }\n    int getDenominator() const { return denominator; }\n};\n\ndouble toDouble(const Fraction& f) {\n    return static_cast<double>(f.getNumerator()) / f.getDenominator();\n}\n\nint main() {\n    const Fraction half(1, 2);\n    cout << half.getNumerator() << endl;\n    cout << toDouble(Fraction(3, 4)) << endl;\n    return 0;\n}\n"}
```

## The same question on a new class: route steps from route.txt

A quester's starter route runs in legs: the island, Lith, the class's job leg, the 10-30 leg and the 2nd-job leg. A `Step` stores an order number and a leg name.

The file `route.txt` lists the steps out of order, and the program must sort them. Every part of Q21 to Q26 comes back: a constructor that throws, a const getter, two friends, a read loop and a container.

```challenge
{"prompt": "The same long question on a new class. A <code>Step</code> of a starter route has an order number and a leg name. Write parts (a) to (f) as the comments in the starter say. The stdin box holds route.txt; one row has order 0.", "starter": "#include <algorithm>\n#include <iostream>\n#include <stdexcept>\n#include <string>\n#include <vector>\nusing namespace std;\n\nclass Step {\nprivate:\n    int order;\n    string leg;\npublic:\n    // (a) Step(int order, string leg): store both; throw\n    //     invalid_argument(\"order must be 1 or more\") when order < 1\n    // (b) int getOrder() const\n    // (c) friend declarations of operator<< and operator<\n};\n\n// (d) operator<< prints the order, a space, then the leg\n// (e) operator< compares by order\n\nint main() {\n    // (f) on paper: ifstream in(\"route.txt\"); here the rows arrive on cin.\n    // Push one Step per row into a vector<Step>; catch a bad row by reference,\n    // print \"skipped: \" and what(), and keep reading. Sort, print each Step,\n    // then print \"last step \" and the last Step's order.\n    return 0;\n}\n", "stdin": "3 job\n1 island\n0 test\n2 Lith\n5 2nd-job\n4 10-30", "expected": "skipped: order must be 1 or more\n1 island\n2 Lith\n3 job\n4 10-30\n5 2nd-job\nlast step 5", "hints": ["(a) <code>Step(int order, string leg) : order(order), leg(leg) { if (order &lt; 1) { throw invalid_argument(\"order must be 1 or more\"); } }</code>", "(f) Put the <code>try</code> inside the <code>while (cin &gt;&gt; order &gt;&gt; leg)</code> loop, around <code>route.push_back(Step(order, leg));</code>, so one bad row does not end the reading.", "<code>sort(route.begin(), route.end());</code> uses your <code>operator&lt;</code>. After the sort, <code>route.back()</code> is the Step with the largest order: print its <code>getOrder()</code>."], "solution": "#include <algorithm>\n#include <iostream>\n#include <stdexcept>\n#include <string>\n#include <vector>\nusing namespace std;\n\nclass Step {\nprivate:\n    int order;\n    string leg;\npublic:\n    Step(int order, string leg) : order(order), leg(leg) {\n        if (order < 1) {\n            throw invalid_argument(\"order must be 1 or more\");\n        }\n    }\n    int getOrder() const { return order; }\n    friend ostream& operator<<(ostream& os, const Step& step);\n    friend bool operator<(const Step& a, const Step& b);\n};\n\nostream& operator<<(ostream& os, const Step& step) {\n    os << step.order << \" \" << step.leg;\n    return os;\n}\n\nbool operator<(const Step& a, const Step& b) {\n    return a.order < b.order;\n}\n\nint main() {\n    vector<Step> route;\n    int order;\n    string leg;\n    while (cin >> order >> leg) {\n        try {\n            route.push_back(Step(order, leg));\n        } catch (const invalid_argument& e) {\n            cout << \"skipped: \" << e.what() << endl;\n        }\n    }\n    sort(route.begin(), route.end());\n    for (const Step& s : route) {\n        cout << s << endl;\n    }\n    cout << \"last step \" << route.back().getOrder() << endl;\n    return 0;\n}\n"}
```

## Try it

```quiz
[
  { "q": "`operator+` returns a new Fraction and never reduces it. What does this print?", "code": "#include <iostream>\nusing namespace std;\n\nclass Fraction {\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int n, int d) : numerator(n), denominator(d) {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    friend Fraction operator+(const Fraction& a, const Fraction& b);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nFraction operator+(const Fraction& a, const Fraction& b) {\n    return Fraction(a.numerator * b.denominator + b.numerator * a.denominator,\n                    a.denominator * b.denominator);\n}\n\nint main() {\n    Fraction quarter(1, 4);\n    cout << quarter + quarter << \" \" << quarter << endl;\n    return 0;\n}", "options": ["8/16 1/4", "2/4 1/4", "1/2 1/4", "8/16 8/16"], "answer": 0, "explain": "1. `quarter + quarter` is $(1 \\times 4 + 1 \\times 4) / (4 \\times 4) = 8/16$; nothing divides out the common factor.\n2. Both parameters are `const Fraction&`, and the result is a new object, so `quarter` still prints `1/4`." },
  { "q": "This `operator==` compares member by member. What does the program print?", "code": "#include <iostream>\nusing namespace std;\n\nclass Fraction {\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int n, int d) : numerator(n), denominator(d) {}\n    friend bool operator==(const Fraction& a, const Fraction& b);\n};\n\nbool operator==(const Fraction& a, const Fraction& b) {\n    return a.numerator == b.numerator && a.denominator == b.denominator;\n}\n\nint main() {\n    cout << boolalpha;\n    cout << (Fraction(1, 2) == Fraction(2, 4)) << endl;\n    cout << (Fraction(1, 2) == Fraction(1, 2)) << endl;\n    return 0;\n}", "options": ["false\ntrue", "true\ntrue", "true\nfalse", "false\nfalse"], "answer": 0, "explain": "1. `Fraction(1, 2) == Fraction(2, 4)` compares 1 with 2, which differ, so the line is `false` although the two are equal as numbers.\n2. `Fraction(1, 2) == Fraction(1, 2)` matches on both members: `true`.\n3. Cross-multiplying, 1 × 4 == 2 × 2, would give `true` on the first line." },
  { "q": "`sort(v.begin(), v.end());` on a `vector<Fraction>` compiles when Fraction has `operator==` but no `operator<`.", "type": "tf", "answer": false, "explain": "1. `sort` orders the elements by asking which of two is smaller.\n2. The Week 4 slide: the standard library's algorithms \"always expect `operator<`\".\n3. With only `==`, g++ stops inside `sort` with no match for `operator<`." },
  { "q": "The getter is written `int getNumerator() { return numerator; }`, with no `const` after the parentheses. What happens to `const Fraction half(1, 2); cout << half.getNumerator();`?", "options": ["It does not compile: a const object can call only const member functions", "It prints 1", "It prints 0, because half is const", "It compiles but crashes at run time"], "answer": 0, "explain": "1. `half` is a `const Fraction`.\n2. A non-const member function might change the object, so g++ refuses the call: \"passing 'const Fraction' as 'this' argument discards qualifiers\".\n3. Adding `const` after the parentheses fixes it." }
]
```

## Remember

- `operator+` returns a new Fraction and leaves both operands unchanged.
- Compare fractions by cross-multiplying, never member by member.
- `sort` needs `operator<`, and a getter needs `const` to be called on a const object.
- *On the sheet:* Sheet side 2, band 3 "Write the function / class / program", Fraction. Sheet side 2, band 4 "True/false and multiple choice traps", STL.

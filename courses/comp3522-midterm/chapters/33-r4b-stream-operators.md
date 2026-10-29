---
title: "Core 9: the stream operators as friends that return the stream (Q24, Q25)"
minutes: 20
---
This lesson writes the two functions that print a Fraction and read one in. They are Q24 and Q25 of the paper, 6 marks, and the paper prints the first line of each.

## What a stream is, in plain words

A stream is a line of characters flowing between your program and the outside world. The stream to the screen is called `cout`, and the stream from the keyboard is called `cin`.

The arrows show the direction. The arrow `<<` pushes a value into an output stream, and the arrow `>>` pulls a value out of an input stream.

The streams already know how to print a number or a word. They have never heard of a Fraction, so printing one needs a function you write.

That function has a special name, `operator<<`. Writing `cout << half` is the same as calling `operator<<(cout, half)`.

## Why it is a friend, and why it hands the stream back

The function cannot live inside Fraction. A member operator belongs to the class on its left, and on the left of `cout << half` stands `cout`, a class you cannot edit.

So the function sits outside the class. A friend is an outside function that the class names inside its body, which lets it open the private lid.

One output line often prints several things. Each `<<` is a separate call, and each call must hand the stream back so the next one has something on its left.

```diagram
{ "type": "flow", "title": "One chained output statement, call by call", "nodes": [
  { "id": "c1", "label": "operator<<(cout, half)", "sub": "writes 1/2, returns cout" },
  { "id": "c2", "label": "cout << \" and \"", "sub": "returns cout" },
  { "id": "c3", "label": "operator<<(cout, typed)", "sub": "writes 3/4, returns cout" },
  { "id": "c4", "label": "cout << endl", "sub": "newline" }
], "edges": [ { "from": "c1", "to": "c2" }, { "from": "c2", "to": "c3" }, { "from": "c3", "to": "c4" } ], "hi": ["c1", "c3"], "caption": "Each call's result is the left operand of the next. A void operator<< leaves << \" and \" with nothing on its left, and the line does not compile." }
```

## A tiny program you can run in your head

```cpp run pin PrintFraction.cpp
// predict: Write the line printed.
#include <iostream>
using namespace std;

class Fraction {
    int numerator;
    int denominator;
public:
    Fraction(int n, int d) : numerator(n), denominator(d) {}
    friend ostream& operator<<(ostream& os, const Fraction& f);
};

ostream& operator<<(ostream& os, const Fraction& f) {
    os << f.numerator << "/" << f.denominator;
    return os;
}

int main() {
    Fraction half(1, 2);
    Fraction third(1, 3);
    cout << half << " and " << third << endl;
}
```

1. `cout << half << " and " << third << endl;` runs from the left. The first call writes `1/2` through `os << f.numerator << "/" << f.denominator;`, then `return os;` hands cout to `<< " and "`, and the second call writes `1/3`. The line is `1/2 and 1/3`.

The function never names `cout`. It writes to whichever stream it was handed, which is why it works for files too.

## The rules, in the slide's words

- **Friends.** The Week 4 slide: "A friend declaration grants a function (or another class) access to private and protected members; the declaration appears in the class body; the definition appears outside the class body."
- **Output.** The canonical form is `friend std::ostream& operator<<(std::ostream& os, const T& obj) { os << obj.myString; return os; }`. It takes `const T&`, because printing changes nothing.
- **Input.** The canonical form is `friend std::istream& operator>>(std::istream& is, T& obj) { is >> obj.myVar; return is; }`. It takes a plain `T&`, because reading writes into the object.

:::warn The two marks people lose
Write to `os`, never to `cout`, and end with `return os;`. Without the return, every chained `<<` after the Fraction has nothing on its left.
:::

## The paper's question, worked

The model answer below has the Q21 constructor and both friends. Its stdin box plays the keyboard.

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

1. `Fraction half(1, 2);` passes the check, and its body prints `made 1/2`.
2. `Fraction typed(0, 1);` prints `made 0/1`. A denominator of 1 passes, and only 0 throws.
3. `cin >> typed;` is the call `operator>>(cin, typed)`, which reads 3 and 4 straight into typed's members and prints nothing. Then `cout << half << " and " << typed << endl;` prints `1/2 and 3/4`.
4. `Fraction bad(5, 0);` throws before its print, so `never printed` is skipped. The handler prints `caught: Denominator cannot be zero`.

```widget
op-dispatch
{ "expr": "cout << a" }
```

The two objects of that run, after `cin >> typed;`:

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

## Write Q24 and Q25

Q24 and Q25 come from band 3's two `friend` operators: move each body below the class under the paper's first line, and rename `f` to `fraction`.

### Q24 (3 marks): the insertion operator

```challenge
{"prompt": "Q24. Write the insertion operator as a friend: the <code>friend</code> declaration inside the class, the definition outside with the paper's first line. Write <code>numerator/denominator</code> to <code>os</code> and return <code>os</code>.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    // Q24: the friend declaration goes here\n};\n\n// Q24: the paper prints this first line\n// ostream& operator<<(ostream& os, const Fraction& fraction) {\n\nint main() {\n    Fraction a(1, 2);\n    Fraction b(7, 8);\n    cout << a << \" < \" << b << endl;\n    return 0;\n}\n", "expected": "1/2 < 7/8", "hints": ["Inside the class: <code>friend ostream&amp; operator&lt;&lt;(ostream&amp; os, const Fraction&amp; fraction);</code>", "Body: <code>os &lt;&lt; fraction.numerator &lt;&lt; \"/\" &lt;&lt; fraction.denominator;</code>", "Last line: <code>return os;</code> (without it, <code>&lt;&lt; \" &lt; \"</code> has no left operand)."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nint main() {\n    Fraction a(1, 2);\n    Fraction b(7, 8);\n    cout << a << \" < \" << b << endl;\n    return 0;\n}\n"}
```

### Q25 (3 marks): the extraction operator

```challenge
{"prompt": "Q25. Write the extraction operator as a friend with the paper's first line: read the two ints from <code>is</code> into <code>fraction</code>'s members and return <code>is</code>. The stdin box holds two rows.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    // Q25: the friend declaration goes here\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\n// Q25: the paper prints this first line\n// istream& operator>>(istream& is, Fraction& fraction) {\n\nint main() {\n    Fraction f(0, 1);\n    Fraction g(0, 1);\n    cin >> f >> g;\n    cout << f << \" \" << g << endl;\n    return 0;\n}\n", "stdin": "2 3\n9 10", "expected": "2/3 9/10", "hints": ["Inside the class: <code>friend istream&amp; operator&gt;&gt;(istream&amp; is, Fraction&amp; fraction);</code>", "Body: <code>is &gt;&gt; fraction.numerator &gt;&gt; fraction.denominator;</code>", "Last line: <code>return is;</code>, so <code>cin &gt;&gt; f &gt;&gt; g</code> chains."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}\n    ~Fraction() {}\n    friend ostream& operator<<(ostream& os, const Fraction& fraction);\n    friend istream& operator>>(istream& is, Fraction& fraction);\n};\n\nostream& operator<<(ostream& os, const Fraction& fraction) {\n    os << fraction.numerator << \"/\" << fraction.denominator;\n    return os;\n}\n\nistream& operator>>(istream& is, Fraction& fraction) {\n    is >> fraction.numerator >> fraction.denominator;\n    return is;\n}\n\nint main() {\n    Fraction f(0, 1);\n    Fraction g(0, 1);\n    cin >> f >> g;\n    cout << f << \" \" << g << endl;\n    return 0;\n}\n"}
```

| Part | Marks | What earns them |
|---|---|---|
| Q24 | 3 | Declared `friend`, writes to `os` and not `cout`, takes `const Fraction&`, and **returns `os`**. |
| Q25 | 3 | Declared `friend`, reads into the non-const `Fraction&`, and **returns `is`**. |

## Try it

```quiz
[
  { "q": "The stdin box is changed to `3 0` and the program runs again. What does the third line show?", "options": ["`1/2 and 3/0`", "`caught: Denominator cannot be zero`", "`1/2 and 0/1`", "nothing: the program stops at `cin >> typed;`"], "answer": 0, "explain": "1. `cin >> typed;` calls `operator>>`, which writes 3 and 0 straight into the private members.\n2. No constructor runs, so the `denominator == 0` check never runs either.\n3. The output line prints `1/2 and 3/0`.\n4. The fourth line is still `caught: ...`, from `Fraction bad(5, 0)`. To guard input as well, `operator>>` would have to check (or build a Fraction with the constructor) itself." },
  { "q": "Why is `operator<<` for Fraction written as a friendly non-member and not as a member function of Fraction?", "options": ["the left operand of `cout << half` is an `ostream`, and a member operator belongs to its left operand's class", "a member function cannot return a reference to a stream", "friend functions run faster because they skip the `this` pointer", "member functions cannot read private data members"], "answer": 0, "explain": "1. `cout << half` is the call `operator<<(cout, half)`.\n2. A member operator is a member of the left operand's type, here `ostream`, which you cannot edit.\n3. So it is a non-member; it needs `friend` only because it reads the private `numerator` and `denominator`." },
  { "q": "Q24 is written with `void operator<<(ostream& os, const Fraction& fraction)` and the same body without `return os;`. Which statement still compiles?", "options": ["`cout << half;`", "`cout << half << endl;`", "`cout << \"x\" << half << endl;`", "none of them"], "answer": 0, "explain": "1. `cout << half;` is one call; its result is thrown away, so `void` is fine.\n2. `cout << half << endl;` needs the result of `cout << half` as the left operand of `<< endl`; a `void` result has none, so it does not compile.\n3. The third line has the same problem after `half`.\n4. Returning `ostream&` is what earns the chaining mark." },
  { "q": "This Q25 compiles: `istream& operator>>(istream& is, const Fraction& fraction) { is >> fraction.numerator >> fraction.denominator; return is; }`", "type": "tf", "answer": false, "explain": "1. Through a `const Fraction&` the members are read-only.\n2. `is >> fraction.numerator` must write into an `int`, and there is no `>>` that writes into a `const int`, so g++ rejects it.\n3. The paper's signature has a plain `Fraction&` for exactly this reason; `const` belongs on the Q24 parameter." },
  { "type": "free", "q": "Why must `operator<<` for Fraction return `ostream&` and not `void`?", "model": "`operator<<` is the function that runs for `cout << half`, written as a friendly non-member because its left operand is a stream. A `void` version prints one Fraction, but a chain like `cout << half << endl` groups from the left, so the next `<<` needs the stream back as its left operand. So the body ends `return os;`, and the return type is `ostream&`, a reference to the same stream, not a copy.", "points": ["`cout << a << b` groups from the left: `(cout << a) << b`", "the result of the first call is the left operand of the next", "a `void` result leaves the next `<<` with nothing on its left, so the chain does not compile", "it returns `os` by reference, `ostream&`, the same stream and not a copy"], "rows": 4, "explain": "1. Name it: the insertion operator, a friendly non-member.\n2. Contrast: a `void` version works for a single `cout << half;` and fails in a chain.\n3. One line of code: `return os;` as its last line." }
]
```

## Remember

- `cout << half` is the call `operator<<(cout, half)`, so the operator lives outside Fraction as a friend.
- Each operator returns the stream it was handed, so a chain keeps going.
- `operator>>` takes a plain `Fraction&` and writes straight into the members, with no constructor and no check.
- *On the sheet:* Sheet side 2, band 3 "Write the function / class / program", Fraction.

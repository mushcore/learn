---
title: Operator overloading: the canonical forms
minutes: 30
---

`cout << myObject` reads better than `cout << myObject.getInfo()`, and `a + b` reads better than `a.add(b)`. C++ lets a user-defined type customize any of 38 operators (no, you do not memorize the list). Each one is a function with a special name, and each has a canonical form the slides expect you to reproduce.

## Rules before syntax

- Adhere to the operator's commonly known semantics; if the meaning is not obviously clear, do not overload it.
- If you provide one operation from a set, provide them all: overload `+` and you overload `+=`; overload prefix `++` and you overload postfix `++`.
- An operator is overloaded as a function named `operator+=`, `operator<=`, `operator<<`. It is either a **member function of the left operand's type** or a **friendly non-member function**; a non-member that must read private members is declared a friend.

| Operator kind | Overloaded as | Why |
|---|---|---|
| unary `!`, `~`, `++`, `--` | member | operates on a single object (self) |
| assignment `=`, `+=`, `-=` | member | modifies the left-hand object |
| comparison `==`, `!=`, `<`, `>` | non-member (friend) | symmetric comparison between two objects |
| arithmetic `+`, `-`, `*`, `/` | non-member (friend) | flexibility for non-class types (`int + MyClass`) |
| stream `<<`, `>>` | non-member (friend) | the left operand is a `std::ostream` / `std::istream`, not your class |

```widget
op-dispatch
```

## Insertion and extraction

```cpp run pin Date.cpp
// stdin: 12 25 26
// predict: Input is 12 25 26. Write the two lines printed.
#include <iostream>
using namespace std;

class Date
{
    int mo, da, yr;
public:
    Date(int m, int d, int y) : mo(m), da(d), yr(y) { }
    friend ostream& operator<<(ostream& os, const Date& dt);
    friend istream& operator>>(istream& input, Date& dt)
    {
        input >> dt.mo >> dt.da >> dt.yr;
        return input;
    }
};

ostream& operator<<(ostream& os, const Date& dt)
{
    os << dt.mo << '/' << dt.da << '/' << dt.yr;
    return os;
}

int main()
{
    Date dt(5, 6, 92);
    cout << dt << endl;   // 5/6/92
    cin >> dt;
    cout << dt << endl;
    return 0;
}
```

`friend ostream& operator<<(ostream& os, const Date& dt);` is the canonical insertion operator, the most commonly overloaded of all. Its left operand is `cout`, an object of a class you cannot edit, so it cannot be a member of `Date`; it is a non-member, and a friend so it may read `dt.mo`. It takes the Date by `const&` and **returns the stream by reference**, `return os;`, which is what lets `cout << dt << endl` chain. The extraction operator `friend istream& operator>>(istream& input, Date& dt)` is the mirror image with two differences: the Date is a non-const reference because it is being filled, and the body reads instead of writes. A friend may be defined inline inside the class, as `>>` is here, or outside like `<<`; both are still non-members.

## Comparisons: write two, derive four

The standard library's algorithms and containers always expect `operator<` to be present, and there are six comparisons you should usually define. Only `==` and `<` do real work:

```cpp
friend bool operator==(const X& lhs, const X& rhs) { /* do actual comparison */ }
friend bool operator!=(const X& lhs, const X& rhs) { return !operator==(lhs, rhs); }   // or !(lhs == rhs)
friend bool operator< (const X& lhs, const X& rhs) { /* do actual comparison */ }
friend bool operator> (const X& lhs, const X& rhs) { return  operator< (rhs, lhs); }   // or rhs < lhs
friend bool operator<=(const X& lhs, const X& rhs) { return !operator> (lhs, rhs); }   // lhs is not greater than rhs
friend bool operator>=(const X& lhs, const X& rhs) { return !operator< (lhs, rhs); }   // lhs is not less than rhs
```

Read the last two the way the slide does: "less than or equal" is "not greater than"; "greater than or equal" is "not less than".

```cpp run pin CharacterCompare.cpp
// predict: Write the six true/false lines. Only == and < compare chars; the other four call them.
#include <iostream>
using namespace std;

class Character {
    char c;
public:
    Character(char c = ' ') : c(c) {}
    friend bool operator==(const Character& lhs, const Character& rhs) { return lhs.c == rhs.c; }
    friend bool operator!=(const Character& lhs, const Character& rhs) { return !operator==(lhs, rhs); }
    friend bool operator< (const Character& lhs, const Character& rhs) { return lhs.c < rhs.c; }
    friend bool operator> (const Character& lhs, const Character& rhs) { return  operator< (rhs, lhs); }
    friend bool operator<=(const Character& lhs, const Character& rhs) { return !operator> (lhs, rhs); }
    friend bool operator>=(const Character& lhs, const Character& rhs) { return !operator< (lhs, rhs); }
};

int main() {
    Character char1('A');
    Character char2('B');
    cout << boolalpha;
    cout << "char1 less than char2?: " << (char1 < char2) << endl;
    cout << "char1 > char2: " << (char1 > char2) << endl;
    cout << "char1 <= char2: " << (char1 <= char2) << endl;
    cout << "char1 >= char2: " << (char1 >= char2) << endl;
    cout << "char1 >= char1: " << (char1 >= char1) << endl;
    cout << "char1 != char2: " << (char1 != char2) << endl;
    return 0;
}
```

This is the shipped operators project's `Character` with only the comparisons kept, and `char1('A')`, `char2('B')` are the project's own objects.

## Increment: prefix, postfix and the dummy int

```cpp run pin Counter.cpp
// predict: Write the three numbers printed.
#include <iostream>
using namespace std;

class Counter {
    int n = 0;
public:
    Counter& operator++() {          // Prefix: ++counter
        ++n;                          // do actual increment
        return *this;
    }
    Counter operator++(int) {        // Postfix: counter++ (the int is a dummy)
        Counter tmp(*this);          // copy original value
        operator++();                // internal increment
        return tmp;                  // return non incremented original value
    }
    int value() const { return n; }
};

int main() {
    Counter c;
    Counter a = ++c;
    Counter b = c++;
    cout << a.value() << " " << b.value() << " " << c.value() << endl;
    return 0;
}
```

Prefix and postfix have the same name, so the postfix form takes a dummy, unused `int` to tell them apart: `Counter operator++(int)`. Prefix increments and returns `*this` by reference. Postfix copies the original into `tmp`, calls the prefix version with `operator++();`, and returns the **copy**, by value, so the caller sees the old value. Postfix is defined in terms of prefix and performs an extra copy, so it is slightly slower; that is why C++ loops are written `for (int i = 0; i < upperBound; ++i)`. Both are members because they are unary.

## Addition: `+=` does the work, `+` copies

```cpp run pin Character.cpp
// predict: Write the four lines printed (the character after each label).
#include <iostream>
using namespace std;

class Character {
    char c;
public:
    Character(char c = ' ') : c(c) {}
    Character& operator+=(const Character& rhs) {   // member: modifies the left operand
        c += rhs.c;
        return *this;
    }
    friend Character operator+(Character lhs, const Character& rhs);
    friend ostream& operator<<(ostream& os, const Character& ch) {
        os << "Character: " << ch.c;
        return os;
    }
};

Character operator+(Character lhs, const Character& rhs) {   // non-member, lhs is a COPY
    lhs += rhs;
    return lhs;
}

int main() {
    Character a('A');      // 65
    Character one(1);
    a += one;              // a.operator+=(one)
    cout << "after +=: " << a << endl;
    Character b = a + one; // operator+(a, one): a is copied, a itself unchanged
    cout << "a: " << a << endl;
    cout << "b: " << b << endl;
    cout << "sum: " << a + Character(2) << endl;
    return 0;
}
```

`Character& operator+=(const Character& rhs)` is the member that changes the left operand and returns it by reference. `Character operator+(Character lhs, const Character& rhs)` is the friendly non-member that takes its **left parameter by copy**, adds with `lhs += rhs;`, and returns that copy: `a + b` is expected to be a new value, so `operator+` returns a new value, and `a` is untouched by the line `Character b = a + one;`. The shipped operators project does the same on a `Character` holding `'A'` and `'B'`; this version adds small numbers so every result stays a printable letter.

## Trace `Money`, `Ticket` and `Version` operators, then write `Vec2`'s

Four new classes with canonical operators: money that adds in cents, a ticket counter that steps by 3, and a two-part version number.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Money {\n    int cents;\npublic:\n    Money(int c = 0) : cents(c) {}\n    Money& operator+=(const Money& rhs) { cents += rhs.cents; return *this; }\n    friend Money operator+(Money lhs, const Money& rhs) { lhs += rhs; return lhs; }\n    friend ostream& operator<<(ostream& os, const Money& m) {\n        os << '$' << m.cents / 100 << '.' << (m.cents % 100 < 10 ? \"0\" : \"\") << m.cents % 100;\n        return os;\n    }\n};\n\nint main() {\n    Money a(150), b(275);\n    Money c = a + b;\n    a += b;\n    a += c;\n    cout << a << \" \" << b << \" \" << c << endl;\n    return 0;\n}",
    "options": [
      "`$8.50 $2.75 $4.25`",
      "`$11.25 $2.75 $4.25`",
      "`$4.25 $2.75 $4.25`",
      "`$8.50 $7.00 $4.25`"
    ],
    "answer": 0,
    "explain": "`operator+` takes its left operand by copy, so `a + b` adds 150 + 275 = 425 into the copy and leaves a at 150: c = 425. `a += b` makes a 150 + 275 = 425, then `a += c` makes it 425 + 425 = 850. b never changes. Printed as dollars: `$8.50 $2.75 $4.25`. If `+` modified its left operand, a would be 425 before the two `+=` and end at 1125."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Ticket {\n    int n;\npublic:\n    Ticket(int start) : n(start) {}\n    Ticket& operator++() { n += 3; return *this; }\n    Ticket operator++(int) { Ticket tmp(*this); operator++(); return tmp; }\n    int value() const { return n; }\n};\n\nint main() {\n    Ticket t(10);\n    Ticket a = t++;\n    Ticket b = ++t;\n    Ticket c = ++(++t);\n    cout << t.value() << \" \" << a.value() << \" \" << b.value() << \" \" << c.value() << endl;\n    return 0;\n}",
    "answer": [
      "22 10 16 22"
    ],
    "explain": "Prefix adds 3 and returns `*this`; postfix copies, calls prefix, returns the copy. t = 10. `a = t++`: a gets the old 10, t becomes 13. `b = ++t`: t becomes 16 and b copies 16. `c = ++(++t)`: the inner prefix returns t itself by reference, so the outer one increments t again: 16 to 19 to 22, and c = 22. Printed in the order t, a, b, c: `22 10 16 22`."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Version {\n    int release, patch;\npublic:\n    Version(int r, int p) : release(r), patch(p) {}\n    friend bool operator==(const Version& l, const Version& r) { return l.release == r.release && l.patch == r.patch; }\n    friend bool operator!=(const Version& l, const Version& r) { return !(l == r); }\n    friend bool operator<(const Version& l, const Version& r) {\n        return l.release < r.release || (l.release == r.release && l.patch < r.patch);\n    }\n    friend bool operator>(const Version& l, const Version& r) { return r < l; }\n    friend bool operator<=(const Version& l, const Version& r) { return !(l > r); }\n    friend bool operator>=(const Version& l, const Version& r) { return !(l < r); }\n};\n\nint main() {\n    Version v1(2, 10), v2(3, 1), v3(2, 10);\n    cout << boolalpha << (v1 < v2) << \" \" << (v2 <= v1) << \" \"\n         << (v1 >= v3) << \" \" << (v1 != v3) << endl;\n    return 0;\n}",
    "options": [
      "`true false true false`",
      "`true true true false`",
      "`true false false false`",
      "`false false true true`"
    ],
    "answer": 0,
    "explain": "Only `==` and `<` compare fields. `v1 < v2`: release 2 < 3, true. `v2 <= v1` is `!(v2 > v1)` = `!(v1 < v2)` = `!true` = false. `v1 >= v3` is `!(v1 < v3)`: 2.10 is not less than 2.10, so `!false` = true. `v1 != v3` is `!(v1 == v3)` = `!true` = false."
  },
  {
    "q": "Complete the canonical extraction operator (same text in both blanks). With input `4 7` it prints `4.7`.",
    "type": "fill",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Version {\n    int release, patch;\npublic:\n    Version() : release(0), patch(0) {}\n    friend ___ operator>>(___ in, Version& v) {\n        in >> v.release >> v.patch;\n        return in;\n    }\n    friend ostream& operator<<(ostream& os, const Version& v) {\n        return os << v.release << '.' << v.patch;\n    }\n};\n\nint main() {\n    Version v;\n    cin >> v;\n    cout << v << endl;\n    return 0;\n}",
    "answer": [
      "istream&",
      "istream&"
    ],
    "explain": "`friend istream& operator>>(istream& in, Version& v)`: the stream comes in by reference and goes back out by reference so reads chain (`cin >> v1 >> v2`), and the Version is a non-const reference because it is being filled. Input 4 and 7 go into release and patch; `<<` prints `4.7`."
  }
]
```

```challenge
{"prompt": "Give <code>Vec2</code> its canonical operators: member <code>operator+=</code> returning <code>*this</code> by reference, a friendly non-member <code>operator+</code> that takes its left operand by copy and uses <code>+=</code>, a friendly <code>operator==</code>, and a friendly <code>operator&lt;&lt;</code> that prints <code>(x, y)</code>.", "starter": "#include <iostream>\nusing namespace std;\n\nclass Vec2 {\n    int x, y;\npublic:\n    Vec2(int x = 0, int y = 0) : x(x), y(y) {}\n    // operator+=  member, returns *this by reference\n    // operator+   friendly non-member, written with +=\n    // operator==  friendly non-member\n    // operator<<  prints (x, y)\n};\n\nint main() {\n    Vec2 a(1, 2), b(3, -5);\n    Vec2 c = a + b;\n    a += b;\n    a += Vec2(10, 0);\n    cout << a << \" \" << b << \" \" << c << endl;\n    cout << boolalpha << (c == Vec2(4, -3)) << \" \" << (a == c) << endl;\n    return 0;\n}\n", "expected": "(14, -3) (3, -5) (4, -3)\ntrue false", "hints": ["<code>Vec2&amp; operator+=(const Vec2&amp; rhs) { x += rhs.x; y += rhs.y; return *this; }</code>", "<code>friend Vec2 operator+(Vec2 lhs, const Vec2&amp; rhs) { lhs += rhs; return lhs; }</code>", "<code>friend ostream&amp; operator&lt;&lt;(ostream&amp; os, const Vec2&amp; v)</code> must <code>return os;</code>"], "solution": "#include <iostream>\nusing namespace std;\n\nclass Vec2 {\n    int x, y;\npublic:\n    Vec2(int x = 0, int y = 0) : x(x), y(y) {}\n    Vec2& operator+=(const Vec2& rhs) {\n        x += rhs.x;\n        y += rhs.y;\n        return *this;\n    }\n    friend Vec2 operator+(Vec2 lhs, const Vec2& rhs) {\n        lhs += rhs;\n        return lhs;\n    }\n    friend bool operator==(const Vec2& lhs, const Vec2& rhs) {\n        return lhs.x == rhs.x && lhs.y == rhs.y;\n    }\n    friend ostream& operator<<(ostream& os, const Vec2& v) {\n        os << \"(\" << v.x << \", \" << v.y << \")\";\n        return os;\n    }\n};\n\nint main() {\n    Vec2 a(1, 2), b(3, -5);\n    Vec2 c = a + b;\n    a += b;\n    a += Vec2(10, 0);\n    cout << a << \" \" << b << \" \" << c << endl;\n    cout << boolalpha << (c == Vec2(4, -3)) << \" \" << (a == c) << endl;\n    return 0;\n}\n"}
```
```quiz
[
  {
    "q": "Which is the canonical insertion operator?",
    "options": ["`ostream& Date::operator<<(ostream& os)`", "`friend std::ostream& operator<<(std::ostream& os, const T& obj)`", "`void operator<<(const T& obj)`", "`T operator<<(std::ostream& os)`"],
    "answer": 1,
    "explain": "A friendly non-member taking the stream by reference and the object by const reference, returning the stream so calls chain."
  },
  {
    "q": "Why can `operator<<` for your class not be a member function of your class?",
    "options": ["Members cannot take references", "Its left operand is `cout`, a std::ostream, and a member operator's left operand must be an object of the member's own class", "It must be static", "Streams are private"],
    "answer": 1,
    "explain": "cout << dt calls operator<<(cout, dt): the left operand belongs to a class you cannot edit. Hence non-member, and friend if it reads private data."
  },
  {
    "q": "What does `return os;` in `operator<<` make possible?",
    "options": ["Printing to files", "Chaining: `cout << a << b << endl`", "Returning the object", "Nothing; it is convention"],
    "answer": 1,
    "explain": "Each << returns the stream, so the next << applies to it."
  },
  {
    "q": "Given `operator==` and `operator<` are written, how is `operator>=` defined in the canonical form?",
    "options": ["`return lhs > rhs || lhs == rhs;`", "`return !operator<(lhs, rhs);`", "`return operator<(rhs, lhs);`", "`return !operator==(lhs, rhs);`"],
    "answer": 1,
    "explain": "lhs is greater than or equal to rhs means lhs is not less than rhs: !(lhs < rhs). Similarly > is rhs < lhs, <= is !(lhs > rhs), != is !(lhs == rhs)."
  },
  {
    "q": "The six comparison operators should be implemented as...",
    "options": ["member functions", "friendly non-member functions", "static members", "virtual functions"],
    "answer": 1,
    "explain": "Symmetric comparison between two objects: non-member (friend). The standard library expects operator< in particular."
  },
  {
    "q": "How does the compiler tell `operator++()` (prefix) from the postfix version?",
    "options": ["The postfix version is named `operator++post`", "The postfix version takes a dummy, unused `int` parameter", "The prefix version returns void", "By the order of declaration"],
    "answer": 1,
    "explain": "Counter operator++(int) is postfix; Counter& operator++() is prefix. The int is never used."
  },
  {
    "q": "What does this print?",
    "code": "class Counter {\n    int n = 0;\npublic:\n    Counter& operator++() { ++n; return *this; }\n    Counter operator++(int) { Counter tmp(*this); operator++(); return tmp; }\n    int value() const { return n; }\n};\nint main() {\n    Counter c;\n    Counter b = c++;\n    cout << b.value() << c.value();\n}",
    "options": ["01", "11", "10", "00"],
    "answer": 0,
    "explain": "Postfix saves a copy (0), increments c to 1, returns the copy: b is 0 and c is 1."
  },
  {
    "q": "Why is `++i` preferred over `i++` in `for` loops?",
    "options": ["`i++` does not compile in loops", "Postfix is defined in terms of prefix and makes an extra copy, so it is slightly slower", "`++i` is more portable", "There is no reason"],
    "answer": 1,
    "explain": "The slide: postfix performs an extra copy (the saved original), so prefix is the habit."
  },
  {
    "q": "`friend Fraction operator+(Fraction lhs, const Fraction& rhs) { lhs += rhs; return lhs; }`. Which statements are true? (select all)",
    "options": ["The left operand is taken by copy, so the caller's object is unchanged", "operator+ is defined in terms of operator+=", "operator+ returns a new value (by value), operator+= returns a reference", "operator+ should be a member"],
    "answer": [0, 1, 2],
    "explain": "a + b must be a new value, so the copy is modified and returned; += does the real work and returns *this by reference; + treats both operands equally, so it is a non-member."
  },
  {
    "type": "match",
    "q": "Match each operator to how it is typically overloaded.",
    "pairs": [
      ["`++`, `--`, `!`", "member function (operates on self)"],
      ["`=`, `+=`, `-=`", "member function (modifies the left-hand object)"],
      ["`==`, `<`, `>`", "non-member friend (symmetric comparison)"],
      ["`<<`, `>>`", "non-member friend (left operand is a stream)"]
    ],
    "explain": "The slide's table. Arithmetic + - * / are also non-member friends so that int + MyClass can work."
  },
  {
    "q": "`5 + a` where a is a Fraction with a one-argument constructor from int. This works only if `operator+` is...",
    "options": ["a member of Fraction", "a non-member, so the left operand 5 can be converted to a Fraction", "virtual", "declared const"],
    "answer": 1,
    "explain": "A member operator+ would need the left operand to be a Fraction object; a non-member lets both operands convert: the table's 'flexibility for non-class types'."
  }
]
```

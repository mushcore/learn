---
title: "Extra 14: Week 1 syntax the multiple choice loves"
minutes: 25
---
This lesson teaches six small rules about how C++ turns text into values and values into text. Each one hides behind a multiple-choice option that looks almost right.

## Giving a variable its first value, in plain words

A variable can get its first value in three ways: with an equals sign, with round brackets, or with curly braces. All three make the same kind of box.

They differ when the value does not fit the box. Putting 3.7 into a whole-number box loses the .7, and that loss is called narrowing.

The equals sign and the round brackets cut the fraction off quietly. The curly braces refuse, and the program does not compile.

```diagram
{ "type": "grid", "title": "Putting 3.7 into an int", "nodes": [
  { "id": "h0", "label": "form", "row": 0, "col": 0 },
  { "id": "h1", "label": "result", "row": 0, "col": 1 },
  { "id": "a0", "label": "int y = 3.7;", "row": 1, "col": 0 },
  { "id": "a1", "label": "y is 3", "row": 1, "col": 1 },
  { "id": "b0", "label": "int y(3.7);", "row": 2, "col": 0 },
  { "id": "b1", "label": "y is 3", "row": 2, "col": 1 },
  { "id": "c0", "label": "int y{3.7};", "row": 3, "col": 0 },
  { "id": "c1", "label": "compile error", "row": 3, "col": 1 }
], "hi": ["c1"], "caption": "Braces forbid narrowing: a value that would lose information is a compile error, while = and () truncate." }
```

## A tiny program on the three forms

```cpp run pin init_tiny.cpp
// predict: Write the one printed line.
#include <iostream>
using namespace std;

int main() {
    int a = 3.7;
    int b(3.7);
    int c{3};
    // int d{3.7};   does not compile: narrowing
    cout << a << ' ' << b << ' ' << c << '\n';
    return 0;
}
```

1. `int a = 3.7;` and `int b(3.7);` both drop the fraction. `int c{3};` is fine because 3 fits exactly, so the line is `3 3 3`.

The slide's reason for braces: uniform initialization "prohibits implicit narrowing conversion among built-in types". A whole number into a `double` is not narrowing, so `double y{3};` compiles.

## Dividing whole numbers, in plain words

When both numbers in a division are whole numbers, the answer is a whole number too. The fraction is thrown away, cutting toward zero.

The remainder operator gives what is left over. Its sign follows the number on the left.

Adding one has two spellings. The "after" form hands back the old value and then adds one, and the "before" form adds one first.

```cpp run pin arith_tiny.cpp
// predict: Write the two printed lines.
#include <iostream>
using namespace std;

int main() {
    cout << 9 / 4 << ' ' << 9 % 4 << ' ' << -9 % 4 << ' ' << 9 / 4.0 << '\n';
    int hp = 3;
    int a = hp++;
    int b = ++hp;
    cout << a << ' ' << b << ' ' << hp << '\n';
    return 0;
}
```

1. `9 / 4` is 2 with the fraction dropped, and `9 % 4` is 1. `-9 % 4` keeps the left sign, -1, and `9 / 4.0` has a double, so 2.25: `2 1 -1 2.25`.
2. `int a = hp++;` stores the old 3, then `hp` is 4. `int b = ++hp;` makes it 5 first and stores 5: `3 5 5`.

The rules in short:

- `int / int` truncates toward zero, and one `double` makes it a real division.
- `%` takes the sign of the left operand.
- `x++` gives the old value, then adds one. `++x` adds first, then gives the new value.

## Try it: values and arithmetic

```quiz
[
  {
    "q": "Which declaration does NOT compile?",
    "options": ["`int y{3.7};`", "`int y = 3.7;`", "`int y(3.7);`", "`double y{3};`"],
    "answer": 0,
    "explain": "Slide 54: uniform initialization \"prohibits implicit narrowing conversion\". 3.7 to int loses the fraction, so the braces reject it. The `=` and `( )` forms compile and truncate to 3. `int` to `double` with the constant 3 is not narrowing, so `double y{3};` is fine."
  },
  {
    "q": "What does this print?",
    "code": "int main() {\n    cout << 7 / 2 << ' ' << -7 % 3 << ' ' << 7 % -3 << ' ' << 7.0 / 2;\n}",
    "options": ["3 -1 1 3.5", "3.5 -1 1 3.5", "3 2 -2 3.5", "4 -1 1 3.5"],
    "answer": 0,
    "explain": "1. `7 / 2`: both ints, truncated toward zero: 3.\n2. `-7 % 3`: the result takes the sign of the left operand: -1.\n3. `7 % -3`: left operand positive, so 1.\n4. `7.0 / 2`: one double makes it a double division: 3.5."
  },
  {
    "q": "What does this print?",
    "code": "int main() {\n    int x = 5;\n    int a = x++;\n    int b = ++x;\n    cout << a << ' ' << b << ' ' << x;\n}",
    "options": ["5 7 7", "6 7 7", "5 6 7", "6 6 7"],
    "answer": 0,
    "explain": "1. `x++` yields the old value 5 for `a`, then `x` becomes 6.\n2. `++x` makes `x` 7 first and yields 7 for `b`.\n3. `x` is 7: `5 7 7`."
  }
]
```

## A constant now or a constant at compile time, in plain words

A constant is a variable that can never change after its first value. C++ has two kinds, and they differ in when that first value must be known.

One kind may take its value while the program runs, for example from what the player typed. The other must have its value before the program is even built.

```cpp run pin const_tiny.cpp
// stdin: 42
// predict: Input is 42. Write the one printed line.
#include <iostream>
using namespace std;

int main() {
    constexpr int maxLevel = 200;
    int input;
    cin >> input;
    const int level = input;
    // constexpr int level2 = input;   does not compile
    cout << level << " of " << maxLevel << '\n';
    return 0;
}
```

1. `constexpr int maxLevel = 200;` is fixed when the program is compiled. `cin >> input;` reads 42 while it runs.
2. `const int level = input;` is allowed to take that run-time value. The line prints `42 of 200`.

The slide: "A const can be assigned a value after compile time", but "A constexpr must be assigned a value by compile time".

## Field width and decimals, in plain words

The output stream can pad a value to a minimum width, and it can fix how many digits follow the decimal point. The width tool is forgetful, but the decimals tool is not.

```cpp run pin setw_tiny.cpp
// predict: Write the two printed lines, spaces included.
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    cout << '|' << setw(6) << 7 << '|' << 7 << "|\n";
    cout << fixed << setprecision(2) << 1.0 / 3 << ' ' << 2.5 << '\n';
    return 0;
}
```

1. `setw(6)` pads only the next value, so the first 7 gets five spaces in front. The second 7 has its natural width: `|     7|7|`.
2. `fixed << setprecision(2)` means exactly two digits after the point. It stays set, so 2.5 also gets two: `0.33 2.50`.

The slide: `setw(5)` "sets minimum width for one field only". `fixed` and `setprecision` stay until they are changed.

## When cin meets text it cannot read, in plain words

Reading a number with `cin` stops at the first text that is not a number. The stream then raises a fail flag, and every later read does nothing until the flag is cleared.

The bad text is still waiting in the input. So recovery takes two moves: clear the flag, then throw away the rest of the line.

```diagram
{ "type": "flow", "title": "Input 12 x 30, then 40", "nodes": [
  { "id": "a", "label": "read 12", "sub": "loop body runs" },
  { "id": "b", "label": "x is not a number", "sub": "failbit set, loop ends" },
  { "id": "c", "label": "clear()", "sub": "failbit off" },
  { "id": "d", "label": "ignore(...)", "sub": "drops x 30" },
  { "id": "e", "label": "read 40" }
], "edges": [ { "from": "a", "to": "b" }, { "from": "b", "to": "c" }, { "from": "c", "to": "d" }, { "from": "d", "to": "e" } ], "hi": ["c"], "caption": "Clear the failbit first, then ignore the rest of the line, or the next read fails on the same text." }
```

The slide's hint: "call cin.clear() after an input failure!". The slide's input table says a failed read into an `int` leaves it with "No change". Since C++11, g++ stores 0 in it, and `fail()` reports 1.

## The worked program: all of Week 1 in one run

```cpp run pin r6_week1.cpp
// stdin: 12 x 30\n40
// predict: Input is "12 x 30" then "40" on the next line. Write every line printed.
#include <iostream>
#include <iomanip>
#include <limits>
using namespace std;

int main() {
    int level = 7;
    cout << level / 2 << ' ' << level % 2 << ' ' << -level % 2 << '\n';

    int a = level++;
    int b = ++level;
    cout << a << ' ' << b << ' ' << level << '\n';

    cout << '|' << setw(5) << 42 << '|' << 42 << "|\n";
    double share = 2.0 / 3;
    cout << fixed << setprecision(2) << share << ' ' << 5.0 << '\n';

    int n;
    while (cin >> n) {
        cout << "read " << n << '\n';
    }
    cin.clear();
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cin >> n;
    cout << "after recovery " << n << '\n';
    return 0;
}
```

1. `level / 2` truncates to 3 and `level % 2` is 1. `-level % 2` keeps the left sign: `3 1 -1`.
2. `int a = level++;` stores 7, then `level` is 8. `int b = ++level;` makes it 9 and stores 9: `7 9 9`.
3. `setw(5)` pads only the first 42. The second is printed at its natural width: `|   42|42|`.
4. `2.0 / 3` is a double division, and `fixed << setprecision(2)` rounds it. It stays on for `5.0`: `0.67 5.00`.
5. `while (cin >> n)` reads 12 and prints `read 12`. It then fails on `x`, the loop ends, and 30 is never read.
6. `cin.clear();` resets the flag, and the `ignore` call drops the rest of the line. `cin >> n;` reads 40: `after recovery 40`.

## Reaching a member: the double colon, the dot and the arrow

A namespace is a named group of library names, such as `std`. A class name and a namespace are reached with a double colon.

An object is reached with a dot. An object seen through a pointer, a variable holding its address, is reached with an arrow.

```cpp run pin scope_tiny.cpp
// predict: Write the one printed line.
#include <iostream>
using namespace std;

class Mob {
public:
    static int count() { return 3; }
    int hp = 50;
};

int main() {
    Mob slime;
    Mob* p = &slime;
    std::cout << Mob::count() << ' ' << slime.hp << ' ' << p->hp << '\n';
    return 0;
}
```

1. `std::cout` reaches into the namespace, and `Mob::count()` into the class. `slime.hp` uses the object, and `p->hp` the same object through the pointer: `3 50 50`.

## Try it: constants, output and input

```quiz
[
  {
    "q": "`const int c = input;` compiles when `input` was read with `cin`, but `constexpr int c = input;` does not.",
    "type": "tf",
    "answer": true,
    "explain": "A `const` \"can be assigned a value after compile time\" and never changes afterwards. A `constexpr` \"must be assigned a value by compile time\", and a value typed at run time is not known then."
  },
  {
    "q": "What does this print?",
    "code": "int main() {\n    cout << setw(4) << 30 << 2 << '|' << '\\n';\n    cout << fixed << setprecision(2) << 3.14159 << ' ' << 30.0;\n}",
    "options": ["  302|\n3.14 30.00", "  30   2|\n3.14 30.00", "  302|\n3.14 30", "302|\n3.1 30"],
    "answer": 0,
    "explain": "1. `setw(4)` pads only the next field: `30` becomes two spaces then 30.\n2. The `2` gets no width and follows at once: `  302|`.\n3. `fixed` with `setprecision(2)` means two digits after the point, and both stay set for later values: `3.14 30.00`."
  },
  {
    "q": "The stream reads the text `hello` into an int. What does this print?",
    "code": "int main() {\n    istringstream in(\"hello\");\n    int n = 7;\n    in >> n;\n    cout << n << ' ' << in.fail();\n}",
    "options": ["0 1", "7 1", "7 0", "0 0"],
    "answer": 0,
    "explain": "1. `hello` is not a number, so the extraction fails and sets the failbit: `fail()` is 1.\n2. Since C++11 a failed numeric extraction stores 0, so `n` is 0. (The slide's table says \"No change\" for `hello`; what g++ prints is 0.)\n3. Every later `>>` on this stream fails until `clear()` is called."
  },
  {
    "q": "`while (cin >> n)` has just ended on the input `x`. Which two calls, in this order, let the next `cin >> n` read the following line?",
    "options": ["`cin.clear();` then `cin.ignore(numeric_limits<streamsize>::max(), '\\n');`", "`cin.ignore(numeric_limits<streamsize>::max(), '\\n');` then `cin.clear();`", "`cin.clear();` alone", "`cin.ignore();` alone"],
    "answer": 0,
    "explain": "1. While the failbit is set, every operation on `cin` fails, `ignore` included. So `clear()` comes first (\"Hint: call cin.clear() after an input failure!\").\n2. `clear()` alone leaves `x` in the buffer, and the next `>>` fails on it again.\n3. `ignore(max, '\\n')` then throws away everything up to and including the newline."
  },
  {
    "q": "Which line uses the operators correctly?",
    "options": ["`std::cout << Mob::count() << slime.count();`", "`std.cout << Mob.count();`", "`std::cout << slime::count();`", "`std->cout << Mob::count();`"],
    "answer": 0,
    "explain": "`::` reaches a member of a namespace (`std::cout`) or of a class (`Mob::count()`, a static function). `.` reaches a member of an object (`slime.count()`). A namespace or class name never takes `.` or `->`, and an object never takes `::`."
  }
]
```

## Remember

- Braces refuse narrowing, `int / int` drops the fraction, and `%` follows the left sign.
- After a failed read, call `clear()` before `ignore`, or the next read fails again.
- *On the sheet:* Sheet side 2, band 4 "True/false and multiple choice traps", Week 1.

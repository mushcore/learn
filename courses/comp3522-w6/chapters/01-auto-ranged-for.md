---
title: auto and the ranged for
minutes: 15
---

`map<string, string>::iterator` is a lot to type when the compiler already knows the type, and `for (int i = 0; i < v.size(); i++)` is a lot to write when all you want is every element. `auto` and the ranged for fix both.

## auto deduces the type from the initializer

As a variable type, `auto` specifies that the type of the variable will be *deduced automatically from its initializer*. As a function return type, the return type will be *deduced from the return statements*.

```cpp run pin ex_auto_for.cpp
// predict: Write every line printed (nine lines; the last one is different).
#include <iostream>
#include <vector>
#include <string>
#include <typeinfo>
using namespace std;

auto add(int x, int y) { return x + y; }          // deduced return type (discouraged by the instructor)
auto divide(double x, double y) -> double { return x / y; }  // trailing return type: no deduction

int main() {
    double sum = 5.0;
    auto d = 5.0;          // double
    auto i = 1 + 2;        // int
    auto s = add(5, 6);    // int
    cout << sum << ' ' << d << ' ' << i << ' ' << s << ' ' << divide(7, 2) << endl;
    cout << boolalpha << (typeid(d) == typeid(double)) << ' ' << (typeid(i) == typeid(int)) << endl;

    vector<int> v = {0, 1, 2, 3, 4, 5};
    for (int k = 0; k < (int)v.size(); k++) cout << v[k] << ' ';
    cout << endl;
    for (const int k : v) cout << k << ' ';        // k is a copy
    cout << endl;
    for (const int& k : v) cout << k << ' ';       // const reference
    cout << endl;
    for (auto k : v) cout << k << ' ';             // by value, k is int
    cout << endl;
    for (int& k : v) k *= 10;                      // reference: modifies the vector
    for (int n : {0, 1, 2, 3, 4, 5}) cout << n << ' ';   // braced-init-list
    cout << '\n';
    int a[] = {0, 1, 2, 3, 4, 5};
    for (int n : a) cout << n << ' ';              // array
    cout << '\n';
    for (int n : v) cout << n << ' ';
    cout << '\n';
    return 0;
}
```

`auto d = 5.0;` makes `d` a `double` because the literal is a double; `auto i = 1 + 2;` makes `i` an `int`; `auto s = add(5, 6);` makes `s` whatever `add` returns, an `int`. The `typeid` line checks the first two deductions. The slide's error case is `auto a;` with no initializer: **auto requires an initializer**, because there is nothing to deduce from.

### auto on return types and parameters

`auto add(int x, int y) { return x + y; }` is legal: the return type is deduced from the return statement. The instructor discourages it: using `auto` for variables is fine because the object is right there, but with `auto` on a function we have to dig into the function to find out what it is supposed to be returning.

The slide rule for parameters: `auto` **can't be used with function parameters**. `void add_and_print(auto x, auto y)` "won't work because the compiler can't infer types for function parameters x and y at compile time." C++20 does accept this spelling as an abbreviated function template, so `g++ -std=c++20` compiles it; the slide states the pre-C++20 rule.

### The trailing return type is syntax, not deduction

Instead of `int add(int x, int y);` some people write `auto add(int x, int y) -> int;`. In this case *auto does not perform type inference*, it is just part of the syntax to use a trailing return type. `auto divide(double x, double y) -> double` in the program returns `double` because the arrow says so. The reason people use it is alignment:

```cpp
auto add(int x, int y) -> int;
auto divide(double x, double y) -> double;
auto print_something() -> void;
auto calculate_that(int x, double d) -> string;
```

Every function name starts in the same column, "so easy to read".

### The ranged for and its loop variable

The *ranged for*, also called the for-each loop, is identical to Java's: formally, it executes a for loop over a specified range. The loops after the `typeid` line differ only in what `k` or `n` is:

| Form | What the loop variable is |
|---|---|
| `for (int k = 0; k < (int)v.size(); k++)` | the classic index loop (the slide writes `i < v.size()`, which compares `int` with an unsigned size; `size_type` fixes it in lesson 05) |
| `for (const int k : v)` | a **copy** of the element |
| `for (const int& k : v)` | a **const reference**: no copy, no modification |
| `for (auto k : v)` | by value, `k` is `int` |
| `for (int& k : v) k *= 10;` | a **reference**: writes go into the vector |

The initializer does not have to be a container. `for (int n : {0, 1, 2, 3, 4, 5})` loops over a braced-init-list and `for (int n : a)` over the array `a`. The loop variable does not have to be used: `for (int n : a) std::cout << something_unrelated << ' ';` is a legal way to run a statement six times. The last line shows whether the reference loop changed the vector.

## By value or by reference decides whether the container changes

```cpp run pin refVsValue.cpp
// predict: v starts as {1, 2, 3}. Write the three lines printed.
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    for (int k : v) k *= 10;          // k is a copy: the vector is untouched
    for (int k : v) cout << k << ' ';
    cout << endl;
    for (int& k : v) k *= 10;         // k is a reference: the vector changes
    for (int k : v) cout << k << ' ';
    cout << endl;
    for (const int& k : v) cout << k * 2 << ' ';   // const reference: read without copying
    cout << endl;
    return 0;
}
```

`for (int k : v) k *= 10;` multiplies three copies and throws them away, so the first line is still `1 2 3`. `for (int& k : v) k *= 10;` multiplies the elements themselves: `10 20 30`. Reach for `const int&` when the elements are large objects you only read (no copy per pass), `int&` when you mean to change them, and plain `int` only for small values you will not modify.

```challenge
{ "prompt": "Declare <code>vector&lt;double&gt; prices = {2.5, 4.0, 6.0};</code>, add the elements with a ranged for whose loop variable is a <b>const reference</b>, and print the total with exactly one decimal place.", "starter": "#include <iostream>\n#include <iomanip>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<double> prices = {2.5, 4.0, 6.0};\n    double total = 0.0;\n    // your ranged for here\n\n    cout << fixed << setprecision(1) << total << endl;\n    return 0;\n}\n", "expected": "12.5", "hints": ["The loop header is <code>for (const double&amp; p : prices)</code>.", "<code>total += p;</code> inside the loop; <code>fixed</code> and <code>setprecision(1)</code> are already in the starter."], "solution": "#include <iostream>\n#include <iomanip>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<double> prices = {2.5, 4.0, 6.0};\n    double total = 0.0;\n    for (const double& p : prices) {\n        total += p;\n    }\n    cout << fixed << setprecision(1) << total << endl;\n    return 0;\n}\n" }
```

## Deduce four `auto` types and trace three ranged loops

New initializers for `auto`, then loops whose variable is a copy, a reference or a const reference over strings and an array.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<string> names = {\"ann\", \"bo\", \"cy\"};\n    for (auto n : names) n += \"!\";\n    for (auto& n : names) n[0] = n[0] - 32;    // 'a' - 32 is 'A'\n    string all;\n    for (const auto& n : names) all += n + \" \";\n    cout << all << names.size() << endl;\n    return 0;\n}",
    "options": [
      "`Ann Bo Cy 3`",
      "`Ann! Bo! Cy! 3`",
      "`ann bo cy 3`",
      "`ann! bo! cy! 3`"
    ],
    "answer": 0,
    "explain": "`for (auto n : names)` makes n a copy (auto drops the reference), so the `!` is added to copies and thrown away. `for (auto& n : names)` is a reference: subtracting 32 from the first character turns 'a' (97) into 'A' (65) in the vector itself. The const-reference loop builds `Ann Bo Cy ` and the size is 3."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    auto a = 7 / 2;\n    auto b = 7 / 2.0;\n    auto c = 'A' + 1;\n    auto d = a * b;\n    cout << a << \" \" << b << \" \" << c << \" \" << d << endl;\n    return 0;\n}",
    "answer": [
      "3 3.5 66 10.5"
    ],
    "explain": "`7 / 2` is int division: a is int 3. `7 / 2.0` has a double operand: b is double 3.5. `'A' + 1` promotes the char to int: c is int 66, printed as a number, not `B`. `a * b` is int times double: d is double 3 * 3.5 = 10.5."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a[] = {4, 1, 7};\n    int total = 0;\n    for (int& x : a) x *= 2;\n    for (int x : a) {\n        x += 1;\n        total += x;\n    }\n    cout << total << \" \" << a[0] << endl;\n    return 0;\n}",
    "answer": [
      "27 8"
    ],
    "explain": "The `int&` loop doubles the array in place: {8, 2, 14}. The second loop's x is a copy, so `x += 1` changes only the copy: total = 9 + 3 + 15 = 27, and a[0] is still 8."
  },
  {
    "q": "Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    auto rate = 1.5;\n    auto count = 4;\n    auto total;\n    total = rate * count;\n    cout << total << endl;\n    return 0;\n}",
    "answer": [
      7
    ],
    "explain": "`auto total;` has nothing to deduce the type from: declaration of 'auto total' has no initializer. Write `auto total = rate * count;` (a double, 6) or name the type."
  }
]
```

```challenge
{"prompt": "Add 5 to every score with a ranged for whose loop variable is a <b>reference</b>. Then print each score followed by a space, using a ranged for over a <b>const reference</b>, and keep the largest in <code>best</code>. Move <code>int best = 0;</code> above the second loop.", "starter": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> scores = {70, 90, 60};\n    // 1. add 5 to every score with a ranged for over references\n\n    // 2. print the scores, one space after each, with a const-reference ranged for,\n    //    and track the largest\n\n    int best = 0;\n    cout << endl << \"max \" << best << endl;\n    return 0;\n}\n", "expected": "75 95 65 \nmax 95", "hints": ["<code>for (int&amp; s : scores) s += 5;</code>", "<code>for (const int&amp; s : scores) { cout &lt;&lt; s &lt;&lt; \" \"; if (s &gt; best) best = s; }</code>"], "solution": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> scores = {70, 90, 60};\n    for (int& s : scores) {\n        s += 5;\n    }\n    int best = 0;\n    for (const int& s : scores) {\n        cout << s << \" \";\n        if (s > best) best = s;\n    }\n    cout << endl << \"max \" << best << endl;\n    return 0;\n}\n"}
```
```quiz
[
  {
    "q": "What does `auto a;` do?",
    "options": ["Declares `a` as an `int`", "Declares `a` with an unknown type to be fixed on first assignment", "Does not compile: `auto` requires an initializer", "Declares `a` as a `double`"],
    "answer": 2,
    "explain": "The type is deduced from the initializer, so without one there is nothing to deduce from. The slide marks `auto a;` as an ERROR."
  },
  {
    "q": "After `auto d = 5.0; auto i = 1 + 2; auto s = add(5, 6);` with `int add(int, int)`, the types are...",
    "options": ["double, int, int", "double, double, int", "int, int, int", "double, int, double"],
    "answer": 0,
    "explain": "5.0 is a double literal; 1 + 2 is an int expression; add returns int, so s is int."
  },
  {
    "q": "According to the slides, `void add_and_print(auto x, auto y)` is...",
    "options": ["fine, the compiler deduces x and y at each call", "not allowed: auto can't be used with function parameters because the compiler can't infer their types at compile time", "allowed only if both parameters have the same type", "allowed only for `const` parameters"],
    "answer": 1,
    "explain": "The slide's rule: auto can't be used with function parameters. (C++20 compilers accept it as an abbreviated template, but the quiz follows the slide.)"
  },
  {
    "q": "In `auto add(int x, int y) -> int;`, what does `auto` do?",
    "options": ["Deduces the return type from the return statements", "Nothing: it is part of the trailing-return-type syntax; the type after `->` is the return type", "Makes the function a template", "Makes the return type `int` only if both arguments are `int`"],
    "answer": 1,
    "explain": "With a trailing return type auto performs no type inference. People use the form so that declarations line up (auto add(...) -> int; auto divide(...) -> double;)."
  },
  {
    "q": "Why does the instructor discourage `auto` as a function return type?",
    "options": ["It does not compile in C++20", "It is slower at run time", "The reader has to dig into the function to find out what it returns; a variable's `auto` has the object right there", "It only works for `int`"],
    "answer": 2,
    "explain": "auto for variables is fine because the initializer is on the same line; auto for functions hides the return type inside the body."
  },
  {
    "q": "What does this print?",
    "code": "vector<int> v = {1, 2, 3};\nfor (int k : v) k = 0;\nfor (int k : v) cout << k;",
    "options": ["000", "123", "0", "nothing: it does not compile"],
    "answer": 1,
    "explain": "In `for (int k : v)` k is a copy of each element; assigning to the copy leaves the vector unchanged. `for (int& k : v)` would have zeroed it."
  },
  {
    "q": "Which loop header lets you read large elements without copying them and without the risk of modifying them?",
    "options": ["`for (auto k : v)`", "`for (int& k : v)`", "`for (const int& k : v)`", "`for (int k : v)`"],
    "answer": 2,
    "explain": "A const reference aliases the element (no copy) and the compiler rejects writes through it. auto k and int k copy; int& allows modification."
  },
  {
    "q": "The initializer of a ranged for must be a vector.",
    "type": "tf",
    "answer": false,
    "explain": "The slides show a braced-init-list (`for (int n : {0, 1, 2, 3, 4, 5})`) and an array (`int a[] = {...}; for (int n : a)`). Any range with begin and end works."
  },
  {
    "q": "The ranged for is C++'s version of which Java construct?",
    "type": "text",
    "answer": ["for-each", "for each", "foreach", "for-each loop", "enhanced for"],
    "explain": "The slide: the ranged for, aka the for-each loop, is identical to Java's; formally it executes a for loop over a specified range."
  }
]
```

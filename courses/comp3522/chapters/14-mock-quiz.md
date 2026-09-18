---
title: Mock Quiz 1
minutes: 45
---

51 questions in the real format: multiple choice, true/false, select-all, and matching rendered as multiple choice. Answer everything, then check — each explanation says *why*, so a wrong answer is still a lesson.

:::quiz Real quiz conditions
Written at the start of lab on the Learning Hub. It covers the Week 1 slides **and the Week 1 sample code**. Aim for 90% here before you stop studying.
:::

```quiz
[
  {
    "q": "Which operator accesses a member of a **namespace or class**?",
    "options": ["`.`", "`::`", "`->`", "`>>`"],
    "answer": 1,
    "explain": "`::` is the scope resolution operator (`std::cout`, `ios_base::hex`). The dot accesses members of an object instance."
  },
  {
    "q": "`#include <iostream>` must be followed by a semicolon.",
    "type": "tf",
    "answer": false,
    "explain": "Preprocessor directives are instructions for the preprocessor, not the compiler, and end at the newline — never with a semicolon."
  },
  {
    "q": "What is `std::cout`?",
    "options": ["a function", "a keyword", "a predefined object of type `ostream`", "a preprocessor macro"],
    "answer": 2,
    "explain": "cout is a global object of class ostream declared in <iostream>; `<<` is an overloaded member function called on it."
  },
  {
    "q": "`std::endl` does what that `'\\n'` does not?",
    "options": ["inserts a newline", "flushes the stream buffer", "returns the stream", "converts to a string"],
    "answer": 1,
    "explain": "Both insert a newline. endl additionally flushes cout's internal streambuf."
  },
  {
    "q": "Omitting `return 0;` from `main` causes a compile error.",
    "type": "tf",
    "answer": false,
    "explain": "main is special: it implicitly returns 0. The slides call keeping `return 0;` best practice, not a requirement."
  },
  {
    "q": "Which `main` signatures are valid? (select all)",
    "options": ["`int main()`", "`void main()`", "`int main(int argc, char ** argv)`", "`int main(String[] args)`"],
    "answer": [0, 2],
    "explain": "The slides give exactly these two. `void main` is not standard C++, and the String[] form is Java."
  },
  {
    "q": "The C header `limits.h` appears in the C++ standard library as…",
    "options": ["`<limits.h>` only", "`<climits>`", "`<limits>`", "it is unavailable in C++"],
    "answer": 1,
    "explain": "C headers are included as `<cNAME>` with the .h dropped: cmath, climits, cstdlib. (`<limits>` is a *different*, C++-only header providing numeric_limits.)"
  },
  {
    "q": "Which preprocessor directive is used for conditional compilation?",
    "options": ["`#include`", "`#define`", "`#ifdef`", "`#pragma once`"],
    "answer": 2,
    "explain": "The #ifdef / #ifndef / #if / #endif family compiles code conditionally. #include pastes files, #define does textual replacement."
  },
  {
    "q": "`using namespace std;` placed at file scope makes…",
    "options": ["only `cout` visible", "all names from `std` visible from that line to the end of the file", "all names from `std` visible only inside `main`", "the std namespace unavailable"],
    "answer": 1,
    "explain": "That is option 1 in the slides: ALL names from the std namespace are visible below that line."
  },
  {
    "q": "Which statement brings in **only** `cout`?",
    "options": ["`using namespace std;`", "`using std::cout;`", "`#include <cout>`", "`namespace cout = std;`"],
    "answer": 1,
    "explain": "A using-declaration names one entity. That is option 2 in the slides."
  },
  {
    "q": "A `using` declaration written inside `main()` is visible…",
    "options": ["everywhere in the file", "only inside `main`", "only after `main` returns", "nowhere — it is illegal there"],
    "answer": 1,
    "explain": "Option 3 in the slides: the declaration is scoped to that function."
  },
  {
    "q": "Match the file: which one contains a **non-defining function declaration** ending in a semicolon?",
    "options": ["`main.cpp`", "`calculator.cpp`", "`calculator.hpp`", "`CMakeLists.txt`"],
    "answer": 2,
    "explain": "Headers declare the interface: `int add(int first, int second);` — return type, name, parameters, no body, semicolon."
  },
  {
    "q": "In the Week 1 sample, `calculator.cpp` defines both `add` and `subtract`, but `main.cpp` cannot call `subtract`. Why?",
    "options": ["subtract is private", "the declaration of subtract is commented out in calculator.hpp, so main.cpp never sees it", "subtract is defined after add", "main.cpp forgot to include iostream"],
    "answer": 1,
    "explain": "That is the teaching point of the sample: a header exposes only what it declares. The definition exists, but main.cpp has no declaration for it, so the compiler rejects the call."
  },
  {
    "q": "Which directive ensures a header is included only once, and is preferred by the slides over `#ifndef` guards?",
    "options": ["`#once`", "`#pragma once`", "`#include_guard`", "`#define ONCE`"],
    "answer": 1,
    "explain": "Summary point 7 in the slides: use `#pragma once` instead of #ifndef."
  },
  {
    "q": "You should `#include` a `.cpp` file when you need its functions.",
    "type": "tf",
    "answer": false,
    "explain": "Never. #include pastes the file's text; including a .cpp duplicates its definitions and produces multiple-definition errors. Include the header instead."
  },
  {
    "q": "Which statements about header/source structure are true? (select all)",
    "options": ["Header files contain declarations intended for other files", "Source files implement what headers declare", "Every source file needs a matching header, except main.cpp", "Source files may only contain code declared in a header"],
    "answer": [0, 1, 2],
    "explain": "The last is false — the slides note source files can also contain code that is not declared in the header (like the hidden `subtract`)."
  },
  {
    "q": "C++ is a strongly typed language, which means…",
    "options": ["variables must be initialized", "every variable has a type and that type never changes", "types are inferred at runtime", "all types are objects"],
    "answer": 1,
    "explain": "Straight from the slides. A declaration needs a type, a name, and optional initialization."
  },
  {
    "q": "Which is a legal C++ identifier?",
    "options": ["`2nd_value`", "`my-value`", "`_count`", "`class`"],
    "answer": 2,
    "explain": "Letters, digits and underscores are allowed but an identifier may not start with a digit; hyphens are not allowed; `class` is a reserved keyword. The slides note you may begin with an underscore, though rarely."
  },
  {
    "q": "Which of these is **not** a floating point type?",
    "options": ["`float`", "`double`", "`long double`", "`long`"],
    "answer": 3,
    "explain": "`long` is an integer type. The floating point types on the slide are float, double and long double."
  },
  {
    "q": "A `bool` printed with `cout` shows as…",
    "options": ["`true` or `false`", "`1` or `0`", "`T` or `F`", "nothing"],
    "answer": 1,
    "explain": "bool is represented as 1 or 0 by default; you need the boolalpha manipulator to print true/false."
  },
  {
    "q": "`char` is an integer type.",
    "type": "tf",
    "answer": true,
    "explain": "The slides list char under integer types. `'A'` has the numeric value 65, so `(int)'A'` gives 65."
  },
  {
    "q": "What does this print?",
    "code": "int x = 0;\ncout << x << ' ';\nint y(7);\ncout << y << ' ';\nint z{9};\ncout << z;",
    "options": ["0 7 9", "0 0 0", "error — `{}` is invalid", "0 7 error"],
    "answer": 0,
    "explain": "All three are valid initialization forms: C-like `=`, constructor `()`, and uniform `{}` (C++11)."
  },
  {
    "q": "Which initialization form prohibits implicit narrowing conversion?",
    "options": ["`int x = 2.9;`", "`int x(2.9);`", "`int x{2.9};`", "none of them"],
    "answer": 2,
    "explain": "Only uniform (brace) initialization. The other two silently truncate to 2 — which is exactly why the slides prefer braces."
  },
  {
    "q": "Given `double x, y, z;`, which line fails to compile?",
    "options": ["`int sum = x + y + z;`", "`int sum(x + y + z);`", "`int sum{x + y + z};`", "all three fail"],
    "answer": 2,
    "explain": "The slide's example: the first two compile (value truncated), the braced form is an error. \"This won't work. We're happy!\""
  },
  {
    "q": "Uniform initialization with `{}` was introduced in…",
    "options": ["C", "C++98", "C++11", "C++20"],
    "answer": 2,
    "explain": "The slides label it Uniform initialization (C++11)."
  },
  {
    "q": "What does this print?",
    "code": "cout << 7 / 2 << ' ' << 7 % 2 << ' ' << 7 / 2.0;",
    "options": ["3 1 3.5", "3.5 1 3.5", "3 1 3", "4 1 3.5"],
    "answer": 0,
    "explain": "int/int truncates to 3; 7 % 2 is the remainder 1; one double operand promotes the division to 3.5."
  },
  {
    "q": "What does this print?",
    "code": "cout << -7 / 2 << ' ' << -7 % 2;",
    "options": ["-4 1", "-3 -1", "-4 -1", "-3 1"],
    "answer": 1,
    "explain": "Integer division truncates toward zero (not floor), giving -3; the remainder takes the sign of the left operand, giving -1."
  },
  {
    "q": "Which fixes integer division so that `a / b` yields a real quotient?",
    "options": ["`(double)(a / b)`", "`(double)a / b`", "`double(a / b)`", "`a / b * 1`"],
    "answer": 1,
    "explain": "Cast an operand *before* dividing. Casting the result is too late — the truncation already happened."
  },
  {
    "q": "What does this print?",
    "code": "int x = 5;\ncout << x++ << ' ' << x << ' ' << ++x;",
    "options": ["5 6 7", "6 6 7", "5 5 6", "7 6 5"],
    "answer": 0,
    "explain": "x++ yields the old 5 and leaves x at 6; the second field prints 6; ++x increments first, giving 7. (Mixing side effects in one statement like this is bad style, but gcc evaluates left to right here.)"
  },
  {
    "q": "`x++` and `++x` differ in…",
    "options": ["nothing", "which value the expression yields", "whether x changes at all", "operator precedence only"],
    "answer": 1,
    "explain": "Both increment x. Post-increment yields the OLD value; pre-increment yields the NEW value."
  },
  {
    "q": "Which operators short-circuit (may skip evaluating the right operand)?",
    "options": ["`&` and `|`", "`&&` and `||`", "`+` and `*`", "`==` and `!=`"],
    "answer": 1,
    "explain": "Logical && stops when the left side is false; || stops when the left side is true. The bitwise & and | always evaluate both."
  },
  {
    "q": "What does this print?",
    "code": "int x = 0;\nif (x != 0 && 10 / x > 1) cout << \"yes\";\nelse cout << \"no\";",
    "options": ["yes", "no", "a crash from division by zero", "a compile error"],
    "answer": 1,
    "explain": "`x != 0` is false, so && short-circuits and `10 / x` is never evaluated — which is precisely how this idiom avoids the division by zero."
  },
  {
    "q": "`if (x = 5)` compiles and is almost always a bug because…",
    "options": ["it compares x with 5", "it assigns 5 to x and tests the assigned value (5, which is true)", "`=` is invalid in a condition", "it is a syntax error"],
    "answer": 1,
    "explain": "`=` assigns and the assignment expression takes the assigned value; 5 is non-zero, so the condition is always true. Use `==` to compare."
  },
  {
    "q": "In the assortedOps sample, `lessThanNum = x < 5 ? true : false;` is equivalent to…",
    "options": ["`lessThanNum = x < 5;`", "`lessThanNum = 5;`", "`lessThanNum = x;`", "nothing — the ternary needs an if"],
    "answer": 0,
    "explain": "`x < 5` is already a bool, so the ternary is redundant. Both forms set the same value."
  },
  {
    "q": "The comma operator evaluates…",
    "options": ["only the left operand", "only the right operand", "both, and yields the LEFT value", "both, and yields the RIGHT value"],
    "answer": 3,
    "explain": "Left is evaluated for its side effects and discarded; the right operand is the result. The slides label it 'yuck' for good reason."
  },
  {
    "q": "In the `bits` sample every variable starts at 2. After `a >>= 1; b <<= 1; c &= 1; d |= 1; e ^= 1;` the printed values are…",
    "code": "int a=2,b=2,c=2,d=2,e=2;\na >>= 1; b <<= 1; c &= 1; d |= 1; e ^= 1;\ncout << a << b << c << d << e;",
    "options": ["14033", "13042", "24022", "10433"],
    "answer": 0,
    "explain": "2>>1 = 1; 2<<1 = 4; 2&1 = 0 (binary 10 & 01); 2|1 = 3; 2^1 = 3. Printed with no separators: 1 4 0 3 3."
  },
  {
    "q": "`sizeof` is…",
    "options": ["a function in <cstdlib>", "an operator", "a preprocessor macro", "a member function of every type"],
    "answer": 1,
    "explain": "The slides list sizeof among the operators. It yields the size in bytes."
  },
  {
    "q": "`float x = 2.25; int y = (int)x;` leaves y as…",
    "options": ["2", "3", "2.25", "a compile error"],
    "answer": 0,
    "explain": "C-style casting truncates the value — it does not round. The slide says so explicitly."
  },
  {
    "q": "A `const` variable may be declared without an initializer and assigned on the next line.",
    "type": "tf",
    "answer": false,
    "explain": "It is mandatory to set a const value in its declaration: `const int some_other_value; // ERROR!`"
  },
  {
    "q": "Which is true about `const` versus `constexpr`?",
    "options": ["Both must be known at compile time", "A `constexpr` must be known at compile time; a `const` may be assigned after compile time", "A `const` must be known at compile time; a `constexpr` may not", "Neither can be initialized from `cin`"],
    "answer": 1,
    "explain": "The slides' rule: a constexpr MUST be assigned a value by compile time; a const CAN be assigned a value after compile time — which is why `const int constantinput = input;` compiles after reading input, but the constexpr version does not."
  },
  {
    "q": "`#define PI 3.14159` — which are true? (select all)",
    "options": ["It is a preprocessor directive", "It needs no semicolon", "It performs textual replacement", "It creates a typed variable"],
    "answer": [0, 1, 2],
    "explain": "#define is textual substitution done before compilation; no type and no storage are involved. That is why `const`/`constexpr` are preferred in C++."
  },
  {
    "q": "`void myFunc(const int num)` promises that…",
    "options": ["the function never returns", "the function will not change `num`", "`num` is known at compile time", "`num` is passed by reference"],
    "answer": 1,
    "explain": "The slides phrase it as \"I promise not to change this value.\""
  },
  {
    "q": "Matching — which manipulator makes `int n = 123` print as `0x7b`?",
    "options": ["`hex`", "`showbase << hex`", "`uppercase << hex`", "`oct`"],
    "answer": 1,
    "explain": "hex alone gives 7b; showbase adds the 0x prefix. uppercase would give 7B, and oct gives 173."
  },
  {
    "q": "What does this print?",
    "code": "double d = 123.456789;\ncout << setprecision(7) << d;",
    "options": ["123.4568", "123.456789", "123.4567890", "1.234568e+02"],
    "answer": 0,
    "explain": "Without fixed/scientific, precision means SIGNIFICANT digits: 7 significant digits of 123.456789 is 123.4568. (Default precision is 6.)"
  },
  {
    "q": "`setw(5)` affects…",
    "options": ["all subsequent output", "only the next field", "only numeric output", "nothing until setfill is called"],
    "answer": 1,
    "explain": "setw sets a minimum width for ONE field only. Other manipulators (hex, fixed, boolalpha…) are sticky until changed."
  },
  {
    "q": "`cin.fail()` returns true when…",
    "options": ["only failbit is set", "badbit or failbit is set", "eofbit is set", "no bits are set"],
    "answer": 1,
    "explain": "The slides' wording: fail() is true iff badbit OR failbit is set. good() is true iff NO bits are set."
  },
  {
    "q": "For `int n; cin >> n;` with the typed input `hello`, what happens?",
    "options": ["n becomes 0, failbit set", "n is unchanged, failbit set, and 'hello' stays in the buffer", "n is unchanged, eofbit set", "the program crashes"],
    "answer": 1,
    "explain": "From the input-examples table: no change to n, failbit set. The offending characters remain in the buffer, so every later read also fails until you clear and ignore."
  },
  {
    "q": "Why does `while (cin >> n)` work as a loop condition?",
    "options": ["`>>` returns a bool", "the stream converts to true exactly when `fail()` is false", "cin counts remaining input", "it does not work — you need `!cin.eof()`"],
    "answer": 1,
    "explain": "`>>` returns the stream, and a stream is contextually convertible to bool: true iff cin.fail() is false."
  },
  {
    "q": "Which call throws away the rest of the current input line?",
    "options": ["`cin.ignore()`", "`cin.clear()`", "`cin.ignore(numeric_limits<streamsize>::max(), '\\n')`", "`cin.flush()`"],
    "answer": 2,
    "explain": "ignore() alone skips a single character; clear() only resets the flags. The idiomatic line flush needs the max-count plus '\\n' delimiter form, from <limits>."
  },
  {
    "q": "In the AddIntegersError sample the second `while (cin >> name)` loop never runs. Why?",
    "options": ["`name` was not initialized", "failbit is still set from the earlier bad integer read, so cin is false immediately", "the string loop needs `getline`", "the program already returned"],
    "answer": 1,
    "explain": "The integer loop ends by failing on non-numeric input. AddIntegersError omits cin.clear() and cin.ignore(...), so the stream is still in a fail state and the next extraction does nothing. AddIntegers fixes exactly this."
  },
  {
    "q": "`char first_name[5]; cin >> first_name;` is dangerous because…",
    "options": ["char arrays cannot be read", "`cin` does not know the array length, so long input overflows the buffer", "you must use `>>` twice", "the array is const"],
    "answer": 1,
    "explain": "char[] decays to char*, carrying no length. The slides' fix is `cin >> setw(5) >> first_name;` which reads at most 4 characters plus the terminating null."
  },
  {
    "type": "spotbug",
    "q": "Click the line that fails to compile in this program.",
    "code": "#include <iostream>\nint main()\n{\n    cout << \"Hello world!\" << endl;\n    return 0;\n}",
    "answer": 4,
    "explain": "Line 4: neither `std::` nor a `using` declaration is in scope, so the compiler has never heard of `cout` — 'cout' was not declared in this scope."
  },
  {
    "type": "match",
    "q": "Match each initialization form to its name.",
    "pairs": [
      ["`int x = 0;`", "C-like initialization"],
      ["`int x(0);`", "constructor initialization"],
      ["`int x{0};`", "uniform initialization (C++11)"]
    ],
    "explain": "Same result, three different spellings — only `{}` (uniform initialization) additionally blocks implicit narrowing conversions."
  }
]
```

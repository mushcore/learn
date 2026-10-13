# COMP 3522 Week 1 — facts, programs and worked numbers transcribed from the instructor's material

Source files in `D:/BCIT/COMP3522/Lectures/Week 1/`: `3522 Week 1.pdf` (Week 1 slides, 98 pages, two decks: program structure + fundamental types, then operators / casting / constants / console IO), `Lab 01 3522 Toolchain.pdf`, `Week1Code.zip`, and 9 lecture videos.
Sample code: `D:/BCIT/COMP3522/Lectures/comp-3522-fall-2026-course-sample-code-mushcore-main/Week1/` — `HelloWorld` (main.cpp, calculator.hpp, calculator.cpp), `assortedOps`, `bits`, `const_vs_constexpr`, `precisionAndWidth` (`precision and width.cpp`), `readName`, `AddIntegers`, `AddIntegersError`. Outputs below were produced with the CLion-bundled MinGW g++ (2026-10).

## Videos
1 - Intro and review; 1 - C++ program structure v2; 2 - C++ fundamental types v2; 2 - Operators; 4 - Casting and Consts; 5 - Console and File IO - Output manipulators; 6 - Console and File IO - Output manipulators code and input manipulators; 7 - Console and File IO - Handling input edge cases; How to load sample code.

## Slides: course logistics (slides 1-24)
- Instructor Jeffrey Yim ("call me Jeff"), jyim3@bcit.ca, subject line `[COMP3522]`; office hours by appointment on Discord, Mondays 10:30am-2:20pm.
- Three pillars: learn C++ (inheritance, polymorphism, exceptions, the Standard Template Library); good, clean, reusable code with the S.O.L.I.D design principles; design patterns (behavioral, creational, structural).
- Evaluation (slide 10): Labs 10%, Quizzes (during labs) 10%, Assignments 20%, Midterm 30%, Final Exam 30%. "You must pass the average of final+midterm to pass the course"; a passing grade is 50%.
- Lectures Thursday 2:30pm-5:20pm; labs due end of day Sunday 11:59pm; quizzes at the beginning of labs starting Week 2, on the Learning Hub: "Multiple choice, true/false, matching, etc". Labs individual, assignments may be in pairs; no late submissions; submit to GitHub via Classroom 50.
- Toolchain: Discord; Classroom 50 (backup: GitHub Student Developer Pack); IDE CLion ("Supports C++20 and unit testing"), backup Visual Studio 2017.
- Gen AI: use as a personal tutor "But don't always trust it"; do not ask it to complete lab or assignment work; do not submit Gen AI code as your own.

## Slides: C++ program structure (slides 25-48)
- C++: multi-paradigm (procedural, object oriented, generic), compiled, familiar type system, "Somewhat verbose", widely used, pass by value or pass by reference.
- Hello World: `#include <iostream>` / `int main( ) { std::cout << "Hello world!" << std::endl; return 0; }`.
- `<iostream>` is a header file: angle brackets, no file extension. "Java has an API; C++ has a standard library". C headers are a subset of the C++ standard library with new names: `math.h` becomes `<cmath>`, `limits.h` becomes `<climits>`, `stdlib.h` becomes `<cstdlib>`.
- Insertion operator `<<`: an overloaded function applied to an output stream; can be manipulated to format output; easier than printf. Scope operator `::` is "similar to the dot operator": `::` accesses members of a namespace or class, `.` accesses members of an object.
- `std::cout`: predefined object of type `ostream`, the standard output stream. `std::cout << n;` is really `std::cout.operator<<(n);`, header `ostream& operator<<(int);`.
- `std::endl`: an "output manipulator"; "Inserts a new-line and flushes the stream"; streams use an internal buffer of type `streambuf`; sometimes unnecessary (append `\n`).
- main: `int main()` or `int main(int argc, char ** argv)`; returns an int (0 by default); 0 means ran without errors; best practice to leave `return 0;`, but code still runs if omitted.
- Preprocessor directives: instructions for the preprocessor, not the compiler; "NOT followed by a semi-colon (ends with new line)"; `#include`, `#define`, conditional compilation `#ifdef #ifndef #if #endif`.
- Namespaces: similar to a Java package; prevent name collisions; the standard library is in `std`. `using` is "Just like Java's import".
- Option 1: `using namespace std;` — "ALL names from std namespace visible below here". Option 2: `using std::cout; using std::endl;` at file scope — "ONLY cout and endl ... visible below here". Option 3: the same two using-declarations inside main — "visible in this FUNCTION".
- Header/source: header files declare interfaces; source files implement them. Challenge: calculator with `add`. `calculator.hpp`: `int add(int first, int second);` — a **non-defining function declaration** has return type, name, parameters, no body, ends with `;`. `calculator.cpp`: `#include "calculator.hpp"` + the definition; "Pro-tip: the function declaration should match the header's function declaration". `main.cpp` includes `calculator.hpp` and calls `cout << add(10,5);`.
- Summary (slide 48): 1. One main method 2. main may call other functions 3. source file is `.cpp` 4. header file is `.hpp` 5. function declarations in the header 6. declaration and definitions in the source 7. "Use #pragma once instead of #ifndef to ensure header file is only included ONCE".

## Sample: HelloWorld
- `calculator.hpp`: `#pragma once`, `int add(int first, int second);`, and `//int subtract(int first, int second); //subtract function is hidden to external files if this line is commented`. `calculator.cpp` defines both `add` and `subtract`. `main.cpp`: `cout << "Hello, World!" << endl; cout << add(10,5);` with `//cout << subtract(10, 5);` commented. Comment in main: "NEVER include .cpp file".
- Output as shipped: `Hello, World!` then `15` (no newline after 15).
- Uncommenting only the call: `error: 'subtract' was not declared in this scope` (compile stage). Uncommenting both: `Hello, World!`, `155`. Declaring in the header with no definition anywhere: `undefined reference to 'subtract(int, int)'` (link stage).
- `#include <iostream>;` with a stray semicolon: g++ gives only `warning: extra tokens at end of #include directive` and the program runs.

## Slides: fundamental types (slides 49-54)
- Strongly typed: every variable has a type; the type never changes; a declaration needs 1. type 2. name 3. optional initialization (`int num = 1;`).
- Names: letters, digits (don't start with a digit), underscores; begin with a letter or (rarely) an underscore.
- Types: `bool` (true/false, represented as 1 or 0); integer types `char short int long`; floating point `float double long double`; `void` – no type.
- Three initializations: 1. C-like `int x = 0;` 2. constructor `int x(0);` 3. uniform (C++11) `int x {0};`.
- Why uniform (slide 54): "It prohibits implicit narrowing conversion among built-in types": `double x, y, z; int sum = x + y + z; // ok (value of expression truncated to int)`, `int sum(x + y + z); // same`, `int sum{x + y + z}; // ERROR! This won't work. We're happy!`. (g++ reports `narrowing conversion` as an error for non-constant doubles.)

## Slides: operators, casting (slides 55-66)
- `a = 5 + 5;`: `a` variable, `=` assignment operator, the 5s are operands and literals, `+` operator.
- Arithmetic `+ - * / %`; compound `+= -= *= /= %=`; increment/decrement `++ --` "Remember pre vs post!"; relational `== != > >= < <=`; logical `! && ||`.
- Assorted: `? :` ternary, `,` "comma operator, yuck", `( )` casting operator, `sizeof`.
- C-style cast: `float x = 2.25; int y = (int)x; //truncates value` (y is 2). C++ casting operators come later.

## Sample: assortedOps
- Reads x, sets `lessThanNum` with if/else (ternary version commented: `lessThanNum = x < 5 ? true : false;`), prints `3 is less than 5: true` for input 3.
- Comma: `int n = 1; int m = (++n, std::cout << "n = " << n << '\n', ++n, 2*n);` prints `n = 2`, m = 2*3 = 6; `std::cout << "m = " << (++m, m)` prints `m = 7`.
- `float aFloat = (float)anInt;` casting operator.

## Sample: bits
- All five start at 2: `a >>= 1` → 1, `b <<= 1` → 4, `c &= 1` → 0, `d |= 1` → 3, `e ^= 1` → 3. Output starts with a blank line (`cout << endl;`), then `1 4 0 3 3` one per line.

## Slides: constants (slides 67-72)
- A constant: "A value that can not change after it's initialized (Java final)". Old-style: `#define PI 3.1415926535` "(Remember: no semi-colon!)".
- `const int some_value = 1; some_value = 9; // ERROR!`, `const int some_other_value; // ERROR!`, `const float pi(3.14159);`, `const char top_score{'A'};`, `const bool larger{some_value < pi};`. "It is mandatory to set a const value in its declaration!" Useful for parameters: `void myFunc(const int num)` — "I promise not to change this value."
- `constexpr double another_value{1.3};` — "To be evaluated at compile time." A compile-time constant, useful for performance.
- "A constexpr must be assigned a value by compile time"; "A const can be assigned a value after compile time". Example: `cin >> input; // WOW WHAT'S THIS?` then `const int constant_input = input;`.

## Sample: const_vs_constexpr
- `const int constantinput = input;` compiles ("A const never changes"); `//constexpr int constantinput2 = input;` does not ("A constexpr must be known at compile-time"). Prints `Entered <n> into the constant`; with input `hello`, `Entered 0 into the constant` (failed extraction stores 0).

## Slides: console output (slides 73-86)
- `std::cout` is a global object of class `ostream`; Java's methods are C++ **member functions**. `cout.setf(ios_base::fmtflags)` / `cout.unsetf(...)`.
- `setf(flag)`/`unsetf(flag)` take boolalpha, showbase, uppercase, showpos. `setf(flag, flag)` takes dec/oct/hex with basefield, fixed/scientific with floatfield, left/right/internal with adjustfield.
- `int n{15}; cout.setf(ios_base::hex, ios_base::basefield); cout << n << endl; // hex value - f`; manipulator form `cout << hex << n << endl;`. Under the hood: `ostream& hex(ostream& outputstream) { outputstream.setf(ios_base::hex, ios_base::basefield); return outputstream; }`.
- n = 123: `showpos` → `+123`, `noshowpos` → `123`; `dec` 123, `hex` 7b, `oct` 173; `uppercase << hex` → `7B`; `showbase << hex` → `0x7b`.
- n = -123, `setw(6)`: `left` → `|-123  |`, `internal` → `|-  123|`, `right` → `|  -123|`.
- d1 = 100.0, d2 = 100.12: `noshowpoint` → `100 100.12`; `showpoint` → `100.000 100.120`.
- number = 123.456789: `fixed` → `123.456789`; `scientific` → slide shows `1.234568E+02` (g++ prints lower-case `1.234568e+02` unless `uppercase` is set). fun = true: `boolalpha` → `true`, `noboolalpha` → `1`.
- `<iomanip>`: `setw(5)` sets minimum width for one field only, `|  123|`; `setfill('*') << setw(5)` → `**123`; `setprecision(7)` on 123.4567845678 → `123.4568`; `streamsize prec = cout.precision();` "Note: default precision = 6".
- Member function vs manipulator: `cout.setf(ios_base::showpos);` vs `cout << showpos`; `cout.width(5);` vs `cout << setw(5)` — "Which looks easier?"

## Sample: precision and width
- `int a = 64; a <<= 2;` → `256`. `setw(10) << pi << " " << cake` with pi = 3.1459268535, cake = 8.314462618 → `   3.14593 8.31446` (setw applies to pi only). `precision: 6`. `setprecision(3)` → `3.15 8.31`. Restoring the saved precision → `3.14593 8.31446`. `cin >> m >> n` with `12 34` → `m: 12`, `n: 34`.

## Slides: console input (slides 87-96)
- `int m, n; cin >> m >> n; // Input 12 34, or 12 <enter> 34`. Read an int (`hours`), a double (`weight_kg`).
- "It's not infallible": `constexpr int first_name_length = 5; char first_name[first_name_length]; cin >> first_name; // NOOOOOO DON'T DO THIS` — "Recall that char[] == char *", cin doesn't know the length, a memory allocation issue. Fix: `#include <iomanip>`, `cin >> setw(5) >> first_name;` (reads at most 4 characters plus the terminator; the slide's `constexpr first_name_length = 5;` omits `int` and does not compile).
- `ios_base::iostate`: failbit (operation failed), badbit (stream error), eofbit (set on EOF), goodbit (zero, no bits set). `cin` is true if `cin.fail()` is false: `if (cin >> n)`.
- `fail()` true iff badbit or failbit; `bad()` iff badbit; `eof()` iff eofbit; `good()` iff no bits set. "Hint: call cin.clear() after an input failure!"
- Input table (slide 94, `int n; cin >> n`, `*` is EOF): `123 456` → n 123, failbit not set, eofbit not set; `123*` → 123, not set, **set**; `hello` → "No change", failbit set, eofbit not set; `*` → "No change", set, set.
  - g++ (C++11 and later): `hello` stores **0** in n (failed numeric extraction writes 0); `*` (nothing but EOF or whitespace) leaves n unchanged; an out-of-range number stores INT_MAX/INT_MIN and sets failbit.
- `ignore()` tosses 1 char; `ignore(128)` 128 chars or until EOF; `ignore(128, '\n')` 128 until EOF or `'\n'`; `ignore(LLONG_MAX, '\n')`.
- Throw away a line: `#include <limits>`, `cin.clear(); //unsets failbits`, `cin.ignore(numeric_limits<streamsize>::max(), '\n');`; helper `void ignoreline(istream& is) { is.clear(); is.ignore(numeric_limits<streamsize>::max(), '\n'); }`.

## Sample: readName, AddIntegers, AddIntegersError
- readName: `constexpr int firstNameLength = 5; char firstName[firstNameLength]; cin >> setw(5) >> firstName;` — input `Jeffrey` prints `Jeff`.
- AddIntegers: `while(cin >> n)` echoes each number; a non-number ends the loop; then `cin.clear(); cin.ignore(numeric_limits<streamsize>::max(),'\n');` and a second loop `while(cin >> name)` echoes words until `quit`; prints `Ending program`.
- AddIntegersError: the same without `clear`/`ignore`: failbit stays set, so the string loop never runs and the program goes straight to `Ending program`.

## Slides: sample code and quiz (slides 97-98)
- Sample code: Learning Hub > Content > Lectures > Week 1 > Week1Code.zip, or cloned in Lab 1.
- Quiz next week covers Week 1, "Study week 1's sample code", written at the beginning of lab on the Learning Hub: multiple choice, true/false, matching options.

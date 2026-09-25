---
title: Formatting output
minutes: 22
---

`std::cout` is a **global object** of class `ostream`; what Java calls methods, C++ calls **member functions**. There are two ways to format what `cout` prints: calling member functions on `cout`, or streaming **output manipulators** with `<<`.

## Member functions: `setf` and `unsetf`

`std::ios_base` (a superclass of `ostream`) defines `ios_base::fmtflags` — flags you can turn on and off to control formatting:

```cpp
cout.setf(ios_base::fmtflags);
cout.unsetf(ios_base::fmtflags);
```

The slides give exact rules for which flags go where:

| Form | Takes |
|---|---|
| `setf(flag)` / `unsetf(flag)` — one argument | `boolalpha`, `showbase`, `uppercase`, `showpos` |
| `setf(flag, field)` — two arguments | `dec`/`oct`/`hex` with `ios_base::basefield`; `fixed`/`scientific` with `ios_base::floatfield`; `left`/`right`/`internal` with `ios_base::adjustfield` |

Turning on boolean display and printing in hex, the member-function way:

```cpp
cout.setf(ios_base::boolalpha);

int n{15};
cout.setf(ios_base::hex, ios_base::basefield);
cout << n << endl; // hex value: f
```

`hex` needs the two-argument form: it belongs to the `basefield` group with `dec` and `oct`, so `setf` must know which field it is setting.

## Output manipulators

In C++ you can stream a manipulator into `cout` instead of calling `setf`:

```cpp
int n{15};
// Replace this:
cout.setf(ios_base::hex, ios_base::basefield);
// With this:
cout << hex << n << endl; // hex value: f
```

### Under the hood

`hex` is an ordinary function with the signature `ostream& hex(ostream&)`. Streaming it into `cout` calls it; it calls `setf` and returns the stream so the chain of `<<` continues. Every manipulator works this way:

```cpp
cout << hex << n << endl;

ostream& hex(ostream& outputstream)
{
    outputstream.setf(ios_base::hex, ios_base::basefield);
    return outputstream;
}
```

```widget
manipulators
{ "title": "Every manipulator from the slides, live" }
```

## Sign, base, and case manipulators

```cpp run pin signBaseCase.cpp
#include <iostream>
using namespace std;

int main() {
    int n = 123;
    cout << showpos << n << '\n';   // +123
    cout << noshowpos << n << '\n'; // 123

    cout << dec << n << '\n'; // 123
    cout << hex << n << '\n'; // 7b
    cout << oct << n << '\n'; // 173

    cout << uppercase << hex << n << '\n';   // 7B
    cout << nouppercase << hex << n << '\n'; // 7b

    cout << showbase << hex << n << '\n';   // 0x7b
    cout << noshowbase << hex << n << '\n'; // 7b
    return 0;
}
```

With `n` at `123`: `showpos` forces the `+` on positive numbers; `dec`, `hex` and `oct` change the base a number prints in (hex digits are lowercase unless `uppercase` is on, which gives `7B`); `showbase` prepends the `0x` or `0` prefix a hex or octal literal would need.

## Field width and alignment: `left`/`internal`/`right`

With `n` at `-123` and a field width of `setw(6)`:

```cpp run
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n = -123;
    cout << setw(6) << left << n << "|\n";     // -123  |
    cout << setw(6) << internal << n << "|\n"; // -  123|
    cout << setw(6) << right << n << "|\n";    // |  -123|
    return 0;
}
```

- `left` pads on the right: `-123  `
- `internal` puts the sign at the left edge and pads *between* the sign and the digits: `-  123`
- `right` (the default) pads on the left: `  -123`

:::quiz `setw` only affects the very next thing printed
`setw(value)` sets a minimum width for **one field only**; after that one insertion the width resets to 0 (natural width). `cout << setw(6) << a << b;` pads only `a`.
:::

## `showpoint`, `fixed`, `scientific`

With `d1 = 100.0` and `d2 = 100.12`:

```cpp run
#include <iostream>
using namespace std;

int main() {
    double d1 = 100.0;
    double d2 = 100.12;
    cout << noshowpoint << d1 << " " << d2 << '\n'; // 100 100.12
    cout << showpoint << d1 << " " << d2 << '\n';   // 100.000 100.120
    return 0;
}
```

`showpoint` forces the decimal point and trailing zeros to show, out to the current precision, even for a value like `100.0` that would otherwise print as just `100`.

Now `fixed` and `scientific`, with `number` at `123.456789`:

```cpp run pin fixedScientific.cpp
#include <iostream>
using namespace std;

int main() {
    double number = 123.456789;
    cout << fixed << number << '\n';      // 123.456789
    cout << scientific << number << '\n'; // 1.234568e+02
    return 0;
}
```

```tokens
[
  { "token": "fixed", "story": "`fixed` forces every subsequent floating-point print to show a **fixed number of digits after the decimal point** (controlled by `setprecision`), instead of switching to scientific notation for very large or small values.", "swap": { "with": "scientific", "why": "`scientific` prints the same value in **exponent notation**: `1.234568e+02` instead of `123.456789`. Same number, same 6-significant-digit precision — just a different way of writing it." } }
]
```

:::warn Correcting the slide
The lecture slide prints the `scientific` example as `1.234568E+02` (capital E). g++ prints lowercase by default: `1.234568e+02`. The capital `E` needs `uppercase` turned on too.
:::

## `boolalpha`/`noboolalpha`

With `fun` at `true`:

```cpp run
#include <iostream>
using namespace std;

int main() {
    bool fun = true;
    cout << boolalpha << fun << '\n';   // true
    cout << noboolalpha << fun << '\n'; // 1
    return 0;
}
```

## `<iomanip>`: `setw`, `setfill`, `setprecision`

`#include <iomanip>` unlocks manipulators that take an argument:

- **`setw(value)`** — sets a minimum width **for one field only**. `cout << setw(5) << number;` with `number = 123` prints `"  123"` (two spaces then `123`).
- **`setfill(fillchar)`** — changes the padding character used by `setw`. `cout << setfill('*') << setw(5) << number;` prints `**123`.
- **`setprecision(value)`** — changes how many digits `cout` shows. The **default precision is 6** (significant digits, unless `fixed`/`scientific` is also on, in which case it means digits after the decimal point). `cout << setprecision(7) << number;` on `number = 123.4567845678` prints `123.4568`.

You can save the current precision before changing it and restore it later:

```cpp
streamsize prec = cout.precision();
// ... change precision, print things ...
cout << setprecision(prec); // restored
```

```cpp run pin setprecisionDemo.cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double number = 123.4567845678;
    cout << setprecision(7) << number << '\n'; // 123.4568
    cout << setfill('*') << setw(5) << 123 << '\n'; // **123
    return 0;
}
```

```tokens
[
  { "token": "setprecision(7)", "line": 7, "story": "`setprecision(7)` raises `cout`'s precision to 7 significant digits, so `123.4567845678` prints as `123.4568`.", "swap": { "with": "setprecision(2)", "why": "With only 2 significant digits, `123.4567845678` rounds all the way down to `1.2e+02`-scale precision and prints as `1.2e+02` — precision this low forces `cout` out of its normal fixed-looking format for a number this large." } }
]
```

`setprecision(7)` gives `123.4568`; `setfill('*')` changes the pad character, so `setw(5)` pads the three-digit value on the left with two asterisks.

## Member functions vs. manipulators

The slides put these side by side and ask "which looks easier?":

| Member function | Output manipulator |
|---|---|
| `cout.setf(ios_base::showpos); cout << number;` | `cout << showpos << number;` |
| `cout.width(5); cout << number;` | `cout << setw(5) << number;` |

Both do the same thing; manipulators read more naturally inside an output statement, so most C++ code favours them.

## Walking through `precisionAndWidth.cpp`

```cpp run pin precisionAndWidth.cpp
// stdin: 3 4
// predict: Input is 3 4. Write every line printed.
#include <iostream>
#include <iomanip>

using namespace std;

int main()
{
    int a = 64;
    a <<= 2;
    cout << a << endl;

    double pi = 3.1459268535;
    double cake = 8.314462618;

    cout << setw(10) << pi << " " << cake << "\n";

    streamsize precision = cout.precision();
    cout << "precision: " << cout.precision() << endl;

    cout << setprecision(3) << pi << " " << cake << "\n";

    cout << setprecision(precision) << pi << " " << cake << "\n";

    streamsize prec = cout.precision();

    int m, n;
    cout << "Enter 2 numbers\n";
    cin >> m >> n;
    cout << "m: " << m << endl;
    cout << "n: " << n << endl;
}
```

The instructor's sample, unmodified, with input `3 4`. Line by line:

1. `a` starts at `64` (`1000000`). `a <<= 2` shifts left twice: `256`. Prints `256`.
2. `cout << setw(10) << pi << " " << cake << "\n";` — default precision is 6 significant digits, so `pi` rounds to `3.14593`. `setw(10)` applies to **that one field only**: `"3.14593"` is 7 characters, so it's right-padded with 3 spaces to fill the 10-wide field: `"   3.14593"`. Then a literal space, then `cake` at its natural width (precision 6 again): `8.31446`. Line: `   3.14593 8.31446`.
3. `cout.precision()` returns the current precision without changing it — `6`. Prints `precision: 6`.
4. `setprecision(3)` — both numbers now round to 3 significant digits: `3.15` and `8.31`. Prints `3.15 8.31`.
5. `setprecision(precision)` restores the saved value (`6`), back to `3.14593 8.31446`.
6. `cin >> m >> n;` with input `3 4` reads `m = 3`, `n = 4`. Prints `m: 3` then `n: 4`.

```quiz
[
  {
    "type": "fill",
    "q": "Fill in the manipulators that together make `n = 123` print as `0x7b`.",
    "code": "cout << ___ << 123;  // prints 0x7b",
    "answer": ["showbase << hex", "hex << showbase"],
    "explain": "hex switches the base to hexadecimal; showbase prepends the 0x prefix. Either order works since both are just flag-setting functions."
  },
  {
    "q": "Which manipulator makes `n = 123` print as `0x7b`?",
    "options": ["hex", "hex with showbase", "showbase alone", "uppercase with hex"],
    "answer": 1,
    "explain": "hex switches the base to hexadecimal (7b); showbase additionally prepends the 0x prefix."
  },
  {
    "q": "What is the default precision of `cout` before any `setprecision` call?",
    "options": ["2", "4", "6", "10"],
    "answer": 2,
    "explain": "The slides state the default precision is 6 significant digits."
  },
  {
    "q": "`cout << setw(6) << left << -123 << \"|\";` prints which of these?",
    "options": ["`  -123|`", "`-123  |`", "`-  123|`", "`-123|`"],
    "answer": 1,
    "explain": "left pads on the right, so the value hugs the left edge of the 6-wide field: '-123  '."
  },
  {
    "q": "`cout << setw(6) << internal << -123 << \"|\";` prints which of these?",
    "options": ["`-123  |`", "`  -123|`", "`-  123|`", "`123-  |`"],
    "answer": 2,
    "explain": "internal keeps the sign at the left edge and pads between the sign and the digits: '-  123'."
  },
  {
    "q": "`cout << scientific << 123.456789;` prints `1.234568E+02` in real g++ output.",
    "type": "tf",
    "answer": false,
    "explain": "Real g++ prints lowercase 'e': 1.234568e+02. You'd need uppercase turned on too for a capital E, contrary to what the slide image shows."
  },
  {
    "q": "`setw(value)` sets a minimum width for how many fields?",
    "options": ["Every field for the rest of the program", "Every field until the next endl", "One field only, then it resets", "Two fields"],
    "answer": 2,
    "explain": "setw applies to exactly the next inserted value, then silently resets to natural width."
  },
  {
    "q": "In `precisionAndWidth.cpp`, what does `cout << \"precision: \" << cout.precision() << endl;` print, before any setprecision call has run?",
    "code": "double pi = 3.1459268535;\ncout << setw(10) << pi << \" \" << cake << \"\\n\";\ncout << \"precision: \" << cout.precision() << endl;",
    "options": ["precision: 0", "precision: 3", "precision: 6", "precision: 10"],
    "answer": 2,
    "explain": "cout.precision() just reads the current precision, which starts at the default of 6."
  },
  {
    "q": "What does `cout.setf(ios_base::hex, ios_base::basefield);` require that `cout.setf(ios_base::boolalpha);` does not?",
    "options": ["A #include <iomanip>", "A second argument naming the flag group (basefield)", "A call to cout.flush()", "Nothing, they're identical"],
    "answer": 1,
    "explain": "hex/oct/dec belong to the basefield group, so setf needs the two-argument form to know which field is being set; boolalpha is a standalone one-argument flag."
  },
  {
    "q": "Under the hood, the `hex` manipulator is implemented as a function with which signature?",
    "options": ["void hex(int)", "ostream& hex(ostream&)", "int hex(ostream&)", "ostream hex()"],
    "answer": 1,
    "explain": "It's an ordinary function taking and returning an ostream& so it composes with further << calls, calling setf(ios_base::hex, ios_base::basefield) internally."
  },
  {
    "q": "Given `a = 64; a <<= 2;`, what does `cout << a;` print?",
    "code": "int a = 64;\na <<= 2;\ncout << a;",
    "options": ["66", "128", "256", "16"],
    "answer": 2,
    "explain": "64 is 1000000 in binary; shifting left by 2 gives 100000000 = 256."
  },
  {
    "type": "match",
    "q": "Match each manipulator (or combination) to what it prints, given `int n = 123;` or `double number = 123.456789;`.",
    "pairs": [
      ["`showpos`", "+123"],
      ["`hex`", "7b"],
      ["`oct`", "173"],
      ["`showbase` with `hex`", "0x7b"],
      ["`setprecision(7)`", "123.4568"],
      ["`fixed`", "123.456789"],
      ["`scientific`", "1.234568e+02"],
      ["`boolalpha`", "true"]
    ],
    "explain": "hex alone drops the base prefix (7b); showbase adds it (0x7b). setprecision(7) with no fixed/scientific counts 7 significant digits; fixed instead switches to a fixed count of decimal places, printing all of 123.456789. scientific always uses lowercase e by default in real g++ output."
  }
]
```

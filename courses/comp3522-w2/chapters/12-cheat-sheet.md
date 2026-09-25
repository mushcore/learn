---
title: One-page cheat sheet (Week 2)
minutes: 10
---

Everything Quiz 2 can ask, in tables. Read this last, on the way to the lab.

## File streams (`<fstream>`)

| Class | Direction | Position members | Default mode |
|---|---|---|---|
| `ifstream` | read a file | `tellg()`, `seekg()` | `ios_base::in` (fails if the file is missing) |
| `ofstream` | write a file | `tellp()`, `seekp()` | `ios_base::out` (**creates or truncates**) |
| `fstream` | read and write | both g and p | `in \| out` |

```cpp
#include <fstream>
fstream f{"data.txt"};           // constructor opens; or: ifstream fin; fin.open("x.txt");
if (!f.is_open()) {              // or: if (!f)
    cerr << "Unable to open file" << endl;   // cerr = cout for errors
    exit(1);                     // terminate with error code 1
}
f << "hello" << 123 << endl;     // << >> and manipulators work on file streams
f.close();                       // also closed automatically by the destructor
```

- Every stream owns an internal buffer: `filebuf` (file streams), `streambuf` (cin/cout/cerr), `stringbuf` (string streams). Rarely touched directly.
- Copy a whole file in one statement: `outFile << inFile.rdbuf();`
- Character by character: `while ((c = in.get()) != EOF) { out.put(c); }` (`get` reads one char, `put` writes one).

## Open modes (`std::ios_base::openmode`, combine with `|`)

| Flag | Meaning |
|---|---|
| `in` | allow input operations |
| `out` | allow output operations (alone: truncates) |
| `app` | position at the **end before each output** (append; cannot overwrite) |
| `trunc` | discard the contents when opening |
| `ate` | position at the end **once, on opening** |
| `binary` | file contains binary data (no newline translation) |

`ifstream f1{"data", ios_base::in | ios_base::binary};` · `ofstream f2{"dest", ios_base::out | ios_base::app};`

## Seeking (file `helloWorld.txt` = `Hello World`, 11 characters, positions 0–10, end = 11)

| Get position | Set position |
|---|---|
| `streampos tellg()` (input) | `seekg(streampos)` absolute · `seekg(streamoff, seekdir)` relative |
| `streampos tellp()` (output) | `seekp(streampos)` · `seekp(streamoff, seekdir)` |

`seekdir` is `ios::beg`, `ios::cur` or `ios::end` (public members of `ios_base`, like C's `SEEK_SET`, `SEEK_CUR`, `SEEK_END`). `streampos` stores positions, `streamoff` stores offsets.

| Code | Prints | Why |
|---|---|---|
| `ifstream myFile("helloWorld.txt"); tellg()` | 0 | input opens at the start |
| `ofstream myFile("helloWorld.txt", ios::app); tellp()` | 11 | append puts the cursor at the end |
| `ofstream myFile("helloWorld.txt"); tellp()` | 0 | plain ofstream **truncated** the file |
| `seekp(6)` | 6 | absolute position (the `W`) |
| `seekp(4, ios::beg)` | 4 | 0 + 4 (the `o` of Hello) |
| `seekp(-4, ios::end)` | 7 | 11 − 4 (the `o` of World) |
| `seekp(-4, ios::end); seekp(-6, ios::cur)` | 1 | 7 − 6 (the `e`) |
| `begin = tellg(); seekg(0, ios::end); end = tellg();` | `end − begin` = 11 bytes | file size |

- `seekp`/`tellp` for `ofstream`, `seekg`/`tellg` for `ifstream`, either for `fstream`. The wrong one is a **compile error**.
- Reading moves the cursor: after `seekg(6, ios::beg)` and `read(buffer, 5)` the cursor is at 11 and the buffer holds `World`.

## C-style arrays and random numbers

| Declaration | Meaning |
|---|---|
| `float values[3]` | array of 3 floats |
| `char * names[32]` | array of 32 **pointers to char** |
| `int scores[] = {1, 2, 3, 4};` | size deduced (4) |
| `int some_scores[8] = {1, 2, 3, 4};` | equivalent to `{1, 2, 3, 4, 0, 0, 0, 0}` |

`sizeof(int[4])` is 16; inside `f(int arr[])` the parameter is a **pointer** (8 bytes on x64) to the original array, so changes through it change the caller's array.

```cpp
#include <cstdlib>  // rand, srand, RAND_MAX
#include <ctime>    // time
srand(time(NULL));                          // seed ONCE, never in a loop
int r0 = rand() % 100;                      // 0 .. 99   (right side not inclusive)
int r1 = rand() % 100 + 1;                  // 1 .. 100
int r2 = rand() % 25 + 2000;                // 2000 .. 2024
double zero_to_one = rand() / (double) RAND_MAX;   // 0.0 .. 1.0
```

| `<random>` piece | Role |
|---|---|
| `default_random_engine generator(time(0));` | engine seeded with the clock |
| `uniform_real_distribution<double> distribution(a, b);` | doubles in [a, b] |
| `random_device rd; mt19937 generator(rd());` | a generator seeding a generator |
| `uniform_int_distribution<> distribution(a, b);` | ints in a … b **inclusive** |
| `distribution(generator)` | produces the next number |

## Pointers vs references

| | Pointer `int* p` | Reference `int& r` |
|---|---|---|
| Holds | an **address** (or `nullptr`) | nothing new: it *is* another name for a box |
| Must be initialized? | no (assign `nullptr` if empty) | **yes**, at creation |
| Can change target? | yes: `p = &y;` | **never** re-seated |
| Assignment `p = q` / `r = m` | p points where q points | writes m's value into the referent (`ref = m` means `n = m`) |
| Reach the value | `*p` (or `p[i]`) | just `r` |
| Get one from a variable | `&x` (address-of) or `new` | `int& r = x;` |
| Pass to a function | `swap(&first, &second)` with `void swap(int*, int*)` | `swap(first, second)` with `void swap(int&, int&)` |
| Assembly | the same instructions; references are for programmers and become pointers when compiled | |

| `&` and `*` | Meaning |
|---|---|
| type to the left: `int& x`, `int* z` | declares a reference / a pointer |
| nothing to the left: `&b` | address-of operator (gives a pointer value) |
| `*p` in an expression | dereference: go to the box p points at |
| `*p = 5` | writes into that box; `p = &y` changes where p points |

- Pass by value copies: `void swap(int a, int b)` swaps copies, so `first` (3522) and `second` (2526) stay put.
- `int& ref{1}` **no**; `const int& r{1}` yes. `long& ref = n` (n an int) **no**; `const long& ref = n` yes (binds a temporary copy).
- Never return a reference or pointer to a local variable. `int f(int)`: two copies · `int f(int&)`: copy out only · `int& f(int)`: dangerous · `int& f(int&)`: original in and out.
- `sizeof(int)` 4, `sizeof(int*)` 8 on the instructor's 64-bit machine.
- Practice sheet: after `p1 = &x; p2 = &y; *p1 = 5; *p1 = *p2; p2 = p1; *p1 = *p2 + 10;` the pairs (x, y) are 5,15 · 5,15 · 5,15 · 15,15 · 15,15 · **25,15**. `test(int& x, int y, int* z)` with `a = 7, b = 6, c = &b` prints **8 7 7**.

## `std::string` and `getline` (`<string>`)

| Code | Note |
|---|---|
| `string s1; string s2 = "Hello"; string s3{"world!"};` | all call a constructor; no `\0` needed |
| `s.size()` / `s.length()` | same thing |
| `s.c_str()` | non-modifiable C char array |
| `s < t`, `s == t` | lexicographic comparison (no compareTo) |
| `s[0]` / `s.at(1)` | char at index; `at` checks bounds and throws |
| `string second = first;` / `first = second;` | copy constructor / assignment operator |
| `getline(cin, input)` | reads a line into input, **tosses the newline**, returns cin |
| `getline(in, s, delim)` | custom delimiter |

getline stops at: EOF (sets eofbit) · delimiter or newline (extracted and tossed) · too many characters (sets failbit).

| Input (`\n` = Enter, `*` = EOF) | `input` | Bits |
|---|---|---|
| `Hello World` | Hello World | — |
| `Hello\nworld\n` | Hello | — |
| `\nWorld\n` | EMPTY | — |
| `Hello*` | Hello | eofbit |
| `Hello\n*` | Hello | — |
| `*` | no change | eofbit **and** failbit |

- Idiom: `while (getline(cin, line)) { /* process */ }`
- `cin >> n;` then `getline` gives an **empty** line: the newline after n is still in the buffer (fix: `cin.ignore(...)`).

## `istringstream` (`<sstream>`)

| Code | Result |
|---|---|
| `istringstream iss{" 123abc"}; iss >> n;` | n = 123 |
| `iss.str(" 123abc"); iss >> n >> aString;` | 123, `abc` |
| `iss.str(" 123a b c"); iss >> n >> aString;` | 123, `a` |
| `while(!iss.eof()) { iss >> newString; ... }` on ` 123a b c` | `123a`, `b`, `c` |
| reuse: `iss.clear(); iss.str(line); if (iss >> n) sum += n;` | `clear()` resets failbit/eofbit from the last line |
| fresh per line: `istringstream iss{line};` | no clear needed |

## `std::vector<T>` (`<vector>`, think Java ArrayList)

| Member | Does |
|---|---|
| `push_back(v)` | appends v |
| `size()` | number of elements (`size_t`) |
| `v[pos]` | reference to element, **no** bounds check |
| `at(pos)` | reference, bounds-checked, throws `out_of_range` |
| `erase(v.begin()+1)` | removes index 1 (the 10 in 5, 10, 15) |
| `clear()` | removes everything |
| `for (int value : v)` | ranged-for over **values** (not indices) |

Capacity doubles when full: 1, 2, 4, 8 (size counts elements; capacity counts slots).

## `new` and `delete`

| | Automatic (`int i; int a[10];`) | Dynamic (`new`) |
|---|---|---|
| Allocated | on the stack, automatically | on the heap, by you |
| Freed | when the function returns | only when you `delete` |
| Forgetting | impossible | **memory leak** (no garbage collector) |

```cpp
int * p = nullptr;  p = new int { 3522 };     // three equivalent forms:
int * q = new int;  *q = 3522;
int * r = new int{3522};
int * arr = new int [5];  for (int i = 0; i < 5; ++i) arr[i] = i;
delete p; delete q; delete r;   // new  -> delete
delete[] arr;                   // new[] -> delete[]
```

- `new` returns a **pointer** to a data object. C: `malloc`/`calloc`/`realloc`/`free`.
- `delete i` frees the object i points at, not i; afterwards i is **dangling** (set it to `nullptr`).
- Leak: `i = new int{11}; a = new int{99}; i = a;` → the 11 at `0xffff000A` has nothing pointing at it. Fix order: `delete i; i = a; delete i;`.
- Every `new` needs one matching `delete`. `new (nothrow) int[n]` returns `nullptr` instead of throwing.

## True or false

:::quiz Fifteen true or false (answers at the bottom)
1. `ofstream` opened with no flags keeps the old contents.
2. `ios_base::app` moves to the end before every write.
3. `tellp` belongs to input streams.
4. `seekp(-4, ios::end)` on `Hello World` gives 7.
5. `ofstream` has a `seekg` member.
6. `int s[8] = {1,2,3,4};` zero-fills the last four.
7. `srand` should be called before every `rand()`.
8. `rand() % 100 + 1` is 1 to 100.
9. A function receives the original variable by default.
10. A reference must be initialized when created.
11. A reference can be re-seated with `=`.
12. `const int& r{1};` compiles.
13. `getline` leaves the newline in the buffer.
14. `at()` throws for a bad index; `[]` does not check.
15. C++ frees `new` memory automatically when a function returns.

Answers, in order: F T F T F · T F T F T · F T F T F
:::

```quiz
[
  {
    "q": "Rapid fire: `Hello World` in the file, `ofstream f(\"f.txt\", ios::app); f.seekp(4, ios::beg); cout << f.tellp();` prints…",
    "options": ["4", "7", "11", "0"],
    "answer": 0,
    "explain": "ios::beg means the offset is measured from position 0, so 0 + 4 = 4 (the o of Hello)."
  },
  {
    "q": "Which header gives you `istringstream`?",
    "options": ["`<string>`", "`<sstream>`", "`<fstream>`", "`<iostream>`"],
    "answer": 1,
    "explain": "String streams live in <sstream>; <string> gives std::string and getline."
  },
  {
    "q": "`int x = 5; int* p = &x; *p = 9; cout << x;` prints…",
    "options": ["5", "9", "the address of x", "a compile error"],
    "answer": 1,
    "explain": "*p is x's box, so writing 9 through the pointer changes x itself."
  },
  {
    "q": "`int n{123}; int& ref = n; int m{345}; ref = m; cout << ref;` prints…",
    "options": ["123", "345", "the address of m", "a compile error"],
    "answer": 1,
    "explain": "ref = m assigns into n (ref is a nickname for n), so both n and ref read 345."
  },
  {
    "q": "Which call matches `void swap(int* arg1, int* arg2)`?",
    "options": ["`swap(first, second)`", "`swap(&first, &second)`", "`swap(*first, *second)`", "`swap(int first, int second)`"],
    "answer": 1,
    "explain": "A pointer parameter needs an address, and & in front of a variable is the address-of operator."
  },
  {
    "q": "Input is `Hello` then EOF with no newline. After `getline(cin, s)`, `s` and the flags are…",
    "options": ["`Hello`, eofbit set", "`Hello`, failbit set", "unchanged, eofbit and failbit set", "empty, no bits set"],
    "answer": 0,
    "explain": "Characters were read before EOF arrived, so the read succeeds (s = Hello) and only eofbit records that the end was reached."
  },
  {
    "q": "`vector<int> v; v.push_back(5); v.push_back(10); v.push_back(15); v.erase(v.begin()+1);` leaves…",
    "options": ["5, 15", "10, 15", "5, 10", "an empty vector"],
    "answer": 0,
    "explain": "begin()+1 points at index 1, the 10, which is erased; 15 shifts down to index 1."
  },
  {
    "q": "`int* i = new int{11}; int* a = new int{99}; i = a; delete i;` What is leaked?",
    "options": ["Nothing", "The 99 block", "The 11 block", "Both blocks"],
    "answer": 2,
    "explain": "i = a made i point at the 99 block, so delete i freed that one. The 11 block lost its only pointer at i = a and can never be deleted."
  }
]
```

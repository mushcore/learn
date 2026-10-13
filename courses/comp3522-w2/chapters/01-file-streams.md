---
title: File streams: open, close, read, copy
minutes: 15
---

The `cin` and `cout` machinery from Week 1 works unchanged on files. Only the object on the left of `<<` or `>>` changes.

## Three new stream types

```cpp
#include <fstream>
```

| Class | Stands for | Use it to |
|---|---|---|
| `ifstream` | input file stream | **read** from a file |
| `ofstream` | output file stream | **write** to a file |
| `fstream` | file stream | read **and** write the same file |

An `ofstream` is an `ostream` and an `ifstream` is an `istream` (they inherit from them), so `<<`, `>>`, `getline` and every manipulator from Week 1 work on file streams.

## Opening a file

Name the file when you create the stream, then check that the open worked:

```cpp
#include <fstream>
fstream f{"data.txt"};
if (!f.is_open()) {   // Or if (!f) ...
    cerr << "Unable to open file" << endl;
    exit(1);
}
f << "hello" << 123 << endl;   // file closed automatically at the end of scope
```

`is_open()` is `true` when the stream is attached to an open file; `if (!f)` tests the same thing, because a failed open leaves the stream in its failed state. `cerr` is `cout` for error messages (CLion shows it in red), and `exit(1)` from `<cstdlib>` ends the program with an error code.

```cpp run pin openingFiles.cpp
// predict: data.txt does not exist when the program starts. Write the three lines printed, exactly as the code formats them (open or NOT open, then the first line).
#include <iostream>
#include <fstream>
#include <string>
#include <cstdlib>
using namespace std;

int main()
{
    fstream f{"data.txt"};            // default mode: in | out
    cout << "fstream on a missing file: " << (f.is_open() ? "open" : "NOT open") << endl;

    ofstream fout{"data.txt"};        // out: creates the file if it does not exist
    if (!fout) {
        cerr << "Unable to open file" << endl;
        exit(1);
    }
    fout << "hello" << 123 << endl;
    fout.close();

    ifstream fin;
    fin.open("data.txt");             // the other way to open: a separate call
    cout << "ifstream after the file exists: " << (fin.is_open() ? "open" : "NOT open") << endl;
    string line;
    getline(fin, line);
    cout << "first line: " << line << endl;
    fin.close();
    return 0;
}
```

`fout << "hello" << 123 << endl;` writes to the file exactly what `cout` would print, and `fin.open("data.txt");` is the second way to open: declare the stream, then call `open`. The slides show that form for all three classes (`ifstream fin; fin.open("helloWorld.txt");` and likewise `fout`, `fs`).

:::warn Correcting the slide
The slide's comment on `fstream f{"data.txt"};` says it "opens data for writing". With no mode, an `fstream` opens for input and output, and that open fails when the file does not exist yet. To create the file, use an `ofstream` or give the `fstream` an explicit mode such as `ios_base::out`.
:::

:::tip Where does the file live?
A relative name like `"data.txt"` is looked up in the program's working directory. In CLion that is `cmake-build-debug`, not the folder with `main.cpp`. In this app every run gets a private temporary folder, so the examples create the file they read.
:::

## Closing a file

```cpp
fin.close();
fout.close();
fs.close();
```

`close()` flushes the buffer and releases the file. The destructor calls it when the stream goes out of scope (the slide's "file closed automatically"); call it yourself to reopen the same file while the object is alive.

## Buffers

Every stream owns an internal **buffer** where characters wait between the program and the device.

| Stream | Buffer class |
|---|---|
| file streams (`ifstream`, `ofstream`, `fstream`) | `filebuf` |
| `cin`, `cout`, `cerr` | `streambuf` |
| string streams (later this week) | `stringbuf` |

You rarely manage a buffer directly; `rdbuf()` hands it to you for the one-line copy at the end of this lesson.

## Open modes

The mode type is `std::ios_base::openmode`, and the slides list six flags:

| Flag | Name | Meaning (from the slides) |
|---|---|---|
| `ios_base::in` | input | Allow input operations on the stream. |
| `ios_base::out` | output | Allow output operations on the stream. |
| `ios_base::app` | append | Set the stream's position indicator to the **end of the stream before each output** operation. |
| `ios_base::binary` | binary | Open in binary mode when the file contains binary data. |
| `ios_base::trunc` | truncate | **Discard the contents** of the stream when opening. |
| `ios_base::ate` | at end | Set the stream's position indicator to the end of the stream **on opening**. |

Flags combine with bitwise OR:

```cpp
ifstream f1{"data", ios_base::in | ios_base::binary};
ofstream f2{"dest", ios_base::out | ios_base::app};
```

With no mode, `ifstream` means `in`, `fstream` means `in | out` (contents kept, file must exist), and `ofstream` means `out`, which **truncates**: the file is emptied the moment it opens. `ate` moves to the end once, when the file opens; `app` moves to the end before every write, wherever you seek.

```cpp run pin openModes.cpp
// predict: log.txt is written three times. What is left in it at the end?
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    ofstream first{"log.txt"};                          // out: created (or emptied)
    first << "first run" << endl;
    first.close();

    ofstream second{"log.txt", ios_base::out | ios_base::app};   // app: added at the end
    second << "second run" << endl;
    second.close();

    ofstream third{"log.txt"};                          // out again: everything before is discarded
    third << "third run" << endl;
    third.close();

    ifstream in{"log.txt"};
    cout << in.rdbuf();                                 // print the whole file
    return 0;
}
```

Each open's mode decides the fate of what the previous one wrote: `ofstream second{"log.txt", ios_base::out | ios_base::app};` adds at the end, and `ofstream third{"log.txt"};` is a plain `out` again.

```widget
open-modes
{ "title": "Open modes: the constructor call and what happens to log.txt" }
```

## Reading and writing one character at a time

As in C, `get` acquires one character and `put` places one. (The slide says `basic_istream::put`; `put` belongs to the output side, `basic_ostream`.) The slide's reading loop:

```cpp
char c;
while ((c = in.get()) != EOF)
{
    // Do something
}
```

The parentheses store the character and compare it with `EOF` (−1) in one line. `get()` returns an `int`, not a `char`, so it has room for all 256 byte values plus `EOF`; the slide's `char c` works for text files, but `int c;` is the safe declaration.

The lecture's `fileIO.cpp` copies a file character by character, replacing every digit with a star.

```cpp run pin fileIO.cpp
// predict: data.txt contains hello123. Write the one line printed: output.txt: followed by the copy.
#include <iostream>
#include <fstream>
#include <cctype>
#include <cstdlib>
using namespace std;

int main()
{
    ofstream seed{"data.txt"};        // in the lecture this file already exists in cmake-build-debug
    seed << "hello123";
    seed.close();

    ifstream in{"data.txt"};
    ofstream outFile{"output.txt"};
    if (!in) {
        cerr << "Unable to open file" << endl;
        exit(1);
    }

    char c;
    while ((c = in.get()) != EOF) {
        isdigit(c) ? outFile << '*' : outFile << c;
    }
    outFile.close();
    in.close();

    ifstream check{"output.txt"};
    cout << "output.txt: " << check.rdbuf() << endl;
    return 0;
}
```

The first three lines only recreate the lecture's `data.txt`. `if (!in)` guards the input file, and `isdigit(c) ? outFile << '*' : outFile << c;` is the Week 1 ternary as a compact if/else: `isdigit` (from `<cctype>`) is true for `'0'` to `'9'`. The lecture also writes it with `outFile.put('*')` and `outFile.put(c)`.

## Copying a whole file in one line

`rdbuf()` returns a pointer to a stream's internal buffer, and inserting that pointer into an output stream pours the entire remaining contents across:

```cpp run pin copyFile.cpp
// predict: what does the program print?
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    ofstream seed{"input.txt"};
    seed << "Hi class, copying is easy" << endl;
    seed.close();

    ifstream inFile{"input.txt"};
    ofstream outFile{"output.txt"};
    outFile << inFile.rdbuf();        // the whole file, in one insertion
    outFile.close();

    ifstream check{"output.txt"};
    cout << check.rdbuf();
    return 0;
}
```

`outFile << inFile.rdbuf();` is the entire copy, and `cout << check.rdbuf();` uses the same trick to display a file.

```quiz
[
  {
    "q": "Which header declares `ifstream`, `ofstream` and `fstream`?",
    "options": ["`<iostream>`", "`<fstream>`", "`<filestream>`", "`<cstdio>`"],
    "answer": 1,
    "explain": "The three file stream classes are defined in <fstream>. <iostream> gives you cin/cout/cerr; the file versions need their own header."
  },
  {
    "q": "Which class opens a file for **both** reading and writing?",
    "options": ["`ifstream`", "`ofstream`", "`fstream`", "`iofstream`"],
    "answer": 2,
    "explain": "ifstream = input (read), ofstream = output (write), fstream = both. There is no iofstream."
  },
  {
    "q": "An `ofstream` opened with no explicit mode keeps the file's existing contents and appends after them.",
    "type": "tf",
    "answer": false,
    "explain": "A plain ofstream means ios_base::out, which truncates: the old contents are discarded when the file opens. Add ios_base::app to append."
  },
  {
    "q": "Which of these correctly opens `dest` for output in append mode?",
    "options": ["`ofstream f2{\"dest\", ios_base::out & ios_base::app};`", "`ofstream f2{\"dest\", ios_base::out | ios_base::app};`", "`ofstream f2{\"dest\", ios_base::out + ios_base::app};`", "`ofstream f2{\"dest\", ios_base::out, ios_base::app};`"],
    "answer": 1,
    "explain": "Open-mode flags are combined with the bitwise OR operator |, exactly as on the slide. & would mask the flags to zero; + and a third argument are not how openmode works."
  },
  {
    "q": "What is the difference between `ios_base::app` and `ios_base::ate`?",
    "options": ["They are identical", "`ate` moves to the end once on opening; `app` moves to the end before every write", "`app` moves to the end once on opening; `ate` moves to the end before every write", "`ate` truncates the file; `app` does not"],
    "answer": 1,
    "explain": "ate = at end (on opening, once). app = append (position at end before each output operation). Neither truncates."
  },
  {
    "q": "Which mode flag discards the existing contents of the file when it is opened?",
    "options": ["`ios_base::binary`", "`ios_base::ate`", "`ios_base::trunc`", "`ios_base::in`"],
    "answer": 2,
    "explain": "trunc = truncate: discard the contents of the stream when opening. It is what a plain ofstream (out) does implicitly."
  },
  {
    "q": "Which statements about `cerr` are true? (select all)",
    "options": ["It is an output stream like `cout`", "It is intended for error messages", "It reads error input from the keyboard", "It is declared in `<iostream>`"],
    "answer": [0, 1, 3],
    "explain": "cerr is a global ostream (declared in <iostream>) connected to the standard error stream; it writes, it never reads. The lecture calls it 'a cout specifically used for errors'."
  },
  {
    "q": "What does this program print? (`data.txt` contains `ab12`)",
    "code": "ifstream in{\"data.txt\"};\nofstream out{\"copy.txt\"};\nchar c;\nwhile ((c = in.get()) != EOF) {\n    isdigit(c) ? out << '*' : out << c;\n}\nout.close();\nifstream check{\"copy.txt\"};\ncout << check.rdbuf();",
    "options": ["ab12", "ab**", "**12", "****"],
    "answer": 1,
    "explain": "get() returns each character in turn until EOF. isdigit is true only for '1' and '2', so those become '*' while 'a' and 'b' pass through: ab**."
  },
  {
    "q": "Why does `istream::get()` return an `int` rather than a `char`?",
    "options": ["Because characters are stored as integers on disk", "So it can return every possible character value plus the extra value EOF (−1)", "Because `char` cannot be used in a while condition", "It returns a `char`; the slide is mistaken"],
    "answer": 1,
    "explain": "An int has room for all 256 byte values and one more, EOF (−1), that cannot be confused with any character. That is why the safe declaration for the loop variable is int c."
  },
  {
    "q": "Which single statement copies the entire contents of `inFile` (an `ifstream`) into `outFile` (an `ofstream`)?",
    "options": ["`outFile = inFile;`", "`outFile << inFile;`", "`outFile << inFile.rdbuf();`", "`inFile >> outFile;`"],
    "answer": 2,
    "explain": "rdbuf() returns a pointer to the stream's internal buffer; inserting that pointer into an output stream transfers everything. Streams cannot be assigned or inserted directly."
  },
  {
    "q": "When a stream object goes out of scope without an explicit `close()`, the file stays open until the program ends.",
    "type": "tf",
    "answer": false,
    "explain": "The stream's destructor closes the file automatically ('file closed automatically' on the slide). Calling close() yourself is still good practice and is required if you want to reopen the same file while the object is alive."
  },
  {
    "type": "match",
    "q": "Match each stream to the buffer class it uses.",
    "pairs": [
      ["file streams (`ifstream`, `ofstream`, `fstream`)", "`filebuf`"],
      ["`cin`, `cout`, `cerr`", "`streambuf`"],
      ["string streams", "`stringbuf`"]
    ],
    "explain": "Every stream owns an internal buffer; the class differs by device: filebuf for files, streambuf for the console streams, stringbuf for string streams. You rarely touch them directly, but rdbuf() exposes them."
  }
]
```

---
title: File streams: open, close, read, copy
minutes: 20
---

Week 1 covered IO with the console: `cin` reads from the keyboard, `cout` writes to the screen. This week the same machinery reads and writes **files** on disk. Nothing about `<<`, `>>` or the manipulators changes; only the object on the left of the operator does.

## Three new stream types

Everything you need is in one header:

```cpp
#include <fstream>
```

It defines three classes:

| Class | Stands for | Use it to |
|---|---|---|
| `ifstream` | input file stream | **read** from a file |
| `ofstream` | output file stream | **write** to a file |
| `fstream` | file stream | read **and** write the same file |

Think of them as the file-flavoured versions of what you already know: `cout` is an `ostream` and `cin` is an `istream`; an `ofstream` *is* an `ostream` (it inherits from it) and an `ifstream` *is* an `istream`. That is why the insertion operator `<<`, the extraction operator `>>`, `getline`, and every manipulator from Week 1 work on file streams unchanged.

## Opening a file

The shortest way to open a file is to name it when you create the stream object, then check that the open worked:

```cpp
#include <fstream>
fstream f{"data.txt"};
if (!f.is_open()) {   // Or if (!f) ...
    cerr << "Unable to open file" << endl;
    exit(1);
}
f << "hello" << 123 << endl;   // file closed automatically at the end of scope
```

Three things are new here:

- **`is_open()`** returns `true` if the stream really is attached to an open file. The shorter `if (!f)` means the same thing: like `cin` in Week 1, a stream converts to `false` when it is in a failed state, and a failed open puts it in that state.
- **`cerr`** is "`cout` for errors". It is another global `ostream`, wired to the standard error stream, and CLion prints it in red. You could write the message with `cout`, but error messages belong on `cerr`.
- **`exit(1)`** (from `<cstdlib>`) ends the program immediately with exit code 1, which tells the operating system "something went wrong". `return 0;` from `main` means "no errors"; a non-zero code means an error.

Run the program below before reading on. It opens the same file name three different ways.

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

Line by line:

1. `fstream f{"data.txt"};` asks for reading *and* writing. That combination needs the file to exist already, so on a fresh run it reports `NOT open`. (The slide's comment says this line "opens data for writing"; that is only true when `data.txt` is already there. See the warning below.)
2. `ofstream fout{"data.txt"};` asks for writing only. An `ofstream` **creates the file if it does not exist**, so this one succeeds, and `fout << "hello" << 123 << endl;` puts the text `hello123` and a newline into it, exactly as `cout` would put it on the screen.
3. `fin.open("data.txt");` shows the second way to open: declare the stream first, then call its `open` member function. The constructor form is shorter, but you will see both.
4. `getline(fin, line);` reads the first line back. The file now exists and holds `hello123`, so that is what prints.

:::warn Correcting the slide
`fstream f{"data.txt"};` does **not** create a missing file. With no mode given, an `fstream` opens for input *and* output, and an input-capable open fails when there is nothing to read. If you want the file created, use an `ofstream`, or give the `fstream` an explicit mode such as `ios_base::out` (modes are next). The check `if (!f)` exists precisely because opens fail more often than you expect: wrong folder, wrong name, no permission, or, as here, a file that is not there yet.
:::

The slides also show all three classes opened with `open`:

```cpp
// Open a file for reading
ifstream fin;
fin.open("helloWorld.txt");

// open a file (or create it if it doesn't exist) for writing
ofstream fout;
fout.open("helloWorld.txt");

// open a file for reading and writing.
fstream fs;
fs.open("helloWorld.txt");
```

:::tip Where does the file live?
A relative name like `"data.txt"` is looked up in the program's **working directory**. In CLion that is the build folder, `cmake-build-debug`, not the folder with your `main.cpp`. The instructor's advice from the lecture: put the text files you want to read inside `cmake-build-debug`, "not in this hierarchy up here". Inside this study app every run gets its own private temporary folder, which is why the examples here create the file they need before reading it.
:::

## Closing a file

"Too easy for its own slide, but here we are anyway":

```cpp
fin.close();
fout.close();
fs.close();
```

Closing flushes anything still sitting in the stream's buffer and gives the file back to the operating system. You do not strictly have to call it: when a stream object goes out of scope its destructor closes the file for you (that is what the slide means by "file closed automatically"). Calling `close()` yourself is still good practice, and it is the only option when you want to reopen the same file in a different mode while the object is still alive, as `openingFiles.cpp` does.

## Buffers

Every stream object owns an internal **buffer**: a chunk of memory where characters wait before they are actually written to, or after they are read from, the real device.

| Stream | Buffer class |
|---|---|
| file streams (`ifstream`, `ofstream`, `fstream`) | `filebuf` |
| `cin`, `cout`, `cerr` | `streambuf` |
| string streams (later this week) | `stringbuf` |

You will rarely manage a buffer directly, but knowing it exists explains two things you will meet: why `endl` "flushes" (it pushes the buffer out to the device), and why the one-line file copy at the end of this lesson works (it hands one stream's whole buffer to another).

## Open modes

When you open a stream you can say *how*. The type is `std::ios_base::openmode`, and the slides list six flags:

| Flag | Name | Meaning (from the slides) |
|---|---|---|
| `ios_base::in` | input | Allow input operations on the stream. |
| `ios_base::out` | output | Allow output operations on the stream. |
| `ios_base::app` | append | Set the stream's position indicator to the **end of the stream before each output** operation. |
| `ios_base::binary` | binary | Open in binary mode when the file contains binary data. |
| `ios_base::trunc` | truncate | **Discard the contents** of the stream when opening. |
| `ios_base::ate` | at end | Set the stream's position indicator to the end of the stream **on opening**. |

Flags combine with bitwise OR, the same `|` you met in the operators lesson:

```cpp
ifstream f1{"data", ios_base::in | ios_base::binary};
ofstream f2{"dest", ios_base::out | ios_base::app};
```

Each class also has a default when you give no mode at all, and the defaults matter:

- `ifstream` alone means `in`.
- `ofstream` alone means `out`, and **`out` by itself truncates**: the old contents are thrown away the moment the file opens. The instructor's phrasing in the lecture was that without `app` new data goes "to the beginning of the file"; more precisely, the file is emptied first, so whatever you write is all that remains.
- `fstream` alone means `in | out`: read and write, contents kept, but the file must already exist.

`app` and `ate` sound alike and the difference is a favourite quiz question. `ate` moves to the end **once, when the file opens**; after that you may seek anywhere and write there. `app` moves to the end **before every single write**, so no matter where you seek, output always lands at the end.

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

The first `ofstream first{"log.txt"};` creates the file and writes one line. The second open uses `ios_base::out | ios_base::app`, so `second run` is appended after it: two lines. The third open, `ofstream third{"log.txt"};`, is a plain `out` again, which truncates: both earlier lines vanish before `third run` is written. Only one line survives, and that is all `in.rdbuf()` prints. Change the third open to append mode and run again to keep all three.

Try every combination below; it shows the exact constructor call and what happens to an existing file.

```widget
open-modes
```

:::quiz Two true/false traps
"An `ofstream` opened with no mode keeps the file's old contents and writes after them." **False**: plain `out` truncates. "`ios_base::app` and `ios_base::ate` do the same thing." **False**: `ate` positions at the end once on opening; `app` positions at the end before every write.
:::

## Reading and writing one character at a time

Just like C, you can move characters individually:

1. Use `std::basic_istream::get` to acquire the character.
2. Use `std::basic_ostream::put` to place the character. (The slide's text says `basic_istream::put`; `put` really belongs to the output side, `basic_ostream`, which is what an `ofstream` is.)

The slide's reading loop:

```cpp
char c;
while ((c = in.get()) != EOF)
{
    // Do something
}
```

Read it inside out. `in.get()` extracts the next character and returns it. The assignment `c = in.get()` stores it and, because an assignment is an expression whose value is the value assigned, the parentheses let the loop compare that same character against `EOF` in one line. `EOF` is a constant from `<cstdio>` (its value is −1, and `<iostream>` already includes it) that `get()` returns when there are no characters left. That is the whole reason `get()` returns an `int` rather than a `char`: an `int` has room for all 256 byte values *plus* one extra value that means "end of file".

Storing the result in a `char`, as the slide does, works for ordinary text files on this compiler. The strictly safe declaration is `int c;`, because a `char` can only hold byte values: where `char` is signed, one legitimate byte (0xFF) compares equal to −1 and stops the loop early; where it is unsigned, nothing ever compares equal to −1 and the loop never ends. Both versions compile cleanly; know that `int` is the careful choice.

Here is the lecture's `fileIO.cpp`: copy a file character by character, replacing every digit with a star.

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

The first three lines only recreate the lecture's `data.txt`; in CLion you would drop that file into `cmake-build-debug` by hand. Then:

- `ifstream in{"data.txt"};` is the source and `ofstream outFile{"output.txt"};` is the destination. If `output.txt` does not exist, the `ofstream` creates it; the instructor deleted it live in the lecture and ran again to prove that.
- `if (!in)` guards the input file. There is no point copying from a file that failed to open.
- `while ((c = in.get()) != EOF)` walks the input one character at a time.
- `isdigit(c) ? outFile << '*' : outFile << c;` is the Week 1 ternary operator used as a compact if/else. `isdigit` (from `<cctype>`) is true for `'0'` to `'9'`, so digits become `*` and everything else is passed straight through. Both branches insert into `outFile`, so the whole expression is one statement.
- `outFile.close();` and `in.close();` finish the job. The file now reads `hello***`.

The lecture also shows the C-style alternative for the output side: `outFile.put('*')` and `outFile.put(c)` do the same as the insertions. In C++ the `<<` form is the usual choice.

## Copying a whole file in one line

Copying character by character is instructive, but if you only want an exact duplicate, the buffer from earlier does it in one statement. `rdbuf()` returns a pointer to a stream's internal buffer, and inserting that pointer into an output stream pours the entire remaining contents across:

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

`outFile << inFile.rdbuf();` is the entire copy. As the instructor put it, "it's so easy, it's kind of hard to explain": the input stream's buffer is handed to the output stream and every character flows through. The final `cout << check.rdbuf();` uses the same trick to print the copy to the screen, which is a handy way to display any small file.

:::quiz Vocabulary the quiz likes
`ifstream` reads, `ofstream` writes, `fstream` does both; they live in `<fstream>`. File streams use a `filebuf`; `cin`/`cout`/`cerr` use a `streambuf`; string streams use a `stringbuf`. `is_open()` (or `!f`) tests the open; `cerr` reports; `exit(1)` quits with an error code.
:::

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

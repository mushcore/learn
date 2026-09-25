---
title: Seeking: tellg, tellp, seekg, seekp
minutes: 18
---

You can now open, read, write and copy files. But every example so far started at the beginning and ran to the end. Suppose you are writing a text editor and want to copy from the seventh character to the thirteenth, or jump straight to the end of a log. You need a way to **navigate** inside the file. The lecture calls this **seeking**.

## The cursor

Imagine a text file that contains:

```text
Hi class, here is some text
```

When you open it with an `ifstream`, the stream keeps a **position indicator**, which the instructor calls "the cursor" (in quotes, because nothing blinks on screen). It starts at **position 0**, just before the `H`. Every `get()`, `>>` or `getline` reads from the cursor and moves it forward. Seeking means reading or changing that number directly.

Positions count characters from 0. For the eleven-character file `Hello World` the positions are:

| char | H | e | l | l | o | ␣ | W | o | r | l | d | (end) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| position | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |

Position 11 is one past the last character: the end of the file, and also its size.

## Where is the cursor? tellg and tellp

Two member functions **get** the current position:

```cpp
// "Tell put" - Returns the position of the current character in the output stream
streampos std::ostream::tellp()

// "Tell get" - Returns the position of the current character in the input stream
streampos std::istream::tellg()
```

The letters are the whole trick: **g** is for *get* (input streams read, they *get* characters), **p** is for *put* (output streams *put* characters). So an `ifstream` has `tellg`, an `ofstream` has `tellp`, and an `fstream`, which does both, has both. The instructor's honest reaction in the lecture: "I don't know why they did this, it's really confusing to me; it seems like they should just use a function called `tell` for both." Confusing or not, the quiz will ask, so learn the pairing.

Both return a `streampos`, which is just a number you can print or subtract.

The slides give three openings of the same `helloWorld.txt` (contents `Hello World`) and ask what each `tell` prints:

```cpp run pin tellDemo.cpp
// predict: helloWorld.txt holds Hello World (11 characters). Write the five numbers this machine prints, one per line. The second one is a trap explained below.
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    ofstream seed{"helloWorld.txt"};
    seed << "Hello World";                        // 11 characters, no newline
    seed.close();

    ifstream reader("helloWorld.txt");
    cout << reader.tellg() << endl;               // slide: 0

    ofstream appender("helloWorld.txt", ios::app);
    cout << appender.tellp() << endl;             // slide: 11 (see the warning)

    ofstream atEnd("helloWorld.txt", ios::app | ios::ate);
    cout << atEnd.tellp() << endl;                // 11, on every platform

    reader.close();
    appender.close();
    atEnd.close();

    ofstream writer("helloWorld.txt");
    cout << writer.tellp() << endl;               // slide: 0
    writer.close();

    ifstream check("helloWorld.txt");
    check.seekg(0, ios::end);
    cout << check.tellg() << endl;                // bytes left in the file
    return 0;
}
```

1. `ifstream reader("helloWorld.txt");` opens for reading. The cursor starts at the beginning, so `reader.tellg()` prints **0**. Note the `g`: an input stream.
2. `ofstream appender("helloWorld.txt", ios::app);` opens for appending. The slide's answer is **11**: append mode puts the cursor at the end, and the end of an eleven-character file is position 11. Note the `p`: an output stream.
3. The `ios::app | ios::ate` variant is not on the slide; it is here because of the warning below. `ate` explicitly moves the cursor to the end when the file opens, so `atEnd.tellp()` is **11** everywhere.
4. `ofstream writer("helloWorld.txt");` is a plain `ofstream`, which as you learned in the previous lesson **truncates**: the file is emptied on opening. The cursor is at position 0 of a now-empty file, so `writer.tellp()` prints **0**. That is the real reason for the slide's answer, and the last line of the program proves it: after that open, the file has **0** bytes left.

:::warn The slide says 11; this compiler prints 0
On the MinGW g++ that CLion (and this app) uses, an `ofstream` opened with `ios::app` alone reports `tellp()` as **0** right after opening, even though the file has 11 characters. The position report is lazy: it only becomes meaningful once you write. The *behaviour* is still what the slide describes, because every write in `app` mode goes to the end of the file regardless of what `tellp()` says (the next program proves that too). If you want the number 11 as on the slide, add `ios::ate`, which performs an explicit seek to the end on opening. For the quiz, answer as the slide does: append mode positions at the end, so `tellp()` reports 11.
:::

:::quiz Which one prints 0 and why
"`ofstream myFile("helloWorld.txt"); cout << myFile.tellp();` prints 0 because output streams always start at the beginning." Half right. It prints 0, but the deeper reason is that a plain `ofstream` **truncated** the file first: the cursor is at the start of an empty file. Say both when asked.
:::

## Moving the cursor: seekg and seekp

Two member functions **set** the position, each in two forms:

```cpp
// "Seek put" - use seekp for output streams
ofstream& seekp(streampos)
ofstream& seekp(streamoff, ios_base::seekdir)

// "Seek get" - use seekg for input streams
ifstream& seekg(streampos)
ifstream& seekg(streamoff, ios_base::seekdir)
```

The one-argument form takes an **absolute** position: `seekp(10)` puts the cursor at position 10, counted from the beginning. The two-argument form takes an **offset relative to a direction**, which is the same idea as C's `fseek` with `SEEK_SET`, `SEEK_CUR` and `SEEK_END`:

| C++ type | Holds |
|---|---|
| `std::ios::streampos` | a position (where the cursor is) |
| `std::ios::streamoff` | an offset: how far to move, positive or negative |
| `std::ios_base::seekdir` | the direction to measure the offset from |

The three `seekdir` values are public members of `ios_base` (so `ios::beg` and `ios_base::beg` are the same thing):

- `ios::beg`: measure from the **beginning** (position 0).
- `ios::cur`: measure from the **current** cursor position.
- `ios::end`: measure from the **end** (position = file size).

The instructor's mental model: think of left, current and right "justification" in a word processor, then nudge by the offset.

## The four worked examples

All four start from the same append-mode `ofstream` on `Hello World`. Work each one out on the position table before you run the program.

```cpp run pin seekDemo.cpp
// predict: the file is Hello World. Write the four positions printed, then the file's final contents.
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    ofstream seed{"helloWorld.txt"};
    seed << "Hello World";
    seed.close();

    ofstream myFile("helloWorld.txt", ios::app);

    myFile.seekp(6);
    cout << myFile.tellp() << endl;   // 6

    myFile.seekp(4, ios::beg);
    cout << myFile.tellp() << endl;   // 4

    myFile.seekp(-4, ios::end);
    cout << myFile.tellp() << endl;   // 7

    myFile.seekp(-6, ios::cur);
    cout << myFile.tellp() << endl;   // 1

    myFile << "!";                    // app mode: written at the END no matter where the cursor was
    myFile.close();

    ifstream check("helloWorld.txt");
    cout << check.rdbuf() << endl;    // Hello World!
    return 0;
}
```

- `myFile.seekp(6);` is the absolute form: the cursor goes to position 6, which is the `W` of `World`. `tellp()` prints **6**.
- `myFile.seekp(4, ios::beg);` moves +4 from the beginning: 0 + 4 = **4**, the `o` of `Hello`.
- `myFile.seekp(-4, ios::end);` moves −4 from the end. The end is 11, so 11 − 4 = **7**, the `o` of `World`. Negative offsets are how you count backwards from the end.
- `myFile.seekp(-6, ios::cur);` moves −6 from the *current* position. The cursor was left at 7 by the previous line, so 7 − 6 = **1**, the `e` of `Hello`. This is the one students get wrong: `cur` depends on whatever happened before.
- The final `myFile << "!";` shows what `app` really means: the cursor said 1, but the `!` is written at the end, so the file becomes `Hello World!`. Append mode positions at the end **before each output operation**, exactly as the mode table said.

Now drive it yourself. The widget models the same eleven-character file, all four openings, every tell and seek, plus `get`, `put` and the size trick from the next section.

```widget
file-seek
{ "title": "helloWorld.txt: move the cursor yourself" }
```

:::quiz Which member for which stream
- `ofstream`: `tellp` and `seekp` only.
- `ifstream`: `tellg` and `seekg` only.
- `fstream`: either pair.

Calling `myFile.tellg()` on an `ofstream` is a **compile error** ("no member named `tellg`"), not a runtime problem. The quiz can show you such a line and ask whether it compiles.
:::

## A useful trick: the size of a file

Why bother with all this? Moving around a file is one reason. The slide's other reason is that seeking gives you a file's size in three lines: remember where the cursor starts, jump to the end, and subtract.

```cpp run pin fileSize.cpp
// predict: Write the exact line printed, in the form size is: N bytes.
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    ofstream seed{"Macbeth.txt"};     // stands in for the lecture's Macbeth.txt
    seed << "Hello World";
    seed.close();

    ifstream myfile{"Macbeth.txt"};
    streampos begin = myfile.tellg();
    myfile.seekg(0, ios::end);
    streampos end = myfile.tellg();
    myfile.close();
    cout << "size is: " << (end - begin) << " bytes.\n";
    return 0;
}
```

`streampos begin = myfile.tellg();` records the starting position, 0. `myfile.seekg(0, ios::end);` moves zero characters from the end, in other words *to* the end, and `streampos end = myfile.tellg();` records that position, 11. Subtracting two `streampos` values gives a `streamoff`, the number of characters between them: `size is: 11 bytes.` One character of a text file is one byte, which is why counting characters counts bytes. In the lecture the same code on a `test.txt` holding `Hello World` printed 11 as well.

## Seeking, then reading: the lecture's fileSeek.cpp

The lecture's last demo uses an `fstream`, which has both `g` and `p` members, to write a file, jump into the middle, and read a few characters. Watch what a read does to the cursor.

```cpp run pin fileSeek.cpp
// predict: Five lines: the position before the read, the position after it, the word read, then the last two positions.
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    fstream myFile{"test.txt", ios::in | ios::out | ios::trunc};
    myFile << "Hello World";

    myFile.seekg(6, ios::beg);
    cout << myFile.tellg() << endl;                      // before the read: 6

    char buffer[6];
    myFile.read(buffer, 5);
    cout << myFile.tellg() << endl;                      // after the read: 11
    buffer[5] = '\0';
    cout << buffer << endl;                              // World

    myFile.seekg(0, ios::beg);
    cout << myFile.tellg() << endl;                      // 0
    myFile.seekg(-5, ios::end);
    cout << myFile.tellg() << endl;                      // 6
    return 0;
}
```

- The open mode `ios::in | ios::out | ios::trunc` is needed because a plain `fstream` would refuse to open a file that does not exist yet (previous lesson); `trunc` creates it.
- `myFile.seekg(6, ios::beg);` moves six characters from the beginning: 0, 1, 2, 3, 4, 5, 6, landing on the `W`. `tellg()` reports **6**.
- `myFile.read(buffer, 5);` reads five characters into the character array, `World`, and moves the cursor five places: **11**, the end. Reading (and writing) advances the cursor; seeking just relocates it.
- `buffer[5] = '\0';` adds the null terminator so the array can be printed as a C string. The array was declared with room for six: five characters plus the terminator.
- `myFile.seekg(-5, ios::end);` is the lecture's last check: 11 − 5 = **6**, back at the `W`.

:::tip The rule in one line
Seek to *place* the cursor; read or write to *move* it; tell to *ask* where it is. `g` for input, `p` for output, either for `fstream`.
:::

```quiz
[
  {
    "q": "`ifstream myFile(\"helloWorld.txt\"); cout << myFile.tellg();` prints...",
    "options": ["11", "0", "−1", "it does not compile"],
    "answer": 1,
    "explain": "An input file stream opens with the cursor at the beginning, position 0. tellg is the correct member for an ifstream."
  },
  {
    "q": "According to the slides, `ofstream myFile(\"helloWorld.txt\", ios::app); cout << myFile.tellp();` prints (file contents `Hello World`)...",
    "options": ["0", "10", "11", "12"],
    "answer": 2,
    "explain": "Append mode positions the cursor at the end of the file. Hello World has 11 characters at positions 0..10, so the end is position 11. (This MinGW build reports 0 until the first write, but the slide's 11 is the answer the quiz expects.)"
  },
  {
    "q": "`ofstream myFile(\"helloWorld.txt\"); cout << myFile.tellp();` prints 0. Why?",
    "options": ["Output streams can never seek", "A plain ofstream truncates the file, so the cursor is at the start of an empty file", "tellp always returns 0 before the first write", "The file was opened for reading"],
    "answer": 1,
    "explain": "A plain ofstream means ios_base::out, which discards the contents on opening. The cursor is at position 0 of a now-empty file."
  },
  {
    "q": "Which member functions belong to an `ofstream`? (select all)",
    "options": ["`tellp`", "`tellg`", "`seekp`", "`seekg`"],
    "answer": [0, 2],
    "explain": "p = put = output. An ofstream has tellp and seekp; tellg and seekg belong to input streams (ifstream). An fstream has all four."
  },
  {
    "q": "`ofstream out(\"x.txt\"); cout << out.tellg();`",
    "options": ["Prints 0", "Prints −1", "Fails to compile: ofstream has no member tellg", "Prints the file size"],
    "answer": 2,
    "explain": "tellg is a member of istream. An ofstream is an ostream, so the compiler reports that there is no member named tellg. Use tellp."
  },
  {
    "q": "The file holds `Hello World`. After `myFile.seekp(-4, ios::end);` what does `tellp()` print?",
    "code": "ofstream myFile(\"helloWorld.txt\", ios::app);\nmyFile.seekp(-4, ios::end);\ncout << myFile.tellp() << endl;",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "The end is position 11 (eleven characters, 0..10). 11 − 4 = 7, the o of World."
  },
  {
    "q": "Continuing from a cursor at position 7, what does `tellp()` print after `myFile.seekp(-6, ios::cur);`?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "ios::cur measures from the current position: 7 − 6 = 1, the e of Hello. cur always depends on the previous operation."
  },
  {
    "q": "`myFile.seekp(4, ios::beg);` and `myFile.seekp(4);` leave the cursor in the same place.",
    "type": "tf",
    "answer": true,
    "explain": "The one-argument form is an absolute position, which is the same as an offset of 4 from the beginning. Both put the cursor at position 4."
  },
  {
    "q": "What does this print? (`Macbeth.txt` contains `Hello World`)",
    "code": "ifstream myfile{\"Macbeth.txt\"};\nstreampos begin = myfile.tellg();\nmyfile.seekg(0, ios::end);\nstreampos end = myfile.tellg();\ncout << \"size is: \" << (end - begin) << \" bytes.\\n\";",
    "options": ["size is: 10 bytes.", "size is: 11 bytes.", "size is: 12 bytes.", "size is: 0 bytes."],
    "answer": 1,
    "explain": "begin is 0; seekg(0, ios::end) moves to the end, position 11; end − begin = 11. One text character is one byte."
  },
  {
    "q": "The cursor of an `fstream` is at position 6 of `Hello World`. After `myFile.read(buffer, 5);` where is it?",
    "type": "numeric",
    "answer": 11,
    "tolerance": 0,
    "explain": "Reading advances the cursor by the number of characters read: 6 + 5 = 11, the end of the file. The five characters read were World."
  },
  {
    "q": "In `seekp(streamoff, ios_base::seekdir)`, which values may the second argument take? (select all)",
    "options": ["`ios::beg`", "`ios::cur`", "`ios::end`", "`ios::app`"],
    "answer": [0, 1, 2],
    "explain": "seekdir is the direction to measure the offset from: beginning, current position, or end. ios::app is an open-mode flag, not a seek direction."
  },
  {
    "type": "match",
    "q": "Match each call on an `ios::app` ofstream over `Hello World` to the position `tellp()` reports afterwards.",
    "pairs": [
      ["`seekp(6)`", "6"],
      ["`seekp(4, ios::beg)`", "4"],
      ["`seekp(-4, ios::end)`", "7"],
      ["`seekp(-4, ios::end)` then `seekp(-6, ios::cur)`", "1"]
    ],
    "explain": "Absolute 6 is 6; 0 + 4 = 4; 11 − 4 = 7; and from 7, another −6 gives 1. The characters at those positions are W, o, o and e."
  }
]
```

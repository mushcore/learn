---
title: Mock Quiz 2
minutes: 45
---

62 questions in the real format: multiple choice, true/false, select-all, what-does-this-print, fill-in-the-code, matching and a bug hunt. Answer everything before you check. Every explanation says *why*, so a wrong answer is still a lesson; the ones you miss come back in later lessons until you get them right twice.

:::quiz Real quiz conditions
Written at the start of lab on the Learning Hub. It covers the **Week 2 slides**, the **lecture videos** and the **Pointers and References practice** sheet. Numbers in the questions are the instructor's own (3522 and 2526, 123 and 345, `Hello World` positions, `0xffff000A`), so if a number looks familiar, trust it. Aim for 90% here before you stop studying.
:::

```quiz
[
  {
    "q": "Which header must you include to use `ifstream`, `ofstream` and `fstream`?",
    "options": [
      "`<iostream>`",
      "`<fstream>`",
      "`<sstream>`",
      "`<cstdio>`"
    ],
    "answer": 1,
    "explain": "File streams live in `<fstream>`. `<iostream>` gives you cin/cout/cerr, `<sstream>` gives you the string streams, and `<cstdio>` is C's printf family."
  },
  {
    "q": "`<<`, `>>` and the manipulators from Week 1 (`setw`, `fixed`, `setprecision`, ...) work on file streams exactly as they do on `cin` and `cout`.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 3: we can use <<, >> and manipulators with file streams. An ofstream is an ostream and an ifstream is an istream, so everything you learned for the console carries over; only the object on the left of the operator changes."
  },
  {
    "type": "match",
    "q": "Match each stream class to what it is for.",
    "pairs": [
      [
        "`ifstream`",
        "reading from a file"
      ],
      [
        "`ofstream`",
        "writing to a file"
      ],
      [
        "`fstream`",
        "reading and writing the same file"
      ],
      [
        "`istringstream`",
        "reading from a std::string as if it were input"
      ]
    ],
    "explain": "The i/o letter tells you the direction: **i**fstream is the input file stream, **o**fstream the output file stream, and plain fstream is both. istringstream is the same idea applied to a string instead of a file."
  },
  {
    "q": "`ofstream fout; fout.open(\"helloWorld.txt\");` runs when no file called helloWorld.txt exists. What happens?",
    "options": [
      "The open fails and `fout.is_open()` is false",
      "The file is created, empty, ready for writing",
      "The program crashes",
      "It opens the file read-only"
    ],
    "answer": 1,
    "explain": "The slide says it exactly: open a file **(or create it if it doesn't exist)** for writing. An ofstream creates the file; it is an ifstream that fails when the file is missing, because there is nothing to read."
  },
  {
    "q": "In the slide's opening code, `if (!f.is_open()) { cerr << \"Unable to open file\" << endl; exit(1); }`, what do `cerr` and `exit(1)` do?",
    "options": [
      "`cerr` prints to the standard error stream; `exit(1)` ends the program at once with a non-zero (error) code",
      "`cerr` reads an error message from the keyboard; `exit(1)` restarts the program",
      "`cerr` is just another name for `cout`; `exit(1)` returns 1 from main and carries on",
      "`cerr` writes the message into the file; `exit(1)` closes it"
    ],
    "answer": 0,
    "explain": "cerr is a cout reserved for error messages (CLion shows it in red). exit(1) from <cstdlib> terminates the program immediately; the 1 is the exit code, and any non-zero code means an error. `if (!f)` is the equivalent shorter test for a failed open."
  },
  {
    "type": "match",
    "q": "Match each open mode to its meaning from the slides.",
    "pairs": [
      [
        "`ios_base::in`",
        "allow input operations on the stream"
      ],
      [
        "`ios_base::out`",
        "allow output operations on the stream"
      ],
      [
        "`ios_base::app`",
        "set the position indicator to the end before each output operation"
      ],
      [
        "`ios_base::trunc`",
        "discard the contents of the stream when opening"
      ],
      [
        "`ios_base::ate`",
        "set the position indicator to the end on opening"
      ],
      [
        "`ios_base::binary`",
        "open in binary mode, for files holding binary data"
      ]
    ],
    "explain": "The two that students mix up are `app` and `ate`: **app**end moves to the end before *every* write, so nothing can ever be overwritten; **at e**nd moves to the end *once*, on opening, and later seeks work normally."
  },
  {
    "type": "fill",
    "q": "Complete the slide's second example so every write is added at the end of the file.",
    "code": "ofstream f2{\"dest\", ios_base::out | ios_base::___};",
    "answer": [
      "app"
    ],
    "explain": "`ios_base::out | ios_base::app` combines two modes with a bitwise OR: output, and append (position at the end before each output)."
  },
  {
    "q": "The file helloWorld.txt contains `Hello World`. The program runs `ofstream myFile(\"helloWorld.txt\");` and immediately closes it. The file still contains `Hello World`.",
    "type": "tf",
    "answer": false,
    "explain": "An ofstream opened with no mode flags is `ios_base::out`, and out on its own truncates: the old contents are discarded the moment the file opens. That is also why the slide's `tellp()` on a plain ofstream prints 0 while the `ios::app` version prints 11."
  },
  {
    "q": "In the lecture's copyFile program the whole input file is copied with one statement. Which one?",
    "options": [
      "`outFile = inFile;`",
      "`outFile << inFile.rdbuf();`",
      "`inFile >> outFile;`",
      "`outFile.copy(inFile);`"
    ],
    "answer": 1,
    "explain": "Every stream owns an internal buffer (a filebuf for file streams). `rdbuf()` hands you that buffer, and inserting a buffer into an output stream writes everything in it. Streams cannot be assigned to each other, so option A does not compile."
  },
  {
    "type": "match",
    "q": "Match each kind of stream to the internal buffer class it uses (slide 7).",
    "pairs": [
      ["file streams (`ifstream`, `ofstream`, `fstream`)", "`filebuf`"],
      ["`cin`, `cout`, `cerr`", "`streambuf`"],
      ["string streams (`istringstream`)", "`stringbuf`"]
    ],
    "explain": "Every stream object uses an internal buffer; the class depends on the device: filebuf for files, streambuf for the console IO streams, stringbuf for string streams. You rarely manage it directly, but rdbuf() hands it to you, which is what makes the one-line file copy work."
  },
  {
    "q": "What does this loop from the slides do? (`in` is an open ifstream)",
    "code": "char c;\nwhile ((c = in.get()) != EOF)\n{\n    // Do something\n}",
    "options": [
      "Reads the whole file as one string",
      "Reads one character at a time until the end of the file",
      "Reads one line at a time",
      "Reads one whitespace-separated word at a time"
    ],
    "answer": 1,
    "explain": "`get()` extracts exactly one character (whitespace included) and returns it; at the end of the file it returns `EOF`, which ends the loop. Its partner `put(c)` writes one character."
  },
  {
    "q": "Which pair is correct?",
    "options": [
      "`tellg` for output streams, `tellp` for input streams",
      "`tellg` for input streams (\"tell get\"), `tellp` for output streams (\"tell put\")",
      "Both work on any stream",
      "`tellg` returns a `streamoff`, `tellp` a `streampos`"
    ],
    "answer": 1,
    "explain": "g = get = input side, p = put = output side. Both return a `streampos`. An ifstream has only the g members, an ofstream only the p members, and an fstream has both."
  },
  {
    "q": "helloWorld.txt contains `Hello World` (11 characters). What does this print?",
    "code": "ofstream myFile(\"helloWorld.txt\", ios::app);\ncout << myFile.tellp() << endl;",
    "type": "numeric",
    "answer": 11,
    "tolerance": 0,
    "explain": "`ios::app` positions the cursor at the end of the existing contents, and the end of an 11-character file is position 11 (positions count from 0, so position 11 is just past the last character `d`)."
  },
  {
    "q": "Same file, opened with `ofstream myFile(\"helloWorld.txt\", ios::app);`. After `myFile.seekp(-4, ios::end);` what does `myFile.tellp()` print?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "The end is position 11; 11 − 4 = 7, which is the `o` of World."
  },
  {
    "q": "Same file and stream. After `myFile.seekp(-4, ios::end);` and then `myFile.seekp(-6, ios::cur);` what does `tellp()` print?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "The first seek lands on 7 (11 − 4). `ios::cur` is relative to the last known position, so 7 − 6 = 1, the `e` of Hello."
  },
  {
    "type": "match",
    "q": "Match each seeking type or constant to its role.",
    "pairs": [
      [
        "`streampos`",
        "stores an absolute position in the stream"
      ],
      [
        "`streamoff`",
        "stores an offset relative to some position"
      ],
      [
        "`ios_base::seekdir`",
        "the type of the direction argument"
      ],
      [
        "`ios::beg`",
        "offset is measured from the beginning"
      ],
      [
        "`ios::cur`",
        "offset is measured from the current position"
      ],
      [
        "`ios::end`",
        "offset is measured from the end"
      ]
    ],
    "explain": "`seekp(streampos)` is the absolute form; `seekp(streamoff, seekdir)` is the relative form, and the direction is one of beg, cur, end, public members of ios_base, just like C's SEEK_SET, SEEK_CUR, SEEK_END."
  },
  {
    "q": "Macbeth.txt contains exactly `Hello World`. What does the slide's fileSize program print?",
    "code": "ifstream myfile{\"Macbeth.txt\"};\nstreampos begin = myfile.tellg();\nmyfile.seekg (0, ios::end);\nstreampos end = myfile.tellg();\nmyfile.close();\ncout << \"size is: \" << (end-begin) << \" bytes.\\n\";",
    "options": [
      "size is: 10 bytes.",
      "size is: 11 bytes.",
      "size is: 12 bytes.",
      "size is: 0 bytes."
    ],
    "answer": 1,
    "explain": "`begin` is 0 (an ifstream opens at the start), `seekg(0, ios::end)` moves to the end, and `tellg()` there is 11 for an 11-character file. A streampos is a number, so end − begin = 11: one byte per character."
  },
  {
    "q": "`ofstream` has a `seekg` member function.",
    "type": "tf",
    "answer": false,
    "explain": "Output streams only have the put side: `seekp`/`tellp`. Calling `seekg` on an ofstream is a compile error. The slide's note: use seekp for ofstream, seekg for ifstream, seekp **or** seekg for fstream."
  },
  {
    "q": "What is the content of `some_scores`?",
    "code": "int some_scores[8] = {1, 2, 3, 4};",
    "options": [
      "{1, 2, 3, 4} and four garbage values",
      "{1, 2, 3, 4, 0, 0, 0, 0}",
      "A compile error: too few initializers",
      "{0, 0, 0, 0, 1, 2, 3, 4}"
    ],
    "answer": 1,
    "explain": "The slide says it is equivalent to `{1, 2, 3, 4, 0, 0, 0, 0}`: when you initialize fewer elements than the declared size, the rest are value-initialized to 0."
  },
  {
    "q": "`char * names[32]` declares...",
    "options": [
      "a pointer to an array of 32 chars",
      "an array of 32 pointers to char",
      "a string of 32 characters",
      "32 separate char variables"
    ],
    "answer": 1,
    "explain": "Read it as (`char *`) `names[32]`: an array of 32 elements, each a `char*`. That is the classic C way to hold 32 C-strings."
  },
  {
    "q": "In the lecture, `sizeof(numbers)` printed 16 in main but 8 inside `swap2(int array[], ...)` for the same four-int array. Why?",
    "options": [
      "The function received a copy with fewer elements",
      "An array parameter is really a pointer, and a pointer is 8 bytes on a 64-bit machine",
      "sizeof cannot be used on parameters",
      "ints shrink to 2 bytes inside functions"
    ],
    "answer": 1,
    "explain": "4 ints × 4 bytes = 16 in main. Passed to a function, the array **decays to a pointer** to its first element, so sizeof reports the pointer's size, 8. That pointer still points at the original array, which is why the swap through the array works."
  },
  {
    "q": "What range of values does `rand() % 25 + 2000` produce?",
    "options": [
      "2000 to 2025",
      "2000 to 2024",
      "2001 to 2025",
      "0 to 2024"
    ],
    "answer": 1,
    "explain": "`rand() % 25` is 0 … 24 (the modulus itself is never produced: \"the right side is not inclusive\"); adding 2000 shifts that to 2000 … 2024. Likewise `rand() % 100` is 0 … 99 and `rand() % 100 + 1` is 1 … 100."
  },
  {
    "q": "What does `rand() / (double) RAND_MAX` produce?",
    "options": [
      "A random `double` from 0.0 to 1.0",
      "Always 0, because of integer division",
      "A random integer from 0 to RAND_MAX",
      "A random `double` from 1.0 to RAND_MAX"
    ],
    "answer": 0,
    "explain": "The slide's zero_to_one line. Casting one operand to double makes the division real division (Week 1), so the result is rand()'s value as a fraction of its maximum: 0.0 to 1.0. Without the cast it would be integer division and almost always 0."
  },
  {
    "q": "To get good random numbers you should call `srand(time(NULL))` inside the loop, just before each `rand()`.",
    "type": "tf",
    "answer": false,
    "explain": "Seed **once**, and only once. Re-seeding every iteration with the same second of clock time restarts the same sequence, so you get the same \"random\" number over and over. The slide comment: seed random num generator only ONCE."
  },
  {
    "q": "Which of these names come from the `<random>` header? (select all)",
    "options": [
      "`mt19937`",
      "`srand`",
      "`uniform_int_distribution`",
      "`random_device`"
    ],
    "answer": [
      0,
      2,
      3
    ],
    "explain": "The engine `mt19937`, the seed source `random_device`, and the distributions (`uniform_int_distribution`, `uniform_real_distribution`) are all `<random>`. `srand`/`rand` are the old C functions from `<cstdlib>`."
  },
  {
    "q": "After `swap(first, second);` runs, does `first` equal 2526 and `second` equal 3522?",
    "code": "void swap(int arg1, int arg2)\n{\n    int temp{arg1};\n    arg1 = arg2;\n    arg2 = temp;\n}\n\nint main()\n{\n    int first{3522};\n    int second{2526};\n    swap(first, second);\n}",
    "options": [
      "Yes: the classic three-line swap always works",
      "No: arg1 and arg2 are copies, so only the copies are swapped",
      "No: it does not compile",
      "Yes, but only because temp is uniform-initialized"
    ],
    "answer": 1,
    "explain": "C++ passes by value by default. `swap` receives a copy of 3522 and a copy of 2526, swaps those, and the copies die when the function returns. `first` and `second` in main are untouched."
  },
  {
    "type": "fill",
    "q": "Fill both blanks so the pointer version of swap is called correctly (`void swap(int* arg1, int* arg2)`).",
    "code": "swap(___first, ___second);",
    "answer": [
      "&",
      "&"
    ],
    "explain": "A pointer parameter can only be given an address, so you pass `&first` and `&second`: the address-of operator. Inside swap, `*arg1` and `*arg2` follow those addresses back to the original variables."
  },
  {
    "q": "From the practice sheet: what are x and y after the line `*p1 = *p2;`?",
    "code": "int x = 5;\nint y = 15;\nint * p1;\nint * p2;\np1 = &x;\np2 = &y;\n*p1 = 5;\n*p1 = *p2;",
    "options": [
      "x = 5, y = 15",
      "x = 15, y = 15",
      "x = 15, y = 5",
      "x = 5, y = 5"
    ],
    "answer": 1,
    "explain": "`*p2` reads the box p2 points at (y, 15); `*p1 = …` writes into the box p1 points at (x). So x becomes 15 and y is unchanged. Nothing about where the pointers point changed."
  },
  {
    "q": "Continuing the practice sheet: x and y after the last line?",
    "code": "// x = 15, y = 15 so far; p1 -> x, p2 -> y\np2 = p1;\n*p1 = *p2 + 10;",
    "options": [
      "x = 25, y = 25",
      "x = 15, y = 25",
      "x = 25, y = 15",
      "x = 35, y = 15"
    ],
    "answer": 2,
    "explain": "`p2 = p1` copies an address: p2 now points at x too (y is untouched, still 15). Then `*p2 + 10` reads x (15) and adds 10, and `*p1 =` stores 25 into x. Final answer on the sheet: x = 25, y = 15."
  },
  {
    "q": "`int* p1 = &x; int* p2 = &y; p2 = p1;` What does the last statement change?",
    "options": [
      "The value of y becomes the value of x",
      "p2 now holds the address of x; x and y are unchanged",
      "p1 now points at y",
      "x and y are swapped"
    ],
    "answer": 1,
    "explain": "Assignment **to a pointer** changes where it points, not what it pointed at. Both pointers now hold x's address. To change a value you must dereference: `*p2 = *p1`."
  },
  {
    "q": "What does this program print?",
    "code": "void test( int& x, int y, int* z )\n{\n    x++;\n    y++;\n    (*z)++;\n}\n\nint main(){\n    int a = 7;\n    int b = 6;\n    int* c = &b;\n    test(a,b,c);\n    cout << a << \" \" << b << \" \" << *c << endl;\n    return 0;\n}",
    "options": [
      "7 6 6",
      "8 7 7",
      "8 6 7",
      "8 7 6"
    ],
    "answer": 1,
    "explain": "`x` is a reference to a, so `x++` makes a = 8. `y` is a **copy** of b, so `y++` changes only the copy. `z` holds b's address, so `(*z)++` makes b = 7. `*c` is b, so it prints 7 as well: `8 7 7`. (Careful: b changes through the pointer, not through y.)"
  },
  {
    "q": "What does this print?",
    "code": "int n{123};\nint& ref = n;\nint m{345};\nref = m; // same as n = m\ncout << n << endl;\ncout << ref << endl;",
    "options": [
      "123 then 345",
      "345 then 345",
      "123 then 123",
      "345 then 123"
    ],
    "answer": 1,
    "explain": "A reference is an alias: `ref = m` is the same as `n = m`, so n is 345, and printing ref prints n's box again, 345. ref did **not** become an alias for m."
  },
  {
    "q": "A reference must be initialized when it is created.",
    "type": "tf",
    "answer": true,
    "explain": "`int& ref;` does not compile. A reference is a nickname for an existing variable, so it needs that variable the moment it is born, and it keeps referring to it forever."
  },
  {
    "q": "Which line does NOT compile?",
    "code": "int& reference{1};\nconst int& r{1};",
    "options": [
      "Line 1: a non-const reference cannot bind to a temporary value",
      "Line 2: const references cannot be brace-initialized",
      "Both compile",
      "Neither compiles"
    ],
    "answer": 0,
    "explain": "We cannot create a reference to a temporary value. `1` is not a variable with a box, so `int& reference{1}` is rejected. Only a **const** reference may bind to a temporary (`const int& r{1}` is OK)."
  },
  {
    "q": "Why does `long& ref = n;` fail to compile when `n` is an `int` holding 12, while `const long& ref = n;` is accepted?",
    "options": [
      "long is smaller than int",
      "The types differ, so binding would need a temporary long, and only a const reference may bind to a temporary",
      "References can only be int",
      "n must be a long literal"
    ],
    "answer": 1,
    "explain": "A reference to `long` cannot be a nickname for an `int` box: the compiler would have to convert n into a temporary long, and a non-const reference may never refer to a temporary. With `const long&` the temporary is allowed, but ref then aliases the copy, not n."
  },
  {
    "q": "Does the processor know about references?",
    "options": [
      "Yes: references are a separate hardware type",
      "No: pointers and references produce the same assembly; references exist for programmers and are converted to pointers when the code is compiled",
      "Yes, but only on 64-bit CPUs",
      "No: references are removed entirely and replaced by copies"
    ],
    "answer": 1,
    "explain": "Straight from the slide: NO. References are convenience syntax for us; under the hood the compiler implements them with the same instructions it uses for pointers."
  },
  {
    "q": "In the practice sheet, `void test( int& x, int y, int* z )` and `int* c = &b;` both use `&`. How do you tell which meaning is which?",
    "options": [
      "They mean the same thing",
      "With a type to its left (`int& x`) it declares a reference; standing alone before a variable (`&b`) it is the address-of operator",
      "Inside parentheses it is always address-of",
      "It is a reference only inside main"
    ],
    "answer": 1,
    "explain": "The instructor's rule: look to the left of the `&`. A type there (`int&`) means a reference declaration, which must be initialized right away. Nothing there (`&b`) means \"the address of b\", which produces a pointer value."
  },
  {
    "q": "What are `num` and `num2` after this code, and what does `numRef` refer to?",
    "code": "int num = 100;\nint num2 = 200;\nint& numRef = num;  // numRef refers to num\nnumRef = num2;",
    "options": [
      "num = 100, num2 = 200, numRef now refers to num2",
      "num = 200, num2 = 200, numRef still refers to num",
      "num = 100, num2 = 100, numRef refers to num",
      "It does not compile: references cannot be assigned"
    ],
    "answer": 1,
    "explain": "References cannot refer to a different variable after initialization. Assigning to a reference changes the value of the object it refers to: num becomes 200. num2 is only read."
  },
  {
    "q": "From the video on functions and references: which signature passes the ORIGINAL variable in and returns the ORIGINAL variable out, with no copies?",
    "options": [
      "`int f(int n)`",
      "`int f(int& n)`",
      "`int& f(int n)`",
      "`int& f(int& n)`"
    ],
    "answer": 3,
    "explain": "`int f(int n)` copies twice (in and out). `int f(int& n)` avoids the copy in but copies out. `int& f(int n)` is dangerous: it returns a reference to the local copy, which disappears when the function ends. Only `int& f(int& n)` refers to the caller's variable both ways. Never return a reference or pointer to a local variable."
  },
  {
    "q": "A `std::string` must end with a `'\\0'` character, like a C string.",
    "type": "tf",
    "answer": false,
    "explain": "The slide: in C++, the string object needn't terminate with \\0. The object keeps its own length (`size()`/`length()`). Only when you ask for `c_str()` do you get a null-terminated C array."
  },
  {
    "q": "For any `std::string s`, `s.size()` and `s.length()` return the same number.",
    "type": "tf",
    "answer": true,
    "explain": "The slide lists both and adds (same thing!): two names for the number of characters. Neither counts a terminating \\0, because a std::string does not need one."
  },
  {
    "q": "What does this print?",
    "code": "string a = \"apple\";\nstring b = \"bear\";\ncout << boolalpha << (b > a) << \" \" << (a == \"apple\");",
    "options": [
      "true true",
      "false true",
      "true false",
      "It does not compile: C++ strings need compareTo or equals"
    ],
    "answer": 0,
    "explain": "Unlike Java, the relational operators are defined for std::string and compare lexicographically: b comes after a, so b > a is true, and == compares the characters, so a == \"apple\" is true."
  },
  {
    "q": "What does this print?",
    "code": "string s = \"hello\";\ncout << s[0];\ncout << s.at(1);",
    "options": [
      "he",
      "hh",
      "eh",
      "hello"
    ],
    "answer": 0,
    "explain": "`s[0]` is the first character, h; `s.at(1)` is the second, e. Both give you a character at an index; `at` additionally checks the bounds and throws an exception if the index is invalid."
  },
  {
    "type": "match",
    "q": "Match each line from the 'short aside on classes' to what it calls.",
    "pairs": [
      [
        "`string first;`",
        "default constructor"
      ],
      [
        "`string second = first;`",
        "copy constructor"
      ],
      [
        "`first = second;`",
        "assignment operator"
      ],
      [
        "`line.c_str()`",
        "a non-modifiable standard C char array"
      ]
    ],
    "explain": "Declaring an object calls a constructor; declaring it *from* another object calls the copy constructor; assigning to an object that already exists calls the assignment operator. More on all three later in the course."
  },
  {
    "q": "The user types `Hello`, Enter, `world`, Enter. After one `getline(cin, input);` what is in `input`?",
    "options": [
      "Hello\\nworld",
      "Hello",
      "Hello\\n",
      "world"
    ],
    "answer": 1,
    "explain": "getline reads characters up to the newline, stores them in the string, and **tosses the newline**. One call reads one line: `Hello`. The second line waits in the buffer for the next call."
  },
  {
    "q": "`getline(inputstream, input, delimiter)` keeps extracting characters until... (select all that apply)",
    "options": [
      "EOF is reached (and eofbit is set)",
      "the delimiter or newline is extracted (and tossed)",
      "so many characters have been extracted that they exceed what the string can hold (and failbit is set)",
      "a space is read"
    ],
    "answer": [0, 1, 2],
    "explain": "The three conditions from the slide. A space is not a delimiter for getline (stopping at whitespace is >> behaviour); getline reads whole lines, spaces included, which is exactly why it exists."
  },
  {
    "q": "The input is empty: end-of-file right away. What happens on `getline(cin, input);`?",
    "options": [
      "input becomes an empty string and eofbit is set",
      "input is unchanged, and both eofbit and failbit are set",
      "input is unchanged and only eofbit is set",
      "The program crashes"
    ],
    "answer": 1,
    "explain": "The last row of the slide table: `*` (EOF) gives No change, eofbit and failbit are set. getline extracted nothing at all, and extracting nothing is a failure. Compare `Hello*`: the string gets Hello and only eofbit is set, because characters were read before EOF."
  },
  {
    "q": "The user types `42` Enter `hello` Enter. What is `line` after this code?",
    "code": "int n;\ncin >> n;\nstring line;\ngetline(cin, line);",
    "options": [
      "\"hello\"",
      "\"42\"",
      "\"\" (empty)",
      "\"42hello\""
    ],
    "answer": 2,
    "explain": "`cin >> n` reads 42 and **stops at the newline, leaving it in the buffer**. getline then sees that newline immediately, returns an empty line, and tosses it. Fix: `cin.ignore(numeric_limits<streamsize>::max(), '\\n');` between the two reads."
  },
  {
    "q": "What does this print?",
    "code": "istringstream iss;\nint n;\nstring aString;\niss.str(\" 123abc\");\niss >> n >> aString;\ncout << n << endl;\ncout << aString << endl;",
    "options": [
      "123 then abc",
      "123abc then (blank)",
      "0 then 123abc",
      "123 then (blank)"
    ],
    "answer": 0,
    "explain": "`>>` on an istringstream behaves like `>>` on cin: skip whitespace, read the longest run that fits an int (123, stopping at `a`), then read a whitespace-delimited word for the string, `abc`."
  },
  {
    "q": "Same program, but `iss.str(\" 123a b c\");`. What prints?",
    "options": [
      "123 then a b c",
      "123 then a",
      "123a then b",
      "123 then abc"
    ],
    "answer": 1,
    "explain": "n still gets 123 (the int read stops at `a`). The string read then takes one whitespace-delimited token, which is just `a`; ` b c` stays in the stream."
  },
  {
    "q": "What does this loop print (one item per line)?",
    "code": "istringstream iss;\niss.str(\" 123a b c\");\nwhile(!iss.eof())\n{\n    string newString;\n    iss >> newString;\n    cout << newString << endl;\n}",
    "options": [
      "123 / a / b / c",
      "123a / b / c",
      "123a b c",
      "1 / 2 / 3 / a / b / c"
    ],
    "answer": 1,
    "explain": "Reading into a **string** takes whole whitespace-delimited tokens, so `123a` is one token (no int parsing here), then `b`, then `c`. The slide output is 123a, b, c."
  },
  {
    "q": "In the line-by-line sum program that reuses one istringstream, why call `iss.clear();` before `iss.str(line);`?",
    "options": [
      "To erase the string contents",
      "To reset failbit/eofbit left over from the previous line, otherwise every later `iss >> n` fails",
      "To free memory",
      "It is optional; clear() only affects cout"
    ],
    "answer": 1,
    "explain": "Reaching the end of the previous line set eofbit (and maybe failbit). `str(line)` loads new text but does not touch the state bits, and a stream in a fail state refuses to extract. `clear()` resets the bits; then `if (iss >> n) sum += n;` works. The alternative on the next slide is a fresh `istringstream iss{line};` per line."
  },
  {
    "q": "What does this print?",
    "code": "vector <int> intVector;\nintVector.push_back(5);\nintVector.push_back(10);\nintVector.push_back(15);\nintVector.erase(intVector.begin()+1);\nfor (int value : intVector)\n{\n    cout << value;\n}",
    "options": [
      "51015",
      "515",
      "1015",
      "510"
    ],
    "answer": 1,
    "explain": "`begin()+1` is the iterator to index 1, the 10, and erase removes it, shifting 15 down. The ranged-for then prints the remaining values with no separator: 5 then 15, i.e. `515`."
  },
  {
    "q": "How does `intVector.at(pos)` differ from `intVector[pos]`?",
    "options": [
      "`at` is faster",
      "`at` does a bounds check and throws an exception for a bad index; `[]` does not check",
      "`[]` returns a copy, `at` returns a reference",
      "There is no difference"
    ],
    "answer": 1,
    "explain": "Both return a reference to the element at pos. Only `at` checks that pos is inside the vector and throws `std::out_of_range` otherwise; `[]` with a bad index is undefined behaviour."
  },
  {
    "q": "In `for (int value : intVector) { cout << value; }` the variable `value` holds the index of each element.",
    "type": "tf",
    "answer": false,
    "explain": "The ranged-for (C++'s for-each) hands you each **element's value** in order, never its index. If you need indices, use the classic `for (size_t i = 0; i < intVector.size(); i++)` loop."
  },
  {
    "q": "In the lecture demo a vector had size 4 and capacity 4. After one more `push_back`, what did `capacity()` report?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "explain": "When the vector is full, g++ allocates a new block twice as big and copies the elements over: capacity goes 1, 2, 4, 8, … Size is how many elements you have; capacity is how many fit before the next reallocation."
  },
  {
    "q": "What does the `new` operator return?",
    "options": [
      "The value that was allocated",
      "A pointer to the memory that was just allocated",
      "A reference to a new object",
      "The number of bytes allocated"
    ],
    "answer": 1,
    "explain": "`new` allocates on the heap and hands back the address, which is why you always store its result in a pointer: `int * my_pointer = new int{3522};`. The thing it creates is called a data object."
  },
  {
    "q": "After the line `i = a;` runs, what is the situation?",
    "code": "int *i = new int{11}; // at 0xffff000A\nint *a = new int{99}; // at 0xffff000B\ni = a; // creates a memory leak\ndelete i; // free allocated memory",
    "options": [
      "The 11 was freed automatically",
      "Both pointers now point at 0xffff000B; nothing points at the 11 at 0xffff000A, so it can never be deleted: a memory leak",
      "i and a were swapped",
      "delete i frees both blocks"
    ],
    "answer": 1,
    "explain": "Assigning to a pointer changes where it points. Once i points at the 99 block, the 11 block has no pointer left; `delete i` frees only the block i points at now (the 99). With no garbage collector, the 11 stays allocated until the program exits: a leak."
  },
  {
    "q": "Which order fixes the leak in the previous program?",
    "options": [
      "`i = a; delete i; delete a;`",
      "`delete i; i = a; delete i;`",
      "`delete a; i = a; delete i;`",
      "`delete i; delete i; i = a;`"
    ],
    "answer": 1,
    "explain": "The slide's solution: delete the block i points at **first**, then it is safe to make i point somewhere else, then delete that block too. Every `new` needs exactly one matching `delete`, and you must still hold a pointer to a block when you delete it."
  },
  {
    "type": "spotbug",
    "q": "Click the line with the bug. The program compiles, but the deallocation is wrong.",
    "code": "#include <iostream>\nusing namespace std;\nint main()\n{\n    int * my_pointer = new int[5];\n    for (int i = 0; i < 5; ++i) {\n        my_pointer[i] = i;\n    }\n    delete my_pointer;\n    return 0;\n}",
    "answer": 9,
    "explain": "Line 9: memory that came from `new[]` must be released with `delete[] my_pointer;`. Plain `delete` on an array is undefined behaviour (it may free only the first element or corrupt the heap). new pairs with delete, new[] pairs with delete[]."
  },
  {
    "q": "C++ has a garbage collector, so forgetting `delete` only wastes a little time.",
    "type": "tf",
    "answer": false,
    "explain": "There is no garbage collector in C++. Memory obtained with new exists even after the function returns, until you delete it; forgetting is a memory leak, and a program that keeps leaking eventually runs out of memory."
  },
  {
    "q": "What does `delete i;` actually delete?",
    "options": [
      "The pointer variable i",
      "The data object i points at; i itself still exists and now holds a dangling address",
      "Both the pointer and the object",
      "Nothing until the program ends"
    ],
    "answer": 1,
    "explain": "From the video: delete i doesn't delete the pointer itself, it deletes whatever my pointer is pointing to. The variable i keeps the old address, which is now invalid (dangling), so set it to nullptr if you will use it again."
  }
]
```

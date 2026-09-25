# COMP 3522 Week 2 — facts, programs and worked numbers transcribed from the instructor's material

Source files (Learning Hub export, 2026-09-24, zip `COMP-3522-0 - Object Oriented Programming 2 (...) - 9242026 - 823 PM.zip` in `D:/BCIT/learn`, extracted to the session scratchpad `comp3522/`):
`3522 Week 24.pdf` (Week 2 slides, 83 pages), `References and Pointers.docx` (Pointer and Reference Activity, 14 points), 14 lecture videos (2020/2021 recordings). Whisper transcripts of every video are in the scratchpad `comp3522/transcripts/*.txt`.
No Week 2 sample-code zip was posted; the slides name the demo files `fileIO.cpp`, `fileSize.cpp`, `fileSeek.cpp`, `random_c.cpp`, `random_int.cpp`, `random_double.cpp`, `pointers.cpp`, `references.cpp`, `istringstream.cpp`, `vector.cpp`, and the videos show them.

## Videos (duration)
Pointer Basics 1 (4:13), Pointer Basics 2 (4:11), Pointer Basics 3 (7:34) — optional review: box-with-a-nickname model, `&num` printing, `addToNum(int)` fails vs `addToNum(int*)` works.
1 - File IO 2 - Open, close, read, copy files (21:13) — `data.txt` lives in `cmake-build-debug`; fileIO.cpp copies `data.txt` to `output.txt` replacing digits with `*` via `isdigit` and a ternary (`outFile << (isdigit(c) ? '*' : c)` / `outFile.put('*')`); deleting output.txt shows ofstream recreates it; copyFile: `outFile << inFile.rdbuf();`.
2 - File IO 2 - Seeking (14:09) — tellg/tellp naming complaint; fileSize.cpp → `size is: 11 bytes.` for `Hello World`; fileSeek.cpp: write `Hello World`, `seekg(6, ios::beg)`, tellg 6, `read(buffer, 5)`, tellg 11, buffer `World`; `seekg(-5, ios::end)` → 6.
3 - Arrays and random numbers (15:26) — array facts; `srand` once, never in a loop; `% n` right side not inclusive; distributions make numbers uniform; random_device seeding is overkill, `time(0)` works.
4 - Pointers (13:47) — swap by value fails; swap through an array works (parameter is a pointer, `sizeof` 16 in main vs 8 in the function); swap with pointers works.
5 - References (8:43) — alias/nickname; must be initialized; pass by reference = no copies, more efficient; `ref = m` is `n = m`; same assembly; const-reference-to-temporary rules.
6 - Pointers and references code (16:41) — pointers.cpp: `sizeof(int)` 4, `sizeof(int*)` 8; `c = &a`, print `&c`, `c`, `*c`; `*c = -4` changes a; `c = &b` (address of c unchanged, value now b's address); references.cpp: `int& b = a; b = 8` → a 8; `int& c = b; c = 4` → a 4; `&a == &b == &c`; `int d = 999; c = d` → a 999; rule: type to the left of `&` → reference, otherwise address-of; assignment to a pointer changes what it points to; assignment to a reference changes the referent; beware null pointers, assign `nullptr`.
1 - Functions and references (9:06) — never return a reference/pointer to a local (compiles, dangerous; the array example returns null in practice); avoid globals; `int f(int)` two copies, `int f(int&)` copy out only, `int& f(int)` dangerous, `int& f(int&)` original in and out.
2 - Strings and getline (7:53), 3 - Stringstream (17:58) — std::string, getline and istringstream demos (see the slide facts below).
4 - Vectors (7:26) — vector.cpp: push_back 5 → size 1; two more → size 3; capacity 4; a fifth push doubles capacity to 8; ranged-for prints 555.
5 - Dynamic memory - New and delete keywords (13:14) — dynamic = manual; C malloc/calloc/realloc/free; `new` returns a pointer; data object; new[]; stack vs heap; `new (nothrow)` from `<new>` returns nullptr; keep a tally: every new needs a delete; `delete i` deletes the pointee, not the pointer; leak walkthrough and fix.

## Slides: File IO part 2
- `<fstream>`: `ifstream` (read), `ofstream` (write), `fstream` (both); `<<`, `>>` and manipulators work on file streams.
- `fstream f{"data.txt"}; if (!f.is_open()) { cerr << "Unable to open file" << endl; exit(1); } f << "hello" << 123 << endl; // file closed automatically`. Alternative `if (!f)`.
- `.open()` forms: `ifstream fin; fin.open("helloWorld.txt");` (read); `ofstream fout; fout.open("helloWorld.txt");` (write; creates if missing); `fstream fs; fs.open("helloWorld.txt");` (read and write). Close: `fin.close(); fout.close(); fs.close();` ("Too easy for its own slide").
- Buffers: filebuf (file streams), streambuf (cin/cout/cerr), stringbuf (string streams); rarely managed directly.
- `std::ios_base::openmode`: in (allow input), out (allow output), app (position indicator to the end before each output operation), binary, trunc (discard contents when opening), ate (position indicator to the end on opening). Combine with `|`: `ifstream f1{"data", ios_base::in | ios_base::binary}; ofstream f2{"dest", ios_base::out | ios_base::app};`.
- Char by char: `std::basic_istream::get`, `::put`; `char c; while ((c = in.get()) != EOF) { }` (fileIO.cpp).

## Slides: Seeking
- Cursor at position 0 on an ifstream. `streampos std::ostream::tellp()` ("tell put"), `streampos std::istream::tellg()` ("tell get").
- `ifstream myFile("helloWorld.txt"); cout << myFile.tellg();` → 0. `ofstream myFile("helloWorld.txt", ios::app); cout << myFile.tellp();` → 11. `ofstream myFile("helloWorld.txt"); cout << myFile.tellp();` → 0 (file truncated).
- `ofstream& seekp(streampos)`, `seekp(streamoff, ios_base::seekdir)`; `ifstream& seekg(...)` likewise. `std::ios::streampos` positions, `streamoff` offsets, `seekdir` = `ios::beg`, `ios::cur`, `ios::end` (public members of ios_base; recall C fseek/ftell/SEEK_SET/CUR/END).
- Examples on `Hello World` with `ofstream ... ios::app`: `seekp(6)` → 6; `seekp(4, ios::beg)` → 4; `seekp(-4, ios::end)` → 7 (end 11); `seekp(-4, ios::end); seekp(-6, ios::cur)` → 1 (cur 7). NOTE: seekp for ofstream, seekg for ifstream, seekp or seekg for fstream.
- fileSize.cpp: `ifstream myfile{"Macbeth.txt"}; streampos begin = myfile.tellg(); myfile.seekg(0, ios::end); streampos end = myfile.tellg(); myfile.close(); cout << "size is: " << (end-begin) << " bytes.\n";`

## Slides: C-style arrays, random numbers
- `float values[3]` (3 floats); `char * names[32]` (32 pointers to char); `int scores[] = {1, 2, 3, 4};`; `int some_scores[8] = {1, 2, 3, 4};` ≡ `{1, 2, 3, 4, 0, 0, 0, 0}`.
- C way (`<cstdlib>`, `<ctime>`): `srand(time(NULL)); // seed ONCE`; `const int UPPER_BOUND = 10; int my_int = rand() % UPPER_BOUND; double zero_to_one = rand() / (double) RAND_MAX;`; `rand() % 100` → 0..99; `rand() % 100 + 1` → 1..100; `rand() % 25 + 2000` → 2000..2024.
- `<random>`: `double a = 10; double b = 100; default_random_engine generator(time(0)); uniform_real_distribution<double> distribution(a, b); double my_random = distribution(generator);`
- `random_device rd; mt19937 generator(rd()); uniform_int_distribution<> distribution(a, b); int my_int = distribution(generator);` ("a random number generator to generate a random seed for a random number generator"). Files random_c.cpp, random_int.cpp, random_double.cpp.

## Slides: Pointers, references, nullptr
- Pass by value: `void swap(int arg1, int arg2) { int temp{arg1}; arg1 = arg2; arg2 = temp; }` with `int first{3522}; int second{2526}; swap(first, second);` → does NOT swap.
- Pointers: `void swap(int* arg1, int* arg2) { int temp{*arg1}; *arg1 = *arg2; *arg2 = temp; }` called `swap(&first, &second);` → swaps.
- Reference (&): an alias (anything done to the reference is done to the referent); must be initialized when created; makes pass by reference effortless; used for efficiency (no copy). `int n{123}; int& ref = n; int m{345}; ref = m; // same as n = m` → `cout << n` 345, `cout << ref` 345.
- `void swap(int& arg1, int& arg2) { int temp{arg1}; arg1 = arg2; arg2 = temp; }` called `swap(first, second);`.
- Does the processor know about references? NO: pointers and references produce the same assembly; references are for programmers; converted to pointers when compiled.
- References to constants: `int& reference{1}; // will not compile`; `const int& r{1}; // OK`; `int n{12}; long& ref = n; // won't compile (why not)`; `const long& ref = n; // OK`. Files pointers.cpp, references.cpp.
- Assignment to a pointer makes it point to a new address: `int num = 99; int* numPtr = nullptr; numPtr = &num;`. To create a pointer: assign nullptr, an existing pointer, `&` (address of) or `new`: `int* numPtr2 = numPtr; int* numPtr3 = &num; int* numPtr4 = new int(123);`.
- Beware null pointers (assign empty pointers to nullptr). Dereference with `*` or `[]`: `cout << *numPtr;`. References cannot refer to a different variable after initialization; assignment to a reference changes the referent: `int num = 100; int num2 = 200; int& numRef = num; numRef = num2; // num is now 200`.
- ACTIVITY: watch Pointer basics 1, 2, 3; answer the Pointers and References practice sheet.

## Practice sheet (References and Pointers.docx), answers
`int x = 5; int y = 15; int * p1; int * p2;` then: `p1 = &x;` x 5 y 15 · `p2 = &y;` 5, 15 · `*p1 = 5;` 5, 15 · `*p1 = *p2;` 15, 15 · `p2 = p1;` 15, 15 · `*p1 = *p2 + 10;` 25, 15.
`void test(int& x, int y, int* z) { x++; y++; (*z)++; }` with `int a = 7; int b = 6; int* c = &b; test(a,b,c); cout << a << " " << b << " " << *c;` → `8 7 7` (a through the reference; y is a copy; b through the pointer; *c is b). Making a parameter by-value stops the change reaching the caller; making it a reference makes it reach; making b a pointer changes what `&b`/`*c` mean; the two `&`: `int& x` declares a reference, `&b` is address-of.

## Slides: string and stringstream
- `#include <string>`; `string s1; // default constructor`; `string s2 = "Hello";`; `string s3{"world!"};`; the string object needn't terminate with `\0`.
- Members: `size()`, `length()` (same), `c_str()` (non-modifiable C char array): `string line; cin >> line; cout << line.size(); const char * c_line = line.c_str();`.
- Relational operators compare lexicographically (unlike Java's compareTo/equals); `s[0]` → h; `s.at(1)` → e (reference to the char).
- Classes aside: `string first; // default constructor`, `string second = first; // copy constructor`, `first = second; // assignment operator`.
- `getline(cin, input)` (in `<string>`): reads a line into the string, tosses the newline, returns the stream. `getline(inputstream, input, delimiter)`: extracts until EOF (sets eofbit), delimiter/newline extracted and tossed, or too many characters (sets failbit).
- Failure table: `Hello World` → `Hello World`; `Hello\nworld\n` → `Hello`; `\nWorld\n` → EMPTY; `Hello*` → `Hello` (eofbit set); `Hello\n*` → `Hello`; `*` → no change, eofbit and failbit set.
- Idiom: `string line; while (getline (cin, line)) { /* process */ }`.
- `istringstream` (`<sstream>`, type `basic_istringstream<char>`): `string input{" 123abc"}; istringstream iss{input}; int n; iss >> n;` → 123. `iss.str(" 123abc"); iss >> n;` → 123. `iss >> n >> aString;` → 123, abc. `" 123a b c"` → 123, a. `while(!iss.eof()) { string newString; iss >> newString; cout << newString << endl; }` → 123a, b, c.
- Sum per line, reused iss: `while (getline(cin, line)) { iss.clear(); iss.str(line); if (iss >> n) sum += n; }`; fresh iss: `istringstream iss{line}; if (iss >> n) sum += n;` (istringstream.cpp).

## Slides: vector
- `<vector>`; sequence container that can change size (Java ArrayList); part of the STL (iterators later). Members: `push_back(const T&)`, `size()`, `operator[]` (reference), `at(pos)` (bounds check, throws), `erase(iterator pos)`, `clear()`; ranged-for.
- `vector <int> intVector; push_back(5); push_back(10); push_back(15); intVector.erase(intVector.begin()+1) // erases 10 at index 1`; classic loop `for(int i=0; i<intVector.size(); i++) cout << intVector[i];`; `for(int value: intVector) cout << value;` (vector.cpp).

## Slides: new and delete
- Dynamic memory management = manual; C: malloc, calloc, realloc, free (stdlib.h). C++: `new`, `new[]`; new returns a pointer to the allocated memory.
- `int * my_pointer = nullptr; my_pointer = new int { 3522 };` ("refers to a data object, not the same as an instance of a class"); `int * my_pointer = new int; *my_pointer = 3522;`; `int * my_pointer = new int{3522};`; `my_pointer = new int [5]; for (int i = 0; i < 5; ++i) my_pointer[i] = i;`.
- `int i; int iArray[10];` automatic allocation/deallocation when the function returns. `int * i = new int; int * iArray = new int[10];` programmer's responsibility; memory leaks if not deallocated; memory exists after the function returns. No garbage collector.
- `delete i; delete[] iArray;`.
- Leak: `int *i = new int{11}; // 0xffff000A`, `int *a = new int{99}; // 0xffff000B`, `i = a; // creates a memory leak`, `delete i;` → 99 block freed, 11 block has nothing pointing at it: MEMORY LEAK.
- Solution: `delete i; // deletes memory i pointing at`, `i = a; // i can now safely point to something else`, `delete i;`.

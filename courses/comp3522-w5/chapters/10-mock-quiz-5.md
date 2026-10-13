---
title: Mock Quiz 5
minutes: 45
---

50 questions in the real format: multiple choice, true/false, select-all, what-does-this-print, fill-in-the-code, matching, reordering and bug hunts. Answer everything before you check. The programs are the instructor's own (exception.cpp to exception5.cpp) plus the two verified programs from the catch-guidelines lesson, so every output here is what g++ actually printed.

:::quiz Real quiz conditions
Written at the start of lab on the Learning Hub, covering the Week 5 deck and the Week5 sample projects. Aim for 90% here before you stop studying, then write the practice-midterm Fraction constructor on paper.
:::

```quiz
[
  {
    "q": "The deck's two principal approaches to errors in C++ are...",
    "options": ["return codes for programming errors, assertions for everything else", "exceptions for programming errors, assertions for file errors", "assertions for detecting programming errors, exceptions for situations that prevent proper continuation of the program", "assert in debug builds, exit() in release builds"],
    "answer": 2,
    "explain": "Slide 7. Assertions catch the programmer's mistakes while developing; exceptions handle errors that cannot be handled locally, such as a missing file."
  },
  {
    "q": "`assert` is a function declared in `<cassert>`.",
    "type": "tf",
    "answer": false,
    "explain": "It is a macro inherited from C. That is why a #define (NDEBUG) can make it vanish entirely."
  },
  {
    "q": "To turn assertions off you write `#define NDEBUG`...",
    "options": ["before `#include <cassert>`", "after `#include <cassert>`", "inside main", "on the compiler command line only"],
    "answer": 0,
    "explain": "The macro is expanded when the header is included, so NDEBUG must already be defined at that point. Defined afterwards it changes nothing."
  },
  {
    "type": "spotbug",
    "q": "The programmer wanted the assertion disabled, but the program still aborts. Click the line that is in the wrong place.",
    "code": "#include <iostream>\n#include <cassert>\n#define NDEBUG\nint main() {\n    int x = 3;\n    assert(x > 10);\n    std::cout << \"reached\";\n}",
    "answer": 3,
    "explain": "NDEBUG on line 3 comes after <cassert> was already included on line 2, so assert was defined in its active form. Move the #define above the include."
  },
  {
    "q": "Which are problems with C-style error codes on slides 10 and 11? (select all)",
    "options": ["the caller can ignore the error code", "the function cannot return its computational result", "results must be passed back through reference or pointer arguments", "the code aborts the program immediately"],
    "answer": [0, 1, 2],
    "explain": "Plus: this prevents building expressions from the results. Aborting is what assert does, not an error code."
  },
  {
    "q": "In C++ a `throw` statement may throw...",
    "options": ["only objects derived from `std::exception`", "only class types", "only integers and strings", "anything: strings, numbers, user types and standard-library exceptions"],
    "answer": 3,
    "explain": "Slide 13 lists all four. The slide adds that it is best to define exception types or use the standard ones."
  },
  {
    "q": "What does exception.cpp print?",
    "code": "class myexception : public exception {\npublic:\n    const char* what() const noexcept { return \"My exception happened\"; }\n};\nint main() {\n    try { throw myexception(); }\n    catch (exception& e) { cout << e.what() << '\\n'; }\n    return 0;\n}",
    "options": ["std::exception", "My exception happened", "nothing: the handler is for the base type", "a compile error: what() is not marked override"],
    "answer": 1,
    "explain": "Caught by reference to the base; what() is virtual in std::exception, so the override runs. override is optional (the shipped file omits it)."
  },
  {
    "q": "exception2.cpp as shipped executes `throw \"message error\";`. Its handlers, in order, are `catch (myexception&)`, `catch (std::exception&)` (empty body), `catch (A&)`, `catch (const char* c)`. What prints?",
    "options": ["myexception caught", "nothing: the std::exception handler has an empty body", "message error", "random class error"],
    "answer": 2,
    "explain": "A string literal is a const char*, which is not a std::exception and not an A. The fourth handler matches and prints it."
  },
  {
    "q": "Change exception2.cpp to `throw A{};` where `class A` is unrelated to `std::exception` and has `string message()` returning `random class error`. What prints?",
    "options": ["myexception caught", "random class error", "nothing", "a compile error: A is not an exception"],
    "answer": 1,
    "explain": "Any type can be thrown. A is not derived from std::exception, so only catch (A& a) matches, and it prints a.message()."
  },
  {
    "q": "Change exception2.cpp to `throw myexception();` (its `what()` returns `C++ Exception`). What prints?",
    "options": ["myexception caught (newline) C++ Exception", "C++ Exception", "myexception caught", "std::exception caught"],
    "answer": 0,
    "explain": "The first handler, catch (myexception& e), matches exactly and prints both lines. The std::exception handler below it would also match but is never reached."
  },
  {
    "q": "`throw \"message error\";` is caught by `catch (string& s)`.",
    "type": "tf",
    "answer": false,
    "explain": "A string literal has type const char[N], thrown as const char*. No conversion to std::string happens during handler matching; you need catch (const char*) or catch (...)."
  },
  {
    "q": "What does exception4.cpp print?",
    "code": "class Name {\n    std::string first;\npublic:\n    Name(std::string first) : first(first) {\n        if (first.length() == 0) {\n            throw std::invalid_argument(\"No first name!\");\n        }\n    }\n};\nint main() {\n    try {\n        std::string a;\n        Name{a};\n    }\n    catch (exception& e) { cout << e.what() << endl; }\n}",
    "options": ["nothing", "invalid_argument", "a compile error: Name{a} has no variable name", "No first name!"],
    "answer": 3,
    "explain": "a is empty, so the constructor throws invalid_argument; it is-an exception, so the handler prints what(). With Name{\"Jeff\"} nothing would print."
  },
  {
    "q": "When a constructor throws, the object's destructor runs to clean up.",
    "type": "tf",
    "answer": false,
    "explain": "No object was created, so there is nothing to destroy. Only bases and members that were already fully constructed are destroyed (exception5's A() destroyed)."
  },
  {
    "q": "exception5.cpp: `B(int)` prints `B() being created` and then throws; `C(int x) try : A(), my_b(x) { ... } catch (...) { cout << \"C not constructed!\\n\"; throw; }`. After `B() being created`, what prints next?",
    "options": ["C() created, then C not constructed!", "C not constructed!, then B() destroyed", "A() destroyed, then C not constructed!", "A() destroyed, C not constructed!, then B() destroyed"],
    "answer": 2,
    "explain": "The base A was fully constructed before my_b threw, so A is destroyed before the function-try-block's handler runs. my_b never existed, so no B() destroyed for it."
  },
  {
    "q": "Which of these lines does exception5.cpp print before it terminates? (select all)",
    "options": ["B() created", "B() destroyed", "A() destroyed", "Code not called because throw not caught"],
    "answer": [0, 2],
    "explain": "B b; in main prints B() created. The handler rethrows the const char*, nothing in main catches it, terminate is called and skips all unwinding, so b is never destroyed and the last cout never runs."
  },
  {
    "q": "In exception5.cpp, why does `B() destroyed` never print for the `B b;` declared in main?",
    "options": ["b was never constructed", "the uncaught exception calls `std::terminate`, which ends the program without unwinding main's locals", "B's destructor is private", "the output buffer is lost"],
    "answer": 1,
    "explain": "Unwinding (and the destructor calls that come with it) only happens when a handler is found. With none, terminate -> termination handler -> abort: CRASH AND BURN."
  },
  {
    "q": "What does section A of ex_catch_order print?",
    "code": "try { throw child_type(); }\ncatch (child_type& e)  { cout << \"A: child handler: \" << e.what() << endl; }\ncatch (parent_type& e) { cout << \"A: parent handler: \" << e.what() << endl; }",
    "options": ["A: child handler: child", "A: parent handler: child", "A: parent handler: parent", "both lines"],
    "answer": 0,
    "explain": "Guideline 2: the first catch-block with a matching type is executed; child_type matches exactly. Only one handler ever runs per throw."
  },
  {
    "q": "Section B swaps the order. What prints?",
    "code": "try { throw child_type(); }\ncatch (parent_type& e) { cout << \"B: parent handler, but what() is still: \" << e.what() << endl; }\ncatch (child_type& e)  { cout << \"B: child handler: \" << e.what() << endl; }",
    "options": ["B: child handler: child", "a compile error: unreachable handler", "B: parent handler, but what() is still: child", "B: parent handler, but what() is still: parent"],
    "answer": 2,
    "explain": "A reference to the parent binds to the child object; the parent handler runs, but what() is virtual and still returns child. g++ only warns that the child handler will never run."
  },
  {
    "q": "Section C catches by value. What prints?",
    "code": "try { throw child_type(); }\ncatch (parent_type e) { cout << \"C: caught by value, what() is now: \" << e.what() << endl; }",
    "options": ["C: caught by value, what() is now: child", "C: caught by value, what() is now: parent", "nothing: a child cannot initialize a parent", "a compile error"],
    "answer": 1,
    "explain": "Catching by value copy-constructs a parent_type from the child: the derived part is sliced off and the parent's what() runs. Guideline 1 says catch by reference for exactly this reason."
  },
  {
    "q": "Section D throws an int. What prints?",
    "code": "try { throw 42; }\ncatch (exception& e) { cout << \"D: exception\" << endl; }\ncatch (...)          { cout << \"D: catch-all\" << endl; }",
    "options": ["D: exception", "nothing", "42", "D: catch-all"],
    "answer": 3,
    "explain": "An int is not an exception. The ellipsis catches EVERYTHING, including ints and strings, which is why it must be the last handler."
  },
  {
    "type": "spotbug",
    "q": "The child handler can never run. Click the handler that must move below the other one.",
    "code": "struct parent_type : public exception {};\nstruct child_type : public parent_type {};\nint main() {\n    try { throw child_type(); }\n    catch (parent_type& e) { cout << \"parent\"; }\n    catch (child_type& e)  { cout << \"child\"; }\n}",
    "answer": 5,
    "explain": "Guideline 3: child type first. The parent handler on line 5 matches every child, so line 6 is dead code (g++: exception of type child_type will be caught by earlier handler)."
  },
  {
    "type": "spotbug",
    "q": "`what()` prints the parent's text although a child was thrown. Click the line responsible.",
    "code": "try {\n    throw child_type();\n} catch (parent_type e) {\n    cout << e.what();\n}",
    "answer": 3,
    "explain": "Line 3 catches by value, so the child is sliced into a parent_type copy. Write catch (parent_type& e)."
  },
  {
    "type": "reorder",
    "q": "Order these handlers so that none of them is unreachable.",
    "lines": [
      "catch (invalid_argument& e) { cout << \"bad argument\"; }",
      "catch (logic_error& e)      { cout << \"logic error\"; }",
      "catch (exception& e)        { cout << \"some std::exception\"; }",
      "catch (...)                 { cout << \"anything else\"; }"
    ],
    "explain": "Most derived first: invalid_argument is a logic_error, which is an exception. The ellipsis catches everything, so it goes last."
  },
  {
    "type": "fill",
    "q": "Complete the handler that catches every remaining exception (slide 20).",
    "code": "try { read_matrix_file(name); }\ncatch (cannot_open_file& e) { cerr << \"FILE NOT FOUND\\n\"; }\ncatch (___) { cerr << \"something else went wrong\\n\"; }",
    "answer": ["...", "…"],
    "explain": "Three dots, the ellipsis. Obviously this should be the last one, in the slide's words."
  },
  {
    "type": "fill",
    "q": "Complete guideline 6: print a message, then let the same exception continue up the stack.",
    "code": "catch (cannot_open_file& e)\n{\n    cerr << \"FILE NOT FOUND.\\n\";\n    ___;   // rethrows the cannot_open_file exception\n}",
    "answer": ["throw"],
    "explain": "A bare throw; rethrows the original object. throw e; would throw a copy, and slice it if e is a reference to a derived type."
  },
  {
    "type": "fill",
    "q": "Promise that no exception leaves this function (C++11).",
    "code": "double square_root(double x) ___\n{\n    ...\n}",
    "answer": ["noexcept"],
    "explain": "Callers never need to check for exceptions from it, and if one is thrown anyway the program ends, which is what should happen."
  },
  {
    "type": "fill",
    "q": "Complete the slide's override of `what()` (two blanks, in order).",
    "code": "struct myexception : public exception {\n    const char* what() const ___ ___\n    { return \"My exception happened\"; }\n};",
    "answer": ["noexcept", "override"],
    "explain": "std::exception declares what() as const noexcept; the override must match. override makes the compiler check that it really overrides."
  },
  {
    "q": "ex_unwind: level3 constructs `g3` and throws `runtime_error(\"boom\")`; level2 constructs `g2`, catches `runtime_error&`, prints `level2 caught: boom, rethrowing` and does `throw;`; level1 constructs `g1` and has no handler; main catches `exception&` and prints `main caught: boom`, then `main continues`. After `level3 throws`, the lines are...",
    "options": ["level2 caught: boom, rethrowing / g3 destroyed / g2 destroyed / g1 destroyed / main caught: boom / main continues", "g3 destroyed / level2 caught: boom, rethrowing / g2 destroyed / g1 destroyed / main caught: boom / main continues", "g3 destroyed / g2 destroyed / g1 destroyed / level2 caught: boom, rethrowing / main caught: boom / main continues", "g3 destroyed / level2 caught: boom, rethrowing / main caught: boom / g2 destroyed / g1 destroyed / main continues"],
    "answer": 1,
    "explain": "Leaving level3 destroys g3 before level2's handler runs. The rethrow leaves level2 (g2 destroyed) and passes straight through level1 (g1 destroyed) before main's handler. Destructors run as each frame is left, never after the handler that follows it."
  },
  {
    "q": "Inside `catch (parent_type& e)` holding a thrown `child_type`, what is the difference between `throw e;` and `throw;` for an outer `catch (parent_type& e) { cout << e.what(); }`?",
    "options": ["`throw e;` prints parent (a sliced copy); `throw;` prints child (the original object)", "both print child", "both print parent", "`throw;` is a compile error outside main"],
    "answer": 0,
    "explain": "throw e; copy-constructs a new exception of the static type parent_type. The bare throw; rethrows the very object that was thrown, derived part intact. Verified: parent then child."
  },
  {
    "q": "A function declared `noexcept` throws `invalid_argument` inside a `try` block in main that has `catch (...)`. What happens?",
    "options": ["the catch (...) in main handles it", "the program ends: std::terminate is called, the handler never runs", "the exception is converted to a return code", "a compile error"],
    "answer": 1,
    "explain": "Verified with ex_noexcept: calling square_root(-1) prints, then terminate called after throwing an instance of 'std::invalid_argument'. noexcept is a promise; breaking it ends the program."
  },
  {
    "q": "Destructors are implicitly `noexcept`.",
    "type": "tf",
    "answer": true,
    "explain": "Since C++11. NEVER throw an exception from a destructor: it is treated as a run-time error and execution ends."
  },
  {
    "type": "spotbug",
    "q": "Click the line that will end the program instead of being caught.",
    "code": "class File {\n    fstream f;\npublic:\n    File(const char* n) : f(n) { if (!f.is_open()) throw cannot_open_file(); }\n    ~File() { if (f.fail()) throw runtime_error(\"bad close\"); }\n};",
    "answer": 5,
    "explain": "Throwing from the constructor (line 4) is normal: no object is created. Throwing from the destructor (line 5) violates its implicit noexcept and calls terminate; g++ warns 'throw' will always call 'terminate'."
  },
  {
    "q": "`std::exception::what()` returns...",
    "options": ["`std::string`", "`void`, printing the message itself", "`int`, an error code", "`const char*`, a null-terminated character sequence"],
    "answer": 3,
    "explain": "A virtual member function returning a C string. Override it as const char* what() const noexcept override."
  },
  {
    "type": "match",
    "q": "Match each exception derived from `std::exception` to who throws it (slide 26).",
    "pairs": [
      ["`bad_alloc`", "thrown by new on allocation failure"],
      ["`bad_cast`", "thrown by dynamic_cast when it fails in a dynamic cast"],
      ["`bad_typeid`", "thrown by typeid"],
      ["`bad_weak_ptr`", "thrown by shared_ptr when passed a bad weak_ptr"],
      ["`logic_error`", "thrown when a logic error occurs"]
    ],
    "explain": "The slide-26 table. new throws bad_alloc rather than returning nullptr."
  },
  {
    "q": "Which of these derive from `runtime_error` in `<stdexcept>`? (select all)",
    "options": ["`invalid_argument`", "`range_error`", "`out_of_range`", "`overflow_error`"],
    "answer": [1, 3],
    "explain": "Slide 27: logic_error has invalid_argument, length_error, out_of_range; runtime_error has range_error and overflow_error. A logic error could be detected before running; a runtime error only shows up while running."
  },
  {
    "q": "exception3.cpp runs `std::string(\"abc\").substr(10);` inside `try` and catches `const std::exception&`. The slide's comment says the call throws...",
    "options": ["`std::length_error`", "`std::bad_alloc`", "`std::runtime_error`", "nothing: substr clamps the position"],
    "answer": 0,
    "explain": "The slide and the shipped file's comment say length_error (libstdc++ in fact throws out_of_range, also a logic_error). Either way the handler for std::exception prints basic_string::substr: __pos (which is 10) > this->size() (which is 3)."
  },
  {
    "q": "An exception is thrown and no catch statement with a matching type exists anywhere up the stack. The sequence is...",
    "options": ["the exception is silently dropped and main returns 0", "`terminate` is called, it calls the termination handler, which calls `abort`", "main's return code becomes 1", "the nearest `catch (exception&)` is used anyway"],
    "answer": 1,
    "explain": "Slide 29. std::terminate is declared in <exception>. The result is a crash with no destructors run."
  },
  {
    "type": "match",
    "q": "Match each principle to the slide's one-line statement.",
    "pairs": [
      ["Single Responsibility", "each class is responsible for only one thing"],
      ["Open/Closed", "open for extension, but closed for modification"],
      ["Liskov Substitution", "if S is a subtype of T, objects of type T may be replaced with objects of type S"],
      ["Interface Segregation", "no client should be forced to depend on functions it does not use"],
      ["Dependency Inversion", "high-level and low-level modules should depend on abstractions"],
      ["Law of Demeter", "only talk to your friends; don't talk to strangers"]
    ],
    "explain": "The five SOLID boxes plus slide 96. ISP is the Single Responsibility Principle for interfaces; DIP is the combined effect of OCP and LSP."
  },
  {
    "q": "The slide's boxed definition of coupling is...",
    "options": ["the strength of the connection between modules", "the glue that holds a module together", "the number of classes in a program", "the depth of an inheritance tree"],
    "answer": 0,
    "explain": "Coupling refers to links between separate units; tightly coupled classes depend on many details of each other. We aim for loose coupling."
  },
  {
    "q": "Good design aims for tight cohesion and loose coupling.",
    "type": "tf",
    "answer": false,
    "explain": "The words are high cohesion and loose coupling. 'Tight' describes bad coupling, and the slide never uses it for cohesion."
  },
  {
    "q": "The slide's boxed definition of cohesion is...",
    "options": ["the strength of the connection between modules", "the number of public members", "how many classes depend on this one", "the glue that holds a module together"],
    "answer": 3,
    "explain": "Cohesion refers to the number and diversity of tasks a single unit is responsible for; one single logical task per unit is high cohesion. 'Unit' applies to functions, classes and modules."
  },
  {
    "q": "According to slide 48, the most common and effective way of decoupling code is...",
    "options": ["global variables shared by the modules", "inheritance and interfaces/abstract classes", "putting all classes in one file", "removing every dependency"],
    "answer": 1,
    "explain": "Sushi depends on an abstract Filling instead of Fish. We still have a dependency; entities will always depend on each other, that's how OOP works. The aim is weak dependencies."
  },
  {
    "q": "The slide-56 `User` class assigns username, password, name and email, does `this->database = MyDatabase();` and has `post_to_forum`. How many responsibilities does the deck count?",
    "options": ["one: it is a user", "two: user and database", "three: be a user, create a database, post to a forum", "four: one per constructor parameter"],
    "answer": 2,
    "explain": "Slides 57-59 build up the three. The fix keeps User as a user and moves posting into PostWriter, which receives a MyDatabase* in its constructor."
  },
  {
    "q": "The Open/Closed fix for `UIWidget`'s `if (type == \"Button\") ... else if (type == \"Text Box\") ...` chain is to...",
    "options": ["add an `else if` per new widget", "move the chain into a switch statement", "store the draw code in a map keyed by type string", "make `draw()` pure virtual in `UIWidget` and override it in `UIButton`, `UITextBox`, `UIScrollBar`"],
    "answer": 3,
    "explain": "We use inheritance and overriding. Each widget class becomes modular and decoupled, and a change to UIButton cannot break the others. It even follows SRP."
  },
  {
    "q": "A `Canvas` with members `UIPanel* panel; UIScrollbar* scrollbar; UIButton* button;` and a `draw_screen()` that calls each one. The deck's objection names which principle?",
    "options": ["Liskov Substitution: refer to every child as its base class and keep a `vector<UIWidget*>`", "Interface Segregation: Canvas has too many functions", "Single Responsibility: Canvas should not draw", "Law of Demeter: Canvas reaches into the widgets"],
    "answer": 0,
    "explain": "Why inherit if you have to keep an explicit reference to each subtype? Objects should be replaceable by references of their base type; let polymorphism determine the derived type at runtime."
  },
  {
    "q": "`class Animal` with pure virtual `walk()`, `swim()` and `fly()` forces `Human` to override `fly`. The fix is...",
    "options": ["give `fly()` an empty default body", "keep `breathe()` and `eat()` in Animal and move walk/swim/fly into `Walkable`, `Swimmable`, `Flyable` interfaces", "make Human a friend of Animal", "remove `fly()` from the zoo"],
    "answer": 1,
    "explain": "Interface Segregation: many client-specific interfaces are better than one general-purpose interface. Human : public Animal, public Walkable, public Swimmable inherits only what it needs."
  },
  {
    "q": "Dependency Inversion's second rule is...",
    "options": ["high-level modules should depend on low-level modules", "concrete classes should not be instantiated", "abstractions should not depend on details; details should depend on abstractions", "every class should have an interface"],
    "answer": 2,
    "explain": "Rule 1: high-level modules should not depend on low-level modules; both should depend on abstractions. In the diagram DataSource depends on nothing; UI and TextFile both point at it."
  },
  {
    "q": "The Cashier's `money = customer.getWallet().getMoney(amount)` is marked #BAD. The slide's fix is...",
    "options": ["`money = customer.getMoney(amount)`, with `Customer::getMoney` returning `wallet.getMoney(amount)`", "make Wallet a friend of Cashier", "pass the Wallet to the Cashier's constructor", "store the amount in a global"],
    "answer": 0,
    "explain": "Classes should have knowledge of public members of neighbouring classes, not of classes several hops away. Cashier asks Customer; Customer reaches into its own Wallet. Calling several methods on the same neighbour is fine; it is the chain through return values that breaks Demeter."
  },
  {
    "q": "Slide 97's `data = characterUI.getCharacterCreator().save(characterUI.getCharacterCreator().createCharacter());` is fixed on slide 98 by...",
    "options": ["adding a `getSaveWriter()` getter", "restructuring: swapping Game and CharacterCreationUI so Game holds the CharacterCreator directly", "catching the exception", "making save static"],
    "answer": 1,
    "explain": "There isn't one solution that fixes all Law of Demeter problems; here the fix is structural, not another getter. Game then calls characterUI.getData() and characterCreator.initiateCharacterCreation(data)."
  },
  {
    "q": "The SOLID principles were created by...",
    "options": ["Bjarne Stroustrup", "Barbara Liskov", "Robert C. Martin, known as Uncle Bob", "the ISO C++ committee"],
    "answer": 2,
    "explain": "Slide 54. Liskov's name is on the L, but the set of five is Martin's."
  }
]
```

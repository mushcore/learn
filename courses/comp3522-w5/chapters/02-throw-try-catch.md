---
title: throw, try and catch
minutes: 18
---

The error-code version of `read_matrix_file` could be ignored and used up the return value. An exception fixes both: the function throws an object, and control jumps to the nearest `catch` whose type matches, skipping everything in between.

## Enter the exception: throw replaces the return code

```cpp run pin cannot_open_file.cpp
// predict: The file does not exist. Write the two lines printed.
// Slide 14: the same function reporting failure with an exception of its own type.
#include <iostream>
#include <fstream>
using namespace std;

struct cannot_open_file { };

void read_matrix_file(const char* fname)
{
    fstream f(fname);
    if (!f.is_open()) { throw cannot_open_file(); }
    cout << "reading " << fname << endl;   // not reached when the throw fires
}

int main()
{
    try
    {
        read_matrix_file("no_such_file.txt");
        cout << "after the call" << endl;   // skipped: control jumps to the handler
    }
    catch (cannot_open_file& e)
    {
        cout << "caught cannot_open_file" << endl;
    }
    cout << "main continues" << endl;
    return 0;
}
```

Slide 12 replaces `return 1;` with `throw "Can't open file";`. Slide 14 refines it to a type of the function's own: `struct cannot_open_file { };` is an empty struct whose only job is to be a distinct type, and `if (!f.is_open()) { throw cannot_open_file(); }` creates an object of that type and throws it. The function is now `void`: its return value is free for results again, and nothing after the throw runs, so `cout << "reading " << fname << endl;` is skipped. *We must catch exceptions (just like Java)*: the call sits inside a **try block**, and `catch (cannot_open_file& e)` is the **handler** that names the type it accepts, by reference. The throw leaves the try block at once, so `cout << "after the call" << endl;` is skipped too; the handler prints `caught cannot_open_file`, and execution resumes after the whole try-catch with `main continues`. The error can no longer be ignored: a thrown exception with no handler ends the program (lesson 4).

## You can throw anything, but define a type

Slide wording: C++ lets us throw anything as an exception: 1. strings, 2. numbers, 3. user types, 4. exceptions from the standard library. *It is best, however, to define exception types or use exceptions from the standard library.* The shipped `exception2.cpp` tries one of each kind against four handlers.

```cpp run pin exception2.cpp
// predict: As shipped, which handler runs? Write the one line printed.
#include <iostream>
#include <exception>

using namespace std;

class A {
public:
    string message()
    {
        return "random class error";
    }
};

struct myexception : public exception
{
    virtual const char * what () const noexcept
    {
        return "C++ Exception";
    }
};

int main() {
   try
   {
      //throw myexception();
       //throw A{};
       throw "message error";
   }
   catch(myexception& e)
   {
      std::cout << "myexception caught" << std::endl;
      std::cout << e.what() << std::endl;
   }
   catch(std::exception& e)
   {
      //Other errors
   }
   catch (A& a)
   {
       cout << a.message() << '\n';
   }
   catch (const char *c)
   {
       cout << c << '\n';
   }
}
```

`throw "message error";` throws a string literal, and a string literal is a `const char*`, not a `std::string`. The only handler of that type is `catch (const char *c)`; a `catch (string&)` would never see it. With the commented-out `//throw myexception();` instead, the first handler, `catch(myexception& e)`, matches because that is its exact type, and its body prints a line of its own and then its `what()`. The second handler, `catch(std::exception& e)`, would also match a `myexception` (it derives from `exception`), but the first match wins, and this one has an empty body that swallows any other standard exception silently. With `//throw A{};`, only `catch (A& a)` can match: `A` is an ordinary class with no relation to `std::exception`, so the base-class handler does not apply to it.

```widget
catch-matcher
{ "throw": "const char*", "handlers": ["myexception&", "std::exception&", "A&", "const char*"], "presets": true }
```

## A constructor that throws creates no object

```cpp run pin exception4.cpp
// predict: Write the one line printed.
#include <string>
#include <stdexcept>
#include <iostream>
using namespace std;
class Name
{
private:
    std::string first;
public:
    Name(std::string first) : first(first)
    {
        if (first.length() == 0)
        {
            throw std::invalid_argument("No first name!");
        }
    }
};

int main()
{
    try {
        std::string a;
        //Name{"Jeff"};
        Name{a};
    }
    catch (exception &e) {
        cout << e.what() << endl;
    }
}
```

Slide 28 uses a standard exception instead of a home-made struct. `Name(std::string first) : first(first)` copies the parameter into the member, then the body checks it: an empty first name is unacceptable, so `throw std::invalid_argument("No first name!");` throws `std::invalid_argument` from `<stdexcept>`, a class whose constructor takes the message and whose `what()` returns it. `std::string a;` is empty, so `Name{a};` throws; `catch (exception &e)` accepts it through a reference to the base class and prints its `what()`. The commented-out `//Name{"Jeff"};` would print nothing. The rule that matters: when a constructor throws, **no object is created**. There is nothing to destroy, so the class's destructor does not run for the half-built object; only members and bases that were already fully constructed are destroyed, which `exception5.cpp` shows in lesson 4. The file is shipped as `exception6.cpp`; the slides call it `exception4.cpp`.

:::quiz No checked exceptions in C++
Java's `throws` clause lists what a method may throw and the compiler forces callers to handle it. C++ has no equivalent: nothing in a function's signature says what it throws (C++03 tried, and the feature was deprecated at once; lesson 4). Only the documentation, or a `noexcept`, tells you.
:::

```challenge
{
  "prompt": "A <code>Temperature(double kelvin)</code> constructor throws <code>std::invalid_argument(\"below absolute zero\")</code> when <code>kelvin &lt; 0</code>. In <code>main</code>, construct a <code>Temperature</code> with <code>-1</code> inside a try block and print the exception's <code>what()</code>.",
  "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Temperature\n{\n    double kelvin;\npublic:\n    Temperature(double kelvin) : kelvin(kelvin)\n    {\n        // throw when kelvin < 0\n    }\n};\n\nint main()\n{\n    // construct Temperature(-1) inside try, catch and print what()\n    return 0;\n}\n",
  "expected": "below absolute zero",
  "hints": ["The constructor body: <code>if (kelvin &lt; 0) { throw std::invalid_argument(\"below absolute zero\"); }</code>", "Catch by reference: <code>catch (std::invalid_argument&amp; e) { cout &lt;&lt; e.what() &lt;&lt; endl; }</code>. <code>catch (exception&amp; e)</code> works too, because invalid_argument derives from exception."],
  "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Temperature\n{\n    double kelvin;\npublic:\n    Temperature(double kelvin) : kelvin(kelvin)\n    {\n        if (kelvin < 0)\n        {\n            throw std::invalid_argument(\"below absolute zero\");\n        }\n    }\n};\n\nint main()\n{\n    try\n    {\n        Temperature t(-1);\n    }\n    catch (std::invalid_argument& e)\n    {\n        cout << e.what() << endl;\n    }\n    return 0;\n}\n"
}
```

```quiz
[
  {
    "q": "What is the type of the exception thrown by `throw \"Can't open file\";`?",
    "options": ["`std::string`", "`char`", "`const char*`", "`std::exception`"],
    "answer": 2,
    "explain": "A string literal is an array of const char that decays to a const char*. Only catch (const char*) matches it; catch (string&) and catch (exception&) do not."
  },
  {
    "q": "Which of these can be thrown in C++? (select all)",
    "options": ["A number such as `42`", "A user-defined type such as `cannot_open_file`", "A standard-library exception such as `std::invalid_argument`", "A string literal"],
    "answer": [0, 1, 2, 3],
    "explain": "C++ lets us throw anything: strings, numbers, user types, standard exceptions. The slide's advice is still to define exception types or use the standard ones, so that handlers can tell errors apart by type."
  },
  {
    "q": "What does this print?",
    "code": "try {\n    throw 7;\n    cout << \"A\";\n}\ncatch (int n) {\n    cout << \"B\" << n;\n}\ncout << \"C\";",
    "options": ["ABC", "B7C", "AB7C", "B7"],
    "answer": 1,
    "explain": "The throw leaves the try block immediately, so A is skipped; the int handler prints B7; execution resumes after the try-catch and prints C."
  },
  {
    "q": "In `exception2.cpp` the throw is changed to `throw A{};` where `A` is a plain class. Which handler runs?",
    "options": ["`catch(myexception& e)`", "`catch(std::exception& e)`", "`catch (const char *c)`", "`catch (A& a)`"],
    "answer": 3,
    "explain": "A does not derive from std::exception, so the base-class handler cannot match it; only the handler naming A itself does, printing random class error."
  },
  {
    "q": "A constructor throws part-way through. Which statement is true?",
    "options": ["No object is created; there is nothing for its destructor to destroy", "The object exists but is in an invalid state", "The destructor runs on the partial object", "The exception is ignored because constructors cannot throw"],
    "answer": 0,
    "explain": "A constructor that does not finish creates no object, so the class's destructor never runs for it. Members and bases that had already been fully constructed are destroyed on the way out."
  },
  {
    "q": "The slide's refined example throws `cannot_open_file()` rather than the string `\"Can't open file\"`. Why is the type better?",
    "options": ["Strings cannot be thrown", "It makes the throw faster", "Only class types reach `catch (...)`", "A handler can select the error by type with `catch (cannot_open_file& e)` instead of inspecting text"],
    "answer": 3,
    "explain": "Handlers are chosen by type. A distinct type lets the caller catch exactly this error and let others pass; every string literal looks the same to the catch clauses."
  },
  {
    "q": "In C++, a function's signature must list the exception types it can throw, as in Java's `throws`.",
    "type": "tf",
    "answer": false,
    "explain": "C++ has no checked exceptions. C++03's throw specifications were deprecated almost immediately; C++11 offers only noexcept, which promises that nothing is thrown at all."
  }
]
```

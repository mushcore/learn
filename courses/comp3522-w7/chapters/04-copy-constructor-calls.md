---
title: When the copy constructor runs: basic.cpp and copy_elision.cpp
minutes: 20
---

The deck lists three times the copy constructor runs, then warns that copy elision can remove one of them. Two sample programs, run for real, show which copies survive.

## Three times the copy constructor is called

Slide 23, in slide wording:

1. *When invoking the copy constructor directly.* `MyClass c(otherC);` and `MyClass c1 = c;`
2. *When passing an object by value to a function* `void myFunc(MyClass c) {}`
3. *When returning an object by value from a function.* `MyClass myFunc() { MyClass c; return c; }`

Then: *HOWEVER! Copy Elision and Return Value Optimization may be used by some compilers to eliminate a temporary object created to hold a function's return value.* The third case is the one that can vanish. `return c;` returns a named local, which is NRVO from the previous lesson: allowed, never required. Since C++11 a returned local is moved if the class has a move constructor; the deck's classes declare only a copy constructor, so a copy is what runs when the return is not elided.

## basic.cpp: a static counter names every object

```cpp run pin basic.cpp
// predict: Write every line printed. Each new object takes the next letter of counter, starting at A.
#include <iostream>

class basic
{
private:
	char id;
public:
	static char counter;
	basic() { id = counter++; std::cout << "basic " << id << " Default constructor\n"; }
	basic(const basic&) { id = counter++; std::cout << "basic " << id << " Copy constructor\n"; }
	~basic() { std::cout << "basic " << id << " Destructor\n"; }
};

char basic::counter = 'A';

basic use_basic(basic c)
{
	std::cout << "Entered use_basic\n";
	std::cout << "Instantiating a local basic using the cc and the basic passed as a param\n";
	basic local(c);
	std::cout << "Returning a basic that was created locally (returning it by VALUE so it works)\n";
	return local; // RETURN VALUE OPTIMIZATION! COPY ELISION ALERT!  WHAT DOES YOUR COMPILER DO?
}

int main()
{
	std::cout << "Constructing basic a using default constructor\n";
	basic a;
	
	std::cout << "Creating basic b using copy constructor and basic A\n";
	basic b(a);

	std::cout << "Passing basic a by value to a function\n";
	basic d = use_basic(a);

	std::cout << "Creating an array of 5 basics\n";
	basic array [5];

}
```

`static char counter;` is one variable shared by every `basic`, defined once outside the class with `char basic::counter = 'A';` (slide 22: *it's a global!*). Both constructors run `id = counter++;`, so each object takes the next letter in the order it is built, and every line names the object it is about.

- A is `a`, from `basic a;`. B is `b`, from `basic b(a);`: the first case.
- `basic d = use_basic(a);` passes `a` by value, so C is the parameter `c`: the second case.
- `basic local(c);` makes D, the first case again.
- `return local;` is the third case, and nothing prints for it. g++ applied NRVO, so D is `d` in `main`, and no `basic D Destructor` line appears inside the call.
- `basic C Destructor` prints right after the return message: g++ destroys a by-value parameter when the function returns.
- `basic array [5];` builds E to I in index order.

At the end of `main` the objects die in reverse order of construction: the array from its last element (I, H, G, F, E), then D, B and A.

Without elision, the language would require `return local;` to copy `local` into `d`, so a `basic E Copy constructor` line would follow the return message, then `basic D Destructor` and `basic C Destructor`, and the array would take the letters F to J.

## copy_elision.cpp with both elision lines live

```cpp run pin copy_elision.cpp
// predict: Write every line printed. Both elision lines are live in this copy.
#include <iostream>

struct C
{
    C() { std::cout << "Default constructor.\n"; }
    C(const C&) { std::cout << "A copy was made.\n"; }
};

C f()
{
    return C{};
}

int main()
{
    std::cout << "Hello World!\n";

    //copy elision
    C obj = C{};

    //RVO + copy elision
    C obj2 = f();

//    //regular default constructor and copy
    C c;
    C obj3 = c;
    return 0;
}

// Hello World!
// Default constructor.
// A copy was made.
// A copy was made.

// or

// Hello World!
// Default constructor.
// A copy was made.

// or

// Hello World!
// Default constructor.
```

As shipped, `C obj = C{};` and `C obj2 = f();` are commented out, and the file prints only `Hello World!`, `Default constructor.` and `A copy was made.`. This copy makes both lines live; nothing else changes.

`C obj = C{};` prints one `Default constructor.` line: `C{}` is a prvalue of the same type, so C++17 guarantees it is built directly in `obj`. `C obj2 = f();` also prints one line, because `return C{};` is a prvalue built straight into `obj2`. The comments at the end of the file give three possible outputs for that statement (two copies, one, none); g++ under C++17 prints the third. Then `C c;` adds a default construction and `C obj3 = c;` adds `A copy was made.`: `c` is a named object that keeps living, so that copy is real and is never elided.

Without elision, the language would require one copy for `C obj = C{};` and two for `C obj2 = f();` (into the return value, then into `obj2`); the first comment block shows those two copies, which C++17 forbids even under `-fno-elide-constructors`.

## Slide 95: returning a parameter

Slide 95 calls `MyClass mc2 = myFunction(mc);` with `MyClass myFunction(MyClass mcCopy)`, whose comment says the local `mcCopy` *is created using your copy constructor*, followed by `return mcCopy; //return value is also copied`. The slide is right under C++17. Building the parameter is the second case, and a parameter is never elided on return: the standard excludes parameters, because a parameter is a separate object built before the function body runs, so it cannot also be the caller's object.

### Constructor calls for myFunction(mc)

```widget
elision-trace
{ "case": "param", "predict": true }
```

Watch where each object is built: one copy goes into `mcCopy`, and the return builds `mc2` from it.

## Count the copies in a by-value round trip

Each program uses `Ticket`, whose constructors print the next id from a static counter and whose destructor prints `drop` with the id. Trace each object from its constructor line to its destructor line.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Ticket {\n    int id;\npublic:\n    static int next;\n    Ticket() : id(next++) { cout << \"make \" << id << endl; }\n    Ticket(const Ticket&) : id(next++) { cout << \"copy \" << id << endl; }\n    ~Ticket() { cout << \"drop \" << id << endl; }\n};\n\nint Ticket::next = 1;\n\nTicket stamp(Ticket t) {\n    cout << \"stamping\" << endl;\n    return t;\n}\n\nint main() {\n    Ticket first;\n    Ticket second = stamp(first);\n    cout << \"done\" << endl;\n    return 0;\n}\n",
    "options": [
      "`make 1` / `copy 2` / `stamping` / `copy 3` / `drop 2` / `done` / `drop 3` / `drop 1`",
      "`make 1` / `copy 2` / `stamping` / `done` / `drop 2` / `drop 1`",
      "`make 1` / `copy 2` / `stamping` / `copy 3` / `done` / `drop 3` / `drop 2` / `drop 1`",
      "`make 1` / `stamping` / `copy 2` / `drop 2` / `done` / `drop 1`"
    ],
    "answer": 0,
    "explain": "Real output, line by line: `first` is `make 1`. Passing by value copies it into the parameter `t`: `copy 2`. The body prints `stamping`. `return t;` returns a parameter, which is never elided, so `second` is a copy: `copy 3`. g++ destroys the parameter when the call ends: `drop 2`. Then `done`, and at the end of main reverse order of construction: `drop 3` (second), `drop 1` (first)."
  },
  {
    "q": "The parameter is now a `const` reference and the function returns a named local. How many `copy` lines does this print?",
    "type": "numeric",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Ticket {\n    int id;\npublic:\n    static int next;\n    Ticket() : id(next++) { cout << \"make \" << id << endl; }\n    Ticket(const Ticket&) : id(next++) { cout << \"copy \" << id << endl; }\n    ~Ticket() { cout << \"drop \" << id << endl; }\n};\n\nint Ticket::next = 1;\n\nTicket stamp(const Ticket& t) {\n    Ticket out(t);\n    cout << \"stamping\" << endl;\n    return out;\n}\n\nint main() {\n    Ticket first;\n    Ticket second = stamp(first);\n    cout << \"done\" << endl;\n    return 0;\n}\n",
    "answer": 1,
    "tolerance": 0,
    "explain": "Real output: `make 1` / `copy 2` / `stamping` / `done` / `drop 2` / `drop 1`. A reference parameter makes no copy. `Ticket out(t);` is the one copy (id 2). `return out;` returns a single named local, so g++ applies NRVO: `out` is `second`, built once."
  },
  {
    "q": "`show` takes its parameter by value and is called twice. What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Ticket {\n    int id;\npublic:\n    static int next;\n    Ticket() : id(next++) { cout << \"make \" << id << endl; }\n    Ticket(const Ticket&) : id(next++) { cout << \"copy \" << id << endl; }\n    ~Ticket() { cout << \"drop \" << id << endl; }\n};\n\nint Ticket::next = 1;\n\nvoid show(Ticket) {\n    cout << \"showing\" << endl;\n}\n\nint main() {\n    Ticket first;\n    show(first);\n    show(first);\n    cout << \"done\" << endl;\n    return 0;\n}\n",
    "options": [
      "`make 1` / `copy 2` / `showing` / `drop 2` / `copy 3` / `showing` / `drop 3` / `done` / `drop 1`",
      "`make 1` / `copy 2` / `showing` / `copy 3` / `showing` / `done` / `drop 3` / `drop 2` / `drop 1`",
      "`make 1` / `showing` / `showing` / `done` / `drop 1`",
      "`make 1` / `copy 2` / `showing` / `drop 2` / `copy 2` / `showing` / `drop 2` / `done` / `drop 1`"
    ],
    "answer": 0,
    "explain": "Real output: each call copies `first` into a fresh parameter, which is destroyed when that call returns. The static counter keeps counting, so the second parameter is id 3, not 2. `first` is destroyed last, at the end of main."
  }
]
```

```quiz
[
  {
    "q": "Per slide 23, when is the copy constructor called? (select all)",
    "options": [
      "When invoking the copy constructor directly",
      "When passing an object by value to a function",
      "When returning an object by value from a function",
      "When passing an object by reference to a function",
      "When assigning one existing object to another, as in `c1 = c;` after both exist"
    ],
    "answer": [0, 1, 2],
    "explain": "The slide's three cases. A reference parameter is an alias, so nothing is copied. Assigning to an object that already exists calls the copy assignment operator, not the copy constructor; `MyClass c1 = c;` is a declaration, so it is the first case."
  },
  {
    "q": "Per slide 23, Copy Elision and Return Value Optimization may be used by some compilers to eliminate a temporary object created to hold a function's return value.",
    "type": "tf",
    "answer": true,
    "explain": "True by the slide. Since C++17 the prvalue case (`return MyClass();`) is guaranteed for every compiler; only returning a named local (NRVO) is still the compiler's choice."
  },
  {
    "q": "In basic.cpp above, which letter does main's `d` print in its destructor line?",
    "options": ["D", "E", "C", "J"],
    "answer": 0,
    "explain": "Real output: `basic D Destructor` prints after the array's five destructors. `local` takes D, and g++ applies NRVO to `return local;`, so `local` and `d` are one object: no extra copy takes the letter E."
  },
  {
    "q": "In basic.cpp, why does `basic C Destructor` print before `Creating an array of 5 basics`?",
    "options": [
      "C is the by-value parameter of `use_basic`, and g++ destroys it when the call returns",
      "C is `local`, destroyed at the end of `use_basic`",
      "C is `b`, destroyed when it is copied",
      "Destructors run in the order the objects were built"
    ],
    "answer": 0,
    "explain": "Passing `a` by value builds the parameter `c` as C. It belongs to the call, so it dies as the call ends. `local` (D) survives because NRVO made it main's `d`."
  },
  {
    "q": "This is slide 95's `myFunction` with the slide-13 `Number` class. How many `copy constructor` lines does it print?",
    "type": "numeric",
    "code": "#include <iostream>\n\n//Number.hpp (the slide-13 class), used for slide 95's return-a-parameter case\nclass Number {\nprivate:\n        int num;\npublic:\n        Number(int n) : num (n) { std::cout << \"1-param constructor\\n\"; }\n        Number(const Number &n2)\n        {num = n2.num; std::cout << \"copy constructor\\n\"; }\n};\n\nNumber myFunction(Number mcCopy)\n{\n        return mcCopy; //return value is also copied\n}\n\n//main function\nint main() {\n        Number mc(5);\n        Number mc2 = myFunction(mc);\n        return 0;\n}\n",
    "answer": 2,
    "tolerance": 0,
    "explain": "Real output: `1-param constructor` / `copy constructor` / `copy constructor`. The first copy builds the parameter `mcCopy` from `mc`; the second builds `mc2` from `mcCopy`, because returning a parameter is never elided."
  },
  {
    "q": "Under C++17, `C obj2 = f();` with `C f() { return C{}; }` can print `A copy was made.`",
    "type": "tf",
    "answer": false,
    "explain": "`return C{};` is a prvalue of type C, and initializing `obj2` from the call is a prvalue too, so C++17 guarantees one object built in `obj2`. Only `Default constructor.` prints for that statement, even under `-fno-elide-constructors`."
  },
  {
    "q": "In copy_elision.cpp, why is `C obj3 = c;` never elided?",
    "options": [
      "`c` is a named object that still exists afterwards, so `obj3` must be a second object",
      "Elision only happens inside functions",
      "`C` has no move constructor",
      "The compiler skips elision when a constructor prints"
    ],
    "answer": 0,
    "explain": "Elision removes a temporary or a returned object, never a copy of an object that stays alive. `c` and `obj3` are two objects, so the copy constructor runs."
  }
]
```

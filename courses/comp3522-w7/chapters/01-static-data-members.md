---
title: Static data members: one copy per class
minutes: 18
---

Two objects that must share one counter, one buffer or one helper object cannot each carry a copy of it. A static data member is that single copy, and it belongs to the class rather than to any object.

## Only one copy per class exists

Slide 4: in C++, member variables can be static. *Only one copy per class exists.* A static member permits a single resource to be shared between instances, and it has independent static storage for the life of the program. The Singleton design pattern, later in the course, is built on this.

```cpp run pin static.cpp
// predict: Write every line printed (eleven lines).
#include <iostream>

using namespace std;

class A
{
private:
	int a;
public:
	A() : a{0} { cout << "A() created\n"; }
	~A() { cout << "A() destroyed\n"; }
	void increment() { a++; }
	void print() {cout << a << endl;}
};

class B
{
private:
	static A my_a;
public:
	static double * pointer;
	B() { cout << "B() created\n"; }
	~B() { cout << "B() destroyed\n"; }
	void increment() { my_a.increment(); }
	void print() {my_a.print();}
};

double * B::pointer = new double[3];
A B::my_a = A{};

int main()
{
	B b;
	B b2;

	//modify public static pointer
	b.pointer[0] = 1;
	b.pointer[1] = 2;
	b.pointer[2] = 3;

	cout << "b - " << b.pointer[0] << " " << b.pointer[1] << " " << b.pointer[2] << endl;
	cout << "b2 - " << b2.pointer[0] << " " << b2.pointer[1] << " " << b2.pointer[2] << endl;
	cout << "B:: - " << B::pointer[0] << " " << B::pointer[1] << " " << B::pointer[2] << endl;

	//modify private static class
	b.increment();
	b2.increment();
	cout << "b private a: "; b.print();
	cout << "b2 private a: "; b2.print();

	delete[] b.pointer;

	return 0;

}
```

This copy of the sample `static.cpp` changes two things: the original prints the three doubles before assigning them, which reads memory that was never initialized and prints different garbage on every run, so that line is gone; and the original frees the array with `delete`, which is undefined behaviour on memory from `new[]`, so this copy says `delete[] b.pointer;`.

`A() created` prints before either `B() created` because `A B::my_a = A{};` is a definition at namespace scope: it runs before `main` starts, and its object is destroyed last, after main's `b` and `b2`. There is one `A` for two `B` objects, so `b.increment();` and `b2.increment();` add to the same counter and both prints show 2. In the same way, `b.pointer`, `b2.pointer` and `B::pointer` are one pointer: what `b` writes, `b2` reads.

## static goes on the declaration, not the definition

Slide wording: *static keyword used with declaration not definition*. The line inside the class only declares the member. One definition outside the class creates its storage, with the class name in front:

```cpp
class X { static int n; }; // incomplete declaration
int X::n = 1; // definition outside class
```

Leave the definition out and the program still compiles, but the linker fails with `undefined reference to 'X::n'`. Repeat the keyword, as in `static int X::n = 1;`, and g++ stops: "'static' may not be used when defining (as opposed to declaring) a static data member".

## Two ways to reach a static

| Slide 5 form | Written | Works on |
|---|---|---|
| 1. Qualified name | `Class::member` | the class name: `X::n` |
| 2. Member access expression | `Class->member or Class.member` | an object or a pointer: `obj.n`, `p->n` |

The slide's `Class.member` means an object expression on the left of the dot; on the class name itself neither `X.n` nor `X->n` compiles (g++: "expected primary-expression before '.' token"). The legal forms all name the same `n`. Statics *exist even if no objects have been defined*, so `X::n` is usable before the first `X` is made.

## Three initialization cases

Slides 6 to 8 give one rule for each kind of static data member:

| Kind | Slide rule | Slide lines |
|---|---|---|
| plain `static` | *Can't be initialized inside the class definition*: initialize outside | `static int m = 5; //ERROR`, `static int n; //OK`, then `int X::n = 5; //OK` outside |
| `const static`, integral or enum | *constant integral or enumeration types can be initialized inside the class definition* | `const static int m = 9; //can be initialized inside`; or `const static int k;` with `const int X::k = 3; //initialized outside` |
| `constexpr static` | *constant expression must be initialized with a literal inside the class definition* | `constexpr static int arr[] = { 1, 2, 3 }; // OK`, `constexpr static std::complex<double> n = {1,2}; // OK`, `constexpr static int k; // ERROR` |

So plain: outside only; const integral: inside allowed; constexpr: inside required. Slide 7 also declares `static const double * pointer; //cannot be initialized inside`. That is a pointer to const doubles, and the pointer itself is not const, so the plain rule is the one that applies; it is defined outside as `const double * X::pointer = new double[3];`. "Initialized with a literal" means a constant expression of a literal type, which is why `std::complex<double>` qualifies.

Since C++17, `inline static int m = 5;` is legal inside the class, but the course follows slide 6, and without `inline` g++ still rejects the line: "ISO C++ forbids in-class initialization of non-const static member".

## Trace a ticket counter and a sales booth

Two new classes share a static counter across their objects; the third has one line the compiler rejects. Type the line each program prints, or click the rejected line.

```quiz
[
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Ticket {\npublic:\n    static int issued;\n    int number;\n    Ticket() : number{++issued} {}\n};\n\nint Ticket::issued = 0;\n\nint main() {\n    cout << Ticket::issued << \" \";\n    Ticket a;\n    Ticket b;\n    Ticket c;\n    cout << a.number << b.number << c.number << \" \" << Ticket::issued << \" \" << a.issued << endl;\n    return 0;\n}",
    "answer": ["0 123 3 3"],
    "explain": "`issued` is one int shared by every Ticket, defined outside as 0, and it exists before any Ticket does, so the first output is 0. Each constructor does `++issued` and stores the new value: a gets 1, b gets 2, c gets 3, printed with no spaces as 123. `Ticket::issued` and `a.issued` name the same int, 3."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Booth {\npublic:\n    static int total;\n    int sold = 0;\n    void sell(int n) { sold += n; total += n; }\n};\n\nint Booth::total = 0;\n\nint main() {\n    Booth north;\n    Booth south;\n    north.sell(4);\n    south.sell(6);\n    north.sell(1);\n    Booth* p = &south;\n    cout << north.sold << \" \" << p->sold << \" \" << Booth::total << \" \" << p->total << endl;\n    return 0;\n}",
    "answer": ["5 6 11 11"],
    "explain": "`sold` is per object: north sells 4 + 1 = 5, south sells 6, and p points at south. `total` is static, one int for both booths: 4 + 6 + 1 = 11, the same whether reached as `Booth::total` or `p->total`."
  },
  {
    "q": "Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Queue {\npublic:\n    const static int max = 50;\n    static int limit = 100;\n    static int waiting;\n};\n\nint Queue::waiting = 0;\n\nint main() {\n    cout << Queue::max << \" \" << Queue::waiting << endl;\n    return 0;\n}",
    "answer": [7],
    "explain": "A plain static data member can't be initialized inside the class definition (slide 6): g++ says 'ISO C++ forbids in-class initialization of non-const static member Queue::limit'. `const static int max = 50;` is a const integral static, which may be initialized inside. Fix: declare `static int limit;` and define `int Queue::limit = 100;` outside."
  }
]
```

```quiz
[
  {
    "q": "However many objects of a class are created, only one copy of each static data member exists.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 4: only one copy per class exists, in static storage for the life of the program. In static.cpp both B objects reach the same `my_a`, so both prints show 2."
  },
  {
    "q": "Where does the keyword `static` go for a static data member `n` of class `X`?",
    "options": ["on the declaration inside the class only: `static int n;` inside, then `int X::n = 1;` outside", "on the definition outside the class only", "on both the declaration and the definition", "on neither: writing `X::n` is what makes it static"],
    "answer": 0,
    "explain": "Static keyword used with declaration not definition. Writing `static int X::n = 1;` draws the g++ error ''static' may not be used when defining (as opposed to declaring) a static data member'."
  },
  {
    "q": "A non-const static data member can be initialized inside the class definition, as in `static int m = 5;`.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 6 marks `static int m = 5;` as ERROR and initializes outside with `int X::n = 5;`. In C++17, `inline static int m = 5;` is allowed inside the class, but the line without `inline` is still an error."
  },
  {
    "q": "Which line may be initialized inside the class definition, by slide 7's rule?",
    "options": ["`const static int m = 9;`", "`static int m = 9;`", "`static const double * pointer = new double[3];`", "`static double rate = 0.5;`"],
    "answer": 0,
    "explain": "Constant integral or enumeration types can be initialized inside the class definition. The pointer is a non-const pointer to const doubles, so it is initialized outside, and plain statics are always initialized outside."
  },
  {
    "q": "`constexpr static int k;` inside a class is...",
    "options": ["an error: a constexpr static must be initialized inside the class definition", "fine if `constexpr int X::k = 3;` follows outside the class", "fine: k starts at zero", "fine as long as k is never used"],
    "answer": 0,
    "explain": "Slide 8 marks it ERROR; g++ says ''constexpr' static data member 'k' must have an initializer'. Since C++17 a constexpr static data member is implicitly inline, so the in-class initializer is its only definition."
  },
  {
    "q": "Given `struct X { static int n; }; int X::n = 1;` and, in main, `X obj; X* p = &obj;`, which expressions compile? (select all)",
    "options": ["`X::n`", "`obj.n`", "`p->n`", "`X.n`", "`X->n`"],
    "answer": [0, 1, 2],
    "explain": "The qualified name works on the class; the member access forms need an object or a pointer on the left. The slide's `Class.member` means an object expression: `X.n` on the class name gives 'expected primary-expression before '.' token'."
  },
  {
    "q": "A static data member exists even if no objects of its class have been defined.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 5. Its definition outside the class creates the storage when the program starts, independent of any object, so `X::n` works before the first X is made."
  },
  {
    "q": "In the static.cpp program above, why does `A() created` print before the first `B() created`?",
    "options": ["`A B::my_a = A{};` is a definition at namespace scope, so the A is built before main starts", "B's constructor builds an A each time it runs", "the first B object is built lazily, after main's first statement", "class A is defined before class B in the file"],
    "answer": 0,
    "explain": "Statics have storage for the life of the program, so the definition outside the class builds `my_a` before main. B's constructor never touches it, which is why only one 'A() created' prints for two Bs, and 'A() destroyed' prints last."
  }
]
```

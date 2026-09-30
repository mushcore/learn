---
title: Mock Quiz 4
minutes: 45
---

50 questions in the real format: multiple choice, true/false, select-all, what-does-this-print, fill-in-the-code, matching and bug hunts. Answer everything before you check. The programs are the instructor's own (oop_abstract, oop_multi0 to 3, diamond, Dollar, FriendClass, operators), so if a line looks familiar, trust what you ran.

:::quiz Real quiz conditions
Written at the start of lab on the Learning Hub, covering both Week 4 decks and the Week 4 sample projects. Aim for 90% here before you stop studying, then do the midterm practice questions on paper.
:::

```quiz
[
  {
    "q": "A C++ class becomes abstract when it...",
    "options": ["is declared with the `abstract` keyword", "has at least one pure virtual function (`= 0`)", "has a virtual destructor", "has only private members"],
    "answer": 1,
    "explain": "Abstract classes are implemented as classes with one or more pure virtual functions. There is no abstract keyword in C++."
  },
  {
    "q": "What is `= 0` in `virtual void f() = 0;` called?",
    "type": "text",
    "answer": ["pure specifier", "the pure specifier", "pure virtual specifier"],
    "explain": "The pure specifier marks the function as pure virtual: no body here, must be overridden by a concrete derived class."
  },
  {
    "q": "`virtual void g() { } = 0;`",
    "options": ["gives g a default body that derived classes may reuse", "is an error: a declaration cannot have both a pure specifier and a definition", "makes g non-virtual", "is the recommended interface style"],
    "answer": 1,
    "explain": "The slide marks this ERROR!"
  },
  {
    "q": "For an abstract class `A`, which are allowed? (select all)",
    "options": ["`A* pa;`", "`A& f(A& a);`", "`A g();`", "`void h(A a);`"],
    "answer": [0, 1],
    "explain": "Pointers and references yes; returning or accepting an A by value would need to create an A, which is impossible."
  },
  {
    "q": "`class B : public A` where A has two pure virtual functions and B overrides one. `B b;` gives...",
    "options": ["a B object", "a compile error: B is still abstract", "a warning", "an A object"],
    "answer": 1,
    "explain": "A class derived from an abstract class is abstract unless it overrides each pure virtual function."
  },
  {
    "q": "What prints?",
    "code": "class creature { public: virtual void all_info() const = 0; };\nclass person : public creature {\n    string name;\npublic:\n    person(const string& n) : name(n) {}\n    void all_info() const override { cout << \"My name is \" << name << endl; }\n};\nint main() {\n    creature* hulk = new person(\"Dr Bruce Banner\");\n    hulk->all_info();\n}",
    "options": ["My name is Dr Bruce Banner", "compile error: creature is abstract", "My name is", "nothing"],
    "answer": 0,
    "explain": "A pointer to the abstract base, an object of the concrete class, a virtual call: the shipped oop_abstract output."
  },
  {
    "q": "Calling a pure virtual function from the abstract class's constructor is...",
    "options": ["the normal way to initialize", "undefined", "a compile error", "fine if the function is const"],
    "answer": 1,
    "explain": "CAUTION on the slide: calling (directly or indirectly) a purely virtual function from an abstract class constructor is UNDEFINED."
  },
  {
    "type": "match",
    "q": "Match each kind of class to its description.",
    "pairs": [
      ["interface", "only pure virtual functions, a virtual destructor, no data members, cannot be instantiated"],
      ["abstract class", "at least one pure virtual function, may have data and other functions, cannot be instantiated"],
      ["concrete class", "no pure virtual functions, can be instantiated"]
    ],
    "explain": "The slide's three-column table from 'not implemented' to 'fully implemented'."
  },
  {
    "q": "Why does the interface `Animal` declare `virtual ~Animal() {}`?",
    "options": ["Interfaces must have a constructor", "So that deleting an implementing object through an `Animal*` runs the derived class's destructor", "To make it abstract", "To allow copying"],
    "answer": 1,
    "explain": "Without a virtual destructor, delete through a base pointer runs only the base destructor: leaked members, undefined behaviour."
  },
  {
    "q": "What prints?",
    "code": "class B { public: ~B() { cout << \"B\"; } virtual void f() = 0; };\nclass D : public B { public: ~D() { cout << \"D\"; } void f() override {} };\nint main() { B* p = new D; delete p; }",
    "options": ["DB", "BD", "B", "D"],
    "answer": 2,
    "explain": "B's destructor is not virtual, so delete p runs only ~B. With virtual ~B() it would print DB."
  },
  {
    "q": "A C++ class may have more than one base class.",
    "type": "tf",
    "answer": true,
    "explain": "Unlike Java. The derived class's members are the union of all base class members; with two parents the hierarchy looks like a V."
  },
  {
    "q": "A and B both declare `int x`. In `class C : public A, public B`, what is `c.x`?",
    "options": ["A's x", "B's x", "ambiguous: a compile error; use `c.A::x` or `c.B::x`", "both, added"],
    "answer": 2,
    "explain": "C can't access x directly. Scoping with the base name resolves the ambiguity."
  },
  {
    "q": "In oop_multi0, student and mathematician both define `all_info()`, and math_student inherits from both without overriding. `bob.all_info()` is...",
    "options": ["student's version (listed first)", "mathematician's version", "ambiguous: compile error", "both, in order"],
    "answer": 2,
    "explain": "all_info is ambiguously inherited; the shipped main calls bob.mathematician::all_info() instead."
  },
  {
    "type": "fill",
    "q": "Inherit person's constructors into student.",
    "code": "class student : public person\n{\n    ___ person::person;\n};",
    "answer": ["using"],
    "explain": "using person::person; is equivalent to writing student() = default; and student(const string& name) : person(name) {}."
  },
  {
    "q": "In oop_multi1 (no virtual bases), constructing `math_student bob(...)` prints `person 1-param constructor`...",
    "options": ["once", "twice", "never", "three times"],
    "answer": 1,
    "explain": "student and mathematician each have their own person subobject: two grandparents, two constructor calls, two copies of the name."
  },
  {
    "q": "The declaration that makes person a shared grandparent is...",
    "options": ["`class student : public person` in both middle classes", "`class student : public virtual person` and `class mathematician : public virtual person`", "`virtual class person`", "`class math_student : virtual student, virtual mathematician`"],
    "answer": 1,
    "explain": "Both middle classes must declare person a virtual base; then math_student contains one person."
  },
  {
    "q": "oop_multi2 makes both bases virtual but keeps `: person(name)` in the middle constructors and `: student(name, passed), mathematician(name, proved)` in math_student. What prints first, and what is the name?",
    "options": ["person 1-param constructor; Robert Robson", "person default constructor; the name is empty", "student constructor; Robert Robson", "a compile error"],
    "answer": 1,
    "explain": "The most derived class is responsible for constructing a virtual base; the middle classes' person(name) calls are disabled, so person() ran and the name was lost."
  },
  {
    "q": "The initializer list that fixes oop_multi2 (oop_multi3) is...",
    "options": ["`: student(name, passed), mathematician(name, proved), person(name)`", "`: person(name), student(passed), mathematician(proved)`", "`: person(name)`", "`: student(name), mathematician(name)`"],
    "answer": 1,
    "explain": "math_student calls person's constructor directly and gives each middle class only its own data. (The first option compiles too, but the slide's canonical answer is the second; oop_multi2 calls it hacky.)"
  },
  {
    "q": "In oop_multi3 the one-parameter constructors of student and mathematician are `protected`. Why?",
    "options": ["Protected constructors are faster", "They exist only to be called from math_student, which owns the shared person; a directly constructed student should use the public two-parameter one that calls person(name)", "The compiler requires it for virtual bases", "To hide them from person"],
    "answer": 1,
    "explain": "Student can call person's constructor when it's directly instantiated; it cannot only when constructed through MathStudent."
  },
  {
    "q": "diamond.cpp: `class B : virtual public A`, `class C : public virtual A`, `class D : public B, public C`. What does `D d;` print?",
    "options": ["A allocated, B allocated, C allocated, D allocated, D deallocated, C deallocated, B deallocated, A deallocated", "A B A C D allocated, D C A B A deallocated", "D C B A allocated, A B C D deallocated", "B C A D allocated"],
    "answer": 0,
    "explain": "One shared A first, bases in the listed order, D last; destruction in exact reverse."
  },
  {
    "q": "Remove both `virtual` keywords from diamond.cpp. How many times does `A allocated` print for `D d;`?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "Without virtual inheritance each of B and C carries its own A: two grandparents."
  },
  {
    "q": "diamondmethods.cpp: father and mother (virtual bases of grandparent) both override `foo()`, and child overrides it too. `grandparent& gp = a; gp.foo();` prints...",
    "options": ["grandparent.foo", "father.foo", "child.foo", "ambiguous: compile error"],
    "answer": 2,
    "explain": "Virtual dispatch reaches the most derived override. It would be ambiguous only if child did not override."
  },
  {
    "q": "What is a friend function?",
    "options": ["A member function that can be called from anywhere", "A non-member function granted access to a class's private and protected members by a declaration inside the class", "A function in the same file", "A virtual function"],
    "answer": 1,
    "explain": "Declared inside the class with the friend keyword, defined outside it (anywhere), and not a member."
  },
  {
    "q": "What does the shipped Dollar program print?",
    "code": "class Dollar {\n    int num;\n    friend Dollar sum(const Dollar &d1, const Dollar &d2);\npublic:\n    Dollar(int d) : num(d) {}\n    int GetNum() { return num; }\n};\nDollar sum(const Dollar &d1, const Dollar &d2) { return Dollar(d1.num + d2.num); }\nint main() {\n    Dollar d1{5}, d2{7};\n    cout << sum(d1, d2).GetNum();\n}",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "explain": "sum reads both private num values as a friend: 5 + 7 = 12."
  },
  {
    "q": "Boss declares `friend class Spy;`. Which is true? (select all)",
    "options": ["Spy's member functions can read Boss's private pin", "Boss's member functions can read Spy's private pin", "A class derived from Spy can read Boss's private pin", "A friend of Spy can read Boss's private pin"],
    "answer": [0],
    "explain": "Friendship is one-directional (Boss to Spy), not inherited, and not transitive."
  },
  {
    "q": "Friendship is transitive: if Boss befriends Spy and Spy befriends Minion, Boss befriends Minion.",
    "type": "tf",
    "answer": false,
    "explain": "The slide's example says NO. Transitivity holds for < (A < B and B < C means A < C), not for friendship."
  },
  {
    "q": "A friend declaration placed in the private section of a class...",
    "options": ["is ignored", "makes the friend function private", "works exactly as it would in the public section", "is a syntax error"],
    "answer": 2,
    "explain": "Access specifiers have no effect on friend declarations."
  },
  {
    "q": "Which rule of operator overloading is on the slide?",
    "options": ["Overload as many operators as possible", "If you overload +, you should overload += too; if you overload prefix ++, overload postfix too", "Operators must always be members", "Only arithmetic operators can be overloaded"],
    "answer": 1,
    "explain": "Provide the whole set, adhere to the commonly known semantics, and do not overload when the meaning is unclear."
  },
  {
    "q": "`objA += 10` calls...",
    "options": ["`operator+=(objA, 10)` as a non-member", "`objA.operator+=(10)` as a member of objA's class", "`10.operator+=(objA)`", "the copy constructor"],
    "answer": 1,
    "explain": "Assignment-style operators modify the left operand and are members of its type."
  },
  {
    "q": "Which operator must be a friendly non-member because its left operand is not your class?",
    "options": ["`+=`", "`++`", "`<<` (stream insertion)", "`=`"],
    "answer": 2,
    "explain": "cout << obj has a std::ostream on the left; you cannot add members to ostream, so operator<< is a non-member, and a friend to read private data."
  },
  {
    "type": "fill",
    "q": "Complete the canonical insertion operator's return.",
    "code": "friend ostream& operator<<(ostream& os, const Date& dt)\n{\n    os << dt.mo << '/' << dt.da << '/' << dt.yr;\n    return ___;\n}",
    "answer": ["os"],
    "explain": "Return the stream by reference so that cout << a << b chains."
  },
  {
    "q": "What prints?",
    "code": "class Date {\n    int mo, da, yr;\npublic:\n    Date(int m, int d, int y) : mo(m), da(d), yr(y) {}\n    friend ostream& operator<<(ostream& os, const Date& dt) {\n        os << dt.mo << '/' << dt.da << '/' << dt.yr;\n        return os;\n    }\n};\nint main() { Date dt(5, 6, 92); cout << dt; cout << 77; }",
    "options": ["5/6/92 then 77", "5/6/9277", "compile error: cout has no operator for Date", "77"],
    "answer": 1,
    "explain": "The friend prints 5/6/92 and the built-in prints 77 right after it with no newline: 5/6/9277 (the slide's comments show the two parts)."
  },
  {
    "q": "The extraction operator's signature differs from insertion in that the object parameter is...",
    "options": ["a const reference", "a non-const reference, because it is being filled in", "passed by value", "a pointer"],
    "answer": 1,
    "explain": "friend istream& operator>>(istream& is, T& obj): reading into obj modifies it."
  },
  {
    "q": "Given `operator<` is written, the canonical `operator>` is...",
    "options": ["`return !operator<(lhs, rhs);`", "`return operator<(rhs, lhs);`", "`return lhs >= rhs;`", "`return !(lhs == rhs);`"],
    "answer": 1,
    "explain": "lhs > rhs is rhs < lhs: swap the arguments."
  },
  {
    "q": "And the canonical `operator<=`?",
    "options": ["`return !operator>(lhs, rhs);`", "`return operator<(rhs, lhs);`", "`return !operator<(lhs, rhs);`", "`return operator==(lhs, rhs);`"],
    "answer": 0,
    "explain": "lhs is less than or equal to rhs means lhs is not greater than rhs. And >= is !(lhs < rhs)."
  },
  {
    "q": "How many comparison operators does the slide say you should usually define?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "explain": "==, !=, <, >, <=, >=. Two do real comparisons; the other four are written in terms of them."
  },
  {
    "q": "`Counter operator++(int)` is...",
    "options": ["the prefix form; the int is the amount", "the postfix form; the int is a dummy that distinguishes it from prefix", "an error: ++ takes no parameters", "a friend"],
    "answer": 1,
    "explain": "Postfix always accepts a dummy (unused) int argument so the two forms can be told apart."
  },
  {
    "q": "What prints?",
    "code": "class Counter {\n    int n = 5;\npublic:\n    Counter& operator++() { ++n; return *this; }\n    Counter operator++(int) { Counter tmp(*this); operator++(); return tmp; }\n    int value() const { return n; }\n};\nint main() {\n    Counter c;\n    cout << (c++).value() << (++c).value() << c.value();\n}",
    "options": ["567", "577", "667", "566"],
    "answer": 1,
    "explain": "c++ returns the old value (5) and makes c 6; ++c makes c 7 and returns it (7); c.value() is 7: 577."
  },
  {
    "q": "The canonical `operator+` takes its left operand by value and calls `lhs += rhs`. Why by value?",
    "options": ["References cannot be added", "The copy becomes the new result to return, leaving the caller's object unchanged: a + b is expected to be a new value", "It is faster", "So it can be a member"],
    "answer": 1,
    "explain": "operator+ returns a copy (a new value) and is defined in terms of +=, which returns *this by reference."
  },
  {
    "q": "`Fraction z = x + y;` with x = 5.5, y = 1.1. After the call, x is...",
    "options": ["6.6", "5.5 (unchanged)", "1.1", "0"],
    "answer": 1,
    "explain": "operator+ modified its by-value copy lhs (6.6) and returned it into z; x was never touched."
  },
  {
    "type": "match",
    "q": "Match the operator to its typical implementation.",
    "pairs": [
      ["unary `++`, `--`, `!`", "member: operates on a single object"],
      ["`=`, `+=`, `-=`", "member: modifies the left-hand object"],
      ["`==`, `<`, `>`", "non-member friend: symmetric comparison"],
      ["`+`, `-`, `*`, `/`", "non-member friend: works with non-class left operands"],
      ["`<<`, `>>`", "non-member friend: the left operand is a stream"]
    ],
    "explain": "The slide's member-or-non-member table."
  },
  {
    "q": "`B = A;` for objects that already exist calls...",
    "options": ["the copy constructor", "the copy assignment operator `operator=`", "the destructor", "the default constructor"],
    "answer": 1,
    "explain": "A constructor only runs when an object is created. Example C = A; would be the copy constructor."
  },
  {
    "q": "The canonical copy assignment operator is...",
    "options": ["`MyClass& operator=(const MyClass& rhs) { /* copy each member */ }`", "`MyClass& operator=(MyClass rhs) { mySwap(*this, rhs); return *this; }`", "`void operator=(MyClass rhs)`", "`MyClass operator=(MyClass* rhs)`"],
    "answer": 1,
    "explain": "Copy-and-swap: rhs by value (the copy constructor makes the copy), swap, return *this by reference."
  },
  {
    "q": "Copy-and-swap requires... (select all)",
    "options": ["a working copy constructor", "a working destructor", "a swap function that swaps all data members and does not throw", "a friend class"],
    "answer": [0, 1, 2],
    "explain": "The slide's three needs. The copy constructor makes the temporary, the swap exchanges data, the destructor of the temporary frees the old data."
  },
  {
    "q": "After `mySwap(*this, other)` inside `B = A`, the temporary `other` holds...",
    "options": ["A's data", "B's old data, which its destructor frees when the function ends", "nothing", "a copy of both"],
    "answer": 1,
    "explain": "The swap gave B the fresh copy of A and gave other B's old state; other is destroyed leaving the function, taking the old data with it."
  },
  {
    "q": "Using `std::swap` on the whole object inside `operator=`...",
    "options": ["is the recommended shortcut", "causes a recursive spiral, because std::swap uses the copy constructor and the copy assignment operator", "is faster than swapping members", "does a deep copy"],
    "answer": 1,
    "explain": "Swap each data member with std::swap; never the entire object."
  },
  {
    "q": "A class with an owned pointer relies on the compiler's `operator=`. After `B = A;`...",
    "options": ["B has a deep copy of A's array", "B's old array is leaked and A and B share one array (freed twice later)", "compile error", "A's array is moved into B"],
    "answer": 1,
    "explain": "Member-wise assignment copies the pointer: the old array loses its only pointer, and both destructors will delete the shared one."
  },
  {
    "q": "Which sentence from the slides describes assignment?",
    "options": ["Assignment creates a new object", "Think of assignment as replacing the object's old state with a copy of some other object's state", "Assignment calls the destructor first", "Assignment is the same as the copy constructor"],
    "answer": 1,
    "explain": "The closing line of the copy-and-swap example."
  },
  {
    "type": "spotbug",
    "q": "Click the line that will not compile.",
    "code": "class A { public: virtual void g() = 0; };\nclass B : public A { public: void g() override {} };\nA makeA() { return B(); }\nvoid use(A& a) { a.g(); }\nint main() { B b; use(b); }",
    "answer": 3,
    "explain": "Line 3 returns an A by value: an abstract class cannot be a function return type. Line 4's A& is fine."
  },
  {
    "q": "In the shipped operators project, `Character char3 = '!';` prints `constructing char: !`. Why does a plain char turn into a Character?",
    "options": ["Characters are chars", "The one-argument constructor `Character(char c)` converts the char implicitly", "operator= was called", "It does not compile"],
    "answer": 1,
    "explain": "A single-argument constructor acts as a converting constructor, the same mechanism that lets 5 + a work with a non-member operator+."
  }
]
```

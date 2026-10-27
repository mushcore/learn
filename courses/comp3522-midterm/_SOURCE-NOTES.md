# COMP 3522 Midterm — facts, questions and verified answers transcribed from the instructor's material

Source files: `D:\BCIT\COMP3522\Lectures\Week 6\3522 Midterm Info6.pdf` (4 slides) and `D:\BCIT\COMP3522\Lectures\Week 6\COMP 3522 Practice Midterm.pdf` (17 pages). Code answers were compiled with g++ -std=c++20 -Wall -Wextra -pedantic (GCC 13.1.0 mingw) and run; sources in `$S\build\pm_*.cpp`, outputs in `$S\build\outputs.txt`.

## Midterm info (slides 1–4)
- **Oct 29, 3:30 pm, SW03-1710.** "Come 10 minutes early to make sure we don't start late." (Info6 had one more sentence here; see the Info7 section below.)
- "Midterm will cover all the topics up to and including Week 7 material." 90 minute exam. "Can bring 1 page, double sided cheat sheet: handwritten or printed with Arial size 10 font and up." Written on paper.
- Format: multiple choice, true/false; definitions ("What is a reference?"); read code snippet and write the output; short coding question; long coding question ("Long questions are guided: broken down into multiple parts, ask you to write individual functions").
- Study strategy: go over slides and links in slides; understand code samples referenced in slides (sample.cpp); recall what we did in labs/assignments; try out coding challenges within the lectures; try out COMP 3522 Practice midterm (Week 6 > COMP 3522 Practice Midterm); go over old quizzes (Activities > Quizzes > Quiz 2 (down arrow) > Submissions > Attempt 1). Not sure about a topic? Online resources: https://www.geeksforgeeks.org/c-plus-plus/ and https://www.tutorialspoint.com/cplusplus/index.htm; search "`topic` geeks for geeks", e.g. "multiple inheritance geeks for geeks"; ask me.
- Midterm review: "We'll spend next week on review"; anonymous midterm review topic requests: https://forms.gle/HAcpDu8cZTw5yY9bA.

## 3522 Midterm Info7.pdf
Source: `D:\BCIT\COMP3522\Lectures\Week 7\3522 Midterm Info7.pdf`, the Week 7 re-post. Its text equals Info6 except that the sentence after "Come 10 minutes early to make sure we don't start late." is gone: Info6 added that the instructor would not admit anyone before the start and to be ready outside; Info7 drops it. Every other fact above (date, time, room, coverage, 90 minutes, the cheat-sheet rule, format, strategy, review week) is unchanged, so the lessons cite Info7. The slides never name the weekday; Oct 29, 2026 is a **Thursday**.

## Practice midterm, page 1
Header: COMP 3522 Object Oriented Programming 2, Midterm Exam; Full Name, Signature, Student ID, Set. Instructions (11 points): no phones (zero if it rings); "closed-book exam. No cheat sheets" (**superseded by the Midterm Info slide's one double-sided page**); no electronic devices, calculators, watches, music players, headphones; no talking; eyes on your own paper; 90 minutes; write answers on the exam, back allowed; no admission after 30 minutes, no leaving in the first 30; no questions except supposed typos; "Good luck. You've got this." Final grade: PART A ___/66 + PART B ___/39 = ___/105. Question numbers 17–19 do not exist.

## Part A: Theory (66 marks) with model answers
1. (4) **What is a copy constructor? When is it used? Be specific. Code snippets may be used.** The constructor that builds a new object as a copy of an existing one of the same class, `Fraction(const Fraction& other)`: `const` so immutable objects can be copied, `&` so the parameter is not itself a copy (otherwise infinite recursion). Used when a new object is initialized from another: `Fraction b(a);`, `Fraction b = a;`, passing an object **by value**, returning an object by value. Not used by `b = a;` on an existing object (that is the copy assignment operator). The compiler generates a member-wise (shallow) copy; a class owning a pointer writes its own deep copy.
2. (3) **What is a reference? How is it different from a pointer?** An alias, another name for an existing variable (`int& ref = n;`), must be initialized when declared and can never be re-seated, used like the variable itself. A pointer is a separate variable holding an address (`int* p = &n;`), may be null, may be re-pointed, needs `*` to reach the pointee.
3. (4) **Pass by value, by pointer, by reference: difference, why choose one.** By value copies (callee cannot change the caller's variable; cheap for small types); by pointer passes an address (callee can change the pointee, can express "no object" with nullptr, works with arrays and C); by reference passes the variable under a new name (no copy, callee can change it; `const T&` gives no-copy plus safety). Verified program in w4 lesson 08.
4. (4) **Suppose we have a pointer to a string called `success`. What is the difference between `&success` and `*success`? When would we use each?** With `string* success = &s;`: `*success` dereferences, it is the `string` object the pointer points to (use it to read or change the string: `*success = "done"; success->length()`); `&success` is the **address of the pointer variable itself**, of type `string**` (use it to pass the pointer to a function that must change where it points, `void reset(string** pp)`, or to inspect where the pointer lives). Verified snippet: `string s = "ok"; string* success = &s; cout << *success;` prints `ok`; `string** pp = &success; *pp = &other;` re-points `success`.
5. (4) **Static allocation vs dynamic allocation, with code.** Static (automatic) allocation: `int x = 5; Fraction f(1, 2);` on the stack, size known at compile time, destroyed automatically when the scope ends. Dynamic allocation: `int* p = new int(5); Fraction* f = new Fraction(1, 2);` on the heap at run time, lives until `delete p; delete f;`, size can be decided at run time (`new int[n]`), accessed through a pointer, must be freed by the programmer ("dynamic = manual").
6. (4) **What is a memory leak? How do we prevent leaks? Write a function that leaks, then insert and underline the fix.** A leak is heap memory that was allocated with `new` but never released with `delete`, so it stays unreachable until the program ends. Prevent by pairing every `new` with a `delete` (`new[]` with `delete[]`), freeing in the destructor of the owning class, or avoiding raw ownership (smart pointers, containers). `void leak() { int* p = new int[100]; /* use p */ }` leaks; fix: add **`delete[] p;`** before the closing brace (and `p = nullptr;` optionally). Verified in w2 lesson 09.
7. (6) **const: a. purpose of making an argument const? b. purpose of adding const to a function header?** a. A `const` parameter (`void print(const Fraction& f)`) promises the function will not modify the argument; with a reference it avoids the copy **and** lets callers pass temporaries and const objects; the compiler rejects any modification. b. `int get_numerator() const;` after the parameter list makes a **const member function**: it promises not to change any data member (`this` is `const Fraction*`), the compiler enforces it, and only const member functions can be called on a const object or through a const reference; use it on every getter.
8. (3) **When is an object's destructor invoked automatically?** When the object goes out of scope (end of the block or function it was declared in, including when an exception unwinds the stack), when `delete` is applied to a pointer to a dynamically allocated object (`delete[]` for arrays), for temporaries at the end of the full expression, for members and bases after the enclosing object's destructor body, for static and global objects at program end. Order: reverse of construction.
9. (4) **Three ways to initialize variables in C++; which do we prefer and why?** `int x = 0;` (copy initialization), `int x(0);` (direct, parentheses), `int x{0};` (uniform / brace initialization, C++11). Prefer braces: they prohibit implicit narrowing conversions (`int y{3.7};` does not compile, the other two silently truncate) and work for every kind of object. (Week 1 lesson 05.)
10. (2) **When do we use `::` and when `.`?** `::` is the scope resolution operator: a name inside a namespace or class (`std::cout`, `Fraction::Fraction(...)` definitions outside the class, `Base::f()` to pick a base version, static members `Date::today()`). `.` accesses a member of an object instance (`f.numerator`, `obj.method()`); `->` does the same through a pointer.
11. (2) **Difference between class and struct?** Only the default access: members of a `struct` are public by default, members of a `class` are private by default (and the same for default inheritance). Everything else is identical.
12. (3) **What is a forward declaration and what is its purpose?** A declaration of a name before its full definition, `class Spy;`, so the compiler knows the name exists; it lets code refer to the type by pointer or reference before the definition (mutual references between classes, `friend class Spy;`), reduces header dependencies and compile times, and breaks circular includes. You cannot create objects or access members of an incomplete type.
13. (3) **How do we make a class abstract in C++?** Give it at least one pure virtual function, `virtual void f() = 0;` (the pure specifier). There is no `abstract` keyword; an abstract class cannot be instantiated, and a derived class stays abstract until it overrides every pure virtual function.
14. (2) **Does C++ have interfaces? Explain.** Not as a keyword. An interface is written as a pure abstract class: only pure virtual functions, no data members, plus a virtual destructor; a class "implements" it by inheriting (multiple inheritance allowed) and overriding every function.
15. (6) **Diamond: a. how does it happen? b. ambiguities with member functions, how solved? c. key responsibility of the most-derived class?** a. Two classes (student, mathematician) each inherit from the same base (person) and a fourth class (math_student) inherits from both, so the base appears twice unless the middle classes use `virtual` inheritance. b. Yes: a function inherited from both sides (`all_info`) is ambiguous (`bob.all_info()` fails to compile); fix by qualifying (`bob.mathematician::all_info()`), by overriding it in the most-derived class, or by making the base virtual so there is one copy. c. With virtual base classes the most-derived class must call the shared base's constructor itself in its initializer list (`: person(name), student(passed), mathematician(proved)`); the middle classes' calls to the virtual base constructor are ignored, so forgetting it default-constructs person and the name is lost.
16. (3) **Copy and swap: how does it work? An easy way to introduce an error?** `MyClass& operator=(MyClass other) { mySwap(*this, other); return *this; }`: 1. taking the parameter by value uses the copy constructor to make a local copy; 2. swap every member between `*this` and the copy; 3. the copy, now holding the old state, is destroyed when the function returns, freeing the old resources. Needs a working copy constructor, destructor and a non-throwing swap of all members. Easy errors: take the parameter by **reference** (no copy is made, so you swap the caller's object away), call `std::swap` on the **whole object** (it uses operator= and the copy constructor, so it recurses forever), forget one member in the swap, or return by value.

## Part B: Code (39 marks)

### Q20 (7): "What is printed to standard output by this code? HINT: this prints 14 lines."
```cpp
#include <iostream>

using namespace std;

class A
{
public:
    A() { cout << "Default constructor!" << endl; }
    ~A() { cout << "Destructor!" << endl; }
    A(const A&) { cout << "Copy constructor!" << endl;}
};

A foo(A input)
{
    cout << "Look ma, I'm fooing!" << endl;
    return input;
}

int main()
{
    A littleA;
    foo(littleA);
    A anotherA = littleA;
    A yetAnotherA = foo(littleA);
}
```
Verified output (14 lines, g++ 13 with default copy elision):
```
Default constructor!
Copy constructor!
Look ma, I'm fooing!
Copy constructor!
Destructor!
Destructor!
Copy constructor!
Copy constructor!
Look ma, I'm fooing!
Copy constructor!
Destructor!
Destructor!
Destructor!
Destructor!
```
Line by line: `A littleA;` → Default. `foo(littleA);` → copy into `input` (Copy), body prints, `return input;` copies into the temporary return value (Copy; a parameter cannot be elided), end of statement destroys the returned temporary and `input` (Destructor ×2). `A anotherA = littleA;` → Copy. `A yetAnotherA = foo(littleA);` → Copy (input), body, Copy (return value, which **is** yetAnotherA thanks to elision), Destructor (input). End of main destroys yetAnotherA, anotherA, littleA in reverse order (Destructor ×3). Count: 1 default, 5 copy, 2 fooing, 6 destructor = 14.

### Q21 (3) Fraction constructor throwing on denominator 0; Q22 (3) copy constructor; Q23 (2) destructor; Q24 (3) `ostream& operator<<(ostream& os, const Fraction& fraction)` as a friend; Q25 (3) `istream& operator>>(istream& is, Fraction& fraction)` as a friend; Q26 (10) program reading `Fractions.txt` (rows of two integers separated by whitespace) into a `std::stack<Fraction>` ("You may assume the code from the Fraction questions (21, 22, 23) is available to you. You may assume that there are no zeros in the file.")
Verified model answer (`pm_q21_26.cpp`):
```cpp
#include <fstream>
#include <iostream>
#include <stack>
#include <stdexcept>
#include <string>
using namespace std;

class Fraction {
private:
    int numerator;
    int denominator;
public:
    // Q21: constructor that throws on a zero denominator
    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {
        if (denominator == 0) {
            throw invalid_argument("Denominator cannot be zero");
        }
    }
    // Q22: copy constructor
    Fraction(const Fraction& other) : numerator(other.numerator), denominator(other.denominator) {}
    // Q23: destructor (nothing to free)
    ~Fraction() {}
    // Q24 / Q25: friendly stream operators
    friend ostream& operator<<(ostream& os, const Fraction& fraction);
    friend istream& operator>>(istream& is, Fraction& fraction);
};

ostream& operator<<(ostream& os, const Fraction& fraction) {
    os << fraction.numerator << "/" << fraction.denominator;
    return os;
}

istream& operator>>(istream& is, Fraction& fraction) {
    is >> fraction.numerator >> fraction.denominator;
    return is;
}

// Q26: read Fractions.txt, one Fraction per line, into a stack
int main() {
    ifstream in("Fractions.txt");
    if (!in.is_open()) {
        cerr << "Could not open Fractions.txt" << endl;
        return 1;
    }
    stack<Fraction> fractions;
    int num, den;
    while (in >> num >> den) {
        fractions.push(Fraction(num, den));
    }
    in.close();
    // show what we stored (top of stack = last line read)
    while (!fractions.empty()) {
        cout << fractions.top() << endl;
        fractions.pop();
    }
    // Q21 check
    try {
        Fraction bad(1, 0);
    } catch (invalid_argument& e) {
        cout << "caught: " << e.what() << endl;
    }
    return 0;
}
```
With `Fractions.txt` = `1 2 / 3 4 / 5 6`, output: `5/6` / `3/4` / `1/2` / `caught: Denominator cannot be zero` (a stack pops the last pushed first). Marking notes: Q21 wants `throw` inside the constructor (any type is accepted; `std::invalid_argument` with `#include <stdexcept>` is the Week 5 answer); Q22 must take `const Fraction&`; Q23 may be `~Fraction() {}` or `= default` since there is no owned resource; Q24 writes to `os` and **returns `os`**; Q25 reads into the non-const reference and returns `is`; Q26 needs `<fstream>`, `<stack>`, `ifstream`, an open check, a `while (in >> a >> b)` loop (or `getline` + `istringstream`), `push`, and shows the result with `top()`/`pop()`. In the app the file cannot exist, so the runnable version reads the same rows from stdin via `// stdin: 1 2\n3 4\n5 6` with `cin` in place of `in`, and the prose shows the `ifstream` lines.

### Q27 (4): "What is printed? HINT: this prints 14 lines."
```cpp
#include <iostream>
class A { public: A() { std::cout << "A allocated" << std::endl; } ~A() { std::cout << "A deallocated" << std::endl; } };
class B : public A { public: B() { std::cout << "B allocated" << std::endl; } ~B() { std::cout << "B deallocated" << std::endl; } };
class C : public B { public: C() { std::cout << "C allocated" << std::endl; } ~C() { std::cout << "C deallocated" << std::endl; } };
class D : public B { public: D() { std::cout << "D allocated" << std::endl; } ~D() { std::cout << "D deallocated" << std::endl; } };
class E : public C, public D { public: E() { std::cout << "E allocated" << std::endl; } ~E() { std::cout << "E deallocated" << std::endl; } };
int main() { E e; }
```
Verified output:
```
A allocated
B allocated
C allocated
A allocated
B allocated
D allocated
E allocated
E deallocated
D deallocated
B deallocated
A deallocated
C deallocated
B deallocated
A deallocated
```
No virtual inheritance: E contains two complete A–B chains (one under C, one under D). Bases construct in declaration order (C first, then D), each base-first; destruction is the exact reverse.

### Q28 (4): "What is printed? Hint: this prints 12 lines. Explain in 1 sentence why the output is different from the output in question 27."
Same classes except `class B : virtual public A` and `class C : virtual public B` (D stays `public B`). Verified output:
```
A allocated
B allocated
C allocated
B allocated
D allocated
E allocated
E deallocated
D deallocated
B deallocated
C deallocated
B deallocated
A deallocated
```
Why: A is a **virtual** base of B, so the single shared A is constructed once, first, by the most-derived class E; C's B is virtual (constructed next, by E, before any non-virtual base), while D's B is a normal base and is constructed again inside D, hence B appears twice but A only once (14 − 2 = 12 lines). g++ also warns `virtual base 'B' inaccessible in 'E' due to ambiguity`: E has two Bs (one virtual via C, one ordinary via D), so `B` is still ambiguous in E. Destruction mirrors construction: E, D (with its own B), C, then the virtual B, then the virtual A.

## Week coverage map for the theory drill (which existing lesson teaches each answer)
Q1 w3 copy-constructor; Q2 w2 pointers, references; Q3 w4 midterm-practice; Q4 w2 pointers; Q5 w4 midterm-practice; Q6 w2 new-delete; Q7 w3 constructors (const member functions), w2 references (const references); Q8 w3 destructor; Q9 w1 initialization; Q10 w1 hello-world, preprocessor-namespaces; Q11 w3 structs-classes; Q12 w3 forward-declaration; Q13 w4 abstract-classes; Q14 w4 interfaces; Q15 w4 multiple-inheritance, diamond-virtual-base; Q16 w4 copy-assignment; Q20 w3 copy-constructor, destructor; Q21 w5 throw-try-catch; Q22–25 w3, w4 operator-overloading; Q26 w2 file-streams, w3 lab3-stack; Q27–28 w3 inheritance, w4 diamond-virtual-base.

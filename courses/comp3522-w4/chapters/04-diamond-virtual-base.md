---
title: The diamond and virtual base classes
minutes: 28
---

Push the shared `name` of student and mathematician up into a common `person` base and the hierarchy becomes a diamond: person on top, student and mathematician in the middle, math_student at the bottom. The slide asks the question that the three oop_multi programs answer one step at a time: **how many grandparents are created?**

## oop_multi1: two grandparents

```cpp run pin oop_multi1.cpp
// predict: How many times does a person constructor print? Write all eight lines.
#include <iostream>
#include <string>
using namespace std;

class person //grandparent class, A in the slides
{
  public:
    person() { cout << "person default constructor" << endl; }
    person(const string& name) : name(name) { cout << "person 1-param constructor" << endl; }
    string get_name() const { return name; }
    virtual void all_info() const { cout << "[person name=" << name << "]" << endl; }
  private:
    string name;
};

class student : public person
{
  public:
    student(const string& name, const string& passed)
      : person(name), passed(passed) { cout << "student constructor" << endl; }
    virtual void all_info() const override
    {
        cout << "[student name=" << get_name() << "]" << endl;
        cout << "    I passed the following grades: " << passed << endl;
    }
  private:
    string passed;
};

class mathematician : public person
{
  public:
    mathematician(const string& name, const string& proved)
      : person(name), proved(proved) { cout << "mathematician constructor" << endl; }
    virtual void all_info() const override
    {
        person::all_info();
        cout << "    I proved: " << proved << endl;
    }
  private:
    string proved;
};

class math_student : public student, public mathematician
{
  public:
    math_student(const string& name, const string& passed, const string& proved)
      : student(name, passed), mathematician(name, proved) {}
    virtual void all_info() const override
    {
        student::all_info();
        mathematician::all_info();
        // person::all_info();   error: two person grandparents, which one?
    }
};

int main ()
{
    math_student bob("Robert Robson", "Algebra", "Fermat's Last Theorem");
    bob.all_info();
    return 0 ;
}
```

`person 1-param constructor` prints **twice**: once inside `student(name, passed)` and once inside `mathematician(name, proved)`, because each middle class contains its own complete person. Bob has two grandparents and two copies of the name. The override in math_student makes `bob.all_info()` unambiguous, but the commented `// person::all_info();   error: two person grandparents, which one?` shows the cost: any direct use of the person part is ambiguous.

## oop_multi2: virtual base, one grandparent, and a lost name

The fix is to declare person a **virtual base class** of both middle classes: `class student : public virtual person` and `class mathematician : public virtual person`. Virtual base classes permit us to store the members of a common base only once; student and mathematician no longer contain the person data, they refer to a common object that is part of the most derived class.

```widget
diamond-viz
{ "virtualStudent": true, "virtualMath": true, "init": "middle", "title": "oop_multi2: both bases virtual, the middle classes still write person(name)" }
```

The widget's output is exactly what the shipped oop_multi2 prints: `person default constructor`, then `student constructor`, `mathematician constructor`, and every name is **empty**. "We lost the value of name even though both student and mathematician called the person constructor and passed a name." Why: it is a derived class's responsibility to call its base constructor, or the compiler inserts a default-constructor call. With a virtual base there is only one person, and it is the **most derived class**, math_student, that constructs it. The `person(name)` calls in student and mathematician are disabled when they run as part of a more derived object, so nobody passed the name, and `person()` ran.

## oop_multi3: the most derived class constructs the shared base

```cpp run pin oop_multi3.cpp
// predict: Write all eight lines. Which person constructor runs, and how many times?
#include <iostream>
#include <string>
using namespace std;

class person
{
  public:
    person() { cout << "person default constructor" << endl; }
    person(const string& name) : name(name) { cout << "person 1-param constructor" << endl; }
    virtual void all_info() const { cout << "[person name=" << name << "]" << endl; }
  protected:
    string name;
};

class student : public virtual person
{
  public:
    student(const string& name, const string& passed)
    : person(name), passed(passed) { cout << "student two-param constructor" << endl; }
  protected:
    student(const string& passed) : passed(passed) { cout << "student one-param constructor" << endl; }
    void my_infos() const { cout << "I passed: " << passed << endl; }
  public:
    virtual void all_info() const override { person::all_info(); my_infos(); }
  private:
    string passed;
};

class mathematician : public virtual person
{
  public:
    mathematician(const string& name, const string& proved)
    : person(name), proved(proved) { cout << "mathematician two-param constructor" << endl; }
  protected:
    mathematician(const string& proved) : proved(proved) { cout << "mathematician one-param constructor" << endl; }
    void my_infos() const { cout << "I proved: " << proved << endl; }
  public:
    virtual void all_info() const override { person::all_info(); my_infos(); }
  private:
    string proved;
};

class math_student : public student, public mathematician
{
  public:
    math_student(const string& name, const string& passed, const string& proved)
    : person(name), student(passed), mathematician(proved)
     // : student(name, passed), mathematician(name, proved) //won't call person's 1 param constructor
    { cout << "math_student 3-param constructor" << endl; }
    virtual void all_info() const override { student::all_info(); mathematician::all_info(); }
};

int main ()
{
    math_student bob("Robert Robson", "Algebra", "Fermat's Last Theorem");
    bob.all_info();
    return 0 ;
}
```

`: person(name), student(passed), mathematician(proved)` is the rule in code: with virtual base classes it is the responsibility of the most derived class to call the shared base-class constructor, even though person is not a direct base. `person 1-param constructor` prints exactly once and first (virtual bases are constructed before anything else), then the two one-parameter middle constructors, then math_student's body, and the name is back. The middle classes keep their public two-parameter constructors so that a plain `student s("Jeff", "Algebra");` still calls `person(name)` when a student is constructed directly; the protected one-parameter constructors exist only to be used through math_student.

```widget
diamond-viz
```

Each combination of the two `virtual` keywords and the initializer list gives the output of one of the programs above, and the widget lists what becomes ambiguous in each.

## Construction and destruction order in the diamond

```cpp run pin diamond.cpp
// predict: Write all eight lines. Then remove both `virtual` keywords and predict again.
#include <iostream>
class A
{
	public:
	A() { std::cout << "A allocated" << std::endl; }
	~A() { std::cout << "A deallocated" << std::endl; }
};

class B : virtual public A
{
	public:
	B() { std::cout << "B allocated" << std::endl; }
	~B() { std::cout << "B deallocated" << std::endl; }
};

class C : public virtual A
{
	public:
	C() { std::cout << "C allocated" << std::endl; }
	~C() { std::cout << "C deallocated" << std::endl; }
};

class D : public B, public C
{
	public:
	D() { std::cout << "D allocated" << std::endl; }
	~D() { std::cout << "D deallocated" << std::endl; }
};

int main()
{
	D d;
}
```

```quiz
[
  {
    "q": "diamond.cpp as shipped (both bases virtual): how many times does `A allocated` print?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "Once: the virtual base A is shared, so `D d;` holds a single A, built first. Without `virtual` it would print twice."
  }
]
```

`class B : virtual public A` and `class C : public virtual A` are the same declaration in either word order. With one shared A, `D d;` prints `A allocated`, `B allocated`, `C allocated`, `D allocated`, then the destructors in exact reverse: D, C, B, A. Without `virtual` there are two A subobjects and the output becomes A, B, A, C, D allocated and D, C, A, B, A deallocated. Bases are constructed in the order they are listed after the colon (B before C), virtual bases first of all.

One more shipped file, diamondmethods.cpp: grandparent has `virtual void foo()`, father and mother (virtual bases) override it, and child overrides it again; `grandparent &gp = a; gp.foo();` on a child prints `child.foo`, because dynamic dispatch through the shared base reaches the most derived override. Remove child's override and the call is ambiguous: father and mother both claim to be the final overrider.

## Trace a `Copier` diamond with and without `virtual`

Device on top, Scanner and Printer in the middle, Copier at the bottom; this time Copier lists Printer first.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Device {\npublic:\n    Device() { cout << \"Device \"; }\n    ~Device() { cout << \"~Device \"; }\n};\n\nclass Scanner : public virtual Device {\npublic:\n    Scanner() { cout << \"Scanner \"; }\n    ~Scanner() { cout << \"~Scanner \"; }\n};\n\nclass Printer : virtual public Device {\npublic:\n    Printer() { cout << \"Printer \"; }\n    ~Printer() { cout << \"~Printer \"; }\n};\n\nclass Copier : public Printer, public Scanner {\npublic:\n    Copier() { cout << \"Copier \"; }\n    ~Copier() { cout << \"~Copier \"; }\n};\n\nint main() {\n    {\n        Copier c;\n        cout << \"| \";\n    }\n    cout << endl;\n    return 0;\n}",
    "options": [
      "`Device Printer Scanner Copier | ~Copier ~Scanner ~Printer ~Device`",
      "`Device Scanner Printer Copier | ~Copier ~Printer ~Scanner ~Device`",
      "`Device Printer Device Scanner Copier | ~Copier ~Scanner ~Device ~Printer ~Device`",
      "`Copier Printer Scanner Device | ~Device ~Scanner ~Printer ~Copier`"
    ],
    "answer": 0,
    "explain": "Both middle classes inherit Device virtually, so there is one Device, and a virtual base is built before anything else: `Device`. Then the direct bases in the order Copier lists them, `public Printer, public Scanner`: `Printer Scanner`, then `Copier`. The order the middle classes were declared in the file does not matter. `| ` prints inside the block, and at the closing brace destruction runs in exact reverse: `~Copier ~Scanner ~Printer ~Device`."
  },
  {
    "q": "Remove `virtual` from both middle classes. How many times does the Device constructor print?",
    "type": "numeric",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Device {\npublic:\n    Device() { cout << \"Device \"; }\n    ~Device() { cout << \"~Device \"; }\n};\n\nclass Scanner : public Device {\npublic:\n    Scanner() { cout << \"Scanner \"; }\n    ~Scanner() { cout << \"~Scanner \"; }\n};\n\nclass Printer : public Device {\npublic:\n    Printer() { cout << \"Printer \"; }\n    ~Printer() { cout << \"~Printer \"; }\n};\n\nclass Copier : public Printer, public Scanner {\npublic:\n    Copier() { cout << \"Copier \"; }\n    ~Copier() { cout << \"~Copier \"; }\n};\n\nint main() {\n    {\n        Copier c;\n        cout << \"| \";\n    }\n    cout << endl;\n    return 0;\n}",
    "answer": 2,
    "tolerance": 0,
    "explain": "Without virtual inheritance each middle class contains its own Device. The output becomes `Device Printer Device Scanner Copier | ~Copier ~Scanner ~Device ~Printer ~Device`: Printer's Device, Printer, Scanner's Device, Scanner, Copier, then the reverse. Device is constructed 2 times."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Device {\n    string name;\npublic:\n    Device() : name(\"?\") {}\n    Device(const string& n) : name(n) {}\n    string get() const { return name; }\n};\n\nclass Scanner : public virtual Device {\npublic:\n    Scanner(const string& n) : Device(n) {}\n};\n\nclass Printer : public virtual Device {\npublic:\n    Printer(const string& n) : Device(n) {}\n};\n\nclass Copier : public Printer, public Scanner {\npublic:\n    Copier(const string& n) : Printer(n + \"-P\"), Scanner(n + \"-S\") {}\n};\n\nint main() {\n    Copier c(\"lab\");\n    Scanner s(\"desk\");\n    cout << c.get() << \" \" << s.get() << endl;\n    return 0;\n}",
    "options": [
      "`? desk`",
      "`lab-P desk`",
      "`lab-S desk`",
      "`lab desk`"
    ],
    "answer": 0,
    "explain": "Device is a virtual base, so the most derived class, Copier, is responsible for constructing it. Copier's list names only Printer and Scanner, so the compiler inserts `Device()` and the name is `?`; the `Device(n)` calls written in Printer and Scanner are ignored when they run as part of a Copier. `Scanner s(\"desk\")` is constructed directly, so there Scanner is the most derived class and its `Device(n)` runs: `desk`."
  },
  {
    "q": "Fix Copier so `c.get()` returns `lab`: name the base the most derived class must construct.",
    "type": "fill",
    "code": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Device {\n    string name;\npublic:\n    Device() : name(\"?\") {}\n    Device(const string& n) : name(n) {}\n    string get() const { return name; }\n};\n\nclass Scanner : public virtual Device {\npublic:\n    Scanner(const string& n) : Device(n) {}\n};\n\nclass Printer : public virtual Device {\npublic:\n    Printer(const string& n) : Device(n) {}\n};\n\nclass Copier : public Printer, public Scanner {\npublic:\n    Copier(const string& n) : ___(n), Printer(n + \"-P\"), Scanner(n + \"-S\") {}\n};\n\nint main() {\n    Copier c(\"lab\");\n    Scanner s(\"desk\");\n    cout << c.get() << \" \" << s.get() << endl;\n    return 0;\n}",
    "answer": [
      "Device"
    ],
    "explain": "`: Device(n), Printer(n + \"-P\"), Scanner(n + \"-S\")`. The most derived class calls the shared virtual base's constructor directly, even though Device is not a direct base. Now the output is `lab desk`."
  },
  {
    "q": "What does this print? (Dad does not override `hello`.)",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Grand {\npublic:\n    virtual ~Grand() = default;\n    virtual void hello() const { cout << \"Grand\" << endl; }\n};\n\nclass Mom : public virtual Grand {\npublic:\n    void hello() const override { cout << \"Mom\" << endl; }\n};\n\nclass Dad : public virtual Grand { };\n\nclass Kid : public Mom, public Dad { };\n\nint main() {\n    Kid k;\n    Grand& g = k;\n    g.hello();\n    k.hello();\n    return 0;\n}",
    "options": [
      "`Mom`\n`Mom`",
      "`Grand`\n`Mom`",
      "`Grand`\n`Grand`",
      "a compile error: `hello` is ambiguous"
    ],
    "answer": 0,
    "explain": "There is one shared Grand. Mom overrides `hello`; Dad only inherits Grand's. Mom's version is more derived than Grand's on every path, so it is the unique final overrider and wins (dominance): `g.hello()` through the Grand reference dispatches to Mom, and `k.hello()` finds Mom's too. It would be ambiguous only if Dad also overrode `hello`, which is the diamondmethods case without child's override."
  }
]
```

```challenge
{"prompt": "Device is a virtual base of Scanner and Printer. Write the <code>Copier</code> constructor <code>Copier(const string&amp; n, int d, int p)</code> so that Device is constructed once with the name, and Scanner and Printer get their numbers. The default <code>Device()</code> must not run.", "starter": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Device {\nprotected:\n    string name;\npublic:\n    Device() : name(\"unnamed\") { cout << \"Device()\" << endl; }\n    Device(const string& n) : name(n) { cout << \"Device(\" << n << \")\" << endl; }\n    virtual ~Device() = default;\n};\n\nclass Scanner : public virtual Device {\nprotected:\n    int dpi;\npublic:\n    Scanner(int d) : dpi(d) { cout << \"Scanner(\" << d << \")\" << endl; }\n};\n\nclass Printer : public virtual Device {\nprotected:\n    int ppm;\npublic:\n    Printer(int p) : ppm(p) { cout << \"Printer(\" << p << \")\" << endl; }\n};\n\nclass Copier : public Scanner, public Printer {\npublic:\n    // write Copier(const string& n, int d, int p) here\n    void info() const { cout << name << \": \" << dpi << \" dpi, \" << ppm << \" ppm\" << endl; }\n};\n\nint main() {\n    Copier c(\"office\", 600, 30);\n    c.info();\n    return 0;\n}\n", "expected": "Device(office)\nScanner(600)\nPrinter(30)\noffice: 600 dpi, 30 ppm", "hints": ["Without Device in Copier's list, the output starts <code>Device()</code> and the name is <code>unnamed</code>.", "The most derived class names the virtual base itself: <code>: Device(n), Scanner(d), Printer(p)</code>"], "solution": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Device {\nprotected:\n    string name;\npublic:\n    Device() : name(\"unnamed\") { cout << \"Device()\" << endl; }\n    Device(const string& n) : name(n) { cout << \"Device(\" << n << \")\" << endl; }\n    virtual ~Device() = default;\n};\n\nclass Scanner : public virtual Device {\nprotected:\n    int dpi;\npublic:\n    Scanner(int d) : dpi(d) { cout << \"Scanner(\" << d << \")\" << endl; }\n};\n\nclass Printer : public virtual Device {\nprotected:\n    int ppm;\npublic:\n    Printer(int p) : ppm(p) { cout << \"Printer(\" << p << \")\" << endl; }\n};\n\nclass Copier : public Scanner, public Printer {\npublic:\n    Copier(const string& n, int d, int p) : Device(n), Scanner(d), Printer(p) {}\n    void info() const { cout << name << \": \" << dpi << \" dpi, \" << ppm << \" ppm\" << endl; }\n};\n\nint main() {\n    Copier c(\"office\", 600, 30);\n    c.info();\n    return 0;\n}\n"}
```
```quiz
[
  {
    "q": "In oop_multi1 (no virtual bases) `math_student bob(...)` prints `person 1-param constructor`...",
    "options": ["once", "twice", "three times", "never"],
    "answer": 1,
    "explain": "student and mathematician each contain their own person; each constructor calls person(name). Two grandparents."
  },
  {
    "q": "Why is `person::all_info()` an error inside math_student::all_info in oop_multi1?",
    "options": ["all_info is private", "There are two person grandparents, so the compiler cannot tell which person's function is meant", "person is abstract", "It must be called through a pointer"],
    "answer": 1,
    "explain": "Without virtual inheritance any direct use of the person part of a math_student is ambiguous."
  },
  {
    "type": "fill",
    "q": "Make person a virtual base of student.",
    "code": "class student : public ___ person",
    "answer": ["virtual"],
    "explain": "public virtual person (or virtual public person): both middle classes must say it for the diamond to share one person."
  },
  {
    "q": "In oop_multi2 both bases are virtual and both middle constructors write `: person(name)`. The output shows `person default constructor` and empty names. Why?",
    "options": ["Virtual bases cannot have constructors", "The person(name) calls in student and mathematician are disabled when they are constructed as part of a more derived class; math_student did not call person, so the compiler inserted person()", "The string was moved", "The name is private"],
    "answer": 1,
    "explain": "With a virtual base it is the most derived class that constructs the shared base. Nobody passed the name, so the default constructor ran and name stayed empty."
  },
  {
    "q": "Which initializer list gives bob one person with the name set, in oop_multi3?",
    "options": ["`: student(name, passed), mathematician(name, proved)`", "`: person(name), student(passed), mathematician(proved)`", "`: student(passed), mathematician(proved)`", "`: person(name)` only"],
    "answer": 1,
    "explain": "The most derived class calls the shared base's constructor directly, even though person is not a direct base, and gives each middle class only what it owns."
  },
  {
    "q": "In oop_multi3 a student is instantiated directly with `student s(\"Jeff\", \"Algebra\");`. Does `person(name)` run?",
    "type": "tf",
    "answer": true,
    "explain": "Student can call person's constructor when it is directly instantiated; it is only when student is constructed through math_student that its person call is ignored."
  },
  {
    "q": "What does diamond.cpp print for `D d;` with `B : virtual public A` and `C : public virtual A`?",
    "options": ["A B C D allocated, then D C B A deallocated", "A B A C D allocated, then D C A B A deallocated", "B C A D allocated", "D C B A allocated"],
    "answer": 0,
    "explain": "One shared A is constructed first, then B and C in the order listed, then D; destruction is the exact reverse. Without virtual there are two A's: A B A C D allocated."
  },
  {
    "q": "Virtual base classes exist to...",
    "options": ["make a class abstract", "store the members of a common base class only once when two paths inherit it", "speed up construction", "allow a class to have two parents"],
    "answer": 1,
    "explain": "The slide: virtual base classes permit us to store members in common base super-classes only once. Two parents are allowed without virtual; virtual fixes the duplicate grandparent."
  },
  {
    "q": "`grandparent &gp = a;` where a is a child whose father, mother (virtual bases) and child all override virtual `foo()`. `gp.foo()` prints...",
    "options": ["grandparent.foo", "father.foo", "mother.foo", "child.foo"],
    "answer": 3,
    "explain": "Dynamic dispatch reaches the most derived override. Without child::foo the call would be ambiguous between father and mother."
  }
]
```

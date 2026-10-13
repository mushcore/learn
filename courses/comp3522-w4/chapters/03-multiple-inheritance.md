---
title: Multiple inheritance and ambiguity
minutes: 18
---

Java allows one superclass. A C++ class may derive from several bases at once, and the members of the derived class are the union of all base class members. The slides' warning comes in the same breath: there can be ambiguities.

## Two parents, a V; many parents, a bouquet

```cpp
class A { public: int x; void function1(); };
class B { public: int y; void function2(); };
class C : public A, public B { };     // C inherits x, y, function1, function2
```

With two parents the hierarchy looks like a V; with many, a bouquet. As long as every name is different, `C` simply has all four members and there are no conflicts.

The person/student example that runs through this deck shows the syntax for passing arguments to each base, and a Week 4 sample shows a shortcut for the common case where the derived constructor only forwards:

```cpp run pin inherit_constructor.cpp
// predict: Write the two lines printed.
#include <iostream>
#include <string>

class person
{
  public:
    person() = default;
    person(const std::string& name) : name(name) {}

    void set_name(const std::string& n) { name = n; }
    std::string get_name() const { return name; }
    void all_info() const { std::cout << "[person name=" << name << "]" << std::endl; }

  private:
    std::string name;
};

class student : public person
{
    using person::person;
    // equivalent to writing:
    //   student() = default;
    //   student(const std::string& name) : person(name) {}
};

int main ()
{
    person serena("Serena Chacha");
    serena.all_info();

    student bill("Bill Gates");
    bill.all_info();

    return 0 ;
}
```

`using person::person;` **inherits the constructors** of person into student, so `student bill("Bill Gates");` works without student writing a constructor of its own. `person() = default;` asks the compiler for the default constructor explicitly, which is needed once `person(const std::string& name)` exists (Week 3's rule).

## When both parents have the same name

```cpp run pin oop_multi0.cpp
// predict: Write the two lines printed. Then uncomment bob.all_info() and read the error.
#include <iostream>
#include <string>
using namespace std;

class student
{
  public:
    student(const string& name, const string& passed) : name(name), passed(passed) {}
    virtual void all_info() const {
        cout << "[student]  My name is " << name << endl;
        cout << "I passed the following classes: " << passed << endl;
    }
  private:
    string name, passed;
};

class mathematician
{
  public:
    mathematician(const string& name, const string& proved) : name(name), proved(proved) {}
    virtual void all_info() const {
        cout << "[mathematician]  My name is " << name << endl;
        cout << "I proved: " << proved << endl;
    }
  private:
    string name, proved;
};

class math_student : public student, public mathematician
{
  public:
    math_student(const string& name, const string& passed, const string& proved)
      : student(name, passed), mathematician(name, proved) {}
};

int main ()
{
    math_student bob("Robert Robson", "Algebra", "Fermat's Last Theorem");
    //bob.all_info(); //ambiguous function call
    bob.mathematician::all_info();

    return 0 ;
}
```

`class math_student : public student, public mathematician` lists both bases after the colon, and the constructor's list `: student(name, passed), mathematician(name, proved)` passes each base its arguments (the name goes to both, so bob stores it twice). Both bases define `all_info`, and math_student inherits one from each with no priority for either: the slide says `all_info` is not defined in math_student and is **ambiguously inherited**. `//bob.all_info(); //ambiguous function call` is the compile error. The way around ambiguity is scoping: `bob.mathematician::all_info();` names the base explicitly, exactly as `c.B::x` and `c.B::function1()` do on the slide when A and B both declare `x` and `function1`.

A cleaner fix is to override `all_info` in math_student and call both base versions from it; that is what oop_multi1 does in the next lesson, and it leads straight into the diamond.

:::quiz Ambiguity is a compile-time error, not a runtime choice
The compiler never picks one base for you. With no qualifier it refuses; with `student::` or `mathematician::` it complies; with an override in the most derived class the call is unambiguous again.
:::

## Build a `SmartPhone` from two bases and resolve its clashes

Three new two-parent classes: a smartphone whose bases both have an `id`, an amphibious car, and a clock radio whose bases both have `status()`.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Phone {\npublic:\n    int id;\n    Phone(int number) : id(number) { cout << \"Phone \"; }\n};\n\nclass Camera {\npublic:\n    int id;\n    Camera(int megapixels) : id(megapixels) { cout << \"Camera \"; }\n};\n\nclass SmartPhone : public Phone, public Camera {\npublic:\n    SmartPhone() : Phone(604), Camera(48) { cout << \"SmartPhone \"; }\n};\n\nint main() {\n    SmartPhone s;\n    cout << s.Camera::id << \" \" << s.Phone::id << endl;\n    return 0;\n}",
    "options": [
      "`Phone Camera SmartPhone 48 604`",
      "`Camera Phone SmartPhone 48 604`",
      "`SmartPhone Phone Camera 604 48`",
      "a compile error: `id` is ambiguous"
    ],
    "answer": 0,
    "explain": "Bases are constructed in the order they are listed after the colon, `public Phone, public Camera`, then the derived body: `Phone Camera SmartPhone`. Both bases have an `id`, which would be ambiguous unqualified, but `s.Camera::id` is 48 and `s.Phone::id` is 604, so the scoped reads compile and print `48 604`."
  },
  {
    "q": "The same classes, with main changed to read the id without a qualifier. Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Phone {\npublic:\n    int id;\n    Phone(int number) : id(number) { cout << \"Phone \"; }\n};\n\nclass Camera {\npublic:\n    int id;\n    Camera(int megapixels) : id(megapixels) { cout << \"Camera \"; }\n};\n\nclass SmartPhone : public Phone, public Camera {\npublic:\n    SmartPhone() : Phone(604), Camera(48) { cout << \"SmartPhone \"; }\n};\n\nint main() {\n    SmartPhone s;\n    cout << s.id << endl;\n    return 0;\n}",
    "answer": [
      23
    ],
    "explain": "SmartPhone inherits two members named `id`, one from each base, with no priority for either. `s.id` is a compile error: request for member 'id' is ambiguous. Qualify it as `s.Phone::id` or `s.Camera::id`."
  },
  {
    "q": "Complete the initializer list so each base gets its own argument (base names, in the order listed).",
    "type": "fill",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Car {\npublic:\n    int wheels;\n    Car(int w) : wheels(w) {}\n};\n\nclass Boat {\npublic:\n    int props;\n    Boat(int p) : props(p) {}\n};\n\nclass Amphibian : public Car, public Boat {\npublic:\n    Amphibian(int w, int p) : ___(w), ___(p) {}\n};\n\nint main() {\n    Amphibian a(6, 2);\n    cout << a.wheels << \" wheels, \" << a.props << \" props\" << endl;\n    return 0;\n}",
    "answer": [
      "Car",
      "Boat"
    ],
    "explain": "Each base is initialized by its class name in the derived constructor's list: `: Car(w), Boat(p)`. Neither base has a default constructor, so leaving either out is a compile error. `Amphibian a(6, 2)` stores 6 wheels and 2 props."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Radio {\npublic:\n    void status() const { cout << \"FM 101.1\"; }\n};\n\nclass Clock {\npublic:\n    void status() const { cout << \"07:30\"; }\n};\n\nclass ClockRadio : public Radio, public Clock {\npublic:\n    void status() const {\n        Clock::status();\n        cout << \", \";\n        Radio::status();\n        cout << endl;\n    }\n};\n\nint main() {\n    ClockRadio cr;\n    cr.status();\n    cr.Radio::status();\n    cout << endl;\n    return 0;\n}",
    "options": [
      "`07:30, FM 101.1`\n`FM 101.1`",
      "`FM 101.1, 07:30`\n`FM 101.1`",
      "`07:30, FM 101.1`\n`07:30`",
      "a compile error: `status` is ambiguous"
    ],
    "answer": 0,
    "explain": "ClockRadio declares its own `status()`, which hides both inherited ones, so `cr.status()` is not ambiguous. Its body calls Clock's first (`07:30`), then `, `, then Radio's (`FM 101.1`) and ends the line. `cr.Radio::status()` names the Radio version explicitly and prints `FM 101.1`, followed by main's endl."
  }
]
```

```challenge
{"prompt": "Write <code>TeachingAssistant</code>, derived publicly from both <code>Student</code> and <code>Employee</code>. Its constructor takes the program and the hours and passes each to its base. Both bases define <code>describe()</code>, so give TeachingAssistant its own <code>describe()</code> that calls Student's version, then Employee's.", "starter": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\n    string program;\npublic:\n    Student(const string& p) : program(p) {}\n    void describe() const { cout << \"studies \" << program << endl; }\n};\n\nclass Employee {\n    int hours;\npublic:\n    Employee(int h) : hours(h) {}\n    void describe() const { cout << \"works \" << hours << \" h\" << endl; }\n};\n\n// write TeachingAssistant here\n\nint main() {\n    TeachingAssistant ta(\"CST\", 10);\n    ta.describe();\n    return 0;\n}\n", "expected": "studies CST\nworks 10 h", "hints": ["<code>class TeachingAssistant : public Student, public Employee</code>", "<code>TeachingAssistant(const string&amp; p, int h) : Student(p), Employee(h) {}</code>", "Inside describe: <code>Student::describe(); Employee::describe();</code>"], "solution": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\n    string program;\npublic:\n    Student(const string& p) : program(p) {}\n    void describe() const { cout << \"studies \" << program << endl; }\n};\n\nclass Employee {\n    int hours;\npublic:\n    Employee(int h) : hours(h) {}\n    void describe() const { cout << \"works \" << hours << \" h\" << endl; }\n};\n\nclass TeachingAssistant : public Student, public Employee {\npublic:\n    TeachingAssistant(const string& p, int h) : Student(p), Employee(h) {}\n    void describe() const {\n        Student::describe();\n        Employee::describe();\n    }\n};\n\nint main() {\n    TeachingAssistant ta(\"CST\", 10);\n    ta.describe();\n    return 0;\n}\n"}
```
```quiz
[
  {
    "q": "How many base classes may a C++ class have?",
    "options": ["exactly one, like Java", "at most two", "any number: a derived class can have more than one base class", "one plus any number of interfaces"],
    "answer": 2,
    "explain": "Two parents make a V, many make a bouquet. The members of the derived class are the union of all base class members."
  },
  {
    "q": "`class C : public A, public B { };` where A has `int x` and B has `int y`. What does C contain?",
    "options": ["only x", "only y", "both x and y and every function of A and B", "nothing until C declares members"],
    "answer": 2,
    "explain": "The union of the bases' public and protected members. No conflict when all the names differ."
  },
  {
    "q": "A and B both declare `int x` and `void function1()`. In `class C : public A, public B`, `c.x` is...",
    "options": ["A's x, because A is listed first", "B's x", "ambiguous: a compile error unless qualified as `c.A::x` or `c.B::x`", "the sum of both"],
    "answer": 2,
    "explain": "C can't access x and function1 directly: ambiguous. Scoping with the base name resolves it."
  },
  {
    "type": "fill",
    "q": "Complete the call so it compiles: bob is a math_student and both bases define all_info.",
    "code": "bob.___all_info();",
    "answer": ["mathematician::", "student::"],
    "explain": "Qualify with the base class name and the scope operator to pick one of the two ambiguously inherited functions. The shipped program uses mathematician::."
  },
  {
    "q": "What does `using person::person;` inside `class student : public person` do?",
    "options": ["Makes person a friend", "Inherits person's constructors so `student bill(\"Bill Gates\")` compiles without student writing one", "Renames the class", "Calls person's constructor twice"],
    "answer": 1,
    "explain": "The shipped comment: equivalent to writing student() = default; and student(const string& name) : person(name) {}."
  },
  {
    "q": "In `math_student(name, passed, proved) : student(name, passed), mathematician(name, proved) {}` the name is passed to both bases. How many copies of the name does a math_student hold?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "student and mathematician each have their own private name member in oop_multi0; the diamond lesson shows what happens when the shared name is pushed up into a common base."
  },
  {
    "q": "`bob.all_info()` with two inherited definitions and no override in math_student...",
    "options": ["calls both", "calls the first base's version", "is a compile error: ambiguous function call", "prints nothing"],
    "answer": 2,
    "explain": "There is no priority for one or the other. Qualify the call or override all_info in math_student."
  }
]
```

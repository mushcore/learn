# COMP 3522 Week 5 — facts, programs and outputs transcribed from the instructor's material

Source files: `D:\BCIT\COMP3522\Lectures\Week 5\3522 Week 5.pdf` (99 slides; agenda: 1. Exceptions, 2. Design principles, 3. Coupling and cohesion; a second agenda on slide 51: 1. SOLID design principles, 2. Law of Demeter), and the sample repo `comp-3522-fall-2026-course-sample-code-mushcore-main\Week5\`: `exception/exception.cpp`, `exception2/exception2.cpp`, `exception3/exception3.cpp`, `exception4/exception6.cpp`, `exception5/exception8.cpp` (folder names and file names differ; the slides cite them as exception.cpp, exception2.cpp, exception3.cpp, exception4.cpp, exception5.cpp). Every program was compiled with g++ -std=c++20 -Wall -Wextra -pedantic (GCC 13.1.0, mingw) and its output recorded. No Lab 5 PDF exists in `D:\BCIT\COMP3522\Labs\`. Links on the slides: none in the exceptions part; design part cites Robert C. Martin ("Uncle Bob") and shows a World of Warcraft character screen (slide 90). Slide numbers below are PDF page numbers.

## Exceptions: why (slides 3–11)
- Slide 4, typical error situations: implementing a class or function incorrectly; failing to meet the specification; making an inappropriate object request (invalid index); generating an inconsistent or inappropriate object state (arising through class extension).
- Slide 5, "Not ALWAYS Programmer Error*" (footnote: "*but it usually is"): errors often arise from the environment: incorrect URL entered, network interruption. File processing is particularly error-prone: missing files, lack of appropriate permissions.
- Slide 6, typical Java exceptions "we've seen": NullPointerException (an application attempts to use an object reference that is set to null); ArrayIndexOutOfBoundsException (an index is out of range); ClassCastException (code attempted to cast an object to a subclass of which it is not an instance); ConcurrentModificationException (concurrent modification of an object when such modification is not permissible).
- Slide 7, two principle approaches in C++: **1. Assertions are for detecting programming errors. 2. Exceptions for situations that prevent proper continuation of the program (errors that cannot be handled locally).**
- Slide 8, assertions: the macro `assert` from header `<cassert>` is inherited from C; evaluates an expression, **immediately terminates the program if false**; easy to turn off by defining `NDEBUG` **before** including `<cassert>`: `#define NDEBUG // Turns off assertions` then `#include <cassert>`.
- Slide 9, assertion example (exactly):
  ```cpp
  #include <cassert>
  // Compute square root of non-negative number
  double square_root(double x)
  {
    check_somehow(x >= 0);
    … // Perform our calculation
    assert(result >= 0.0); // Should be positive
    return result;
  }
  ```
  `check_somehow` is a placeholder for the precondition check (an exception, see below); the assert checks the postcondition.
- Slide 10, C error codes: "In C, programmers used to return error codes (like main still does)":
  ```cpp
  int read_matrix_file(const char* fname)
  {
      fstream f(fname);
      if (!f.is_open()) { return 1; } //return 1 means error
      ...
      return 0; //return 0 means success
  }
  ```
  "Problem # 1: we can ignore the error code."
- Slide 11, more problems: 1. we can't return our computational results; 2. we have to return a success/error code; 3. we are forced to pass references/pointers as arguments; 4. this can prevent us from building expressions with the results.

## Exceptions: throw and catch (slides 12–15)
- Slide 12, "Enter the exception" (slide typo `cont char*`): `if (!f.is_open()) { throw "Can't open file"; }`.
- Slide 13, C++ lets us throw anything as an exception: 1. strings, 2. numbers, 3. user types, 4. exceptions from the standard library. "It is best, however, to define exception types or use exceptions from the standard library."
- Slide 14, refined example: `struct cannot_open_file { ... };` and `if (!f.is_open()) {throw cannot_open_file(); }`.
- Slide 15, reacting: "We must catch exceptions (just like Java)"; a try-catch block: `try { ... //code that throws exception } catch (e1_type1& e1) { //handle the exception }`.

## Exceptions: the six guidelines (slides 16–22)
1. (17) **Catch exceptions by reference**: captures exceptions that are derived from the reference type.
2. (17) When an exception is thrown, **the first catch-block with a matching type is executed**: `catch (e1_type1& e1) {…} catch (e1_type2& e2) {…}`.
3. (18) **Further catch-blocks of the same type or child-types are ignored**: `catch (e1_type1& e1) {} //catches e1_type1` then `catch (e1_type1& e2) {} //IGNORED - same type as previous`. (19) `catch (child_type& e1) {} //order matters. Child type first` then `catch (parent_type& e2) {} //sub type exception caught here`.
4. (20) **A catch-block with an ellipsis, i.e., three dots, catches all exceptions**: "Obviously this should be the last one": `catch (...) { // This catches EVERYTHING }`.
5. (21) "If nothing else, consider capturing the exception, providing an informative error message, and terminating the program": `catch (cannot_open_file& e) { cerr << "FILE NOT FOUND. TERMINATING...\n"; exit(EXIT_FAILURE); // <cstdlib> }`.
6. (22) "Alternatively, we can continue after the error message or after implementing some sort of rescue, by rethrowing the exception": `catch (cannot_open_file& e) { cerr << "FILE NOT FOUND.\n"; ... throw; // Rethrows cannot_open_file exception }` (bare `throw;`).

Verified behaviour (`$S\build\ex_catch_order.cpp`, outputs exact):
- child handler listed first → `A: child handler: child`.
- parent handler listed first → the parent handler runs for a thrown child; by reference `what()` is still the child's: `B: parent handler, but what() is still: child`. g++ warns "exception of type 'child_type' will be caught by earlier handler [-Wexceptions]".
- `catch (parent_type e)` **by value slices**: `C: caught by value, what() is now: parent` (g++: "catching polymorphic type 'struct parent_type' by value [-Wcatch-value=]").
- `throw 42;` with `catch (exception&)` then `catch (...)` → `D: catch-all`.

Verified stack unwinding (`ex_unwind.cpp`): three nested functions each with a local `Guard`; level3 throws `runtime_error("boom")`, level2 catches by reference and rethrows with bare `throw;`, level1 has no handler, main catches `exception&`. Output: `g1 constructed / g2 constructed / g3 constructed / level3 throws / g3 destroyed / level2 caught: boom, rethrowing / g2 destroyed / g1 destroyed / main caught: boom / main continues`. Destructors of locals run as each frame is left; a frame without a matching handler is passed straight through.

## noexcept (slides 23–24)
- C++03 allowed us to specify which types of exceptions can be thrown from a function (like Java); "was very quickly deprecated (don't do this)". C++11 added a new qualification for specifying that **no exceptions must be thrown out of a function**: `double square_root(double x) noexcept { ... }`.
- Benefits: 1. calling code never needs to check for thrown exceptions from square_root; 2. **if an exception is somehow thrown despite the qualification, the program ends** (which is what should happen).
- **Destructors are implicitly declared noexcept**: 1. NEVER throw an exception from a destructor; 2. if you do, it will be treated as a run-time error and execution will end!
- Verified (`ex_noexcept.cpp`): a noexcept function that throws inside a try block in main: prints `calling square_root(-1)`, then stderr `terminate called after throwing an instance of 'std::invalid_argument'` / `  what():  negative`, exit code 3; the catch(...) in main never runs. g++ warns "'throw' will always call 'terminate' [-Wterminate]".

## Standard exceptions (slides 25–29)
- Slide 25: `<exception>` header; `std::exception` is a base class designed to be derived; all exceptions thrown by members of the standard library are derived from this class; contains a **virtual member function called `what`** that returns a null-terminated char sequence (`char *`). Override it to deliver a meaningful message:
  ```cpp
  struct myexception: public exception {
     const char* what() const noexcept override
     { return "My exception happened"; }
  }
  ```
  Slide cites exception.cpp, exception2.cpp.
- Slide 26, derived from std::exception (table): `bad_alloc` thrown by new on allocation failure; `bad_cast` thrown by dynamic_cast when it fails in a dynamic cast; `bad_function_call` thrown on a bad call; `bad_typeid` thrown by typeid; `logic_error` thrown when a logic error occurs; `bad_weak_ptr` thrown by shared_ptr when passed a bad weak_ptr.
- Slide 27, "These exceptions are actually useful": `<stdexcept>` defines two exception types that can be inherited by custom exceptions to report errors: 1. `logic_error`: 1. `invalid_argument`, 2. `length_error` (`//exception3.cpp`), 3. `out_of_range`; 2. `runtime_error`: 1. `range_error`, 2. `overflow_error`. (The standard also has `domain_error` under logic_error and `underflow_error` under runtime_error; not on the slide.)
- Slide 28, `std::invalid_argument` example (`//exception4.cpp`): class Name with `std::string first;` and `Name(std::string first) : first(first) { if (first.length() == 0) { throw std::invalid_argument("No first name!"); }...`.
- Slide 29, "What if we don't catch an exception?": if an exception is not caught by any catch statement because there is no catch statement with a matching type, the special function **`terminate`** will be called; `std::terminate` is in `<exception>`; calls the termination handler; the termination handler calls `abort`; "CRASH AND BURN" (`//exception5.cpp`).

## Sample programs (full source, real output)

### exception.cpp (`Week5/exception/exception.cpp`)
```cpp
// using standard exceptions
#include <iostream>
#include <exception>
using namespace std;

class myexception: public exception
{
public:
 const char* what() const noexcept
  {
    return "My exception happened";
  }
};

int main () {
  try
  {
    throw myexception();
  }
  catch (exception& e)
  {
    cout << e.what() << '\n';
  }
  return 0;
}
```
Output: `My exception happened`. (Caught through the base-class reference; `what()` is virtual so the override runs. The shipped `what()` has no `override` keyword; adding it is fine.)

### exception2.cpp (`Week5/exception2/exception2.cpp`)
```cpp
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
Output as shipped: `message error`. With `throw myexception();` instead: `myexception caught` / `C++ Exception`. With `throw A{};`: `random class error` (A is not derived from std::exception, so only `catch (A&)` matches). A string literal is a `const char*`, not a `std::string`: `catch (string&)` would NOT catch it. (Verified: `ex_exception2_variants.cpp`.)

### exception3.cpp (`Week5/exception3/exception3.cpp`)
```cpp
#include <string>
#include <exception>
#include <iostream>

int main()
{
	try
	{
		//trying to start copying from index 10. Doesn't exist
    	std::string("abc").substr(10); // throws std::length_error
	}
	catch(const std::exception& e)
	{
    	std::cout << e.what() << '\n';
    	//throw;   // rethrows the exception object of type std::length_error
	}
}
```
Output: `basic_string::substr: __pos (which is 10) > this->size() (which is 3)`. Note: the comment says length_error; libstdc++ actually throws **`std::out_of_range`** here (pos > size); both derive from `logic_error`, and the catch is on `std::exception`, so the program behaves the same. Teach the slide's claim as "the slide says length_error", mention the real type as a footnote only. Compiles with a `-Wunused-result` warning (substr is nodiscard).

### exception4.cpp (shipped as `Week5/exception4/exception6.cpp`)
```cpp
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
Output: `No first name!`. With `Name{"Jeff"};` nothing prints. A constructor that throws means **no object is created** (there is nothing to destroy; the destructor does not run for a half-built object, but fully constructed members and bases are destroyed).

### exception5.cpp (shipped as `Week5/exception5/exception8.cpp`)
```cpp
#include <iostream>
#include <string>
/*
 * Try catch for classes
 */
using namespace std;

class A
{
public:
	A() { cout << "A() created\n"; }
	~A() { cout << "A() destroyed\n"; }

};

class B
{
public:
	B() { cout << "B() created\n"; }
	B(int) { cout << "B() being created\n"; throw "exception"; }
	~B() { cout << "B() destroyed\n"; }

};

class C : public A
{
private:
	B my_b;
public:
	C(int x) try : A(), my_b(x) //can try/catch on the constructor
	{
		cout << "C() created\n";
	}
	catch ( ... )
	{
		cout << "C not constructed!\n";
					throw;
	}

	~C() { cout << "C() destroyed\n"; }
};

int main()
{
	cout << "Making a B\n";
	B b;

	cout << "Making a C\n";
	C c(1); //throws error that's not caught
    //program terminates here
	cout << "Code not called because throw not caught" << endl;
	return 0;
}
```
Output (stdout), then the process terminates with exit code 3 (std::terminate → abort; nothing on stderr on this mingw build):
```
Making a B
B() created
Making a C
A() created
B() being created
A() destroyed
C not constructed!
```
Facts to teach from it: a **function-try-block on a constructor** (`C(int x) try : A(), my_b(x) { … } catch (...) { … }`) can observe an exception thrown by a base or member initializer; the already-constructed base `A` is destroyed before the handler runs (`A() destroyed` precedes `C not constructed!`); `B() destroyed` never prints because `B(int)` threw before `my_b` existed; a constructor's function-try-block handler **always rethrows** (even without the explicit `throw;` the exception continues), so main's `C c(1);` propagates an uncaught `const char*` and the program terminates: `Code not called because throw not caught` never prints, and `b`'s destructor (`B() destroyed`) never runs either because terminate skips unwinding.

### Extra verified programs written for the lessons (`$S\build\`)
- `ex_assert.cpp`: `assert(x == 5)` passes (`first assert passed`), `assert(x > 10)` aborts with stderr `Assertion failed: x > 10, file ex_assert.cpp, line 10`, exit code 3, `not reached` never prints. `ex_assert_ndebug.cpp` with `#define NDEBUG` before `#include <cassert>`: both asserts vanish, prints `first assert passed` / `reached: asserts are off`.
- `ex_catch_order.cpp`, `ex_unwind.cpp`, `ex_noexcept.cpp`, `ex_exception2_variants.cpp`: see above.

## Design principles (slides 30–34)
- Slide 31: "You've heard of design patterns...": design patterns tell us how to design systems (later this term); **design principles provide high level guidelines to help structure components and manage their interactions**: message passing, communication.
- Slide 32, the big questions: 1. How do we assemble classes? 2. We know how to implement each class, but how should they interact? How deeply should a class reach into another class, for example? 3. How do we implement relationships between classes? "Good software architecture begins with clean code. If the bricks aren't well made, the architecture of the building doesn't mean much."
- Slide 33, criteria: we want code that behaves correctly and **tolerates change** ("aka it's soft aka it's easy to change"). "When stakeholders change a feature, the difficulty in making a change should be proportional only to the scope of the change, not its shape." "There's no such thing as a system that is impossible to change, but there are systems that are practically impossible to change, i.e., cost of change > benefit of change."
- Slide 34: two important concepts for assessing the quality of code: 1. **Coupling** 2. **Cohesion**.

## Coupling and cohesion (slides 35–42)
- Slide 36, coupling: "refers to links between separate units of a program"; if two classes depend closely on many details of each other, we say they are **tightly coupled**; we aim for **loose coupling** between modules; a class diagram provides (limited) hints at the degree of coupling. Boxed: "**The strength of the connection between modules**".
- Slide 37, loose coupling makes it possible to: understand one class without reading others; change one class with little or no effect on other classes. Loose coupling increases maintainability.
- Slide 38, tight coupling is bad: changes to one class bring a cascade of changes to other classes; classes are harder to understand in isolation; flow of control between objects of different classes is complex; difficult to test classes in isolation.
- Slide 39, cohesion: "refers to the number and diversity of tasks that a single unit is responsible for"; if each unit is responsible for one single logical task, we say it has **high cohesion**; we aim for high cohesion inside modules; "'Unit' applies to functions, classes, and modules". Boxed: "**The glue that holds a module together**".
- Slide 40, high cohesion makes it easier to: 1. understand what a class or function does; 2. use descriptive and accurate names for variables, functions, and classes; 3. reuse classes and functions ("we love this!"). Figure: four modules each containing mixed shapes (circle = Save/load, triangle = Character creation, rectangle = Screens, square = Game state) with cross-links, captioned "Low cohesion and high coupling", versus four modules each holding one shape type with one link each, "High cohesion and low coupling".
- Slide 41, high cohesion examples. Class level: classes should represent one single, well-defined entity. Function level: a function should be responsible for one and only one well-defined task. We avoid loosely cohesive classes and functions: functions perform multiple tasks (#BAD); classes have no clear identity (#BAD).
- Slide 42 (image only): "Design Principle – Coupling and Cohesion. Examples of Coupling and Cohesion": left, four boxes joined by many arrows, "High Coupling, Low Cohesion"; right, four boxes each with a single arrow to the next, "Low Coupling, High Cohesion". Green box: "Which one is better from a software design point of view and why?" (no printed answer; the answer is the right one, for the slide 37/40 reasons).

## Coupling and cohesion examples (slides 43–50)
- Slide 44, dependencies: when one entity depends on another entity; "If entity A uses entity B, then A is said to be dependent on B"; an entity could be a library, class, or sub-system of related code. Example: simulating a sushi restaurant, class Sushi would be dependent on class Rice and class Fish.
- Slide 45 (UML): Sushi (attributes rice, fish; operation dip(SoySauce)) with arrows to Rice (rice_type, vinegar_amt) and Fish (fish_type, is_raw). "If entity A is strongly dependent on entity B then any change in entity B would possibly require us to change entity A as well. This may not sound like much. Imagine if A and B were sub-systems or packages in a larger application. Now this is an issue."
- Slide 46: "If entity A is strongly dependent with entity B then entity A will not be able to function without entity B. **Tight coupling is a form of strong dependency.** The dependency is so tight, the system becomes more rigid and less flexible. We try to avoid tight coupling where possible."
- Slide 47, tight coupling: fish moved inside the Rice class (Sushi → Rice → Fish). "Say fish and rice are tightly coupled. This is bad because rice will always come with fish. We wouldn't be able to have other kinds of sushi without fish. (What about the Tamago!! :O) We don't want tight coupling like these. We want to **decouple our code** if possible so it can be flexible and polymorphic." Red note: "Notice how we moved fish into the rice class? BAD".
- Slide 48, decoupling sushi with inheritance: Sushi (fillings: vector, rice; dip(SoySauce)) → <<Abstract>> Filling (amount, is_raw) with Fish, Avocado, Cucumber deriving from it; Sushi still points to Rice. "**Inheritance and Interfaces/Abstract classes are the most common and effective way of decoupling code.** NOTE: We still have a dependency! Entities will always be dependent on each other, that's how OOP works. It's better to have **weak dependencies** like these."
- Slide 49, a more realistic example: UI (attribute textFile) → TextFile (read(), write(), search()). "Say we were developing an app with a UI that was populated with some data from a text file. After a few releases and years of development, for some reason we decide to switch out to a more secure source of data, perhaps an encrypted JSON file or even perhaps a SQLite Database. We would have to edit all the modules/classes that dealt with our app's UI!"
- Slide 50: UI (dataSource) → <<Interface>> DataSource (read(), write(), search()); implementations Text File (read, write, search), SQLite DB (connect, read, write, search), JSON File (read, write, search, serialize, deserialize). "We can decouple our system to instead depend on a data source which is an abstraction that hides different data sources. Our UI would just depend on a common interface DataSource and not be concerned with how that data source is implemented."
- Slide 52 recap: "We actually used at least 3 SOLID Design Principles here!" (the DataSource diagram again; the three are named later: Open/Closed, Liskov Substitution, Dependency Inversion).

## SOLID (slides 53–91)
- Slide 54: SOLID is "a set of guidelines to help us write maintainable, decoupled, flexible Object-Oriented Code. Created by Robert C. Martin, also known as Uncle Bob amongst developers. Highly respected and has a bunch of books on writing clean code."

### Single Responsibility Principle (55–63)
- Slides 56–60, a system where a user can write and create forum posts; UML User → Post, User → MyDatabase; code:
  ```cpp
  class User {
  ...
  User(string username, string password, string name, string email)
  {
      this->username = username;
      this->password = password;
      this->name = name;
      this->email = email;
      this->database = MyDatabase();
  }
  void post_to_forum(string message, string subject)
  {
      Post post = Post(subject, message, username);
      database.add_simple_post(post);
  }
  };
  ```
  "Why is this code bad? The User class is very coupled and dependent. It carries out many different roles and responsibilities. Changing any part of this system will probably cause a change in the User class as well." Built up over slides 57–59: User class has code to: be a user; create a database; post to a forum. Slide 60: "The User class should focus on only being a user."
- Slide 61, boxed quote: **"The Single Responsibility Principle requires that each class is responsible for only one thing."** "Ask yourself, are there multiple reasons to change my class? There should only be one reason to change your class. Each class should have one and only one responsibility."
- Slide 62, split Pt.1: User keeps only the four assignments (no database). UML: User, Post, PostWriter, MyDatabase.
- Slide 63, split Pt.2 (UML: PostWriter → User (dashed), PostWriter → Post (dashed), PostWriter → MyDatabase (solid), MyDatabase → Post (dashed)):
  ```cpp
  class PostWriter {
      MyDatabase* database;
      PostWriter(MyDatabase* database)
      {
          this->database = database;
      }
      void postToForum(User& user, string message, string subject)
      {
          Post post = Post(subject, message, user.username);
          database->addSimplePost(post);
      }
  };
  ```

### Open-Closed Principle (64–69)
- Slide 65: a GUI where each UI element is a UIWidget: `class UIWidget { string type; void draw() { if (type == "Button") //complicated button draw logic here  else //complicated draw logic for a generic UI box (Panel)`. "It works great initially, but eventually we want to add more widget types..."
- Slide 66: the if-chain grows (Button, Text Box, ScrollBar, Label, else panel). "This is terrible design! If we wanted to change the logic / algorithm behind drawing a button, we would need to edit this massive draw member function. An error or bug here would affect all the widgets on screen and crash our whole system!"
- Slide 67, boxed: **"The Open/Closed Principle states that software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification."** "Once a class is made, its behaviour shouldn't be modified to support special cases. It should be CLOSED for modification. Instead, we extend (or inherit) from the class and override behaviours. That is, it's OPEN for extension."
- Slides 68–69, "We use Inheritance (and overriding)!": `class UIWidget { virtual void draw() = 0; }` with `class UIButton : public UIWidget { void draw() override { //complicated draw code for buttons goes here } }`, UITextBox, UIScrollBar likewise; UML <interface> UIWidget +draw() with UITextBox, UIScrollBar, ..., UIButton. "We used abstraction to do this. The UIWidget class is now an interface, ensuring that each UI component that inherits from it has the same interface." "Now, any change to UIButton would not affect any other widget. Each widget class is modular and decoupled. It even follows the Single Responsibility Principle!"

### Liskov Substitution Principle (70–74)
- Slides 71–72, "Now how do we draw all these widgets?": `class Canvas { UIPanel* panel; UIScrollbar* scrollbar; UIButton* button; Canvas(UIPanel* panel, UIScrollbar* scrollbar, ..., Button* button) {…} void draw_screen(): panel->draw() scrollbar->draw() button->draw() ...`. "Would this be a good way of drawing all the widgets?" → "This would be terrible! Why inherit if you have to keep an explicit reference to each subtype?"
- Slide 73, boxed: **"The Liskov substitution principle states that if S is a subtype of T, then objects of type T may be replaced (or substituted) with objects of type S."** OR "Objects in a program should be replaceable in code with references of their base types without altering the correctness of that program." "Simply put, you should be able to refer to all the different child UI components as its base class, UIWidget."
- Slide 74: `class Canvas { vector<UIWidget*> widget_list; Canvas(vector <UIWidget*> widget_list): this->ui_widgets = widget_list  void draw_screen(): for (UIWidget *widget : ui_widgets) widget->draw()`. "Now we just have a vector filled with pointers to many derived UIWidgets (UIPanel, UIScrollBar, UIButton etc). Since they all have the same interface (draw function) they can be treated as if they were their base class (UIWidget). We don't care about the derived type. Let polymorphism determine the derived type at runtime."

### Interface Segregation Principle (75–80)
- Slide 76, modelling a zoo: `class Animal { virtual void breathe() { //common breathing code here } virtual void eat() { // common eating code here } virtual void walk() = 0; virtual void swim() = 0; virtual void fly() = 0; }`. "But this is terrible! Now our Human class needs to override the fly function. Our Fish can walk!"
- Slide 77, boxed: **"Many client-specific interfaces are better than one general-purpose interface."** OR "The interface segregation principle states that no client should be forced to depend on functions it does not use." "Put more simply: Do not have interfaces with too many unnecessary functions. Have multiple simpler interfaces with fewer functions instead." "**This is the Single Responsibility Principle for Interfaces/Abstractions!**"
- Slides 78–80, "Back to our zoo": extract code that all Animals share (`class Animal { virtual void breathe() {…} virtual void eat() {…} }`); extract optional functionality to separate interfaces (`class Walkable { virtual void walk() = 0; }; class Swimmable { virtual void swim() = 0; }; class Flyable { virtual void fly() = 0; };`); Human inherits only what it needs: `class Human : public Animal, public Walkable, public Swimmable { void walk() override {…} void swim() override {…} };`. "This may seem difficult to maintain, but in fact it isn't."

### Dependency Inversion Principle (81–91)
- Slide 82: DIP "can be thought as a combined effect of the previous principles. Specifically, the Open Closed Principle and Liskov Substitution Principle."
- Slide 83, high level and low level modules: UI (-textFile) → TextFile (+read() +write() +search()). "High Level Modules are the ones that contain complex logic made up of small 'chunks' of simpler code. For example, our UI class. A Low Level Module on the other hand, is a class that encapsulates some simple atomic behaviour. Such as writing and reading from a file, displaying an image, etc. We generally compose high level modules with low level modules. That is, high level modules are Coupled and Dependent on low level modules."
- Slide 84: "This is not very good design. We don't want this dependency. We want to be able to change or replace the lower level modules without tampering with the complex code in the higher level modules."
- Slide 85, "We inversed the dependencies!": UI → DataSource (retrieve(), update(), search(), delete()) ← TextFile (Extends, dashed). "We introduced an abstract layer, that does not depend on anything. We made both our high level (UI) and low level (TextFile) modules depend on the abstract instead. Now we can switch out either side, the UI and the text file could be replaced with something completely different."
- Slide 86: same with SQLiteDB, TextFile, JSONFile extending DataSource. "Everyone here has seen a diagram like this many times now. We can even see the building blocks that are Liskov Substitution and Open Closed Principles."
- Slide 87, rule 1: **"High-level modules should not depend on low-level modules."** (red cross on UI → Text File) / **"High-level modules and low-level modules should depend on abstractions."** (green check on UI → DataSource ← TextFile).
- Slide 88, rule 2: **"Abstractions should not depend on details. Details should depend on abstractions."**
- Slide 89: "In the example we just saw, the DataSource is our abstract class or interface, and the UI and TextFile classes are concrete classes. Interfaces and Abstract classes: declare an interface; can NOT be instantiated. Concrete classes: contain the code that implements the details of the interface (TextFile); are fully implemented classes (UI, TextFile); CAN be instantiated."
- Slide 90, exercise: "We have a game with a Character Creation UI, where a player creates their character. When they click the create button, it gets saved to a save file locally or online. Apply everything you've learnt so far to 'fix' this terrible design." UML: Game → CharacterCreationUI → SaveFileWriter.
- Slide 91, "My Solution": Game → CharacterCreationUI; Game → CharacterCreator → SaveWriter; SaveFileWriter and CloudSaveWriter extend SaveWriter. Dashed boxes: SRP around {Game, CharacterCreator} (Game no longer saves), SRP around {Game, CharacterCreationUI} (the UI only collects input), DIP around {CharacterCreator, SaveWriter, SaveFileWriter, CloudSaveWriter}.

## Law of Demeter (slides 92–99)
- Slide 93: "Real life - Wallet example".
- Slide 94, problem (UML): Cashier (-customer : Customer, +takeMoney(amount)) → Customer (-wallet: Wallet, +getWallet() : Wallet) → Wallet (-money : int, +getMoney(amount) : int). "Goal: Cashier wants to get int money from the Wallet. Cashier should not reach in Customer, then reach into their Wallet to get the money. In Cashier takeMoney(): `money = customer.getWallet().getMoney(amount)` #BAD. **Classes should NOT have knowledge of public members several classes away.**"
- Slide 95, solution: Cashier (+requestMoney(amount)) → Customer (getWallet() struck out, +getMoney(amount) : int) → Wallet (+getMoney(amount) : int). "Cashier can access Customer, but should not access Wallet through Customer. Refactor code so Cashier requests money from Customer. Customer accesses own Wallet to give money. In Cashier requestMoney(): `money = customer.getMoney(amount)` #OK! In Customer getMoney(): `return wallet.getMoney(amount)`. **Classes should have knowledge of public members of neighboring classes.**"
- Slide 96, boxed quote: **"Each unit should have only limited knowledge about other units: only units 'closely' related to the current unit. Each unit should only talk to its friends; don't talk to strangers."** "Don't have trainwrecks like these: `obj.getX().getY().getZ().doSomething();` or `MyCharacterUI.GetCharacterData().CreateCharacter().Save()`." "Poor Demeter is often forgotten; some people even call it 'Suggestion of Demeter' since this is difficult to avoid."
- Slide 97, example code: `class Game { Data data; CharacterUI characterUI; void createCharacter() { data = characterUI.getCharacterCreator().save(characterUI.getCharacterCreator().createCharacter()); } }`. "This code tries to create a character and save it. This is obviously bad and hard to read code. I also had a hard time getting the lines to wrap in powerpoint. Bad for many reasons. Any change in the save function, which is all the way in SaveWriter, could have a ripple effect of changes all the way to our Game class."
- Slide 98: "There isn't one solution that fixes all Law of Demeter problems. In this specific situation the solution is to restructure the system by swapping Game and CharacterCreationUI. Therefore Game does not need to reach through CharacterCreationUI to get CharacterCreator."
- Slide 99: "Restructure code so each class is responsible for their own data. This prevents classes reaching deeply into multiple classes."
  ```cpp
  class Game {
      void createCharacter() {
         data = characterUI.getData();
         characterCreator.initiateCharacterCreation(data);
      }
  };
  class CharacterCreationUI {
      void getData() {
         return characterData;
      }
  };
  class CharacterCreator {
      void initiateCharacterCreation(Data data) {
         my_char = createCharacter(data);
         saveWriter.save(myChar);
      }
  };
  ```
  (Slide code as written: `void getData()` returning a value and `my_char`/`myChar` spelled two ways are the slide's own slips; keep them out of runnable code.)

## Practice-midterm tie-in (from `COMP 3522 Practice Midterm.pdf`, Q21)
"Suppose we want to develop and implement a class called Fraction. A Fraction stores a numerator and a denominator, both as integers. Write a Fraction constructor that throws an exception if the user tries to instantiate a Fraction with a denominator of 0 (zero). Assume there are two private data members, both of type int, called numerator and denominator." Model answer (verified in `$S\build\pm_q21_26.cpp`): `Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) { if (denominator == 0) { throw std::invalid_argument("Denominator cannot be zero"); } }`; caught with `catch (std::invalid_argument& e) { cout << e.what(); }` → `Denominator cannot be zero`.

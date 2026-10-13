---
title: Coupling, cohesion and dependencies
minutes: 18
---

Code that nobody dares to change is the failure that builds up over years of development. Coupling and cohesion measure how changeable a design is before a single feature is touched.

## Design principles are guidelines, not recipes

*Design principles provide high level guidelines to help structure components and manage their interactions*: how classes are assembled, how deeply one reaches into another, and how relationships between them are implemented. Design patterns come later in the term.

The criterion is code that behaves correctly and **tolerates change**: *the difficulty in making a change should be proportional only to the scope of the change, not its shape.* A system becomes practically impossible to change when the cost of a change exceeds its benefit.

## Coupling: the strength of the connection between modules

Coupling refers to links between separate units of a program. If two classes depend closely on many details of each other they are **tightly coupled**; we aim for **loose coupling** between modules.

Loose coupling lets you understand and change one class with little or no effect on others. Tight coupling costs four things: changes to one class cascade to other classes; classes are harder to understand in isolation; the flow of control between objects of different classes is complex; classes are difficult to test in isolation.

## Cohesion: the glue that holds a module together

Cohesion refers to the number and diversity of tasks that a single unit is responsible for. If each unit is responsible for one single logical task it has **high cohesion**, and we aim for high cohesion inside modules. "Unit" applies to functions, classes and modules.

High cohesion makes a class or function easier to understand, name and reuse. A class should represent one single, well-defined entity; a function should be responsible for one and only one well-defined task. Functions that perform multiple tasks and classes with no clear identity are the two #BAD cases.

## Four modules, sixteen features, two ways to sort them

Slide 40 draws four modules holding four kinds of feature: circles are save/load, triangles character creation, rectangles screens, squares game state. On the left every module holds a mixture and lines criss-cross between them: *low cohesion and high coupling*. On the right each module holds one kind of feature and touches one neighbour: *high cohesion and low coupling*. Slide 42 asks which is better and prints no answer; slides 37 and 40 imply the right one, because each module can be understood, changed and reused on its own.

```widget
coupling-graph
{ "mode": "scattered" }
```

## A dependency is "A uses B"

*If entity A uses entity B, then A is said to be dependent on B*; an entity can be a library, a class or a sub-system of related code. Simulating a sushi restaurant, class `Sushi` (attributes `rice` and `fish`, operation `dip(SoySauce)`) depends on class `Rice` (`rice_type`, `vinegar_amt`) and class `Fish` (`fish_type`, `is_raw`): two arrows out of Sushi.

If A is strongly dependent on B, any change in B may require a change in A, and A cannot function without B; between sub-systems of a larger application that is an issue. *Tight coupling is a form of strong dependency*: the system becomes more rigid and less flexible.

Slide 47 moves `fish` inside the `Rice` class, so Sushi reaches Rice and Rice reaches Fish. Now rice always comes with fish and no other kind of sushi is possible (what about the tamago?). The red note: *notice how we moved fish into the rice class? BAD*. We want to **decouple our code** so it can be flexible and polymorphic.

```widget
uml-relations
{ "relation": "Dependency", "title": "The dashed open arrow in the slide diagrams: A uses B without owning it" }
```

## Decoupling sushi with an abstraction

Slide 48 replaces the `fish` attribute with `fillings: vector` pointing at an `<<Abstract>>` `Filling` (`amount`, `is_raw`) that `Fish`, `Avocado` and `Cucumber` extend; Sushi still points at Rice.

```cpp run pin sushi.cpp
// predict: Write the three lines printed.
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Rice {
public:
    string rice_type = "short grain";
    int vinegar_amt = 2;
};

class Filling {                       // <<Abstract>>
public:
    int amount;
    bool is_raw;
    Filling(int amount, bool is_raw) : amount(amount), is_raw(is_raw) {}
    virtual ~Filling() {}
    virtual string name() const = 0;
};

class Fish : public Filling {
public:
    Fish() : Filling(2, true) {}
    string name() const override { return "fish"; }
};

class Avocado : public Filling {
public:
    Avocado() : Filling(3, false) {}
    string name() const override { return "avocado"; }
};

class Cucumber : public Filling {
public:
    Cucumber() : Filling(4, false) {}
    string name() const override { return "cucumber"; }
};

class Sushi {
    vector<Filling*> fillings;        // Sushi depends on Filling, not on Fish
    Rice rice;
public:
    Sushi(vector<Filling*> fillings) : fillings(fillings) {}
    void dip(const string& soy_sauce) { cout << "dipped in " << soy_sauce << endl; }
    void describe() const {
        cout << rice.rice_type << " rice with";
        for (Filling* f : fillings)
            cout << " " << f->name() << (f->is_raw ? " (raw)" : "");
        cout << endl;
    }
};

int main() {
    Fish fish;
    Avocado avocado;
    Cucumber cucumber;
    Sushi salmon_roll({&fish, &avocado});
    Sushi veggie_roll({&cucumber, &avocado});   // no fish anywhere
    salmon_roll.describe();
    veggie_roll.describe();
    veggie_roll.dip("soy sauce");
    return 0;
}
```

With `vector<Filling*> fillings;` Sushi names only the abstraction, so `Sushi veggie_roll({&cucumber, &avocado});` builds a roll with no fish and a fourth filling is a new class, not an edit to Sushi. *Inheritance and Interfaces/Abstract classes are the most common and effective way of decoupling code.* The slide's note: *we still have a dependency!* Entities will always depend on each other; the aim is **weak dependencies** like this one.

## UI that reads a text file, then UI that reads a DataSource

Slide 49 is a `UI` with a `textFile` attribute pointing at `TextFile` (`read()`, `write()`, `search()`). After years of development the team switches to an encrypted JSON file or a SQLite database, and every module that dealt with the UI has to be edited.

Slide 50 inserts an `<<Interface>>` `DataSource` with `read()`, `write()` and `search()`. `UI` holds a `dataSource` and points at the interface; `Text File`, `SQLite DB` (adds `connect()`) and `JSON File` (adds `serialize()` and `deserialize()`) realize it. *Our UI would just depend on a common interface DataSource and not be concerned with how that data source is implemented.* Slide 52 says this diagram uses at least three SOLID principles, named in the next three lessons.

```widget
uml-relations
{ "relation": "Realization (implementation)", "title": "The dashed line with a hollow triangle under DataSource: Text File implements the interface" }
```

## Price a decoupled `Pizza` and count its dependencies

The sushi idea on a new menu: a Pizza that holds `Topping*` and never names a concrete topping.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nclass Topping {                        // <<Abstract>>\npublic:\n    virtual ~Topping() {}\n    virtual string name() const = 0;\n    virtual int price() const = 0;\n};\n\nclass Cheese : public Topping {\npublic:\n    string name() const override { return \"cheese\"; }\n    int price() const override { return 2; }\n};\n\nclass Basil : public Topping {\npublic:\n    string name() const override { return \"basil\"; }\n    int price() const override { return 1; }\n};\n\nclass Pizza {\n    int base = 8;\n    vector<Topping*> toppings;         // Pizza knows only the abstraction\npublic:\n    Pizza(vector<Topping*> t) : toppings(t) {}\n    int total() const {\n        int sum = base;\n        for (Topping* t : toppings) sum += t->price();\n        return sum;\n    }\n};\n\nint main() {\n    Cheese cheese;\n    Basil basil;\n    Pizza margherita({&cheese, &basil});\n    Pizza plain({});\n    Pizza extra({&cheese, &cheese, &basil});\n    cout << margherita.total() << \" \" << plain.total() << \" \" << extra.total() << endl;\n    return 0;\n}",
    "options": [
      "`11 8 13`",
      "`3 0 5`",
      "`11 8 11`",
      "`10 8 12`"
    ],
    "answer": 0,
    "explain": "Every pizza starts at base 8 and adds each topping's price through the virtual call. margherita: 8 + 2 (cheese) + 1 (basil) = 11. plain: no toppings, 8. extra: 8 + 2 + 2 + 1 = 13; the same Cheese object may appear twice in the vector."
  },
  {
    "q": "How many classes does `Pizza` depend on (uses in a member, a parameter or a call)?",
    "type": "numeric",
    "code": "#include <vector>\n\nclass Dough { };\nclass Topping { public: virtual ~Topping() {} };\nclass Oven { public: void heat(int degrees) { (void)degrees; } };\nclass Mushroom : public Topping { };\n\nclass Pizza {\n    Dough dough;\n    std::vector<Topping*> toppings;\npublic:\n    void bake(Oven& oven) { oven.heat(250); }\n};\n\nint main() {\n    Mushroom m;\n    Pizza p;\n    Oven o;\n    p.bake(o);\n    (void)m;\n    return 0;\n}",
    "answer": 3,
    "tolerance": 0,
    "explain": "Pizza uses `Dough` (a member), `Topping` (the vector's element type) and `Oven` (bake's parameter, whose heat it calls): 3. `Mushroom` is never named inside Pizza; it reaches Pizza only as a `Topping*`, which is exactly the weak dependency the abstraction buys."
  },
  {
    "q": "A new topping, Olive, is added to the program. Which classes must be edited? (select all)",
    "options": [
      "none of the existing classes: Olive is a new class derived from Topping",
      "Pizza",
      "Topping",
      "Cheese"
    ],
    "answer": [
      0
    ],
    "explain": "Pizza depends on the abstraction, so a new filling is a new class, `class Olive : public Topping`, and Pizza, Topping and Cheese are untouched. Had Pizza held a `Cheese cheese;` member, every new topping would mean editing Pizza: tight coupling."
  },
  {
    "q": "A function `processGrades()` reads a file, computes the average, prints a report and emails the instructor. Which description fits it?",
    "options": [
      "low cohesion: one function doing several tasks",
      "high cohesion: everything about grades is in one place",
      "tight coupling: it depends on too many modules",
      "loose coupling: it calls nothing else"
    ],
    "answer": 0,
    "explain": "Cohesion is about how many tasks one unit is responsible for. Four tasks in one function is the #BAD low-cohesion case: hard to name, test or reuse. Split it into a reader, a calculator, a report printer and a mailer, each with one task."
  }
]
```

```challenge
{"prompt": "Extend the menu without touching <code>Pizza</code> or <code>Topping</code>: add an <code>Olive</code> topping whose <code>name()</code> is <code>\"olive\"</code> and <code>price()</code> is <code>3</code>.", "starter": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nclass Topping {                        // <<Abstract>>\npublic:\n    virtual ~Topping() {}\n    virtual string name() const = 0;\n    virtual int price() const = 0;\n};\n\nclass Cheese : public Topping {\npublic:\n    string name() const override { return \"cheese\"; }\n    int price() const override { return 2; }\n};\n\nclass Basil : public Topping {\npublic:\n    string name() const override { return \"basil\"; }\n    int price() const override { return 1; }\n};\n\n// add Olive here: name \"olive\", price 3\n\nclass Pizza {\n    int base = 8;\n    vector<Topping*> toppings;         // Pizza knows only the abstraction\npublic:\n    Pizza(vector<Topping*> t) : toppings(t) {}\n    int total() const {\n        int sum = base;\n        for (Topping* t : toppings) sum += t->price();\n        return sum;\n    }\n};\n\nint main() {\n    Cheese cheese;\n    Olive olive;\n    Pizza greek({&cheese, &olive, &olive});\n    cout << greek.total() << endl;\n    return 0;\n}\n", "expected": "16", "hints": ["<code>class Olive : public Topping</code> with both pure functions overridden.", "8 + 2 + 3 + 3 = 16."], "solution": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nclass Topping {                        // <<Abstract>>\npublic:\n    virtual ~Topping() {}\n    virtual string name() const = 0;\n    virtual int price() const = 0;\n};\n\nclass Cheese : public Topping {\npublic:\n    string name() const override { return \"cheese\"; }\n    int price() const override { return 2; }\n};\n\nclass Basil : public Topping {\npublic:\n    string name() const override { return \"basil\"; }\n    int price() const override { return 1; }\n};\n\nclass Olive : public Topping {\npublic:\n    string name() const override { return \"olive\"; }\n    int price() const override { return 3; }\n};\n\nclass Pizza {\n    int base = 8;\n    vector<Topping*> toppings;         // Pizza knows only the abstraction\npublic:\n    Pizza(vector<Topping*> t) : toppings(t) {}\n    int total() const {\n        int sum = base;\n        for (Topping* t : toppings) sum += t->price();\n        return sum;\n    }\n};\n\nint main() {\n    Cheese cheese;\n    Olive olive;\n    Pizza greek({&cheese, &olive, &olive});\n    cout << greek.total() << endl;\n    return 0;\n}\n"}
```
```quiz
[
  {
    "q": "Slide wording: coupling is...",
    "options": ["the number and diversity of tasks a unit is responsible for", "the glue that holds a module together", "the strength of the connection between modules", "the number of classes in a program"],
    "answer": 2,
    "explain": "Coupling is the boxed 'strength of the connection between modules'; cohesion is 'the glue that holds a module together' and refers to the number and diversity of tasks a single unit is responsible for."
  },
  {
    "q": "We aim for tight cohesion and loose coupling.",
    "type": "tf",
    "answer": false,
    "explain": "The slide words are HIGH cohesion inside modules and LOOSE coupling between modules. 'Tight' is the bad kind of coupling, never a kind of cohesion."
  },
  {
    "q": "Which of these are costs of tight coupling listed on the slides? (select all)",
    "options": ["changes to one class bring a cascade of changes to other classes", "classes are harder to understand in isolation", "functions perform multiple tasks", "it is difficult to test classes in isolation"],
    "answer": [0, 1, 3],
    "explain": "Slide 38 lists cascading changes, harder to understand in isolation, complex flow of control between objects, and difficult to test in isolation. Functions performing multiple tasks is the LOW COHESION #BAD case."
  },
  {
    "q": "The slides say the word 'unit', as in 'each unit is responsible for one single logical task', applies to...",
    "options": ["classes only", "functions only", "modules only", "functions, classes and modules"],
    "answer": 3,
    "explain": "Cohesion is judged at every level: a function should do one and only one well-defined task, a class should represent one single well-defined entity, and a module should hold one kind of feature."
  },
  {
    "q": "Slide 47 moves `fish` inside the `Rice` class. Why is that marked BAD?",
    "options": ["Rice now has too many attributes to compile", "rice will always come with fish, so no other kind of sushi is possible: a tight coupling", "Sushi loses its dependency on Rice", "Fish can no longer be raw"],
    "answer": 1,
    "explain": "Tight coupling is a form of strong dependency: Rice cannot function without Fish, so the whole system becomes rigid. The fix is an abstract Filling that Fish, Avocado and Cucumber extend."
  },
  {
    "q": "According to the slides, the most common and effective way of decoupling code is...",
    "options": ["global variables shared between classes", "returning error codes instead of throwing", "inheritance and interfaces/abstract classes", "putting every class in its own file"],
    "answer": 2,
    "explain": "Slide 48: Sushi depends on the abstract Filling, and concrete fillings are added by inheritance. The dependency stays, but it is a weak dependency on an abstraction."
  },
  {
    "q": "After Sushi is rewritten to hold a `vector<Filling*>`, Sushi has no dependencies at all.",
    "type": "tf",
    "answer": false,
    "explain": "The slide's NOTE: we still have a dependency; entities will always be dependent on each other, that's how OOP works. Sushi now depends on the abstraction Filling (and still on Rice), which is a weak dependency."
  },
  {
    "q": "In the UI example, why does inserting the DataSource interface help when the team switches from a text file to a SQLite database?",
    "options": ["SQLite is faster than a text file", "the UI depends only on DataSource, so a new SQLite DB class implements the interface and the UI code is untouched", "the interface stores the data itself", "it removes the need for read(), write() and search()"],
    "answer": 1,
    "explain": "Slide 49: with UI pointing straight at TextFile, every UI module had to be edited. Slide 50: UI points at the common interface DataSource and is not concerned with how the data source is implemented."
  },
  {
    "type": "match",
    "q": "Match each term to the slide's description.",
    "pairs": [["coupling", "the strength of the connection between modules"], ["cohesion", "the glue that holds a module together"], ["dependency", "entity A uses entity B"], ["tight coupling", "a form of strong dependency"]],
    "explain": "Coupling is measured between modules, cohesion inside one; a dependency is any 'A uses B'; tight coupling is the strong, rigid kind of dependency the slides tell you to avoid."
  }
]
```

---
title: Liskov Substitution and Interface Segregation
minutes: 20
---

The widgets are now separate classes under an interface. Two questions remain: how does a Canvas draw all of them without naming each one, and what happens when an interface itself grows too fat? L and I answer them.

## A Canvas with one pointer per subtype

Slide 71 asks how to draw all these widgets and shows a first attempt, in the slide's own shorthand:

```cpp
class Canvas {
    UIPanel* panel; UIScrollbar* scrollbar; UIButton* button;

    Canvas(UIPanel* panel, UIScrollbar* scrollbar, ..., Button* button) {
        this->panel = panel
        this->scrollbar = scrollbar
        this->button = button
        ...
    void draw_screen():
        panel->draw()
        scrollbar->draw()
        button->draw()
        ...
```

The UML has `UIPanel`, `UIScrollBar` and `UIButton` extending `UIWidget`, and three coloured arrows from `Canvas` to each concrete class. Would this be a good way of drawing all the widgets? *This would be terrible! Why inherit if you have to keep an explicit reference to each subtype?* Every new widget type means a new member, a new constructor parameter and a new line in `draw_screen`.

## Liskov Substitution: a subtype may stand in for its base

Slide wording, two phrasings: **The Liskov substitution principle states that if S is a subtype of T, then objects of type T may be replaced (or substituted) with objects of type S.** Or: **Objects in a program should be replaceable in code with references of their base types without altering the correctness of that program.** *Simply put, you should be able to refer to all the different child UI components as its base class, UIWidget.*

The direction matters: a `UIButton` may go wherever a `UIWidget` is expected, not the other way round. A function written for the base must keep working when handed any derived object.

## A Canvas with a vector of UIWidget pointers

Slide 74 keeps one member, a `vector<UIWidget*>`, and one arrow in the UML: `Canvas` to `UIWidget`, with the three concrete widgets extending `UIWidget` below.

```cpp run pin canvas_lsp.cpp
// predict: Write the five lines printed.
#include <iostream>
#include <vector>
using namespace std;

class UIWidget {
public:
    virtual ~UIWidget() {}
    virtual void draw() = 0;
};

class UIPanel : public UIWidget {
public:
    void draw() override { cout << "drawing panel" << endl; }
};

class UIScrollBar : public UIWidget {
public:
    void draw() override { cout << "drawing scroll bar" << endl; }
};

class UIButton : public UIWidget {
public:
    void draw() override { cout << "drawing button" << endl; }
};

class Canvas {
    vector<UIWidget*> ui_widgets;
public:
    Canvas(vector<UIWidget*> widget_list) { this->ui_widgets = widget_list; }
    void draw_screen() {
        for (UIWidget* widget : ui_widgets)
            widget->draw();
    }
};

int main() {
    UIPanel panel;
    UIScrollBar scrollbar;
    UIButton ok, cancel;
    Canvas canvas({&panel, &scrollbar, &ok, &cancel});
    canvas.draw_screen();
    cout << "Canvas never named a derived type" << endl;
    return 0;
}
```

`vector<UIWidget*> ui_widgets;` replaces the three typed pointers: *now we just have a vector filled with pointers to many derived UIWidgets (UIPanel, UIScrollBar, UIButton etc)*. `for (UIWidget* widget : ui_widgets)` walks them as their base type and `widget->draw();` is a virtual call, so each pointer runs its own override. *Since they all have the same interface (draw function) they can be treated as if they were their base class (UIWidget). We don't care about the derived type. Let polymorphism determine the derived type at runtime.* `UIButton ok, cancel;` shows the other gain: two buttons, or ten, need no change to Canvas.

```widget
dispatch-viz
{ "virtual": true, "handle": "ptr", "object": "derived", "title": "Why widget->draw() reaches the derived override: a Base* to a Derived object with a virtual function" }
```

## A fat Animal: Human must fly, Fish can walk

Slide 76 models a zoo. The UML has `Human`, `Whale`, `Swan` and `Giraffe` extending one `Animal`, and Animal, written after all our design principles, reads:

```cpp
class Animal {
    virtual void breathe() {
        //common breathing code here
    }

    virtual void eat() {
        // common eating code here
    }
    virtual void walk() = 0;

    virtual void swim() = 0;

    virtual void fly() = 0;
}
```

*But this is terrible! Now our Human class needs to override the fly function. Our Fish can walk!* Three pure virtual functions force every animal to implement all three, whether the animal does them or not.

## Interface Segregation: no client forced to depend on functions it does not use

Slide wording, two phrasings: **Many client-specific interfaces are better than one general-purpose interface.** Or: **The interface segregation principle states that no client should be forced to depend on functions it does not use.** Put more simply: do not have interfaces with too many unnecessary functions; have multiple simpler interfaces with fewer functions instead. *This is the Single Responsibility Principle for Interfaces/Abstractions!*

## Back to the zoo

Slides 78 to 80 keep in `Animal` only what all animals share, `breathe()` and `eat()`, and move each optional ability into its own interface: `Walkable`, `Swimmable`, `Flyable`. The UML shows `Human` extending `Animal` and also `Walkable` and `Swimmable`, `Swan` reaching `Flyable`, and the text says *Human class inherits only the functionality they need*.

```cpp run pin zoo_isp.cpp
// predict: Write the eight lines printed.
#include <iostream>
using namespace std;

class Animal {                        // what every animal shares
public:
    virtual ~Animal() {}
    virtual void breathe() { cout << "common breathing code" << endl; }
    virtual void eat() { cout << "common eating code" << endl; }
};

class Walkable {
public:
    virtual ~Walkable() {}
    virtual void walk() = 0;
};

class Swimmable {
public:
    virtual ~Swimmable() {}
    virtual void swim() = 0;
};

class Flyable {
public:
    virtual ~Flyable() {}
    virtual void fly() = 0;
};

class Human : public Animal, public Walkable, public Swimmable {
public:
    void walk() override { cout << "human walks" << endl; }
    void swim() override { cout << "human swims" << endl; }
};

class Fish : public Animal, public Swimmable {
public:
    void swim() override { cout << "fish swims" << endl; }
};

class Swan : public Animal, public Walkable, public Swimmable, public Flyable {
public:
    void walk() override { cout << "swan waddles" << endl; }
    void swim() override { cout << "swan paddles" << endl; }
    void fly() override { cout << "swan flies" << endl; }
};

int main() {
    Human human;
    Fish fish;
    Swan swan;
    human.breathe();
    human.walk();
    fish.eat();
    fish.swim();
    //fish.walk();   // error: 'class Fish' has no member named 'walk'
    Flyable& flyer = swan;
    flyer.fly();
    Swimmable* swimmers[] = { &human, &fish, &swan };
    for (Swimmable* s : swimmers)
        s->swim();
    return 0;
}
```

`class Human : public Animal, public Walkable, public Swimmable {` is the slide's line: Week 4's multiple inheritance, one concrete base plus two interfaces, and Human overrides only `walk()` and `swim()`. `//fish.walk();   // error: 'class Fish' has no member named 'walk'` is the point of segregation: the fish that could walk on slide 76 now cannot even be asked to. `Flyable& flyer = swan;` and the `Swimmable*` array are Liskov again, this time through the small interfaces: any Swimmable can be asked to swim, and nothing else. There is no diamond here, because `Walkable`, `Swimmable` and `Flyable` share no base class, so the Week 4 `virtual` inheritance is not needed. *This may seem difficult to maintain, but in fact it isn't.*

```widget
solid-spotter
{ "cases": ["lsp", "isp"], "shuffle": false }
```

```quiz
[
  {
    "q": "Slide wording: if S is a subtype of T, then objects of type T may be replaced with objects of type...",
    "options": ["T", "S", "any class", "void*"],
    "answer": 1,
    "explain": "Liskov Substitution: wherever the base T is expected, a subtype S object may stand in without altering the correctness of the program. UIButton (S) goes wherever UIWidget (T) is expected."
  },
  {
    "q": "The Liskov Substitution Principle says a base-class object can be used wherever a derived class is expected.",
    "type": "tf",
    "answer": false,
    "explain": "It is the reverse: a SUBTYPE may be substituted where the BASE type is expected. A UIWidget cannot stand in for a UIButton; a UIButton can stand in for a UIWidget."
  },
  {
    "q": "Why do the slides call the Canvas with `UIPanel* panel; UIScrollbar* scrollbar; UIButton* button;` terrible?",
    "options": ["pointers are slower than objects", "UIPanel does not extend UIWidget", "the constructor has too few parameters", "why inherit if you have to keep an explicit reference to each subtype?"],
    "answer": 3,
    "explain": "Every new widget type means a new member, constructor parameter and draw line. The fix is one vector<UIWidget*> and a loop calling widget->draw(), letting polymorphism pick the derived type at runtime."
  },
  {
    "q": "What does this print?",
    "code": "class UIWidget { public: virtual void draw() = 0; };\nclass UIButton : public UIWidget { public: void draw() override { cout << \"B\"; } };\nclass UIPanel : public UIWidget { public: void draw() override { cout << \"P\"; } };\nint main() {\n    UIButton b; UIPanel p;\n    vector<UIWidget*> v = { &p, &b, &b };\n    for (UIWidget* w : v) w->draw();\n}",
    "options": ["PBB", "BPP", "a compile error: UIWidget is abstract", "WWW"],
    "answer": 0,
    "explain": "A vector of base pointers holds a panel then two buttons; draw() is virtual, so each pointer dispatches to its own object's override. Only creating a UIWidget by value would be the abstract-class error; pointers to it are fine."
  },
  {
    "q": "Slide wording: many client-specific interfaces are better than...",
    "options": ["no interfaces at all", "one abstract class per client", "a single concrete base class", "one general-purpose interface"],
    "answer": 3,
    "explain": "Interface Segregation. The other phrasing: no client should be forced to depend on functions it does not use. Animal with walk, swim and fly all pure virtual is the one general-purpose interface."
  },
  {
    "q": "The slides describe the Interface Segregation Principle as which other principle applied to interfaces?",
    "options": ["Open/Closed", "Liskov Substitution", "Single Responsibility", "Dependency Inversion"],
    "answer": 2,
    "explain": "Slide 77: this is the Single Responsibility Principle for Interfaces/Abstractions. Each of Walkable, Swimmable and Flyable has one responsibility."
  },
  {
    "q": "In the fixed zoo, which classes does `Human` inherit from? (select all)",
    "options": ["Animal", "Walkable", "Swimmable", "Flyable"],
    "answer": [0, 1, 2],
    "explain": "class Human : public Animal, public Walkable, public Swimmable. Flyable is left to Swan; a Human is never forced to override fly()."
  },
  {
    "q": "Human inherits from Animal, Walkable and Swimmable. Why does this not create the Week 4 diamond problem?",
    "options": ["because the three bases share no common base class, so nothing is inherited twice", "because interfaces cannot be inherited twice", "because Human uses virtual inheritance automatically", "it does create a diamond; the code only compiles with a warning"],
    "answer": 0,
    "explain": "A diamond needs two middle classes with the same base. Animal, Walkable and Swimmable are unrelated, so Human holds one subobject of each and no ambiguity arises; virtual inheritance is not needed."
  },
  {
    "type": "match",
    "q": "Match each principle to its slide example.",
    "pairs": [["Single Responsibility", "User split into User and PostWriter"], ["Open/Closed", "UIWidget if-chain replaced by UIButton, UITextBox, UIScrollBar overriding draw()"], ["Liskov Substitution", "Canvas holds vector<UIWidget*> and calls widget->draw()"], ["Interface Segregation", "Animal keeps breathe and eat; Walkable, Swimmable, Flyable are separate"]],
    "explain": "S: one reason to change. O: extend by inheriting, do not modify. L: a subtype stands in for its base. I: many small client-specific interfaces instead of one fat one."
  }
]
```

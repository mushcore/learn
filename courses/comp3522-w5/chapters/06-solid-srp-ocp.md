---
title: Single Responsibility and Open/Closed
minutes: 20
---

A class that does too much and a function that grows with every new case are the two faults that make code hard to change. SOLID is *a set of guidelines to help us write maintainable, decoupled, flexible Object-Oriented Code*, created by Robert C. Martin (Uncle Bob); S and O fix those two faults.

## A User class that does everything

The slides start with a system where a user can write and create forum posts. The UML has `User` with a dashed arrow to `Post` and a solid arrow to `MyDatabase`, which has its own dashed arrow to `Post`.

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

Why is this code bad? *The User class is very coupled and dependent. It carries out many different roles and responsibilities. Changing any part of this system will probably cause a change in the User class as well.* Slides 57 to 59 count the roles: the User class has code to be a user, to create a database, and to post to a forum. Three responsibilities, three reasons to change. *The User class should focus on only being a user.*

## Single Responsibility: one reason to change

Slide wording: **The Single Responsibility Principle requires that each class is responsible for only one thing.** The test is a question: *are there multiple reasons to change my class?* There should be only one reason to change a class; each class should have one and only one responsibility.

## The split: User keeps the four assignments, PostWriter posts

Pt.1 of the split leaves `User` with just the four assignments and no database line. Pt.2 adds a `PostWriter`; its UML has dashed arrows from `PostWriter` to `User` and to `Post`, a solid arrow to `MyDatabase`, and `MyDatabase` still points at `Post`. The slide shows only the two classes; the program adds a stub `Post` and a `MyDatabase` that prints instead of storing, so the split can run.

```cpp run pin user_split.cpp
// predict: Write the three lines printed.
#include <iostream>
#include <string>
using namespace std;

class Post {
public:
    string subject, message, author;
    Post(string subject, string message, string author)
        : subject(subject), message(message), author(author) {}
};

class MyDatabase {                    // stub: prints instead of storing
public:
    void addSimplePost(const Post& post) {
        cout << "database stores \"" << post.subject << "\" by " << post.author << endl;
    }
};

class User {                          // Pt.1: only being a user
public:
    string username, password, name, email;
    User(string username, string password, string name, string email)
    {
        this->username = username;
        this->password = password;
        this->name = name;
        this->email = email;
    }
};

class PostWriter {                    // Pt.2: posting is its one job
    MyDatabase* database;
public:
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

int main() {
    MyDatabase database;
    User alice("alice42", "hunter2", "Alice Liddell", "alice@example.com");
    PostWriter writer(&database);
    writer.postToForum(alice, "Where is the lab?", "Lab 5");
    writer.postToForum(alice, "Found it, SW03.", "Lab 5 (solved)");
    cout << alice.name << " never touched the database" << endl;
    return 0;
}
```

The database pointer moved out of User into PostWriter, which receives it from whoever constructs the writer instead of creating it. The `Post` line is the slide's with one change: the username comes from the `User&` parameter, because the writer is not a user. A change to how posts are stored touches PostWriter; a change to what a user is touches User; neither touches the other.

## A UIWidget with a string type and a growing if-chain

Slide 65 draws a GUI where each UI element is a `UIWidget` with a `string type` and a `draw()` that tests it: a button branch and an else for a generic panel. It works great initially, but eventually we want more widget types, and by slide 66 the function tests Button, Text Box, ScrollBar and Label before falling to the panel.

```cpp run pin widget_ifchain.cpp
// predict: Four widgets are drawn. Write the four lines printed (watch the Slider).
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class UIWidget {
public:
    string type;
    UIWidget(string type) : type(type) {}
    void draw() {
        if (type == "Button")
            cout << "complicated button draw logic" << endl;
        else if (type == "Text Box")
            cout << "complicated draw logic for a text box" << endl;
        else if (type == "ScrollBar")
            cout << "complicated draw logic for a scroll bar" << endl;
        else if (type == "Label")
            cout << "complicated draw logic for a label" << endl;
        else
            cout << "complicated draw logic for a panel" << endl;
    }
};

int main() {
    vector<UIWidget> screen = { UIWidget("Button"), UIWidget("ScrollBar"), UIWidget("Slider"), UIWidget("Panel") };
    for (UIWidget& w : screen)
        w.draw();
    return 0;
}
```

`UIWidget("Slider")` is a widget nobody wrote a branch for, so it silently falls to `cout << "complicated draw logic for a panel" << endl;` and draws as a panel; supporting it means editing `draw()` yet again. *This is terrible design! If we wanted to change the logic / algorithm behind drawing a button, we would need to edit this massive draw member function. An error or bug here would affect all the widgets on screen and crash our whole system!*

## Open/Closed: open for extension, closed for modification

Slide wording: **The Open/Closed Principle states that software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification.** Once a class is made, its behaviour should not be modified to support special cases: it is CLOSED for modification. Instead we extend (inherit from) the class and override behaviours: it is OPEN for extension.

## We use inheritance and overriding

Slide 68 turns `UIWidget` into a class with a single pure virtual `draw()`, and each widget becomes a derived class that overrides it. The UML now reads `<interface>` `UIWidget` with `+draw()` and `UITextBox`, `UIScrollBar`, `UIButton` under it on dashed lines.

```cpp run pin widget_virtual.cpp
// predict: Write the four lines printed.
#include <iostream>
#include <vector>
using namespace std;

class UIWidget {
public:
    virtual ~UIWidget() {}
    virtual void draw() = 0;
};

class UIButton : public UIWidget {
public:
    void draw() override { cout << "complicated draw code for buttons" << endl; }
};

class UITextBox : public UIWidget {
public:
    void draw() override { cout << "complicated draw code for text box" << endl; }
};

class UIScrollBar : public UIWidget {
public:
    void draw() override { cout << "complicated draw code for scroll bar" << endl; }
};

class UISlider : public UIWidget {    // the extension: a new class, UIWidget untouched
public:
    void draw() override { cout << "complicated draw code for slider" << endl; }
};

int main() {
    //UIWidget w;   // error: abstract class
    UIButton button;
    UIScrollBar scrollbar;
    UISlider slider;
    UITextBox textbox;
    vector<UIWidget*> screen = { &button, &scrollbar, &slider, &textbox };
    for (UIWidget* w : screen)
        w->draw();                    // the same loop as the if-chain, no type test
    return 0;
}
```

The loop is the if-chain's loop, now over base pointers: virtual dispatch picks each class's `draw()`, and no line tests a type. *We used abstraction to do this. The UIWidget class is now an interface, ensuring that each UI component that inherits from it has the same interface.* The slider is a new class added without opening UIWidget, and the commented-out `UIWidget w;` shows that the base exists only to be extended. *Now, any change to UIButton would not affect any other widget. Each widget class is modular and decoupled. It even follows the Single Responsibility Principle!*

```widget
abstract-check
{ "f": "pure", "g": "plain", "bf": true, "bg": false, "cf": true, "cg": false, "title": "UIWidget as A: one pure virtual draw() makes it abstract; B and C that override it are concrete" }
```

## Spot S and O in the deck's two cases

Each case is slide code with one fault; the slide's fix is drawn once the principle is named.

```widget
solid-spotter
{ "cases": ["srp", "ocp"], "shuffle": false }
```

```challenge
{
  "prompt": "Extend, do not modify: add a <code>UILabel</code> class that prints <code>drawing label</code>. <code>UIWidget</code> and <code>UIButton</code> stay exactly as they are.",
  "starter": "#include <iostream>\nusing namespace std;\n\nclass UIWidget {\npublic:\n    virtual ~UIWidget() {}\n    virtual void draw() = 0;\n};\n\nclass UIButton : public UIWidget {\npublic:\n    void draw() override { cout << \"drawing button\" << endl; }\n};\n\n// add UILabel here\n\nint main() {\n    UIButton button;\n    UILabel label;\n    button.draw();\n    label.draw();\n    return 0;\n}\n",
  "expected": "drawing button\ndrawing label",
  "hints": ["A new class that derives publicly from UIWidget and overrides draw().", "<code>void draw() override { cout << \"drawing label\" << endl; }</code> is the only line with any logic in it."],
  "solution": "#include <iostream>\nusing namespace std;\n\nclass UIWidget {\npublic:\n    virtual ~UIWidget() {}\n    virtual void draw() = 0;\n};\n\nclass UIButton : public UIWidget {\npublic:\n    void draw() override { cout << \"drawing button\" << endl; }\n};\n\nclass UILabel : public UIWidget {\npublic:\n    void draw() override { cout << \"drawing label\" << endl; }\n};\n\nint main() {\n    UIButton button;\n    UILabel label;\n    button.draw();\n    label.draw();\n    return 0;\n}\n"
}
```

```quiz
[
  {
    "q": "SOLID was created by...",
    "options": ["Bjarne Stroustrup", "Barbara Liskov", "Robert C. Martin, known as Uncle Bob", "Erich Gamma"],
    "answer": 2,
    "explain": "Slide 54: Robert C. Martin, also known as Uncle Bob amongst developers, highly respected with a bunch of books on writing clean code. Liskov's name is on the L only."
  },
  {
    "q": "The question the slides tell you to ask when checking the Single Responsibility Principle is...",
    "options": ["does my class compile without warnings?", "are there multiple reasons to change my class?", "does my class have more than one member function?", "does my class use inheritance?"],
    "answer": 1,
    "explain": "SRP requires that each class is responsible for only one thing, so there should be only one reason to change it. Count the reasons, not the functions."
  },
  {
    "q": "Which responsibilities do the slides count in the original User class? (select all)",
    "options": ["be a user", "create a database", "draw the forum page", "post to a forum"],
    "answer": [0, 1, 3],
    "explain": "Slides 57 to 59 build the list up: code to be a user, code to create a database (this->database = MyDatabase()), code to post to a forum. Nothing in User draws anything."
  },
  {
    "q": "After the split, which class holds the `MyDatabase*` and the posting code?",
    "options": ["User", "Post", "MyDatabase", "PostWriter"],
    "answer": 3,
    "explain": "PostWriter is constructed with a MyDatabase* and its postToForum(User& user, message, subject) builds the Post and calls database->addSimplePost. User keeps only the four assignments."
  },
  {
    "q": "What does this print?",
    "code": "class UIWidget {\npublic:\n    string type;\n    UIWidget(string t) : type(t) {}\n    void draw() {\n        if (type == \"Button\") cout << \"button\";\n        else if (type == \"Label\") cout << \"label\";\n        else cout << \"panel\";\n    }\n};\nint main() { UIWidget w(\"Slider\"); w.draw(); }",
    "options": ["slider", "button", "panel", "a compile error"],
    "answer": 2,
    "explain": "No branch tests \"Slider\", so the final else runs. In the if-chain design every new widget type means editing draw(); that is the modification the Open/Closed Principle forbids."
  },
  {
    "q": "Slide wording: software entities should be open for ___, but closed for modification.",
    "type": "text",
    "answer": ["extension"],
    "explain": "Open for extension (inherit and override), closed for modification (do not edit the class to add special cases)."
  },
  {
    "q": "The Open/Closed Principle is satisfied by adding another `else if` branch for each new widget type.",
    "type": "tf",
    "answer": false,
    "explain": "Adding a branch modifies the existing draw(); OCP wants the class closed for modification. The slide's fix is inheritance and overriding: a new UIButton or UISlider class with its own draw()."
  },
  {
    "q": "After UIWidget becomes an interface with pure virtual draw() and each widget overrides it, the slides say the design also follows...",
    "options": ["the Liskov Substitution Principle only", "the Single Responsibility Principle", "no other principle", "the Law of Demeter"],
    "answer": 1,
    "explain": "Slide 69: each widget class is modular and decoupled; a change to UIButton affects no other widget. It even follows the Single Responsibility Principle, because each class draws exactly one kind of widget."
  }
]
```

---
title: Practice: a throwing Fraction and a SOLID redesign
minutes: 25
---

The practice midterm asks you to write a constructor that throws, and the Week 5 deck ends with a design you must fix. Both are written on paper first, then checked by compiling.

## Question 21: a Fraction constructor that throws

Practice-midterm wording: *Suppose we want to develop and implement a class called Fraction. A Fraction stores a numerator and a denominator, both as integers. Write a Fraction constructor that throws an exception if the user tries to instantiate a Fraction with a denominator of 0 (zero). Assume there are two private data members, both of type int, called numerator and denominator.*

Write it on paper before opening the challenge. The marker looks for four things: an initializer list that stores both members, the test `denominator == 0`, a `throw` of a standard exception type with a message, and the header that declares it. `std::invalid_argument` is the right family: a zero denominator is a caller's mistake that could have been checked before the call, which is what `logic_error` means. It lives in `<stdexcept>`.

```challenge
{"prompt": "Complete the constructor so that a zero denominator throws <code>std::invalid_argument(\"Denominator cannot be zero\")</code>. <code>main</code> builds <code>1/2</code>, prints it, then tries <code>1/0</code>; the handler prints <code>what()</code>. The destructor prints <code>~Fraction</code> and the value.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) {\n        // TODO: store both members, throw if denominator is 0\n    }\n    ~Fraction() { cout << \"~Fraction \" << numerator << \"/\" << denominator << endl; }\n    friend ostream& operator<<(ostream& os, const Fraction& f) {\n        return os << f.numerator << \"/\" << f.denominator;\n    }\n};\n\nint main() {\n    try {\n        Fraction half(1, 2);\n        cout << half << endl;\n        Fraction bad(1, 0);\n        cout << bad << endl;\n    } catch (invalid_argument& e) {\n        cout << e.what() << endl;\n    }\n    return 0;\n}\n", "expected": "1/2\n~Fraction 1/2\nDenominator cannot be zero", "hints": ["Initializer list: <code>: numerator(numerator), denominator(denominator)</code>. Inside the body, test the parameter.", "<code>throw invalid_argument(\"Denominator cannot be zero\");</code> needs <code>&lt;stdexcept&gt;</code>, which the starter already includes."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\nprivate:\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n    ~Fraction() { cout << \"~Fraction \" << numerator << \"/\" << denominator << endl; }\n    friend ostream& operator<<(ostream& os, const Fraction& f) {\n        return os << f.numerator << \"/\" << f.denominator;\n    }\n};\n\nint main() {\n    try {\n        Fraction half(1, 2);\n        cout << half << endl;\n        Fraction bad(1, 0);\n        cout << bad << endl;\n    } catch (invalid_argument& e) {\n        cout << e.what() << endl;\n    }\n    return 0;\n}\n"}
```

Two things the output shows. `cout << bad` never runs: a constructor that throws creates no object, so control leaves the `try` block at the `throw`, and `bad` has no destructor line. `half`, which was fully built, is destroyed during unwinding, before the handler runs. The handler takes the exception **by reference**, guideline 1.

### The written answer

On paper, the model answer is the constructor alone:

```cpp
Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator)
{
    if (denominator == 0) {
        throw std::invalid_argument("Denominator cannot be zero");
    }
}
```

:::quiz A string literal is not an exception class
Writing `throw "Denominator cannot be zero";` also throws, but it throws a `const char*`, which no `catch (exception&)` will see. The slide's advice is to define exception types or use the standard ones.
:::

## A catch-all fallback, and why handler order matters

The starter below has two handlers in the wrong order and no fallback. It compiles with a warning (`exception of type 'std::invalid_argument' will be caught by earlier handler`) and prints only two lines, then the thrown `42` finds no handler and the program terminates before `attempt(4)` runs.

```challenge
{ "prompt": "Reorder the handlers so the most specific type is tried first, and add a <code>catch (...)</code> fallback that prints <code>catch-all</code>, so all four attempts complete.", "starter": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n};\n\nvoid attempt(int which) {\n    try {\n        if (which == 1) { Fraction bad(1, 0); }\n        if (which == 2) { throw runtime_error(\"disk full\"); }\n        if (which == 3) { throw 42; }\n        cout << \"no exception\" << endl;\n    } catch (exception& e) {\n        cout << \"exception: \" << e.what() << endl;\n    } catch (invalid_argument& e) {\n        cout << \"invalid_argument: \" << e.what() << endl;\n    }\n}\n\nint main() {\n    attempt(1);\n    attempt(2);\n    attempt(3);\n    attempt(4);\n    return 0;\n}\n", "expected": "invalid_argument: Denominator cannot be zero\nexception: disk full\ncatch-all\nno exception", "hints": ["Guideline 3: child type first. <code>invalid_argument</code> derives from <code>logic_error</code>, which derives from <code>exception</code>.", "Guideline 4: <code>catch (...)</code> catches everything, including an <code>int</code>, and must be the last handler."], "solution": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nclass Fraction {\n    int numerator;\n    int denominator;\npublic:\n    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {\n        if (denominator == 0) {\n            throw invalid_argument(\"Denominator cannot be zero\");\n        }\n    }\n};\n\nvoid attempt(int which) {\n    try {\n        if (which == 1) { Fraction bad(1, 0); }\n        if (which == 2) { throw runtime_error(\"disk full\"); }\n        if (which == 3) { throw 42; }\n        cout << \"no exception\" << endl;\n    } catch (invalid_argument& e) {\n        cout << \"invalid_argument: \" << e.what() << endl;\n    } catch (exception& e) {\n        cout << \"exception: \" << e.what() << endl;\n    } catch (...) {\n        cout << \"catch-all\" << endl;\n    }\n}\n\nint main() {\n    attempt(1);\n    attempt(2);\n    attempt(3);\n    attempt(4);\n    return 0;\n}\n" }
```

The first catch-block with a matching type runs, and a reference to `exception` matches every standard exception, so `catch (exception&)` placed first swallows the `invalid_argument` and the second handler is dead code. `runtime_error("disk full")` is not an `invalid_argument`, so it falls through to `catch (exception&)`. The `int` matches neither; only the ellipsis takes it. Without the ellipsis, an uncaught exception calls `std::terminate`, which calls the termination handler, which calls `abort`.

## The character-creation redesign (slides 90 and 91)

Slide 90 gives the design to fix: `Game` holds a `CharacterCreationUI`, and the UI holds a `SaveFileWriter`. *When they click the create button, it gets saved to a save file locally or online.* On paper, before reading on, list what is wrong with it and redraw the class diagram the way you would fix it.

Three faults, one per principle:

| Fault in slide 90 | Principle | Fix on slide 91 |
|---|---|---|
| The UI collects input **and** saves: two reasons to change | Single Responsibility | `CharacterCreationUI` only collects data; a new `CharacterCreator` does the creating and saving |
| `Game` drives saving by reaching through the UI | Single Responsibility (second dashed box) | `Game` talks to `CharacterCreationUI` and to `CharacterCreator` directly |
| The save target is the concrete `SaveFileWriter`; adding online saves means editing the UI | Dependency Inversion | `CharacterCreator` depends on the abstraction `SaveWriter`; `SaveFileWriter` and `CloudSaveWriter` extend it |

The slide-91 diagram and the slide-99 code that also fixes the Demeter train wreck are in [Dependency Inversion and the Law of Demeter](#/comp3522-w5/dip-demeter). Swapping the writer changes nothing above `SaveWriter`: both the high-level module and the low-level modules depend on the abstraction.

```challenge
{ "prompt": "Fill in the skeleton of slide 91. <code>SaveWriter</code> is an interface with a pure virtual <code>save</code>; <code>SaveFileWriter</code> prints <code>saved to file</code> and <code>CloudSaveWriter</code> prints <code>saved to cloud</code>; <code>CharacterCreator</code> holds a <code>SaveWriter&amp;</code> and its <code>initiateCharacterCreation</code> builds a <code>Character</code> from the <code>Data</code> and saves it; <code>Game::createCharacter</code> follows slide 99. <code>main</code> is written for you.", "starter": "#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Data { string name; };\nstruct Character { string name; };\n\nclass SaveWriter {\npublic:\n    virtual ~SaveWriter() {}\n    // TODO: pure virtual save(const Character&)\n};\n\nclass SaveFileWriter : public SaveWriter {\n    // TODO: override save, print \"saved to file\"\n};\n\nclass CloudSaveWriter : public SaveWriter {\n    // TODO: override save, print \"saved to cloud\"\n};\n\nclass CharacterCreator {\n    // TODO: a SaveWriter& member, a constructor that takes one,\n    // and initiateCharacterCreation(const Data&) that builds a Character and saves it\n};\n\nclass CharacterCreationUI {\n    Data characterData;\npublic:\n    CharacterCreationUI(const string& typed) : characterData{typed} {}\n    Data getData() const { return characterData; }\n};\n\nclass Game {\n    CharacterCreationUI& characterUI;\n    CharacterCreator& characterCreator;\npublic:\n    Game(CharacterCreationUI& ui, CharacterCreator& cc) : characterUI(ui), characterCreator(cc) {}\n    void createCharacter() {\n        // TODO: slide 99\n    }\n};\n\nint main() {\n    CharacterCreationUI ui(\"Thrall\");\n    SaveFileWriter file;\n    CloudSaveWriter cloud;\n    CharacterCreator localCreator(file);\n    CharacterCreator onlineCreator(cloud);\n    Game offline(ui, localCreator);\n    Game online(ui, onlineCreator);\n    offline.createCharacter();\n    online.createCharacter();\n    return 0;\n}\n", "expected": "saved to file\nsaved to cloud", "hints": ["<code>virtual void save(const Character&amp; c) = 0;</code> in SaveWriter; <code>void save(const Character&amp;) override { cout &lt;&lt; \"saved to file\" &lt;&lt; endl; }</code> in the writers.", "CharacterCreator: <code>SaveWriter&amp; saveWriter;</code>, <code>CharacterCreator(SaveWriter&amp; w) : saveWriter(w) {}</code>, then <code>Character myChar{data.name}; saveWriter.save(myChar);</code>.", "Game: <code>Data data = characterUI.getData(); characterCreator.initiateCharacterCreation(data);</code>"], "solution": "#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Data { string name; };\nstruct Character { string name; };\n\nclass SaveWriter {\npublic:\n    virtual ~SaveWriter() {}\n    virtual void save(const Character& c) = 0;\n};\n\nclass SaveFileWriter : public SaveWriter {\npublic:\n    void save(const Character&) override { cout << \"saved to file\" << endl; }\n};\n\nclass CloudSaveWriter : public SaveWriter {\npublic:\n    void save(const Character&) override { cout << \"saved to cloud\" << endl; }\n};\n\nclass CharacterCreator {\n    SaveWriter& saveWriter;\npublic:\n    CharacterCreator(SaveWriter& w) : saveWriter(w) {}\n    void initiateCharacterCreation(const Data& data) {\n        Character myChar{data.name};\n        saveWriter.save(myChar);\n    }\n};\n\nclass CharacterCreationUI {\n    Data characterData;\npublic:\n    CharacterCreationUI(const string& typed) : characterData{typed} {}\n    Data getData() const { return characterData; }\n};\n\nclass Game {\n    CharacterCreationUI& characterUI;\n    CharacterCreator& characterCreator;\npublic:\n    Game(CharacterCreationUI& ui, CharacterCreator& cc) : characterUI(ui), characterCreator(cc) {}\n    void createCharacter() {\n        Data data = characterUI.getData();\n        characterCreator.initiateCharacterCreation(data);\n    }\n};\n\nint main() {\n    CharacterCreationUI ui(\"Thrall\");\n    SaveFileWriter file;\n    CloudSaveWriter cloud;\n    CharacterCreator localCreator(file);\n    CharacterCreator onlineCreator(cloud);\n    Game offline(ui, localCreator);\n    Game online(ui, onlineCreator);\n    offline.createCharacter();\n    online.createCharacter();\n    return 0;\n}\n" }
```

`main` shows the payoff of DIP: the same `Game` and `CharacterCreator` code saves to a file or to the cloud depending only on which `SaveWriter` was handed in. The `vector<UIWidget*>` of the LSP slides is the same idea; here it is one reference instead of a list.

```quiz
[
  {
    "q": "Which exception type is the model answer for the Fraction constructor, and why?",
    "options": ["`std::runtime_error`, because the error happens while running", "`std::invalid_argument`, because a zero denominator is a caller's mistake in the `logic_error` family", "`std::bad_alloc`, because no object is allocated", "a `const char*`, because the question only asks for a message"],
    "answer": 1,
    "explain": "A logic_error is a bug that could have been detected before the call; invalid_argument is its child for a bad parameter value. It is declared in <stdexcept>."
  },
  {
    "q": "After `Fraction bad(1, 0);` throws inside a try block, which happen? (select all)",
    "options": ["`bad`'s destructor runs", "the fully constructed `half` is destroyed before the handler runs", "the statement after the throw is skipped", "no `Fraction` object named `bad` ever exists"],
    "answer": [1, 2, 3],
    "explain": "A constructor that throws creates no object, so there is nothing to destroy; locals that were completed are destroyed during unwinding, then the handler runs."
  },
  {
    "q": "What prints?",
    "code": "try {\n    throw invalid_argument(\"zero\");\n} catch (exception& e) {\n    cout << \"exception\";\n} catch (invalid_argument& e) {\n    cout << \"invalid_argument\";\n}",
    "options": ["invalid_argument", "both, in order", "a compile error", "exception"],
    "answer": 3,
    "explain": "The first handler with a matching type runs. invalid_argument is-an exception, so the parent handler catches it; g++ only warns that the second handler is unreachable."
  },
  {
    "q": "`throw 42;` inside a try block whose handlers are `catch (exception&)` and `catch (logic_error&)` leads to...",
    "options": ["`std::terminate`", "the first handler", "the second handler", "the int converting to an exception"],
    "answer": 0,
    "explain": "An int matches neither class type. With no matching handler anywhere up the stack, terminate is called, then abort. Only catch (...) would take it."
  },
  {
    "q": "In slide 90's design, `CharacterCreationUI` both collects input and owns the `SaveFileWriter`. Which principle names that fault?",
    "options": ["Liskov Substitution", "Interface Segregation", "Single Responsibility", "Law of Demeter"],
    "answer": 2,
    "explain": "Two reasons to change (the input form and the save format) in one class. Slide 91 moves saving into CharacterCreator."
  },
  {
    "q": "Which part of slide 91 is the Dependency Inversion box?",
    "options": ["Game and CharacterCreationUI", "CharacterCreator, SaveWriter, SaveFileWriter and CloudSaveWriter", "Game and CharacterCreator", "Data and Character"],
    "answer": 1,
    "explain": "The high-level CharacterCreator and the low-level writers both depend on the abstraction SaveWriter; neither depends on the other."
  },
  {
    "q": "In the finished program, what has to change to add a third writer that saves to a database?",
    "options": ["Game, CharacterCreator and main", "CharacterCreator only", "nothing except a new class extending SaveWriter and the line in main that chooses it", "CharacterCreationUI"],
    "answer": 2,
    "explain": "Open for extension, closed for modification: a new SaveWriter subclass overrides save and is handed to the existing CharacterCreator."
  },
  {
    "q": "Slide 99's `Game::createCharacter` calls `characterUI.getData()` and `characterCreator.initiateCharacterCreation(data)`. Why is this better than slide 97's `characterUI.getCharacterCreator().save(...)` by the Law of Demeter?",
    "options": ["it is shorter", "Game now talks only to its own members, not to classes reached through their return values", "getData is faster", "it avoids virtual dispatch"],
    "answer": 1,
    "explain": "Only talk to your friends; don't talk to strangers. CharacterCreator reached through the UI's getter is a stranger to Game."
  }
]
```

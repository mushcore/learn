---
title: Dependency Inversion and the Law of Demeter
minutes: 22
---

The DataSource diagram from the coupling lesson was built from Open/Closed and Liskov Substitution; the D of SOLID names what the two achieve together. After it comes a principle outside SOLID that limits how far one class may reach through another.

## High-level modules and low-level modules

The Dependency Inversion Principle *can be thought as a combined effect of the previous principles. Specifically, the Open Closed Principle and Liskov Substitution Principle.*

Slide 83 returns to `UI` pointing at `TextFile`. *High Level Modules are the ones that contain complex logic made up of small "chunks" of simpler code*, for example the UI class. *A Low Level Module on the other hand, is a class that encapsulates some simple atomic behaviour*, such as reading a file or displaying an image. We generally compose high-level modules with low-level modules, so the high level is coupled to and dependent on the low level. *We want to be able to change or replace the lower level modules without tampering with the complex code in the higher level modules.*

## The two rules

Slide 87 draws the red cross on `UI` pointing straight at `Text File` and the green check on `UI` pointing at `DataSource` with `TextFile` extending it on a dashed line:

1. **High-level modules should not depend on low-level modules. High-level modules and low-level modules should depend on abstractions.**
2. **Abstractions should not depend on details. Details should depend on abstractions.**

*We introduced an abstract layer, that does not depend on anything. We made both our high level (UI) and low level (TextFile) modules depend on the abstract instead. Now we can switch out either side.* Slide 86 hangs `SQLiteDB`, `TextFile` and `JSONFile` under the same `DataSource` and names its building blocks: Liskov Substitution and Open/Closed.

`DataSource` is the abstract class or interface; `UI` and `TextFile` are concrete classes. Interfaces and abstract classes declare an interface and can NOT be instantiated; concrete classes implement the details of the interface, are fully implemented, and CAN be instantiated.

```widget
uml-relations
{ "relation": "Realization (implementation)", "title": "The slide's 'Extends' dashed arrow from TextFile up to DataSource" }
```

## A UI that holds a DataSource reference

Slide 85 lists `retrieve()`, `update()`, `search()` and `delete()` on DataSource; `delete` is a C++ keyword, so the program uses the slide-50 names `read()`, `write()` and `search()`.

```cpp run pin datasource_dip.cpp
// predict: Write the five lines printed.
#include <iostream>
#include <string>
using namespace std;

class DataSource {                    // the abstraction: depends on nothing
public:
    virtual ~DataSource() {}
    virtual string read() = 0;
    virtual void write(const string& text) = 0;
    virtual bool search(const string& word) = 0;
};

class TextFile : public DataSource {  // low-level module, depends on the abstraction
    string contents = "hello from a text file";
public:
    string read() override { return contents; }
    void write(const string& text) override { contents = text; cout << "text file written" << endl; }
    bool search(const string& word) override { return contents.find(word) != string::npos; }
};

class JsonFile : public DataSource {
    string contents = "{\"msg\": \"hello from json\"}";
public:
    string read() override { return contents; }
    void write(const string& text) override { contents = "{\"msg\": \"" + text + "\"}"; cout << "json serialized and written" << endl; }
    bool search(const string& word) override { return contents.find(word) != string::npos; }
};

class UI {                            // high-level module, depends on the abstraction
    DataSource& dataSource;
public:
    UI(DataSource& source) : dataSource(source) {}
    void show() { cout << "UI shows: " << dataSource.read() << endl; }
    void save(const string& text) { dataSource.write(text); }
};

int main() {
    TextFile text;
    JsonFile json;
    UI screen1(text);
    UI screen2(json);                 // same UI code, different source
    screen1.show();
    screen2.show();
    screen2.save("saved by the UI");
    screen2.show();
    cout << boolalpha << json.search("UI") << endl;
    return 0;
}
```

`DataSource& dataSource;` is the only thing UI knows about storage; the word `TextFile` appears nowhere in UI. `class TextFile : public DataSource {` is the dashed Extends arrow: the detail depends on the abstraction. `UI screen2(json);` is rule 1 paying off: the same UI code runs over a JSON file, and a SQLite class would slot in with UI untouched.

## The character-creation exercise

Slide 90: a game with a Character Creation UI; when the player clicks create, the character is saved to a save file locally or online. The design to fix is a chain, `Game` to `CharacterCreationUI` to `SaveFileWriter`: *apply everything you've learnt so far to "fix" this terrible design.*

"My Solution" on slide 91: `Game` points at `CharacterCreationUI` and at a new `CharacterCreator`; `CharacterCreator` points at an abstract `SaveWriter`, which `SaveFileWriter` and `CloudSaveWriter` extend. Three dashed boxes label the moves: Single Responsibility around Game and CharacterCreationUI (the UI only collects input), Single Responsibility around Game and CharacterCreator (Game no longer saves), and Dependency Inversion around CharacterCreator, SaveWriter and the two writers. The practice lesson builds this as code.

## Law of Demeter: only talk to your friends

Slide 94 is a real-life wallet. `Cashier` (`+takeMoney(amount)`) points at `Customer` (`-wallet : Wallet`, `+getWallet() : Wallet`), which points at `Wallet` (`-money : int`, `+getMoney(amount) : int`). The goal: Cashier wants to get int money from the Wallet, but should not reach into Customer, then into their Wallet, to get it. In Cashier `takeMoney()`: `money = customer.getWallet().getMoney(amount)` #BAD. *Classes should NOT have knowledge of public members several classes away.*

Slide 95 strikes out `getWallet()`, gives Customer `+getMoney(amount) : int` and Cashier `+requestMoney(amount)`. Cashier can access Customer, but should not access Wallet through Customer: in Cashier `requestMoney()`, `money = customer.getMoney(amount)` #OK!; in Customer `getMoney()`, `return wallet.getMoney(amount)`. *Classes should have knowledge of public members of neighboring classes.*

Slide wording: **Each unit should have only limited knowledge about other units: only units "closely" related to the current unit. Each unit should only talk to its friends; don't talk to strangers.** Don't have train wrecks like `obj.getX().getY().getZ().doSomething();` or `MyCharacterUI.GetCharacterData().CreateCharacter().Save()`. Poor Demeter is often forgotten; some call it the "Suggestion of Demeter" since it is difficult to avoid.

```widget
demeter-chain
{ "chain": "customer.getWallet().getMoney(amount)" }
```

## The cashier both ways

```cpp run pin wallet_demeter.cpp
// predict: The wallet starts with 50. Write the four lines printed.
#include <iostream>
using namespace std;

class Wallet {
    int money = 50;
public:
    int getMoney(int amount) {
        money -= amount;
        cout << "wallet gives " << amount << ", " << money << " left" << endl;
        return amount;
    }
};

class Customer {
    Wallet wallet;
public:
    Wallet& getWallet() { return wallet; }                        // hands a stranger out
    int getMoney(int amount) { return wallet.getMoney(amount); }  // talks to its own wallet
};

class Cashier {
    Customer& customer;
public:
    Cashier(Customer& c) : customer(c) {}
    int takeMoney(int amount) {
        int money = customer.getWallet().getMoney(amount);   // #BAD
        return money;
    }
    int requestMoney(int amount) {
        int money = customer.getMoney(amount);               // #OK!
        return money;
    }
};

int main() {
    Customer customer;
    Cashier cashier(customer);
    int got = cashier.takeMoney(20);
    cout << "cashier got " << got << endl;
    got = cashier.requestMoney(20);
    cout << "cashier got " << got << endl;
    return 0;
}
```

Both calls hand the cashier 20; the difference is what Cashier must know. `int money = customer.getWallet().getMoney(amount);   // #BAD` compiles only because Cashier knows that a Customer has a Wallet and that a Wallet has `getMoney`: two classes away, so a change to Wallet ripples into Cashier. `int money = customer.getMoney(amount);               // #OK!` knows only its neighbour, and `int getMoney(int amount) { return wallet.getMoney(amount); }` is the forwarding method that lets Customer talk to its own wallet. Calling several members of `customer` is still fine; the rule counts classes reached through return values, not calls.

```challenge
{
  "prompt": "Fix the train wreck. Give <code>Customer</code> a <code>getMoney(int amount)</code> that forwards to its own wallet, make <code>Cashier::requestMoney</code> call only that, and remove <code>getWallet()</code> so the stranger can no longer be handed out. Output must not change.",
  "starter": "#include <iostream>\nusing namespace std;\n\nclass Wallet {\n    int money = 50;\npublic:\n    int getMoney(int amount) {\n        money -= amount;\n        cout << \"wallet gives \" << amount << \", \" << money << \" left\" << endl;\n        return amount;\n    }\n};\n\nclass Customer {\n    Wallet wallet;\npublic:\n    Wallet& getWallet() { return wallet; }\n};\n\nclass Cashier {\n    Customer& customer;\npublic:\n    Cashier(Customer& c) : customer(c) {}\n    int requestMoney(int amount) {\n        return customer.getWallet().getMoney(amount);   // train wreck\n    }\n};\n\nint main() {\n    Customer customer;\n    Cashier cashier(customer);\n    int got = cashier.requestMoney(20);\n    cout << \"cashier got \" << got << endl;\n    return 0;\n}\n",
  "expected": "wallet gives 20, 30 left\ncashier got 20",
  "hints": ["Customer: <code>int getMoney(int amount) { return wallet.getMoney(amount); }</code>", "Cashier: <code>return customer.getMoney(amount);</code>, then delete getWallet(); if it still compiles, Cashier no longer reaches through Customer."],
  "solution": "#include <iostream>\nusing namespace std;\n\nclass Wallet {\n    int money = 50;\npublic:\n    int getMoney(int amount) {\n        money -= amount;\n        cout << \"wallet gives \" << amount << \", \" << money << \" left\" << endl;\n        return amount;\n    }\n};\n\nclass Customer {\n    Wallet wallet;\npublic:\n    int getMoney(int amount) { return wallet.getMoney(amount); }\n};\n\nclass Cashier {\n    Customer& customer;\npublic:\n    Cashier(Customer& c) : customer(c) {}\n    int requestMoney(int amount) {\n        return customer.getMoney(amount);\n    }\n};\n\nint main() {\n    Customer customer;\n    Cashier cashier(customer);\n    int got = cashier.requestMoney(20);\n    cout << \"cashier got \" << got << endl;\n    return 0;\n}\n"
}
```

## Game reaching through CharacterUI

Slide 97 applies the same rule to the character-creation solution:

```cpp
class Game {
    Data data;
    CharacterUI characterUI;
    void createCharacter() {
        data = characterUI.getCharacterCreator().save(characterUI.getCharacterCreator().createCharacter());
```

This code tries to create a character and save it; *this is obviously bad and hard to read code.* The UML has `Game` pointing at `CharacterCreationUI`, which owns `CharacterCreator`, which points at `SaveWriter`. *Any change in the save function, which is all the way in SaveWriter, could have a ripple effect of changes all the way to our Game class.*

```widget
demeter-chain
{ "chain": "characterUI.getCharacterCreator().save(characterUI.getCharacterCreator().createCharacter())" }
```

*There isn't one solution that fixes all Law of Demeter problems.* Here the solution is to restructure the system by swapping Game and CharacterCreationUI, so Game does not need to reach through CharacterCreationUI to get CharacterCreator. Slide 99's rule: *restructure code so each class is responsible for their own data*, which prevents classes reaching deeply into multiple classes.

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

Game owns both a `characterUI` and a `characterCreator` and asks each for one thing; only CharacterCreator talks to the SaveWriter. The `void getData()` that returns a value and the `my_char` / `myChar` spelling are the slide's own slips; the practice lesson writes the compiling version.

```widget
solid-spotter
{ "cases": ["dip", "demeter"], "shuffle": false }
```

```quiz
[
  {
    "q": "Dependency Inversion rule 1: high-level modules should not depend on low-level modules; both should depend on...",
    "options": ["the main function", "abstractions", "each other", "concrete classes"],
    "answer": 1,
    "explain": "UI (high level) and TextFile (low level) both point at DataSource. The abstraction is the layer that does not depend on anything, so either side can be switched out."
  },
  {
    "q": "Dependency Inversion rule 2: abstractions should not depend on ___. ___ should depend on abstractions.",
    "type": "text",
    "answer": ["details", "detail"],
    "explain": "Slide 88: abstractions should not depend on details; details should depend on abstractions. TextFile (a detail) extends DataSource; DataSource knows nothing about files."
  },
  {
    "q": "In the DataSource diagram, which can be instantiated? (select all)",
    "options": ["DataSource", "UI", "TextFile", "SQLiteDB"],
    "answer": [1, 2, 3],
    "explain": "Interfaces and abstract classes declare an interface and can NOT be instantiated. UI, TextFile and SQLiteDB are concrete, fully implemented classes and CAN be."
  },
  {
    "q": "The slides describe Dependency Inversion as the combined effect of which two principles?",
    "options": ["Single Responsibility and Interface Segregation", "Liskov Substitution and the Law of Demeter", "Single Responsibility and Open/Closed", "Open/Closed and Liskov Substitution"],
    "answer": 3,
    "explain": "Slide 82: specifically the Open Closed Principle and Liskov Substitution Principle. New data sources extend DataSource (OCP) and any of them can stand in for a DataSource (LSP)."
  },
  {
    "q": "Which line in Cashier breaks the Law of Demeter? Click it.",
    "type": "spotbug",
    "code": "int takeMoney(int amount) {\n    int money;\n    money = customer.getWallet().getMoney(amount);\n    return money;\n}",
    "answer": 3,
    "explain": "customer.getWallet() returns a Wallet, and calling getMoney on it means Cashier knows public members two classes away. Customer should offer getMoney(amount) and forward to its own wallet."
  },
  {
    "q": "Slide wording: each unit should only talk to its friends; don't talk to...",
    "options": ["strangers", "subclasses", "interfaces", "the database"],
    "answer": 0,
    "explain": "The Law of Demeter: limited knowledge about other units, only units closely related to the current one. A Wallet reached through a Customer is a stranger to the Cashier."
  },
  {
    "q": "Cashier calls `customer.getName()`, `customer.getMoney(20)` and `customer.getReceipt()` in the same function. This violates the Law of Demeter.",
    "type": "tf",
    "answer": false,
    "explain": "Several calls on the same neighbour are fine: Customer is a friend. Demeter counts classes reached THROUGH return values, like the Wallet in customer.getWallet().getMoney(). Classes should have knowledge of public members of neighbouring classes."
  },
  {
    "q": "On slide 98, the fix for `characterUI.getCharacterCreator().save(...)` is...",
    "options": ["add a getSaveWriter() getter to CharacterCreator", "make getCharacterCreator() return a reference instead of a copy", "restructure the system by swapping Game and CharacterCreationUI so Game owns the CharacterCreator directly", "catch an exception when the save fails"],
    "answer": 2,
    "explain": "There isn't one solution for every Demeter problem; here Game is restructured to hold both characterUI and characterCreator, asks the UI for its data and hands it to the creator. Adding getters would add more strangers, not fewer."
  },
  {
    "type": "match",
    "q": "Match each principle to its slide example.",
    "pairs": [["Dependency Inversion", "UI and TextFile both depend on DataSource"], ["Law of Demeter", "customer.getMoney(amount) instead of customer.getWallet().getMoney(amount)"], ["Open/Closed", "UISlider added as a new class, UIWidget untouched"], ["Interface Segregation", "Walkable, Swimmable, Flyable instead of one Animal with walk, swim, fly"]],
    "explain": "DIP: both sides depend on the abstraction. Demeter: talk to neighbours only. OCP: extend, do not modify. ISP: many small interfaces instead of one fat one."
  }
]
```

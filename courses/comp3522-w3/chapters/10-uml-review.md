---
title: UML review: class, collaboration, sequence diagrams
minutes: 15
---

The deck posted with Lab 3 reviews the three UML diagrams the assignments use: class diagrams for structure, collaboration and sequence diagrams for interactions. UML is language agnostic; learn each arrow's C++ spelling.

## Class diagrams

*Purpose is to describe the static structure of the system*: classes, their attributes and operations, and relationships.

### The class rectangle

*Top section is the name of the class*, the middle holds data members, the bottom member functions. A member is `name : type`, with any initial value after `=`; a function adds `(param : type)` and its return type: `+ deposit ( amount : int ) : void`.

```
          <<interface>>
          AbstractBank
------------------------------------
# abstractFunction() : string          italic: abstract

          BankAccount
------------------------------------
+ staticName : string                  underlined: static
+ publicName : string
# protectedOwner : string
- privateBalance : int = 0
------------------------------------
+ deposit ( amount : int ) : void
+ withdraw ( amount : int ) : void
# abstractFunction() : string
```

### Visibility, static, abstract and `<<interface>>`

Visibility prefixes each member: `+` public, `#` protected, `-` private. An underline marks a *static member or function*, italics an *abstract class or function*. `<<interface>>` above a class name marks an interface: pure virtual functions only.

### Six relationships, five verbs

Each gets a verb and the slide's code, plus the `public:` its footnote assumes. Every example uses this `ClassB`:

```cpp
class ClassB {
public:
    ClassB() {}
    void function() {}
};
```

**Dependency**, a dashed arrow from A to B: *A contains code that temporarily uses B in some way. A uses B*.

```cpp
class ClassA {
public:
    ClassA() {}
    ClassB aFunction(ClassB b) {
        b.function();     // Dependency. Calls a function in ClassB
        return ClassB();  // Dependency. Instantiates ClassB but doesn't save as data member
    }
};
```

**Association**, a solid line: *A contains data attributes B. A knows-a B. General form of composition and aggregation*. It *indicates no conceptual ownership* (Teacher and Student). The slide's `ClassB* savedPtrB, savedPtrB2;` makes only the first a pointer, so the code splits them. As on the slide, nothing deletes the `new ClassB`: it leaks.

```cpp
class ClassA {
public:
    ClassB savedB;        // Association: ClassA saves ClassB as data member
    ClassB* savedPtrB;
    ClassB* savedPtrB2;
    ClassA(ClassB& b) {
        savedPtrB = new ClassB;
        savedPtrB2 = &b;
    }
};
```

**Composition**, a filled diamond at A: *A is composed of B. A owns-a B, and if A is destroyed, B also destroyed*, *strong conceptual ownership* (House and Room). The slide leaves out the destructor `savedPtrB` needs.

```cpp
class ClassA {
public:
    ClassB savedB;        // Composition: ClassA owns instances of ClassB
    ClassB* savedPtrB;
    ClassA() {
        savedPtrB = new ClassB;
    }
    ~ClassA() { delete savedPtrB; }   // not on the slide
};
```

**Aggregation**, a hollow diamond at A: *A is aggregated with B. A has-a B, and if A is destroyed B still exists*, *weak conceptual ownership, A weakly owns B* (Library and Book). The `ClassB` is *passed in from external source*.

```cpp
class ClassA {
public:
    ClassB* savedPtrB2;   // Aggregation: ClassB passed in from external source
    ClassA(ClassB* b) {
        savedPtrB2 = b;
    }
};
```

Slide 11 restates the pair: *in a composition relationship, if the whole is destroyed, the parts cannot exist* (*If an Order is destroyed, then so are the OrderItems of which it is composed*; `Order` 0..1, filled diamond, `OrderItems` 1..*), and *in an aggregation relationship, if the class referencing it is destroyed, the referenced class can live on* (*If a Pond is destroyed, the Ducks can live on*; `Pond` 0..1, hollow diamond, `Ducks` 0..*).

**Generalization (inheritance)**, a solid line with a hollow triangle at A: *B derives from concrete or abstract class A*, and *B is-a A*.

```cpp
class ClassA {
public:
    int num;
    ClassA() {}
    void function() {}
};
class ClassB : public ClassA {};   // Generalization: ClassB inherits from ClassA
```

**Realization (implementation)**, a dashed line with a hollow triangle at A: *B implements interface A*, and *B is-a A for interfaces*. ClassA *ONLY has pure virtual functions, no data members or implemented functions*. The slide omits `virtual` from `void function() = 0;`, which cannot compile: only virtual functions can be pure.

```cpp
class ClassA {
public:
    ClassA() {}
    virtual void function() = 0;
    virtual void function2() = 0;
};
class ClassB : public ClassA {     // implements interface ClassA's pure virtual functions
public:
    void function() override {}
    void function2() override {}
};
```

### Multiplicity

*Multiplicity* is *how many instances of one class can be associated with instance of another*. *Read multiplicity by looking at number on opposite end of the line.* *Car owns-a (composition) carburetor*: the 1 at the carburetor end means a car has exactly 1 carburetor; the 0..1 at the car end means a carburetor belongs to 0 to 1 cars.

### Car, Wheel, Professor, Class, Person

- `Car`: public string `model`, private string `manufacturer`, public `turnRight`, `turnLeft`, `driveStraight`. `Wheel`: an int size. *Car uses-a (dependency) Wheel, perhaps instantiating it, or accessing its size*.
- *Professor has-a (aggregation) relationship with classes*, 1..* of them; each class, with its public list `listOfStudents`, is *shared to exactly 1 Professor*.
- `Person` (public string `name`, int `age`) has two *is-a (generalization)* derived classes: `Student` (public list `grades`) and `Professor` (public list `listOfStudents`).

## Collaboration (communication) diagrams

A collaboration diagram presents interactions between objects as a sequence of messages, from a **structural** perspective, for one use case or part of one. Its notation:

- **Object**: a square containing `object name : class name`, underlined.
- **Actor**: the invoker of the interaction; named, with a role (Customer).
- **Links**: solid lines connecting objects and actors; they are instances of the associations in the class diagram, and messages are sent across them.
- **Messages**: labelled arrows near a link, directed from sender to receiver, numbered to show the sequence; messages within the same call get decimals, 1.1, 1.2.

## Sequence diagrams

A sequence diagram shows the same messages from a **time-based** perspective, including the lifetime of the interaction. Time runs downward.

- **Actor**: interacts with the subject and is external to it: human users, external hardware, other subjects.
- **Lifeline**: one participant, its name and class in the top box, a dotted line marking its place in the sequence.
- **Activation**: a thin rectangle on the lifeline showing how long the element is performing an operation.
- **Messages**: a **call** message invokes an operation on the target lifeline (a method call); a **return** message passes information back to the caller (the return statement); a **self** message invokes an operation on the same lifeline; a **create** message instantiates the target lifeline.

The difference: a collaboration diagram numbers messages on a graph of links; a sequence diagram orders them top to bottom on lifelines.

### A checkout, one message at a time

Each step draws one message; the toggle redraws them as a collaboration diagram (1, 1.1, 1.2).

```widget
sequence-play
```

## Classify six new relationships and number a new collaboration

New classes, the same six relationships: name each one and its verb.

```quiz
[
  {
    "type": "match",
    "q": "Match each scenario to its UML relationship.",
    "pairs": [
      [
        "A `Playlist` stores `Song*` pointers passed in from the music library; deleting the playlist leaves the songs",
        "Aggregation: has-a (hollow diamond)"
      ],
      [
        "A `Window` creates its `Button`s with `new` and deletes them in its destructor",
        "Composition: owns-a (filled diamond)"
      ],
      [
        "`Report::print(Printer& p)` uses a printer only as a parameter",
        "Dependency: uses-a (dashed arrow)"
      ],
      [
        "`class Manager : public Employee`",
        "Generalization: is-a (solid line, hollow triangle)"
      ],
      [
        "`Dog` implements every pure virtual function of the interface `Pet`",
        "Realization: is-a for interfaces (dashed line, hollow triangle)"
      ],
      [
        "A `Doctor` keeps a `Patient*` member; neither owns the other",
        "Association: knows-a (solid line)"
      ]
    ],
    "explain": "Inheriting from a class is generalization and implementing an interface is realization, both is-a. A part created by the whole and destroyed with it is composition (owns-a). A pointer passed in from outside, whose object still exists when the holder is destroyed, is aggregation (has-a, weakly owns). A data member with no conceptual ownership is plain association (knows-a), and using B only as a parameter or local is dependency (uses-a)."
  },
  {
    "q": "Which relationship does this C++ describe? `class Invoice { std::vector<LineItem> items; };`",
    "options": [
      "Composition: the invoice owns-a set of line items, destroyed with it",
      "Aggregation: the invoice has-a set of line items passed in from outside",
      "Dependency: the invoice uses-a LineItem in a method",
      "Generalization: Invoice is-a LineItem"
    ],
    "answer": 0,
    "explain": "The `LineItem`s live inside the invoice's vector, so destroying the `Invoice` destroys them: A owns-a B, a filled diamond at `Invoice`. This is the deck's Order and OrderItems example in new names."
  },
  {
    "q": "The program prints each message as it is sent. On a collaboration diagram numbered from `1: checkout()`, which number does `charge()` get?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Payment\n{\npublic:\n    void charge() { cout << \"charge \"; }\n};\n\nclass Cart\n{\n    Payment payment;\npublic:\n    int total() { cout << \"total \"; return 42; }\n    void checkout()\n    {\n        cout << \"checkout \";\n        total();\n        payment.charge();\n    }\n};\n\nint main()\n{\n    Cart cart;\n    cart.checkout();\n    cout << endl;\n    return 0;\n}",
    "options": [
      "`1.2`",
      "`2`",
      "`3`",
      "`1.1`"
    ],
    "answer": 0,
    "explain": "The actor's call is `1: checkout()`. Messages sent while `checkout` is still running get decimals in order: `total()` is 1.1 and `charge()` is 1.2. The output `checkout total charge` shows the same order a sequence diagram would draw top to bottom."
  },
  {
    "q": "On a sequence diagram of the same program, which kind of message is `total()` from `Cart` to itself?",
    "options": [
      "A self message",
      "A create message",
      "A return message",
      "A call message to another lifeline"
    ],
    "answer": 0,
    "explain": "`checkout()` calls `total()` on the same `Cart` object, so the arrow loops back to the same lifeline: a self message. `charge()` is a call message to the `Payment` lifeline, and `return 42` would be drawn as a dashed return."
  }
]
```

```quiz
[
  {
    "q": "The three sections of a class rectangle, top to bottom, are...",
    "options": ["member functions, data members, name", "name, data members, member functions", "name, member functions, data members", "data members, name, member functions"],
    "answer": 1,
    "explain": "Top: the class name. Middle: data members, as `name : type`. Bottom: member functions, as `name(param : type) : returnType`."
  },
  {
    "q": "In a class diagram, `<<interface>>` written above the class name `Shape` means...",
    "options": ["Shape is an interface: it has only pure virtual functions, which realizing classes implement", "every member of Shape is static", "Shape is a private class", "Shape depends on another class"],
    "answer": 0,
    "explain": "The deck draws `<<interface>> AbstractBank` this way. An interface ONLY has pure virtual functions, no data members or implemented functions, and a class that implements it is joined to it by realization."
  },
  {
    "type": "match",
    "q": "Match each relationship to its definition from the deck.",
    "pairs": [
      ["Dependency", "A contains code that temporarily uses B: A uses B"],
      ["Association", "A contains data attributes B: A knows-a B, no conceptual ownership"],
      ["Composition", "A owns-a B; if A is destroyed, B is also destroyed"],
      ["Aggregation", "A has-a B and weakly owns it; if A is destroyed, B still exists"],
      ["Generalization", "B derives from concrete or abstract class A: B is-a A"],
      ["Realization", "B implements interface A: B is-a A for interfaces"]
    ],
    "explain": "Association is the general form; composition (strong ownership, filled diamond) and aggregation (weak ownership, hollow diamond) are its specific forms. Generalization and realization are both is-a with a hollow triangle at A, solid versus dashed. Dependency stores nothing: it uses B temporarily."
  },
  {
    "q": "A line joins `Library` and `Book`. Next to `Library` is written `0..1`; next to `Book` is written `0..*`. How many libraries can one book belong to?",
    "options": ["0 to 1", "0 or more", "exactly 1", "1 or more"],
    "answer": 0,
    "explain": "Read multiplicity by looking at the number on the opposite end of the line. From a book, the opposite end is `Library`, which says `0..1`. From a library, the opposite end says `0..*`: a library has any number of books."
  },
  {
    "q": "If an Order is destroyed, so are its OrderItems. Which relationship and which diamond?",
    "options": ["Aggregation, hollow diamond", "Composition, filled diamond", "Association, no diamond", "Dependency, dashed arrow"],
    "answer": 1,
    "explain": "Composition: the Order owns-a set of OrderItems, and the parts cannot exist without the whole. The deck's other example, Pond and Ducks, is aggregation because the Ducks live on."
  },
  {
    "q": "In the deck's Car diagram, Car instantiates a Wheel or reads its size inside a function, but stores no Wheel. That is...",
    "options": ["composition", "aggregation", "dependency", "generalization"],
    "answer": 2,
    "explain": "Car uses-a Wheel: dependency, code that temporarily uses B without saving it as a data member."
  },
  {
    "q": "Which C++ declaration matches a generalization arrow from `Student` to `Person`?",
    "options": ["`class Person : public Student`", "`class Student : public Person`", "`Person* student;`", "`class Student { Person p; };`"],
    "answer": 1,
    "explain": "The hollow triangle points at the base class. In the deck's letters, B derives from A as `class ClassB : public ClassA`; here Student is-a Person."
  },
  {
    "q": "Messages 1.1 and 1.2 in a collaboration diagram are...",
    "options": ["errors", "messages sent within the same call as message 1", "return values", "messages from two different actors"],
    "answer": 1,
    "explain": "Messages are numbered for sequence; messages in the same call get additional decimals."
  },
  {
    "q": "What distinguishes a sequence diagram from a collaboration diagram?",
    "options": ["Sequence diagrams show classes, collaboration diagrams show objects", "A sequence diagram takes a time-based perspective (messages ordered top to bottom on lifelines); a collaboration diagram is structural (numbered messages on links)", "Only sequence diagrams have actors", "There is no difference"],
    "answer": 1,
    "explain": "Same messages, different perspective: time versus structure. Sequence diagrams also show the lifetime of the interaction through activations."
  },
  {
    "q": "On a sequence diagram, the thin rectangle on a lifeline is...",
    "options": ["a create message", "an activation: the duration an element is performing an operation", "an actor", "a return message"],
    "answer": 1,
    "explain": "Activations mark how long the participant is busy with an operation. Call, return, self and create are the four message kinds."
  }
]
```

---
title: UML review: class, collaboration, sequence diagrams
minutes: 15
---

The term's assignments describe designs in UML before any C++ is written, so the deck posted with Lab 3 reviews the three diagrams you will read and draw: class diagrams for structure, collaboration and sequence diagrams for interactions. UML is language agnostic; every arrow here has a C++ spelling, and that mapping is what to learn.

## Class diagrams

A class diagram describes the **static structure** of a system: the classes, their attributes and operations, and the relationships among them. Each class is a rectangle in three sections: the name on top, the attributes with their types in the middle, the methods at the bottom. The deck's example: a `Car` with two strings `model` and `manufacturer` and methods `turnRight`, `turnLeft`, `driveStraight`.

Arrows say how two classes are related:

```widget
uml-relations
```

| Relationship | Arrow | Meaning | C++ |
|---|---|---|---|
| Association | solid line | reference-based: A contains member variables of B | a member of type B, `B*` or `B&` |
| Generalization (inheritance) | solid line, hollow triangle at the base | A is a specialized form of B | `class A : public B` |
| Realization (implementation) | dashed line, hollow triangle | A implements the behaviour interface B specifies | `class A : public B` where B is pure virtual (Week 4) |
| Dependency | dashed arrow | A communicates with B without necessarily containing one; a method of A uses B | B as a parameter or local variable |
| Composition | solid line, **filled** diamond at the whole | A is made up of B; the parts cannot exist without the whole | B members held by value (or owned and deleted by A) |
| Aggregation | solid line, **hollow** diamond at the whole | A references B; B lives on if A is destroyed | pointers to B that A does not own |

The deck's two multiplicity examples: an `order` (0..1) composed of `order_items` (1..*), so destroying the order destroys its items; a `pond` (0..1) aggregating `ducks` (0..*), so the ducks live on when the pond is destroyed. A `Car` is composed of exactly 1 `carburetor`, and a carburetor belongs to 0..1 cars. A `Professor` aggregates 1..* classes and each class has exactly 1 professor. `Person` (string name, int age) is generalized by `Student` (a list of grades) and `Professor` (a list of students).

:::quiz Composition versus aggregation
Both are "has a"; the diamond's fill answers one question: does the part die with the whole? Filled diamond, yes (order items). Hollow diamond, no (ducks). The multiplicities at each end are a separate fact.
:::

## Collaboration (communication) diagrams

A collaboration diagram presents interactions between objects as a sequence of messages, from a **structural** perspective, for one use case or part of one. Its notation:

- **Object**: a square containing `object name : class name`, underlined.
- **Actor**: the invoker of the interaction; named, with a role (Customer).
- **Links**: solid lines connecting objects and actors; they are instances of the associations in the class diagram, and messages are sent across them.
- **Messages**: labelled arrows near a link, directed from sender to receiver, numbered to show the sequence; messages within the same call get decimals, 1.1, 1.2.

Read one by following the numbers, and you can name the use case it illustrates.

## Sequence diagrams

A sequence diagram shows the same messages from a **time-based** perspective, including the lifetime of the interaction. Time runs downward.

- **Actor**: interacts with the subject and is external to it: human users, external hardware, other subjects.
- **Lifeline**: one participant, its name and class in the top box, a dotted line marking its place in the sequence.
- **Activation**: a thin rectangle on the lifeline showing how long the element is performing an operation.
- **Messages**: a **call** message invokes an operation on the target lifeline (a method call); a **return** message passes information back to the caller (the return statement); a **self** message invokes an operation on the same lifeline; a **create** message instantiates the target lifeline.

Structure versus time is the whole difference: a collaboration diagram numbers the messages on a graph of links; a sequence diagram orders them top to bottom on lifelines.

```quiz
[
  {
    "q": "The purpose of a class diagram is to describe...",
    "options": ["the order in which methods are called", "the static structure of the system: classes, attributes, operations and relationships", "the user interface", "the runtime memory layout"],
    "answer": 1,
    "explain": "Class diagrams are static; collaboration and sequence diagrams show interactions."
  },
  {
    "q": "The three sections of a class rectangle, top to bottom, are...",
    "options": ["methods, attributes, name", "name, attributes and types, methods", "name, methods, attributes", "attributes, name, methods"],
    "answer": 1,
    "explain": "Top: the class name. Middle: attributes with their types. Bottom: the operations."
  },
  {
    "type": "match",
    "q": "Match each relationship to its description from the deck.",
    "pairs": [
      ["Association", "reference-based: A contains member variables of B"],
      ["Generalization", "A is a subclass (specialized form) of B"],
      ["Realization", "A implements the behaviours that interface B specifies"],
      ["Dependency", "A has methods that use B without necessarily containing an instance"],
      ["Composition", "parts cannot exist without the whole (filled diamond)"],
      ["Aggregation", "the referenced objects live on if the referencing class is destroyed (hollow diamond)"]
    ],
    "explain": "Two solid-line 'has a' relationships differ by diamond fill; two triangle-headed 'is a' relationships differ by dashed (realization) versus solid (generalization); dependency is the dashed arrow with no ownership."
  },
  {
    "q": "If an order is destroyed, so are its order_items. Which relationship and which diamond?",
    "options": ["Aggregation, hollow diamond", "Composition, filled diamond", "Association, no diamond", "Dependency, dashed arrow"],
    "answer": 1,
    "explain": "Composition: the parts cannot exist without the whole. The deck's other example, pond and ducks, is aggregation because the ducks live on."
  },
  {
    "q": "In the deck's Car diagram, some method of Car uses Wheel as a local variable or parameter, but Car stores no Wheel. That is...",
    "options": ["composition", "aggregation", "dependency", "generalization"],
    "answer": 2,
    "explain": "Dependency: communication between two classes where one does not necessarily contain an instance of the other."
  },
  {
    "q": "Which C++ declaration matches a generalization arrow from `Student` to `Person`?",
    "options": ["`class Person : public Student`", "`class Student : public Person`", "`Person* student;`", "`class Student { Person p; };`"],
    "answer": 1,
    "explain": "The hollow triangle points at the base class; Student is the specialized form."
  },
  {
    "q": "In a collaboration diagram, how is an object drawn?",
    "options": ["A circle with its class name", "A square containing 'object name : class name', underlined", "A stick figure", "A dashed vertical line"],
    "answer": 1,
    "explain": "Objects are squares with name and class separated by a colon and underlined; actors are the invokers; links are solid lines carrying numbered messages."
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

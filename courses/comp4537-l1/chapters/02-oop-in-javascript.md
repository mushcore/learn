---
title: Inheritance is is-a, composition is has-a
minutes: 15
---

JavaScript has classes, and a class can get its behaviour two ways: by extending another class or by holding an object of another class. The labs are written in classes from Lab 1 on, so both relationships come up from the first week.

<!-- facts: slide 6 divider; slide 7 Vehicle/Car, extends, super, is-a; slide 8 Engine/Car composition, has-a, template strings, string interpolation, backtick; slide 9 key differences; slide 10 questions; slides 11-12 ElectricCar, SportsCar, Tesla and Ferrari output; slide 15 button exercise -->

## A Car is a Vehicle (slide 7)

Slide 7 creates *a general vehicle class* and extends it to *a specific type of vehicle, a car*. *This shows the "is-a" relationship*. The three code boxes on the slide are joined into one program here.

```js run pin vehicle-and-car.js
// predict: Write the two lines this prints.
// Base class Vehicle
class Vehicle {
  constructor(brand) {
    this.brand = brand;
  }

  start() {
    console.log('Starting the vehicle...');
  }
}

// Car class inherits from Vehicle
class Car extends Vehicle {
  constructor(brand, engineType) {
    super(brand);
    this.engineType = engineType;
  }

  displayDetails() {
    console.log(`This is a ${this.brand} car with a ${this.engineType} engine.`);
  }
}

let myCar = new Car('BCITMadeCar', 'V1');
myCar.start();
myCar.displayDetails();
```

```output
Starting the vehicle...
This is a BCITMadeCar car with a V1 engine.
```

`Car` has no `start()` of its own, so `myCar.start()` finds the one `Car` inherited from `Vehicle`. The slide's callout asks *What does 'super' do?* and leaves it open. Worked out: `super(brand);` calls the parent class's constructor, which runs `this.brand = brand` for the new car. A class that `extends` another must call `super` before it uses `this`.

```diagram
{ "type": "flow", "title": "Vehicle and Car", "nodes": [ { "id": "veh", "label": "Vehicle", "sub": "brand, start()" }, { "id": "car", "label": "Car", "sub": "engineType, displayDetails()" }, { "id": "obj", "label": "myCar", "kind": "pill" } ], "edges": [ { "from": "veh", "to": "car", "label": "Extend to" }, { "from": "car", "to": "veh", "label": "is a", "dashed": true }, { "from": "obj", "to": "car", "label": "Instantiate from" } ], "hi": ["car"], "caption": "A car is a type of vehicle, inheriting its properties and methods." }
```

## A Car has an Engine (slide 8)

The second design keeps `Car` and `Engine` as separate classes and gives the car an engine object. *This shows the "has-a" relationship where a car "has an" engine.*

```js run pin car-has-engine.js
// predict: Write the two lines this prints.
// Engine class
class Engine {
  constructor(type) {
    this.type = type;
  }

  start() {
    console.log(`Starting the ${this.type} engine...`);
  }
}

// Car class has an Engine
class Car {
  constructor(brand, engine) {
    this.brand = brand;
    this.engine = engine;
  }

  start() {
    this.engine.start();
    console.log(`The ${this.brand} car is now running.`);
  }
}

let myEngine = new Engine('V1');
let myCar = new Car('BCITmadeCar', myEngine);
myCar.start();
```

```output
Starting the V1 engine...
The BCITmadeCar car is now running.
```

`Car` does not extend anything. Its `start()` first delegates with `this.engine.start()`, so the engine's line prints first, then the car's own line.

```diagram
{ "type": "flow", "title": "Car has an Engine", "nodes": [ { "id": "obj", "label": "myCar", "kind": "pill" }, { "id": "car", "label": "Car", "sub": "brand, engine" }, { "id": "eng", "label": "Engine", "sub": "type, start()" } ], "edges": [ { "from": "obj", "to": "car", "label": "Instantiate from" }, { "from": "car", "to": "eng", "label": "has a" } ], "hi": ["eng"], "caption": "Car has an Engine as a component." }
```

### Template strings

The strings inside those `console.log` calls are template strings. *Automatic replacing of variables with real values is called string interpolation*, and *we do that using backtick ( ` ) characters instead of double or single quotes*.

```js run pin template-string.js
// predict: Write every line this prints.
let firstName = "John";
let lastName = "Doe";
let text = `Welcome ${firstName},
${lastName}!`;
console.log(text);
```

```output
Welcome John,
Doe!
```

`${firstName}` becomes `John`. A template string also keeps a line break typed inside it, so `text` prints on two lines.

## Composition is the more flexible design (slides 9 and 10)

Slide 9 states the key differences:

- *In the inheritance example, Car is a type of Vehicle, inheriting its properties and methods.*
- *In the composition example, Car has an Engine as a component.*
- *The composition approach allows more flexibility.*
- *For instance, you can easily swap out the Engine for another type without needing to change the Car class. This flexibility is a key advantage of composition over inheritance.*

```diagram
{ "type": "flow", "title": "Swapping the engine", "nodes": [ { "id": "eng", "label": "Engine", "sub": "'V1'" }, { "id": "car", "label": "Car", "sub": "unchanged" }, { "id": "eng2", "label": "another Engine", "sub": "'Electric'" } ], "edges": [ { "from": "car", "to": "eng", "label": "has a", "dashed": true }, { "from": "car", "to": "eng2", "label": "has a" } ], "hi": ["eng2"], "caption": "You can easily swap out the Engine for another type without needing to change the Car class." }
```

Slide 10 asks two questions without answers. Worked out from slides 7 to 9: yes, JavaScript has classes, with `class`, `constructor`, `extends` and `super`. *Favor composition over inheritance* means: when a class needs another's behaviour, prefer holding an object of it (has-a) to extending it (is-a), because the part can be swapped without changing the class.

## A Tesla and a Ferrari use both (slides 11 and 12)

Slide 11 adds `ElectricCar extends Car` and a `SportsCar` that extends `Car` and also holds an `Engine`, so it is both is-a and has-a. Slide 12 builds the two cars. The slide's template strings run over two lines; that is editor word-wrap, since slide 12's output prints each on one line, so they are written on one line here.

```js run pin tesla-and-ferrari.js
// predict: Write the four lines this prints.
class Car {
  constructor(make) {
    this.make = make;
  }
  drive() {
    return `${this.make} is driving.`;
  }
}
class ElectricCar extends Car {
  constructor(make, batteryLife) {
    super(make);
    this.batteryLife = batteryLife;
  }
  charge() {
    return `${this.make} is charging with ${this.batteryLife}% battery remaining.`;
  }
}
class Engine {
  constructor(type) {
    this.type = type;
  }
  startEngine() {
    return `The ${this.type} engine is starting.`;
  }
}
class SportsCar extends Car {
  constructor(make, engine) {
    super(make);
    this.engine = engine;
  }
  accelerate() {
    return `${this.make} is accelerating with a ${this.engine.startEngine()}`;
  }
}

const tesla = new ElectricCar('Tesla', 80);
console.log(tesla.drive());
console.log(tesla.charge());
const v8Engine = new Engine('V8');
const ferrari = new SportsCar('Ferrari', v8Engine);
console.log(ferrari.drive());
console.log(ferrari.accelerate());
```

```output
Tesla is driving.
Tesla is charging with 80% battery remaining.
Ferrari is driving.
Ferrari is accelerating with a The V8 engine is starting.
```

`ferrari.drive()` comes from `Car`, so the Ferrari is a car. The last line reads *with a The V8 engine*: `accelerate()` places the whole sentence from `startEngine()` after *with a*. That is the program's real output, not a typo.

```diagram
{ "type": "tree", "title": "The Tesla and Ferrari classes", "nodes": [ { "id": "car", "label": "Car", "sub": "make, drive()" }, { "id": "ec", "label": "ElectricCar", "sub": "extends Car", "parent": "car" }, { "id": "sc", "label": "SportsCar", "sub": "extends Car", "parent": "car" }, { "id": "eng", "label": "Engine", "sub": "has an (composition)", "kind": "note", "parent": "sc" } ], "hi": ["sc"], "caption": "SportsCar is a Car and has an Engine." }
```

Slide 15 then sets an exercise in the same style: a class of buttons, n buttons on screen each with its own colour, n defined at the top between 3 and 10, then a method that moves the buttons to a random place in the window. Lab 1 is built on that shape.

## Trace three new class designs

Each program below is new. Find where every method is defined before writing the output.

```quiz
[
  {
    "q": "What does this print?",
    "code": "class Account {\n  constructor(owner) {\n    this.owner = owner;\n    this.balance = 0;\n  }\n  deposit(amount) {\n    this.balance += amount;\n    return `${this.owner} has ${this.balance}`;\n  }\n}\nclass SavingsAccount extends Account {\n  constructor(owner, rate) {\n    super(owner);\n    this.rate = rate;\n  }\n  addInterest() {\n    this.balance += this.balance * this.rate;\n    return `${this.owner} now has ${this.balance}`;\n  }\n}\nconst savings = new SavingsAccount('Mia', 0.5);\nconsole.log(savings.deposit(200));\nconsole.log(savings.addInterest());\nconsole.log(savings instanceof Account);",
    "options": [
      "Mia has 200\nMia now has 300\ntrue",
      "Mia has 200\nMia now has 300\nfalse",
      "Mia has 200\nMia now has 100\ntrue",
      "undefined has 200\nundefined now has 300\ntrue"
    ],
    "answer": 0,
    "explain": "`super(owner)` runs `Account`'s constructor, so `owner` is `'Mia'` and `balance` starts at 0. `deposit` is inherited: balance 200. `addInterest` adds 200 × 0.5 = 100: balance 300. A `SavingsAccount` is an `Account`, so `instanceof Account` is `true`."
  },
  {
    "q": "Two printers share one paper tray. What does this print?",
    "code": "class Tray {\n  constructor(sheets) {\n    this.sheets = sheets;\n  }\n  take(n) {\n    this.sheets -= n;\n    return this.sheets;\n  }\n}\nclass Printer {\n  constructor(name, tray) {\n    this.name = name;\n    this.tray = tray;\n  }\n  print(pages) {\n    const left = this.tray.take(pages);\n    console.log(`${this.name} printed ${pages}, ${left} sheets left`);\n  }\n}\nconst tray = new Tray(50);\nconst front = new Printer('Front desk', tray);\nconst back = new Printer('Back office', tray);\nfront.print(10);\nback.print(5);",
    "options": [
      "Front desk printed 10, 40 sheets left\nBack office printed 5, 35 sheets left",
      "Front desk printed 10, 40 sheets left\nBack office printed 5, 45 sheets left",
      "Front desk printed 10, 50 sheets left\nBack office printed 5, 50 sheets left",
      "Front desk printed 10, 40 sheets left\nBack office printed 5, 40 sheets left"
    ],
    "answer": 0,
    "explain": "Composition: each `Printer` has a tray, and both were given the same `Tray` object. 50 − 10 = 40 after the front desk prints, then 40 − 5 = 35 after the back office prints."
  },
  {
    "q": "What happens when this runs?",
    "code": "class Shape {\n  constructor(name) {\n    this.name = name;\n  }\n}\nclass Square extends Shape {\n  constructor(side) {\n    this.side = side;\n  }\n}\nconst sq = new Square(3);\nconsole.log(sq.side);",
    "options": [
      "Uncaught ReferenceError: the subclass uses this before calling super",
      "3",
      "undefined",
      "Uncaught TypeError: Shape is not a constructor"
    ],
    "answer": 0,
    "explain": "A class that `extends` another must call `super(...)` before it touches `this`. `Square`'s constructor never calls it, so `new Square(3)` throws a ReferenceError and nothing prints. Adding `super('square');` as the first line makes it print 3."
  }
]
```

```challenge
{
  "lang": "js",
  "prompt": "A recipe site has a `Timer` class whose `ring(dish)` returns the text `Timer: <dish> is ready`. Write a class `Oven` that **has a** timer: its constructor takes `name` and a `timer`, and its method `bake(dish)` logs `<name> is baking <dish>` and then logs what `this.timer.ring(dish)` returns. Create an oven named `Oven 1` and bake `bread`.",
  "starter": "class Timer {\n  ring(dish) {\n    return `Timer: ${dish} is ready`;\n  }\n}\n\n// write class Oven here\n\n",
  "expected": "Oven 1 is baking bread\nTimer: bread is ready",
  "hints": ["The constructor stores both arguments: `this.name = name; this.timer = timer;`", "Create the timer first: `const oven = new Oven('Oven 1', new Timer());`"],
  "solution": "class Timer {\n  ring(dish) {\n    return `Timer: ${dish} is ready`;\n  }\n}\n\nclass Oven {\n  constructor(name, timer) {\n    this.name = name;\n    this.timer = timer;\n  }\n  bake(dish) {\n    console.log(`${this.name} is baking ${dish}`);\n    console.log(this.timer.ring(dish));\n  }\n}\n\nconst oven = new Oven('Oven 1', new Timer());\noven.bake('bread');\n"
}
```

```quiz
[
  {
    "q": "In a class that extends another class, which call runs the parent class's constructor?",
    "options": ["`super(...)`", "`this(...)`", "`extends(...)`", "`new Parent(...)` inside the constructor"],
    "answer": 0,
    "explain": "`super(brand);` in slide 7's `Car` runs `Vehicle`'s constructor, which sets `this.brand`. `extends` names the parent in the class header; it is not a call."
  },
  {
    "q": "In the composition example, Car is a type of Engine.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 9: *In the composition example, Car has an Engine as a component.* The is-a sentence belongs to inheritance: Car is a type of Vehicle."
  },
  {
    "q": "According to slide 9, what is the key advantage of composition over inheritance?",
    "options": [
      "You can swap out the Engine for another type without needing to change the Car class",
      "The child class inherits every property and method of the parent",
      "It runs faster because there is no super call",
      "It lets one class be a type of two classes"
    ],
    "answer": 0,
    "explain": "*The composition approach allows more flexibility … you can easily swap out the Engine for another type without needing to change the Car class.* Inheriting properties and methods describes inheritance."
  },
  {
    "q": "Name the characters used to write a template string such as `` `Hi ${name}` ``.",
    "type": "text",
    "answer": ["backtick", "backticks", "backquote", "back tick", "back ticks"],
    "explain": "Slide 8: *we do that using backtick ( ` ) characters instead of double or single quotes*. Replacing `${name}` with its value is called string interpolation."
  },
  {
    "q": "What does this print?",
    "code": "class Lamp {\n  constructor(room) {\n    this.room = room;\n  }\n  on() {\n    return `Light on in the ${this.room}`;\n  }\n}\nclass DeskLamp extends Lamp {\n  constructor(room, watts) {\n    super(room);\n    this.watts = watts;\n  }\n  info() {\n    return `${this.watts} W desk lamp`;\n  }\n}\nconst lamp = new DeskLamp('study', 40);\nconsole.log(lamp.on());\nconsole.log(lamp.info());",
    "options": [
      "Light on in the study\n40 W desk lamp",
      "Light on in the undefined\n40 W desk lamp",
      "Uncaught TypeError: lamp.on is not a function",
      "Light on in the study\nundefined W desk lamp"
    ],
    "answer": 0,
    "explain": "`on()` is not in `DeskLamp`, so it is found on `Lamp`, the parent. `super(room)` set `this.room` to `'study'`, and the constructor set `this.watts` to 40."
  },
  {
    "q": "In slides 11 and 12, which class shows both an is-a and a has-a relationship?",
    "options": ["SportsCar", "ElectricCar", "Engine", "Car"],
    "answer": 0,
    "explain": "`SportsCar extends Car` (is-a) and stores `this.engine` (has-a). `ElectricCar` only extends `Car`; `Engine` and `Car` extend nothing."
  },
  {
    "q": "*Automatic replacing of variables with real values is called string interpolation.*",
    "type": "tf",
    "answer": true,
    "explain": "Slide 8's sentence, word for word. The variables go inside `${ }` in a backtick string."
  },
  {
    "type": "free",
    "q": "Compare inheritance and composition. Name the relationship each one shows, give an example of each, and state the slide's key advantage of composition.",
    "model": "Inheritance is the **is-a** relationship: a class extends another and inherits its properties and methods, e.g. `class Car extends Vehicle`, so a Car is a type of Vehicle. Composition is the **has-a** relationship: a class holds an object of another class as a component, e.g. a Car has an Engine stored in `this.engine`. Composition allows more flexibility: you can swap out the Engine for another type without changing the Car class.",
    "points": [
      "inheritance = is-a; the child extends the parent",
      "the child inherits the parent's properties and methods (super calls the parent constructor)",
      "composition = has-a; one object holds another as a component",
      "an example of each (Car extends Vehicle; Car has an Engine)",
      "key advantage: swap the component without changing the class"
    ],
    "rows": 6,
    "explain": "Slides 7 to 9. The flexibility sentence is slide 9's own wording."
  }
]
```

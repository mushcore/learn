---
title: Review: the three meanings of virtual
minutes: 25
---

Slide 68: *We've seen the virtual keyword used in several places throughout the term*: *1. Virtual functions 2. Virtual destructors 3. Virtual inheritance*, and *the effects of adding virtual differ even though the same keyword is used.* (The deck titles that slide "Overloaded operators" and the virtual-inheritance slides "Virtual destructor"; both are title slips.) One section per meaning.

## 1. Virtual functions

Slide wording: *Without virtual functions, classes are not polymorphic. Pointers and references can NOT dynamically determine the correct function to call at runtime.*

```cpp run pin slide70-nonvirtual.cpp
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

struct Animal {
  void speak(){cout << "???" << endl;}
};

struct Bird : public Animal {
  void speak() { cout << "Chirp" << endl;}
};

int main() {
  Bird bird;
  Animal *animalPtr = new Bird;
  bird.speak();
  animalPtr->speak();
}
```

`bird.speak();` calls Bird's version because `bird` is a Bird. For `animalPtr->speak();` the compiler has only the pointer's type, `Animal *`, and without `virtual` it fixes the call to Animal's version at compile time. Put `virtual` in front of Animal's `void speak()` (slide 71) and run again: now the call is decided at run time by the object pointed at, so both lines match. Where to write it, slide 72: *The first time the function appears in a base class. All future child classes will inherit the virtual function. No need to write virtual keyword again for the same function.* Modern code also marks the child's version `override`, which the deck never uses. (The slide never deletes its `new Bird`.)

### Inheritance.cpp: a vector of Animal

```cpp run pin Inheritance.cpp
// predict: Write every line printed. Hint: under g++ the vector's capacity grows 1, 2, 4 (g++'s growth, not a language rule), and each growth copies the elements already stored.
/*
 * This sample code covers inheritance
 * 1 - Shows unnecessary copies when calling functions and pushing objects into vectors
 * 2 - No polymorphism in Animal vector because Canine and Bird converted to Animal
*/

#include <iostream>
#include <vector>
using namespace std;

class Animal {
public:
    Animal() = default;
    Animal(const Animal &a) {cout << "Copy Animal" << endl;}
    virtual void speak(){cout << "Animal speak?" << endl;}
    //virtual ~Animal(){cout << "Animal destroyed" << endl;}
};

class Bird : public Animal {
public:
    Bird() = default;
    Bird(const Bird &b) {cout << "Copy Bird" << endl;}
    void speak() { cout << "Chirp" << endl;}
    //~Bird(){cout << "Bird destroyed" << endl;}
};

class Canine : public Animal {
public:
    Canine() = default;
    Canine(const Canine &c) {cout << "Copy Canine" << endl;}
    void speak() { cout << "Woof" << endl;}
    //~Canine(){cout << "Canine destroyed" << endl;}
};

//non pointer/dynamic code
Canine createCanine() {
    return Canine{};
}

Bird createBird() {
    return Bird{};
}

void animalsSpeak(Animal &a)
{
    a.speak();
}

int main() {
    vector<Animal> animals;
    //animals.reserve(4); //Can set initial vector capacity to avoid extra vector copies
    cout << "Push canine" << endl;
    animals.push_back(createCanine());
    cout << "Push bird 1" << endl;
    animals.push_back(createBird());
    cout << "Push bird 2" << endl;
    animals.push_back(createBird());
    cout << "Finish pushing animals" << endl;

    for(Animal &a : animals)
    {
        animalsSpeak(a);
    }

    return 0;
}
```

`speak` is virtual, yet the three animals all say the same thing. `vector<Animal>` stores Animal objects, so `animals.push_back(createCanine());` copies only the Animal part of the Canine into the vector: slicing. Each "Copy Animal" is `Animal(const Animal &a)` running, once for the new element and once for every element carried into a bigger block. No "Copy Canine" appears because `return Canine{};` is built straight into place ([copy elision](#/comp3522-w7/copy-elision-rvo)). Polymorphism needs a pointer or reference to the real object, and `Animal &a` in the loop refers to a sliced Animal. Full lesson: [polymorphism and virtual](#/comp3522-w3/polymorphism-virtual).

## 2. Virtual destructor

Slide 74: *When a destructor of a child type is destroyed, it will execute its own destruction code, then call its parent's destructor*: a `Dog d;` going out of scope prints Dog destroyed, then Animal destroyed. Slide 75: *Problem happens when we destroy a pointer/reference of a base type, assigned to a child type object.*

```cpp run pin slide75-nonvirtual-dtor.cpp
// predict: Write what g++ prints.
#include <iostream>
using namespace std;

class Animal {
public:
      ~Animal(){ cout << "Animal destroyed" << endl;}
};

class Dog : public Animal {
public:
      ~Dog(){ cout << "Dog destroyed" << endl;}
};

int main() {
      Animal *a = new Dog;
      delete a;
      return 0;
}
```

The server prints one line, `Animal destroyed`. Slide 76: *When "delete a;" is executed, the pointer is of Animal type, so the Animal class' destructor is called*, and Dog's never runs because *Animal's destructor is not polymorphic*. In C++ this delete is undefined behaviour, and that one line is what g++ prints, not a guaranteed result. (Slide 75 says we expected "animal destroyed, dog destroyed"; the right order is child first, as slide 74 shows.) The fix, slide 77: *Need to add virtual in front of the base class' destructor to polymorphically call the proper child type's destructor first.* Make it `virtual ~Animal()` and run again: Dog's line, then Animal's. The slide's rule: *Base classes should always have a virtual destructor.* (The C++ Core Guidelines say it for bases used polymorphically: public and virtual, or protected and non-virtual.)

### Inheritance2.cpp: a vector of Animal pointers

```cpp run pin Inheritance2.cpp
// predict: Write every line printed.
/*
 * This sample code covers inheritance
 * The importance of using pointers to:
 * 1 - avoid unnecessary copies when calling functions and pushing objects into vectors
 * 2 - enabling polymorphic function calls with virtual functions
 * 3 - properly destroying dynamic memory with a virtual destructor
 */

#include <iostream>
#include <vector>
using namespace std;

class Animal {
public:
    Animal() = default;
    Animal(const Animal &a) {cout << "Copy Animal" << endl;}
    virtual void speak(){cout << "Animal speak?" << endl;}
    //virtual ~Animal(){cout << "Animal destroyed" << endl;}
};

class Bird : public Animal {
public:
    Bird() = default;
    Bird(const Bird &b) {cout << "Copy Bird" << endl;}
    void speak() { cout << "Chirp" << endl;}
    //~Bird(){cout << "Bird destroyed" << endl;}
};

class Canine : public Animal {
public:
    Canine() = default;
    Canine(const Canine &c) {cout << "Copy Canine" << endl;}
    void speak() { cout << "Woof" << endl;}
    //~Canine(){cout << "Canine destroyed" << endl;}
};

void animalsSpeak(Animal &a)
{
    a.speak();
}

//pointer/dynamic code
Canine* createDynamicCanine() {
    return new Canine{};
}

Bird* createDynamicBird() {
    return new Bird{};
}

void animalsPolySpeak(Animal *a)
{
    a->speak();
}

int main() {
    vector<Animal*> animals;
    cout << "Push canine" << endl;
    animals.push_back(createDynamicCanine()); //pushed back canine pointer to canine object
    cout << "Push bird 1" << endl;
    animals.push_back(createDynamicBird());
    cout << "Push bird 2" << endl;
    animals.push_back(createDynamicBird());
    cout << "Finish pushing animals" << endl;

    for(Animal *a : animals)
    {
        //animalsSpeak(*a); //same as below but using references
        animalsPolySpeak(a);
    }

    for(Animal *a : animals)
    {
        delete a;
    }

    return 0;
}
```

`vector<Animal*>` stores pointers, so nothing is copied and `a->speak();` reaches the real Canine or Bird. The destructors are commented out, so `delete a;` prints nothing, and g++ warns `deleting object of polymorphic class type 'Animal' which has non-virtual destructor might cause undefined behavior`. Uncomment all three destructors and run: each `delete a;` now prints the child's line, then Animal's. Uncomment them but drop the `virtual`, and g++ prints three `Animal destroyed` lines: the slide-75 problem again. Full lesson: [destructors](#/comp3522-w3/destructor).

## 3. Virtual inheritance

Slides 79 to 82: when B and C both inherit A and D inherits both, A's constructor runs twice: *instantiating class D, calls the constructors of B and C. Therefore both B and C, call the constructors of each of their A parents.* Slide 83's fix is `class B : virtual public A` and `class C : virtual public A`. Slide 84: *B and C no longer contain the base class A's data – they refer to a common object that is part of the most derived class D.* Slides 85 and 86: *The most derived child (D) is now responsible for calling base class' constructor (A)*; *D will implicitly call A's default constructor*, *But you can write code in D's constructor to call any constructor in A.*

```cpp run pin oop_multi3.cpp
// predict: Write the four lines printed.
#include <iostream>
#include <string>
#include <iomanip>

using namespace std;

class ClassA 
{
  public:
    ClassA()
    {
      cout << "ClassA default constructor" << endl;
    }
    ClassA(const string& name) : name(name)
    {
      cout << "ClassA 1-param constructor" << endl;
    }
    
    virtual void all_info() const
    {
      cout << "[ClassA name=" << name << "]" << endl;
    }
    
  protected:
    string name;
};

class ClassB : public virtual ClassA
{
  public:
    ClassB(const string& name, const string& data)
    : ClassA(name), data(data)
    {
      cout << "ClassB two-param constructor" << endl;
    }
  protected:
    ClassB(const string& data) : data(data)
    {
      cout << "ClassB one-param constructor" << endl;
    }

    void my_infos() const
    {
        cout << name << " has Class B's data: " << data << endl;
    }
  public:
    virtual void all_info() const override
    {
      ClassA::all_info();
      my_infos();
    }
  private:
    string data;
};

class ClassC : public virtual ClassA
{
  public:
    ClassC(const string& name, const string& extra_data) 
    : ClassA(name), extra_data(extra_data)
    {
      cout << "ClassC two-param constructor" << endl;
    }
  protected:
    ClassC(const string& extra_data) : extra_data(extra_data)
    {
      cout << "ClassC one-param constructor" << endl;
    }

    void my_infos() const
    {
      cout << name << " has Class C's extra_data: " << extra_data << endl;
    }	
  public:
    virtual void all_info() const override
    {
	     ClassA::all_info();
	     my_infos();
    }
  private:
    string extra_data;
};

class ClassD : public ClassB, public ClassC
{
  public:
    ClassD(const string& name,
                 const string& data, 
                 const string& extra_data)
    : ClassA(name), ClassB(data), ClassC(extra_data) //ClassD is responsible for calling ClassA's contructor directly because of virtual inheritance
    //  : ClassB(name, data), ClassC(name, extra_data) //won't call ClassA's 1 param constructor when using virtual inheritance. It will call ClassA's default constructor
    {
      cout << "ClassD 3-param constructor" << endl;
    }
    virtual void all_info() const override
    {
      ClassB::all_info();
      ClassC::my_infos();
    }
};

int main () 
{
    ClassD d("Derek", "Algebra", "Fermat's Last Theorem");
    //d.all_info();

    //ClassC c("Clifford", "test"); //can still instantiate ClassC directly

    return 0 ;
}
```

ClassD's initializer list `: ClassA(name), ClassB(data), ClassC(extra_data)` calls A's constructor itself, so the one shared A is built first, then B and C through their one-param constructors, which never mention A. Swap in the commented-out list `: ClassB(name, data), ClassC(name, extra_data)` and the `ClassA(name)` calls inside B and C are skipped: the server prints `ClassA default constructor`, then the two-param lines, and the name stays empty. Full lesson: [the diamond and virtual base classes](#/comp3522-w4/diamond-virtual-base).

```quiz
[
  {
    "q": "Slide 68 lists the places the `virtual` keyword appears in this course. Which are they? (select all)",
    "options": ["Virtual functions", "Virtual destructors", "Virtual inheritance", "Virtual constructors", "Virtual static member functions"],
    "answer": [0, 1, 2],
    "explain": "Functions, destructors, inheritance, each with a different effect. A constructor cannot be virtual (the object's type is not known until it is built), and a static member function cannot be virtual (Week 7, slide 9)."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nstruct Animal {\n    void speak() { cout << \"?\"; }\n    virtual void eat() { cout << \"a\"; }\n};\n\nstruct Dog : public Animal {\n    void speak() { cout << \"W\"; }\n    void eat() { cout << \"d\"; }\n};\n\nint main() {\n    Dog d;\n    Animal &r = d;\n    d.speak();\n    r.speak();\n    r.eat();\n    cout << endl;\n    return 0;\n}",
    "answer": ["W?d"],
    "explain": "d.speak() on the Dog itself: W. r.speak() goes through an Animal reference and speak is not virtual, so the reference's type picks Animal's: ?. eat is virtual, so r.eat() reaches the Dog: d."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nstruct A {\n    virtual void f() { cout << \"A\"; }\n    virtual ~A() {}\n};\n\nstruct B : public A {\n    void f() { cout << \"B\"; }\n};\n\nstruct C : public B {\n    void f() { cout << \"C\"; }\n};\n\nint main() {\n    B *p = new C;\n    p->f();\n    A *q = p;\n    q->f();\n    delete p;\n    cout << endl;\n    return 0;\n}",
    "answer": ["CC"],
    "explain": "f is virtual in A, the first class it appears in, so it stays virtual in B and C without the keyword. Both calls, through a B* and through an A*, reach C's f."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nclass A {\npublic:\n    virtual ~A() { cout << \"A\"; }\n};\n\nclass B : public A {\npublic:\n    ~B() { cout << \"B\"; }\n};\n\nclass C : public B {\npublic:\n    ~C() { cout << \"C\"; }\n};\n\nint main() {\n    A *p = new C;\n    delete p;\n    cout << endl;\n    return 0;\n}",
    "answer": ["CBA"],
    "explain": "A's destructor is virtual, so `delete p` starts at the real type, C. Each destructor runs its own code, then its parent's: C, then B, then A."
  },
  {
    "q": "Per the slides, what does `Animal *a = new Dog; delete a;` print when Animal's destructor (printing `Animal destroyed`) is not virtual and Dog's prints `Dog destroyed`?",
    "options": ["`Animal destroyed` only", "`Dog destroyed` then `Animal destroyed`", "`Animal destroyed` then `Dog destroyed`", "Nothing"],
    "answer": 0,
    "explain": "Slide 75: the pointer's type is Animal and the destructor is not polymorphic, so only Animal's runs. In C++ this delete is undefined behaviour; one Animal line is what g++ prints."
  },
  {
    "q": "True or false (slide 77): base classes should always have a virtual destructor.",
    "type": "tf",
    "answer": true,
    "explain": "The slide's rule. The C++ Core Guidelines (C.35) put it for polymorphic bases: a base destructor should be public and virtual, or protected and non-virtual."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nstruct A {\n    A() { cout << \"A\"; }\n    A(int n) { cout << \"A\" << n; }\n};\n\nstruct B : virtual public A {\n    B() : A(2) { cout << \"B\"; }\n};\n\nstruct C : virtual public A {\n    C() : A(3) { cout << \"C\"; }\n};\n\nstruct D : public B, public C {\n    D() { cout << \"D\"; }\n};\n\nint main() {\n    D d;\n    cout << endl;\n    return 0;\n}",
    "answer": ["ABCD"],
    "explain": "A is a virtual base, so the most derived class D calls its constructor. D's constructor names no A constructor, so D implicitly calls A's default one: A. B's A(2) and C's A(3) are skipped. Then B, C, D."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nstruct A {\n    A() { cout << \"A\"; }\n    A(int n) { cout << \"A\" << n; }\n};\n\nstruct B : public A {\n    B() : A(2) { cout << \"B\"; }\n};\n\nstruct C : public A {\n    C() : A(3) { cout << \"C\"; }\n};\n\nstruct D : public B, public C {\n    D() { cout << \"D\"; }\n};\n\nint main() {\n    D d;\n    cout << endl;\n    return 0;\n}",
    "answer": ["A2BA3CD"],
    "explain": "Without virtual inheritance D holds two A objects: B calls A(2) before printing B, then C calls A(3) before printing C, then D. This is the double construction of slides 79 to 82."
  },
  {
    "q": "With `class B : virtual public A` and `class C : virtual public A`, which class is responsible for calling A's constructor when you create `D d;` (D inherits B and C)?",
    "options": ["D, the most derived class", "B, the first base listed", "C, the last base listed", "Both B and C, once each"],
    "answer": 0,
    "explain": "Slides 85 and 86: the most derived child calls the virtual base's constructor, the default one unless D's initializer list names another. B's and C's calls to A are ignored."
  },
  {
    "q": "Why does Inheritance.cpp print `Animal speak?` for the Canine and both Birds, even though `speak` is virtual?",
    "options": ["`vector<Animal>` stores copies of only the Animal part of each object", "Bird and Canine forgot to write virtual again", "`animalsSpeak` takes its parameter by reference", "Animal has no virtual destructor"],
    "answer": 0,
    "explain": "push_back copies each Canine or Bird into an Animal element: slicing. The vector holds real Animals, so the virtual call finds Animal's speak. Storing `Animal*` (Inheritance2.cpp) keeps the real objects."
  }
]
```

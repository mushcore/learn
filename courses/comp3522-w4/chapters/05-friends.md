---
title: Friend functions and friend classes
minutes: 15
---

Private means "this class only", and sometimes that is one class too few: a function that adds two Dollars needs both amounts, and a Spy needs the Boss's pin. A **friend** declaration grants a function, or a whole class, access to private and protected members without making them public.

## A friend function

```cpp run pin Dollar.cpp
// predict: Write the number printed.
#include <iostream>

class Dollar {
private:
   int num; //private
   //friend function unaffected by visibility, not a member function
   friend Dollar sum(const Dollar &d1, const Dollar &d2);
public:
   Dollar(int d) : num(d){};
   int GetNum(){return num;}
};

//this implementation can be anywhere. Does NOT belong to Dollar class
Dollar sum(const Dollar &d1, const Dollar &d2)
{
    return Dollar(d1.num + d2.num);
}

int main() {
    Dollar d1{5};
    Dollar d2{7};

    Dollar dollarSum = sum(d1,d2);
    std::cout << dollarSum.GetNum() << std::endl;
    return 0;
}
```

The **declaration** `friend Dollar sum(const Dollar &d1, const Dollar &d2);` appears inside the class body; the **definition** `Dollar sum(const Dollar &d1, const Dollar &d2)` appears outside it, with no `Dollar::` prefix, because `sum` is not a member function. Being a friend lets its body read `d1.num` and `d2.num` although `num` is private. The shipped project leaves `Dollar.cpp` empty and defines `sum` in main.cpp, to make the point that the definition can live anywhere.

The friend line sits in the private section of the class. That is allowed and changes nothing: access specifiers have no effect on friend declarations.

## A friend class

```cpp run pin FriendClass.cpp
// predict: Write the line printed. Then uncomment the s->pin line in Boss::print and read the error.
#include <iostream>
using namespace std;

class Spy; //forward declaration

class Boss {
private:
   friend class Spy;
   int pin; //private
public:
   Boss(int p) : pin(p){}
   void print(Spy *s);
};

class Spy {
    //friend class Boss;
   int pin; //private
public:
   Spy(int p) : pin(p){}
   void print(Boss *b) {
       //boss made Spy their friend, so Spy has access to Boss' private pin
       cout << "Spy using Boss' pin: " << b->pin << endl;
   }
};

//Spy did not make boss their friend, so can't access PIN
void Boss::print(Spy *s) {
    cout << "Boss trying to use Spy's pin..." << endl;
    // cout << s->pin << endl;   // error: 'int Spy::pin' is private within this context
}

int main() {
    Boss boss{1111};
    Spy spy{2222};
    //cout << boss.pin; //can't access boss' pin from main
    spy.print(&boss);
    boss.print(&spy);
    return 0;
}
```

`friend class Spy;` inside Boss makes every member function of Spy a friend of Boss, so `Spy::print` can read `b->pin`. The forward declaration `class Spy; //forward declaration` is needed because Boss mentions Spy before Spy is defined (Week 3). The reverse is not granted: Spy never wrote `friend class Boss;`, so the commented `// cout << s->pin << endl;` fails with `'int Spy::pin' is private within this context` the moment it is uncommented; the shipped project has that read in place and does not compile until `//friend class Boss;` in Spy is restored. Friendship is given, never taken, and it is one-directional.

## Three rules

- **Not transitive.** "Transitive" means A < B and B < C gives A < C. Boss friend Spy and Spy friend Minion does **not** make Boss friend Minion.
- **Not inherited.** A class derived from Spy is not a friend of Boss.
- **Access specifiers have no effect.** A friend declaration may be in the private, protected or public section.

```widget
friend-check
```

Friends matter next lesson: the stream operators `<<` and `>>` cannot be members of your class, and they need to read its private data, so they are declared friends.

```quiz
[
  {
    "q": "What does a `friend` declaration grant?",
    "options": ["Public access to all members for everyone", "A named function or class access to the private and protected members of the declaring class", "Inheritance without a base class", "The ability to call constructors"],
    "answer": 1,
    "explain": "The slide: friends grant a function (or another class) access to private and protected members. The declaration is in the class body; the definition is outside."
  },
  {
    "q": "`friend Dollar sum(const Dollar &d1, const Dollar &d2);` is written inside class Dollar. Where is `sum` defined?",
    "options": ["Inside the class, like a member", "Outside the class body, without `Dollar::`, anywhere in the program", "In Dollar.cpp only", "It needs no definition"],
    "answer": 1,
    "explain": "A friend function is not a member. The shipped project defines it in main.cpp with the comment: this implementation can be anywhere, does NOT belong to Dollar class."
  },
  {
    "q": "What does the shipped Dollar program print for `sum(Dollar{5}, Dollar{7}).GetNum()`?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "explain": "sum reads both private num members (5 and 7) as a friend and returns Dollar(12)."
  },
  {
    "q": "Boss declares `friend class Spy;`. Spy declares nothing. Which compiles?",
    "options": ["`Spy::print` reading `b->pin` and `Boss::print` reading `s->pin`", "Only `Spy::print` reading `b->pin`", "Only `Boss::print` reading `s->pin`", "Neither"],
    "answer": 1,
    "explain": "Friendship is one-directional: Boss granted Spy access, Spy granted nothing. The shipped FriendClass does not compile until Spy adds friend class Boss."
  },
  {
    "q": "Boss is a friend of Spy, and Spy is a friend of Minion. Is Boss a friend of Minion?",
    "type": "tf",
    "answer": false,
    "explain": "Friendship is not transitive."
  },
  {
    "q": "`class DoubleAgent : public Spy`. Boss declared `friend class Spy;`. Can DoubleAgent's member functions read Boss's private pin?",
    "options": ["Yes, DoubleAgent is a Spy", "No: friendship is not inherited", "Only if DoubleAgent is public", "Only through a pointer"],
    "answer": 1,
    "explain": "Friendship is not inherited. Boss befriended Spy, not Spy's derived classes."
  },
  {
    "q": "A friend declaration written in the `private:` section of a class...",
    "options": ["makes the friend private", "is an error", "works exactly as in the public section: access specifiers have no effect on friend declarations", "only grants access to private members"],
    "answer": 2,
    "explain": "The Dollar and Boss classes both put their friend line in the private section. Its position is irrelevant."
  },
  {
    "q": "Why does `class Spy;` appear before `class Boss` in FriendClass?",
    "options": ["To make Spy a friend", "A forward declaration: Boss names Spy (in `friend class Spy;` and `print(Spy*)`) before Spy is defined", "To make Spy abstract", "It is optional decoration"],
    "answer": 1,
    "explain": "Week 3's forward declaration: introduce the name so pointers to it and friend declarations can mention it before the definition."
  }
]
```

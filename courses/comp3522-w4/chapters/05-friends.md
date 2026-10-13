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

## Trace a `Wallet` friend and a `Vault` friend class

A friend function that moves money between two private balances, then a vault that trusts one class and nobody that class trusts.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Wallet {\n    int cents;\n    friend void transfer(Wallet& from, Wallet& to, int amount);\npublic:\n    Wallet(int c) : cents(c) {}\n    int balance() const { return cents; }\n};\n\nvoid transfer(Wallet& from, Wallet& to, int amount) {\n    if (amount > from.cents) amount = from.cents;\n    from.cents -= amount;\n    to.cents += amount;\n}\n\nint main() {\n    Wallet a(500), b(120);\n    transfer(a, b, 350);\n    transfer(b, a, 900);\n    cout << a.balance() << \" \" << b.balance() << endl;\n    return 0;\n}",
    "options": [
      "`620 0`",
      "`150 470`",
      "`1050 -430`",
      "`500 120`"
    ],
    "answer": 0,
    "explain": "`transfer` is a friend, so it may read and change the private `cents` of both wallets. First call: 350 is not more than a's 500, so a = 500 - 350 = 150 and b = 120 + 350 = 470. Second call: 900 is more than b's 470, so the amount is capped at 470: b = 0 and a = 150 + 470 = 620. Output `620 0`."
  },
  {
    "q": "What number does this print?",
    "type": "numeric",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Vault {\n    friend class Auditor;\n    int gold;\npublic:\n    Vault(int g) : gold(g) {}\n};\n\nclass Auditor {\npublic:\n    int count(const Vault& v) const { return v.gold; }\n    void skim(Vault& v, int n) const { v.gold -= n; }\n};\n\nint main() {\n    Vault v(80);\n    Auditor a;\n    a.skim(v, 15);\n    a.skim(v, 4);\n    cout << a.count(v) << endl;\n    return 0;\n}",
    "answer": 61,
    "tolerance": 0,
    "explain": "`friend class Auditor;` lets every Auditor member reach `gold`. The vault starts at 80; `skim(v, 15)` leaves 65 and `skim(v, 4)` leaves 61; `count` returns 61."
  },
  {
    "q": "Intern derives from Auditor, Vault's friend. Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Vault {\n    friend class Auditor;\n    int gold;\npublic:\n    Vault(int g) : gold(g) {}\n};\n\nclass Auditor {\npublic:\n    int count(const Vault& v) const { return v.gold; }\n};\n\nclass Intern : public Auditor {\npublic:\n    int peek(const Vault& v) const { return v.gold; }\n};\n\nint main() {\n    Vault v(80);\n    Intern i;\n    cout << i.count(v) << i.peek(v) << endl;\n    return 0;\n}",
    "answer": [
      18
    ],
    "explain": "Friendship is not inherited. Vault befriended Auditor, so `Auditor::count` may read `v.gold`, but Intern's own member `peek` is not a friend: 'int Vault::gold' is private within this context. `i.count(v)` in main is fine, because count is Auditor's function."
  },
  {
    "q": "A befriends B, and B befriends C. Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass A {\n    friend class B;\n    int secret = 42;\n};\n\nclass B {\n    friend class C;\npublic:\n    int read(const A& a) const { return a.secret; }\n};\n\nclass C {\npublic:\n    int read(const A& a) const { return a.secret; }\n};\n\nint main() {\n    A a;\n    cout << B().read(a) << C().read(a) << endl;\n    return 0;\n}",
    "answer": [
      17
    ],
    "explain": "Friendship is not transitive. B may read `a.secret` because A named B. C is B's friend, which gives C access to B's private members only, not A's, so `C::read` fails: 'int A::secret' is private within this context."
  }
]
```

```challenge
{"prompt": "Make <code>manhattan</code> a friend of <code>Point</code> and define it outside the class: it returns |x1 - x2| + |y1 - y2| for two points. Do not add getters.", "starter": "#include <iostream>\n#include <cstdlib>\nusing namespace std;\n\nclass Point {\n    int x, y;\n    // declare the friend here\npublic:\n    Point(int x, int y) : x(x), y(y) {}\n};\n\n// define manhattan here\n\nint main() {\n    Point a(1, 2), b(4, -2), c(-3, 5);\n    cout << manhattan(a, b) << endl;\n    cout << manhattan(b, c) << endl;\n    return 0;\n}\n", "expected": "7\n14", "hints": ["Inside the class: <code>friend int manhattan(const Point&amp; p, const Point&amp; q);</code>", "The definition has no <code>Point::</code> prefix: it is not a member.", "<code>abs</code> is in <code>&lt;cstdlib&gt;</code>."], "solution": "#include <iostream>\n#include <cstdlib>\nusing namespace std;\n\nclass Point {\n    int x, y;\n    friend int manhattan(const Point& p, const Point& q);\npublic:\n    Point(int x, int y) : x(x), y(y) {}\n};\n\nint manhattan(const Point& p, const Point& q) {\n    return abs(p.x - q.x) + abs(p.y - q.y);\n}\n\nint main() {\n    Point a(1, 2), b(4, -2), c(-3, 5);\n    cout << manhattan(a, b) << endl;\n    cout << manhattan(b, c) << endl;\n    return 0;\n}\n"}
```
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
    "options": ["To make Spy a friend", "A forward declaration: Boss's `print(Spy*)` names Spy before Spy is defined", "To make Spy abstract", "It is optional decoration"],
    "answer": 1,
    "explain": "Week 3's forward declaration: introduce the name so a pointer parameter like `Spy*` can mention it before the definition. The `friend class Spy;` line alone would not need it, because a friend class declaration introduces the name itself."
  }
]
```

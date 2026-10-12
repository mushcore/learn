---
title: The five kinds of iterator
minutes: 25
---

`v.begin() + 3` compiles for a vector and not for a list, and `fi--` fails on a forward_list, because "iterator" is five different contracts and each container hands out one of them.

## Five kinds, defined by five operations

Slide wording: there are five kinds of iterators, *Input*, *Output*, *Forward*, *Bidirectional*, *Random Access*, and *each kind of iterator is defined by the operations that can be performed on it*: 1. *Read*, 2. *Write*, 3. *Increment (with or without multiple passes)*, 4. *Decrement*, 5. *Random access*. Each kind from forward onward can do everything the kinds before it can; the tables below list only what each adds.

## 1. Input iterator: read once, forward only

*Single pass forward direction sequential input operations: `==`, `!=`, `++`, `*it`*. Only reading, and incrementing. Single pass means you cannot go back and read an element again: think of reading `cin`. Slide wording: *there is not a single type of input iterator. Each container defines its own specific iterator type.* In the table `i` and `j` are iterators.

| Supported expression | Returns | Equivalent expression |
|---|---|---|
| `i != j` | bool | `!(i == j)` |
| `*i` | value_type | |
| `i->m` | m | `(*i).m` |
| `++i` | It | `++i; return It temp = i;` |
| `i++` | It | `It temp = i; ++i; return temp;` |
| `*i++` | value_type | `value_type x = *i; ++i; return x;` |

The last three rows are Week 4's prefix/postfix rule applied to iterators: `++i` returns the new position, `i++` returns a copy of the old one, and `*i++` reads the old position before advancing.

## 2. Output iterator: write once, forward only

*Single pass forward direction sequential output operations: `*it`, `++`, `*it = value`*. Only writing, and incrementing. Think of writing to `cout`: you can put a value at the current position and move on, never read it back.

| Supported expression | Returns | Equivalent expression |
|---|---|---|
| `*i = some value` | | |
| `++i` | It | `++i; return It temp = i;` |
| `i++` | It | `It temp = i; ++i; return temp;` |
| `*i++ = some value` | | `*i = some value; ++i;` |

## 3. Forward iterator: read and write, multi-pass

*Multi-pass forward direction sequential output operations: `==`, `!=`, `++`, `*it`, `*it = value`*. *Reading AND writing*, incrementing. Multi-pass is the new word: *we can make a copy of the iterator and dereference the same iterant*, so a saved copy still refers to its element after the original moves on.

```cpp run pin forwardCopy.cpp
// predict: Write the three lines printed.
#include <iostream>
#include <forward_list>
using namespace std;

int main() {
    forward_list<int> forward = {1, 2, 3, 4, 5};
    forward_list<int>::iterator iter = forward.begin();   // forward iterator
    forward_list<int>::iterator iterSaved;

    iterSaved = iter; //copies iter to iterSaved
    iter++;
    cout << "Previous element is " << (*iterSaved) << endl;
    cout << "Current element is " << (*iter) << endl;

    *iterSaved = 100;                                      // write through the copy
    cout << "After the write: " << *forward.begin() << endl;
    //iter--; //can't decrement forward iterator
    return 0;
}
```

The slide's four lines are the middle of the program: `iterSaved = iter; //copies iter to iterSaved`, then `iter++;`, then `Previous element is` from the copy and `Current element is` from the original. `*iterSaved = 100;` is the forward iterator's `*it = value`, written through the copy. A `forward_list` gives exactly this kind, so the commented `//iter--; //can't decrement forward iterator` would not compile.

## 4. Bidirectional iterator: adds decrement

*Multi-pass bidirectional sequential output operations: `==`, `!=`, `++`, `--`, `*it`, `*it = value`*. *Reading AND writing*, incrementing, decrementing. It *can be used like an input iterator, output iterator, forward iterator, and supports the following additional expressions*:

| Supported expression | Returns | Equivalent expression |
|---|---|---|
| `--i` | It | |
| `i--` | It | `It temp = i; --i; return temp;` |
| `*i--` | value_type | |

```cpp run pin iterator.cpp
// predict: Write the four lines printed. What does it point at after the postfix ++?
#include <iostream>
#include <list> //bidirectional iterator
#include <forward_list>
#include <vector>

using namespace std;
int main() {
//    forward_list <int> forward = {1,2,3,4,5};
//    forward_list <int>::iterator fi = forward.begin(); //forward iterator
//
//    fi++; //points at 2
//    cout << *fi << endl;
//    //fi--; //can't decrement forward iterator

    list <int> container = {1,2,3,4,5};
    list <int>::iterator itBegin = container.begin(); //birectional iterator
    list <int>::iterator itEnd = container.end(); //bidirectional iterator

    *itBegin = 999; //assign using iterator
    cout << "first: " << *itBegin << endl;

    for(auto i = container.begin(); i != container.end(); ++i)
    {
        cout << *i << " ";
    }
    cout << endl;

//    itBegin is pointing to first element
//    it is pointing at 999
//    after assignment, itBegin++ happens
//    itBegin points at next element, which is 2
    list <int>::iterator it = itBegin++; //makes a copy of current iterator then moves to next position

//    list <int>::iterator it = itBegin;
//    itBegin++;

    //it is pointing to first element
    //itBegin is pointing to second element
    cout << "*it: " << *it << endl;
    cout << "*itBegin: " << *itBegin << endl;
    return 0;
}
```

A `list` hands out bidirectional iterators. `*itBegin = 999; //assign using iterator` writes through it, so the loop prints `999 2 3 4 5`. The line to read slowly is `list <int>::iterator it = itBegin++;`, the `i++` row of the input table: the postfix operator copies the current position, advances `itBegin`, and returns the copy, so `it` still points at 999 while `itBegin` has moved to 2. The commented `list <int>::iterator it = itBegin;` and `itBegin++;` are the same thing as two statements.

## 5. Random access iterator: jump by n and compare

*Multi-pass random access output operations: `==`, `!=`, `++`, `--`, `*it`, `*it = value`, `it + n` or `it - n` where n is an int, `<`, `<=`, ...*. *Reading AND writing*, incrementing and decrementing, random access. It *can be used like a bidirectional iterator, and supports the following additional expressions*, where `i` is an iterator, `j` is another iterator and `n` is a number:

| Supported expression | Returns | Equivalent expression |
|---|---|---|
| `i += n`, `i -= n` where `i = It&` | It | |
| `i + n`, `i - n` | It | `It temp = i; return temp += n;` |
| `i - j` | difference_type | return difference |
| `i[n]` | value_type | `*(i + n)` |
| `i < j`, `i <= j`, `i > j`, `i >= j` | bool | |

Slide wording for the two rules the quiz draws on: *only random-access iterators permit an integer value to be added to or subtracted from an iterator* (`iter1 - 5`), and *only random access iterators permit one iterator to be subtracted from another*, which results in a `difference_type` (`iter1 - iter2`).

```cpp run pin randomAccessIterator.cpp
// predict: Write the eight lines printed.
#include <iostream>
#include <vector>

using namespace std;

void print(vector<string> v)
{
    for(auto i : v)
    {
        cout << i << " ";
    }
    cout << endl;
}

int main() {
    vector<string> v ={"a","b","c","d","e","f"};
    print(v);
    //vector<string>::iterator
    auto nearEndIt = (v.end() - 1); //get new iterator from iterator subtraction

    cout << "v.begin(): " << *(v.begin()) << endl;
    cout << "++v.begin(): " <<  *(++v.begin()) << endl; //pre-increment iterator
    cout << "v.begin() + 3: " <<  *(v.begin() + 3) << endl; //move iterator with +
    cout << "v.end() - 1: " << *nearEndIt << endl;
    cout << "v.end() - nearEndIt: " << v.end() - nearEndIt << endl; //subtract iterators to get difference_type

    cout << ((nearEndIt < v.end()) ? "TRUE" : "FALSE") << endl;

    vector<string>::iterator midIt = v.begin()+3;
    *midIt = "z"; //same as v[3] = "z";
    print(v);

    return 0;
}
```

`auto nearEndIt = (v.end() - 1);` is `i - n`: a new iterator one before `end()`, the last element. `*(v.begin() + 3)` is `i + n`, the fourth element. `v.end() - nearEndIt` is `i - j`, a `difference_type` that prints as 1. `(nearEndIt < v.end())` is the comparison row, and `*midIt = "z"; //same as v[3] = "z";` writes through the iterator, so the second `print(v)` differs from the first. The shipped program goes on to print the address of a `new string` and of the iterator (cut here because addresses vary per run) to show that an iterator is not a pointer: `cout << midIt` does not compile.

## Which container gives which kind

| Container | Iterator kind | So you can |
|---|---|---|
| `vector`, `deque`, `array` | random access | `it + n`, `it - n`, `it[n]`, `it1 - it2`, `<` |
| `list`, `set`, `multiset`, `map`, `multimap` | bidirectional | `++`, `--`, read, write (set and map keys are const) |
| `forward_list` | forward | `++`, read, write, copies |
| `istream_iterator` | input | read once, `++` |
| `ostream_iterator` | output | write once, `++` |

```widget
iterator-ops
{ "container": "list", "expr": "it + 3" }
```

```cpp pin listPlus2.cpp (does not compile)
#include <iostream>
#include <list>
#include <forward_list>
using namespace std;

int main() {
    list<int> l = {1, 2, 3, 4, 5};
    list<int>::iterator it = l.begin() + 2;   // bidirectional: no operator+
    cout << *it << endl;

    forward_list<int> forward = {1, 2, 3, 4, 5};
    forward_list<int>::iterator fi = forward.begin();
    fi++;
    fi--;                                     // forward: no operator--
    cout << *fi << endl;
    return 0;
}
```

g++ rejects both marked lines: `list<int>::iterator it = l.begin() + 2;` gives `error: no match for 'operator+' (operand types are 'std::list<int>::iterator' and 'int')` followed by every `operator+` it tried, and `fi--;` gives `error: no 'operator--(int)' declared for postfix '--'`. To reach the third element of a list, increment twice or use `std::next(l.begin(), 2)`, which repeats `++` for you.

```quiz
[
  {
    "q": "Which iterator kinds does a `std::list` provide?",
    "options": ["Random access", "Bidirectional", "Forward", "Input only"],
    "answer": 1,
    "explain": "A list is a doubly linked chain: it can step forward and back (++ and --) but cannot jump by n or compare positions with <. Vector, deque and array are the random access containers."
  },
  {
    "q": "Which expressions are only allowed on a random access iterator? (select all)",
    "options": ["`it + 3`", "`it1 - it2`", "`++it`", "`it[2]`", "`it1 != it2`"],
    "answer": [0, 1, 3],
    "explain": "Slide 77: only random-access iterators permit an integer to be added to or subtracted from an iterator, and only they permit one iterator to be subtracted from another (a difference_type). i[n] is *(i + n). ++ and != exist for every kind."
  },
  {
    "q": "What does this print?",
    "code": "list<int> c = {1, 2, 3, 4, 5};\nlist<int>::iterator itBegin = c.begin();\n*itBegin = 999;\nlist<int>::iterator it = itBegin++;\ncout << *it << ' ' << *itBegin;",
    "options": ["999 999", "999 2", "2 999", "1 2"],
    "answer": 1,
    "explain": "Postfix ++ copies the old position, advances itBegin, and returns the copy: it stays at the first element (now 999) while itBegin moves to 2."
  },
  {
    "q": "Per the slide table, `*i++` on an input iterator is equivalent to...",
    "options": ["`++i; return *i;`", "`value_type x = *i; ++i; return x;`", "`return *(i + 1);`", "`*i = i + 1;`"],
    "answer": 1,
    "explain": "Read the element at the current position, then advance, then hand back the value read. The postfix form always works on the old position."
  },
  {
    "q": "The property that lets you copy an iterator and later dereference the copy to reach the same element is called...",
    "type": "text",
    "answer": ["multi-pass", "multipass", "multi pass"],
    "explain": "Forward, bidirectional and random access iterators are multi-pass: iterSaved = iter; iter++; *iterSaved still reads the previous element. Input and output iterators are single pass."
  },
  {
    "q": "Click the line that does not compile.",
    "type": "spotbug",
    "code": "forward_list<int> f = {1, 2, 3};\nforward_list<int>::iterator fi = f.begin();\nfi++;\ncout << *fi << endl;\nfi--;\ncout << *fi << endl;",
    "answer": 5,
    "explain": "A forward_list gives a forward iterator: ++ and dereference only. Decrement needs a bidirectional iterator (list, set, map) or better."
  },
  {
    "q": "`vector<string> v = {\"a\",\"b\",\"c\",\"d\",\"e\",\"f\"}; auto nearEndIt = v.end() - 1; cout << v.end() - nearEndIt;` prints...",
    "options": ["f", "e", "1", "5"],
    "answer": 2,
    "explain": "Subtracting two random access iterators gives a difference_type, the number of positions between them: end() is one past nearEndIt, so the difference is 1."
  },
  {
    "q": "True or false: an output iterator supports reading the element it points to.",
    "type": "tf",
    "answer": false,
    "explain": "Output iterators are write-only (*i = value, ++). Input iterators are read-only. A forward iterator is the first kind that does both."
  },
  {
    "type": "match",
    "q": "Match each container to the iterator kind it provides.",
    "pairs": [
      ["`vector`, `deque`", "random access"],
      ["`list`, `map`, `set`", "bidirectional"],
      ["`forward_list`", "forward"],
      ["`istream_iterator`", "input"]
    ],
    "explain": "The container decides the kind, and the typedef `iterator` names it: vector<int>::iterator is random access, list<string>::iterator is bidirectional."
  },
  {
    "q": "Which statement about input iterators is on the slide?",
    "options": ["They are all the same type, `std::input_iterator`", "They support decrement", "They can be written through", "There is not a single type of input iterator; each container defines its own specific iterator type"],
    "answer": 3,
    "explain": "Input iterator is a category of behaviour, not a class. Every container (and istream_iterator) has its own type that meets the category's operations."
  }
]
```

---
title: First-class containers and adaptors, pair, map and multimap
minutes: 25
---

"I'm so tired of vectors." Java has the Java Collections Framework; C++ has the Standard Template Library, and `vector` is only one of its containers.

## First-class containers and the adaptors built on them

| Kind | Members | Slide wording |
|---|---|---|
| **First-class containers** | `vector`, `list`, `deque`, `map` and `multimap`, `set` and `multiset` | store the elements themselves |
| **Container adaptors** | `stack` (default implementation is the **deque**), `queue` (default implementation is also the **deque**), `priority_queue` (default implementation is the **vector**) | modify and restrict a first-class container |

An adaptor is a first-class container with most of its interface hidden: a `stack` is a deque you may only `push`, `pop` and `top` (LIFO); a `queue` is a deque you may only `push` at the back and `front`/`pop` at the front (FIFO); a `priority_queue` is a vector kept as a heap so `top()` is always the largest element.

## deque: push and pop at both ends

```cpp run pin deque.cpp
// predict: Write the output. Elements are separated by tabs; there are two blank lines.
#include <iostream>
#include <deque>
#include <vector>
//https://www.geeksforgeeks.org/deque-cpp-stl/

using namespace std;

void printDeque(deque <int> g)
{
    deque <int> :: iterator it;
    for (it = g.begin(); it != g.end(); ++it)
        cout << '\t' << *it;
    cout << '\n';
}

int main()
{
    deque <int> gquiz;

    gquiz.push_back(10);
    gquiz.push_front(20);
    gquiz.push_back(30);
    gquiz.push_front(15);

    cout << "The deque gquiz is : ";
    printDeque(gquiz);

    cout << "\ngquiz.size() : " << gquiz.size(); //current number of elements

    cout << "\ngquiz.at(2) : " << gquiz.at(2);
    cout << "\ngquiz.front() : " << gquiz.front();
    cout << "\ngquiz.back() : " << gquiz.back();

    cout << "\ngquiz.pop_front() : ";
    gquiz.pop_front();
    printDeque(gquiz);

    cout << "\ngquiz.pop_back() : ";
    gquiz.pop_back();
    printDeque(gquiz);

    return 0;
}
```

A deque (double-ended queue) is a vector that also grows at the front. `gquiz.push_back(10);` then `gquiz.push_front(20);` gives 20 10; after `gquiz.push_back(30);` and `gquiz.push_front(15);` the deque is `15 20 10 30`. It still has random access, so `gquiz.at(2)` is 10, and `front()` and `back()` are the two ends. `gquiz.pop_front();` removes the 15, `gquiz.pop_back();` the 30. The shipped program also prints `max_size()`, a platform-dependent number dropped here.

## priority_queue: largest first

```cpp run pin priorityqueue.cpp
// predict: Write the four non-blank lines. Elements are tab separated.
//code from https://www.geeksforgeeks.org/priority-queue-in-cpp-stl/
#include <iostream>
#include <queue>

using namespace std;

void showpq(priority_queue <int> gq)
{
    priority_queue <int> g = gq;
    while (!g.empty())
    {
        cout << '\t' << g.top();
        g.pop();
    }
    cout << '\n';
}

int main ()
{
    priority_queue <int> gquiz;

    gquiz.push(10);
    gquiz.push(30);
    gquiz.push(20);
    gquiz.push(1);
    gquiz.push(5);

    cout << "The priority queue gquiz is : ";
    showpq(gquiz);

    cout << "\ngquiz.size() : " << gquiz.size();
    cout << "\ngquiz.top() : " << gquiz.top();

    cout << "\ngquiz.pop() : ";
    gquiz.pop();
    showpq(gquiz);

    return 0;
}
```

`priority_queue <int>` lives in `<queue>` and pops the **largest** element first (a max-heap ordered by `operator<`), whatever order you pushed: `30 20 10 5 1`. There is no iterator, so `showpq` drains a copy: `priority_queue <int> g = gq;` then `g.top()` and `g.pop()` until `g.empty()`. Because it works on the copy, `gquiz.size()` is still 5 afterwards; `gquiz.top()` is 30, and after `gquiz.pop();` the queue shows `20 10 5 1`.

## pair holds two values of different types

A `pair`, from `<utility>`, is an object that can hold two values of different types, with member accessors called `first` and `second`. The built-in function `make_pair` simplifies creation.

```cpp run pin pair.cpp
// predict: Write the three lines printed.
#include <utility>
#include <iostream>

using namespace std;
int main()
{
	pair<string, int> myPair;
	myPair.first = "hi";
	myPair.second = 7;

	pair<int, double> p(1, 3.14);

	pair<char, char> p2 = make_pair('a', 'b');

	cout << p.first << ' ' << p.second << std::endl;
	cout << p2.first << ' ' << p2.second << std::endl;

	p2.first = 'z';
	p2.second = 'h';

    cout << p2.first << ' ' << p2.second << std::endl;
}
```

Three ways to build one: default-construct and assign the members (`myPair.first = "hi";`), construct with two arguments (`pair<int, double> p(1, 3.14);`), or `make_pair('a', 'b')`, which deduces `pair<char, char>` from the arguments. `first` and `second` are public data members, so `p2.first = 'z';` changes the pair in place. `myPair` is never printed.

## map: sorted key/value pairs with unique keys

`std::map`, from `<map>`, is a *sorted associative container*: a collection of 1-to-1 mappings, i.e. a collection of key/value pair objects. Its `value_type` is a **pair type** that combines key and value. **Keys must be unique.** Keys are sorted using a comparison function (like the Java Comparator). Search, insertion and removal are logarithmic ("fast!").

```cpp run pin map.cpp
// predict: Write the five lines printed (the first is empty). Which Tom number survives?
#include <utility>
#include <iostream>
#include <map>
#include <iterator>
#include <vector>

using namespace std;

int main()
{
    map<string, string> nameAndNumbers;

    //approach 1, make a pair first, then insert
    nameAndNumbers.insert(pair<string, string>("Tom","604-123-4567"));

    //approach 2, the super long version using the value_type typedef. value_type is of type pair behind the scenes
    //nameAndNumbers.insert(map<string, string>::value_type("Tom", "604-123-4567"));

    //approach 3, insert pair using built-in make_pair function
    //nameAndNumbers.insert(make_pair("Tom", "604-123-4567"));

    //add Harry and attempt to add duplicate Tom key/value pairs
    nameAndNumbers.insert(make_pair("Harry", "604-999-9999"));
    nameAndNumbers.insert(make_pair("Tom", "604-888-8888"));
    nameAndNumbers.insert(make_pair("Tom", "604-888-8228"));
    nameAndNumbers.insert(make_pair("Tom", "604-8888"));
    nameAndNumbers.insert(make_pair("Tom", "604-818888"));

    cout << endl << "Phone numbers of people Named Tom" << endl;

    //get iterator pointing to Tom and print
    map<string, string>::iterator oneNumber = nameAndNumbers.find("Tom");
    cout << oneNumber->first << " - " << oneNumber->second << endl;

    //print out everything in map
    for(auto it = nameAndNumbers.begin(); it != nameAndNumbers.end(); ++it)
    {
        cout << it->first << " - " << it->second << endl;
    }

    return 0;

}
```

The three insert spellings build the same `pair<string, string>`: approach 1 names the pair type, approach 2 uses the container's own typedef `map<string, string>::value_type`, approach 3 lets `make_pair` deduce it. The slide's rule: an insert **fails if an element with the same key is already in the map**, and the refusal is silent. `find` returns an iterator to the pair, so the key is `oneNumber->first` and the value `oneNumber->second`. The closing loop (commented out in the shipped file, and given an `endl` before it here) shows that a map is always sorted by key, not by insertion.

`insert` returns a `pair<iterator, bool>` whose `.second` is `false` on a refused duplicate. The other way in, `nameAndNumbers["Tom"] = "..."`, behaves differently: `operator[]` **creates** the key with a default value if it is missing and **overwrites** the value if it exists.

```widget
map-insert
{ "multi": false, "preset": "map.cpp" }
```

## multimap keeps duplicate keys

```cpp run pin multimap.cpp
// predict: Write the sixteen lines printed, in order (the seventh and the last are empty).
#include <iostream>
#include <map>
#include <iterator>

using namespace std;
//annoying to type out entire iterator, use typedef to shorten it
int main()
{
    multimap<string, string> nameAndNumber;

    nameAndNumber.insert(make_pair("Tom", "604-123-4567"));
    nameAndNumber.insert(make_pair("Harry", "604-999-9999"));
    nameAndNumber.insert(make_pair("Tom", "604-888-8883"));
    nameAndNumber.insert(make_pair("Tom", "604-888-8882"));
    nameAndNumber.insert(make_pair("Chris", "***-*******"));
    nameAndNumber.insert(make_pair("Tom", "604-887-8881"));

    //notice pairs are sorted based on keys (Person's name in this case)
    for (auto pairs = nameAndNumber.begin();
         pairs != nameAndNumber.end(); ++pairs)
    {
        cout << pairs->first << " phone number is " << pairs->second << endl;
    }

    cout << endl << "Phone numbers of Tom" << endl;

    //Method 1 - find duplicates using 1 iterator and size
    multimap<string, string>::iterator PhoneValues = nameAndNumber.find("Tom");
    int count = nameAndNumber.count("Tom");
    for (int i = 0; i < count; i++)
    {
        cout << PhoneValues->first << " " << PhoneValues->second << endl;
        ++PhoneValues;
    }

//    Method 2 - find duplicates using 2 iterators
//     pairIters.first = iterator pointing to first appearance of Tom
//     pairIters.second = iterator pointing to one past last appearance of Tom

    pair <multimap<string, string>::iterator, multimap<string, string>::iterator> pairIters = nameAndNumber.equal_range("Tom");

//    typedef multimap<string, string>::iterator mapIterator;
//    pair <mapIterator, mapIterator> pairIters = nameAndNumber.equal_range("Tom");

    //ret is a pair containing iteratorBeginning, iteratorEnd>
    for (auto it=pairIters.first; it!=pairIters.second; ++it)
        std::cout << it->first << " "<< it->second << endl;
    std::cout << '\n';

    return 0;
}
```

A `multimap<string, string>` accepts every insert, sorted by key and, within equal keys, kept in **insertion order**. The shipped file has the two lookup methods commented out; here they run. Method 1 pairs `find("Tom")`, the first Tom, with `count("Tom")`, how many there are. Method 2 asks `equal_range("Tom")` for a pair of iterators: `pairIters.first` is the first Tom and `pairIters.second` is one past the last, a half-open range to loop over. The pair's type is long enough that lesson 05's `typedef multimap<string, string>::iterator mapIterator;` exists to shorten it. A multimap has no `operator[]`: with several values per key there is no single one to return.

```widget
map-insert
{ "multi": true, "preset": "multimap.cpp" }
```

```challenge
{ "prompt": "Read words from <code>cin</code> until it runs out, count each word in a <code>map&lt;string, int&gt;</code> using <code>[]</code>, then print one <code>word count</code> line per key. The map keeps the keys sorted for you.", "starter": "#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    map<string, int> counts;\n    string word;\n    // read every word and count it\n\n    // print each key and its count\n\n    return 0;\n}\n", "stdin": "the cat and the dog and the bird", "expected": "and 2\nbird 1\ncat 1\ndog 1\nthe 3", "hints": ["<code>while (cin &gt;&gt; word) counts[word]++;</code> — <code>[]</code> creates the key with 0 the first time it is seen.", "Walk it with iterators: <code>for (auto it = counts.begin(); it != counts.end(); ++it) cout &lt;&lt; it-&gt;first &lt;&lt; \" \" &lt;&lt; it-&gt;second &lt;&lt; endl;</code>"], "solution": "#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    map<string, int> counts;\n    string word;\n    while (cin >> word) {\n        counts[word]++;\n    }\n    for (auto it = counts.begin(); it != counts.end(); ++it) {\n        cout << it->first << \" \" << it->second << endl;\n    }\n    return 0;\n}\n" }
```

```quiz
[
  {
    "q": "Which is the default underlying container of `std::stack` and `std::queue`?",
    "options": ["deque", "vector", "list", "map"],
    "answer": 0,
    "explain": "Stack and queue both default to the deque; priority_queue is the one that defaults to the vector."
  },
  {
    "q": "A container adaptor...",
    "options": ["stores elements in a hash table", "modifies and restricts a first-class container", "is any container with an iterator", "is a container of pairs"],
    "answer": 1,
    "explain": "The slide's definition. stack, queue and priority_queue hide most of the underlying deque or vector's interface."
  },
  {
    "q": "Which header declares `std::pair` and `make_pair`?",
    "options": ["`<pair>`", "`<map>`", "`<tuple>`", "`<utility>`"],
    "answer": 3,
    "explain": "pair lives in <utility>; <map> happens to include it, which is why map.cpp compiles either way."
  },
  {
    "q": "What does this print?",
    "code": "pair<char, char> p2 = make_pair('a', 'b');\np2.first = 'z';\ncout << p2.first << p2.second;",
    "options": ["ab", "zb", "za", "zh"],
    "answer": 1,
    "explain": "make_pair builds ('a', 'b'); first is a public member and is reassigned to 'z'; second stays 'b'."
  },
  {
    "q": "The `value_type` of a `map<string, int>` is...",
    "options": ["`int`", "`string`", "`pair<const string, int>`, a pair that combines key and value", "`map<string, int>::iterator`"],
    "answer": 2,
    "explain": "The slide: value_type is a pair type that combines key and value. That is why insert takes a pair and why map<string,string>::value_type(\"Tom\", \"...\") is one of the three insert spellings."
  },
  {
    "q": "What does this print?",
    "code": "map<string, string> m;\nm.insert(make_pair(\"Tom\", \"111\"));\nm.insert(make_pair(\"Tom\", \"222\"));\ncout << m.find(\"Tom\")->second << m.size();",
    "options": ["1111", "2222", "1112", "2221"],
    "answer": 0,
    "explain": "Keys must be unique: the second insert fails because Tom is already there, so the value stays 111 and the size is 1."
  },
  {
    "q": "`m[\"Tom\"] = \"222\";` on a map that already holds Tom with 111...",
    "options": ["is refused like insert", "overwrites the value with 222", "adds a second Tom", "throws out_of_range"],
    "answer": 1,
    "explain": "operator[] creates a missing key with a default value and overwrites an existing one; only insert refuses duplicates."
  },
  {
    "q": "In multimap.cpp, what order do the four Tom entries print in?",
    "options": ["sorted by phone number", "reverse insertion order", "unspecified", "insertion order"],
    "answer": 3,
    "explain": "A multimap sorts by key; entries with equal keys keep the order they were inserted: 604-123-4567, 604-888-8883, 604-888-8882, 604-887-8881."
  },
  {
    "q": "`equal_range(\"Tom\")` on a multimap returns...",
    "options": ["the number of Toms", "a pair of iterators: the first Tom and one past the last Tom", "an iterator to the last Tom", "a vector of all Tom's values"],
    "answer": 1,
    "explain": "pairIters.first is the first appearance, pairIters.second one past the last: a half-open range, so for (it = first; it != second; ++it) visits exactly the Toms."
  },
  {
    "q": "What does this print?",
    "code": "priority_queue<int> pq;\npq.push(10); pq.push(30); pq.push(20);\npq.pop();\ncout << pq.top() << ' ' << pq.size();",
    "options": ["30 2", "10 2", "30 3", "20 2"],
    "answer": 3,
    "explain": "top() is always the largest. pop() removes 30, leaving 20 and 10, so top() is 20 and size() is 2."
  },
  {
    "q": "A multimap supports `operator[]` just like a map.",
    "type": "tf",
    "answer": false,
    "explain": "With several values per key there is no single value to return, so multimap has no []: use find with count, or equal_range."
  }
]
```

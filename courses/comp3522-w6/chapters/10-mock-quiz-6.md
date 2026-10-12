---
title: Mock Quiz 6
minutes: 45
---

50 questions in the real format: multiple choice, true/false, what-does-this-print, fill-in-the-code, bug hunts, matching and one trace by hand. Answer everything before you check. The programs are the instructor's own (pair, map, multimap, multiset, deque, priorityqueue, typedefs, iterator, randomAccessIterator, partitionOdd, the Date activity), so if a line looks familiar, trust what you ran. Where an option lists several output lines they are separated by ` / `.

:::quiz Real quiz conditions
Written at the start of lab on the Learning Hub, covering the Week 6 slides and the Week6 sample programs. Aim for 90% here before you stop studying, then do the practice midterm on paper.
:::

```quiz
[
  {
    "type": "spotbug",
    "q": "Click the line that does not compile (slide 5).",
    "code": "double sum = 5.0;\nauto a;\nauto d = 5.0;\nauto i = 1 + 2;",
    "answer": 2,
    "explain": "auto deduces the type from the initializer; with nothing to deduce from, the slide marks it ERROR: auto requires initializer. d is double, i is int."
  },
  {
    "q": "What prints?",
    "code": "int add(int x, int y) { return x + y; }\nint main() {\n    auto d = 5.0;\n    auto i = 1 + 2;\n    auto sum = add(5, 6);\n    cout << i / 2 << ' ' << d / 2 << ' ' << sum / 2 << endl;\n}",
    "options": ["1.5 2.5 5.5", "1 2.5 5", "1 2 5", "1.5 2.5 5"],
    "answer": 1,
    "explain": "i is deduced int (3 / 2 is integer division: 1), d is double (2.5), and sum takes add's return type int (11 / 2 is 5)."
  },
  {
    "q": "In `auto add(int x, int y) -> int;` the keyword `auto`...",
    "options": ["deduces `int` from the return statements in the body", "makes the function return whatever type the caller wants", "is an error: a trailing return type needs `decltype`", "performs no type inference; it is just part of the syntax for a trailing return type"],
    "answer": 3,
    "explain": "The slide: in this case auto does not perform type inference. People use the trailing form so a column of declarations lines up (`auto divide(double x, double y) -> double;`)."
  },
  {
    "q": "According to the slides, `void add_and_print(auto x, auto y)` is allowed because the compiler deduces x and y from the call.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 6: auto can't be used with function parameters, because the compiler can't infer types for x and y at compile time. (C++20 g++ actually accepts it as a template, but the quiz follows the slide.)"
  },
  {
    "q": "What prints?",
    "code": "vector<int> v = {0, 1, 2, 3, 4, 5};\nfor (int k : v) k *= 10;\nfor (const int& k : v) cout << k << ' ';",
    "options": ["0 10 20 30 40 50", "compile error: k is a copy and cannot be assigned", "0 1 2 3 4 5", "10 20 30 40 50 60"],
    "answer": 2,
    "explain": "`int k` is a copy of each element, so multiplying it changes nothing in v. Only `for (int& k : v) k *= 10;` would print 0 10 20 30 40 50. The const reference form reads without copying."
  },
  {
    "q": "The slide says the STL is composed of...",
    "options": ["classes, templates and namespaces", "vectors, maps and sets", "collections, streams and functors", "containers, iterators and algorithms"],
    "answer": 3,
    "explain": "Containers store objects and data, iterators work on a sequence of values, algorithms are functions designed to be used on a range of elements. 'Like the Java Collections Framework SUPERPOWERED.'"
  },
  {
    "q": "The STL uses value semantics. That means...",
    "options": ["a container stores a reference to each object you add", "a container stores a pointer to each object you add", "a container gets a copy of the object, so the element class needs a copy constructor, an assignment operator and a destructor", "objects are moved into the container and destroyed outside it"],
    "answer": 2,
    "explain": "Containers get a COPY of the object we are putting in. The three members the slide lists are exactly the ones the copy needs (Week 3's big three)."
  },
  {
    "q": "The STL uses half-open ranges. For an array of size 5 that means iterating over...",
    "options": ["[0, 4]: both ends included", "(0, 5]: index 0 excluded", "[1, 5]: one-based like Java", "[0, 5): index 0 included, index 5 excluded"],
    "answer": 3,
    "explain": "[included, not included). It is why `end()` can be one past the last element and `for (it = begin(); it != end(); ++it)` visits every element exactly once."
  },
  {
    "q": "What prints?",
    "code": "vector<int> v2 {2, 4, 6, 8, 10};\nv2.insert(v2.begin(), 6);\nv2.insert(v2.begin() + 3, -4);\nv2.erase(v2.begin() + 1);\nfor (int x : v2) cout << x << ' ';",
    "options": ["6 2 4 -4 6 8 10", "2 4 -4 6 8 10", "6 4 -4 6 8 10", "6 4 6 -4 8 10"],
    "answer": 2,
    "explain": "insert at begin(): 6 2 4 6 8 10. insert BEFORE position 3: 6 2 4 -4 6 8 10. erase position 1 (the 2) shifts the rest left: 6 4 -4 6 8 10. Slide 21's comments, line for line."
  },
  {
    "q": "Which statement about the three container categories matches slide 18?",
    "options": ["Sequence containers are automatically sorted; associative ones keep insertion order", "Associative containers are automatically sorted and searched in O(log n); unordered associative containers use a hash and search in O(1), O(n) worst case", "Unordered containers are searched in O(log n); associative containers in O(1)", "All three categories search in O(n)"],
    "answer": 1,
    "explain": "Sequence (array, vector, deque, list, forward_list): we specify the order. Associative (set, multiset, map, multimap): sorted, O(log n). Unordered associative (unordered_set, unordered_map, ...): hashed, O(1) to O(n) worst case."
  },
  {
    "type": "match",
    "q": "Match each container adaptor to its default implementation.",
    "pairs": [
      ["stack", "deque (LIFO: push and pop at the same end)"],
      ["queue", "deque (FIFO: push at the back, pop at the front)"],
      ["priority_queue", "vector (largest element on top)"]
    ],
    "explain": "Slide 25: adaptors modify and restrict a first-class container. Stack and queue default to the deque, priority_queue to the vector. Vector, list, deque, map/multimap and set/multiset are the first-class containers."
  },
  {
    "q": "What prints (pair.cpp)?",
    "code": "pair<string, int> myPair;\nmyPair.first = \"hi\";\nmyPair.second = 7;\npair<int, double> p(1, 3.14);\npair<char, char> p2 = make_pair('a', 'b');\ncout << p.first << ' ' << p.second << endl;\ncout << p2.first << ' ' << p2.second << endl;\np2.first = 'z';\np2.second = 'h';\ncout << p2.first << ' ' << p2.second << endl;",
    "options": ["hi 7 / 1 3.14 / a b", "1 3.14 / a b / z h", "1 3.14 / a b / a b", "compile error: `make_pair` needs `<map>`"],
    "answer": 1,
    "explain": "myPair is filled but never printed. `first` and `second` are public members you can read and assign; pair and make_pair live in `<utility>`."
  },
  {
    "type": "fill",
    "q": "Build the pair without spelling out its type.",
    "code": "pair<char, char> p2 = ___('a', 'b');",
    "answer": ["make_pair", "std::make_pair"],
    "explain": "The built-in function make_pair deduces `pair<char, char>` from its arguments. map.cpp's approach 3 uses it: `insert(make_pair(\"Tom\", \"604-123-4567\"))`."
  },
  {
    "q": "What does the last line print (map.cpp)?",
    "code": "map<string, string> nameAndNumbers;\nnameAndNumbers.insert(pair<string, string>(\"Tom\", \"604-123-4567\"));\nnameAndNumbers.insert(make_pair(\"Harry\", \"604-999-9999\"));\nnameAndNumbers.insert(make_pair(\"Tom\", \"604-888-8888\"));\nnameAndNumbers.insert(make_pair(\"Tom\", \"604-888-8228\"));\nnameAndNumbers.insert(make_pair(\"Tom\", \"604-8888\"));\nnameAndNumbers.insert(make_pair(\"Tom\", \"604-818888\"));\nmap<string, string>::iterator oneNumber = nameAndNumbers.find(\"Tom\");\ncout << oneNumber->first << \" - \" << oneNumber->second;",
    "options": ["Tom - 604-123-4567", "Tom - 604-818888", "Tom - 604-888-8888", "Tom - 604-123-4567 followed by four more Tom lines"],
    "answer": 0,
    "explain": "Keys must be unique: every later insert with key Tom fails and returns {iterator, false}, so the first value stays. The map holds two entries, Harry and Tom."
  },
  {
    "q": "A map's `value_type` is...",
    "options": ["the type of the mapped value", "the key type", "an iterator type", "a pair type that combines key and value"],
    "answer": 3,
    "explain": "Slide 28. That is why `phonebook.insert(map<string, string>::value_type(\"Sam\", \"6045551212\"))` and `insert(make_pair(...))` are the same insert."
  },
  {
    "type": "spotbug",
    "q": "Click the line whose comment is wrong about what the code does.",
    "code": "map<string, string> phonebook;\nphonebook.insert(make_pair(\"Sam\", \"6045551212\"));\nphonebook.insert(make_pair(\"Sam\", \"2505551212\")); // update Sam's number\ncout << phonebook[\"Sam\"];                          // prints Sam's number",
    "answer": 3,
    "explain": "insert with an existing key does nothing and returns {it, false}: Sam keeps 6045551212. To overwrite, use `phonebook[\"Sam\"] = \"2505551212\";` (operator[] inserts a default value when the key is missing and assigns otherwise)."
  },
  {
    "q": "What prints (multimap.cpp)?",
    "code": "multimap<string, string> nameAndNumber;\nnameAndNumber.insert(make_pair(\"Tom\", \"604-123-4567\"));\nnameAndNumber.insert(make_pair(\"Harry\", \"604-999-9999\"));\nnameAndNumber.insert(make_pair(\"Tom\", \"604-888-8883\"));\nnameAndNumber.insert(make_pair(\"Tom\", \"604-888-8882\"));\nnameAndNumber.insert(make_pair(\"Chris\", \"***-*******\"));\nnameAndNumber.insert(make_pair(\"Tom\", \"604-887-8881\"));\nfor (auto pairs = nameAndNumber.begin(); pairs != nameAndNumber.end(); ++pairs)\n    cout << pairs->first << \" phone number is \" << pairs->second << endl;",
    "options": ["Chris, Harry, then one Tom line (604-123-4567): duplicate keys are refused", "the four Tom lines in insertion order, then Harry, then Chris", "Chris, Harry, then the Toms sorted by number: 604-123-4567, 604-887-8881, 604-888-8882, 604-888-8883", "Chris, Harry, then the Toms in insertion order: 604-123-4567, 604-888-8883, 604-888-8882, 604-887-8881"],
    "answer": 3,
    "explain": "A multimap keeps duplicate keys. Keys are sorted (Chris < Harry < Tom); within an equal key the elements stay in insertion order. Six lines in all."
  },
  {
    "type": "fill",
    "q": "Get both bounds of Tom's entries in one call (multimap.cpp, method 2).",
    "code": "typedef multimap<string, string>::iterator mapIterator;\npair<mapIterator, mapIterator> pairIters = nameAndNumber.___(\"Tom\");\nfor (auto it = pairIters.first; it != pairIters.second; ++it)\n    cout << it->first << \" \" << it->second << endl;",
    "answer": ["equal_range"],
    "explain": "equal_range returns a pair: an iterator to the first Tom and one past the last Tom. Method 1 does the same with `find(\"Tom\")` and `count(\"Tom\")` steps. The typedef is slide 39's trick for the long pair type."
  },
  {
    "q": "deque.cpp (tabs shown as spaces). The first `printDeque` line and the last one are...",
    "code": "deque<int> gquiz;\ngquiz.push_back(10);\ngquiz.push_front(20);\ngquiz.push_back(30);\ngquiz.push_front(15);\ncout << \"The deque gquiz is : \"; printDeque(gquiz);\ncout << \"\\ngquiz.size() : \" << gquiz.size();\ncout << \"\\ngquiz.at(2) : \" << gquiz.at(2);\ncout << \"\\ngquiz.front() : \" << gquiz.front();\ncout << \"\\ngquiz.back() : \" << gquiz.back();\ncout << \"\\ngquiz.pop_front() : \"; gquiz.pop_front(); printDeque(gquiz);\ncout << \"\\ngquiz.pop_back() : \"; gquiz.pop_back(); printDeque(gquiz);",
    "options": ["`15 20 10 30` and `20 10`", "`10 20 30 15` and `20 30`", "`20 15 10 30` and `15 10`", "`15 20 10 30` and `15 20`"],
    "answer": 0,
    "explain": "push_back appends, push_front prepends: 10, then 20 10, then 20 10 30, then 15 20 10 30. size 4, at(2) is 10, front 15, back 30. pop_front leaves 20 10 30; pop_back leaves 20 10."
  },
  {
    "q": "What prints (priorityqueue, tabs shown as spaces)?",
    "code": "void showpq(priority_queue<int> gq) {\n    priority_queue<int> g = gq;\n    while (!g.empty()) { cout << '\\t' << g.top(); g.pop(); }\n    cout << '\\n';\n}\nint main() {\n    priority_queue<int> gquiz;\n    gquiz.push(10); gquiz.push(30); gquiz.push(20); gquiz.push(1); gquiz.push(5);\n    cout << \"The priority queue gquiz is : \"; showpq(gquiz);\n    cout << \"\\ngquiz.size() : \" << gquiz.size();\n    cout << \"\\ngquiz.top() : \" << gquiz.top();\n    cout << \"\\ngquiz.pop() : \"; gquiz.pop(); showpq(gquiz);\n}",
    "options": ["1 5 10 20 30 / size 5 / top 1 / 5 10 20 30", "30 20 10 5 1 / size 5 / top 30 / 20 10 5 1", "10 30 20 1 5 / size 5 / top 10 / 30 20 1 5", "30 20 10 5 1 / size 5 / top 30 / 30 20 10 5"],
    "answer": 1,
    "explain": "A priority_queue pops the LARGEST first (a max-heap ordered by operator<). showpq takes the queue by value and drains its own copy, so gquiz still has 5 elements and top 30 afterwards; pop removes the 30."
  },
  {
    "q": "Elements of a `std::set`...",
    "options": ["are const: they cannot be edited after being added", "can be modified through a non-const iterator", "are sorted only when you call `sort()`", "may be duplicated"],
    "answer": 0,
    "explain": "Slide 31: a sorted set of unique objects, the value of an element also identifies it, elements cannot be edited after being added. Erase and re-insert to change one. Typically a binary search tree, logarithmic operations."
  },
  {
    "q": "What prints (multiset.cpp)?",
    "code": "multiset<int> mymultiset;\nmultiset<int>::iterator it;\nmymultiset.insert(40);\nfor (int i = 1; i < 7; i++) mymultiset.insert(i * 10);\nit = mymultiset.begin();\nit++;\nmymultiset.erase(it);\nmymultiset.erase(40);\nit = mymultiset.find(50);\nmymultiset.erase(it, mymultiset.end());\ncout << \"mymultiset contains:\";\nfor (it = mymultiset.begin(); it != mymultiset.end(); ++it) cout << ' ' << *it;",
    "options": ["mymultiset contains: 10 30", "mymultiset contains: 10 30 40 50 60", "mymultiset contains: 10 30 40", "mymultiset contains: 10 20 30"],
    "answer": 0,
    "explain": "After the inserts: 10 20 30 40 40 50 60. erase(it) removes the 20. erase(40) removes BOTH 40s. erase(find(50), end()) removes 50 and 60. Left: 10 30."
  },
  {
    "q": "`mymultiset.erase(40)` on a multiset holding two 40s...",
    "options": ["removes the first 40 only", "removes the element at position 40", "removes every element equal to 40", "does nothing: erase needs an iterator"],
    "answer": 2,
    "explain": "Three erase overloads: by iterator (one element), by key (all elements equal to the key), by range [first, last). The program's own comment: erased all 40s!"
  },
  {
    "q": "What prints? (`operator<` compares myPairs by the sum of their components, as on slide 32.)",
    "code": "struct myPair { int x; int y; };\nbool operator<(const myPair& lhs, const myPair& rhs) {\n    return lhs.x + lhs.y < rhs.x + rhs.y;\n}\nint main() {\n    set<myPair> s;\n    s.insert({5, 5});\n    s.insert({1, 2});\n    s.insert({4, 0});\n    s.insert({2, 1});\n    for (const myPair& p : s) cout << \"(\" << p.x << \",\" << p.y << \") sum \" << p.x + p.y << endl;\n    cout << \"size \" << s.size() << endl;\n}",
    "options": ["(1,2) sum 3 / (2,1) sum 3 / (4,0) sum 4 / (5,5) sum 10 / size 4", "(1,2) sum 3 / (4,0) sum 4 / (5,5) sum 10 / size 3", "(5,5) sum 10 / (1,2) sum 3 / (4,0) sum 4 / (2,1) sum 3 / size 4", "compile error: set needs `operator==`"],
    "answer": 1,
    "explain": "Under this ordering {2,1} is neither less than nor greater than {1,2}, so the set treats them as equivalent and refuses the second. Equality in a set is defined by the comparison, never by operator==."
  },
  {
    "q": "`lessThan(x, x) == false` is the strict-weak-ordering rule called...",
    "options": ["transitivity", "antisymmetry", "reflexivity", "irreflexivity"],
    "answer": 3,
    "explain": "x cannot be less than itself. Antisymmetry: if lessThan(x, y) then !lessThan(y, x). Transitivity: if lessThan(x, y) and lessThan(y, z) then lessThan(x, z)."
  },
  {
    "type": "spotbug",
    "q": "Click the line that breaks the strict weak ordering.",
    "code": "struct Score { int points; };\nbool operator<(const Score& lhs, const Score& rhs)\n{\n    return lhs.points <= rhs.points;\n}\nset<Score> leaderboard;",
    "answer": 4,
    "explain": "With `<=`, lessThan(x, x) is true: irreflexivity fails, and antisymmetry too. A set built on it may lose elements or loop. Use `<`."
  },
  {
    "type": "spotbug",
    "q": "g++ says `multiset` was not declared in this scope. Click the include line that is wrong for this program.",
    "code": "#include <iostream>\n#include <map>\nusing namespace std;\nint main() {\n    multiset<int> ms = {3, 1, 3};\n    cout << ms.count(3);\n}",
    "answer": 2,
    "explain": "set and multiset live in `<set>`; map and multimap in `<map>`. multiset.cpp includes `<set>` (its `<map>` include is unused)."
  },
  {
    "q": "`typedef int arr_t[3];` declares...",
    "options": ["an array of three ints named `arr_t`", "a pointer alias: `arr_t` is `int*`", "an error: typedef cannot name arrays", "an alias `arr_t` for the type 'array of 3 int', so `arr_t myArr;` is `int myArr[3];`"],
    "answer": 3,
    "explain": "typedef creates an alias that can be used anywhere instead of a (possibly) complex type name. `typedef int int_t;` makes int_t an int; typedefs/main.cpp uses `arr_t arrT = {0,1,2};`."
  },
  {
    "q": "What do the two numeric lines print (typedefs/main.cpp)?",
    "code": "typedef int int_t;\ntypedef int& reference;\ntypedef int* pointer;\nint main() {\n    int_t intT = 99;\n    reference intRef = intT;\n    pointer intPtr = &intT;\n    cout << intT << endl;\n    intRef++;\n    cout << intT << endl;\n}",
    "options": ["99 / 100", "99 / 99", "100 / 100", "compile error: `reference` is a reserved word"],
    "answer": 0,
    "explain": "`reference` is just an alias for int&, so intRef is another name for intT and the increment shows through it. These are the names the standard containers typedef too (`vector<int>::reference`, `pointer`)."
  },
  {
    "q": "A container's `size_type` is...",
    "options": ["a signed `int`", "an unsigned integer type, sufficiently large to hold the size of any object of that class", "`long long` on every platform", "another name for `iterator`"],
    "answer": 1,
    "explain": "Slide 49. It appears in all first-class containers and in the container adaptors. `for (vector<int>::size_type i = 0; i < vec.size(); ++i)` avoids the signed/unsigned comparison warning that `int i` gives."
  },
  {
    "type": "fill",
    "q": "Print the vector backwards: 5 4 3 2 1.",
    "code": "vector<int> myVec = {1, 2, 3, 4, 5};\nfor (vector<int>::reverse_iterator it = myVec.___(); it != myVec.rend(); ++it)\n    cout << *it << ' ';",
    "answer": ["rbegin"],
    "explain": "A reverse_iterator starts at the LAST element with rbegin(); incrementing it moves towards the beginning, and rend() is the matching one-before-the-first bound."
  },
  {
    "q": "`c.end()` returns an iterator that...",
    "options": ["points to the last element", "points to the first element if it exists", "points one past the last element and must not be dereferenced", "is null when the container is empty"],
    "answer": 2,
    "explain": "Slide 60: a theoretical one element past the last element. It does not point to an element; don't dereference end. For an empty container begin() == end(), so the loop runs zero times."
  },
  {
    "type": "spotbug",
    "q": "Click the line with undefined behaviour.",
    "code": "vector<int> intVec = {9, 10, 11};\nauto itBegin = intVec.begin();\nauto itEnd = intVec.end();\ncout << *itBegin << endl;\ncout << *itEnd << endl;",
    "answer": 5,
    "explain": "itEnd is one past 11. Dereferencing it reads memory that is not an element: undefined behaviour, not an exception (the STL performs almost no checking)."
  },
  {
    "q": "What prints (iterator.cpp)?",
    "code": "list<int> container = {1, 2, 3, 4, 5};\nlist<int>::iterator itBegin = container.begin();\n*itBegin = 999;\ncout << \"first: \" << *itBegin << endl;\nfor (auto i = container.begin(); i != container.end(); ++i) cout << *i << \" \";\ncout << endl;\nlist<int>::iterator it = itBegin++;\ncout << \"*it: \" << *it << endl;\ncout << \"*itBegin: \" << *itBegin << endl;",
    "options": ["first: 999 / 999 2 3 4 5 / *it: 999 / *itBegin: 2", "first: 999 / 999 2 3 4 5 / *it: 2 / *itBegin: 2", "first: 1 / 1 2 3 4 5 / *it: 1 / *itBegin: 2", "first: 999 / 999 2 3 4 5 / *it: 2 / *itBegin: 999"],
    "answer": 0,
    "explain": "`*itBegin = 999` writes through the iterator. `it = itBegin++` is the slide-68 postfix row: `It temp = i; ++i; return temp;` so it keeps the old position (999) and itBegin moves to 2."
  },
  {
    "q": "randomAccessIterator, first eight lines. The values printed for `++v.begin()`, `v.begin() + 3`, `v.end() - nearEndIt`, the comparison, and the final `print(v)` are...",
    "code": "vector<string> v = {\"a\", \"b\", \"c\", \"d\", \"e\", \"f\"};\nprint(v);\nauto nearEndIt = (v.end() - 1);\ncout << *(v.begin()) << endl;\ncout << *(++v.begin()) << endl;\ncout << *(v.begin() + 3) << endl;\ncout << *nearEndIt << endl;\ncout << v.end() - nearEndIt << endl;\ncout << ((nearEndIt < v.end()) ? \"TRUE\" : \"FALSE\") << endl;\nvector<string>::iterator midIt = v.begin() + 3;\n*midIt = \"z\";\nprint(v);",
    "options": ["b, d, 1, TRUE, a b c z e f", "b, c, 1, TRUE, a b c d e f", "a, d, 0, FALSE, a b c z e f", "b, d, 5, TRUE, a b z d e f"],
    "answer": 0,
    "explain": "Random access: `+ 3` jumps to d, `end() - 1` is f, subtracting two iterators gives a difference_type (1), `<` compares positions. `*midIt = \"z\"` is the same as v[3] = \"z\"."
  },
  {
    "type": "spotbug",
    "q": "Click the line that does not compile.",
    "code": "list<int> container = {1, 2, 3, 4, 5};\nlist<int>::iterator it = container.begin();\n++it;\nit = it + 2;\ncout << *it;",
    "answer": 4,
    "explain": "A list's iterator is bidirectional: `++`, `--`, `*`, `==`, `!=` only. Only random-access iterators permit an integer to be added or subtracted (g++: no match for operator+). Use `std::advance(it, 2)` or two `++`."
  },
  {
    "type": "match",
    "q": "Match each container or stream iterator to the kind of iterator it provides.",
    "pairs": [
      ["vector, deque, array", "random access: `+ n`, `- n`, `it1 - it2`, `[n]`, `<`"],
      ["list, set, map, multiset, multimap", "bidirectional: `++` and `--`, multi-pass, read and write"],
      ["forward_list", "forward: `++` only, multi-pass, read and write"],
      ["istream_iterator", "input: single pass, read only"],
      ["ostream_iterator", "output: single pass, write only"]
    ],
    "explain": "Each kind is defined by the operations it supports: read, write, increment (single or multiple passes), decrement, random access. Each richer kind adds to the one before it."
  },
  {
    "q": "`iter1 - iter2` (one iterator subtracted from another) is permitted for...",
    "options": ["any iterator kind", "bidirectional and random-access iterators", "only random-access iterators; the result is a difference_type", "forward iterators and above"],
    "answer": 2,
    "explain": "Slide 77: only random-access iterators permit an integer to be added to or subtracted from an iterator, and only they permit one iterator to be subtracted from another."
  },
  {
    "q": "An input iterator supports multiple passes over the same range.",
    "type": "tf",
    "answer": false,
    "explain": "Input and output iterators are single pass (think of reading a stream). Forward iterators and above are multi-pass: you can copy the iterator and dereference the same iterant again."
  },
  {
    "q": "An STL algorithm...",
    "options": ["changes the size of the container when it removes elements", "works on the closed range [first, last]", "is a function used on a range of elements [first, last) that does not change the size of the container", "works only on vectors and arrays"],
    "answer": 2,
    "explain": "Slide 80: used on an array or an STL container, always in the range [first, last), does not change the size of the container, used with iterators or pointers. Even remove_if only moves elements."
  },
  {
    "type": "match",
    "q": "Match each algorithm to its family (slides 81 and 82).",
    "pairs": [
      ["`find()`, `for_each()`", "sequential, non-modifying"],
      ["`copy()`, `remove_if()`", "sequential, modifying"],
      ["`partition()`, `is_partitioned()`", "partitioning"],
      ["`sort()`, `is_sorted()`", "sorting"],
      ["`merge()`, `inplace_merge()`", "merge"],
      ["`make_heap()`, `push_heap()`", "heap"]
    ],
    "explain": "The other three families: binary search (`binary_search()`), min/max (`min()`, `max()`) and generalized numeric operations, which live in `<numeric>`; everything else is in `<algorithm>`."
  },
  {
    "q": "What prints (partitionOdd.cpp)?",
    "code": "bool IsOdd(int i) { return (i % 2) == 1; }\nint main() {\n    vector<int> myvector;\n    for (int i = 1; i < 11; ++i) myvector.push_back(i);\n    vector<int>::iterator iterBound;\n    iterBound = partition(myvector.begin(), myvector.end(), IsOdd);\n    cout << \"odd elements:\";\n    for (auto it = myvector.begin(); it != iterBound; ++it) cout << ' ' << *it;\n    cout << '\\n';\n    cout << \"even elements:\";\n    for (auto it = iterBound; it != myvector.end(); ++it) cout << ' ' << *it;\n    cout << '\\n';\n}",
    "options": ["odd elements: 1 3 5 7 9 / even elements: 2 4 6 8 10", "odd elements: 9 7 5 3 1 / even elements: 10 8 6 4 2", "odd elements: 1 9 3 7 5 / even elements: 2 4 6 8 10", "odd elements: 1 9 3 7 5 / even elements: 6 4 8 2 10"],
    "answer": 3,
    "explain": "Slide 101 and the real run agree: {1,9,3,7,5,6,4,8,2,10}, iterBound at 6. Relative order is NOT maintained; the first option is what stable_partition would give."
  },
  {
    "q": "`std::partition(first, last, p)` returns...",
    "options": ["an iterator to the first element of the second ('false') group, or the end of the container if that group is empty", "an iterator to the last 'true' element", "the number of elements for which p was true", "`true` if the range was already partitioned"],
    "answer": 0,
    "explain": "Slide 86. In partitionOdd that is the first even number; printing [begin, iterBound) gives the odd group and [iterBound, end) the even group."
  },
  {
    "q": "`std::partition` keeps the relative order of the elements inside each group.",
    "type": "tf",
    "answer": false,
    "explain": "Relative ordering of the elements is not maintained (1 2 3 4 5 6 7 8 9 10 becomes 1 9 3 7 5 6 4 8 2 10). `stable_partition` keeps it: 1 3 5 7 9 2 4 6 8 10."
  },
  {
    "type": "fill",
    "q": "Complete the first line of the slide's possible implementation of partition.",
    "code": "template<class ForwardIt, class UnaryPredicate>\nForwardIt partition(ForwardIt first, ForwardIt last, UnaryPredicate p)\n{\n    first = std::___(first, last, p); // find first false\n    if (first == last) return first;",
    "answer": ["find_if_not"],
    "explain": "find_if_not returns the first element for which p is false; everything before it is already in the true group. If there is none, first == last and the whole range is the true group."
  },
  {
    "type": "fill",
    "q": "Complete the loop body of the same implementation.",
    "code": "    for (ForwardIt i = std::next(first); i != last; ++i)\n    {\n        if (p(*i)) {\n            std::___(i, first);\n            ++first;\n        }\n    }\n    return first;",
    "answer": ["iter_swap"],
    "explain": "iter_swap swaps the elements the two iterators point to: the true element at i moves to the front of the false group, and ++first moves the boundary one to the right."
  },
  {
    "type": "trace",
    "q": "Trace the slide's implementation on {2, 1, 4, 3} with IsOdd. `seq` holds the vector's contents and is refreshed after every swap. Type its value (digits separated by spaces) at the start, after the first swap and after the second.",
    "code": "bool IsOdd(int i) { return (i % 2) == 1; }\nstring show(const vector<int>& v) {\n    string s;\n    for (int x : v) s += to_string(x) + ' ';\n    return s;\n}\nint main() {\n    vector<int> v;\n    v.push_back(2); v.push_back(1); v.push_back(4); v.push_back(3);\n    string seq = show(v);\n    auto first = find_if_not(v.begin(), v.end(), IsOdd);\n    auto i = next(first);\n    while (i != v.end()) {\n        if (IsOdd(*i)) {\n            iter_swap(i, first);\n            ++first;\n            seq = show(v);\n        }\n        ++i;\n    }\n    cout << seq << \" bound -> \" << *first << endl;\n}",
    "var": "seq",
    "steps": ["2 1 4 3", "1 2 4 3", "1 3 4 2"],
    "explain": "find_if_not stops at 2 (first). i = 1: odd, swap with 2 -> 1 2 4 3, first now at 2. i = 4: even, skip. i = 3: odd, swap with 2 -> 1 3 4 2, first now at 4. Loop ends; the bound points to 4. g++'s std::partition gives 3 1 4 2 for the same input (a different valid partition), bound still 4."
  },
  {
    "q": "`std::partition({2, 4, 6}, IsOdd)`: no element is odd. The returned iterator is...",
    "options": ["`end()`", "`begin()`: the whole range is the false group", "undefined", "an iterator to 4"],
    "answer": 1,
    "explain": "find_if_not finds the first false element at the very front, nothing is swapped, and first is returned unchanged. With no EVEN elements ({1, 3, 5}) the bound would be end(): the false group is empty."
  },
  {
    "q": "The Date activity. `dates1` is a `priority_queue<Date>` and `stub` uses the shipped `operator<` that always returns false. c = 2016/06/30, a = 2018/01/01, b = 2017/01/01 are pushed in the order c, a, b. With the correct year-month-day `operator<`, `print_queue(dates1)` then `print_queue(stub)` print...",
    "options": ["2018/01/01 2017/01/01 2016/06/30 then 2016/06/30 2018/01/01 2017/01/01", "2016/06/30 2017/01/01 2018/01/01 then the same again", "2018/01/01 2017/01/01 2016/06/30 twice", "2016/06/30 2018/01/01 2017/01/01 then 2018/01/01 2017/01/01 2016/06/30"],
    "answer": 0,
    "explain": "A priority_queue puts the largest (latest) date on top, so the correct ordering drains 2018, 2017, 2016. With an always-false comparison no element is ever 'less', so the heap never reorders and the dates come out roughly as pushed. The shipped DateTester pushes a, b, c newest-first, which is why it could not show the difference."
  },
  {
    "q": "Which `operator<` gives Date a strict weak ordering?",
    "options": ["`return lhs.day < rhs.day;`", "`return lhs.year <= rhs.year;`", "`return lhs.year < rhs.year || lhs.month < rhs.month || lhs.day < rhs.day;`", "`if (lhs.year != rhs.year) return lhs.year < rhs.year; if (lhs.month != rhs.month) return lhs.month < rhs.month; return lhs.day < rhs.day;`"],
    "answer": 3,
    "explain": "Compare the most significant field first and fall through only on ties. Option 1 ignores year and month; option 2 fails irreflexivity; option 3 says 2018/01/01 < 2017/12/31 (month 1 < 12) AND the reverse, breaking antisymmetry. `>` is then `operator<(rhs, lhs)`, `>=` is `!operator<(lhs, rhs)`, `<=` is `!operator>(lhs, rhs)`."
  }
]
```

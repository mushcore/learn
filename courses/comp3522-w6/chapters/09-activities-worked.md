---
title: The three activities, worked
minutes: 30
---

The deck ends with three activities: read partition.cpp, finish the Date class's `operator<`, and write two small programs that each show one algorithm on one container.

## Activity 1: partition.cpp, cities by distance

The slide: *examine partition.cpp; this program generates cities in 2D space and partitions them based on distance; examine how it uses different algorithms to achieve its output: partition algorithm, for_each algorithm.* The shipped program draws random coordinates between 0 and 100 (seeded with `time(0)`); this copy uses ten fixed ones and changes nothing else.

```cpp run pin partitionCities.cpp
// predict: Write the "First false city" line and the first two cities printed after it.
#include <algorithm>
#include <cmath>
#include <iostream>
#include <list>
#include <utility>
/*
 * partition re-orders cities so cities that have a distance
 * less than DISTANCE appear first
*/

using namespace std;

constexpr int POPULATION = 10;
constexpr double DISTANCE = 50;

struct city
{
    static int counter;
    int number;
    std::pair<double, double> coordinates;
    city(std::pair<double, double> coordinates) :
        number{++counter}, coordinates{ coordinates } { }
    city(double x, double y) :
        number{++counter} , coordinates{ std::make_pair(x, y) } { }
    friend std::ostream& operator<<(std::ostream& out, const struct city& s);
};

int city::counter = 0;

std::ostream& operator<<(std::ostream& out, const struct city& s) {
    out << s.number << " (" << s.coordinates.first << ", " << s.coordinates.second << ")";
    return out;
}

typedef struct city city;

double distance(city candidate) {
    return std::sqrt( pow(candidate.coordinates.first, 2)
        + pow(candidate.coordinates.second, 2));
}

bool close_to_origin(city candidate)
{
    if (DISTANCE > distance(candidate)) {
        return true;
    }
    return false;
}

void print(city candidate)
{
    std::cout << candidate << " " << distance(candidate) << std::endl;
}

int main()
{
    // the shipped program draws these from a uniform_real_distribution seeded with time(0);
    // fixed coordinates here so the output is the same every run
    double xs[POPULATION] = {30, 80, 12, 60, 3, 90, 40, 70, 20, 55};
    double ys[POPULATION] = {40, 60, 5, 10, 4, 90, 30, 70, 48, 2};

    //create cities and push to cities list
    std::list<city> cities;
    for (int i = 0; i < POPULATION; ++i) {
        city newcity(xs[i], ys[i]);
        cities.push_back(newcity);
    }

    //print cities, partition them, and print again
    for_each(cities.begin(), cities.end(), print);
    cout << "\n\n";
    auto firstFalseCityItr = partition(cities.begin(), cities.end(), close_to_origin); //cities where DISTANCE > actual distance appear first
    cout << "First false city: " << firstFalseCityItr->number << endl;
    cout << "Cities before false city have distance " << DISTANCE << endl;
    for_each(cities.begin(), cities.end(), print);
}
```

`static int counter;` is one counter shared by every city, so `number{++counter}` numbers the cities 1 to 10 in creation order. `std::list<city>` hands out bidirectional iterators, and `partition` needs only a `ForwardIt`, so it still works. `for_each` applies `print` to every element, the non-modifying family. `close_to_origin` is the unary predicate `DISTANCE > distance(candidate)`, true only strictly inside 50 units: a city at exactly 50 is false.

## Activity 2: the Date class and a strict weak ordering

The slide: *I made a simple Date class. Examine Date.hpp, Date.cpp, DateTester.cpp. Implement operator< in Date so that it has a strict weak ordering. What is happening in the main method? Comment the code.*

```cpp pin Date.hpp and the relevant parts of Date.cpp
// ---- Date.hpp ----
class Date
{
    public:
        Date(int year = 2018, int month = 1, int day = 1);
        // Use compiler-generated copy constructor, destructor, and assignment
        // operator because we are just storing three primitive data members
        int get_year() const { return year; } // implicitly inline
        int get_month() const { return month; }
        int get_day() const { return day; }
        Date set_date(int year, int month, int day); // returns previous date
        bool is_leap_year() const { return is_leap_year(year); }
        // define statics in the class implementation file
        static bool is_leap_year(int year);
        static bool is_valid_date(int year, int month, int date);
        static Date today(); // no *this pointer
        friend std::ostream& operator<<(std::ostream&, const Date&);
        friend std::istream& operator>>(std::istream&, Date&);
        Date& operator++(); //prefix
        Date operator++(int); // postfix
        Date& operator--(); //prefix
        Date operator--(int); // postfix
        friend bool operator==(const Date& lhs, const Date& rhs);
        friend bool operator!=(const Date& lhs, const Date& rhs);
        friend bool operator<(const Date& lhs, const Date& rhs);
        friend bool operator>(const Date& lhs, const Date& rhs);
        friend bool operator>=(const Date& lhs, const Date& rhs);
        friend bool operator<=(const Date& lhs, const Date& rhs);
    private:
        int year, month, day;
        static const int days_in_regular_year[];
        static const int days_in_leap_year[];
};

// ---- Date.cpp (excerpts) ----
const int Date::days_in_regular_year[] = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
const int Date::days_in_leap_year[]    = { 0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

Date::Date(int year, int month, int day)
: year{year}, month{month}, day{day} {
    if (!is_valid_date(year, month, day)) {
        throw std::invalid_argument("Date::Date(int, int, int): invalid argument");
    }
}

Date& Date::operator++()
{
    const int * days = is_leap_year() ? days_in_leap_year : days_in_regular_year;
    if (++day > days[month]) {
        day = 1;
        if (++month > 12) {
            month = 1;
            ++year;
        }
    }
    return *this;
}

Date Date::operator++(int)
{
    Date copy(*this);
    ++*this;
    return copy;
}

bool Date::is_leap_year(int year)
{
    if (year % 400 == 0 ) {
        return true;
    }
    if (year % 100 == 0) {
        return true;
    }
    if (year % 4 == 0) {
        return true;
    }
    return false;
}

bool operator==(const Date& lhs, const Date& rhs)
{
    return lhs.year == rhs.year
           && lhs.month == rhs.month
           && lhs.day == rhs.day;
}

bool operator!=(const Date& lhs, const Date& rhs) { return !operator==(lhs, rhs); }

bool operator<(const Date& lhs, const Date& rhs)
{
    // INSERT YOUR CODE HERE
    return false;
}

bool operator>(const Date& lhs, const Date& rhs)  { return operator<(rhs, lhs); }
bool operator>=(const Date& lhs, const Date& rhs) { return !operator<(lhs, rhs); }
bool operator<=(const Date& lhs, const Date& rhs) { return !operator>(lhs, rhs); }
```

`Date(int year = 2018, int month = 1, int day = 1);` defaults every parameter, and the constructor throws `std::invalid_argument` when `is_valid_date` rejects the triple, which `Date d(-1, -1, -1)` in the tester exercises. The comparisons are friends because comparison is symmetric, and Week 4's canon is in place: `!=`, `>`, `>=` and `<=` are all written in terms of `==` and `<`. So everything hangs off `operator<`, which is the stub `// INSERT YOUR CODE HERE` returning `false`. The days tables start with `0` so `days[month]` indexes by month number.

```widget
op-dispatch
{ "expr": "a < b" }
```

:::warn The leap-year bug is a trap, not a model
`is_leap_year` returns true for any year divisible by 100. The Gregorian rule is divisible by 400, or divisible by 4 but not by 100: 1900 and 2100 are not leap years, 2000 is. The second `if` should return false.
:::

### The model operator<

A strict weak ordering must be irreflexive, antisymmetric and transitive. Comparing year, then month, then day is all three, because each member is an `int` compared with the built-in `<`:

```cpp
bool operator<(const Date& lhs, const Date& rhs)
{
    if (lhs.year != rhs.year) return lhs.year < rhs.year;
    if (lhs.month != rhs.month) return lhs.month < rhs.month;
    return lhs.day < rhs.day;
}
```

`lhs < lhs` reaches the last line and returns `day < day`, false, so it is irreflexive. Antisymmetry and transitivity follow from `int`'s own ordering, member by member. A tempting wrong answer is `lhs.year < rhs.year || lhs.month < rhs.month || lhs.day < rhs.day`, which makes 2017/12/01 less than 2018/01/01 and 2018/01/01 less than 2017/12/01 at the same time.

### What main does, and the three comparator styles

DateTester's `main` catches the exception from `Date d(-1, -1, -1)`, prints `Date::today()`, then builds three priority queues that order Dates in the three ways slide 36 lists for defining an ordering:

| Style | DateTester code | Where `<` comes from |
|---|---|---|
| 1. `operator<` on the class | `std::priority_queue<Date> dates1;` | the friend `operator<` is the default comparator |
| 2. a binary predicate function | `std::priority_queue<Date, std::vector<Date>, std::function<bool(Date, Date)>> dates2{compare};` | `bool compare(const Date& lhs, const Date& rhs) { return lhs < rhs; }`, passed at construction |
| 3. a functor | `std::priority_queue<Date, std::vector<Date>, cmp> dates3;` | `struct cmp { bool operator()(const Date& lhs, const Date& rhs) { return lhs < rhs; } };`, a type |

Each queue gets `a{2018, 1, 1}`, `b{2017, 1, 1}` and `c{2016, 6, 30}` pushed in that order and drained by `print_queue` (print `top()`, pop, repeat). A `priority_queue` pops the largest element first, and "largest" is defined by the comparator, so a correct `operator<` prints the latest date first.

The shipped test cannot tell the stub from a correct answer. With a comparator that is always false the heap does not sort at all; for these three dates, pushed newest-first, it happens to pop them in push order, which is also the right order. That is luck, not a rule: an always-false `priority_queue<int>` fed 1 to 5 pops `1 3 5 2 4`.

```cpp run pin dateFixed.cpp
// predict: Write the four lines printed.
// Date activity: operator< implemented with a strict weak ordering (year, then month, then day),
// pushed in a different order so a priority_queue visibly re-orders; the always-false version is shown too.
#include <functional>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

struct Date {
    int year, month, day;
    friend ostream& operator<<(ostream& os, const Date& d) {
        return os << d.year << '/' << (d.month < 10 ? "0" : "") << d.month << '/' << (d.day < 10 ? "0" : "") << d.day;
    }
};

bool operator<(const Date& lhs, const Date& rhs) {
    if (lhs.year != rhs.year) return lhs.year < rhs.year;
    if (lhs.month != rhs.month) return lhs.month < rhs.month;
    return lhs.day < rhs.day;
}

bool always_false(const Date&, const Date&) { return false; }   // the shipped stub

bool compare(const Date& lhs, const Date& rhs) { return lhs < rhs; }  // binary predicate
struct cmp { bool operator()(const Date& lhs, const Date& rhs) { return lhs < rhs; } }; // functor

template<typename T> void print_queue(T& q) {
    while (!q.empty()) { cout << q.top() << " "; q.pop(); }
    cout << '\n';
}

int main() {
    Date a{2018, 1, 1}, b{2017, 1, 1}, c{2016, 6, 30};
    priority_queue<Date> dates1;                                                   // uses operator<
    priority_queue<Date, vector<Date>, function<bool(Date, Date)>> dates2{compare}; // binary predicate
    priority_queue<Date, vector<Date>, cmp> dates3;                                // functor
    priority_queue<Date, vector<Date>, function<bool(Date, Date)>> stub{always_false};
    for (Date d : {c, a, b}) { dates1.push(d); dates2.push(d); dates3.push(d); stub.push(d); }
    print_queue(dates1);
    print_queue(dates2);
    print_queue(dates3);
    print_queue(stub);
    return 0;
}
```

This is DateTester folded into one file with a three-member `Date`, the model `operator<`, and the push order changed to `{c, a, b}` (oldest first). The fourth queue uses `always_false`, the shipped stub.

## Activity 3: two containers, two algorithms

The slide: *select TWO data structures from the STL; open the algorithm reference; select TWO algorithms; write TWO little programs, each using ONE data structure to demonstrate how ONE of the algorithms works.* Two model answers follow.

```cpp run pin dequeReverse.cpp
// predict: Write the five lines printed.
// Activity 3, program 1: a deque and the std::reverse algorithm (in <algorithm>)
#include <algorithm>
#include <deque>
#include <iostream>
using namespace std;

void printDeque(const deque<int>& d)
{
    for (deque<int>::const_iterator it = d.begin(); it != d.end(); ++it)
        cout << ' ' << *it;
    cout << '\n';
}

int main()
{
    deque<int> d;
    d.push_back(10);
    d.push_front(20);
    d.push_back(30);
    d.push_front(15);
    cout << "before:"; printDeque(d);

    reverse(d.begin(), d.end());          // reverses the order in [first, last)
    cout << "reverse:"; printDeque(d);

    reverse(d.begin(), d.begin() + 2);    // only the first two: begin() + 2 is one past them
    cout << "first two:"; printDeque(d);

    sort(d.begin(), d.end());             // sort needs a random access iterator: deque has one
    cout << "sort:"; printDeque(d);
    cout << "size still " << d.size() << '\n';
    return 0;
}
```

The four pushes are deque.cpp's. `reverse(d.begin(), d.begin() + 2);` shows the half-open range: `begin() + 2` is one past the second element, and `+ 2` is legal because a deque's iterator is random access. `std::sort` needs that same random access iterator, which is why it cannot be called on a `list` (a list has its own `sort` member).

```cpp run pin setCountIf.cpp
// predict: Write the six lines printed. How many values does the set hold?
// Activity 3, program 2: a set and the std::count_if / std::find algorithms
#include <algorithm>
#include <iostream>
#include <set>
using namespace std;

bool IsOdd(int i)
{
    return (i % 2) == 1;
}

int main()
{
    set<int> s = {40, 10, 33, 10, 21, 50};      // duplicate 10 dropped, sorted on insert
    cout << "set:";
    for (int x : s) cout << ' ' << x;
    cout << "  size " << s.size() << '\n';

    cout << "odd values: " << count_if(s.begin(), s.end(), IsOdd) << '\n';
    cout << "values over 25: " << count_if(s.begin(), s.end(), [](int x) { return x > 25; }) << '\n';

    set<int>::iterator it = find(s.begin(), s.end(), 33);   // linear walk, works on any container
    if (it != s.end()) cout << "find(33) -> " << *it << '\n';

    it = find(s.begin(), s.end(), 99);
    cout << "find(99) == end()? " << boolalpha << (it == s.end()) << '\n';

    cout << "s.find(33) -> " << *s.find(33) << " (the member: logarithmic)" << '\n';
    return 0;
}
```

`count_if` is non-modifying with the same unary predicate shape as `partition`; the second call passes a lambda, a predicate written in place. `find` returns an iterator to the match or `end()`, so `it != s.end()` is the test before dereferencing. The free `std::find` walks every element; the member `s.find(33)` uses the set's tree and is logarithmic, which is why associative containers have their own `find`.

```challenge
{ "prompt": "Give <code>struct Version { int major, minor; }</code> a friendly non-member <code>operator&lt;</code> that orders by major, then minor (a strict weak ordering), then sort the vector with <code>std::sort</code> and print one version per line as <code>major.minor</code>.", "starter": "#include <algorithm>\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct Version {\n    int major, minor;\n};\n\n// TODO: bool operator<(const Version& lhs, const Version& rhs)\n\nint main()\n{\n    vector<Version> v = {{2, 0}, {1, 10}, {1, 2}, {3, 1}, {1, 2}};\n    // TODO: sort v\n    for (const Version& x : v)\n        cout << x.major << '.' << x.minor << '\\n';\n    return 0;\n}\n", "expected": "1.2\n1.2\n1.10\n2.0\n3.1", "hints": ["Compare <code>major</code> first; only when the majors are equal compare <code>minor</code>.", "<code>if (lhs.major != rhs.major) return lhs.major &lt; rhs.major; return lhs.minor &lt; rhs.minor;</code>", "<code>sort(v.begin(), v.end());</code> picks up your operator&lt; automatically."], "solution": "#include <algorithm>\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct Version {\n    int major, minor;\n};\n\nbool operator<(const Version& lhs, const Version& rhs)\n{\n    if (lhs.major != rhs.major) return lhs.major < rhs.major;\n    return lhs.minor < rhs.minor;\n}\n\nint main()\n{\n    vector<Version> v = {{2, 0}, {1, 10}, {1, 2}, {3, 1}, {1, 2}};\n    sort(v.begin(), v.end());\n    for (const Version& x : v)\n        cout << x.major << '.' << x.minor << '\\n';\n    return 0;\n}\n" }
```

```quiz
[
  {
    "q": "In partition.cpp, why does `partition` work on a `std::list<city>` even though a list has no random access iterator?",
    "options": ["partition converts the list to a vector first", "A list iterator is random access", "partition needs only a ForwardIt: find_if_not, next, ++ and iter_swap are all a list iterator can do", "It does not work; the program is wrong"],
    "answer": 2,
    "explain": "The slide's implementation uses no + n and no <. Anything with ++, == and dereference qualifies, so list, set and forward_list all partition."
  },
  {
    "q": "What does `for_each(cities.begin(), cities.end(), print);` do?",
    "options": ["Calls `print` on every element in [begin, end)", "Prints the list once and removes the cities", "Sorts the cities by distance", "Returns the number of cities"],
    "answer": 0,
    "explain": "for_each applies the function to each element of the range in order; it is in the non-modifying family and leaves the list unchanged."
  },
  {
    "q": "Which `operator<` for Date is a strict weak ordering?",
    "options": ["`return lhs.year < rhs.year || lhs.month < rhs.month || lhs.day < rhs.day;`", "`return lhs.year <= rhs.year;`", "`if (lhs.year != rhs.year) return lhs.year < rhs.year; if (lhs.month != rhs.month) return lhs.month < rhs.month; return lhs.day < rhs.day;`", "`return false;`"],
    "answer": 2,
    "explain": "Compare the most significant member first and fall through only on ties. The || version violates antisymmetry (2017/12/01 and 2018/01/01 are each less than the other); <= violates irreflexivity; return false is not an ordering at all."
  },
  {
    "q": "`std::priority_queue<Date> dates1;` with only the stub `operator<` (always false). Pushing a=2018/01/01, b=2017/01/01, c=2016/06/30 in that order and draining prints...",
    "options": ["2018/01/01 2017/01/01 2016/06/30", "2016/06/30 2017/01/01 2018/01/01", "2017/01/01 2018/01/01 2016/06/30", "nothing: it does not compile"],
    "answer": 0,
    "explain": "An always-false comparator means the heap never sorts. For these three dates pushed newest-first it pops them in push order, which is already newest-first, so the shipped test cannot reveal the stub; pushing c, a, b shows 2016/06/30 first. It is not a general rule: always-false fed 1 to 5 pops 1 3 5 2 4."
  },
  {
    "type": "match",
    "q": "Match each DateTester queue to the way it defines the ordering (slide 36).",
    "pairs": [
      ["`std::priority_queue<Date> dates1;`", "operator< defined for the class"],
      ["`std::priority_queue<Date, std::vector<Date>, std::function<bool(Date, Date)>> dates2{compare};`", "a custom comparison function that is a binary predicate"],
      ["`std::priority_queue<Date, std::vector<Date>, cmp> dates3;`", "a functor: a struct with operator()"]
    ],
    "explain": "Three spellings of the same ordering. The functor is a type, so it goes in the template argument list; the function is an object, so it is passed to the constructor."
  },
  {
    "q": "What does `Date::is_leap_year(1900)` return in the shipped Date.cpp, and what should it return?",
    "options": ["true, and true is correct", "false, and false is correct", "false, but it should be true", "true, but it should be false: a century year is a leap year only when divisible by 400"],
    "answer": 3,
    "explain": "The second if returns true for year % 100 == 0. The rule is divisible by 400, else divisible by 100 means not leap, else divisible by 4 means leap. 2000 is leap, 1900 and 2100 are not."
  },
  {
    "q": "Why can `std::sort` be called on a deque but not on a list?",
    "options": ["A list is too slow", "A list has no begin()", "sort needs random access iterators; a deque has them, a list is bidirectional", "sort only works on vectors"],
    "answer": 2,
    "explain": "std::sort jumps around the range with it + n and compares positions with <, which only random access iterators support. list provides its own sort() member instead."
  },
  {
    "q": "What does this print?",
    "code": "set<int> s = {40, 10, 33, 10, 21, 50};\ncout << s.size() << ' ' << count_if(s.begin(), s.end(), [](int x) { return x > 25; });",
    "options": ["6 3", "5 4", "6 4", "5 3"],
    "answer": 3,
    "explain": "The set drops the duplicate 10 (5 elements: 10 21 33 40 50) and three of them exceed 25."
  },
  {
    "q": "`auto it = find(s.begin(), s.end(), 99);` on a set without 99. What must you check before `*it`?",
    "options": ["`it == nullptr`", "`it != s.end()`", "`*it == 99`", "Nothing; find throws when the value is missing"],
    "answer": 1,
    "explain": "find returns end() when nothing matches, and end() does not point to an element. Dereferencing it is undefined behaviour, so test against end() first."
  }
]
```

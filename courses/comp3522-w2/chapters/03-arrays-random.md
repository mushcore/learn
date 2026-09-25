---
title: C-style arrays & random numbers
minutes: 16
---

Two short topics from the middle of the Week 2 slides. Arrays get "one slide" because they work the way you expect from C and Java; random numbers get several, because C++ offers three different ways to make them and the quiz likes the ranges.

## Arrays: one slide

The whole slide:

```cpp
float values[3]      // array of 3 floats
char * names[32]     // array of 32 pointers to char

int scores[] = {1, 2, 3, 4};
int some_scores[8] = {1, 2, 3, 4};
    // equivalent to {1, 2, 3, 4, 0, 0, 0, 0}
```

Read a declaration from the name outwards. `float values[3]` says "`values` is an array of 3 `float`". `char * names[32]` says "`names` is an array of 32 things, and each thing is a `char *`", a pointer to a character: 32 pointers, not 32 characters. The size in the brackets is fixed at compile time.

Braces initialize. With `int scores[] = {1, 2, 3, 4};` the compiler counts the initializers and makes the array size 4. With `int some_scores[8] = {1, 2, 3, 4};` you asked for 8 slots but supplied 4 values; the remaining slots are **filled with the default value, 0**. An array declared with *no* initializer, like `float values[3]`, holds garbage until you assign to it.

```cpp run pin arrays.cpp
// predict: Write every line printed, exactly as the code formats it (this machine: int is 4 bytes, float 4, a pointer 8).
#include <iostream>
using namespace std;

void swap(int arr[], int i, int j)
{
    cout << "sizeof(arr) inside swap: " << sizeof(arr) << " bytes" << endl;
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

int main()
{
    float values[3];                        // array of 3 floats (garbage until assigned)
    char * names[32];                       // array of 32 pointers to char
    int scores[] = {1, 2, 3, 4};            // size deduced: 4
    int some_scores[8] = {1, 2, 3, 4};      // equivalent to {1, 2, 3, 4, 0, 0, 0, 0}

    cout << "sizeof(values): " << sizeof(values) << endl;
    cout << "sizeof(names): " << sizeof(names) << endl;
    cout << "sizeof(scores): " << sizeof(scores) << " bytes = " << sizeof(scores) / sizeof(scores[0]) << " ints" << endl;
    for (int s : some_scores) cout << s << ' ';
    cout << endl;

    swap(scores, 0, 3);
    for (int s : scores) cout << s << ' ';
    cout << endl;
    return 0;
}
```

- `sizeof(values)` is 3 floats × 4 bytes = **12**; `sizeof(names)` is 32 pointers × 8 bytes = **256** on a 64-bit machine. `sizeof` on an array gives the whole array's bytes, so `sizeof(scores) / sizeof(scores[0])` (16 / 4) counts its elements: **4**.
- `for (int s : some_scores)` prints `1 2 3 4 0 0 0 0`: the four missing initializers became zeros.
- Inside `swap`, `sizeof(arr)` prints **8**, not 16. This is the lecture's key demonstration: an array **parameter** is not an array. `int arr[]` in a parameter list is just another way of writing `int* arr`; the array "decays" to a pointer to its first element, and a pointer is 8 bytes. g++ even warns you about it (`'sizeof' on array function parameter 'arr' will return size of 'int*'`). Because `arr` points at the *original* `scores`, the swap of elements 0 and 3 changes the caller's array: `4 2 3 1`. Compare that with the value-parameter swap in the next lesson, which changes nothing.

:::quiz Two facts the quiz likes
`int some_scores[8] = {1, 2, 3, 4};` is **equivalent** to `{1, 2, 3, 4, 0, 0, 0, 0}` (missing elements are zero, not garbage). And an array passed to a function arrives as a **pointer** to the original elements, which is why changes inside the function are visible outside.
:::

```challenge
{
  "prompt": "Declare <code>int scores[6] = {1, 2, 3};</code> and print all six elements on one line, separated by single spaces, with no trailing space, followed by a newline.",
  "starter": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    // your code here\n    return 0;\n}\n",
  "expected": "1 2 3 0 0 0",
  "hints": ["Missing initializers are zero-filled, so you do not need to assign the last three.", "Print a space <em>before</em> every element except the first: <code>if (i > 0) cout << ' ';</code>"],
  "solution": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int scores[6] = {1, 2, 3};\n    for (int i = 0; i < 6; i++) {\n        if (i > 0) cout << ' ';\n        cout << scores[i];\n    }\n    cout << endl;\n    return 0;\n}\n"
}
```

## Random numbers, approach 1: rand and srand from C

The "ye olde tyme C approach" uses two functions from `<cstdlib>`:

- `srand(seed)` **initializes** (seeds) the random number generator. The seed is a number the sequence starts from.
- `rand()` returns a pseudo-random integer between 0 and `RAND_MAX`.

The word *pseudo* matters. As the instructor said, "in computing there is no true random; all random is based on something." `rand()` runs a fixed arithmetic recipe from the seed, so the **same seed always produces the same sequence**. That is why you seed with something that changes: `time(NULL)` from `<ctime>`, the current time in seconds.

```cpp run pin random_c.cpp
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main()
{
    srand(1);                                  // a fixed seed...
    for (int i = 0; i < 5; i++) cout << rand() % 100 << ' ';
    cout << endl;

    srand(1);                                  // ...seeded again with the same number
    for (int i = 0; i < 5; i++) cout << rand() % 100 << ' ';
    cout << endl;                              // exactly the same five numbers

    srand(time(NULL));                         // seed random num generator only ONCE

    const int UPPER_BOUND = 10;
    int my_int = rand() % UPPER_BOUND;         // 0 .. 9
    double zero_to_one = rand() / (double) RAND_MAX;
    cout << my_int << ' ' << zero_to_one << endl;
    cout << "RAND_MAX = " << RAND_MAX << endl;
    return 0;
}
```

Run it twice. The first two lines are identical to each other and identical between runs, because `srand(1)` restarts the same recipe. The third line changes from run to run, because `srand(time(NULL));` seeds with the clock.

Two rules from the lecture: **seed once**, and **never put `srand` inside a loop**. Re-seeding with the same second-resolution time inside a loop gives you the same "random" number over and over.

- `rand() % UPPER_BOUND` folds the big number into `0 … UPPER_BOUND − 1`. With `UPPER_BOUND = 10` you get 0 to 9: the right side is **not inclusive**.
- `rand() / (double) RAND_MAX` is the "hack" for a real number in 0.0 to 1.0. The cast makes one operand a `double` so the division is real division (Week 1); without it, integer division would give 0 almost every time. `RAND_MAX` is a built-in constant, 32767 with this compiler.

## Choosing a range

The three slide examples, and the rule behind them:

```cpp
int random_num_1 = rand() % 100;         // random range 0 to 99
int random_num_2 = rand() % 100 + 1;     // random range 1 to 100
int random_num_3 = rand() % 25 + 2000;   // random range 2000 to 2024
```

`% m` gives `m` possible values, `0 … m − 1`. Adding an offset shifts the whole range without changing how many values there are: `% 25 + 2000` is the 25 values `2000 … 2024`. If you want the top number included, add 1: `% 100 + 1` runs 1 to 100.

```widget
rand-range
```

:::quiz The off-by-one trap
"`rand() % 100` produces numbers from 0 to 100." **False**: 0 to 99. "`rand() % 25 + 2000` produces 25 different values." **True**: 2000 through 2024. Count the values with `m`, find the ends with `offset` and `offset + m − 1`.
:::

## Approach 2 and 3: the `<random>` header

`rand()` is quick and dirty. The C++ `<random>` header separates two jobs: an **engine** produces raw random bits, and a **distribution** shapes them into the range and spread you want. The instructor's reason for the distribution: an engine on its own "will perfectly generate random numbers, but the numbers it generates will be skewed in a specific way"; the distribution takes them "and actually calculates them to follow a uniform distribution."

Uniform `double` in `[a, b]` (slide approach 2):

```cpp run pin random_double.cpp
#include <iostream>
#include <random>
#include <ctime>
using namespace std;

int main()
{
    double a = 10;
    double b = 100;
    default_random_engine generator(time(0));          // engine, seeded with the clock
    uniform_real_distribution<double> distribution(a, b);
    double my_random = distribution(generator);         // pass the engine INTO the distribution
    cout << my_random << endl;
    for (int i = 0; i < 4; i++) cout << distribution(generator) << ' ';
    cout << endl;
    return 0;
}
```

`default_random_engine generator(time(0));` builds the engine and seeds it, the same job `srand` did. `uniform_real_distribution<double> distribution(a, b);` describes what you want: real numbers spread evenly between 10 and 100. The line `distribution(generator)` is where a number is actually produced: every call passes the engine into the distribution and gets a fresh value.

Uniform `int` in `[a, b]` (slide approach 3), with the slide's extra flourish:

```cpp run pin random_int.cpp
#include <iostream>
#include <random>
using namespace std;

int main()
{
    int a = 10;
    int b = 100;
    random_device rd;                                   // a random number generator...
    mt19937 generator(rd());                            // ...used to seed another generator (calls operator())
    uniform_int_distribution<> distribution(a, b);      // both ends INCLUDED: 10 .. 100
    int my_int = distribution(generator);
    cout << my_int << endl;
    for (int i = 0; i < 4; i++) cout << distribution(generator) << ' ';
    cout << endl;
    return 0;
}
```

The slide's own comment on this one: "Check it out! We're using a random number generator to generate a random seed for a random number generator!" `random_device rd;` is a generator that draws on the operating system; `rd()` calls its `operator()` to produce one number, which seeds `mt19937 generator`, the Mersenne Twister engine. The instructor was clear this is overkill: seeding `mt19937` with `time(0)` works just as well; he did it "to show you something interesting". Note that `uniform_int_distribution<> distribution(a, b);` includes **both** ends, unlike `rand() % m`.

| Need | Tool | Range |
|---|---|---|
| quick int | `rand() % m + off` | `off … off + m − 1` |
| quick real in 0..1 | `rand() / (double) RAND_MAX` | 0.0 … 1.0 |
| proper real | `uniform_real_distribution<double>(a, b)` + engine | a … b |
| proper int | `uniform_int_distribution<>(a, b)` + engine | a … b (inclusive) |

The lecture's suggested exercise: a guessing game that picks a number from 1 to 10 and tells the player "too high" or "too low" until they get it. `rand() % 10 + 1` is all the randomness it needs.

```quiz
[
  {
    "q": "`int some_scores[8] = {1, 2, 3, 4};` What are elements 4 through 7?",
    "options": ["Garbage (uninitialized)", "All 0", "All 4 (the last value repeats)", "The program does not compile"],
    "answer": 1,
    "explain": "When an initializer list is shorter than the array, the remaining elements are value-initialized to 0. The slide says it is equivalent to {1, 2, 3, 4, 0, 0, 0, 0}."
  },
  {
    "q": "`char * names[32]` declares...",
    "options": ["a pointer to an array of 32 chars", "an array of 32 pointers to char", "a string of 32 characters", "32 arrays of char"],
    "answer": 1,
    "explain": "Read from the name outwards: names is an array of 32 elements, and each element is a char* (a pointer to char)."
  },
  {
    "q": "Given `int scores[] = {1, 2, 3, 4};` on a machine where `int` is 4 bytes, what does `sizeof(scores)` evaluate to?",
    "type": "numeric",
    "answer": 16,
    "tolerance": 0,
    "explain": "sizeof on an array is the whole array: 4 elements × 4 bytes = 16. Divide by sizeof(scores[0]) to get the element count."
  },
  {
    "q": "Inside `void f(int arr[])`, `sizeof(arr)` is the size of the whole array that was passed in.",
    "type": "tf",
    "answer": false,
    "explain": "An array parameter decays to a pointer to its first element, so sizeof(arr) is the size of a pointer (8 bytes on a 64-bit machine). g++ warns about exactly this."
  },
  {
    "q": "What does this print?",
    "code": "void swap(int arr[], int i, int j) {\n    int temp = arr[i];\n    arr[i] = arr[j];\n    arr[j] = temp;\n}\nint main() {\n    int numbers[] = {1, 2, 3, 4};\n    swap(numbers, 0, 3);\n    for (int n : numbers) cout << n << ' ';\n}",
    "options": ["1 2 3 4", "4 2 3 1", "4 3 2 1", "1 3 2 4"],
    "answer": 1,
    "explain": "The parameter arr is a pointer to the original numbers array, so the swap of elements 0 and 3 changes the caller's data: 4 2 3 1."
  },
  {
    "q": "`rand() % 100` produces which range?",
    "options": ["0 to 100", "0 to 99", "1 to 100", "1 to 99"],
    "answer": 1,
    "explain": "% 100 leaves a remainder from 0 to 99: one hundred values, and the right side is not inclusive."
  },
  {
    "q": "Which expression produces a random integer from 2000 to 2024 inclusive?",
    "options": ["`rand() % 24 + 2000`", "`rand() % 25 + 2000`", "`rand() % 2024`", "`rand() % 2000 + 24`"],
    "answer": 1,
    "explain": "2000 to 2024 is 25 values, so % 25 (0..24) plus the offset 2000. % 24 would stop at 2023."
  },
  {
    "q": "Why is `srand(time(NULL))` called once, outside any loop?",
    "options": ["srand is slow", "Re-seeding with the same second-resolution time restarts the same sequence, so the 'random' numbers repeat", "rand() only works after exactly one srand call", "time(NULL) can only be called once per program"],
    "answer": 1,
    "explain": "The seed determines the whole sequence. Calling srand repeatedly with the same time value restarts the same sequence again and again, so you get the same number repeatedly. Seed once, then call rand() as often as you like."
  },
  {
    "q": "`srand(1); cout << rand(); srand(1); cout << rand();` prints two different numbers.",
    "type": "tf",
    "answer": false,
    "explain": "The same seed replays the same pseudo-random sequence, so both rand() calls return the same value. Randomness in computing is deterministic given the seed."
  },
  {
    "q": "What does `rand() / (double) RAND_MAX` produce?",
    "options": ["A random integer from 0 to RAND_MAX", "A random double from 0.0 to 1.0", "Always 0, because of integer division", "A random double from 0 to 100"],
    "answer": 1,
    "explain": "Casting one operand to double makes the division real division, so the result is rand()'s value as a fraction of its maximum: 0.0 to 1.0. Without the cast it would be integer division (0 almost always)."
  },
  {
    "q": "In the `<random>` approach, what does `distribution(generator)` do?",
    "options": ["Seeds the generator with the distribution", "Produces one random number by passing the engine's output through the distribution", "Declares the range", "Resets the engine"],
    "answer": 1,
    "explain": "The engine produces raw random bits; calling the distribution with the engine shapes those bits into one value in the requested range. Every call produces a new number."
  },
  {
    "q": "Which of these are engines (generators) rather than distributions? (select all)",
    "options": ["`default_random_engine`", "`uniform_real_distribution<double>`", "`mt19937`", "`random_device`", "`uniform_int_distribution<>`"],
    "answer": [0, 2, 3],
    "explain": "default_random_engine, mt19937 (Mersenne Twister) and random_device generate numbers; the two uniform_*_distribution classes shape a generator's output into a range."
  }
]
```

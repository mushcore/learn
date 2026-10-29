---
title: "Core 10b: adapting the Fraction block to a new class: the seven slots, and how to play the guided question"
minutes: 15
---
The real long question will probably not be about Fraction. This lesson shows that band 3's Fraction block is a skeleton with seven slots, and that writing a new class means filling the slots, not writing from nothing. It ends with the tactics for the guided question itself.

## The skeleton, in plain words

A class with two or three fields, a constructor that refuses bad input, a copy constructor, a getter, `<<`, `>>`, `<`, and a `main` that reads a file into a container: that is the whole long question, whatever the class is called.

The parts that never change are the shape of each function. The parts that change are the names, the rule for bad input, and the output format. Read the question once for the slots, write the skeleton from the sheet, then fill the slots.

```diagram
{ "type": "grid", "title": "The seven slots", "nodes": [
  { "id": "h0", "label": "slot", "row": 0, "col": 0 },
  { "id": "h1", "label": "in Fraction", "row": 0, "col": 1 },
  { "id": "h2", "label": "find it in the question", "row": 0, "col": 2 },
  { "id": "a0", "label": "class and fields", "row": 1, "col": 0 },
  { "id": "a1", "label": "numerator, denominator", "row": 1, "col": 1 },
  { "id": "a2", "label": "the names and types it gives", "row": 1, "col": 2 },
  { "id": "b0", "label": "bad input", "row": 2, "col": 0 },
  { "id": "b1", "label": "d == 0", "row": 2, "col": 1 },
  { "id": "b2", "label": "\"must be\", \"cannot be\", \"invalid\"", "row": 2, "col": 2 },
  { "id": "c0", "label": "<< format", "row": 3, "col": 0 },
  { "id": "c1", "label": "n/d", "row": 3, "col": 1 },
  { "id": "c2", "label": "the sample output, character for character", "row": 3, "col": 2 },
  { "id": "d0", "label": ">> order", "row": 4, "col": 0 },
  { "id": "d1", "label": "n then d", "row": 4, "col": 1 },
  { "id": "d2", "label": "the order of the fields in the file", "row": 4, "col": 2 },
  { "id": "e0", "label": "< rule", "row": 5, "col": 0 },
  { "id": "e1", "label": "cross-multiply", "row": 5, "col": 1 },
  { "id": "e2", "label": "\"compare by\", \"sort by\"", "row": 5, "col": 2 },
  { "id": "f0", "label": "+ meaning", "row": 6, "col": 0 },
  { "id": "f1", "label": "fraction arithmetic", "row": 6, "col": 1 },
  { "id": "f2", "label": "what adding two of them means", "row": 6, "col": 2 },
  { "id": "g0", "label": "container", "row": 7, "col": 0 },
  { "id": "g1", "label": "stack: top, pop", "row": 7, "col": 1 },
  { "id": "g2", "label": "stack, queue (front), vector (push_back)", "row": 7, "col": 2 }
], "hi": ["b2", "c2", "g2"], "caption": "Everything outside these slots is copied from band 3 unchanged: friend, const&, return os, return is, const on the getter, the read loop and the open check." }
```

## What stays the same for any class

- `class X { private: fields; public: ... };`
- The copy constructor copies every field in the initializer list: `X(const X& o) : a(o.a), b(o.b) {}`.
- `friend ostream& operator<<(ostream& os, const X& x) { ...; return os; }`
- `friend istream& operator>>(istream& is, X& x) { is >> ...; return is; }` with no `const`, because it changes `x`.
- Every getter ends in `const`.
- `main`: open the file, check `is_open`, loop `while (in >> a >> b)`, wrap the push in `try` and `catch`, then print from the container.

## The same block on a Rectangle

Say the question reads: a `Rectangle` has a width and a height, both must be positive, it prints as `3x4`, and rectangles compare by area. Five slots change; the rest is band 3.

```cpp run pin Rectangle.cpp
// predict: Write the four lines printed.
#include <iostream>
#include <stdexcept>
using namespace std;

class Rectangle {
private:
    int width;
    int height;
public:
    Rectangle(int w, int h) : width(w), height(h) {            // slot: fields
        if (w <= 0 || h <= 0) {                               // slot: bad input
            throw invalid_argument("Sides must be positive");
        }
    }
    Rectangle(const Rectangle& o) : width(o.width), height(o.height) {}
    int getArea() const { return width * height; }
    friend ostream& operator<<(ostream& os, const Rectangle& r) {
        os << r.width << "x" << r.height;                      // slot: << format
        return os;
    }
    friend istream& operator>>(istream& is, Rectangle& r) {
        is >> r.width >> r.height;                             // slot: >> order
        return is;
    }
    friend bool operator<(const Rectangle& a, const Rectangle& b) {
        return a.getArea() < b.getArea();                      // slot: < rule
    }
};

int main() {
    Rectangle a(3, 4);
    Rectangle b(2, 5);
    cout << a << " " << a.getArea() << endl;
    cout << boolalpha << (b < a) << endl;
    try {
        Rectangle bad(0, 5);
    } catch (const invalid_argument& e) {
        cout << e.what() << endl;
    }
    cout << a << endl;
}
```

1. `3x4 12`: the `<<` slot prints width, the letter x, height; the getter multiplies.
2. `true`: 10 is less than 12, so `b < a` holds.
3. `Sides must be positive`: `Rectangle(0, 5)` throws before any object exists.
4. `3x4`: `a` was never touched.

:::warn The two slots people get wrong under time
The bad-input test and the output format. `w <= 0` is not `w == 0`: "must be positive" rejects negatives too. And `3x4` with no spaces is not `3 x 4`. Copy the question's sample output character for character.
:::

## Write it: a Time class

```challenge
{"prompt": "The long question on a new class. A <code>Time</code> has hours and minutes. Fill the slots from the comments: hours 0 to 23 and minutes 0 to 59 or throw <code>invalid_argument(\"bad time\")</code>; print as <code>9:05</code> (two-digit minutes; use <code>setw(2) &lt;&lt; setfill('0')</code> from <code>&lt;iomanip&gt;</code>); read hours then minutes; compare by total minutes. main reads rows from cin into a <code>vector&lt;Time&gt;</code>, skips bad rows with <code>skipped: </code> and <code>what()</code>, sorts, and prints one per line.", "starter": "#include <algorithm>\n#include <iomanip>\n#include <iostream>\n#include <stdexcept>\n#include <vector>\nusing namespace std;\n\nclass Time {\nprivate:\n    int hours;\n    int minutes;\npublic:\n    // (a) Time(int h, int m): store both; throw invalid_argument(\"bad time\")\n    //     unless 0 <= h <= 23 and 0 <= m <= 59\n    // (b) int totalMinutes() const: hours * 60 + minutes\n    // (c) friend operator<<: hours, ':', minutes padded to two digits\n    // (d) friend operator>>: hours then minutes\n    // (e) friend operator<: by totalMinutes()\n};\n\nint main() {\n    // (f) read rows from cin into a vector<Time>; try around the push_back,\n    // catch by const reference and print \"skipped: \" and what();\n    // sort; print one Time per line\n    return 0;\n}\n", "stdin": "13 30\n9 5\n25 0\n0 59\n9 4", "expected": "skipped: bad time\n0:59\n9:04\n9:05\n13:30", "hints": ["(a) <code>Time(int h, int m) : hours(h), minutes(m) { if (h &lt; 0 || h &gt; 23 || m &lt; 0 || m &gt; 59) { throw invalid_argument(\"bad time\"); } }</code>", "(c) <code>os &lt;&lt; t.hours &lt;&lt; \":\" &lt;&lt; setw(2) &lt;&lt; setfill('0') &lt;&lt; t.minutes; return os;</code>", "(f) <code>int h, m; while (cin &gt;&gt; h &gt;&gt; m) { try { v.push_back(Time(h, m)); } catch (const invalid_argument&amp; e) { cout &lt;&lt; \"skipped: \" &lt;&lt; e.what() &lt;&lt; endl; } } sort(v.begin(), v.end()); for (const Time&amp; t : v) { cout &lt;&lt; t &lt;&lt; endl; }</code>"], "solution": "#include <algorithm>\n#include <iomanip>\n#include <iostream>\n#include <stdexcept>\n#include <vector>\nusing namespace std;\n\nclass Time {\nprivate:\n    int hours;\n    int minutes;\npublic:\n    Time(int h, int m) : hours(h), minutes(m) {\n        if (h < 0 || h > 23 || m < 0 || m > 59) {\n            throw invalid_argument(\"bad time\");\n        }\n    }\n    int totalMinutes() const { return hours * 60 + minutes; }\n    friend ostream& operator<<(ostream& os, const Time& t) {\n        os << t.hours << \":\" << setw(2) << setfill('0') << t.minutes;\n        return os;\n    }\n    friend istream& operator>>(istream& is, Time& t) {\n        is >> t.hours >> t.minutes;\n        return is;\n    }\n    friend bool operator<(const Time& a, const Time& b) {\n        return a.totalMinutes() < b.totalMinutes();\n    }\n};\n\nint main() {\n    vector<Time> v;\n    int h, m;\n    while (cin >> h >> m) {\n        try {\n            v.push_back(Time(h, m));\n        } catch (const invalid_argument& e) {\n            cout << \"skipped: \" << e.what() << endl;\n        }\n    }\n    sort(v.begin(), v.end());\n    for (const Time& t : v) {\n        cout << t << endl;\n    }\n    return 0;\n}\n"}
```

## How to play the guided question

The long question is broken into parts and each part is marked on its own. That changes how to spend the time.

1. **Read every part before writing any.** A later part often names the getter or field an earlier part needs, so the names are decided once, up front.
2. **Write the signature first.** `friend ostream& operator<<(ostream& os, const X& x)` on its own earns marks before the body exists.
3. **Never leave a part blank.** A rough part (f) still scores when part (c) is wrong, because the marker reads each part alone.
4. **Match the sample output exactly.** Spaces, slashes, colons and `endl` are where the output marks go.
5. **Frozen on a body? Write the comment and move on.** `// throw if the denominator is 0` shows the idea; come back if time remains.
6. **Three checks before handing in:** `return os;` and `return is;`; `const` on every getter; the `;` after the class's closing `}`.

:::tip Ten minutes, on paper
Pick any two-field class (`Point` with x and y, `Time` above) and write the Fraction block for it by hand, with the sheet open. Under ten minutes means the slots are in your hands, not only on the sheet.
:::

## Try it

```quiz
[
  { "q": "The question says \"a Score must be between 0 and 100\". Which constructor test is right?", "options": ["`if (s < 0 || s > 100) throw invalid_argument(\"bad score\");`", "`if (s == 0 || s == 100) throw invalid_argument(\"bad score\");`", "`if (s < 0 && s > 100) throw invalid_argument(\"bad score\");`", "`if (s > 0 || s < 100) throw invalid_argument(\"bad score\");`"], "answer": 0, "explain": "1. Refuse when the value is outside the range: below 0 or above 100.\n2. `&&` can never be true (no number is both below 0 and above 100), so option 3 throws for nothing.\n3. Option 4 throws for every valid score." },
  { "q": "The sample output shows `Point(3, 4)`. `operator<<` is written `os << \"Point(\" << p.x << \",\" << p.y << \")\";`. Does it match?", "type": "tf", "answer": false, "explain": "1. The sample has a space after the comma; the code prints `Point(3,4)`.\n2. Output marks are given for the exact text. Write `<< \", \" <<`.\n3. Check the sample output character for character before moving on." },
  { "q": "Part (c) asks for `operator>>`. You wrote `friend istream& operator>>(istream& is, const Point& p)`. What happens?", "options": ["It does not compile: `is >> p.x` cannot write into a const object", "It compiles and reads both fields", "It compiles but reads only the first field", "It reads the fields but the caller's Point stays unchanged"], "answer": 0, "explain": "1. `>>` changes the object it reads into, so its parameter is a plain `Point&`.\n2. With `const Point&`, `is >> p.x` tries to write into a const member and g++ refuses.\n3. Only `<<` takes `const T&`, because printing changes nothing." },
  { "q": "You have ten minutes left, parts (d) and (e) unwritten, and part (c) half done. What earns the most?", "options": ["Write the signatures of (d) and (e) with a one-line comment each, then finish (c)", "Finish (c) perfectly, then start (d)", "Rewrite (a) to (c) neatly so the marker can read them", "Leave (d) and (e) blank and check (a) to (c) for typos"], "answer": 0, "explain": "1. Each part is marked alone, so a signature plus the idea in (d) and (e) scores where a blank scores nothing.\n2. Half of (c) already holds most of its marks.\n3. Neat rewriting earns nothing new." }
]
```

## Remember

- The long question is band 3's Fraction block with seven slots filled from the question's words.
- The slots that lose marks under time are the bad-input test ("positive" rejects negatives) and the output format (copy the sample exactly).
- Each part is marked alone: signatures first, no blanks, comment the idea when stuck.
- *On the sheet:* Sheet side 2, band 3 "Write the function / class / program", Fraction and the Read whole lines block. Sheet side 2, band 4, Operators and friends.

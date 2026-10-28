---
title: "Mock quiz: Lecture 1"
minutes: 30
---

Thirty items on lecture 1, in the mix of the five Learning Hub quizzes that drew on it: loops and arrays first, then HTML and CSS, functions, objects and the DOM, scope and timers, and two written answers. Every program's key is the output the program really prints. Write each output on paper before you look at the options.

```quiz
[
  {
    "q": "How many times does `booked++` run?",
    "code": "let booked = 0;\nfor (let room = 0; room < 2; room++) {\n  for (let hour = 0; hour < 4; hour++) {\n    booked++;\n  }\n}\nconsole.log(booked);",
    "options": ["8", "6", "4", "16"],
    "answer": 0,
    "explain": "Four inner passes for each of two outer passes: 2 × 4 = 8."
  },
  {
    "q": "What does this print?",
    "code": "let n = 0;\nfor (let i = 1; i <= 4; i++) {\n  n += 3;\n}\nconsole.log(n);",
    "options": ["12", "9", "15", "3"],
    "answer": 0,
    "explain": "`i <= 4` from 1 is i = 1, 2, 3, 4: four passes of +3, so 12."
  },
  {
    "q": "`let days = [\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\", \"Sun\"];` Which update completes `for (let i = 0; i < days.length; ___) { console.log(days[i]); }` so that it prints Mon, Wed, Fri, Sun?",
    "options": ["`i += 2`", "`i++`", "`i *= 2`", "`++i`"],
    "answer": 0,
    "explain": "Indexes 0, 2, 4, 6 are every second item: `i += 2`. `i++` and `++i` visit all seven; `i *= 2` stays at 0 forever."
  },
  {
    "q": "What does this print?",
    "code": "function trim(list) {\n  list = list.length - 2;\n}\nlet notes = [\"buy milk\", \"call clinic\", \"pay rent\", \"book flight\"];\ntrim(notes);\nconsole.log(notes.length);",
    "options": ["4", "2", "0", "undefined"],
    "answer": 0,
    "explain": "`list = list.length - 2` only makes the parameter hold the number 2; the array is untouched, so its length is still 4. `list.length -= 2` would have removed the last two notes."
  },
  {
    "q": "What does this print?",
    "code": "let f = [1, 1];\nfor (let i = 2; i < 6; i++) {\n  f[i] = f[i - 1] + f[i - 2];\n}\nconsole.log(f);",
    "options": ["[1, 1, 2, 3, 5, 8]", "[1, 1, 2, 3, 5]", "[1, 1, 2, 4, 8, 16]", "[1, 1, 3, 5, 8, 13]"],
    "answer": 0,
    "explain": "i = 2 to 5 adds four elements, each the sum of the two before: 1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8."
  },
  {
    "q": "What does this print?",
    "code": "let seats = [];\nseats[3] = \"Kim\";\nconsole.log(seats[1]);\nconsole.log(seats.length);",
    "options": ["undefined / 4", "undefined / 1", "an error / 4", "Kim / 4"],
    "answer": 0,
    "explain": "Assigning index 3 makes the length 4. Index 1 was never assigned, so it reads `undefined`, not an error."
  },
  {
    "q": "What does this print?",
    "code": "let codes = [\"0\", 0, \"\", false];\nlet hits = 0;\nfor (let i = 0; i < codes.length; i++) {\n  if (codes[i] == 0) {\n    hits++;\n  }\n}\nconsole.log(hits);",
    "options": ["4", "1", "2", "0"],
    "answer": 0,
    "explain": "Slide 114: *The == (or !=) operator performs an automatic type conversion if needed.* `\"0\"`, `0`, `\"\"` and `false` all convert to 0, so all four match. With `===` only the number 0 would, giving 1."
  },
  {
    "q": "What does this print?",
    "code": "let vals = [0, \"0\", null, \"no\", NaN];\nlet truthy = 0;\nfor (let i = 0; i < vals.length; i++) {\n  if (vals[i]) {\n    truthy++;\n  }\n}\nconsole.log(truthy);",
    "options": ["2", "1", "3", "5"],
    "answer": 0,
    "explain": "Slide 114: *undefined, null, 0, false, NaN, '' (empty string) are all falsy.* `0`, `null` and `NaN` are falsy; `\"0\"` and `\"no\"` are non-empty strings, so truthy."
  },
  {
    "q": "What is logged after the loop?",
    "code": "let k = 3;\nwhile (k >= 0) {\n  k--;\n}\nconsole.log(k);",
    "options": ["-1", "0", "3", "the loop never ends"],
    "answer": 0,
    "explain": "k goes 3, 2, 1, 0 and the test still passes at 0, so one more `k--` makes it -1; then `-1 >= 0` is false."
  },
  {
    "q": "Which is the correct order of the CSS box model, from the inside out?",
    "options": ["content, padding, border, margin", "content, margin, border, padding", "margin, border, padding, content", "padding, content, border, margin"],
    "answer": 0,
    "explain": "Slide 177: Content, then Padding (*clears an area around the content*), Border (*goes around the padding and content*), Margin (*clears an area outside the border*)."
  },
  {
    "q": "This code sits in a page's `<head>`. What kind of styling is it?",
    "code": "<style>\n  p { color: teal; }\n  h2 { font-size: 150%; }\n</style>",
    "options": ["internal", "external", "inline"],
    "answer": 0,
    "explain": "Slide 68: *Using <style> tags in the <head> section of same HTML file* is internal. External is a separate `.css` file linked with `<link>`; inline is a `style` attribute on one element."
  },
  {
    "q": "A page has `<h3 class=\"note\">` and `<p class=\"note\">`. Which selector styles only the paragraph?",
    "options": ["`p.note`", "`.note`", "`p .note`", "`#note`"],
    "answer": 0,
    "explain": "Slide 84: `p.myClass` selects only `<p>` elements with that class. `.note` also hits the h3; `p .note` (with a space) means a `.note` inside a `<p>`; `#note` is an id."
  },
  {
    "q": "Which of these is a block-level element by default?",
    "options": ["`<section>`", "`<span>`", "`<a>`", "`<img>`"],
    "answer": 0,
    "explain": "Slide 180 lists `<section>` with div, h1–h6, p, form, header and footer as block-level; span, a and img are inline."
  },
  {
    "q": "`visibility: hidden` removes the element from the DOM tree.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 182: the element *will still take up the same space as before*, and *in both cases the element will not be removed from DOM tree*. `display: none` frees the space; neither removes the element."
  },
  {
    "q": "A page uses the stylesheet `site.css`. Which line in `<head>` attaches it?",
    "options": ["`<link rel=\"stylesheet\" href=\"site.css\">`", "`<style src=\"site.css\"></style>`", "`<script src=\"site.css\"></script>`", "`<a href=\"site.css\"></a>`"],
    "answer": 0,
    "explain": "Slide 173: an external sheet is attached with `<link rel=\"stylesheet\" type=\"text/css\" href=\"myStyle.css\" />`."
  },
  {
    "q": "Complete the rule so it colours every `<p>` that is inside a `<div>`: `___ { color: gray; }`",
    "options": ["`div p`", "`div, p`", "`div.p`", "`p div`"],
    "answer": 0,
    "explain": "Slide 185: the descendant selector `div p` *selects all <p> elements inside <div> elements*. A comma groups two selectors; `div.p` is a div with class p."
  },
  {
    "q": "What does this print?",
    "code": "function stockValue(prices) {\n  let total = 0;\n  for (let i = 0; i < prices.length; i++) {\n    total += prices[i];\n  }\n}\nconsole.log(stockValue([4, 6, 10]));",
    "options": ["undefined", "20", "0", "null"],
    "answer": 0,
    "explain": "`total` reaches 20 inside the function, but there is no `return`, and slide 166 says a function without one *automatically returns undefined*."
  },
  {
    "q": "In `function book(title) { … }` called as `book(\"Emma\")`, what is `\"Emma\"`?",
    "options": ["the argument", "the parameter", "the return value", "a property"],
    "answer": 0,
    "explain": "Slide 163: `title` in the definition is the parameter; the value in the call is the *argument (actual value)*."
  },
  {
    "q": "What does this print?",
    "code": "function tip(bill, pct) {\n  return bill * pct / 100;\n}\nfunction total(bill) {\n  return bill + tip(bill, 20);\n}\nconsole.log(total(tip(500, 10)));",
    "options": ["60", "50", "600", "70"],
    "answer": 0,
    "explain": "Inside out: `tip(500, 10)` is 50. `total(50)` is 50 + `tip(50, 20)` = 50 + 10 = 60."
  },
  {
    "q": "What does this print?",
    "code": "const tax = p => p * 0.1;\nconst withTax = (p, t) => p + t(p);\nconsole.log(withTax(50, tax));",
    "options": ["55", "50", "5", "505"],
    "answer": 0,
    "explain": "`tax` is passed as the argument `t`; `t(50)` is 5, and 50 + 5 = 55. A one-parameter arrow may drop its parentheses; two need them (slide 168)."
  },
  {
    "q": "What does this print?",
    "code": "function pair(a, b) {\n  return a + \"-\" + b;\n}\nlet x = 2;\nlet y = 8;\nconsole.log(pair(y, x));",
    "options": ["8-2", "2-8", "6", "-6"],
    "answer": 0,
    "explain": "Arguments bind by position: `a` gets `y` (8), `b` gets `x` (2). The `\"-\"` is a string, so the result is the text `8-2`."
  },
  {
    "q": "What does this print?",
    "code": "let shelf = [\"Dune\", \"Emma\", \"Ulysses\"];\nconsole.log(typeof shelf);",
    "options": ["object", "array", "string", "undefined"],
    "answer": 0,
    "explain": "Slide 113: *Arrays are also of type objects in JavaScript.*"
  },
  {
    "q": "A page has `<button id=\"btn\">`. After the page loads and the button is clicked four times, what is `saves`?",
    "code": "let saves = 2;\nfunction save() {\n  saves = saves * 2;\n}\ndocument.getElementById(\"btn\").onclick = save();",
    "options": ["4", "2", "32", "16"],
    "answer": 0,
    "explain": "`save()` with parentheses runs once while the script loads (2 × 2 = 4) and assigns its return value, `undefined`, to `onclick`, so the clicks do nothing. `onclick = save` would have given 32."
  },
  {
    "q": "Which is NOT one of the three things slide 21 says your hosting account must provide?",
    "options": ["a registered domain name", "a relational database server", "hosting multiple nodejs projects at the same time", "an SSL certificate"],
    "answer": 0,
    "explain": "Slide 21's three: *1) relational database server*, *2) Hosting multiple nodejs projects at the same time*, *3) SSL certificate*. Slides 25 and 27: you don't need a domain name if the host gives a unique address."
  },
  {
    "q": "`let report = { city: \"Surrey\", wind: { dir: \"NW\", speed: 18 } };` Which line does NOT print NW?",
    "options": ["`console.log(report.[wind].dir);`", "`console.log(report[\"wind\"][\"dir\"]);`", "`console.log(report.wind[\"dir\"]);`", "`console.log(report[\"wind\"].dir);`"],
    "answer": 0,
    "explain": "Slide 141's two forms are `objectName.propertyName` and `objectName[\"propertyName\"]`; they mix freely. `.[` is a syntax error."
  },
  {
    "q": "What does this print?",
    "code": "if (true) {\n  let fee = 5;\n  fee++;\n}\nconsole.log(fee);",
    "options": ["Uncaught ReferenceError: fee is not defined", "6", "5", "undefined"],
    "answer": 0,
    "explain": "Slide 115: *let: Declares a block-scoped, variable.* `fee` exists only inside the `{ }` of the if, so reading it outside throws."
  },
  {
    "q": "What does this print?",
    "code": "console.log(stock);\nlet price = 3;\nfor (let i = 0; i < 3; i++) {\n  price = price * 2;\n}\nvar stock = 4;",
    "options": ["undefined", "4", "Uncaught ReferenceError: stock is not defined", "24"],
    "answer": 0,
    "explain": "Slide 132: the engine treats every `var` declaration *as if they are declared at the top*, so `stock` exists but has no value yet: `undefined`. The loop in between changes nothing."
  },
  {
    "q": "What does this print?",
    "code": "setTimeout(function () {\n  console.log(\"b\");\n  setTimeout(function () {\n    console.log(\"d\");\n  }, 0);\n  console.log(\"c\");\n}, 0);\nconsole.log(\"a\");",
    "options": ["a / b / c / d", "b / d / c / a", "a / b / d / c", "b / c / d / a"],
    "answer": 0,
    "explain": "Slide 162: a 0 ms callback still waits until the script has finished, so `a` is first. The outer callback then runs top to bottom, `b` and `c`; the inner 0 ms timer only queues `d`, which runs last."
  },
  {
    "type": "free",
    "q": "Explain inheritance and composition with the slides' Car example, and give the key advantage the slides name for composition.",
    "model": "Inheritance is an is-a relationship: `class Car extends Vehicle`, so a Car is a type of Vehicle, inheriting its properties and methods; `super(brand)` calls the parent constructor. Composition is a has-a relationship: Car has an Engine as a component, passed into its constructor, and `car.start()` calls `this.engine.start()`. The composition approach allows more flexibility: you can easily swap out the Engine for another type without needing to change the Car class.",
    "points": ["inheritance is is-a (Car is a type of Vehicle)", "the subclass uses extends and inherits properties and methods", "composition is has-a (Car has an Engine as a component)", "composition allows more flexibility", "you can swap the Engine without changing the Car class"],
    "rows": 6,
    "explain": "Slides 7 to 9."
  },
  {
    "type": "free",
    "q": "Compare `var` and `let` on the four rows of slide 134's table.",
    "model": "Scope: var is function-scoped, let is block-scoped (visible only within the `{ }`). Hoisting: var's declaration is hoisted to the top of the function, so reading it early gives undefined; the slide says let is not hoisted, and reading it early throws a ReferenceError. Global object: a global var is added to `window`; let does not add a property to window. Strict mode: re-declaring a var is ok; re-declaring a let is not allowed.",
    "points": ["scope: var function scope, let block scope", "hoisting: var hoisted to the top of the function (reads undefined)", "let used before its line throws a ReferenceError", "a global var is added to window, a let is not", "re-declaration: allowed for var, not for let"],
    "rows": 6,
    "explain": "Slide 134. Strictly, `let` is hoisted too but sits in the temporal dead zone until its line, which is why the error says *Cannot access ... before initialization*."
  }
]
```

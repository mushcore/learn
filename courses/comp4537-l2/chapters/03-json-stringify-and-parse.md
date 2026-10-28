---
title: JSON.stringify serializes, JSON.parse deserializes
minutes: 14
---

A JavaScript object in the browser has to reach a server in another country, and the server's answer has to come back as something the script can use. JSON is the string format in between.

## An object cannot travel; a string can (slides 26 and 27)

JSON stands for JavaScript Object Notation. Slide 27 asks whether an object can be sent to a server in Korea as-is. No: *A JavaScript object lives in memory — it has methods, prototypes, references. You cannot transmit it over a network.* *You must serialize (flatten) it into a string format any machine can read.* JSON is the standard format for this.

```diagram
{ "type": "flow", "title": "Serialize, send, deserialize", "nodes": [ { "id": "obj", "label": "object in memory", "sub": "methods, prototypes, references" }, { "id": "str", "label": "JSON string" }, { "id": "net", "label": "network" }, { "id": "kr", "label": "server in Korea" }, { "id": "obj2", "label": "object" } ], "edges": [ { "from": "obj", "to": "str", "label": "JSON.stringify" }, { "from": "str", "to": "net" }, { "from": "net", "to": "kr" }, { "from": "kr", "to": "obj2", "label": "JSON.parse" } ], "hi": ["str"], "caption": "You must serialize (flatten) it into a string format any machine can read (slide 27)." }
```

## stringify goes out, parse comes back (slide 28)

Slide 28, *JSON: Serialize and Deserialize*, as the slide has it:

```js run pin serialize and deserialize
// predict: Write the four lines the console shows.
// 1. Object → JSON string (serialize)
let myObj = { name: "John", age: 22, city: "Vancouver" };
let myJSON = JSON.stringify(myObj);
console.log(myJSON);  // '{"name":"John","age":22,"city":"Vancouver"}'
console.log(typeof myJSON);  // "string"

// 2. JSON string → Object (deserialize)
let jsonStr = '{"name":"Ali","courses":["COMP4537","COMP3522"]}';
let parsed = JSON.parse(jsonStr);
console.log(parsed.name);       // "Ali"
console.log(parsed.courses[0]); // "COMP4537"
```

```output
{"name":"John","age":22,"city":"Vancouver"}
string
Ali
COMP4537
```

`JSON.stringify(myObj)` is object → JSON string, the serialize direction, and `typeof myJSON` is `"string"`. `JSON.parse(jsonStr)` is JSON string → object, the deserialize direction. The console prints a string without quotes, so the comments' outer quotes do not appear when it runs. In the JSON text every key and every string value is in double quotes; the number 22 is not.

Under the code the slide adds, in bold: *Name/value pairs are always stored as strings. Remember to convert them to another format when needed!* That rule belongs to web storage, where slide 34 repeats it and it is true. JSON text is one string, but after `JSON.parse` each value has its type back:

```js run pin types survive parse
// predict: Write the one line printed.
const p = JSON.parse('{"age":22,"ok":true,"tags":["a"]}');
console.log(typeof p.age, typeof p.ok, Array.isArray(p.tags));
```

```output
number boolean true
```

Run it: `typeof p.age` is `number`, `typeof p.ok` is `boolean`, and `Array.isArray(p.tags)` is `true`. The 22 that crossed the wire as text is a number again, so arithmetic on it works without any conversion. Where the bold note does hold is in the browser's storage: there a stored 22 comes back as the text "22", which is why the storage lesson pairs `setItem` with `JSON.stringify`.

## Parse, then navigate with dots and indexes (slide 29)

An API returns a string with an object inside an object and an array inside that. How do you reach the first course name? Slide 29: *Parse the string back into an object, then navigate using dot notation and array indices.*

```js run pin navigate a parsed response
// predict: What prints?
let jsonString = '{"status":200, "data":{"user":"Amir", "courses":["COMP4537"]}}';
let response = JSON.parse(jsonString);
console.log(response.data.courses[0]);
```

```output
COMP4537
```

`response.data` is the inner object, `.courses` its array, `[0]` the first element. Skip the parse and the navigation fails: `jsonString.data` is `undefined`, because a string has no `data` property, only characters. The slide's string is also the proof that nested objects are valid JSON.

```diagram
{ "type": "tree", "title": "The parsed response", "nodes": [ { "id": "r", "label": "response" }, { "id": "st", "label": "status", "sub": "200", "parent": "r" }, { "id": "d", "label": "data", "parent": "r" }, { "id": "u", "label": "user", "sub": "\"Amir\"", "parent": "d" }, { "id": "c", "label": "courses", "sub": "array", "parent": "d" }, { "id": "c0", "label": "[0]", "sub": "\"COMP4537\"", "parent": "c" } ], "hi": ["r", "d", "c", "c0"], "caption": "response.data.courses[0] → \"COMP4537\" (slide 29)." }
```

## What JSON cannot hold

Beyond the slides, from the JSON pages slide 45 cites: keys and strings take double quotes only, and JSON has no functions, no `undefined`, no comments and no trailing commas. `JSON.parse` throws a `SyntaxError` on any of them. `JSON.stringify` silently drops a property whose value is a function or `undefined`, which is slide 27's "methods cannot be transmitted" made visible. The `JSON` object offers `parse` and `stringify`, and nothing called `convert`.

```js run pin what JSON drops
// predict: Write the three lines printed.
console.log(JSON.stringify({ title: "Notes", save() {}, draft: undefined }));
try { JSON.parse("{'a':1}"); } catch (e) { console.log(e.name); }
console.log(typeof JSON.convert);
```

```output
{"title":"Notes"}
SyntaxError
undefined
```

`save() {}` and `draft: undefined` vanish from the string; the single-quoted `"{'a':1}"` is not JSON, so `e.name` is `SyntaxError`; `typeof JSON.convert` is `undefined` because no such method exists.

## Read a weather forecast and a clinic record

A weather service answers with `{"city":"Burnaby","forecast":[{"day":"Mon","high":14},{"day":"Tue","high":11}]}`, stored in `w` after `JSON.parse`.

```quiz
[
  { "q": "After `const w = JSON.parse(text)` on the forecast string, which expression gives `11`?", "options": ["`w.forecast[1].high`", "`w.forecast[0].high`", "`w.forecast.high[1]`", "`w[1].forecast.high`"], "answer": 0, "explain": "`w.forecast` is the array, `[1]` its second element (Tue), `.high` that object's property: 11. Index 0 is Mon with 14; `forecast.high` is undefined because an array has no `high`." },
  { "q": "What prints?", "code": "const w = JSON.parse('{\"city\":\"Burnaby\",\"forecast\":[{\"day\":\"Mon\",\"high\":14},{\"day\":\"Tue\",\"high\":11}]}');\nconsole.log(w.forecast[1].high, typeof w.forecast[0].high, w.forecast.length);", "options": ["11 number 2", "11 string 2", "14 number 2", "11 number 1"], "answer": 0, "explain": "Run it: `11 number 2`. The high is a number after parsing, and the array holds two days." },
  { "q": "What prints?", "code": "console.log(JSON.stringify({ city: \"Burnaby\", show() {}, note: undefined, rain: null }));", "options": ["{\"city\":\"Burnaby\",\"rain\":null}", "{\"city\":\"Burnaby\",\"show\":{},\"note\":undefined,\"rain\":null}", "{\"city\":\"Burnaby\"}", "{city:\"Burnaby\",rain:null}"], "answer": 0, "explain": "Run it: `{\"city\":\"Burnaby\",\"rain\":null}`. The method and the `undefined` property are dropped; `null` is a JSON value and stays. Keys come out in double quotes." },
  { "q": "`JSON.parse(\"{'city':'Burnaby'}\")` returns an object with `city` set to `Burnaby`.", "type": "tf", "answer": false, "explain": "Single quotes are not JSON. The call throws a `SyntaxError`, as the `{'a':1}` run above showed." }
]
```

```challenge
{ "lang": "js", "prompt": "A clinic API returns the string in `text`. Parse it and print the second doctor's name, then the number of doctors, one per line.", "starter": "const text = '{\"clinic\":{\"name\":\"Elm St\",\"doctors\":[\"Lee\",\"Khan\"]}}';\n// parse, then two console.log calls\n", "expected": "Khan\n2", "hints": ["`JSON.parse(text)` gives an object; the doctors are at `.clinic.doctors`.", "The second element is index 1; an array's size is `.length`."], "solution": "const text = '{\"clinic\":{\"name\":\"Elm St\",\"doctors\":[\"Lee\",\"Khan\"]}}';\nconst x = JSON.parse(text);\nconsole.log(x.clinic.doctors[1]);\nconsole.log(x.clinic.doctors.length);\n" }
```

```quiz
[
  { "q": "Which of these is not a built-in method of the `JSON` object?", "options": ["`JSON.encode()`", "`JSON.parse()`", "`JSON.stringify()`", "All three are built in"], "answer": 0, "explain": "The `JSON` object has `parse` and `stringify`. There is no `encode` (and no `convert`: `typeof JSON.convert` printed `undefined`)." },
  { "q": "True or false: this is valid JSON with an object nested inside an object.", "type": "tf", "code": "{\n  \"patient\": {\n    \"name\": \"Rosa\",\n    \"address\": { \"city\": \"Surrey\" }\n  }\n}", "answer": true, "explain": "Nested objects are valid JSON: every key and string is double-quoted and the braces match. Slide 29's response nests `data` inside the outer object the same way." },
  { "q": "What prints?", "code": "const book = { title: \"Dune\", price: 12.5, tags: [\"sf\", \"classic\"] };\nconst s = JSON.stringify(book);\nconst back = JSON.parse(s);\nconsole.log(typeof s);\nconsole.log(back.tags[1], back.price + 1);", "options": ["string / classic 13.5", "object / classic 13.5", "string / classic 12.51", "string / sf 13.5"], "answer": 0, "explain": "Run it: `typeof s` is `string`. After parsing, `price` is the number 12.5 again, so `+ 1` gives 13.5, not `12.51`; `tags[1]` is `classic`." },
  { "type": "match", "q": "Match each term to the call.", "pairs": [["serialize", "JSON.stringify"], ["deserialize", "JSON.parse"]], "explain": "Slide 28: `JSON.stringify` = object → JSON string (serialize); `JSON.parse` = JSON string → object (deserialize)." },
  { "q": "JSON stands for ___.", "type": "text", "answer": ["JavaScript Object Notation"], "explain": "Slide 26: JSON = JavaScript Object Notation." },
  { "q": "Why can't a JavaScript object be sent to a server as-is (slide 27)?", "options": ["It lives in memory with methods, prototypes and references, so it must be serialized into a string first", "Servers only accept numbers", "Objects are too large for HTTP", "JSON.parse must run in the browser first"], "answer": 0, "explain": "*A JavaScript object lives in memory — it has methods, prototypes, references. You cannot transmit it over a network.* It is serialized with `JSON.stringify`." },
  { "q": "Which call turns the string a server sent back into an object you can navigate with dots?", "options": ["`JSON.parse`", "`JSON.stringify`", "`typeof`", "`toString`"], "answer": 0, "explain": "Slide 29: *Parse the string back into an object, then navigate using dot notation and array indices.*" },
  { "q": "`typeof JSON.stringify({ a: 1 })` is `\"object\"`.", "type": "tf", "answer": false, "explain": "Slide 28: `typeof myJSON` is `\"string\"`. stringify always returns a string." }
]
```

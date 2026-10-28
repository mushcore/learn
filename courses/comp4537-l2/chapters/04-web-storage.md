---
title: localStorage and sessionStorage, per origin, strings only
minutes: 18
---

A user fills out a long form, closes the tab by accident, and everything is gone. Slide 31 keeps the data in the browser itself, with no server involved.

## Web storage lives in the browser, per origin (slides 30 to 32)

HTML Web Storage is two objects, localStorage and sessionStorage. Slide 31's answer: *Store the data in the browser itself using localStorage.* *It persists even after the browser is closed — available the next day, week, or year.* *No server round-trip needed. Data stays on the client machine.*

Slide 32, *Web Storage (inside your browser, not server)*:

- We want to store data locally within the user's browser.
- *Web storage is more secure than cookies, and large amounts of data can be stored locally (generally 5MB or more).*
- *Note that web storage is per origin! That means per domain and protocol.*
- *All pages, from same origin, can store and access the same data within same browser on your computer.*
- It is client-side storage, in the local data storage of your browser.

The security sentence is the slide's claim; slides 43 and 44 show its limit, since any script on the page can read the store. Its real advantages over a cookie are size (about 5 MB against about 4 KB) and that it is not sent to the server with every request. The full origin rule also counts the port: http://a.com and http://a.com:8080 have separate stores. The path never counts.

```diagram
{ "type": "grid", "title": "Item stored at https://notes.example.ca/app/1/index.html", "nodes": [ { "id": "h0", "label": "page", "row": 0, "col": 0 }, { "id": "h1", "label": "differs in", "row": 0, "col": 1 }, { "id": "h2", "label": "can read it?", "row": 0, "col": 2 }, { "id": "a0", "label": "https://notes.example.ca", "sub": "/trash/9/list.html", "row": 1, "col": 0 }, { "id": "a1", "label": "path only", "row": 1, "col": 1 }, { "id": "a2", "label": "yes", "row": 1, "col": 2 }, { "id": "b0", "label": "https://app.notes.example.ca", "sub": "/1/index.html", "row": 2, "col": 0 }, { "id": "b1", "label": "subdomain (host)", "row": 2, "col": 1 }, { "id": "b2", "label": "no", "row": 2, "col": 2 }, { "id": "c0", "label": "http://notes.example.ca", "sub": "/app/1/index.html", "row": 3, "col": 0 }, { "id": "c1", "label": "protocol", "row": 3, "col": 1 }, { "id": "c2", "label": "no", "row": 3, "col": 2 }, { "id": "d0", "label": "http://localhost:3000", "sub": "/app/1/index.html", "row": 4, "col": 0 }, { "id": "d1", "label": "protocol, host, port", "row": 4, "col": 1 }, { "id": "d2", "label": "no", "row": 4, "col": 2 }, { "id": "e0", "label": "the same URL in another browser", "row": 5, "col": 0 }, { "id": "e1", "label": "browser", "row": 5, "col": 1 }, { "id": "e2", "label": "no", "row": 5, "col": 2 } ], "hi": ["a2"], "caption": "All pages, from same origin, can store and access the same data within same browser (slide 32)." }
```

### Two browsers, two tabs each

Store a value in one tab, then change another tab's address: only the same origin in the same browser sees it.

```widget
storage-sim
{ "mode": "local" }
```

## localStorage never expires; sessionStorage dies with the tab (slide 33)

*There are two HTML web storage objects for storing data on the client:*

- *window.localStorage - stores data with no expiration date*
- *window.sessionStorage - stores data for one session (data is lost when the browser tab is closed)*

```diagram
{ "type": "grid", "title": "localStorage vs sessionStorage", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "localStorage", "row": 0, "col": 1 }, { "id": "h2", "label": "sessionStorage", "row": 0, "col": 2 }, { "id": "a0", "label": "lifetime", "row": 1, "col": 0 }, { "id": "a1", "label": "no expiration date", "row": 1, "col": 1 }, { "id": "a2", "label": "one session: lost when the browser tab is closed", "row": 1, "col": 2 }, { "id": "b0", "label": "shared by", "row": 2, "col": 0 }, { "id": "b1", "label": "same-origin pages in the same browser", "row": 2, "col": 1 }, { "id": "b2", "label": "that one tab", "row": 2, "col": 2 }, { "id": "c0", "label": "size", "row": 3, "col": 0 }, { "id": "c1", "label": "generally 5MB or more", "row": 3, "col": 1 }, { "id": "c2", "label": "generally 5MB or more", "row": 3, "col": 2 }, { "id": "d0", "label": "calls", "row": 4, "col": 0 }, { "id": "d1", "label": "setItem, getItem, removeItem, clear", "row": 4, "col": 1 }, { "id": "d2", "label": "the same four", "row": 4, "col": 2 }, { "id": "e0", "label": "values", "row": 5, "col": 0 }, { "id": "e1", "label": "strings only", "row": 5, "col": 1 }, { "id": "e2", "label": "strings only", "row": 5, "col": 2 } ], "hi": ["a1", "a2"], "caption": "Slide 33: localStorage stores data with no expiration date; sessionStorage for one session." }
```

### sessionStorage stays in one tab

Set a value, then reopen the tab: it is gone, and the second tab of the same origin never had it.

```widget
storage-sim
{ "mode": "session" }
```

## Four calls, and every value is a string (slide 34)

*The localStorage Object*, as the slide has it:

```js run pin the four localStorage calls
// predict: What prints?
// Store
localStorage.setItem("myKey", "Monday and Friday");

// Retrieve
let val = localStorage.getItem("myKey");
console.log(val);  // "Monday and Friday"

// Remove a single item
localStorage.removeItem("myKey");

// Clear everything for this origin
localStorage.clear();
```

It prints `Monday and Friday`, without the quotes. `localStorage.setItem` stores under a key, `localStorage.getItem` reads it back, `localStorage.removeItem` deletes one key and `localStorage.clear()` deletes every key of this origin. The bold note: *Name/value pairs are always stored as strings. Remember to convert them to another format when needed!*

```js run pin strings only
// predict: Write both lines.
localStorage.setItem("visits", 3);
console.log(typeof localStorage.getItem("visits"), localStorage.getItem("visits") + 1);
console.log(localStorage.getItem("missing"));
```

Run it: `string 31`, then `null`. The number 3 came back as the text "3", so `+ 1` joins strings. A missing key gives `null`, so `getItem` returns a string or `null`. A value read with `getItem` is a copy: a later `removeItem` or `setItem` does not change it.

## JSON is the bridge for objects (slide 35)

*Use JSON as the bridge between objects and strings:*

```js run pin store an object through JSON
// predict: What prints?
// Store: serialize the object to a JSON string
localStorage.setItem("user", JSON.stringify({name: "Amir", role: "prof"}));

// Retrieve: parse the JSON string back to an object
let user = JSON.parse(localStorage.getItem("user"));
console.log(user.name);  // "Amir"
```

It prints `Amir`. `JSON.stringify` makes the one string the store accepts; `JSON.parse(localStorage.getItem("user"))` turns it back into an object. Lab 2's note app works this way: an array of note objects, stringified into one key.

## writer.html and reader.html share one store (slides 36 and 37)

Both pages below share this lesson's store. Before saving anything, what does Read show? After saving "dentist at 3", what then?

### writer.html

```html run pin writer.html
<html lang="en">
<body>
  <h2>Writer</h2>
  <input id="dataInput" placeholder="Enter a value" />
  <button id="saveBtn">Save to localStorage</button>
  <p id="status"></p>
  <script>
    document.getElementById("saveBtn").addEventListener("click", () => {
      const val = document.getElementById("dataInput").value;
      localStorage.setItem("shared_data", val);
      document.getElementById("status").textContent = "Saved: " + val;
    });
  </script>
</body>
</html>
```

*This code snippet writes something onto local storage*: the click handler runs `localStorage.setItem("shared_data", val);` and shows `"Saved: " + val` under the button.

### reader.html

```html run pin reader.html
<html lang="en">
<body>
  <h2>Reader</h2>
  <button id="readBtn">Read from localStorage</button>
  <p id="output"></p>
  <script>
    document.getElementById("readBtn").addEventListener("click", () => {
      const val = localStorage.getItem("shared_data");
      document.getElementById("output").textContent = val
        ? "Found: " + val
        : "Nothing stored yet.";
    });
  </script>
</body>
</html>
```

Before a save, `localStorage.getItem("shared_data")` is `null`, which is falsy, so the page shows `"Nothing stored yet."`; after one it shows `"Found: " + val`, here "Found: dentist at 3". *reader.html reads the same data written by writer.html (same origin, same browser, same machine)*.

```diagram
{ "type": "flow", "title": "One key, two pages", "nodes": [ { "id": "w", "label": "writer.html" }, { "id": "s", "label": "localStorage", "sub": "notes.example.ca origin", "kind": "cylinder" }, { "id": "r", "label": "reader.html" }, { "id": "o", "label": "localStorage", "sub": "another browser", "kind": "cylinder" } ], "edges": [ { "from": "w", "to": "s", "label": "setItem" }, { "from": "s", "to": "r", "label": "getItem" } ], "hi": ["s"], "caption": "Same origin, same browser, same machine; another browser's store never sees the key (slide 37)." }
```

## DevTools shows the store (slide 38)

*Open Chrome DevTools (F12) → Application tab → Storage → Local Storage.* There you see every key-value pair of the current origin, edit values in place, delete entries or clear all. *This is essential for debugging.*

```diagram
{ "type": "flow", "title": "Inspecting storage without code", "nodes": [ { "id": "f", "label": "F12" }, { "id": "a", "label": "Application tab" }, { "id": "s", "label": "Storage" }, { "id": "l", "label": "Local Storage", "sub": "key-value pairs of this origin" } ], "edges": [ { "from": "f", "to": "a" }, { "from": "a", "to": "s" }, { "from": "s", "to": "l" } ], "hi": ["a"], "caption": "Slide 38: Chrome DevTools (F12) → Application tab → Storage → Local Storage." }
```

## Where data should live (slides 40 to 44)

```diagram
{ "type": "grid", "title": "Five questions, five answers", "nodes": [ { "id": "h0", "label": "situation", "row": 0, "col": 0 }, { "id": "h1", "label": "answer", "row": 0, "col": 1 }, { "id": "a0", "label": "cart on the laptop, then sign in on the phone", "row": 1, "col": 0 }, { "id": "a1", "label": "appears only if kept on the server with the account; laptop localStorage does not travel", "row": 1, "col": 1 }, { "id": "b0", "label": "cart survives a refresh", "row": 2, "col": 0 }, { "id": "b1", "label": "proves nothing: localStorage, a persistent cookie, or server-side storage via an API", "row": 2, "col": 1 }, { "id": "c0", "label": "dark mode on one device", "row": 3, "col": 0 }, { "id": "c1", "label": "localStorage; across the account: server-side database", "row": 3, "col": 1 }, { "id": "d0", "label": "a password", "row": 4, "col": 0 }, { "id": "d1", "label": "No. Never. The server checks a securely hashed value", "row": 4, "col": 1 }, { "id": "e0", "label": "an authentication token", "row": 5, "col": 0 }, { "id": "e1", "label": "It can, but XSS risk; HttpOnly and Secure cookies often safer", "row": 5, "col": 1 } ], "hi": ["d1"], "caption": "Never assume the storage mechanism from observed behavior alone (slide 41)." }
```

Slide 43's reason: *localStorage is readable by any JavaScript on the page — a single XSS vulnerability exposes the password.* Slide 44: *HttpOnly and Secure cookies are often safer because JavaScript cannot access them.*

## Trace five more key sequences

Each program runs in a fresh, empty store. Write the output before choosing.

```quiz
[
  { "q": "What prints?", "code": "localStorage.setItem(\"note\", \"milk\");\nlocalStorage.setItem(\"note\", \"bread\");\nconsole.log(localStorage.getItem(\"note\"));", "options": ["bread", "milk", "milk,bread", "null"], "answer": 0, "explain": "Run it: `bread`. A second `setItem` on the same key replaces the value; one key holds one string." },
  { "q": "What prints?", "code": "const k = \"draft\";\nlocalStorage.setItem(k, \"v1\");\nconst saved = localStorage.getItem(k);\nlocalStorage.removeItem(k);\nlocalStorage.setItem(k, \"v2\");\nconsole.log(saved, localStorage.getItem(k));", "options": ["v1 v2", "v2 v2", "null v2", "v1 null"], "answer": 0, "explain": "Run it: `v1 v2`. `saved` is a copy taken while the key held v1; removing and re-setting the key changes the store, not `saved`." },
  { "q": "What prints?", "code": "localStorage.setItem(\"qty\", 2);\nlocalStorage.clear();\nconsole.log(localStorage.getItem(\"qty\"));", "options": ["null", "2", "undefined", "\"\" (an empty string)"], "answer": 0, "explain": "Run it: `null`. `clear()` deletes every key of the origin, and `getItem` on a missing key returns `null`, not `undefined`." },
  { "q": "What prints?", "code": "localStorage.setItem(\"qty\", 2);\nconsole.log(localStorage.getItem(\"qty\") + 3);", "options": ["23", "5", "NaN", "null"], "answer": 0, "explain": "Run it: `23`. The 2 was stored as the string \"2\", and string + number joins: \"2\" + 3 = \"23\". Convert with `Number(...)` first to get 5." },
  { "q": "What prints?", "code": "localStorage.setItem(\"patient\", { name: \"Rosa\" });\nconsole.log(localStorage.getItem(\"patient\"));", "options": ["[object Object]", "{\"name\":\"Rosa\"}", "Rosa", "null"], "answer": 0, "explain": "Run it: `[object Object]`. Without `JSON.stringify` the object is turned into a string the default way and its data is lost. Slide 35's bridge: `setItem(\"patient\", JSON.stringify(obj))`." }
]
```

```quiz
[
  { "q": "An item is stored in the localStorage of `https://shop.example.ca/cart/2/view.html`. Which page can read it?", "options": ["`https://shop.example.ca/help/faq.html`", "`https://m.shop.example.ca/cart/2/view.html`", "`http://localhost:3000/cart/2/view.html`", "Both the `m.` page and the `faq` page"], "answer": 0, "explain": "Same protocol and host, different path: same origin, same store. `m.shop.example.ca` is a different host, and `localhost:3000` differs in protocol, host and port." },
  { "q": "Which call deletes every stored item of the page's origin?", "options": ["`localStorage.clear()`", "`localStorage.removeItem()`", "`localStorage.deleteAll()`", "`localStorage.empty()`"], "answer": 0, "explain": "Slide 34: `clear()` is *Clear everything for this origin*. `removeItem(key)` removes a single item; the other two do not exist." },
  { "q": "A note saved to localStorage in Edge can be read by the same page opened in Chrome on that computer.", "type": "tf", "answer": false, "explain": "Each browser keeps its own store. Slide 37: same origin, same browser, same machine." },
  { "q": "After `let t = localStorage.getItem(\"theme\");`, what can the type of `t` be?", "options": ["string or null", "string only", "undefined", "whatever type was stored"], "answer": 0, "explain": "Values are always stored as strings (slide 34), and a missing key gives `null`." },
  { "q": "Where in Chrome DevTools do you see the Local Storage of the current page?", "options": ["Application tab", "Network tab", "Console tab", "Sources tab"], "answer": 0, "explain": "Slide 38: Chrome DevTools (F12) → Application tab → Storage → Local Storage." },
  { "q": "Data in sessionStorage is lost when the browser tab is closed.", "type": "tf", "answer": true, "explain": "Slide 33: *window.sessionStorage - stores data for one session (data is lost when the browser tab is closed)*. localStorage has no expiration date." },
  { "q": "Slide 32: web storage is more secure than cookies.", "type": "tf", "answer": true, "explain": "True as the slide says it. In fact any script on the page can read web storage (slides 43 and 44), and HttpOnly cookies cannot be read by scripts; web storage's real advantages are size (about 5 MB vs about 4 KB) and not being sent with every request." },
  { "q": "Should a site keep a user's password in localStorage?", "options": ["No; the server verifies it against a securely hashed value", "Yes, if the site uses HTTPS", "Yes, in sessionStorage instead", "Only for one session"], "answer": 0, "explain": "Slide 43: *No. Never.* *localStorage is readable by any JavaScript on the page — a single XSS vulnerability exposes the password.*" },
  { "q": "A cart is still there after a page refresh, so the site must use localStorage.", "type": "tf", "answer": false, "explain": "Slide 41: it may be localStorage, a persistent cookie, or server-side storage retrieved through an API request. *Never assume the storage mechanism from observed behavior alone.*" },
  { "type": "free", "q": "Compare localStorage and sessionStorage.", "model": "Both are HTML web storage objects that keep name/value pairs on the client, in the browser, not on the server, per origin, generally 5MB or more, with the same calls (`setItem`, `getItem`, `removeItem`, `clear`) and values always stored as strings. localStorage stores data with no expiration date: it survives closing the browser and is shared by all same-origin pages in that browser. sessionStorage stores data for one session: it belongs to one tab and is lost when the tab is closed.", "points": ["localStorage: no expiration date", "sessionStorage: one session, lost when the tab is closed", "both client-side, in the browser, per origin", "same four calls", "values are strings (objects need JSON.stringify / JSON.parse)"], "rows": 5, "explain": "Slides 32 to 34." }
]
```

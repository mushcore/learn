---
title: HTML elements, attributes and the DOM tree
minutes: 16
---

Every DOM script and AJAX page later in the course edits an HTML document. This lesson reviews what the document is made of and the URL that fetches it.

<!-- facts: slide 32 prerequisites; slide 34 browsers, skeleton without DOCTYPE; slide 35 DOCTYPE; slide 36 HTML/CSS/JS/DOM; slide 37 page and seven-line box; slide 38 DOM tree; slide 39 tags, element, single tags; slides 40-41 href, attributes, img, alt; slide 42 tags not displayed, unknown tag; slide 44 HTTP, HTTPS SSL, FTP, Telnet; slides 45-46 URL four parts; slides 47-48 tips 1-4; slide 49 lists; slides 51-52 input button, radio group; slides 53-55 formatting, b vs strong, quotation table; slides 72-73 table, div; slides 75-76 id, class; slide 180 pointer -->

## HTML makes the elements, the DOM connects them (slides 34 to 36)

Slide 32 lists the prerequisites: COMP1537, COMP1630 and COMP2537. *HTML is a language that browsers ( Chrome, Internet Explorer, Microsoft Edge, Safari, Opera) understand.* Slide 36 divides the work:

- *HTML is used to create the element of a webpage*
- *How those elements are logically attached to each other is determined by a tree graph called DOM!*
- CSS says *where every element is placed and how it looks*
- JavaScript adds *interactivity*

HTML is Hyper Text Markup Language; CSS is Cascading Style Sheets. *All HTML documents must start with a document type declaration: <!DOCTYPE html>.* The document itself begins with `<html>` and ends with `</html>`. Slide 34's VS Code skeleton has no DOCTYPE line, so it misses that rule.

```html run pin page-skeleton.html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>This is a Heading</h1>
    <p>This is a paragraph.</p>
  </body>
</html>
```

Slide 37's grey box: `<!DOCTYPE html>` *defines this document to be HTML5*; `<html>` is the root element; `<head>` *contains meta information about the document*; `<title>Page Title</title>` names the tab, not the page; `<body>` *contains the visible page content*; `<h1>` is a large heading; `<p>` a paragraph.

## The DOM is a tree (slide 38)

Each element is a node whose children are the tags nested inside it; text is a leaf.

```diagram
{ "type": "tree", "title": "The DOM of a page", "nodes": [ { "id": "doc", "label": "document" }, { "id": "html", "label": "Root element: <html>", "parent": "doc" }, { "id": "head", "label": "Element: <head>", "parent": "html" }, { "id": "body", "label": "Element: <body>", "parent": "html" }, { "id": "title", "label": "Element: <title>", "parent": "head" }, { "id": "t1", "label": "Text: \"My title\"", "parent": "title" }, { "id": "h1", "label": "Element: <h1>", "parent": "body" }, { "id": "t2", "label": "Text: \"A heading\"", "parent": "h1" }, { "id": "a", "label": "Element: <a>", "parent": "body" }, { "id": "href", "label": "Attribute: href", "kind": "note", "parent": "a" }, { "id": "t3", "label": "Text: \"Link text\"", "parent": "a" } ], "hi": ["html"], "caption": "Notice the tree-like structure of DOM model. Nested tags." }
```

## Tags, elements and attributes (slides 39 to 42)

*HTML is a 'markup' language. It consists of tags.* An opening tag, the content and a closing tag together make an element.

```diagram
{ "type": "flow", "title": "An HTML element", "nodes": [ { "id": "o", "label": "<p>", "sub": "opening tag" }, { "id": "c", "label": "Hello world!", "sub": "content" }, { "id": "e", "label": "</p>", "sub": "closing tag" } ], "edges": [ { "from": "o", "to": "c" }, { "from": "c", "to": "e" } ], "caption": "HTML elements are the building blocks of HTML pages." }
```

*Tags generally 'open' and 'close' – except for single-element tags like <img>, <br> and <hr>.* *Attributes are used to provide additional information about HTML elements*: in `<a href="https://www.bcit.ca">`, `href` holds the link's destination; in `<img src="bcit.jpg" alt="bcit.ca" width="104" height="142">` all four are attributes, *( pair:value attributes )*. Slide 41 asks what `alt` does. Worked out: it is the alternative text shown when the image cannot load, and the text a screen reader reads aloud.

*Browsers do not display the HTML tags themselves.* Slide 42 asks what happens to loose text and to an invented tag; the page below tests both, with slide 47 and 48's tips.

```html run pin unknown-tag-and-loose-text.html
<!DOCTYPE html>
<html>
  <body>
    Opening hours are posted below.
    <Notice>Closed on statutory holidays</Notice>
    <p>Walk-ins welcome
    <p>Bring your health card
    <br/>
    <P>Upper-case tags work too.</P>
  </body>
</html>
```

Worked out by running it: the loose sentence displays; the unknown `<Notice>` tag is ignored but its text shows; the two `<p>` without `</p>` still display. *HTML tags are not case sensitive*, so `<P>` works; the course uses lower case. Single tags such as `<br/>` *are also referred as empty tags*; the slide closes them with a slash, which HTML5 makes optional.

## Transfer protocols and the four-part URL (slides 44 to 46)

A transfer protocol is *the set of rules that the computers use to move files*; the most common is HTTP. *HTTPS stands for Hypertext Transfer Protocol Secure (it uses separate protocols called SSL)*; today that layer is TLS, SSL's successor. FTP and Telnet are two others. *URL is a four-part addressing scheme*: the protocol, the domain name, the pathname of the folder, and the file name.

```diagram
{ "type": "flow", "title": "The four parts of a URL", "nodes": [ { "id": "p", "label": "http", "sub": "Internet Application Protocol" }, { "id": "d", "label": "www.example.com", "sub": "www = Sub-domain, .com = TLD" }, { "id": "f", "label": "/category/subcategory/", "sub": "pathname" }, { "id": "n", "label": "index.html", "sub": "file name" } ], "edges": [ { "from": "p", "to": "d" }, { "from": "d", "to": "f" }, { "from": "f", "to": "n" } ], "hi": ["d"], "caption": "http://www.example.com/category/subcategory/index.html" }
```

## Lists, inputs and text formatting (slides 49 to 55)

`<ul>` makes a bullet list, `<ol>` a numbered one, each item an `<li>`. Radio buttons: *The browser rendered them in same group as all had the name*.

```html run pin lists-and-inputs.html
<h3>Genres</h3>
<ul>
  <li>Mystery</li>
  <li>Poetry</li>
</ul>
<h3>Bestsellers</h3>
<ol>
  <li>River Town</li>
  <li>Salt and Cedar</li>
</ol>
<input type="radio" name="size" value="small"> small <br>
<input type="radio" name="size" value="medium"> medium <br>
<input type="radio" name="size" value="large"> large <br>
<input type="button" value="Order">
```

The radios share `name="size"`, so picking one clears the others. Slide 51's button has two attributes (worked out): `type` and `value`.

Slide 53 lists ten formatting elements, run here in its order, with two of slide 55's quotation elements.

```html run pin formatting.html
<p><b>bold</b> <strong>strong</strong> <i>italic</i> <em>emphasized</em>
<mark>marked</mark> <small>small</small> <del>deleted</del> <ins>inserted</ins>
H<sub>2</sub>O and x<sup>2</sup></p>
<p><abbr title="Doctor">Dr.</abbr> <q>short quote</q> <cite>Clinic Handbook</cite></p>
```

*The HTML <b> element defines bold text, without any extra importance*; `<strong>strong</strong>` *adds semantic "strong" importance too*, and `<em>emphasized</em>` does the same for italic. They look identical.

## Tables, div, id and class (slides 72 to 76)

`<table>` contains the table, `<tr>` a row, `<td>` a data cell, `<th>` a header cell. `<div>` *creates a section in an HTML document*.

```html run pin table.html
<div style="background-color:lightgreen">
  <table>
    <tr><th>Day</th><th>Hours</th></tr>
    <tr><td>Monday</td><td>9 to 5</td></tr>
    <tr id="sat" class="short"><td>Saturday</td><td>10 to 4</td></tr>
  </table>
</div>
```

`id` and `class` are global attributes. An `id`'s value *has to be unique*: only one element per page may be `id="sat"`. A `class` value *dose not have to be unique*, so many rows could share `class="short"`. Block versus inline (`<div>`, `<p>` block; `<span>`, `<a>`, `<img>` inline) is slide 180, in lesson 7.

## Predict four new pages

```quiz
[
  {
    "q": "What does this page display?",
    "code": "<body>\n  Today's soup:\n  <Special>lentil</Special>\n</body>",
    "options": [
      "Today's soup: lentil",
      "Today's soup: only, because the browser drops the unknown tag and its text",
      "lentil only, because loose text is not displayed",
      "Nothing; the browser throws an error"
    ],
    "answer": 0,
    "explain": "Loose text inside `<body>` is displayed, and an unknown tag's markup is ignored while its text still shows. Neither stops the page."
  },
  {
    "q": "How many paragraphs does this display?",
    "code": "<p>Mix the flour\n<p>Add the water\n<p>Bake for an hour",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "Tip 1 on slide 47: some elements display correctly even without the end tag. Each `<p>` starts a new paragraph, so three paragraphs show."
  },
  {
    "q": "Four radio buttons are written with `name=\"day\"`, `name=\"day\"`, `name=\"time\"`, `name=\"time\"`. At most how many can be checked at once?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "Radio buttons with the same name form one group, and one per group can be checked: one `day` and one `time`, 2 in total."
  },
  {
    "q": "How many attributes does `<img src=\"map.png\" alt=\"Clinic map\" width=\"300\">` have?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "`src`, `alt` and `width`: three name=value pairs. `img` is the element's tag name, not an attribute."
  }
]
```

```quiz
[
  {
    "q": "Which of these tags must have both an opening and a closing tag?",
    "options": ["`<ul>`", "`<br>`", "`<hr>`", "`<img>`"],
    "answer": 0,
    "explain": "A list wraps its `<li>` items, so `<ul>` must close. Slide 39 names `<img>`, `<br>` and `<hr>` as the single-element tags."
  },
  {
    "q": "Which line must start every HTML5 document?",
    "options": ["`<!DOCTYPE html>`", "`<html version=\"5\">`", "`<!HTML5>`", "`<doctype type=\"html\">`"],
    "answer": 0,
    "explain": "Slide 35: *All HTML documents must start with a document type declaration: <!DOCTYPE html>.* Slide 37: it *defines this document to be HTML5*."
  },
  {
    "q": "Name the tree graph that determines how the elements of a page are logically attached to each other (the acronym is fine).",
    "type": "text",
    "answer": ["DOM", "Document Object Model"],
    "explain": "Slide 36: *How those elements are logically attached to each other is determined by a tree graph called DOM!*"
  },
  {
    "q": "In the DOM tree, `<title>` is a child of which element?",
    "options": ["`<head>`", "`<body>`", "`<html>`", "`<h1>`"],
    "answer": 0,
    "explain": "`<html>` has two children, `<head>` and `<body>`. The title is meta information, so it sits in `<head>`; visible content goes in `<body>`."
  },
  {
    "q": "HTML tags are case sensitive: `<P>` and `<p>` are different tags.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 48, Tip 4: *HTML tags are not case sensitive: <P> means the same as <p>.* The course writes them in lower case."
  },
  {
    "q": "An attribute value may be quoted with single quotes, as in `<a href='notes.html'>`, as well as with double quotes.",
    "type": "tf",
    "answer": true,
    "explain": "Both quote styles are valid HTML. The slides use double quotes throughout."
  },
  {
    "q": "In `<img src=\"bcit.jpg\" alt=\"BCIT logo\">`, what is the purpose of `alt`?",
    "options": [
      "Alternative text, shown if the image cannot load and read by screen readers",
      "The image's file path",
      "The image's title, shown on the browser tab",
      "The alignment of the image"
    ],
    "answer": 0,
    "explain": "Worked out for slide 41's question: `alt` is alternative text. The file path is `src`."
  },
  {
    "q": "Match each element to its description on slide 55.",
    "type": "match",
    "pairs": [
      ["`<abbr>`", "an abbreviation or acronym"],
      ["`<address>`", "contact information for the author/owner of a document"],
      ["`<bdo>`", "the text direction"],
      ["`<blockquote>`", "a section that is quoted from another source"],
      ["`<cite>`", "the title of a work"],
      ["`<q>`", "a short inline quotation"]
    ],
    "explain": "Slide 55's table, in order. `<q>` is short and inline; `<blockquote>` is a whole quoted section."
  },
  {
    "q": "Fill in the four parts of a URL, in slide 45's order.",
    "type": "fill",
    "code": "1. the transfer ___ to use\n2. the ___ name of the computer\n3. the ___ of the folder\n4. the name of the ___",
    "answer": [["protocol"], ["domain"], ["pathname", "path"], ["file"]],
    "explain": "*URL is a four-part addressing scheme*: protocol, domain name, pathname of the folder or directory, file name. In `http://www.example.com/category/subcategory/index.html` those are `http`, `www.example.com`, `/category/subcategory/` and `index.html`."
  },
  {
    "q": "Which statement about `id` and `class` is true?",
    "options": [
      "An `id` value must be unique in the page; a `class` value may be shared by many elements",
      "A `class` value must be unique in the page; an `id` may repeat",
      "Both must be unique",
      "Only `<div>` elements may have an `id`"
    ],
    "answer": 0,
    "explain": "Slide 75: the id's *value has to be unique*. Slide 76: the class's *value dose not have to be unique*. Both are global attributes, so any element can have them."
  }
]
```

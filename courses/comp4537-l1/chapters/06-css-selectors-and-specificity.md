---
title: Inline, internal and external styles, selectors and specificity
minutes: 17
---

Twenty `style` attributes are twenty places to change. CSS rules written once and aimed with selectors fix that; when two rules aim at one element, the browser must pick one.

<!-- facts: slides 58-61, 67-70, 78, 80-87, 170-175, 185-186 -->

## style is a global attribute (slides 58 to 61)

Slide 59 gives two ways `style` differs from attributes such as `href` and `src`:

1. *"style" is the default attribute of all elements versus "src" which is only the attribute of few elements such as img and video.* *So style is a global attribute.*
2. *The value of the style attribute is not a single scalar number, its an object with various property-value pairs*

Slide 60 colours the page with `<body style="background-color:powderblue;">`. Slide 61 sets two properties at once, separated by semicolons: `style="color:blue;font-family:verdana;"`.

## Three ways of styling (slides 67 to 70 and 170 to 175)

Slide 67 asks how to style a group of elements, or every `<a>`. Slide 68 (and 170) lists three ways:

1. *Styling HTML elements using the style attribute*: **Inline** styling.
2. *Using <style> tags in the <head> section of same HTML file*: **Internal** styling.
3. *Using an external CSS file*: **External** styling.

*CSS stands for Cascading Style Sheets.* It describes *where every element is placed and how it looks*. Slide 70: *In internal method, Style acts as a tag ( an element)*, and *In internal methods all the h1 elements get affected vs in the inline method we need to set the style attribute for every single element separately*.

### One look, written inline and internally (slide 171)

```html run pin inline-vs-internal
<head>
  <style>
    h2 { color: teal; }
    .note { color: darkorange; }
    #hours { font-style: italic; }
  </style>
</head>
<body>
  <h2 style="color: teal;">Clinic notice (inline)</h2>
  <p style="color: darkorange;">Flu shots this week</p>
  <p style="font-style: italic;">Open 9 to 5</p>

  <h2>Clinic notice (internal)</h2>
  <p class="note">Flu shots this week</p>
  <p id="hours">Open 9 to 5</p>
</body>
```

Both halves look the same: the inline half needs `style="color: teal;"` on each element, while `h2 { color: teal; }` is written once.

### An external sheet holds only CSS (slides 173 to 175)

Slide 173: *An external style sheet can be written in any text editor. The file should not contain any html tags. The style sheet file must be saved with a .css extension.* (The callout's "myStyle.cc" means `myStyle.css`.) Slide 174 splits the internal page in two:

```css
/* myStyle.css */
h2 { color: teal; }
.note { color: darkorange; }
#hours { font-style: italic; }
```

```html
<!-- my.html -->
<head>
  <link rel="stylesheet" type="text/css" href="myStyle.css" />
</head>
<body>
  <h2>Clinic notice</h2>
  <p class="note">Flu shots this week</p>
  <p id="hours">Open 9 to 5</p>
</body>
```

```diagram
{ "type": "flow", "title": "Internal to external (slide 174)", "nodes": [ { "id": "css", "label": "myStyle.css", "sub": "the CSS rules" }, { "id": "page", "label": "page with <style>" }, { "id": "html", "label": "my.html", "sub": "<link> + body" } ], "edges": [ { "from": "page", "to": "css", "label": "rules" }, { "from": "page", "to": "html", "label": "body" } ], "hi": ["css"], "caption": "The only difference between internal and external is that in external we need a separate file for CSS contents." }
```

## A rule-set is a selector and a declaration block (slides 78, 80, 87)

Slide 78: *A CSS rule-set consists of a selector and a declaration block*. *The selector points to the HTML element you want to style.* *Each declaration includes a CSS property name : value pair.* *A CSS declaration always ends with a semicolon, and declaration blocks are surrounded by curly braces.* Real CSS lets the last semicolon go; the slide's rule is the safe habit. `12pc` is 12 picas.

```diagram
{ "type": "tree", "title": "A CSS rule-set (slides 78, 80)", "nodes": [ { "id": "rs", "label": "rule-set" }, { "id": "sel", "label": "selector", "sub": "h1", "parent": "rs" }, { "id": "blk", "label": "declaration block", "sub": "{ }", "parent": "rs" }, { "id": "d1", "label": "color: red;", "parent": "blk" }, { "id": "d2", "label": "font-size: 12pc;", "parent": "blk" }, { "id": "n1", "label": "property name", "sub": "color", "parent": "d1" }, { "id": "v1", "label": "value", "sub": "red", "parent": "d1" } ], "hi": ["sel"], "caption": "A CSS rule-set consists of a selector and a declaration block." }
```

Selectors find elements by *element name, id, class, attribute, and more* (slide 80). Comments are `/* … */` (slide 87).

## Element, id and class selectors (slides 81 to 83)

```html run pin element-id-class
<head>
  <style>
    p { color: blue; }
    #featured { text-align: center; }
    .sale { background-color: yellow; }
  </style>
</head>
<body>
  <h3>Bookstore</h3>
  <p id="featured">Book of the week</p>
  <p class="sale">Half price atlases</p>
  <p>New arrivals</p>
</body>
```

`p` matches every paragraph, `#featured` one element, `.sale` every element with that class. Slide 82: *The id of an element should be unique within a page, so the id selector is used to select one unique element!* A duplicate id is *bad practice*; browsers still style both.

## p.myClass and two classes on one element (slides 84, 85)

```html run pin p-dot-class
<head>
  <style>
    p.myClass { color: blue; }
    .center { text-align: center; }
    .large { font-size: 200%; }
  </style>
</head>
<body>
  <h3 class="myClass">Weather today</h3>
  <p class="myClass">Sunny, 21 degrees</p>
  <p class="center large">No rain expected</p>
</body>
```

`p.myClass` selects only a `<p>` with that class, so the `<h3>` stays black. *HTML elements can refer to more than one class*: `class="center large"` gets both rules.

## Grouping selectors with commas (slide 86)

```html run pin grouping
<head>
  <style>
    h1,
    h2,
    p {
      text-align: center;
      color: green;
    }
  </style>
</head>
<body>
  <h1>Recipe</h1>
  <h2>Pancakes</h2>
  <p>Serves four</p>
</body>
```

Three identical rule-sets become one, selectors separated by commas. *Better practice to place selectors underneath each other*, as `h1,` and `h2,` sit here.

## Descendant and child combinators (slide 185)

```html run pin descendant
<head>
  <style>
    div p { background-color: yellow; }
    div > p { color: red; }
  </style>
</head>
<body>
  <div>
    <p>Directly inside the div</p>
    <section>
      <p>Inside a section inside the div</p>
    </section>
  </div>
  <p>Outside the div</p>
</body>
```

`div p` *selects all <p> elements inside <div> elements*, at any depth: both turn yellow. `div > p` matches a direct child only: one turns red. *There are more Combinators such as child selector (>), adjacent sibling selector (+), general sibling selector (~)*.

```diagram
{ "type": "tree", "title": "Descendant vs child", "nodes": [ { "id": "div", "label": "div" }, { "id": "p1", "label": "p", "sub": "child: div p and div > p", "parent": "div" }, { "id": "sec", "label": "section", "parent": "div" }, { "id": "p2", "label": "p", "sub": "descendant: div p only", "parent": "sec" } ], "hi": ["p1"], "caption": "The descendant selector selects all <p> elements inside <div> elements." }
```

## The most specific rule wins (slide 186)

*If there are two or more conflicting CSS rules that point to the same element, the browser follows some rules to determine which one is most specific and therefore wins out.* The slide leaves its question open.

```html run pin specificity
<head>
  <style>
    #myId {background-color: blueviolet;}
    div#myId {background-color: pink;}
    div[id=myId] {background-color: greenyellow;}
  </style>
</head>
<body>
  <div id="myId">This is a div</div>
</body>
```

Run it: pink. Count (ids, classes and attributes, elements), compare left to right. `#myId` and `div#myId` tie on ids; the element `div` breaks the tie. `div[id=myId]` has no id: an attribute counts like a class.

```diagram
{ "type": "grid", "title": "Three rules, one div", "nodes": [ { "id": "h0", "label": "selector", "row": 0, "col": 0 }, { "id": "h1", "label": "ids", "row": 0, "col": 1 }, { "id": "h2", "label": "classes, attrs", "row": 0, "col": 2 }, { "id": "h3", "label": "elements", "row": 0, "col": 3 }, { "id": "h4", "label": "colour", "row": 0, "col": 4 }, { "id": "a0", "label": "#myId", "row": 1, "col": 0 }, { "id": "a1", "label": "1", "row": 1, "col": 1 }, { "id": "a2", "label": "0", "row": 1, "col": 2 }, { "id": "a3", "label": "0", "row": 1, "col": 3 }, { "id": "a4", "label": "blueviolet", "row": 1, "col": 4 }, { "id": "b0", "label": "div#myId", "row": 2, "col": 0 }, { "id": "b1", "label": "1", "row": 2, "col": 1 }, { "id": "b2", "label": "0", "row": 2, "col": 2 }, { "id": "b3", "label": "1", "row": 2, "col": 3 }, { "id": "b4", "label": "pink (wins)", "row": 2, "col": 4 }, { "id": "c0", "label": "div[id=myId]", "row": 3, "col": 0 }, { "id": "c1", "label": "0", "row": 3, "col": 1 }, { "id": "c2", "label": "1", "row": 3, "col": 2 }, { "id": "c3", "label": "1", "row": 3, "col": 3 }, { "id": "c4", "label": "greenyellow", "row": 3, "col": 4 } ], "hi": ["b0", "b1", "b3", "b4"], "caption": "The browser determines which one is most specific and therefore wins out." }
```

### Remove the winner and count again

```widget
specificity-calc
```

Change rule 2 to `span#myId`, which no longer matches, and `#myId` (1, 0, 0) beats `div[id=myId]` (0, 1, 1): one id outweighs any number of classes. Equal counts go to the rule written later.

## Pick the winning rule on a bookstore page

Every rule matches the element; count each selector first.

```quiz
[
  {
    "q": "The element is `<p id=\"promo\" class=\"price\">$12</p>`. Which colour is it?",
    "code": "p.price { color: green; }\n#promo { color: red; }\np { color: gray; }",
    "options": ["red", "green", "gray", "black"],
    "answer": 0,
    "explain": "`p.price` is (0, 1, 1), `#promo` is (1, 0, 0), `p` is (0, 0, 1). Compare ids first: only `#promo` has one, so red wins even though `p.price` has more parts."
  },
  {
    "q": "The element is `<li class=\"new sale\">Atlas</li>` inside `<ul id=\"shelf\">`. Which colour is it?",
    "code": "#shelf li { color: blue; }\nli.new.sale { color: orange; }",
    "options": ["blue", "orange", "black", "both, mixed"],
    "answer": 0,
    "explain": "`#shelf li` is (1, 0, 1); `li.new.sale` is (0, 2, 1). The id column decides first: 1 beats 0, so blue."
  },
  {
    "q": "The element is `<span class=\"tag\">used</span>`. Which colour is it?",
    "code": ".tag { color: purple; }\nspan[class=tag] { color: teal; }",
    "options": ["teal", "purple", "black", "the first rule, because it is written first"],
    "answer": 0,
    "explain": "`.tag` is (0, 1, 0). `span[class=tag]` is (0, 1, 1): the attribute counts like a class, and `span` adds an element. Equal ids, equal classes, more elements: teal."
  },
  {
    "q": "Two rules both read `.note { … }` and set different colours on the same element. Which wins?",
    "options": ["the rule written later", "the rule written first", "neither; the browser shows black", "the one with the shorter value"],
    "answer": 0,
    "explain": "Both are (0, 1, 0), a full tie. A tie goes to the rule that comes later in the source."
  },
  {
    "q": "How many ids, classes and elements does `div#cart p.total` have? Write it as a, b, c.",
    "type": "text",
    "answer": ["1, 1, 2", "1,1,2", "(1, 1, 2)", "(1,1,2)", "1 1 2"],
    "explain": "One id (`#cart`), one class (`.total`), two elements (`div`, `p`): (1, 1, 2)."
  }
]
```

```quiz
[
  {
    "q": "How do you give one paragraph both the `center` and the `large` class?",
    "options": ["`<p class=\"center large\">`", "`<p class=\"center\" class=\"large\">`", "`<p classes=\"center, large\">`", "`<p class=\"center, large\">`"],
    "answer": 0,
    "explain": "Slide 85: *HTML elements can refer to more than one class*, written as space-separated names in one `class` attribute. A second `class` attribute is ignored."
  },
  {
    "q": "This code is an example of which styling method?",
    "code": "<head>\n  <style>\n    li { color: navy; }\n  </style>\n</head>",
    "options": ["Internal", "External", "Inline"],
    "answer": 0,
    "explain": "Slide 68: *Using <style> tags in the <head> section of same HTML file* is **Internal** styling. External would be a separate `.css` file linked with `<link>`; inline would be a `style` attribute on the element."
  },
  {
    "q": "A file `shop.css` contains only `h1 { color: maroon; }` and the page loads it with `<link rel=\"stylesheet\" href=\"shop.css\">`. Which styling method is this?",
    "options": ["External", "Internal", "Inline"],
    "answer": 0,
    "explain": "A separate `.css` file is **External** styling (slide 68). Slide 175: *the only difference between internal and external is that in external we need a separate file for CSS contents*."
  },
  {
    "q": "Which is a correct inline style?",
    "options": ["`<h2 style=\"color:green;\">Menu</h2>`", "`<h2 color=\"green\">Menu</h2>`", "`<h2 style=\"color='green'\">Menu</h2>`", "`<h2 style={color:green}>Menu</h2>`"],
    "answer": 0,
    "explain": "The `style` attribute's value is property-value pairs, `property:value;` (slides 58 and 59). `color` is not an attribute by itself."
  },
  {
    "q": "Which selector picks every `<section>` that has the class `card`, and nothing else?",
    "options": ["`section.card`", "`.card`", "`section > .card`", "`section + .card`"],
    "answer": 0,
    "explain": "As with `p.myClass` on slide 84, `element.class` needs both. `.card` would also match a `<div class=\"card\">`; `>` and `+` are combinators that pick elements inside or after a section."
  },
  {
    "q": "`<div id=\"box\"><p id=\"line\">Hours</p></div>`. Which rule centres the text?",
    "options": ["both work", "`#box { text-align: center; }` only", "`#line { text-align: center; }` only", "neither works"],
    "answer": 0,
    "explain": "`#line` styles the paragraph directly. `#box` sets `text-align` on the div, and the paragraph inside inherits it, so both centre the text."
  },
  {
    "q": "Which tag adds an external style sheet to a page?",
    "options": ["`<link>`", "`<style>`", "`<a>`", "`<script>`"],
    "answer": 0,
    "explain": "Slide 173: `<link rel=\"stylesheet\" type=\"text/css\" href=\"myStyle.css\" />` in `<head>`. `<style>` holds internal CSS."
  },
  {
    "q": "An external style sheet file must contain a `<style>` tag around its rules.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 173: *The file should not contain any html tags.* `<style>` is an HTML tag; the `.css` file holds only rules."
  },
  {
    "q": "Which is the correct way to give `h1`, `h2` and `p` the same rule?",
    "options": ["`h1, h2, p { color: green; }`", "`h1 h2 p { color: green; }`", "`h1 > h2 > p { color: green; }`", "`h1 + h2 + p { color: green; }`"],
    "answer": 0,
    "explain": "Slide 86: grouping selectors, *separate each selector with a comma*. A space is the descendant combinator; `>` and `+` are other combinators (slide 185)."
  },
  {
    "q": "A CSS declaration always ends with a semicolon, and declaration blocks are surrounded by curly braces.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 78's sentence word for word. In real CSS the last semicolon in a block may be left out, but the slide's rule is the one to give."
  }
]
```

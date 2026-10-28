---
title: Content, padding, border, margin; display, position and units
minutes: 16
---

A box with `width: 300px` can take 420 pixels of the page. Layout questions come down to what is around the content, whether an element starts a new line, and where it is placed.

<!-- facts: slides 63-66, 177-184, 187-188 -->

## Colours by name, RGB, HEX and alpha (slides 63 to 66)

Slide 63 shows predefined names such as Orange, Tomato, DodgerBlue and Gray, and asks how many there are; the w3schools page it links lists 140 standard names (worked out, not on the slide). Slide 64 names five value forms: *RGB, HEX, HSL, RGBA, HSLA*. In `rgb(255, 99, 71)` each part runs *Red 0 to 255*, green and blue the same. The alpha in `rgba` runs *0 to 1*: *1: Opaque*, *0.5: 50% Opaque*, *0: Transparent*. The slide's "What's this?" is the same Tomato in hexadecimal: ff = 255, 63 = 99, 47 = 71.

```diagram
{ "type": "grid", "title": "Tomato three ways (slide 64)", "nodes": [ { "id": "h0", "label": "form", "row": 0, "col": 0 }, { "id": "h1", "label": "value", "row": 0, "col": 1 }, { "id": "h2", "label": "parts", "row": 0, "col": 2 }, { "id": "a0", "label": "RGB", "row": 1, "col": 0 }, { "id": "a1", "label": "rgb(255, 99, 71)", "row": 1, "col": 1 }, { "id": "a2", "label": "Red, Green, Blue 0 to 255", "row": 1, "col": 2 }, { "id": "b0", "label": "HEX", "row": 2, "col": 0 }, { "id": "b1", "label": "#ff6347", "row": 2, "col": 1 }, { "id": "b2", "label": "ff=255 63=99 47=71", "row": 2, "col": 2 }, { "id": "c0", "label": "RGBA", "row": 3, "col": 0 }, { "id": "c1", "label": "rgba(255, 99, 71, 0.5)", "row": 3, "col": 1 }, { "id": "c2", "label": "Alpha 0 to 1", "row": 3, "col": 2 } ], "hi": ["b1"], "caption": "Same as color name \"Tomato\"; the last one 50% transparent." }
```

```html run pin colours
<h1 style="background-color:Tomato;">Weather</h1>
<h1 style="background-color:rgb(255, 99, 71);">Weather</h1>
<h1 style="background-color:#ff6347;">Weather</h1>
<h1 style="background-color:rgba(255, 99, 71, 0.5);">Weather</h1>
<p style="color:#e6f;font-size:300%;text-align:center;">Sunny</p>
<p style="border:2px solid DodgerBlue;">Wind 10 km/h</p>
```

The first three headings match; `rgba(255, 99, 71, 0.5)` is paler. `#e6f` is shorthand hex for `#ee66ff`. Slide 65 adds `font-size:300%` and the `text-align` values *center , Left, right, justify*; slide 66 draws `border:2px solid DodgerBlue`.

## Every element is a box of four parts (slides 177 to 179)

*All HTML elements can be considered as boxes.* From the inside out:

- *Content - The content of the box, where text and images appear*
- *Padding - Clears an area around the content. The padding is transparent*
- *Border - A border that goes around the padding and content*
- *Margin - Clears an area outside the border. The margin is transparent*

```diagram
{ "type": "layers", "title": "The CSS box model (slide 179)", "nodes": [ { "id": "m", "label": "Margin" }, { "id": "b", "label": "Border", "parent": "m" }, { "id": "p", "label": "Padding", "parent": "b" }, { "id": "c", "label": "Content", "parent": "p" } ], "caption": "All HTML elements can be considered as boxes." }
```

```html run pin box-model
<head>
  <style>
    #div2 {
      background-color: lightgrey;
      width: 300px;
      margin: 30px;
      border: 10px solid blue;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div>Heavy rain warning until 6 pm.</div>
  <div id="div2">Heavy rain warning until 6 pm.</div>
</body>
```

`width: 300px` sets the content only. Worked out: the visible box is 300 + 2 × 20 padding + 2 × 10 border = 360 px, and `margin: 30px` on both sides makes the element take 420 px of the row.

```diagram
{ "type": "layers", "title": "The two transparent parts", "nodes": [ { "id": "m", "label": "Margin", "sub": "transparent" }, { "id": "b", "label": "Border", "parent": "m" }, { "id": "p", "label": "Padding", "sub": "transparent", "parent": "b" }, { "id": "c", "label": "Content", "parent": "p" } ], "hi": ["m", "p"], "caption": "Padding clears an area around the content; margin clears an area outside the border. Both are transparent." }
```

### Total width as padding grows

```widget
css-box
{ "padding": 20, "border": 10, "margin": 30, "width": 300, "height": 60 }
```

These are slide 178's numbers. Each pixel of padding, border or margin adds two to the total, one per side.

## Block starts a new line, inline does not (slide 180)

*A block-level element always starts on a new line and takes up the full width available*. Block by default: `<div>`, `<h1>`–`<h6>`, `<p>`, `<form>`, `<header>`, `<footer>`, `<section>`. *An inline element does not start on a new line and only takes up as much width as necessary.* Inline by default: `<span>`, `<a>`, `<img>`. The slide lists `none` as a third default; only elements such as `<head>` and `<script>` have it.

```html run pin block-and-inline
<style>
  div, p, span, a { border: 1px solid green; }
</style>
<div>A div: block</div>
<p>A paragraph with <span>a span</span> and <a href="#">a link</a> inside.</p>
```

Every element gets `border: 1px solid green`. The `<div>A div: block</div>` border stretches the full width, as does the paragraph's; `<span>a span</span>` and the link hug their words.

## display: none and visibility: hidden (slides 181, 182)

*"display: none" is used to remove elements from screen without deleting them.* *visibility:hidden; also hides an element. However, the element will still take up the same space as before.* *In both cases the element will not be removed from DOM tree*. The slide's opposite of hidden, "visibility:show", is not a CSS value; the real one is `visible`.

```html run pin none-vs-hidden
<style>
  span { border: 1px solid; padding: 4px; }
</style>
<p><span>Mon</span> <span style="display: none;">Tue</span> <span>Wed</span></p>
<p><span>Mon</span> <span style="visibility: hidden;">Tue</span> <span>Wed</span></p>
```

With `display: none;` Wed moves up beside Mon; with `visibility: hidden;` a Tue-sized gap stays.

```diagram
{ "type": "grid", "title": "display: none vs visibility: hidden", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "visible", "row": 0, "col": 1 }, { "id": "h2", "label": "takes space", "row": 0, "col": 2 }, { "id": "h3", "label": "in DOM tree", "row": 0, "col": 3 }, { "id": "a0", "label": "display: none", "row": 1, "col": 0 }, { "id": "a1", "label": "no", "row": 1, "col": 1 }, { "id": "a2", "label": "no", "row": 1, "col": 2 }, { "id": "a3", "label": "yes", "row": 1, "col": 3 }, { "id": "b0", "label": "visibility: hidden", "row": 2, "col": 0 }, { "id": "b1", "label": "no", "row": 2, "col": 1 }, { "id": "b2", "label": "yes", "row": 2, "col": 2 }, { "id": "b3", "label": "yes", "row": 2, "col": 3 } ], "hi": ["a2", "b2"], "caption": "In both cases the element will not be removed from DOM tree." }
```

## position: static is the default, fixed follows the window (slides 183, 184)

Slide 183 lists the layout properties tried in the lab: *width and max-width*, *position*, *overflow*, *float and clear*, *Horizontal & Vertical Align*. It asks how one line can change a whole site's look; worked out: point the `<link href>` at a different `.css` file.

Slide 184's values are *static, relative, absolute, fixed, or sticky*. *static: Default value. Elements render in order, as they appear in the document flow*. *fixed: The element is positioned relative to the browser window*. Its example, `style="left:20px ; position: absolute;"`, uses a value it does not define: absolute places the element relative to its nearest positioned ancestor.

### display, visibility and position on small boxes

```widget
css-box
{ "padding": 10, "border": 2, "margin": 20 }
```

Hide the middle box both ways, then scroll the frame with the small box fixed and then static.

## Absolute and relative units (slides 187, 188)

*Absolute length units are not recommended for use on screen*: *They are mostly used for print layouts*. `em` and `%` scale instead.

```diagram
{ "type": "grid", "title": "Units", "nodes": [ { "id": "h0", "label": "unit", "row": 0, "col": 0 }, { "id": "h1", "label": "kind", "row": 0, "col": 1 }, { "id": "h2", "label": "relative to", "row": 0, "col": 2 }, { "id": "h3", "label": "used for", "row": 0, "col": 3 }, { "id": "a0", "label": "cm", "row": 1, "col": 0 }, { "id": "a1", "label": "absolute", "row": 1, "col": 1 }, { "id": "a2", "label": "", "row": 1, "col": 2 }, { "id": "a3", "label": "printers", "row": 1, "col": 3 }, { "id": "b0", "label": "px", "row": 2, "col": 0 }, { "id": "b1", "label": "absolute", "row": 2, "col": 1 }, { "id": "b2", "label": "device pixels", "row": 2, "col": 2 }, { "id": "b3", "label": "screens", "row": 2, "col": 3 }, { "id": "c0", "label": "pt", "row": 3, "col": 0 }, { "id": "c1", "label": "absolute", "row": 3, "col": 1 }, { "id": "c2", "label": "1/72 inch", "row": 3, "col": 2 }, { "id": "c3", "label": "print", "row": 3, "col": 3 }, { "id": "d0", "label": "em", "row": 4, "col": 0 }, { "id": "d1", "label": "relative", "row": 4, "col": 1 }, { "id": "d2", "label": "element font-size", "row": 4, "col": 2 }, { "id": "d3", "label": "2em = 2x font", "row": 4, "col": 3 }, { "id": "e0", "label": "%", "row": 5, "col": 0 }, { "id": "e1", "label": "relative", "row": 5, "col": 1 }, { "id": "e2", "label": "parent element", "row": 5, "col": 2 }, { "id": "e3", "label": "layouts", "row": 5, "col": 3 } ], "hi": ["d0", "e0"], "caption": "em: relative to the font-size of the element; %: relative to parent element." }
```

On a low-dpi monitor *1px is one device pixel*; on printers and high-resolution screens it covers several. *One point is equal to 1/72 of an inch.* The slide's note that "em" is the width of a capital M is the name's history; CSS measures it as the element's font-size.

## Size three more boxes

Add both sides of padding, border and margin to the content width.

```quiz
[
  {
    "q": "A notice has `width: 200px; padding: 15px; border: 5px solid red;` and no margin. How wide is the visible box, in px?",
    "type": "numeric",
    "answer": 240,
    "tolerance": 0,
    "unit": "px",
    "explain": "200 + 2 × 15 + 2 × 5 = 200 + 30 + 10 = 240 px."
  },
  {
    "q": "A card has `width: 250px; padding: 10px; border: 3px solid; margin: 12px;`. How much horizontal space does it take, margins included, in px?",
    "type": "numeric",
    "answer": 300,
    "tolerance": 0,
    "unit": "px",
    "explain": "250 + 2 × 10 + 2 × 3 + 2 × 12 = 250 + 20 + 6 + 24 = 300 px."
  },
  {
    "q": "A banner takes 500 px of space in all. It has `padding: 20px; border: 5px solid; margin: 25px;`. What is its `width` (the content), in px?",
    "type": "numeric",
    "answer": 400,
    "tolerance": 0,
    "unit": "px",
    "explain": "The extras are 2 × 20 + 2 × 5 + 2 × 25 = 40 + 10 + 50 = 100 px, so the content is 500 − 100 = 400 px."
  },
  {
    "q": "On the 240 px notice above, the padding goes from 15px to 25px. By how many px does the visible box grow?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "unit": "px",
    "explain": "Padding is on both sides: 2 × (25 − 15) = 20 px, so the box becomes 260 px."
  }
]
```

```quiz
[
  {
    "q": "Put the parts of the CSS box model in order from the inside out.",
    "type": "reorder",
    "lines": ["content", "padding", "border", "margin"],
    "explain": "Slide 177: content is where text and images appear; padding clears an area around the content; the border goes around the padding and content; the margin clears an area outside the border."
  },
  {
    "q": "The margin is transparent.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 177: *Margin - Clears an area outside the border. The margin is transparent*. The padding is transparent too."
  },
  {
    "q": "`visibility:hidden` removes the element from the DOM tree.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 182: *In both cases the element will not be removed from DOM tree*. `visibility:hidden` hides it and keeps its space; `display: none` hides it and frees the space."
  },
  {
    "q": "Which `position` value places the element relative to the browser window?",
    "options": ["fixed", "static", "relative", "sticky"],
    "answer": 0,
    "explain": "Slide 184: *fixed: The element is positioned relative to the browser window*. `static` is the default and follows the document flow."
  },
  {
    "q": "Which of these is a block-level element by default?",
    "options": ["`<section>`", "`<span>`", "`<a>`", "`<img>`"],
    "answer": 0,
    "explain": "Slide 180 lists `<div>`, `<h1>`–`<h6>`, `<p>`, `<form>`, `<header>`, `<footer>`, `<section>` as block. `<span>`, `<a>` and `<img>` are inline."
  },
  {
    "q": "Which of these widths is invalid CSS?",
    "options": ["all are valid", "`width: 80px;`", "`width: 80%;`", "`width: 8em;`"],
    "answer": 0,
    "explain": "px is an absolute unit; % (relative to the parent element) and em (relative to the element's font-size) are relative units (slides 187 and 188). All three are valid."
  },
  {
    "q": "Which colour values are valid CSS?",
    "options": ["all four", "only `rgb(0, 128, 0)` and `#008000`", "only the named colour", "only `#008000`"],
    "code": "color: green;\ncolor: rgb(0, 128, 0);\ncolor: rgba(0, 128, 0, 0.3);\ncolor: #0a0;",
    "answer": 0,
    "explain": "Named colours, RGB, RGBA and HEX are all on slides 63 and 64; `#0a0` is shorthand hex for `#00aa00`."
  },
  {
    "q": "What is the CSS keyword that undoes `visibility: hidden`?",
    "type": "text",
    "answer": ["visible", "visibility: visible", "visibility:visible"],
    "explain": "Slide 182 writes \"visibility:show\", which is not a CSS value. The opposite of `hidden` is `visible`."
  },
  {
    "q": "One point is equal to 1/72 of an inch.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 187, on `pt`: *One point is equal to 1/72 of an inch.* Points are used in print media."
  }
]
```

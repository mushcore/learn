---
title: Why API servers exist, the online movie store
minutes: 14
---

A web server answers browsers with pages made for people to look at. Slide 18 asks *Why do we need API servers?*, and the answer is what goes wrong when a program, not a person, needs the data inside those pages.

<!-- facts: slide 18 question; slide 19 HTML pages, ctrl+u; slide 20 monolithic figure and callouts; slides 21-22 movie store, two choices, 100,000 titles; slide 23 screen scraping, og:title; slide 24 page change; slide 25 two services; slide 26 OMDb call and JSON vs IMDb page; slide 27 Fedex, Canada Post; slide 28 API definition and documentation; slide 29 Facebook, IMDb, Canada Post services -->

## A web server returns HTML pages (slides 19 and 20)

Ask a web server for `www.who.int/index.html` or `https://wordpress.com/index.php` and *they return HTML pages and their JavaScript and CSS*. *Press ctrl+u to see it for yourself*: the page source is markup, styles and scripts wrapped around the content.

Slide 20 draws *The architecture of small web applications (monolithic )*:

```diagram
{ "type": "sequence", "title": "The architecture of small web applications (monolithic)", "nodes": [ { "id": "b", "label": "browser", "kind": "lane" }, { "id": "w", "label": "Web server", "sub": "Node js files / HTML pages", "kind": "lane" }, { "id": "f", "label": "File server", "kind": "lane" }, { "id": "d", "label": "DB server", "kind": "lane" } ], "edges": [ { "from": "b", "to": "w", "label": "request" }, { "from": "w", "to": "f", "label": "files" }, { "from": "w", "to": "d", "label": "data" }, { "from": "w", "to": "b", "label": "rendered HTML pages" } ], "hi": ["4"], "caption": "Browser sends request to server; the server runs server side (Node/PHP/Python/ASP) script to access data/files etc, and returns results back as rendered HTML pages." }
```

The orange callout on the slide points at the rendered pages: *..and that is exactly the problem. They returned result in HTML pages.*

## The online movie store (slides 21 and 22)

*You want to launch an online Movie store*. *You need a database of all existing movies.*, about 100,000 titles, and there are two choices: *1- Create your own database which takes years!* or *2- or getting from websites like IMDB.com* which already have it.

## Challenge 1, screen scraping (slide 23)

*IMDB does not offer you any data format other than HTML which contains CSS, Tags etc.* The store needs only titles, actors and dates, so its code must dig them out of the markup. That is *Screen Scraping*. The slide boxes one value in IMDb's page source:

```html
<meta property='og:title' content="Star Wars: The Force Awakens (2015)" />
<meta property='og:site_name' content='IMDb' />
<meta name="title" content="Star Wars: The Force Awakens (2015) - IMDb" />
```

## Challenge 2, the page changes (slide 24)

*IMDb decided to change the look of their pages!* *As a result your code which was written for that particular HTML will no longer work!*

```diagram
{ "type": "flow", "title": "Challenge 2: the page changes", "nodes": [ { "id": "s", "label": "Online movie streaming store" }, { "id": "i", "label": "IMDb" }, { "id": "n", "label": "your HTML scraper can no longer find movie title in same location", "kind": "note" } ], "edges": [ { "from": "s", "to": "i", "label": "URL of that page" }, { "from": "i", "to": "n", "label": "✗ HTML of that page", "dashed": true } ], "hi": ["n"], "caption": "The reply is HTML of that page: <Tags>, CSS, <Script>, <Meta> …, and its layout is not the store's to control." }
```

### A scraper breaks when the markup moves

A program written for this lesson to act out slides 23 to 25, not from the slide: a bookstore scrapes a title from a book page, the page's attribute order changes, then the same title comes from an API's JSON.

```js run pin scraping vs parsing
// predict: Write the three lines printed.
const marker = 'og:title" content="';
function scrapeTitle(html) {
  const start = html.indexOf(marker) + marker.length;
  return html.slice(start, html.indexOf('"', start));
}

const pageBefore = '<meta property="og:title" content="Dune (1965)" />';
const pageAfter = '<meta content="Dune (1965)" property="og:title" />';
console.log(scrapeTitle(pageBefore));
console.log(scrapeTitle(pageAfter));

const apiReply = '{"Title":"Dune","Year":"1965","Author":"Frank Herbert"}';
console.log(JSON.parse(apiReply).Title);
```

```output
Dune (1965)
e (1965)
Dune
```

`scrapeTitle` depends on the text right before the title. After the redesign `indexOf` finds nothing and returns -1, so `slice` cuts from the wrong place and prints a fragment with no error. `JSON.parse` reads a named field, so the markup around the data never matters.

## The solution, two services and two URLs (slides 25 and 26)

*IMDb provides two services ( two URLs)*:

1. *For browsers and users.* *Returns HTML pages*; *Returning result can change any time IMDb developer update the website*. This is the **web server**.
2. *For data concumer applications* (sic). *Returns Json/XML*; *The rule of thumb is OMDb does not change what this url return*. This is the **API server**.

```diagram
{ "type": "grid", "title": "IMDb provides two services (two URLs)", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "Web server", "row": 0, "col": 1 }, { "id": "h2", "label": "API server", "row": 0, "col": 2 }, { "id": "a0", "label": "for", "row": 1, "col": 0 }, { "id": "a1", "label": "browsers and users", "row": 1, "col": 1 }, { "id": "a2", "label": "data consumer applications", "row": 1, "col": 2 }, { "id": "b0", "label": "URL", "row": 2, "col": 0 }, { "id": "b1", "label": "imdb.com/title/tt2488496", "row": 2, "col": 1 }, { "id": "b2", "label": "omdbapi.com/?t=star+wars&y=2015", "row": 2, "col": 2 }, { "id": "c0", "label": "returns", "row": 3, "col": 0 }, { "id": "c1", "label": "HTML pages", "row": 3, "col": 1 }, { "id": "c2", "label": "Json/XML", "row": 3, "col": 2 }, { "id": "d0", "label": "changes?", "row": 4, "col": 0 }, { "id": "d1", "label": "any time the website is updated", "row": 4, "col": 1 }, { "id": "d2", "label": "does not change what this url returns", "row": 4, "col": 2 } ], "hi": ["c2", "d2"], "caption": "One service per audience: HTML for people, JSON or XML that stays the same for programs." }
```

The promise that the URL's output stays the same is a contract: a program can be written against it once. Slide 26 sets the two replies side by side. The call `http://www.omdbapi.com/?t=star+wars&y=2015&apikey=1668f32d` returns *What API server returns (JSON)*:

```json
{
  "Title": "Star Wars: The Force Awakens",
  "Year": "2015",
  "Rated": "PG-13",
  "Released": "18 Dec 2015",
  "Runtime": "136 min",
  "Genre": "Action, Adventure, Fantasy",
  "Director": "J.J. Abrams",
  "Language": "English"
}
```

`https://www.imdb.com/title/tt2488496` returns *What web server returns ( HTML page)*, the page source shown above. The slide presents OMDb as IMDb's own API side; in fact omdbapi.com is an independent service.

## An API is the documented way in (slide 28)

API stands for *Application Programming Interface*: *A user interface to access partners' data and services*. *In web development, Web API often refers to the way by which we retrieve information from an online service.* Its **API documentation** is the *list of URLs, query parameters etc on how to make a request* and tells *what sort of response will be received for each query ( json, text file, xml etc)*.

## Partners' APIs as microservices (slides 27 and 29)

With APIs the store can *let your users to track their orders inside your website by partnering with Fedex or Canada post*, *In case someone needed physical DVD*.

```diagram
{ "type": "tree", "title": "API and Microservices (slide 27)", "nodes": [ { "id": "s", "label": "Online Movie Store" }, { "id": "i", "label": "IMDb", "sub": "API", "parent": "s" }, { "id": "c", "label": "Canada Post", "sub": "API: In case someone needed physical DVD", "parent": "s" } ], "hi": ["i", "c"], "caption": "Slide 27: the store reaches IMDb and Canada Post through their APIs." }
```

Slide 29 adds Facebook, so visitors can buy a movie with their Facebook account. Each partner is one service the store calls by API.

```diagram
{ "type": "tree", "title": "API and Microservices (slide 29)", "nodes": [ { "id": "s", "label": "Online Movie Store", "sub": "Multiple microservices: UI, user management" }, { "id": "f", "label": "Facebook", "sub": "Authentication service", "parent": "s" }, { "id": "i", "label": "IMDb", "sub": "Storage service", "parent": "s" }, { "id": "c", "label": "Canada Post", "sub": "Shipment tracking service", "parent": "s" } ], "hi": ["f", "i", "c"], "caption": "Slide 29: every link is an API call, and each partner provides one service." }
```

```quiz
[
  { "q": "According to slide 19, what does a web server send back for a request such as `https://wordpress.com/index.php`?", "options": ["HTML pages and their JavaScript and CSS", "The PHP source code", "JSON data only", "An XML document describing the page"], "answer": 0, "explain": "Slide 19: *they return HTML pages and their JavaScript and CSS*. The PHP runs on the server; the browser receives its HTML output, which ctrl+u shows." },
  { "q": "In slide 25's solution, the API server's output can change any time the developers update the website.", "type": "tf", "answer": false, "explain": "That describes the web server for browsers and users. For the API server: *The rule of thumb is OMDb does not change what this url return*, and it *Returns Json/XML*." },
  { "q": "Name the technique of searching a page's HTML for the actor names, dates and titles you need.", "type": "text", "answer": ["screen scraping", "scraping", "html scraping"], "explain": "Slide 23: extracting what you need from the HTML is *Screen Scraping*." },
  { "q": "Match each partner on slide 29 to the service it provides the movie store.", "type": "match", "pairs": [["Facebook", "Authentication service"], ["IMDb", "Storage service"], ["Canada Post", "Shipment tracking service"]], "explain": "Slide 29's callouts. The store itself is *Multiple microservices: UI, user management*." },
  { "q": "According to slide 28, what does API documentation give you?", "options": ["The list of URLs and query parameters for a request, and the kind of response each returns", "The server's source code", "The HTML layout of the site's pages", "The database tables behind the service"], "answer": 0, "explain": "Slide 28: the *list of URLs, query parameters etc on how to make a request*, and *what sort of response will be received for each query ( json, text file, xml etc)*." },
  { "q": "Which is challenge 2 of the movie store on slide 24?", "options": ["IMDb changes the look of its pages, so code written for that HTML no longer works", "IMDb offers no data format other than HTML", "Building your own movie database takes years", "IMDb charges for each request"], "answer": 0, "explain": "Challenge 2: *IMDb decided to change the look of their pages!* Having only HTML is challenge 1 (slide 23); building your own database is the rejected choice on slide 22." },
  { "q": "What does the API server return in slide 25's picture?", "options": ["Json/XML", "HTML pages", "Rendered HTML with CSS", "Screenshots of the page"], "answer": 0, "explain": "*2- For data concumer applications* (sic): *Returns Json/XML*. HTML pages come from the web server for browsers and users." },
  { "type": "free", "q": "Why does a data-consuming application call an API server instead of the web server?", "model": "The web server returns HTML pages with tags, CSS and scripts, so a program must screen-scrape them to find the data, and the pages can change any time the site is updated, which breaks the scraper. The API server returns only the data as JSON/XML and does not change what its URL returns, a contract the program can rely on. Its documentation lists the URLs, query parameters and the response type.", "points": ["HTML carries tags, CSS and scripts the program must scrape", "the page can change and break the scraper", "the API returns JSON/XML", "the API's output stays the same (a contract)", "documentation lists URLs, parameters and response type"], "rows": 5, "explain": "Slides 23 to 25 and 28: the two challenges, the two-services solution and what documentation provides." }
]
```

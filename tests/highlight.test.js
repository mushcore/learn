import { test, expect } from "bun:test";
import { highlight, highlightLines } from "../app/highlight.js";

test("js keywords, template literal, comment", () => {
  const h = highlight("js", "const a = `hi ${x}`; // note\nawait fetch(url);");
  expect(h).toContain('<span class="tok-kw">const</span>');
  expect(h).toContain('tok-str">`hi ${x}`');
  expect(h).toContain('tok-com">// note');
  expect(h).toContain('<span class="tok-kw">await</span>');
});

test("html tags, attributes, embedded script", () => {
  const h = highlight("html", '<p id="demo">Hi</p><script>let a = 1;</script>');
  expect(h).toContain('tok-tag">p');
  expect(h).toContain('tok-attr">id');
  expect(h).toContain('<span class="tok-kw">let</span>');
});

test("sql case-insensitive keywords, css property", () => {
  expect(highlight("sql", "SeLeCt * from patient where name = 'a'")).toContain('tok-kw">SeLeCt');
  expect(highlight("css", "p.note { color: red; }")).toContain('tok-attr">color');
});

test("escapes html in every language", () => {
  for (const l of ["js", "html", "css", "sql", "json"]) expect(highlight(l, "<&>")).not.toContain("<&>");
});

test("javascript and node alias js; json keys and literals", () => {
  expect(highlight("node", "const x = 1;")).toContain('tok-kw">const');
  expect(highlight("javascript", "let y;")).toContain('tok-kw">let');
  const j = highlight("json", '{"a": 1, "b": true}');
  expect(j).toContain('tok-attr">&quot;a&quot;'.replace(/&quot;/g, '"'));
  expect(j).toContain('tok-kw">true');
});

test("highlightLines keeps a multi-line template literal coloured on every line", () => {
  const lines = highlightLines("js", "const s = `a\nb`;\nlet z;");
  expect(lines.length).toBe(3);
  expect(lines[1]).toContain('tok-str">b`');
  expect(lines[2]).toContain('tok-kw">let');
});

test("highlightLines colours script bodies inside html on their own lines", () => {
  const lines = highlightLines("html", "<script>\nconst a = 1;\n</script>");
  expect(lines[1]).toContain('tok-kw">const');
});

test("cpp stays line by line", () => {
  expect(highlightLines("cpp", "int a;\nreturn a;")[1]).toContain('tok-kw">return');
});

test("strings and comments right after punctuation are coloured (no runaway template)", () => {
  expect(highlight("js", 'console.log("hi there");')).toContain('tok-str">"hi there"');
  const lines = highlightLines("js", "console.log(`a b`);\nlet x = 1;\nconst y = `z`;");
  expect(lines[0]).toContain('tok-str">`a b`');
  expect(lines[1]).toContain('tok-kw">let');
  expect(lines[2]).toContain('tok-str">`z`');
  expect(highlight("js", "x = 1;// c")).toContain('tok-com">// c');
  expect(highlight("js", "a = b / 2;")).toContain('tok-num">2');
  expect(highlight("css", "p{color:red;}/* note */")).toContain('tok-com">/* note */');
  expect(highlight("sql", "WHERE name=('Ann');-- why")).toContain("tok-str\">'Ann'");
  expect(highlight("sql", "WHERE name=('Ann');-- why")).toContain('tok-com">-- why');
});

// Small regex-based highlighters for C++ and R. Strings/comments are matched
// first so keywords inside them are not recolored.

const CPP_KW = new Set([
  "int", "float", "double", "char", "bool", "void", "long", "short", "unsigned", "signed",
  "const", "constexpr", "static", "return", "if", "else", "for", "while", "do", "switch",
  "case", "default", "break", "continue", "class", "struct", "public", "private", "protected",
  "namespace", "using", "auto", "true", "false", "new", "delete", "sizeof", "template",
  "typename", "enum", "virtual", "override", "nullptr", "this", "operator", "friend",
  "explicit", "try", "catch", "throw", "inline", "mutable", "typedef", "union", "goto",
]);
const CPP_TYPES = new Set([
  "std", "string", "vector", "cout", "cin", "endl", "cerr", "size_t", "istream", "ostream",
  "streamsize", "numeric_limits", "ios_base", "setw", "setprecision", "setfill", "boolalpha",
  "hex", "dec", "oct", "fixed", "scientific", "showpos", "showbase", "uppercase", "left",
  "right", "internal", "showpoint", "fstream", "ifstream", "ofstream", "istringstream", "ostringstream",
  "stringstream", "getline", "ios", "streambuf", "nothrow", "iostream", "sstream", "iomanip",
]);
const R_KW = new Set(["if", "else", "for", "while", "function", "return", "TRUE", "FALSE", "NULL", "NA", "in", "library", "data"]);

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const CPP_RE = /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(^[ \t]*#\s*\w+)|(\b\d+\.?\d*(?:e[+-]?\d+)?[fFuUlL]*\b)|(\b[A-Za-z_]\w*\b)|([^\s\w]+)|(\s+)/gm;

export function highlightCpp(code) {
  const out = [];
  let m;
  CPP_RE.lastIndex = 0;
  while ((m = CPP_RE.exec(code))) {
    const [full, comment, block, str, chr, pp, num, word] = m;
    if (comment || block) out.push(`<span class="tok-com">${esc(full)}</span>`);
    else if (str || chr) out.push(`<span class="tok-str">${esc(full)}</span>`);
    else if (pp) out.push(`<span class="tok-pp">${esc(full)}</span>`);
    else if (num) out.push(`<span class="tok-num">${esc(full)}</span>`);
    else if (word) {
      if (CPP_KW.has(word)) out.push(`<span class="tok-kw">${esc(full)}</span>`);
      else if (CPP_TYPES.has(word)) out.push(`<span class="tok-type">${esc(full)}</span>`);
      else out.push(esc(full));
    } else out.push(esc(full));
  }
  return out.join("");
}

const R_RE = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(\b\d+\.?\d*(?:e[+-]?\d+)?\b)|(\b[A-Za-z_.][\w.]*\b)|([^\s\w]+)|(\s+)/g;

export function highlightR(code) {
  const out = [];
  let m;
  R_RE.lastIndex = 0;
  while ((m = R_RE.exec(code))) {
    const [full, comment, str, chr, num, word] = m;
    if (comment) out.push(`<span class="tok-com">${esc(full)}</span>`);
    else if (str || chr) out.push(`<span class="tok-str">${esc(full)}</span>`);
    else if (num) out.push(`<span class="tok-num">${esc(full)}</span>`);
    else if (word) out.push(R_KW.has(word) ? `<span class="tok-kw">${esc(full)}</span>` : esc(full));
    else out.push(esc(full));
  }
  return out.join("");
}

const PSEUDO_KW = new Set([
  "Algorithm", "Algo", "ALGORITHM", "for", "to", "downto", "do", "while", "if", "then", "else", "endif", "endfor",
  "endwhile", "end-if", "end-while", "end-for", "end-if-else", "end-do", "return", "END", "End", "new", "and", "or", "not",
  "true", "false", "repeat", "until", "Input", "Output",
]);
const PSEUDO_RE = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*")|(\b\d+\.?\d*\b)|(\b[A-Za-z_]\w*(?:-[A-Za-z]+)*\b)|([^\s\w]+)|(\s+)/g;

/** Pseudocode (COMP 3760): keywords in the instructor's dialect, numbers, `//` comments. */
export function highlightPseudo(code) {
  const out = [];
  let m;
  PSEUDO_RE.lastIndex = 0;
  while ((m = PSEUDO_RE.exec(code))) {
    const [full, comment, str, num, word] = m;
    if (comment) out.push(`<span class="tok-com">${esc(full)}</span>`);
    else if (str) out.push(`<span class="tok-str">${esc(full)}</span>`);
    else if (num) out.push(`<span class="tok-num">${esc(full)}</span>`);
    else if (word) out.push(PSEUDO_KW.has(word) ? `<span class="tok-kw">${esc(full)}</span>` : esc(full));
    else out.push(esc(full));
  }
  return out.join("");
}

// ---- Web languages (COMP 4537): js, html, css, sql, json ----------------------------------
// These tokenizers return flat [class, text] pairs so that a whole program can be highlighted
// at once and then split into lines (template literals, block comments and <script> bodies
// span lines; the editor and pinned listings render one row per line).

const JS_KW = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "switch", "case",
  "break", "continue", "new", "this", "class", "extends", "super", "import", "export", "default",
  "try", "catch", "finally", "throw", "typeof", "instanceof", "in", "of", "async", "await", "yield",
  "delete", "void", "true", "false", "null", "undefined",
]);
const JS_TYPES = new Set([
  "console", "document", "window", "JSON", "Promise", "Math", "Date", "Object", "Array", "String",
  "Number", "setTimeout", "setInterval", "XMLHttpRequest", "fetch", "localStorage", "sessionStorage",
  "require", "module", "exports", "http", "fs", "url", "mysql", "res", "req",
]);
const JS_RE = /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(`(?:[^`\\]|\\[\s\S])*`)|(\b\d+\.?\d*(?:e[+-]?\d+)?\b)|([A-Za-z_$][\w$]*)|([^\s\w$"'`\/]+|\/)|(\s+)/g;

function tokJs(code) {
  const out = [];
  let m;
  JS_RE.lastIndex = 0;
  while ((m = JS_RE.exec(code))) {
    const [full, line, block, dq, sq, tpl, num, word] = m;
    if (line || block) out.push(["tok-com", full]);
    else if (dq || sq || tpl) out.push(["tok-str", full]);
    else if (num) out.push(["tok-num", full]);
    else if (word) out.push([JS_KW.has(word) ? "tok-kw" : JS_TYPES.has(word) ? "tok-type" : "", full]);
    else out.push(["", full]);
  }
  return out;
}

const CSS_RE = /(\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|([{}])|(-?[A-Za-z_][\w-]*)|(-?\d*\.?\d+(?:px|pt|cm|mm|in|em|rem|ex|ch|vh|vw|vmin|vmax|deg|ms|s|%)?)|([^\s\w{}"'\/-]+|-|\/)|(\s+)/g;

function tokCss(code) {
  const out = [];
  let depth = 0, m;
  CSS_RE.lastIndex = 0;
  while ((m = CSS_RE.exec(code))) {
    const [full, comment, str, brace, word, num] = m;
    if (comment) out.push(["tok-com", full]);
    else if (str) out.push(["tok-str", full]);
    else if (brace) { depth += brace === "{" ? 1 : -1; if (depth < 0) depth = 0; out.push(["", full]); }
    else if (word) {
      const prop = depth > 0 && /^\s*:/.test(code.slice(CSS_RE.lastIndex));
      out.push([prop ? "tok-attr" : "", full]);
    } else if (num) out.push([depth > 0 ? "tok-num" : "", full]);
    else out.push(["", full]);
  }
  return out;
}

const SQL_KW = new Set(("SELECT FROM WHERE AND OR NOT IN LIKE BETWEEN ORDER BY GROUP HAVING INSERT INTO VALUES " +
  "UPDATE SET DELETE CREATE TABLE PRIMARY KEY FOREIGN REFERENCES UNIQUE AUTO_INCREMENT ENGINE INNODB CHECK AS " +
  "DISTINCT COUNT SUM AVG MIN MAX JOIN ON IF EXISTS NULL INT VARCHAR DATETIME").split(" "));
const SQL_RE = /(--[^\n]*)|(\/\*[\s\S]*?\*\/)|('(?:[^'\\\n]|\\.|'')*'|"(?:[^"\\\n]|\\.)*")|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)|([^\s\w'"\/-]+|-|\/)|(\s+)/g;

function tokSql(code) {
  const out = [];
  let m;
  SQL_RE.lastIndex = 0;
  while ((m = SQL_RE.exec(code))) {
    const [full, line, block, str, num, word] = m;
    if (line || block) out.push(["tok-com", full]);
    else if (str) out.push(["tok-str", full]);
    else if (num) out.push(["tok-num", full]);
    else if (word) out.push([SQL_KW.has(word.toUpperCase()) ? "tok-kw" : "", full]);
    else out.push(["", full]);
  }
  return out;
}

const JSON_RE = /("(?:[^"\\\n]|\\.)*")|(-?\b\d+\.?\d*(?:[eE][+-]?\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)|([^\s"\d]+|\d)|(\s+)/g;

function tokJson(code) {
  const out = [];
  let m;
  JSON_RE.lastIndex = 0;
  while ((m = JSON_RE.exec(code))) {
    const [full, str, num, lit] = m;
    if (str) out.push([/^\s*:/.test(code.slice(JSON_RE.lastIndex)) ? "tok-attr" : "tok-str", full]);
    else if (num) out.push(["tok-num", full]);
    else if (lit) out.push(["tok-kw", full]);
    else out.push(["", full]);
  }
  return out;
}

function tokHtmlTag(src, out) {
  // src is the whole tag text, e.g. `<p id="demo">` or `</p>`.
  const m = /^(<\/?)([A-Za-z][\w-]*)([\s\S]*?)(\/?>)$/.exec(src);
  if (!m) { out.push(["", src]); return null; }
  const [, open, name, attrs, close] = m;
  out.push(["", open], ["tok-tag", name]);
  let afterEq = false, a;
  const re = /("[^"]*"|'[^']*')|(=)|([^\s="']+)|(\s+)/g;
  while ((a = re.exec(attrs))) {
    const [full, quoted, eq, word] = a;
    if (quoted) { out.push(["tok-str", full]); afterEq = false; }
    else if (eq) { out.push(["", full]); afterEq = true; }
    else if (word) { out.push([afterEq ? "tok-str" : "tok-attr", full]); afterEq = false; }
    else out.push(["", full]);
  }
  out.push(["", close]);
  return open === "<" ? name.toLowerCase() : null;
}

function tokHtml(code) {
  const out = [];
  let i = 0;
  while (i < code.length) {
    if (code.startsWith("<!--", i)) {
      const end = code.indexOf("-->", i + 4);
      const stop = end < 0 ? code.length : end + 3;
      out.push(["tok-com", code.slice(i, stop)]);
      i = stop;
      continue;
    }
    const tag = /^<\/?[A-Za-z][\w-]*(?:"[^"]*"|'[^']*'|[^'">])*>/.exec(code.slice(i));
    if (tag) {
      const opened = tokHtmlTag(tag[0], out);
      i += tag[0].length;
      if (opened === "script" || opened === "style") {
        const closeRe = new RegExp(`</${opened}\\s*>`, "i");
        const rest = code.slice(i);
        const cm = closeRe.exec(rest);
        const body = cm ? rest.slice(0, cm.index) : rest;
        out.push(...(opened === "script" ? tokJs(body) : tokCss(body)));
        i += body.length;
      }
      continue;
    }
    // Plain text up to the next "<" that could start a tag or comment.
    let j = code.indexOf("<", i + 1);
    if (j < 0) j = code.length;
    out.push(["", code.slice(i, j)]);
    i = j;
  }
  return out;
}

const WEB_TOKENIZERS = { js: tokJs, html: tokHtml, css: tokCss, sql: tokSql, json: tokJson };
const WEB_ALIASES = { javascript: "js", node: "js", htm: "html" };

function webTokenizer(lang) {
  const key = WEB_ALIASES[lang] || lang;
  return WEB_TOKENIZERS[key] || null;
}

const span = (cls, text) => (cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text));

export function highlightWeb(lang, code) {
  const tok = webTokenizer(lang);
  return tok ? tok(code).map(([c, t]) => span(c, t)).join("") : esc(code);
}

export function highlight(lang, code) {
  if (lang === "pseudo" || lang === "pseudocode") return highlightPseudo(code);
  if (lang === "cpp" || lang === "c++" || lang === "c") return highlightCpp(code);
  if (lang === "r" || lang === "R") return highlightR(code);
  if (webTokenizer(lang)) return highlightWeb(lang, code);
  return esc(code);
}

/**
 * Highlight a whole program and return one HTML string per line. Web languages are tokenized
 * once over the full text (so a template literal or a <script> body keeps its colour on every
 * line it spans); the other languages are highlighted line by line, as before.
 */
export function highlightLines(lang, code) {
  const tok = webTokenizer(lang);
  if (!tok) return code.split("\n").map((l) => highlight(lang, l));
  const lines = [""];
  for (const [cls, text] of tok(code)) {
    const parts = text.split("\n");
    parts.forEach((p, k) => {
      if (k > 0) lines.push("");
      if (p) lines[lines.length - 1] += span(cls, p);
    });
  }
  return lines;
}
